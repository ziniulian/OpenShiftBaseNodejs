// 域名管理

LZR.load([
	"LZR.Base.Json",
	"LZR.HTML.Base.Ajax"
]);

var ajx = new LZR.HTML.Base.Ajax ();
var ajxD = new LZR.HTML.Base.Ajax ();
var utJson = LZR.getSingleton(LZR.Base.Json);
var dat = {
	busy: false,
	pgs: 10,		// 分页个数

	pgd: ["null"],		// 分页位置
	pg: 0,				// 当前页数

	settmp: null,	// 修改用缓存

	doMark: function (b) {
		if (b) {
			mark.className = "mark";
		} else {
			if (dat.busy) {
				ajx.abort();
				ajxD.abort();
			}
			mark.className = "Lc_nosee";
		}
		dat.busy = b;
	},

	qry: function () {
		dat.setcl();
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
					nextDom.className = "";
				} else {
					n = o.length;
					nextDom.className = "Lc_hid";
				}
				if (dat.pg) {
					dat.pgd[dat.pg] = o[0].id;
					preDom.className = "";
				} else {
					preDom.className = "Lc_hid";
				}
				for (i = 0; i < n; i ++) {
					dat.show(o[i]);
				}
			} else if (dat.pg) {
				dat.busy = false;
				dat.prePage();
				return;
			} else {
				tbs.innerHTML = "<tr><td /><td /><td>暂无数据</td></tr>";
			}
		}
		dat.doMark(false);
	},

	show: function (o) {
		var r = document.createElement("tr");
		var d = document.createElement("td");
		var s = document.createElement("a");

		// 删除
		s.href = "javascript: dat.do('del', '" + o.id + "');";
		s.innerHTML = "删除";
		d.className = "c";
		d.appendChild(s);
		r.appendChild(d);

		// 键
		d = document.createElement("td");
		d.innerHTML = o.id;
		r.appendChild(d);

		// 值
		d = document.createElement("td");
		d.id = "vdom_" + o.id;
		d.innerHTML = o.url;
		r.appendChild(d);

		// 修改
		d = document.createElement("td");
		d.className = "c";
		s = document.createElement("a");
		s.id = "setdom_" + o.id;
		s.href = "javascript: dat.set('" + o.id + "');";
		s.innerHTML = "修改";
		d.appendChild(s);
		s = document.createElement("a");
		s.id = "setsavdom_" + o.id;
		s.href = "javascript: dat.setsav();";
		s.innerHTML = "保存<br />";
		s.className = "Lc_nosee";
		d.appendChild(s);
		s = document.createElement("a");
		s.id = "setcldom_" + o.id;
		s.href = "javascript: dat.setcl();";
		s.innerHTML = "取消";
		s.className = "Lc_nosee";
		d.appendChild(s);
		r.appendChild(d);

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
					ajxUrl = "srvAdd/" + id + "/" + encodeURIComponent(url);
					break;
				case "del":
					ajxUrl = "srvDel/" + id;
					break;
				case "set":
					ajxUrl = "srvSet/" + id + "/" + encodeURIComponent(url);
					break;
			}
			dat.doMark(true);
			ajxD.get(ajxUrl, true);
		}
	},

	hddo: function (txt, sta) {
		dat.busy = false;
		dat.qry();
	},

	add: function () {
		var id = idDom.value;
		var url = urlDom.value;
		if (id && url) {
			dat.pg = 0;
			dat.pgd = ["null"];
			dat.do("add", id, url);
			idDom.value = "";
			urlDom.value = "";
		}
		idDom.focus();
	},

	set: function (id) {
		var d = document.getElementById("vdom_" + id);
		var s = document.createElement("input");
		dat.setcl();
		document.getElementById("setdom_" + id).className = "Lc_nosee";
		document.getElementById("setcldom_" + id).className = "set";
		document.getElementById("setsavdom_" + id).className = "set";
		dat.settmp = {
			id: id,
			url: d.innerHTML,
			dom: s
		};
		s.onfocus = function () {
			this.select();
		};
		s.onkeyup = function (e) {
			if (e.keyCode === 13) {		// 回车键
				dat.setsav();
			}
		};
		s.type = "text";
		s.placeholder = "请输入新的URL";
		s.value = dat.settmp.url;
		d.innerHTML = "";
		d.appendChild(s);
		s.focus();
	},

	setcl: function () {
		if (dat.settmp) {
			document.getElementById("setdom_" + dat.settmp.id).className = "";
			document.getElementById("setcldom_" + dat.settmp.id).className = "Lc_nosee";
			document.getElementById("setsavdom_" + dat.settmp.id).className = "Lc_nosee";
			document.getElementById("vdom_" + dat.settmp.id).innerHTML = dat.settmp.url;
			dat.settmp = null;
		}
	},

	setsav: function () {
		var id = dat.settmp.id;
		var url = dat.settmp.dom.value;
		if (dat.settmp.url !== url) {
			dat.settmp.url = url;
			dat.setcl();
			dat.do("set", id, url);
		} else {
			dat.setcl();
		}
	},

	clear: function () {
		keyDom.value = "";
		vDom.value = "";
		dat.reflush();
	}

};

function init() {
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
