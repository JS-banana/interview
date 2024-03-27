/*
 * @lc app=leetcode.cn id=102 lang=typescript
 *
 * [102] 二叉树的层序遍历
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

function levelOrder(root: TreeNode | null): number[][] {
  // 层序遍历，即 广度优先，BFS
  // 从左到右，使用队列的思想，先进先出
  if (root === null) return []

  let quene = [root]
  let res = []

  while (quene.length > 0) {
    let dp = []
    let len = quene.length

    // 关键是这里，看不懂的时候就把 len 假设为1，以普通的形式去看
    // 当 len 小于 2 时，和正常的一层层序遍历没什么区别
    for (let i = 0; i < len; i++) {
      // 先进先出
      let node = quene.shift()
      dp.push(node.val)

      if (node.left !== null) {
        quene.push(node.left)
      }
      if (node.right !== null) {
        quene.push(node.right)
      }
    }

    res.push(dp)
  }

  return res
};
// @lc code=end

