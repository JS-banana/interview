/*
 * @lc app=leetcode.cn id=53 lang=typescript
 *
 * [53] 最大子数组和
 */

// @lc code=start
function maxSubArray(nums: number[]): number {
  // 动态规划
  // 判断 i 和 i+1 前后元素想加的增益效果
  // 如果小于 i 元素的取值，那么就是负增益
  let dp = [nums[0]]
  let right = 1

  while (right < nums.length) {
    dp[right] = Math.max(dp[right - 1] + nums[right], nums[right])
    right++
  }

  // const total = arr.reduce((acc, cur) => acc + cur)
  return Math.max(...dp)
};
// @lc code=end

