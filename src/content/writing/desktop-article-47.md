---
title: "每天一个小demo-翻页书"
description: "每天一个小demo 翻页贺卡 需求：请你实现一个贺卡，能够用鼠标控制翻页，当鼠标在贺卡上面并且按下拖动打开，松开鼠标则停止，并且里面的贺卡能随着翻页而立起来。 demo效果如下 思路分..."
date: "2025-06-19"
tags: ["浏览器","CSS"]
draft: false
featured: false
---
每天一个小demo-翻页贺卡

需求：请你实现一个贺卡，能够用鼠标控制翻页，当鼠标在贺卡上面并且按下拖动打开，松开鼠标则停止，并且里面的贺卡能随着翻页而立起来。

demo效果如下

![](/images/articles/Snipaste_2024-04-20_14-54-54.png)

![](/images/articles/Snipaste_2024-04-20_14-55-13.png)

思路分析

1、HTML，我们将这个贺卡分成两部分，分成左半部分front-cover盒子和右半部分book-cover盒子，我们先分析右半部分，右半部分可以看到有一个盒子pic放照片，一个阴影盒子shadow，左半部分有一个盒子back用来放文字，一个盒子front用来放封面的图片。

2、CSS部分大家可以看注释，写的比较详细。

3、JS部分，首先我们先实现当鼠标停在贺卡上按住不松，然后移动鼠标实现翻页效果，js里有对鼠标进行监听的函数，window.onmousedown 鼠标按下，window.onmouseup鼠标松开，window.onmousemove鼠标移动，然后我们就可以根据这个距离计算旋转角度，并将旋转角度应用到贺卡、内容图像和阴影部分的 CSS 变换属性上，从而实现了贺卡的旋转效果。


具体实现

1、HTML部分，JS部分

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="book p3d">
        <!-- 右半本书 -->
        <div class="book-cover p3d">
            <div class="page back flip"></div>
            <div class="page front p3d">
                <div class="shadow"></div>
                <div class="pic"></div>
            </div>
        </div>
        <!-- 左半本书 -->
        <div class="front-cover p3d">
            <div class="page front flip p3d">
                <p>
                    嘿，杨文超，我的好兄弟！好久不见啊！时间过得真快，我一直都在想念我们曾经一起度过的那些美好时光。

我还记得我们一起笑过、闹过、拼搏过的日子，那些回忆依然清晰地印在我的脑海里。

虽然我们现在不常见面，但我想让你知道，你永远是我的好兄弟，无论何时何地，我都会在这里支持你。

希望我们有机会能尽快再次相聚，坐下来，聊聊近况，分享彼此的故事。

兄弟，我很想你，期待我们的下一次见面！
                </p>
            </div>            
            <div class="page back"></div>
        </div>
    </div>

<script>
   // 鼠标按住不放，才可以旋转书页。
        // 鼠标移动，旋转书页，鼠标松开，停止旋转。
    var hold = false
    var page = document.querySelector('.front-cover')
    var pic = document.querySelector('.pic')
    var shadow = document.querySelector('.shadow')
     // 根据鼠标移动的距离，计算旋转角度的函数
    var clamp = function(val, min, max) {
      return Math.max(min, Math.min(val, max))
    }

    // 鼠标按下
    window.onmousedown = function () {
      hold = true
    }
    // 鼠标松开
    window.onmouseup = function () {
      hold = false
    }

    window.onmousemove = function(e) {  // 摁住才能执行
      if (hold == true) {
         // 根据鼠标移动的距离，计算旋转角度
        var angle = clamp((window.innerWidth / 2 - e.pageX + 300) / 300 * -90, -180, 0)

        page.style.transform = `rotateY(${angle}deg)`;

        // pic 要立起来 饶x轴旋转  angle / 2
        pic.style.transform = `rotateX(${angle / 2}deg)`;
        // shadow 要倾斜x  angle / 8
        shadow.style.transform = `skewX(${angle / 8}deg)`;
      }
    }

  </script>
</body>
</html>
```

2、CSS部分

```
/* 消除body与html之间的默认边距 */
*{
    margin: 0;
    padding: 0;
    border: 0;
       /* ??? */
    box-sizing: border-box;
  }
  
  html{
        /* 继承浏览器的窗口的100%宽度和高度 */
    height: 100%;
  }
  body{
    height: 100%;
      /* 三种字体，浏览器如果加载不出来，会自动选择下一个字体 */
    font: 100%/1.25 Helvetica, arial, helvetica;
    color: #fff;
    /* 移动视角，形成立体效果 */
    perspective: 1000px;
     /* 背景渐变 */
    background: linear-gradient(to bottom, #444, #999);
  }
  
  .book{
    width: 300px;
    height: 300px;
    position: absolute;
    left: 50%;
    margin-left: -150px;
    top: 50%;
    margin-top: -150px;
     /* 3D效果 */
    /* 鼠标变成手型 */
    cursor: pointer;
    /* 禁止选中文本 */
    user-select: none;
    transform: rotateX(60deg);
  }
  
  .page{
    width: 300px;
    height: 300px;
    /* 1em 父容器的字体多大，1em就多大 */
    padding: 1em;
    position: absolute;
    left: 0;
    top: 0;
       /* 首行缩进2em */
    text-indent: 2em;
  }
  .front{
    background-color: #d93e2b;
  }
  .back{
    background-color: #fff;
  }
  .front-cover{
    /* 旋转时，围绕哪个基准点旋转，这里是Y轴的中心点 */
    transform-origin: 0 50%;
    transform: rotateY(-120deg);
  }
  .p3d{
    /* 表示不执行平展操作，他的所有子元素位于3D空间中 */
    transform-style: preserve-3d;
  }
  .front-cover .back{
    background-image: url(https://img2.baidu.com/it/u=2368431681,4265369131&fm=253&fmt=auto&app=138&f=JPEG?w=595&h=500);
    background-size: cover;
    transform: translateZ(3px);
  }
  .flip{
     /* 文字翻转 */
    transform: rotateY(180deg);
  }
  
  .shadow,
  .pic{
    width: 196px;
    height: 132px;
    position: absolute;
    left: 60px;
    top: 60px;
    transform-origin: 0 100%;
    transform: rotateX(-60deg);
  }
  
  .pic{
    background: url(./bg.jpg);
    background-size: cover;
  }
  .shadow{
    background-color: rgba(0, 0, 0, 0.5);
    transform: skewX(-15deg);
  }
```
