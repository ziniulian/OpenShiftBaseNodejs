// 域名管理

LZR.load([
	"LZR.Base.Json",
	"LZR.HTML.Util.DomTool",
	"LZR.HTML.Base.Ajax"
]);

var ajx = new LZR.HTML.Base.Ajax ();
var ajxD = new LZR.HTML.Base.Ajax ();
var utJson = LZR.getSingleton(LZR.Base.Json);
var utDomTool = LZR.getSingleton(LZR.HTML.Util.DomTool);
var dat = {
	busy: false,
	pgs: 10,		// 分页个数

	pgd: ["null"],		// 分页位置
	pg: 0,				// 当前页数
	ds: {},			// 数据

	doMark: function (b) {
		if (b) {
			mark.className = "mark";
		} else {
			if (dat.busy) {
				ajx.abort();
			}
			mark.className = "Lc_nosee";
		}
		dat.busy = b;
	},

	qry: function () {
		if (!dat.busy) {
			dat.doMark(true);
			var url = "srvQry/" + (dat.pgs + 1) + "/" + dat.pgd[dat.pg];
			if (keyDom.value) {
				url += "/";
				url += keyDom.value;
			} else {
				url += "/null";
			}
			if (vDom.value) {
				url += "/";
				url += encodeURIComponent(vDom.value);
			}
			tbs.innerHTML = "";
			ajx.get(url, true);
		}
	},

	hdqry: function (txt, sta) {
		var i, d, o, n;
		if (sta === 200) {
			d = utJson.toObj(txt);
			if (d.ok) {
				o = d.dat;
				if (o.length > dat.pgs) {
					n = dat.pgs;
					dat.pgd[dat.pg + 1] = o[dat.pgs].id;
					utDomTool.setProByNam("nextDom", "className", "");
				} else {
					n = o.length;
					utDomTool.setProByNam("nextDom", "className", "Lc_hid");
				}
				if (dat.pg) {
					dat.pgd[dat.pg] = o[0].id;
					utDomTool.setProByNam("preDom", "className", "");
				} else {
					utDomTool.setProByNam("preDom", "className", "Lc_hid");
				}
				dat.ds = {};
				for (i = 0; i < n; i ++) {
					dat.show(o[i]);
				}
			} else if (dat.pg) {
				dat.busy = false;
				dat.prePage();
				return;
			} else {
				utDomTool.setProByNam("nextDom", "className", "Lc_hid");
				utDomTool.setProByNam("preDom", "className", "Lc_hid");
			}
		}
		dat.doMark(false);
	},

	show: function (o) {
		var r = document.createElement("tr");
		var d = document.createElement("td");
		var s = document.createElement("a");

		// 键
		s.href = "javascript: dat.set('" + o.id + "');";
		s.innerHTML = o.id;
		d.appendChild(s);
		r.appendChild(d);

		// 值
		d = document.createElement("td");
		o.dom = d;
		d.innerHTML = o.url;
		r.appendChild(d);

		// 删除
		d = document.createElement("td");
		s = document.createElement("a");
		s.href = "javascript: dat.del('" + o.id + "');";
		s.innerHTML = "删除";
		d.className = "c";
		d.appendChild(s);
		r.appendChild(d);

		o.trdom = r;
		dat.ds[o.id] = o;
		tbs.appendChild(r);
	},

	prePage: function () {
		if (dat.pg) {
			dat.pg --;
		}
		dat.qry();
	},

	nextPage: function () {
		dat.pg ++;
		dat.qry();
	},

	reflush: function () {
		dat.pg = 0;
		dat.pgd = ["null"];
		dat.qry();
	},

	do: function (op, id, url) {
		if (!dat.busy) {
			var ajxUrl;
			switch (op) {
				case "add":
					dat.doMark(true);
					ajxUrl = "srvAdd/" + id + "/" + encodeURIComponent(url);
					break;
				case "del":
					ajxUrl = "srvDel/" + id;
					break;
				case "set":
					ajxUrl = "srvSet/" + id + "/" + encodeURIComponent(url);
					break;
			}
			ajxD.get(ajxUrl, true);
		}
	},

	hddo: function (txt, sta) {
		if (dat.busy) {
			if (sta === 200) {
				var d = utJson.toObj(txt);
				if (d.ok) {
					dat.show(d.dat);
				}
			}
			dat.doMark(false);
		}
	},

	add: function () {
		var id = idDom.value;
		var url = urlDom.value;
		var o;
		if (id && url) {
			o = dat.ds[id];
			if (o) {
				if (url !== o.url) {
					dat.do("set", id, url);
					o.url = url;
					o.dom.innerHTML = url;
				}
			} else {
				dat.do("add", id, url);
			}
			idDom.value = "";
			urlDom.value = "";
		}
		idDom.focus();
	},

	del: function (id) {
		var o = dat.ds[id];
		if (o) {
			dat.do("del", id);
			tbs.removeChild(o.trdom);
			LZR.del(dat.ds, id);
		}
	},

	set: function (id) {
		idDom.value = id;
		urlDom.value = dat.ds[id].url;
		urlDom.focus();
	},

	clear: function () {
		var b = !(idDom.value || urlDom.value) || keyDom.value || vDom.value;
		keyDom.value = "";
		vDom.value = "";
		idDom.value = "";
		urlDom.value = "";
		if (b) {
			dat.reflush();
		}
	}

};

function init() {
	lzr_tools.getDomains("io_home");
	ajx.evt.rsp.add(dat.hdqry);
	ajxD.evt.rsp.add(dat.hddo);

	keyDom.onkeyup = function (e) {
		if (e.keyCode === 13) {		// 回车键
			dat.reflush();
		}
	};

	vDom.onkeyup = function (e) {
		if (e.keyCode === 13) {		// 回车键
			dat.reflush();
		}
	};

	idDom.onkeyup = function (e) {
		if (e.keyCode === 13) {		// 回车键
			urlDom.focus();
		}
	};

	urlDom.onkeyup = function (e) {
		if (e.keyCode === 13) {		// 回车键
			dat.add();
		}
	};

	dat.qry();
}
