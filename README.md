在 OpenShift 上的 Node.js 的基本应用：
===========

该项目主要用于练习Node.js，及OpenShift的部署。

*****

主要功能说明：
---------------------

*****

>####/web/####
>
静态文件服务端口：可获取此端口内的所有静态文件。 [点此浏览](http://www.jiangzi.cf/web/index.html)

*****

>####/server/####
>
后台服务端口：可调用后台服务程序。 [点此浏览](http://www.jiangzi.cf/server)  `(目前暂无可测试的服务... )`

*****

>####/myLib/####
>
库源码访问端口：可访问LZR库中的所有源码。 [点此浏览](http://www.jiangzi.cf/myLib/LZR/Util.js)

*****

>####其它说明：####
>
` 2016-1-19： ` 目前只在原 OpenShift-Sample-App 上做了一点改动测试。
>
` 2016-2-16： ` 兼容 nodejs 4.2.6版 的写法。
>
` 2016-2-17： ` 引入LZR库，自建基础的HTTP服务类。

*****
