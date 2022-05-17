/*
 * @lc app=leetcode.cn id=5 lang=typescript
 *
 * [5] 最长回文子串
 */

// @lc code=start
function longestPalindrome(s: string): string {
  // 滑动窗口
  let str = ''

  for (let end = 0; end < s.length; end++) {
    // 存在，判断添加下一位后是否为 回文字符串
    if (isPalindrome(s + s[end])) {
      // 是：就添加
      str += s[end]
    } else if (str.length > 1 && isPalindrome(str.slice(1) + s[end])) {
      // 不是：删去第一位，添加最后一位，再次判断
      str = str.slice(1) + s[end]
    } else {
      str += s[end]
    }
  }

  // 是否为 回文字符串
  function isPalindrome(sss: string) {
    let i = 0

    while (i < sss.length / 2) {
      if (sss[i] !== sss[sss.length - 1 - i]) {
        return false
      }
      i++
      return true
    }
  }

  return str
}
// @lc code=end
