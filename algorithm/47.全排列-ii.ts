/*
 * @lc app=leetcode.cn id=47 lang=typescript
 *
 * [47] 全排列 II
 */
// nums 数组存在重复元素
// 剪枝处理，需要增加一个去重的条件
// 也就说说在单独的一轮遍历过程中，会存在重复选择的可能

// selected 是表示整个流程排除重复
// set 是表示这一轮中，排除重复的选择

// @lc code=start
function permuteUnique(nums: number[]): number[][] {
  function backtrack(
    state: number[], // 表示问题的当前状态
    choices: number[],// 表示当前状态下可做出的选择
    selected: boolean[],
    res: number[][]
  ) {

    if (state.length === choices.length) {
      res.push([...state])
    }

    // 遍历所有选择
    const set = new Set()
    choices.forEach((cho, i) => {
      // 剪枝，重复元素不在选择
      if (!selected[i] && !set.has(cho)) {
        // 做出选择，更新状态
        selected[i] = true
        set.add(cho)
        state.push(cho)

        // 下一轮
        backtrack(state, choices, selected, res)
        // 撤销
        selected[i] = false
        state.pop()
      }
    })
  }

  let result = []
  backtrack([], nums, Array(nums.length).fill(false), result)
  return result

};
// @lc code=end

