---
title: 'Cronicle Multi Server Setup'
category: 'Development'
tags: [Cronicle, Docker, Nginx]
created: '2019-07-19'
updated:
status: publish
description: "Accroding to the project site, Cronicle is a multi-server task scheduler and runner, with a web based front-end UI. It handles both scheduled, repeating and on-demand jobs, targeting any number of slave servers, with real-time stats and live log viewer."
---

Accroding to the [project GitHub repository](https://github.com/jhuckaby/Cronicle), 

> Cronicle is a multi-server task scheduler and runner, with a web based front-end UI. It handles both scheduled, repeating and on-demand jobs, targeting any number of slave servers, with real-time stats and live log viewer.

By default, Cronicle is configured to launch a single master server - task scheduling is controlled by the master server. Therefore, for high availability, it is important that another server takes the role of master when the existing master server fails.

In this post, multi-server configuration of Cronicle will be demonstrated with Docker and Nginx as load balancer. Specifically a single master and backup server will be set up and they will be served behind a load balancer - backup server is a slave server but take the role of master when the master is not avaialble. The source can be found in this [GitHub repo](https://github.com/jaehyeon-kim/play-cronicle).

## Build Cronicle Docker Image

There doesn't seem to be an official Docker image for Cronicle. I just installed it from _python:3.6_ image. The docker file can be found as following.

```docker

FROM python:3.6

ARG CRONICLE_VERSION=v0.8.28
ENV CRONICLE_VERSION=${CRONICLE_VERSION}

# Node
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn

# Cronicle
RUN curl -s "https://raw.githubusercontent.com/jhuckaby/Cronicle/${CRONICLE_VERSION}/bin/install.js" | node \
    && cd /opt/cronicle \
    && npm install aws-sdk

EXPOSE 3012
EXPOSE 3014

ENTRYPOINT ["/docker-entrypoint.sh"]
```

As Cronicle is written in Node.js, it should be installed as well. _aws-sdk_ is not required strictly but it is added to test S3 integration later. Port 3012 is the default web port of Cronicle and 3014 is used for server auto-discovery via UDP broadcast - it may not be necessary.

_docker-entrypoint.sh_ is used to start a Cronicle server. For master, one more step is necessary, which is initializing the storage system. An environment variable (_IS_MASTER_) will be used to control storage initialization.

```sh

#!/bin/bash

set -e

if [ "$IS_MASTER" = "0" ]
then
  echo "Running SLAVE server"
else 
  echo "Running MASTER server"
  /opt/cronicle/bin/control.sh setup
fi

/opt/cronicle/bin/control.sh start

while true; 
do 
  sleep 30; 
  /opt/cronicle/bin/control.sh status
done
```

*cronicle-base* docker image is built using the docker file as following.

```sh

docker build -t=cronicle-base .
```

## Load Balancer Setup

Nginx is used as a load balancer. The [config file](https://github.com/jaehyeon-kim/play-cronicle/blob/master/loadbalancer/nginx.conf) can be found as following. It listens port 8080 and pass a request to _cronicle1:3012_ or _cronicle2:3012_ server.

```sh

events { worker_connections 1024; }
 
http {
    upstream cronicles {
        server cronicle1:3012;
        server cronicle2:3012;
    }
 
    server {
        listen 8080;
 
        location / {
            proxy_pass         http://cronicles;
            proxy_set_header   Host $host;
        }
    }
}
```

In order for Cronicle servers can be served behind the load balancer, the following changes are necessary (complete config file can be found [here](https://github.com/jaehyeon-kim/play-cronicle/blob/master/sample_conf/config.json).) 

```json

{
	"base_app_url": "http://loadbalancer:8080",

    ...
	
	"web_direct_connect": true,

    ...	
}
```

First, [**base_app_url**](https://github.com/jhuckaby/Cronicle#base_app_url) should be changed to the load balancer URL instead of an individual server's URL. Secondly [**web_direct_connect**](https://github.com/jhuckaby/Cronicle#web_direct_connect) should be changed to _true_. According to the project repository

> If you set this parameter to true, then the Cronicle web application will connect directly to your individual Cronicle servers. This is more for multi-server configurations, especially when running behind a load balancer with multiple backup servers. The Web UI must always connect to the master server, so if you have multiple backup servers, it needs a direct connection.

## Launch Servers

Docke Compose is used to launch 2 Cronicle servers (master and backup) and a load balancer. Note that the service _cronicle1_ is the master while _cronicle2_ is the backup server. Both servers should have the same configuration file (_config.json_). Also, as the backup server will take the role of master, it should have access to the same data - _./backend/cronicle/data_ is mapped to both the servers. (Cronicle supports S3 or Couchbase as well.)

```yaml

version: '3.2'

services:
  loadbalancer:
    container_name: loadbalancer
    hostname: loadbalancer
    image: nginx    
    volumes:
      - ./loadbalancer/nginx.conf:/etc/nginx/nginx.conf
    tty: true
    links:
      - cronicle1
    ports:
      - 8080:8080
  cronicle1:
    container_name: cronicle1
    hostname: cronicle1
    image: cronicle-base
    #restart: always
    volumes:
      - ./sample_conf/config.json:/opt/cronicle/conf/config.json
      - ./sample_conf/emails:/opt/cronicle/conf/emails
      - ./docker-entrypoint.sh:/docker-entrypoint.sh
      - ./backend/cronicle/data:/opt/cronicle/data
    entrypoint: /docker-entrypoint.sh
    environment:
      IS_MASTER: "1"
  cronicle2:
    container_name: cronicle2
    hostname: cronicle2
    image: cronicle-base
    #restart: always
    volumes:
      - ./sample_conf/config.json:/opt/cronicle/conf/config.json
      - ./sample_conf/emails:/opt/cronicle/conf/emails
      - ./docker-entrypoint.sh:/docker-entrypoint.sh
      - ./backend/cronicle/data:/opt/cronicle/data
    entrypoint: /docker-entrypoint.sh
    environment:
      IS_MASTER: "0"
```

It can be started as following.

```sh

docker-compose up -d
```

## Add Backup Server

Once started, Cronicle web app will be accessible at *http://localhost:8080* and it's possible to log in as the admin user - username and password are all _admin_.

In `Admin > Servers`, it's possible see the 2 Cronicle servers as following.

<div class="cover">
![](/static/2019-07-19-Cronicle-Multi-Server-Setup/add-server-01.png)
</div>

## Create Event

## Remove Master Server
