/*
 * @lc app=leetcode.cn id=746 lang=typescript
 *
 * [746] 使用最小花费爬楼梯
 */

// @lc code=start
function minCostClimbingStairs(cost: number[]): number {
  let n = cost.length

  const dp = []
  // 可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯
  dp[0] = 0
  dp[1] = Math.min(cost[0], cost[1])

  for (let i = 2; i <= n; i++) {
    // dp[i] = dp[i - 1] + dp[i - 2]
    dp[i] = Math.min(dp[i - 1] + cost[i], dp[i - 2] + cost[i - 1])
  }


  return dp[n - 1]
};
// @lc code=end

