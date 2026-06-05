---
title: "图片懒加载"
description: "前言 今天我们聊聊又一个前端小知识点，性能优化，怎么实现图片懒加载功能。 图片懒加载 我们知道只要在html中写下了img标签之后，只要网页一加载，就会去src的地址上下载图片，当我们..."
date: "2025-08-14"
tags: ["性能优化","浏览器"]
draft: false
featured: false
---
### 前言

今天我们聊聊又一个前端小知识点，性能优化，怎么实现图片懒加载功能。

### 图片懒加载

我们知道只要在html中写下了img标签之后，只要网页一加载，就会去src的地址上下载图片，当我们这个网页有很多图片时，比如常见的电商网站，就需要消耗较多资源去下载图片，有可能会造成卡顿，势必会造成用户体验不佳，所以图片懒加载（Lazy Loading）应运而生，它是一种优化网页加载性能的技术，它的工作原理是仅在用户需要查看图片时（如`滚动`到图片所在的视口范围内）才加载图片资源，而不是在页面初始加载时一次性加载所有图片。这样可以减少初始页面加载时间，提升用户体验。

### 优化步骤

大致思路：将真实的img地址填在data-src中，src中填入一张消耗资源较小的图片作为占位图。当屏幕滚动到当前图片时，使用getAttribute将data-src中的地址换到src，即可完成图片懒加载。既然有滚动事件，那么我们可以再优化一下，使用节流函数，设置一个时间间隔，确保在这个间隔内图片加载只能被调用一次。

#### 具体步骤

##### **HTML**

```
<img src = 'https://misc.360buyimg.com/mtd/pc/common/img/blank.png' data-src="https://img.36krcdn.com/20190905/v2_1567641974410_img_000">
    <img src = 'https://misc.360buyimg.com/mtd/pc/common/img/blank.png' data-src="https://img.36krcdn.com/20190905/v2_1567641293753_img_png">
    //省略...
```

这些`<img>`标签初始时都指向一个占位图片，通过`data-src`属性保存实际的图片地址，实际图片将在懒加载时被加载。

##### JavaScript

**获取图片列表和数量**

```
const imgList = document.getElementsByTagName('img');
const num = imgList.length;
let n = 0;
```

通过`getElementsByTagName`获取所有`img`元素，并记录其数量以及一个初始的计数器`n`。

**事件监听**

```
window.addEventListener('scroll', throttle(lazyload, 200));
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    lazyload();
});
```

- 当页面滚动时，通过`throttle`函数节流后调用`lazyload`函数。
- 当页面内容加载完成时（`DOMContentLoaded`事件），立即执行一次`lazyload`，确保初始可见区域的图片被加载。

**懒加载函数**

```
function lazyload() {
    let screenHeight = document.documentElement.clientHeight;
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    for (let i = n; i < num; i++) {
        if (imgList[i].offsetTop < screenHeight + scrollTop) {
            imgList[i].src = imgList[i].getAttribute('data-src');
            n = i + 1;
            if (n === num) {
                window.removeEventListener('scroll', throttleLazyload);
            }
        }
    }
}
```

- 获取视口高度和滚动距离。
- 遍历图片列表，如果图片的位置在当前视口内，则加载图片（将`data-src`属性值赋给`src`属性）。
- 更新已加载图片的计数器`n`，如果所有图片都加载完成，则移除滚动事件监听器。

**节流函数**

```
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

- `throttle`函数限制了函数调用的频率，防止`scroll`事件过于频繁触发`lazyload`，提高性能。

OK，到此我们就完成了图片懒加载功能。大家有没有发现像防抖节流等等这些基本函数我们需要写很多次，很是麻烦，不用担心，像这种功能早就有库函数已经帮我们封装好了。

### Lodash.js

Lodash.js 是一个功能强大且广泛使用的 JavaScript 工具库，提供了大量的实用函数，帮助开发者处理数组、对象、字符串等常见的数据操作。Lodash 的设计初衷是提高 JavaScript 编程的效率和简洁性。

#### 快速入门

使用 CDN 直接引用

```
<script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
```

在项目中引入 Lodash 后，就可以使用 Lodash 提供的各种函数，这里我们结合图片懒加载使用节流函数，主要注意调用方式。

```
const imgList = document.getElementsByTagName('img');
const num = imgList.length;
// console.log(imgList);
let n = 0;
// 注册在scroll事件中的触发函数
const throttleLazyload = _.throttle(lazyload, 200)
window.addEventListener('scroll', throttleLazyload)
// DOMContentLoaded html和css页面加载完成时触发，保证第一次页面的图片不用滚轮加载图片
document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded');
            lazyload()
})
function lazyload() {
            // 获取可视区域一屏的高度
            let screenHeight = document.documentElement.clientHeight;
            console.log(screenHeight);
            // 获取滚动条滚动的距离 多浏览器适配
            let scrollTop = document.documentElement.scrollTop || 						document.body.scrollTop;
            console.log(scrollTop);
            for (let i = n; i < num; i++) {
                if(imgList[i].offsetTop < screenHeight + scrollTop) {
                    imgList[i].src = imgList[i].getAttribute('data-src');
                    // 记录已经加载过的图片的下标
                    n = i + 1;
                    if(n === num) {
                        // console.log('所有图片加载完成');
                        window.removeEventListener('scroll', throttleLazyload)
                    }
                }
        }
}
```

总结

当我们了解图片懒加载的原理后，可以使用一些更为简便的库函数来帮我们实现，重复造轮子是编程的一个大忌。
