---
title: "二叉树"
description: "今天我们来聊聊数据结构中的二叉树结构。树是一种非线性的数据结构，而二叉树是树结构中的一种，由节点（node）和连接这些节点的边（edge）组成。 基本概念 什么是树，在现实生活中我们的..."
date: "2025-10-21"
tags: ["后端","算法"]
draft: false
featured: false
---
今天我们来聊聊数据结构中的二叉树结构。树是一种非线性的数据结构，而二叉树是树结构中的一种，由节点（node）和连接这些节点的边（edge）组成。

### 基本概念

什么是树，在现实生活中我们的树就是由一根主干加许多枝条，枝条上有许多叶子组成。那么在数据结构中我们也是这么表示的，只不过这棵树是倒过来的树。

![](/images/articles/Snipaste_2024-06-25_18-18-37.png)

### 树的定义

- **树**：树是一种由节点组成的层次结构，其中每个节点包含一个值或条件，节点之间通过边连接。
- **根节点（Root）**：树的顶层节点，没有父节点。
- **子节点（Child）**：从一个节点直接连接下来的节点称为其子节点。
- **父节点（Parent）**：直接连接到一个子节点的节点称为其父节点。
- **叶节点（Leaf）**：没有子节点的节点。
- **内部节点（Internal Node）**：有至少一个子节点的节点。
- **兄弟节点（Sibling）**：同一个父节点的子节点。

### 树的属性

- **高度（Height）**：从根节点到叶节点的最长路径上的边数。
- **深度（Depth）**：从根节点到某一节点的边数。
- **层次（Level）**：树中所有深度相同的节点的集合。
- **度（Degree）**：一个节点拥有的子节点的数量。树的度是所有节点中最大的度。

### 树的类型

- **二叉树（Binary Tree）**：每个节点最多有两个子节点，称为左子节点和右子节点。
  - **完全二叉树（Complete Binary Tree）**：除了最后一层外，所有层都是满的，最后一层的节点从左到右依次排列。
  - **满二叉树（Full Binary Tree）**：每个节点要么有两个子节点，要么没有子节点。

- **红黑树（Red-Black Tree）**：一种自平衡二叉搜索树，每个节点带有额外的颜色属性（红或黑），用于保持树的平衡。


### 二叉树的定义

在代码中，我们经常使用这两种方式来表示一颗树。

使用**对象**的方式

```
function TreeNode(val){
    this.val = val;
    this.left = null;
    this.right = null;
}

const node = new TreeNode(1)
node.left = new TreeNode(2)
node.right = new TreeNode(3)
```

使用**数组**的方式

```
const root = {
    val: 1,
    left: {
        val: 2,
        left: {
            val: 4
        },
        right: {
            val: 5
        }
    },
    right: {
        val: 3,
        left: {
            val: 6
        },
        right: {
            val: 7
        }
    }
}
```

### 二叉树的遍历

二叉树的遍历分为深度优先（dfs）和广度优先（bfs）

**深度优先**是指先尽可能的深入树的分支，当无法深入时再回溯，遍历上一个分叉口的另一个分支。

**广度优先**是指逐层访问节点，先访问离起始节点最近的节点，一层一层遍历，就像漫出去的水一样。

接下来我们用算法来实现这两种遍历方式。使用递归的方式很简单，你能实现使用迭代的方式完成吗？

#### 深度优先

1. **先序遍历**

先遍历根节点，再遍历左节点、右节点

```
function preOrder(root){
    if(!root){
        return;
    }
    console.log(root.val);
    preOrder(root.left)
    preOrder(root.right)
}
```

2. **中序遍历**

先遍历左节点，再遍历根节点、右节点

```
function midOrder(root) {
    if (!root) {
        return;
    }
    midOrder(root.left)
    console.log(root.val);
    midOrder(root.right)
}
```

3. **后序遍历**

先遍历左节点，再遍历右节点、根节点

```
function afterOrder(root) {
    if (!root) {
        return;
    }
    afterOrder(root.left)
    afterOrder(root.right)
    console.log(root.val);
}
```

接下来我们使用迭代的方式来实现一个先序遍历

```
var preorderTraversal = function(root) {
    if(!root) return []//如果是空树则返回一个空数组
    let stack = []//定义一个栈来辅助遍历
    let res = []//将结果存储并且返回
    stack.push(root)//首先将根节点入栈
    while(stack.length){
        let top = stack.pop()
        res.push(top.val);//拿到当前栈顶元素，并将值存储
        if(top.right){//如果当前出栈的节点有右节点，则入栈
            stack.push(top.right)
        }
        if(top.left){//如果当前出栈的节点有左节点，则入栈
            stack.push(top.left)
        }
    }
    return res
};
```

#### 广度优先

**层序遍历**

一层一层遍历，逐层访问节点

```
function levesOrder(root){
    let queue = []
    queue.push(root)
    while(queue.length){
        let top = queue.shift()
        console.log(top.val);
        if(top.left){
            queue.push(top.left)
        }
        if(top.right){
            queue.push(top.right)
        }
    }
}
```
