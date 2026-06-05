---
title: "迭代器"
description: "前言 你听说的过迭代器吗？如果没有听过，那么for of这个名头肯定听过，那么他们之间有什么千丝万缕的联系呢？欢迎收听你的月亮我的心，来听蘑菇头来好好道一道迭代器这个属性。 迭代器 在..."
date: "2025-05-14"
tags: ["JavaScript"]
draft: false
featured: false
---
前言

你听说的过迭代器吗？如果没有听过，那么for of这个名头肯定听过，那么他们之间有什么千丝万缕的联系呢？欢迎收听你的月亮我的心，来听蘑菇头来好好道一道迭代器这个属性。

迭代器

在JavaScript这门语言中有非常多的集合，比如数组，set，map等等，他们是用来存放一堆数据的集合。既然是一堆数据，那么必然存在遍历。一般情况下，我们使用for循环来变量一个集合，需要书写较长的代码。于是官方就打造了一个属性Iterator，并设定具有Iterator属性的数据结构就是可迭代的，并且拥有迭代器属性的数据结构才可以被for of 遍历，for of 遍历的其实是某结构上的迭代器对象。

迭代器原理

我们通过手搓一个迭代器来详细了解一下迭代器的内部结构。

```
function myIterator(items){
    var i =0;
    return{
        next:function(){
            var done = i>=items.length;
            var value = !done?items[i++]:undefined;
            return{
                done:done,
                value:value
            }
        }
    }
}

var iterator = myIterator([1,2])
// console.log(iterator.next());//{ done: false, value: 1 }
// console.log(iterator.next());//{ done: false, value: 2 }
// console.log(iterator.next());//{ done: true, value: undefined }
```

`myIterator` 函数它接受一个数组或可迭代对象 `items` 作为参数。`var i = 0`：定义了一个用于迭代的索引变量 `i`，初始化为 0。`return {... }`：返回了一个包含 `next` 方法的对象。在next方法中：`var done = i>=items.length`：判断索引 `i` 是否超出了 `items` 的长度，如果超出则表示迭代完成，将 `done` 设置为 `true`，否则为 `false`。`var value =!done?items[i++]:undefined`：如果迭代未完成（即 `!done`），则获取当前索引对应的元素并将索引递增，否则设置值为 `undefined`。最后返回一个包含 `done`（表示是否完成迭代）和 `value`（当前迭代的值）的对象。

总的来说，这段代码定义了一个简单的迭代器函数，可以对输入的数组或可迭代对象进行逐步迭代并返回相应的状态和值。

for of

上面提到，只要是拥有迭代器属性的数据结构，那么他就可以被for of 遍历，也就是说我们只要在某个数据结构身上添加上迭代器属性，那么他就可以被for of遍历，这里我们用for of遍历一个对象试试。

```
let obj={
    value:1
}
for(let value of obj){
    console.log(value);//报错：obj is not iterable
}
```

当我们不给对象添加迭代器属性时他会报一个错误 `obj is not iterable` ，这更加证实了其实for of 遍历的是这个数据结构身上的迭代器属性。这次我们给obj添加迭代器属性。

```
function myIterator(items){
    var i =0;
    return{
        next:function(){
            var done = i>=items.length;
            var value = !done?items[i++]:undefined;
            return{
                done:done,
                value:value
            }
        }
    }
}
let obj={
    value:1
}
obj[Symbol.iterator] = function(){
    return myIterator([1,2])
}
for(let value of obj){
    console.log(value);//1 2
}
```

可以看到obj对象就能被for of 识别，但是似乎并不是遍历的obj身上的属性，而是传进去的数组，因为for of 遍历的就是迭代器对象。

手写一个 for of

for of 首先会看这个对象身上是否有迭代器属性，如果没有则报错，如果有，则根据迭代器的原理将值取出。

```
function forOf(obj,cb){
    if(!obj[Symbol.iterator]){
		throw new TypeError(obj + " is not iterable")
    }
    let iterrator = obj[Symbol.iterator]();
    let res = iterrator.next();
    while(!res.done){
        cb(res.value);
        res = iterrator.next();
    }
}
var arr = [1,2,3,4]
forOf(arr,function(value){
    console.log(value);
})
```

以下是对这段代码的解释：

`function forOf(obj, cb)`：定义了一个名为 `forOf` 的函数，它接受要遍历的对象 `obj` 和一个回调函数 `cb`。`if (!obj[Symbol.iterator]) {... }`：检查对象是否具有 `Symbol.iterator` 属性（即是否可迭代），如果没有则可能进行一些特殊处理（这里代码未给出具体内容）。`let iterrator = obj[Symbol.iterator]();`：获取对象的迭代器。`let res = iterrator.next();`：获取迭代器的下一个结果。`while (!res.done)`：只要结果中的done为假（即迭代未完成），就执行以下操作：调用回调函数 `cb` 并传入当前的值 `res.value`。获取下一个迭代结果并更新 `res`。

这个函数的主要作用是使用迭代器对一个对象进行遍历，并在遍历过程中通过回调函数对每个值进行处理。

面试题 

请你将以下等式成立 [a,b] = {a:1,b:2}

我们知道这很像解构的语法，但是又不是，我们可以将数组解构为数组`[a,b] = [1,2]`，对象解构为对象`{a,b} ={a:1,b:2}`，从没有将数组解构为对象的语法，也就是说他肯定会报错，它报的是`{(intermediate value)(intermediate value)} is not iterable`，又是迭代器！首先我们要明白一点，对象这种数据结构不具有 `[Symbol.iterator]` 属性，解构其实是将数组中的迭代器属性得到的值不断地调用 `next` 再将得到的对象中的 `value` 赋值给变量的过程。OK，通过我们以上的学习我想你应该很快就知道解决办法了。我们只需要给对象的原型身上添加一个迭代器属性就行，方式如下：

```
Object.prototype[Symbol.iterator] = function(){
    // Object.values 读取一个对象中所有的value值 [1,2]
    return Object.values(this)[Symbol.iterator]()
}
var [a,b] = {a:1,b:2}
```

总结

今天我们聊了迭代器这个属性，他是很多数据结构身上的一个属性，拥有它你才能被for of遍历，而for of正是找的迭代器。了解了迭代器的原理，以及根据迭代器原理手写了一个for of。
