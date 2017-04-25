eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

// LZR 子模块加载
// LZR.load([
// 	"LZR.Node.Db"
// ]);

// 数据库
var mdb = new LZR.Node.Db ({
	conf: process.env.OPENSHIFT_MONGODB_DB_HOST ? ("mongodb://" + process.env.OPENSHIFT_MONGODB_DB_HOST + ":" + process.env.OPENSHIFT_MONGODB_DB_PORT + "/test") : "mongodb://localhost:27017/test",
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

mdb.err.connect.add(function (e, req, res, next) {
	res.send(e);
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
	if (sort > 0) {
		sort = 1;
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

// // 初始化模板
// r.initTmp();

module.exports = r;
