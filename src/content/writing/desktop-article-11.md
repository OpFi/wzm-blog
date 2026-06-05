---
title: "Vue组件之间的通信"
description: "Vue组件父子之间的通信 前言 我们知道，在Vue中是组件化开发，每个组件通常负责特定的功能或界面部分。为了构建一个复杂的应用程序，不同的组件需要互相协作，这就需要组件之间进行通信，今..."
date: "2025-11-10"
tags: ["Vue","CSS"]
draft: false
featured: false
---
Vue组件父子之间的通信

### 前言

我们知道，在Vue中是组件化开发，每个组件通常负责特定的功能或界面部分。为了构建一个复杂的应用程序，不同的组件需要互相协作，这就需要组件之间进行通信，今天我们聊聊Vue中父子之间的通信。

案例演示：现在我们有一个input输入框，和一个点击添加数据的按钮，当我们在输入框中输入完内容后，将数据渲染在页面上。效果如下：

![](/images/articles/Snipaste_2024-06-26_12-03-28.png)

### 父子组件通信 父->子

父组件使用v-bind绑定一个值，子组件使用defineProps接收

数据源位置：父组件

父组件功能：点击按钮添加数据value进数据源list

子组件功能：将父组件传过来的数据源list渲染

父组件：

```
<template>
  <div class="input-group">
    <input type="text" v-model="value">
    <button @click="add">添加</button>
  </div>
  <Child :list="list"></Child>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Child from '@/components/Child.vue'
const value = ref('')
const list = reactive([1,2,3])
function add(){
  list.push(value.value)
}
</script>

<style lang="css" scoped>

</style>
```

主要是在子组件标签中通过v-bind绑定数据

子组件：

```
<template>
    <div class="child">
    <ul>
      <li v-for="item in list">{{ item }}</li>
    </ul>
  </div>
</template>
<script setup>
defineProps({
    list:{
        type:Array,
        default:()=>{//如果没有数据，默认是空数组
            return [];
        }
    }
})
</script>

<style lang="css" scoped>

</style> 
```

通过defineProps接收数据

### 子父组件通信（一）emits订阅 子->父

子组件使用defineEmits创建一个事件参数为事件名，然后发布这个事件带上value，父组件使用@订阅这个事件,通过事件参数获取子组件获取这个value。

数据源位置：父组件

父组件功能：将子组件传过来的数据value添加进list，然后渲染

子组件功能：点击按钮将数据value传给父组件

子组件：

```
<template>
    <div class="input-group">
        <input type="text" v-model="value">
        <button @click="add">添加</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('')
const emits = defineEmits(['add'])//创建一个add事件
function add() {
    //将value给到父组件
    emits('add', value.value) //发布事件
}
</script>

<style lang="scss" scoped></style>
```

父组件：

```
<template>
    <!-- 订阅add事件 -->
   <Child @add="handle"></Child> 
  <div class="child">
    <ul>
      <li v-for="item in list">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import Child from '@/components/Child2.vue'
import { reactive } from 'vue';
const list = reactive([1,2,3])
const handle = (e)=>{
    // console.log(123);
    list.push(e)
}
</script>

<style lang="css" scoped>

</style>
```

### 子父组件通信（二）v-model 子->父

父组件借助v-model将数据绑定给子组件，子组件创建'update:list'事件，并将接收到的数据修改后emits出来

数据源位置：父组件

父组件功能：将数据源list传给子组件，然后拿着子组件传过来的修改后的新数据源list渲染

子组件功能：点击按钮获取到输入框的value值，将value更新到父组件传过来的list，返回一个新的list给父组件

父组件：

```
<template>
   <Child v-model:list="list"></Child> 
  <div class="child">
    <ul>
      <li v-for="item in list">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import Child from '@/components/Child3.vue'
import { reactive } from 'vue';
const list = reactive([1,2,3])

</script>

<style lang="css" scoped>

</style>
```

子组件：

```
<template>
    <div class="input-group">
        <input type="text" v-model="value">
        <button @click="add">添加</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('')
const props = defineProps({
    list:{
        type:Array,
        default:[]
    }
})

const emits = defineEmits(['update:list'])
function add() {
    // props.list.push(value.value) //虽然可行，但是不要直接操作父组件给过来的数据，会造成数据流紊乱
    const arr = props.list
    arr.push(value.value)
    emits('update:list',arr)
}
</script>

<style lang="scss" scoped></style>
```

### 子父组件通信（三）ref引用 子->父

父组件通过ref获取子组件中defineExpose暴露出来的数据

数据源位置：子组件

父组件功能：使用ref获取子组件的dom结构，拿到暴露的数据然后渲染

子组件功能：点击按钮将数据value添加进list，然后使用defineExpose将list暴露给父组件

父组件：

```
<template>
    <Child ref="childRef"></Child> 
   <div class="child">
     <ul>
           <!-- ? 获取到子组件的值时即childRef有值时渲染数据 -->
       <li v-for="item in childRef?.list">{{ item }}</li>
     </ul>
   </div>
 </template>
 
 <script setup>
 import Child from '@/components/Child4.vue'
 import { ref } from 'vue';
 const childRef = ref(null) //子组件的dom结构
 </script>
 
 <style lang="css" scoped>
 
 </style>
```

子组件：

```
<template>
    <div class="input-group">
        <input type="text" v-model="value">
        <button @click="add">添加</button>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
const list = reactive([1,2,3])
const value = ref('')
function add() {
list.push(value.value)
}
defineExpose({list})//将子组件的变量暴露出来，父组件才能获取的到
</script>

<style lang="scss" scoped></style>
```

总结

今天我们聊了Vue中组件中父子组件之间相互通信的方法，父传子有一种，子传父有三种方法。
