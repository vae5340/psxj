
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var id=getQueryStr("id");

$(function(){
	var url ='/agsupport/yj-good!inputJson.action';
	if(id)
		url+="?id="+id;
	$.ajax({
		method : 'GET',
		url :url,
		async : true,
		dataType : 'json',
		success : function(data) {
			for (var key in data.form){
				$("#"+key).val(data.form[key]);
			}
			for (var key in data.DistrictList){
				$("#ownerdept").append("<option value='"+data.DistrictList[key].orgId+"'>"+data.DistrictList[key].orgName+"</option>");
			}
		},
		error : function() {
			parent.layer.msg("获取数据失败");
		}
	});
});

function save(){
	if($("#name").val()==""){
		parent.layer.msg("物资名称不能为空");
		return;
	}
	if($("#ownerdept").val()==""){
		parent.layer.msg("权属单位不能为空");
		return;
	}
	if($("#address").val()==""){
		parent.layer.msg("存放地址不能为空");
		return;
	}
	var dataparam=$("#form").serializeArray();
    $.ajax({
		type: 'post',
		url : '/agsupport/yj-good!saveJson.action',
		data:dataparam,
		dataType : 'json',  
		success : function(data) {
			parent.layer.msg(data.result);
			if(parent.frames["iframepage"].contentWindow)
				parent.frames["iframepage"].contentWindow.reloadData();
			else
				parent.frames["iframepage"].window.reloadData();
			parent.layer.close(parent.layer.getFrameIndex(window.name));
		},
		error : function(e) {
			parent.layer.msg("新增失败");
		}
	});
}

function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}