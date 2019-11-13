```
echo '{"total": 20}' | http POST http://172.28.175.23:30000/rserve/execute
{
    "status": "created",
    "task_id": "ed581738-2885-4264-a6ba-27d60eaaa94f"
}

export TASK_ID=35aff797-21fc-487e-b2d4-bae47bff8634

http http://172.28.175.23:30000/rserve/collect?task_id=$TASK_ID
{
    "current": 16,
    "state": "PROGRESS",
    "status": "Percent completion 80 ...",
    "total": 20
}


{
    "current": 20,
    "result": 20,
    "state": "SUCESS",
    "status": "Percent completion 100 ...",
    "total": 20
}
```




```
echo '{"total": 20}' | http POST http://172.28.175.23:30000/celery/execute
{
    "status": "created",
    "task_id": "ed581738-2885-4264-a6ba-27d60eaaa94f"
}

export TASK_ID=ed581738-2885-4264-a6ba-27d60eaaa94f

http http://172.28.175.23:30000/celery/collect?task_id=$TASK_ID
{
    "current": 9,
    "result": null,
    "status": "Percentage completion 45 ...",
    "total": 20
}


{
    "current": 20,
    "result": 20,
    "status": "Task completed!",
    "total": 20
}
```