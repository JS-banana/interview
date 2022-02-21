/*
 * @lc app=leetcode.cn id=283 lang=typescript
 *
 * [283] 移动零
 */

// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
  // 双指针和快速排序思想
  let left = 0
  let right = 0
  // 双指针，left指向非0的数字，right指向0的数字
  // 如果left指向的数字不为0，则交换left和right指向的数字
  while (right < nums.length) {
    if (nums[right] != 0) {
      // 交换
      let temp = nums[left]
      nums[left] = nums[right]
      nums[right] = temp
      left++
    }
    right++
  }
}
// @lc code=end
