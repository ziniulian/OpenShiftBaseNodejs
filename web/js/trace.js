function trace () {
    LZR.load([
    	"LZR.HTML.Base.Ajax",
        "LZR.HTML.Util.Finger"
    ]);

    var aj = new LZR.HTML.Base.Ajax ();
    var url = encodeURIComponent(window.location.pathname).replace(/%/g, "_qb_");
    var uuid = LZR.getSingleton(LZR.HTML.Util.Finger).uuid;
    aj.get (("/srvTrace/" + url + "/" + uuid), true);
}

trace();
