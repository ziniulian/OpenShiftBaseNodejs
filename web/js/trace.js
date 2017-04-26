function bin2hex (s) {
    var i, l, o = "", n;
    s += "";
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? "0" + n : n;
    }
    return o;
};

function getFingerprint () {
    var cav = document.createElement("canvas");
    var ctx = cav.getContext("2d");
    var txt = "ziniulian";

    ctx.textBaseline = "top";
    ctx.font = "bolder 30px Chiller";
    ctx.fillStyle = "#FF0";
    ctx.fillRect(6, 17, 85, 19);
    ctx.fillStyle = "#666";
    ctx.fillText(txt, 0, 0);
    ctx.fillStyle = "rgba(200, 200, 0, 0.6)";
    ctx.fillText(txt, 3, 3);

    return bin2hex(atob(cav.toDataURL().replace("data:image/png;base64,","")).slice(-16, -12));
}

function trace () {
    LZR.load([
    	"LZR.HTML.Base.Ajax"
    ]);

    var aj = new LZR.HTML.Base.Ajax ();
    var url = encodeURIComponent(window.location.pathname).replace(/%/g, "_qb_");
    var uuid = getFingerprint();
    aj.get (("/srvTrace/" + url + "/" + uuid), true);
}

trace();
