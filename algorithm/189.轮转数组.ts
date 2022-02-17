/*
 * @lc app=leetcode.cn id=189 lang=typescript
 *
 * [189] 轮转数组
 */

// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 输入: nums = [1,2,3,4,5,6,7], k = 3
 输出: [5,6,7,1,2,3,4]
 */
function rotate(nums: number[], k: number): void {
  // 题目要求的是改变原数组，因此不能使用额外的数组
  // 方法一：直接以新的一个数组来存储，逐一循环
  //   let n = nums.length
  //   let arr = [...nums]
  //   // i<n
  //   for (let i = 0; i < n; i++) {
  //     // 取余数，考虑大于数组长度的情况
  //     arr[(i + k) % n] = nums[i]
  //   }
  //   // 再修改原数组
  //   for (let i = 0; i < n; i++) {
  //     nums[i] = arr[i]
  //   }
  // 方法二
}
// @lc code=end
