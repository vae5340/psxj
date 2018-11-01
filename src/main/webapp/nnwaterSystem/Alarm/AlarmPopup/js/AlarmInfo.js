
$(function (){
	$.ajax({
		method : 'GET',
		url : '/agsupport/jk-alarm-info!popupListJson.action',
		cache : false,
		dataType : 'json',
		success : function(data) {
			var allulcontent=$("#ul_content");
			$.each(data.rows,function(index,item){
				var alarmType = item.ALARM_TYPE == 2?"超越管顶":"超越井盖";
				var setText="<li><a class='a_red' onclick=mapLocation(this) combId="+item.COMB_ID+" estType="+item.EST_TYPE+" xcoor="+item.XCOOR+" ycoor="+item.YCOOR+" >"+item.COMB_NAME+"</a><br />"+
				"<span style='color:#000000; float:left;'>"+alarmType+"</span>"+
				"<span style='color:#000000; float:right;'>"+getLocalTime(item.ALARM_DATE.time)+"</span></li>";
				allulcontent.append(setText);
			});
			
			$('.list_lh li:even').addClass('lieven');
			$(".list_lh").myScroll({
				speed:150, //数值越大，速度越慢
				rowHeight:40 //li的高度
			});
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});
});

function mapLocation(a){
	var obj = new Object();
	obj.combId = $(a).attr("combId");
	obj.estType = $(a).attr("estType");
	obj.xcoor = Number($(a).attr("xcoor"));
	obj.ycoor = Number($(a).attr("ycoor"));
	parent.showInfoWindowByPoint(obj);
}