eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

// LZR 子模块加载
// LZR.load([
// 	"LZR.Node.Db"
// ]);

// 数据库
var mdb = new LZR.Node.Db ({
	conf: process.env.OPENSHIFT_MONGODB_DB_HOST ? (process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + "/test") : "mongodb://localhost:27017/test",
	hd_sqls: {
		srvGetBlog: {
			tnam: "blog",
			evt: true,
			funs: {
				find: ["<0>", {"_id": 0, "tim": 1, "gistId": 1, "title": 1}],
				sort: ['{"tim": <1>}'],
				limit: ["<2>"],
				toArray: []
			}
		},
		srvSetBlog: {
			tnam: "blog",
			funs: {
				insert: ["<0>"]
			}
		},
		srvBlogCount: {
			tnam: "blog",
			evt: true,
			funs: {
				count: []
			}
		}
	}
});

mdb.evt.srvGetBlog.add(function (r, req, res, next) {
	res.send(r);
});

mdb.evt.srvBlogCount.add(function (r, req, res, next) {
	res.send(r.toString());
});

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});
// var r = srv.ro;

// 返回 gist 文本信息
r.get("/gistTxt/:id", function (req, res, next) {
	res.send("<script type=\"text/javascript\" src=\"/myLib/LZR.js\"></script><script type=\"text/javascript\" src=\"/js/trace.js\"></script><script type=\"text/javascript\" src=\"https://gist.githubusercontent.com/ziniulian/" + req.params.id + ".js\"></script>");
});

// 获取总数
r.get("/srvBlogCount", function (req, res, next) {
	mdb.qry("srvBlogCount", req, res, next);
});

// 插入一笔信息
r.get("/srvSetBlog/:tim/:id/:title?", function (req, res, next) {
	var s = "{\"tim\": " + req.params.tim + ", \"gistId\": \"" + req.params.id + "\"";
	var t = req.params.title;
	if (t) {
		s += ", \"title\": \"" + t + "\"}";
	} else {
		s += "}";
	}
	mdb.qry("srvSetBlog", req, res, next, [s]);
	res.send("OK!");
});

// 获取信息
r.get("/srvGetBlog/:size?/:sort?/:top?/:max?/:min?", function (req, res, next) {
	var size = req.params.size || "10";
	var sort = req.params.sort;
	var top = req.params.top;
	var max = req.params.max;
	var min = req.params.min;
	var s;
	if (top == 0) top = undefined;
	if (sort == 1) {
		s = top || min;
		if (max) {
			s = "{\"tim\" : {\"$lte\": " + max + ", \"$gte\": " + s + "}}";
		} else {
			if (s) {
				s = "{\"tim\": {\"$gte\": " + s + "}}";
			} else {
				s = "{}";
			}
		}
	} else {
		sort = "-1";
		s = top || max;
		if (min) {
			s = "{\"tim\" : {\"$lte\": " + s + ", \"$gte\": " + min + "}}";
		} else {
			if (s) {
				s = "{\"tim\": {\"$lte\": " + s + "}}";
			} else {
				s = "{}";
			}
		}
	}

	mdb.qry("srvGetBlog", req, res, next, [s, sort, size]);
});

// // 获取日记信息
// r.get("/hom/:size?/:sort?/:top?/:year?/:month?", function (req, res, next) {
// 	req.qpobj = {
// 		size: req.params.size || "10",
// 		sort: req.params.sort || "-1",
// 		top: req.params.top || 0,
// 		y: req.params.year || 0,
// 		m: req.params.month || 0
// 	};
// 	var td = new Date();
// 	var to = td.getTimezoneOffset() * 60000;
// 	var tp = 3600 * 1000 * 24;
// 	var max, min, s;
// 	if (req.qpobj.y) {
// 		req.qpobj.y = (req.qpobj.y - 0);
// 		if (req.qpobj.m) {
// 			req.qpobj.m = (req.qpobj.m - 0);
// 			min = new Date (req.qpobj.y + "/" + req.qpobj.m + "/1");
// 			if (req.qpobj.m === 12) {
// 				s = req.qpobj.y + 1;
// 				s = s + "/1/1";
// 			} else {
// 				s = req.qpobj.m + 1;
// 				s = req.qpobj.y + "/" + s + "/1";
// 			}
// 			max = new Date (s);
// 		} else {
// 			min = new Date (req.qpobj.y + "/1/1");
// 			s = req.qpobj.y + 1;
// 			max = new Date (s + "/1/1");
// 		}
// 		max = Math.floor((max.valueOf() - to) / tp);
// 		min = Math.floor((min.valueOf() - to) / tp);
// 		s = '{"tim" : {"$lt": ' + max + ', "$gte": ' + min + "}}";
// 	} else if (req.qpobj.top) {
// 		s = '{"tim": {"$lt": ' + req.qpobj.top + "}}";
// 	} else {
// 		s = "{}";
// 	}
//
// 	mdb.qry("getBlog", req, res, next, [s, req.params.sort, req.params.size]);
// });

// // 初始化模板
// r.initTmp();

module.exports = r;
