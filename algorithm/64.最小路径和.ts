/*
 * @lc app=leetcode.cn id=64 lang=typescript
 *
 * [64] 最小路径和
 */

// @lc code=start
function minPathSum(grid: number[][]): number {
  // 动态规划的整体思路
  // 1. 暴力搜索 => 记忆化搜索 => 动态规划
  // 2. 通常遵循以下步骤：描述决策，定义状态，建立 表，推导状态转移方程，确定边界条件等

  // 1) 第一步：思考每轮的决策，定义状态，从而得到 表
  // 当前格子行列索引为 [i, j]，前进方向只有2个：右 [i+1, j] 或者 下 [i, j+1]
  // 状态 [i, j] 对应的子问题为：从起始点 [0, 0] 走到 [i, j] 的最小路径和，解记为  dp[i][j]

  // 2) 第二步：找出最优子结构，进而推导出状态转移方程
  // 对于状态 [i, j]，它只能从上边格子 [i-1, j] 和左边格子 [i, j-1] 转移而来
  // 因此最优子结构为：到达 [i, j] 的最小路径和由 [i-1, j] 的最小路径和与 [i, i-1] 的最小路径和中较小的那一个决定
  // 状态转移方程：dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]

  // 3) 第三步：确定边界条件和状态转移顺序
  // 处在首行的状态只能从其左边的状态得来，处在首列的状态只能从其上边的状态得来，因此首行 i=0 和首列 j=0 是边界条件
  // 由于每个格子是由其左方格子和上方格子转移而来，因此我们使用循环来遍历矩阵，外循环遍历各行，内循环遍历各列

  // 🙋‍♂️方法一：暴力解法
  // function dfs(grid: number[][], i: number, j: number): number {
  //   if (i === 0 && j === 0) {
  //     return grid[0][0]
  //   }

  //   // 小于0时，返回一个最大值，用于 min 条件
  //   if (i < 0 || j < 0) {
  //     return Infinity
  //   }

  //   let up = dfs(grid, i - 1, j)
  //   let left = dfs(grid, i, j - 1)

  //   return Math.min(up, left) + grid[i][j]
  // }
  // return dfs(grid, grid.length - 1, grid[0].length - 1)

  // 🙋‍♂️方法二：记忆化搜索，缓存重复数据
  // function dfs(grid: number[][], cache: number[][], i: number, j: number): number {
  //   if (i === 0 && j === 0) {
  //     return grid[0][0]
  //   }

  //   // 小于0时，返回一个最大值，用于 min 条件
  //   if (i < 0 || j < 0) {
  //     return Infinity
  //   }

  //   // 判断是否有缓存
  //   if (cache[i][j] !== -1) {
  //     return cache[i][j]
  //   }


  //   let up = dfs(grid, cache, i - 1, j)
  //   let left = dfs(grid, cache, i, j - 1)

  //   cache[i][j] = Math.min(up, left) + grid[i][j]

  //   return cache[i][j]
  // }

  // // 构建 cache 缓存对象数据结构
  // let cache = Array.from({ length: grid.length }, () => new Array(grid[0].length).fill(-1))

  // return dfs(grid, cache, grid.length - 1, grid[0].length - 1)


  // 🙋‍♂️方法三：动态规划
  let n = grid.length
  let m = grid[0].length

  const dp = Array.from({ length: n }, () => new Array(m).fill(0))

  dp[0][0] = grid[0][0]

  // 状态转移，首列
  for (let i = 1; i < n; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0]
  }

  // 状态转移，首行
  for (let j = 1; j < m; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j]
  }

  // 状态转移，其余行和列
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    }
  }

  return dp[n - 1][m - 1]

};
// @lc code=end

