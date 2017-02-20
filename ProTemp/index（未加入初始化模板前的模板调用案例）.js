eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web",
	hd_tmp: "tmp"
});

// 模板里用到的静态文件夹
r.all("/tmp/*/tmp2web/*", function (req, res) {
	console.log (curPath);
	console.log (req.url);
	console.log (req.baseUrl);
	console.log (req.path);
	console.log (req.originalUrl);
	console.log (req.params);
	res.send("OK!");
});

// 模板调用
r.all("/tmp/:dotNam/:userNam/", function (req, res) {
	var t = r.getTmp(req.params.dotNam, {
		nam: req.params.userNam
	});
	if (t) {
		res.send(t);
	} else {
		res.redirect("/err/");
	}
});

// 嵌入其它项目
r.use("/Test/", require("./ProTest"));

module.exports = r;