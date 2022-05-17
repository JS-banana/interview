/*
 * @lc app=leetcode.cn id=20 lang=typescript
 *
 * [20] 有效的括号
 */

// @lc code=start
function isValid(s: string): boolean {
  // 主要使用 栈 的数据结构来实现
  const stark = []
  const obj: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  }

  // 用于记录开合是否相等
  let left = 0
  let right = 0

  for (let i = 0; i < s.length; i++) {
    // 开始符号才入栈
    if (Object.values(obj).includes(s[i])) {
      // 入栈
      stark.push(s[i])
      left++
    }

    if (Object.keys(obj).includes(s[i])) {
      // 从最后一位匹配
      if (obj[s[i]] === stark[stark.length - 1]) {
        stark.pop()
      }
      right++
    }
  }

  if (left !== right) {
    return false
  }

  return !stark.length
}
// @lc code=end
