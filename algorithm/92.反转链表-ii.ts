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
    let dumy=head
    let current=new ListNode(left)

    let p1=head
    let p2=head

    if(left===right) return dumy

    while(dumy&&dumy.next){
        // left
        if(dumy.val===left){
            current=dumy.next
            p1.next=null
        }
        if(dumy.val===right){
            current.next=null
            p2=dumy.next
        }
        dumy=dumy.next
    }

    let reverseCurrent=current
    let cur=current
    while(current&&current.next){
        cur
        current=current.next
    }

};
// @lc code=end

