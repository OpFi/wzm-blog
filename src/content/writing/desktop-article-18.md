---
title: "使用IntersectionObserver实现图片懒加载功能"
description: "前言 上一期我们聊了如何实现图片懒加载功能，其思路是src地址使用一张内存很小的占位图，真实的图片我们放在data src中，当图片滚动到视窗时，将data src的值赋给src，并且..."
date: "2025-10-13"
tags: ["性能优化","浏览器"]
draft: false
featured: false
---
### 前言

上一期我们聊了如何实现图片懒加载功能，其思路是src地址使用一张内存很小的占位图，真实的图片我们放在data-src中，当图片滚动到视窗时，将data-src的值赋给src，并且给滚动事件添加节流函数实现懒加载。这期我们使用更加高级的语法，用intersectionObserver实现图片懒加载功能。它不仅可用于图片懒加载场景下，还能用于无限滚动列表下，让我们一起看看这是怎么实现的吧。

### IntersectionObserver

首先我们介绍一下IntersectionObserver如何使用以及有哪些Api。

IntersectionObserver 是一种浏览器API，用于异步监测一个元素相对于另一个元素或视口的可见性变化。

#### 基本概念

**目标元素**：

- 被监测的元素，即你想知道何时进入或离开视口或某个容器的元素。

**根元素**：

- 相对于其可见性的元素。如果没有指定，则默认为视口（浏览器窗口）。

**阈值（Threshold）**：

- 一个或多个表示触发回调的阈值。当目标元素可见部分占目标元素总大小的比例达到这些阈值时，回调函数会被调用。阈值可以是单个值或数组。

**回调函数**：

- 当目标元素的可见性发生变化时执行的函数。这个函数会接收到一个包含所有可见性变化记录的数组。

#### 基本使用

**创建 IntersectionObserver 实例**：

通过传递回调函数和可选的配置对象来创建一个新的 IntersectionObserver 实例。

```
const observer = new IntersectionObserver(callback, options);
```

**回调函数**：

当目标元素的可见性发生变化时，会调用这个函数。

```
const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 目标元素进入视口
    } else {
      // 目标元素离开视口
    }
  });
};
```

**配置选项**：

包含 `root`、`rootMargin` 和 `threshold` 的对象。

```
const options = {
  root: null, // 默认为视口
  rootMargin: '0px',
  threshold: 0.5 // 当目标元素50%可见时触发回调
};
```

**观察目标元素**：

调用 `observe` 方法开始观察目标元素。

```
const target = document.querySelector('.target-element');
observer.observe(target);
```

**停止观察**：

可以随时调用 `unobserve` 方法停止观察某个元素，或者调用 `disconnect` 方法停止观察所有元素。

```
observer.unobserve(target);
observer.disconnect();
```

### 图片懒加载应用

**思路**：我们同样还是用占位图的方式实现，创建IntersectionObserver实例对象observer，调用observe方法观测所有图片的dom节点，在IntersectionObserver实例对象的回调函数里实现当观测到图片进入视口时，我们就将占位图换成真实的图片地址，并且停止观察这个元素。

**代码实现**：

```
document.addEventListener('DOMContentLoaded', function () {
			//获取所有的图片节点
            const images = document.querySelectorAll('.lazy');
            //将占位图换成真实图片
            const loadImg = (image) => {
                image.src = image.dataset.src;
                image.classList.remove('lazy');
            }
            // 创建观察对象 entries => 观察到的元素列表
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    // 判断是否进入可视区域
                    if (entry.isIntersecting) {
                        // 加载图片
                        loadImg(entry.target);
                        // 停止观察
                        observer.unobserve(entry.target);
                    }
                })
            },{
                rootMargin:'0px', //没有扩展或收缩根的边界，即使用视口的实际边界。
                threshold:0.5 //用于指定目标元素的可见部分与根的交集比例
            })
            images.forEach(image => {
                observer.observe(image);
            });
        })
```
