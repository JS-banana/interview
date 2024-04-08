/*
 * @lc app=leetcode.cn id=463 lang=typescript
 *
 * [463] 岛屿的周长
 */

// 岛屿问题，同样先使用 通用类框架解决，DFS的思路，见 LeetCode 200
// 问题的关键是分析 dfs 函数的返回触发情况
// 1）坐标超出网格
// 2）当前格子不是岛屿

// 抽象的话，可以看图示，题解链接如下：
// https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/

// @lc code=start
function islandPerimeter(grid: number[][]): number {
  let res = 0
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1) {
        // 只有一个岛屿，求一次即可
        res = dfs(grid, r, c)
      }
    }
  }

  function dfs(gridArg: number[][], r: number, c: number) {
    // 「坐标 (r, c) 超出网格范围」：与网格相邻的周长
    if (!inArea(gridArg, r, c)) {
      return 1
    }

    // 「当前格子是海洋格子」：与海洋相邻的周长
    if (gridArg[r][c] === 0) {
      return 1
    }

    // 「当前格子是已遍历的陆地格子」，和周长没关系
    if (gridArg[r][c] !== 1) {
      return 0
    }

    gridArg[r][c] = 2

    return dfs(gridArg, r + 1, c)
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

