/*
 * @lc app=leetcode.cn id=876 lang=typescript
 *
 * [876] 链表的中间结点
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

function middleNode(head: ListNode | null): ListNode | null {
  // 双指针都指向头结点
  let slow = head
  let fast = head

  // 慢指针走一步，快指针走两步
  // 快指针走到末尾时结束
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  // 如果快指针为空，说明链表长度为奇数，中间结点就是慢指针
  return slow
}
// @lc code=end
