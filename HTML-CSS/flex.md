# flex

## flex:1 理解

是 `flex-grow`、`flex-shrink`、`flex-basis` 的简写，默认值为 `0 1 auto`。

### flex-grow

- 定义弹性盒子项（flex-item）的拉伸因子，默认值0
- flex-grow 属性决定了子容器要占用父容器多少剩余空间
- 子容器设置了 flex-grow 有可能会被拉伸

子容器在父容器的“主轴”上还有多少空间可以“瓜分”，这个可以被“瓜分”的空间就叫做剩余空间。

计算方式如下：

```txt
剩余空间：x
假设有三个flex item元素，flex-grow 的值分别为a, b, c
每个元素可以分配的剩余空间为： a/(a+b+c) * x，b/(a+b+c) * x，c/(a+b+c) * x
```

只设置子项的 `width`属性，不设置 `flex-grow`

![width](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/9/16ee8830967129ee~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

设置了子项 `flex-grow`属性后

![flex-grow](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/9/16ee98a58c0fa6d9~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### flex-shrink

- 指定了 flex 元素的收缩规则，默认值是 1
- 此时，剩余空间的概念就转化成了“溢出空间”
- 如果子容器没有超出父容器，设置 flex-shrink 无效

该属性和 `flex-grow`相对

如果子容器宽度超过父容器宽度，即使是设置了 flex-grow，但是由于没有剩余空间，就分配不到剩余空间了。这时候有两个办法：换行和压缩。由于 flex 默认不换行，那么压缩的话，怎么压缩呢，压缩多少？此时就需要用到 flex-shrink 属性了

计算方式如下：

```txt
三个flex item元素的width: w1, w2, w3
三个flex item元素的flex-shrink：a, b, c
计算总压缩权重：
sum = a * w1 + b * w2 + c * w3
计算每个元素压缩率：
S1 = a * w1 / sum，S2 =b * w2 / sum，S3 =c * w3 / sum
计算每个元素宽度：width - 压缩率 * 溢出空间
```

当容器宽度是 width: 500px 时，子容器宽度总和为 650px，溢出空间为150 总压缩：`300 * 1 + 150 * 2 + 200 * 3 = 1200 A`的压缩率：`300*1 / 1200 = 0.25 A`的压缩值：`150 * 0.25 = 37.5 A`的实际宽度：`300 - 37.5 = 262.5`

![flex-shrink](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/9/16ee88179e5c8281~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### flex-basis

- 指定了 flex 元素在主轴方向上的初始大小
- 浏览器会根据 flex-basis 计算主轴是否有剩余空间

宽度属性的优先级关系：

`max-width/min-width > flex-basis > width > box`

### 总结

- flex items 总和超出 flex 容器，会根据 flex-shrink 的设置进行压缩
- 如果有剩余空间，如果设置 flex-grow，子容器的实际宽度跟 flex-grow 的设置相关。如果没有设置flex-grow，则按照 flex-basis 展示实际宽度

## 资料

- [深入理解 flex-grow、flex-shrink、flex-basis](https://juejin.cn/post/6844904016439148551)
