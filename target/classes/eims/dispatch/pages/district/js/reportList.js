define(['jquery','layer','dateUtil','awaterui','bootstrapTable','bootstrapTableCN'],function($,layer,dateUtil,awaterui){

	var districtYaId;
							
	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}

	function formatter_district(value, row, index){
		return districtName;
	}

	function formatter_detail(value, row, index){
		if(row.type==1)   	
			return "<button class='btn btn-primary szbgBtn' type=\"button\" data-id='"+row.id+"'>详情</button>";
		else
			return "<button class='btn btn-primary yyybBtn' type=\"button\" data-id='"+row.id+"'>详情</button>";			
	}

	function format_type(value, row, index){   
		if(value==1)
			return "事中报告";
		return "一雨一报";   
	}

	function closeLayer(index){
		layer.close(index);
		reloadData();
	}

    function init(id){
		districtYaId = id;
		$("#createRainReportBtn").click(createRainReport);
		//加载预案机构名称
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : false,
			success : function(data) {
				districtName=data;
				$("#title").html(districtName+"应急报告汇总");	
			},
			error : function(e) {
				layer.msg('获取机构信息失败');
			}
		});

		//验证当前预案是否已经生成一雨一报
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRainReport/checkHasDistrictReport',
			data:{districtYaId:districtYaId},
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
		
		$("#districtReportListTable").bootstrapTable({
			toggle:"table",
			height:parent.$("#content-main").height()-120,			
			url:"/psemgy/yaRainReport/listDistrictAllReport?districtYaId="+districtYaId,
			rowStyle:"rowStyle",
			cache: false,
			pagination:false,
			striped: true,
			sidePagination: "server",
			columns: [
				{field: 'type',title:'报告类型',align:'center',formatter:format_type}, 
				{field: 'reportname',title: '报告名称',align:'center'}, 
				{title: '成员单位',formatter:formatter_district,align:'center'},
				{field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
				{field: 'reportcreater',title: '报告人',align:'center'}, 
				{title: '详情',formatter:formatter_detail,align:'center'}],
			onLoadSuccess: function(){
				$(".szbgBtn").click(openszbg);
				$(".yyybBtn").click(openyyyb);
			}	
		});					
	} 


	function openyyyb(e){
		var id=$(e.target).data("id");
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/rainReport/list.html","防汛应急响应一雨一报",function(){
			require(["psemgy/eims/dispatch/pages/district/rainReport/js/list"],function(list){
				list.init(id);
			});
		});
	}

	function openszbg(e){
		var id=$(e.target).data("id");
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/processReport/processReport.html","查看事中报告",function(){
			require(["psemgy/eims/dispatch/pages/district/processReport/js/processReport"],function(processReport){
				processReport.init(id,districtYaId);
			});
		});
		//parent.createNewtab('/psemgy/eims/dispatch/pages/district/processReport/processReport.html?id='+id+"&yaId="+districtYaId,"查看事中报告");
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
			url : "/psemgy/yaRainReport/listDistrictAllReport?districtYaId="+districtYaId,
			async : false,
			success : function(data) {
				$("#districtReportListTable").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
			},
			error : function(e) {
				layer.msg('获取应急报告列表失败');
			}
		});	
	}

	function createRainReport(){
		layer.confirm('是否新增成员单位一雨一报？', {btn: ['是','否']},
		function(index){
			$.ajax({
				method:'GET',
				url:'/psemgy/yaRainReport/createDisReport',
				data:{districtYaId:districtYaId},
				dataType : 'json',  
				async:false,
				success:function(data){
					layer.close(index);
					reloadData();
					$("#toolBar").hide();
					if(data.form)
						awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/listView.html?id="+data.rainReportForm.id,data.rainReportForm.reportName+"一雨一报");
				},
				error:function (e){
					layer.close(index);
					layer.msg("新增成员单位一雨一报失败");
				}
			});
		}, 
		function(){
			
		});
	}

	return {
		init: init
	}
});