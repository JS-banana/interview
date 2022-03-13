# React技术揭秘读书笔记

## 理念篇

GUI渲染线程与JS线程是互斥的，16.6ms浏览器刷新一次。React把长任务拆到每一帧中运行（时间切片），每一帧预留5ms左右，剩余时间交由渲染UI。

时间切片：将同步的更新变为可中断的异步更新。

React16.8采用了Fiber架构，做到了可中断的执行对变化组件做update标记，该行为在内存中进行，等到完成后通知更新渲染

## hook

### useEffect/useLayoutEffect

- useEffect
  - 异步非阻塞执行
  - 执行阶段是在react在js内存中执行完DOM更新diff对比之后，浏览器绘制后

- useLayoutEffect
  - 同步阻塞执行
  - 在 DOM 变更（React 的更新）后，浏览器绘制前完成所有操作

区别是：useEffect不会阻塞渲染，只有在涉及到修改 DOM、动画等场景下考虑使用 useLayoutEffect，所有的修改会一次性更新到浏览器中，减少用户体验上的不适。

### useMemo/useCallback

在源码中的直接体现就是：

- useMemo：会执行传入的回调函数，保存执行结果的值
- useCallback：不执行函数，保存函数

mount 阶段

```js
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  // 创建并返回当前hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 计算value
  const nextValue = nextCreate();
  // 将value与deps保存在hook.memoizedState
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 创建并返回当前hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 将value与deps保存在hook.memoizedState
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

update 阶段

```js
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  // 返回当前hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断update前后value是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }
  // 变化，重新计算value
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 返回当前hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断update前后value是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }

  // 变化，将新的callback作为value
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

这两个hook的唯一区别：是**回调函数本身**还是**回调函数的执行结果**作为value。

## 资料

- [React技术揭秘](https://react.iamkasong.com/)
- [React Fiber 架构介绍](https://github.com/luxp/react-fiber-architecture-cn)
