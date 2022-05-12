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

// 1. 叶子节点的定义是左孩子和右孩子都为 null 时叫做叶子节点
// 2. 当 root 节点左右孩子都为空时，返回 1
// 3. 当 root 节点左右孩子有一个为空时，返回不为空的孩子节点的深度
// 4. 当 root 节点左右孩子都不为空时，返回左右孩子较小深度的节点值

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
