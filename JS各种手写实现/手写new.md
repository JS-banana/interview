# 面试官：说说 new 的过程

## 介绍

引用MDN的官方介绍，是这样定义 `new` 的：

`new` 运算符允许开发人员创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例

> 注：`new` 在JavaScript中是一个关键字。

### 语法

```js
new constructor
new constructor()
new constructor(arg1)
new constructor(arg1, arg2)
new constructor(arg1, arg2, /* …, */ argN)
```

- `constructor`：一个指定对象实例的类型的类或函数。
- `arg`：一个用于被 constructor 调用的值列表。`new Foo` 与 `new Foo()` 等价，换句话说：如果没有指定参数列表，则在不带参数的情况下调用 Foo。

### 用法与特点

举个栗子：

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayName = function () {
  return `我的名字是：${this.name}`
}

const son = new Parent("小帅");
console.log(son.name); // 访问构造函数里的属性
// 小帅

console.log(son.sayName()); // 访问原型里的属性
// 我的名字是：小帅
```

1. 可以访问构造函数里的属性
2. 可以访问原型上的属性

### 描述

当使用 `new` 关键字调用函数时，该函数将被用作构造函数。`new` 将执行以下操作：

1. 创建一个空的 JavaScript 对象 `obj`。
2. 将 `obj` 的 `prototype` 指向构造函数的 `prototype` 属性
3. 使用给定参数执行构造函数，并将 `obj` 绑定为 `this` 的上下文（换句话说，在构造函数中的所有 `this` 引用都指向 `obj`）
4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象

## 实现

```js
function myNew() {
  // 1. 获取构造函数（参数对象里的第一个）
  const constructor = [...arguments][0]
  console.dir(constructor)
  // 2. 创建对象
  const obj = Object.create(constructor.prototype)
  // 3. 执行传入构造函数，并修改 this
  const result = constructor.apply(obj, [...arguments].slice(1))
  // 4. 根据执行函数的返回值，判断是返回结果还是返回 obj 对象
  const isResult = (typeof result === 'object' && result !== null) || typeof result === "function"
  return isResult ? result : obj
}
```

或者你也可以这样写：

```js
function myNew(fn, ...args) {
  // 1. 获取构造函数
  const constructor = fn
  // 2. 创建对象 ，并指定原型
  const obj = Object.create(constructor.prototype)
  // 3. 执行传入构造函数，并修改 this
  const result = constructor.apply(obj, args)
  // 4. 根据执行函数的返回值，判断是返回结果还是返回 obj 对象
  const isResult = (typeof result === 'object' && result !== null) || typeof result === "function"
  return isResult ? result : obj
}

// 测试下，结果也是一致的
const son = myNew(Parent, "小帅");
console.log(son.name); // 访问构造函数里的属性
// 小帅

console.log(son.sayName()); // 访问原型里的属性
// 我的名字是：小帅
```

其中 1 也可以这样写：

```js
// 1. __proto__
const obj = new Object()
obj.__proto__ = constructor.prototype

// 2. setPrototypeOf
const obj = Object.create(null) // 指定原型链的终点null为其原型
const propto = constructor.prototype
Object.setPrototypeOf(obj, propto) 
// setPrototypeOf方法可以把Object.create(null)强制修改原型
```
