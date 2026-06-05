---
title: "阿里一面：瀑布流布局"
description: "一个问题：当我们在使用手机淘宝购物时，商品布局分成两列，有一个现象，为什么不设计成两列都对齐呢？这样不是更整齐划一吗？其实这里利用了一个心理学知识，就是当我们在浏览商品时，屏幕下方会露..."
date: "2025-05-06"
tags: ["CSS","JavaScript"]
draft: false
featured: false
---
一个问题：当我们在使用手机淘宝购物时，商品布局分成两列，有一个现象，为什么不设计成两列都对齐呢？这样不是更整齐划一吗？其实这里利用了一个心理学知识，就是当我们在浏览商品时，屏幕下方会露出一点商品图片，用户就会因为好奇心而浏览下一个商品，循环往复，这样就达到了留住用户的目的，所以商品排列方式设计成了错落有致的样式。那么像这样的布局方式，我们应该这么实现呢？


接下来请看我们的具体实现步骤


我们添加几个box用来放图片

```
<body>
    <div id="container">
        <div class="box">
            <div class="box-img">
                <img src="./img/1.webp" alt="">
            </div>
        </div>
        ...//10个
    </div>
 </body>
```

稍微写点样式方便观察

```
*{
    margin: 0; 
    padding: 0;
}
#container{
    position: relative;
}
.box{
    /* 浮动 */
    float: left;
    padding: 5px;
}
.box-img{
    width: 150px;
    padding: 5px;
    border: 1px solid green;
}
img{
    width: 100%;
}
```

接下来就能看见长这样

![](/images/articles/Snipaste_2024-04-23_20-21-01.png)

显然，这不是我们想要的瀑布流布局。

瀑布流

瀑布流布局是一种常见的网页布局方式，也常用于移动应用程序的界面设计。它的特点是将内容以不规则的方式排列，就像瀑布一样，因此得名。在瀑布流布局中，每个内容块的高度可以不同，但宽度通常相同或相近。这种布局方式可以有效地利用空间，适应不同尺寸和分辨率的屏幕，并且在移动设备上展现出色彩丰富、生动有趣的视觉效果。瀑布流布局通常用于展示图片、文章、产品等具有不同尺寸的内容，它的优点在于可以灵活地适应内容的变化，使页面看起来更加动态和吸引人。

核心思想

首先我们需要获取用户屏幕宽度，计算一行能放下几张图，将图片铺满第一行，当铺完这行后，下一张图片需要放到上一行最矮也就是高度最低的那一列下面。

OK，现在根据这个思想我们开始实现，1.首先我们需要要知道共有多少张图，一个box一个图片。通过document.querySelectorAll('#container .box')我们可以获取到这个容器里所有的box，返回一个装满box的数组ccontent。2.计算第一行能放下几张图片，获取box数组中图片的宽度，使用offsetWidth，一般这个宽度是相近的，然后用屏幕的宽度除以每张图片的宽度，我们就能拿到第一行能放几张图片num。当第一行排列好之后，我们需要排列第二行的第一张图片，根据上述思想，现在我们需要找到第一行中最矮的图片，也就是高度最小的图片。3.这里我们将第一行图片的高度用一个辅助数组boxHeight保存，数组的下标也就是图片的第几列，循环遍历我们的box数组，将前num张图片放在第一行，并且将每张图片的高度插入到boxHeight数组中，后ccontent.length-num张图片一张一张排列，我们只需要将新的图片和第一行中每列图片的高度进行比较，然后将这张图片加到数组中数值最小的那一列中，也就是第一行中最矮的那一列，更新数组的宽度。这样我们的每一张图片都能放在正确的位置。

最终效果

![](/images/articles/Snipaste_2024-04-23_23-42-51.png)

具体代码实现

1、HTML

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
    <div id="container">
        <div class="box">
            <div class="box-img">
                <img src="./img/1.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/2.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/3.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/4.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/5.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/6.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/7.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/8.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/9.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/10.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/1.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/2.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/3.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/4.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/5.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/6.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/7.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/8.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/9.webp" alt="">
            </div>
        </div>
        <div class="box">
            <div class="box-img">
                <img src="./img/10.webp" alt="">
            </div>
    </div>
    <script src="./index.js"></script>
</body>
</html>
```

2、JS

```
// 获取用户屏幕，计算一行能放下几张图
// 操作下一张图，将这张图放到上一行最矮的那一列下面

imgLocation('container','box');

function imgLocation(parent, content) {
    // 首先需要知道有多少张图，一个box一个图片，返回一个box的数组
    var ccontent = document.querySelectorAll('#container .box');
    // 返回container容器
    var cparent = document.getElementById(parent);
    // getChildElement(cparent, content);
    var imgWidth = ccontent[0].offsetWidth;//172
    var num = Math.floor(document.documentElement.clientWidth/imgWidth);//屏幕宽度/图片宽度=一行能放下多少张图
    cparent.style.width = `${num*imgWidth}px`;
    //获取每一列的高度
    var boxHeight = [];
    for(var i=0;i<ccontent.length;i++){
        if(i<num){
            boxHeight[i] = ccontent[i].offsetHeight;
        }else{
            // 超过一行的图片，找到最矮的一列
            var minHeight = Math.min.apply(null, boxHeight);
            var minIndex = boxHeight.indexOf(minHeight);
            // 将图片放到最矮的一列下面
            ccontent[i].style.position = 'absolute';
            ccontent[i].style.top = `${minHeight}px`;
            ccontent[i].style.left = ccontent[minIndex].offsetLeft + 'px';
            // 更新最矮的一列的高度
            boxHeight[minIndex] += ccontent[i].offsetHeight;
        }
    }
}
// 获取父容器中包含几个子元素box
function getChildElement(parent, child) {
    var childArr = [];
    // 获取容器container内所有的子标签
    var allChild = parent.getElementsByTagName('*');
    // 挑出所有的box标签
    for (var i = 0; i < allChild.length; i++) {
        if (allChild[i].className == child) {
            childArr.push(allChild[i]);
        }
    }
    console.log(childArr.length);
}


```

3、CSS

```
*{
    margin: 0; 
    padding: 0;
}
#container{
    position: relative;
}
.box{
    /* 浮动 */
    float: left;
    padding: 5px;
}
.box-img{
    width: 150px;
    padding: 5px;
    border: 1px solid green;
}
img{
    width: 100%;
}
```
