/*
 * @lc app=leetcode.cn id=22 lang=typescript
 *
 * [22] 括号生成
 */

// @lc code=start
function generateParenthesis(n: number): string[] {
  // 回溯算法
  function backtrack(
    // 已保存的 括号 状态；
    // 这里需要使用 引用类型，确保后面的回退操作会对数据产生更改
    state: string[],
    left: number, // 左括号
    right: number, // 右括号
    n: number, // 生成的括号对数
    res: string[] // 保存有效的括号
  ) {
    if (state.length === n * 2) {
      res.push(state.join(''))
      return
    }

    // 如果左括号数量不大于 n，可以放一个左括号
    if (left < n) {
      state.push('(')
      backtrack(state, left + 1, right, n, res)
      // 回退
      state.pop()
    }

    // 如果右括号数量小于左括号的数量，可以放一个右括号。
    if (right < left) {
      state.push(')')
      backtrack(state, left, right + 1, n, res)
      // 回退
      state.pop()
    }
  }

  let strArr: string[] = []
  backtrack([], 0, 0, n, strArr)

  return strArr

};
// @lc code=end

