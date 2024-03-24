/*
 * @lc app=leetcode.cn id=121 lang=typescript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
function maxProfit(prices: number[]): number {
  // 动态规划解法
  // 求收益最大化，也就是求最大差值

  // 1. 暴力解法
  // let max = 0
  // for (let i = 0; i < prices.length - 1; i++) {
  //   for (let j = i + 1; j < prices.length; j++) {
  //     max = Math.max(prices[j] - prices[i], max)
  //   }
  // }
  // return max

  // 2. 贪心算法
  // let maxProfit = 0
  // let minPrice = prices[0]
  // for (let i = 0; i < prices.length; i++) {
  //   minPrice = Math.min(prices[i], minPrice)
  //   maxProfit = Math.max(prices[i] - minPrice, maxProfit)
  // }

  // return maxProfit

  // 3. 动态规划，快慢双指针
  let slow = 0
  let fast = 1
  let maxProfit = 0

  while (slow < fast && fast < prices.length) {
    // 慢指针小于快指针，才有利润
    if (prices[slow] < prices[fast]) {
      maxProfit = Math.max(prices[fast] - prices[slow], maxProfit)
    } else {
      slow = fast
    }
    fast++
  }

  return maxProfit
};
// @lc code=end

