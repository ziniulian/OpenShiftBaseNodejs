function init () {
	// 画图表
	var cc = echarts.init(initObj.logsDom);
	var dat = JSON.parse(initObj.logs);
// console.log (dat);

	var tims = [];
	var tmps = [];
	var to;
	var td;
	for (var s in dat) {
		if (to) {
			td += 300000;
			to.setTime(td);
		} else {
			td = s * 1000;
			to = new Date(td);
		}

		tims.push(to.getHours() + ":" + to.getMinutes());
		tmps.push(dat[s]);
	}

	var op = {
        tooltip: {
            trigger: "axis"
        },
		xAxis: {
			name: "时间",
			data: tims
		},
		yAxis: {
			type: "value",
				axisLabel: {
				formatter: "{value} °C"
			}
		},
		visualMap: {	// 不同值用不同颜色显示
			show: false,	// 隐藏图例
			pieces: [
				{
					gt: initObj.min,
					lte: initObj.max,
					color: '#0F0'
				},
				{
					gt: initObj.max,
					color: '#F00'
				}
			],
			outOfRange: {
				color: "#00F"
			}
		},
		series: [{
			name: "温度",
			type: "line",
			symbol: "none",	// 取消折线图上的小圆点
			data: tmps,
			markLine: {		// 标注温度范围基准线
				data: [
					{yAxis: initObj.min},
					{yAxis: initObj.max}
				]
			}
		}]
	};

	cc.setOption(op);
}
