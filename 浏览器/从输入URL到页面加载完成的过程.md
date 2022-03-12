# 从输入 URL 到页面加载完成的过程中都发生了什么事情？

## 从浏览器到浏览器内核

1. 接收到输入事件，浏览器可能会做一些预处理（如输入 [bai]，推断要访问[www.baidu.com]，在输入回车前马上开始建立TCP链接甚至渲染了）

2. 回车，检查URL，判断协议，如果是http就按照web标准处理，安全检查，调用loadURL方法

3. 查看缓存，设置UA等http信息，调用网络请求

## HTTP 请求的发送

通过 DNS 查询 IP、通过 Socket 发送数据

## 资料

- [从输入URL到页面展示，这中间发生了什么？](https://study.10086.fund:23350/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E7%9A%84%E6%96%87%E7%AB%A0/81-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E8%B7%B5/04%E4%B8%A8%E5%AF%BC%E8%88%AA%E6%B5%81%E7%A8%8B%EF%BC%9A%E4%BB%8E%E8%BE%93%E5%85%A5URL%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA%EF%BC%8C%E8%BF%99%E4%B8%AD%E9%97%B4%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88%EF%BC%9F.html)
