/*
 * @lc app=leetcode.cn id=912 lang=typescript
 *
 * [912] 排序数组
 */

// @lc code=start
function sortArray(nums: number[]): number[] {
  // 🙋‍♂️1. 选择排序：时间复杂度较高
  // 选择未排序区间最小的元素和最前面交换
  // 最后一位不用排，最后就是最大的
  // for (let i = 0; i < nums.length - 1; i++) {
  //   let m = i // 最小值索引

  //   for (let j = i + 1; j < nums.length; j++) {
  //     if (nums[j] < nums[m]) {
  //       m = j
  //     }
  //   }

  //   // 交换位置
  //   [nums[i], nums[m]] = [nums[m], nums[i]]
  // }

  //🙋‍♂️ 2. 冒泡排序
  // 左右交换，把最大的数据冒泡到最右边
  // 不断重复
  // for (let i = nums.length - 1; i > 0; i--) {
  //   // 未排序区间
  //   for (let j = 0; j < i; j++) {
  //     if (nums[j] > nums[j + 1]) {
  //       // 交换
  //       let temp = nums[j]
  //       nums[j] = nums[j + 1]
  //       nums[j + 1] = temp
  //     }
  //   }
  // }

  // 🙋‍♂️3. 插入排序
  // 默认第一个为已排序，从第二项开始，逐个插入 [0, i-1] 区间
  // [0, i-1] 区间 为已排序区间
  // for (let i = 1; i < nums.length; i++) {
  //   // 取当前要插入的节点值
  //   let base = nums[i]
  //   let j = i - 1

  //   while (j >= 0 && nums[j] > base) {
  //     // 右移 nums[j]
  //     nums[j + 1] = nums[j]
  //     j--
  //   }

  //   // 确定 base 需要在哪里插入
  //   nums[j + 1] = base
  // }

  // 🙋‍♂️4. 快速排序

  // 寻找中位数
  // 寻找哨兵
  // function partition(arr: number[], left: number, right: number) {
  //   // 以 arr[left] 为基准数
  //   let i = left
  //   // let mid = Math.floor((right - left) / 2)
  //   let j = right
  //   // let pivot = arr[left]
  //   while (i < j) {
  //     while (i < j && arr[j] >= arr[left]) {
  //       j--
  //     }
  //     while (i < j && arr[i] <= arr[left]) {
  //       i++
  //     }
  //     [arr[i], arr[j]] = [arr[j], arr[i]]
  //   }
  //   // 将基准交互至两个数组的分界线
  //   [arr[i], arr[left]] = [arr[left], arr[i]]
  //   return i
  // }


  // function quickSort(data: number[], left: number, right: number) {
  //   if (left >= right) {
  //     return
  //   }

  //   // 哨兵划分
  //   let pivot = partition(data, left, right)
  //   // 以 pivot 划分，左右分别 -1 和 +1

  //   // 递归左边数组
  //   quickSort(data, left, pivot - 1)
  //   // 递归右边数组
  //   quickSort(data, pivot + 1, right)

  // }

  // quickSort(nums, 0, nums.length - 1)

  // 🙋‍♂️5. 归并排序
  function mergeSort(arr: number[]) {
    if (arr.length <= 1) return

    // 二分，取数组左右两侧
    let mid = Math.floor(arr.length / 2)
    let leftArr = arr.slice(0, mid)
    let rightArr = arr.slice(mid, arr.length)

    mergeSort(leftArr)
    mergeSort(rightArr)

    // 下面的代码是归并回溯操作，和二叉树的后续遍历类似

    // 这一步，与 合并2个有序数组的逻辑也几乎一致

    let i = 0, j = 0, k = 0
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] < rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      k++
    }

    // 检测左右数组是否有剩余
    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      i++
      k++
    }
    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      j++
      k++
    }
  }

  mergeSort(nums)

  return nums
};
// @lc code=end

