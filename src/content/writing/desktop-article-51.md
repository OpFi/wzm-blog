---
title: "深入了解JavaScript中的类型转换"
description: "[] = ![] 打印true？ 为什么？ 前言 今天我们要聊的主题是你不知道的JavaScript中的类型转换，很多小伙伴其实都知道类型转换，直接调用其构造函数就行，但是我们的面试官..."
date: "2025-06-03"
tags: ["JavaScript"]
draft: false
featured: false
---
[] = ![] 打印true？ 为什么？ 

### 前言

今天我们要聊的主题是你不知道的JavaScript中的类型转换，很多小伙伴其实都知道类型转换，直接调用其构造函数就行，但是我们的面试官可不是这么好心的，他会问你一些奇奇怪怪的有关类型转换的知识，就比如标题中的[] = ![] 打印为true，这里我们重点聊聊对象转基本数据类型。如果有不知道的小伙伴，欢迎食用本篇文章。

### 基本数据类型转换 - 通常发生显示转换

#### 原始值转布尔

```
// 显示原始值转布尔,调用Boolean构造函数
console.log(Boolean(1));//true
console.log(Boolean(-1));//true
console.log(Boolean(0));//false
console.log(Boolean(NaN));//false
console.log(Boolean(null));//false
console.log(Boolean(undefined));//false
console.log(Boolean(''));//false
console.log(Boolean(false));//false
```

#### 原始值转数字

```
// 显示原始值转数值,调用Number构造函数
console.log(Number('123'));//123
console.log(Number('hello'));//NaN
console.log(Number(''));//0
console.log(Number(' '));//0
console.log(Number(true));//1
console.log(Number(false));//0
console.log(Number(NaN));//NaN
console.log(Number(null));//0
console.log(Number(undefined));//NaN
```

#### 原始值转字符串

直接上结论，所有传入的类型都会被两个引号引起来

```
// 显示原始值转字符串，调用String构造函数
console.log(String(123));
```

#### 原始值转对象 

调用对应的构造函数

```
let str = '123'
console.log(String(str));//123
```

### **对象转原始值** - 通常发生隐式转换

#### 了解三个方法

##### toString() 方法

大多数原始数据类型（如数字、布尔值等）都有自己的 toString()方法，用于将其转换为字符串表示，对象也可以有自定义的 toString()方法，大概可以总结为以下几点。

1. {}.toString 得到由[object和class]组成的字符串
2. [].toString 返回由数组内部由逗号拼接的字符串
3. xx.toString 返回字符串字面量

##### valueOf() 方法

在 JavaScript 中，valueOf方法是对象的默认方法。对于基本数据类型的对象（如Number、String、Boolean等），valueOf方法返回对应的原始值。对于自定义对象，valueOf方法的返回值可以通过重写该方法来定义，如果没有重写，默认不作处理。

##### ToPrimitive() 方法

ToPrimitive（强制类型转换为原始值）是一个内部操作。它主要用于将一个对象转换为相应的原始值（如数字、字符串或布尔值）,ToPrimitive 在很多涉及到对象与原始值交互的操作中都会被自动调用，比如进行数学运算、比较操作等，以下是他的执行逻辑。当它倾向于转数字时，会先调用valueOf方法，倾向于转字符串时，先调用toString方法。

1. 如果接收到的是原始值类型，直接返回
2. 否则调用ToString方法，如果得到原始值类型，返回
3. 否则调用valueOf方法，如果得到原始值类型，返回
4. 否则报错

当我们清楚的了解了以上这些方法后，我们就能知道对象转基本数据类型时，到底隐式调用了什么方法，执行了什么过程。

#### 例子

一元运算符 +

案例1：

```
+'123' //123
//Toprimitive('123',Number)
//'123'
//123
```

首先，+ 运算符会对操作数进行类型转换。对于字符串 '123'，会调用 ToPrimitive 操作，由于字符串有 toString 方法，该方法会将字符串本身作为结果返回，即仍是 '123'。然后，+ 会将这个字符串转换为数值 123，最终结果就是数值 123。

案例2：

```
+[] // 0
// Toprimitive([],Number)
// [].valueOf() //[]
// [].ToString() //''
// 0
```

调用Toprimitive方法，valueOf数组仍为数组，ToString数组为数组内部由逗号拼接的字符串，即空字符串，+ 会将空字符串转变为数值0。

二元运算符 +

规则

1. lprim = ToPrimitive(v1)
2. rprim = ToPrimitive(v2)
3. 如果lprim或者rprim其中有一个字符串则就ToString(lprim)或者ToString(rprim)
4. 否则ToNumber(lprim)+ToNumber(rprim)

案例1：

```
1 + '1' //'11'
// ToPrimitive(1)  +   ToPrimitive('1')
// 1   +  '1'
// ToString(1)  +  '1'
// '1'  +  '1' 
// '11'
```

调用ToPrimitive方法，原始值直接返回，根据规则存在字符串，调用ToString方法，将数值1转换为字符串 '1' ，字符串相加为 '11'。

案例2：

```
null + 1
// ToPrimitive(null)  +   ToPrimitive(1)
// null + 1
// ToNumber(null) + ToNumber(1)
// 0 + 1
// 1
```

调用ToPrimitive方法，原始值直接返回，估计规则不存在字符串，调用ToNumber方法，null 是0 所以相加为1。

案例3：

```
[] + {}
// ToPrimitive([])  +   ToPrimitive({})
// [].valueOf() + {}.valueOf()
// [].toString() + {}.toString()
// '' + '[object Object]'
// '[object Object]'
```

调用ToPrimitive方法，不是原始值，走valueOf和ToString方法，得到返回值为字符串，调用ToString方法，相加得到'[object Object]'。

相等运算符 ==

这是官方文档[Annotated ES5](https://es5.github.io/#x11.9.3)。任何对象转布尔都是true。

![](/images/articles/Snipaste_2024-05-25_21-03-07.png)

案例1：

```
1 == {}
// 1 == ToPrimitive({})
// 1 == '[object Object]'
// 1 == NaN
```

第九点，调用ToPrimitive方法，左边为原始值直接返回，右边返回结果为字符串'[object Object]'，== 会将这个字符串转换成数字NaN ，1 显然不等于NaN ，为false。 

案例2：当我们知道这些之后，题目中的也就迎刃而解了

```
[] == ![]
// [] == false
// [] == 0
// ToPrimitive([]) == 0
// '' == 0
// 0 == 0
```

右边任何对象转布尔值都为true，取反则为false，这样又回到了第九点中，左边调用ToPrimitive 返回 0 所以最终的结果为true。

总结

今天我们聊了JavaScript中的类型转换问题，主要关注对象是如何隐式转基本数据类型这一过程。
