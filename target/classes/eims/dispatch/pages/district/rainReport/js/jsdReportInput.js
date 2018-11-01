define(['jquery','layer','dateUtil','areaUtil','mousewheel','customScrollbar'],function($,layer,dateUtil,areaUtil){
	var reportType,reportId,yaId,id,view,pIndex,districtArea="";
	
	function init(_id,index,_reportType,_reportId,_yaId,_view){
		 reportType =_reportType;
		 reportId = _reportId;
		 yaId=_yaId;
		 id=_id;	
		 view=_view;
		 pIndex=index;		    
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
				layer.msg('获取当前用户机构信息失败');
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
						} else if(key=="jsdId") {
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
							layer.msg('获取积水点信息失败');
						}
					});	
				},
				error : function(e) {
					layer.msg('获取表单信息失败');
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
							layer.msg('获取积水点信息失败');
						}
					});	   
				},
				error : function(e) {
					layer.msg('获取表单信息失败');
				}
			});				
		} else {	          
			$("#createInfo").hide();
			$("#yaId").val(yaId);	 
			var url="/psemgy/yaJsdReport/listNoRepeatJsd?yaId="+yaId;
			if(districtArea){
				url+="&area="+districtArea;
			}          
			$.ajax({
				type: 'post',
				url : url,
				dataType : 'json',  
				success : function(data) {
					$("#jsdId").append("<option selected='selected'></option>");			    
					for(var index in data.list)
						$("#jsdId").append("<option value='"+data.list[index].id+"'>"+data.list[index].comb_name+"</option>");				
				},
				error : function(e) {
					alert('error');
				}
			});
		
			$('#jsdId').change(function(){
				$("#jsdName").val($(this).find("option:selected").text());
				$.ajax({
					type: 'post',
					url : "/psemgy/yjProblemReport/listJsdJson?yaId="+yaId+"&jsdId="+$(this).val(),
					dataType : 'json',  
					success : function(data) {
						if(data.dutyUnit)
							$("#dutyUnit").val(data.dutyUnit);
						if(data.dutyPerson)
							$("#dutyPerson").val(data.dutyPerson);
						$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
					},
					error : function(e) {
						alert('error');
					}
				});	
			});
		}

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
				{field:'problemPerson',visible: true,title: '上报人',align:'center',width:80},
				{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_time,width:180},
				{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
			onSuccessLoad: function(){
				$(".detailBtn").click(detailDialog);
			}		
		});

		//页面加载滚动条样式
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
		return "<button type=\"button\" class=\"btn btn-primary detailBtn\" style=\"border:1px solid transparent;\" data-id='"+row.id+"'\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
	}	
			
	function detailDialog(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/facility/problemReport/problemReportInputView.html",function(h){
			layer.open({
				type: 2,
				title: '应急问题详细',
				shade: 0,
				maxmin: true, 
				area: ['880px', '530px'],
				content: h,	
				success: function(layero,index){
					require(["psemgy/eims/facility/problemReport/js/problemReportInputView"],function(problemReportInputView){
						problemReportInputView.init(id,yaId,1,index);
					})
				}
			});
		});	
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
			data: dataContent,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				layer.close(pIndex);
			},
			error : function() {
				alert('error');
			}
		});										
	}
	//关闭页面
	function cancel(){
		layer.close(pIndex);
	}

	return{ 
		init: init
	}
});	