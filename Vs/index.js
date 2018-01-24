// 访问统计

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.HTML",
	"LZR.Node.Util",
	"LZR.Node.Db.NodeAjax",
	"LZR.Node.Db.Mongo",
	"LZR.Node.Srv.Result"
]);

var clsR = LZR.Node.Srv.Result;
var utNode = LZR.getSingleton(LZR.Node.Util);

// Ajax，不使用域名服务的精简方式
var ajax = new LZR.Node.Db.NodeAjax ({
	hd_sqls: {
		vs: LZR.HTML.domain + "Vs/srvTrace/<0>/0/<1>"
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
		},

		qry: {
			tnam: "vs",
			funs: {
				find: ["<0>", {"_id":0}],
				sort: [{"tim": -1}],
				limit: ["<1>"],
				toArray: []
			}
		},

		count: {
			tnam: "vs",
			funs: {
				count: ["<0>"]
			}
		},

		del: {
			tnam: "vs",
			funs: {
				removeMany: ["<0>"]
			}
		}
	}
});

mdb.evt.qry.add(function (r, req, res, next) {
	if (r.length) {
		res.json(clsR.get(r));
	} else {
		res.json(clsR.get(null, "暂无数据"));
	}
});

mdb.evt.count.add(function (r, req, res, next) {
	if (r === 0) {
		res.json(clsR.get(r, "", true));
	} else {
		res.json(clsR.get(r));
	}
});

// 创建路由
var r = new LZR.Node.Router ({
	hd_web: "web",
	path: curPath
});

// 网站追踪服务
r.get("/srvTrace/:url/:uuid?/:ip?", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	// var u = decodeURIComponent(req.params.url);
	var u = req.params.url;
	var ip = req.params.ip || utNode.getClientIp(req);
	var id = req.params.uuid || "0";
// console.log(ip);	// 暂不考虑ip的URI编码
	mdb.qry("srvTrace", req, res, next, [Date.now(), u, ip, id]);
	res.json(clsR.get("无返回的OK", "无返回的提交"));
});

// 查询
r.get("/srvQry/:size/:stim/:etim/:uuid?/:ip?/:url?", function (req, res, next) {
	var n = (req.params.size - 0) || 10;
	var s = (req.params.stim - 0) || 1;
	var e = (req.params.etim - 0) || Date.now();
	var d = req.params.uuid;
	var p = req.params.ip;
	var u = req.params.url;
	var q = {
		tim: {
			"$gte": s,
			"$lte": e
		}
	};
	if (d && d !== "null") {
		q.uuid = {"$in": d.split(",")};
	}
	if (p && p !== "null") {
		q.ip = {"$in": p.split(",")};
	}
	if (u) {
		// q.url = {"$regex": new RegExp(u)};	// 模糊查询
		q.url = u;
	}
	if (n > 0) {
		mdb.qry("qry", req, res, next, [q, n]);
	} else if (n === -2) {
		mdb.qry("del", req, res, next, [q]);
		res.json(clsR.get(null, "无返回的删除"));
		// 记录删除的操作日志
		ajax.qry("vs", req, res, next, [encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl), utNode.getClientIp(req)]);
	} else {
		mdb.qry("count", req, res, next, [q]);
	}
});

module.exports = r;
