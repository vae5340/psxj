$(function(){
	//图
	stat_chart();
	//列表
	stat_table(pageNum);
})
//表
function stat_chart(){
	
	$.ajax({
		url: '/agsupport/yj-problem-report!statJsd.action',
		dataType: 'json',
		async: false,
		success: function(res){
			
			var xAxisData = [];
			var data = [];
			for(a in res.rows) {
				var b =res.rows[a];
				xAxisData.push(b.COMB_NAME||"");
				data.push(b.NUM)
			}
			var prChart = echarts.init(document.getElementById('problemReportChart'));
			prOption = {
				grid:{top:10,bottom:10,left:10,right:10},
				tooltip: {trigger: 'item'},
				toolbox: {feature: {dataView: {show: true, readOnly: false},magicType: {show: true, type: ['line', 'bar']},restore: {show: true},saveAsImage: {show: true}}},
				xAxis: [{type: 'category',data: xAxisData}],
				yAxis: [{type: 'value',name: '次数',min: 'auto',max: 'auto',axisLabel: {formatter: '{value}'}}],
				series: [{name:'积水次数',type:'bar',data:data}]
			};
			prChart.setOption(prOption);
		},
		error: function(xhr,error,errorThrown){
			parent.layer.msg("error");
		}
	})
}
//图
var table_data;
var table_data_total;
var pageNum = 10;
function stat_table(pgNum){
	if(table_data && table_data_total){
		for(var a = pgNum-10;a < pgNum;a++){
			var h = "<tr><td>" + table_data[a].COMB_NAME + "</td><td>" + table_data[a].NUM + "</td></tr>"
			$("#tbody").append(h);
			if(a==table_data_total-1)
				$("#getMore").hide();
		}
		pageNum = pgNum + 10;
	} else {
		$.ajax({
			url: '/agsupport/yj-problem-report!getAllJsd.action',
			dataType: 'json',
			type: 'post',
			success: function(res){
				table_data = res.rows;
				table_data_total = res.total;
				stat_table(pgNum);
			},
			error: function(xhr,error,errorThrown){
				parent.layer.msg("error");
			}
		})
	}
}

function getMore(){
	stat_table(pageNum);
}