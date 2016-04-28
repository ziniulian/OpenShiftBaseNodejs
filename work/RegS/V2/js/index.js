
function Test () {
	// 配置信息
	this.config = {
		windUrl: "http://192.168.1.130/gisserverv0010/api/GrdHandler/getWindData",
		// qryUrl: "https://ziniulian.github.io/LX_JS/img/"
		qryUrl: "/GitLib/LX_JS/img/",

		area: {
			"d01": {
				range: [5245674.9688, -1850365.49943, 18335028.6039, 8505516.86134],
				html: "D01"
			},
			"d02":  {
				range: [10050060.5518, 1608407.28878, 15794655.2213, 7411620.27129],
				html: "D02"
			},
			"d03": {
				range: [12005061.2415, 3783169.99321, 14161654.2706, 5637372.66769],
				html: "D03"
			}
		},

		backImg: "/GitLib/LX_JS/img/web/RegS/V2/back.png",
		backJson: "/GitLib/LX_JS/img/web/RegS/V2/back.json"
	};

	// 创建地图
	this.buildMap = function (mapID) {
		var min = [73, 2];
		var max = [135, 54];
		var center = [108, 35];

		// 投影转换
		min = ol.proj.fromLonLat(min);
		max = ol.proj.fromLonLat(max);
		center = ol.proj.fromLonLat(center);

		min.push(max[0]);
		min.push(max[1]);

		// 创建地图
		this.map = new ol.Map({
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				})
			],
			target: mapID,
			view: new ol.View({
				projection: "EPSG:3857",
				zoom: 4,
				minZoom: 3,
				extent: min,
				center: center
			})
		});

		// 删除地图的 controls
		this.map.getControls().clear();

		return this.map;
	};

	// 数据
	this.data = new LZR.HTML5.Bp.AirqMg.RegStat2.ViewData();

	// 添加欧拉风场
	this.createEuler = function () {
		var eu = this.data.wind.children.Euler;
		eu.ctrl = {
			data: eu,
			map: this.map,
			visible: eu.visible,
			alpha: eu.alpha,
			info: this.data.wind.children.Lagrange.ctrl.info,
			cav: document.createElement("canvas"),

			init: function (olmap) {
				olmap.getViewport().appendChild(this.cav);
				this.resize();
				if (!this.ctx) {
					this.ctx = this.cav.getContext('2d');
				}
				if (!this.wind) {
					this.alpha.set(0.8);
					this.wind = new WindLayer(olmap, this.ctx, { opacity: this.alpha.val });
				}
				this.visible.event.change.append (LZR.bind(this, this.changeVisible));

				LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, function() {
					this.resize();
					this.flush(false);
				}), false);

				olmap.on('moveend', LZR.bind (this, this.flush, false));
				// this.data.root.cur.tp.event.change.append (LZR.bind(this, this.flush));
				// this.flush();

				this.changeVisible(this.visible.val);
			},

			changeVisible: function (v) {
				if (v) {
					this.cav.style.display = "";
					this.cav.width = this.cav.clientWidth;
					this.cav.height = this.cav.clientHeight;
					this.flush(false);
				} else {
					this.wind.clear();
					this.ctx.clearRect(0, 0, this.cav.width, this.cav.height);
					this.cav.style.display = "none";
				}
			},

			flush: function (change) {
				if (this.visible.val && this.alpha.val>0) {
					var p = this.data.root.cur.tp.val;
					if (!change) {
						this.wind.clear();
						this.ctx.clearRect(0, 0, this.cav.width, this.cav.height);
					}
					this.ctx.fillStyle = "rgba(0, 0, 0, " + this.alpha.val + ")";
					var s = this.info.val[p];
					if (s) {
						var url = this.data.root.wind.children.Lagrange.windUrl + s;
						var mapBox = this.map.getSize();
						var currentExtent = this.map.getView().calculateExtent(mapBox);
						this.row = parseInt((mapBox[0] / 20), 10);
						this.column = parseInt((mapBox[1] / 20), 10);

						var lonmin = currentExtent[0] / 20037508.34 * 180;
						var latmin = currentExtent[1] / 20037508.34 * 180;
						latmin = 180 / Math.PI * (2 * Math.atan(Math.exp(latmin * Math.PI / 180)) - Math.PI / 2);
						var lonmax = currentExtent[2] / 20037508.34 * 180;
						var latmax = currentExtent[3] / 20037508.34 * 180;
						latmax = 180 / Math.PI * (2 * Math.atan(Math.exp(latmax * Math.PI / 180)) - Math.PI / 2);

						url += "&rowNo=";
						url += this.row;
						url += "&columnNo=";
						url += this.column;

						url += "&lonmin=" + lonmin;
						url += "&latmin=" + latmin;
						url += "&lonmax=" + lonmax;
						url += "&latmax=" + latmax;
						new LZR.HTML5.Util.Ajax ().get (url, LZR.bind (this, this.onload, change));
					}
				}
			},

			onload: function (change, txt) {
				if (txt) {
					var response = JSON.parse(txt);
					if (response.length > 0) {
						if (change === true) {
							this.wind.changeWindData(response);
						} else {
							this.wind.addWinds(response, this.row, this.column);
						}
					}
				}
			},

			resize: function () {
				this.cav.width = this.cav.clientWidth;
				this.cav.height = this.cav.clientHeight;
			}

		};

		this.rs.allLayersFlushed = function () {
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.allLayersFlushed.call(this);
			if (this.data.wind.children.Euler.ctrl.flushChange) {
				this.data.wind.children.Euler.ctrl.flush(false);
				this.data.wind.children.Euler.ctrl.flushChange = false;
			} else {
				this.data.wind.children.Euler.ctrl.flush(true);
			}
		};
		eu.ctrl.cav.className = "eulerCanvasStyle";
		eu.ctrl.init(this.map);
	};

	// 添加图例
	this.createLegend = function() {
		this.data.legend = {
			id: "legend",
			parent: this.data,
			root: this.data,
			view: null,
			ctrl: null
		};
		this.data.legend.children = {
			fom: {
				id: "fom",
				parent: this.data.legend,
				root: this.data,
				view: new LZR.HTML5.Util.Layout.BaseDiv({}),
				ctrl: null
			}
		};

		// 图例Url
		this.data.fom.children.PM25.legendUrl = {
			day: {
				defaultLegend: "d/PM2.5_d.png",
				hoverLegend: "d/PM2.5_daqi.png"
			},
			hour: {
				defaultLegend: "h/PM2.5_h.png",
				hoverLegend: "h/PM2.5_haqi.png"
			}
		};
		this.data.fom.children.PM10.legendUrl = {
			day: {
				defaultLegend: "d/PM10_d.png",
				hoverLegend: "d/PM10_daqi.png"
			},
			hour: {
				defaultLegend: "h/PM10_h.png",
				hoverLegend: "h/PM10_haqi.png"
			}
		};
		this.data.fom.children.SO2.legendUrl = {
			day: {
				defaultLegend: "d/SO2_d.png",
				hoverLegend: "d/SO2_daqi.png"
			},
			hour: {
				defaultLegend: "h/SO2_h.png",
				hoverLegend: "h/SO2_haqi.png"
			}
		};
		this.data.fom.children.NO2.legendUrl = {
			day: {
				defaultLegend: "d/NO2_d.png",
				hoverLegend: "d/NO2_daqi.png"
			},
			hour: {
				defaultLegend: "h/NO2_h.png",
				hoverLegend: "h/NO2_haqi.png"
			}
		};
		this.data.fom.children.CO.legendUrl = {
			day: {
				defaultLegend: "d/CO_d.png",
				hoverLegend: "d/CO_daqi.png"
			},
			hour: {
				defaultLegend: "h/CO_h.png",
				hoverLegend: "h/CO_haqi.png"
			}
		};
		this.data.fom.children.O3.legendUrl = {
			day: {
				defaultLegend: "d/O3_d.png",
				hoverLegend: "d/O3_daqi.png"
			},
			hour: {
				defaultLegend: "h/O3_h.png",
				hoverLegend: "h/O3_haqi.png"
			}
		};

		// 图例变化
		var changeLegend = function (leg, hover, v) {
			var url = this.data.cur[leg.id];
			if (v) {
				if (url.visible.val) {
					url = this.data[leg.id].children[url.id].legendUrl;
					if (url) {
						url = url[this.data.cur.timeStep.id][hover];
						if (url) {
							leg.view.div.style.display = "";
							leg.view.div.style.backgroundImage = "url(widgets/RegStat/images/" + url + ")";
							return;
						}
					}
				}
			}
			leg.view.div.style.display = "none";
		};

		this.data.legend.view = new LZR.HTML5.Util.Layout.BaseDiv({});
		this.data.legend.view.addClass ("legendOut");
		for (var s in this.data.legend.children) {
			var leg = this.data.legend.children[s];
			leg.view.addClass("legend");
			this.data.legend.view.addChild (leg.view);

			// ---------- 事件 ----------
			LZR.HTML5.Util.Event.addEvent (leg.view.div, "mouseover", LZR.bind(this, changeLegend, leg, "hoverLegend"), false);
			LZR.HTML5.Util.Event.addEvent (leg.view.div, "mouseout", LZR.bind(this, changeLegend, leg, "defaultLegend"), false);
			this.data[s].ctrl.visible.event.change.append (LZR.bind(this, changeLegend, leg, "defaultLegend"), "changeLegend");
			if (s == "fom") {
				for (var ss in this.data.timeStep.children) {
					this.data.timeStep.children[ss].selected.event.change.append (LZR.bind(this, changeLegend, leg, "defaultLegend"), s + "_changeLegend");
				}
			}
		}
		this.data.legend.view.placeTo(this.doms.timeAxis);
	};

	// 配置数据
	this.cofDat = function () {
		var s;
		this.data.date.content.set(this.doms.RegS_date.value, false);
		this.data.timeAxis.view = this.doms.timeAxis;
		this.data.wind.children.Lagrange.windUrl = this.config.windUrl;
		this.data.qry.urlPre = this.config.qryUrl;
		for (s in this.data.fom.children) {
			this.data.fom.children[s].dataProjection = "EPSG:3857";
			this.data.fom.children[s].mapProjection = "EPSG:3857";
			this.data.fom.children[s].alpha.set(0.7, false);
		}
		for (s in this.data.line.children) {
			this.data.line.children[s].mapProjection = "EPSG:3857";
		}
		for (s in this.data.wind.children) {
			this.data.wind.children[s].dataProjection = "EPSG:3857";
			this.data.wind.children[s].mapProjection = "EPSG:3857";
			this.data.wind.children[s].color = "#F91";
		}
		for (s in this.config.area) {
			this.data.area.children[s].html = this.config.area[s].html;
			this.data.area.children[s].range = this.config.area[s].range;
		}

		LZR.HTML5.Util.Event.addEvent (this.doms.RegS_date, "change", LZR.bind(this, function () {
			this.data.date.content.set(this.doms.RegS_date.value);
			// this.data.wind.children.Euler.ctrl.flushChange = true;
		}), false);
		LZR.HTML5.Util.Event.addEvent (this.doms.RegS_tim, "change", LZR.bind(this, function () {
			this.data.time.children[this.doms.RegS_tim.value].selected.set(true);
		}), false);
		LZR.HTML5.Util.Event.addEvent (this.doms.RegS_mod, "change", LZR.bind(this, function () {
			this.data.mod.children[this.doms.RegS_mod.value].selected.set(true);
		}), false);

		this.rs = new LZR.HTML5.Bp.AirqMg.RegStat2({
			olmap: this.map,
			data: this.data
		});
		this.data.qry.ctrl.backImg = this.config.backImg;
		this.data.qry.ctrl.backJson = this.config.backJson;
		this.data.timeAxis.ctrl.init();
		// this.createEuler();
		// this.createLegend();
	};

	// 添加DOM元素
	this.placeView = function () {
		var s, d, f;
		var animation = function (l, h, v) {
			if (v) {
				this.style.left=l;
				this.innerHTML=h;
				LZR.HTML5.Util.Css.removeClass (this, "nosee");
			}
		};

		// 左侧总窗体
		this.view = new LZR.HTML5.Util.Layout.BaseDiv({});
		this.view.div = this.doms.RegS_leftOut;

		// 小时值
		f = this.data.timeStep.children.hour.view;
		f.data.cssNormal.set("a_left noselect");
		f.data.cssSelected.set("a_left noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_timeStep_animation, animation, "95px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_timeStep);

		// 日均值
		f = this.data.timeStep.children.day.view;
		f.data.cssNormal.set("a_right noselect");
		f.data.cssSelected.set("a_right noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_timeStep_animation, animation, "205px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_timeStep);

		// D01区域
		f = this.data.area.children.d01.view;
		f.data.cssNormal.set("a_left_c noselect");
		f.data.cssSelected.set("a_left_c noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_area_animation, animation, "95px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_area);

		// D02区域
		f = this.data.area.children.d02.view;
		f.data.cssNormal.set("a_middle_c noselect");
		f.data.cssSelected.set("a_middle_c noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_area_animation, animation, "170px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_area);

		// D03区域
		f = this.data.area.children.d03.view;
		f.data.cssNormal.set("a_right_c noselect");
		f.data.cssSelected.set("a_right_c noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_area_animation, animation, "240px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_area);

		// 污染物
		for (s in this.data.fom.children) {
			f = this.data.fom.children[s].view;
			f.data.cssNormal.set("li noselect");
			f.data.cssSelected.set("li noselect li_b");
			switch (s) {
				case "PM25":
					f.bdo.div.innerHTML = "PM<sub>2.5</sub> （细颗粒物） <span>·</span>";
					break;
				case "PM10":
					f.bdo.div.innerHTML = "PM<sub>10</sub> （可吸入颗粒物） <span>·</span>";
					break;
				case "SO2":
					f.bdo.div.innerHTML = "SO<sub>2</sub> （二氧化硫） <span>·</span>";
					break;
				case "NO2":
					f.bdo.div.innerHTML = "NO<sub>2</sub> （二氧化氮） <span>·</span>";
					break;
				case "CO":
					f.bdo.div.innerHTML = "CO （一氧化碳） <span>·</span>";
					break;
				case "O3":
					f.bdo.div.innerHTML = "O<sub>3</sub> （臭氧） <span>·</span>";
					break;
				case "AQI":
					f.bdo.div.innerHTML = "AQI （空气质量指数） <span>·</span>";
					break;
				case "O38H":
					f.bdo.div.innerHTML = "臭氧滑动8小时<span>·</span>";
					break;
			}
			f.bdo.placeTo(this.doms.RegS_fom);
		}

		// 温度
		f = this.data.line.children.Te.view;
		f.bdo.div.innerHTML = "<img class='a_left_img'  src='https://ziniulian.github.io/LX_JS/img/web/RegS/V2/lefe_e.png' /><p>温度</p>";
		f.data.cssNormal.set("a_e noselect");
		f.data.cssSelected.set("a_e noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_line_animation, animation, "5px", ""));
		f.bdo.placeTo(this.doms.RegS_line);

		// 湿度
		f = this.data.line.children.Rh.view;
		f.bdo.div.innerHTML = "<img class='a_left_img'  src='https://ziniulian.github.io/LX_JS/img/web/RegS/V2/lefe_e_2.png' /><p>湿度</p>";
		f.data.cssNormal.set("a_e noselect");
		f.data.cssSelected.set("a_e noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_line_animation, animation, "80px", ""));
		f.bdo.placeTo(this.doms.RegS_line);

		// 压强
		f = this.data.line.children.Pr.view;
		f.bdo.div.innerHTML = "<img class='a_left_img'  src='https://ziniulian.github.io/LX_JS/img/web/RegS/V2/lefe_e_3.png' /><p>压强</p>";
		f.data.cssNormal.set("a_e noselect");
		f.data.cssSelected.set("a_e noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_line_animation, animation, "155px", ""));
		f.bdo.placeTo(this.doms.RegS_line);

		// 隐藏温湿压
		LZR.HTML5.Util.Event.addEvent (this.doms.RegS_line, "click", LZR.bind(this, function () {
			if (!this.data.cur.line.view.data.selected.val) {
				LZR.HTML5.Util.Css.addClass (this.doms.RegS_line_animation, "nosee");
			}
		}), false);

		// 矢量风
		f = this.data.wind.children.Lagrange.view;
		f.bdo.div.innerHTML = "矢量风";
		f.data.cssNormal.set("a_left noselect");
		f.data.cssSelected.set("a_left noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_wind_animation, animation, "95px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_wind);

		// 风场动画
		f = this.data.wind.children.Euler.view;
		f.bdo.div.innerHTML = "风场动画";
		f.data.cssNormal.set("a_right noselect");
		f.data.cssSelected.set("a_right noselect");
		f.data.selected.event.change.append (LZR.bind (this.doms.RegS_wind_animation, animation, "205px", f.bdo.div.innerHTML));
		f.bdo.placeTo(this.doms.RegS_wind);

		// 隐藏风场
		LZR.HTML5.Util.Event.addEvent (this.doms.RegS_wind_animation, "click", LZR.bind(this, function () {
			LZR.HTML5.Util.Css.addClass (this.doms.RegS_wind_animation, "nosee");
			this.data.cur.wind.view.data.selected.set(false);
		}), false);

		// 创建时间轴速度选项
		this.data.speeds = {
			id: "speeds",
			root: this.data,
			children: {
				fast: {
					id: "fast",
					parent: null,
					root: this.data,
						value: 200,
						html: "快",
						select: new LZR.Util.ValCtrl(true),
					view: null
				},
				mid: {
					id: "mid",
					parent: null,
					root: this.data,
						value: 700,
						html: "中",
						select: new LZR.Util.ValCtrl(false),
					view: null
				},
				slow: {
					id: "slow",
					parent: null,
					root: this.data,
						value: 1500,
						html: "慢",
						select: new LZR.Util.ValCtrl(false),
					view: null
				}
			},
			cur: null,
			view: new LZR.HTML5.Util.Layout.BaseDiv({}),
			changeSpeed: function (v) {
				if (v) {
					if (this != this.parent.cur) {
						var tmp = this.parent.cur;
						this.parent.cur = this;
						tmp.select.set (false);
						this.root.timeAxis.playWaitTime.set(this.value);
					} else {
						return false;
					}
				} else if (this == this.parent.cur) {
					return false;
				}
			}
		};
		this.data.speeds.view.div = this.doms.RegS_speeds;
		for (s in this.data.speeds.children) {
			var sp = this.data.speeds.children[s];
			sp.parent = this.data.speeds;
			if (sp.select.val) {
				sp.parent.cur = sp;
			}
			sp.select.setEventObj (sp);
			sp.select.event.before.append (sp.parent.changeSpeed);
			sp.view = new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView({
				html: sp.html,
				selected: sp.select,
				cssNormal: "speedBtn noselect",
				cssSelected: "speedBtn noselect selected"
			});
			sp.parent.view.addChild (sp.view.bdo);
		}
	};

	this.run = function () {
		this.data.wind.ctrl.cav.width = this.data.wind.ctrl.cav.clientWidth;
		this.data.wind.ctrl.cav.height = this.data.wind.ctrl.cav.clientHeight;
		this.data.cur.fom.visible.set(true);
		this.data.cur.line.visible.set(false);
		this.data.cur.wind.visible.set(true);
		this.rs.flush();
	};

}

function init () {
	// 加载LZR库
	// LZR.HTML5.jsPath = "https://ziniulian.github.io/LX_JS/js/old/";
	LZR.HTML5.jsPath = "/GitLib/LX_JS/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
	]);
	var t = new Test();

	t.buildMap("map");
	t.doms = {};
	t.doms.timeAxis = document.getElementById("timeAxis");		// 时间轴
	t.doms.RegS_date = document.getElementById("RegS_date");	// 日期选项
	t.doms.RegS_tim = document.getElementById("RegS_tim");	// 时次选项
	t.doms.RegS_mod = document.getElementById("RegS_mod");	// 模式选项
	t.doms.RegS_leftOut = document.getElementById("RegS_leftOut");		// 左窗口
	t.doms.RegS_speeds = document.getElementById("RegS_speeds");		// 速度容器
	t.doms.RegS_timeStep = document.getElementById("RegS_timeStep");		// 时次容器
	t.doms.RegS_area = document.getElementById("RegS_area");	// 区域容器
	t.doms.RegS_fom = document.getElementById("RegS_fom");	// 污染物容器
	t.doms.RegS_line = document.getElementById("RegS_line");	// 线图容器
	t.doms.RegS_wind = document.getElementById("RegS_wind");	// 风容器
	t.doms.RegS_timeStep_animation = document.getElementById("RegS_timeStep_animation");	// 时次滑块
	t.doms.RegS_area_animation = document.getElementById("RegS_area_animation");		// 区域滑块
	t.doms.RegS_line_animation = document.getElementById("RegS_line_animation");		// 线图滑块
	t.doms.RegS_wind_animation = document.getElementById("RegS_wind_animation");		// 风滑块

	t.cofDat();
	t.placeView();
	t.run();

}
