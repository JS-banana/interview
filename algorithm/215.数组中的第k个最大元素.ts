/*
 * @lc app=leetcode.cn id=215 lang=typescript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
function findKthLargest(nums: number[], k: number): number {
  // 首先，分析题意
  // 1. 拍完序的数组
  // 2. 数组中的第K个最大元素

  // 1. 排序好理解，直接排序即可，根据结果看起来是升序
  // 2. 思考排序完的数组的 第1个最大元素是什么？
  // 1）是最后一个元素
  // 2）那么第k个最大元素，就应该是倒数第 k 个，也就是 nums.length - k

  // 快速排序
  // nums.sort((a, b) => a - b)
  // 1. 选择排序：时间复杂度较高
  // 选择未排序区间最小的元素和最前面交换
  // 最后一位不用排，最后就是最大的
  for (let i = 0; i < nums.length - 1; i++) {
    let m = i // 最小值索引

    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[m]) {
        m = j
      }
    }

    // 交换位置
    [nums[i], nums[m]] = [nums[m], nums[i]]
  }

  return nums[nums.length - k]
};
// @lc code=end

