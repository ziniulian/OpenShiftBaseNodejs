// LZR 模块加载
require("LZR");

// LZR 子模块加载
LZR.load([
	"LZR.NodeJs.BaseMainSrv"
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
		srv: "wfs",
		obj: {
			name: "/web/",
			ajaxAllow: "*"
		}
	},

	// LZR库文件访问服务
	myLib: {
		srv: "wfs",
		obj: {
			name: "/myLib/",
			path: "/",
			ajaxAllow: "*",
			dir: LZR.curPath
		}
	},

	// LOGO图片
	logo: {
		srv: "wfs",
		obj: {
			name: "/favicon.ico",
			path: "/Logo.png"
		}
	},

	// 主页跳转
	home: {
		srv: "wfs",
		obj: {
			name: "/",
			path: "/web/index.html",
			ajaxAllow: "*"
		}
	}
});