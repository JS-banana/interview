/*
 * @lc app=leetcode.cn id=88 lang=typescript
 *
 * [88] 合并两个有序数组
 */

// @lc code=start
/**
 Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // 双指针解法，从后向前比较
  let mIndex = m - 1
  let nIndex = n - 1
  let index = m + n - 1

  while (mIndex >= 0 && nIndex >= 0) {
    // 谁大就把谁放后面，然后对应的指针向前移动
    if (nums1[mIndex] > nums2[nIndex]) {
      nums1[index] = nums1[mIndex]
      mIndex--
    } else {
      nums1[index] = nums2[nIndex]
      nIndex--
    }
    index--
  };

  // 如果有剩余，两种情况
  // mIndex 大于0的话，不用处理，属于已经在
  // nIndex 大于0的话，因为是有序的数据，且考虑 nIndex 仍大于0，意味着剩余的都是小于nums1[index]的，直接放到前面就行
  while (nIndex >= 0) {
    nums1[index] = nums2[nIndex]
    nIndex--
    index--
  }
}
// @lc code=end

