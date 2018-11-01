define(['jquery','dateUtil','myScroll'],function($,dateUtil){
	function init(cityYaId){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaDispatchLog/listCityLog',
			data : {cityYaId:cityYaId},
			
			dataType : 'json',
			success : function(data) {
				var allulcontent=$("#muni_ul_content");
				//加载气象报警
				if(data.mha){
					var setText="<li><p><a href='#' style='color:red;' >"+data.mha.alarmTitle+"</a><span>"+dateUtil.getLocalTime(data.mha.alarmTime.time)+"</span></p></li>";
					allulcontent.append(setText);
				}
				//加载市级督办记录
				if(data.dispatchLog){
					for (var i=0;i<data.dispatchLog.length;i++){
						var setText="<li><p><a href='#'>"+data.dispatchLog[i].dispatchTitle+"</a><span>"+dateUtil.getLocalTime(data.dispatchLog[i].dispatchTime.time)+"</span></p></li>";
						allulcontent.append(setText);
					}
				}
				//加载成员单位预案标题
				if(data.districtRecord){
					for (var i=0;i<data.districtRecord.length;i++){
						var setText="<li><p><a href='#'>"+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a><span>"+dateUtil.getLocalTime(data.districtRecord[i]["recordCreateTime"].time)+"</span></p></li>";
						allulcontent.append(setText);				   															
					}
				}
				$('#muni_list_lh li:even').addClass('lieven');
				$("#muni_list_lh").myScroll({
					speed:70, //数值越大，速度越慢
					rowHeight:35 //li的高度
				});
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
	}

	return{
		init: init
	}
});	