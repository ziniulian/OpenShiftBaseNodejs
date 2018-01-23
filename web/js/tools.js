// 通用工具

LZR.load([
	"LZR.HTML.Base.Ajax",
    "LZR.HTML.Util.Finger"
]);

var lzr_tools = {
	urls: {
		main: LZR.HTML.domain
	},

	getUrl: function (ids, cb) {
		if (ids) {
			var url = LZR.HTML.domain + "Domain/srvGet/" + ids;
			var ajx = new LZR.HTML.Base.Ajax ();
			ajx.evt.rsp.add(LZR.bind(ajx, lzr_domain.hdUrl, cb));
			ajx.get(url, true);
		} else if (cb) {
			cb(lzr_domain.urls);
		}
	},

	hdUrl: function (cb, txt, sta) {
		if (sta === 200) {
			var d = this.utJson.toObj(txt);
			if (d.ok) {
				d.dat.main = LZR.HTML.domain;
				lzr_domain.urls = d.dat;
				var s, o;
				for (s in d.dat) {
					o = document.getElementById("dmad_" + s);
					if (o) {
						o.href = d.dat[s];
					}
				}
			}
		}
		if (cb) {
			cb(lzr_domain.urls);
		}
	},

    trace: function () {
        var aj = new LZR.HTML.Base.Ajax ();
        var url = encodeURIComponent(window.location.href);
        var uuid = LZR.getSingleton(LZR.HTML.Util.Finger).uuid;
        var dma = LZR.HTML.domain;
        aj.get ((dma + "Vs/srvTrace/" + url + "/" + uuid), true);
    }
};
