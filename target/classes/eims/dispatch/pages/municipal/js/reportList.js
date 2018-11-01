define(['jquery','layer','dateUtil','awaterui'],function($,layer,dateUtil,awaterui){
	function init(yaId){
		cityYaId=yaId;
		$("#createRainReportBtn").click(createRainReport);
		//验证当前预案是否已经生成一雨一报
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRainReport/checkHasCityReport',
			data:{cityYaId:cityYaId},
			async : false,
			dataType:'json',
			success : function(data) {
				if(data.canCreateReport==true)
					$("#toolBar").show();
			},
			error : function(e) {
				layer.msg('获取预案一雨一报信息失败');
			}
		});
		
		$("#reportListTable").bootstrapTable({
			toggle:"table",		
			url:"/psemgy/yaRainReport/listCityAllReport?cityYaId="+cityYaId,
			rowStyle:"rowStyle",
			cache: false,
			pagination:false,
			striped: true,
			sidePagination: "server",
			columns: [
				{field: 'type',title:'报告类型',align:'center',formatter:format_type}, 
				{field: 'reportname',title: '报告名称',align:'center'}, 
				{field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
				{field: 'reportcreater',title: '报告人',align:'center'}, 
				{title: '详情', formatter:formatter_detail,align:'center'}],
			onLoadSuccess: function(){
				$(".szbgBtn").click(openszbg);
				$(".yyybBtn").click(openyyyb);
			}	
		});					
	}

    var cityYaId;     
	
	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value.time);
		return '';
	}	

	function formatter_detail(value, row, index){
		if(row.type==1)   	
			return "<button class='btn btn-primary szbgBtn' type=\"button\" data-ids='"+row.id+","+row.cityyaid+","+row.groupid+"'>详情</button>";
		else
			return "<button class='btn btn-primary yyybBtn' type=\"button\"  data-id='"+row.id+"'>详情</button>";			
	}

	function format_type(value, row, index){   
	if(value==1)
		return "事中报告";
	return "一雨一报";   
	}

	function closeLayer(){
		reloadData();
	}
	
	function queryParams(params) {
		return {
			limit:params.limit,
			offset:params.offset
		};
	}

	function openyyyb(e){
		var id=$(e.target).data("id");
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/list.html","防汛应急响应一雨一报",function(){
			require(["psemgy/eims/dispatch/pages/municipal/rainReport/js/list"],function(list){
				list.init(id);
			});
		});
	}

	function openszbg(e){
		var ids=$(e.target).data("ids").split(",");
		var id=ids[0];
		var cityYaId=ids[1];
		var groupId=ids[2];
		//onclick=openszbg('/psemgy/eims/dispatch/pages/municipal/processReport/processReportList.html?id="+row.id+"&cityYaId="+row.cityyaid+"&groupId="+row.groupid+"')
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/processReport/processReportList.html","防汛应急响应事中报告",function(){
			require(["psemgy/eims/dispatch/pages/municipal/processReport/js/processReportList"],function(processReportList){
				processReportList.init(id,cityYaId,groupId);
			});
		});
	}

	function addData(){
		layer.open({
			type: 2,
			title: '新增成员单位一雨一报',
			shadeClose: true,
			shade: 0.5,
			area: ['800px', '300px'],
			content: 'yaList.html' //iframe的url
		});
	}
	function reloadData(){
		$.ajax({
			method : 'GET',
			url:"/psemgy/yaRainReport/listCityAllReport?cityYaId="+cityYaId,
			async : false,
			success : function(data) {
				$("#reportListTable").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
			},
			error : function(e) {
				layer.msg('获取应急报告列表失败');
			}
		});	
	}

	function createRainReport(){
		layer.confirm('是否新增市级单位一雨一报？', {btn: ['是','否']},
		function(index){
			$.ajax({
				method:'GET',
				url:'/psemgy/yaRainReport/createCityReport',
				data:{cityYaId:cityYaId},
				dataType : 'json',  
				async:false,
				success:function(data){
					layer.close(index);
					reloadData();
					$("#toolBar").hide();
					if(data.form)
						parent.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/listView.html?id="+data.form.id,"修改市级一雨一报");
				},
				error:function (e){
					layer.close(index);
					layer.msg("新增市级单位一雨一报失败");
				}
			});
		}, 
		function(){
			
		});
	}

	return{
		init: init
	}
});	