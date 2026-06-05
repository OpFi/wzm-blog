---
title: "事件循环机制"
description: "前言 今天我们聊聊JavaScript这门语言中又一复杂而又常见的机制 事件循环机制。他常常出现在我们的面试题中，真是让我们又爱又恨，摸不着头脑，到底是先打印它还是先打印它呢？今天蘑菇..."
date: "2025-10-25"
tags: ["后端","性能优化"]
draft: false
featured: false
---
### 前言

今天我们聊聊JavaScript这门语言中又一复杂而又常见的机制-事件循环机制。他常常出现在我们的面试题中，真是让我们又爱又恨，摸不着头脑，到底是先打印它还是先打印它呢？今天蘑菇头就带大家好好说清楚JavaScript中的又一座大山----事件循环机制。

要想清楚了解事件循环机制，我们首先需要知道几个概念。

### 同步代码和异步代码

#### 同步代码

同步代码是指按照代码的书写顺序依次执行的代码。每一行代码都要等到前一行代码执行完毕后才开始执行。同步代码会阻塞后续代码的执行，直到当前任务完成，如下代码将会严格按照代码书写顺序执行，简单且不严格的来说就是在v8眼里不耗时的代码。

```
console.log('1');
console.log('2');
console.log('3');
```

#### 异步代码

异步代码允许程序在执行某些操作时不等待其完成，将它挂起，然后继续执行后续代码。异步代码不会阻塞后续代码的执行，因此可以提高程序的响应速度和性能，特别是在处理I/O操作（如文件读取、网络请求）时，常见的有Promise和setTimeout等等，简单来说就是需要耗时执行的代码。如此时的setTimeout就是异步代码：

```
console.log('1');
setTimeout(() => {
    console.log('2');
}, 1000);
console.log('3');
//打印结果：1 3 2
```

在异步代码中我们又分为了宏任务和微任务

**宏任务**：宏任务是指在事件循环的每一轮中执行的主要任务。每一次事件循环的开始就是执行一个宏任务。常见的宏任务包括：

- script
- setTimeout
- setInterval
- setImmediate 
- I/O 
- UI-rendering(页面渲染)

**微任务**：微任务是在当前宏任务执行结束后、下一次宏任务执行之前执行的任务。微任务通常用来处理需要尽快执行的回调。常见的微任务包括：

- Promise.then
- Promise.catch
- Promise.finally
- MutationObserver
- queueMicrotask

看到这里是不是觉得一头雾水，宏任务和微任务解释了跟没解释一样。不急，我们首先只要知道这么些个方法属于什么任务就行。接下来迎出我们的主角，事件循环机制。

### 事件循环机制

#### 概念

事件循环机制（Event Loop）是JavaScript和Node.js执行环境中的一个重要机制，它使得单线程的JavaScript能够执行异步操作，并在处理I/O操作和事件驱动编程时保持高性能。事件循环负责协调任务的执行顺序，处理同步代码和异步代码之间的调度。通俗的来讲就是用一种机制来处理这同步代码和异步代码两种代码之间的执行顺序的。

#### 主要组成部分

**宏任务队列**：主要存储一些宏任务

**微任务队列**：主要存储一些微任务

#### 执行过程

1. 执行同步代码（宏任务 script）
2. 同步执行完毕后，检查是否有异步需要执行(检查两个异步队列，微任务队列和宏任务队列)
3. 执行所有的微任务
4. 微任务执行完毕后，如果有需要就渲染页面
5. 执行异步宏任务，也就是开启下一次事件循环

第一步也就是第五步的开始，这样就形成了一个循环，所以就叫事件循环机制。光看文字描述未免略显抽象乏味，我们用几个面试示例来加深一下印象。

#### 示例一

```
console.log(1);
new Promise((resolve,rejext)=>{
    console.log(2);
    resolve()
})
.then(()=>{
    console.log(3);
})
.then(()=>{
    console.log(4);
})

setTimeout(()=>{
    console.log(5);
})
console.log(6);
//执行结果：1 2 6 3 4 5
```

我们按照事件循环机制的执行过程来走一遍。代码一行一行往下走，首先执行同步代码，打印1，来到`new Promise`中，他是同步代码打印2，我们上面说的是`Promise.then()`才是异步微任务奥，然后是`.then`，他会进入微任务队列中等待执行，然后是下一个`.then`进入微任务队列，然后setTimeout是异步代码中的宏任务，他会进入宏任务队列中等待执行，然后打印6，这才执行完事件循环机制中的第一步。然后第二步，检查两个任务队列，先执行微任务队列，打印3和4，第四步显然这里没有页面渲染的代码，第五步执行宏任务队列打印5，这一步将会开启一次新的事件循环机制。

示例二

```
console.log(1);//1
new Promise((resolve, reject) => {
    console.log(2);//2
    resolve()
})
    .then(() => {
        console.log(3);//4
        setTimeout(() => {
            console.log(4);//6
        }, 0)
    })
setTimeout(() => {
    console.log(5);//5
    setTimeout(() => {
        console.log(6);//7
    }, 0)
}, 0)
console.log(7);//3
//打印:1 2 7 3 5 4 6
```

怎么样是不是发现事件循环机制也不过如此，接下来我们上一个究极版本的面试题。

示例三

```
console.log('script start');//1
async function async1() {
  await async2() // await会将后续的代码async1 end阻塞进微任务队列
  console.log('async1 end');//5
}
async function async2() {
  console.log('async2 end');//2
}
async1()
setTimeout(function() {
  console.log('setTimeout');//8
}, 0)
new Promise(function(resolve, reject) {
  console.log('promise');//3
  resolve()
})
.then(() => {
  console.log('then1');//6
})
.then(() => {
  console.log('then2');//7
})
console.log('script end');//4
//打印结果：
//script start
//async2 end
//promise   
//script end
//async1 end
//then1     
//then2
//setTimeout
```

### 总结

深刻了解事件循环机制有利于我们知道v8执行代码的过程，这也是面试中必考的题目。主要需要记住事件循环机制的执行过程和那些函数属于同步代码和异步代码，异步代码中又有哪些属于宏任务和微任务，这样我们碰到类似的面试题也就能迎刃而解了。
