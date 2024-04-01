/*
 * @lc app=leetcode.cn id=704 lang=typescript
 *
 * [704] 二分查找
 */

// @lc code=start
function search(nums: number[], target: number): number {
  // 双闭区间

  // 初始化双闭区间 [0, n-1] ，即 i, j 分别指向数组首元素、尾元素
  let i = 0
  let j = nums.length - 1

  // 循环，当搜索区间为空时跳出（当 i > j 时为空）
  while (i <= j) {
    let mid = Math.floor((i + j) / 2)
    if (nums[mid] > target) {
      // 说明 target 在 [i, mid - 1]
      j = mid - 1
    } else if (nums[mid] < target) {
      // 说明 target 在 [mid + 1, j]
      i = mid + 1
    } else {
      // 说明 target 等于 nums[mid]
      return mid
    }
  }

  return -1
};
// @lc code=end

