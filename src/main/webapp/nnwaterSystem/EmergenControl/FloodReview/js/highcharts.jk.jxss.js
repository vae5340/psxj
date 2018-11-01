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

	setJXSSChart("葛村路下穿铁路桥下","containerJXSS1",datasJXSS[0][0]);
	/**
	* 设置站闸图表
	*/
	function setJXSSChart(title,divID,points){
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
			
            title: {
                text: title,
                style:{fontSize:'12px'},
                align:'center',
                verticalAlign:"bottom"
            },
            subtitle:{
            	text:"井下水位"
            },
            xAxis: {
				//categories:['','X      Y',''],
                labels:{
                	style:{color:'#000000'},
                	formatter: function () {  
						if(this.value==1){						
							return "井下水深";
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
	                y: -5,
                    text: '米'
                },
                max:8,
                min:0,
				tickInterval: 0.5,//自定义刻度
				startOnTick:false,
                gridLineColor:'#999999' ,
                labels:{
                	style:{color:'#000000'},
                	x:-15,
                	formatter: function () {
	                    return this.value.toFixed(1);
                	}
                },
                plotLines:[{
		                    value:1,
		                    width: 1,
		                    color: '#ED3A15',
		                    zIndex:5,
		                    label:{x:3,text:'管顶高度',style:{color:'#ED3A15',fontSize:'12px'}}
		                },
						{
		                    value:3,
		                    width: 2,
		                    color: '#ED3A15',
		                    zIndex:5,
		                    label:{x:3,text:'井盖深度',style:{color:'#ED3A15',fontSize:'12px'}}
		                }]
            }],
            tooltip: {
            	style: {
            		width:70,
            		zIndex:10
            	},
               	shared: false,
               	headerFormat: '',
           		pointFormat: '<span style="color:{series.color}">{series.name}</span>:{point.y}'/*,
           		positioner: function() {
				    return {x: 85,y: 0}
				}   */
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
            series: (function() {
            	var serie=[];
            	//if(points.length>1){
            		var obj={name:points[0].typename,data:[toDecimal(points[0].y),toDecimal(points[0].y),toDecimal(points[0].y)]};
	            	serie.push(obj);
	            	//obj={name:points[1].typename,data:[null,toDecimal(points[1].y),toDecimal(points[1].y)]};
	            	//serie.push(obj);
	            	//var riverBedobj={name:"河床高程",data:[toDecimal(parseFloat(riverBed)),toDecimal(parseFloat(riverBed)),toDecimal(parseFloat(riverBed))]};
	            	//serie.push(riverBedobj);
            	//} else {
            	//	var obj={name:points[0].typename,data:[toDecimal(points[0].y),toDecimal(points[0].y)]};
	            	serie.push(obj);
	            	//var riverBedobj={name:"河床高程",data:[toDecimal(parseFloat(riverBed)),toDecimal(parseFloat(riverBed))]};
	            	//serie.push(riverBedobj);
	            //}
	            return serie;
            })()
        });
		Highcharts.setOptions(Highcharts.theme);
	}

			
	function toDecimal(x) { 
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
	function changeDemoJXSS(index){		
		changeAreasplineJXSS("containerJXSS1",datasJXSS[0][index]);
		var chart = $("#containerJXSS1").highcharts();
		chart.setTitle(null, { text: '井下水位:' + datasJXSS[0][index][0].y+"m" });
	}
	
	/**
	* 改变专题图数据
	*/
	function changeAreasplineJXSS(divId,points){
		var chart = $("#"+divId).highcharts();
		clearPlot();
		var obj={name:points[0].typename,data:[toDecimal(points[0].y),toDecimal(points[0].y),toDecimal(points[0].y)]};
		chart.addSeries(obj,false);
		//obj={name:points[1].typename,data:[null,toDecimal(points[1].y),toDecimal(points[1].y)]};
		//chart.addSeries(obj,false);
		//var riverBedobj={name:"河床高程",data:[toDecimal(parseFloat(riverBed)),toDecimal(parseFloat(riverBed)),toDecimal(parseFloat(riverBed))]};
		//chart.addSeries(riverBedobj,false);
		chart.redraw();
		
		function clearPlot() {  
                //console.log("clear plot data!!!");  
			var series=chart.series;                  
			while(series.length > 0) {  
				series[0].remove(false);  
			}  
			chart.redraw();  
		};  
	}