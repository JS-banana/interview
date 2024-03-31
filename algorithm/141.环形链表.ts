/*
 * @lc app=leetcode.cn id=141 lang=typescript
 *
 * [141] 环形链表
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

function hasCycle(head: ListNode | null): boolean {
  // 方法一：哈希表，这是最简单的
  // const map = new WeakMap()
  // let cur = head

  // while (cur !== null) {

  //   if (map.get(cur)) {
  //     return true
  //   }
  //   map.set(cur, cur)

  //   cur = cur.next
  // }
  // return false


  // 方法二：快慢指针，有环存在一定会相遇

  if (head === null || head.next === null) return false

  let slow = head
  let fast = head.next

  while (slow !== fast) {
    if (fast === null || fast.next === null) return false

    slow = slow.next
    fast = fast.next.next
  }
  return true
};
// @lc code=end

