define(['jquery','layer','dateUtil','mousewheel','customScrollbar'],function($,layer,dateUtil){

	var id,cityYaId,groupId;		
	function init(_id,_cityYaId,_groupId){
		id=_id;
		cityYaId=_cityYaId;
		groupId=_groupId;
		$.ajax({
			method:'GET',
			url:'/psemgy/yaProcessReport/inputJson',
			data:{"id":id},
			dataType : 'json',  
			async:false,
			success:function(data){
				$('#processReportList_reportName').html(data.form.reportName)
				$('#processReportList_reportContent').html(data.form.reportContent);
			},
			error:function (e){
				layer.msg("获取事中报告内容失败");
			}
		});

		$("#processReportList_table").bootstrapTable({
			toggle:"table",
			height:parent.$("#content-main").height()-$("#processReportList_reportContent").height()-100,					
			url:"/psemgy/yaProcessReport/listAllDistrictReport?cityYaId="+cityYaId+"&groupId="+groupId+"&id="+id,
			rowStyle:"rowStyle",
			cache: false, 
			pagination:true,
			striped: true,
			pageNumber:1,
			pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams: queryParams,
			sidePagination: "server",
			columns: [
				{field: 'reportname',title: '报告名称',align:'center'}, 
				{field: 'districtname',title: '成员单位',align:'center'},
				{field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
				{field: 'reportcreater',title: '报告人',align:'center'}, 
				{title: '详情', formatter:formatter_detail,align:'center'}],
			onSuccessLoad: function(){
				$("#processReportList_table").on('post-body.bs.table', function (row,obj) {
					$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});				
				});
				$(".szbgBtn").click(openszbg);
			}
		});			
	}
	
	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}
			
	function queryParams(params) {
		return {
			limit:params.limit,
			offset: params.offset
		};
	}

	function formatter_detail(value, row, index){
		return "<button class='btn btn-primary szbgBtn' type=\"button\"  data-ids='"+row.id+","+row.districtyaid+"'>详情</button>";		
	}
		
	function formatter_normal(value, row, index){
		if(value)
			return value;
		return '';
	}
		
	function closeLayer(index) {
		layer.close(index);
		reloadData();
	}		
	function openszbg(url){ 
		var ids=$(e.target).data("ids");
		var id=ids[0];
		var districtyaid=ids[1];
		//onclick=openszbg('/psemgy/eims/dispatch/pages/district/processReport/processReport.html?id="+row.id+"&yaId="+row.districtyaid+"'
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/processReport/processReport.html","查看事中报告",function(){
			require(["psemgy/eims/dispatch/pages/district/processReport/js/processReport"],function(processReport){
				processReport.init(id,districtyaid);
			});
		});  			 
	}

	return{
		init: init
	}
});	