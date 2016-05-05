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

>####/srv/####
>
后台服务端口：可调用后台服务程序。 
[简单的代理服务（网站）](http://www.jiangzi.cf/srv/proxy?url=http://love.163.com)
[简单的代理服务（图片）](http://www.jiangzi.cf/srv/proxy?url=http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/4/7/13)
[风的服务](http://www.jiangzi.cf/srv/wind?rowNo=40&columnNo=30&lonmin=50.5&latmin=-4&lonmax=161.5&latmax=58&cTime=2015-07-07%2004)

*****

>####/myLib/####
>
库源码访问端口：可访问LZR库中的所有源码。 [点此浏览](http://www.jiangzi.cf/myLib/LZR/NodeJs.js)

*****

>####/show/####
>
作品端口：
[点此浏览](http://www.jiangzi.cf/show/CandS/V1/index.html)
[点此浏览](http://www.jiangzi.cf/show/OrbitS/V0/index.html)
[点此浏览](http://www.jiangzi.cf/show/RegS/V0/index.html)
[点此浏览](http://www.jiangzi.cf/show/RegS/V2/index.html)
[点此浏览](http://www.jiangzi.cf/show/ReleaseS/V0/index.html)
[点此浏览](http://www.jiangzi.cf/show/ReleaseS/V1/index.html)

*****

开发明细：
-------------------------------------------------------------------

##### 2016-5-5：
	作品移植 3

##### 2016-4-20：
	作品移植 1

##### 2016-2-17： 引入LZR库，自建基础的HTTP服务类。

##### 2016-2-16： 兼容 nodejs 4.2.6版 的写法。

##### 2016-1-19： 前只在原 OpenShift-Sample-App 上做了一点改动测试。

*****
