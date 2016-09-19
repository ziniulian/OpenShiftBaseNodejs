eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

var r = new LZR.Node.Router ({
	path: curPath
});

module.exports = r;