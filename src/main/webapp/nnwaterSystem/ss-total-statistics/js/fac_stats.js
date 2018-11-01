////////////////////////////////////////////option1////////////////////////////////////////////
var option1 = {
		title : {
			show:true,
			text:'智能设备统计'
		},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data:['智能井盖','水位仪','水位尺']
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
	            name:'智能井盖',
	            type:'bar',
	            data:[255, 270, 286, 243, 264, 230],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#6495ED',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'水位仪',
	            type:'bar',
	            data:[220, 182, 191, 234, 245, 261],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#4682B4',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'水位尺',
	            type:'bar',
	            data:[177, 154, 139, 165, 178, 177],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#7B68EE',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        }
	    ]
	};
////////////////////////////////////////option2//////////////////////////////////////////////////////////////
var option2 = {
	title : {
		show:true,
		text:'智能设备增长图'
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
	            data:[308, 356, 333, 299, 312, 347],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#40E0D0',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2013年',
	            type:'bar',
	            data:[322, 389, 360, 344, 355, 398],
	            itemStyle:{
	            	normal:{
	            		color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#3CB371',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2014年',
	            type:'bar',
	            data:[381, 405, 389, 380, 400, 420],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#008080',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2015年',
	            type:'bar',
	            data:[412, 420, 411, 410, 420, 441],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#2E8B57',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        },
	        {
	            name:'2016年',
	            type:'bar',
	            data:[450, 478, 488, 456, 489, 476],
	            itemStyle:{
	            	normal:{
	            		color:new echarts.graphic.LinearGradient(0, 0, 0, 2, [
                        {
                            color: '#2F4F4F',
                            offset: 0
                        },
                        {
                            color: '#DCDCDC',
                            offset: 1
                        }])
	            	}
	            }
	        }
	    ]
};

$(function(){
	var chartDiv1 = echarts.init(document.getElementById('znsb_chartDiv1'));
	chartDiv1.setOption(option1);
	
	var chartDiv2 = echarts.init(document.getElementById('znsb_chartDiv2'));
	chartDiv2.setOption(option2);
})