---
title: "深入了解this指针"
description: "前言 攀登的路上注定荆棘丛生，孤军奋战，没有人能帮你，能帮你的只有你自己，当我们翻过一座又一座大山之后，回首望去，遍地鲜花，硕果累累。很多编程语言都有this指针，相信很多小伙伴都曾被..."
date: "2025-05-30"
tags: ["JavaScript"]
draft: false
featured: false
---
前言

攀登的路上注定荆棘丛生，孤军奋战，没有人能帮你，能帮你的只有你自己，当我们翻过一座又一座大山之后，回首望去，遍地鲜花，硕果累累。很多编程语言都有this指针，相信很多小伙伴都曾被他搞得稀里糊涂，不知道this指针到底指向哪里。今天蘑菇头就来聊聊this这前端中的又一座大山。

什么是this

在其他一些编程语言中，对象里的方法可以直接访问属性，但是在JavaScript中不行。需要通过对象名，或者使用this指针，this他是一个代词，作为一个关键字使用。

```
let obj ={
    myName : 'xioami',
    bar:function(){
        //在对象内部的方法里面使用对象内部的属性
        console.log(myName);//报错
        console.log(obj.myName);//可以
        console.log(this.myName);//可以
    }
}
obj.bar();
```

为了让对象中的函数有能力访问对象自己的属性，所以才有了this指针，他有一个优点，this可以提升代码的质量，减少上下文参数的传递。

this 的绑定规则

1. 默认绑定：当一个函数被独立调用时，不带任何修饰符的时候，函数在哪个词法作用域下生效，函数中的this就指向哪里，只要是默认绑定，this就指向Window

```
console.log(this);//全局下的this，指向Window
function foo(){
    console.log(this);
}
foo();//函数被独立调用，指向全局
```

2. 隐式绑定：当函数的引用有上下文对象时，或者说当函数被某个对象拥有时，函数的this指向引用他的对象。

```
var obj={
    foo:function(){
        console.log(this);
    }
}
obj.foo()//函数被引用，指向obj
```

清楚这两个规则之后，我们来一道小习题练练手，问这个this打印的是什么？1还是undefined？

```
var obj ={
    a:1,
    foo:foo
}
function foo(){
    console.log(this.a);
}
obj.foo();
```

答案是1，为什么？因为他会触发隐式绑定规则。在foo:foo这句代码中foo函数被foo变量引用了。那么如果我将这句代码改成foo:foo()呢？他就会触发显示绑定规则，因为foo没有被引用，所以this指针指向Window，但是结果会报错，因为foo()是函数的返回值，但是这个函数没有返回值，所以是undefined，obj.foo为undefined再加一个()，当然会报错。

3. 显示绑定，我们可以通过call，apply，bind这三个方法修改this的指向

```
//显示绑定
var obj ={
    a:1
}
//此时this指向的是Window，但是call apply bind可以强行将this指向obj
function foo(x,y){
    console.log(this.a);
}
//第一种：call 第一个参数，this需要指向的对象，后面可以传foo的参数
foo.call(obj,x,y);
//第二种：apply 第一个参数，this需要指向的对象，后面可以传foo的参数
foo.apply(obj,[x,y]);
//第三种：bind 第一个参数，this需要指向的对象，后面可以传foo的参数,也可以在返回函数中传参
var bar = foo.bind(obj,x,y);
bar();
```

我们来总结一下显示绑定的这三种方法有什么异同点，他们都可以更改this指针的指向，call和apply的传参的形式不一样并且没有返回值，bind有返回值，既可以在bind后面传，也可以在返回函数中传。

   4.new 绑定：this指向创建的实例对象，构造函数创建对象时

- new会在构造函数中创建对象
- 显示绑定，调用call方法将构造函数的this指向刚刚创建出来的对象执行函数中逻辑代码
- 往刚刚创建的对象添加属性
- 隐式原型(this.__proto__) = 构造函数的显示原型[[prototype]]
- 返回此对象

```
function Person() {
    // var obj = {
    //   name: '曹总'
    // }
    // Person.call(obj)
    // Object.__proto__ = Person.prototype
    this.name = '曹总'
    // return obj
}
let p = new Person()   // 实例对象
```

箭头函数

箭头函数没有this机制，写在箭头函数里的this也是其外层非箭头函数的this

```
function foo(){
    var bar = ()=>{
        console.log(this);
    }
    bar();
}
foo();
```

普通函数里是有this的，但是箭头函数里面不承认this机制，此时的this是外层非箭头函数的this，也就是foo的this，foo的词法作用域在全局，所以this指向Window。

总结

今天我们学习了什么是this，他是一个指针，为了让对象中的函数有能力访问对象自己的属性。以及四种this的绑定规则，默认绑定，隐式绑定，显示绑定，new绑定。其中显示绑定有三种方法需要牢记，call，apply，bind。一种特殊情况，箭头函数的this指向问题。
