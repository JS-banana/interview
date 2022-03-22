Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let count = 0

    promises.forEach((promise, index) => {
      promise
        .then((val) => {
          resolve[index] = val
          count++

          if (count === promises.length) {
            resolve(result)
          }
        })
        .catch(reject)
    })
  })
}
