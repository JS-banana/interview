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

---

- 开发人员能够控制的是JSX, 也就是ReactElement对象.
- fiber树是通过ReactElement生成的, 如果脱离了ReactElement,fiber树也无从谈起. 所以是ReactElement树(不是严格的树结构, 为了方便也称为树)驱动fiber树.
- fiber树是DOM树的数据模型, fiber树驱动DOM树

开发人员通过编程只能控制ReactElement树的结构, ReactElement树驱动fiber树, fiber树再驱动DOM树, 最后展现到页面上. 所以fiber树的构造过程, 实际上就是ReactElement对象到fiber对象的转换过程

### ReactComponent对象

对于ReactElement来讲, `ReactComponent`仅仅是诸多`type`类型中的一种.

- class类型的组件：继承父类`Component`, 拥有特殊的方法(`setState`,`forceUpdate`)和特殊的属性(`context`,`updater`等).
  - 在**reconciler阶段**, 会依据ReactElement对象的特征, 生成对应的 fiber 节点. 当识别到ReactElement对象是 `class` 类型的时候, 会触发`ReactComponent`对象的生命周期, 并调用其 `render`方法, 生成ReactElement子节点
- function类型的组件
  - Hook只能在function类型的组件中使用
  - 如果在function类型的组件中没有使用Hook(如: `useState`, `useEffect`等), 在**reconciler阶段**所有有关Hook的处理都会略过, 最后调用该function拿到子节点ReactElement
  - 如果使用了Hook, 会涉及到Hook创建和状态保存，function类型的组件和class类型的组件一样(与class组件中的state在性质上是相同的, 都是为了保持组件的状态), 是诸多ReactElement形式中的一种.

## reconciler 运作流程

react-reconciler包的主要作用, 将主要功能分为 4 个方面:

1. 输入: 暴露`api`函数(如: `scheduleUpdateOnFiber`), 供给其他包(如`react`包)调用.
2. 注册调度任务: 与调度中心(`scheduler`包)交互, 注册调度任务`task`, 等待任务回调.
3. 执行任务回调: 在内存中构造出`fiber树`, 同时与与渲染器(`react-dom`)交互, 在内存中创建出与`fiber`对应的`DOM`节点.
4. 输出: 与渲染器(`react-dom`)交互, 渲染`DOM`节点.

![reconciler 运作流程](/static/images/react-fiberworkloop.png)

## React 应用的启动过程

主要是位于 `react-dom`包的 `ReactDOM.render`函数对象，这一步是衔接下一步 **reconciler 运作流程**中的**输入**步骤

目前版本有3中启动模式，这里只说明默认模式，也即我们常用的 **legacy 模式**: `ReactDOM.render(<App />, rootNode)`

### 3 个全局对象

无论Legacy, Concurrent或Blocking模式, react 在初始化时, 都会创建 3 个全局对象
  
- **ReactDOM(Blocking)Root对象**
  - 属于 `react-dom`包, 该对象暴露有`render`, `unmount`方法, 通过调用该实例的 `render`方法, 可以引导 react 应用的启动.
- **fiberRoot对象**
  - 属于 `react-reconciler`包, 作为react-reconciler在运行过程中的全局上下文, 保存 fiber 构建过程中所依赖的全局状态.
  - 其大部分实例变量用来存储`fiber` 构造循环过程的各种状态.react 应用内部, 可以根据这些实例变量的值, 控制执行逻辑.
- **HostRootFiber对象**
  - 首个fiber对象
  - 属于 `react-reconciler`包, 这是 react 应用中的第一个 `Fiber` 对象, 是 `Fiber` 树的根节点, 节点的类型是 `HostRoot`

这 3 个对象是 react 体系得以运行的基本保障, 一经创建大多数场景不会再销毁(除非卸载整个应用`root.unmount()`).

---

1. 调用 `ReactDOM.render`函数

   - root还未初始化：创建 `ReactDOMRoot`对象, 初始化react应用环境
   - root已经初始化：获取 `FiberRoot`对象

   代码调用分析：

   - 调用`ReactDOM.render` => `new ReactDOMBlockingRoot`（创建 `ReactDOMBlockingRoot`实例）
   - 调用`ReactDOMBlockingRoot` => `createRootImpl` => `this._internalRoot = createRootImpl(container, tag, options)`（创建 `fiberRoot` 对象）
   - 调用 `createRootImpl` => `createContainer` => `createFiberRoot` => `createHostRootFiber`（创建 `HostRootFiber`对象）

2. 调用 `updateContainer`函数进行更新

- `updateContainer`函数中最后调用了 `scheduleUpdateOnFiber`，`scheduleUpdateOnFiber`是**reconciler 运作流程**中**输入阶段**的**入口函数**
- `updateContainer`函数位于react-reconciler包中, 它串联了react-dom与react-reconciler

```js
this._internalRoot = createRootImpl(container, tag, options)
```

```js
function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // ... 省略部分源码(有关hydrate服务端渲染等, 暂时用不上)
  // 1. 创建fiberRoot
  const root = createContainer(container, tag, hydrate, hydrationCallbacks); // 注意RootTag的传递
  // 2. 标记dom对象, 把dom和fiber对象关联起来
  markContainerAsRoot(root.current, container);
  // ...省略部分无关代码
  return root;
}
```

```js
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  // 创建fiberRoot对象
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks); // 注意RootTag的传递
}
```

创建 HostRootFiber 对象

```js
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建fiberRoot对象, 注意RootTag的传递
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);

  // 1. 这里创建了`react`应用的首个`fiber`对象, 称为`HostRootFiber`
  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  // 2. 初始化HostRootFiber的updateQueue
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

```js
export function createHostRootFiber(tag: RootTag): Fiber {
  let mode;
  // ... 省略 mode的相关判断
  return createFiber(HostRoot, null, null, mode); // 注意这里设置的mode属性是由RootTag决定的
}
```

## 优先级使用

通过reconciler 运作流程中的归纳, reconciler从输入到输出一共经历了 4 个阶段, 在每个阶段中都会涉及到与**优先级**相关的处理. 正是通过**优先级**的灵活运用, React实现了**可中断渲染**，**时间切片(time slicing)**，**异步渲染(suspense)**等特性**.

## React 调度原理(scheduler)

内部函数划分为两个部分：

1. 调度相关: 请求或取消调度
2. 时间切片(time slicing)相关: 执行时间分割, 让出主线程(把控制权归还浏览器, 浏览器可以处理用户输入, UI 绘制等紧急任务).

消费任务主要围绕两个函数进行 `requestHostCallback`和 `cancelHostCallback`

```js
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline; // 绑定

// 请求回调
requestHostCallback = function(callback) {
  // 1. 保存callback
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // 2. 通过 MessageChannel 发送消息
    port.postMessage(null);
  }
};
// 取消回调
cancelHostCallback = function() {
  scheduledHostCallback = null;
};
```

```js
// 接收 MessageChannel 消息
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime(); // 1. 获取当前时间
    deadline = currentTime + yieldInterval; // 2. 设置deadline
    const hasTimeRemaining = true;
    try {
      // 3. 执行回调, 返回是否有还有剩余任务
      const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
      if (!hasMoreWork) {
        // 没有剩余任务, 退出
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      } else {
        port.postMessage(null); // 有剩余任务, 发起新的调度
      }
    } catch (error) {
      port.postMessage(null); // 如有异常, 重新发起调度
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
  needsPaint = false; // 重置开关
};
```

很明显, 请求回调之后 `scheduledHostCallback = callback`, 然后通过 `MessageChannel`发消息的方式触发`performWorkUntilDeadline`函数, 最后执行回调 `scheduledHostCallback`.

![调度中心的内核实现](/static/images/react-scheduler-core.png)

### 任务队列管理

简单来说，调度的目的是为了消费任务。

在 `Scheduler.js`中, 维护了一个 `taskQueue`任务队列

任务的创建过程：

1. 获取当前时间
2. 根据传入的优先级, 设置任务的过期时间 expirationTime
3. 创建新任务
4. 加入任务队列
5. 请求调度（`requestHostCallback(flushWork)`）

创建任务之后, 最后请求调度 `requestHostCallback(flushWork)`，`flushWork`函数作为参数被传入调度中心内核等待回调

任务消费：

队列消费的主要逻辑是在workLoop函数中， 这就是React 工作循环一文中提到的任务调度循环。

```js
// 省略部分无关代码
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime; // 保存当前时间, 用于判断任务是否过期
  currentTask = peek(taskQueue); // 获取队列中的第一个任务
  while (currentTask !== null) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 虽然currentTask没有过期, 但是执行时间超过了限制(毕竟只有5ms, shouldYieldToHost()返回true). 停止继续执行, 让出主线程
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 执行回调
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      // 回调完成, 判断是否还有连续(派生)回调
      if (typeof continuationCallback === 'function') {
        // 产生了连续回调(如fiber树太大, 出现了中断渲染), 保留currentTask
        currentTask.callback = continuationCallback;
      } else {
        // 把currentTask移出队列
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
    } else {
      // 如果任务被取消(这时currentTask.callback = null), 将其移出队列
      pop(taskQueue);
    }
    // 更新currentTask
    currentTask = peek(taskQueue);
  }
  if (currentTask !== null) {
    return true; // 如果task队列没有清空, 返回ture. 等待调度中心下一次回调
  } else {
    return false; // task队列已经清空, 返回false.
  }
}
```

每一次while循环的退出就是一个时间切片, 深入分析while循环的退出条件:

1. 队列被完全清空
2. 执行超时

### 时间切片原理

消费任务队列的过程中, 可以消费`1~n`个 task, 甚至清空整个 queue. 但是在每一次具体执行 `task.callback`之前都要进行超时检测, 如果超时可以立即退出循环并等待下一次调用.

### 可中断渲染原理

在时间切片的基础之上, 如果单个 `task.callback`执行时间就很长(假设 200ms). 就需要 `task.callback`自己能够检测是否超时, 所以在 fiber 树构造过程中, 每构造完成一个单元, 都会检测一次超时, 如遇超时就退出**fiber树构造循环**, 并返回一个新的回调函数(就是此处的`continuationCallback`)并等待下一次回调继续未完成的fiber树构造.

### 注册调度的优化及setState的相关优化

核心函数——`ensureRootIsScheduled`

在reconciler 运作流程中总结的 4 个阶段中, 注册调度任务属于第 2 个阶段, 核心逻辑位于 `ensureRootIsScheduled`函数中

```js
// ... 省略部分无关代码
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  // 前半部分: 判断是否需要注册新的调度
  const existingCallbackNode = root.callbackNode;
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  const newCallbackPriority = returnNextLanesPriority();
  if (nextLanes === NoLanes) {
    return;
  }
  // 节流防抖
  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority;
    if (existingCallbackPriority === newCallbackPriority) {
      return;
    }
    cancelCallback(existingCallbackNode);
  }
  // 后半部分: 注册调度任务 省略代码...

  // 更新标记
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}
```

正常情况下, `ensureRootIsScheduled`函数会与 `scheduler`包通信, 最后注册一个`task`并等待回调.

1. 在task注册完成之后, 会设置fiberRoot对象上的属性(fiberRoot是 react 运行时中的重要全局对象), 代表现在已经处于调度进行中
2. 再次进入`ensureRootIsScheduled`时(比如连续 2 次`setState`, 第 2 次`setState`同样会触发reconciler运作流程中的调度阶段), 如果发现处于调度中, 则需要一些节流和防抖措施, 进而保证调度性能.
   - 节流(判断条件: `existingCallbackPriority === newCallbackPriority`, 新旧更新的优先级相同, 如连续多次执行`setState`), 则无需注册新`task`(继续沿用上一个优先级相同的task), 直接退出调用.
   - 防抖(判断条件: `existingCallbackPriority !== newCallbackPriority`, 新旧更新的优先级不同), 则取消旧`task`, 重新注册新`task`.

### scheduler为何使用 `MessageChannel`实现通信？

当 `scheduler.shouldYield()` 返回 `true` 后，Scheduler 需要满足以下功能点：

1. 暂停 JS 执行，将主线程还给浏览器，让浏览器有机会更新页面
2. 在未来某个时刻继续调度任务，执行上次还没有完成的任务

要满足这两点就需要调度一个宏任务，因为宏任务是在下次事件循环中执行，不会阻塞本次页面更新。而**微任务是在本次页面更新前执行**，与同步执行无异，不会让出主线程。

使用 `MessageChannel` 的目的就是为了产生宏任务。

思考：

- 为什么不使用 `setTimeout(fn, 0)` 呢？

递归的 setTimeout() 调用会使调用间隔变为 4ms，导致浪费了 4ms。

- 为什么不使用 `requestAnimationFrame(fn)`（rAF()） 呢？

1. 如果上次任务调度不是 rAF() 触发的，将导致在当前帧更新前进行两次任务调度。
2. 页面更新的时间不确定，如果浏览器间隔了 10ms 才更新页面，那么这 10ms 就浪费了。

## 资料

- 《图解React》
- [React Scheduler 为什么使用 MessageChannel 实现](https://juejin.cn/post/6953804914715803678)
