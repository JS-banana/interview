/*
 * @lc app=leetcode.cn id=39 lang=typescript
 *
 * [39] 组合总和
 */

// 例如 candidates = [2, 3, 6, 7], target = 7
// 集合相同则为重复，并不考虑顺序，如 [2, 2, 3]、[2, 3, 2]、[2, 2, 3]
// 因为元素可以重复使用，每一轮执行都是全部的元素，如：第二轮还会用第一个元素

// @lc code=start
function combinationSum(candidates: number[], target: number): number[][] {
  function backtrack(
    state: number[], // 表示问题的当前状态
    choices: number[],// 表示当前状态下可做出的选择
    target: number,
    res: number[][],
    start: number // 
  ) {
    // 解，子集和等于 target
    if (target === 0) {
      res.push([...state])
      return
    }

    // 通过 start 控制每次的起始位置  
    for (let i = start; i < choices.length; i++) {
      // 剪枝，若子集和超过 target，直接结束循环
      // 因为数组已排序，后面的数只会更大
      if (target - choices[i] < 0) {
        break
      }

      // 尝试，做出选择
      state.push(choices[i])
      // 下一轮
      backtrack(state, choices, target - choices[i], res, i)
      // 回退
      state.pop()

    }

  }

  let result = []
  candidates.sort((a, b) => a - b) // 进行排序
  backtrack([], candidates, target, result, 0)
  return result

}
// @lc code=end

