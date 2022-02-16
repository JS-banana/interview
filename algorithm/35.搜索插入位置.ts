/*
 * @lc app=leetcode.cn id=35 lang=typescript
 *
 * [35] 搜索插入位置
 */

// 优秀分析：https://leetcode-cn.com/problems/search-insert-position/solution/te-bie-hao-yong-de-er-fen-cha-fa-fa-mo-ban-python-/

// @lc code=start
function searchInsert(nums: number[], target: number): number {
  let left = 0
  // 结合题意分析，不考虑左闭右开
  // 注意这里是nums.length，不是nums.length - 1，因为结果就可能为nums.length
  let right = nums.length

  // 需要明确一点，当left === right时，跳出循环，这时候left和right的值是相等的
  while (left < right) {
    let mid = Math.floor((left + right) / 2)

    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      // 如果mid的值小于target，说明mid和mid左边的值一定不是
      left = mid + 1
    } else if (nums[mid] > target) {
      // 这里，值有可能为 mid，如果是添加在末尾
      // 右侧的值就不可能是了
      right = mid
    }
  }

  return left
}
// @lc code=end
