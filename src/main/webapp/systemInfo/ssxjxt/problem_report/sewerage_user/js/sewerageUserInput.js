/*
 * 排水用户新增与修改
 * */

var id="";
var herf;
var isClick=false;
$(function(){
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
    	id = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    initFileInput();
    if(id != ""){
    	$.ajax({
            type: 'post',
            url: "/psxj/sewerage-user!getById.action",
            data: {"id":id},
            dataType: 'json',
            success: function (result) {
            	loadData(result.data);
            	if(result.licenceFileList!=null && result.licenceFileList.length>0){
            		$("#licence").show();
            		loadFileList(result.licenceFileList,"licenceFileTable");
            	}
            	if(result.licenseDecisionFileList!=null && result.licenseDecisionFileList.length>0){
            		$("#licenseDecision").show();
            		loadFileList(result.licenseDecisionFileList,"licenseDecisionFileTable");
            	}
            	if(result.imageFileList!=null && result.imageFileList.length>0){
            		$("#image").show();
            		loadFileList(result.imageFileList,"imageFileTable");
            	}
            }
    	})
    }
})

function initFileInput(){
    $("#licenceFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/psxj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForSewerageUser.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"1",sewerageUserId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showCancel: true,
        showClose: true,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if($("#licenseDecisionFile").val() != ""){
                $("#licenseDecisionFile").fileinput("upload");
            }else if($("#imageFile").val() != ""){
                $("#imageFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	window.parent.$("#table").bootstrapTable("refresh");
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
    $("#licenseDecisionFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/psxj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForSewerageUser.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"2",sewerageUserId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if($("#imageFile").val() != ""){
                $("#imageFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	window.parent.$("#table").bootstrapTable("refresh");
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
    $("#imageFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/psxj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForSewerageUser.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"3",sewerageUserId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		layer.msg('保存成功！', {
                icon: 1,
                time: 2000
            }, function () {
            	window.parent.$("#table").bootstrapTable("refresh");
                window.parent.layer.closeAll();
            });
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
}
//表单加载数据
function loadData(jsonStr){
	//var obj = eval("("+jsonStr+")");
	var obj=jsonStr;
	var key,value,tagName,type,arr;
	for(x in obj){
		key = x;
		value = obj[x];
		
		$("[name='"+key+"'],[name='"+key+"[]']").each(function(){
			tagName = $(this)[0].tagName;
			type = $(this).attr('type');
			if(tagName=='INPUT'){
				if(type=='radio'){
					$(this).attr('checked',$(this).val()==value);
				}else if(type=='checkbox'){
					arr = value.split(',');
					for(var i =0;i<arr.length;i++){
						if($(this).val()==arr[i]){
							$(this).attr('checked',true);
							break;
						}
					}
				}else{
					$(this).val(value);
				}
			}else if(tagName=='SELECT' || tagName=='TEXTAREA'){
				$(this).val(value);
			}
			
		});
	}
}
function save() {
	if(!isClick){
		var flag = $("#sewerage").valid();
		if(flag){
			isClick=true;
			var data = $("#sewerage").serializeArray();
			$.ajax({
	            type: 'post',
	            url: "/psxj/sewerage-user!save.action",
	            data: data,
	            dataType: 'json',
	            success: function (result) {
	                if (result.success) {
	                	id=result.id;
	                    if($("#licenceFile").val() != ""){
	                        $("#licenceFile").fileinput("upload");
	                    }else if($("#licenseDecisionFile").val() != ""){
	                        $("#licenseDecisionFile").fileinput("upload");
	                    }else if($("#imageFile").val() != ""){
	                        $("#imageFile").fileinput("upload");
	                    }else{
	                        layer.msg('保存成功！', {
	                            icon: 1,
	                            time: 2000
	                        }, function () {
	                        	window.parent.$("#table").bootstrapTable("refresh");
	                            window.parent.layer.closeAll();
	                        });
	                    }
	                }else{
	                	isClick=false;
	                	layer.msg('保存失败！', {
	                        icon: 1,
	                        time: 2000
	                    });
	                }
	            }
	        })
		}
	}
	
}


