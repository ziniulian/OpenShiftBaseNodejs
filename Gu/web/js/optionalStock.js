function init() {
    qry();
}

function getDat() {
    return [
        {
            num: "sh000001",
            nam: "SH"
        },
        {
            num: "sz399001",
            nam: "SZ"
        },
        {
            num: "sh600000",
            nam: "PF",
            p: 15.08,
            v: 1,
            min: 14.95,
            max: 15.6,
            vmin: 90000,
            vmax: 400000
        },
        {
            num: "sz000661",
            nam: "GX",
            p: 114.4,
            v: 1,
            min: 113,
            max: 118,
            vmin: 8000,
            vmax: 30000
        },
        {
            num: "sh600660",
            nam: "FY",
            p: 0,
            v: 0,
            min: 22,
            max: 99,
            vmin: 70000,
            vmax: 350000
        },
        {
            num: "sh601006",
            nam: "DQ",
            p: 0,
            v: 0,
            min: 7,
            max: 99,
            vmin: 220000,
            vmax: 900000
        },
        {
            num: "sh601088",
            nam: "ZS",
            p: 0,
            v: 0,
            min: 16,
            max: 99,
            vmin: 80000,
            vmax: 230000
        },
        {
            num: "sh601601",
            nam: "TB",
            p: 0,
            v: 0,
            min: 26.5,
            max: 99,
            vmin: 80000,
            vmax: 250000
        }
    ];
}

function qry() {
    var ip = "http://hq.sinajs.cn/list=s_";
    var head = document.getElementsByTagName("head")[0];
    // var d = getDat();
    var d = window.lzr_optionalStock_dat;
    var ajx;
    d.unshift(d.length);
    for (var i = 1; i < d.length; i++) {
        ajx = document.createElement("script");
		ajx.src = ip + d[i].num;
		ajx.onload = LZR.bind(d[i], hd, d);
		head.appendChild(ajx);
    }
}

function hd(d) {
    var y = window["hq_str_s_" + this.num].split(",");
    console.log (this.nam + " : " + y[0]);
    this.np = y[1] - 0;
    this.nv = y[4] - 0;
    this.pct = y[3] - 0;
    d[0] --;
    if (d[0] === 0) {
        flush(d);
    }
}

function flush(d) {
    var s;
    var r = "";
    for (var i = 1; i < d.length; i++) {
        s = "<tr><td class = \"nam\">";
        s += d[i].nam;

        s += "</td><td class = \"gain\">";
        if (d[i].p) {
            s += Math.floor(((d[i].np - d[i].p * 1.01) * d[i].v * 100));
        }

        s += "</td><td class = \"np";
        if (d[i].min) {
            if (d[i].np <= d[i].min) {
                s += " stop\">";
            } else if (d[i].np >= d[i].max) {
                s += " go\">";
            } else {
                s += "\">";
            }
            s += d[i].min + " < " + d[i].np + " < " + d[i].max;
        } else {
            s += "\">" + d[i].np;
        }

        s += "</td><td class = \"nv";
        if (d[i].vmin) {
            if (d[i].nv <= d[i].vmin) {
                s += " go\">";
            } else if (d[i].nv >= d[i].vmax) {
                s += " warm\">";
            } else {
                s += "\">";
            }
            s += d[i].vmin + " < " + d[i].nv + " < " + d[i].vmax;
        } else {
            s += "\">" + d[i].nv;
        }

        s += "</td><td class = \"pct\">";
        s += d[i].pct;
        s += "</td></tr>";
        r += s;
    }
    optionalStock.innerHTML = r;
}
