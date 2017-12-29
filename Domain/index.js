// 域名服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");
var utDma = LZR.getSingleton(LZR.Node.Srv.DomainSrv);

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv.Result"
]);
var clsR = LZR.Node.Srv.Result,

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 获取域名
r.get("/srvGet/:key?", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	var u = utDma.get(req.params.key)
	res.json(clsR.get( u ));
});

module.exports = r;
