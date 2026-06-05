---
title: "原型"
description: "前言 我们知道一个函数他是一个对象，他的身上默认有一些属性和方法，有些属性是可以直接访问的，比如name返回函数名，length返回函数参数个数，有些属性是不能直接访问的，他是提供给v..."
date: "2025-08-26"
tags: ["JavaScript"]
draft: false
featured: false
---
前言

我们知道一个函数他是一个对象，他的身上默认有一些属性和方法，有些属性是可以直接访问的，比如name返回函数名，length返回函数参数个数，有些属性是不能直接访问的，他是提供给v8使用的，比如scope属性，这是作用域链上的，如果还有不了解作用域链的小伙伴可以看看蘑菇头的往期文章哦。OK，言归正题，今天，蘑菇头想聊聊函数身上的另一个属性prototype，翻译过来叫做原型。让我们一起打开v8的原型之旅吧！

原型

什么是原型，我们先给出定义，它是函数上的一个属性，它定义了构造函数制造的对象的公共祖先，同时他也是一个对象，可以添加属性和方法并且所有的对象都有原型（除了create创建的）。这句话看起来很生涩难懂，我们用代码来描述一下。

```
function Car(color){
    this.name = 'su7'
    this.lang = '5000'
    this.height = '1400'
    this.color = color;
}
Car.prototype.conduct = 'xioami'
Car.prototype.run = function(){
    console.log('runrun');
}

let car1 = new Car('bule');
let car2 = new Car('bule');

console.log(car1.conduct);//xioami
console.log(car2.conduct);//xioami
console.log(car1.run());//run
console.log(car2.run());//run
```

这里我们声明了一个构造函数，并且创建了实例对象。往构造函数的显示原型中添加了属性和方法，通过不同的实例对象调用，可以发现打印的值是一样的，说明这两辆car继承了同一个祖先。其次car里面是没有conduct属性的，我们是在构造函数的原型里面添加了属性和方法，发现可以通过实例对象调用，而我们并没有给构造函数加这个属性说明这个属性是在原型里面找到的。概括起来就是构造函数new出来的对象会隐式继承到构造函数原型上的属性。

小tips：可以将构造函数new出来的对象的公共的属性和方法放在原型上，提高代码的效率。

增删改查

我们知道，一个对象是可以增加和删除属性和方法的，那么当我们通过实例对象来增加或者删除原型上的属性和方法时，会发生什么呢？

```
Car.prototype.product = 'xioami';
function Car() {
    this.name = 'su7';
}

let car = new Car();
car.name = 'su8'
console.log(car.name);
// 通过实例对象修改原型上的属性
car.product = 'huawei'
console.log(car.product);//huawei
```

这显然是不行的，实例对象可以修改显示继承到的属性（你写在构造函数上的属性），但是无法修改到隐式继承到的属性（原型上的属性）同理，实例对象无法给原型添加属性，删除属性。

**实例对象的原型**

上面我们提到，所有的对象都有原型，那么我创建的实例对象也应该会有原型，可以通过`__`proto`__`查看，例如

```
function Car(){}
let car = new Car();
console.log(Car.prototype)//这是构造函数的显示原型
console.log(car.__proto__)//这是创建的实例对象的隐式原型
```

![](/images/articles/Snipaste_2024-05-08_22-47-40.png)

可以发现，这两个值是一样的，这就说明实例对象的隐式原型 === 创建他的构造函数的显示原型，这里有个属性叫constructor，他的作用是用来记录是由谁创建的，这个属性可以被修改。我们再点开构造函数的显示原型一看，发现里面也有一个隐式原型，它的名字是Object，说明构造函数的隐式原型 === Object的显示原型，那么Object的隐式原型呢，它的值为null。

![](/images/articles/Snipaste_2024-05-08_22-50-27.png)

总结一下就是实例对象会显示继承构造函数的显示属性，会隐式继承构造函数的显示原型属性。

原型链

js在查找属性时，会先查找对象显示具有的属性，找不到，再查找对象的隐式原型（`__`proto`__`），例如我们创建了三个对象，并且修改son和father的原型。

```
GrandFather.prototype.say = function() {
    console.log('haha');
  }
  function GrandFather() {
    this.age = 60
    this.like = 'drink'
  }
  
  Father.prototype = new GrandFather()
  function Father() {
    this.age = 40
    this.fortune = {
      card: 'visa'
    }
  }
  
  Son.prototype = new Father() // {age: 40, fortune: {xxx}}
  function Son() {
    this.age = 18
  }
  
  let son = new Son()
  console.log(son.like); 
  console.log(son.say()); 
```

可以看到这里会打印drink和haha，他是怎么找到的呢？首先他会查找实例对象显示具有的属性，没有找到就到实例对象的隐式原型也就是son的构造函数的显示原型里面找，发现被修改为father的显示原型，在这里面没有找到，就到father的隐式原型也就是GrandFather的显示原型中去找，找到了就打印，没有找到会一直向上，直到找到Object的隐式原型就是null，像这样的查找关系被称之为原型链。

一种特例没有原型

我们一般创建对象的方法有两种

```
//第一种，使用字面量
let obj = {}
//第二种，使用包装类
let obj = new Object()
//第三种，使用包装类的create方法
let a = {
   name: 'Tom'
}
let obj = Object.create(a)  // 创建一个新对象，让新对象隐式继承 a对象的属性
console.log(obj);
```

当我们给create传一个空值时，此时的obj是没有原型的。

总结

今天我们聊了什么是原型，原型它是函数上的一个属性，它定义了构造函数制造的对象的公共祖先，构造函数的显示原型和实例对象的隐式原型之间存在关系，实例对象的隐式原型等于创建他的构造函数的显示原型，还有原型链以及一种特例他是没有原型的。
