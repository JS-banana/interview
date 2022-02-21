/*
 * @lc app=leetcode.cn id=167 lang=typescript
 *
 * [167] 两数之和 II - 输入有序数组
 */

// @lc code=start
function twoSum(numbers: number[], target: number): number[] {
  // 二分查找
  // 有序数组考虑双指针二分查找
  let left = 0
  let right = numbers.length - 1

  while (left < right) {
    let sum = numbers[left] + numbers[right]
    if (sum === target) {
      // 题目要求索引是从1开始的
      return [left + 1, right + 1]
    } else if (sum < target) {
      left++
    } else if (sum > target) {
      right--
    }
  }

  return [-1, -1]
}
// @lc code=end
