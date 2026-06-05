---
title: "你不知道的JavaScript小知识"
description: "作用域 ​ 全局作用域是指变量或函数在整个脚本或程序中都可以被访问和使用的范围。在 JavaScript 中，全局作用域可以分为以下两种情况： 1. 直接编写在 标签中的 JavaSc..."
date: "2025-10-17"
tags: ["JavaScript"]
draft: false
featured: false
---
作用域

​	全局作用域是指变量或函数在整个脚本或程序中都可以被访问和使用的范围。在 JavaScript 中，全局作用域可以分为以下两种情况：

1. 直接编写在`<script>`标签中的 JavaScript 代码，或在一个单独的 JavaScript 文件中，都属于全局作用域。

   ```
   var a = 1;
   function foo(){}
   if(){}
   ```

   其中变量a，函数foo，if语句都在全局作用域下。

2. 在全局作用域中，有一个全局对象`window`，可以直接使用。全局作用域在页面打开时创建，页面关闭时销毁。

3. 变量如果声明在全局作用域下，在任意位置都可以使用。

   ```
   var a = 1;
   console.log(a);//1 在全局域中可以使用
   function foo(){
   	console.log(a);//1 在函数内部可以使用
   }
   if(a){} //在语句中可以使用
   for(var i = 1;i<10;i++){} //在语句中声明的变量也属于全局变量
   console.log(i)//10
   ```

​    4. 如果变量没有使用关键字，则为全局变量

​	函数作用域

​	函数作用域是指在函数内部定义的变量和声明的作用范围。在函数作用域中，变量仅在函数内部可访问，在函数外部无法直接访问这些变量。当函数执行完毕后，函数内部的变量会被销毁。

```
function foo(){
	var a = 1;
}
console.log(a)//报错 a is not defined
```

块级作用域

块级作用域是指在 [JavaScript](coco://sendMessage?ext={"s%24wiki_link"%3A"https%3A%2F%2Fm.baike.com%2Fwikiid%2F7263973572305318203"}&msg=JavaScript) 中，用花括号 `{}` 括起来的一段代码所形成的作用域。在块级作用域中，变量的定义和使用只在该块内有效，超出该块范围后，这些变量将无法访问。

在 [ES6](coco://sendMessage?ext={"s%24wiki_link"%3A"https%3A%2F%2Fm.baike.com%2Fwikiid%2F7263973572305318203"}&msg=ES6) 之前的 JavaScript 中，只有全局作用域和函数作用域，没有块级作用域的概念。这导致了一些问题，例如内层变量可能会覆盖外层变量，以及用来[计数](coco://sendMessage?ext={"s%24wiki_link"%3A"https%3A%2F%2Fm.baike.com%2Fwikiid%2F232640044768557473"}&msg=计数)的循环变量可能会泄露为全局变量。

就像这样

```
function foo() {
    var x = 2;
    function bar() {
        var x = 3;
    }
    bar();
    console.log(x); // 3
}
```

ES6 中新增了块级作用域，使得 JavaScript 语言更加严谨和安全。块级作用域可以用于解决上述问题，并且提供了更好的代码组织和封装能力，就像这样。

```
function foo() {
    var x = 2;
    {
        function bar() {
            var x = 3;
        }
    }   
    bar();
    console.log(x); // 2
} 
```

当我们将bar声明成块级作用域时，x就不会发生泄露。既然聊到了作用域，就不得不聊一下var，let，和const了。

var let const

小知识

属性声明提升

```
console.log(a); // undefined
var a = 2;
```

v8引擎将变量声明提升到代码的开头，使得变量可以在整个代码中使用。变成这样：

```
var a;
console.log(a); // undefined
a = 2;
```

函数声明提升

```
foo(); //输出 "foo"
function foo() {
  console.log("foo");
}
```

var的短处：

当我们在使用var时，有时会因为声明提升导致出现一些难以预料的结果。var允许重复声明同一个变量，这样会导致变量被覆盖和产生混乱，当全局声明时，还可能造成全局污染。所以ES6专门更新了两种新的声明变量的关键字，let和const。

let的作用和var基本差不多，但是let不存在声明提升问题，例如：

```
console.log(a); // 报错
let a = 2;
```

并且不能重复声明同一个变量例如：

```
let a = 1;
let a = 2;//报错
```

let会和{}形成块级作用域，只在其内部访问才有效，例如：

```
for(let i =0;i<10;i++){
	console.log(i);//可以
}
console.log(i);//报错
```

const用于声明一个常量，也会和{}形成块级作用域，常量的意思是不能被修改的量。

```
const a = 1;
a = 2;//错误
```

总结一下

var let const相同点：

var let他们都是用来声明一个变量 ，const用来声明一个常量，在其作用域下三者都能被访问的到。

不同点：

var可以重复声明同一个变量，并且可以随意修改他的值，而且他存在声明提升。

let会和他所在{}之间组成块级作用域并只在其内部有效，不存在声明提升，并且不能重复声明同一个变量。

const也是只在其块级作用域下有效，并且声明时必须初始化，后续不能修改其值。

欺骗词法作用域

聊完三大作用域的之后，我们聊聊一些奇奇怪怪的函数，他可以欺骗词法作用域规则。

eval()：在 JavaScript 中，`eval()` 函数用于执行一段字符串表示的 JavaScript 代码。它可以将字符串转换为相应的对象，并返回表达式的结果。eval() 将原本不属于当前作用域的变量声明提升到当前作用域，所以根据这个特性，我们可以写出这样的代码。

```
function foo(str,a) {
    eval(str);//返回var b = 3; 语句
    console.log(a,b);// 1 2 ？错误
}
var b = 2;
foo("var b = 3",1);// 1 3
```

with(obj){}：在 `with()` 语句中，`obj` 是要访问的对象。在 `{}` 内部，可以直接使用 `obj` 的属性和方法，而无需使用点号操作符。with() 用于修改一个对象的属性值，但如果属性不存在，则会创建新的属性，泄露到全局作用域。例如：

```
var  obj = {
    a: 3
}
with(obj){//正常使用，obj里面有a属性
	a: 4
}
function foo(obj){
    with (obj) {//不正常使用，obj里面没有b属性
        b = 2;
    }
}
foo(obj);
console.log(obj); // {a: 3, b: 2}
```
