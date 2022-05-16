/*
 * @lc app=leetcode.cn id=206 lang=typescript
 *
 * [206] 反转链表
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

//  输入：head = [1,2,3,4,5]
//  输出：[5,4,3,2,1]

function reverseList(head: ListNode | null): ListNode | null {
  // 链表反转
  // https://juejin.cn/post/6844904058562543623
  let prev = null
  let cur = head

  while (cur != null) {
    let next = cur.next
    cur.next = prev
    prev = cur

    // 移动指针
    cur = next
  }

  return prev
}
// @lc code=end
