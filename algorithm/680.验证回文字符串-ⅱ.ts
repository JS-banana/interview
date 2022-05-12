/*
 * @lc app=leetcode.cn id=680 lang=typescript
 *
 * [680] 验证回文字符串 Ⅱ
 */

// 给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。

// 输入: s = "abca"
// 输出: true
// 解释: 你可以删除c字符。

// 输入: s = "abc"
// 输出: false

// @lc code=start
function validPalindrome(s: string): boolean {
  // 题目已说明最多删除一个字符
  // 暴力思路：逐个删除，判断是否回文
  // 优化思路：先按照对称比较判断，如果不对称，则删除一个字符，再判断

  let left = 0
  let right = s.length - 1

  // 完成剩余内部的判断
  const isPalindrome = (i, j) => {
    while (i < j) {
      if (s[i] !== s[j]) {
        return false
      }
      i++
      j--
    }
    return true
  }

  while (left < right) {
    if (s[left] != s[right]) {
      if (isPalindrome(left, right - 1)) {
        return true
      } else if (isPalindrome(left + 1, right)) {
        return true
      } else {
        return false
      }
    }
    left++
    right--
  }

  return true
}
// @lc code=end
