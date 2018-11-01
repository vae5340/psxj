define(['jquery','echarts','layer'],function($,echarts,layer){
		//图
	
	function stat_chart(){
		
		$.ajax({
			url: '/psemgy/yjProblemReport/statJsd',
			dataType: 'json',
			async: false,
			success: function(res){
				
				var xAxisData = [];
				var data = [];
				for(var a = 0; a<res.rows.length;a++) {//a in res.rows
					var b =res.rows[a];
					xAxisData.push(b.COMB_NAME||"");
					data.push(b.NUM)
				}
				var prChart = echarts.init(document.getElementById('problemReportChart'));
				prOption = {
					grid:{top:30,bottom:80,left:10,right:85,containLabel: true},
					tooltip: {trigger: 'item'},
					toolbox: {feature: {dataView: {show: true, readOnly: false},magicType: {show: true, type: ['line', 'bar']},restore: {show: true},saveAsImage: {show: true}}},
					xAxis: [{type: 'category',data: xAxisData,axisLabel:{interval:0,rotate:-30}}],
					yAxis: [{type: 'value',name: '次数',axisLabel: {formatter: '{value}'}}],
					series: [{name:'积水次数',type:'bar',data:data}]
				};
				prChart.setOption(prOption);
			},
			error: function(xhr,error,errorThrown){
				layer.msg("统计图初始化出错！", {icon: 2,time: 1000});
				console.log("stat_chart！"+error);
			}
		})
	}
	//表
	var table_data;
	var table_data_total;
	var pageNum = 10;
	function stat_table(pgNum){
		if(table_data && table_data_total){
			for(var a = pgNum-10;( a < pgNum && a < table_data_total );a++){
				var h = "<tr><td>" + table_data[a].COMB_NAME + "</td><td>" + table_data[a].NUM + "</td></tr>"
				$("#tbody").append(h);
				if(a==table_data_total-1)
					$("#getMore").hide();
			}
			pageNum = pgNum + 10;
		} else {
			$.ajax({
				url: '/psemgy/yjProblemReport/getAllJsd',
				dataType: 'json',
				type: 'post',
				success: function(res){
					table_data = res.rows;
					table_data_total = res.total;
					stat_table(pgNum);
				},
				error: function(xhr,error,errorThrown){
					layer.msg("error");
				}
			})
		}
	}

	function getMore(){
		stat_table(pageNum);
	}
	function initBtn(){
		$('#getMore').click(getMore);
	}
	function init(){
		pageNum=10;
        //Todo temp
          //图
		  stat_chart();
		  //列表
		  stat_table(pageNum);
		  initBtn();
	}
	return {
		init:init
	}
})
