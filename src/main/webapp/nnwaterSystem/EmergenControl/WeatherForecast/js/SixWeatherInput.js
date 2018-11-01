
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
			url : "/agsupport/ps-qx-sixdata!inputSixWeather.action?id="+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#content").html(data.form.content);
			},
			error : function() {
				alert('加载失败');
			}
		});
   	}
});	     
//关闭
function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
