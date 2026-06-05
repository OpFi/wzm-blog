---
title: "前端性能优化-控制并发"
description: "前言 性能优化这一方面是前端常考的一个点，比如你现在有100个请求需要发送给后端，一次性全部发送必然造成服务器的压力很大，所以现在需要你控制并发数量，每次只发送5个请求。这个场景下，你..."
date: "2025-09-19"
tags: ["后端","性能优化"]
draft: false
featured: false
---
### 前言

性能优化这一方面是前端常考的一个点，比如你现在有100个请求需要发送给后端，一次性全部发送必然造成服务器的压力很大，所以现在需要你控制并发数量，每次只发送5个请求。这个场景下，你会怎么实现？

### 正文

为了模拟发送异步请求这一步，我们定义一个timeout函数来实现，传入一个时间表示请求耗时。

```
function timeout(time){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve();
		},time)
	})
}
```

我们定义一个控制并发的类来专门来处理控制并发这么一个功能，构造函数可以接受一个参数来表示每次的并发数量。里面有一个任务数组用来存储异步任务，还有一个变量表示正在运行的任务。

```
class SuperTask{
	constructor(paralleCount = 2){
		this.paralleCount = paralleCount;//并发量
        this.tasks = []
        this.runningCount = 0;//正在运行的任务量
	}
}
```

我希望这么使用我的控制并发类，所以我需要再里面定义一个add方法来添加异步任务，这个add会返回一个Promise。

```
const superTask = new SuperTask();
superTask.add(()=>timeout(time))
    .then(()=>console.log(`任务完成`))
```

```
add(task){//添加任务
        return new Promise( (resolve,reject)=>{
            this.tasks.push({//在数组里面添加异步任务
                task,resolve,reject
            })
        this._run();//这里的this指向的是实例对象
        })
    }
```

当add方法接收到异步任务之后会将任务放进任务队列中，关键在于如何去触发这些任务并且控制并发数量为5呢？这个run方法至关重要。

```
_run(){ //依次运行任务
        while(this.runningCount<this.paralleCount&&this.tasks.length){
            const {task,resolve,reject} = this.tasks.shift();
            this.runningCount++;
            task().then(resolve,reject).finally(()=>{ //不管任务成功还是失败，任务执行完毕
                this.runningCount--;
                this._run();
            })
        }
    }
```

我们通过通过判断任务数组中有任务并且当前正在运行的任务数小于并发数时，将任务队列的任务取出并且运行他，不管任务成功还是失败，任务执行完毕都要将当前并发数减一，并且递归调用run方法。这样我们就实现了控制并发的这么一个效果。

测试一下。

```
const superTask = new SuperTask();
function addTask(time,name){
    superTask.add(()=>timeout(time))
    .then(()=>console.log(`任务${name}完成`))
}
addTask(10000,1)
addTask(2000,2)
addTask(1000,3)
addTask(1000,4)
addTask(3000,5)
addTask(2000,6)
addTask(4000,7)
addTask(2000,8)
```

![](/images/articles/Snipaste_2024-09-06_19-58-43.png)

可以看到成功实现。
