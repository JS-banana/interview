# 实现call、apply、bind函数

这3个方法是可以显示的调用改变函数 `this`指向的。

- **apply**：`apply` 方法接收两个参数，一个是 `this` 绑定的对象，一个是参数数组。
- **call**：`call` 方法接收的参数，第一个是 `this` 绑定的对象，后面的其余参数是传入函数执行的参数。
- **bind**：语法和 `call` 类似，只不过 `bind` 方法是创建一个新的函数，而这个函数是通过 `bind` 绑定了 `this` 的，`bind`后面的其他参数会被固定在这个新函数内部，待执行调用时，会合并到新函数的参数中一并作为参数。

> `apply`和`call`的实现方式类似，区别就是传参形式不同，`bind`因为是返回一个新的未执行函数，需要特殊处理，在外部包一层函数。

## call 函数的实现步骤

引用MDN对call的语法描述：

```js
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1, arg2)
call(thisArg, arg1, arg2, /* …, */ argN)
```

可以发现，`参数1` 是在调用 func 时要使用的 `this 值`。而后面的形参则都是函数的参数（这是和 apply 很大的一个区别）。

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

## apply 函数的实现步骤

引用MDN对apply的语法描述：

```js
apply(thisArg)
apply(thisArg, argsArray)
```

可以发现，`参数1` 是在调用 func 时要使用的 `this 值`。参数2 则是函数的参数（这是和 call 很大的一个区别）。

> 注：和call不同，apply只接受2个参数。排除参数1 是this，只有参数2 才是目标函数的参数（全部放在一个数组中）。
>
> argsArray 是一个类数组对象，用于指定调用 func 时的参数

- 判断调用对象是否为函数，即使是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
- 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
- 将函数作为上下文对象的一个属性。
- 判断参数值是否传入
- 使用上下文对象来调用这个方法，并保存返回结果。
- 删除刚才新增的属性
- 返回结果

```js
Function.prototype.myApply = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let result = null;
  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;
  // 将函数设为对象的方法
  context.fn = this;
  // 调用方法
  // 1. 如果第2个参数存在的话，则进行解构传入目标函数，执行函数
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    // 2. 如果没有第2个参数，则无效传参，直接执行即可
    result = context.fn();
  }
  // 将属性删除
  delete context.fn;
  return result;
};
```

## bind 函数的实现步骤

bind只是绑定 this 和固定参数，并不执行函数，返回一个新的待执行函数。

引用MDN对bind的语法描述：

```js
bind(thisArg)
bind(thisArg, arg1)
bind(thisArg, arg1, arg2)
bind(thisArg, arg1, arg2, /* …, */ argN)
```

可以发现，bind的用法和call还挺像的。

`参数1` 是在调用绑定函数时，`作为 this 参数`传入目标函数 func 的值。而后面的形参则在调用 func 时，插入到传入绑定函数的参数前的参数。

- 判断调用对象是否为函数，即使是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
- 保存当前函数的引用，获取其余传入参数值。
- 创建一个函数返回
- 函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象

```js
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  var args = [...arguments].slice(1),
    fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    // ❗特别注意：这里的 this 与 arguments，
    // 和函数外面的this、arguments已经不是同一个东西了
    const result = fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
    return result
  };
};
```

`bind` 和 `call` 最大的区别，在于 `call` 是绑定 `this` 时直接执行函数，然后返回结果值；而 `bind` 是绑定this 和初始参数后，并不执行，因此，这里的关键一点是 `bind` 返回的是一个 函数 而非执行结果值，它暴露给用户自己选择执行时机（把 `Fn` 函数返回给用户，待执行）。

那么这里就会有个问题：

`Fn` 和普通函数无异，它可以被 `call`、`apply` 调用，也可以被当成构造函数执行 `new` 的操作，那么经过这样的处理之后，最终它会是什么样的呢？

### call、apply 调用的影响

简单写个测试用例，分析下：

```js
function foo(a, ...args) {
  console.log('foo', this.name)
  return [a, ...args].reduce((prev, cur) => prev + cur, 0)
}

const obj = {
  name: 'A'
}
const fooBound = foo.bind(obj, 1, 2)
console.log('fooBound', fooBound(3))

const obj2 = {
  name: 'B'
}
const barBound = fooBound.bind(obj2, 3)
console.log('barBound', barBound(4))

const obj3 = {
  name: 'C'
}
const foo2 = foo.bind(obj3, 4)
console.log('foo2', foo2(5)) 

// 输出结果如下：
// foo A
// fooBound 6
// foo A
// barBound 10
// foo C
// aseBound 9
```

分析结果可以发现：

1. 被 `bind` 绑定之后的绑定函数，再使用 `bind` 绑定时，传入的 `thisArg` 无效，但是之前传递的参数依然有效（这里的保留参数是不是有点像**柯里化**函数）
2. 被 `bind` 绑定之后的目标函数，可以被 `bind` 重新绑定，这时会返回一个新函数，之前绑定的参数无效

MDN官方是这样描述的：

绑定函数可以通过调用 `fooBound.bind(thisArg, /*more args*/)` 进一步进行绑定，从而创建另一个绑定函数 `barBound`。新绑定的 `thisArg` 值会被忽略，因为 `barBound` 的目标函数是 `fooBound`，而 `fooBound` 已经有一个绑定的 `this` 值了。当调用 `barBound` 时，它会调用 `fooBound`，而 `fooBound` 又会调用 `foo`。

`foo` 最终接收到的参数按顺序为：`fooBound` 绑定的参数、`barBound` 绑定的参数，以及 `barBound` 接收到的参数。

### 构造函数 new 的影响

```js
function foo(a, ...args) {
  console.log('foo', this.name)
  const total = [a, ...args].reduce((prev, cur) => prev + cur, 0)
  this.val = `[${this.name}]：${total}`
  return this.val
}
foo.prototype.getSum = function () {
  return this.val
}

const obj = {
  name: 'A'
}
const fooBound = foo.bind(obj, 1, 2)
console.log('fooBound', fooBound(3))

const son = new fooBound(3, 4) 
console.log('son', son.val) 
console.log('son:sum', son.getSum()) 
console.log('son:prototype', son instanceof foo) 

// 输出结果如下：
// foo A    
// fooBound [A]：6
// foo undefined
// son [undefined]：10
// son:sum [undefined]：10
// true
```

使用 `new` 构造被 `bind` 绑定的函数时，`bind`提供的 `this` 值会被忽略，参数会被正常传递执行。

从上一章的内容（手写 `new` 的实现）我们可知，当执行 `new Function` 这种构造写法的时候，`new` 的内部会以 `Function` 为原型新创建一个对象，并通过 `apply(thisArg, args)` 这种形式绑定到执行 `Function` 函数的 `this`上下文。

其实，在上一章中我们也说过，`new` 的本质相当于对原型链的继承，主要是完成对 `prototype` 的绑定，而这里的 `bind` 只是修改了执行上下文`this`，因此，这里不管你如何 `new` 构造几次函数，最终寻找原型的时候还是会回到最开始的 `foo` 函数上。
