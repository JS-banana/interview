/*
 * @lc app=leetcode.cn id=70 lang=typescript
 *
 * [70] 爬楼梯
 */

// @lc code=start
function climbStairs(n: number): number {
  // 🙋‍♂️方法一：暴利解法 ==> 动态规划

  // 步：存储
  // 这一步用于优化重复计算
  // const steps = []

  // // 当n=1时，step可知为1
  // // 当n=2时，step可知为2
  // if (n <= 2) {
  //   return n
  // }

  // // 当n=3时，用于作为想加项
  // // 所以，预先设置值
  // // 注意数组下标
  // steps[1] = 1
  // steps[2] = 2

  // // 直接从3开始
  // // 为了计算n，因此循环设置为 n+1
  // for (let i = 3; i < n + 1; i++) {
  //   steps[i] = steps[i - 1] + steps[i - 2]
  // }

  // return steps[n]

  // 🙋‍♂️方法二：基于动态规划的，空间优化写法
  // 由于 dp[i]只与 dp[i-1]和dp[i-2] 有关，
  // 因此我们无须使用一个数组 dp 来存储所有子问题的解，而只需两个变量滚动前进即可
  if (n === 1 || n === 2) return n

  let a = 1;
  let b = 2;

  for (let i = 3; i <= n; i++) {
    // 同步向后移动
    let temp = b
    b = a + b
    a = temp
  }

  return b

  // 🙋‍♂️方法三：回溯算法
  // function dfs(state: number, choices: number[], n: number, res: Map<0, number>) {
  //   // 当状态等于n时，总数 +1
  //   // map 的 get 获取上一次的值
  //   if (state === n) res.set(0, res.get(0) + 1)

  //   for (let cho of choices) {
  //     // 剪枝，和大于 n ，则跳过
  //     if (state + cho > n) continue

  //     // 下一轮
  //     dfs(state + cho, choices, n, res)

  //     // 回退，
  //   }
  // }

  // let choices = [1, 2]
  // let res = new Map() // 使用map做记录，
  // res.set(0, 0)
  // dfs(0, choices, n, res)

  // return res.get(0)
}
// @lc code=end
