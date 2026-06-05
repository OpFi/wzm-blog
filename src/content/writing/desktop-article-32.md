---
title: "哈希表：之《两数之和》《字母异位词分组》《最长连续序列》"
description: "1. 两数之和 给定一个整数数组 nums 和一个整数目标值 target ，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。 示例 ： 我的思路..."
date: "2025-08-18"
tags: ["算法","浏览器"]
draft: false
featured: false
---
1. 两数之和

   给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

   **示例 ：**

   ```
   输入：nums = [2,7,11,15], target = 9
   输出：[0,1]
   解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
   ```

我的思路，暴力破解，两层for循环遍历这个数组，如果找到目标值，返回数组下标。

```
class Solution {
  public int[] twoSum(int[] nums, int target) {
​    int n = nums.length;
​    for(int i =0 ;i< n;++i){
​      for(int j =i+1;j < n;j++){
​        if(nums[i]+nums[j]==target){
​          return new int[]{i,j};
​        }
​      }
​    }
​    return new int[0];
  }
}
```

更好的思路，可以使用哈希表，x+y=target，上面的这个方法就是在寻找y的值浪费了时间，如果一开始就把y的值确定了就可以节省时间开销，y=target-x，如果没有找到就把x的值和位置记录下来。

```
public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> hashtable = new Hashtable<Integer, Integer>();
    for(int i =0 ;i< nums.length;++i){
        if(hashtable.containsKey(target-nums[i])){
        //containsKey()判断哈希表里是否有这个数，如果有则返回TRUE
            return new int[]{hashtable.get(target-nums[i]),i};
        }
        hashtable.put(nums[i],i);
    }
    return new int [0];
}
```


2.字母异位词分组

给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。

**字母异位词** 是由重新排列源单词的所有字母得到的一个新单词。

**示例 :**

```
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

我的思路：由于每个字母对应这相应的ASC码值，字母异位之后都是原字母，所以总的ASC码值不变，所以我想通过对比每个字符串的总ASC值来归类，但是没有考虑到有可能不同的字母加起来会的到一样的值。

题解思路：可以通过对每个字符串排序，用一个哈希表存起来，key为排序后的字符串，value为list原字符串。

```
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> hashmap = new HashMap<String, List<String>>();
    for(String str:strs){
        char[] array = str.toCharArray();
        Arrays.sort(array);//排序
        String key = new String(array);
        List<String> list = hashmap.getOrDefault(key,new ArrayList<String>());
        //getOrDefault()如果key存在就使用那个key，如果不存在就用新的key
        list.add(str);
        hashmap.put(key,list);
    }
    return new ArrayList<List<String>>(hashmap.values());
}
```

另一种解题思路：计算每个单词的每个字母出现的次数，如果次数一样就说明是字母异位词

```
public static List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> hashmap = new HashMap<String, List<String>>();
    for(String str:strs){
            int[] counts = new int[26];
            int length = str.length();
            for (int i = 0; i < length; i++) {
                counts[str.charAt(i) - 'a']++;
            }
            // 将每个出现次数大于 0 的字母和出现次数按顺序拼接成字符串，作为哈希表的键
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < 26; i++) {
                if (counts[i] != 0) {
                    sb.append((char) ('a' + i));
                    sb.append(counts[i]);
                }
            }
            String key = sb.toString();
        List<String> list = hashmap.getOrDefault(key,new ArrayList<String>());
        list.add(str);
        hashmap.put(key,list);
    }
    return new ArrayList<List<String>>(hashmap.values());
}
```


总结：距离成为高手还有一段很长的路要走，很多集合的方法都忘记了。


3.最长连续序列

给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 `O(n)` 的算法解决此问题。

**示例 ：**

```
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

我的思路：先对数组进行排序，枚举每个数，如果加1能找到下一个与他相等，计数就加一。如果下一个数的计数大于上一个就更新。

有思路写不出来很难受呀。。。。我还是看看题解吧。

题解思路：首先开始思路和我想的差不多，但是耗时太多，主要是当枚举完第一个数之后，假如第二个数是连续的，就会浪费时间，所以我们需要跳过已经是连续的数，可以使用哈希表。具体实现如下：

```
public static int longestConsecutive(int[] nums) {
    Set<Integer> num_set = new HashSet<Integer>();
    for (int num : nums) {//去重
        num_set.add(num);
    }
    int longestStreak = 0;//最终结果

    for (int num : num_set) {//枚举每个数
        if (!num_set.contains(num - 1)) {//如果哈希表中不存在已经连续的数
            int currentNum = num;//当前正在枚举的数
            int currentStreak = 1;//当前枚举的数连续的个数

            while (num_set.contains(currentNum + 1)) {//如果能找到连续的数
                currentNum += 1;//查找下一个连续的数
                currentStreak += 1;//连续的个数加一
            }

            longestStreak = Math.max(longestStreak, currentStreak);//正在枚举的数与最长的枚举的数进行比较，更新结果
        }
    }

    return longestStreak;
}
```
