---
title: "vue的响应式原理"
description: "vue2的数据响应式原理 什么是数据响应式 他是vue的一大核心特性，它实现了当数据改变时，视图层自动更新的效果。这只是表层现象，更深一层是当数据改变时，依赖这些数据的函数重新执行的过..."
date: "2025-11-14"
tags: ["Vue","JavaScript"]
draft: false
featured: false
---
vue2的数据响应式原理

### 什么是数据响应式

他是vue的一大核心特性，它实现了当数据改变时，视图层自动更新的效果。这只是表层现象，更深一层是当数据改变时，依赖这些数据的函数重新执行的过程。当阅读完这篇文章时，或许你对这一问题会有更深的理解。

上期文章我们在es6中的代理Proxy中提到了**Object.defineProperty**，他是用来监听对象中的属性的并且可以对这些属性做一些相关配置，比如是否可写，是否可枚举之类的。他最重大的特点就是它提供了get和set方法在访问对象中的属性之前可以做一些其他操作，这就为数据响应式提供了方法。具体怎么做的，且听我慢慢道来。

### 实现原理

接下来我们用js来模拟一下vue2的响应式原理。

在js中，我们是如何将一个对象身上的属性显示到页面上的？是不是通过获取到dom元素，然后设置innerHTML，OK，那我们就这么操作。

```
<div id="name"></div>
<div id="age"></div>

let user = {
            name: '张三',
            age:'18'
}

function showName() {
            document.getElementById('name').innerHTML = user.name
}
function showAge(){
            document.getElementById('age').innerHTML = user.age
}
```

在vue中，只要我们修改了user中的变量，那么视图就会更新，比如我将user.name = '李四'，对应到js中该如何实现，是不是我们只要再调用一次showName就能实现。这很简单，但是我总不能每次修改属性的时候都要在后面跟上一句更新dom的代码吧。所以这个时候我们可以利用**Object.defineProperty**来实现。

```
function observe(obj){
            for(let key in obj){
                let Ivalue = obj[key]
                Object.defineProperty(obj,key,{
                    get(){
                        return Ivalue;
                    },
                    set(val){
                        Ivalue = val
                        //执行dom更新操作
                        showName();
                        showAge();
                    }
                })
            }
        }
```

当数据更改时，就会被拦截下来执行更新dom的操作。但是在vue中，我可不知道你哪些函数用了这个对象中的属性，所以我现在要在set方法里面获取到那些用了我这个对象身上属性的函数名，并且调用它就行。我们使用一种巧妙的办法来收集到这些函数名。

首先我们定义一个记录函数的数组，然后当有函数用到了对象身上属性时，就会去Window找到这个函数名并且将它保存下来，然后再set里面执行掉这个函数。这样我就不用在set里面知道具体的函数叫什么了，你只需要在调用具有对象身上属性的函数之前将函数名挂到Window上，然后执行完毕之后删除即可。

```
function observe(obj){
            for(let key in obj){
                let Ivalue = obj[key]
                let funcs = []//定义一个记录函数的数组
                Object.defineProperty(obj,key,{
                    get(){
                        //依赖收集，记录是哪个函数用了我
                        if(window.__func&&!funcs.includes(window.__func)){//如果一个函数里面用来很多次这个属性，只需要记录一次
                            funcs.push(window.__func)
                        }
                        return Ivalue;
                    },
                    set(val){
                        Ivalue = val
                        //派发更新，执行dom更新操作
                        funcs.forEach(fn=>fn())
                    }
                })
            }
        }
window.__func = showName;
showName();
window.__func = null;
```

我们可以稍微封装一下，就可以这样

```
<div id="name"></div>
<div id="age"></div>
<button id="btn">change</button>

let user = {
            name: '张三',
            age:'18'
        }
        
        function observe(obj){
            for(let key in obj){
                let Ivalue = obj[key]
                let funcs = []
                Object.defineProperty(obj,key,{
                    get(){
                        //依赖收集，记录是哪个函数用了我
                        if(window.__func&&!funcs.includes(window.__func)){
                            funcs.push(window.__func)
                        }
                        return Ivalue;
                    },
                    set(val){
                        Ivalue = val
                        //派发更新，执行dom更新操作
                        funcs.forEach(fn=>fn())
                    }
                })
            }
        }

        function showName() {
            document.getElementById('name').innerHTML = user.name
        }

        function showAge(){
            document.getElementById('age').innerHTML = user.age
        }

        function autoRun(fn){
            window.__func = fn;
            fn();
            window.__func = null;
        }

        observe(user)

        autoRun(showName)
        autoRun(showAge)

        document.getElementById('btn').onclick = function(){
            user.name = '李四'
            user.age = '19'
        }
```

这样我们基本实现了vue2的响应式了，可以看出它主要有三步

1. **数据劫持**：当你把一个普通的JavaScript对象传给Vue实例作为`data`选项时，Vue会遍历此对象的所有属性，并使用`Object.defineProperty()`把这些属性全部转为getter/setter。这样，Vue就能够在属性被访问和修改时执行相应的操作。
2. **依赖收集**：Vue内部维护了一个依赖收集系统。每个响应式对象都有一个对应的依赖集合，当数据被访问时（即执行getter时），会把当前的Watcher（观察者）记录下来。Watcher是用来订阅数据变化的，它会在数据变化时执行相应的回调函数。
3. **派发更新**：当响应式数据发生变化时（即执行setter时），Vue会遍历依赖集合，通知相关的Watcher更新视图。这个过程是通过Watcher的回调函数实现的，回调函数内部会执行相应的DOM更新操作。

### 总结

Vue的响应式原理通过数据劫持和依赖收集系统实现了数据变化时视图的自动更新。Vue 2使用`Object.defineProperty()`方法实现响应式，而Vue 3则采用了更加高效的`Proxy`对象来实现。
