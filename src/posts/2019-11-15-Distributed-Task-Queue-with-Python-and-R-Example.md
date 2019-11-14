---
title: 'Distributed Task Queue with Python and R Example'
category: 'Development'
tags: [FastAPI, Celery, Redis, Rserve, R, Python, Docker, 'Docker Compose', Kubernetes, Minikube]
created: '2019-11-01'
updated:
status: publish
description: ""
---

While I'm looking into [Apache Airflow](https://airflow.apache.org/), a workflow management tool, I thought it would be beneficial to get some understanding of how [Celery](http://www.celeryproject.org/) works. To do so, I built a simple web service that sends tasks to Celery workers and collects the results from them. [FastAPI](https://fastapi.tiangolo.com/) is used for developing the web service and [Redis](https://redis.io/) is used for the message broker and result backend. During the development, I thought it would be possible to implement similar functionality in R with [Rserve](https://www.rforge.net/Rserve/). Therefore a Rserve-based worker is added to the web service.

```bash
kubectl apply -f manifest

kubectl get po,rs,deploy,svc                                                                                                                                                              
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
