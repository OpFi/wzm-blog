---
title: "事件代理事件委托"
description: "前言 前几日蘑菇头字节一面，好不容易迎来了自己人生中第一次大厂面试，表面上看似很稳，其实心里慌的一批。早早的就在电脑前准备面试调试设备了。看看自己写的文章和复习一些知识点，哎你说好巧不..."
date: "2025-10-29"
tags: ["性能优化","JavaScript"]
draft: false
featured: false
---
### 前言

前几日蘑菇头字节一面，好不容易迎来了自己人生中第一次大厂面试，表面上看似很稳，其实心里慌的一批。早早的就在电脑前准备面试调试设备了。看看自己写的文章和复习一些知识点，哎你说好巧不巧，今天上午看到的知识点，下午面试的时候正好碰到了，我的字节一面就考到了js的事件流机制。

### 事件流机制

#### 现象

我们先看一个现象。当我在页面中定义三个嵌套的盒子分别为grand，parent，child，并且给每个盒子定义一个点击事件打印一句话，当我点击最里面的盒子时看看会发生什么？

```
<div class="grand">
        <div class="parent">
            <div class="child"></div>
        </div>
</div>
```

```
const grand = document.querySelector('.grand')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
grand.addEventListener('click',function(){
      console.log('grand')
})
parent.addEventListener('click',function(){
      console.log('parent')
})
child.addEventListener('click',function(event){
      console.log('child')
})
```

![](/images/articles/Snipaste_2024-08-29_21-44-11.png)

可以看到，我只点击了绿色的child盒子，为什么触发了外面盒子的事件。这就不得不聊到js的事件流了。

#### 事件流机制

JavaScript 的事件流机制是指在网页中当用户与页面元素（如按钮、链接等）交互时，如何处理这些交互动作的过程。它主要是这么一个过程。

1. 捕获阶段---事件从Window处往目标处传播
2. 目标阶段---在目标处触发事件
3. 冒泡阶段---事件从目标处往Window处传播

结合案例来解释一下就是，当我点击绿色盒子时，事件从Window处，经过grand盒子，parent盒子，到达child盒子，这叫捕获阶段，在目标阶段触发child的事件，也就打印了child。然后是冒泡阶段，从child盒子往上冒泡，js中的事件默认在冒泡阶段触发，所以先打印parent然后打印Grand。

这里提到js的事件默认在冒泡阶段触发也就意味着事件的触发可以控制。我们可以通过配置addEventListener事件的第三个参数来设置。如果在事件处理函数中的第三个参数设置为true，那么事件不会在冒泡阶段触发，会在捕获阶段触发。

```
grand.addEventListener('click',function(){
      console.log('grand')
},true)
parent.addEventListener('click',function(){
       console.log('parent')
},true)
child.addEventListener('click',function(event){
       console.log('child')
},true)
```

![](/images/articles/Snipaste_2024-08-29_21-57-14.png)

可以看到打印顺序为Grand，parent，child。

我们的事件参数里面有一个函数叫做stopPropagation()，可以阻止事件流的传播。

```
grand.addEventListener('click',function(){
      console.log('grand')
})
parent.addEventListener('click',function(){
       console.log('parent')
})
child.addEventListener('click',function(event){
	   event.stopPropagation()
       console.log('child')
})
```

![](/images/articles/Snipaste_2024-08-29_22-12-53.png)

可以看到只会打印child。

还有一个函数叫做stopImmediatePropagation()，他也可以阻止事件流的传播，并且能够阻止同一个容器绑定的多个相同事件的执行，这里就不作演示了。

#### 应用场景

我们可以利用事件流机制来优化一些操作，比如说下面这个场景，可以使用事件流机制实现一个事件委托。

我有一个ul里面放着一些li，当我点击每个li打印li里面的内容。通常的写法是给每一个li绑定点击事件，然后获取到里面的内容。这样的写法会注册很多的点击事件，所以性能不好。我们可以利用事件流机制来实现。

```
<ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
</ul>

let ul = document.querySelector('ul')
        ul.addEventListener('click', function(event){
        console.log(event.target.innerHTML)
})
```
