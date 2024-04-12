/*
 * @lc app=leetcode.cn id=46 lang=typescript
 *
 * [46] 全排列
 */

// 使用回溯算法
// 本质也是递归遍历，
// 关键词：尝试、回退、剪枝

// @lc code=start
function permute(nums: number[]): number[][] {
  function backtrack(
    state: number[], // 表示问题的当前状态
    choices: number[],// 表示当前状态下可做出的选择
    selected: boolean[],
    res: number[][]
  ) {
    // 解：当状态长度等于元素数量时
    if (state.length === choices.length) {
      res.push([...state]) // state 需要进行拷贝操作
      return
    }

    // 遍历所有选择
    choices.forEach((cho, i) => {
      // 剪枝：不允许重复选择元素
      if (!selected[i]) {
        // 尝试：做出选择，更新状态
        selected[i] = true
        state.push(cho)
        // 进行下一轮选择
        backtrack(state, choices, selected, res)
        // 回退：撤销选择，恢复之前的状态
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

