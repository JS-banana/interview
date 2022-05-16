/*
 * @lc app=leetcode.cn id=70 lang=typescript
 *
 * [70] 爬楼梯
 */

// @lc code=start
function climbStairs(n: number): number {
  // 暴利解法 ==> 动态规划

  // 步：存储
  const steps = []

  // 当n=1时，step可知为1
  // 当n=2时，step可知为2
  if (n <= 2) {
    return n
  }

  // 当n=3时，用于作为想加项
  // 所以，预先设置值
  // 注意数组下标
  steps[1] = 1
  steps[2] = 2

  // 直接从3开始
  // 为了计算n，因此循环设置为 n+1
  for (let i = 3; i < n + 1; i++) {
    steps[i] = steps[i - 1] + steps[i - 2]
  }

  return steps[n]
}
// @lc code=end
