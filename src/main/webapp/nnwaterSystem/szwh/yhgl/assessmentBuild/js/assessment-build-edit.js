
(function ($) {
	$(window).load(function () {
	    $('#hiddenPointForm').bootstrapValidator();
		$("#assessmentStart").datepicker({language:"zh-CN", format:"yyyy-mm-dd", autoclose:true, pickerPosition:"bottom-right"});
		$("#assessmentEnd").datepicker({language:"zh-CN", format:"yyyy-mm-dd", autoclose:true, pickerPosition:"bottom-right"});
		$(".table").find("tbody tr td").each(function(){
		     $(this).css("vertical-align","middle");
		});		
		$("#content").mCustomScrollbar();		
	});
	var id = GetQueryString("id");
	///alert(id);
	//如果地址中包含id，则是修改数据
	if (id != null) {
		$.ajax({url:"/agsupport/sz-assessmentbuild!getById.action?id=" + id, dataType:"json", success:function (res) {
			var r = res["rows"];

			//受检单位
			if (r.subjectUnit != "" && r.subjectUnit != null) {
				$("#subjectUnit").val(r.subjectUnit);
			}
			//考评人员
			if (r.assessmentor != "" && r.assessmentor != null) {
				$("#assessmentor").val(r.assessmentor);
			}
			//总分
			if (r.totalScore != "" && r.totalScore != null) {
				$("#totalScore").val(r.totalScore);
			}
			console.log(getLocalTime(r.assessmentStart));
			//检查时间
			if (r.assessmentStart != "" && r.assessmentStart != null) {
				$("#assessmentStart").datepicker("setDate", getLocalTime(r.assessmentStart));//设置
			}	
			//检查时间
			if (r.assessmentEnd != "" && r.assessmentEnd != null) {
				$("#assessmentEnd").datepicker("setDate", getLocalTime(r.assessmentEnd));//设置
			}
			/************/
			if (r.snScore != "" && r.snScore != null) {
				$("#snScore").val(r.snScore);
				$("#snScoreDeduct").val($("#sn").val()-$("#snScore").val())
			}
			if (r.lqScore != "" && r.lqScore != null) {
				$("#lqScore").val(r.lqScore);
				$("#lqScoreDeduct").val($("#lq").val()-$("#lqScore").val())
			}
			if (r.psScore != "" && r.psScore != null) {
				$("#psScore").val(r.psScore);
				$("#psScoreDeduct").val($("#ps").val()-$("#psScore").val())
			}
			if (r.rxdScore != "" && r.rxdScore != null) {
				$("#rxdScore").val(r.rxdScore);
				$("#rxdScoreDeduct").val($("#rxd").val()-$("#rxdScore").val())
			}
			if (r.qhScore != "" && r.qhScore != null) {
				$("#qhScore").val(r.qhScore);
				$("#qhScoreDeduct").val($("#qh").val()-$("#qhScore").val())
			}
			if (r.wmsgScore != "" && r.wmsgScore != null) {
				$("#wmsgScore").val(r.wmsgScore);
				$("#wmsgScoreDeduct").val($("#wmsg").val()-$("#wmsgScore").val())
			}

			/************/
			$("#assessmentBuildId").val(r.assessmentBuildId);
			$("#districtUnitId").val(r.districtUnitId);
		}, error:function (XHR, error, errorThrown) {
			console.log("\u8bfb\u53d6\u9519\u8bef\uff1a" + error);
		}});
	} else {
	    $("#scorerLabel").hide();
	    $("#scorerDiv").hide();
		$("#recordTime").datepicker("setDate", new Date());//设置
	}
})(jQuery);
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}
function save(){
    $('#hiddenPointForm').data('bootstrapValidator').validate();
    var validStatus=$('#hiddenPointForm').data('bootstrapValidator').isValid();
	if(validStatus==true){
		$("#hiddenPointForm").ajaxSubmit({url:"/agsupport/sz-assessmentbuild!saveJson.action", type:"post", success:function (res) {
			parent.location.reload();
		}, error:function (XHR, error, errorThrown) {
			alert(error);
		}});
	} else {
		parent.layer.msg("表单验证失败，请检查所填内容");
	} 
	
}
function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

function calculateRow(id) {
	if ($("#" + id).val() != "") {
		var rowId = id.replace("ScoreDeduct", "");
		var zf = parseInt($("#" + rowId).val());//总分
		var kf = parseInt($("#" + id).val());
		$("#" + rowId + "ScoreDeduct").val(kf);//扣分
		var df = zf - kf;	
		if (df > zf) {
			alert("\u5f97\u5206\u4e0d\u80fd\u8d85\u8fc7\u603b\u5206\uff01");
			$("#" + id).val(0);
			$("#" + id+ "Deduct").val(0);	    
		}
	    else{
	    	$("#" + rowId + "Score").val(df);			   
	    }
	}
	
	var df=0;
	//计算总分
	$(".score").each(function(){
		if ($(this).val() != "")
			df+=parseInt($(this).val());
	});
	$("#totalScore").val(df);
}

