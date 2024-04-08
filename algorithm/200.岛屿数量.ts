/*
 * @lc app=leetcode.cn id=200 lang=typescript
 *
 * [200] 岛屿数量
 */

// https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/
// 很棒的题解分析

// 岛屿类问题的通用解法，DFS遍历框架
// 网格结构可以理解为一种复杂的二叉树结构

// 🙋‍♂️二叉树的DFS如下：
// function traverse(root) {
//   // 判断 base case
//   if (root == null) {
//     return;
//   }
//   // 访问两个相邻结点：左子结点、右子结点
//   traverse(root.left);
//   traverse(root.right);
// }

// 分析：二叉树的 DFS 有两个要素 => 「访问相邻结点」和「判断 base case」。
// 1) 二叉树结构比较简单，分为左右子树，DFS递归调用左右即可
// 2）当 root == null 时，一方面是表示 root 指向的子树为空，不需要再继续遍历；另一方面是为了及时返回


// 参考二叉树的 DFS，写出网格 DFS 的两个要素：
// 1）网格中的相邻节点有4个，以 (r, c) 为参考，分别为上下左右 (r-1, c)、(r+1, c)、(r, c-1)、(r, c+1)，形似 ➕ 号
// 2）从二叉树的 base case 对应过来，应该是网格中不需要继续遍历、grid[r][c] 会出现数组下标越界异常的格子，也就是那些超出网格范围的格子。
// 3) 优化：网格不同于二叉树，会遇到遍历过的点，标记已经遍历过的格子避免重复
//   0 —— 海洋格子
//   1 —— 陆地格子（未遍历过）
//   2 —— 陆地格子（已遍历过）


// @lc code=start
function numIslands(grid: string[][]): number {
  function getNum(gridArg: string[][]): number {
    let res = 0
    for (let r = 0; r < gridArg.length; r++) {
      for (let c = 0; c < gridArg[0].length; c++) {
        if (gridArg[r][c] === '1') {
          dfs(gridArg, r, c)
          res++
        }
      }
    }
    return res
  }


  function dfs(gridArg: string[][], r: number, c: number) {
    // 1）判断 base case
    // 如果坐标超出了 (r, c) 范围，直接返回
    if (!inArea(gridArg, r, c)) {
      return
    }

    // 3）如果这个格子不是岛屿，直接返回
    if (gridArg[r][c] != '1') {
      return
    }
    // 已遍历过的 进行标记
    gridArg[r][c] = '2'

    // 2) 访问上下左右四个相邻节点
    dfs(gridArg, r - 1, c)
    dfs(gridArg, r + 1, c)
    dfs(gridArg, r, c - 1)
    dfs(gridArg, r, c + 1)
  }

  function inArea(gridArg: string[][], r: number, c: number) {
    return (0 <= r && r < gridArg.length) && (0 <= c && c < gridArg[0].length)
  }

  // 结果
  return getNum(grid)
};
// @lc code=end

// 同类型的题，解法类似，岛屿面积、填海造陆