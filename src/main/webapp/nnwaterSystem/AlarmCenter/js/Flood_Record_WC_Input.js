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

function save(){
	//通过验证再往下执行
	$("#form").data("bootstrapValidator").validate();
    if(!$("#form").data("bootstrapValidator").isValid()) {
   		return;
    }
    
    if(document.getElementById("isRelease").checked == true) {
		var dataparam=$("#form").serialize()+"&recordType=2";
	} else {
		var dataparam=$("#form").serialize() + "&isRelease=0" +"&recordType=2";
	}
	
	$.ajax({
		type: 'post',
		url : '/agsupport/floodrecord!saveWCJson.action',
		data: dataparam,
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

function getAreaName(code) {
	for(var i=0; i<nnArea.length; i++) {
		if(nnArea[i].code == code)
			return nnArea[i].name;
	}
}

//自动生成内容
function getContent() {
	$.ajax({
		type: 'post',
		url : '/agsupport/ps-comb!forGetContent.action',
		data: {estType:33},
		dataType : 'json',
		cache:false,
		success : function(data) {
			if(data.result.length >0) {
				var content = "";
				content += "时间：" + getCNLocalTime(data.nowTime.time) + ",";
				for(var i=0; i<data.result.length; i++) {
					if(i > 0)
						content += ",";
					content += "在" + getAreaName(data.result[i].area) + data.result[i].comb_name + "有积水,积水深度为" + data.result[i].jsddeep + "米"
				}
				content = content.substring(0, content.lastIndexOf(",")) + "。";
				$("#recordContent").val(content);
				$("#recordTitle").val(getCNLocalTime(data.nowTime.time) + "涝情发布");
			} else {
				parent.layer.msg("暂无积水点报警信息");
			}
		},
		error : function() {
			parent.layer.msg("获取积水点信息失败");
		}
	});
}