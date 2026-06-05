---
title: "十万条数据渲染到页面上如何优化"
description: "前言 今天我们聊聊面试中常问的场景题，后端给你返回了十万条数据，现在需要你将这些数据渲染在页面上，你会如何进行优化？ 我们知道，如果将数据一次性渲染在页面上，由于数据量过于庞大必然会造..."
date: "2025-09-03"
tags: ["Vue","后端"]
draft: false
featured: false
---
### 前言

今天我们聊聊面试中常问的场景题，后端给你返回了十万条数据，现在需要你将这些数据渲染在页面上，你会如何进行优化？

我们知道，如果将数据一次性渲染在页面上，由于数据量过于庞大必然会造成页面的卡顿或者用户体验不佳，主要是因为回流重绘的次数太多，所以我们需要一种方案来进行优化操作。

### 正文

我们通过一个小demo来简单模拟一下场景。

我有一个ul，里面需要渲染很多个li有十万条，通常情况下我们是使用一个for循环来实现，创建一个li的dom结构然后添加数据，插入到ul中，就像下面这样。我们通过计时可以发现，渲染这十万条li耗时是非常久的。

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <ul id="container"></ul>
  <script>
    let ul = document.getElementById("container");
    const total = 100000
    let now = Date.now();
    for (let i = 0; i < total; i++) {
      let li = document.createElement("li")
      li.innerHTML = (Math.random() * total)
      ul.appendChild(li)
    }
    console.log('js运行耗时：', Date.now() - now);
    setTimeout(() => {
      console.log('页面加载总时长：', Date.now() - now);
    })
  </script>
</body>
</html>
```

![](/images/articles/Snipaste_2024-09-19_16-52-17.png)

这里一个小细节就是我们通过setTimeout来计算渲染的时长，那是因为事件循环机制是先进行ui的渲染然后再执行宏任务队列，所以我们可以这样子拿到渲染的时间。

#### 方法一 时间分片

我们可以使用一个定时器分批次渲染数据，每次只渲染20条数据，递归调用。这样我们就将在一次事件循环完成的事情拆分成多次事件循环，实现优化的效果。

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <ul id="container"></ul>
  <script>
    let ul = document.getElementById("container");
    const total = 100000
    let once = 20
    let page = total / once
    let index = 0
    function loop(curTotal, curIndex) { //curTotal当前需要渲染的数据数目，curIndex渲染到第几条数据
      let pageCount = Math.min(once, curTotal)
      setTimeout(() => {
        for (let i = 0; i < pageCount; i++) {
          let li = document.createElement("li")
          li.innerHTML = curIndex + i + ':' + ~~(Math.random() * total)
          ul.appendChild(li)
        }
        loop(curTotal - pageCount, curIndex + pageCount)
      })
    }
    loop(total, index)
  </script>
</body>
</html>
```

但是因为定时器时间不精准，页面刷新时间和定时器执行时间对不上，所以当用户滑动过快时会造成白屏的问题。我们可以通过requestAnimationFrame这个api解决这个问题，这个api是根据用户的屏幕刷新率来执行的一个定时器，只需换一个api即可。

```
function loop(curTotal, curIndex) {
      let pageCount = Math.min(once, curTotal)
      requestAnimationFrame(() => {
        for (let i = 0; i < pageCount; i++) {
          let li = document.createElement("li")
          li.innerHTML = curIndex + i + ':' + ~~(Math.random() * total)
          ul.appendChild(li)
        }
        loop(curTotal - pageCount, curIndex + pageCount)
      })
}
```

在这个方法里，我们还可以利用文档碎片createDocumentFragment这个api来减少回流重绘的次数，它可以用来存储临时的dom，然后一次性将所有的dom更新到页面上。

```
 function loop(curTotal, curIndex) {
      let pageCount = Math.min(once, curTotal)
      requestAnimationFrame(() => {
        let fragment = document.createDocumentFragment()
        for (let i = 0; i < pageCount; i++) {
          let li = document.createElement("li")
          li.innerHTML = curIndex + i + ':' + ~~(Math.random() * total)
          fragment.appendChild(li)
        }
        ul.appendChild(fragment)
        loop(curTotal - pageCount, curIndex + pageCount)
      })
}
```

#### 方法二 虚拟列表

为了模拟真实场景，我们将战场转到vue中。

虚拟列表的核心思想就是维护一个可视区域，比如固定高度的一个ul或者div，列表数据只会在可视区域内渲染，有点类似数组的滑动窗口的意思，当用户滚动时，更新可视区域的数据。

我们定义一个List组件

```
<template>
  <div ref="listRef" class="infinite-list-container" @scroll="scrollEvent()">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div class="infinite-list-item" v-for="item in visibleData" :key="item.id"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
```

在template模版内，有三个div。

infinite-list-container定义了一个滚动事件，将来当用户滚动时，通过在scrollEvent滚动事件里面更新start和end位置来更新visibleData来实现一个虚拟列表的效果。

infinite-list-phantom是一个空容器，为了支持infinite-list-container能够滚动，因为infinite-list-container容器只会渲染固定高度的数据，没有超出就无法滚动，所以这个容器的高度为整个10万条数据的高度。

infinite-list用来放数据，这里v-for循环的数据是通过定义一个起始位置start和终止位置end来截取整个数据项的数据，也就是要得到可视区域的数据来进行渲染。

所以通过以上介绍，我们需要再script中定义这些东西。

```
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

const props = defineProps({
  listData: [], // 10万条数据
  itemSize: { // 每一条数据的高度，默认50px
    type: Number,
    default: 50
  }
})

const state = reactive({
  screenHeight: 0, // infinite-list-container 高度
  startOffset: 0, // 列表偏移量
  start: 0,
  end: 0
})

// 可视区显示的数据条数
const visibleCount = computed(() => {
  return state.screenHeight / props.itemSize
})
// 可视区域显示的真实数据
const visibleData = computed(() => {
  return props.listData.slice(state.start, Math.min(state.end, props.listData.length))
})
// 当前列表总高度
const listHeight = computed(() => {
  return props.listData.length * props.itemSize
})
// 由于css定位，list跟着父容器移动了，现在列表要移动回来
const getTransform = computed(() => {
  return `translateY(${state.startOffset}px)`
})

const listRef = ref(null)
onMounted(() => {
  state.screenHeight = listRef.value.clientHeight
  state.end = state.start + visibleCount.value
})

const scrollEvent = () => { // 用户滚动时，重新计算起始位置和终止位置，并且计算偏移量
  let scrollTop = listRef.value.scrollTop
  state.start = Math.floor(scrollTop / props.itemSize)
  state.end = state.start + visibleCount.value
  state.startOffset = scrollTop - (scrollTop % props.itemSize)
}

</script>
```

这是css

```
<style lang="css" scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
}

.infinite-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
}

.infinite-list-item {
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
</style>
```
