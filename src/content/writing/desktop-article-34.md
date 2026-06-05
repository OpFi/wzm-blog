---
title: "图片预加载"
description: "前言 今天我们聊聊前端性能优化系列之图片预加载。相信很多小伙伴已经知道图片懒加载是怎么实现的，它的核心思想就是利用占位图这么一个操作，当图片到达视口时，将占位图换成真实的图片地址，具体..."
date: "2025-08-10"
tags: ["Vue","性能优化"]
draft: false
featured: false
---
### 前言

今天我们聊聊前端性能优化系列之图片预加载。相信很多小伙伴已经知道图片懒加载是怎么实现的，它的核心思想就是利用占位图这么一个操作，当图片到达视口时，将占位图换成真实的图片地址，具体怎么判断图片到达视口可以利用监听滚动事件或者利用intersectionObserver进行判断。现在我们换一种方式来进行图片加载的优化，利用webworker。

### js是单线程吗？

在聊图片预加载之前，咱们先聊聊js是单线程吗这个话题。在没有 Web Worker 技术之前，JavaScript 在浏览器环境中一直是单线程的。 JavaScript 设计成单线程执行是为了避免复杂性并简化对 Web 页面状态的一致性管理，尤其是考虑到对 DOM（文档对象模型）的访问和修改。所以在书写HTML代码时我们一般将script标签放在body的底部，这是因为js的加载和执行会阻塞html的渲染，为了先渲染Ui，js代码一般放在最底部。

但是当我们利用cdn的方式引入vue的源码时一般是放在head标签里面的，难道他就不会阻塞吗？其实它也会，那么我们有没有办法优化呢？有，我们可以在script标签里面添加async属性，让js的加载变成异步，浏览器在加载js的时候，不会阻塞html的渲染，但是执行js代码还是会阻塞html的渲染。或者使用defer属性，让js的加载变成异步并且延迟执行js，等到html的解析完成之后再执行js代码，这里的js代码指的是vue源码。

### webworker

Web Worker 是一种浏览器技术，它允许在 Web 应用程序中执行 JavaScript 脚本而不会干扰用户界面的性能。它提供了一个独立的线程来处理一些耗时的任务，这意味着它们可以在后台运行而不干扰到网页的其他部分。这样可以提高应用程序的性能和用户体验。

所以我们可以利用这个机制来对我们的图片进行一个预加载的功能。webworker他会涉及到主线程和子线程的一个通信，主要是通过postMessage`和 onmessage来进行传输。

### 图片预加载

#### 主要思想

我们在主线程中创建一个子线程，让子线程去请求我们的图片资源，子线程将请求回来的图片资源发送给主线程。主线程接收到后将图片资源渲染到页面上。

index.html

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h2>图片预加载</h2>
        <div id="pic"></div>
    </div>
    <script>
        let picBox = document.getElementById("pic");
        let arr = [
            "https://picsum.photos/200/300?random=1",
            "https://picsum.photos/200/300?random=2",
            "https://picsum.photos/200/300?random=3",
            "https://picsum.photos/200/300?random=4",
            "https://picsum.photos/200/300?random=5",
            "https://picsum.photos/200/300?random=6",
            "https://picsum.photos/200/300?random=7",
            "https://picsum.photos/200/300?random=8",
            "https://picsum.photos/200/300?random=9",
            "https://picsum.photos/200/300?random=10"
        ]
        // 创建worker线程
        const worker = new Worker('./image.js');
        worker.postMessage(arr);
        // 监听父线程的消息
        worker.onmessage = function (e) {
            const img = new Image();
            img.src = window.URL.createObjectURL(e.data);
            img.onload = function () {
                picBox.appendChild(img);
            }
        }
    </script>
</body>

</html>
```

image.js

```
self.onmessage = function(e){
    console.log(e.data);
    let arr = e.data;
    for(let i=0;i<arr.length;i++){
      let xhr = new XMLHttpRequest();
      xhr.open('GET',arr[i],true);
      xhr.responseType = 'blob';
      xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            self.postMessage(xhr.response);
        }
      }
      xhr.send();
    }
}

```

这里需要注意的一点就是我们需要将子线程传过来的图片文件对象Blob转成URL地址，这里我们使用window.URL.createObjectURL这个api进行转换。
