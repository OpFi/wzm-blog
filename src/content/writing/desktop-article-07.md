---
title: "OpenAi embeddings 在前端的应用-推荐系统"
description: "OpenAi中的embeddings接口的应用 搜索推荐功能 前言 今天蘑菇头带来的是一个非常牛逼的一个功能，利用OpenAi的embeddings接口来实现一个搜索推荐的功能。 大致..."
date: "2025-11-26"
tags: ["Vue","AI"]
draft: false
featured: false
---
OpenAi中的embeddings接口的应用-搜索推荐功能

### 前言

今天蘑菇头带来的是一个非常牛逼的一个功能，利用OpenAi的embeddings接口来实现一个搜索推荐的功能。

### 大致思路

它大致的思路就是将数据库里的数据和搜索框输入的数据向量化，然后根据向量化的数据计算余弦相似度，通过这个相似度的高低来输出相似度高的数据。

接下来就跟随蘑菇头的脚步来看看用node是如何实现的。

### 前置工作

首先你得需要准备一个OpenAi的key，如果没有可以看这篇文章[Vue+OpenAi无后端实现一个简单的对话聊天功能 - 掘金 (juejin.cn)](https://juejin.cn/post/7388488504055513124)，里面提到了如何获取。

我们先写一个小测试，看看OpenAi是否能将我们的数据向量化。

```
import OpenAI from 'openai' //npm i openai
import dotenv from 'dotenv' //npm i dotenv
dotenv.config({path:'.env'}) //里面放着你的key

const client = new OpenAI({ //新建一个实例
    apiKey: process.env.API_KEY,
    baseURL: 'https://api.302.ai/v1'
})


const response = await client.embeddings.create({
    model: 'text-embedding-ada-002', //模型
    input: '如何创建vue组件' //数据的输入
})

console.log(response.data[0].embedding);
```

可以看到成功向量化

![](/images/articles/Snipaste_2024-07-11_11-43-42.png)

### 正文

我们用文本文件来模拟数据库，里面放着这样的json数据。

![](/images/articles/Snipaste_2024-07-11_17-46-00.png)

将OpenAi的实例对象丢出去，封装为一个模块，提高复用性。

```
//模块化输出client 给各项ai任务调用
import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config({path:'.env'})

export const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://api.302.ai/v1'
})
```

然后我们用OpenAi的embeddings接口将里面的json数据向量化输出到另一个文件下。同样还是json格式的文件，只不过是在里面添加了一个字段embeddings。

```
import fs from 'fs/promises';
import {client} from './app.service.mjs'
//文件输入路径
const inputFilePath = './data/posts.json'
// 向量化输出路径
const outputFilePath = './data/embeddings.json'
// 模拟数据库拿到的数据
const data = await fs.readFile(inputFilePath, 'utf8')
const posts = JSON.parse(data)
const embeddings = []
for(const {title,category} of posts){
    const response = await client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: `标题：${title} 分类：${category}`
    })
    embeddings.push({
        title,
        category,
        embedding: response.data[0].embedding
    })
}

await fs.writeFile(outputFilePath, JSON.stringify(embeddings))
```

![](/images/articles/Snipaste_2024-07-11_11-48-04.png)

接下来我们只需要获取前端传过来的输入框的值向量化，然后将这个向量化的数据和早已经向量化好的数据库的数据进行相似度比较，将相似度高的那几条数据返回给前端即可。

```
import fs from 'fs/promises';
import { client } from './app.service.mjs';

const inputFilePath = './data/embeddings.json';
const posts = JSON.parse(await fs.readFile(inputFilePath, 'utf8'))

// 计算向量的余弦相似度
const cosineSimilarity = (v1, v2) => {
    // 计算向量的点积
    const dotProduct = v1.reduce((acc, curr, i) => acc + curr * v2[i], 0);
  
    // 计算向量的长度
    const lengthV1 = Math.sqrt(v1.reduce((acc, curr) => acc + curr * curr, 0));
    const lengthV2 = Math.sqrt(v2.reduce((acc, curr) => acc + curr * curr, 0));
  
    // 计算余弦相似度
    const similarity = dotProduct / (lengthV1 * lengthV2);
  
    return similarity;
  };

// 模拟前端搜索的值
const searchText = 'Vue 前端开发'
const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: searchText,
});
// 前端搜索的值的向量
const {embedding} = response.data[0];

// 计算相似度
const results = posts.map(item=>({
    ...item,
    similarity: cosineSimilarity(embedding, item.embedding)
}))
.sort((a, b) => b.similarity - a.similarity) //相似度排序
.slice(0,5) //获取相似度最高的前五条
.map((item,index)=>`${index+1},${item.title},${item.category}`)
.join('\n')
console.log(results);
```

在代码里，我们模拟前端段传过来的值为`Vue 前端开发`，然后我们获取相似度最高的前五条数据，打印。

![](/images/articles/Snipaste_2024-07-11_18-09-51.png)

当我们的值为`Nuxt.js 前端开发`

![](/images/articles/Snipaste_2024-07-11_18-41-08.png)

可以看到效果还可以，基本能够匹配成功。
