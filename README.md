主服务：
=======

我的网站： [点此浏览](http://www.ziniulian.tk/)

*******************************************************************

缓存：
-------------------------------------------------------------------

- 在 openshift online 3 上的重新部署
- 访问统计服务
	- 保存的URL包含协议、主机名、路径
	- 修改域名
- 时间服务
- 简单的域名服务
- 域名管理接口
- 域名管理
- 修改 LZR 库的域名服务类
- 访问统计服务

*******************************************************************

计划：
-------------------------------------------------------------------

- 域名服务
	- 获取各个服务的可用域名
	- 测试域名是否可用功能

- 研究 Openshift3 的路由、思考如何实现原始TCP通信（基于 openshift online 似乎不可行）
- 域名解析不支持 https 问题


*******************************************************************

开发明细：
-------------------------------------------------------------------

##### 2017-1-29 （ 首页加载LZR库 ）：
	首页加载LZR库

##### 2017-1-28 （ 修正访问查询的时差问题 ）：
	修正访问查询的时差问题

##### 2017-1-24 （ 时间测试 ）：
	新增时间测试页
	域名、访问、首页、花店 加跟踪器
	取消访问记录的路由

##### 2017-1-23 （ 页面优化 ）：
	列表上下均有翻页按钮
	用name属性标记域名链接
	访问统计不再使用url的模糊查询

##### 2017-1-23 （ 访问统计 ）：
	新增通用工具类，目前仅包含跟踪和域名函数
	完成访问统计功能及管理页面
	删除旧版的域名管理页面

##### 2017-1-20 （ 模板测试 ）：
	新增测试模板
	域名规范修正
	修改 LZR 库的域名服务类
	统一使用 -1 分页来查询总数

##### 2017-1-19 （ 域名管理 ）：
	服务取消对URI字符的再次解码
	完成域名管理

##### 2017-1-5 （ 完成域名管理接口 ）：
	完成域名管理接口

##### 2017-12-29 （ 规范返回值结构 ）：
	规范返回值结构

##### 2017-11-21 （ 简单的域名服务 ）：
	简单的域名服务

##### 2017-11-20 （ 使用域名服务获取域名 ）：
	使用域名服务获取域名

##### 2017-11-17 （ 修改域名 ）：
	修改域名
	openshift 3 部署测试完成

##### 2017-11-17 （ 访问统计 ）：
	提取 访问统计 服务	Vs
	保存的URL包含协议、主机名、路径

##### 2017-11-10 （ 改用 npm 加载 LZR库 ）：
	取消 LZR库 的文件映射，改用 npm 加载 LZR库

##### 2017-11-8 （ 拆分服务 ）：
	拆分服务

*******************************************************************
