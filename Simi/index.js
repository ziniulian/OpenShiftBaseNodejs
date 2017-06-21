// 分类模块

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db.Mongo"
]);

/*
// 数据结构
{
	_id: ObjectId("xxxx"),	// ID号
	nam: "",	// 分类名称
	par: mdb.clsOid("xxxx"),	// 父类ID
	able: true	// 是否可用
}
*/

// 数据库
var mdb = new LZR.Node.Db.Mongo ({
	conf: process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL : "mongodb://localhost:27017/test",
	// autoErr: true,
	hd_sqls: {
		// 添加一个分类
		srvAdd: {
			db: "test",
			tnam: "simi",
			funs: {
				findOneAndReplace: [
					{nam: "<0>", par: "<1>"},
					{nam: "<0>", par: "<1>", able: true},
					{upsert: true, returnOriginal: false}
				]
			}
		},

		// 获取一个分类
		srvGet: {
			db: "test",
			tnam: "simi",
			funs: {
				findOne: [{_id: "<0>"}]
			}
		},

		// 获取一个分类的所有子类，不递归
		srvGetSub: {
			db: "test",
			tnam: "simi",
			funs: {
				find: [{_id: "<0>", able: true}],
				toArray: []
			}
		},

				// // 删除一个分类，及其下所有子类
				// srvDel: {
				// 	db: "test",
				// 	tnam: "simi",
				// 	funs: {
				// 		updateOne: [{"_id": {"$in": "<0>"}}, {"$set": {"able": false}}]
				// 	}
				// },
				//
				// // 恢复一个分类，及其下所有子类
				// srvUndo: {
				// 	db: "test",
				// 	tnam: "simi",
				// 	funs: {
				// 		updateOne: [{"_id": {"$in": "<0>"}}, {"$set": {"able": true}}]
				// 	}
				// },

		// 修改一个分类
		srvChg: {
			db: "test",
			tnam: "simi",
			funs: {
				findOneAndUpdate: [
					{_id: "<0>", able: true},
					{$set: "<1>"},
					{returnOriginal: false}
				]
			}
		},

		// 获取一个分类，包含其所有父类
		srvGetLong: {
			db: "test",
			tnam: "simi",
			funs: {
				findOne: [{_id: "<0>", able: true}]
			}
		},

		// 递归获取一个分类，包含其所有子类
		srvGetAll: {
			db: "test",
			tnam: "simi",
			funs: {
				find: ["<0>", {"nam": 1}],
				toArray: []
			}
		}

	}
});

// 添加一个分类
mdb.evt.srvAdd.add(function (r, req, res, next) {
	res.json(r.value);
});

// 获取一个分类
mdb.evt.srvGet.add(function (r, req, res, next) {
	res.json(r);
});

// 获取一个分类的所有子类，不递归
mdb.evt.srvGetSub.add(function (r, req, res, next) {
	res.json(r);
});

// 修改一个分类
mdb.evt.srvChg.add(function (r, req, res, next) {
	res.json(r.value);
});

// 获取一个分类，包含其所有父类
mdb.evt.srvGetLong.add(function (r, req, res, next) {
	if (req.qpobj.aSimi) {
		req.qpobj.curSimi.par = r;
	} else {
		req.qpobj.aSimi = r;
	}
	req.qpobj.curSimi = r;

	if (r && r.par) {
		mdb.qry("srvGetLong", req, res, next, [r.par]);
	} else {
		res.json(req.qpobj.aSimi);
	}
});

// 递归获取一个分类，包含其所有子类
mdb.evt.srvGetAll.add(function (r, req, res, next) {
	// if (r) {
	// 	if (req.qpobj.aSimi) {
	// 		req.qpobj.curSimi.par = r;
	// 	} else {
	// 		req.qpobj.aSimi = r;
	// 		req.qpobj.curSimis = r;
	// 		mdb.qry("srvGetAll", req, res, next, [{par: r._id, able: true}]);
	// 	}
	// } else if (req.qpobj.aSimi) {
	// 	res.json(req.qpobj.aSimi);
	// } else {
	// 	res.send("null");
	// }
});

/*
srvDel
srvUndo
*/

// 创建路由
var r = new LZR.Node.Router ({
	// hd_web: "web",
	path: curPath
});

// 添加一个分类
r.get("/srvAdd/:nam/:par?", function (req, res, next) {
	try {
		var sp = req.params.par;
		var op = sp ? new mdb.clsOid(sp) : null;
		mdb.qry("srvAdd", req, res, next, [req.params.nam, op]);
	} catch (e) {
		res.send("null");
	}
});

// 获取一个分类
r.get("/srvGet/:id", function (req, res, next) {
	try {
		var oid = new mdb.clsOid(req.params.id);
		mdb.qry("srvGet", req, res, next, [oid]);
	} catch (e) {
		res.send("null");
	}
});

// 获取一个分类的所有子类，不递归（不带参数，则返回所有顶级分类）
r.get("/srvGetSub/:par?", function (req, res, next) {
	try {
		var sp = req.params.par;
		var op = sp ? new mdb.clsOid(sp) : null;
		mdb.qry("srvGetSub", req, res, next, [op]);
	} catch (e) {
		res.send("[]");
	}
});

// 修改一个分类
r.get("/srvChg/:id/:nam?/:par?", function (req, res, next) {
	var nam = req.params.nam;
	var par = req.params.par;
	var o = {};
	var b = false;
	var oid;

	try {
		oid = new mdb.clsOid(req.params.id);
	} catch (e) {
		res.send("null");
		return;
	}

	if (nam && nam !== "null") {
		// nam 为 null 时，不修改 nam
		b = true;
		o.nam = nam;
	}

	if (par) {
		b = true;
		if (par === "null") {
			o.par = null;
		} else {
			try {
				o.par = new mdb.clsOid(par);
			} catch (e) {
				b = false;
			}
		}
	}

	if (b) {
		mdb.qry("srvChg", req, res, next, [oid, o]);
	} else {
		// 无修改内容时，返回该分类信息
		mdb.qry("srvGet", req, res, next, [oid]);
	}
});

// 获取一个分类，包含其所有父类
r.get("/srvGetLong/:id", function (req, res, next) {
	req.qpobj = {};
	try {
		var oid = new mdb.clsOid(req.params.id);
		mdb.qry("srvGetLong", req, res, next, [oid]);
	} catch (e) {
		res.send("null");
	}
});

// 递归获取一个分类，包含其所有子类
r.get("/srvGetAll/:id",function (req, res, next) {
	req.qpobj = {};
	try {
		var oid = new mdb.clsOid(req.params.id);
		mdb.qry("srvGetAll", req, res, next, [{_id: oid, able: true}]);
	} catch (e) {
		res.send("null");
	}
});









// 删除一个分类，及其下所有子类
r.get("/srvDel",function (req, res, next) {
	mdb.qry("srvDel", req, res, next);
});

// 恢复一个分类，及其下所有子类
r.get("/srvUndo",function (req, res, next) {
	mdb.qry("srvUndo", req, res, next);
});

// // 初始化模板
// r.initTmp();

module.exports = r;
