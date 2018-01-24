// LZR 模块加载
require("lzr");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv"
]);

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

// 公共样式
srv.ro.get("/base.css", function (req, res) {
	res.redirect("/css/common/base.css");
});

// 通用工具
srv.ro.get("/tools.js", function (req, res) {
	res.redirect("/js/tools.js");
});

// 静态主页设置
srv.ro.setStaticDir("/", "./web");

// 访问统计
srv.use("/Vs/", require("./Vs"));

// 域名服务
srv.use("/Domain/", require("./Domain"));

// 时间服务
srv.use("/Tim/", require("./Tim"));

// 模板测试
srv.ro.get("/td/test/:txt?", function (req, res, next) {
	req.qpobj = { txt: req.params.txt || "_ _ _" };
	next();
});
// 初始化模板
srv.ro.initTmp("/td/");

// 收尾处理
srv.use("*", function (req, res) {
	res.status(404).sendFile("err.html", {
		root: "./web/"
	});
});

// 服务启动
srv.start();
console.log("LZRmain start " + srv.ip + ":" + srv.port);
