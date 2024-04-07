# setState分析

在react16.8之前的版本，class组件大行其道的时候，我们想要改变组件的状态并期望组件UI做出相应的渲染，可行的方法是使用 `setState`，更新状态并重新渲染组件，完成**model数据层**和**view视图层**的更新。

在react16.8之后的版本，我们知道react基于`fiber`架构推出了`hooks`函数式组件的模式，这个模式下，我们可以使用`useState`来保存组件中的状态以及组件视图的更新。可以实现类似class组件中的 `state`和`setState`的功能。

## class类组件与hooks

需要了解的背景是，class类组件的出现是为了拥有独立的局部状态。作为一个实例对象，可以单独维护其内部的属性和方法。而对于每次状态的更新和重新渲染，只是对其 `render`方法的调用。并不会重新创建组件实例。

对于16.8之后的`hooks`函数式写法，我们知道每当状态更新后，函数都会被执行一遍，其并不能保证对状态的保存，不过，通过react的`fiber`架构，我们可以使用`hooks`实现对状态的管理维护。

function组件不会实例化, 它只是被直接调用, 故无法维护一份独立的局部状态, 只能依靠Hook对象间接实现局部状态。

fiber通过双缓存的操作，维护了两个fiber树，一个是渲染到视图中最终呈现的fiber树，还有一个是维护在内存中的fiber树。二者交替执行并实现了对状态的转移和维护

## setState的同步和异步

先说结论：`setState`对于状态的更新是可以同步也可以异步的，主要看受不受react的控制。

1. 在react可控的合成事件与钩子函数中是异步的（如：`<div onClick={this.increment}>`、`componentDidMount`）
2. 在react不可控的原生事件、setTimeout、setInterval中是同步的（如：`body.addEventListener('click', this.increment, false)`、`setTimeout`）

> 合成事件：react为了解决跨平台，兼容性问题，自己封装了一套事件机制，代理了原生的事件，像在jsx中常见的onClick、onChange这些都是合成事件。

```js
// 可控的 异步
class App extends React.Component {
  state = { val: 0 }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 这里获取到的值是更新前的 0
  }

  render() {
    return <div>{this.state.val}</div>
  }
}

// 不可控的 同步
class App extends React.Component {
  state = { val: 0 }

  componentDidMount() {
    setTimeout((_) => {
      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val) // 这里获取到的值是更新后的 1
    }, 0)
  }

  render() {
    return <div>{this.state.val}</div>
  }
}
```

## 类组件中的setState

> 以react16.4版本为例

### 合成事件 中的 setState

当我们定义一个点击事件执行函数时，可以这样理解：

1. 首先，`onClick`属于react的合成事件，会走react的异步更新机制

```js
class App extends Component {

  state = { val: 0 }

  increment = () => {
    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 输出的是更新前的val --> 0
  }
  render() {
    return (
      <div onClick={this.increment}>
        {`Counter is: ${this.state.val}`}
      </div>
    )
  }
}
```

2. 对于其异步机制，类比分析，可以这样理解：

```js
// 执行关系：try => finally 
try {
    return fn(a, b); // 触发事件函数执行的逻辑代码
} finally {
    performSyncWork(); // 更新函数
}
```

`increment`函数会先在 `try`的逻辑中执行，然后函数代码执行结束，再执行 `finally`的中的更新逻辑函数，因此对于`console.log(this.state.val)`来说，在其执行的时候还处于`try`的非更新阶段，因此其获取到的值还是原来的。

### 原生事件 中的 setState

1. 首先，原生事件不属于react的合成事件流，所以，不受react控制，是同步更新。

```js
class App extends Component {

  state = { val: 0 }

  changeValue = () => {
    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 输出的是更新后的值 --> 1
  }

 componentDidMount() {
    document.body.addEventListener('click', this.changeValue, false)
 }

  render() {
    return (
      <div>
        {`Counter is: ${this.state.val}`}
      </div>
    )
  }
}
```

2. 对于其同步更新机制，类比分析，可以这样理解：

在fn的整个执行栈的中，会调用`requestWork`函数，控制同步和异步、以及批量更新操作。

```js
// 执行关系：try => finally 
try {
    return fn(a, b); // 会调用 requestWork函数
} finally {
    performSyncWork(); // 更新函数
}

function requestWork(root, expirationTime) {
//   addRootToSchedule(root, expirationTime);

//   // 处于 render渲染中，直接返回
//   if (isRendering) {
//     return;
//   }

//   if (isBatchingUpdates) {
//     // Flush work at the end of the batch.
//     if (isUnbatchingUpdates) {
//       // 异步批量更新
//       nextFlushedRoot = root;
//       nextFlushedExpirationTime = Sync;
//       performWorkOnRoot(root, Sync, false);
//     }
//     return;
//   }

  // 同步更新
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpiration(expirationTime);
  }
}
```

这里 `expirationTime === Sync`会触发 `true`的逻辑，直接调用执行更新函数 `performSyncWork`，也就是说在 `try`的逻辑中同步完成了函数执行和状态更新。由此可以知道，`console.log(this.state.val)`在执行的时候，已经是更新后的值了。

### setTimeout 中的 setState

1. setTimeout是受其外层环境所控制的，它可以是合成事件中，也可以原生事件中。
2. 但setTimeout是基于evenloop模型下的，这是确定的

根据结论，我们是知道的，setTimeout是同步更新的。分析一波，如下：

首先，原生事件这种同步场景不做分析，考虑在合成事件场景下的逻辑。

按照我们上面的逻辑，在合成事件中，是先执行 `try`块中的代码逻辑的，然后再执行 `finally`块中的更新代码逻辑。

因为结果和我们理解的流程有出入，那主要就是看在 `try`发生了什么，如下：

1. 在 `try`中，代码块执行到 `setTimeout`的时候，会把它放入JS的任务队列中，由evenloop控制，这时，其内部代码是没有被执行的。
2. `try`中代码执行结束，开始执行 `finally`中的代码逻辑，并在执行完成后重置`isBatchingUpdates`为`false`。
3. 这时候再执行队列中的代码时，因为`isBatchingUpdates`为`false`，就会走 return的逻辑（和`expirationTime === Sync`一样的逻辑），跳出并执行`performSyncWork`开始同步执行。

```js
function requestWork(root, expirationTime) {
//   addRootToSchedule(root, expirationTime);

  // 处于 render渲染中，直接返回
  if (isRendering) {
    return;
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    // if (isUnbatchingUpdates) {
    //   // 异步批量更新
    //   nextFlushedRoot = root;
    //   nextFlushedExpirationTime = Sync;
    //   performWorkOnRoot(root, Sync, false);
    // }
    return;
  }

  // 同步更新
//   if (expirationTime === Sync) {
//     performSyncWork();
//   } else {
//     scheduleCallbackWithExpiration(expirationTime);
//   }
}
```

### 生命周期函数 中的 setState

```js
class App extends Component {

  state = { val: 0 }

 componentDidMount() {
    this.setState({ val: this.state.val + 1 })
   console.log(this.state.val) // 输出的还是更新前的值 --> 0
 }
  render() {
    return (
      <div>
        {`Counter is: ${this.state.val}`}
      </div>
    )
  }
}
```

执行栈逻辑简要分析

```js
        render
            ↓   
    componentDidMount开始执行
            ↓   
Component.prototype.setState
            ↓   
    requestWork
            ↓  
    isRendering 逻辑判断
            ↓  
    componentDidMount执行完成
            ↓
    commitUpdateQueue
```

当`componentDidMount`执行完成后，才去执行更新逻辑，因此，`console.log(this.state.val)`在执行的时候，也是更新前的值

### 异步队列优化

如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新

```js
class App extends Component {

  state = { val: 0 }

  batchUpdates = () => {
    this.setState({ val: this.state.val + 1 })
    this.setState({ val: this.state.val + 1 })
    this.setState({ val: this.state.val + 1 })
 }

  render() {
    return (
      <div onClick={this.batchUpdates}>
        {`Counter is ${this.state.val}`} // 1
      </div>
    )
  }
}
```

在setState的时候react内部会创建一个updateQueue，通过firstUpdate、lastUpdate、lastUpdate.next去维护一个更新的队列，在最终的performWork中，相同的key会被覆盖，只会对最后一次的setState进行更新

### 小总结下

1. `isBatchingUpdates`、`isUnbatchingUpdates`默认值都为`false`
2. `performSyncWork`函数在执行完成后会重置`isBatchingUpdates`为`false`
3. 有多少控制就有多少优化
4. 批量更新的策略是基于"异步"之上的

## hooks中的setState

fiber+hooks的最大不同就是实现了时间切片可中断更新与优先级管理。并基于此引入了`scheduler`调度器进行任务调度（调度中心是通过`MessageChannel`触发消息通知，执行任务，该过程是异步执行的）。

1. react默认按照60fps屏幕刷新率，设置单个任务执行时间长度为5ms，超过5ms的任务会被放入队列中，等待下一帧执行。
   - 这样做可以及时的让出主线程，不会使耗时代码执行阻塞主线程，避免卡顿
2. 优先级，通过对不同类型任务设置不同的优先级，可以控制不同类型任务的执行顺序，优先执行高优先级的任务
   - 浏览器可以处理用户输入，UI 绘制等紧急任务

- 任务调度核心函数

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

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

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

- 时间切片核心函数

```js
const localPerformance = performance;
// 获取当前时间
getCurrentTime = () => localPerformance.now();

// 时间切片周期, 默认是5ms(如果一个task运行超过该周期, 下一个task执行之前, 会把控制权归还浏览器)
let yieldInterval = 5;

let deadline = 0;
const maxYieldInterval = 300;
let needsPaint = false;
const scheduling = navigator.scheduling;
// 是否让出主线程
shouldYieldToHost = function() {
  const currentTime = getCurrentTime();
  if (currentTime >= deadline) {
    if (needsPaint || scheduling.isInputPending()) {
      // There is either a pending paint or a pending input.
      return true;
    }
    // There's no pending input. Only yield if we've reached the max
    // yield interval.
    return currentTime >= maxYieldInterval; // 在持续运行的react应用中, currentTime肯定大于300ms, 这个判断只在初始化过程中才有可能返回false
  } else {
    // There's still time left in the frame.
    return false;
  }
};

// 请求绘制
requestPaint = function() {
  needsPaint = true;
};

// 设置时间切片的周期
forceFrameRate = function(fps) {
  if (fps < 0 || fps > 125) {
    // Using console['error'] to evade Babel and ESLint
    console['error'](
      'forceFrameRate takes a positive int between 0 and 125, ' +
        'forcing frame rates higher than 125 fps is not supported',
    );
    return;
  }
  if (fps > 0) {
    yieldInterval = Math.floor(1000 / fps);
  } else {
    // reset the framerate
    yieldInterval = 5;
  }
};
```

### hooks中对状态和副作用的实现

1. 函数组件通过hooks API创建Hook对象（如: `useState`，`useEffect`）
   - 状态Hook通过维护`fiber.memoizedState`实现了状态持久化（类似于class组件state）
   - 副作用Hook通过维护`fiber.flags`，以及副作用回调（类似于class组件的生命周期回调）
2. 多个Hook对象构成一个链表结构, 并挂载到`fiber.memoizedState`之上
3. fiber树更新阶段, 把`current.memoizedState`链表上的所有Hook按照顺序克隆到`workInProgress.memoizedState`上, 实现数据的持久化。（即 `current` 与 `workInProgress`的双缓存设计）

```js
function App() {
  const [state, setState] = useState(0)

  return <div>state is: {state}</div>
}
```

对于react的hooks使用时，为什么不能在`if`中使用？

因为多个hooks对象是以链表按顺序结构进行存储的，是按照顺序一一对应的，因此，对于在`if`条件中使用，会导致链表的顺序错乱。

对于react多次调用setState状态更新的情况？

```js
import { useState } from 'react'
export default function App() {
  const [count, setState] = useState(0)

  return (
    <>
      <button
        onClick={() => {
          setState(count + 1)
          setState(count + 2)
          setState(count + 3)
        }}
      >
        state改变 count={count}  {/* 默认为 0 点击后更新为 3 */}
      </button>
    </>
  )
}
```

在可控的执行逻辑中，会维护一个更新队列，最后会一次性批量更新渲染，这是一个异步操作，同一个useState只会提交最后一个更新。

## 资料

- [你真的理解setState吗？](https://zhuanlan.zhihu.com/p/39512941)
- [图解React](https://7kms.github.io/react-illustration-series/main/hook-summary)
