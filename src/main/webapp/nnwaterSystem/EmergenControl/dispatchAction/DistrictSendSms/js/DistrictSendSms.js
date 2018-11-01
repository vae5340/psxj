//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
	   return unescape(r[2]);
	return "";
}
//成员单位预案编号
var yaDistrictId=getQueryStr("yaDistrictId");
//督办队伍编号
var teamId=getQueryStr("teamId");
//督办用户手机号
var phoneSms;

$(function(){
	getDistrictUser();
});

function getDistrictUser(){
	if(yaDistrictId){
		$.ajax({
			method : 'post',
			url : '/agsupport/yj-sms-record!getDistrictUser.action',
			data:{receivePerContent:teamId},
			dataType : 'json',
			success : function(data){
				if(data.result){
					phoneSms=data.result;
				} else {
					parent.layer.msg("该用户未设置移动电话号码，请通知管理员更新用户信息！");
				}
			},
			error: function(){
				parent.layer.msg("获取数据失败！");
			}
		});
	} else {
		parent.layer.msg("获取成员单位预案编号失败！");
	}
}
//新增短信督办信息-增加督办日志
function sendSms(){
	var smsContent = $("#sendSmsContent").val();
	if(!smsContent){
		parent.layer.msg("发送短信督办内容不能为空！");
		return;
	} else if(phoneSms){
		$.ajax({
			method : 'post',
			url : '/agsupport/yj-sms-record!districtSendSms.action',
			data : {remark:smsContent,receivePerContent:teamId,districtYaId:yaDistrictId},
			dataType : 'json',
			success : function(data){
				parent.layer.msg(data.result);
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			},
			error: function(){
				parent.layer.msg("发送短信督办失败！");
			}
		});
	}else{
		parent.layer.msg("该用户未设置移动电话号码，请通知管理员更新用户信息！");
	}
}

function closeWindow(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}