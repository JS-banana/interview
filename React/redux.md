# Redux

redux遵循三大基本原则：

1. 单一数据源
2. state 是只读的
3. 使用纯函数来执行修改

## 思考

1. redux 核心实现分析
2. 异步中间件实现分析
3. 顶层provider作用分析

## 工作原理

redux要求我们把数据都放在 store公共存储空间

一个组件改变了 store 里的数据内容，其他组件就能感知到 store的变化，再来取数据，从而间接的实现了这些数据传递的功能

![redux](/static/images/redux.png)

## 中间件

中间件是对应用能力的一种拓展，一般应用核心（core）只做基本功能和插件使用能力，把多余的功能全局解耦，通过单一职责的插件去丰富应用的能力，比如 koa的中间件模式、webpack的plugin模式。

这里的redux中间件，相当于是在执行dispatch函数时，延迟了修改state的操作，实现了一种类似异步更新的操作。

![redux-middlewares](/static/images/redux-middlewares.png)
