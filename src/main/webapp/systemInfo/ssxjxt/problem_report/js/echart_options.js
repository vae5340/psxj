var options = {
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
