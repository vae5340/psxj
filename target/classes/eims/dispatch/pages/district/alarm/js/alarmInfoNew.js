define(["jquery","dateUtil"],function($,dateUtil){
    function init(_districtYaId){	
		districtYaId = _districtYaId;	
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaDispatchLog/listDistrictLog',
			data : {districtYaId:districtYaId},
			dataType : 'json',
			success : function(data) {
				var allulcontent=$("#district_ul_content");
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

				$('.list_lh.districtList li:even').addClass('lieven');
				$(".list_lh.districtList").myScroll({
					speed:70, //数值越大，速度越慢
					rowHeight:35 //li的高度
				});
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
	}

	function getDistrictYaId(){
		return districtYaId;
	}

	var districtYaId;

	return{
		init: init,
		getDistrictYaId: getDistrictYaId
	}
});