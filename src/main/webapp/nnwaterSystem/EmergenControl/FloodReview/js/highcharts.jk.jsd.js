/*
基于highcharts的监控图表
闸站
未封装完成
*/

var chartseries;
	var curchartseries;
	var items;
	var maxtime;
	var mulJSD=100;
	var top=275;//水位示意背景图底高
	var mm=13;//每米水位所在像素
	var minmulJSD ='11.35';
	var heightMulJSD = '20';
	var riverBed='5.921';
	var afterriverbed='7.801';
	minmulJSD = parseInt(minmulJSD);

	setJSDChart("葛村路铁路桥底","containerJSD1",datasJSD[0][0]);
	/**
	* 设置站闸图表
	*/
	function setJSDChart(title,divID,points){
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
                text: title+"<br />积水点",
                style:{fontSize:'12px'},
                align:'right'
            },
            xAxis: {
				//categories:['','X      Y',''],
                labels:{
                	style:{color:'#000000'},
                	formatter: function () {  
						if(this.value==1){						
							return "积水点";
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
                max:2,
                min:0,
                //tickInterval: toDecimal((Math.ceil(parseFloat(heightMulJSD)+0.5)-Math.floor(riverBed))/10),//自定义刻度
				tickInterval: 0.4,//自定义刻度
				startOnTick:false,
                gridLineColor:'#999999' ,
                labels:{
                	style:{color:'#000000'},
                	x:-15,
                	formatter: function () {
	                    return this.value.toFixed(1);
                	}
                },
                plotLines: 
                		[
						//{
		                //    value:5,
		                //    width: 1,
		                //    color: '#ED3A15',
		                //    zIndex:10,
		                //    label:{x:3,text:'预警上限值',style:{color:'#ED3A15',fontSize:'12px'}}
		                //},
						{
							value: 0.2,
		                    width: 1,
		                    color: '#ED3A15',
		                    zIndex:5,
		                    label:{x:3,text:'预警上限值',style:{color:'#ED3A15',fontSize:'12px'}}
		                }]
            }],
            tooltip: {
            	style: {
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
	function changeDemoJSD(index){		
		changeAreasplineJSD("containerJSD1",datasJSD[0][index]);
	}
	
	/**
	* 改变专题图数据
	*/
	function changeAreasplineJSD(divId,points){
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