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

  // 截取范围
  while (dumy && dumy.next) {
    // left
    if (dumy.val === left) {
      current.next = dumy
    }
    if (dumy.val === right) {
      current.next = null
    }
    dumy = dumy.next
  }

  // 链表反转
  let prev = null
  let cur = current
  while (cur != null) {
    let next = cur.next
    cur.next = prev
    prev = cur

    // 移动指针
    cur = next
  }

  let p = new ListNode(0)
  p.next = dumy
  while (dumy && dumy.next) {
    // left
    if (dumy.val === right) {
      p.next = prev
    }
    if (dumy.val === left) {
      p.next = dumy.next
    }
    dumy = dumy.next
  }

  return p.next
}
// @lc code=end
