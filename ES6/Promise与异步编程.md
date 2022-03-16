# Promise与异步编程

Promises 是异步编程的另一种选择，它的工作方式类似于在其他语言中延迟并在将来执行作业。

Promise的概念并不复杂，难的地方在于结合了JS的单线程运行机制后，以及涉及到的任务队列、事件循环等，在复杂场景的使用中如何清楚的判定执行时机和输出顺序。所以，对于异步编程来说，理解了这些，也就基本搞定了Promise。

> Promise的基本概念及详细使用建议先行阅读官方文档进行了解后再阅读本文。

## 前置知识

单线程、任务队列、事件循环（Event Loop）、宏任务、微任务

基本模型：`宏任务 -> 微任务 -> 渲染 -> 下一个任务...`

可以配合本章内容[JavaScript运行机制](/浏览器/JavaScript运行机制.md#宏任务/微任务)一起食用

### 事件模型

以点击事件为例：

```js
let button = document.getElementById("my-btn");
button.onclick = function(event) {
    console.log("Clicked");
};
```

当 button 被点击，赋值给 onclick 的函数就被添加到作业队列的尾部，并在队列前部所有任务结束之后再执行。

### 回调模式

回调函数模式类似于事件模型，因为异步代码也会在后面的一个时间点才执行。

不同之处在于需要调用的函数（即回调函数）是作为参数传入的：

```js
readFile('example.txt', function (err, contents) { 
  // 回调函数是在 readFile结束操作后执行
  // nodejs 的错误优先 风格
  if (err) {
    throw err
  }
  console.log(contents) 
})
console.log('Hi!') // 这里是立即同步输出的
```

分析：

- `console.log("Hi!")` 会在 `readFile()` 被调用后立即进行输出，要早于 `console.log(contents)` 的打印操作
- 当 `readFile()` 结束操作后，它会将回调函数以及相关参数作为一个新的作业添加到作业队列的尾部。在之前的作业全部结束后，该作业才会执行。

### 两种模式对比

使用回调模式比事件模型灵活得多，但当存在多个嵌套的情况时，会出现回调地狱（ callback hell ）的情况

- 使代码难以理解
- 并行操作难以进行

## Promise

## 实例方法

- `Promise.prototype.then()`
- `Promise.prototype.catch()`
- `Promise.prototype.finally()`
- `Promise.all()`
- `Promise.race()`
- `Promise.resolve()`
- `Promise.reject()`
- `Promise.allSettled()`
- `Promise.any()`

### Promise 的生命周期

1. `pending` ：挂起，表示未结束的 Promise 状态。相关词汇“挂起态”。
2. `fulfilled` ：已完成，表示已成功结束的 Promise 状态，可以理解为“成功完成”。相关词汇“完成”、“被完成”、“完成态”。
3. `rejected` ：已拒绝，表示已结束但失败的 Promise 状态。相关词汇“拒绝”、“被拒绝”、“拒绝态”。
4. `resolve` ：决议，表示将 Promise 推向成功态，可以理解为“决议通过”，在 Promise概念中与“完成”是近义词。相关词汇“决议态”、“已决议”、“被决议”。
5. `unsettled` ：未决，或者称为“未解决”，表示 Promise 尚未被完成或拒绝，与“挂起”是近义词。
6. `settled` ：已决，或者称为“已解决”，表示 Promise 已被完成或拒绝。注意这与“已完成”或“已决议”不同，“已决”的状态也可能是“拒绝态”（已失败）。
7. `fulfillment handler` ：完成处理函数，表示 Promise 为完成态时会被调用的函数。
8. `rejection handler` ：拒绝处理函数，表示 Promise 为拒绝态时会被调用的函数。

每个 Promise 都会经历一个短暂的生命周期，初始为挂起态（ `pending state`），这表示异步操作尚未结束。一个挂起的 Promise 也被认为是未决的（ `unsettled` ）。

一旦异步操作结束， Promise就会被认为是已决的（ `settled` ），并进入两种可能状态之一：

- 已完成（ `fulfilled` ）： Promise 的异步操作已成功结束；
- 已拒绝（ `rejected` ）： Promise 的异步操作未成功结束，可能是一个错误，或由其他原因导致。

> 内部的 [[PromiseState]] 属性会被设置为 "pending" 、 "fulfilled" 或 "rejected" ，以反映 Promise 的状态
>
> 不过，该属性并未在 Promise 对象上被暴露出来，因此你无法以编程方式判断 Promise 到底处于哪种状态。不过你可以使用 `then()` 方法在 Promise 的状态改变时执行一些特定操作。

### 创建未决的 Promise

新的 Promise 使用 `Promise` 构造器来创建。

此构造器接受单个参数：一个被称为执行器（`executor` ）的函数，包含初始化 Promise 的代码，该执行器会被传递两个名为 `resolve()`与 `reject()` 的函数作为参数

- `resolve()` 函数在执行器成功结束时被调用，用于示意该Promise 已经准备好被决议（ `resolved` ）
- `reject()` 函数则表明执行器的操作已失败

先看个列子：

```js
function readFile(filename) {
  return new Promise(function (resolve, reject) {
    // 触发异步操作
    fs.readFile(filename, function (err, data) {
      if (err) {
        // 检查错误
        reject(err)
      } else {
        // 读取成功
        resolve(data)
      }
    })
  })
}

let promise = readFile('example.txt')
// 同时监听完成与拒绝
promise.then(
  function (contents) {
    // 完成
    console.log(contents)
  },
  function (err) {
    // 拒绝
    console.error(err.message)
  }
)
```

执行器会被立即调用，即 内部的`fs.readFile`函数开始工作，当其操作结束后通过回调触发 `resolve()` 或 `reject()` 函数。

调用 `resolve()` 触发了一个异步操作。传递给 `then()` 与 `catch()` 的函数会异步地被执行，并且它们也被添加到了作业队列（先进队列再执行）

再对比看两个列子：

```js
let promise = new Promise(function (resolve, reject) {
  console.log('Promise')
  resolve()
})
console.log('Hi!')
// 输出结果：
// Promise
// Hi!
```

```js
let promise = new Promise(function (resolve, reject) {
  console.log('Promise')
  resolve()
})

promise.then(function () {
  console.log('Resolved.')
})

console.log('Hi!')
// 输出结果：
// Promise
// Hi!
// Resolved
```

分析：

- Promise 的执行器会立即执行，早于源代码中在其之后的任何代码
- 完成处理函数与拒绝处理函数总是会在执行器的操作结束后，被添加到作业队列的尾部

### Promise的错误捕获

对于Promise的内部错误来说，可以通过并且仅可通过 `catch()` 方法来捕获，在Promise外部是捕获不到的

```js
try {
  console.log('Hi')
  Promise.reject('error').catch((err) => console.log(err))
} catch (error) {
  console.log('err', error)
}
// Hi
// error
```

```js
new Promise((resolve, reject) => {
  throw new Error('error123')
})
  .then((val) => console.log('val', val))
  .catch((err) => console.log('err', err))
// err Error: error123

// 相当于 ↓ ↓ ↓

new Promise((resolve, reject) => {
  try {
    throw new Error('error123')
  } catch (error) {
    reject(error)
  }
})
  .then((val) => console.log('val', val))
  .catch((err) => console.log('err', err))
// err Error: error123
```

### 继承Promise

正像其他内置类型，你可将一个 Promise 用作派生类的基类。这允许你自定义变异的Promise ，在内置 Promise 的基础上扩展功能。

```js
class MyPromise extends Promise {
  // 使用默认构造器
  success(resolve, reject) {
    return this.then(resolve, reject)
  }
  failure(reject) {
    return this.catch(reject)
  }
}

let promise = new MyPromise(function (resolve, reject) {
  resolve(42)
})

promise
  .success(function (value) {
    console.log(value) // 42
  })
  .failure(function (value) {
    console.log(value)
  })
```

## 总结

- Promise 具有三种状态：挂起、已完成、已拒绝。
  - 一个 Promise 起始于挂起态，并在成功时转为完成态，或在失败时转为拒绝态
  - `then()`方法允许你绑定完成处理函数与拒绝处理函数
  - `catch()`方法则只允许你绑定拒绝处理函数
- 可以链式调用
