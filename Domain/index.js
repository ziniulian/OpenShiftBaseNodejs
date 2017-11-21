// 访问统计

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");
var utDma = LZR.getSingleton(LZR.Node.Srv.DomainSrv);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 获取域名
r.get("/get/:key?", function (req, res, next) {
	res.set({"Access-Control-Allow-Origin": "*"});	// 跨域
	var u = utDma.get(req.params.key)
	res.send(u);
});

module.exports = r;
