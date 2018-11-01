//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var names = getQueryStr("name");
var jobName;

$(function(){
	if(names){
		$.ajax({
			method : 'get',
			url : '/agsupport/ps-kettle-job!toUpdate.action?jobName='+names,
			dataType : 'json',
			success : function(data){
				for(var key in data.form){
					if(key == "jobName"){
						document.getElementById(key).readOnly="readonly";
					}
					$("#"+key).val(data.form[key]);
				}
			},error : function(){}
		});
	}	
	
	
});

function save(){
	/**
	else if($.trim(cycleTime.val()) == ""){
			cycleTime.focus();
		}else if($.trim(address.val()) == ""){
			address.focus();
		}
	*/
	if(names){
		var nameJob = $("#jobName");
		var cycleTime = $("#cycleTime");
		var address = $("#address");
		if($.trim(nameJob.val()) == ""){
			nameJob.focus();
		}else{
			var temp = $("#jenkins").serializeArray();
			$.ajax({
				metohd : 'post',
				url : '/agsupport/ps-kettle-job!update.action',
				data : temp,
				dataType : 'json',
				success : function(data){
					if(data.status=="200"){
						parent.layer.msg("修改成功!");
						parent.refreshTable();
						parent.layer.close(parent.layer.getFrameIndex(window.name));
					}else{
						parent.layer.msg("修改失败!");
						//parent.layer.close(parent.layer.getFrameIndex(window.name));
					}
				},error : function(){}
			});
		}
		var jobName = $("#jobName").val();
	}else{
		vailName("jobName");
		var vaild = $("#jobName").val();
		$.ajax({
			metohd : 'get',
			url : '/agsupport/ps-kettle-job!toUpdate.action?jobName='+vaild,
			dataType : 'json',
			success : function(data){
				if(data.status == "500"){
					$("#valid_con").html("");
					addJob();
				}else{
					$("#valid_con").html("项目名已被使用");
				}
			},error : function(){}
		});
	}
}

function vailName(value){
	var jobValue = $("#"+value).val();
	if(jobValue)
		$.ajax({
			metohd : 'get',
			url : '/agsupport/ps-kettle-job!toUpdate.action?jobName='+jobValue,
			dataType : 'json',
			success : function(data){
				if(data.status == "500"){
					$("#valid_con").html("");
				}else{
					$("#valid_con").html("项目名已被使用");
				}
			},error : function(){}
		});
}
//关闭
function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
// 新增
function addJob(){
	var temp = $("#jenkins").serializeArray();
	$.ajax({
		metohd : 'post',
		url : '/agsupport/ps-kettle-job!addJob.action',
		data : temp,
		dataType : 'json',
		success : function(data){
			if(data.status=="200"){
				parent.layer.msg("添加成功!");
				parent.refreshTable();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}else{
				parent.layer.msg("添加失败!");
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		},error : function(){}
	});
}
