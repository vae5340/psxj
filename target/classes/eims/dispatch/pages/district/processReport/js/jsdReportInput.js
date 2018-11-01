define(['jquery','layer','dateUtil','areaUtil','mousewheel','customScrollbar'],function($,layer,dateUtil,areaUtil){
	var yaId;
	var id,pIndex;
    var reportId;
	var reportType;
	var view;		    
	var districtArea="";
	//id为积水点报告ID，reportId为事中报告ID
	function init(_id,index,_yaId,_view,_reportId,_reportType){
		id=_id;
		yaId=_yaId;
		pIndex=index;
		view=_view;
		reportId=_reportId;
		reportType=_reportType;
		$("#jsdReportSaveBtn").click(save);
		$("#jsdReportCancelBtn").click(cancel);

   	$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : false,
			success : function(data) {
				var districtName=data;	
				for(var index in areaUtil.xzArea){
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;
						break;
					}
				}		
			},
			error : function(e) {
				layer.msg("获取当前用户机构信息失败");
			}
		});

		if(view!=""){
			$("#save").hide();	
			$.ajax({
				type: 'get',
				url : '/psemgy/yaJsdReport/inputJson?id='+id,
				dataType : 'json',  
				success : function(data) {
					for(var key in data){
						if(key.toLowerCase().indexOf("time")!=-1&&data[key]!=null){
							$("#createTime").val(data[key].time);
						} else if(key=="jsdId"){
							$("#jsdId").append("<option value='"+data["jsdId"]+"'>"+data["jsdName"]+"</option>");					       					            
						} else 
						$("#"+key).val(data[key]);        							      
					}
					$.ajax({
						type: 'post',
						url : "/psemgy/yjProblemReport/listJsdJson?yaId="+data["yaId"]+"&jsdId="+data["jsdId"],
						dataType : 'json',  
						success : function(data) {
							$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
						},
						error : function(e) {
							layer.msg("获取积水点列表失败");
						}
					});	
				},
				error : function(e) {
					layer.msg("获取积水点报告失败");
				}
			});	
		} else if(id!="") {
			$.ajax({
				type: 'get',
				url : '/psemgy/yaJsdReport/inputJson?id='+id,
				dataType : 'json',  
				success : function(data) {
					for(var key in data){
						if(key=="jsdId"){
							$("#jsdId").append("<option selected='selected' value='"+data["jsdId"]+"'>"+data["jsdName"]+"</option>");					       					            
						} else 
							$("#"+key).val(data[key]);        							      
					}
					$.ajax({
						type: 'post',
						url : "/psemgy/yjProblemReport/listJsdJson?yaId="+data["yaId"]+"&jsdId="+data["jsdId"],
						dataType : 'json',  
						success : function(data) {
							$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
						},
						error : function(e) {
							layer.msg("获取积水点数据失败");
						}
					});	   
				},
				error : function(e) {
					layer.msg("获取积水点报告失败");
				}
			});				
		} else {
			$("#createInfo").hide();
			$("#yaId").val(yaId);	 
			
		}
		
		var url="/psemgy/yaJsdReport/listNoRepeatJsd?yaId="+$("#yaId").val();
		$.ajax({
			type: 'post',
			url : url,
			dataType : 'json',  
			success : function(data) {			    
				for(var index in data.list){
					if($("#jsdId").val()!=data.list[index].id)
						$("#jsdId").append("<option value='"+data.list[index].id+"'>"+data.list[index].comb_name+"</option>");
				}	
				$("#jsdName").val($("#jsdId").find("option:selected").text());
			},
			error : function(e) {
				layer.msg("获取积水点名称失败");
			}
		});
			
		$('#jsdId').change(function(){
			$("#jsdName").val($(this).find("option:selected").text());
			$.ajax({
				type: 'post',
				url : "/psemgy/yjProblemReport/listJsdJson?yaId="+$("#yaId").val()+"&jsdId="+$(this).val(),
				dataType : 'json',  
				success : function(data) {
					if(data.dutyUnit)
						$("#dutyUnit").val(data.dutyUnit);
					if(data.dutyPerson)
						$("#dutyPerson").val(data.dutyPerson);
					$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
				},
				error : function(e) {
					layer.msg("获取积水点数据失败");
				}
			});	
		});
		$("#tableJsd").bootstrapTable({
			toggle:"table",
			data:{},
			rowStyle:"rowStyle",
			height:250,
			cache: false, 
			checkboxHeader:false,
			singleSelect:true,
			clickToSelect:true,
			sidePagination: "server",
			columns: [
				{field:'problemName',visible: true,title: '问题名称',width:"15%",align:'center'},
				{field:'problemDescription',visible: true,title: '问题描述',align:'center',formatter:formatter_normal},
				{field:'problemPerson',visible: true,title: '上报人',align:'center'},
				{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_time},
				{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
			onSuccessLoad: function(){
				$(".btn_edit").click(detailDialog);
			}	
		});

		$("#content").mCustomScrollbar({
			mouseWheelPixels:300
		});
	}

	    
	function formatter_normal(value, row, index){
		if(value==null)
		return '';
		return value;
	}
	
	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}   

	function addBtnCol(value, row, index){
		return "<button type=\"button\" class=\"btn btn-primary btn_edit\" style=\"border:1px solid transparent;\" data-id=\""+row.id+"\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
	}	
	
	function detailDialog(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/facility/problemReport/problemReportEdit.html",function(h){
			layer.open({
				type: 1,
				title: '应急问题详细',
				shade: 0,
				maxmin: true, 
				area: ['880px', '530px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/facility/problemReport/js/problemReportEdit"],function(problemReportEdit){
						problemReportEdit.init(id,null,index);
					});
				}
			});
		})

	}    
	
	function save(){
		var dataContent = $("#form").serialize();
		if(reportId)
			dataContent += "&reportId="+reportId;
		if(reportType)
			dataContent += "&reportType="+reportType;
		$.ajax({
			type: 'post',
			url : '/psemgy/yaJsdReport/saveJson',
			data:dataContent,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				layer.close(pIndex);
			},
			error : function() {
				layer.msg("报错积水点数据失败");
			}
		});										
	}
			
	function cancel(){
		layer.close(pIndex);
	}

	return{
		init: init
	}
});			