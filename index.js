const middleware = []

const fn1 = async (ctx, next) => {
  console.log('fn1-next前')
  await next()
  console.log('fn1-next后')
}
const fn2 = async (ctx, next) => {
  console.log('fn2-next前')
  await next()
  console.log('fn2-next后')
}
const fn3 = async (ctx, next) => {
  console.log('fn3-next前')
  await next()
  console.log('fn3-next后')
}
const fn4 = async (ctx, next) => {
  console.log('fn4')
}

function use(fn) {
  middleware.push(fn)
}

use(fn1)
use(fn2)
use(fn3)
use(fn4)

function run(ctx) {
  function dispatch(i) {
    let current = middleware[i]
    if (!current) return
    return current(ctx, dispatch.bind(null, i + 1))
  }
  return dispatch(0)
}

run({})
