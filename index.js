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
