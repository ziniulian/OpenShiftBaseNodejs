// 前期测试模块，及部分作品秀

eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});

// 温度标签测试
r.use("/Ttm/", require("./TmpTagMgmt"));

module.exports = r;
