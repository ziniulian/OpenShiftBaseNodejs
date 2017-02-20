eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath
});

// 嵌入其它项目
r.use("/Test/", require("./ProTest"));

// 模板参数处理
r.all("/:dotNam/:nam?/:b?/:c?/", function (req, res, next) {
/*
	if (!req.qpobj) {
		req.qpobj = {};
	}
	for (var s in req.params) {
		req.qpobj[s] = req.params[s];
	}
*/
	req.qpobj = req.params;
	next();
});

// 初始化模板
r.initTmp();

module.exports = r;