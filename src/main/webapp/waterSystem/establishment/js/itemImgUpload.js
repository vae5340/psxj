var id , fileGroupId;

$(function(){
	$("#uploadImage").fileinput({
		showUpload : false,
		showRemove : false,
		showPreview : false,
		language : 'zh',
		allowedPreviewTypes : ['image'],
		allowedFileExtensions : ['jpg','png','gif'],
		maxFileSize : 20000,
		maxFileCount: 10
	});
	id = getQueryStr("id");
	fileGroupId = getQueryStr("fileGroupId")
	console.log(id+'   '+fileGroupId)
	
	//加载图片
	loadItemImg(fileGroupId);
})
//上传图片
function uploadImg(){
	console.log(((fileGroupId)?fileGroupId:null))
	$("#itemImgUploadForm").ajaxSubmit({
		url: '/agsupport/ps-item-dim!uploadItemImg.action',
		data: {
			'id': id,
			'fileGroupId': ((fileGroupId)?fileGroupId:null)
		},
		type: 'post',
		success: function(res){
			//alert()
			//console.log('上传成功');
			if(fileGroupId != "null"){
				location.reload();
			}else{
				parent.location.reload();
			}
			
		},
		error: function(){
			
		}
	})
}

function loadItemImg(fid){
	if(fid != "null"){
		$.ajax({
			url: '/agsupport/sys-uploadfile-manage!getFileList.action',
			data: {
				'fileGroup' : fid
			},
			type: 'post',
			dataType: 'json',
			async: false,
			success: function(res){
				//console.log(res)
				if(res.row.length > 0){
					for(a in res.row){
						var z = res.row[a];
						//生成图片对象，判断是横向还是纵向的
						var imgTag = "";
						imgTag = "<img src='" + "/agsupport" + z.filePath + "' onLoad='imgload(this," + z.id + ")' style='vertical-align:middle' onClick='parent.showBigImage(this,\"/agsupport" + z.filePath + "\")'/>"
						
						var img = "<div id='" + z.id + "' class='col-sm-4' style='height:100%;padding:2px;position:relative;text-align:center'>"
							img += "<div id='close" + z.id + "' class='closeBtn' onClick='delImg(" + z.id + ")'></div>"
							img += imgTag;
							img += "</div>";
						$("#picArea").append(img)
					}
				}else if(res.row.length == 0){
					$("#picArea").html("无图片");
				}
			},
			error: function(){
				console.log("error")
			}
		})
	}else{
		$("#picArea").html("无图片");
	}
}

function imgload(img,id){
	if(img.width >= img.height){
		//横向
		img.width="210";
		var top = ($(img).parent().height()-$(img).height())/2;
		$(img).css("margin-top",top+"px");
		$("#close"+id).css('top',top+2+"px")
	}else{
		//纵向
		img.height="184"
	}
}

function delImg(id){
	//console.log(id)
	var c = confirm("确定要删除该图片？")
	if(c){
		$.ajax({
			url: '/agsupport/sys-uploadfile-manage!deleteJson.action',
			type: 'post',
			data:{
				'id':id
			},
			success: function(){
				location.reload();
			},
			error: function(xhr ,error ,errorThrown){
				console.log("删除图片失败！" + error)
			}
		})
	}
}

function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}