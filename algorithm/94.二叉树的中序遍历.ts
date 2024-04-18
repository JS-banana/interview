/*
 * @lc app=leetcode.cn id=94 lang=typescript
 *
 * [94] 二叉树的中序遍历
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

function inorderTraversal(root: TreeNode | null): number[] {
  let res = [] // 定义目标结果数组

  function dfs(node: TreeNode | null) {
    // 递归，返回条件
    if (node === null) {
      return
    }

    // 根据题意，直接使用中序取值
    dfs(node.left)
    res.push(node.val)
    dfs(node.right)
  }
  dfs(root)

  return res
};
// @lc code=end

