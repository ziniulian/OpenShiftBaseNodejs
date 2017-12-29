// 时间服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv.Result"
]);
var clsR = LZR.Node.Srv.Result,

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 网站追踪服务
r.get("/srvNow/", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	res.json(clsR.get( Date.now() ));
});

module.exports = r;
