function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left)
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto)
  }
}

function Person() {}
var boy = new Person()
console.log(boy instanceof Person) // true，因为 Object.getPrototypeOf(o) === C.prototype
console.log(boy instanceof Object) // true，因为 Object.prototype.isPrototypeOf(o) 返回 true

console.log(myInstanceof(boy, Person))
console.log(myInstanceof(boy, Object))
