function trace () {
    LZR.load([
    	"LZR.HTML.Base.Ajax",
        "LZR.HTML.Util.Finger"
    ]);

    var aj = new LZR.HTML.Base.Ajax ();
    var url = encodeURIComponent(window.location.href);
    var uuid = LZR.getSingleton(LZR.HTML.Util.Finger).uuid;
    var dma = LZR.HTML.domain;
    aj.get ((dma + "Vs/srvTrace/" + url + "/" + uuid), true);
}

trace();
