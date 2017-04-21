LZR.load([
    "LZR.Base.Data",
    "LZR.Base.Val.Ctrl",
    "LZR.HTML.Base.Doe",
	"LZR.HTML.Base.Ajax"
]);

// 数据
var dat = {
    size: 10,
    sort: 0,
    top: 0,
    count: 0,
    vym: null,  // 年模板
    vmm: null,  // 月模板
    vdm: null,  // 日模板
    ydoe: null, // 年列表容器
    ddoe: null, // 日列表容器
    y: new LZR.Base.Val.Ctrl (0),
    m: new LZR.Base.Val.Ctrl (0),
    p: new LZR.Base.Val.Ctrl (0),
    ys: new LZR.Base.Data() // 目录集合
}

var aj = new LZR.HTML.Base.Ajax ();

                // 获取日时间戳
                var to = new Date().getTimezoneOffset() * 60000;
                var tp = 3600 * 1000 * 24;
                function getDayTimestamp (d) {
                    if (!d) {
                        d = Date.now();
                    } else if (d.getTime) {
                        d = d.getTime();
                    }
                    return Math.floor((d - to) / tp);
                }

                // 解析日时间戳
                function parseDayTimestamp (d) {
                    return d * tp + to;
                }

                // 获取时间段的日时间戳
                function dayAreaStamp (y, m, max) {
                    if (m) {
                        if (max) {
                            if (m == 12) {
                                y ++;
                                m = 1;
                            } else {
                                m ++;
                            }
                        }
                    } else {
                        m = 1;
                        if (max) {
                            y ++;
                        }
                    }

                    var r = getDayTimestamp(Date.parse(y + "/" + m + "/1"));
                    if (max) {
                        r --;
                    }
                    return r;
                }

// 生成年目录
function crtYs (y) {
    var all = crtY(1);
    dat.ys.add(all);
    if (dat.sort === 1) {
        for (var i = 2006; i <= y; i++) {
            dat.ys.add(crtY(i));
        }
    } else {
        for (y; y > 2005; y--) {
            dat.ys.add(crtY(y));
        }
    }
}

// 生成年
function crtY (y) {
    var r = new LZR.Base.Data ({
        id: y,
        view: dat.vym.clone()
    });
    r.view.dat = r;
    r.view.getById("txt").doe.innerHTML = (y === 1)?"全部":y;
    dat.ydoe.add(r.view, y);
    r.view.getById("y").addEvt("click", function () {
        dat.y.set(y);
    })
    return r;
}

// 初始化元素模板
function initDoe () {
    dat.ydoe = new LZR.HTML.Base.Doe ({
        hd_doe: document.getElementById("yo")
    });
    dat.ddoe = new LZR.HTML.Base.Doe ({
        hd_doe: document.getElementById("do")
    });
    dat.vym = dat.ydoe.del("ym");
    dat.vmm = dat.ydoe.del("mm");
    dat.vdm = dat.ddoe.del("dm");
}

function init () {
    var y = new Date().getFullYear();

    initDoe();
    crtYs(y);

// console.log (dat);
    // dat.y.set(1);
    dat.y.set(y);
}

dat.y.evt.change.add (function (v, s, o) {
    var d, dt;
// console.log (o + " --> " + v);

    // 调整样式
    if (o) {
        d = dat.ys.getById(o).view;
        d.delCss("ysec");
        d.getById("m").addCss("nosee");
    }
    dt = dat.ys.getById(v);
    d = dt.view;
    d.addCss("ysec");
    d.getById("m").delCss("nosee");

    // 获取数据

});

dat.y.evt.set.add (function (v) {
    // 重设指针
});
