# Redux

redux遵循三大基本原则：

1. 单一数据源
2. state 是只读的
3. 使用纯函数来执行修改

## 思考

1. redux 核心实现分析
2. 异步中间件实现分析
3. 顶层provider作用分析

## 工作原理

redux要求我们把数据都放在 store公共存储空间

一个组件改变了 store 里的数据内容，其他组件就能感知到 store的变化，再来取数据，从而间接的实现了这些数据传递的功能

![redux](/static/images/redux.png)

## 中间件

中间件是对应用能力的一种拓展，一般应用核心（core）只做基本功能和插件使用能力，把多余的功能全局解耦，通过单一职责的插件去丰富应用的能力，比如 koa的中间件模式、webpack的plugin模式。

这里的redux中间件，相当于是在执行dispatch函数时，延迟了修改state的操作，实现了一种类似异步更新的操作。

![redux-middlewares](/static/images/redux-middlewares.png)

## 基本使用

redux 是框架无关的一个状态管理库，它可以在原生JS、react、vue等其他框架中使用。

通过使用发布订阅模式，维护依赖关系，通知更新。

```jsx
import { createStore } from 'redux'

// reducer
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// store
const store = createStore(counter)

// DOM 渲染
const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
  />,
  document.getElementById('root')
)

render()
store.subscribe(render)
```

### redux 核心代码分析

从上面的简单示例来看，redux 的 createStore、subscribe、dispatch 可以实现基本功能，为核心方法。

为了更纯粹的分析相关代码思路，建议看 1.0 的版本实现

```js
export default function createStore(reducer, initialState) {
  var currentReducer = reducer;
  var currentState = initialState;
  var listeners = [];
  var isDispatching = false;

  // 返回当前 state
  function getState() {
    return currentState;
  }

  // 订阅，添加更新函数到队列中
  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 发布通知，执行队列中的更新函数
  function dispatch(action) {
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    listeners.slice().forEach(listener => listener());
    return action;
  }


  // 初始化，默认执行一次
  dispatch({ type: '@@redux/INIT' });

  return {
    dispatch,
    subscribe,
    getState,
  };
}
```

核心代码实现看起来并不复杂，仅有几十行。

主要使用了观察者模式，subscribe 用于订阅，订阅者被统一维护在 listeners 队列中，dispatch 作为更新状态函数，同时起到发布更新的操作，通知订阅者进行更新。

我觉得这里重点应该是订阅者的 listener 函数的实现逻辑是怎样的，比如说，在 react 中是如何绑定更新的呢？

## react-redux 揭秘

因为在 react16.8 前后出现了 hooks，这里我们分开分析两种绑定逻辑的实现。

### 16.8 之前

使用方式：

```js
// 入口
ReactDOM.render(
  <Provider store={store}>
    <APP />
  </Provider>,
  document.getElementById('root')
)

// 组件
function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

Provider 的相关实现，其实这里的作用，主要是为了向子孙组件传递 store

```js
// 主要是通过 getChildContext 向子组件传递 store
export default class Provider extends Component {
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  render() {
    return Children.only(this.props.children)
  }
}
```

connect 的相关实现，它是一个高阶组件，这里我们主要围绕 订阅 和 更新 函数分析，其他非核心代码暂不考虑。

```js
// connect 不传入对应参数时，定义的默认参数方法
const defaultMapStateToProps = state => ({})
const defaultMapDispatchToProps = dispatch => ({ dispatch })
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
  ...parentProps,
  ...stateProps,
  ...dispatchProps
})

// connect 函数
function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) { 
  const { pure = true, withRef = false } = options
  const finalMergeProps = mergeProps || defaultMergeProps

  // 返回一个函数，它接受一个组件作为参数
  // connect 会把一些参数属性，以及父组件的状态合并作为 props 传递给子组件
  return function wrapWithConnect(WrappedComponent) {

    // 会返回一个 class 组件
    class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        this.store = props.store || context.store 

        const storeState = this.store.getState()
        this.state = { storeState }
      }

      componentDidMount() {
        this.trySubscribe()
      }

      // 订阅
      trySubscribe() {
        if (shouldSubscribe && !this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
          this.handleChange()
        }
      }

      // 更新函数
      handleChange() {
        const storeState = this.store.getState()
        const prevStoreState = this.state.storeState

        // 状态前后无变化，则不更新
        if (pure && prevStoreState === storeState) {
          return
        }

        this.hasStoreStateChanged = true
        // setState 触发更新
        this.setState({ storeState })
      }

      render() {
        // 省略一些非核心代码之后
        const mapDispatch= mapDispatchToProps || defaultMapDispatchToProps
        this.dispatchProps = mapDispatch(store.dispatch, props)

        // 合并属性和方法，作为 props 传入子组件
        const mergedProps = finalMergeProps(this.stateProps, this.dispatchProps, this.props)

        if (withRef) {
          this.renderedElement = createElement(WrappedComponent, {
            ...this.mergedProps,
            ref: 'wrappedInstance'
          })
        } else {
          this.renderedElement = createElement(WrappedComponent,
            this.mergedProps
          )
        }

        return this.renderedElement
      }

    }

    // hoistStatics 负责把 WrappedComponent 的一些属性与方法复制到 Connect
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

### 16.8 之后 hooks

在入口文件中，APP组件外层包裹一个 Provider。

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

通过查看源码可知，Provider 其实就是 react 的 createContext，而 store 则作为 value 传入。

主要作用就是为了，在子组件中可以通过使用 useContext hooks 实现数据的绑定获取。

## redux 的中间件

## redux-thunk 揭秘
