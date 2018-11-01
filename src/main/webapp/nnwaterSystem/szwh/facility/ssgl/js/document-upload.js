function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

$(function(){
	//
	$("#fileTreeId").val(GetQueryString("fileTreeId"))
	//
	if(GetQueryString("id")){
		$.ajax({
			url: '/agsupport/sz-file!getListById.action?id=' + GetQueryString("id"),
			dataType: 'json',
			success: function(res){
				var r = res.rows;
				if(r[0].fileName){
					$("#fileName").val(r[0].fileName);
				}
				if(r[0].status){
					$("#status option[value=" + r[0].status + "]").attr("selected",true);
				}
				if(r[0].fileYear){
					$("#fileYear option[value=" + r[0].fileYear + "]").attr("selected",true);
				}
				if(r[0].fileTreeId){
					$("#fileTreeId").val(r[0].fileTreeId);
				}
			},
			error: function(XHR,error,errorThrown){
				console.log(error)
			}
		})
	}
})

function addFile(){
	var options = "";
	if(GetQueryString("id")){
		options = "?id="+GetQueryString("id")
	}
	//console.log($("#fileForm").serializeArray());
	//$("#fileForm").submit();
	$("#fileForm").ajaxSubmit({
		url: '/agsupport/sz-file!saveJson.action'+options,		
		type: 'post',
		success: function(res){
			parent.parent.layer.msg("保存成功！",{icon:1});
			//返回上一页面
			parent.location.reload();
			parent.layer.close(parent.layer.getFrameIndex(window.name));
		},
		error: function(XHR,error,errorThrown){
			alert(error)
		}
	})
}

function closeUpload(){
	parent.layer.close(parent.uploadIndex);
}