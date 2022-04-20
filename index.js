function maxDepth(str) {
  let len = str.length
  let map = 0
  let res = 0
  let dep = 1

  for (let i = 0; i < len; i++) {
    if (['(', '{', '['].includes(str[i])) {
      map++
    } else if ([')', '}', ']'].includes(str[i])) {
      map--
      dep++
    }
    res = Math.max(res, dep)
  }
  if (map !== 0) {
    return 0
  }
  return res
}

console.log(maxDepth('([]{()})'))
