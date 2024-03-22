/*
 * @lc app=leetcode.cn id=165 lang=typescript
 *
 * [165] 比较版本号
 */

// @lc code=start
function compareVersion(version1: string, version2: string): number {
  // 先转换为数组
  const num1 = version1.split('.')
  const num2 = version2.split('.')
  // 取长的数组作为最大值 进行遍历
  const max = Math.max(num1.length, num2.length)

  for (let i = 0; i < max; i++) {
    const n1 = num1[i] ? parseInt(num1[i]) : 0
    const n2 = num2[i] ? parseInt(num2[i]) : 0

    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
};
// @lc code=end

