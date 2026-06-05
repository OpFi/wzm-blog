---
title: "面试官：你知道几种三栏布局方法？"
description: "前言 三栏布局，见名知意，就是一种三列的布局方式。这种布局方式十分常见，正如掘金的官网就是一个正儿八经的三栏布局，那么像这样的布局我们应该如何实现呢？这其中又有哪些是需要我们注意的呢？..."
date: "2025-05-02"
tags: ["CSS"]
draft: false
featured: false
---
前言

三栏布局，见名知意，就是一种三列的布局方式。这种布局方式十分常见，正如掘金的官网就是一个正儿八经的三栏布局，那么像这样的布局我们应该如何实现呢？这其中又有哪些是需要我们注意的呢？欢迎各位客官大老爷阅读本篇文章。

![](/images/articles/Snipaste_2024-05-23_18-14-00.png)

问题

三栏布局实现起来非常简单，就是一个page盒子里面放三个小盒子嘛，左边一个中间一个，右边一个。但是这不是我们想要的三栏布局。我们知道代码是一行一行往下执行的，所以这样的html排列方式会导致我们最左边的盒子优先被加载，这不是我们想要的效果，我们想要主体内容优先加载，两边的次要内容后加载。这样我们就需要将主体内容的html往前提，但是其布局的样式会被改变，有没有办法可以恢复其布局样式呢又能将主体内容的html往前提呢？有，我们可以通过以下几种CSS的方式改变其样式。

第一种 圣杯布局

使用浮动将盒子去到同一行，page 盒子使用 padding 左右两边盒子大小用于缩小控制中间主体内容范围，使用相对定位 left 100%和magin-left -自身盒子宽度控制左边的盒子位置，使用相对定位left -自身盒子宽度和magin-left -自身盒子宽度控制右边盒子位置。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .page{
            height: 200px;
            padding: 0 200px;
        }
    .left, .right{
        height: 200px;
        width: 200px;
        background-color: pink;
    }
    .item{
        float: left;
    }
    .content{
        height: 200px;
        width: 100%;
        background-color: aqua;
    }
    .left{
        margin-left: -200px;
        position: relative;
        left: -100%;
    }
    .right{
        margin-left: -200px;
        position: relative;
        right: -200px;
    }
    </style>
</head>
<body>
    <div class="page">
        <div class="item content">
            主体内容
        </div>
        <div class="item left">
            广告位
        </div>
        <div class="item right">
            广告位
        </div>
    </div>
</body>
</html>
```

第二种 双飞翼布局

在主体内容content再加一个盒子inner用于放主体内容，使用浮动将三个盒子去到同一行，给 inner 加 margin: 0 左右盒子宽度，使用magin-left -100% 控制左边盒子 使用magin-left -自身盒子宽度控制右边盒子

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .page{
            height: 200px;
        }
    .left, .right{
        height: 200px;
        width: 200px;
        background-color: pink;
    }
    .item{
        float: left;
    }
    .content{
        height: 200px;
        width: 100%;
        background-color: aqua;
    }
    .inner{
        margin: 0 200px;
        height: 100%;
    }
    .left{
        margin-left: -100%;
    }
    .right{
        margin-left: -200px;
    }
    </style>
</head>
<body>
    <div class="page">
        <div class="item content">
            <div class="inner">主体内容</div>
        </div>
        <div class="item left">
            广告位
        </div>
        <div class="item right">
            广告位
        </div>
    </div>
</body>
</html>
```

第三种 弹性布局 + order

使用弹性布局将三块内容去到同一行，使用flex 1 给中间主体内容自动填充整个父盒子，两边盒子固定宽度，使用order设置弹性盒子的子元素排列顺序，但是并不是优先加载，加载还是要看html结构

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .page {
            height: 200px;
            display: flex;
        }
        .left,
        .right {
            width: 200px;
            background-color: pink;
        }
        .content {
            flex: 1;
            background-color: aqua;
            /* order设置弹性盒子的子元素排列顺序，但是并不是优先加载，加载还是要看html结构*/
            order: 1;
        }
        .left {
            order: 0;
        }
        .right {
            order: 2;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="item content">
            主体内容
        </div>
        <div class="item left">
            广告位
        </div>
        <div class="item right">
            广告位
        </div>
    </div>
</body>
</html>
```

第四种 表格布局

使用display:table给page盒子设置成表格布局，并且需要设置宽度为屏幕宽度，使用table-layout: fixed设置里面的表格列宽由表格宽度和列宽度设定，给三个盒子添加display: table-cell 让标签元素以表格单元格的形式呈现

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .page {
            height: 200px;
            width: 100vw;
            /* 表格布局 */
            display: table;
            /* 列宽由表格宽度和列宽度设定。 */
            table-layout: fixed;
        }
        .left,
        .right {
            height: 200px;
            width: 200px;
            background-color: pink;
        }
        .content {
            width: 100%;
            height: 200px;
            background-color: aqua;
        }
        .item {
            /* 让标签元素以表格单元格的形式呈现 */
            display: table-cell;
        }  
    </style>
</head>
<body>
    <div class="page">
        <div class="item left">
            广告位
        </div>
        <div class="item content">
            主体内容
        </div>
        <div class="item right">
            广告位
        </div>
    </div>
</body>
</html>
```

第五种 网格布局

使用display: grid 给page设置为网格布局，使用grid-template-columns: 200px auto 200px 制作三列网格容器

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .page {
            height: 200px;
            /* 网格布局 */
            display: grid;
            /* 三列 */
            grid-template-columns: 200px auto 200px;
        }
        .left,
        .right {
            height: 200px;
            background-color: pink;
        }
        .content {
            height: 200px;
            background-color: aqua;
        }      
    </style>
</head>
<body>
    <div class="page">
        <div class="item left">
            广告位
        </div>
        <div class="item content">
            主体内容
        </div>
        <div class="item right">
            广告位
        </div>
    </div>
</body>
</html>
```

总结

这五种布局方式都是巧妙的利用了CSS灵活的特性，实现了三栏布局。今天我们学习了三栏布局，分别是圣杯布局，双飞翼布局，弹性布局+order，表格布局，网格布局。每种布局都各有其特点，蘑菇头比较喜欢弹性布局+order的方式，你呢？
