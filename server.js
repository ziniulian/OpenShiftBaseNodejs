#!/bin/env node
// OpenShift sample Node application
var express = require("express");

// 引用文件模块
var fs = require("fs");

// 引用url模块
var url = require("url");

// 引用querystring模块
var querystring = require("querystring");

// 引用path模块
var path = require("path");


/**
 *  Define the sample application.
 */
var SampleApp = function() {

	//  Scope.
	var self = this;


	/*  ================================================================  */
	/*  Helper functions.                                                 */
	/*  ================================================================  */

	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	self.setupVariables = function() {
		//  Set the environment variables we need.
		self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
		self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

		if (typeof self.ipaddress === "undefined") {
			//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
			//  allows us to run/test the app locally.
			console.warn("No OPENSHIFT_NODEJS_IP var, using 127.0.0.1");
			self.ipaddress = "127.0.0.1";
		}
	};


	/**
	 *  Populate the cache.
	 */
	self.populateCache = function() {
		if (typeof self.zcache === "undefined") {
			self.zcache = { "index.html": "" };
		}

		//  Local cache for static content.
		self.zcache["index.html"] = fs.readFileSync("./index.html");
	};


	/**
	 *  Retrieve entry (content) from cache.
	 *  @param {string} key  Key identifying content to retrieve from cache.
	 */
	self.cache_get = function(key) { return self.zcache[key]; };


	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	self.terminator = function(sig){
		if (typeof sig === "string") {
			console.log("%s: Received %s - terminating sample app ...", Date(Date.now()), sig);
			process.exit(1);
		}
		console.log("%s: Node server stopped.", Date(Date.now()) );
	};


	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	self.setupTerminationHandlers = function(){
		//  Process on exit and signals.
		process.on("exit", function() { self.terminator(); });

		// Removed "SIGPIPE" from the list - bugz 852598.
		["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
		"SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
		].forEach(function(element, index, array) {
			process.on(element, function() { self.terminator(element); });
		});
	};


	/*  ================================================================  */
	/*  App server functions (main app logic here).                       */
	/*  ================================================================  */

	/**
	 *  Create the routing table entries + handlers for the application.
	 */
	self.createRoutes = function() {
		self.routes = { };

		// 获取服务器的IP信息
		self.routes["/ipconfig"] = function(req, res) {
			var config = "IP地址： ";
			config += self.ipaddress;
			config += "<br>端口号： ";
			config += self.port;
			// res.send("<html><head><title>服务器IP信息</title><meta charset='utf-8'/></head><body>" + config + "</body></html>");

			res.writeHeader (200, {
				"Access-Control-Allow-Origin": "*",		// HTML5 允许跨域访问的范围，* 代表允许任何网域访问
				"Content-Type": "text/html; charset=utf-8",	// 文件格式； 字符编码
				"Title": "服务器IP信息"
			});
			res.write("<html><body>" + config + "</body></html>");
			res.end();
		};

		// 获取静态文件
		self.routes["/getStaticFile"] = function(request, response) {
			// 解析参数
			self.parseParam (request, response, function (request, response, param) {
				// 返回静态文件
				self.loadStaticFile (param.path, response);
			});
		};

		// 访问主页
		self.routes["/"] = function(req, res) {
			res.setHeader("Content-Type", "text/html");
			res.send(self.cache_get("index.html") );
		};
	};


	// 解析 GET、POST 参数
	self.parseParam = function(request, response, callback) {
		var postData = "";

		// 执行回调函数
		var cb = function () {
			callback (request, response, querystring.parse(postData));
		};

		if (request.method == "GET") {
			postData = url.parse(request.url).query;
			cb();
		} else if (request.method == "POST") {
			// 设置接收数据编码格式为 UTF-8
			request.setEncoding("utf8");

			// 因为nodejs在处理post数据的时候，会将数据分成小包来序列处理。所以必须监听每一个数据小包的结果
			request.addListener("data", function (postDataChunk) {
				postData += postDataChunk;
			});
	 
			// 所有数据包接收完毕
			request.addListener("end", cb);
		}
	};


	// 返回静态文件
	self.loadStaticFile = function (uri, response) {
		var filename = path.join(process.cwd(), uri);
		path.exists (filename, function (exists) {
			if (!exists) {
				response.writeHeader (404, {"Content-Type":"text/plain;charset=utf-8"});
				response.write ("404 页面不存在\n", "utf-8");
				response.end();
			} else {
				fs.readFile (filename, "binary", function (err, file) {
					if (err) {
						response.writeHeader (500, {"Content-Type":"text/plain;charset=utf-8"});
						response.write((err + "\n"), "utf-8");
						response.end();
					} else {
						response.writeHeader (200, {
							"Access-Control-Allow-Origin": "*",		// HTML5 允许跨域访问的范围，* 代表允许任何网域访问
							"Content-Type":"text/html; charset=utf-8"	// 文件格式； 字符编码
						});
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	};


	/**
	 *  Initialize the server (express) and create the routes and register
	 *  the handlers.
	 */
	self.initializeServer = function() {
		self.createRoutes();
		self.app = express.createServer();

		//  Add handlers for the app (from the routes).
		for (var r in self.routes) {
			self.app.get(r, self.routes[r]);
		}
	};


	/**
	 *  Initializes the sample application.
	 */
	self.initialize = function() {
		self.setupVariables();
		self.populateCache();
		self.setupTerminationHandlers();

		// Create the express server and routes.
		self.initializeServer();
	};


	/**
	 *  Start the server (starts up the sample application).
	 */
	self.start = function() {
		//  Start the app on the specific interface (and port).
		self.app.listen(self.port, self.ipaddress, function() {
			console.log("%s: Node server started on %s:%d ...", Date(Date.now() ), self.ipaddress, self.port);
		});
	};

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

