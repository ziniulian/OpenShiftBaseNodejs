在 OpenShift 上的 Node.js 的基本应用：
===========

该项目主要用于练习Node.js，及OpenShift的部署。

*****

主要功能说明：
---------------------

*****

####首页：####

尚无内容... [点此浏览](https://openshiftbasenodejs-ziniulian.rhcloud.com)

*****

####查看服务器IP及端口：####

目前返回的IP似乎不是公网IP，待日后完善...  [点此浏览](https://openshiftbasenodejs-ziniulian.rhcloud.com/ipconfig)

*****

####获取服务器上的静态文件：####

主要练习了一下 Node.js 对 GET 和 POST 参数的处理，以及 Node.js 的文件读取功能。

在路径后添加 ` path ` 参数，即可获取到服务器上的文件内容。比如：添加 ` ?path=README.md `  参数。 [点此浏览](https://openshiftbasenodejs-ziniulian.rhcloud.com/getStaticFile?path=README.md)

若没有 ` path ` 参数，则可将其它参数解析并返回。比如：添加 ` ?a=1&b=2&c=Hello GitHub&d=你好，OpenShift ` 参数。 [点此测试](https://openshiftbasenodejs-ziniulian.rhcloud.com/getStaticFile?a=1&b=2&c=Hello GitHub&d=你好，OpenShift)

*****

###其它说明：###

` 2016-1-19： ` 目前只在原 OpenShift-Sample-App 上做了一点改动测试。
` 2016-2-16： ` 兼容 nodejs 4.2.6版 的写法。

*****
