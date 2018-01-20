// LZR 模块加载
require("lzr");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Util",
	"LZR.Node.Srv",
	"LZR.Node.Db.NodeAjax",
	"LZR.Node.Srv.DomainSrv",
	"LZR.HTML"
]);

var utNode = LZR.getSingleton(LZR.Node.Util);

// var ajax;	// 域名服务演示
// var dmsrv = new LZR.Node.Srv.DomainSrv ({	// 域名服务
// 	hd_ids: "io_home,vs",
// 	hd_fun: function (r) {
// 		// Ajax
// 		ajax = new LZR.Node.Db.NodeAjax ({
// 			hd_sqls: {
// 				vs: dmsrv.ds.vs + "srvTrace/<0>/0/<1>"
// 			}
// 		});
// 	}
// });

// 域名
var dma = LZR.HTML.domain;

// Ajax		// 不使用域名服务的精简方式
var ajax = new LZR.Node.Db.NodeAjax ({
	hd_sqls: {
		vs: "/Vs/srvTrace/<0>/0/<1>"	// 测试用
		// vs: dma + "Vs/srvTrace/<0>/0/<1>"
	}
});

// // 根据 openshift 参数获取 mongodb 连接字
// var getMongoURL = function () {
// 	var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
//
// 	if (!mongoURL && process.env.DATABASE_SERVICE_NAME) {
// 		var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
// 		mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
// 		mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
// 		mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
// 		mongoPassword = process.env[mongoServiceName + '_PASSWORD']
// 		mongoUser = process.env[mongoServiceName + '_USER'];
//
// 		if (mongoHost && mongoPort && mongoDatabase) {
// 			mongoURL = 'mongodb://';
// 			if (mongoUser && mongoPassword) {
// 				mongoURL += mongoUser + ':' + mongoPassword + '@';
// 			}
// 			// Provide UI label that excludes user id and pw
// 			mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
// 		}
// 	}
//
// 	if (mongoURL) {
// 		return mongoURL;
// 	} else {
// 		return "mongodb://localhost:27017/test";
// 	}
// }
//
// // 数据库演示
// var mdb = new LZR.Node.Db.Mongo ({
// 	// conf: getMongoURL(),
// 	conf: process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/test",
// 	autoErr: true,
// 	hd_sqls: {
// 		del: {
// 			tnam: "domain",
// 			funs: {
// 				removeMany: ["<0>"]
// 			}
// 		}
// 	}
// });

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

// 访问记录
srv.ro.get(/(^\/(flawerShop\/)?(index.html)?$)/i, function (req, res, next) {
	ajax.qry("vs", req, res, next, [encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl), utNode.getClientIp(req)]);
	next();
});

// 公共样式
srv.ro.get("/base.css", function (req, res) {
	res.redirect("/css/common/base.css");
});

// 追踪器
srv.ro.get("/trace.js", function (req, res) {
	res.redirect("/js/trace.js");
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
