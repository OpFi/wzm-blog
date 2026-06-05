---
title: "前端路由-hash模式和history模式"
description: "前言 今天我们聊聊前端路由中的hash模式和history模式。不知大家在使用vue框架配置路由的时候是使用hash模式还是history模式呢？今天我们通过一个小demo来聊聊这两种..."
date: "2025-09-15"
tags: ["Vue","算法"]
draft: false
featured: false
---
### 前言

今天我们聊聊前端路由中的hash模式和history模式。不知大家在使用vue框架配置路由的时候是使用hash模式还是history模式呢？今天我们通过一个小demo来聊聊这两种模式到底做了些什么。

### 路由

路由最早是用来描述服务器资源上资源路径的映射，现在前端路由用来描述URL和Ui的映射关系，意思就是说每个路径会对应不同的代码片段或者组件。

通过观察我们使用的这两种模式我们可以发现要实现这两种路由有三个点需要我们注意：

1. 当URL发生变化了，页面需要更新，也就是需要渲染对应的组件或者代码片段。
2. 当URL改变时，页面不能发生跳转，我们是单页应用。
3. 最终要的一点，我怎么知道URL发生变化了？

解决这三个问题，我们就能实现这两种路由模式了。

### 哈希模式

哈希模式是前端路由中最基本也是最广泛使用的模式之一。它依赖于URL中的`#`符号之后的部分（即哈希片段），浏览器不会重新加载整个页面来响应URL的哈希变化。这使得前端可以hashChange事件捕获到URL的变化，并根据变化后的哈希值来显示相应的页面内容。

OK，我们就根据这个思路来实现一下。

跳转我们一般先想到a标签，但是页面会刷新，所以我们用到hash片段。这里的routerView是用来挂载相应的代码片段的。

```
<ul>
        <li><a href="#/home">首页</a></li>
        <li><a href="#/about">详情</a></li>
</ul>
<div id="routerView"></div>
```

接下来我们编写script脚本。

在我们的vue中，routes是一个数组，所以我们也写成一个数组的形式。我们通过监听页面的哈希值的变化来执行渲染函数。再渲染函数里通过遍历我们的routes数组，如果当前的哈希值和数组中的哈希值是一致的，就渲染对应的代码片段。在routes里面，component我们只是返回一个字符串，在vue中我们这里是放的组件。

```
let routerView = document.getElementById("routerView");
        const routes = [
            { path: "/home", component: () => "首页内容" },
            { path: "/about", component: () => "详情内容" }
        ]
        //hashchange 监听页面哈希值变化
        window.addEventListener("hashchange", function () {
            randView(routes,location.hash);
        })
        window.addEventListener('DOMContentLoaded',()=>{
            randView(routes,location.hash);
        })
        function randView(routes,hash) {
            for (let item of routes) {
                if ('#' + item.path === hash) {
                    routerView.innerHTML = item.component();
                }
            }
		}
```

当我们进入应用时就需要将首页内容加载出来，所以我们需要在页面dom加载完就执行randview函数，调用DOMContentLoaded事件。

可以看到我们基本实现了路由的效果。

![](/images/articles/Snipaste_2024-09-19_10-08-40.png)

#### 优缺点

优点：

- 兼容性好，几乎所有的浏览器都支持。
- 不需要服务器端的支持或配置。

缺点：

- URL看起来不是特别美观。
- 对SEO（搜索引擎优化）可能不友好。

### history模式

历史模式利用了HTML5新增的History API，该对象拥有pushState 和 replaceState，他们可以用来修改URL，不会引起页面刷新，当a标签被点击时我们阻止默认行为，人为添加点击事件，通过pushState修改URL，再通过监听popstate事件来控制页面的前进和后退。

同样还是这个dom结构，只不过没有#了。

```
<ul>
    <li><a href="/home">首页</a></li>
    <li><a href="/about">关于</a></li>
</ul>
<div id="routerView"></div>
```

首先，我们拿到所有的a标签，给它添加点击事件并且阻止默认跳转行为，然后通过history.pushState方法修改URL，但是当我们点击后退按钮时，并不会渲染相应的组件，所以我们需要调用popstate方法，当用户点击后退时会触发这个函数，我们再这里面再调用一遍渲染函数。

```
let routerView = document.getElementById('routerView')
  window.addEventListener('DOMContentLoaded', () => {
    onLoad()
  })
  window.addEventListener('popstate', () => {  // 浏览器的前进后退
    renderView(location.pathname)
  })

  const routes = [
    {
      path: '/home',
      component: () => {
        return '<h2>首页页面</h2>'
      }
    },
    {
      path: '/about',
      component: () => {
        return '<h3>about页面</h3>'
      }
    }
  ]

  function renderView(pathname) {
    const index = routes.findIndex((item) => {
      return item.path === pathname
    })
    routerView.innerHTML = routes[index].component()
  }

  function onLoad() {
    let linkList = document.querySelectorAll('a[href]')
    linkList.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault() // 阻止默认行为
        history.pushState(null, '', el.getAttribute('href')) // 更新URL，但是不会进入浏览器的缓存栈
        renderView(location.pathname)
      })
    })
  }
```

#### 优缺点

优点：

- URL更加整洁，没有`#`符号。
- 对于SEO更加友好。
- 用户体验更好，因为URL看起来更像传统的多页面应用。

缺点：

- 需要服务器端的支持，如果用户直接访问非根路径，则需要服务器端正确处理，返回SPA的入口文件（通常是index.html），否则用户会看到404错误页面。
- 兼容性相对较差，因为依赖于HTML5 History API。
