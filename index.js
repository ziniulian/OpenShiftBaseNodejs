// LZR 模块加载
require("LZR");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv"
]);

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
});

// 设置 Ajax 跨域权限
srv.use("*", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});
	next();
});

// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// LOGO图片
srv.ro.get("/favicon.ico", function (req, res) {
	res.sendFile("Logo.png", {
		root: "./"
	});
});

// 静态主页设置
srv.ro.setStaticDir("/", "./web");

// 其它项目加载测试
srv.use("/Temp/", require("./ProTemp"));

// 作品秀
srv.use("/Show/", require("./WorkSpace"));

// 收尾处理
srv.use("*", function (req, res) {
	res.status(404).sendFile("err.html", {
		root: "./web/"
	});
});

// 服务启动
srv.start();
