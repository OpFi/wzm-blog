---
title: "万物皆可对象"
description: "引言 在JavaScript中，数据类型分为两类，基本数据类型和引用数据类型，基本数据类型有6种，字符串，数字，布尔，空，未定义，symbol。引用数据类型有函数，数组，对象等等这些属..."
date: "2025-11-06"
tags: ["JavaScript"]
draft: false
featured: false
---
引言

在JavaScript中，数据类型分为两类，基本数据类型和引用数据类型，基本数据类型有6种，字符串，数字，布尔，空，未定义，symbol。引用数据类型有函数，数组，对象等等这些属于对象类型。今天蘑菇头想聊聊基本数据类型被创建时到底发生了什么，可以添加属性吗？如果有收获可以点个小心心哦。

基本数据类型我们先不聊，我们先聊聊对象，对对象有一个基本的认识，为后面要聊的做铺垫。

对象

什么是对象呢？对象是类的实例，拥有属性和方法。我们创建一个小徐对象，拥有Name，sex，health属性用来描述小徐身上的特征，拥有run，say方法用来描述小徐的行为，或者功能。

```
var person={
    name:"xiaoxu",
    sex:'boy',
    health:100,
    run:function(){
        console.log("run");
        this.count++;
    },
    say:function(){
        console.log("say")
    }
}
```

1.增删改查

既然他是一个对象，那么就可以往对象身上添加属性和方法，删除属性和方法等等。

```
//增加属性，age为字符串
person.age = 19;
//下面abc是变量，赋值girlfriend，将作为key，值为章若楠，存入对象中。
var abc = 'girlfriend';
person[abc] = '章若楠';
//下面语法和person.abc = '章若楠'没有区别
person['abc'] = '章若楠'

//修改属性
person.sex = 'girl'

//删除属性
delete person.age;

//访问属性
person.name
```

小tips：在ES6中新加了一种给对象添加属性的语法

2.创建对象

创建一个实例对象一共有三种方法，1.使用字面量创建也是我们最常使用的一个方法，2.使用Object构造函数创建，3.自定义构造函数。

```
// 第一种 使用字面量
var obj = {}
// 第二种 使用构造函数
var obj2 = new Object();
// 第三种 自定义构造函数
function Car(color){
    this.name='su7'
    this.height='1400'
    this.lang='5000'
    this.color= color
}
var car = new Car();
console.log(car);
```

在这里我想聊聊第三种使用自定义构造函数创建对象，当我们new一个对象时，究竟发生了什么。在v8眼中，当我们new一个对象时，首先他会在构造函数中创建this对象，然后执行函数中逻辑代码，往this对象添加属性，然后this的隐式原型(this.`__`proto`__`) = 构造函数的显示原型[[prototype]]，这里的原型我们放在下一篇文章来聊，现在只需要接受就好，知道有这么一个步骤，最后返回this对象，赋值给car。

你真的了解基本数据类型吗？简单的数据类型其实并不简单。

我们知道对象可以拥有属性和方法，基本数据类型不可以拥有，我们看这样一段代码：

```
var num = 123;
num.abc = 'hello';
console.log(num.abc); 
```

问打印的是什么？结果是undefined，为什么呢？我们来分析一下，第二句代码是不是相当于我们把num当做对象来看了，因为对象就是这么添加属性的。然后我们从v8的角度来理解一下这段代码，在v8眼中实际上会创建一个Number的包装类出来，包装类是一个对象吧，所以他可以添加属性abc，但是基本数据类型是不能拥有属性和方法的，这就和我们之前的理念有冲突了，所以他会执行一次delete操作，就像这样

```
new Number(123).abc='hello'
delete new Number(123).abc;
```

所以是undefined。

总结一下，我们写的所有的字面量的代码，在v8眼中都会执行成上述这个样子，所以我们是无法给简单数据类型添加属性和方法的。我们再给出一段代码

```
var num = new Number(123);
num.abc = 'hello';
console.log(num.abc);//hello
console.log(num*2);//246
```

这里可以看出我们是主动显示通过包装类来创建的num，num是一个正儿八经的对象，所以可以添加属性，此时的abc是可以被访问的。

这个时候我们心中就会有一个疑问了，为什么字符串类型可以有属性length，那这不是基本数据类型可以添加属性？

```
var str = 'abcd'; //v8眼里 str = new String('abcd');
console.log(str.length);//4
```

其实这是当初设计JavaScript这门语言的设计者早就已经设计好的，length属性压根不是你添加的。

知道这个之后我们再给出一段代码，你知道打印的什么吗？为什么？

```
var arr = [1,2,3,4,5];
arr.length = 2;
console.log(arr);

var str = 'abcde';
str.length = 2;
console.log(str);
console.log(str.length);
```

分析一下，首先数组的长度被修改成2，所以应该打印的是[1,2]，那么str呢？他的长度也被修改成了2，是不是也是打印的'ab'呢？答案是数组为[1,2]，str为'abcde'，他的长度没有被修改。为什么？其实刚刚你已经知道了，str创建时，会被v8执行成这样

```
new String('abcde').length = 2;
delete String('abcde').length;
```

str.length = 2不就是相当于给str添加属性吗？所以他会被添加后删除，也就是说你以为你修改的是str的length属性，其实压根就不是这么一回事，v8根本就不是这么理解的。所以跟着蘑菇头学习v8的执行原理还是有帮助的，欢迎订阅哦和关注哦。

结语

简单数据类型是无法添加属性和方法的，这是铁律。当使用字面量创建时，会有一个包装类的出现，将你所添加的属性删除。而使用包装类创建时，可以添加属性，因为它已然是一个对象了。
