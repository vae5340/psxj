define(['jquery','layer'],function($,layer){				
	function init(_yaId,_yaType,_districtUnitId,_status,index){
        yaId=_yaId;
		yaType=_yaType;
		districtUnitId=_districtUnitId;
		status=_status;
		pIndex=index;

		$("#yaId").val(yaId);
		$("#yaType").val(yaType);
		$("#districtUnitId").val(districtUnitId);

        $("#sendNewBtn").click(send);
		$("#cancelNewBtn").click(closeWindow);
		if(status==0){
			$("#superviseType").append("<option selected='selected' value='1'>启动应急响应</option>");
			ajaxSmsContent();
		} else if(status==1) {
			//已启动
			$("#superviseType").append("<option value='2'>提交事中报告</option>");
			$("#superviseType").append("<option value='3'>结束预案督办</option>");
			$("#superviseType").append("<option value='4'>抢险通知督办</option>");
			ajaxSmsContent();
		}
		
		$("#superviseType").change(function(){
			ajaxSmsContent();
		});
	};

	var yaId,yaType,districtUnitId,status,pIndex;
	var superviseContent;

	function send(){
		var sendType=0;
		if($("#superMu").is(":checked") && $("#superSms").is(":checked")){
			sendType=3;
		}else if($("#superSms").is(":checked")){
			sendType=2;
		}else  if($("#superMu").is(":checked")){
			sendType=1;
		}else {
			layer.msg("请选择发送方式");
		}
		
		if(sendType)
			sendType==2? sendSms() : sendMessage(sendType); 
	}

	function sendMessage(sendType){
		if($("#superviseContent").val().trim()==""){
			layer.msg("内容不能为空！");
			return;
		}
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaSuperviseLog/saveJson',
			data:{yaId:$("#yaId").val(),yaType:$("#yaType").val(),superviseContent:$("#superviseContent").val(),superviseType:$("#superviseType").val(),districtUnitId: $("#districtUnitId").val()},
			async : true,
			dataType : 'json',
			success : function(data) {
				if(sendType===1){
					layer.msg("发送成功");
					//parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;	刷新父页面列表暂略		 				
					layer.close(pIndex);
				}
				if(sendType===3){
					sendSms();
				}
			},
			error : function() {
				layer.msg("发送失败");
			}
		});
	}
	// 发送短信
	function sendSms(){
		var dataparms={
			remark : $("#superviseContent").val(),
			receivePerson : districtUnitId,
			}
		$.ajax({
			method : 'post',
			url : '/psemgy/yjSmsRecord/municipalSendSms',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				if(data.status=="200"){
					layer.msg("发送成功");
					parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					layer.close(pIndex);
				}else if(data.status=="300"){
					layer.msg("未检测到手机号，短信未发送");
					//parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					layer.close(pIndex);
				}else{
					layer.msg("发送失败");
					//parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					layer.close(pIndex);
				}
			},
			error : function(){
				layer.msg("发送失败");
			}
		});
}

//加载短信内容
function ajaxSmsContent(){
	$("#test").hide();
	$("#superviseContent").html("");
	var type = $("#superviseType").val();
	if(type)
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateSms/getAlarmTypeSms',
			data : {alarmType:type},
			dataType:'json',
			success : function(data){
				if(data.rows[0]){
					$.each(eval(data.rows), function(){
						if(this.TEMPLATE_CONTET)
							$("#superviseContent").html(this.TEMPLATE_CONTET);
					});
				}else{
					layer.msg("短信模板未添加");
				}
			},error : function(){
				layer.msg("加载失败");
			}
		}); 
	}
			
	function closeWindow(){
		layer.close(pIndex);
	}

	return{
		init: init
	}
});

