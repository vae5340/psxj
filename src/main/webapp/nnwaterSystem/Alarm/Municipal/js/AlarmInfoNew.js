
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var cityYaId=getQueryStr("cityYaId");

$(function (){	
	
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-dispatch-log!listCityLog.action',
		data : {cityYaId:cityYaId},
		
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
			//加载成员单位预案标题
			if(data.districtRecord){
				for (i in data.districtRecord){
					var setText="<li><p><a href='#'>"+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a><span>"+getLocalTime(data.districtRecord[i]["recordCreateTime"].time)+"</span></p></li>";
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