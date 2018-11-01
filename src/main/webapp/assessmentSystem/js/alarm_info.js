var pieOption = {
	tooltip: {
	    trigger: 'item',
	    formatter: "{a} <br/>{b}: {c} ({d}%)"
	},
	series: [
	    {
	        name:'管道类型',
	        type:'pie',
	        center: ['50%','50%'],
	        radius: ['20%', '50%'],
	        data:[
	            {value:10, name:'雨水',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#C71585',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}},
	            {value:25, name:'污水',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#228B22',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}},
	            {value:11, name:'合流',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#FF4500',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}}
	        ]
	    }
	]
	};
	
var pieOption2 = {
	tooltip: {
	    trigger: 'item',
	    formatter: "{a} <br/>{b}: {c} km ({d}%)"
	},
	series: [
	    {
	        name:'沟渠类型',
	        type:'pie',
	        center: ['50%','50%'],
	        radius: ['20%', '50%'],
	        data:[
	            {value:1.1, name:'雨水',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#C71585',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}},
	            {value:1.2, name:'污水',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#228B22',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}},
				{value:1.1, name:'合流',itemStyle:{normal:{color:new echarts.graphic.LinearGradient(0, 0, 0, 3, [
	                    {
	                        color: '#FF4500',
	                        offset: 0
	                    },
	                    {
	                        color: '#FFFFFF',
	                        offset: 1
	                    }])}}}
	        ]
	    }
	]
};

var cu_option = {
	useEasing : true,
	useGrouping : true,
	separator : ',',
	decimal : '.',
	prefix : '',
	suffix : ''
};


$(function(){

	/*警报信息初始化*/
    var pieChart = echarts.init(document.getElementById('pie-chart'));
    pieChart.setOption(pieOption);
    
    var radarChart = echarts.init(document.getElementById('pie-chart2'));
    radarChart.setOption(pieOption2);
    
    countUp();

})

function countUp(){
	var demo = new CountUp("gdsl", 0, 1222, 0, 0.5, cu_option);
	demo.start();
	var demo = new CountUp("gscd", 0, 3.12, 2, 0.5, cu_option);
	demo.start();
	demo = new CountUp("jlj", 0, 788, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("pck", 0, 1008, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("lsy", 0, 35, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("dzsc", 0, 120, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("jsp", 0, 1100, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("sp", 0, 78, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("zz", 0, 61, 0, 0.5, cu_option);
	demo.start();
	demo = new CountUp("bz", 0, 231, 0, 0.5, cu_option);
	demo.start();
}