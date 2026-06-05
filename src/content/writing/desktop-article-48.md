---
title: "浏览器中js的执行机制"
description: "浏览器中js代码的执行机制 前言 你问我为什么要学习js的执行机制？别说话，因为下一个王多鱼就是你。学习js的执行机制能够让我们更加了解js代码是怎么在浏览器中运行，并且有利于我们理解..."
date: "2025-06-15"
tags: ["浏览器","JavaScript"]
draft: false
featured: false
---
浏览器中js代码的执行机制

前言

你问我为什么要学习js的执行机制？别说话，因为下一个王多鱼就是你。学习js的执行机制能够让我们更加了解js代码是怎么在浏览器中运行，并且有利于我们理解代码执行的顺序，更加理解代码。

声明提升

首先我们要了解一个概念，什么是声明提升。js引擎在执行代码时，会将变量声明部分和函数声明部分提升到当前作用域的最前面，默认值为undefined。

```
console.log(x);//undefined
var x = 1;
//声明提升之后,长这样
var x;
console.log(x);
x = 1;

var foo = function() {
  console.log("hello");
}
//声明提升之后
var foo;
foo = function(){
   console.log("hello");
}
```

声明提升是发生在编译阶段，而赋值操作则发生在执行阶段。

函数的执行上下文

当函数在进行预编译的时候，会创建一个执行上下文，也就是GO或者AO对象里的东西，[大厂前端面试题 var x = 100；console.log打印100？ - 掘金 (juejin.cn)](https://juejin.cn/post/7362102742762209332)这篇文章大概讲了预编译阶段到底发生了什么事，但是里面有些东西聊得还不够细，就比如这个GO对象和AO对象里面到底是什么。所以在这篇文章，我们再补充一些，聊聊执行上下文，比如这么一段代码。

```
showName();
console.log(myName);undefined
var myName = 'wzm';
function showName(){
	consloe.log('hello');
}
```

首先创建GO对象，里面有一个执行上下文长这样

![](/images/articles/Snipaste_2024-04-30_12-02-23.png)

变量环境是指var创建的变量，词法环境是指const let声明的变量。当GO对象预编译完成后，执行第一句代码，又要进行预编译，创建AO对象，这个我们省略不画图，因为里面只打印一句话。然后就是打印myName，这里GO预编译时会进行声明提升，所以值为undefined，然后赋值为wzm，代码结束，上下文对象销毁。

一段代码只有在以下三种情况下才会创建执行上下文对象

1、全局执行上下文，在全局下函数之外的代码

2、函数执行上下文，函数里面的代码

3、Eval执行上下文

调用栈

我们知道，全局下会创建全局上下文，函数会创建函数的上下文，但是他们在内存中是如何存放的呢？他们之间的一个什么样的关系呢？创建函数的位置不同会有影响吗？要解开这些疑惑我们就不得不聊到调用栈了。在V8中，是使用栈这样的存储结构来存储上下文对象的。调用栈是一种数据结构，用来存储函数调用的顺序，每当一个函数被调用时，就会被压入调用栈，当函数执行完毕时，就会从调用栈中弹出，例如下面这段代码。

```
var a = 2
function add(b, c) {
  return b + c
}

function addAll(b, c) {
  var d = 10
  var result = add(b, c)
  return a + result + d
}

addAll(3, 6)
```

  ![](/images/articles/Snipaste_2024-04-30_15-21-19.png)

首先创建GO对象压入栈底，然后函数addAll函数调用前创建AO对象入栈，在addAll函数里面有add函数调用，又要创建AO对象入栈，然后就是函数执行，执行完毕出栈，这就是js的函数的调用流程。

作用域链

我们先给一段代码

```
function foo() {
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a);  // 1
      console.log(b);  // 3
    }
    console.log(b);  // 2
    console.log(c);  // 4
    console.log(d);  // error
  }
  foo()
```

这段代码的我们分析一下foo函数的执行上下文

![](/images/articles/Snipaste_2024-04-30_15-47-11.png)

词法环境，变量环境也是一种栈结构，在词法环境中有两个变量b，下面的b是{}外的也是最先读到的，所以在底下，{}里的b和let形成块级作用域，当我们打印时，先从词法环境中从上往下找，如果没找到，再从变量环境中从上往下找，如果还没有找到，则从指针指向的下一级作用域找，当然了，let，const的特性我们要牢记。

OK有这个概念之后我们再看一段代码

```
function bar() {
  console.log(myName);
}
function foo() {
  var myName = 'Tom';
  bar();
}
var myName = 'Jerry';
foo();
```

问：这段代码我们打印的是什么？按照我们先前的思想，会有三个执行上下文入栈，然后开始函数执行，调用出栈是吧。在bar中词法环境到变量环境找myName，没有找到，然后在foo中找，找到一个tom，所以按道理来说这里应该打印的是tom，但是其实他打印的是Jerry。为什么呢？其实每个函数的执行上下文变量环境中都会包含一个outer，就是一个指针，指向它的外层作用域是谁，而整个outer的指向形成的链式结构我们称为作用域链。怎么看outer指向谁呢？我的词法作用域在哪里，outer 就指向哪里。按我的理解就是看函数声明的位置，由于bar函数声明在全局作用域下，所以outer指向全局。所以当bar中找不到myName时，他会去全局找myName，而不是按调用栈的规则来找。

那你知道这段代码打印的是什么吗？欢迎评论区留言哦

```
function foo() {
    var myName = 'Tom';
    function bar() {
      console.log(myName);
    }
    bar();
  }
  
  var myName = 'Jerry';
```
