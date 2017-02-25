eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

// LZR 子模块加载
LZR.load([
	"LZR.Base.Time",
	"LZR.Pro.TmpTagMgmt"
]);

// 后台接口
var infTtm = new LZR.Pro.TmpTagMgmt ();

// 时间工具
var utTim = LZR.getSingleton(LZR.Base.Time);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 首页跳转
r.get("/", function (req, res) {
	res.redirect("devBrowse/");
});

// 浏览设备
r.get("/devBrowse/:keyword?/:odd?", function (req, res, next) {
	req.qpobj = infTtm.getDevs(req.params.keyword, req.params.odd);
	next();
});

// 设备详情
r.get("/devInfo/:devId?", function (req, res, next) {
	var r = infTtm.getDevInfo(req.params.devId);
	if (r) {
		req.qpobj = r;
		next();
	} else {
		res.redirect("devBrowse/");
	}
});

// 标签详情
r.get("/tagInfo/:tagId?/:tim?", function (req, res, next) {
	var et = new Date();
	var n = req.params.tim;
	if (!n) {
		n = 1;
	}
	var st = utTim.addHour(-n, et, true);
	var r = infTtm.getTag(req.params.tagId, st, et);
	if (r) {
		req.qpobj = r;
		next();
	} else {
		res.redirect("devBrowse/");
	}
});

// 初始化模板
r.initTmp();

module.exports = r;