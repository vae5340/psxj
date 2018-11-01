/*
基于highcharts的监控图表
降雨量
未封装完成
*/
function loadYQData(datasYQ){
	$('#containerYQ').highcharts({
		chart: {
		    zoomType: 'x',
		    spacingLeft:0,
		    spacingBottom:0,
		    spacingTop:20
		},
	    title: {text: ''},
	    subtitle:{
			text: '<span style="color:red;font-size:16px;">气象站雨量监测</span',
	    	align:'center',
	    	y:-8,
	    	useHTML:true,
	    	floating:true
	    },
	    xAxis: {
	        type: 'datetime',
	        labels: {  
	        	step: 3,   
	        	formatter: function () {  
	            	return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);  
	        	}  
	        }
	    },
	    yAxis: {
	        title: {text: '降雨量(mm)'},
	        min:0,
	        reversed:true
	    },
	    legend: {enabled: false},
	    plotOptions: {
	        area: {
	            fillColor: {
	                linearGradient: {
	                    x1: 0,
	                    y1: 0,
	                    x2: 0,
	                    y2: 1
	                },
	                stops: [
	                    [0, Highcharts.getOptions().colors[0]],
	                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                ]
	            },
	            marker: {radius: 2},
	            lineWidth: 1,
	            states: {
	                hover: {lineWidth: 1}
	            },
	            threshold: null
	        }
	    },
		tooltip: {
			formatter: function () {
				var time = new Date(this.x);
				return  time.format('yyyy-MM-dd hh:mm:ss') + '<br /><span style="color:red;font-size:16px;">' + this.y + '</span>毫米';
			}
		},
	    series: [{
	        type: 'area',
	        name: '降雨量',
	        data: datasYQ
	    }]
	});
}