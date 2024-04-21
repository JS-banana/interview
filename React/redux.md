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

先看下基本使用方式：

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
const store = createStore(reducer)

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
store.subscribe(render) // 订阅 更新回调函数
```

reducer 是纯函数，接收state 和 action，然后返回一个新的 state。

### redux 核心代码分析

从上面的简单示例来看，只需使用 redux 的 createStore、subscribe、dispatch 即可实现基本功能，绑定状态和更新，视为 redux 的核心方法。

这里提供一个思路，在学习源码时，一定要注意抓核心、抓重点，许多成熟的框架为了功能完善，为了各种细节和异常处理，会增加很多兼容处理，但是这些并不属于核心逻辑，为了梳理代码，这一块可以先不看。

为了更纯粹的分析相关代码思路，我建议看 1.0 的版本实现

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

    // 清除订阅
    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 发布通知，执行队列中的更新函数
  function dispatch(action) {
    try {
      isDispatching = true;
      // reducer 接受 state 和 action，返回新的 state
      // 遵循 react 的不可变数据规则
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

dispatch 的实现并不复杂，在使用 reducer 返回一个新的状态后，依次执行队列中的更新回调；我觉得这里重点应该是订阅者 listener 函数的实现逻辑是怎样的，比如说，在 react 中是如何绑定更新的呢？

## react-redux 揭秘

跟着上面的问题，我们来看下 react-redux 的相关实现（redux是框架无关的库，react 通过 react-redux 这个库实现了 redux 的绑定）。

因为在 react16.8 之后 react 推出了 fiber 架构，以及 hooks，这里我们以此为节点，分别讨论前后两种绑定逻辑的实现。

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

connect 基本使用：

1. 第一个参数：转换 store 的 state 作为 props 传入组件
2. 第二个参数：转换 store 的 dispatch 函数作为 props 传入组件
3. connect的值作为高阶函数，接受一个组件作为参数，同时把封装好的 props 传入

bindActionCreators 方法的作用，该方法的核心是 bindActionCreator 函数，相关代码如下：

```js
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments))
  }
}

// 判断 actionCreators 是否为函数
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  const boundActionCreators = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

1. bindActionCreators 可以接收一个函数作为参数，并以 dispatch 包装处理
2. bindActionCreators 也可以接受由多个函数组合的对象，并依次使用 dispatch 函数包装处理

Provider 在这里的作用，主要是为了向子孙组件传递 store

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
  // 精简核心逻辑后，可以得出如下代码
  const finalMergeProps = mergeProps || defaultMergeProps
  const mapState = mapStateToProps || defaultMapStateToProps
  const mapDispatch = mapDispatchToProps || defaultMapDispatchToProps

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
        this.stateProps  =  mapState(this.store.getState(), this.props)
        this.dispatchProps = mapDispatch(this.store.dispatch, this.props)

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

1. Provider组件是让所有的组件可以访问到store。不用手动去传。也不用手动去监听。
2. connect函数作用是从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。也传递dispatch(action)函数到props。

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

对比 16.8 之前的实现，可以发现核心逻辑基本一致，都是为了方便 子孙组件取用 store 实例，主要是通过 context 可以无限向下传递的特性。

思考一下，16.8 之后的版本可以不使用 connect 包裹组件，即可实现订阅绑定

## Provider hook 版本

先看下 Provider 的相关实现，在看源码之前，我们可以简单思考下

```js
function connect(mapStateToProps, mapDispatchToProps, mergeProps, options) {
  
}

function connectAdvanced(selectorFactory, options) {
  // 返回一个函数，它接受一个组件作为参数
  // connect 会把一些参数属性，以及父组件的状态合并作为 props 传递给子组件
  return function wrapWithConnect(WrappedComponent) { 

    // Connect 组件
    function ConnectFunction(props) {
      const [propsContext, reactReduxForwardedRef, wrapperProps] =
        useMemo(() => {
          const { reactReduxForwardedRef, ...wrapperProps } = props
          return [props.context, reactReduxForwardedRef, wrapperProps]
        }, [props])
    }

    // Connect 作为最终返回的组件
    const Connect = pure ? React.memo(ConnectFunction) : ConnectFunction

    Connect.WrappedComponent = WrappedComponent
    Connect.displayName = ConnectFunction.displayName = displayName

    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
        return <Connect {...props} reactReduxForwardedRef={ref} />
      })

      forwarded.displayName = displayName
      forwarded.WrappedComponent = WrappedComponent
      return hoistStatics(forwarded, WrappedComponent)
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
```

## redux 的中间件

## redux-thunk 揭秘
