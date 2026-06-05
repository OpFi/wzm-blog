---
title: "数组扁平化"
description: "前言 今天我们来聊聊前端面试常问的数组扁平化问题，你知道几种能将数组扁平化的方法呢？欢迎评论区留言哦。 数组扁平化 通俗的来讲就是将一个N维的数组转化成一维的数组，为什么要将数组扁平化..."
date: "2025-07-09"
tags: ["JavaScript"]
draft: false
featured: false
---
前言

今天我们来聊聊前端面试常问的数组扁平化问题，你知道几种能将数组扁平化的方法呢？欢迎评论区留言哦。

数组扁平化

通俗的来讲就是将一个N维的数组转化成一维的数组，为什么要将数组扁平化，因为当数组嵌套层次较深时，处理起来会比较复杂，例如遍历、搜索、过滤或排序等，扁平化数组可以使这些操作更加简单和直观。在前端开发中，经常需要处理嵌套的数组结构，将多维数组扁平化可以更方便地进行遍历、渲染或与其他组件进行交互。

数组扁平化方法

第一种 arr.flat() 方法

这个方法是官方封装的方法，直接调用即可，参数是扁平化的次数，一般我们直接填 Infinity 无穷大

```
const arr = [1, 2, 3, [4, [5]]]
const newArr = arr.flat(Infinity);
console.log(newArr);
```

第二种 递归

我们通过遍历这个数组，如果遍历到的还是数组就继续调用此方法flatten，也就是递归调用，如果不是就将值push到新数组中，由于每次递归调用push的数组都不一样，所以我们需要返回这个数组并通过concat方法拼接。

```
const arr = [1, 2, 3, [4, [5]]]
function flatten(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
const newArr = flatten(arr);
console.log(newArr);
```

第三种 toString方法 （全数字才能用）

我们知道，数组调用ToString方法会将数组的内容转换为字符串并通过逗号拼接，我们只需要处理这个字符串就行，将这个字符串通过逗号分割，并且使用map遍历这个字符数组，将每次分割得到的字符数字转换成数值类型返回到一个新数组中即可。

```
const arr = [1, 2, 3, [4, [5]]]
let str = arr.toString();
let newArr = str.split(',').map((item)=>{
    return Number(item);
})
console.log(newArr);
```

第四种 reduce方法

先简单介绍一下reduce方法，reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

```
let arr = [1,2,3,4,5]
let res = arr.reduce(function(pre,item,index,arr){//pre 累加值，item 当前遍历到的元素，index 下标
    console.log(pre,item,index);
    return pre + item; //返回这个值到pre身上, return 出去就能实现一个累加的效果
},1)//1 表示一开始 pre 的值

console.log(res);//16
```

知道这些之后，我们可以通过这个方法来扁平化一个数组，我们调用数组身上的reduce方法，遍历需要扁平化的数组，判断此时遍历的是不是数组，如果是就递归调用 flatten ，如果不是就将值拼接到新数组中，是不是感觉和第二种递归调用一样，这是第二种递归调用的另一种实现方法。区别就是第二种我们是通过 new 一个空数组来存放值，通过push将值存放，通过concat将上一次的值和这次拼接，并且返回出去，reduce 直接 return 到 pre 身上并通过concat拼接上一次的pre，然后再返回出去。

```
const arr = [1, 2, 3, [4, [5]]]
function flatten(arr){
    return arr.reduce((pre,item)=>{
        return pre.concat(Array.isArray(item)? flatten(item):item);
    },[])
}
const newArr = flatten(arr);
console.log(newArr);
```

第五种 解构

我们简单介绍一下some方法，该方法用于检测数组中的元素是否满足指定条件（函数提供）。它会依次执行数组的每个元素，如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。 如果没有满足条件的元素，则返回false。

```
let arr = [1,2,3,4,5,6]
let res = arr.some((item)=>{
    return item >5;
})
console.log(res);//true
```

通过解构的语法特性我们知道，... arr 得到的是里面的元素的值

```
let arr = [1,2,3]
console.log(...arr);//1 2 3
```

也就意味着我们通过解构这个方法可以去除掉一层数组外壳，那么我只要判断这个数字里面存不存在数组，如果存在，我就使用一次解构语法，我们需要用一个空数组来存放每次解构得到的值。

```
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
      arr = [].concat(...arr)  // [].concat(1, 2, [3, 4, [5]])  // [1, 2, 3, 4, [5]]
    }
    return arr
  }
const newArr = flatten(arr);
console.log(newArr);
```

总结

今天我们聊到了面试常问的数组扁平化知识，总共有5种方法。分别是flat，递归，reduce，ToString，和解构，其中递归和reduce非常常见，大家可要记牢哦！
