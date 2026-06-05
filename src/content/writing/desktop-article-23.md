---
title: "前端必学系列之Promise"
description: "前端必学之Promise 前言 今天我们聊聊前端必学，面试必考的Promise。 异步 在聊Promise之前，我们先聊聊什么是异步。异步是指在程序执行过程中，某个操作不会阻塞后续代码..."
date: "2025-09-23"
tags: ["后端","性能优化"]
draft: false
featured: false
---
前端必学之Promise

前言

今天我们聊聊前端必学，面试必考的Promise。

异步

在聊Promise之前，我们先聊聊什么是异步。异步是指在程序执行过程中，某个操作不会阻塞后续代码的执行，而是在后台进行，当该操作完成后通过某种方式（如回调函数、事件等）通知程序其他部分。在异步操作中，程序无需等待这个操作完成就可以继续执行其他任务。常见的异步操作包括网络请求、文件读取和写入、定时器等。我们用定时器来模拟一个异步情景出来。

```
function foo(){
    setTimeout(()=>{
        console.log('wzm');
    },1000)
}
function bar(){
    console.log('xxj');
}

foo()
bar()
```

可以看到先打印的xxj，一秒之后再打印的wzm。分析一下，代码先执行foo函数，然后执行bar，但是是bar先打印，而不是等foo执行完毕，再打印bar，这种情况就是异步，foo也叫异步代码，bar叫同步代码。异步可以提高程序的效率和响应性，避免因为某个耗时操作而导致整个程序长时间处于等待状态，从而可以更好地利用系统资源和提升用户体验。

Promise

promise是前端中常用于处理异步的一种操作。上面提到异步常用于网络请求中，由于发送请求需要耗时，当一个变量存在对请求返回出来的数据引用但是还没有拿到时，由于异步的特性，代码会继续执行，那么这个变量就会为空，所以会报错。我们用定时器来模拟发送请求。

```
let data = null;
function a(){
    setTimeout(()=>{//模拟异步发送请求
        data = {
            name:'wzm'
        }
    },1000)
}
function b(){
    console.log(data.name);//Cannot read properties of null (reading 'name')
    at b
}
a();
b();
```

在以前通常的解决办法就是将b函数放在a函数里面调用，这个叫代码回调。这样确实可以解决问题，但是带来了一个新的问题，当大量使用回调函数来处理异步操作，会导致代码中出现多层嵌套的回调函数，使得代码的可读性和可维护性变差，这个就叫回调地狱，而Promise就是用来解决以上问题的。他有三种状态，分别是`pending`（进行中）、`fulfilled`（已成功）、`rejected`（已失败）。

使用方法

非常简单，通常使用 `new Promise()` 来创建，在构造函数中接收一个执行函数，该执行函数包含两个参数，分别是用于将 `Promise` 状态改为成功的 `resolve` 函数和改为失败的 `reject` 函数。然后可以通过 `then` 和 `catch` 来处理相应的结果。`then()`：用于添加当 `Promise` 成功时执行的回调函数。`catch()`：用于添加当 `Promise` 失败时执行的回调函数。

```
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve('成功的值');//这里通常放的是请求到的数据
  } else {
    reject('失败的原因');
  }
});
promise.then((resolve) => {
    console.log(resolve);//成功的值
}).catch((reject) => {
    console.log(reject);//失败的原因
})
```


Promise的一些方法

Promise.all()

接收一个 Promise 数组。当所有这些 Promise 都成功时，它返回一个新的 Promise，新 Promise 成功时的值是所有这些 Promise 成功值组成的数组；只要有一个 Promise 失败，整个 Promise.all 就会立即失败。

```
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test 1");
  }, 1000);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("tset 2");
  }, 2000);
});

Promise.all([promise1, promise2])
  .then(res => {
    console.log(res); // [ 'test 1', 'tset 2' ]
  })
  .catch(error => {
    console.error(error); // 处理任何一个Promise失败的情况
  });
```

Promise.race()

接收一个 Promise 数组。它返回的 Promise 会在这些数组中的任意一个 Promise 状态确定（无论是成功还是失败）时就立即确定，其结果就是那个第一个确定状态的 Promise 的结果。状态确定指的是`fulfilled`（已成功），也就是说我们可以用它做代码优化，当我们可以从a，b接口中都能获取数据时，可以用这个方法判断a接口和b接口谁快，谁快用哪个。

```
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test 1");
  }, 2000);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test 2");
  }, 1000);
});

Promise.race([promise1, promise2])
  .then(res => {
    console.log(res); // 第一个完成的Promise的结果
  })
  .catch(error => {
    console.error(error); // 处理第一个失败的Promise的情况
  });

```

总结

今天我们聊了什么是Promise，他是用于处理异步的一种操作，主要可以更清晰地管理和组织异步代码的流程，使代码结构更清晰，逻辑更易于理解。我们还聊了Promise 的使用方法以及其身上的两个方法，分别是 race 和 all 。
