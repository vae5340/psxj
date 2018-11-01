define(['jquery','dateUtil'],function($,dateUtil){
       function init(id){
            $("imgPath").show();		
			$.ajax({
				method : 'GET',
				url : '/psemgy/meteoHydrologAlarm/inputJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					var form=data.form;
					$("#alarmInputDiv #alarmTitle").val(form.alarmTitle);
					$("#alarmInputDiv #alarmTime").val(dateUtil.getLocalTime(form.alarmTime));
					$("#alarmInputDiv #alarmStatus").val(alarmStatus_formatter(form.alarmStatus));
					$("#alarmInputDiv #alarmType").val(alarmType_formatter(form.alarmType));
					$("#alarmInputDiv #alarmContent").val(form.alarmContent);
				},
				error : function() {
					alert('error');
				}
			});		
		}

	    function alarmType_formatter(value){
			if(value=='1')
				return '气象预警';
			else return '水文预警';
		}
		
		
		function alarmStatus_formatter(value){
			if(value=='1')
				return '未启动';
			else if(value=='2') 
				return '已启动';
			else 
				return '已关闭';
		}

		return{
			init:init
		}
});