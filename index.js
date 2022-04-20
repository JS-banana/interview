function currying(fn) {
  const initArgs = [].slice.call(arguments, 1)
  let args = initArgs
  console.log('args', args)
  return function temp(...newargs) {
    if (newargs.length) {
      args = [...args, ...newargs]
      return temp
    } else {
      let val = fn.apply(this, args)
      args = initArgs
      return val
    }
  }
}

// 验证

function add(...args) {
  //求和
  return args.reduce((a, b) => a + b)
}
let addCurry = currying(add, 2)
console.log(addCurry(1)(2)(3)(4, 5)()) //17
console.log(addCurry(1)(2)(3, 4, 5)()) //17
console.log(addCurry(1)(2, 3, 4, 5)()) //17
