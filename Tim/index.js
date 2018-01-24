// 时间服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Base.Time",
	"LZR.Node.Srv.Result"
]);
var clsR = LZR.Node.Srv.Result;
var utTim = LZR.getSingleton(LZR.Base.Time);

// 创建路由
var r = new LZR.Node.Router ({
	hd_web: "web",
	path: curPath
});

// 获取时间戳
r.get("/srvNow/", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	res.json(clsR.get( Date.now() ));
});

// 获取时间值
r.get("/srvTime/", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	res.json(clsR.get( utTim.format(new Date(), "datetim2") ));
});

// 时间测试
r.get("/srvTestTim/:t/:v?", function (req, res, next) {
	if (req.params.v) {
		res.json(clsR.get(utTim.parseDayTimestamp(req.params.v)));
	} else {
		res.json(clsR.get(utTim.getDayTimestamp(req.params.t)));
	}
});

module.exports = r;
