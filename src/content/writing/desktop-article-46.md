---
title: "每天一个小demo-网易云年终报告"
description: "前言 接近年底，各大APP如微博、抖音、美团、饿了么、今日头条、网易云音乐等皆陆续推出年度报告或年度账单。这些可视化数据以报告的形式推送给用户，一方面承载了人们过去一年的故事和经历，同..."
date: "2025-06-23"
tags: ["浏览器","CSS"]
draft: false
featured: false
---
前言

接近年底，各大APP如微博、抖音、美团、饿了么、今日头条、网易云音乐等皆陆续推出年度报告或年度账单。这些可视化数据以报告的形式推送给用户，一方面承载了人们过去一年的故事和经历，同时也会承载用户的情绪和记忆。那么像这样的精美的年终报告，我们应该怎么写出来呢？接下来，就跟随着蘑菇头的脚步看一下这样的效果我们用前端是怎么写出来的吧！

需求

点击左上角图标，音乐开始播放，当再次点击时，音乐停止播放，图标更换。可以看见，画面中有一个在荡秋千的男人小帅和一些文字。

效果演示

<img src="/images/articles/Snipaste_2024-04-23_14-44-58.png" alt="Snipaste_2024-04-23_14-44-58" style="zoom:33.3%;" /><img src="/images/articles/Snipaste_2024-04-23_14-45-13.png" alt="Snipaste_2024-04-23_14-45-13" style="zoom:33.3%;" /><img src="/images/articles/Snipaste_2024-04-23_14-48-51.png" alt="Snipaste_2024-04-23_14-48-51" style="zoom:33.3%;" />

思路分析

1、HTML部分，媒体音乐我们用audio标签，图标一个盒子music-btn，整个页面我们用一个大盒子view包住，然后可以看到里面一个太阳盒子sun，接下来就是荡秋千的男人，这个男人他叫小帅，这里我们创建一个swing盒子用于装秋千，在这个盒子里面我们再创建小帅的各个身体，并通过CSS控制。

2、CSS部分，这里可以看到整个盒子有一个渐变色的过程，通过linear-gradient属性控制，荡秋千这个过程，我们是通过动画来完成的，首先对盒子进行旋转基准点进行定位transform-origin，然后添加动画并配合transform中的rotateZ旋转属性来实现荡秋千这样的效果，值得提一下调用动画animation的各个参数，动画名称: ani3_swing 2. 持续时间: 8s 3. 缓动函数: ease 4. 重复次数: infinite（无限循环）。接下来举一反三，小帅的腿脚头都可以用这样的方法实现，这里就不做过多赘述。

3、JS部分，主要需要写JS的逻辑的地方在控制图标切换，和音乐停止和开始播放，添加点击事件监听函数，设置当前播放状态，当点击播放图标，播放音乐，设置状态为false，更换图标，这里我们通过切换类名的方法来调节样式，获取当前盒子，调用toggle方法。切换播放状态我们可以这么写defaultMusicPlay = !defaultMusicPlay 优雅！

具体实现

1、HTML和JS

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>年度听歌报告</title>
    <!-- link可以引入很多种类型的文件，比如css、js、图片等等，这里我们引入了一个css文件 -->
    <link rel="icon" href="https://s1.music.126.net/style/favicon.ico">
    <!-- 引入图标 -->
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <!-- 媒体标签，用于播放音频 -->
    <audio id="j-bgm" src="./assets/bgm.mp3"></audio>
    <div class="music-btn off"></div>
    <div class="view special">
        <div class="sun"></div>
        <!-- 荡秋千 -->
        <div class="art">
            <div class="swing j-anim03 z-anim">
                <!-- 腿 -->
                <div class="leg2">
                    <div class="jiojio"></div>
                </div>
                <!-- 腿 -->
                <div class="leg1">
                    <div class="jiojio"></div>
                </div>
                <!-- 脖子 -->
                <div class="neck"></div>
                <!-- 头 -->
                <div class="head">
                    <div class="part"></div>
                </div>
            </div>
        </div>
        <!-- 特殊内容 -->
        <div class="paras">
            <p class="para f-animLineUp" style="transition-delay: 0.2s;">
                <em class="s-fcRed">11月11日</em>
            </p>
            <p class="para f-animLineUp" style="transition-delay: 0.3s;">
                大概是很特别的一天
            </p>
            <p class="para f-animLineUp" style="transition-delay: 0.4s;">
                这一天里
            </p>
            <p class="para f-animLineUp" style="transition-delay: 0.5s;">
                你把郑源的
                <em class="s-fcRed">《被伤过的心还可以爱谁》</em>
            </p>
            <p class="para f-animLineUp" style="transition-delay: 0.6s;">
                反复听了
                <em class="s-fcRed">10次</em>
            </p>
        </div>
    </div>
    <script>
        const viewSpecial = document.querySelector('.view .paras');
        const musicBtn = document.querySelector('.music-btn');
        let defaultMusicPlay = true;
        const bgMusic = document.querySelector('#j-bgm');
        //点击图表按钮，切换播放状态 通过切换类名的方法调节样式
        // 点击按钮切换播放状态
        musicBtn.addEventListener('click', () => {
            if (defaultMusicPlay) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
            // 切换播放状态
            defaultMusicPlay = !defaultMusicPlay;
            // 如果有这个类名off，则移除，没有则添加
            musicBtn.classList.toggle('off');
        });

        setTimeout(() => {
            viewSpecial.classList.add('z-enter')
        }, 1000)
    </script>
</body>

</html>
```

2、CSS

```
* {
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    height: 100%;
  }
  /* music 按钮 */
  .music-btn {
    top: 25px;
    left: 25px;
    z-index: 3;
    position: fixed;
    width: 40px;height: 40px;
    background: url(./assets/close.png)
    no-repeat center / cover;
    z-index: 999;
  }
  .music-btn.off {
    background-image: url(./assets/music.png);
  }
  .view {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  /* 第二屏 特殊 view special*/
  .view.special {
    position: absolute;
    background-image: 
    linear-gradient(60deg,#f8ddd1,#faece5 73%,#fad2c0);
  }
  /* 中间太阳 */
  .sun {
    position: absolute;
    top: 45%;
    width: 283px;
    height: 283px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/sun.a3f575ae2fef2cfdae15011e6081a094.png) no-repeat;
    background-size: 100%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  /* 秋千 外层压缩 */
  .art {
    transform: scale(.5);
    position: absolute;
    top: -140px;
    right: 0;
    width: 750px;
    height: 1334px;
    transform: scale(.5);
    transform-origin: top right;
  }
  /* 秋千动画 */
  .swing {
    display: block;
    position: absolute;
    left: 226px;
    top: -180.25px;
    width: 478px;
    height: 1038px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/swing.88545d6c8e1ac798465e367f8e5357ab.png) no-repeat;
    transform-origin: -16.10878661% -29.76878613%;
    /* aimation各个参数的作用: 1. 动画名称: ani3_swing 2. 持续时间: 8s 3. 缓动函数: ease 4. 重复次数: infinite */
    animation: ani4_qiuqian 6s cubic-bezier(.455,.03,.515,.955) infinite;
  }
  @keyframes ani4_qiuqian {
    0% {
      transform: rotateZ(0deg);
  }
  50% {
      transform: rotateZ(31.99359208deg);
  }
  100% {
      transform: rotateZ(0deg);
  }
  }
  /* 腿动画 */
  .swing .leg2 {
    display: block;
    position: absolute;
    left: 185.375px;
    top: 958px;
    width: 130px;
    height: 32px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/leg2.d7bc44a91b6974450f2ccc430846c63d.png) no-repeat;
    transform-origin: 91.1538461538462% 33.59375%;
    animation: ani7_leg2 8s ease infinite;
  }
  @keyframes ani7_leg2 {
    0% {
      transform: rotate(0deg);
  }
  25% {
      transform: rotate(-86.98199658deg);
  }
  50% {
      transform: rotate(0deg);
  }
  75% {
      transform: rotate(-86.98199658deg);
  }
  100% {
      transform: rotate(0deg);
  }
  }
  .swing .leg2 .jiojio {
    display: block;
    position: absolute;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/leg2-part.8f70bb7fc789a70bc78c48aa7718a765.png) no-repeat;
    left: -27.75px;
    top: -10.5px;
    width: 57px;
    height: 44px;
  }
  .swing .leg1 {
    display: block;
    position: absolute;
    left: 290.375px;
    top: 955.25px;
    width: 63px;
    height: 130px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/leg1.b1df6a7d1a794d36fbd0e1277733e1cf.png) no-repeat;
    transform-origin: 17.8571428571429% 13.3653846153846%;
    animation: ani5_leg1 8s ease infinite;
  }
  @keyframes ani5_leg1 {
    0% {
      transform: rotate(0deg);
  }
  25% {
      transform: rotate(108.97744399deg);
  }
  50% {
      transform: rotate(0deg);
  }
  75% {
      transform: rotate(108.97744399deg);
  }
  100% {
      transform: rotate(0deg);
  }
  }
  /* 腿的一部分 */
  .leg1 .jiojio {
    display: block;
    position: absolute;
    left: 26.25px;
    top: 102.5px;
    width: 39px;
    height: 62px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/leg1-part.f2f17703a6af8fd2af5e0f5a9f320623.png) no-repeat;
  }
  .swing .neck {
    position: absolute;
    left: 451.125px;
    top: 855.5px;
    width: 51px;
    height: 42px;
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/neck.07a0013beff9796ed79c2cea542e5af2.png) no-repeat;
  }
  /* 头 */
  .swing .neck, .swing .head {
    display: block;
    position: absolute;
    left: 451.125px;
    top: 855.5px;
    width: 51px;
    height: 42px;
  }
  /* 脖子 */
  .swing .neck {
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/neck.07a0013beff9796ed79c2cea542e5af2.png) no-repeat;
  }
  /* 头 */
  .swing .head {
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/head.90bf892023d7df0522a4b53fc07e38df.png) no-repeat;
    animation: ani2_head 8s ease infinite;
  }
  /* 头发 */
  .swing .head .part {
    background: url(https://s5.music.126.net/static_public/5c21db8d4684556c72180904/head-part.22d4381c4bd6cb1c3afd2b1bfcfe22f1.png) no-repeat;
    left: 20px;
    top: 2px;
    width: 40px;
    height: 47px;
    position: absolute;
  }
  @keyframes ani2_head {
    0% {
      transform: rotate(0deg);
  }
  25% {
      transform: rotate(-55deg);
  }
  62.5% {
      transform: rotate(-55deg);
  }
  87.92% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(0deg);
  }
  }
  /* 特殊的内容 */
  .paras {
    bottom: 110px;
    left: 10.67%;
    position: absolute;
    line-height: 1.6667;
    letter-spacing: 1px;
    color: #333;
  }
  .s-fcRed {
    color: #df493a;
  }
  .z-enter .f-animLineUp {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1.2s,transform 1s;
  }
  .f-animLineUp {
    opacity: 0;
    transform: translateY(6px);
  }
  em, i {
    font-style: normal;
    text-align: left;
  }
  
```

结语

这里我们主要学习了transform属性配合动画keyframes实现荡秋千这么一个效果，JS方面我们学习了通过加类名和取消类名的方式来控制样式。OK，今天的分享就到此结束啦，欢迎下次再见！
