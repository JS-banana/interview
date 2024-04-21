/*
 * @lc app=leetcode.cn id=104 lang=typescript
 *
 * [104] 二叉树的最大深度
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function maxDepth(root: TreeNode | null): number {
  // 🙋‍♂️方法一：DFS 后序遍历
  // function dfs(node: TreeNode | null) {
  //   if (node === null) {
  //     return 0
  //   }

  //   // 后序遍历
  //   // 当前树的深度，等于左子树的深度与右子树的深度的最大值 +1
  //   return Math.max(dfs(node.left), dfs(node.right)) + 1
  // }

  // return dfs(root)

  // 🙋‍♂️方法二：BFS 层序遍历
  // 层序遍历，是一层一层往下进行，每循环一次为一层， +1
  if (root === null) return 0

  let queue = [root]
  let res = 0

  while (queue.length > 0) {
    // const node = queue.shift()
    // 为了实现，一次遍历完一层，需要特殊处理下
    let temp = []

    // 一次取完
    for (let node of queue) {
      if (node.left !== null) {
        temp.push(node.left)
      }

      if (node.right !== null) {
        temp.push(node.right)
      }
    }

    queue = temp
    // 循序一层，则 +1
    res++

  }

  return res
};
// @lc code=end

