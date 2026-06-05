---
title: "全网最通俗易懂之一句话讲清闭包"
description: "全网最浅显易懂之一句话讲清闭包 前言 闭包这个概念一讲出来，相信很多在学习前端的小伙伴都搞不清楚到底是什么，打开百度一查，也只是笼统的概念，很难让人理解这个闭包到底是什么，怎么来的，说..."
date: "2025-10-01"
tags: ["浏览器","JavaScript"]
draft: false
featured: false
---
全网最浅显易懂之一句话讲清闭包

前言

闭包这个概念一讲出来，相信很多在学习前端的小伙伴都搞不清楚到底是什么，打开百度一查，也只是笼统的概念，很难让人理解这个闭包到底是什么，怎么来的，说了又感觉好像没有说一样，那么蘑菇头在这里用最通俗易懂的语言，带大家理解一下什么是闭包。

前置知识

在了解闭包之前，我希望小伙伴能先了解一下几个概念，什么是作用域，什么是作用域链，什么是词法作用域。如果有还不了解的小伙伴可以看看这两篇文章，当你了解这些个概念之后，相信聪明的你很快就能理解什么是闭包了。

[浏览器中js代码的执行机制 - 掘金 (juejin.cn)](https://juejin.cn/post/7363459456145555490)

[大厂前端面试题 var x = 100；console.log打印100？ - 掘金 (juejin.cn)](https://juejin.cn/post/7362102742762209332)

不看也没关系，咱们还是用这个例子简单分析一下。

```
function foo() {
    var myName = 'Tom';
    function bar() {
      console.log(myName);
    }
    bar();
  }
  var myName = 'Jerry';
  foo()
```

OK，我们用v8的思路来简单分析一下这段代码。我先对函数的词法作用域的进行说明，首先是foo的函数声明，他所处的位置在全局作用域下，所以foo的词法作用域为全局，foo里面有bar函数的声明，所以bar的词法作用域为foo。然后开始预编译，这里省略一些步骤，创建全局上下文入栈，变量myName为Jerry，foo调用前编译，创建foo函数上下文入栈，变量myName为Tom，outer指向词法作用域所在位置也就是全局，bar的调用，创建bar函数上下文入栈，outer指向foo函数作用域。首先在bar里面找myName，再去outer指向的下一个作用域找，所以打印的是Tom，当bar执行完bar的函数上下文会被销毁（很重要）。

大概清楚了这些概念之后，我们可以聊聊闭包的一些东西了。

闭包

我们还是通过一个例子来引入 

```
function foo() {
	var num = 1;
    function bar() {
        var age = 18;
        console.log(myName);
    }
    var myName = 'tom'
    return bar;
}
var myName = 'jerry';
var fn = foo();
fn();
```

我们依然用v8的思路来简单分析一下，首先创建全局上下文对象，myName为Jerry，fn为undefined，然后foo执行前编译，创建foo的上下文对象，num为1，myName为Tom，outer指向全局，然后将bar返回出去了赋值给了fn，此时，foo按道理来说应该是调用完毕了，那么调用栈的foo全局上下文理应被销毁。OK，然后fn的调用也就是bar的调用，进行编译，age为18。开始执行，打印myName，首先在bar里面找，没有找到，就到outer指向的下一个作用域找，根据作用域链的规则，按道理来说bar的outer应该是指向foo的，因为bar声明在了foo里，但是此时foo已经被销毁了，bar的outer不知指向何方，那么此时找的myName是谁呢？答案是Tom，为什么呢？

这个时候就可以引出我们的闭包了。由于bar是在foo函数里声明的，但是是在foo函数外调用的，当foo函数上下文被销毁时，v8会把bar里对foo函数有引用的变量（myName）保留下来，将未引用的变量（num）和其他东西销毁，而留下来的东西的集合也就叫做闭包。那此时我们bar的outer指向哪里呢？bar的outer就指向这个闭包集合，所以当bar里面没有找到myName时，会去闭包里面找，打印Tom。

![](/images/articles/Snipaste_2024-05-07_00-54-48.png)

聊到这里，我们尝试用一句话来概括一下什么是闭包，在JavaScript中，根据词法作用域的规则，内部函数（bar）一定可以访问外部函数（foo）的变量，当内部函数（bar）被拿到外部函数(foo)之外调用时，即使外部函数（foo）执行完毕，但是内部函数对外部函数（foo）中的变量依然存在引用，也就是bar中对foo中的myName的引用，那么这些被引用的变量会以一个集合的方式保存下来，这个集合就是闭包。

闭包的作用

现在我们已经知道了什么是闭包，那么闭包有什么用处呢？还是通过一个例子来说明。现在有一个需求，请你实现一个累加方法（累加器），当调用这个方法，里面的值加一。

一般我们就会这么来写

```
let count = 0;
function add(){
	return ++count;
}
console.log(add());
console.log(add());
```

但是注意，这么写没有使用封装的思想，不能使用全局变量来实现，你会吗？我们知道当变量声明在函数体时，每次调用这个函数都是新的值，不能保存下来。这个时候可以利用闭包的思想来实现，我们可以利用内部函数对外部函数的变量存在引用这一点，将变量存在闭包中，这样值就不会从新开始。

```
function add(){
    let count =0;
    var fn = function(){
        return ++count;
    }
    return fn;
}
let res = add();
console.log(res());
console.log(res());
```
