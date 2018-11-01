
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var districtYaId=getQueryStr("districtYaId");

$(function (){		
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-dispatch-log!listDistrictLog.action',
		data : {districtYaId:districtYaId},
		dataType : 'json',
		success : function(data) {
			var allulcontent=$("#ul_content");
			//加载气象报警
			if(data.mha){
				var setText="<li><p><a href='#' style='color:red;' >"+data.mha.alarmTitle+"</a><span>"+getLocalTime(data.mha.alarmTime.time)+"</span></p></li>";
				allulcontent.append(setText);
			}
			//加载市级督办记录
			if(data.dispatchLog){
				for (i in data.dispatchLog){
					var setText="<li><p><a href='#'>"+data.dispatchLog[i].dispatchTitle+"</a><span>"+getLocalTime(data.dispatchLog[i].dispatchTime.time)+"</span></p></li>";
					allulcontent.append(setText);
				}
			}

			$('.list_lh li:even').addClass('lieven');
			$("div.list_lh").myScroll({
				speed:70, //数值越大，速度越慢
				rowHeight:35 //li的高度
			});
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});
});