# Vue的$set原理分析

## 基本概念

**前置分析**：

要知道的是，vue在`data`中定义的数据是响应式的，但对于新增的属性是检测不到的，不会成为响应式数据，因此Vue提供了一个api(`vm.$set`)来解决这个问题

**主要作用是**：

向响应式对象中添加一个 `property`，并确保这个新 `property` 同样是响应式的，且触发视图更新。

它必须用于向响应式对象上添加新 `property`，因为 Vue 无法探测普通的新增 `property` (比如 `this.myObject.newProperty = 'hi'`)

```js
data(){
    return {
        myObject: {
            name: 'John'
            // newProperty: 'hi'
        }
    }
}

// this.myObject.newProperty = 'hi' // 这里是不起作用的
this.$set(this.myObject, 'newProperty', 'hi') // 这里是起作用的
```

**拓展分析**：

vue官方还提供有 `vm.delete`方法，主要作用是：

删除对象的 `property`。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 `property` 被删除的限制。

## 原理分析

### 底层实现缺陷

其实造成这些问题的原因是因为 vue2.x版本使用的是 `Object.defineProperty` 来实现响应式的，这是该方法的天然缺陷（新增属性以及删除属性无法监听到）

不过，vue3.x版本使用了ES6的Proxy来实现响应式，可以成功解决以上问题，Proxy天然支持对新属性的监听与删除属性的监听

### $set的实现

`vm.$set()`在 `new Vue()`时候就被注入到Vue的原型上

初始化的时候，在 init函数中会执行 `stateMixin()`方法，其中会执行如下逻辑代码

```js
Vue.prototype.$set = set
Vue.prototype.$delete = del
```

set方法的实现如下：

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
    // 1. 数组
    if (Array.isArray(target) && isValidArrayIndex(key)){
        // ...
        // 利用数组的splice变异方法触发响应式
        target.splice(key, 1, val)
        return val
    }

    // 2. 对象，属性key 是存在的
    if (key in target && !(key in Object.prototype)) {
        // target[key] = val
        return val
    }

    // 3. 全新属性
    // 1) target本身就不是响应式数据, 直接赋值
    // 获取Observer实例
    const ob = (target: any).__ob__
    if (!ob) {
        target[key] = val // 直接赋值
        return val
    }

    // 2) target本身是响应式数据，进行响应式处理
    defineReactive(ob.value, key, val) // 响应式处理
    ob.dep.notify() // 通知更新
    return val
}
```

这里只看新增属性，可以发现一个关键点，在代码底部的响应式处理相关逻辑，这一步其实就和初始化的时候，对 data数据进行响应式处理逻辑类似了，即 先完成依赖收集再触发通知

## Object.defineProperty分析

`defineReactive`内部是使用的 `Object.defineProperty`实现数据响应式的。

### 关于对象

`Object.defineProperty` 只能追踪到一个数据是否被修改，无法追踪**新增**属性和**删除**属性

由于 Vue 会在初始化实例时对 property 执行 `getter`/`setter` 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。

所以这两个操作无法触发 `getter`/`setter`， Vue 不会向依赖发送通知，视图也就无法更新。

```js
var vm = new Vue({
  data:{
    a:1
  }
})

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的
```

不过官方提供了一些特殊的API进行处理（`vm.$set`、`vm.$delete`）

```js
// 单个属性
this.$set(this.someObject,'b',2)

// 多个属性
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

> Object.assign 方法会使用源对象的[[Get]]和目标对象的[[Set]]，所以它会调用相关 getter 和 setter。

### 关于数组

Vue 不能检测以下数组的变动：

1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```

官方提供的解决方案API：

- `vm.$set`
- `splice`

```js
// 1. set方法
vm.$set(vm.items, indexOfItem, newValue)

// 2. splice方法
vm.items.splice(indexOfItem, 1, newValue)
```

修改数组长度也可以直接使用splice方法：`vm.items.splice(newLength)`

需要注意的是，Vue为了实现其响应式能力，数组方法是被处理过的

### Object.defineProperty的一些说明

需要说明的是 `Object.defineProperty`是可以检测到数组索引的变化的，Vue只是没有使用这个方式去监听数组索引的变化，因为尤大认为性能消耗太大，于是在性能和用户体验之间做了取舍。

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。数组的索引也是属性，所以我们是可以监听到数组元素的变化的。

但是我们新增一个元素，就不会触发监听事件，因为这个新属性我们并没有监听，删除一个属性也是。

`Object.defineProperty`虽然能检测索引的变化，但的确是监听不到数组的增加或删除的。

vm.set的核心还是 `Object.defineProperty()`，只是尽可能的避免了无用的数组索引监听。

---

针对该类问题（监听数组内容的添加、删除），Vue的解决方案就是重写了数组的原型，更准确的表达是拦截了数组的原型（这样不会影响到数组的正常使用）。

## 数组原型拦截

对于数组来说，使用 `Object.defineProperty`方法直接处理数组后，数组的属性新增和删除是无法监听到的，Vue通过对数组原型的拦截，完成了对数组的属性新增和删除的监听。

使得数组的7个能够改变自身的方法，得到了监听能力，这样就可以实现数组的响应式了。（不包括数组的索引修改）

模拟实现：

```js
// 获得原型上的方法
const arrayProto = Array.prototype;

// 创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
const arrayMethods = Object.create(arrayProto); 

// 做一些拦截的操作
Object.defineProperty(arrayMethods, 'push', {
    value(...args) {
        console.log('用户传进来的参数', args);

        // 真正的push 保证数据如用户期望
        arrayProto.push.apply(this, args);
    },
    enumerable: true,
    writable: true,
    configurable: true,
});

let list = [1];

list.__proto__ = arrayMethods; // 重置原型

list.push(2, 3);

console.log('用户得到的list:', list);
```

---

在 Vue的初始化过程中，会对 data对象中的属性进行响应式处理，对于对象类型，我们比较清楚是使用 `Object.defineProperty`直接遍历每个属性实现的，完成每个属性的依赖收集。

```js
function defineReactive (obj, key, val) {
    // 生成一个Dep实例
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        get: () => {
            // 依赖收集
            dep.depend();
        },
        set: () => {
            // 派发更新
            dep.notify();
        },
    })
}
```

为了保证data中每个数据有着一对一的dep，这里应用了闭包，保证每个dep实例不会被销毁。这里dep是一个局部变量，而监听数组变化，需要在数组拦截器中进行派发更新。

为了在数组拦截器中进行依赖收集，需要一个可以随时访问到的 Dep

```js
export class Observer {
    constructor (value: any) {
        this.value = value // data属性
        this.dep = new Dep() // 挂载dep实例
        // 为数据定义了一个 __ob__ 属性，这个属性的值就是当前 Observer 实例对象
        def(value, '__ob__', this) // 把当前Observer实例挂在到data的__ob__上

        // // 这里是一般响应式处理的逻辑
        // // 如果是数组
        // if (Array.isArray(value)) {
        //     // 如果原型上有__proto__属性， 主要是浏览器判断兼容
        //     if (hasProto) {
        //         // 直接覆盖响应式对象的原型
        //         protoAugment(value, arrayMethods)
        //     } else {
        //         // 直接拷贝到对象的属性上，因为访问一个对象的方法时，先找他自身是否有，然后才去原型上找
        //         copyAugment(value, arrayMethods, arrayKeys)
        //     }
        // } else {
        //   // 如果是对象
        //   this.walk(value);
        // }
    }
}
```

首先，在 `Observer`实例挂载了 `dep`实例

然后，把当前的 `Observer`实例挂载到 `data`的 `__ob__`上

在依赖收集的时候再读取

```js
// observe方法：获取当前data上的 observe实例，存在就返回 val.__ob__，否则返回 new Observer(val)
let childOb = !shallow && observe(val);

function defineReactive (obj, key, val) {
    // 生成一个Dep实例
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        get: () => {
            if (Dep.target) {
                // 依赖收集
                dep.depend();
                
                // 二次收集
                if (childOb.dep) {
                    // 再收集一次依赖
                    childOb.dep.depend();
                }
            }
            return val;
        },
    })
}
```

可以发现这里会进行两次依赖收集

相关源码见[src/core/observer/index.js - defineReactive](https://github1s.com/vuejs/vue/blob/HEAD/src/core/observer/index.js)

## 资料

- [Vue源码: 关于vm.$set()内部原理](https://juejin.cn/post/6844903830837002253)
- [Vue响应式原理 - 关于Array的特别处理](https://juejin.cn/post/6844903917898186766)
- [Vue为什么不能检测数组变动](https://segmentfault.com/a/1190000015783546)
