/*
 * @lc app=leetcode.cn id=19 lang=typescript
 *
 * [19] 删除链表的倒数第 N 个结点
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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // 快慢双指针
  // 先让前面的指针移动n
  // 如果链表长度为N
  // 虚拟头结点
  let dummy = new ListNode(0)
  dummy.next = head

  // 这里需要使用 dummy，为了兼容只存在一个节点的情况
  let fast = dummy
  let slow = dummy

  // 先移动n
  for (let i = 0; i < n; i++) {
    fast = fast.next
  }

  // 同时移动
  // fast到最后一个节点时，slow移动了 N-n
  // 即倒数第n个位置 N-n
  //   while (fast !== null) {
  // 删除该节点，需要找到其前一个节点
  // 所以这里的结束条件调整为 fast.next !== null
  while (fast.next !== null) {
    fast = fast.next
    slow = slow.next
  }

  // 删除
  slow.next = slow.next.next

  // 不直接返回head是防止头结点被删除
  return dummy.next
}
// @lc code=end
