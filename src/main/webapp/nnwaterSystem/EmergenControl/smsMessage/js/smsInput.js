
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var id=getQueryStr("id");

$(function(){
	//初始化日期控件
	creatDatetimepicker();
	//初始化区域下拉框
	 $.ajax({
		type: 'get',
		url : '/agsupport/ya-temlate-sms!getArea.action',
		async : true,
		dataType : 'json',  
		success : function(data) {
			$.each(eval(data.rows), function(){
				$("<option/>").val(this.ORG_ID).text(this.ORG_NAME).attr("orgType",this.ORG_TYPE).appendTo("#templateUnitCode");
			});
			$.each(eval(data.smsList), function(){
				$("<option/>").val(this.itemCode).text(this.itemName).appendTo("#alarmType");
			});
			area(); //加载数据
		},
		error : function(e) {
			parent.layer.msg("所属区域初始化失败!");
			area(); //加载数据
		}
	});	
});
//判断短信模板是否唯一   保存/修改
function saveAjaxSmsSame(){
	if(id){
		save();
	}else{
		var datapara = {
			templateUnitCode : $("#templateUnitCode").val(),
			alarmType : $("#alarmType").val(),
		}
		$.ajax({
			method : 'post',
			url : '/agsupport/ya-temlate-sms!getSmsSame.action',
			data : datapara,
			dataType : 'json',
			success : function(data){
				if(data.total>0){
					parent.layer.msg("已有模板");
				}else
					save();
			},error : function(){
				parent.layer.msg("加载失败");
			}
		});
	}	
}
function save(){
	var dataparam=$("#smsMessageForm").serializeArray();
		var obj=new Object();
		obj.name="templateGrade";
		obj.value=$("#templateUnitCode").find("option:selected").attr("orgType");
		if(obj.value==3) obj.value=2;
		dataparam.push(obj);
	    $.ajax({
			type: 'post',
			url : '/agsupport/ya-temlate-sms!doSave.action',
			data:dataparam,
			dataType : 'json',  
			success : function(data) {
				parent.layer.msg(data.result);
				parent.refreshTable();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			},
			error : function(e) {
				parent.layer.msg("操作失败");
			}
		});
}

/**加载数据*/
function area(){
	var url ='/agsupport/ya-temlate-sms!toUpdate.action';
		if(id){
			url+="?id="+id;
			$.ajax({
				method : 'GET',
				url :url,
				async : true,
				dataType : 'json',
				success : function(data) {
					for (var key in data.form){
						$("#"+key).val(data.form[key]);
					}
					var str = data.form.templateCreateTime;
					$("#templateCreateTime").val(toDate(str));
					$("#templateUnitCode").val(data.form.templateUnitCode);
				},
				error : function() {
					parent.layer.msg("获取数据失败");
				}
			});
		}
}

function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

//设置日期空间
function creatDatetimepicker(){
	$('#templateCreateTime').datetimepicker({
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
//格式化日期
 function toDate(obj){  
     var date = new Date();  
     date.setTime(obj.time);  
     date.setHours(obj.hours);  
     date.setMinutes(obj.minutes);  
     date.setSeconds(obj.seconds);  
     return date.pattern("yyyy-MM-dd");
}