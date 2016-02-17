// LZR 模块加载
console.log ("Hellow World!");
require("LZR");
console.log (LZR);

// LZR 子模块加载
LZR.load([
	"LZR.NodeJs.BaseMainSrv"
]);
console.log ("LZR 子模块加载");

// 服务的实例化
var srv = new LZR.NodeJs.BaseMainSrv ({
	port: 8080
});
console.log ("服务的实例化");

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

	// LOGO图片
	logo: {
		srv: "wfs",
		obj: {
			name: "/favicon.ico",
			path: "/Logo.png"
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
console.log ("服务启动");