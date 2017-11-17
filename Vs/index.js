// 访问统计

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db.Mongo"
]);

var utNode = LZR.getSingleton(LZR.Node.Util);

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

// 数据库
var mdb = new LZR.Node.Db.Mongo ({
	// conf: getMongoURL(),
	conf: process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/test",
	autoErr: true,
	hd_sqls: {
		srvTrace: {
			tnam: "vs",
			funs: {
				insertOne: [{"tim": "<0>", "url": "<1>", "ip": "<2>", "uuid": "<3>"}]
			}
		}
	}
});

mdb.evt.srvTrace.add(function (r, req, res, next) {
	res.send(r);
});

// 创建路由
var r = new LZR.Node.Router ({
	// hd_web: "web",
	path: curPath
});

// 网站追踪服务
r.get("/srvTrace/:url/:uuid?/:ip?", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	var u = decodeURIComponent(req.params.url);
	var ip = req.params.ip || utNode.getClientIp(req);
	var id = req.params.uuid || 0;
// console.log(ip);	// 暂不考虑ip的URI编码
	mdb.qry("srvTrace", req, res, next, [Date.now(), u, ip, id]);
});

// // 初始化模板
// r.initTmp();

module.exports = r;
