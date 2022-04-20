# Promise的相关手写实现

## Promise.all

基本定义了解：队列中的所有 promise全部执行成功则成功，否则失败

要点：

- 按顺序输出（`resolve[index] = val`）
- 队列全部完成执行 `resolve`
- 出现错误时，直接执行 `reject`

```js
// 基础版：未做异常和兼容性处理
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let count = 0

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          resolve[index] = val // 确保按顺序输出
          count++

          if (count === promises.length) { // 确保所有promise全部执行完成
            resolve(result)
          }
        })
        .catch(reject)
    })
  })
}
```
