---
title: "敲开Ai的大门，使用colab+openai爬取网页内容"
description: "敲开Ai的大门，使用colab+DashScope爬取网页内容 前言 colab不知道大家用过没有，个人感觉用着还行，但是需要魔法，它无需在本地配置复杂的开发环境，可以方便地与他人共享..."
date: "2025-07-05"
tags: ["AI","后端"]
draft: false
featured: false
---
敲开Ai的大门，使用colab+DashScope爬取网页内容

前言

colab不知道大家用过没有，个人感觉用着还行，但是需要魔法，它无需在本地配置复杂的开发环境，可以方便地与他人共享笔记本，可直接在浏览器中编写和运行代码，支持多种编程语言，如Python等。蘑菇头今天也是学了点新知识，在colab平台上使用阿里云推出的DashScope实现一个网页爬取的效果，今天就把它分享出来。

详细思路步骤

1. 安装requests和beautifulsoup4，requests是请求库，BeautifulSoup 是一个用于从 HTML 和 XML文件中提取数据的 Python库。
2. 引入模块requests和beautifulsoup4
3. 设置请求头，发送http请求到目标网址
4. 通过BeautifulSoup拿到内存中的dom对象
5. 通过BeautifulSoup将字符串切片，拿到目标信息
6. 将目标信息拼接字符串编写提示词prompt
7. 安装阿里云的dashscope
8. 引入dashscope
9. 设置api_key，如果没有api_key的话可以去github这个项目上找[chatanywhere/GPT_API_free: Free ChatGPT API Key，免费ChatGPT API，支持GPT4 API（免费），ChatGPT国内可用免费转发API，直连无需代理。可以搭配ChatBox等软件/插件使用，极大降低接口使用成本。国内即可无限制畅快聊天。 (github.com)](https://github.com/chatanywhere/GPT_API_free?tab=readme-ov-file)
10. 将写好的提示词传入message中，设置好模型，就可以调用dashscope的call方法拿到返回结果了。

具体代码

```
!pip install requests
!pip install beautifulsoup4
import requests  
from bs4 import BeautifulSoup

def fetch_movie_list(url):
  # 设置HTTP 请求头
  headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
  }
  url = 'https://movie.douban.com/chart'
  response = requests.get(url, headers=headers)
  # 状态码 成功
  if response.status_code == 200:
    # 内存中的dom对象
    soup = BeautifulSoup(response.text, 'html.parser')
    movie_list = []
    movies = soup.select('#wrapper #content .article .item')
    all_movies_text = ''.join([movie.prettify() for movie in movies[:2]])
    return all_movies_text
  else:
    print("Failed to retrieve content ")

movies = fetch_movie_list(url)
print(movies)
```

可以看到已经爬取到了我们想要的内容

![](/images/articles/Snipaste_2024-05-16_10-13-06.png)

编写prompt交给大模型去做

```
prompt  = f"""
{movies}
这是一段电影列表html，请获取电影名（name），封面链接（picture），简介（info），评分（score），评论人数（commentsNumber），请使用括号的单词作为属性名，以JSON数组的格式返回
"""
print(prompt)
```

```
!pip install dashscope
import dashscope
dashscope.api_key = '填上你的apikey'
def call_qwen_with_prompt():
    messages = [
        {
            'role':'user',
            'content':prompt
        }
    ]
    response = dashscope.Generation.call(
        dashscope.Generation.Models.qwen_turbo,
        messages=messages,
        rseult_messages='message')
    print(response)
call_qwen_with_prompt()
```

可以看到返回结果200

![](/images/articles/Snipaste_2024-05-16_10-18-15.png)

总结

使用大模型开发确实能够提高开发效率，简简单单的一句prompt就能完成一个复杂的业务功能，非常高效，大家也快去试试吧。
