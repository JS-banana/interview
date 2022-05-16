/*
 * @lc app=leetcode.cn id=92 lang=typescript
 *
 * [92] 反转链表 II
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

function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  let dumy = head
  let current = new ListNode(left)

  if (left === right) return dumy

  while (dumy && dumy.next) {
    // left
    if (dumy.val === left) {
      current = dumy.next
    }
    if (dumy.val === right) {
      current.next = null
    }
    dumy = dumy.next
  }

  // 反转链表
  function reverse(curHead: ListNode | null) {
    //
    let prev = null
    let next = curHead
    let cur = curHead

    while (cur) {
      // 看一遍就理解，图解单链表反转
      // https://juejin.cn/post/6844904058562543623
      next = cur.next
      cur.next = prev
      prev = cur
      cur = next
    }
    return prev
  }

  return reverse(current)
}
// @lc code=end
