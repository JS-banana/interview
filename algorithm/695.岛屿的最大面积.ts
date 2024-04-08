/*
 * @lc app=leetcode.cn id=695 lang=typescript
 *
 * [695] 岛屿的最大面积
 */

// 岛屿类问题，和 LeetCode 200 岛屿数量逻辑类似，使用 DFS 的二叉树解法思路
// 1. 左右子树，变成上下左右节点
// 2. base case 变为网格边缘

// @lc code=start
function maxAreaOfIsland(grid: number[][]): number {
  let res = 0
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1) {
        const area = dfs(grid, r, c)
        res = Math.max(res, area)
      }
    }
  }

  function dfs(gridArg: number[][], r: number, c: number): number {
    // base case
    if (!inArea(gridArg, r, c)) {
      return 0
    }

    // 排除重复
    if (gridArg[r][c] !== 1) {
      return 0
    }
    // 遍历之后的，做标记
    gridArg[r][c] = 2

    // 遍历上下左右
    // 求面积 => 相加
    return 1 + dfs(gridArg, r + 1, c)
      + dfs(gridArg, r - 1, c)
      + dfs(gridArg, r, c - 1)
      + dfs(gridArg, r, c + 1)
  }

  function inArea(gridArg: number[][], r: number, c: number) {
    return (0 <= r && r < gridArg.length) && (0 <= c && c < gridArg[0].length)
  }

  return res
};
// @lc code=end

