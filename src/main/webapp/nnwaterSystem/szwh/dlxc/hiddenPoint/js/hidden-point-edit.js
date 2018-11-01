(function ($) {
	$(window).load(function () {

		$("#recordTime").datepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			pickerPosition:'bottom-right'
    	});
	});
	
	var id = GetQueryString("id");
	///alert(id);
	//如果地址中包含id，则是修改数据
	if(id != null){
		$.ajax({
			url: '/agsupport/sz-hiddenpoint!getById.action?id=' + id,
			dataType: 'json',
			success: function(res){
				console.log(res['rows']);
				var r = res['rows'];
				//id
				
				//隐患点位置
				if(r.hiddenPointLocation != "" && r.hiddenPointLocation != null){
					$("#hiddenPointLocation").val(r.hiddenPointLocation);
				}
				//隐患点描述
				if(r.hiddenPointDescription != "" && r.hiddenPointDescription != null){
					$("#hiddenPointDescription").val(r.hiddenPointDescription);
				}
				//上报时间
				if(r.recordTime != "" && r.recordTime != null){
					console.log(r.recordTime);
					$("#recordTime").datepicker("setDate",  getLocalTime(r.recordTime));//设置
				}
				$("#id").val(r.id);
				$("#districtUnitId").val(r.districtUnitId);
			},
			error: function(XHR, error, errorThrown){
				console.log("读取错误：" + error)
			}
		})
	}
	else{
		$("#recordTime").datepicker("setDate",  new Date());//设置
	}
})(jQuery);

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function save(){
	$("#hiddenPointForm").ajaxSubmit({
			url: '/agsupport/sz-hiddenpoint!save.action',
			type: 'post',
			success: function(res){
				//console.log(res)
				//console.log("success");
				parent.location.reload();
			},
			error: function(XHR, error, errorThrown){
				alert(error);
			}
		});
}

function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

