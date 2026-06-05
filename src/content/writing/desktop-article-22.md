---
title: "前端实战-手写一个验证码"
description: "前言 今天我们使用canvas手写一个验证码，Canvas 是 HTML5 中新增的一个用于图形绘制的元素。通过使用相关的 API，在js代码中我们可以设置绘图上下文、指定线条样式、填..."
date: "2025-09-27"
tags: ["CSS","JavaScript"]
draft: false
featured: false
---
前言

今天我们使用canvas手写一个验证码，Canvas 是 HTML5 中新增的一个用于图形绘制的元素。通过使用相关的 API，在js代码中我们可以设置绘图上下文、指定线条样式、填充颜色等，从而实现丰富多样的图形效果。

效果


首先需要一个画布，在里面绘制数字和字母，绘制干扰项，线条和圆点，这些我们都用canvas来绘制。设置一个按钮，点击它实现换一换的功能。

具体思路

- 首先我们先来两个辅助函数，一个用于随机生成指定范围的随机值，一个用于随机生成颜色
- 接下来是主要的绘制函数，拿到画布，设置画布颜色，大小等等。
- 绘制数字，使用for循环拿到随机池里的数字和字母
- 绘制线条
- 绘制圆点

具体代码

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <canvas id="canvas" width="120" height="40"></canvas></br>
    <button id="btn">换一换</button>
    <script>
        let pool = 'ABCDEFGHIJKLMOPQRSTUVWXYZ0123456789'
        //随机生成min到max的随机值
        function randomNum(min, max) {
            // Math.random 默认生成0-1的随机值
            return Math.floor(Math.random() * (max - min) + min)
        }
        //随机颜色
        function randColor(min, max) {
            const r = randomNum(min, max);
            const g = randomNum(min, max);
            const b = randomNum(min, max);
            return `rgb(${r},${g},${b})`
        }
        //绘制数字
        function draw() {
            let canvas = document.getElementById('canvas'),
                ctx = canvas.getContext('2d');
            ctx.fillStyle = randColor(180, 230);
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            let code = ''
            for (let i = 0; i < 4; i++) {
                const text = pool[randomNum(0, pool.length)]
                code += text;
                const fontSize = randomNum(18, 40)
                const deg = randomNum(-30, 30)
                ctx.font = fontSize + 'px Simhei'
                ctx.textBaseline = 'top'
                ctx.fillStyle = randColor(80, 150)
                ctx.save()//将当前状态封存入
                ctx.translate(30 * i + 15, 15)
                ctx.rotate((deg) * Math.PI / 180)
                ctx.fillText(text, -10, -15)
                ctx.restore();//提笔
            }
            //随机生成干扰线条
            for (let i = 0; i < 5; i++) {
                ctx.beginPath()
                ctx.moveTo(randomNum(0, canvas.width), randomNum(0, canvas.height))
                ctx.lineTo(randomNum(0, canvas.width), randomNum(0, canvas.height))
                ctx.strokeStyle = randColor(100, 200)
                ctx.closePath()
                ctx.stroke()
            }
            //随机生成干扰圆点
            for (let i = 0; i < 40; i++) {
                ctx.beginPath();
                // 画个圆形 坐标 半径 开始弧度 弧度长度
                ctx.arc(randomNum(0, canvas.width), randomNum(0, canvas.height), 1, 0, 2 * Math.PI)
                // 设置颜色
                ctx.fillStyle = randColor(100, 200)
                ctx.closePath()
                ctx.fill()
            }
        }
        draw()
        let btn = document.getElementById('btn')
        btn.addEventListener('click', () => {
            draw();
        })
    </script>
</body>

</html>
```
