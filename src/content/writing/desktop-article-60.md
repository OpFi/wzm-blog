---
title: "面试常见之手写系列"
description: "前言 秋招差不多已经开始了，小伙伴们准备好去自己心仪的大厂了吗？如果还没有准备好，欢迎收看本篇为大家准备的面试常见的手写题目，一定会有帮助的。 请你手写一个数组的map方法 数组的ma..."
date: "2025-04-28"
tags: ["算法","JavaScript"]
draft: false
featured: false
---
### 前言

秋招差不多已经开始了，小伙伴们准备好去自己心仪的大厂了吗？如果还没有准备好，欢迎收看本篇为大家准备的面试常见的手写题目，一定会有帮助的。

### 请你手写一个数组的map方法

数组的map方法是任何实例对象都能调用，所以挂在数组的原型上，他接收一个回调函数，返回一个新数组。重点是要知道构造函数的this指向的是实例对象的this，所以我们就能这么写。

```
Array.prototype.myMap = function (callBack) {
    let res = []//存放结果
    for (let i = 0; i < this.length; i++) {//this指的是当前数组
        let val = this[i];
        res.push(callBack(val, i, this))
    }
    return res;
}
const arr = [1, 2, 3, 4, 5];
console.log(arr.myMap(item=>item*2));
```

### 请你手写**InstanceOf**方法

需要注意的点是InstanceOf是通过原型链进行判断的，所以数组既是Array类型也是Object类型。

```
function MyInstanceOf(left,right){
	let proto = left.__proto__; //也可以使用Object.getPrototypeOf()
	while(proto){
		if(proto===right.prototype){
			return true;
		}
		proto = proto.__proto__;
	}
}
```

### 请你手写一个冒泡排序

冒泡排序是非常经典的一个排序算法了，这里就不作介绍了。

```
function bubbleSort(arr){
	let n = arr.length;
	for(let i=0;i<n;i++){
		for(let j=i+1;j<n;j++){
			if(arr[i]>arr[j]){
				[arr[i],arr[j]] = [arr[j],arr[i]]
			}
		}
	}
}
```

### 请你手写一个快排

快速排序是算法中比较有名的一个排序，冒泡都会写，手写一个快排不过分吧。它主要的思路就是选取一个中间值，将数组中比这个中间值小的数放左边，大的放右边。然后递归调用，这个数组会被分成很多个小的左中右结构，最终完成排序。

```
function qsort(arr){
    if(arr.length <= 1){
		return arr;
	}
	let mid = Math.floor(arr.length/2);
	let left = []
	let right = []
	for(let i=0;i<arr.length;i++){
		if(i!==mid&&arr[i]<arr[mid]){
			left.push(arr[i])
		}
		if(i!==mid&&arr[i]>arr[mid]){
			right.push(arr[i])
		}
	}
	return [...qsort(left),arr[mid],...qsort(right)];
}
```

### 请你手写一个for of 出来

for of是用来遍历具有迭代器属性的方法并且它遍历的是这个迭代器。首先会判断传入的对象是否具有这个属性，如果没有则报错，如果有则遍历这个迭代器，这个迭代器他是一个函数，调用它会得到一个对象，对象里面有一个next方法，调用这个方法会得到一个对象，里面有done代表当前是否遍历完成，value代表遍历到的当前值，然后获取下一次的迭代结果。

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

### 请你实现一个数组去重的方法

#### 方法一 双重for循环

相信不少小伙伴第一印象就是这个方法，这个方法有个小问题，如果你是从前往后遍历，里面的索引会因为删除了元素而变化导致有些元素没有遍历到，我们可以从后往前遍历就能避免这个问题了。

```
for(let i=arr.length-1;i>0;i--){
	for(let j= i-1;j>=0;j--){
		if(arr[i]==arr[j]){
			arr.splice(j,1);
		}
	}
}
```

#### 方法二 set去重

```
let set = new Set();
for(let item of arr){
	set.add(item);
}
console.log([...set])
```

#### 方法三 filter去重

```
arr = arr.filter((item,index,arr)=>{
    return arr.indexOf(item) === index
})
console.log(arr)
```

### 手写防抖和节流

#### 防抖

```
function debounce(fn,delay){
	let timer = null;
	return function(){
		clearTimeOut(timer);
		timer = setTimeOut(()=>{
			fn.call(this,arguments)
		},delay)
	}
}
```

#### 节流

```
function throttle(fn,delay){
	let preTime = Date.now();
	return function(){
		let curTime = Date.now();
		if(curTime - preTime > delay){
			fn.apply(this,arguments);
			preTime = curTime;
		}
	}
}
```

### 手写一个柯里化函数

柯里化是函数式编程的概念，他将一个函数一次接收多个形参转变为一次可以接收任意数量的形参。主要思路就是根据调用时传入的参数数量和原函数的参数数量来决定是直接调用原函数还是返回一个新的柯里化函数。如果调用时传入的参数数量大于或等于原函数需要的参数数量则直接调用原函数，如果小于，则将收集到的参数给到下一次柯里化的参数内。

```
const curry = (fn,...args){
	return args.length>=fn.length?fn(...args):(..._args)=>curry(fn,...args,..._args)
}
```

### 手写一个数组扁平化的方法

#### 方法一 递归

```
function flatten(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
```

#### 方法二 reduce

```
function flatten(arr){
	return arr.reduce((pre,val)=>{
		return pre.concat(Array.isArray(val)?flatten(val):val)
	},[])
}
```

### 手写call方法

call方法属于函数身上的，所以我们可以写在构造函数身上。首先判断是否为函数调用，如果不是则抛出一个类型错误，利用隐式绑定规则，给传入的对象添加一个Symbol变量，目的是为了防止用户创建一模一样的变量，值为这个函数体，然后调用这个函数，最后删除这个函数。

```
Function.prototype.myCall = function(context){
    if(!(this instanceof Function)){
        return new TypeError(this+'is not function')
    }
    // 触发隐式绑定
    const fn = Symbol('key');//使用symbol作为key是因为怕同名
    context[fn] = this;//添加变量名为fn，值为context函数体的一个方法
    context[fn]();//调用这个方法
    delete context[fn];//删除这个方法
}
```

### 手写一个浅拷贝

首先创建一个空对象，遍历克隆对象的属性，判断是不是克隆对象自己身上的属性，将克隆对象身上的属性赋值给新对象，返回这个新对象。

```
function shallowClone(obj){
    let newObj = {}
    // for in 不仅会遍历到显示具有的属性，还有遍历到构造函数上的显示属性  
    for(let key in obj){
        // 去除掉对象身上隐式原型的属性
        if(obj.hasOwnProperty(key)){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

### 手写一个深拷贝

首先创建一个新对象，遍历克隆对象身上的属性，判断是不是克隆对象身上自己的属性，判断遍历到的value是不是还是一个对象，如果是则递归调用看，如果不是则将克隆对象身上的属性赋值给新对象，返回这个新对象。

```
function deepClone(obj){
    let newObj = {}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            //另一种判断是不是Object对象的方法 typeof(obj[key])=='object'&&obj[key]!=null
            if(obj[key] instanceof Object){
                newObj[key] = deep(obj[key]);
            }else{
                newObj[key] = obj[key]
            }
        }
    }
    return newObj;
}
```
