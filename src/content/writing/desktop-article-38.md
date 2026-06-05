---
title: "我不知道的Promise的一些特点"
description: "1. 打印Promise会得到Promise{} 里面是Promise的三种状态，分别是pending （就绪），fulfilled（成功），rejected（失败） 2. 只有在构造..."
date: "2025-07-25"
tags: ["浏览器","JavaScript"]
draft: false
featured: false
---
1. 打印Promise会得到Promise{<pending>} 里面是Promise的三种状态，分别是pending （就绪），fulfilled（成功），rejected（失败）

2. 只有在构造函数里面resolve了，才会执行.then 方法，只有在构造函数里面reject了，才会执行.catch方法

3. 在事件循环中，微任务是否在这次循环中执行需要看Promise的状态

4. Promise的状态一经改变就不能再改变

```
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  })
```

5. catch不管链接到哪里都能捕获未曾捕获的错误，then和catch会返回一个新的Promise，状态为pending

```
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
  .then(res => {
    console.log("then1: ", res);
  })
  .then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })
  //结果：catch:error then3 undfined 
```

6. return 会返回一个新的Promise， return 2`会被包装成`resolve(2)，catch不走

```
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });
```

7. `.then` 或 `.catch` 返回的值不能是 promise 本身，否则会造成死循环。

```
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)
```

8. `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值透传。第一个.then和第二个.then 传的都不是函数，所以会发生值透传。

```
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```
