# this

首先，说起 this就离不开执行上下文。

执行上下文的基本概念，拿过来看看：

- **全局执行上下文**：一个程序中只会存在一个全局上下文，全局上下文会生成一个全局对象（以浏览器环境为例，这个全局对象是 window），并且将 this 值绑定到这个全局对象上。它在整个 javascript 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁
- **函数执行上下文**：每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）

这里我们针对函数看，可以发现一点：

函数在被调用时，会创建一个执行上下文，即 this的值在调用的时候被确定

> 因此，这里也会涉及到改变 this的几个基本方法，如：bind、call、apply

**当前可执行代码块的调用者（this）**：如果当前函数被作为对象方法调用或使用 `bind` `call` `apply` 等 API 进行委托调用，则将当前代码块的调用者信息（`this value`）存入当前执行上下文，否则默认为全局对象调用。

<!-- 在执行上下文中，我们了解到，在 **创建阶段**会发生三个行为，分别是：`创建词法环境`、`创建变量环境`，以及确定 `this值的绑定` -->

<!-- bind只生效一次 -->