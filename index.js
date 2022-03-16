const arr = [1, [[2], 3, 4], 5]

const flatten = (arr) => {
  return arr.reduce((flat, toFlat) => {
    return flat.concat(Array.isArray(toFlat) ? flatten(toFlat) : toFlat)
  }, [])
}

const res = flatten(arr)

console.log(res)
