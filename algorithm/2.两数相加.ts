/*
 * @lc app=leetcode.cn id=2 lang=typescript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // 对于链表，凡是涉及到新增链表的，都可以用一个虚拟头结点来实现
  let dumy = new ListNode(-1)
  let p = dumy // 负责构建新链表
  let carry = 0 // 进位

  while (l1 || l2 || carry > 0) {
    // 先加上上次进位
    let val = carry

    if (l1) {
      val = val + l1.val
      l1 = l1.next
    }

    if (l2) {
      val = val + l2.val
      l2 = l2.next
    }
    // 处理进位情况
    carry = Math.floor(val / 10)
    val = val % 10
    // 构建新节点
    p.next = new ListNode(val)
    p = p.next
  }

  return dumy.next
}
// @lc code=end
