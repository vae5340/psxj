//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var id=getQueryStr("id");
   
$(function(){
	if(id){
	    $.ajax({
			method : 'GET',
			url : '/agsupport/yj-controldept-contact!inputJson.action?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				for (var key in data.form)
					$("#"+key).val(data.form[key]);
			},
			error : function() {
				parent.layer.msg('数据加载失败');
			}
		});
	}
});
   
function save(){
	$.ajax({
		type: 'post',
		url : '/agsupport/yj-controldept-contact!saveJson.action',
		data:$("#form").serialize(),
		dataType : 'json',  
		success : function(data) {
			parent.layer.msg(data.result);
			parent.reloadDataCC();
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
		},
		error : function() {
			parent.layer.msg('数据新增失败');
		}
	});
}

function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}