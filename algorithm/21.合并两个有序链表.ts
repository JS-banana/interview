/*
 * @lc app=leetcode.cn id=21 lang=typescript
 *
 * [21] 合并两个有序链表
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

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // head 进行移动，最后返回的是 dmuy.next
  let dumy = new ListNode(0) // 虚拟头结点
  let head = dumy
  while (list1 !== null && list2 !== null) {
    // 比较大小，小的放入链表
    if (list1.val > list2.val) {
      head.next = list2
      list2 = list2.next
    } else {
      head.next = list1
      list1 = list1.next
    }
    head = head.next
  }

  // 剩余的链表是比较大的，放在后面即可
  if (list1) {
    head.next = list1
  }

  if (list2) {
    head.next = list2
  }

  return dumy.next
};
// @lc code=end

