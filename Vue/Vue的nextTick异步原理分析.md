# Vue的nextTick异步原理分析

Vue 在更新 DOM 时是异步执行的。（需要指出的是Vue支持同步和异步更新）

只要侦听到数据变化，Vue 将开启一个**队列**，并缓冲在同一事件循环中发生的所有数据变更。

然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (**已去重的**) 工作。

## 一般场景

```js
methods: {
    tap() {
        for (let i = 0; i < 10; i++) {
            this.a = i;
        }
        this.b = 666;
    },
}
```

这里虽然 a被循环了10次，但并不会更新10次，最终执行时一次性完成更新，只保留最后一次的赋值

## 基本流程

当属性被修改后，触发更新通知

`dep.notify` 通知更新 => `subs[i].update()` 循环通知所有watcher更新 => 执行异步队列方法 `queueWatcher`

这里的 update方法中是有多种情况区分的，如：计算属性、同步更新、更新队列

## 实现原理

Vue内部的异步队列实现，其实就是调用了 `nextTick` 函数

异步队列方法queueWatcher：

```js
export function queueWatcher (watcher: Watcher) {
    // 获取watcherid
    const id = watcher.id
    if (has[id] == null) {
        // 保证只有一个watcher，避免重复
        has[id] = true
        
        // 推入等待执行的队列
        queue.push(watcher)
      
        // ...省略细节代码
    }
    // 将所有更新动作放入nextTick中，推入到异步队列
    nextTick(flushSchedulerQueue)
}

function flushSchedulerQueue () {
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]
        watcher.run()
        // ...省略细节代码
    }
}
```

nextTick源码：

```js
// timerFunc就是nextTick传进来的回调等... 细节不展开
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    timerFunc = () => {
        p.then(flushCallbacks)
    }
    isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
    // 当原生 Promise 不可用时，timerFunc 使用原生 MutationObserver
    // MutationObserver不要在意它的功能，其实就是个可以达到微任务效果的备胎
)) {
    timerFunc = () => {
        // 使用 MutationObserver
    }
    isUsingMicroTask = true

} else if (typeof setImmediate !== 'undefined' &&  isNative(setImmediate)) {
    // 如果原生 setImmediate 可用，timerFunc 使用原生 setImmediate
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    // 最后的倔强，timerFunc 使用 setTimeout
    timerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}
```

`nextTick()`的实现原理：

首先会尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替

总结就是 `Promise` > `MutationObserver` > `setImmediate` > `setTimeout`

`vm.$nextTick` 实例方法的运用：

例如，当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环“tick”中更新。

为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`，这样回调函数将在 DOM 更新完成后被调用。

## 资料

- [Vue异步更新 && nextTick源码解析](https://juejin.cn/post/6844903918472790023)
