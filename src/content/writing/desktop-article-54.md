---
title: "组件-评分"
description: "前言 今天我们做一个组件 评分组件，想必大家在用vant4的时候看到过这个组件吧，非常好用，但是叫我们实现一下这个组件你会吗？接下来就跟随者蘑菇头的脚步一起来看看吧。 主要功能 当我们..."
date: "2025-05-22"
tags: ["Vue","CSS"]
draft: false
featured: false
---
前言

今天我们做一个组件-评分组件，想必大家在用vant4的时候看到过这个组件吧，非常好用，但是叫我们实现一下这个组件你会吗？接下来就跟随者蘑菇头的脚步一起来看看吧。

![](/images/articles/Snipaste_2024-07-13_17-36-11.png)

主要功能

当我们的鼠标放在某一颗星星上时，就亮起从左到右的星星，当我们的鼠标移开时星星回到原始不亮的状态，当我们在某一颗星星身上点击确定并且鼠标挪开时，亮起的星星数即分数保持不变。

![](/images/articles/Snipaste_2024-07-13_17-49-48.png)

思路过程

组件肯定要满足的功能就是复用性，所以我们的分数肯定是放在父组件的，子组件有一个props叫score。子组件通过接收父组件传过来的值来判断显示几颗星星，这很容易实现，但是当我们的鼠标放在某一颗星星上时，就亮起从左到右的星星，意味着我们需要频繁的修改这个分数，而且还是子组件来通知，所以肯定涉及到子父通讯。

所以我们的app.vue长这样。

```
<template>
  <Rate :score="score" theme="yellow" @update-score="updateScore"></Rate>

</template>

<script setup>
import { ref } from 'vue';
import Rate from './components/Rate.vue';

let score = ref(0);
function updateScore(num){//num为子组件传过来的值
  score.value = num;
}

</script>

<style lang="scss" scoped>

</style>
```

在子组件里面我们会定义一个update-score事件，将子组件将最后确定下来的分数传给父组件，父组件再通知子组件修改分数即可。

接下来我们看子组件rate.vue

```
<template>
    <div :style="fontStyle">
        <div class="rate" @mouseout="mouseOut">
            <span class="rate star" @mousemove="mouseOver(num)" v-for="num in 5" :key="num">☆</span>
            <span class="hollow" :style="fontWidth">
                <span class="star" @click="onRate(num)" @mousemove="mouseOver(num)" v-for="num in 5" :key="num" >★</span>
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed,defineEmits,ref } from 'vue';

const props = defineProps({
    score:{
        type:Number,
        default:0
    },
    theme:{
        type:String,
        default:"bule"
    }
})

let themeObj = {//主题颜色
    black:"#000000",
    yellow:"#ffd700",
    bule:"#1e90ff",
    red:"#ff0000",
}
let fontStyle = computed(()=>{//根据父组件传过来的值来更改主题
    return `color:${themeObj[props.theme]};`
})

let width = ref(props.score) //根据分数来修改实心星星父盒子的宽度
let emits = defineEmits(["update-score"])
const fontWidth = computed(()=>{//渲染实心星星父盒子的宽度
    return `width:${width.value}em;`
})

const mouseOver = (num)=>{//鼠标经过时，修改宽度
    width.value = num
}

const mouseOut = ()=>{//鼠标移开时，恢复到初始值
    width.value = props.score
}

const onRate = (num)=>{//子向父传值
    emits("update-score",num)
}

</script>

<style lang="css" scoped>
body{
    font-family: sans-serif;
}
.rate{
    position: relative;
    display: inline-block;
}
.rate > span.hollow{
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    overflow: hidden;
}
.star{
    letter-spacing: 3px;
}
</style>
```

这里有一个小技巧，就是我们先渲染5颗空星星和5颗实心星星这样我们就得到了10颗星星，然后我们通过css样式将这两种星星重叠，根据分数来修改实心星星父盒子的宽度来显示几颗星星。
