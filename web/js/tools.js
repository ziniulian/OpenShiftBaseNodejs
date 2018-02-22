// 通用工具
LZR.load([
	"LZR.Base.Json",
	"LZR.HTML.Base.Ajax",
	"LZR.HTML.Util.DomTool",
	"LZR.HTML.Util.Finger"
]);

var lzr_tools = {
	domains: {
		main: LZR.HTML.domain
	},
	utDomTool: LZR.getSingleton(LZR.HTML.Util.DomTool),
	utJson: LZR.getSingleton(LZR.Base.Json),

	getDomains: function (ids, cb) {
		if (ids) {
			var url = LZR.HTML.domain + "Domain/srvGet/" + ids;
			var ajx = new LZR.HTML.Base.Ajax ();
			ajx.evt.rsp.add(LZR.bind(ajx, lzr_tools.hdDomains, cb));
			ajx.get(url, true);
		} else if (cb) {
			cb(lzr_tools.domains);
		}
	},

	hdDomains: function (cb, txt, sta) {
		if (sta === 200) {
			var d = lzr_tools.utJson.toObj(txt);
			if (d.ok) {
				d.dat.main = LZR.HTML.domain;
				lzr_tools.domains = d.dat;
				var s, o;
				for (s in d.dat) {
					lzr_tools.utDomTool.setProByNam("dmad_" + s, "href", d.dat[s]);
				}
			}
		}
		if (cb) {
			cb(lzr_tools.domains);
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
