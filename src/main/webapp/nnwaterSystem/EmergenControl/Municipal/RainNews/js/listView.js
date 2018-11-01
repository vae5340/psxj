function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var id=getQueryStr("id");
var cityYaId;

function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function formatter_detail(value, row, index){
	return "<button class='btn btn-primary' type=\"button\"  onclick=showWindow('"+row.id+"')>详情</button>";			
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
  
function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1
	};
}
  	
$(function(){
  	$.ajax({
		method:'GET',
		url:'/agsupport/ya-rain-report!inputJson.action?id='+id,
		cache:false,
		async:false,
		dataType:'json',
		success:function(data){
			$("#content").html(data.reportContent);
			cityYaId=data.cityYaId;
			$("#reportName").val(data.reportName);
	       	$("#table").bootstrapTable({
				toggle:"table",
				url:"/agsupport/ya-rain-report!getEachCityRainReport.action?cityYaId="+cityYaId,
				rowStyle:"rowStyle",
				cache: false,
				striped: true,
				clickToSelect:true,
				queryParams: queryParams,
				sidePagination: "server",				
				columns: [{visible:true,checkbox:true},
					{field: 'districtName',title: '成员单位',align:'center'},
					{field: 'rescuePeopleNumber',title: '出动救援人员',align:'center'}, 
					{field: 'rescueCarNumber',title: '出动救援车辆',align:'center'},
					{field: 'reportCreateTime',title: '报告时间',align:'center',formatter:format_time},
					{field: 'reportCreater',title: '报告人',align:'center',formatter:formatter_normal}, 
					{title: '详情', formatter:formatter_detail,align:'center'}]
			});
		},
		error:function (e){}
	});
	$("#table").on('post-body.bs.table', function (row,obj) {
		var content=$("#content").html();
		content=$("#content").html().substr(0,content.length-1)+"。";      
		$("#content").html(content);			
	});
	
});
function showWindow(id){
	var url="/awater/nnwaterSystem/EmergenControl/District/RainNews/listView.html?id="+id;
	parent.createNewtab(url,"成员单位防汛应急响应一雨一报"); 	
}
function addData(){
	if(cityYaId!=null){
		layer.open({
			type: 2,
			title: '成员单位应急预案列表',
			shadeClose: false,
			shade: 0.1,
			area: ['800px', '400px'],
			content: '/awater/nnwaterSystem/EmergenControl/Municipal/RainNews/ya_district_list.html?yaCityId='+cityYaId
		});
	}
}

function changenote(){
	if($("#changenote").attr("status")=="save"){
		layer.confirm('是否保存修改内容？', {btn: ['是','否'] //按钮
		}, function(){
			$("#eg").removeClass("no-padding");
			var str = $('.click2edit').code();
			$('.click2edit').destroy();
			$("#changenote").attr("status","edit");
			$("#changenote").text("修改一雨一报内容");
			$("#reportName").attr("readonly",true);
			$.ajax({
				method:'POST',
				url:'/agsupport/ya-rain-report!saveContent.action',
				data:{ "id":id,"reportContent":str,"reportName":$("#reportName").val()},
				async:false,
				success:function(data){
					layer.msg(data.result);
				},
				error:function (e){
					layer.msg("保存失败");
				}
			});
		}, function(){
			
		});
	} else {
		$("#eg").addClass("no-padding");
        $('.click2edit').summernote({lang: 'zh-CN',focus: true});
        $("#reportName").attr("readonly",false);
        $("#changenote").attr("status","save");
		$("#changenote").text("保存一雨一报内容");
   	}
}
function delData(){		    
   	var selList=$("#table").bootstrapTable('getSelections');
   	if(selList.length==0)
   		layer.msg('请选中删除项');
   	else{
   		layer.confirm('是否删除选中项？', {
			btn: ['是','否'] //按钮
		}, function(){
			var checkedIds= new Array();
	    	for (var i=0;i<selList.length;i++){
	    		checkedIds.push(selList[i].id);
	    	}
    	    $.ajax({  
			    url:'/agsupport/ya-rain-report!deleteMoreJson.action',  
			    traditional: true,
			    data: {"checkedIds" : checkedIds},
			    type: "POST",
			    dataType: "json",
			    success: function(data) {
			        layer.msg(data.result);
    				reloadData();
			    }
			});
		}, function(){
			
		});
   	}
}
function reloadData(){
    $.ajax({
		method : 'GET',
		url :"/agsupport/ya-rain-report!getEachCityRainReport.action?cityYaId="+cityYaId,
		async : false,
		success : function(data) {
		    $("#table").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
		},
		error : function(e) {
			alert('error');
		}
    });	
}
function exportWord(){
	if(id){
		var url = '/agsupport/ya-rain-report!exportWord.action?id='+id;
		window.open(url);
	}else{
		layer.msg("导出失败");
	}
}
