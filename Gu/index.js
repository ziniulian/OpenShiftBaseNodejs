eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db",
	"LZR.Base.Json"
]);

var utJson = LZR.getSingleton(LZR.Base.Json);

// 数据库
var mdb = new LZR.Node.Db ({
	conf: process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL : "mongodb://localhost:27017/test",
	autoErr: true,
	hd_sqls: {
		jsonpOptionalStockDat: {
			db: "test",
			tnam: "optionalStock",
			funs: {
				find: [{}, {"_id": 0}],
				toArray: []
			}
		}
	}
});

mdb.evt.jsonpOptionalStockDat.add(function (r, req, res, next) {
	var s = "var lzr_optionalStock_dat=";
	s += utJson.toJson(r);
	s += ";";
	res.send(s);
});

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});
// var r = srv.ro;

// 获取JSONP格式的自选股数据信息
r.get("/jsonpOptionalStockDat", function (req, res, next) {
	mdb.qry("jsonpOptionalStockDat", req, res, next);
});

// // 初始化模板
// r.initTmp();

module.exports = r;