(function($){
	$(window).load(function(){
		$("#tableTeam").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar({
				mouseWheelPixels:300
			});	
			$('#form').bootstrapValidator();										
		});
	});    	
	
	$('#form').bootstrapValidator({
		 message: 'This value is not valid',
		 feedbackIcons: {/*input状态样式图片*/
		     valid: 'glyphicon glyphicon-ok',
		     invalid: 'glyphicon glyphicon-remove',
		     validating: 'glyphicon glyphicon-refresh'
		 },
		 fields: {/*验证：规则*/
			recordTitle: {//验证input项：验证规则
			    message: 'The recordTitle is not valid',
			    validators: {
			        notEmpty: {//非空验证：提示消息
			            message: '必填项'
			        }
				}
			},
			recordContent: {//验证input项：验证规则
			    message: 'The recordContent is not valid',
			    validators: {
			        notEmpty: {//非空验证：提示消息
			            message: '必填项'
			        }
				}
			}
		}
	});		 
	
})(jQuery);

//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
var id=getQueryStr("id");
if(id!=""){ 
	$.ajax({
		method : 'GET',
		url : '/agsupport/floodrecord!inputJson.action?id='+id,
		async : true,
		dataType : 'json',
		success : function(data) {
			//填充表单内容 
			for (var key in data){
				$("#"+key).val(data[key]);
			}
			if(data.isRelease==1)
				document.getElementById("isRelease").checked = true;
				
		},
		error : function(error) {
			console.log(error);
		}
	});			
}
function save(){
	//通过验证再往下执行
	$("#form").data("bootstrapValidator").validate();
    if(!$("#form").data("bootstrapValidator").isValid()) {
   		return;
    }

	var isRelease;
	if(document.getElementById("isRelease").checked == true) {
		isRelease = 1;
	} else
		isRelease = 0;
	$.ajax({
		type: 'post',
		url : '/agsupport/floodrecord!saveOneJson.action',
		data: {id:$("#id").val(),recordTitle:$("#recordTitle").val(),recordContent:$("#recordContent").val(),isRelease:isRelease},
		dataType : 'json',
		success : function(data) {
			parent.layer.msg(data.result);
			var index = parent.layer.getFrameIndex(window.name);
			window.parent.closeLayer(index);
		},
		error : function() {
			parent.layer.msg("操作失败");
		}
	});
}
function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}