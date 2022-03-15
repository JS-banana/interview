# JS的类

## ES5的类模拟实现

JS 在 ES5 及更早版本中都不存在 `class`类。

需要说明一点的是：`class` 只是原型链的语法糖，与其它语言中的类不是同一样东西。

ES5模仿类的方式是通过构造函数来实现：

```js
function PersonType(name) {
  this.name = name
}

PersonType.prototype.sayName = function () {
  console.log(this.name)
}

let person = new PersonType('Nicholas')
person.sayName() // 输出 "Nicholas"

console.log(person instanceof PersonType) // true
console.log(person instanceof Object) // true
```

通过把方法指派的构造器原型上来实现继承。

## ES6的类

使用类语法 `class`能够少写大量的代码

```js
class PersonClass {
  // 等价于 PersonType 构造器
  constructor(name) {
    this.name = name
  }
  // 等价于 PersonType.prototype.sayName
  sayName() {
    console.log(this.name)
  }
}

let person = new PersonClass('Nicholas')
person.sayName() // 输出 "Nicholas"

console.log(person instanceof PersonClass) // true
console.log(person instanceof Object) // true

console.log(typeof PersonClass) // "function"
console.log(typeof PersonClass.prototype.sayName) // "function"
```

这里的 `name` 为自有属性

> 自有属性（ Own properties ）：该属性出现在实例上而不是原型上，只能在类的构造器或方法内部进行创建。

简单分析：

- `class`类声明其实是个以自定义类型声明为基础的语法糖
- 可以把自定义类型声明与类混合使用

## 相似与区别

- 类声明不会被提升，这与函数定义不同。（类声明的行为与 `let` 相似，因此在程序的执行到达声明处之前，类会存在于**暂时性死区**内）
- 类声明中的所有代码会自动运行在**严格模式**下，并且也无法退出严格模式
- 类的所有方法都是**不可枚举*的，这是对于自定义类型的显著变化，后者必须用 `Object.defineProperty()` 才能将方法改变为不可枚举
- 类的所有方法内部都没有 `[[Construct]]` ，因此使用 `new` 来调用它们会抛出错误
- 调用类构造器时不使用 `new` ，会抛出错误
- 试图在类的方法内部重写类名，会抛出错误

这样看来，上例中的 `PersonClass` 声明实际上就直接等价于以下未使用类语法的代码：

```js
// 直接等价于 PersonClass
let PersonType2 = (function () {
  'use strict'
  const PersonType2 = function (name) {
    // 确认函数被调用时使用了 new
    if (typeof new.target === 'undefined') {
      throw new Error('Constructor must be called with new.')
    }
    this.name = name
  }
  Object.defineProperty(PersonType2.prototype, 'sayName', {
    value: function () {
      // 确认函数被调用时没有使用 new
      if (typeof new.target !== 'undefined') {
        throw new Error('Method cannot be called with new.')
      }
      console.log(this.name)
    },
    enumerable: false,// 不可枚举，不可被 new调用
    writable: true,
    configurable: true,
  })
  return PersonType2
})()
```

注意：

这里有两个 `PersonType2` 声明：一个在外部作用域的 `let` 声明，一个在 `IIFE` 内部的 `const` 声明。这就是为何类的方法不能对类名进行重写、而类外部的代码则被允许对类名进行重写的原因。

再结合下面例子，分析类名是否可以重写的原因：

- 类构造器内部的 `Foo` 与在类外部的 `Foo` 是不同的绑定
  - 内部的 `Foo` 就像是用 `const` 定义的，不能被重写
  - 外部的 `Foo` 就像是用 `let` 声明的，可以随时重写类名

```js
class Foo {
    constructor() {
        Foo = "bar"; // 执行时抛出错误
    }
}
// 但在类声明之后没问题
Foo = "baz";
```

## 其他特点

- 作为一级公民的类
- 访问器属性（ `getter` 和 `setter` ）
- 生成器方法 `*[Symbol.iterator]()`
- 静态成员（`static`）

### 作为一级公民的类

在编程中，能被**当作值来使用**的就称为一级公民（ first-class citizen ）

这意味着意味着它能**作为参数**传给函数、能**作为函数返回值**、能用来**给变量赋值**。

**JS的函数就是一级公民**（它们有时又被称为一级函数），此特性让 JS 独一无二。

### 访问器属性

`getter` 和 `setter` => `get` 和 `set`

```js
class CustomHTMLElement {
    constructor(element) {
        this.element = element;
    }
    get html() {
        return this.element.innerHTML;
    }
    set html(value) {
        this.element.innerHTML = value;
    }
}
```

### 生成器方法

`Symbol.iterator`

```js
class Collection {
    constructor() {
        this.items = [];
    }
    *[Symbol.iterator]() {
        yield *this.items.values();
    }
}
```

### 静态成员

在 ES5 及更早版本中是通过**直接在构造器上添加额外方法**来模拟静态成员

```js
function PersonType(name) {
  this.name = name
}
// 静态方法
PersonType.create = function (name) {
  return new PersonType(name)
}
// 实例方法
PersonType.prototype.sayName = function () {
  console.log(this.name)
}
var person = PersonType.create('Nicholas')
```

ES6 的类简化了静态成员的创建，**只要在方法与访问器属性的名称前添加正式的 static 标注**

```js
class PersonClass {
  // 等价于 PersonType 构造器
  constructor(name) {
    this.name = name
  }
  // 等价于 PersonType.prototype.sayName
  sayName() {
    console.log(this.name)
  }
  // 等价于 PersonType.create
  static create(name) {
    return new PersonClass(name)
  }
}

let person = PersonClass.create("Nicholas");

console.log(typeof new PersonClass().create) // undefined
console.log(typeof PersonClass.create) // function
```

> 静态成员不能用实例来访问，你始终需要直接用类自身来访问它们

## 使用派生类进行继承

ES6 `class`类使用 `extends` 关键字实现继承

好处是用法更简单、更容易理解，避免出错。

推荐结合 [对象的拓展-原型](./对象拓展.md#原型)一起食用

对比下两种继承方式：

ES5 的继承（ES6 之前），实现自定义类型的继承是个繁琐的过程。严格的继承要求有多个步骤，如下：

```js
function Rectangle(length, width) {
  this.length = length
  this.width = width
}
Rectangle.prototype.getArea = function () {
  return this.length * this.width
}
function Square(length) {
  // call() 方法改变this的指向
  // 把 length、width属性绑定到当前实例上
  Rectangle.call(this, length, length) 
}

// 须使用 Rectangle.prototype 所创建的一个新对象来重写 Square.prototype
Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    value: Square,
    enumerable: true,
    writable: true,
    configurable: true,
  },
})

var rectangle = new Rectangle(4, 3)
var square = new Square(3)

console.log(square.length, square.getArea()) // 3 9
console.log(rectangle.length, rectangle.getArea()) // 4 9

console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

这种写法繁琐、易错，让人难以理解，而ES6的写法则优雅很多：

```js
class Rectangle {
  constructor(length, width) {
    this.length = length
    this.width = width
  }
  getArea() {
    return this.length * this.width
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 与 Rectangle.call(this, length, length) 相同
    super(length, length)
  }
}

var rectangle = new Rectangle(4, 3)
var square = new Square(3)

console.log(square.length, square.getArea()) // 3 9
console.log(rectangle.length, rectangle.getArea()) // 4 9

console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

注意：`super()`是调用**父类**的构造函数，但属性是绑定到**当前实例**上的

**什么是派生类**：

`继承了其他类的类`被称为派生类（ derived classes ）

- 如果派生类指定了构造器，就需要使用 `super()` ，否则会造成错误
- 若你选择不使用构造器， `super()` 方法会被**自动调用**，并会使用创建新实例时提供的**所有参数**

```js
class Square extends Rectangle {
  // 没有构造器
}
// 等价于：
class Square extends Rectangle {
  constructor(...args) {
    super(...args)
  }
}
```

使用 `super()` 时需牢记以下几点：

- 你只能在派生类中使用 `super()` 。若尝试在非派生的类（即：没有使用 `extends`关键字的类）或函数中使用它，就会抛出错误
- 在构造器中，你必须在访问 `this` 之前调用 `super()` 。由于 `super()` 负责初始化`this` ，因此试图先访问 `this` 自然就会造成错误
- 唯一能避免调用 `super()` 的办法，是从类构造器中返回一个对象

### 屏蔽类方法

派生类中的方法总是会**屏蔽**基类的**同名方法**，如下：

```js
class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
  // 重写并屏蔽 Rectangle.prototype.getArea()
  getArea() {
    return this.length * this.length
  }
}
```

不过，你总是可以使用 `super.getArea()` 方法来调用基类中的同名方法，它相当于 `Rectangle.prototype.getArea()`

```js
class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
  // 重写、屏蔽并调用了 Rectangle.prototype.getArea()
  getArea() {
    return super.getArea()
  }
}
```

`super`的相关介绍可以参考 [对象的拓展-super](./对象拓展.md#super)

### 继承静态成员

如果基类包含静态成员，那么这些静态成员在派生类中也是可用的

不过使用方式是类似的，即 **静态成员不能用实例来访问，你始终需要直接用类自身来访问它们**

```js
class Rectangle {
  constructor(length) {
    this.length = length
  }
  getLength() {
    return this.length
  }
  static create(length) {
    return new Rectangle(length)
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 与 Rectangle.call(this, length, length) 相同
    super(length)
  }
}

var length = Square.create(3)
console.log(length.getLength()) // 3
console.log(length instanceof Rectangle) // true
console.log(length instanceof Square) // false
```

### 从表达式中派生类

在 ES6 中派生类的最强大能力，或许就是能够从表达式中派生类。

只要一个表达式能够返回一个具有 `[[Construct]]` 属性以及`原型`的函数，你就可以对其使用 `extends` 。

简单分析下：

```js
function Rectangle(length, width) {
  this.length = length
  this.width = width
}
Rectangle.prototype.getArea = function () {
  return this.length * this.width
}

// 相当于 ↓ ↓ ↓

class Rectangle {
    constructor(length, width) {
        this.length = length
        this.width = width
    }
    getArea() {
        return this.length * this.width
    }
}
```

测试代码：

```js
function Rectangle(length, width) {
  this.length = length
  this.width = width
}
Rectangle.prototype.getArea = function () {
  return this.length * this.width
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
}
var x = new Square(3)
console.log(x.getArea()) // 9
console.log(x instanceof Rectangle) // true
```

再进一步拓展 一下，这里的 `Rectangle`完全可以换成一个**动态可执行函数**，可以动态地决定基类，进而实现更丰富的功能拓展

```js
function getBase() {
    return Rectangle;
}

class Square extends getBase() {
  constructor(length) {
    super(length, length)
  }
}
```

看一个混入（ mixin ）的例子：

```js
let SerializableMixin = {
  serialize() {
    return JSON.stringify(this)
  },
}
let AreaMixin = {
  getArea() {
    return this.length * this.width
  },
}
function mixin(...mixins) {
  var base = function () {}
  Object.assign(base.prototype, ...mixins)
  return base
}
class Square extends mixin(AreaMixin, SerializableMixin) {
  constructor(length) {
    super()
    this.length = length
    this.width = length
  }
}
var x = new Square(3)
console.log(x.getArea()) // 9
console.log(x.serialize()) // "{"length":3,"width":3}"
```

此例使用了混入（ mixin ）而不是传统继承。`mixin()` 函数接受代表混入对象的任意数量的参数，它创建了一个名为 `base` 的函数，并将每个混入对象的属性都赋值到**新函数的原型上**。

任意表达式都能在 `extends` 关键字后使用，但并非所有表达式的结果都是一个有效的类。特别的，下列表达式类型会导致错误：

- null
- 生成器函数

因为不存在 `[[Construct]]` 可供调用

### 继承内置对象

ES6 中的类允许从**内置对象**上进行继承。

**ES5的继承写法**：

```js
// 内置数组的行为
var colors = []
colors[0] = 'red'
console.log(colors.length) // 1

colors.length = 0
console.log(colors[0]) // undefined

// 在 ES5 中尝试继承数组
function MyArray() {
  Array.apply(this, arguments)
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true,
  },
})

var colors = new MyArray()
colors[0] = 'red'
console.log(colors.length) // 0

colors.length = 0
console.log(colors[0]) // "red"
```

可以看到代码尾部的输出不符合预期，因为 `length`等属性并未被涵盖在 `Array.apply()` 或数组原型中。

**ES6 的继承写法**：

```js
class MyArray extends Array {
  // 空代码块
}
var colors = new MyArray()
colors[0] = 'red'
console.log(colors.length) // 1

colors.length = 0
console.log(colors[0]) // undefined
```

可以看到是符合预期的。

`MyArray` 直接继承了 `Array` ，因此工作方式与正规数组一致

**ES6对比ES5的继承分析**：

- 在 ES5 的传统继承中， `this` 的值会先被派生类（例如 `MyArray` ）创建，随后基类构造器（例如 `Array.apply()` 方法）才被调用。这意味着 `this` 一开始就是 `MyArray` 的实例，之后才使用了 `Array` 的附加属性对其进行了装饰。

- 在 ES6 基于类的继承中， `this` 的值会先被基类（ `Array` ）创建，随后才被派生类的构造器（ `MyArray` ）所修改。结果是 `this` 初始就拥有作为基类的内置对象的所有功能，并能正确接收与之关联的所有功能。

### Symbol.species 属性

继承内置对象一个有趣的方面是：任意能返回内置对象实例的方法，在派生类上却会自动返回派生类的实例。

如何理解这句话，看代码：

```js
class MyArray extends Array {
  // 空代码块
}
let items = new MyArray(1, 2, 3, 4),
  subitems = items.slice(1, 3) // 注意这里的 slice方法
  
console.log(items instanceof MyArray) // true
console.log(subitems instanceof MyArray) // true
```

在此代码中， `slice()` 方法返回了 MyArray 的一个实例。 `slice()` 方法是从 `Array` 上继承的，原本应当返回 `Array` 的一个实例。而 `Symbol.species` 属性在后台造成了这种变化。

`Symbol.species` 符号被用于定义一个能返回函数的**静态访问器属性**。即 每当类实例的方法（构造器除外）必须创建一个实例时，前面返回的函数就被用为新实例的构造器。

下列内置类型都定义了 `Symbol.species`：

- Array
- ArrayBuffer
- Map
- Promise
- RegExp
- Set
- 类型化数组

以上每个类型都拥有默认的 `Symbol.species` 属性，其返回值为 `this` ，意味着该属性总是会返回自身的构造器函数

若你准备在一个自定义类上实现此功能，代码就像这样：

```js
// 几个内置类型使用 species 的方式类似于此
class MyClass {
  static get [Symbol.species]() {
    return this
  }
  constructor(value) {
    this.value = value
  }
  clone() {
    return new this.constructor[Symbol.species](this.value)
  }
}
```

任何对 `this.constructor[Symbol.species]` 的调用都会返回 `MyClass` ， `clone()` 方法使用了该定义来返回一个新的实例，而没有直接使用 `MyClass` ，这就允许派生类重写这个值

注意此处只有 `getter` 而没有 `setter` ，这是因为修改类的 `species` 是不允许的

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array
  }
}

let items = new MyArray(1, 2, 3, 4),
  subitems = items.slice(1, 3) // slice方法 => 符合要求

console.log(items instanceof MyArray) // true
console.log(subitems instanceof Array) // true
console.log(subitems instanceof MyArray) // false
```

此代码重写了从 `Array` 派生的 `MyArray` 类上的 `Symbol.species` 。所有返回数组的继承方法现在都会使用 `Array` 的实例，而不是 `MyArray` 的实例。

## 在类构造器中使用 new.target

在简单情况下，`new.target` 就等于本类的构造器函数

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
    this.length = length
    this.width = width
  }
}
// new.target 就是 Rectangle
var obj = new Rectangle(3, 4) // 输出 true
```

类构造器被调用时不能缺少 `new` ，因此 `new.target` 属性就始终会在类构造器内被定义，不过这个值并不总是相同的：

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
    this.length = length
    this.width = width
  }
}
class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
}
// new.target 就是 Square
var obj = new Square(3) // 输出 false
```

`Square` 调用了 `Rectangle` 构造器，因此当 `Rectangle` 构造器被调用时， `new.target` 等于`Square` 。

> 由于调用类时不能缺少 `new` ，于是 `new.target` 属性在类构造器内部就绝不会是 `undefined`

## 总结

- ES6 的类提供了更简洁的语法与更好的功能，通过安全一致的方式来自定义一个对象类型
- ES6 的类起初是作为 ES5 传统继承模型的语法糖，但添加了许多特性来减少错误。
- 类的所有方法初始都是不可枚举的
- ES6 的类配合原型继承来工作，在类的原型上定义了非静态的方法，而静态的方法最终则被绑定在类构造器自身上
- 类构造器被调用时不能缺少 `new`，确保了不能意外地将类作为函数来调用
- 基于类的继承允许你从另一个类、函数或表达式上派生新的类
- 可以实现对内置对象的继承（例如数组）

## 资料

- 《深入理解ES6》
