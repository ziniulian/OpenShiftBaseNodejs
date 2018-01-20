// 访问统计

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db.Mongo",
	"LZR.Node.Srv.Result"
]);

var clsR = LZR.Node.Srv.Result;
var utNode = LZR.getSingleton(LZR.Node.Util);

// 数据库
var mdb = new LZR.Node.Db.Mongo ({
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
	res.json(clsR.get("无返回的OK"));
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
		q.url = {"$regex": new RegExp(u)};
	}
	if (n < 0) {
		mdb.qry("count", req, res, next, [q]);
	} else {
		mdb.qry("qry", req, res, next, [q, n]);
	}
});

module.exports = r;
