//例子 无效
var options222 = {
    color: ['#3398DB'],
    title: {
        text: '本周部件统计',
        textStyle:{
           //字体大小
    　　　　		fontSize:12
        }
    },
    tooltip : {
        trigger: 'axis',
        // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        // }
    },
    grid: {
        left: '1%',
        right: '6%',
        bottom: '13%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司'],
            axisLabel: {
            	interval: 0	
            	//rotate: -30 //30度
            },
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'上报统计',
            type:'bar',
            barWidth: '60%',
            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0]
        }
    ]
};
//第一个tab的第一个图表
var options1 = {
		color: ['#3398DB','green'],
	    title : {
	        text: '按区统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['上报排水户数量','需整改排水户数量']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'上报排水户数量',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'需整改排水户数量',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[60, 75, 20, 80, 250, 13, 35, 45, 50,60,80]
	        }
	    ]
};
//第二个tab的第一个图表
var options2 = {
		color: ['#3398DB','green'],
	    title : {
	        text: '按区统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['上报人数','安装人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'上报人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[1, 2, 2, 1, 1, 1, 0, 1, 2,1,1]
	        },
	        {
	            name:'安装人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[2, 1, 2, 2, 1, 1, 2, 1, 1,2,2]
	        }
	    ]
};
//第三个tab的第一个图表
var options3 = {
		color: ['#3398DB','green'],
	    title : {
	        text: '按区统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['应有人数','上报人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
			{
			    name:'应有人数',
			    type:'bar',
			    itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
			    data:[78, 48, 48, 69, 30, 70, 69, 60, 57,39,27]
			},
	        {
	            name:'上报人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[10, 15, 9, 8, 2, 8, 12, 30, 20,4,25]
	        }
	    ]
};
//第一个tab的第二个图表
var options11 = {
		color: ['#3398DB','green'],
	    title : {
	        text: '按镇街统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['上报排水户数量','需整改排水户数量']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化'],
	            axisLabel: {  
	            	   interval:0,  
	            	   rotate:40  
		       } 
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'上报排水户数量',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'需整改排水户数量',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        }
	    ]
};
//第二个tab的第二个图表
var options22 = {
		color: ['#3398DB','green'],
	    title : {
	        text: '按镇街统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['上报人数','安装人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化'],
	            axisLabel: {  
	            	   interval:0,  
	            	   rotate:40  
		       } 
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'上报人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'安装人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        }
	    ]
};
//第三个tab的第二个图表
var options33 = {
		color: ['green'],
	    title : {
	        text: '按镇街统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['上报人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : [],
	            axisLabel: {  
            	   interval:0,  
            	   rotate:40  
	            } 
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'上报人数',
	            type:'bar',
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[]
	        }
	    ]
};
//加载他图表数据
var loadEachr= (function(){
	return {
		loadData: function(url,data){
			if(url){
				var rows;
				$.ajax({
					method: 'post',
					url: url,
					data: data? data : {},
					async : false,
					dataType: 'json',
					success: function(data){
						rows=data;
					},error:function(){
						return '';
					}
				});
				return rows;
			}else{
				return '';
			}
		}
	}

})();
