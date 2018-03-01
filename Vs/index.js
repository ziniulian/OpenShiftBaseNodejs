// 访问统计

// post 参数解析工具
var bodyParser = require("body-parser");

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Base.Math",
	"LZR.Node.Util",
	"LZR.Node.Srv.Result",
	"LZR.Node.Srv.ComDbSrv"
]);
var clsR = LZR.Node.Srv.Result;
var utMath = LZR.getSingleton(LZR.Base.Math);
var utNode = LZR.getSingleton(LZR.Node.Util);

// 常用数据库
var cmdb = new LZR.Node.Srv.ComDbSrv ({
	qryDelAble: true,
	qrySort: -1
});
cmdb.initDb(
	(process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/test"),
	"vs"
);

// 创建路由
var r = new LZR.Node.Router ({
	hd_web: "web",
	path: curPath
});

// 解析 post 参数
r.use("*", bodyParser.urlencoded({ extended: false }));

r.post("/srvTrace/", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	var u = req.body.url;
	if (u) {
		var o = {
			"tim": Date.now(),
			"url": req.body.url,
			"ip": req.body.ip || utNode.getClientIp(req),
			"uuid": req.body.uuid || "0"
		};
		if (req.body.dbLog) {
			// o.dbLog = utJson.toObj (req.body.dbLog);		// BUG: 对象被解析后 若有 $开头的关键字，将会添加失败！
			o.dbLog = req.body.dbLog;
		}
		cmdb.add(req, res, next, false, o);
	} else {
		res.json(clsR.get(0, "缺少 url", false));
	}
});

// 查询
r.post("/srvQry/", function (req, res, next) {
	var d = req.body.uuid;
	var p = req.body.ip;
	var u = req.body.url;
	var s = utMath.str2num(req.body.stim);
	var e = utMath.str2num(req.body.etim);
	var q = {};
	if (s) {
		q.tim = {
			"$gte": s
		};
	}
	if (e) {
		if (!q.tim) {
			q.tim = {};
		}
		q.tim["$lte"] = e;
	}
	if (d) {
		q.uuid = {"$in": d.split(",")};
	}
	if (p) {
		q.ip = {"$in": p.split(",")};
	}
	if (u) {
		// q.url = {"$regex": new RegExp(u)};	// 模糊查询
		q.url = u;
	}
	cmdb.qry( req, res, next, "tim", utMath.str2num(req.body.tim), q, {"_id": 0} );
});

// 开启日志
r.get("/openLog/", function (req, res, next) {
	if (cmdb.logAble === 0) {
		cmdb.logAble = 1;
		cmdb.initAjx();
		res.send("正在开启日志 ...");
	} else {
		res.send("日志已开启!");
	}
});

module.exports = r;
