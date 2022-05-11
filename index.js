function validPalindrome(s) {
  // 题目已说明最多删除一个字符
  // 暴力思路：逐个删除，判断是否回文
  // 优化思路：先按照对称比较判断，如果不对称，则删除一个字符，再判断

  let left = 0
  let right = s.length - 1

  const isPalindrome = (i, j) => s[i] === s[j]

  let flag = false

  while (left < right) {
    if (s[left] != s[right]) {
      if (!flag && isPalindrome(left, right - 1)) {
        right = right - 1
        flag = true
      } else if (!flag && isPalindrome(left + 1, right)) {
        left = left + 1
        flag = true
      } else {
        return false
      }
    }
    left++
    right--
  }

  return true
}

validPalindrome('ececabbacec')
