---
title: "JS类型判断的四种方法"
description: "前言 当我们设计一个函数时，由于不知道使用者会传入一个什么类型的参数，所以基本上都要做类型判断，尤其是底层的代码，大家阅读时可以发现，大部分代码都不是业务逻辑代码，而是判断的代码，各种..."
date: "2025-12-08"
tags: ["JavaScript"]
draft: false
featured: true
---
前言

当我们设计一个函数时，由于不知道使用者会传入一个什么类型的参数，所以基本上都要做类型判断，尤其是底层的代码，大家阅读时可以发现，大部分代码都不是业务逻辑代码，而是判断的代码，各种条件判断，非空啊，参数校验啊，等等。所以在设计函数时我们要做类型判断，增加代码的健壮性。不知道大家做类型判断时一般是使用的哪种方法，今天蘑菇头学了四种类型判断的方法，通过比较底层的方式分享出来，有问题欢迎指出。

第一种typeof

typeof大家用的应该算是比较多的了，typeof运算符返回一个字符串，表示操作数的类型。这里只列举一些例子

```
console.log(typeof('123'));//string
console.log(typeof(123));//number
console.log(typeof(Symbol(123)));//symbol
console.log(typeof(null));//object
console.log(typeof(undefined));//undefined
console.log(typeof({}));//object
console.log(typeof([]));//object
console.log(typeof(function(){}));//function
```

可以发现，typeof可以判断除了null之外的所有原始类型，除了function其他所有的引用类型都会判断为object，基本类型当中无法判断null的类型，为什么呢？typeof底层认为，传入的类型会被转换成二进制，前三位如果全是0，则为obj，null全为0，所以为obj，这其实是当初设计JavaScript这门语言时的一个缺陷。至于为什么typeof不能判断引用类型唯独可以判断function这个类型，蘑菇头的想法是其他引用类型是更高级别的类型或者是更靠后设计，typeof没有这样的逻辑来判断，这只是我的一种猜测。

第二种**instanceof**

instanceof也可以做类型判断，返回true 或者false，注意看是如何使用的。

```
console.log('123' instanceof String);//false
console.log(null instanceof Object);//false

console.log({} instanceof Object);//true
console.log([] instanceof Array);//true
console.log([] instanceof Object);//true
console.log(function(){} instanceof Function);//true
```

可以看出，instanceof只能用于判断引用类型，基本数据类型无法判断，为什么我们待会再讲。我们先手搓一个instanceof，这也是面试中经常考的一道题目。

由于我们无法手搓一个像如上调用形式的instanceof，因为这是JavaScript中内定好的，我们可以使用函数调用传参的方法，话不多说，直接上代码。

```
function myInstanceOf(L,R){
        if(L.__proto__ === R.prototype){
            return true;
        }
    	return false;
}
```

我们需要传入用于判断的数据和构造函数，如何判断一个实例对象它的类型呢？根据我们以前所学的知识，实例对象的隐式原型是等于其构造函数的显示原型的，也就是`__`proto`__`===prototype的，如果相等就说明这个实例对象是由这个构造函数创建出来的，如果不相等则不是。根据这个特点可以很轻松写出这样的代码，如果有不清楚的小伙伴可以看看这篇文章复习一下哦。

但是有问题，可以看到数组这个类型同时还属于object构造函数，那么这要怎么实现呢？同样还是原型，只不过是通过原型链来判断，我们稍微改进一下。

```
function myInstanceOf(L,R){
    while(L){//当指到顶级父类Object时，跳出
        if(L.__proto__ === R.prototype){
            return true;
        }
        L=L.__proto__;//指向下一级的显示原型
    }
    return false;
}
```

OK这样我们就完成了一个拥有基本功能的myInstanceOf，回到上个问题，为什么不能判断基本数据类型，其实你已经知道了，我们手搓Instanceof时是通过原型链来实现的，基本数据类型没有原型，也就无法判断了。

第三种Object.prototype.toString.call()

这个方法蘑菇头刚学习时也是一头雾水，toString用的最多的是将一个数值类型转换为字符串，call是显示绑定，这俩凑一起什么鬼？这样就能拿到传入的数据类型了？别着急，我们先看看他是如何使用的。

```
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call(123));//[object Number]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call({}));//[object Object]
```

可以看到他给我们返回了一个字符串，左边是object，右边是我们传入参数的数据类型，可以发现他不仅可以判断基本数据类型，还能判断引用类型，甚至null也能判断。那么它究竟是怎么实现的呢？我们来看一下他的底层逻辑，这是官方文档[Annotated ES5](https://es5.github.io/#x15.2.4.2)。

百度解释一下

1. 如果此值未定义，则返回“[object undefined]”。
2. 如果此值为 null，则返回“[object Null]”。
3. 定义 O 是调用 ToObject (该方法作用是把O转换为对象) 的结果，将 this 值作为参数传递。
4. 定义 class 是 O 的 [[Class]] 内部属性的值。
5. 返回 "[object" 和 class 和"]"组成的字符串的结果。

这里比较难以理解的点是第三点和第四点。解释一下它到底做了些什么东西，首先通过调用ToObject方法将你传入的值转化为一个对象，也就是装箱，这里的将this值作为参数转递给toString方法，定义class变量接收 O对象当中的 [[Class]] 的内部属性，这个内部属性放的是其数据类型，每个对象都有 [[class]] 属性，拿到这个数据类型我们就可以做字符串拼接返回结果了。

我们回到这个方法上，Object.prototype.toString() 其实他是可以打印出来值的。

```
console.log(Object.prototype.toString(123));//[object Object]
console.log(Object.prototype.toString('123'));//[object Object]
console.log(Object.prototype.toString({}));//[object Object]
console.log(Object.prototype.toString([]));//[object Object]
```

这里可以发现加了call和不call的区别了，不加call就无法判断了，那么call到底做了些什么事呢？我们简单手搓一个call来讲解，直接上代码。

```
obj = {
    a:1,
}

function foo(){
    console.log(this.a);
}

//我们需要将foo中的this指向obj里面
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

foo.myCall(obj)
console.log(obj);
```

call方法是将函数里面的this强行指向传入的对象里面去，他是这么实现的，首先判断你传入的参数是不是一个函数，因为只有函数身上才有call方法，然后通过隐式绑定规则，将this指向这个对象，这样就强行更改了this的指向。

也就是说我们是将toString方法身上的this更改到了传入的这个参数身上去，刚刚说到这个参数除了null和undefined，其他的都会变成一个对象，这样我们toString方法的this也就指向了这个对象，换句话说，我们其实是将toString方法拿给这个对象去使用了。

第四种**Array.isArray()**

这个方法比较简单，只能用于判断传入的参数是不是数组。

```
console.log(Array.isArray([]));//true
console.log(Array.isArray({}));//false
```

总结

JavaScript这门语言中类型判断的方法基本就这四种了，第一种typeof，他只能用于判断基本数据类型加上function，但是不能判断null。第二种Instanceof，只能用于判断引用类型，并且我们手搓了一个myInstanceOf。第三种 Object.proptype.toString.call() ，这个方法什么类型都能判断，非常全能，并且我们稍微了解了一下其原理。第四种Array.isArray() ，这个方法只能用于判断传入的参数是不是数组。
