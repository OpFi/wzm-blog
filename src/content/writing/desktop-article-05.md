---
title: "mybatis整合"
description: "1.mybatis使用 1.引入依赖 2.整体项目结构如下 2.1.开始创建项目 创建pojo类，这里使用lombok，需要导入依赖和下载插件 2.2创建mapper，这里只写了两个方..."
date: "2025-12-04"
tags: ["后端","浏览器"]
draft: false
featured: true
---
### 1.mybatis使用

1.引入依赖

```
mybatis依赖
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.5</version>
</dependency>

数据库依赖
<dependency>
     <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
     <version>5.1.46</version>
</dependency>
```

2.整体项目结构如下


2.1.开始创建项目

创建pojo类，这里使用lombok，需要导入依赖和下载插件

```
package com.wzm.pojo;

import lombok.Data;

@Data
public class User {

    private Integer id;
    private String name;
    private String age;
    private String email;
}
```


2.2创建mapper，这里只写了两个方法，一个查所有，一个根据id查

```
package com.wzm.mapper;

import com.wzm.pojo.User;

import java.util.List;

public interface UserMapper {
    public User selectById(int id);
    public List<User> selectAll();
}
```

注意：这里的方法名要和映射文件里的id对应


2.3创建mapper映射文件

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--
    namespace:名称空间
-->
<mapper namespace="com.wzm.mapper.UserMapper">

    <select id="selectAll" resultType="com.wzm.pojo.User">
        select *
        from user;
    </select>
    <select id="selectById" resultType="com.wzm.pojo.User">
        select *
        from user where id = #{id};
    </select>
    
</mapper>
```


2.4创建mybatis的核心配置，数据库链接都在这里

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql:///study?useSSL=false"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
<!--        扫描userMapper.xml文件sql-->
        <mapper resource="com.wzm.mapper/UserMapper.xml"/>
        <mapper resource="com.wzm.mapper/BookMapper.xml"/>             
    </mappers>


</configuration>
```


3.开始测试

```
package com.wzm;

import com.wzm.mapper.UserMapper;
import com.wzm.pojo.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class App {
    public static void main(String[] args) throws IOException {
        // 创建SqlSessionFactory
        String resource = "mybatis-config.xml";
        // 扫描mybatis-config配置文件
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        // 创建SqlSession
        SqlSession sqlSession = sqlSessionFactory.openSession();

        try {
            // 获取Mapper接口的实例
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

            // 执行查询1号用户
            User user = userMapper.selectById(1);
            System.out.println(user);
            //执行查询所有用户
            List<User> users = userMapper.selectAll();
            System.out.println(users);
        } finally {
            sqlSession.close();
        }
    }
}
```

### 2.spring整合mybatis

1.引入依赖

```
<dependencies>
    <!-- Spring 依赖-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.1.8.RELEASE</version>
    </dependency>

    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.2</version>
    </dependency>

    <!-- 数据库驱动，例如MySQL -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
</dependencies>
```


2.项目整体结构如下


2.1新建service层

```
package com.wzm.service;

import com.wzm.mapper.UserMapper;
import com.wzm.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserMapper userMapper;

    public User getUserById(int id) {
        return userMapper.selectById(id);
    }

    public List<User> selectAll(){
        return userMapper.selectAll();
    }

    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserMapper getUserMapper() {
        return userMapper;
    }
}
```


2.2这里使用配置文件的方式，创建spring的配置文件applicationContext.xml（也可以使用配置类）

```
<beans  xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--mysql的数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql:///study?useSSL=false"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>
<!--mybaties的配置-SqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="mapperLocations" value="classpath:com.wzm.mappers/*.xml" />
    </bean>
<!--配置mapper扫描-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.wzm.mapper" />
    </bean>
<!--配置事务管理-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>
<!--配置userMapper的bean  tips：这里userService里需要有set方法才能配置-->
    <bean class="com.wzm.service.UserService" id="userService">
        <property name="userMapper" ref="userMapper"/>
    </bean>

</beans>
```


3.开始测试

```
package com.wzm;

import com.wzm.pojo.User;
import com.wzm.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = ctx.getBean(UserService.class);
        User user = userService.getUserById(1);
        System.out.println(user);
    }
}
```

tips：这里的加载配置文件可以有三种方式

classpathxmlapplicationcontext：加载类路径下的xml配置的applicationcontext
filesystemxmlapplicationcontext：加载磁盘文件的xml配置的applicationcontext
annotationconfigapplicationcontext：加载注解类的applicationcontext

### 3.springboot整合mybatis

1.导入依赖

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>2.1.8.RELEASE</version>
</dependency>
```

2.在UserMapper上加上@Mapper

```
package com.wzm.mapper;

import com.wzm.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper //告诉spring这是mapper
public interface UserMapper {
    //也可以使用注解，这里我们使用xml的方式编写SQL
    //@Select("select * from user where id = #{id}}")
    public User selectById(@Param("id")int id);
    //@Select("select * from user ")
    public List<User> selectAll();
}
```

tips：当同时使用注解和XML配置时，XML配置会覆盖注解的配置，XML配置会优先于注解生效。这是因为XML配置是静态的，它在应用程序启动时就已经加载并生效了，而注解配置是动态的，需要在运行时解析并应用。因此，在存在冲突的情况下，XML配置会优先生效。


3.springboot的配置文件 application.yml

```

#	配置数据源
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db1?useSSL=false&amp
    username: root
    password: 123456
    
#配置mybatis
mybatis:
  mapper-locations: classpath:mappers/*.xml
```

4.项目整体结构


###
