---
title: "使用node-js实现简单的石头剪刀布游戏输出到命令行"
description: "前言 石头剪刀布想必大家都玩过，非常简单。今天蘑菇头就带大家一起实现这么一个简单的小游戏。 需求 使用纯node js，实现一个简单的剪刀石头布游戏，玩家和电脑进行对战，每对战一次，将..."
date: "2025-10-05"
tags: ["后端","性能优化"]
draft: false
featured: false
---
前言

石头剪刀布想必大家都玩过，非常简单。今天蘑菇头就带大家一起实现这么一个简单的小游戏。

需求

使用纯node-js，实现一个简单的剪刀石头布游戏，玩家和电脑进行对战，每对战一次，将得分结果输出到命令行。

思路

1. 获取玩家输入
2. 获取电脑输入
3. 将玩家和电脑的输入进行比较
4. 将得分情况打印出来

具体代码

```
// 获得用户输入 process进程对象
// on data 监听输入事件

let score = 0;

process.stdin.on('data', (buffer) => {
    //	action拿到用户输入结果
    const action = buffer.toString().trim();
    // result拿到一局游戏的输赢情况
    const result = game(action);
    if(result==1){
        score++
    }else if(result==-1){
        score--;
    }
    console.log('当前得分：'+score);
})

/*
* @func 根据用户输入，输出输或赢
* @return win/lose
*/
const game = function (action) {
    // 判断用户输入
    if (['rock', 'scissor', 'paper'].includes(action) == -1) {
        return new Error('用户输入错误');
    }
    let computerAction;
    // 用数组+随机数表示电脑出招
    let random = Math.floor(Math.random() * 3);
    const arr = ['rock','scissor','paper'];
    computerAction = arr[random];
    console.log("电脑出了"+computerAction);
    // 判断输赢
    if (computerAction == action) {
                console.log('平局')
                return 0; // 平局
            } else if ( 
                (computerAction == 'rock' && action == 'scissor') ||
                (computerAction == 'scissor' && action == 'paper') || 
                (computerAction == 'paper' && action == 'rock')
            ) {
                console.log('你输了')
                return -1;
            } else {
                console.log('你赢了');
                return 1;
            }
}
```

总结

当我们拿到一个需求时，不要上来就写代码，首先应该有一个大概的思路，然后将这个思路分为几个具体的步骤，将每个步骤都考虑清楚再考虑下一个步骤，不要这个步骤还没有写完就考虑下一步，循序渐进式写代码，思路要清晰。当我们初步写完时，肯定会有一些bug的，可能有一些条件没有判断，有些地方可以优化，比如上面的includes，当我们的用户输入的是0或者空字符串时，他就不会return Error了，亦或者ifelse很冗余，能不能优化一下，这些我们都可以写完后考虑一下的。优秀的代码习惯是非常重要的奥。OK今天蘑菇头就聊到这里，欢迎下次再见。
