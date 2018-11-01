setTimeout(function(){

	var examples_chart = echarts.init(document.getElementById('panel_chart_layout'), 'shine');
	var examples_chart_data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
	var examples_chart_dateList = examples_chart_data.map(function (item) {
	  return item[0];
	});
	var examples_chart_valueList = examples_chart_data.map(function (item) {
	  return item[1];
	});
	examples_chart_option = {

	  // Make gradient line here
	  visualMap: [{
	      show: false,
	      type: 'continuous',
	      seriesIndex: 0,
	      min: 0,
	      max: 400
	  }],
		title: {
	  		top:"20px",
	        left: 'center',
	        text: "本季度基础走势情况",
	        textStyle:{
	        	fontSize:"12",
	        	fontWeight:"bold"
	        }
	  },
	  tooltip: {
	      trigger: 'axis'
	  },
	  xAxis: [{
	      data: examples_chart_dateList,
	      axisLine:{
	        lineStyle:{
	          color:"#9b9b9b"
	        }
	      }
	      
	  }],
	  yAxis: [{
	      splitLine: {show: false},
	      axisLine:{
	        lineStyle:{
	          color:"#9b9b9b"
	        }
	      }
	  }],
	  grid: [{
	      top: '50px',
	      left:'50px',
	      right:"30px",
	      bottom:"30px"
	  }],
	  series: [{
	      type: 'line',
	      smooth: true,//折线的是否弯曲
	      showSymbol: false,//是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示。
	      data: examples_chart_valueList,
	      lineStyle:{
	          normal: {
	              width:1,
	              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                  offset: 0,
	                  color: 'rgb(0, 90, 255)',
	                  opacity:0
	              }, {
	                  offset: 1,
	                  color: 'rgb(156, 217, 255)',
	                  opacity:1
	              }])
	          }
	      },
	      areaStyle: {
	          normal: {
	              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                  offset: 0,
	                  color: 'rgb(0, 90, 255)',
	                  opacity:0
	              }, {
	                  offset: 1,
	                  color: 'rgb(156, 217, 255)',
	                  opacity:1
	              }])
	          }
	      }
	  }]
	};

	examples_chart.setOption(examples_chart_option);

},2000);





	
