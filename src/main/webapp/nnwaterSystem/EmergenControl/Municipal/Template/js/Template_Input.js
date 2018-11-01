
//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
   
var setting = {
	check: {
		enable: true,
		chkStyle : "checkbox",
		chkboxType: { "Y": "s", "N": "s" }
	},
	data: {
		key: {name: "orgName"},
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parentOrgId",
			rootPId: 0
		}
	}
};
   
$(function(){
	ajaxJsonTemplate();
	$(window).load(function(){
		$("#content").mCustomScrollbar();
		$("#templateCreateTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii:ss',
			autoclose:true,
			pickerPosition:'top-right'
		});
	});
});
   
function ajaxJsonTemplate(){
	if(!id){
    	$.ajax({
			method : 'GET',
			url : '/agsupport/ya-template-city!inputJson.action',
			async : true,
			dataType : 'json',
			success : function(data) {
				searchSms(11); // 加载启动预警短信
			    var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
					}
				}
				var orgTree = data.Tbmap["orgTable"];
				$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
				
			},
			error : function() {
				parent.layer.msg("数据获取失败");
			}
		});
    } else {
	    $.ajax({
			method : 'GET',
			url : '/agsupport/ya-template-city!inputJson.action?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						var selText="";
						if(dictionary[itemname][num].itemCode==data.form[itemname])
							selText="selected='true'";
						$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
					}
				}
				var orgTree = data.Tbmap["orgTable"];
				$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
				for (var key in data.form){
					if(key.toLowerCase().indexOf("time")!=-1)
						$("#"+key).val(getLocalTime(data.form[key].time));
					else if(key=="templateSmsReceiver"){
						var strArray=data.form[key].split(",");
						var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
						for(var i=0;i<strArray.length;i++){
							var node = zTree.getNodeByParam("orgId",strArray[i]);
							node.checked = true;
							zTree.updateNode(node);
						}
					}else if(key=="templateSms"){
						searchSms(11);
					}else
					   	$("#"+key).val(data.form[key]);
				}
			},
			error : function() {
				parent.layer.msg("数据获取失败");
			}
		});
	}
}
   
function save(){
	var dataparam=getStrParamByArray($("#form").serializeArray());
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-template-city!saveJson.action',
		data:dataparam,
		dataType : 'json',  
		success : function(data) {
			parent.layer.msg(data.result);
			var index = parent.layer.getFrameIndex(window.name);
			window.parent.closeLayer(index);
		},
		error : function() {
			parent.layer.msg("数据获取失败");
		}
	});
}
function getStrParamByArray(array){
	var param="";
	for (pitem in array){
		if(param!=""){
			if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
				param+="&"+array[pitem].name+"="+getTimeLong(array[pitem].value);
			} else
				param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
		}
		else{
			if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
				param=array[pitem].name+"="+getTimeLong(array[pitem].value);
			} else
				param=array[pitem].name+"="+encodeURIComponent(array[pitem].value);
		}
	}
	
	//添加机构树状参数
	var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver");
    nodes=treeObj.getCheckedNodes(true);
    checkIds="";
    for(var i=0;i<nodes.length;i++){
    	if(checkIds=="")
    		checkIds=nodes[i].orgId;
    	else
    		checkIds+= ","+nodes[i].orgId;
    }
    param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
	return param;
}

function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
	
function searchSms(value){
	var dataparms={
		alarmType : value,
	};
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-temlate-sms!listSmsMessageAjax.action',
		data : dataparms,
		dataType : 'json',
		success : function(data){
			$.each(eval(data.rows), function(){
				//$("#templateSms").val(this.TEMPLATE_CONTET);
				this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
			});
		},
		error : function(){
		}
	});
}
