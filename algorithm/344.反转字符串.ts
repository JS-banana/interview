/*
 * @lc app=leetcode.cn id=344 lang=typescript
 *
 * [344] 反转字符串
 */

// @lc code=start
/**
 Do not return anything, modify s in-place instead.
输入： [1,2,3,4,5,6,7]
输出： [7,6,5,4,3,2,1]
s[i] = s[n-i-1]
 */
function reverseString(s: string[]): void {
  // 双指针
  let left = 0
  let right = s.length - 1

  while (left < right) {
    // 交换位置
    let temp = s[left]
    s[left] = s[right]
    s[right] = temp

    left++
    right--
  }

  // for 写法
  // left>=right时结束
  for (let left = 0, right = s.length - 1; left < right; left++, right--) {
    ;[s[left], s[right]] = [s[right], s[left]]
  }
}
// @lc code=end
