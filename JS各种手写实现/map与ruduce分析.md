# JavaScript中的数组方法map与reduce分析

想必各位都使用过 `map` 与 `reduce`，已知它们都是数组的实例方法。

当面试官问及，他们的区别是什么时？你会如何作答？

## 前言

首先，我们还是按照最基本的求知思路进行研究分析。

1. 它是什么？它可以做什么？
2. 如何使用？使用方式？
3. 它的运行逻辑是怎样的？
4. 特别的地方？
5. 我如何自己实现该方法？

![emoji](https://cdn.jsdelivr.net/gh/JS-banana/images/emoji/3.jpg)

## JavaScript中的函数🤓

在正式开始之前，有必要先说下JavaScript中的函数，简单了解下。

### 1. 一等公民

先说结论，在JavaScript语言中，函数是一等公民。

请问，什么是一等公民？

答：在编程语言中，一等公民可以作为**函数参数**，可以作为**函数返回值**，也可以**赋值给变量**。

对于 JavaScript 来说，函数可以赋值给变量，也可以作为函数参数，还可以作为函数返回值，因此 JavaScript 中函数是一等公民。

### 2. 高阶函数

不知道大家是否了解过高阶函数，想必之前写过react的同学应该会比较熟悉，思考下，你会发现，其实此处的map与reduce也是高阶函数。

请问，什么是高阶函数？

答：简单来说，高阶函数（Higher Order Function）就是**一种以函数为参数的函数**。

![emoji](https://cdn.jsdelivr.net/gh/JS-banana/images/emoji/2.jpg)

## Array.prototype.map()

### 1. 它是什么？

map的语法：`map(callbackFn [, thisArg])`

1. 第一个参数：必填，map 接收一个函数 `callbackFn`作为参数
2. 第二个参数：非必填，执行 `callbackFn` 时用作 `this` 的值

回调函数callbackFn的语法：`callbackFn(element [, index, arrary])`

1. 第一个参数：`数组中当前正在处理的元素`
2. 第二个参数：`正在处理的元素在数组中的索引`
3. 第三个参数：`调用了 map() 的数组本身`

引用MDN的描述，`map()` 方法是一个**迭代方法**。它为数组中的每个元素调用一次提供的 `callbackFn` 函数，并用结果构建一个新数组。

关键词提取：

1. 原数组中的每个元素都调用一次提供的函数
2. 返回一个新数组，每个元素都是回调函数的返回值

### 2. 如何使用？

因为 map 是数组的实例方法，所以，一切数组都可以通过`.map`的方式直接使用。

- `arr.map(callback)`
- `[].call(arr,callback)`
- `Arrary.prototype.map.call(arr,callback)`

不过，在ES6之后，对于集合类、类数组等也可以使用map遍历。其实，只要是内部实现了 `Symbol.iterator` 方法的可迭代对象，都可以被迭代遍历，它们同样可以被 `for...of循环`、`...展开语法`迭代。

以往我们写迭代基本都是通过 `for` 循环来实现，而 `map` 的函数式写法可以极大的简化和方便我们的代码编写。

简单对比下，有这么一个需求，把数组中的数据全部以乘2的结果返回一个新的数据：

```js
const arr = [1, 2, 3, 4, 5]

// 1. for
function multiplyTwice(data) {
  const result = []
  for (let i = 0; i < data.length; i++) {
    result.push(data[i] * 2)
  }
  return result
}

// 2. map
function multiplyTwiceByMap(data) {
  return data.map(item => item * 2)
}
```

可以发现，map方法使用起来是非常的简单、易读~

### 3. 运行逻辑？

map方法在执行时，它首先会基于原始数组复制一份数据，然后基于这份新的数据进行遍历。

复制的逻辑是这样的：

1. 构造一个新数组
2. 填充元素（复制原始数组中的元素进行填充）

元素的复制逻辑是这样的：

- 对象：如果该元素是对象，那么**复制引用地址**
- 基本类型：如果该元素是基本类型，那么**复制值**

写个例子简单测试一下：

```js
const arr = [1, '2', true, { a: 1 }, ['小帅', '真帅']]

const result = arr.map(item => {
  // 对引用类型的属性进行修改操作
  if (typeof item === "object") {
    if (Array.isArray(item)) {
      item[0] = '大帅'
    } else {
      item.a = 2
    }
  } else  {
  // 对基本类型的值进行修改
    item = 0
  }
  return item
})

console.log('原始数组：', arr) // [1, '2', true, {a: 2}, ['大帅', '真帅']]
console.log('新数组：', result) // [0, 0, 0, {a: 2}, ['大帅', '真帅']]
console.log(arr === result) // false
```

根据代码，我们可以得出这么一个结论：

如果数组中的元素是引用类型，那么对于该元素的直接修改会影响到原始元素（其实就是浅拷贝的概念）。

因此在实际开发中非常不建议这么写，如果一定要修改属性或数据，你可以使用展开运算符或新建一个引用对象，再对其进行修改。比如这样：

```js
if (Array.isArray(item)) {
  item = [...item][0] = '大帅'
} else {
  item = { ...item, a: 2 }
}
```

> 👀注：需要指出的是，`...展开运算符`和`Object.assign`，只对对象的第一层是深拷贝。

### 4. 特别的地方？

在上面的内容中，我们提到了`map()` 方法会创建一个新数组，而这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

让我们继续研究它有哪些特别的地方？

1. `callbackFn` 仅在已分配值的数组索引处被调用。它不会在数组中的空槽处被调用。

    - 数组可以包含“空槽”，这与用值 `undefined` 填充的槽不一样
    - `map` 方法在访问索引之前执行 `in` 检查，并且不将空槽与 `undefined` 合并

    来看下什么是“空槽”，以及如何创建：

    ```js
    // 1. 数组字面量中的连续逗号
    const b = [1, 2, , , 5]; // [ 1, 2, <2 empty items>, 5 ]

    // 2. Array 构造函数：
    const a = Array(5); // [ <5 empty items> ]

    // 3. 直接给大于 array.length 的索引设置值以形成空槽：
    const c = [1, 2];
    c[4] = 5; // [ 1, 2, <2 empty items>, 5 ]

    // 4. 通过直接设置 .length 拉长一个数组：
    const d = [1, 2];
    d.length = 5; // [ 1, 2, <3 empty items> ]

    // 5. 删除一个元素：
    const e = [1, 2, 3, 4, 5];
    delete e[2]; // [ 1, 2, <1 empty item>, 4, 5 ]
    ```

    测试代码如下：

    ```js
    let arr = [1, , 3, , 5]
    console.log(0 in arr) // true
    delete arr[0]
    console.log(0 in arr) // false
    console.log(arr) // [empty × 2, 3, empty, 5]
    arr.map(ele => {
      console.log(ele) // 3, 5
    })
    ```

2. 当开始调用 `map()` 时，`callbackFn` 将不会访问超出数组初始长度的任何元素
3. 对已访问索引的更改不会导致再次在这些元素上调用 `callbackFn`
4. 如果数组中一个现有的、尚未访问的元素被 `callbackFn` 更改，则它传递给 `callbackFn` 的值将是该元素被修改后的值。被删除的元素则不会被访问。

    ```js
    // 原数组修改当前索引之后的元素，受影响
    let arr = [1, 2, 3]
    let result = arr.map((ele, index, array) => {
      if (index === 1) {
        array[2] = 4
      }
      return ele * 2
    })
    console.log(result) // [2, 4, 8]
    ```

> 注：对于第4条，在map执行的时候修改了尚未访问的元素，这种操作是非常容易混淆代码逻辑的，比较危险，应尽量避免。

### 5. 自己实现

根据map函数的定义，以及传参分析，我们可以很快速的实现一个自己的 map 函数。

```js
Array.prototype.myMap = function (callback, thisArg) {
  const result = [] // 定义一个新数组
  const data = this // 这里的 this 为原始数组对象
  let len = data.length

  for (let i = 0; i < len; i++) {
    const current = callback.call(thisArg, data[i], i, data)
    result.push(current)
  }

  return result
}
```

基本功能似乎没啥问题，但是看起来还是比较简陋的，查看官方文档 [ecma262](https://tc39.es/ecma262/#sec-array.prototype.map)，里面有对 map 的实现描述，发现细节还是蛮多的。

![ecma262-arrary-map](../static/images/ecma262-arrary-map.png)

优化后的完整代码如下：

```js
Array.prototype.myMap = function(callbackfn, thisArg) {
  // Step 1. 转成数组对象，有 length 属性和 K-V 键值对
  let O = Object(this)
  // Step 2. 数据length
  let len = O.length
  // Step 3. callbackfn 不是函数时抛出异常
  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  // Step 4.
  let A = new Array(len)
  // Step 5.
  let k = 0
  // Step 6.
  while(k < len) {
    // 过滤“空槽”：检查 O 及其原型链是否包含属性 k
    if (k in O) {
      // kValue => O[k]
      let kValue = O[k]
      // mappedValue => 执行 callbackfn 函数
      // 传入 this, 当前元素 element, 索引 index, 原数组对象 O
      let mappedValue = callbackfn.call(thisArg, kValue, k, O)
     // 返回结果赋值给新生成的数组
      A[k] = mappedValue
    }
    // k + 1
    k++
  }
  // Step 7. 返回新数组
  return A
}
```

补充下上面涉及到的 `this`，源码中的这一段`callbackfn.call(thisArg, kValue, k, O)`，`thisArg` 值如果没有设置，那就是 `undefined`。传入 `undefined` 时，非严格模式下指向 `Window`，严格模式下为 `undefined`。

下面有2道用例，分析下：

```js
// 传入 thisArg，使用普通函数
let name = '小帅'
let obj = {
    name: '大帅',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]

let result = arr.map(obj.callback, obj);
console.log(result) 
// ["大帅1", "大帅2", "大帅3"]
```

```js
// 严格模式
'use strict'
var name = '小帅'
let obj = {
    name: '大帅',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]

let result = arr.map(obj.callback);
console.log(result)
// TypeError: Cannot read property 'name' of undefined
// 因为严格模式下 this 指向 undefined
```

### 6. 小试牛刀

来看一道经典面试题，将 `parseInt()` 与 `map()` 一起使用。思考下，这段代码会如何输出？

`["1", "2", "3"].map(parseInt);`

<details><summary>点击查看结果</summary>

  我们期望输出 `[1, 2, 3]`, 而实际结果是 `[1, NaN, NaN]`。

</details>

其实，这道题我们可以这样看：

```js
const callbackfn = (arg1, arg2, arg3) => console.log(arg1, arg2, arg3)

arr.map(callbackfn)
```

代入`parseInt`函数就是这样：

```js
const callbackfn = (arg1, arg2, arg3) => parseInt(arg1, arg2, arg3)

["1", "2", "3"].map(callbackfn)
```

引用MDN的描述，看看`parseInt`函数是怎么定义的：

`parseInt(string, radix)` 解析一个字符串并返回指定基数的十进制整数，`radix` 是 `2-36` 之间的整数，表示被解析字符串的基数。

`parseInt` 函数通常只使用一个参数，但其实可以传入两个参数。第一个参数是表达式，第二个参数是解析该表达式的基数。当在 `Array.prototype.map` 的回调函数中使用 `parseInt` 函数时，`map` 方法会传递 3 个参数。

`parseInt` 函数会忽略第三个参数，但是不会忽略第二个参数！这就是这道题的问题所在。

以下是迭代步骤的简明示例：

```js
// parseInt(string, radix) -> map(parseInt(value, index))
/* 第一次迭代 (index 是 0): */ parseInt("1", 0); // 1
/* 第二次迭代 (index 是 1): */ parseInt("2", 1); // NaN
/* 第三次迭代 (index 是 2): */ parseInt("3", 2); // NaN
```

知道原因了，再回头看这个问题就简单了

```js
// 指定十进制
["1", "2", "3"].map((element) => parseInt(element, 10))

// 使用简洁的箭头函数语法
["1", "2", "3"].map((str) => parseInt(str)); // [1, 2, 3]

// 实现上述目标更简单的方法，同时避免了“骗招”：
["1", "2", "3"].map(Number); // [1, 2, 3]
```

![emoji](https://cdn.jsdelivr.net/gh/JS-banana/images/emoji/5.jpg)

## Array.prototype.reduce()

### 1. 它是什么？

reduce语法：`reduce(callbackFn [, initialValue])`

1. 第一个参数：必填，reduce 接收一个函数 `callbackFn`作为参数
2. 第二个参数：非必填，第一次调用回调时初始化 accumulator 的值

回调函数callbackFn的语法：`callbackFn(accumulator [, currentValue, currentIndex, array])`

1. 第一个参数：`上一次调用 callbackFn 的结果`
    - 在第一次调用时，如果指定了 `initialValue`，则为指定的值，否则为 `array[0]` 的值。
2. 第二个参数：`当前元素的值`
    - 在第一次调用时，如果指定了 `initialValue`，则为 `array[0]` 的值，否则为 `array[1]`。
3. 第三个参数：`currentValue 在数组中的索引位置`
    - 在第一次调用时，如果指定了 initialValue 则为 0，否则为 1。
4. 第四个参数：`调用了 reduce() 的数组本身`

引用MDN的描述,`reduce()` 方法是一个**迭代方法**。它按升序对数组中的所有元素运行一个“reducer”回调函数，并将它们累积到一个单一的值中。每次调用时，`callbackFn` 的返回值都作为 `accumulator` 参数传递到下一次调用中。`accumulator` 的最终值（也就是在数组的最后一次迭代中从 `callbackFn` 返回的值）将作为 `reduce()` 的返回值。

关键词提取：

1. 每个元素按序执行一个提供的 reducer 函数
2. 每一次运行 `callbackFn` 会将先前元素的**计算结果作为参数传入**，最后将其结果汇总为单个返回值
3. 初始值 `initialValue` 是否存在，会影响运行逻辑，这很关键，很多高级操作都是配合该参数食用的😋

### 2. 如何使用？

作为数组原型实例方法之一，和 `map` 方法类似，对于集合类、类数组等也都可以使用`reduce()` 方法，这里不再赘述。

简单看下用法示例，例如现在有个数组，我们要计算数组所有元素的总和：

```js
const arr = [1, 2, 3, 4, 5]

// 1. for
function sum(data) {
  let total = 0
  for (let i = 0; i < data.length; i++) {
    total += data[i]
  }
  return total
}

// 2. map
function sum(data) {
  return data.reduce((acc, cur) => acc + cur, 0)
}

console.log(sum(arr)) // 15
```

不得不说，这种函数式写法，用起来真的很舒服，当然，这里只是最基础的用法，更高阶的用法等着开发者们去探索。reduce函数可玩性非常高，要是使用得当，它将带给你意想不到的效果。

### 3. 运行逻辑和特点？

`reduce()` 这样的函数，其实是一种的递归函数。

它对数组的所有元素依次执行提供的 `reducer` 函数，而每一次运行 `reducer` 会将先前元素的计算结果作为参数传入，然后，在下一个 `reducer` 函数中进行调用执行，直到最后将其结果汇总为单个返回值。

1. 与其他迭代方法不同，`reduce()` 不接受 `thisArg` 参数。
    - `callbackFn` 调用时始终以 `undefined` 作为 `this` 的值，如果 `callbackFn` 未处于严格模式，则该值将被替换为 `globalThis`（浏览器环境为 window）。
2. reduce 返回值的结构和原数组结构并无必然关联。
    - 根据初始值与`callbackFn` 函数运行逻辑的不同，可以返回不同的数据结构
3. 如果没有提供 `initialValue`，那么第一次调用 `callback` 函数时，`accumulator` 使用原数组中的第一个元素，`currentValue` 即是数组中的第二个元素
4. 如果提供了 `initialValue`，`accumulator` 将使用这个初始值，`currentValue` 使用原数组中的第一个元素。
5. 在没有初始值的空数组上调用 `reduce` 将报错。
6. 和 `map` 的特点一样，`callbackFn` 仅对已分配值的数组索引进行调用。不会对稀疏数组中的空槽进行调用。

简单看几个用例，体会下上面的描述：

a. 将数组转换为对象

```js
const arr = [
  {
    label: "name",
    value: "AJ",
  },
  {
    label: "age",
    value: 18,
  },
  {
    label: "address",
    value: "上海",
  },
]

const obj = arr.reduce(
  (acc, cur) => ({ ...acc, [cur.label]: cur.value }),
  {}
)
console.log(obj)
// { name: 'AJ', age: 18, address: '上海' }
```

b. 是否有初始值

```js
const arr = [1, 2]

const callbackFn = (acc, cur) => {
  console.log('cur', cur)
  return acc += cur
}

// 1. 无初始值：acc取数组第一项，参数取数组第二项，然后执行一次
const result = arr.reduce(callbackFn)
console.log('result', result)
// cur 2
// result 3

// 2. 有初始值：acc取初始值，参数取数组第一项，然后执行2次
const result = arr.reduce(callbackFn, 0)
console.log('result', result)
// cur 1
// cur 2
// result 3
```

c. 在空数组上调用 `reduce()`

```js
const arr = []

// 1. 无初始值
const result = arr.reduce(callbackFn)
console.log('result', result)
// Uncaught TypeError: Reduce of empty array with no initial value

// 2. 有初始值
const result = arr.reduce(callbackFn, 0)
console.log('result', result)
// result 0
```

d. 在稀疏数组（含有“空槽”）中使用 `reduce()`

```js
const callbackFn = (acc, cur) => {
  console.log('cur', cur)
  return acc += cur
}

// 1. 含有 “空槽”
const result = [1, 2, , 4].reduce(callbackFn)
console.log('result', result)
// cur 2
// cur 4
// result 7

// 2. 含有 undefined
const result = [1, 2, undefined, 4].reduce(callbackFn)
console.log('result', result)
// cur 2
// cur undefined
// cur 4
// result NaN
```

`reduce()` 会跳过稀疏数组中缺失的元素，但不会跳过 `undefined` 值（和`map`一样）

> 数组中对“空槽”的处理规则，可以见MDN的官方描述——[数组方法和空槽](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array#%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95%E5%92%8C%E7%A9%BA%E6%A7%BD)

### 4. 自己实现

同样，根据reuce函数的定义，以及传参分析，我们可以很快速的实现一个自己的 reduce 函数。

```js
Array.prototype.myReduce = function (callbackFn, initialValue) {
  let data = this
  let len = data.length
  let acc = data[0]
  let i = 1

  // 根据初始值是否存在，需要调整取值
  // 考虑到初始值为 0 也是符合的，这里判断条件调整为 非undefined
  if (initialValue !== undefined) {
    acc = initialValue
    i = 0
  }

  while (i < len) {
    acc = callbackFn(acc, data[i], i, data)
    i++
  }
  return acc
}

let arr = [1, 2, 3, 4]
const result = arr.myReduce((acc, cur) => {
  console.log('cur', cur)
  return acc += cur
}, 10)
console.log('result', result)
// cur 1
// cur 2
// cur 3
// cur 4
// result 20
```

基本功能似乎没啥问题，但是看起来还是比较简陋的，查看官方文档 [ecma262](https://tc39.es/ecma262/#sec-array.prototype.reduce)，里面有对 reduce 的实现描述，优化一下。

![ecma262-arrary-reduce](../static/images/ecma262-arrary-reduce.png)

优化后的完整代码如下：

```js
Array.prototype.myReduce = function(callbackfn, initialValue) {
  // Step 1. 转成数组对象，有 length 属性和 K-V 键值对
  let O = Object(this)
  // Step 2. 数据length
  let len = O.length
  // Step 3. callbackfn 不是函数时抛出异常
  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  // Step 4.
  if (len === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  // Step 5,6
  let k = 0, accumulator
  // Strp 7. initialValue 存在，赋值给 accumulator
  if (initialValue !== undefined) {
    accumulator = initialValue
  } else {
    // Step 8
    let kPresent = false
    while(!kPresent && (k < len)) {
      kPresent = k in O
      if (kPresent) {
        accumulator = O[k] 
      }
      k++
    }
  }
  // Step 9
  while(k < len) {
    if (k in O) {
      let kValue = O[k]
      accumulator = callbackfn.call(undefined, accumulator, kValue, k, O)
    }
    k++
  }
  // Step 10
  return accumulator
}
```

好了，到这里我们也完成了对 `reduce` 方法的实现。

其实，像 `foreach`、`filter` 等方法的实现，基本都是大同小异，主要在于`callbackfn.call` 这部分的处理有些不同。

### 5. 小试牛刀

a. 数组去重

```js
function unique(arr) {
  return arr.reduce((pre, cur) => {
    return pre.includes(cur) ? pre : [...pre, cur]
  }, []);
}

const arr = [0, 1, 1, 'a', 'b', 'b']
console.log(unique(arr)) // [0, 1, 'a', 'b']
```

b. 将多维数组降为一维数组

```js
function flatDeep(arr) {
  return arr.reduce((res, cur) => {
    return Array.isArray(cur)
      ? [...res, ...flatDeep(cur)]
      : [...res, cur]
  }, [])
}

const arr = [1, 2, [3, 4], [5, [6, 7]]]
console.log(flatDeep(arr)) // [1, 2, 3, 4, 5, 6, 7]
```

c. 异步请求顺序输出

```js
const p1 = v => new Promise(resolve => setTimeout(() => {
  console.log('p1', v)
  resolve(v * 2)
}, 1000))
const p2 = v => new Promise(resolve => setTimeout(() => {
  console.log('p2', v)
  resolve(v * 3)
}, 500))
const p3 = v => new Promise(resolve => setTimeout(() => {
  console.log('p3', v)
  resolve(v * 4)
}, 1500))

function quenceFn(arr, input) {
  return arr.reduce((acc, cur) => acc.then(cur), Promise.resolve(10));
}

const promiseArr = [p1, p2, p3];
quenceFn(promiseArr).then(r => console.log('result', r));
// 输入内容顺序如下：
// p1 10
// p2 20
// p3 60
// result 240
```

内容有限，本文在此浅尝辄止，更多用法等你探究~

## 总结

在本篇文章中，我们从概念定义、使用方式、函数特点、运行逻辑、手写实现等一步步学习，由浅入深，以这种系统性的方式从新认识了 `map` 和 `reduce` 这两位朋友，想必各位同学对其特点共性与区别一定有了全新的了解。当面试官再问及它们的区别时，希望你不要捂着嘴偷笑😄

![emoji](https://cdn.jsdelivr.net/gh/JS-banana/images/emoji/6.jpg)

文末，作为收尾，我们简单概括下这俩方法的区别：

相同点：

1. 都是数组原型的一个方法，也都可以遍历集合类、类数组等
2. 都接收一个 `callbackFn` 函数作为参数，对数组中的所有元素运行 `callbackFn` 回调函数
3. 都不改变原数组，返回一个新结果
4. 对包含“空槽”的数组，处理逻辑是一致的，都会在访问索引之前执行 in 检查
5. 都是纯函数，高阶函数

不同点：

1. `callbackFn` 函数被调用时，传入的参数有所区别，`map` 接收`数组中当前正在处理的元素`、`正在处理的元素在数组中的索引`等3个参数；`reduce` 接收`上一次调用 callbackFn 的结果`、`当前元素的值`等4个参数。
2. 第二个参数不同，`map` 第二个参数可以指定执行 `callbackFn` 时用作 `this` 的值；`reduce` 第二个参数可以指定第一次调用回调时初始化 `accumulator` 的值
3. 返回值不同，`map` 的返回值是一个新数组，它的每个元素都是回调函数的返回值；`reduce` 的返回值是使用“reducer”回调函数遍历整个数组后的结果，一个累加器。

多说一句，其实对于 map、reduce以及ES6的一些方法等，有一种比较有效的学习方式，就是通过查看babel以及polyfill的转译，研究其降级代码的写法，学习其代码实现（比如ES6的class的继承，感兴趣的同学可以研究一下🤓）。

## 资料

- [MDN Arrary](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [es core-js](https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/array-iteration.js)
- [ecma262](https://tc39.es/ecma262/#sec-array.prototype.map)
- [高阶函数 map/reduce](https://www.liaoxuefeng.com/wiki/1022910821149312/1023021271742944)
- [MapReduce: Simplified Data Processing on Large Clusters](https://superlova.github.io/2021/05/04/%E3%80%90%E8%AE%BA%E6%96%87%E9%98%85%E8%AF%BB%E7%AC%94%E8%AE%B0%E3%80%91MapReduce-Simplified-Data-Processing-on-Large-Clusters/)
- [迭代器和生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators)
