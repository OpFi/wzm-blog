---
title: "继承"
description: "前言 今天我们聊聊js中的继承。你知道几种继承方式呢？ 继承 通俗的来说继承就是让子类拥有父类的属性和方法，子类能够访问到父类的属性和方法。继承的主要目的是实现代码复用和创建更具结构化..."
date: "2025-05-18"
tags: ["性能优化","JavaScript"]
draft: false
featured: false
---
### 前言

今天我们聊聊js中的继承。你知道几种继承方式呢？

### 继承

通俗的来说继承就是让子类拥有父类的属性和方法，子类能够访问到父类的属性和方法。继承的主要目的是实现代码复用和创建更具结构化的程序设计。在JavaScript中，继承可以通过原型链（prototype chain）和类（class）两种方式来实现。

### 实现继承的方法

#### 第一种 原型链继承

通过往子类的构造函数的原型上添加父类的实例对象实现继承

```
function Parent(){//父类
    this.name = 'parent';
    this.age = 30;
    this.num = [1,2,3];
}

function Child(){//子类
    this.name = 'child';
}

Child.prototype = new Parent();

let s1 = new Child();
let s2 = new Child();

s1.num.push(4);
console.log(s1.num);//[ 1, 2, 3, 4 ]
console.log(s2.num);//[ 1, 2, 3, 4 ]
```

但是有一个问题，子类实例会继承到同一个原型对象，内存共享，所以实例之间会互相影响

#### 第二种 构造函数继承

将子类构造函数的this显示绑定到父类身上。这样子类的构造函数身上就显示具有父类身上的属性。

```
function Parent(){
    this.name = 'parent';
    this.age = 30;
    this.num = [1,2,3];
}
Parent.prototype.like = 'run'

function Child(){
    Parent.call(this);
    this.name = 'child';
}

let s1 = new Child();
let s2 = new Child();

s1.num.push(4);
console.log(s1.num);//[ 1, 2, 3, 4 ]
console.log(s2.num);//[ 1, 2, 3 ]
console.log(s1.like);//undefined
```

可以看到成功解决第一种原型链继承带来的问题，但是带来了一个新的问题，构造函数继承无法继承到父类身上的原型

#### 第三种 组合继承

就是将前面两种结合起来

```
function Parent(){
    this.name = 'parent';
    this.age = 30;
    this.num = [1,2,3];
}
Parent.prototype.like = 'run'

function Child(){
    Parent.call(this);
    this.name = 'child';
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;//修正constructor
let s1 = new Child();
let s2 = new Child();

s1.num.push(4);
console.log(s1.num);//[ 1, 2, 3, 4 ]
console.log(s2.num);//[ 1, 2, 3 ]
console.log(s1.like);//run
```

成功解决上面两种带来的问题，别急还有一个问题，就是当我们在将子类构造函数的原型修改为父类的实例对象时，它并没有一个属于子类构造函数原型身上的constructor属性，所以我们需要手动添加这个属性。而且父类的构造函数执行了两次，性能开销大。

![](/images/articles/Snipaste_2024-07-19_17-48-10.png)

![](/images/articles/Snipaste_2024-07-19_17-52-06.png)

#### 第四种 原型式继承

他是对象字面量的继承，使用Object.create()函数。但是多个实例之间继承到的引用类型是相同的地址，会相互影响。

```
let parent = {
    name: 'parent',
    age: 30,
    num: [1,2,3]
}

let child1 = Object.create(parent);
let child2 = Object.create(parent);

child1.num.push(4);
console.log(child1.num);//[1,2,3,4]
console.log(child2.num);//[1,2,3,4]
```

#### 第五种 寄生式继承

它本质上还是原型式继承，只不过是通过函数的方式返回，可以让子对象在初始化就能拥有自己的属性和方法，缺点和原型式继承的问题一样。

```
let parent = {
    name: 'parent',
    age: 30,
    num: [1,2,3]
}

function clone(obj){
    let clone = Object.create(obj);
    clone.getnum = function(){
        return this.num;
    }
    return clone;
}

let child1 = clone(parent);
```

#### 第六种 寄生组合式继承

这是在es5中最优雅的一种继承方式，在组合式继承的基础上将子类构造函数的原型通过Object.create()方法赋值，这样就解决了父类的构造函数被new了两次的问题。

```
function Parent(){
    this.name = 'parent';
    this.age = 30;
    this.num = [1,2,3];
}

function Child(){
    Parent.call(this);
    this.name = 'child';
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;//修正constructor

let s1 = new Child();
let s2 = new Child();

s1.num.push(4);
console.log(s1.num);//1234
console.log(s2.num);//123
```

#### 第七种 class继承

这是es6中的一种继承方式，可以使用关键字extends实现继承。它的底层本质上还是寄生组合式继承。

```
class Parent{
    constructor(){
        this.name = 'parent';
        this.age = 30;
        this.num = [1,2,3];
    }
}

class Child extends Parent{
    constructor(){
        super();
        this.name = 'child';
    }
}

let s1 = new Child();
let s2 = new Child();

s1.num.push(4);
console.log(s1.num);//1234
console.log(s2.num);//123
```

### 总结

OK，今天我们聊了什么是继承以及继承的作用，还有7种继承方式，需要记住的是寄生组合式继承和类继承比较常见。
