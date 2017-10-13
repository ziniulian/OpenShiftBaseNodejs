// OpenShift V3 测试
var srv = require("express")();

srv.use("/tt/", function (req, res, next) {
    res.json(process.env);
	// res.send("Hello World!");
});

srv.listen(80, "0.0.0.0");
