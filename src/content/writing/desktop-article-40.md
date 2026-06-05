---
title: "手写系列之Promise"
description: "前言 各位小伙伴秋招已经开始了，大家八股准备的怎么样了呀？算法题刷了几遍了呀？今天，蘑菇头将带着大家来手写一道面试中常考的家伙 Promise。准备好瓜子小板凳，准备出发。 正文 Pr..."
date: "2025-07-17"
tags: ["算法","JavaScript"]
draft: false
featured: false
---
### 前言

各位小伙伴秋招已经开始了，大家八股准备的怎么样了呀？算法题刷了几遍了呀？今天，蘑菇头将带着大家来手写一道面试中常考的家伙---Promise。准备好瓜子小板凳，准备出发。

### 正文

Promise相信大家不会很陌生，我们经常用它来将异步代码转为同步代码，这里就不做过多介绍了。

```
new Promise((resolve, reject) => {
	setTimeOut(()=>{
		resolve(1);
	},1000)
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})
```

#### Promise

首先我们使用es6的语法定义一个MyPromise类，Promise他会接受一个回调，回调里面有两个参数分别是resolve和reject，我们用executor来表示这个回调，在构造函数里面触发这个回调，参数为resolve，reject。

```
class MyPromise{
    constructor(executor) {
        const resolve = () => {}
        const reject = () => {}
        executor(resolve,reject);
    }
}
```

Promise有三种状态，分别是pending，fulfilled，rejected。而且他们的状态一经更改就无法变更，并且.then触发之后.catch就不能触发，所以我们在构造函数里面定义一个状态state表示当前Promise的状态，默认是pending。

Promise的resolve函数和reject函数会接受一个参数用于.then或者.catch里面的形参，所以我们定义一个value表示这个参数。

Promise是当我们resolve之后.then里的回调才会触发，状态才会发生变更，而且Promise后面可以接多个.then或者.catch，所以我们需要一个数组将.then或者.catch里面回调函数存起来，一起调用，并且在resolve函数里面我们肯定要将state的状态修改，除此之外要将resolve的参数赋值给value存储起来以便后续使用。

```
class MyPromise{
    constructor(executor) {
        this.status = 'pending';//定义Promise状态
        this.value = undefined;//用于将resolve中的值存起来
        this.onResolvedCallbacks = [];//用来存.then中的回调
        this.onRejectedCallbacks = [];//用来存.catch中的回调
        const resolve = (val) => {
            if(this.status === 'pending') {
                this.status = 'resolved';
                this.value = val;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (val) => {
            if(this.status === 'pending') {
                this.status = 'rejected';
                this.value = val;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        executor(resolve,reject);
    }
}
```

#### Promise.then

我们只需要记住一点，.then里面的回调是在resolve中触发的。所以我们需要在.then里面收集这些回调函数，也就是push进我们的数组里面去。

Promise的.then它其实接收两个回调，一个是resolve之后才会触发的回调，一个是reject之后才会触发的回调，这是以前的写法，只不过后面官方将后面的那个回调拎出来写成了.catch。所以我们在then方法里面写上这两个回调。

并且规定then方法里面只能传回调函数，不允许传其他数据类型，所以在此之前做一些参数类型判断。

```
then(onFulfilled,onRejected) {
	if (onFulfilled && typeof onFulfilled !== 'function' || onRejected && typeof onRejected !== 'function') {
            throw new Error('then必须接受一个函数');
        }
	...
}
```

由于then方法后面还可以接.then或者.catch，所以它肯定return出来了一个新的Promise。

```
then(onFulfilled,onRejected) {
	if (onFulfilled && typeof onFulfilled !== 'function' || onRejected && typeof onRejected !== 'function') {
            throw new Error('then必须接受一个函数');
        }
        return new MyPromise((resolve,reject)=>{
            
        })
}
```

当我们的代码写成这样时，then中的回调就不需要放进数组中再到resolve中调用了。

```
new Promise((resolve,reject)=>{
	resolve(1)
}).then((res)=>{
	console.log(res)
})
```

也就是说当.then上一个哥们的Promise状态为Fulfilled时，我们直接调用这个回调函数。由于我们无法真实模拟异步，所以这里使用setTimeout实现。同理，第二个回调函数也一样，当.then上一哥们的Promise状态为rejected时，我们也是直接调用这个函数。

```
then(onResolved, onRejected ) {
        if (onResolved && typeof onResolved !== 'function' || onRejected && typeof onRejected !== 'function') {
            throw new Error('then必须接受一个函数');
        }
        return new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        const result = onResolved(this.value);//调用这个回调函数
                        resolve(result);
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            if(this.state = 'rejected'){
                setTimeout(()=>{
                    try {
                        const x = onRejected(this.value);
                        resolve(x);
                    } catch (error) {
                        reject(error);
                    }
                })
            }
        }
}
```

当上一个哥们状态为pending时，也就是正常的异步情况了。我们需要将回调函数放进我们准备好的数组中，然后在resolve中执行完这些回调函数。

```
then(onResolved, onRejected ) {
        if (onResolved && typeof onResolved !== 'function' || onRejected && typeof onRejected !== 'function') {
            throw new Error('then必须接受一个函数');
        }
        return new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        const result = onResolved(this.value);//调用这个回调函数
                        resolve(result);
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            if(this.state = 'rejected'){
                setTimeout(()=>{
                    try {
                        const x = onRejected(this.value);
                        resolve(x);
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            if(this.state === 'pending'){
                this.onFulfilledCallbacks.push((val)=>{
                    setTimeout(()=>{
                        onFulfilled(val);
                    })
                })
                this.onRejectedCallbacks.push((val)=>{
                    setTimeout(()=>{
                        onRejected(val);
                    })
                })
            }
        }
}
```

#### Promise.all

promise.all方法接收一个Promise数组，返回一个Promise。遍历这个数组的Promise状态，当全部状态为Fulfilled时，返回成功的Promise，在这个成功的Promise的.then方法里面可以拿到所有的Promise resolve出来的结果，只要有一个是rejected，返回rejected，那么我要怎么判断一个Promise的状态呢？我们可以利用.then方法知道，只要第一个回调触发了，说明是成功的状态。

```
static all(promises) { //promises是一个promise数组,当所有的promise都成功时,才成功,只要有一个失败,就失败
        return new MyPromise((resolve, reject) => {
            let count = 0;
            let res = [] //用一个数组装每个Promise resolve出来的结果
            promises.forEach(promise => {
                promise.then((val) => {
                    res[count] = val;
                    count++;
                    if (count === promises.length) {
                        resolve(res);
                    }
                }, () => {
                    reject();
                })
            });
        })
    }
```

#### Promise.race

和Promise.all类似，也是传入一个Promise数组，返回一个Promise与最先状态确定的Promise结果一致，所以很好写。

```
static race(promises){
	return new MyPromise((resolve,reject)=>{
		promises.forEach(promise=>{
			promise.then((val)=>{
				resolve(val);
			},()=>{
				reject();
			})
		})
	})
}
```
