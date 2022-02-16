/*
 * @lc app=leetcode.cn id=977 lang=typescript
 *
 * [977] 有序数组的平方
 */

// @lc code=start
function sortedSquares(nums: number[]): number[] {
  // 该数组默认是按升序排列的
  // 一共分为3种情况
  // 1. 全部为负数 [-4,-1, -2, -3]
  // 2. 全部为正数 [1, 2, 3]
  // 3. 一部分为负数，一部分为正数 [1, -2, 3]
  // 因此最大值位置只可能在左右两端

  let left = 0
  let right = nums.length - 1
  // 用于存放结果的数组
  let arr = []
  // 从最大值开始倒排序，即索引位置应该为
  let index = nums.length - 1

  while (left <= right) {
    // 如果左边的值大于右边的值，说明左边的值是最大值
    if (nums[left] * nums[left] > nums[right] * nums[right]) {
      arr[index] = nums[left] * nums[left]
      // 左边的值右移一位
      left++
      index--
    } else {
      arr[index] = nums[right] * nums[right]
      right--
      index--
    }
  }

  //   if(left==right)
  //  相等的情况一起归纳到 while(left<=right) 的 == 逻辑中

  return arr
}
// @lc code=end
