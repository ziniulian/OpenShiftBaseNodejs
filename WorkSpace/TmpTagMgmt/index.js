// 温度标签测试模块

eval("var curPath = " + LZR.getNodejsModelPath.toString() +
	"('./', 'index.js') + '/';");

// LZR 子模块加载
LZR.load([
	"LZR.Pro.TmpTagMgmt"
]);

// 后台接口
var infTtm = new LZR.Pro.TmpTagMgmt ();

// 设备集合测试数据
function devsTest (keyword, isodd) {
	var r = {
		keyword: keyword,
		isodd: isodd,
		devs: {}
	};
	if (!isodd) {
		r.devs.a01 = {
			nam: "大型设备",
			num: "EXP_C_001",
			stat: true
		};
		r.devs.a02 = {
			nam: "中型设备",
			num: "EXP_B_001",
			stat: true
		};
		r.devs.a03 = {
			nam: "小型设备",
			num: "EXP_A_001",
			stat: true
		};
	}
	r.devs.a04 = {
		nam: "大型设备",
		num: "EXP_C_002",
		stat: false
	};
	if (!isodd) {
		r.devs.a05 = {
			nam: "大型设备",
			num: "EXP_C_003",
			stat: true
		};
		r.devs.a06 = {
			nam: "小设备",
			num: "EXP_AA_001",
			stat: true
		};
	}
	r.devs.a07 = {
		nam: "中型设备",
		num: "EXP_B_007",
		stat: false
	};
	if (!isodd) {
		r.devs.a08 = {
			nam: "中型设备",
			num: "EXP_B_003",
			stat: true
		};
		r.devs.a13 = {
			nam: "小型设备",
			num: "EXP_A_011",
			stat: true
		};
	}
	return r;
}

// 设备详情测试数据
function devTest () {
	return {
		nam: "中型设备",
		num: "EXP_B_007",
		stat: false,
		tags: {
			t001: {
				nam: "TAG_B1",
				cur: 35.7,
				stat: true
			},
			t002: {
				nam: "TAG_A",
				cur: 68,
				stat: true
			},
			t003: {
				nam: "TAG_B",
				cur: 37.3,
				stat: true
			},
			t004: {
				nam: "TAG_AB",
				cur: 85.7,
				stat: false
			},
			t008: {
				nam: "TAG_C",
				cur: 66.6,
				stat: true
			}
		}
	};
}

// 标签详情测试数据
function tagTest (hour) {
	var r = {
		nam: "TAG_A",
		max: 60,
		min: 20,
		epc: "XXXXX-XXX",
		tid: "XXX XXX XXX",
		devId: "a13",
		devNam: "小设备"
		// cur: 35.7,
		// tim: 1486539000,	// 时间戳 "2017-2-8 15:30:00"
		// stat: true,
		// logs: {}
	};

	// 生成随机温度值
	var et = Math.floor(new Date().valueOf()/1000);
	var t = et - 300 * 12 * hour;
	var lg = {};
	for (; t <= et; t += 300) {
		lg[t] = Math.floor(Math.random() * 700)/10 + 10;
	}
	r.logs = infTtm.utJson.toJson(lg);
	r.tim = et;
	r.cur = lg[et];
	r.stat = (r.cur >= r.min && r.cur <= r.max);

	return r;
}

infTtm.evt.devs.add(function (keyword, isodd, req, res, next, dat) {
	// req.qpobj = dat;
	req.qpobj = devsTest(keyword, isodd);	// 测试数据
	next();
});
infTtm.evt.dev.add(function (req, res, next, dat) {
	if (dat) {
		req.qpobj = dat;
		next();
	} else {
		req.qpobj = devTest();	// 测试数据
		next();
		// res.redirect(req.baseUrl + "/devBrowse/");
	}
});
infTtm.evt.tag.add(function (hour, req, res, next, dat) {
	// res.send(dat);	// 测试

	if (dat) {
		req.qpobj = dat;
		next();
	} else {
		req.qpobj = tagTest(hour);	// 测试数据
		next();
		// res.redirect(req.baseUrl + "/devBrowse/");
	}
});

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});
// var r = srv.ro;

// 首页跳转
r.get("/", function (req, res) {
	res.redirect("devBrowse/");
});

// 浏览设备
r.get("/devBrowse/:keyword?/:odd?", function (req, res, next) {
	infTtm.getDevs(req.params.keyword, req.params.odd, req, res, next);
});

// 设备详情
r.get("/devInfo/:devId?", function (req, res, next) {
	infTtm.getDevInfo(req.params.devId, req, res, next);
});

// 标签详情
r.get("/tagInfo/:tagId?/:tim?", function (req, res, next) {
	infTtm.getTag(req.params.tagId, req.params.tim, req, res, next);
});

// 初始化模板
r.initTmp();

module.exports = r;
