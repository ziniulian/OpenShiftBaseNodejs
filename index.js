// LZR 模块加载
require("LZR");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Util",
	"LZR.Node.Srv",
	"LZR.Node.Db.NodeAjax"
]);

var utNode = LZR.getSingleton(LZR.Node.Util);

// Ajax
var ajax = new LZR.Node.Db.NodeAjax ({
	hd_sqls: {
		vs: "http://127.0.0.1/Vs/srvTrace/<0>/0/<1>"
	}
});

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
});

// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// LOGO图片
srv.ro.get("/favicon.ico", function (req, res) {
	res.sendFile("Logo.png", {
		root: "./"
	});
});

// // 访问记录
// srv.ro.get(/(^\/(flawerShop\/)?(index.html)?$)/i, function (req, res, next) {
// 	ajax.qry("vs", req, res, next, [encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl), utNode.getClientIp(req)]);
// 	next();
// });

// 静态主页设置
srv.ro.setStaticDir("/", "./web");

// // 访问统计
// srv.use("/Vs/", require("./Vs"));

// 访问统计
srv.use("/Tim/", require("./Tim"));

// 收尾处理
srv.use("*", function (req, res) {
	res.status(404).sendFile("err.html", {
		root: "./web/"
	});
});

// 服务启动
srv.start();
console.log("LZRmain start " + srv.ip + ":" + srv.port);
