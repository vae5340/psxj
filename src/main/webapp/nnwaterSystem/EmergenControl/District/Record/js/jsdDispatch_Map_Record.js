function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var jsdId=getQueryStr("combId");
var modelId=getQueryStr("modelId");
var type=getQueryStr("type");
var view=getQueryStr("view");

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

function operateFormatterNum(value, row, index) {     
   return value+row.unit;
};

function operateFormatter(value, row, index){     
	if(value)
		return value;
	else
		return "";
};

function operateFormatterNum(value, row, index) {     
	return value+row.unit;
};

function getInputNumGood(value, row, index){
	if(value)
		return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control' max='"+(row["amount"]+value)+"' 'min='0' onblur='resetValue(this)' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
	else
		return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0' style='text-align:center;width:80px;margin-left:30px'></input>";
}

function getInputNumTeam(value, row, index){
	if(value)
		return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' onblur='resetValue(this)' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
	else
		return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0'  style='text-align:center;width:80px;margin-left:30px'></input>";
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
		url : '/agsupport/ya-good-dispatch!inputJsdJsonAfter.action?jsdId='+jsdId+"&modelId="+modelId,
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

	var dataparam="jsdId="+jsdId+"&modelId="+modelId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&type=4";
	
	$.ajax({
		type: 'post',
		url :'/agsupport/ya-good-dispatch!saveJsdDispatchRecord.action',
		data: dataparam,
		dataType : 'json',  
		success : function(data) {
		    parent.layer.msg(data.result);
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
		},
		error : function(e) {
			parent.layer.msg('error');
		}
	});
}

function closeWindow() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}