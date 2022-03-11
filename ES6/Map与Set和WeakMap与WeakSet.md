# Map与Set和WeakMap与WeakSet

## 概念描述

## Map、Set、WeakMap、WeakSet

## WeakMap、WeakSet

- 键是弱引用的。其键必须是对象，而值可以是任意的。
- key 是不可枚举的，即不存在迭代器属性，所以没有entries、keys和values等方法
- “弱引用”意味着在没有其他引用存在时垃圾回收能正确进行。

> 结合浏览器的**引用计数**垃圾回收机制算法思考。
