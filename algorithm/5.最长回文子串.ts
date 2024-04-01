/*
 * @lc app=leetcode.cn id=5 lang=typescript
 *
 * [5] 最长回文子串
 */

// @lc code=start
function longestPalindrome(s: string): string {
  // 方法一：暴力查找

  if (s.length < 2) return s
  // 是否为回文子串
  function isPalindromic(val: string): boolean {
    for (let i = 0; i < val.length / 2; i++) {
      if (val[i] !== val[val.length - 1 - i]) {
        return false
      }
    }
    return true
  }

  let str = ''
  let max = 0 // 取最大的
  for (let i = 0; i < s.length; i++) {
    // 1. 原版
    // for (let j = i + 1; j <= s.length; j++) {
    // 2. 优化版本
    // 因为比 i+max 小的肯定不是最大的回文，就不用检查了
    for (let j = i + max; j <= s.length; j++) {
      let curStr = s.substring(i, j)
      if (isPalindromic(curStr) && curStr.length > max) {
        str = curStr
        max = curStr.length
      }
    }
  }

  return str


  // 方法二：动态规划
  // s[i, j]

  // 一个字符时默认就是
  // if (s.length < 2) return s

  // let maxLen = 1
  // let begin = 0

  // // dp[i][j] 表示 s[i..j] 是否是回文串
  // const dp: boolean[][] = []
  // // 初始化：所有长度为 1 的子串都是回文串
  // for (let i = 0; i < s.length; i++) {
  //   dp[i] = []
  //   dp[i][i] = true
  // }


  // for (let L = 2; L <= s.length; L++) {
  //   // 左边界
  //   for (let i = 0; i < s.length; i++) {
  //     // 由 L 和 i 可以确定右边界，即 j - i + 1 = L 得
  //     // 右边界
  //     let j = i + L - 1

  //     // 越界，则退出循环
  //     if (j > s.length) {
  //       break
  //     }

  //     // 判断
  //     if (s[i] !== s[j]) {
  //       dp[i][j] = false
  //     } else {
  //       // 相等

  //       if (j - i < 3) {
  //         dp[i][j] = true
  //       } else {
  //         // i+1 与 j-1 如果是回文字符串，那么 i 和 j 一定是
  //         dp[i][j] = dp[i + 1][j - 1]
  //       }
  //     }

  //     if (dp[i][j] && j - i + 1 > maxLen) {
  //       maxLen = Math.max(j - i + 1, maxLen)
  //       begin = i
  //     }
  //   }
  // }

  // return s.slice(begin, begin + maxLen)
}
// @lc code=end
