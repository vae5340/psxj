define(['jquery','dateUtil'],function($,dateUtil){
    function init(){
		//三小时
		ajaxWeather();
		//24小时
		ajaxWeatherSeven();
		
	}

	function onWaterThree(){
		var threeId = $("#threeId");
		layer.open({
			type: 2,
			area: ['800px', '400px'],
			title : "短期天气预报",	
			content: ['/awater/nnwaterSystem/EmergenControl/WeatherForecast/ThreeAndSixWeather.html?id='+threeId, 'yes']
		});
	}
	/**24小时*/
	function onWaterSeven(){
		var sevenId = $("#sevenId").val();
		layer.open({
			type: 2,
			area: ['970px', '480px'],
			title : "短期天气预报",	
			content: ['/psemgy/eims/alarm/shortWeatherForcast/sevenDayWeatherInput.html?id='+sevenId, 'yes']
		});
	}
	/**三小时的天气预报*/
	function ajaxWeather(){
		$.ajax({
			method : 'GET',
			url : '/agsupport/ps-qx-data!getThreeWeather.action',
			async : true,
			dataType:'json',
			success:function(data){
				if(data.rows[0]){
					var time = format_date(data.rows[0].QX_DEVICE_TIME);
					$("#threeId").val(data.rows[0].ID);
					$("#threeContent").html(data.rows[0].QX_CONTENT);
					$("#threeContentTime").html(time.toString());
				}
			},
			error : function(){ }
		});
	}
	/**六小时的天气预报*/
	function ajaxWeatherSix(){
		$.ajax({
			method : 'GET',
			url : '/agsupport/ps-qx-sixdata!getSixWeather.action',
			async : true,
			dataType:'json',
			success:function(data){
				if(data.rows){
					/**
					var date = format_date(data.rows[0].QX_DEVICE_TIME);
					$("#threeWeather").val(data.rows[0].ID).text(data.rows[0].QX_CONTENT);
					$("#threeWeatherTime").html(date.toString());
					*/
				}
			},
			error : function(){ }
		});
	}
	/**24小时的天气预报*/
	function ajaxWeatherSeven(){
		$.ajax({
			method : 'GET',
			url : '/agsupport/ps-qx-seven-data!getAsSeven.action',
			async : true,
			dataType:'json',
			success:function(data){
				if(data.rows[0]){
					var date = format_date(data.rows[0].DEVICE_TIME);
					$("#sevenId").val(data.rows[0].ID);
					$("#sevenContent").html("24小时天气预报");
					$("#sevenContentTime").html(date.toString());
				}
			},
			error : function(){ }
		});
	}
	//格式化日期
	function format_date(value){
		if(value)
			return dateUtil.getLocalTime(value.time);
		return '';
	}

	return{
		init:init,
		onWaterThree: onWaterThree,
		onWaterSeven: onWaterSeven
	}
});
