define(['jquery','dateUtil','ssjk-map','myScroll'],function($,dateUtil,ssjkMap){
	function init(rows){
		var allulcontent=$("#all_content");
		$.each(rows,function(index,item){
			var alarmType = item.ALARM_TYPE == 2?"超越管顶":"超越井盖";
			var setText="<li><a class='a_red' combId="+item.COMB_ID+" estType="+item.EST_TYPE+" xcoor="+item.XCOOR+" ycoor="+item.YCOOR+" >"+item.COMB_NAME+"</a><br />"+
			"<span style='color:#000000; float:left;'>"+alarmType+"</span>"+
			"<span style='color:#000000; float:right;'>"+dateUtil.getLocalTime(item.ALARM_DATE.time)+"</span></li>";
			allulcontent.append(setText);

			$("#all_content .a_red").click(ssjkMap.showInfoWindowByPoint);
		}); 
		
		$('.list_lh li:even').addClass('lieven');
		$(".list_lh").myScroll({
			speed:150, //数值越大，速度越慢
			rowHeight:40 //li的高度
		});
	}

	return {
		init: init
	}
});


