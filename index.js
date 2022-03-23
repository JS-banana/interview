Function.prototype.myCall = function (context) {
  context = context || window
  context.fn = this
  var args = [...arguments].slice(1)

  const result = context.fn(...args)
  delete context.fn
  return result
}
