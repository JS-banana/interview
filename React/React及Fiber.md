# React及Fiber

为了更好的理解 React的相关运行逻辑，Fiber流程，可以从宏观的角度，结合图示分析，达到内心有个初步概念核整体轮廓，这样就算不深入源码细节，也能做到对基本流程的掌握。为了进阶和深入理解，可以在其基础之上逐步添加和补充各流程细节，做到由浅入深。

## 宏观层面了解

一定要记住这个流程图

![react-workloop](/static/images/react-workloop.png)

### 区别与联系

- 任务调度循环：需要循环调用, 控制所有任务(task)的调度
  - 任务调度循环的逻辑偏向宏观, 它调度的是每一个任务(task), 而不关心这个任务具体是干什么的
  - 具体任务其实就是执行回调函数performSyncWorkOnRoot或performConcurrentWorkOnRoot
  - 是以树为数据结构, 从上至下执行深度优先遍历
  - fiber构造循环的逻辑偏向具体实现, 它只是任务(task)的一部分(如performSyncWorkOnRoot包括: fiber树的构造, DOM渲染, 调度检测), 只负责fiber树的构造
- fiber构造循环：控制 fiber 树的构造

**fiber构造循环**是**任务调度循环**中的任务(task)的一部分. 它们是从属关系, 每个任务都会重新构造一个fiber树.

### 主干逻辑

两大循环的分工可以总结为: 大循环(任务调度循环)负责调度task, 小循环(fiber 构造循环)负责实现task

react 运行的主干逻辑, 即将输入转换为输出的核心步骤, 实际上就是围绕这两大工作循环进行展开

1. 输入: 将每一次更新(如: 新增, 删除, 修改节点之后)视为一次**更新需求**(目的是要更新`DOM`节点).
2. 注册调度任务: `react-reconciler`收到**更新需求**之后, 并不会立即构造**fiber树**, 而是去调度中心`scheduler`注册一个新任务`task`, 即把**更新需求**转换成一个`task`.
3. 执行调度任务(输出): 调度中心`scheduler`通过**任务调度循环**来执行`task`(`task`的执行过程又回到了`react-reconciler`包中)
   - **fiber构造循环**是`task`的实现环节之一, 循环完成之后会构造出最新的 fiber 树.
   - `commitRoot`是`task`的实现环节之二, 把最新的 fiber 树最终渲染到页面上, `task`完成

主干逻辑就是**输入到输出**这一条链路, 为了更好的性能(如**批量更新**, **可中断渲染**等功能), `react`在输入到输出的链路上做了很多优化策略, 如：**任务调度循环**和**fiber构造循环**相互配合就可以实现**可中断渲染**

---

## ReactElement

所有采用jsx语法书写的节点, 都会被编译器转换, 最终会以 `React.createElement(...)`的方式, 创建出来一个与之对应的`ReactElement`对象.

- 所有的ReactElement对象都有 `key` 属性(且其默认值是 `null`)
- ReactElement节点和fiber节点不是一对一匹配的
  - 在fiber树中`React.Fragment`并没有与之对应的fiber节点
- type属性决定了节点的种类
  - 它的值可以是字符串(代表`div`,`span`等 dom 节点), 函数(代表`fuction`, `class`等节点), 或者 react 内部定义的节点类型(`portal`,`context`,`fragment`等)
  - 在reconciler阶段, 会根据 type 执行不同的逻辑
    - 如 type 是一个字符串类型, 则直接使用.
    - 如 type 是一个`ReactComponent`类型, 则会调用其 `render` 方法获取子节点.
    - 如 type 是一个`function`类型,则会调用该方法获取子节点

### ReactComponent对象

对于ReactElement来讲, `ReactComponent`仅仅是诸多`type`类型中的一种.

- class类型的组件：继承父类`Component`, 拥有特殊的方法(`setState`,`forceUpdate`)和特殊的属性(`context`,`updater`等).
  - 在**reconciler阶段**, 会依据ReactElement对象的特征, 生成对应的 fiber 节点. 当识别到ReactElement对象是 `class` 类型的时候, 会触发`ReactComponent`对象的生命周期, 并调用其 `render`方法, 生成ReactElement子节点
- function类型的组件
  - Hook只能在function类型的组件中使用
  - 如果在function类型的组件中没有使用Hook(如: `useState`, `useEffect`等), 在**reconciler阶段**所有有关Hook的处理都会略过, 最后调用该function拿到子节点ReactElement
  - 如果使用了Hook, 会涉及到Hook创建和状态保存，function类型的组件和class类型的组件一样(与class组件中的state在性质上是相同的, 都是为了保持组件的状态), 是诸多ReactElement形式中的一种.

## 资料

- 《图解React》
