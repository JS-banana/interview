# Webpack之Loader和Plugin

- webpack是运行在NodeJs环境下的

## Loader

因为webpack只能识别JS代码，loader的主要作用就是把非JS类型文件的代码转换成webpack可识别的JS代码。

简单理解就是负责文件转换。

规范说明：

- 支持数组形式配置多个
- 会按链式调用每一个loader，前一个loader返回的内容会作为下一个loader的入参（它们会以相反的顺序执行，从右向左或者从下向上执行）
- 返回值必须是标准的JS代码字符串，以保证下一个loader能够正常工作
- loader函数中的 `this`上下文由webpack提供，可以通过 `this`对象提供的相关属性，获取当前loader需要的各种信息数据
- 尽可能的异步化 Loader，如果计算量很小，同步也可以

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情

```js
module.exports = function(content, map, meta) {
    var callback = this.async();
    // do something
    // const result = '...'

    // 1. 异步调用或同步调用，直接通过 callback 回调
    callback(null, result, map, meta);

    // 2. 同步调用，直接返回结果
    return result
};
```

## Plugin

如果说 `Loader`负责文件转换，那么 `Plugin`便是负责功能扩展。

功能开发方面主要围绕 `compiler`和 `compilation`对象。

规范要求：

- 插件必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问 `compiler`实例
- 传给每个插件的 `compiler` 和 `compilation` 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
- 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机

watch-run 当依赖的文件发生变化时会触发

## 区别

作用：

- Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果
- Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能
  - 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果

使用：

- Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组
  - 每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性
- Plugin 在 plugins 中单独配置，类型为数组
  - 每一项是一个 Plugin 的实例，参数都通过构造函数传入

代码示例：

```js
// loader 在webpack中的配置
{
    test: /\.less$/,
    use: [
    {
        loader:  "style-loader",
    },
    {
        loader: "css-loader",
    },
    {
        loader: "less-loader",
        options: { javascriptEnabled: true },
    },
    ],
},
```

```js
// plugin 在webpack中的配置
new MiniCssExtractPlugin({
    filename: `css/[name]${hash ? ".[contenthash:8]" : ""}.css`,
    chunkFilename: `css/[name]${hash ? ".[contenthash:8]" : ""}.css`,
    ignoreOrder: false,
})
```

## 资料

- [当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992)
- [「吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487)
