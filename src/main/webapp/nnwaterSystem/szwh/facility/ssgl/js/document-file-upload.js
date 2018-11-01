$(function(){
	//加载时就判断有无文件
	console.log(GetQueryString("groupId"));
	$("#uploadFile").fileinput({
        showUpload : false,
        showRemove : false,
        language : 'zh',
        maxFileSize : 20000,
      	maxFileCount: 10
    });
	readFile();
})

function readFile(){
	if(GetQueryString("groupId") && GetQueryString("groupId") > 0){
		var option_groupId = "?fileGroup="+GetQueryString("groupId");
		$.ajax({
			url: '/agsupport/sys-uploadfile-manage!getFileList.action' + option_groupId,
			dataType: 'json',
			success: function(res){
				console.log(res)
				if(res.total == 0){
					$("#documentList").html('<span class="col-sm-12" style="text-align:center">无相关文件</span>')
				}else{
					//先清空
					$("#documentList").html('');
					for(a in res.row){
					//for(var a = 0; a <= 2; a++){
						var r = res.row[a];
						//
						var resHtml = '<div class="file" >'
						+ '<span style="line-height:30px;padding-left:10px"><b>' + r.fileName + '</b></span><br/>'
						+ '<span style="padding-left:10px;font-size:12px;">上传用户:<b>' + r.uploadPerson + '</b></span>'
						+ '<span style="padding-left:10px;font-size:12px">上传时间:<b>' + getLocalTime(r.uploadDate.time) + '</b></span>'
						+ '<span class="glyphicon glyphicon-remove optionBtn" title="删除" onclick="delFile(' + r.id + ')"></span>'
						+ '<span class="glyphicon glyphicon-arrow-down optionBtn" title="下载" onclick="downloadFile(' + r.id + ')"></span>'
						+ '</div>'
						$("#documentList").append(resHtml);
					}
				}
				
			},
			error: function(XHR,error,errorThrown){
				$("#documentList").html('<span class="col-sm-12" style="text-align:center">无相关文件</span>')
				alert("无法读取文件:"+error)
			}
		})
	}else{
		$("#documentList").html('<span class="col-sm-12" style="text-align:center">无相关文件</span>')
	}
}
//删除文件
function delFile(id){
	var b = confirm("确定要删除该文档？")
	console.log(b)
	if(b){
		$.ajax({
			url:"/agsupport/sys-uploadfile-manage!deleteJson.action?id="+id,
			async:false,
			success: function(){
				location.reload()
			},
			error: function(XHR,error,errorThrown){
				alert(error)
			}
		});
	}
}
//下载文件
function downloadFile(id){
	window.location.href = "/agsupport/sys-uploadfile-manage!downloadFile.action?id="+id;
}
//上传文件
function uploadInputChange(){
	//$("#uploadFileForm").attr('action','/agsupport/sz-file!uploadFile.action?id=' + GetQueryString("id"))
	//var m = $("#uploadFileForm").submit();
	//parent.layer.msg("上传文件成功!",{icon:1})
	//console.log(m);
	$("#uploadFileForm").ajaxSubmit({
		url: '/agsupport/sz-file!uploadFile.action?id=' + GetQueryString("id"),
		type: 'post',
		success: function(res){
			console.log("成功");
			location.reload();
		},
		error: function(XHR,error,errorThrown){
			console.log("上传文件失败:" + error);
		}
	})
}

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}