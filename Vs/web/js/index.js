// 访问管理

LZR.load([
	"LZR.Base.Json",
	"LZR.HTML.Base.Ajax"
]);

var ajx = new LZR.HTML.Base.Ajax ();
var ajxD = new LZR.HTML.Base.Ajax ();
var utJson = LZR.getSingleton(LZR.Base.Json);
var dat = {
	busy: false,
	pgs: 7,			// 分页个数

	pgd: ["null"],	// 分页位置
	pg: 0,			// 当前页数
	ds: {},			// 数据

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

};

function init() {
}
