---
title: "深浅拷贝之谜：解开数据复制的神秘面纱"
description: "前言 拷贝在前端中非常常见，也是面试中常考的主题，今天我们聊聊前端中的深浅拷贝问题，这里我们只针对引用类型的拷贝，基本数据我们类型不聊，因为所有的基本数据类型的拷贝都是深拷贝。 本质 ..."
date: "2025-05-26"
tags: ["JavaScript"]
draft: false
featured: false
---
前言

拷贝在前端中非常常见，也是面试中常考的主题，今天我们聊聊前端中的深浅拷贝问题，这里我们只针对引用类型的拷贝，基本数据我们类型不聊，因为所有的基本数据类型的拷贝都是深拷贝。

本质

我们知道调用栈里面变量的存储方式使用键值对的方式存储，key是变量名，value就是值。基本数据类型的变量和值都存放于栈中，而引用类型变量存放于栈中，但是其真实值保存的堆中，栈里面的值存放的其实是堆地址，也就是其真实值的地址。当我们拷贝一个基本数据类型时，在栈里面就是新创建了一个变量，并将值赋给这个变量，当我们修改原对象时，不会影响到拷贝的变量，而这个过程也被称之为深拷贝。但是对于引用类型，当我们创建一个新变量时，是将保存的地址赋给这个新变量，也就是说新拷贝的对象和旧对象其实是引用的同一片地址，我们v8在查找引用类型时，其实是顺着栈里面存放的地址跑的去堆里面查找的，当我们修改原对象的值的时候，也相当于修改了新拷贝的对象的值，通俗的来讲就是两个指针指向了同一片地址，任何一方修改都会影响另一方，这就是浅拷贝。

浅拷贝

通俗的来讲就是基于原对象，拷贝得到一个新的对象，原对象中内容的修改会影响新对象。以下是常见的浅拷贝方法

1. Object.create()

这个方法是用来创建一个新对象的，上次我们聊到用这个方法创建的对象是没有原型的。当我们修改原对象的属性时，新拷贝的对象也会受影响。

```
let obj = {
    age :18
}
let newObj= Object.create(obj)
obj.age=20;
console.log(newObj.age);//20
```

2. Object.assign({},a)

这个方法是用于将两个对象的属性进行拼接，返回一个新对象。这里我们用一个空对象和一个对象拼接，这样也算是一种拷贝，可以发现当我修改基本数据类型时，新拷贝的对象不受影响，但是修改引用类型里面的值时，新拷贝的对象会被影响。

```
let a = {
    name :'wzm',
    like : {
        sport:'run'
    }
}

let c = Object.assign({},a);
a.name = 'xxj'
a.like.sport = 'swim'
console.log(c);//{ name: 'wzm', like: { sport: 'swim' } }
```

3. [].concat(arr)

这个方法是将两个数组拼接，并返回一个新数组。这里我们用一个空数组和一个数组拼接，可以发现当我们修改原数组的基本数据类型时，新数组不受影响，但是修改引用类型里面的值时，新拷贝的对象会被影响。

```
let arr = [1,2,3,{a:10}]
let newArr = [].concat(arr)
arr[2] = 4;
arr[3].a = 100;
console.log(newArr);//[ 1, 2, 3, { a: 100 } ]
```

4. 数组解构 ...

数组解构是es6新增的语法，...表示将arr中的所有元素放到newArr中，当然还有其他的一些解构的语法，这里就不做过多赘述。

```
let arr = [1,2,3,{a:10}]
let newArr = [...arr]
arr[2] = 4;
arr[3].a = 100;
console.log(newArr);//[ 1, 2, 3, { a: 100 } ]
```

5. arr.slince(0)

数组身上的一个方法，他和splice很像，splice是新增或者删除数组中的一个元素，slince可从已有的数组中返回选定的元素，当我们填0时，将返回整个数组。

```
let arr = [1,2,3,{a:10}]
let newArr = arr.slice(0)
arr[2] = 4;
arr[3].a = 100;
console.log(newArr);//[ 1, 2, 3, { a: 100 } ]
```

6. arr.toReversed().reverse()

toReversed返回一个元素顺序相反的新数组，原始数组保持不变，reverse原地修改原始数组，将数组中的元素顺序相反。

```
let arr = [1,2,3,{a:10}]
let newArr = arr.toReversed().reverse();
arr[2] = 4;
arr[3].a = 100;
console.log(newArr);//[ 1, 2, 3, { a: 100 } ]
```

以上是一些JavaScript中常见的浅拷贝方法，接下来我们手搓一个浅拷贝出来。

创建新对象，for in 遍历传入的对象，使用obj.hasOwnProperty(key)将对象身上的隐式属性去除，将对象身上的显示属性添加到新对象中，返回这个新对象

```
let obj = {
    name :'wzm',
    like :{
        sport:'run'
    }
}

function shallow(obj){
    let newObj = {}
    // for in 不仅会遍历到显示具有的属性，还有遍历到构造函数上的显示属性  
    for(let key in obj){
        // 去除掉对象身上隐式原型的属性
        if(obj.hasOwnProperty(key)){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

let newObj = shallow(obj)
obj.like.sport = 'swim'
console.log(newObj);//{ name: 'wzm', like: { sport: 'swim' } }
```

深拷贝

通俗的来讲就是基于原对象，拷贝得到一个新的对象，原对象中内容的修改不会影响新对象，以下是常见的深拷贝方法

1. JSON.parse(JSON.stringify(obj))

JSON.stringify 将对象转换为字符串 JSON.parse 将字符串转换为对象，这种拷贝方式有几个地方需要注意，它不能识别BigInt类型，它不能拷贝undefined，symbol，function类型的值，它不能处理循环引用

```
let obj = {
  name: '萍萍',
  age: 18,
  like: {
    n: 'coding'
  },
  a: true,
  b: undefined,
  c: null,
  d: Symbol(1),
  f: function() {}
}
// JSON.stringify 将对象转换为字符串 JSON.parse 将字符串转换为对象
let obj2 = JSON.parse(JSON.stringify(obj));//{ name: '萍萍', age: 18, like: { n: 'coding' }, a: true, c: null }
```

2. structuredClone()

这是JavaScript官方专门打造出来的用于深拷贝创建对像的方法，比较新。

```
const user = {
    name:{
        firstName:'w',
        lastName:'m'
    },
    age:19
}

const newUser = structuredClone(user)
user.name.firstName = 'x'
user.age = 20

console.log(newUser);//{ name: { firstName: 'w', lastName: 'm' }, age: 19 }
```

以上就是比较常见的深拷贝方法，老样子我们手写一个深拷贝方法出来，和浅拷贝十分类似，但是略有不同。我们还是要创建一个空对象，for in 遍历传入的对象，深拷贝不能直接将传入的对象的属性直接赋值给新对象，而是需要判断，如果遍历到对象身上的显示属性是基本数据类型时，将对象身上的显示属性添加到新对象中，如果是引用类型时，则递归创建新的子对象，这样就避免了引用同一片地址。

```
const user = {
    name:{
        firstName:'w',
        lastName:'m'
    },
    age:19
}

function deep(obj){
    let newObj = {}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            //另一种判断是不是Object对象的方法 typeof(obj[key])=='object'&&obj[key]!=null
            if(obj[key] instanceof Object){
                newObj[key] = deep(obj[key]);
            }else{
                newObj[key] = obj[key]
            }
        }
    }
    return newObj;
}

let newUser = deep(user)
user.name.firstName = 'x'
console.log(newUser);
```

总结

今天我们学习了什么是深拷贝和浅拷贝，区别就是拷贝的新对象会不会被原对象的修改而受影响，其本质还是在于存储方式的不同。我们还学习了JavaScript中常见的几种浅拷贝方法，有Object.create(obj) , Object.assign({},obj) , [].concat(arr) , arr.slince(0) , 数组解构 [...arr] ，arr.toReversed().reverse() 等，常见的深拷贝方法有，JSON.parse(JSON.stringify(obj)) ， structuredClone() ，我们还手搓了两种拷贝的方法，注意 for in 遍历对象的弊端，他会遍历到原型上的属性，我们需要用hasOwnProperty方法去除。OK今天我们就聊到这里欢迎下次再见。
