// 访问管理

LZR.load([
	"LZR.HTML.Srv.ComDbQry",
	"LZR.Base.Time"
]);

var utTim = LZR.getSingleton(LZR.Base.Time);
var dat = {
	timtmp: new Date(),	// 时间缓存

	// 数据库访问工具
	db: new LZR.HTML.Srv.ComDbQry ({
		pgs: 10,
		sort: -1,
		keyNam: "tim",
		mark: {
			showCss: "mark",
			hidCss: "Lc_nosee"
		},
		btn: {
			preNam: "preDom",
			nextNam: "nextDom",
			showCss: "",
			hidCss: "Lc_hid"
		},
		url: {
			qry: "srvQry/"
		}
	}),

	// 数据库初始化
	initDb: function () {
		dat.db.mark.doe = document.getElementById("mark");
		dat.db.evt.qryb.add(function (o) {
			tbs.innerHTML = "";
			o.stim = utTim.getTim(stimDom.value + " 0:0");
			o.etim = utTim.getTim(etimDom.value + " 0:0") + 86399999;
			if (idDom.value) {
				o.uuid = idDom.value;
			}
			if (ipDom.value) {
				o.ip = ipDom.value;
			}
			if (urlDom.value) {
				o.url = urlDom.value;
			}
		});
		dat.db.evt.qryr.add(function (o) {
			for (var i = 0; i < o.length; i ++) {
				dat.show(o[i]);
			}
		});
	},

	show: function (o) {
		var r = document.createElement("tr");
		var d = document.createElement("td");

		// 时间
		dat.timtmp.setTime(o.tim);
		// d.innerHTML = utTim.format(dat.timtmp, "yyyy-MM-dd hh:mm:ss:fff");
		d.innerHTML = utTim.format(dat.timtmp, "datetim");
		r.appendChild(d);

		// URL
		d = document.createElement("td");
		d.innerHTML = o.url;
		r.appendChild(d);

		// IP
		d = document.createElement("td");
		d.innerHTML = o.ip;
		r.appendChild(d);

		// ID
		d = document.createElement("td");
		d.innerHTML = o.uuid;
		r.appendChild(d);

		tbs.appendChild(r);
	},

	keyUp: function (e) {
		if (e.keyCode === 13) {		// 回车键
			dat.db.first();
		}
	},

	chgTim: function () {
		var t;
		switch (cycDom.value) {
			case "all":
				stimDom.value = "1985-06-17";
				etimDom.value = utTim.format(new Date(), "date2");
				break;
			case "d3":
				t = new Date(etimDom.value);
				stimDom.value = utTim.format(utTim.addHour(-48, t), "date2");
				break;
			case "w1":
				t = new Date(etimDom.value);
				stimDom.value = utTim.format(utTim.addHour(-144, t), "date2");
				break;
			case "m1":
				t = new Date(etimDom.value);
				t.setMonth(-1);
				stimDom.value = utTim.format(t, "date2");
				break;
			case "m3":
				t = new Date(etimDom.value);
				t.setMonth(-3);
				stimDom.value = utTim.format(t, "date2");
				break;
			case "m6":
				t = new Date(etimDom.value);
				t.setMonth(-6);
				stimDom.value = utTim.format(t, "date2");
				break;
			case "y1":
				t = new Date(etimDom.value);
				t.setFullYear(t.getFullYear() - 1);
				stimDom.value = utTim.format(t, "date2");
				break;
			default:	// now
				t = utTim.format(new Date(), "date2");
				stimDom.value = t;
				etimDom.value = t;
				break;
		}
		dat.db.first();
	},

	clear: function () {
		var b = !idDom.value && !ipDom.value && !urlDom.value;
		if (b) {
			dat.db.qry();
		} else {
			idDom.value = "";
			ipDom.value = "";
			urlDom.value = "";
			dat.db.first();
		}
	}

};

function init() {
	lzr_tools.getDomains("io_home");
	dat.initDb();
	idDom.onkeyup = dat.keyUp;
	urlDom.onkeyup = dat.keyUp;
	ipDom.onkeyup = dat.keyUp;
	dat.chgTim();
	lzr_tools.trace();
}
