---
title: "AOP案例实践-记录操作日志"
description: "AOP使用案例 记录操作日志 需求：需要在操作增删改查的时候记录下是谁操作了这些表，什么时间，访问了那个方法，耗时多少时间，等等并把它存入数据表中。 分析：由于在每个增删改的方法中添加..."
date: "2025-12-20"
tags: ["后端","JavaScript"]
draft: false
featured: true
---
### AOP使用案例-记录操作日志

需求：需要在操作增删改查的时候记录下是谁操作了这些表，什么时间，访问了那个方法，耗时多少时间，等等并把它存入数据表中。

分析：由于在每个增删改的方法中添加记录操作日志的代码十分繁琐，并且记录操作增删改的代码几乎一样，所以可以使用AOP做功能增强。

使用过程：

1.引入依赖

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

2.创建日志实体类

```
@Data
@NoArgsConstructor//无惨构造
@AllArgsConstructor//全参构造
public class OperateLog {
    private Integer id; //ID
    private Integer operateUser; //操作人ID
    private LocalDateTime operateTime; //操作时间
    private String className; //操作类名
    private String methodName; //操作方法名
    private String methodParams; //操作方法参数
    private String returnValue; //操作方法返回值
    private Long costTime; //操作耗时
}
```

3.创建日志数据库表

`create table operate_log(
    id int unsigned primary key auto_increment comment 'ID',
    operate_user int unsigned comment '操作人ID',
    operate_time datetime comment '操作时间',
    class_name varchar(100) comment '操作的类名',
    method_name varchar(100) comment '操作的方法名',
    method_params varchar(1000) comment '方法参数',
    return_value varchar(2000) comment '返回值',
    cost_time bigint comment '方法执行耗时, 单位:ms'
) comment '操作日志表';`

4.创建注解类（使用注解的方式定义切如点表达式）

```
@Retention(RetentionPolicy.RUNTIME)//运行时启动注解
@Target(ElementType.METHOD)//在方法上起作用
public @interface Log {
}
```

5.创建mapper向日志表里插入数据

```
@Mapper
public interface OperateLogMapper {

    //插入日志数据
    @Insert("insert into operate_log (operate_user, operate_time, class_name, method_name, method_params, return_value, cost_time) " +
            "values (#{operateUser}, #{operateTime}, #{className}, #{methodName}, #{methodParams}, #{returnValue}, #{costTime});")
    public void insert(OperateLog log);

}
```

6.创建切面类，里面是增强的方法

```
@Slf4j
@Component//交给spring管理
@Aspect //切面类
public class LogAspect {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private OperateLogMapper operateLogMapper;

    @Around("@annotation(com.itheima.anno.Log)")//环绕
    public Object recordLog(ProceedingJoinPoint joinPoint) throws Throwable {
        //操作人ID - 当前登录员工ID
        //获取请求头中的jwt令牌, 解析令牌
        String jwt = request.getHeader("token");
        Claims claims = JwtUtils.parseJWT(jwt);
        Integer operateUser = (Integer) claims.get("id");

        //操作时间
        LocalDateTime operateTime = LocalDateTime.now();

        //操作类名
        String className = joinPoint.getTarget().getClass().getName();

        //操作方法名
        String methodName = joinPoint.getSignature().getName();

        //操作方法参数
        Object[] args = joinPoint.getArgs();
        String methodParams = Arrays.toString(args);

        long begin = System.currentTimeMillis();
        //调用原始目标方法运行
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();

        //方法返回值
        String returnValue = JSONObject.toJSONString(result);

        //操作耗时
        Long costTime = end - begin;


        //记录操作日志
        OperateLog operateLog = new OperateLog(null,operateUser,operateTime,className,methodName,methodParams,returnValue,costTime);
        operateLogMapper.insert(operateLog);

        log.info("AOP记录操作日志: {}" , operateLog);

        return result;
    }

}
```

当调用增删改查时，切面类的增强方法将会被执行。
