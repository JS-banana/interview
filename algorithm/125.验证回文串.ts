/*
 * @lc app=leetcode.cn id=125 lang=typescript
 *
 * [125] 验证回文串
 */

// 输入: "A man, a plan, a canal: Panama"
// 输出: true
// 解释："amanaplanacanalpanama" 是回文串

// 输入: "race a car"
// 输出: false
// 解释："raceacar" 不是回文串

// @lc code=start
function isPalindrome(s: string): boolean {
  // 去除非数字非字母，并转换为小写
  let str = s.replace(/[^a-zA-Z\d]/g, '').toLocaleLowerCase()

  // 主要思路就是对称比较值是否一致

  let i = 0
  let len = str.length

  while (i < len / 2) {
    if (str[i] !== str[len - 1 - i]) {
      return false
    }
    i++
  }

  return true
}
// @lc code=end
