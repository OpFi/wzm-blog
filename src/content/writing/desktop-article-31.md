---
title: "双指针：之《移动0》《盛最多水的容器》《三数之和》"
description: "4.移动0 给定一个数组 nums ，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。 请注意 ，必须在不复制数组的情况下原地对数组进行操作。 示例 : 我的思路..."
date: "2025-08-22"
tags: ["算法","性能优化"]
draft: false
featured: false
---
### 4.移动0

给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

**请注意** ，必须在不复制数组的情况下原地对数组进行操作。

 **示例 :**

```
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

我的思路：有一点思路，就是遍历这个数组，如果是0就把他放到最后，但是实现起来总感觉很难。

题解：用两个指针i，j，一个用于指向非0的数，一个指向第一个0的位置，交换他们两的位置即可。

```
public static void moveZeroes(int[] nums) {
    int n = nums.length;
    int j =0;
    for(int i =0 ;i<n;i++){
        if(nums[i]!=0){//如果找到不等于0的数，就交换j所处位置上为0的数
            int tmp = nums[i];
            nums[i] = nums[j];
            nums[j++] = tmp;
        }
    }
}
```

### 5.盛最多水的容器

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**示例 ：**

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49 
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

我的思路：两个for循环遍历，计算出每个能盛的水的体积，互相比较大小，求出最大的那个，但是明显会超时

```
public static int maxArea(int[] height) {
    int n = height.length;
    int maxArea =0;//返回结果的最大体积
    for(int i =0;i<n;i++){
        int nowArea = 0 ;//当时的体积
        for(int j =i+1;j<n;j++){
            int s= Math.abs(Math.min(height[i],height[j])*(j-i));
            if(s>nowArea)
                nowArea = s;
        }
        if(maxArea<nowArea)
            maxArea=nowArea;
    }
    return maxArea;
}
```

题解思路：使用两个指针分别指向数组两边，比较板子的大小，记录下此时的体积，如果小的，更新体积。

这是我看完思路写的：

```
 public int maxArea(int[] height) {
        int j = height.length-1;
        int i =0;
        int maxArea = 0;
        while(i!=j){
            if(height[i]<=height[j]){
                if(height[i]*(j-i)>maxArea)
                    maxArea = height[i]*(j-i);
                i++;
            }else{
                if(height[j]*(j-i)>maxArea)
                    maxArea = height[j]*(j-i);
                j--;
            }
        }
        return maxArea;
    }
```

这是题解的：优雅~三元运算符

```
public int maxArea(int[] height) {
        int i = 0, j = height.length - 1, res = 0;
        while(i < j) {
            res = height[i] < height[j] ? 
                Math.max(res, (j - i) * height[i++]): 
                Math.max(res, (j - i) * height[j--]); 
        }
        return res;
    }
```

### 6.三数之和

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请

你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

 **示例 1：**

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
```

好，看到这个题目脑袋是一片空白，什么东西？？？还是直接看题解吧

题解思路：就是三层for循环，但是时间复杂度太高，可以优化，首先会有重复的，比如a,b,c，后面可能会有a,c,b，为了避免这种情况，可以对数组进行排序。但是排序后的数组也可能会有重复，比如连续的相同数字，[0, 1, 2, 2, 2, 3]，所以需要去重，判断前一个数和后一个数不相等，for循环才继续。

```
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        int n = nums.length;
        Arrays.sort(nums);//排序
        List<List<Integer>> ans = new ArrayList<List<Integer>>();//返回结果
        // 枚举 a
        for (int first = 0; first < n; ++first) {
            // 需要和上一次枚举的数不相同
            if (first > 0 && nums[first] == nums[first - 1]) {
                continue;
            }
            // c 对应的指针初始指向数组的最右端
            int third = n - 1;
            int target = -nums[first];
            // 枚举 b
            for (int second = first + 1; second < n; ++second) {
                // 需要和上一次枚举的数不相同
                if (second > first + 1 && nums[second] == nums[second - 1]) {
                    continue;
                }
                // 需要保证 b 的指针在 c 的指针的左侧
                while (second < third && nums[second] + nums[third] > target) {
                    --third;
                }
                // 如果指针重合，随着 b 后续的增加
                // 就不会有满足 a+b+c=0 并且 b<c 的 c 了，可以退出循环
                if (second == third) {
                    break;
                }
                if (nums[second] + nums[third] == target) {
                    List<Integer> list = new ArrayList<Integer>();
                    list.add(nums[first]);
                    list.add(nums[second]);
                    list.add(nums[third]);
                    ans.add(list);
                }
            }
        }
        return ans;
    }
}
```
