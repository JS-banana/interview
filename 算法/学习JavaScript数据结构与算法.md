# 学习JavaScript数据结构与算法 读书笔记

## 语法技巧

### 交换

    使用展开式语法，代替

    ```js
    // 如交换 x和y 的值
    // 1.老的写法
    var temp=x
    x=y
    y=temp
    // 2.新的写法
    var [x,y]=[y,x]
    ```

## 数据结构

### 栈

栈是一种遵从后进先出（LIFO）原则的有序集合。（类比数组的push、pop）

### 堆

### 队列

队列是遵循先进先出（FIFO，也称为先来先服务）原则的一组有序的项。（）

### 链表

### 集合

集合是由一组无序且唯一（即不能重复）的项组成的

- ES6的Set
- 集合以[值，值]的形式存储元素

### 字典和散列表

#### 字典

在字典（或映射）中，用[键，值]对的形式来存储数据，字典中的每个键只能有一个值。

- ES6的Map、WeakMap、WeakSet
- 字典以[键，值]的形式来存储元素
- 字典也称作映射、符号表或关联数组。

#### 散列表

> 不做深入了解

它是字典的一种实现，也叫HashMap类

- 散列算法的作用是尽可能快地在数据结构中找到一个值。
- 它也可以用来对数据库进行索引

### 树

树是一种分层数据的抽象模型。对于存储需要快速查找的数据非常有用

#### 二叉树

二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。

#### 二叉搜索树

二叉搜索树（BST）是二叉树的一种，但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值。

##### 中序遍历

- 中序遍历是一种以上行顺序访问BST所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点
- 中序遍历的一种应用就是对树进行排序操作

```js
function treeSearch(node){
   if(node != null){
      // treeSearch(node.left)   // 先序遍历left
      console.log(node.val)      // 中序遍历
      // treeSearch(node.right)  // 后序遍历right
   }
}
```

![中序遍历](/static/images/tree-middle.jpg)

----

##### 先序遍历

- 先序遍历是以优先于后代节点的顺序访问每个节点的。
- 先序遍历的一种应用是打印一个结构化的文档。
- 先序遍历会先访问节点本身，然后再访问它的左侧子节点，最后是右侧子节点

```js
function treeSearch(node){
   if(node != null){
      console.log(node.val)      // 先序遍历left
      // treeSearch(node.left)   // 中序遍历
      // treeSearch(node.right)  // 后序遍历right
   }
}
```

![先序遍历](/static/images/tree-before.jpg)

----

##### 后序遍历

- 后序遍历则是先访问节点的后代节点，再访问节点本身
- 后序遍历的一种应用是计算一个目录及其子目录中所有文件所占空间的大小。

```js
function treeSearch(node){
   if(node != null){
      // treeSearch(node.left)   // 先序遍历left
      // treeSearch(node.right)  // 中序遍历
      console.log(node.val)      // 后序遍历right
   }
}
```

![后序遍历](/static/images/tree-after.jpg)

#### 自平衡树

AVL树是一种自平衡二叉搜索树，意思是任何一个节点左右两侧子树的高度之差最多为1
