//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
			
var id=getQueryStr("id");						
var yaId=getQueryStr("yaId");
var groupId;
var lack;

$(function(){  
	var jsdUrl;      	            
	if(id){
		$("#reportBtn").hide();
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!inputJson.action',
			data:{"id":id},
			dataType : 'json',  
			async:false,
			success:function(data){
				groupId = data.form.groupId;
			    $('#reportName').val(data.form.reportName)
				$('#content').html(data.form.reportContent);
				if(groupId)
					loadTable();
			},
			error:function (e){
				layer.msg("error");
			}
		}); 
		jsdUrl= "/agsupport/ya-jsd-report!listJson.action?yaId="+yaId; 
	} else {
		var time=new Date();  	            
        $("#reportName").val(time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+time.getHours()+"时事中报告");	            
        $.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!produceCityReportContent.action',
			dataType : 'json',
			async:false,
			success:function(data){
				if(data.repeat!=null){
					parent.layer.msg("已提交事中报告");
				   	var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);	
				} else if(data.lack!=null) {
					lack=1;
				    $('#content').html(data.content);
				    id=data.id;
				    groupId=data.groupId;	
				    changenote();	
				 } else {
				    $('#content').html(data.content);
				    groupId=data.groupId;	
				    id=data.id;							    
				    changenote();							   
				 }
			},
			error:function (e){
				layer.msg("error");
			}
		});
		jsdUrl= "/agsupport/ya-jsd-report!listJson.action?cityYaId="+yaId; 					
	}
	
});          
function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1,
		cityYaId:yaId,
		groupId:groupId
	};
}
function loadTable(){
	$("#table").bootstrapTable({
		toggle:"table",
		height:380,					
		url:"/agsupport/ya-process-report!listAllDistrictReport.action",
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		sortable: false,
		striped: true,
		cache: false,
		pagination:true,
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{field: '2',title: '报告名称',align:'center'}, 
			{field: '3',title: '成员单位',align:'center'},
			{field: '4',title: '报告时间',align:'center',formatter:format_time},
			{field: '5',title: '报告人',align:'center'}, 
			{title: '详情', formatter:formatter_detail,align:'center'}]
	});
}
function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function formatter_detail(value, row, index){
	return "<button class='btn btn-primary' type=\"button\"  onclick=openszbg('"+row[0]+"','"+row[1]+"')>详情</button>";		
}

function openszbg(id,districtYaId){
	var url = "/awater/nnwaterSystem/EmergenControl/District/processReport/processReport.html?id="+id+"&yaId="+districtYaId;
	parent.createNewtab(url,"查看事中报告");  			 
}
       		
function showJsdReport(id){
	//iframe层
	layer.open({
		type: 2,
		title: '修改积水点报告',
		shadeClose: true,
		shade: 0.5,
		area: ['920px', '570px'],
		content: '/awater/nnwaterSystem/EmergenControl/District/processReport/jsdReportInput.html?id='+id
	});
}
		
function changenote(){
	if($("#changenote").attr("status")=="save"){
		if(lack==1){
			layer.confirm('当前有成员单位尚未提交事中报告，是否提交市级报告？', {btn: ['是','否'] //按钮
			}, function(index){
				$("#eg").removeClass("no-padding");
				var aHTML = $('.click2edit').code();
				$('.click2edit').destroy();
				$("#changenote").attr("status","edit");
				$("#changenote").text("修改事中报告");
			    $("#reportName").css("border","none");						
				$("#reportName").attr("readonly",true);
				$.ajax({
					method:'GET',
					url:'/agsupport/ya-process-report!saveJson.action',
					data:{"id":id,"cityYaId":yaId,"reportName":$("#reportName").val(),"reportContent":aHTML,"groupId":groupId},
					dataType : 'json',  
					async:false,
					success:function(data){
						id=data.id;						
						parent.layer.msg(data.result);
			 			var index = parent.layer.getFrameIndex(window.name);
					    parent.layer.close(index);	
					},
					error:function (e){
						layer.msg("保存失败");
					}
				}); 
				layer.close(index);															 
			}, function(index){
				layer.close(index);
			}); 	  			       
		} else {			        					
			$("#eg").removeClass("no-padding");
			var aHTML = $('.click2edit').code();
			$('.click2edit').destroy();
			$("#changenote").attr("status","edit");
			$("#changenote").text("修改事中报告");
		    $("#reportName").css("border","none");						
			$("#reportName").attr("readonly",true);
			$.ajax({
				method:'GET',
				url:'/agsupport/ya-process-report!saveJson.action',
				data:{"id":id,"cityYaId":yaId,"reportName":$("#reportName").val(),"reportContent":aHTML,"groupId":groupId},
				dataType : 'json',  
				async:false,
				success:function(data){
					id=data.id;						
					parent.layer.msg(data.result);
						var index = parent.layer.getFrameIndex(window.name);
				    parent.layer.close(index);	
				},
				error:function (e){
					layer.msg("保存失败");
				}
			});  
		}
    } else {
		$("#eg").addClass("no-padding");
		$('.click2edit').summernote({height: 140,lang: 'zh-CN',focus: true});
        $("#reportName").attr("readonly",false);
        $("#reportName").css("border","1px");
        $("#changenote").attr("status","save");
		$("#changenote").text("保存事中报告");
    }
}
       		
function closeWindow(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}
       		
$(window).load(function(){
    $("#tableDiv").mCustomScrollbar();
});
function exportWord(){
	if(id){
		var url = '/agsupport/ya-process-report!exportWord.action?id='+id;
		window.open(url);
	}else{
		parent.layer.msg("导出失败");
	}
}