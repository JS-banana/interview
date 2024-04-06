# HTML

## src和href的区别

简单来说就是：src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系

1. src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。

    - 当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js 脚本放在底部而不是头部。
    - `<script src =”js.js”></script>`

2. href 是 Hypertext Reference 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果在文档中添加

    - 那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。 这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。
    - `<link href=”common.css” rel=”stylesheet”/>`

## script标签中defer和async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

![script-async-defer](/static/images/script-async-defer.png)

defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析，其区别如下：

1. **执行顺序**
    - 多个带async属性的标签，不能保证加载的顺序；
    - 多个带defer属性的标签，按照加载顺序执行；
2. **脚本是否并行执行**
    - async属性，表示后续文档的加载和执行与js脚本的加载和执行是并行进行的，即异步执行；
    - defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

## HTML5有哪些更新

（1）新增语义化标签：nav、header、footer、aside、section、article
（2）音频、视频标签：audio、video
（3）数据存储：localStorage、sessionStorage
（4）canvas（画布）、Geolocation（地理定位）、websocket（通信协议）
（5）input标签新增属性：placeholder、autocomplete、autofocus、required
（6）history API：go、forward、back、pushstate

移除的元素有：

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
- 对可用性产生负面影响的元素：frame，frameset，noframes；

## web worker

Web Worker是HTML5提供的一项技术，它允许在Web应用程序中创建后台线程，以便在主线程上执行的任务不会阻塞用户界面的响应。Web Worker可以执行耗时的计算、处理大量数据、执行网络请求等任务，以提高Web应用程序的性能和响应速度。

Web Worker的主要特点包括：

1. **后台线程**：Web Worker在后台运行，不会阻塞主线程，保证了用户界面的流畅性。
2. **独立的全局上下文**：Web Worker拥有独立的全局上下文，与主线程隔离，不能直接访问DOM，但可以通过消息传递与主线程通信。
3. **异步消息传递**：Web Worker通过postMessage()方法向主线程发送消息，通过onmessage事件接收主线程发送的消息。

> 当一个消息在主线程和 worker 之间传递时，它被**复制**或者转移了，而不是共享。

下面是一个Web Worker的案例：

```js
// 主线程代码
// 创建Web Worker
const worker = new Worker('worker.js');

// 监听Web Worker发送的消息
worker.onmessage = function(event) {
  console.log('Received message from worker:', event.data);
};

// 向Web Worker发送消息
worker.postMessage('Hello from main thread!');


// worker.js代码
// 监听主线程发送的消息
self.onmessage = function(event) {
  console.log('Received message from main thread:', event.data);
  
  // 模拟耗时的计算
  const result = calculate(event.data);
  
  // 向主线程发送消息
  self.postMessage(result);
};

// 执行耗时的计算
function calculate(data) {
  // ...
  return result;
}
```

在上述案例中，主线程创建了一个Web Worker，并通过postMessage()方法向Web Worker发送消息。Web Worker接收到消息后，执行耗时的计算，并通过postMessage()方法将结果发送回主线程。主线程通过onmessage事件监听Web Worker发送的消息，并打印出结果。

这个案例展示了Web Worker的基本用法，主线程和Web Worker之间通过消息传递进行通信，Web Worker在后台执行耗时的计算任务，不会阻塞主线程。

worker 内部使用 self 替代 window 全局对象，这里的 self 也可以省略

> 在主线程中使用时，onmessage 和 postMessage() 必须挂在 worker 对象上，而在 worker 中使用时不用这样做。原因是，在 worker 内部，worker 是有效的全局作用域。

## HTML5的离线储存怎么使用，它的工作原理是什么

离线存储指的是：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

原理：

HTML5的离线存储是基于一个新建的 `.appcache` 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

使用方法：

1. 创建一个和 html 同名的 manifest 文件，然后在页面头部加入 manifest 属性

    ```html
    <html lang="en" manifest="index.manifest">
    ```

2. 在 index.manifest 文件中编写需要离线存储的资源

    ```bash
    CACHE MANIFEST
    #v0.11
    CACHE:
    js/app.js
    css/style.css
    NETWORK:
    resourse/logo.png
    FALLBACK:
    / /offline.html
    ```

    - **CACHE**: 表示需要离线存储的资源列表，由于包含 manifest 文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
    - **NETWORK**: 表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。不过，如果在 CACHE 和 NETWORK 中有一个相同的资源，那么这个资源还是会被离线存储，也就是说 CACHE 的优先级更高。
    - **FALLBACK**: 表示如果访问第一个资源失败，那么就使用第二个资源来替换他，比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问 offline.html 。

3. 在离线状态时，操作 window.applicationCache 进行离线缓存的操作

如何更新缓存：

（1）更新 manifest 文件
（2）通过 javascript 操作
（3）清除浏览器缓存

## iframe 有那些优点和缺点？

iframe 元素会创建包含另外一个文档的内联框架（即行内框架）。

优点：

- 用来加载速度较慢的内容（如广告）
- 可以使脚本可以并行下载
- 可以实现跨子域通信

缺点：

- iframe 会阻塞主页面的 onload 事件
- 无法被一些搜索引擎索识别
- 会产生很多页面，不容易管理
