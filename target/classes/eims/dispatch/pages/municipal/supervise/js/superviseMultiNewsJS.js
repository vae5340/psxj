define(['jquery','layer','dateUtil','slimscroll'],function($,layer,dateUtil,slimscroll){
	var yaId,yaType,type,pIndex;

	function init(_yaId,_yaType,_type,index){
		yaId=_yaId;
		yaType=_yaType;
		type=_type;
		pIndex=index;
		$("#yaId").val(yaId);	
		$("#yaType").val(yaType);	
		$("#jsSendBtn").click(send);
		$("#jsCancelBtn").click(closeWindow);
		ajaxSmsConetnt(3); // 结束督办通知 短信类型 默认为3
	}

	function send(){
		var sendType;
		if($("#sendSuper").is(":checked") && $("#sendSuperSms").is(":checked")){
			sendType=3
		}else if($("#sendSuper").is(":checked")) {
			sendType=1;
		} else if($("#sendSuperSms").is(":checked")) {
			sendType=2;
		} else {
			layer.msg("请选择发送方式");
		}
		if(sendType)
			sendType==2? sendSmsContent() : sendMessage(sendType);
	}
	
	function sendMessage(sendType){	
		if($("#superviseContent").val().trim()==""){
			layer.msg("内容不能为空！")
			return;
		}
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaSuperviseLog/saveJsonList',
			data:{yaId:$("#yaId").val(),yaType:$("#yaType").val(),superviseContent:$("#superviseContent").val(),superviseType:type},
			dataType : 'json',
			success : function(data) {	
				if(sendType==1){    
					layer.msg(data.result);
					//parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;															    
					layer.close(pIndex);		
					//parent.location.reload();												    							
				}
				if(sendType==3){
					sendSmsContent();
				}
			},
			error : function() {
				alert("error");
			}
		});
	}
	function sendSmsContent(){
		var smsContent = $("#superviseContent").val();
		if(smsContent)
			var dataparms={remark : smsContent}
			$.ajax({
				method : 'post',
				url : '/psemgy/yjSmsRecord/municSendSmsAll',
				data : dataparms,
				dataType : 'json',
				success : function(data){
					if(data.status=="200"){
						layer.msg(data.result);
						//parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;															    
						layer.close(pIndex);		
						//parent.location.reload();
					}else{
						layer.msg("用户没有完善联系方式不能发送发送");
					}
				},
				error : function(){
					layer.msg("短信发送失败！");
				}
			});
	}
				
	function closeWindow(){
		layer.close(pIndex);
	}
	// 加载短信模板内容
	function ajaxSmsConetnt(value){
		if(value)
			$.ajax({
				method : 'POST',
				url : '/psemgy/yaTemplateSms/getAlarmTypeSms',
				data : {alarmType : value},
				dataType : 'json',
				success : function(data){
					if(data.rows[0]){	
						$.each(eval(data.rows), function(){
							$("#superviseContent").html(this.TEMPLATE_CONTET);
						});
					}else{
						layer.msg("短信模板未添加");
					}
				}, error : function(){  }
			});
	}

	return{
		init: init
	}

});
