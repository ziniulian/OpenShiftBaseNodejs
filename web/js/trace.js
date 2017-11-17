function trace () {
    LZR.load([
    	"LZR.HTML.Base.Ajax",
        "LZR.HTML.Util.Finger"
    ]);

    var aj = new LZR.HTML.Base.Ajax ();
    var url = encodeURIComponent(window.location.href);
    var uuid = LZR.getSingleton(LZR.HTML.Util.Finger).uuid;
    aj.get (("http://srv-lzrmain.193b.starter-ca-central-1.openshiftapps.com/Vs/srvTrace/" + url + "/" + uuid), true);
}

trace();
