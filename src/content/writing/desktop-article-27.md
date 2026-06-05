---
title: "前端面试题：纯css实现点击展开子菜单效果"
description: "前言 点击展开子菜单的效果不知道大家能想到什么解决办法，最常见的就是添加点击监听事件，然后通过显示与隐藏属性来实现，但是面试官要求你用纯css来实现你会吗？今天蘑菇头就带大家来用纯cs..."
date: "2025-09-07"
tags: ["CSS","JavaScript"]
draft: false
featured: false
---
### 前言

点击展开子菜单的效果不知道大家能想到什么解决办法，最常见的就是添加点击监听事件，然后通过显示与隐藏属性来实现，但是面试官要求你用纯css来实现你会吗？今天蘑菇头就带大家来用纯css来实现一个点击展开子菜单的效果。

### 效果

主要实现的效果如下

### 思路

#### html结构的巧妙

使用一个`input`元素类型为`checkbox`来控制子菜单的显示与隐藏。使用一个`label`元素来作为显示菜单的按钮， `for`属性与`input`的`id`相匹配。使用一个`article`元素作为子菜单的容器。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="demo.css">
<body>
    <div class="according">
        <input type="checkbox" id="collapse1" hidden>
        <input type="checkbox" id="collapse2" hidden>
        <input type="checkbox" id="collapse3" hidden>
        <!-- article HTML5语义化div -->
        <article>
            <label for="collapse1">列表1</label>
            <p>内容1</p>
            <p>内容2</p>
            <p>内容3</p>
            <p>内容4</p>
        </article>
        <article>
            <label for="collapse2">列表2</label>
            <p>内容1</p>
            <p>内容2</p>
            <p>内容3</p>
            <p>内容4</p>
        </article>
        <article>
            <label for="collapse3">列表3</label>
            <p>内容1</p>
            <p>内容2</p>
            <p>内容3</p>
            <p>内容4</p>
        </article>
    </div>
</body>
</html>
```

#### 高质量的css选择器

```
* {
  margin: 0;
  padding: 0;
}
.according {
  width: 300px;
}
.according article {
  cursor: pointer;
}
.according article + article {
  margin-top: 5px;
}
.according input:nth-child(1):checked ~ article:nth-of-type(1) p,
.according input:nth-child(2):checked ~ article:nth-of-type(2) p,
.according input:nth-child(3):checked ~ article:nth-of-type(3) p {
  max-height: 600px;
}
.according label {
  display: block;
  height: 40px;
  padding: 0 20px;
  background-color: #f66;
  cursor: pointer;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
}
.according p {
  overflow: hidden;
  padding: 0 20px;
  border: 1px solid #f66;
  border-top: none;
  border-bottom-width: 0;
  max-height: 0;
  line-height: 30px;
  transition: all 500ms;
}
```

这里解释一下新手不是很常用的选择器

1. `.according article + article` 

选择所有在类名为 `according` 的元素内部的 `<article>` 元素中，每个紧接在另一个 `<article>` 元素之后的 `<article>` 元素。换句话说，这个选择器会选择所有属于类 `according` 的元素内部的第二个及后续的 `<article>` 元素，并对其应用样式规则。

2. `.according input:nth-child(1):checked ~ article:nth-of-type(1) p,
   .according input:nth-child(2):checked ~ article:nth-of-type(2) p,
   .according input:nth-child(3):checked ~ article:nth-of-type(3) p`

这个选择器看着很长，其实一点也不简单。这段代码实际上包含了三个选择器，每个选择器的结构相同，只是针对不同的子元素进行选择，让我们拆解第一个选择器，然后类比其余两个。

`.according`: 类选择器，选择具有 `according` 类的元素。

`input:nth-child(1)`: 类型选择器和伪类，选择 `.according` 内部的第一个子元素 `input`。

`:checked`: 伪类，选择当前被选中的（checked） `input` 元素。

`~ article:nth-of-type(1)`: 通用兄弟选择器，选择所有在选中 `input` 元素之后的兄弟元素中，第一个 `article` 元素。

`p`: 类型选择器，选择上述 `article` 元素中的所有 `p` 元素。

串起来就是选择器会在一个类名为 `according` 的元素内查找第一个子元素 `input`，当该 `input` 被选中时，选择该 `input` 之后的第一个 `article` 元素中的所有 `p` 元素，其余两个都是一样的意思。

既然聊到了选择器，咱们就数一数有哪几种常用的选择器规则吧

### 常见的选择器规则

#### 基本选择器

1. **元素选择器（Type Selector）**

   选择所有指定类型的元素。

   ```
   p {
       color: blue;
   }
   ```

2. **类选择器（Class Selector）**

   选择所有具有指定类名的元素。

   ```
   .my-class {
       font-size: 20px;
   }
   ```

3. **ID选择器（ID Selector）**

   选择具有指定ID的元素。每个ID在页面中应该唯一。

   ```
   #my-id {
       background-color: yellow;
   }
   ```

4. **通用选择器（Universal Selector）**

   选择所有元素。

   ```
   * {
       margin: 0;
       padding: 0;
   }
   ```

#### 组合选择器

1. **后代选择器（Descendant Selector）**

   选择某个元素内部的所有指定后代元素。不论嵌套层级如何。

   ```
   div p {
       color: green;
   }
   ```

2. **子选择器（Child Selector）**

   选择某个元素内部的所有指定直接子元素。它只会选择直接嵌套的元素，而不包括更深层级的后代元素。

   ```
   ul > li {
       list-style-type: none;
   }
   ```

3. **相邻兄弟选择器（Adjacent Sibling Selector）**

   选择紧接在某个元素之后的兄弟元素。

   ```
   h1 + p {
       margin-top: 0;
   }
   ```

4. **通用兄弟选择器（General Sibling Selector）**

   选择某个元素之后的所有兄弟元素。

   ```
   h1 ~ p {
       color: red;
   }
   ```

### 属性选择器

1. **存在属性选择器**

   选择具有指定属性的所有元素。

   ```
   [title] {
       border-bottom: 1px dotted;
   }
   ```

2. **属性值选择器**

   选择具有指定属性值的所有元素。

   ```
   [type="text"] {
       width: 200px;
   }
   ```

3. **部分匹配属性选择器**

   选择属性值以某些字符开头、结尾或包含某些字符的元素。

   ```
   [href^="https"] { /* 以"https"开头 */
       color: green;
   }
   
   [href$=".pdf"] { /* 以".pdf"结尾 */
       color: red;
   }
   
   [href*="example"] { /* 包含"example" */
       color: blue;
   }
   ```

#### 伪类选择器

1. **链接伪类选择器**

   用于链接状态：未访问、已访问、悬停和激活。

   ```
   a:link {
       color: blue;
   }
   
   a:visited {
       color: purple;
   }
   
   a:hover {
       color: red;
   }
   
   a:active {
       color: yellow;
   }
   ```

2. **结构伪类选择器**

   用于选择文档树中特定位置的元素。

   ```
   p:first-child {选择属于其父元素的第一个子元素。
       font-weight: bold;
   }
   
   p:last-child {选择属于其父元素的最后一个子元素。
       font-style: italic;
   }
   
   p:nth-child(2) {选择属于其父元素的第n个子元素，n可以是一个数字、关键词或表达式。
       color: red;
   }
   
   p:nth-of-type(2) {选择属于其父元素的特定类型的第n个子元素。
       color: green;
   }
   
   p:only-child {选择属于其父元素的唯一子元素。
       border: 1px solid black;
   }
   
   p:only-of-type {选择属于其父元素的特定类型的唯一子元素。
       border: 2px solid blue;
   }
   p:empty {选择没有子元素（包括文本节点）的元素。
       color: gray;
   }
   ```

3. **目标伪类选择器**

   选择当前活动的目标元素。

   ```
   :target {
       background-color: yellow;
   }
   ```

#### 伪元素选择器

1. **::before and ::after**

   用于在元素内容的前后插入内容。

   ```
   p::before {
       content: "Prefix";
   }
   
   p::after {
       content: "Suffix";
   }
   ```

2. **::first-line and ::first-letter**

   用于选择元素的第一行或第一个字母。

   ```
   p::first-line {
       font-weight: bold;
   }
   
   p::first-letter {
       font-size: 200%;
   }
   ```

#### 组合使用

选择器可以组合使用，以实现更复杂的选择需求。例如：

```
div.my-class > p:first-child {
    color: orange;
}
```

这条规则选择所有类名为 `my-class` 的 `div` 内部的第一个 `p` 元素，并将其字体颜色设置为橙色。

接下来我们介绍一种新的写css样式的方法，使用stylus编写css代码。

### stylus

Stylus 是一种富有表现力的、健壮的、优雅的 CSS 预处理器，旨在简化和加强 CSS 的编写。它采用了一种类似于 Python 的缩进风格语法，相比于传统的 CSS 和其他预处理器（如 Sass、Less），Stylus 提供了更大的灵活性和简洁性。

#### 快速入门

1. **命令行安装**

   ```
   npm install -g stylus
   ```

2. **创建样式文件** 创建一个 `.styl` 文件，例如 `styles.styl`，编写 Stylus 样式：

   ```
   primary-color = #f00
   
   body
       font
           family: Arial, sans-serif
           size: 16px
   
   .button
       background-color: primary-color
       &:hover
           background-color: darken(primary-color)
   ```

3. **编译为 CSS** 使用 `stylus` 命令将 `.styl` 文件编译为 `.css` 文件：

   ```
   stylus styles.styl -o ./css
   ```

使用stylus加速css代码开发，这样我们的开发效率那不是杠杠的。里面有许多新的语法和使用规则，详细情况请看官方文档[Stylus - 富于表现力、健壮、功能丰富的 CSS 预处理器 | Stylus 中文网 (stylus-lang.cn)](https://www.stylus-lang.cn/)

总结

今天我们又干掉一道非常经典的面试题，用js实现那太小儿科了，咱们能想出第二种思路就能够在面试中脱颖而出，今天你又学到了吗？
