eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});

// 作品秀
r.use("/Ttm/", require("./TmpTagMgmt"));

module.exports = r;