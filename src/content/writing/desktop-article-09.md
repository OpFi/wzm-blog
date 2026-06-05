---
title: "Vue+高德天气插件"
description: "实现天气预报 前言 今天，我们实现一个小demo，利用高德地图的定位插件和天气插件实现一个天气预报的功能，话不多说，咱们直接开始。 效果 主要实现的效果如下 这是一个移动端的页面，左上..."
date: "2025-11-18"
tags: ["Vue","浏览器"]
draft: false
featured: false
---
Vue+高德天气插件实现天气预报

### 前言

今天，我们实现一个小demo，利用高德地图的定位插件和天气插件实现一个天气预报的功能，话不多说，咱们直接开始。

### 效果

主要实现的效果如下

![](/images/articles/Snipaste_2024-06-28_10-42-42.png)

这是一个移动端的页面，左上角显示实时时间，中间是天气情况。包括当天的天气和近两日的天气情况。

### 准备工作

1. 首先我们需要注册成为高德开发者，地址[账号认证 | 高德控制台 (amap.com)](https://console.amap.com/dev/user/permission)

![](/images/articles/Snipaste_2024-06-28_10-50-22.png)

2. 创建key，进入**应用管理**，**创建新应用，**新应用中**添加** key，服务平台选择 **Web端(JS API)。**[我的应用 | 高德控制台 (amap.com)](https://console.amap.com/dev/key/app)

![](/images/articles/Snipaste_2024-06-28_10-51-41.png)

记住这个key和安全秘钥，待会配置的时候需要用到。

准备工作完成之后，我们就能愉快的开始开发啦。

### 开始开发

1. 初始化一个Vue项目使用命令 `npm create vue@latest`,初始配置我们选择路由配置

![](/images/articles/Snipaste_2024-06-22_21-22-04.png)

2. 我们将vue默认生成的一些样式和文件删除，assets下的文件全部删除，components文件夹删除，views文件夹下的文件全部删除，我们需要将在其他地方引用这些文件的代码删除，`main.js`下删除`import './assets/main.css'`，`router`文件夹下的`index.js`的路由清空，将`routes`置为空数组，这行删除`import HomeView from '../views/HomeView.vue'`。将`app.vue`清空。这样我们就的到了一个非常干净的vue项目了，然后我们在这个项目里书写我们的小demo。
3. vue.app

只有一个占位组件，动态渲染对应的组件

```
<template>
  <div>
      <RouterView></RouterView>
  </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
</style>
```

4. router下的index.js

配置了home的路由，并且将根路径重定向到home组件

```
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/views/Home.vue')
    }
  ]
})

export default router

```

5. assets下新建文件reset.css

清空浏览器的一些默认样式，这个清空样式由一个网站提供[CSS Tools: Reset CSS (meyerweb.com)](https://meyerweb.com/eric/tools/css/reset/)，在main.js中引入`import '@/assets/reset.css'`

```
/* color palette from <https://github.com/vuejs/theme> */
:root {
  --vt-c-white: #ffffff;
  --vt-c-white-soft: #f8f8f8;
  --vt-c-white-mute: #f2f2f2;

  --vt-c-black: #181818;
  --vt-c-black-soft: #222222;
  --vt-c-black-mute: #282828;

  --vt-c-indigo: #2c3e50;

  --vt-c-divider-light-1: rgba(60, 60, 60, 0.29);
  --vt-c-divider-light-2: rgba(60, 60, 60, 0.12);
  --vt-c-divider-dark-1: rgba(84, 84, 84, 0.65);
  --vt-c-divider-dark-2: rgba(84, 84, 84, 0.48);

  --vt-c-text-light-1: var(--vt-c-indigo);
  --vt-c-text-light-2: rgba(60, 60, 60, 0.66);
  --vt-c-text-dark-1: var(--vt-c-white);
  --vt-c-text-dark-2: rgba(235, 235, 235, 0.64);
}

/* semantic color variables for this project */
:root {
  --color-background: var(--vt-c-white);
  --color-background-soft: var(--vt-c-white-soft);
  --color-background-mute: var(--vt-c-white-mute);

  --color-border: var(--vt-c-divider-light-2);
  --color-border-hover: var(--vt-c-divider-light-1);

  --color-heading: var(--vt-c-text-light-1);
  --color-text: var(--vt-c-text-light-1);

  --section-gap: 160px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);

    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);

    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  transition:
    color 0.5s,
    background-color 0.5s;
  line-height: 1.6;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

6. 配置秘钥，在index.html中使用<script>标签同步加载增加安全密钥设置脚本，并将**「你申请的安全密钥」**替换为你的安全密钥，这样我们就能使用高德提供的天气插件了。

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: "你的安全秘钥",
      };
    </script>
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=2.0&key=你的key"
    ></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

```

7. 编写Home.vue组件

```
<template>
    <div>
        <div class="container">
            <div class="nav">
                <div class="time">{{ now }}</div>
                <div class="city" @click="switchCity">切换城市</div>
            </div>
            <div class="city-info">
                <p class="city">{{ weatherInfo.today.city }}</p>
                <p class="weather">{{ weatherInfo.today.weather }}</p>
                <h2 class="temp">
                    <em>{{ weatherInfo.today.temperature }}</em>℃
                </h2>
                <div class="detail">
                    <span>风力：{{ weatherInfo.today.windPower }}级</span>|
                    <span>风向：{{ weatherInfo.today.windDirection }}</span>|
                    <span>空气湿度：{{ weatherInfo.today.humidity }}%</span>
                </div>
            </div>
            <div class="future" v-if="weatherInfo.future.length">
                <div class="group">
                    明天：
                    <span class="tm">白天：{{ weatherInfo.future[0].dayTemp }}℃ {{weatherInfo.future[0].dayWeather}} {{weatherInfo.future[0].dayWindDir}} {{weatherInfo.future[0].dayWindPower}}</span>
                    <span class="tm">夜晚：{{ weatherInfo.future[0].nightTemp }}℃ {{weatherInfo.future[0].nightWeather}} {{weatherInfo.future[0].nightWindDir}} {{weatherInfo.future[0].nightWindPower}}</span>
                </div>
                <div class="group">
                    后天：
                    <span class="tm">白天：{{ weatherInfo.future[1].dayTemp }}℃ {{weatherInfo.future[1].dayWeather}} {{weatherInfo.future[1].dayWindDir}} {{weatherInfo.future[1].dayWindPower}}</span>
                    <span class="tm">夜晚：{{ weatherInfo.future[1].nightTemp }}℃ {{weatherInfo.future[1].nightWeather}} {{weatherInfo.future[1].nightWindDir}} {{weatherInfo.future[1].nightWindPower}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
let weatherInfo = reactive({
    today: {},//今天的天气情况
    future: {}//后两天的天气情况
})
//获取当前时间
const now = ref('00:00:00')
setInterval(() => {
    now.value = new Date().toLocaleTimeString();
}, 1000)

//获取定位
onMounted(() => {
    AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // 查询成功，result即为当前所在城市信息
                getWeather(result.city)
            }
        })
    })
})

function getWeather(city) {
    //加载天气查询插件
    AMap.plugin("AMap.Weather", function () {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive(city, function (err, data) {
            console.log(err, data);
            //err 正确时返回 null
            //data 返回实时天气数据，返回数据见下表
            weatherInfo.today = data
        });
        weather.getForecast(city, function (err, data) {
            console.log(err, data);
            //err 正确时返回 null
            //data 返回天气预报数据，返回数据见下表
            weatherInfo.future = data.forecasts;
        });
    });
}


</script>

<style lang="less" scoped>
.container {
    min-height: 100vh;
    background-color: black;
    opacity: 0.7;
    color: white;

    .nav {
        padding: 10px;
        display: flex;
        justify-content: space-between;
    }

    .city-info {
        text-align: center;

        P {
            margin-top: 10px;
        }

        .temp {
            margin: 10px 0;
            font-size: 26px;

            em {
                font-size: 34px;
            }
        }
    }

    .future {
        padding: 0 10px;
        margin-top: 30px;

        .group {
            height: 44px;
            line-height: 44px;
            background-color: rgba(255, 255, 255, 0.3);
            margin-bottom: 10px;
            font-size: 12px;
            text-align: center;
            border-radius: 5px;
        }
    }
}
</style>
```

不出意外的话，我们就能看到效果了。

8. 整个src项目结构

![](/images/articles/Snipaste_2024-06-28_11-52-39.png)

最后附上官方的文档[概述-地图 JS API 2.0|高德地图API (amap.com)](https://lbs.amap.com/api/javascript-api-v2/summary)在进阶教程的服务插件和工具下可以看见我们使用的方法。
