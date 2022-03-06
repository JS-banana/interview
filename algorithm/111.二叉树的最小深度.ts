/*
 * @lc app=leetcode.cn id=111 lang=typescript
 *
 * [111] 二叉树的最小深度
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

function minDepth(root: TreeNode | null): number {
  // root 为空时
  if (root == null) return 0
  // root 的 left、right都为空时，说明在顶点
  if (root.left == null && root.right == null) return 1

  // 如果有一个节点为空，返回比较大的孩子的深度
  const m1 = minDepth(root.left)
  const m2 = minDepth(root.right)

  // 有个为空，必然有个值为 0
  if (root.left == null || root.right == null) return m1 + m2 + 1

  return Math.min(m1, m2) + 1
}
// @lc code=end
