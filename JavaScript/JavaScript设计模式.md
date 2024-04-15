# JavaScript设计模式

设计模式是“拿来主义”在软件领域的贯彻实践

- 单一功能原则
- 开放封闭原则：对拓展开放，对修改封闭。软件实体（类、模块、函数）可以扩展，但是不可修改。

设计模式的核心思想——**封装变化**

将变与不变分离，确保变化的部分灵活、不变的部分稳定

## 设计模式

1. 创建型

    - 工厂模式
    - 单例模式
    - 原型模式

2. 结构型

    - 装饰器模式
    - 适配器模式
    - 代理模式

3. 行为型

    - 策略模式
    - 状态模式
    - 观察者模式
    - 迭代器模式

## 工厂模式

简单工厂（变与不变）：

工厂模式其实就是将创建对象的过程单独封装。

- 构造函数使用的场景
- 只传参即可，不关心过程

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career 
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...
            
    return new User(name, age, career, work)
}
```

抽象工厂（开放封闭）：

- 围绕一个超级工厂创建其他工厂

1. 抽象工厂：抽象类，它不能被用于生成具体实例；用于声明最终目标产品的共性

    ```js
    // 例如我想生产一个手机，手机工厂如何定义
    // 手机的基本组成包括 操作系统、硬件 两个主要部分
    class MobilePhoneFactory {
        // 提供操作系统的接口
        createOS(){
            throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
        }
        // 提供硬件的接口
        createHardWare(){
            throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
        }
    }
    ```

2. 具体工厂：用于生成产品族里的一个具体的产品；继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。

    - 抽象工厂不干活，具体工厂（ConcreteFactory）来干活！

    ```js
    // 具体工厂继承自抽象工厂
    // 比如我现在想要一个专门生产 Android 系统 + 高通硬件 的手机的生产线
    class FakeStarFactory extends MobilePhoneFactory {
        createOS() {
            // 提供安卓系统实例
            return new AndroidOS()
        }
        createHardWare() {
            // 提供高通硬件实例
            return new QualcommHardWare()
        }
    }
    ```

3. 抽象产品：抽象类，它不能被用于生成具体实例

    - 用一个抽象产品（AbstractProduct）类来声明这一类产品应该具有的基本功能（比如这里的 操作系统 可以控制手机硬件这一基本功能）

    ```js
    // 定义操作系统这类产品的抽象产品类，硬件同理
    class OS {
        controlHardWare() {
            throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
        }
    }
    ```

4. 具体产品：用于生成产品族里的一个具体的产品所依赖的更细粒度的产品

    ```js
    // 定义具体操作系统的具体产品类
    class AndroidOS extends OS {
        controlHardWare() {
            console.log('我会用安卓的方式去操作硬件')
        }
    }

    class AppleOS extends OS {
        controlHardWare() {
            console.log('我会用🍎的方式去操作硬件')
        }
    }

    // 等等
    // ...
    ```

如此一来，当我们需要生产一台FakeStar手机时，我们只需要这样做：

```js
// 这是我的手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
```

假如有一天，FakeStar过气了，我们需要产出一款新机投入市场;不需要对抽象工厂MobilePhoneFactory做任何修改，只需要拓展它的种类：

```js
class newStarFactory extends MobilePhoneFactory {
    createOS() {
        // 操作系统实现代码
    }
    createHardWare() {
        // 硬件实现代码
    }
}
```

这么个操作，对原有的系统不会造成任何潜在影响 所谓的“对拓展开放，对修改封闭”就这么圆满实现了。前面我们之所以要实现抽象产品类，也是同样的道理。

## 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点，这样的模式就叫做单例模式。

- 不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例
- 具备判断自己是否已经创建过一个实例的能力

```js
class SingleDog {
    show() {
        console.log('我是一个单例对象')
    }
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!SingleDog.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            SingleDog.instance = new SingleDog()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return SingleDog.instance
    }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()

// true
s1 === s2
```

## 原型模式

谈原型模式，其实是谈原型范式。

原型编程范式的核心思想就是利用实例来描述对象，用实例作为定义对象和继承的基础

每个构造函数上都有一个属性prototype，也就是原型对象，原型对象上有个constroctor属性指回构造函数。

## 装饰器模式

装饰器模式，又名装饰者模式。它的定义是“在不改变原对象的基础上，通过对其进行包装拓展，使原有对象可以满足用户的更复杂需求”。

装饰器模式的优势在于其极强的灵活性和可复用性——它本质上是一个函数，而且往往不依赖于任何逻辑而存在。

- 函数传参&调用：定义装饰器函数，将被装饰者“交给”装饰器

1. 当我们给一个类添加装饰器时：

    ```js
    function classDecorator(target) {
        // target 就是被装饰的类本身
        target.hasDecorator = true
        return target
    }

    // 将装饰器“安装”到Button类上
    @classDecorator
    class Button {
        // Button类的相关逻辑
    }
    ```

2. 当我们给一个方法添加装饰器时

    ```js
    // 注意这里的参数变化
    function funcDecorator(target, name, descriptor) {
        // 此处的 target 变成了Button.prototype，即类的原型对象s
        let originalMethod = descriptor.value
        descriptor.value = function() {
            console.log('我是Func的装饰器逻辑')
            return originalMethod.apply(this, arguments)
        }
        return descriptor
    }

    class Button {
        @funcDecorator
        onClick() {
            console.log('我是Func的原有逻辑')
        }
    }
    ```

    - 装饰器函数调用的时机是在编译阶段：
    - 1）装饰器函数执行的时候，Button 实例还并不存在。
    - 2）这是因为实例是在我们的代码运行时动态生成的，而装饰器函数则是在编译阶段就执行了。
    - 3）所以说装饰器函数真正能触及到的，就只有类这个层面上的对象。

- 将“属性描述对象”交到你手里

在编写类装饰器时，我们一般获取一个target参数就足够了。但在编写方法装饰器时，我们往往需要至少三个参数。

第二个参数name，是我们修饰的目标属性属性名，重点是第三个参数，它的真面目就是“属性描述对象”——Object.defineProperty，通过该对象我们就可以对目标方法的逻辑进行各种各样的拓展了。

实际的应用中，高阶函数HOC的逻辑很相似。

## 适配器模式

适配器模式通过把一个类的接口变换成客户端所期待的另一种接口，可以帮我们解决不兼容的问题。

适配器的用途非常广泛，比如：

axios 通过适配器模式，抹平了浏览器与node环境的差异，使得它在这两种环境中都可以使用。对于使用者来说，入参、出参的格式则完全一致，几乎没有心智负担。

默认适配器方法 getDefaultAdapter：

```js
function getDefaultAdapter() {
  var adapter;
  // 判断当前是否是node环境
  if (
    typeof process !== 'undefined' 
    && Object.prototype.toString.call(process) === '[object process]'
  ) {
    // 如果是node环境，调用node专属的http适配器
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // 如果是浏览器环境，调用基于xhr的适配器
    adapter = require('./adapters/xhr');
  }
  return adapter;
}
```

http 适配器：

```js
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    // 具体逻辑
  }
}
```

xhr 适配器：

```js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // 具体逻辑
  }
}
```

- 两个适配器的入参都是 config；
- 两个适配器的出参都是一个 Promise

## 代理模式

- vpn
- ES6中的Proxy
- HTML的DOM事件代理

## 观察者模式

观察者模式，是所有 JavaScript 设计模式中使用频率最高，面试频率也最高的设计模式。

观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象，当这个目标对象的状态发生变化时，会通知所有观察者对象，使它们能够自动更新。

- Vue 响应式原理
- Event Bus / EventEmitter

```js
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {}
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = []
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb)
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice()
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args)
      })
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName]
    const index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}
```

观察者模式与发布订阅模式的区别：

- 发布者直接触及到订阅者的操作，叫观察者模式
- 发布者不直接触及到订阅者、而是由统一的第三方来完成实际的通信的操作，叫做发布-订阅模式。

观察者模式和发布-订阅模式之间的区别，在于是否存在第三方、发布者能否直接感知订阅者。

![pub-sub](/static/images/pub-sub.webp)

## 迭代器模式

迭代器模式提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。

迭代器模式是设计模式中少有的目的性极强的模式。所谓“目的性极强”就是说它不操心别的，它就解决这一个问题——遍历。

ES6约定，任何数据结构只要具备Symbol.iterator属性（这个属性就是Iterator的具体实现，它本质上是当前数据结构默认的迭代器生成函数），就可以被遍历——准确地说，是被for...of...循环和迭代器的next方法遍历。 事实上，for...of...的背后正是对next方法的反复调用。

```js
// 定义生成器函数，入参是任意集合
function iteratorGenerator(list) {
    // idx记录当前访问的索引
    var idx = 0
    // len记录传入集合的长度
    var len = list.length
    return {
        // 自定义next方法
        next: function() {
            // 如果索引还没有超出集合长度，done为false
            var done = idx >= len
            // 如果done为false，则可以继续取值
            var value = !done ? list[idx++] : undefined
            
            // 将当前值与遍历是否完毕（done）返回
            return {
                done: done,
                value: value
            }
        }
    }
}

var iterator = iteratorGenerator(['1号选手', '2号选手', '3号选手'])
iterator.next() // {done: false, value: '1号选手'}
iterator.next() // {done: false, value: '2号选手'}
iterator.next() // {done: false, value: '3号选手'}
// iterator.next() // {done: true, value: undefined}
```
