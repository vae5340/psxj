var options = {
    color: ['#003366','#3398DB'],
    legend:{data:[]},
    title: {
        text: '  各区签到统计'
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
    // toolbox:{
        //     show : true,
        //     orient: 'vertical',
        // right:25,
        // feature : {
        // // dataView : {show: true, readOnly: false},
        // magicType : {show: true, type: ['line', 'bar']},
        // restore : {show: false},
        // saveAsImage : {show: true}
        //     },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisLabel: {
            	interval: 0	
            	//rotate: -30 //30度
            },
            axisTick: {
                alignWithLabel: false
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            max:'dataMax'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            stack:'one',
            label:{normal:{show:true}},
            barWidth: '30%',
            barGap: 0,
            data:[]
        },
        {
            name:'',
            type:'bar',
            stack:'two',
            label:{normal:{show:true}},
            barWidth: '30%',
            data:[],

        }
        ,{
            name: '未签到',
            type: 'bar',
            stack:'one',
            label: {
                normal: {
                    textStyle: {
                        color: '#112d59'
                    },
                    show: false,
                }
            },
            itemStyle: {
                normal: {
                    color: '#E5F9FB',
                }
            },
            data: []
        },{
            name: '未签到',
            type: 'bar',
            stack:'two',
            label: {
                normal: {
                    textStyle: {
                        color: '#112d59'
                    },
                    show: false,
                }
            },
            itemStyle: {
                normal: {
                    color: '#E5F9FB',
                }
            },
            data: [],
            barCategoryGap:'10%'
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

var placeHolderStyle = {
    normal : {
        // color: 'rgba(0,0,0,0)',
        color: '#E5F9FB',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: '#E5F9FB',
        // color: 'rgba(0,0,0,0)'
    }
};

var dataStyle = {
    normal: {
        label: {
                show:true,
                formatter:'{a}:{c}',
        },
    }
};



var pie_option = {
    // backgroundColor: '#f4f2e3',fd4f8d
    title: {
        text: '全市已签到统计'
    },
    color: ['#003366','#3398DB'],
    tooltip : {
        show: true,
        formatter: "{b} : {c} ({d}%)"
    },
    // legend: {
    //     itemGap:12,
    //     top: '87%',
    //     data:['2018-01-04','2018-01-03']
    // },
    // toolbox: {
    //     show : true,
    //     feature : {
    //         mark : {show: true},
    //         dataView : {show: true, readOnly: false},
    //         restore : {show: true},
    //         saveAsImage : {show: true}
    //     }
    // },
    series : [
        {
            name:'',
            type:'pie',
            clockWise:false,
            // startAngle:250,
            radius : [45, 75],
            label: {
                normal: {
                    position: 'inner',
                    color:'#fff',
                    show:true,
                    formatter:'{c}'
                }
            },
            labelLine: {
                normal: {
                    show: true,
                    length:5
                }
            },
            itemStyle : dataStyle,
            hoverAnimation: false,
            data:[
                {
                    value:100,
                    name:'01'
                }
                ,
                {
                    value:100,
                    name:'ppp',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'',
            type:'pie',
            clockWise:false,
            // startAngle:287,
            radius : [10,40],
            label: {
                normal: {
                    position: 'inner',
                    show:true,
                    formatter:'{c}'
                }
            },
            itemStyle : dataStyle,
            hoverAnimation: false,
            data:[
                {
                    value:150,
                    name:'02'
                },
                {
                    value:60,
                    name:'ppp',
                    itemStyle : placeHolderStyle
                }
            ]
        }

    ]
};
