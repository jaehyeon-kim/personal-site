---
title: 'Dynamic Routing and Centralized Auth with Traefik, Python and R Example'
category: 'Microservices'
tags: [Traefik, FastAPI, Rserve, R, Python, Docker, 'Docker Compose']
created: '2019-11-29'
updated:
status: publish
description: ""
---

[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) in [Kubernetes](https://kubernetes.io/) exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. By setting rules, it routes requests to appropriate services (precisely requests are sent to individual [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) by [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)). Rules can be set up dynamically and I find it's more efficient compared to traditional [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy).

[Traefik](https://docs.traefik.io/v1.7/) is a modern HTTP reverse proxy and load balancer and it allows dynamic routing configuration as well. Also it supports multiple providers - Docker, Kubernetes, AWS ECS, AWS DynamoDB to name a few. With Docker, routes configuration can be done simply with a set of labels. In this post, it'll be demonstrated how _path-based_ routing can be set up by Traefik with Docker. Also a centralized authentication will be illustrated with the [Forward Authentication](https://docs.traefik.io/v1.7/configuration/entrypoints/#forward-authentication) feature of Traefik.

## How Traefik works

Below shows an illustration of internal architecture of Traefik.

![](/static/2019-11-29-Dynamic-Routing-and-Centralized-Auth-with-Traefik-Python-and-R-Example/traefik-overview.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-29-Dynamic-Routing-and-Centralized-Auth-with-Traefik-Python-and-R-Example/traefik-overview.png)
</div>

The [Traefik website](https://docs.traefik.io/v1.7/basics/) explains workflow of requests as following.

> * Incoming requests end on [entrypoints](https://docs.traefik.io/v1.7/basics/#entrypoints), as the name suggests, they are the network entry points into Traefik (listening port, SSL, traffic redirection...).
> * Traffic is then forwarded to a matching [frontend](https://docs.traefik.io/v1.7/basics/#frontends). A frontend defines routes from entrypoints to [backends](https://docs.traefik.io/v1.7/basics/#backends). Routes are created using requests fields (Host, Path, Headers...) and can match or not a request.
> * The frontend will then send the request to a backend. A backend can be composed by one or more [servers](https://docs.traefik.io/v1.7/basics/#servers), and by a load-balancing strategy.
> * Finally, the server will forward the request to the corresponding microservice in the private network.

In this example, a HTTP _entrypoint_ is setup on port 80. Requests through it are forwarded to 2 web services by the following _frontend_ rules.

* Host is `k8s-traefik.info` and path is `/pybackend`
* Host is `k8s-traefik.info` and path is `/rbackend`

As the paths of the rules suggest, requests to `/pybackend` are sent to a _backend_ service, created with [FastAPI](https://fastapi.tiangolo.com/features/). If the other rule is met, requests are sent to the [Rserve](https://www.rforge.net/Rserve/) _backend_ service. Note that only requests from authenticated users are fowarded to relevant _backends_ and it is configured in _frontend_ rules as well. Below shows how authentication is handled.

![](/static/2019-11-29-Dynamic-Routing-and-Centralized-Auth-with-Traefik-Python-and-R-Example/traefik-forward-auth.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-29-Dynamic-Routing-and-Centralized-Auth-with-Traefik-Python-and-R-Example/traefik-forward-auth.png)
</div>

## Traefik setup

Here is the traefik service defined in the compose file of this example - the full version can be found [here](https://github.com/jaehyeon-kim/k8s-traefik/blob/master/docker-compose.yaml).

```yaml
version: "3.7"
services:
  traefik:
    image: "traefik:v1.7.19"
    networks:
      - traefik-net
    command: >
      --docker
      --docker.domain=k8s-traefik.info
      --docker.exposedByDefault=false
      --docker.network=traefik-net
      --defaultentrypoints=http
      --entrypoints="Name:http Address::80"
      --api.dashboard
    ports:
      - 80:80
      - 8080:8080
    labels:
      - "traefik.frontend.rule=Host:k8s-traefik.info"
      - "traefik.port=8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
...
networks:
  traefik-net:
    name: traefik-network
```

It enables the Docker provider (`--docker`) and a custom domain is setup - more on this later. A dedicated network is created for it and other services (`trafic-net`). A single _entrypoint_ is enabled and it's set as default. Monitoring dashboard is also enabled (`--api.dashboard`) and it's set to be served on port 8080.

Although it's optional, a custom domain name is setup, which can be accessible locally - it'd be benefical to test HTTPS with self-signed certificates if necessary. To do that

**Windows**

```bash

```

In order to access to the service with the custom host name (`k8s-traefik.info`), 