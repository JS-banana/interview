# Map与Set和WeakMap与WeakSet

## 描述

- Set：这是一种无重复值的有序列表，使用场景一般是只在 Set 中检查某个值是否存在
- Map：则是键与相对应的值的集合，Map 常被用作缓存，存储数据以便此后快速检索（通过指定所需读取的键即可检索对应的值）

这里所描述的方法都是ES6新增的，ES5中并不存在，不过，也有一些手段可以模拟出类似的效果，但其或多或少都存在着问题。

## Set

- Set 构造器实际上可以接收任意可迭代对象作为参数。（Set 构造器会使用迭代器来提取参数中的值）

> Set 是根据 Object.is() 方法来判断其中的值是否相等

### Set 上的 forEach() 方法

1. Set 中下个位置的值；
2. 与第一个参数相同的值；
3. 目标 Set 自身

用法保持一致，与数组和Map不同的是，其第一个与第二个参数是相同的

这是因为Set 是没有键的，为了保持用法一致，ES6 标准的制定者将 Set 中的每一项同时认定为键与值，所以该回调函数的前两个参数就始终相同了

### WeakSet

先来看Set存在的问题：

对象存储在 Set 的一个实例中时，实际上相当于把对象存储在变量中。只要对于 Set 实例的引用仍然存在，所存储的对象就无法被垃圾回收机制回收，从而无法释放内存。

Set测试代码如下：

```js
let set = new Set(),
    key = {}
set.add(key)
console.log(set.size) // 1
// 取消原始引用
key = null
console.log(set.size) // 1
// 重新获得原始引用
key = [...set][0] // {}
```

在本例中，将 key 设置为 null 清除了对 key 对象的一个引用，但是另一个引用还存于set 内部。你仍然可以使用扩展运算符将 Set 转换为数组，然后访问数组的第一项， key变量就取回了原先的对象。（内存泄漏的风险）

WeakSet测试代码如下：

```js
let set = new WeakSet(),
    key = {}
// 将对象加入 set
set.add(key)
console.log(set.has(key)) // true
// 移除对于键的最后一个强引用，同时从 Weak Set 中移除
key = null
```

**WeakSet**：该类型只允许存储对象弱引用，而不能存储基本类型的值。对象的弱引用在它自己成为该对象的唯一引用时，不会阻止垃圾回收。

### Set与WeakSet的差异

Weak Set 与正规 Set 之间最大的区别是对象的弱引用。

1. 对于 WeakSet 的实例，若调用 add() 方法时传入了非对象的参数，就会抛出错误（has() 或 delete() 则会在传入了非对象的参数时返回 false ）；
2. Weak Set 不可迭代，因此不能被用在 for-of 循环中；
3. Weak Set 无法暴露出任何迭代器（例如 keys() 与 values() 方法），因此没有任何编
程手段可用于判断 Weak Set 的内容；
4. Weak Set 没有 forEach() 方法；
5. Weak Set 没有 size 属性。

## Map

ES6 的 Map 类型是键值对的有序列表，而键和值都可以是任意类型。

> 键的比较使用的是Object.is()，因此你能将 5 与 "5" 同时作为键，因为它们类型不同

forEach() 方法：

其接受的每个键值对是按照键值对被添加到 Map 中的顺序进行的（这是与普通数组不同的地方，后者的回调函数会按数值索引的顺序接收到每一个项）

### WeakMap

Weak Map 对 Map 而言，就像 Weak Set 对 Set 一样。

ES6 的 WeakMap 类型是键值对的无序列表，其中键必须是非空的对象，值则允许是任意类型。

> 注：Weak Map 的键才是弱引用，而值不是,。在 Weak Map 的值中存储对象会阻止垃圾回收，即使该对象的其他引用已全都被移除。

Weak Map 的最佳用武之地，就是在浏览器中创建一个关联到特定 DOM 元素的对象。如下：

```js
let map = new WeakMap(),
  element = document.querySelector('.element')
map.set(element, 'Original')
let value = map.get(element)
console.log(value) // "Original"
// 移除元素
element.parentNode.removeChild(element)
element = null
// 该 Weak Map 在此处为空
```

需要注意：这里是把 DOM 元素作为键来使用，而不是作为值。

一个构建私有数据方法的骚操作：

- 实例销毁时，私有信息也会被同时销毁。
- getName() 方法获取的结果保持一致

```js
let Person = (function () {
  let privateData = new WeakMap()
  function Person(name) {
    privateData.set(this, { name: name })
  }
  Person.prototype.getName = function () {
    return privateData.get(this).name
  }
  return Person
})()
```

当 Person 构造器被调用时，将 this 作为键在 Weak Map 上建立了一个入口，而包含私有信息的对象成为了对应的值，其中只存放了 name 属性

## WeakMap、WeakSet

- 键是弱引用的。其键必须是对象，而值可以是任意的。
- key 是不可枚举的，即不存在迭代器属性，所以没有entries、keys和values等方法
- “弱引用”意味着在没有其他引用存在时垃圾回收能正确进行。

> 结合浏览器的**引用计数**垃圾回收机制算法思考。
