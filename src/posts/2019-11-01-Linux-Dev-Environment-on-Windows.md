---
title: 'Linux Dev Environment on Windows'
category: 'Development'
tags: [VSCode, WSL, Remote SSH, Docker, Docker Compose, Kubernetes, Minikube]
created: '2019-11-01'
updated:
status: publish
description: "description"
---

A large portion of my development work is in relation to Linux containers. Having Windows computers at home and work, I used to use Linux VMs on VirtualBox or VMWare. It's not a bad option but requires a lot of resources. Recently, after my home computer was updated, I was not able to start my existing VMs anymore. It was quite annoying and I had to find another way asap. A while ago, I played with [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about) and it was alright. Also [Visual Studio Code (VSCode)](https://code.visualstudio.com/), _my favourite editor_, now supports remote development. Therefore I thought I would be able to create a good new development environment with WSL and [Docker for Windows](https://docs.docker.com/docker-for-windows/install/). However it was until I tried a complicated app with [Docker Compose](https://docs.docker.com/compose/) that Docker for Windows has a number of issues especially when containers are started by Docker Compose (in WSL). I didn't like to spend too much time on fixing those issues as I concerned those might not be the only ones. Then I decided to install a Linux VM on [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/). Luckly VSCode also supports remote VM via SSH.


## Install Windows Subsystem for Linux (WSL)

## Setup Remote WSL

## Install Linux Virtual Machine on Hyper-V

## Setup Remote SSH

## Install ConEmu

## Install Minikube

## Rserve Sidecar Example

![](/static/2019-11-01-Linux-Dev-Environment-on-Windows/wsl-setup-01.png)
<div class="cover" style="margin-top: 0px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
![](/static/2019-11-01-Linux-Dev-Environment-on-Windows/wsl-setup-01.png)
</div>