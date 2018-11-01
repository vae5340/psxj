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
/************排水户按空间位置统计开始***********/
//第零个图表
var optionsKj0 = {
		color: ['#3a64ad','#d36e2a','#939393','#e3ab02','#518bbd','#659b43'],
	    title : {
	        text: '按镇街统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['四标四实门牌数','排水户摸查户数','生活排污','餐饮排污','沉淀物排污','有毒有害排污']
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
	            /*,
	            axisLabel: {  
	            	   interval:0,  
	            	   rotate:40  
		       } */
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'四标四实门牌数',
	            type:'bar',
	            //color:"#3a64ad",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'排水户摸查户数',
	            type:'bar',
	            //color:"#d36e2a",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'生活排污',
	            type:'bar',
	            //color:"#939393",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'餐饮排污',
	            type:'bar',
	            //color:"#e3ab02",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'沉淀物排污',
	            type:'bar',
	            //color:"#518bbd",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'有毒有害排污',
	            type:'bar',
	            //color:"#659b43",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        }
	    ]
};
//第一个图表
var optionsKj1 = {
		color: ['#3a64ad','#d36e2a','#939393','#e3ab02','#518bbd','#659b43'],
	    title : {
	        text: '按镇街统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['四标四实门牌数','排水户摸查户数','生活排污','餐饮排污','沉淀物排污','有毒有害排污']
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
	            ,
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
	            name:'四标四实门牌数',
	            type:'bar',
	            //color:"#3a64ad",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'排水户摸查户数',
	            type:'bar',
	            //color:"#d36e2a",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'生活排污',
	            type:'bar',
	            //color:"#939393",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'餐饮排污',
	            type:'bar',
	            //color:"#e3ab02",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'沉淀物排污',
	            type:'bar',
	            //color:"#518bbd",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'有毒有害排污',
	            type:'bar',
	            //color:"#659b43",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        }
	    ]
};
//第二个图表
var optionsKj2 = {
		color: ['#3a64ad','#d36e2a','#939393','#e3ab02','#518bbd','#659b43'],
	    title : {
	        text: '按社区统计',
	        subtext: ''
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['四标四实门牌数','排水户摸查户数','生活排污','餐饮排污','沉淀物排污','有毒有害排污']
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
	            ,
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
	            name:'四标四实门牌数',
	            type:'bar',
	            //color:"#3a64ad",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'排水户摸查户数',
	            type:'bar',
	            //color:"#d36e2a",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'生活排污',
	            type:'bar',
	            //color:"#939393",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'餐饮排污',
	            type:'bar',
	            //color:"#e3ab02",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'沉淀物排污',
	            type:'bar',
	            //color:"#518bbd",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        },
	        {
	            name:'有毒有害排污',
	            type:'bar',
	            //color:"#659b43",
	            itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'top'}}},
	            data:[0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
	        }
	    ]
};
/***********排水户按空间位置统计结束************/
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
