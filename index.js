function debounce(fn, time) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, time)
  }
}

function throttle(fn, time) {
  let timer = null
  return function () {
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this.arguments)
      timer = null
    }, time)
  }
}
