eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});

// 嵌入其它项目
r.use("/Test/", require("./ProTest"));

module.exports = r;