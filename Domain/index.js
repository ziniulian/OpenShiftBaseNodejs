// 域名服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db.Mongo",
	"LZR.Node.Srv.Result"
]);
var clsR = LZR.Node.Srv.Result;

// 数据库
var mdb = new LZR.Node.Db.Mongo ({
	conf: process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/test",
	autoErr: true,
	hd_sqls: {
		get: {
			tnam: "domain",
			funs: {
				find: ["<0>", {"_id":0}],
				toArray: []
			}
		},

		qry: {
			tnam: "domain",
			funs: {
				find: ["<0>", {"_id":0}],
				sort: [{"id": 1}],
				limit: ["<1>"],
				toArray: []
			}
		},

		count: {
			tnam: "domain",
			funs: {
				count: ["<0>"]
			}
		},

		add: {
			tnam: "domain",
			funs: {
				insertOne: ["<0>"]
			}
		},

		del: {
			tnam: "domain",
			funs: {
				removeOne: ["<0>"]
			}
		},

		set: {
			tnam: "domain",
			funs: {
				updateOne: ["<0>", "<1>"]
			}
		}
	}
});

mdb.evt.get.add(function (r, req, res, next) {
	switch (req.qpobj.qryTyp) {
		case "srvGet":
			if (r.length) {
				var i, o = {};
				for (i = 0; i < r.length; i ++) {
					o[r[i].id] = r[i].url;
				}
				res.json(clsR.get(o));
			} else {
				res.json(clsR.get(null, "暂无数据"));
			}
			break;
		case "srvAdd":
			if (r.length) {
				res.json(clsR.get(r[0], r[0].id + " 已存在", false));
			} else {
				mdb.qry("add", req, res, next, [req.qpobj.o]);
				res.json(clsR.get(req.qpobj.o));
			}
			break;
		case "srvDel":
			if (r.length) {
				mdb.qry("del", req, res, next, [{id: req.qpobj.id}]);
				res.json(clsR.get(r[0]));
			} else {
				res.json(clsR.get(null, req.qpobj.id + " 不存在"));
			}
			break;
		case "srvSet":
			if (r.length) {
				if (r[0].url !== req.qpobj.url) {
					mdb.qry("set", req, res, next, [{id:req.qpobj.id}, {"$set":{url:req.qpobj.url}}]);
					r[0].oldUrl = r[0].url;
					r[0].url = req.qpobj.url;
				}
				res.json(clsR.get(r[0]));
			} else {
				res.json(clsR.get(null, req.qpobj.id + " 不存在"));
			}
			break;
		default:
			res.json(clsR.get(r));
			break;
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
	path: curPath,
	hd_web: "web"
});

// 获取域名
r.get("/srvGet/:ids", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	req.qpobj = {
		qryTyp: "srvGet"
	};
	mdb.qry("get", req, res, next, [{"id": {"$in": req.params.ids.split(",")}}]);
});

// 分页查询域名
r.get("/srvQry/:size/:start?/:idLike?/:urlLike?", function (req, res, next) {
	var n = (req.params.size - 0) || 10;
	var s = req.params.start;
	var d = req.params.idLike;
	var u = req.params.urlLike;
	var q = {};
	if (s && s !== "null") {
		q.id = {"$gte": s};
	}
	if (d && d !== "null") {
		if (q.id) {
			q.id["$regex"] = new RegExp(d);
		} else {
			q.id = {"$regex": new RegExp(d)};
		}
	}
	if (u) {
		q.url = {"$regex": new RegExp(u)};
	}
	mdb.qry("qry", req, res, next, [q, n]);
});

// 获取域名总数
r.get("/srvCount", function (req, res, next) {
	mdb.qry("count", req, res, next, [{}]);
});

// 添加域名
r.get("/srvAdd/:id/:url", function (req, res, next) {
	req.qpobj = {
		qryTyp: "srvAdd",
		o: {
			id: req.params.id,
			url: decodeURIComponent(req.params.url)
		}
	};
	mdb.qry("get", req, res, next, [{"id":req.params.id}]);
});

// 删除域名
r.get("/srvDel/:id", function (req, res, next) {
	req.qpobj = {
		qryTyp: "srvDel",
		id: req.params.id,
	};
	mdb.qry("get", req, res, next, [{"id":req.params.id}]);
});

// 修改域名
r.get("/srvSet/:id/:url", function (req, res, next) {
	req.qpobj = {
		qryTyp: "srvSet",
		id: req.params.id,
		url: decodeURIComponent(req.params.url)
	};
	mdb.qry("get", req, res, next, [{"id":req.params.id}]);
});

module.exports = r;
