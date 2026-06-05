---
title: "每天一个小demo-时钟"
description: "用JavaScript实现一个时钟小demo demo效果如下 思路分析 1、首先是HTML部分，不难看出这里应该有一个clock大盒子用来设置时钟圆边的粉色部分，然后需要一个oute..."
date: "2025-06-27"
tags: ["浏览器","CSS"]
draft: false
featured: false
---
用JavaScript实现一个时钟小demo

demo效果如下

![](/images/articles/Snipaste_2024-04-19_22-23-40.png)

思路分析

1、首先是HTML部分，不难看出这里应该有一个clock大盒子用来设置时钟圆边的粉色部分，然后需要一个outer-clock-face盒子放底下那张图片，还有一个inner-clock-face盒子用来放上面那张图片，然后就是刻度部分，因为我们可以让上面的图片遮住中间部分，所以这里我们可以用6根小木棍marking盒子来表示刻度，其次就是指针，指针可以用三个盒子hour-hand，minute-hand，second-hand表示。

2、然后是css样式部分，大盒子应该要圆角，紫色边框，地下放图片的盒子应该是继承大盒子的宽高，并且也是圆角，然后是6个小木棍，有两个小木棍更粗，这里我们可以用伪元素来写，少写几行html代码，我们需要将六个小木棍放在正确的位置上，需要旋转，这里会有小木棍的位置细节问题，具体请看注释，然后其他盒子的样式依葫芦画瓢，这里就不作过多赘述了，具体问题请看注释。

3、js部分，我们需要根据当前时间调整盒子的角度，并且每秒实时更新盒子的角度，这样我们就实现这个简单的小demo啦。

具体实现

1、HTML部分

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="clock">
        <div class="outer-clock-face">
            <div class="marking marking-noe"></div>
            <div class="marking marking-tow"></div>
            <div class="marking marking-three"></div>
            <div class="marking marking-four"></div>
            <div class="inner-clock-face">
                <div class="hour-hand hand"></div>
                <div class="minute-hand hand"></div>
                <div class="second-hand hand"></div>
            </div>
        </div>
    </div>
    <script src="./clock.js"></script>
</body>
</html>

2、CSS部分

```
.clock {
    width: 300px;
    height: 300px;
    background-color: aqua;
    border-radius:50%;
    border: 7px solid rgb(246, 4, 141);
    position: relative;
    background-image: url(./bg.jpeg);
    background-size: 110%;
    padding: 20px;
    margin: 0 auto;
}

.outer-clock-face {
    width: 100%;
    height: 100%;
    border-radius:100%;
    position: relative;
}
/* 伪元素 行内元素*/
.outer-clock-face::before , 
.outer-clock-face::after  {
    content: "";
    width: 10px;
    height: 100%;
    background-color: rgb(15, 14, 14);
    /* 变成块级元素 */
    display: block;
    position: absolute;
    left: 50%;
    /* 元素将在水平和垂直方向上各自移动其自身宽度或高度的50%的距离 */
    transform: translate(-50%);
    border-radius: 8px;
}
.outer-clock-face::after {
    transform: rotateZ(90deg);
    transform-origin: center center;
}

.marking{
    width: 3px;
    height: 100%;
    background-color: rgb(15, 14, 14);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center center;
}

.marking-noe{
    /* 旋转角度：30deg; */
    transform: rotateZ(30deg);
}
.marking-tow{
    transform: rotateZ(60deg);
}
.marking-three{
    transform: rotateZ(120deg);
}
.marking-four{
    transform: rotateZ(150deg);
}

.inner-clock-face {
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: firebrick;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url(./bg.jpeg);
    background-size: cover;
    z-index: 1;
}

.hand {
    width: 50%;
    height: 6px;
    background: red;
    border-radius: 6px;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: 100% center;
    /* z-index 等级越高，盒子越在上层 */
    z-index: 2;
}

.hour-hand {
    width: 30%;
}


.minute-hand {
    width: 40%;
    height: 3px;
}


.second-hand {
    width: 45%;
    height: 2px;
    background: #b3b3b3;
}
```

3、JS部分

```
var secondHand = document.querySelector('.second-hand');
var minuteHand = document.querySelector('.minute-hand');
var hourHand = document.querySelector('.hour-hand');

// 时间初始化
function setTime() {
//获取当前时间对象
  var now = new Date();
//获取时，分，秒
  var seconds = now.getSeconds();
  var minutes = now.getMinutes();
  var hours = now.getHours();
//根据时间计算盒子的旋转角度
  var secondDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = 'rotate(' + secondDegrees + 'deg)';
  var minuteDegrees = ((minutes / 60) * 360) + 90;
  minuteHand.style.transform = 'rotate(' + minuteDegrees + 'deg)';
  var hourDegrees = ((hours / 12) * 360) + 90;
  hourHand.style.transform = 'rotate(' + hourDegrees + 'deg)';
}

setTime();

// 定时器
setInterval(setTime, 1000);
```
