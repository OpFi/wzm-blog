---
title: "js初体验nlp之图片检测"
description: "【深度学习 自然语言处理】js初体验nlp之图片检测 前言 今天，蘑菇头又新学了一项小技能，就是用大语言模型来作图片检测，将图片中的物体识别并且标识出来，接下来就跟随者蘑菇头的想法开始..."
date: "2025-12-12"
tags: ["AI","性能优化"]
draft: false
featured: true
---
【深度学习-自然语言处理】js初体验nlp之图片检测

前言

今天，蘑菇头又新学了一项小技能，就是用大语言模型来作图片检测，将图片中的物体识别并且标识出来，接下来就跟随者蘑菇头的想法开始编程之旅吧！

思路

整个代码逻辑是：用户选择图片后，将图片显示在页面上，并调用 AI 模型进行物体检测，然后将检测结果渲染在图片上。

1. `import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0"`

   这一行引入了一个来自 CDN 的 JavaScript 模块 `@xenova/transformers`，并从中导入了 `pipeline` 和 `env`。

2. `env.allowLocalModels = false;`

   这里设置了一个环境变量 `allowLocalModels`，将其设为 `false`，表示不允许加载本地模型，而是优先加载网络资源。

3. `const fileUpload = document.getElementById('file-upload');` `const imageContainer = document.getElementById('image-container');`

   这两行分别获取了 HTML 中 id 为 `file-upload` 和 `image-container` 的元素。

4. `fileUpload.addEventListener('change', function(e) { ... })`

   给文件上传输入框添加了一个 `change` 事件监听器，当用户选择了文件后，会触发这个函数。

5. `const reader = new FileReader();`

   创建了一个 `FileReader` 对象，用于读取用户选择的图片文件。

6. `reader.onload = function(e2) { ... }`

   当图片读取完成后，会触发这个函数。在这个函数中，创建了一个新的 `<img>` 元素，并设置了它的 `src` 为读取到的图片数据，并将其添加到 `imageContainer` 元素中。

7. `detect(image);`

   调用 `detect` 函数，传入读取到的图片对象，启动 AI 任务。

8. `const detect = async (image) => { ... }`

   这是一个异步函数 `detect`，接收一个图片对象作为参数。在函数内部，通过 `pipeline` 方法加载了一个名为 `"object-detection"` 的模型，并传入了模型名称 `"Xenova/detr-resnet-50"`。然后使用加载的模型对图片进行物体检测，并渲染检测结果。

9. `function renderBox({box, label}) { ... }`

   这是一个用于渲染检测结果的函数。它接收一个对象参数，包含了检测框的位置信息 `box` 和标签 `label`。然后根据这些信息创建一个 `<div>` 元素，代表检测到的物体，并将其添加到 `imageContainer` 元素中。

完整代码

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nlp之图片识别</title>
    <style>
    .container {
        margin: 40px auto;
        width: max(50vw, 400px);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .custom-file-upload {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap:10px;
        border: 2px solid black;
        padding: 8px 16px;
        border-radius: 6px;
    }
    #file-upload {
        display: none;
    }
    #image-container {
        width: 100%;
        margin-top:20px;
        position: relative;
    }
    #image-container>img {
        width: 100%;
    }
    .bounding-box {
        position: absolute;
        box-sizing: border-box;
    }
    .bounding-box-label {
        position: absolute;
        color: white;
        font-size: 12px;
    }

    </style>
</head>
<body>
    <!-- 语义化 main就比div 更好 页面中的主体内容 -->
    <!-- css 选择器 -->
    <main class="container">
        <label for="file-upload" class="custom-file-upload">
            <input type="file" accept="image/*" id="file-upload">
            上传图片
        </label>
        <div id="image-container">
        </div>
        <p id="status"></p>
    </main>
    <script type="module">
    // transformers npl 任务 
    import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0"
    env.allowLocalModels = false;//优先加载网络资源

    const fileUpload = document.getElementById('file-upload');
    const imageContainer = document.getElementById('image-container');
    fileUpload.addEventListener('change', function(e) {
        // console.log(e.target.files[0]);
        const file = e.target.files[0];
        // 新建一个FileReader 对象， 01 序列 
        // 图片比较大 
        const reader = new FileReader();
        reader.onload = function(e2) {
            // 读完了， 加载完成
            const image = document.createElement('img'); // 图片对象
            console.log(e2.target.result);
            image.src = e2.target.result;
            imageContainer.appendChild(image);
            detect(image); // 启动ai任务  功能模块化，封装出去
        }
        reader.readAsDataURL(file);
    })
    const status = document.getElementById('status');
    // 检测图片的AI任务
    const detect = async (image) => {
        status.textContent = "分析中..." 
        const detector = await pipeline("object-detection", 
        "Xenova/detr-resnet-50") // model 实例化了detector对象
        const output = await detector(image.src, {
            threshold: 0.1,
            percentage: true
        })
        // console.log(output);
        output.forEach(renderBox);
    } 

    function renderBox({box, label}) {
        console.log(box, label);
        const { xmax, xmin, ymax, ymin} = box;
        const boxElement = document.createElement("div");
        boxElement.className = "bounding-box";
        Object.assign(boxElement.style, {
            borderColor: '#123123',
            borderWidth: '1px',
            borderStyle: 'solid',
            left: 100*xmin + '%',
            top: 100 *ymin + '%',
            width: 100*(xmax-xmin) + "%",
            height: 100*(ymax-ymin) + "%"
        })
        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        labelElement.className = "bounding-box-label";
        labelElement.style.backgroundColor='#000000';
        boxElement.appendChild(labelElement);
        imageContainer.appendChild(boxElement);
    }
    </script>
</body>
</html>
```
