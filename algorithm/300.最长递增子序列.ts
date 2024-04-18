/*
 * @lc app=leetcode.cn id=300 lang=typescript
 *
 * [300] 最长递增子序列
 */

// @lc code=start
function lengthOfLIS(nums: number[]): number {
  // 动态规划

  // dp[i] 的值代表以 nums[i]结尾的最长子序列长度
  // 初始状态， dp[i] 所有元素为 1
  let dp = new Array<number>(nums.length).fill(1)

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      // nums[i] 大于 nums[j]，按照递增的逻辑，说明 nums[i] 可以放入 nums[j] 的后面
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    //
  }

  return Math.max(...dp)
};
// @lc code=end

