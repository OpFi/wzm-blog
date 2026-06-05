---
title: "三种常见的发送请求的异步方法(jQuery,fetch,XHR)"
description: "三种常见异步发送请求的方法( jQuery , fetch , XHR ) 前言 激动地心颤抖的手，蘑菇头的前端学习之路也是终于学到了前后端交互了，也算是真正的开始入门了。今天将学习到..."
date: "2025-11-02"
tags: ["后端","浏览器"]
draft: false
featured: false
---
三种常见异步发送请求的方法(**jQuery**,**fetch**,**XHR**)

前言

激动地心颤抖的手，蘑菇头的前端学习之路也是终于学到了前后端交互了，也算是真正的开始入门了。今天将学习到的三种比较常见的异步发送请求的方法和大家分享一下，有问题欢迎指出。

Ajax

它是一种用于创建快速动态网页的技术。通过 AJAX，可以在不重新加载整个网页的情况下，不用点击刷新按钮，能与服务器进行少量数据的交换，实现网页的局部更新，这样能极大地提升用户体验，使网页感觉更加流畅和动态。常见用Ajax的地方有动态加载内容，比如文章图片等等，或者在不提交表单验证的情况下，异步验证输入内容，相信这个大家在输入账号的时应该见过，他会提示账号不存在。有许多地方都用到了Ajax，所以接下来就跟随者蘑菇头的步伐进入异步的世界吧。

需求

我们用一个简单的需求来稍微入个门，就是点击按钮向这个地址发送请求https://mock.mengxuegu.com/mock/65a91543c4cd67421b34c898/movie/movieList#!method=get，拿到后端返回的数据渲染到页面上。

前期准备工作比较简单，我们需要一个按钮，点击它发送请求，用ul和小li来装从后端返回来的电影列表数据，html准备完毕。

第一种xhr

原生JavaScript异步请求技术，通过创建 XHR 对象，设置请求的方法（如 GET、POST 等）、URL 以及其他相关参数，然后可以监听其状态变化来获取响应数据。蘑菇头用的时候总觉得不够简洁优雅，太繁琐了。

```
let btn = document.getElementById('btn')
let ul = document.getElementById('list')
btn.addEventListener('click',()=>{
        // 创建Ajax实例
        let xhr = new XMLHttpRequest();
        // 配置发送的参数					           xhr.open('GET','https://mock.mengxuegu.com/mock/65a91543c4cd67421b34c898/movie/movieList#!method=get');
        // 发送请求
        xhr.send();
        // 获取请求数据
        xhr.onreadystatechange = () =>{
            // console.log(xhr.readyState);
            if (xhr.readyState == 4&& xhr.status == 200) {
                // 将数据转换为 JavaScript 对象。
                // console.log(JSON.parse(xhr.responseText));
                const movieList = JSON.parse(xhr.responseText).movieList;
                for(let i =0;i<movieList.length;i++){
                    const li = document.createElement('li');
                    li.innerText = movieList[i].nm+'--'+movieList[i].star;
                    //将li插入到ul中
                    ul.appendChild(li);
                }
            }
        }
    })
```

这里的readyState有多种返回结果

- 0 - xhr刚创建
- 1 - open的执行
- 2 - 请求发送出去，响应头被接收
- 3 - 响应体正在解析
- 4 - 解析完成

第二种jQuery

jQuery 是一个由JavaScript开发的快速、简洁的 JavaScript 库。提供了丰富的方法来操作 DOM 元素，如选择元素、修改属性、添加或移除类等，简化了 DOM 操作的复杂性。轻松处理事件，如点击、鼠标移动等事件的绑定和触发。支持 AJAX 操作，使异步数据交互更加便捷。通俗的来讲就是封装了一些方法，简化了原生JavaScript的一些操作。

```
//首先需要引入jQuery
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
let btn = document.getElementById('btn')
let ul = document.getElementById('list')
btn.addEventListener('click', () => {
            $.ajax({
                url: 'https://mock.mengxuegu.com/mock/65a91543c4cd67421b34c898/movie/movieList#!method=get',
                method: 'GET',
                success: function (res) {
                    // console.log(res);
                    let movieList = res.movieList;
                    for (let i = 0; i < movieList.length; i++) {
                        const li = document.createElement('li');
                        li.innerText = movieList[i].nm + '--' + movieList[i].star;
                        //将li插入到ul中
                        ul.appendChild(li);
                    }
                }
            })
        })
```

我们只需要往$.ajax里面配置请求方式，请求地址，成功之后返回一个回调函数就行，非常方便。

第三种fetch

fetch 是 JavaScript 中用于进行网络请求的一种 API，也是简化了xhr的开发。

```
let btn = document.getElementById('btn')
let ul = document.getElementById('list')
btn.addEventListener('click', () => {
     fetch("https://mock.mengxuegu.com/mock/65a91543c4cd67421b34c898/movie/movieList#!method=get")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                let movieList = data.movieList;
                for (let i = 0; i < movieList.length; i++) {
                    const li = document.createElement('li');
                    li.innerText = movieList[i].nm + '--' + movieList[i].star;
                    //将li插入到ul中
                    ul.appendChild(li);
                }
            })
    })
```

首先向fetch函数中传入请求地址，然后通过 .then () = > {} 的方式拿到返回数据。如果条件可行，他可以一直 then 下去。

效果

![](/images/articles/Snipaste_2024-05-21_15-38-32.png)

总结

异步请求是前端学习中不可或缺的一部分，现如今的大部分网页都用到了异步请求，蘑菇头知道还有更流行更简洁的发送异步请求的方式，等蘑菇头学到了再和大家分享吧。今天我们学习了三种常见的发送异步请求的方式，分别是使用JavaScript原生的xhr，使用JavaScript封装的API fetch ，使用 jQuery 库简化开发。
