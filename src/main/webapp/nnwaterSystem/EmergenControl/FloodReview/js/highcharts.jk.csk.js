/*
基于highcharts的监控图表
闸站
未封装完成
*/

var chartseries;
	var curchartseries;
	var items;
	var maxtime;
	var mul=10;
	var top=275;//水位示意背景图底高
	var mm=13;//每米水位所在像素
	var minmul ='11.35';
	var heightMul = '11.35';
	var riverBed='5.921';
	var afterriverbed='7.801';
	minmul = parseInt(minmul);
	setCSKChart("七一总渠","containerCSK1",datasCSK[0][0]);
	/**
	* 设置站闸图表
	*/
	function setCSKChart(title,divID,points){
		Highcharts.setOptions(Highcharts.theme);
		var dthis=$("#"+divID);
		dthis.highcharts({
            chart: {
                type: 'areaspline',
                animation: Highcharts.svg, // don't animate in old IE
                marginTop:40,
                marginRight: 10,
                marginLeft: 40,
                events: {
                    load: function() {
                        curchartseries = this.series;
                    }
                }
            },           
			colors:['#318074'],
            title:{
                text: "管网出水口:"+title,
                style:{fontSize:'12px'},
                align:"center",
                verticalAlign:"bottom"
            },
            subtitle:{
            	text:"流量计"
            },
            xAxis:{
                labels:{
                	style:{color:'#000000'},
                	formatter:function(){  
						if(this.value==1){						
							return "出水口";
						}else{
							return "";
						}                   	  
                    } 
                }
            },
            yAxis: [{
                title: {
                	align: 'high',
	                offset: 0,
	                rotation: 0,
	                y: -13,
                    text: 'm³/s'
                },
                max:0.3,
                min:0.01,
                tickInterval: 0.04,//自定义刻度
				startOnTick:false,
                gridLineColor:'#999999' ,
                labels:{
                	style:{
                		color:'#000000'
                	},
                	x:-15,
                	formatter: function () {
	                    return this.value.toFixed(2);
                	},
                	useHTML:true
                },
                plotLines:[]
            }],
            tooltip:{
            	style:{
            		width:70,
            		zIndex:10
            	},
               	shared: false,
               	headerFormat: '',
           		pointFormat: '<span style="color:{series.color}">{series.name}</span>:{point.y}'
            },
            plotOptions:{
	            spline:{
	            	marker:{
	            		enabled:false,//是否显示点
	                	radius:0//点的半径  
	            	},
		            states:{
	                    hover:{ 
	                        enabled:true,//鼠标放上去线的状态控制 
	                        lineWidth:2 
	                    }  
	                }
	            },
	            column: {
	                pointPadding: 0,
	                borderWidth: 0,
	                groupPadding: 0 //分组之间的距离值
	            }
            },
            legend: {enabled: false},
            exporting: {enabled: false},
            plotOptions: {
	            series: {
					animation: false
				}
	        },
            series: (function(){
            	var serie=[];
            	var obj={name:points[0].typename,data:[toDecimal(points[0].y),toDecimal(points[0].y),toDecimal(points[0].y)]};
	            serie.push(obj);
	            return serie;
            })()
        });
		Highcharts.setOptions(Highcharts.theme);
	}
			
	function toDecimal(x){ 
		var f = parseFloat(x); 
		if (isNaN(f)) { 
			return; 
		} 
		f = Math.round(x*100)/100; 
		return f; 
	} 
	
	/**
	* 改变闸站数据例子数据
	*/
	function changeDemoCSK(index){		
		changeAreasplineCSK("containerCSK1",datasCSK[0][index]);
		var chart = $("#containerCSK1").highcharts();
		chart.setTitle(null, { text: '流量计:' + datasCSK[0][index][0].y+"m³/s"});
	}
	
	/**
	* 改变专题图数据
	*/
	function changeAreasplineCSK(divId,points){
		var chart = $("#"+divId).highcharts();
		clearPlot(chart);
		var obj={name:points[0].typename,data:[toDecimal(points[0].y),toDecimal(points[0].y),toDecimal(points[0].y)]};
		chart.addSeries(obj,false);
		chart.redraw();
		
		function clearPlot(chart) {    
			var series=chart.series;                  
			while(series.length > 0) {  
				series[0].remove(false);  
			}  
			chart.redraw();  
		};  
	}