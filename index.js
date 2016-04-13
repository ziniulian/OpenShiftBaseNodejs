// LZR 模块加载
require("LZR");

// LZR 子模块加载
LZR.load([
	"LZR.NodeJs.BaseMainSrv",
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
		path: "/work/",
		ajaxAllow: "*"
	},

	// LOGO图片
	logo: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/favicon.ico",
		path: "/Logo.png"
	},

	// 主页跳转
	home: {
		cls_: LZR.NodeJs.SampleWebFileSrv,
		name: "/",
		path: "/web/index.html",
		ajaxAllow: "*"
	}
});