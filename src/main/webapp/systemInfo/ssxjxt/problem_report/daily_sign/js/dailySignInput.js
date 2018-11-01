var id = getQueryStr("id");
var url=""; 
$(function(){
	//填充数据
	reloadCorrectMark();
	//初始化时间
	//loadTime();
});
//加载数据
function reloadCorrectMark(){
	//daily-sign!getDailySignList
	if(id){
		$.ajax({
			method: 'get',
			url: '/psxj/dailySign/getUserSignRecord/'+id,
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.data){
					for(var k in data.data){
						if(k=='signTime' && data.data[k]){
                            $("#"+k).val(new Date(data.data[k]).pattern("yyyy-MM-dd HH:mm"));
						}else{
							$("#"+k).val(data.data[k]);
						}
					}
				}
			},error:function(){ }
		});
	}
}
//初始化时间
function loadTime(){
	$("#markTime").datetimepicker({
		language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd'
		
  	});
}
