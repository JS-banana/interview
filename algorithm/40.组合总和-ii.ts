/*
 * @lc app=leetcode.cn id=40 lang=typescript
 *
 * [40] 组合总和 II
 */

// @lc code=start
function combinationSum2(candidates: number[], target: number): number[][] {
  function backtrack(
    state: number[], // 表示问题的当前状态
    choices: number[],// 表示当前状态下可做出的选择
    target: number,
    res: number[][],
    start: number // 
  ) {
    if (target === 0) {
      res.push([...state])
      return
    }

    for (let i = start; i < choices.length; i++) {
      // 剪枝，若子集和超过 target，直接结束循环
      // 因为数组已排序，后面的数只会更大
      if (target - choices[i] < 0) {
        break
      }

      // 和39题的区别就是多了一个判断条件，剪枝
      // 因为是已经排序了的，所以，如果存在重复元素，那么应该就是紧挨着的
      // 因为 i-1 的存在，i 需要至少大于 0，增加一个条件 i > start
      if (i > start && choices[i] === choices[i - 1]) {
        // 之间跳过
        continue
      }

      state.push(choices[i])

      // 本题规定每个数组元素只能被选择一次
      // 这里的 start 传参是 i+1，和39题有所区别
      // 本题规定每个数组元素只能被选择一次
      backtrack(state, choices, target - choices[i], res, i + 1)

      state.pop()
    }

  }


  let result = []
  candidates.sort((a, b) => a - b) // 进行排序
  backtrack([], candidates, target, result, 0)
  return result

};
// @lc code=end

