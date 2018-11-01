//////////////////////////////////option1////////////////////////////////////
var option_a = {
		title : {
			show:true,
			text:'管道类型统计'
		},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['上城区','下城区','江干区','拱墅区','西湖区','滨江区']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel: {
		            formatter: '{value} km'
		        }
	        }
	    ],
	    series : [
	        {
	            name:'雨水',
	            type:'bar',
	            data:[1.21, 1.30, 1.20, 1.21, 0.98, 1.00],
	            label:{
	            	normal:{
	            		show:true,
	            		position:'top',
	            		textStyle:{
	            			color: '#000'
	            		}
	            	}
	            },
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#9932CC',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
			{
	            name:'污水',
	            type:'bar',
	            data:[1.12, 0.84, 0.64, 0.33, 0.78, 1.00],
	            label:{
	            	normal:{
	            		show:true,
	            		position:'top',
	            		textStyle:{
	            			color: '#000'
	            		}
	            	}
	            },
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#4682B4',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
			{
	            name:'合流',
	            type:'bar',
	            data:[1.52, 1.12, 1.22, 0.92, 0.92, 1.32],
	            label:{
	            	normal:{
	            		show:true,
	            		position:'top',
	            		textStyle:{
	            			color: '#000'
	            		}
	            	}
	            },
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#FF8C00',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        }
	    ]
	};
/////////////////////////////////option2////////////////////////////////////////
var option_b = {
		title : {
			show:true,
			text:'管点统计'
		},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data:['出水口','进水口','窨井','雨水蓖']
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['上城区','下城区','江干区','拱墅区','西湖区','滨江区']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'出水口',
	            type:'bar',
	            data:[120, 132, 101, 134, 90, 230],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#c23531',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'进水口',
	            type:'bar',
	            data:[220, 182, 191, 234, 290, 289],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#2f4554',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'窨井',
	            type:'bar',
	            data:[177, 203, 198, 165, 178, 270],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#61a0a8',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'雨水蓖',
	            type:'bar',
	            data:[150, 232, 201, 154, 190, 330],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#d48265',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        }
	    ]
	};
/////////////////////////////////option3////////////////////////////////////////
var option_c = {
	title : {
		show:true,
		text:'管点总数增长图'
	},
	tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data:['2012年','2013年','2014年','2015年','2016年']
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['上城区','下城区','江干区','拱墅区','西湖区','滨江区']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'2012年',
	            type:'bar',
	            data:[120, 132, 101, 134, 90, 99],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#FF00FF',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2013年',
	            type:'bar',
	            data:[145, 182, 123, 145, 121, 111],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#7B68EE',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2014年',
	            type:'bar',
	            data:[170, 203, 156, 165, 188, 145],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#483D8B',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2015年',
	            type:'bar',
	            data:[199, 232, 201, 170, 190, 178],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#CD5C5C',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2016年',
	            type:'bar',
	            data:[208, 240, 234, 177, 208, 199],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#800080',
                            offset: 0
                        },
                        {
                            color: '#FFFFFF',
                            offset: 1
                        }])
	            	}
	            }
	        }
	    ]
};

$(function(){
//	var chartDiv1 = echarts.init(document.getElementById('firstChart'));
//	chartDiv1.setOption(option_a);
//	
//	var chartDiv2 = echarts.init(document.getElementById('secondChart'));
//	chartDiv2.setOption(option_b);
//	
//	var chartDiv3 = echarts.init(document.getElementById('thirdChart'));
//	chartDiv3.setOption(option_c);
})