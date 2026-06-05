---
title: "大文件上传"
description: "前言 大文件上传是项目中的一个难点和亮点，在面试中也经常会被面试官问到，所以今天蘑菇头来聊聊这个大文件上传。 什么样的文件算的上是大文件？ 对于Web前端来说，当涉及到上传或下载操作时..."
date: "2025-08-02"
tags: ["后端","性能优化"]
draft: false
featured: false
---
### 前言

大文件上传是项目中的一个难点和亮点，在面试中也经常会被面试官问到，所以今天蘑菇头来聊聊这个大文件上传。

### 什么样的文件算的上是大文件？

对于Web前端来说，当涉及到上传或下载操作时，通常认为任何超过10MB的文件都属于较大文件，尤其是对于HTTP POST上传操作。如果文件大小达到几十MB甚至更大，那么通常就需要考虑使用分块上传、断点续传等技术来优化传输过程，减少因网络不稳定导致的失败率，并提高用户体验。

当然了，这和你的网络带宽也有关系，当你的网络带宽很小时，即时在小的文件传输速率也很慢，也可以被称之为大文件了。

接下里我们来模拟一下如何使用分块上传技术来优化传输过程。

### 分片上传文件

分片上传技术是解决大文件上传问题的一种有效方法。它通过将大文件分割成多个较小的部分（称为“分片”或“片段”），然后分别上传这些部分，最后再由服务器端合并这些部分来重构原始文件。这种方法的优点包括能够更好地利用网络资源、支持断点续传以及提高上传效率。

#### 主要思想

首先，前端获取到input框里输入的文件对象，通过slice方法将大文件对象进行切割得到小的Blob对象，由于后端无法识别Blob对象，所以需要转为前后端都能识别的对象FormData，然后将这个对象通过post请求发送给后端，将切片一个一个发送给后端。

后端接收到一个一个切割好的对象进行解析，将这些切片保存到一个文件夹下。当所有的切片都发送完毕之后，后端接收到合并这个信号，将文件夹下的切片排好顺序进行合并，创建可写流，将所有的切片读成流类型并汇入到可写流中得到完整的文件资源。

#### 详细过程

有几个点需要我们注意

文件如何切割？用什么方法？

后端什么时候知道前端已经将所有的分片都发送过来了，然后才开始合并？

合并的过程中如何保证分片的顺序？

后端怎么将前端发送过来的分片文件进行合并？

**前端**

监听input框的change事件，获取文件对象。

使用slice将文件对象进行切片，返回一个数组。

使用FormData构造函数，将Bolb对象包装成formdata对象，以便后端能够识别，并且给这个对象添加文件名，分片名属性，以便后来分片进行排序。

使用Promise.all方法，当所有的分片请求都成功后，在all的then方法里面发送一个分片请求已完成的信号给后端，告诉后端可以开始合并分片了。

```
<input type="file" name="" id="input">
<button id="btn">上传</button>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
        const input = document.getElementById('input');
        const btn = document.getElementById('btn');
        let fileObj = null
        input.addEventListener('change', handleFileChange);
        btn.addEventListener('click', handleUpload)

        function handleFileChange(e) {//监听change事件,获取文件对象
            // console.log(event.target.files);
            const [file] = event.target.files;
            fileObj = file;
        }
        function handleUpload() {//点击按钮上传文件到服务器
            if (!fileObj) return;
            const chunkList = createChunk(fileObj);
            // console.log(chunkList);
            const chunks = chunkList.map(({ file }, index) => {//创建切片对象
                return {
                    file,
                    size: file.size,
                    percent: 0,
                    index,
                    chunkName: `${fileObj.name}-${index}`,
                    fileName: fileObj.name,
                }
            });
            // 发请求
            uploadChunks(chunks);

        }
        //切片
        function createChunk(file, size = 5 * 1024 * 1024) {
            const chunkList = [];
            let cur = 0;
            while (cur < file.size) {
                chunkList.push({
                    file: file.slice(cur, cur + size),
                })
                cur += size;
            }
            return chunkList;
        }
        // 发请求到后端
        function uploadChunks(chunks) {
            console.log(chunks); //这个数组中的元素是对象，对象中有blob类型的文件对象，后端无法识别,所以需要转换成formData对象
            const formChunks = chunks.map(({ file, fileName, index, chunkName }) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileName', fileName);
                formData.append('chunkName', chunkName);
                return { formData, index }
            })
            console.log(formChunks); // 后端能识别的类型
            //发请求
            const requestList = formChunks.map(({ formData, index }) => {//一个一个片段发
                return axios.post('http://localhost:3000/upload', formData,()=>{
                    console.log(index + ' 上传成功');
                })
                .then(res => { 
                })
            })
            Promise.all(requestList).then(() => {
                console.log('全部上传成功');
                mergeChunks();               
            })
        }
        // 合并请求的信号
        function mergeChunks(size=5*1024*1024){
            axios.post('http://localhost:3000/merge',{
                fileName:fileObj.name,
                size
            })
            .then(res=>{
                console.log(fileObj.name + '合并成功');
            })
        }
</script>
```

**后端**

使用第三方库multiparty对传输过来的formdata进行解析。

使用fse模块对解析完成的数据进行保存。

当所有的切片都完成时，后端接收到合并切片的请求信号时，使用fse模块读取所有的切片并进行排序。

排序完成之后使用fse模块进行合并。

```
const http = require('http');
const path = require('path');
const multiparty = require('multiparty');
const fse = require('fs-extra');

const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-methods': '*'
    })
    if (req.method === 'OPTIONS') { // 请求预检
        res.status = 200
        res.end()
        return
    }

    if (req.url === '/upload') {
        // 接收前端传过来的 formData 
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            // console.log(fields);  // 切片的描述
            // console.log(files);  // 切片的二进制资源被处理成对象
            const [file] = files.file
            const [fileName] = fields.fileName
            const [chunkName] = fields.chunkName
            // 保存切片
            const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
            if (!fse.existsSync(chunkDir)) { // 该路径是否有效
                fse.mkdirSync(chunkDir)
            }
            // 存入
            fse.moveSync(file.path, `${chunkDir}/${chunkName}`)

            res.end(JSON.stringify({
                code: 0,
                message: '切片上传成功'
            }))

        })

    }

    if (req.url === '/merge') {
        const { fileName, size } = await resolvePost(req) // 解析post参数
        const filePath = path.resolve(UPLOAD_DIR, fileName)  // 完整文件的路径
        // 合并切片
        const result = await mergeFileChunk(filePath, fileName, size)
        if (result) { // 切片合并完成
            res.end(JSON.stringify({
                code: 0,
                message: '文件合并完成'
            }))
        }
    }
})

// 存放切片的地方
const UPLOAD_DIR = path.resolve(__dirname, '.', 'qiepian')

// 解析post参数
function resolvePost(req) {
    return new Promise((resolve, reject) => {
        req.on('data', (data) => {
            resolve(JSON.parse(data.toString()))
        })
    })
}

// 合并
function pipeStream(path, writeStream) {
    return new Promise((resolve, reject) => {
        const readStream = fse.createReadStream(path)
        readStream.on('end', () => {
            fse.removeSync(path)  // 被读取完的切片移除掉
            resolve()
        })
        readStream.pipe(writeStream)
    })
}

// 合并切片
async function mergeFileChunk(filePath, fileName, size) {
    // 拿到所有切片所在文件夹的路径
    const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
    // 拿到所有切片
    let chunksList = fse.readdirSync(chunkDir)
    // console.log(chunksList);
    // 万一切片是乱序的
    chunksList.sort((a, b) => a.split('-')[1] - b.split('-')[1])

    const result = chunksList.map((chunkFileName, index) => {
        const chunkPath = path.resolve(chunkDir, chunkFileName)
        // ！！！！！合并
        return pipeStream(chunkPath, fse.createWriteStream(filePath, {
            start: index * size,
            end: (index + 1) * size
        }))

    })

    // console.log(result);
    await Promise.all(result)
    fse.rmdirSync(chunkDir) // 删除切片目录
    return true

}


server.listen(3000, () => {
    console.log('listening on port 3000');
})
```
