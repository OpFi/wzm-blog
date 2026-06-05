---
title: "数组去重"
description: "前言 数组去重想必大家面试的时候或多或少都被问到过，今天蘑菇头面试的时候也被问到了。蘑菇头听到这个题目，瞬间心里很是开心。因为蘑菇头曾经写过这道题目，在[面试常见之手写系列前言 秋招差..."
date: "2025-07-13"
tags: ["性能优化","JavaScript"]
draft: false
featured: false
---
前言

数组去重想必大家面试的时候或多或少都被问到过，今天蘑菇头面试的时候也被问到了。蘑菇头听到这个题目，瞬间心里很是开心。因为蘑菇头曾经写过这道题目，在[面试常见之手写系列前言 秋招差不多已经开始了，小伙伴们准备好去自己心仪的大厂了吗？如果还没有准备好，欢迎收看本篇为大家准 - 掘金 (juejin.cn)](https://juejin.cn/post/7403289763484532790#heading-7)这篇文章中，蘑菇头提供了三种方法来解答如何进行数组去重。

但是，千算万算，没想到他来个数组里面放的是一个一个对象，它长这样。蘑菇头呆在原地，左思右想磨了半天，哎还是回炉重造吧。

```
const arr = [
    {
        "id": 1,
        "age": 20
    },
    {
        "id": 2,
        "age": 21
    },
    {
        "id": 1,
        "age": 20
    },
    {
        "id": 3,
        "age": 21
    }
]
```

正文

我们知道，每个对象的引用地址都是不一样的，所以我们不能单纯使用==来判断对象是不是相等。所以我们必须上一个辅助函数来判断我的结果数组中是否和当前遍历到的对象是不是同一个对象。

```
function unique(arr){
	let res = [];
	for(let i=0;i<arr.length;i++){
		let isFind = false;
		for(let j=0;j<res.length;j++){
			if(equals(arr[i],res[j])){
				isFind = true;
				break;
			}
		}
		if(!isFind) res.push(arr[i]);
	}
	return res;
}
```

现在我们主要就是要实现这个equals方法。它传入两个对象，判断这两个对象是否相等。遍历Obj1，拿到他的key和value判断Obj2身上是否拥有这样的key和value。如果没有则返回false，如果有但是value不同则返回false。

```
function equals(obj1,obj2){
	for(let key in obj1){
		if(obj2.hasOwnProperty(key)){
			if(obj1[key]!==obj2[key]) return false;
		}else {
			return false;
		}
	}
	return true;
}
```

面试官继续提问，当我的数据结构是这样子呢？

```
let arr = [
	{
        "id": 1,
        "age": 20,
        "like":{
        	"run":1
        }
    },
    {
        "id": 2,
        "age": 21
    },
    {
        "id": 1,
        "age": 20,
        "like":{
        	"run":1
        }
    },
    {
        "id": 3,
        "age": 21
    }
]
```

也就是说，我需要继续判断value的值是不是一个对象。所以我们可以这么改进我们的equals方法。递归的调用equals方法，直到我判断的数据类型不是对象，不是对象的话我就直接使用等值判断，如果是则继续递归调用。

```
function equals(obj1,obj2){
	if((typeof obj1 ==='object'&& obj2!==null )
		&&(typeof obj2 ==='object'&& obj2!==null)){
		for(let key in obj1){
		if(obj2.hasOwnProperty(key)){
			if(!equals(obj1[key],obj2[key])) return false;
		}else {
			return false;
		}
	}
	return true;
	}else {
		return obj1===obj2
	}	
}
```

当然了，我们可以优化一下递归，避免递归的层级太深。在做所有的判断之前，我们直接判断这两个对象的key的数量是否相等，如果不相等说明肯定不是同一个对象，如果相等则需要考虑。

```
function equals(obj1,obj2){
	if((typeof obj1 ==='object'&& obj2!==null )
		&&(typeof obj2 ==='object'&& obj2!==null)){
		if(Object.keys(obj1).length !== Object.keys(obj2).length) return false;
		for(let key in obj1){
		if(obj2.hasOwnProperty(key)){
			if(!equals(obj1[key],obj2[key])) return false;
		}else {
			return false;
		}
	}
	return true;
	}else {
		return obj1===obj2
	}	
}
```
