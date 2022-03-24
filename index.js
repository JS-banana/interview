function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      console.log('我被读了，我要不要做点什么好?')
      return val
    },
    set: (newVal) => {
      if (val === newVal) {
        return
      }
      val = newVal
      console.log('数据被改变了，我要渲染到页面上去!')
    },
  })
}

// let data = [1, 2]
// defineReactive(data, 0, 1)
// console.log(data[0])
// data[0] = 5
// console.log('data', data)

let obj = { a: 1 }
defineReactive(obj, 'a', 0)
// defineReactive(obj, 'b', 0)
delete obj.a
console.log(obj.a)
