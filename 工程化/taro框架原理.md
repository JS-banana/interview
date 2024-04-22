# taro 框架原理

**Write Once Run AnyWhere**

taro 1.x 版本 与 2.x 版本 主要是是编译时，3.x 版本重构了运行时架构，主要是基于运行时。

在小程序平台底层实现了类似浏览器的 DOM/BOM，因此，对于 react、vue 等框架的支持更加强大，使用也更加方便。

## 微信小程序

![wx](/static/images/wx-framework.webp)

微信小程序主要分为 逻辑层 和 视图层，以及在他们之下的原生部分。

- 逻辑层主要负责 JS 运行
- 视图层主要负责页面的渲染

它们之间主要通过 Event 和 Data 进行通信，同时通过 JSBridge 调用原生的 API。

抛开原生部分不看，架构图可以做如下简化：

![wx-framework-simple](/static/images/wx-framework-simple.webp)

- 逻辑层调用对应的 App()/Page() 方法，处理 data、提供生命周期/事件函数等
- 视图层提供对应的模版及样式供渲染

## Taro 老架构

Taro 的架构主要分为：编译时 和 运行时。

- 其中编译时主要是将 Taro 代码通过 Babel 转换成小程序的代码，如：JS、WXML、WXSS、JSON。
- 运行时主要是进行一些：生命周期、事件、data 等部分的处理和对接。

需要说明的是，老架构主要是基于编译时做处理，运行时更多的是配合辅助，总的来说，老架构是更关注编译时而非运行时的。

### 编译时

1. 使用 babel-parser 将 Taro 代码解析成抽象语法树
2. 然后通过 babel-types 对抽象语法树进行一系列修改、转换操作
3. 最后再通过 babel-generate 生成对应的目标代码

taro的 1.x和2.x版本主要是围绕 react 技术栈进行开发使用，采用的是编译时方案 —— 把react的语法转换成对应的小程序的语法。

![handler](/static/images/wx-taro-jsx-handler.webp)

但是，这种方案的难点和复杂部分主要集中在对 JSX 的编译上。在编译阶段 taro 需要对 JSX 的各种写法进行一一适配，工作量非常大，而且因为 JSX 过于灵活，所以很难保证开发者一定会按照 react 规范开发，从而导致一些 bug 产生。

### 运行时

```js
// 编译前
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentDidMount () { }

  render () {
    return (
      <View className=‘index' onClick={this.onClick}>
        <Text>Hello world!</Text>
      </View>
    )
  }
}

// 编译后
// 1. BaseComponent 主要是对 React 的一些核心方法：setState、forceUpdate 等进行了替换和重写
// 2. createComponent 主要作用是调用 Component() 构建页面
import {BaseComponent, createComponent} from '@tarojs/taro-weapp'

class Index extends BaseComponent {

// ...

  _createDate(){
    //process state and props
  }
}

export default createComponent(Index)
```

1. 主要是对 React 的一些核心方法：setState、forceUpdate 等进行了替换和重写
2. 在编译时 taro 会对 react render 方法进行替换处理，运行时阶段通过内部的 Component() 方法进行构建页面，对接事件、生命周期等；进行 Diff Data 并调用 setData 方法更新数据。

### 小结

1. 重编译时，轻运行时：这从两边代码行数的对比就可见一斑。
2. 编译后代码与 React 无关：Taro 只是在开发时遵循了 React 的语法。
3. 直接使用 Babel 进行编译：这也导致当前 Taro 在工程化和插件方面的羸弱

## Taro Next 新架构

站在浏览器的角度来思考前端的本质：无论开发这是用的是什么框架，React 也好，Vue 也罢，最终代码经过运行之后都是调用了浏览器的那几个 BOM/DOM 的 API ，如：createElement、appendChild、removeChild 等。

![taro-runtime](/static/images/taro-runtime.webp)

1. taro 新增了 taro-runtime 运行时包，这个包中实现了 一套 高效、精简版的 DOM/BOM API
2. 然后，通过 Webpack 的 ProvidePlugin 插件，注入到小程序的逻辑层。
3. 这样，在小程序的运行时，就有了 一套高效、精简版的 DOM/BOM API

显而易见，这样做的好处是抹平了不同框架平台的编译问题，无论使用 react 或者 vue 等框架，都可以很方便的进行适配。

### Taro 事件机制

Taro Next 事件本质上是基于 Taro DOM 实现了一套自己的事件机制，

这样做的好处之一是，无论小程序是否支持事件的冒泡与捕获，Taro 都能支持。

![taro-event](/static/images/taro-event.webp)

Taro Next 事件，具体的实现方式如下：

1. 在小程序组件的模版化过程中，将所有事件方法全部指定为 调用 ev 函数，如：bindtap、bindchange、bindsubmit 等。
2. 在运行时实现 eventHandler 函数，和 eh 方法绑定，收集所有的小程序事件
3. 通过 document.getElementById() 方法获取触发事件对应的 TaroNode
4. 通过 createEvent() 创建符合规范的 TaroEvent
5. 调用 TaroNode.dispatchEvent 重新触发事件

### Taro 更新机制

无论是 React 还是 Vue ，最终都会调用 Taro DOM 方法，如：appendChild、insertChild 等。

这些方法在修改 Taro DOM Tree 的同时，还会调用 `enqueueUpdate` 方法，这个方法能获取到每一个 DOM 方法最终修改的`节点路径`和`值`，如：`{root.cn.[0].cn.[4].value: "1"}`，并通过 setData 方法更新到视图层。

![taro-update](/static/images/taro-update.webp)

可以看到，**更新的粒度是 DOM 级别**，只有最终发生改变的 DOM 才会被更新过去，相对于之前 data 级别的更新会更加精准，性能更好。

## 新架构的特点

和之前的架构不同，Taro Next 是 近乎全运行时。

新的架构基本解决了之前的遗留问题：

- **无 DSL 限制**：无论是你们团队是 React 还是 Vue 技术栈，都能够使用 Taro 开发
- **模版动态构建**：和之前模版通过编译生成的不同，Taro Next 的模版是固定的，然后基于组件的 template，动态 “递归” - 渲染整棵 Taro DOM 树。
- **新特性无缝支持**：由于 Taro Next 本质上是将 React/Vue 运行在小程序上，因此，各种新特性也就无缝支持了。
- **社区贡献更简单**：错误栈将和 React/Vue 一致，团队只需要维护核心的 taro-runtime。
- **基于 Webpack**：Taro Next 基于 Webpack 实现了多端的工程化，提供了插件功能。

## 新架构性能优化

同等条件下，编译时做的工作越多，也就意味着运行时做的工作越少，性能会更好。Taro Next 的新架构变成 近乎全运行 之后，花了很多精力在性能优化上面。

可以先看一下 Taro Next 的流程和原生小程序的流程对比：

![taro-performance](/static/images/taro-performance.webp)

可以发现，相比原生小程序，Taro Next 多了红色部分的带来的性能隐患，如：引入 React/Vue 带来的 包的 Size 增加，运行时的损耗、Taro DOM Tree 的构建和更新、DOM data 初始化和更新。

而我们真正能做的，只有绿色部分，也就是：**Taro DOM Tree 的构建和更新、DOM data 初始化和更新**。

### 包 Size

随着项目的增加，页面越来越多，原生的项目 WXML 体积会不断增加，而 Taro Next 不会。

和之前模版通过编译生成的不同，Taro Next 的模版是固定的，然后基于组件的 template，动态 “递归” 渲染整棵 Taro DOM 树。也就是说，Taro Next 的 WXML 大小是有上限的。

当页面的数量超过一个临界点时，Taro Next 的包体积可能会更小。

### DOM Tree

jsdom 库，是在 Node.js 上实现了一套 Web 标准的 DOM/BOM ，这个仓库的代码在压缩前大概有 2.1M，而 Taro Next 的核心的 DOM/BOM API 代码才 1000 行不到。

taro 仅实现了高效的、精简版 DOM/BOM API，而且仅仅实现了必要的。

最大限度的保证了 Taro DOM Tree 构建和更新阶段的性能。

### update data

在数据更新阶段，Taro Next 的更新是 DOM 级别的，比 Data 级别的更新更加高效，

因为 Data 粒度更新实际上是有冗余的，并不是所有的 Data 的改变最后都会引起 DOM 的更新。

其次，Taro 在更新的时候将 Taro DOM Tree 的 path 进行压缩，这点也极大的提升了性能。

![DOM 粒度](/static/images/taro-data-path.webp)

## 新架构的 React 实现

在 DOM/BOM 注入之后，理论上来说，Nerv/Preact 就可以直接运行了。

但是 React 有点特殊，因为 React-DOM 包含大量浏览器兼容类的代码，导致包太大，而这部分代码我们是不需要的，因此我们需要做一些定制和优化。

![react16x-framework](/static/images/react16x-framework.webp)

- **react-core**：是 React 的核心部分
- **react-reconciler**：职责是维护 VirtualDOM 树，内部实现了 Diff/Fiber 算法，决定什么时候更新、以及要更新什么
- **Renderer**：负责具体平台的渲染工作，它会提供宿主组件、处理事件等等。例如 React-DOM 就是一个渲染器，负责 DOM 节点的渲染和 DOM 事件处理。

taro 实现了 taro-react 包，用来连接 react-reconciler 和 taro-runtime 的 BOM/DOM API：

![taro-react](/static/images/taro-react.webp)

1. 实现 react-reconciler 的 hostConfig 配置，即在 hostConfig 的方法中调用对应的 Taro BOM/DOM 的 API。
2. 实现 render 函数（类似于 ReactDOM.render）方法，可以看成是创建 Taro DOM Tree 的容器。

![taro-react-img](/static/images/taro-react-img.webp)

通过这种方式，React 代码实际上就可以在小程序的运行时正常运行了，并且会生成 Taro DOM Tree。

那么偌大的 Taro DOM Tree 怎样更新到页面呢？

1. 首先，taro 将小程序的所有组件挨个进行模版化处理，从而得到小程序组件对应的模版，如下图就是小程序的 view 组件经过模版化处理后的样子：

    ![view](/static/images/wx-view.webp)

2. 然后，基于组件的 template，动态 “递归” 渲染整棵树。

    - 先去遍历 Taro DOM Tree 根节点的子元素，
    - 再根据每个子元素的类型选择对应的模板来渲染子元素，
    - 然后在每个模板中我们又会去遍历当前元素的子元素，以此把整个节点树递归遍历出来。

    ![渲染](/static/images/taro-template-render.webp)

整个 Taro Next 的 React 实现流程图如下：

![整体流程](/static/images/taro-react-workflow.webp)

## 新架构的 Vue 实现

别看 React 和 Vue 在开发时区别那么大，其实在实现了 BOM/DOM API 之后，它们之间的区别就很小了。

Vue 和 React 最大的区别就在于运行时的 CreateVuePage 方法，这个方法里进行了一些运行时的处理，比如：生命周期的对齐。

![vue](/static/images/taro-vue-img.webp)

其他的部分，如通过 BOM/DOM 方法构建、修改 DOM Tree 及渲染原理，都是和 React 一致的。

## 资料

- 《小程序跨框架开发的探索与实践》
