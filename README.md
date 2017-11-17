主服务：
=======

我的网站： [点此浏览](http://ziniulian.github.io/)

库源码访问端口：可访问LZR库中的所有源码。 [点此浏览](https://openshiftbasenodejs-ziniulian.rhcloud.com/myLib/LZR/Node.js)

*******************************************************************

缓存：
-------------------------------------------------------------------

- 在 openshift online 3 上的重新部署
- 访问统计服务
	- 保存的URL包含协议、主机名、路径
- 时间服务

*******************************************************************

计划：
-------------------------------------------------------------------

- 访问统计服务
	- 修改域名 （ trace.js,ajax.vs,readme.md ）
	- 网站访问统计页面
- 域名服务
	- 获取各个服务的可用域名
	- 测试域名是否可用功能

- 研究 Openshift3 的路由、思考如何实现原始TCP通信（基于 openshift online 似乎不可行）
- 域名解析不支持 https 问题


*******************************************************************

开发明细：
-------------------------------------------------------------------

##### 2017-11-17 （ 访问统计 ）：
	提取 访问统计 服务	Vs
	保存的URL包含协议、主机名、路径

##### 2017-11-10 （ 改用 npm 加载 LZR库 ）：
	取消 LZR库 的文件映射，改用 npm 加载 LZR库

##### 2017-11-8 （ 拆分服务 ）：
	拆分服务

*******************************************************************
