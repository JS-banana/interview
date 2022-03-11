# 块级作用域let与const

块级声明也就是让所声明的变量在指定块的作用域外无法被访问。

块级作用域在如下情况被创建：

1. 在一个函数内部
2. 在一个代码块（由一对花括号包裹）内部

简单来说，花括号内 {...} 的区域就是块级作用域区域。

说到作用域最好还是配合**词法作用域**与**闭包**一起食用，效果更佳~

`let`与`const`是ES6的新语法，为了更好的理解其特性和使用，首先要了解 `var`的使用方式和基本逻辑

## var声明

使用 `var` 关键字声明的变量，无论其实际声明位置在何处，都会被视为声明于所在函数的顶部（如果声明不在任意函数内，则视为在全局作用域的顶部）。这就是所谓的变量提升

```js
function getValue(condition) {
    if (condition) {
        var value = 'blue'
        // 其他代码
        return value
    } else {
        // value 在此处可访问，值为 undefined
        return null
    }
    // value 在此处可访问，值为 undefined
}
```

如果使用 let 声明变量，则变量会被视为局部变量，只能在声明的块级作用域内被访问。

```js
function getValue(condition) {
    if (condition) {
        let value = 'blue'
        // 其他代码
        return value
    } else {
        // value 在此处不可用
        return null
    }
    // value 在此处不可用
}
```

## 禁止重复声明

不同于 var，let 不能在同一作用域内重复声明一个已有标识符

## 全局块级绑定

let 与 const 不同于 var 的另一个方面是在全局作用域上的表现。

### 使用var

当在全局作用域上使用 var 时，它会创建一个新的全局变量，并成为全局对象（在浏览器中是 window ）的一个属性。这意味着使用 var 可能会无意覆盖一个已有的全局属性，就像这样：

```js
// 在浏览器中
var RegExp = "Hello!";
console.log(window.RegExp); // "Hello!"

var ncz = "Hi!";
console.log(window.ncz); // "Hi!"

aaa = '啊啊啊' // 内存泄漏
console.log(window.aaa) // "啊啊啊"
```

### 使用let、const

然而若你在全局作用域上使用 let 或 const ，虽然在全局作用域上会创建新的绑定，但不会有任何属性被添加到全局对象上。

虽然无法覆盖全局变量，但可以将其屏蔽。

```js
// 在浏览器中
let RegExp = "Hello!";
console.log(RegExp); // "Hello!" => 输出定义的字符串
console.log(window.RegExp === RegExp); // false => 并不等于 window内置的 RegExp变量

const ncz = "Hi!";
console.log(ncz); // "Hi!"
console.log("ncz" in window); // false
```

不会污染全局作用域，也更加安全。

## 暂时性死区

使用 `let` 或 `const` 声明的变量，在达到声明处之前都是无法访问的，试图访问会导致一个引用错误

简单描述就是：定义前无法访问

```js
console.log(typeof value); // "undefined"

if (true) {
    console.log(typeof value); // 引用错误 
    let value = "blue";
}
```

## 总结

- 必须在使用前定义，且 `const`定义的变量必须有初始值
- `let`和 `const`不会进行声明提升
- 不可重复声明

## 资料

- 《深入理解ES6》
