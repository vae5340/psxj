define(['jquery','layer'],function($,layer){
	//成员单位预案编号
	var yaDistrictId;
	//督办队伍编号
	var teamId;
	//督办用户手机号
	var phoneSms;

	var pIndex;

	function init(_yaDistrictId,_teamId,index){
		yaDistrictId=_yaDistrictId;
		teamId=_teamId;
		pIndex=index;

		$("#sendSmsBtn").click(sendSms);
		$("#cancelSmsBtn").click(closeWindow);
		getDistrictUser();
	}

	function getDistrictUser(){
		if(yaDistrictId){
			$.ajax({
				method : 'post',
				url : '/psemgy/yjSmsRecord/getDistrictUser',
				data:{receivePerContent:teamId},
				dataType : 'json',
				success : function(data){
					if(data.result){
						phoneSms=data.result;
					} else {
						layer.msg("该用户未设置移动电话号码，请通知管理员更新用户信息！");
					}
				},
				error: function(){
					layer.msg("获取数据失败！");
				}
			});
		} else {
			layer.msg("获取成员单位预案编号失败！");
		}
	}
	//新增短信督办信息-增加督办日志
	function sendSms(){
		var smsContent = $("#sendSmsContent").val();
		if(!smsContent){
			layer.msg("发送短信督办内容不能为空！");
			return;
		} else if(phoneSms){
			$.ajax({
				method : 'post',
				url : '/psemgy/yjSmsRecord/districtSendSms',
				data : {remark:smsContent,receivePerContent:teamId,districtYaId:yaDistrictId},
				dataType : 'json',
				success : function(data){
					layer.msg(data.result);
					var index = layer.getFrameIndex(window.name);
					layer.close(index);
				},
				error: function(){
					layer.msg("发送短信督办失败！");
				}
			});
		}else{
			layer.msg("该用户未设置移动电话号码，请通知管理员更新用户信息！");
		}
	}

	function closeWindow(){
		layer.close(pIndex);
	}

	return {
		init: init
	}
});
