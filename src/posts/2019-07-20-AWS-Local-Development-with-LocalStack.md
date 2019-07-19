---
title: 'AWS Local Development with LocalStack'
category: 'Development'
tags: [LocalStack, AWS, Docker, Lambda, S3, SQS, Python, Flask, Flask-RestPlus]
created: '2019-07-20'
updated:
status: publish
description: "Cronicle is a multi-server task scheduler and runner, with a web based front-end UI. It handles both scheduled, repeating and on-demand jobs, targeting any number of slave servers, with real-time stats and live log viewer. In this post, multi-server configuration of Cronicle will be demonstrated with Docker and Nginx as load balancer. Specifically a single master and backup server will be set up and they will be served behind a load balancer - backup server is a slave server that can take the role of master when the master is not avaialble. "
---

[LocalStack](https://github.com/localstack/localstack) provides an easy-to-use test/mocking framework for developing AWS applications.