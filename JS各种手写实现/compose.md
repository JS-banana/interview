# compose

curry 主要有 3 个作用：缓存函数、暂缓函数执行、分解执行任务。

## 类型一

> fn1(fn2(fn3(x))) => compose(fn3, fn2, fn1)(x)

```js
function compose(...fn) {
  return fn.reduce(
    (prev, cur) => {
      return (...args) => prev(cur(...args))
    },
    (ctx) => ctx
  )
}

function fn1(x) {
  return x + 1
}
function fn2(x) {
  return x + 2
}
function fn3(x) {
  return x + 3
}

const a = compose(fn1, fn2, fn3)
console.log(a(1)) // 7
```

## 类型二

```js
function currying(fn) {
  //   let args = [].slice.call(arguments, 1)
  let args = []

  // 
  return function temp(...newargs) {
    if (newargs.length) {
      // 如果有新参数，则将新参数放入 args 中
      args = [...args, ...newargs]
      // 返回temp函数继续合并参数
      return temp
    } else {
      // fn函数执行
      let val = fn.apply(this, args)
      // 清空参数，避免影响下一次调用
      args = []
      return val
    }
  }
}

// 验证

function add(...args) {
  //求和
  return args.reduce((a, b) => a + b)
}
let addCurry = currying(add)
console.log(addCurry(1)(2)(3)(4, 5)()) //15
console.log(addCurry(1)(2)(3, 4, 5)()) //15
console.log(addCurry(1)(2, 3, 4, 5)()) //15
```

## 类型三

```js
function currying(fn) {
  // 默认形参处理
  const initArgs = [].slice.call(arguments, 1)
  let args = initArgs

  // 
  return function temp(...newargs) {
    if (newargs.length) {
      args = [...args, ...newargs]
      return temp
    } else {
      let val = fn.apply(this, args)
      // 参数clear处理
      args = initArgs
      return val
    }
  }
}

// 验证

function add(...args) {
  //求和
  return args.reduce((a, b) => a + b)
}
let addCurry = currying(add, 2)
console.log(addCurry(1)(2)(3)(4, 5)()) //17
console.log(addCurry(1)(2)(3, 4, 5)()) //17
console.log(addCurry(1)(2, 3, 4, 5)()) //17
```

## 资料

- [JS函数柯里化（curry）和函数合成（compose）](https://www.xinbaoku.com/archive/EMHyuytE.html)
- [手写JS](https://juejin.cn/post/6946136940164939813#heading-44)
