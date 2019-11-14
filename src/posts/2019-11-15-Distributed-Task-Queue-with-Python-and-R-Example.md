---
title: 'Distributed Task Queue with Python and R Example'
category: 'Development'
tags: [FastAPI, Celery, Redis, Rserve, R, Python, Docker, 'Docker Compose', Kubernetes, Minikube]
created: '2019-11-01'
updated:
status: publish
description: "In this post, it'll be illustrated how a web service is created using FastAPI where tasks are sent to multiple workers. The workers are built with Celery and Rserve. Redis is used as a message broker/result backend for Celery and a key-value store for Rserve. Demos can be run in both Docker Compose and Kubernetes."
---

While I'm looking into [Apache Airflow](https://airflow.apache.org/), a workflow management tool, I thought it would be beneficial to get some understanding of how [Celery](http://www.celeryproject.org/) works. To do so, I built a simple web service that sends tasks to Celery workers and collects the results from them. [FastAPI](https://fastapi.tiangolo.com/) is used for developing the web service and [Redis](https://redis.io/) is used for the message broker and result backend. During the development, I thought it would be possible to implement similar functionality in R with [Rserve](https://www.rforge.net/Rserve/). Therefore a Rserve worker is added as an example as well.

In this post, it'll be illustrated how a web service is created using FastAPI where tasks are sent to multiple workers. The workers are built with Celery and Rserve. Redis is used as a message broker/result backend for Celery and a key-value store for Rserve. Demos can be run in both [Docker Compose](https://docs.docker.com/compose/) and [Kubernetes](https://kubernetes.io/).

The following diagram shows how the apps work together and the source can be found in this [GitHub repo](https://github.com/jaehyeon-kim/k8s-job-queue).

![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/arch.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/arch.png)
</div>

## Celery Worker

The source of the Celery app and task is shown below. The same Redis DB is used as the message broker and result backend. The task is nothing but iterating to `total`, which is requested from the main web service. In each iteration, it updates its state (`bind=True`) and it is set that a task can be sent to its name (`name="long_task"`). The source of the Celery worker can be found in `/queue_celery/tasks.py`. 

```python

import os
import math
import time
from celery import Celery

redis_url = "redis://{0}:{1}/{2}".format(
    os.environ["REDIS_HOST"], os.environ["REDIS_PORT"], os.environ["REDIS_DB"]
)

app = Celery("tasks", backend=redis_url, broker=redis_url)
app.conf.update(broker_transport_options={"visibility_timeout": 3600})


@app.task(bind=True, name="long_task")
def long_task(self, total):
    message = ""
    for i in range(total):
        message = "Percentage completion {0} ...".format(math.ceil(i / total * 100))
        self.update_state(state="PROGRESS", meta={"current": i, "total": total, "status": message})
        time.sleep(1)
    return {"current": total, "total": total, "status": "Task completed!", "result": total}
```


## Rserve Worker

The [redux](https://github.com/richfitz/redux) package, Redis client for R, is used to set up the Rserve worker. The function `RR()` checks if a Redis DB is available and returns a `hiredis` object, which is an interface to Redis. The task (`long_task()`) is constructed to be similar to that of Celery. Note that, instead of updating its state, it explicitly updates the output to the Redis DB. In order for the task to be executed asynchronously, a handler function is created - `handle_long_task()`. It's called when the main web service executes a task and it sends the task to a (forked) process so that the request can be handled asynchronously. Finally the status of a task can be obtained by `get_task()` and it pulls it from the Redis DB. Note that, as a R list object is updated/retrieved, it's changed to/from binary. The source of the Rserve worker can be found in `/queue_rserve/tasks.R`.
```r

RR <- function(check_conn_only = FALSE) {
  redis_host <- Sys.getenv("REDIS_HOST", "localhost")
  redis_port <- Sys.getenv("REDIS_PORT", "6379")
  redis_db <- Sys.getenv("REDIS_DB", "1")
  info <- sprintf("host %s, port %s, db %s", redis_host, redis_port, redis_db)
  ## check if redis is available
  is_available = redis_available(host=redis_host, port=redis_port, db=redis_db)
  if (is_available) {
    flog.info(sprintf("Redis is available - %s", info))
  } else {
    flog.error(sprintf("Redis is not available - %s", info))
  }
  ## create an interface to redis
  if (!check_conn_only) {
    return(hiredis(host=redis_host, port=redis_port, db=redis_db))
  }
}


long_task <- function(task_id, total) {
  rr <- RR()
  for (i in seq.int(total)) {
    is_total <- i == max(seq.int(total))
    state <- if (is_total) "SUCESS" else "PROGRESS"
    msg <- sprintf("Percent completion %s ...", ceiling(i / total * 100))
    val <- list(state = state, current = i, total = total, status = msg)
    if (is_total) {
      val <- append(val, list(result = total))
    }
    flog.info(sprintf("task id: %s, message: %s", task_id, msg))
    rr$SET(task_id, object_to_bin(val))
    Sys.sleep(1)
  }
}


handle_long_task <- function(task_id, total) {
  flog.info(sprintf("task started, task_id - %s, total - %s", task_id, total))
  conn <- RS.connect()
  RS.eval(conn, library(redux))
  RS.eval(conn, library(futile.logger))
  RS.eval(conn, setwd("/home/app"))
  RS.eval(conn, source("./tasks.R"))
  RS.assign(conn, task_id)
  RS.assign(conn, total)
  RS.eval(conn, long_task(task_id, total), wait=FALSE, lazy=TRUE)
  RS.close(conn)
  flog.info(sprintf("task executed, task_id - %s, total - %s", task_id, total))
  list(task_id = task_id, status = "created")
}

get_task <- function(task_id) {
  rr <- RR()
  val <- bin_to_object(rr$GET(task_id))
  flog.info(sprintf("task id - %s", task_id))
  flog.info(val)
  val
}
```


## Main Web Service

The main service has 2 methods for each of the workers - *POST* for executing a task and *GET* for collecting its status. To execute a task, a value named *total* is required in request body. As soon as a task is sent or executed, it returns the task ID and status value - `ExecuteResp`. A task's status can be obtained by requesting the associating *collect* method where its ID is added as query string. The response is defined by `ResultResp`. The source of the Rserve worker can be found in `/main.py`.

```python

import os
import json
import httpx
from uuid import uuid4
from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel, Schema

from queue_celery.tasks import app as celery_app, long_task


def set_rserve_url(fname):
    return "http://{0}:{1}/{2}".format(
        os.getenv("RSERVE_HOST", "localhost"), os.getenv("RSERVE_PORT", "8000"), fname
    )


app = FastAPI(title="FastAPI Job Queue Example", version="0.0.1")


class ExecuteResp(BaseModel):
    task_id: str
    status: str


class ResultResp(BaseModel):
    current: int
    total: int
    status: str
    result: int = None


class ErrorResp(BaseModel):
    detail: str


@app.post("/celery/execute", response_model=ExecuteResp, status_code=202, tags=["celery"])
async def execute_celery_task(total: int = Body(..., min=1, max=50, embed=True)):
    task = celery_app.send_task("long_task", args=[total])
    return {"task_id": task.id, "status": "created"}


@app.get(
    "/celery/collect",
    response_model=ResultResp,
    responses={500: {"model": ErrorResp}},
    tags=["celery"],
)
async def collect_celery_result(task_id: str):
    resp = long_task.AsyncResult(task_id)
    if resp.status == "FAILURE":
        raise HTTPException(status_code=500, detail="Fails to collect result")
    return resp.result


@app.post("/rserve/execute", response_model=ExecuteResp, status_code=202, tags=["rserve"])
async def execute_rserve_task(total: int = Body(..., min=1, max=50, embed=True)):
    jsn = json.dumps({"task_id": str(uuid4()), "total": total})
    async with httpx.AsyncClient() as client:
        r = await client.post(set_rserve_url("handle_long_task"), json=jsn)
        return r.json()


@app.get(
    "/rserve/collect",
    response_model=ResultResp,
    responses={500: {"model": ErrorResp}},
    tags=["rserve"],
)
async def collect_rserve_task(task_id: str):
    jsn = json.dumps({"task_id": task_id})
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(set_rserve_url("get_task"), json=jsn)
            return {k: v for k, v in r.json().items() if k != "state"}
        except Exception:
            raise HTTPException(status_code=500, detail="Fails to collect result")
```

## Docker Compose

The apps can be started with Docker Compose as following.

```bash

$ git clone https://github.com/jaehyeon-kim/k8s-job-queue.git
$ cd k8s-job-queue
$ docker-compose up -d
```

The swagger document of the main web service can be visited via `http://localhost:9000/docs` or `http://<vm-ip-address>:9000` if it's started in a VM.

![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-01.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-01.png)
</div>

A task can be executed by clicking the *Try it out* button and add value to the request body.

![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-02.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-02.png)
</div>

The status of a task can be checked by adding its ID to query string.

![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-03.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-15-Distributed-Task-Queue-with-Python-and-R-Example/swagger-03.png)
</div>

## Kubernetes

```bash

$ kubectl apply -f manifest

$ kubectl get po,rs,deploy,svc
NAME                                     READY   STATUS    RESTARTS   AGE
pod/celery-deployment-674d8fb968-2x97k   1/1     Running   0          25s
pod/celery-deployment-674d8fb968-44lw4   1/1     Running   0          25s
pod/main-deployment-79cf8fc5df-45w4p     1/1     Running   0          25s
pod/main-deployment-79cf8fc5df-hkz6r     1/1     Running   0          25s
pod/redis-deployment-5ff8646968-hcsbk    1/1     Running   0          25s
pod/rserve-deployment-59dfbd955-db4v9    1/1     Running   0          25s
pod/rserve-deployment-59dfbd955-fxfxn    1/1     Running   0          25s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/celery-deployment-674d8fb968   2         2         2       25s
replicaset.apps/main-deployment-79cf8fc5df     2         2         2       25s
replicaset.apps/redis-deployment-5ff8646968    1         1         1       25s
replicaset.apps/rserve-deployment-59dfbd955    2         2         2       25s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/celery-deployment   2/2     2            2           25s
deployment.apps/main-deployment     2/2     2            2           25s
deployment.apps/redis-deployment    1/1     1            1           25s
deployment.apps/rserve-deployment   2/2     2            2           25s

NAME                     TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
service/main-service     NodePort    10.98.60.194     <none>        80:30000/TCP   25s
service/redis-service    ClusterIP   10.99.52.18      <none>        6379/TCP       25s
service/rserve-service   ClusterIP   10.105.249.199   <none>        8000/TCP       25s
```

```bash

$ echo '{"total": 30}' | http POST http://172.28.175.23:30000/celery/execute
{
    "status": "created",
    "task_id": "87ae7a42-1ec0-4848-bf30-2f68175b38db"
}

$ export TASK_ID=87ae7a42-1ec0-4848-bf30-2f68175b38db
$ http http://172.28.175.23:30000/celery/collect?task_id=$TASK_ID
{
    "current": 18,
    "result": null,
    "status": "Percentage completion 60 ...",
    "total": 30
}

$ http http://172.28.175.23:30000/celery/collect?task_id=$TASK_ID
{
    "current": 30,
    "result": 30,
    "status": "Task completed!",
    "total": 30
}
```

```bash

$ echo '{"total": 30}' | http POST http://172.28.175.23:30000/rserve/execute
{
    "status": "created",
    "task_id": "f5d46986-1e89-4322-9d4e-7c1da6454534"
}

$ export TASK_ID=f5d46986-1e89-4322-9d4e-7c1da6454534
$ http http://172.28.175.23:30000/rserve/collect?task_id=$TASK_ID
{
    "current": 16,
    "result": null,
    "status": "Percent completion 54 ...",
    "total": 30
}

$ http http://172.28.175.23:30000/rserve/collect?task_id=$TASK_ID
{
    "current": 30,
    "result": 30,
    "status": "Percent completion 100 ...",
    "total": 30
}
```
