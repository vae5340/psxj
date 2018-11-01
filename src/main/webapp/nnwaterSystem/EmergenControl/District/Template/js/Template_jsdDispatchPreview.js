function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
		
var jsdId=getQueryStr("combId");
var modelId=getQueryStr("modelId");
var view=getQueryStr("view");
     	    
function operateFormatterNum(value, row, index) {     
	return value+row.unit;
};
        
function operateFormatter(value, row, index){     
	if(value==undefined)
	   return "";
	else
	   return value;
};
	   
function operateFormatterNum(value, row, index) {     
	return value+row.unit;
};
	   
function getInputNumGood(value, row, index){
		return value;		
}
		
function getInputNumTeam(value, row, index){
		return value;
}	    
	     
function resetValue(o){
	if($(".help-block:visible")[0]){
		$("#save").prop("disabled",true);
	} else {
		$("#save").prop("disabled",false);	          
	}  
}
	     
function peopleFormat(value, row, index){
    return value+"人";		
}

$(function(){
	if(view!=""){
		$("#save").hide();	        
		$("#close").show();		           
	}			        	
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-good-dispatch!inputJsdJsonTemplate.action?jsdId='+jsdId+"&modelId="+modelId+"&type=2",
		async : true,
		dataType : 'json',
		success : function(data) {
			$("#table_good").bootstrapTable({
				toggle:"table",
				data:data.Goodmap["goodTable"],
				rowStyle:"rowStyle",
				height:320,
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'name',visible: true,title: '物资名称',align:'center'},
					{field:'code',visible: true,title: '物资代码',align:'center'},
					{field:'model',visible: true,title: '型号',align:'center'},
					{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
					{field:'amount',visible: true,title: '剩余数量',align:'center',formatter:'operateFormatterNum'}]
			});
			
			$.each(data.Goodmap["goodTable"],function(index,item){
				 if(item["goodChecked"]==1)
				   $("#table_good").bootstrapTable("check",index);
			});
			
			$("#table_team").bootstrapTable({
				toggle:"table",
				data:data.Teammap["teamTable"],
				rowStyle:"rowStyle",
				height:320,  
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'name',visible: true,title: '名称',align:'center'},
					{field:'contact',visible: true,title: '联系人',align:'center'},
					{field:'phone',visible: true,title: '电话',align:'center'},
					{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumTeam,align:'center'},
					{field:'amount',visible: true,title: '剩余人数',formatter:peopleFormat,align:'center'}
				]
			});
			$.each(data.Teammap["teamTable"],function(index,item){
				 if(item["teamChecked"]==1)
				   $("#table_team").bootstrapTable("check",index);
			});	   
		},
		error : function(error) {
			alert('error');
		}
	});
});

function save(){
	var goods=$("#table_good").bootstrapTable("getData");
	var goodIds=[];
	var gDispAmounts=[];
	for(index in goods) {
		var amount=$("input[name='gnumbervalue"+goods[index]["id"]+"']").val();
		if(!amount)
			amount=0;
		goodIds.push(goods[index]["id"]);
		gDispAmounts.push(amount);
	}
	var goodIdsStr=goodIds.join(",");
	var gDispAmountsStr=gDispAmounts.join(",");
	
	var teams=$("#table_team").bootstrapTable("getData");
	var teamIds=[];
	var tDispAmounts=[];
	for(index in teams) {
		var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
		if(!amount)
			amount=0;
		teamIds.push(teams[index]["id"]);
		tDispAmounts.push(amount);					
	}
	
	if(teams[0]){
	   var teamData=teams[0].contact+","+$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
	}
	
	var teamIdsStr=teamIds.join(",");
	var tDispAmountsStr=tDispAmounts.join(",");

	var dataparam="jsdId="+jsdId+"&modelId="+modelId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&type=2";
	
	$.ajax({
		type: 'post',
		url :'/agsupport/ya-good-dispatch!saveJsdDispatch.action',
		data: dataparam,
		dataType : 'json',  
		success : function(data) {
			SetRecordDispatchIds(data);
		    parent.layer.msg(data.result);
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
		},
		error : function(e) {
			parent.layer.msg('error');
		}
	});
}
//设置启动预案的积水点调度ids-启动预案后将该调度的model改为当前预案id
function SetRecordDispatchIds(data){
	var goodDispatchIds = parent.$("#goodDispatchIds").val();
	if(goodDispatchIds)
		parent.$("#goodDispatchIds").val(goodDispatchIds+","+data.goodDispatchIds);
	else
		parent.$("#goodDispatchIds").val(data.goodDispatchIds);
	
	var teamDispatchIds = parent.$("#teamDispatchIds").val();
	if(teamDispatchIds)
		parent.$("#teamDispatchIds").val(teamDispatchIds+","+data.teamDispatchIds);
	else
		parent.$("#teamDispatchIds").val(data.teamDispatchIds);
}
function closeWindow() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
		
$(window).resize(function () {
	$('#table_good').bootstrapTable('resetView');
	$('#table_team').bootstrapTable('resetView');
});

(function($){
	$(window).load(function(){
		$("#table_team").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		   	$('#form').bootstrapValidator();							
		});						         								
		$("#table_good").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		});				
	});
})(jQuery);