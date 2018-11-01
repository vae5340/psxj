/*
 * 施工过程添加与评论
 * */

var serverName;
var userCode;
var id;
var type;
var sggcid;
var herf;
var templateid;
var taskId;
var tablename;
var activityName;
var formList;
var dics
var diccode_fieldname = {};
var tabs = $('#content-main', window.parent.parent.document).parent().children(".content-tabs").children(".J_menuTabs").children();
$(function(){
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
        serverName = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[1].split("=")[1] != undefined) {
        taskId = herf.split("?")[1].split("&")[1].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[2] != undefined && herf.split("?")[1].split("&")[2].split("=")[1] != undefined) {
        id = herf.split("?")[1].split("&")[2].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[3] != undefined && herf.split("?")[1].split("&")[3].split("=")[1] != undefined) {
        type = herf.split("?")[1].split("&")[3].split("=")[1];
    }
    getTabs();
    initFileInput();
    $("#save").click(function (){
        saveCcproblem();
    });
    $("#cancel").click(function () {
        //window.parent.layer.closeAll();
        var index=parent.layer.getFrameIndex(window.name);

        parent.layer.close(index);
    });
})

function initFileInput(){
    $("#uploadfile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/"+serverName+"/uploadfile/uploadFile", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
            return {tableName:"DRI_GX_SGGC",pkName:sggcid,recordId:taskId,attType:"",isDbStore:"0",isEncrypt:"0",fileParam:"file"};
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
    	if(!data.response.success){
    		alert("上传失败");
    	}else{
    		layer.msg('保存成功！', {
                icon: 1,
                time: 2000
            }, function () {
            	//刷新页面
    	       	 var frame=parent.document.getElementById('ajxq').getElementsByTagName("iframe")[0].id;
    	       	 parent.document.getElementById(frame).contentWindow.loadSgrz();
    	       	//关闭窗口
            	var index=parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            });
    	}
    });
}

/**
 * 1.5	获取tabs分类标题数据
 * @param tablename 表名称  or  tableid  表id
 * @param
 */
function getTabs(){
	var texthtml='';
    if("add"==type){
    	$('#myTab').append('<li class="active"><a href="#tab_add" data-toggle="tab">基本信息</a></li>');
    	texthtml+='<div class="tab-pane fade in active" id="tab_add">';
    	texthtml+='<form id="form_add" class="form-horizontal" role="form" style="margin-top:15px;width:95%;">';
    	/*texthtml+='<div class="form-group"><label for="sgjd" class=" control-label col-sm-2"><font color="red" style="vertical-align:middle">&nbsp;*</font>施工节点:</label>';
    	texthtml+='<div class="col-sm-10"><input type="text" class="form-control" name="sgjd" id="sgjd" placeholder="请输入施工节点"></div></div>';*/
    	texthtml+='<div class="form-group"><label for="content" class="col-sm-2 control-label"><font color="red" style="vertical-align:middle">&nbsp;*</font>内容:</label>';
    	texthtml+='<div class="col-sm-10"><textarea  class="form-control" rows="12" name="content" id="content" placeholder="请输入内容"></textarea></div></div>';
    	texthtml+='</form></div>';
        $('#myTabContent').append(texthtml);
        $("#myTab").append('<li id="file_li"><a href="#file_Tab" data-toggle="tab">'+"照片上传"+'</a></li>');
    }else{
    	//$('#myTab').append('<li class="active"><a href="#tab_content" data-toggle="tab">基本信息</a></li>');
    	texthtml+='<div class="tab-pane fade in active" id="tab_content">';
    	texthtml+='<form id="form_content" class="form-horizontal" role="form" style="margin-top:15px;width:95%;">';
    	texthtml+='<div class="form-group"><label for="content" class="col-sm-2 control-label"><font color="red" style="vertical-align:middle">&nbsp;*</font>内容:</label>';
    	texthtml+='<div class="col-sm-10"><textarea   class="form-control" rows="15" name="content" id="content" placeholder="请输入内容"></textarea></div></div>';
    	texthtml+='</form></div>';
        $('#myTabContent').append(texthtml);
    }
}


function saveCcproblem() {
    var flag = false;
    var data=null;
    if("add"==type){
    	flag =  $("#form_add").valid();
    	if(flag){
    		data = $("#form_add").serializeArray();
    		data.push({"name":"sjid","value":id});
    		data.push({"name":"sgjd","value":taskId});
    		var url = "/" + serverName + "/gxSggc/saveData";
    		 $.ajax({
                 type: 'post',
                 url: url,
                 data: data,
                 dataType: 'json',
                 success: function (result) {
                     if (result) {
                    	 sggcid=result;
                         if($("#uploadfile").val() != ""){
                             $("#uploadfile").fileinput("upload");
                         }else{
                             layer.msg('保存成功！', {
                                 icon: 1,
                                 time: 2000
                             }, function () {
                            	//刷新页面
                            	 var frame=parent.document.getElementById('ajxq').getElementsByTagName("iframe")[0].id;
                            	 parent.document.getElementById(frame).contentWindow.loadSgrz();
                            	//关闭窗口
                            	 var index=parent.layer.getFrameIndex(window.name);
                                 parent.layer.close(index);
                             });
                         }
                     }
                 }
             })
    	}
    }else{
    	flag =  $("#form_content").valid();
    	if(flag){
    		data = $("#form_content").serializeArray();
    		data.push({"name":"sjid","value":id});
            data.push({"name":"sgjd","value":taskId});
    		var url = "/" + serverName + "/gxSggc/saveContent";
    		 $.ajax({
                 type: 'post',
                 url: url,
                 data: data,
                 dataType: 'json',
                 success: function (result) {
                     if (result) {
                         layer.msg('保存成功！', {
                             icon: 1,
                             time: 2000
                         }, function () {
                        	 //刷新页面
                        	 var frame=parent.document.getElementById('ajxq').getElementsByTagName("iframe")[0].id;
                        	 parent.document.getElementById(frame).contentWindow.loadSgrz();
                        	 //关闭窗口
                        	 var index=parent.layer.getFrameIndex(window.name);
                             parent.layer.close(index);
                         });
                     }
                 }
             })
    	}
    }
}

