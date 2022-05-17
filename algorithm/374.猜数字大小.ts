/*
 * @lc app=leetcode.cn id=374 lang=typescript
 *
 * [374] 猜数字大小
 */

// @lc code=start
/**
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

function guessNumber(n: number): number {
  // 二分法
  let left = 0
  let right = n

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    // 符合相等条件，直接 return
    if (guess(mid) === 0) return mid

    // 一大一小
    if (guess(mid) === -1) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
}
// @lc code=end
