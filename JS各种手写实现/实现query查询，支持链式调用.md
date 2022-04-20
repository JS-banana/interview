# 实现query查询，支持链式调用

实现一个 query，支持链式调用，参数是一个数组

```js
query(arr)
.where((item) => item.age > 10)
.orderBy('age')
.groupBy('city')
.execute()
```

1. where方法，参数用法和 [].filter类似
2. orderBy(key,desc) 排序，desc为true时为倒序
3. groupBy(key) 分组，生成二维数组，效果如下

   ```js
    [
      [
        { name: 'xiao', city: 'hangzhou' },
        { name: 'zhang', city: 'hangzhou' },
      ],
      [
        { name: 'li', city: 'shanghai' }
      ]
    ]
   ```

4. execute 方法，只有当该方法执行的时候函数才开始执行

```js
class Query {
  constructor(arr) {
    this.data = arr
    this.action = []
  }

  where(callback, ctx) {
    function fn() {
      // 嵌套函数内部的 this上下文需要做处理
      // 保证指向的是 Query
      let arr = this.data
      let temp = []
      for (let i = 0; i < arr.length; i++) {
        let result = callback.call(ctx, arr[i], i, arr)
        if (result) temp.push(arr[i])
      }
      this.data = temp
    }
    // bind 改变 this 指向
    this.action.push(fn.bind(this))
    return this
  }

  orderBy(key, desc) {
    function fn() {
      let arr = this.data
      let temp = []
      temp = arr.sort((a, b) => (desc ? b[key] - a[key] : a[key] - b[key]))
      this.data = temp
    }
    this.action.push(fn.bind(this))
    return this
  }

  groupBy(key) {
    function fn() {
      let arr = this.data
      let temp = {}

      for (let i = 0; i < arr.length; i++) {
        const objKey = arr[i][key]
        if (temp[objKey]) {
          temp[objKey].push(arr[i])
        } else {
          temp[objKey] = [arr[i]]
        }
      }
      this.data = Object.values(temp)
    }
    this.action.push(fn.bind(this))
    return this
  }

  execute() {
    this.action.forEach((fn) => fn())
    return this.data
  }
}

// const myQuery = new Query()
function query(data) {
  // Query.call(this, data)
  return new Query(data)
}

const arr = [
  { name: 'xiao', age: 15, city: 'hangzhou' },
  { name: 'zhang', age: 18, city: 'hangzhou' },
  { name: 'hu', age: 20, city: 'beijing' },
  { name: 'li', age: 21, city: 'shanghai' },
]

const result = query(arr)
  .where((item) => item.age < 21)
  .orderBy('age')
  .groupBy('city')
  .execute()

console.log('result', result)
// 输出结果
// [
//   [
//       {
//           "name": "xiao",
//           "age": 15,
//           "city": "hangzhou"
//       },
//       {
//           "name": "zhang",
//           "age": 18,
//           "city": "hangzhou"
//       }
//   ],
//   [
//       {
//           "name": "hu",
//           "age": 20,
//           "city": "beijing"
//       }
//   ]
// ]
```
