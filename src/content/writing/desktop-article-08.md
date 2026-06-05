---
title: "Vue+OpenAi实现一个简单的对话聊天功能"
description: "Vue+OpenAi无后端实现一个简单的对话聊天功能 前言 今天，蘑菇头带来的小项目是一个纯前端用http请求的方式来调用OpenAi接口的项目，实现一个简单的对话聊天功能，相信了解这..."
date: "2025-11-22"
tags: ["Vue","AI"]
draft: false
featured: false
---
Vue+OpenAi无后端实现一个简单的对话聊天功能

### 前言

今天，蘑菇头带来的小项目是一个纯前端用http请求的方式来调用OpenAi接口的项目，实现一个简单的对话聊天功能，相信了解这个项目之后，你也能在你的项目中添加这个功能，大家快快操练起来吧。

### 效果

![](/images/articles/Snipaste_2024-07-07_22-26-38.png)

可以在输入框中输入你想要问的问题，gpt会回答你的问题。点击设置，可以重新设置你的Api key，在输入框中重新输入你的Api key，即可继续使用。

![](/images/articles/Snipaste_2024-07-07_22-36-01.png)

### 前置工作

1. 我们先创建一个vue的项目，使用`npm create vue@latest`，选项我们只需要一个路由就行。记得`npm i `安装依赖。

![](/images/articles/Snipaste_2024-06-22_21-22-04.png)

2. 我们将vue默认生成的一些样式和文件删除，assets下的文件全部删除，components文件夹删除，views文件夹下的文件全部删除，我们需要将在其他地方引用这些文件的代码删除，`main.js`下删除`import './assets/main.css'`，`router`文件夹下的`index.js`的路由清空，将`routes`置为空数组，这行删除`import HomeView from '../views/HomeView.vue'`。将`app.vue`清空。这样我们就的到了一个非常干净的vue项目了。

3. 获取OpenAi的`Api Key`，由于考虑到有些掘友可能还没有墙，这里我们使用一个国内代理转发的一个网站https://dash.302.ai。这个网站可以拿到可用的`Api Key`。登录成功后，会免费送1ptc的额度，也能去充值。

![](/images/articles/Snipaste_2024-07-07_15-18-32.png)

4. 创建Api Key，点击左边列表的Api超市，Api管理，添加Api，记住这个ApiKey，接下来发送请求时会用到。

![](/images/articles/Snipaste_2024-07-07_15-19-24.png)

5. 测试这个key是否有效，我们去到Apifox接口测试网站[apifox.com/apidoc/project-4012774/endpoint-147522039](https://apifox.com/apidoc/project-4012774/endpoint-147522039)进行测试。选择chat，点击调试

![](/images/articles/Snipaste_2024-07-07_15-30-10.png)

​	点击去设置Api key，将刚刚保存好的key填入点击保存即可。

![](/images/articles/Snipaste_2024-07-07_15-31-24.png)

然后点击发送，看到请求200，并且数据成功返回代表请求成功。

![](/images/articles/Snipaste_2024-07-07_15-32-00.png)


OK，前置工作我们就结束了，让我们开始愉快的开始开发吧。

### 开始开发

1. app.vue

只有一个路由路口，我们会在路由配置里面配置`/`路径为Home.vue

```
<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
```

2. 我们先把路由配置好，在router文件夹下的index文件下。

```
import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {
        path: '/',
        component: () => import('../views/Home.vue')
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
```

3. 我们将向OpenAi发送请求的代码封装成为一个工具函数，它接收两个参数，一个是消息列表，一个是你的Apikey，返回结果为json格式化的数据。在src文件夹下创建libs文件夹，然后在里面创建gpt.js。

```
export async function chat(messageList,apiKey){
    try{
        const result = await fetch("https://api.302.ai/v1/chat/completions",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${apiKey}`
            },
            body:JSON.stringify({
                model:'gpt-3.5-turbo',
                messages:messageList,
            })
        })
        const data = await result.json()
        return data
    }catch(error){
        throw(error)
    }
}
```

可以发现，用**http请求**的方式来调用OpenAi的接口，他的key是放在请求头中，而模型类型和message等等相关配置他是放在请求体当中。这里有两个await 同步操作，第一个是为了将从OpenAi获取的数据拿到后再进行后面的操作，第二个是为了将从OpenAi拿到的数据json格式化后再返回。

4. 在编写Home.vue 之前我们先安装一个css库，为接下的css开发进行简化。**tailwindcss** 原子级别的css。它是一个高度可定制的低级 CSS 框架，旨在快速构建自定义用户界面。这是官网https://tailwind.nodejs.cn/

```
npm install -D tailwindcss
npx tailwindcss init
```

里面的开发文档对新手十分友好，相信聪明的你很快就能配置好并且使用它。

5. 编写Home.vue

```
<template>
    <div class="flex flex-col h-screen pt-20">
        <div class="flex flex-nowrap fixed
         w-full items-baseline top-0 px-6 py-4 bg-gray-100">
            <div class="text-2xl font-bold">ChatGPT</div>
            <div class="ml-4 text-sm text-gray-500">
                基于 OpenAI 的 ChatGPT自然语言模型人工智能对话
            </div>
            <div class="ml-auto px-3 py-2 text-sm
             cursor-pointer hover:bg-white rounded-md" @click="clickConfig()">
                设置
            </div>
        </div>
        <div class="flex-1 ml-3">
            <div class="mt-5 flex">
                <i class="iconfont icon-gpt text-4xl"></i>
                <div class="ml-4 bg-gray-100 leading-10 h-10 rounded-md	px-4">你好，请问有什么可以帮你</div>
            </div>
            <div class="mt-5 " v-for="ask in state.askData">
                <div class="flex">
                    <i class="iconfont icon-user text-4xl"></i>
                    <div class="ml-4 bg-gray-100 leading-10 h-10 rounded-md	px-4">{{ ask.userAsk }}</div>
                </div>
                <div class="flex mt-5">
                    <i class="iconfont icon-gpt text-4xl"></i>
                    <div class="ml-4 bg-gray-100 leading-10 h-10 rounded-md	px-4">{{ ask.gptResponse }}</div>
                </div>
            </div>
        </div>
        <div class="sticky bottom-0 w-full p-6 pb-8 bg-gray-100 flex-shrink-0 flex-grow-0 basis-20">
            <div v-if="isConfig" class="mb-2 text-sm text-gray-500">
                请输入 API key:
            </div>
            <div class="flex">
                <input class="input" :type="isConfig ? 'password' : 'text'" :placehold="isConfig ? 'sk-xxxxxx' : '请输入'"
                    v-model="messageContent" @keydown.enter="sendOrSave()" />
                <button @click="sendOrSave()" class="btn ml-4 hover:bg-white ">{{ isConfig?'保存':"发送" }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted, reactive } from 'vue'
import { chat } from '../libs/gpt'
let messageContent = ref("")
let isConfig = ref(true) // 是否显示设置
let state = reactive({
    askData:[]//提问和回答的数据
})

const clickConfig = () => {//点击设置,重新配置apikey
    if (!isConfig.value) {
        messageContent.value = getAPIKey();
    }else{
        clearMessageContent();
    }
    switchConfigStatus();
}
//从localStorage获取API key
const getAPIKey = ()=>{
    return localStorage.getItem("apiKey");
}

//清空输入框
const clearMessageContent = () => {
    messageContent.value = "";
}

//发送消息或者保存API key
const sendOrSave = () => {
    if (!messageContent.value.length) return;// 消息为空
    if (isConfig.value) {// 保存API key
        if (saveApiKey(messageContent.value.trim())) {
            switchConfigStatus();//切换设置状态
        }
        clearMessageContent();
    } else {
        //发送消息
        sendChatMessage(messageContent.value);
    }
}
//页面加载时,判断是否配置API key
onMounted(()=>{
    if(getAPIKey()){
        switchConfigStatus();
    }
})
//发送消息
const sendChatMessage = async (message) => {
    let apiKey = getAPIKey();
    if (!apiKey) {
        alert("请先配置API key");
        return;
    }
    const messageList = [
        { role: "system", content: "你是一个ai助手，能够帮助用户解决各种问题"},
        { role: "user", content: message },
    ];
    let result = await chat(messageList, apiKey);
    // console.log(result.choices[0].message['content']);
    state.askData.push({userAsk:message,gptResponse:result.choices[0].message['content']});
    clearMessageContent();
}
//在本地存储Apikey
const saveApiKey = (apiKey) => {
    localStorage.setItem("apiKey", apiKey);
    return true;
}
//切换设置状态
const switchConfigStatus = () => {
    isConfig.value = !isConfig.value;
}
</script>

<style></style>
```

接下来就由蘑菇头来讲解一下这个Home.vue组件。

在`template`下，其他html结构不用讲，我们聊一下这个input框。通过效果可以发现，这个input框实现了两种功能，一种是配置Apikey的功能，另一种是向GPT提问的功能。这是怎么实现的呢？通过`v-type`加变量可以动态绑定输入框的类型，点击设置按钮对变量进行取反即可实现。当然了，输入框旁边的按钮也是一样的逻辑，也是通过判断这个变量的值来更改按钮的内容是保存还是发送，这只是实现了样式的更改，我们还需要给这个按钮绑定点击事件，在这个事件里面我们需要通过变量判断当前输入框是什么状态，如果是配置Apikey的状态，那就在在本地存储Apikey，如果是向GPT提问状态，那就执行发送消息函数，函数之间的调用都写了备注，相信聪明的你很快就能读懂。

### 总结

这个小项目是在前端通过发送http的请求的方式来调用GPT的接口的，不同于node后端，需要下载OpenAi的模块将OpenAi模块引入到项目中使用，这两种方式有不同的优缺点和应用场景，前端通过HTTP请求优点是灵活、用户体验好、前后端分离。后端通过模块调用性能好、安全、集中管理，各位小伙伴可以按需取用。
