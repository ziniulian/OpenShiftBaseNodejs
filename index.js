// LZR 模块加载
require("LZR");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv",
	"LZR.Node.Db"
]);

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
});

// 数据库
var mdb = new LZR.Node.Db ({
	conf: process.env.OPENSHIFT_MONGODB_DB_HOST ? (process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + "/test") : "mongodb://localhost:27017/test",
	hd_sqls: {
		srvTrace: {
			tnam: "vs",
			funs: {
				insert: ['{"tim": <0>, "url": "<1>", "uuid": "<2>"}']
			}
		}
	}
});

// // 设置 Ajax 跨域权限
// srv.use("*", function (req, res, next) {
// 	res.set({"Access-Control-Allow-Origin": "*"});
// 	next();
// });

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

// 网站追踪服务
srv.ro.get("/srvTrace/:url/:uuid", function (req, res, next) {
	mdb.qry("srvTrace", req, res, next, [Date.now(), req.params.url, req.params.uuid]);
	res.send("OK");
});

srv.ro.get("/testMongo/", function (req, res, next) {
	var s = "OPENSHIFT_MONGODB_DB_USERNAME : " + process.env.OPENSHIFT_MONGODB_DB_USERNAME;
	s += " , OPENSHIFT_MONGODB_DB_PASSWORD : " + process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
	s += " , OPENSHIFT_MONGODB_DB_HOST : " + process.env.OPENSHIFT_MONGODB_DB_HOST;
	res.send(s);
})

// 作品秀
// srv.use("/Show/", require("./WorkSpace"));

// 日记
srv.use("/Riji/", require("./MyBlog"));

// 收尾处理
srv.use("*", function (req, res) {
	res.status(404).sendFile("err.html", {
		root: "./web/"
	});
});

// 服务启动
srv.start();
