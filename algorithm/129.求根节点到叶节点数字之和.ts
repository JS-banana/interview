/*
 * @lc app=leetcode.cn id=129 lang=typescript
 *
 * [129] 求根节点到叶节点数字之和
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

function sumNumbers(root: TreeNode | null): number {
  // 树 => 深度优先，广度优先

  // 方法一：DFS ，需要理解递归的过程

  // function dfs(node: TreeNode, prev: number): number {
  //   if (node == null) return 0
  //   // 缓存相加上一次的 val
  //   const sum = prev * 10 + node.val

  //   if (node.left == null && node.right == null) {
  //     // 1）叶子节点，返回
  //     return sum
  //   } else {
  //     // 2）非叶子节点，继续递归
  //     return dfs(node.left, sum) + dfs(node.right, sum)
  //   }
  // }

  // return dfs(root, 0)

  // 方法二：BFS，队列
  // 这里需要维护2个队列，一个放节点，一个方sum之和
  let queueNode = [root]
  let queueSum = [root.val]
  let sum = 0

  while (queueNode.length > 0) {
    const curNode = queueNode.shift()
    const curSum = queueSum.shift()

    if (curNode.left == null && curNode.right == null) {
      sum += curSum
    }

    if (curNode.left !== null) {
      queueNode.push(curNode.left)
      queueSum.push(curSum * 10 + curNode.left.val)
    }

    if (curNode.right !== null) {
      queueNode.push(curNode.right)
      queueSum.push(curSum * 10 + curNode.right.val)
    }
  }

  return sum

};
// @lc code=end

