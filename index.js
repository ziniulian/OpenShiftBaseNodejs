// LZR 模块加载
require("LZR");
var express = require('express');
LZR.singletons.nodejsTools.express = express;



var app = express();
var ip = process.env.OPENSHIFT_NODEJS_IP || "192.168.1.236";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;


/*
// LZR 子模块加载
LZR.load([
	"LZR.NodeJs.BaseMainSrv",
	"LZR.NodeJs.SampleProxySrv",
	"LZR.NodeJs.ProSrv.WindSrv",
	"LZR.NodeJs.SampleWebFileSrv"
]);

// 服务的实例化
var srv = new LZR.NodeJs.BaseMainSrv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "192.168.1.236",
	port: process.env.OPENSHIFT_NODEJS_PORT || 8080
});

// 服务启动
srv.start({
	// 基础文件服务
	web: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/web/",
		ajaxAllow: "*"
	},

	// LZR库文件访问服务
	myLib: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/myLib/",
		path: "/",
		ajaxAllow: "*",
		dir: LZR.curPath
	},

	// 工作展示
	show: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/show/",
		path: "/WorkSpace/web/",
		ajaxAllow: "*"
	},

	// LOGO图片
	logo: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/favicon.ico",
		path: "/Logo.png"
	},

	// 简单的代理服务
	proxy: {
		cls_: LZR.NodeJs.SampleProxySrv,
		name: "/srv/proxy"
	},

	// 简单的代理服务
	wind: {
		cls_: LZR.NodeJs.ProSrv.WindSrv,
		name: "/srv/wind"
	},

	// 主页跳转
	home: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/",
		path: "/web/index.html",
		ajaxAllow: "*"
	}
});
*/


// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv"
]);

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: ip,
	port: port
});

srv.so = app;
// srv.so.use(express.static("./web"));
// srv.so.listen(srv.port, srv.ip);

// srv.ep = express;
// srv.so = app;

// app.listen(srv.port, srv.ip);
app.listen(port, ip);

/*
// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// LOGO图片
srv.ro.get("/favicon.ico", function (req, res) {
	res.sendFile("Logo.png", {
		root: "./"
	});
});

// 其它项目加载测试
// srv.use("/Temp/", require("./ProTemp"));

// 作品秀
srv.use("/Show/", require("./WorkSpace"));

// 收尾处理
srv.use("*", function (req, res, next) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("404!");
});

// 服务启动
srv.start();
*/
