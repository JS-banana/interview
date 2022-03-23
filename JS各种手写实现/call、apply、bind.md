# 实现call、apply、bind函数

这3个方法是是可以显示调用的改变函数的this指向的。

- **apply**：接收两个参数，一个是 this 绑定的对象，一个是参数数组。
- **call**：call 方法接收的参数，第一个是 this 绑定的对象，后面的其余参数是传入函数执行的参数。
- **bind**：bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。（返回一个绑定了this的新函数，属于未执行状态）

apply和call的实现方式类似，都是通过将调用函数设为对象的方法，然后调用对象的方法，最后再删除该属性，bind因为是返回一个新的为未执行函数，需要特殊处理。

## call 函数的实现步骤

- 判断调用对象是否为函数，即使是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
- 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
- 处理传入的参数，截取第一个参数后的所有参数。
- 将函数作为上下文对象的一个属性。
- 使用上下文对象来调用这个方法，并保存返回结果。
- 删除刚才新增的属性。
- 返回结果。

```js
Function.prototype.myCall = function(context) {
  // 判断调用对象
  if (typeof this !== "function") {
    console.error("type error");
  }
  // 获取参数
  let args = [...arguments].slice(1),
    result = null;
  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;
  // 将调用函数设为对象的方法
  context.fn = this;
  // 调用函数
  result = context.fn(...args);
  // 将属性删除
  delete context.fn;
  return result;
};
```
