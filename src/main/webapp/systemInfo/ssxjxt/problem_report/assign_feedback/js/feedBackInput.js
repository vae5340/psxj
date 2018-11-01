var objectId;
var aid;
var tableType='3';
var feedBackId;//这个是提交反馈以后生成的id
var userCode;
var userName;
$(function(){
	objectId = getParamsByUrl("objectId");//GetQueryString这个获取参数的方法在common.js中
	aid = getParamsByUrl("aid");
	userName = getParamsByUrl("userName");
	userCode = getParamsByUrl("userCode");
	initFileInput();
	 loadFeedList();
    $("#save").click(function (){
    	saveFeedBack();
    });
    $("#cancel").click(function () {
        window.parent.layer.closeAll();
    });
});


function initFileInput(){
    $("#uploadfile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/psxj/swj-feedbacklist!uploadFile.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
        	return {entityId:feedBackId,feedbackPersoncode:userCode,feedbackPerson:userName};
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
                time: 4000
            }, function () {
            	window.parent.$("#table").bootstrapTable("refresh");
                window.parent.layer.closeAll();
            });
    	}else{
    		alert("照片上传失败");
    	}
    });
}

function loadFeedList(){
	$.ajax({
        type: 'get',
        url: '/psxj/rest/feedBack/getFeedbackInf',
        data:{aid:aid,tableType:'3'},
        dataType: 'json',
        success: function (data) {
            if(data.code==200 && data.data!=undefined) {
            	var result=data.data;
            	var htmlText="";
            	if(result!=null && result.length>0){
            			for(var i = 0; i < result.length; i++){
            				htmlText+='<li><time class="cbp_tmtime" ><span></span> <span></span></time>';
            				htmlText+='<div class="cbp_tmicon cbp_tmicon-phone"></div><div class="cbp_tmlabel">';
            				htmlText+='<h5 style="background-color: aliceblue">反馈信息'+(i+1)+'</h5>';
            				htmlText+='<p><b>描述</b>:&nbsp;&nbsp;&nbsp;'+result[i].describe+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            				htmlText+='<b>整改完成情况</b>:&nbsp;&nbsp;&nbsp;'+result[i].situation+'</p>';
            				htmlText+='<p><b>反馈人</b>:&nbsp;&nbsp;&nbsp;'+result[i].feedbackPerson+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            				htmlText+='<b>反馈时间</b>:&nbsp;&nbsp;&nbsp;'+timetrans(result[i].time)+'</p>';
            				if(result[i].sysList.length>0){//加载图片
                				var total=0;
                				htmlText+='<ul id="img-view-clqk-'+i+'" class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px">';
                				for (var j = 0; j < result[i].sysList.length; j++) {
                					htmlText+='<img data-original="'+result[i].sysList[j].attPath+'"' +
        							' src="'+result[i].sysList[j].attPath+'" alt="照片'+(total+1)+'" width=80 height=80 class="img-view-li">&nbsp;&nbsp;';
        							total++;
                				}
                				htmlText+='</ul>';
                			}
                			htmlText+='</div></li>';
            			}
            		}
            		$("#sggsLog").html(htmlText);
            		//$(".img-view").viewer({ url: 'data-original',});//加载图片完调用viewer图片插件
            		//执行父页面图片预览初始化
            		$(".img-view-li").click(function(){
            			if(parent.initViewer)
                			parent.initViewer($(this).parent().parent().html(),$(this).parent().attr("id"));
                		if(parent.parent.initViewer)
                			parent.parent.initViewer($(this).parent().parent().html(),$(this).parent().attr("id"));
            			if(parent.viewer){
            				parent.viewer.show($(this).index());
            			}else if(parent.parent.viewer){
            				parent.parent.viewer.show($(this).index());
            			}else{
            				layer.msg("未检测到图片插件!",{icon: 2});
            			}
            		});
            	}else{
            		$("#sggsLog").html("暂无信息");
            	}
            }
    });
}


function saveFeedBack() {
	var a = $("#myform").serializeArray();
    $.ajax({
        type: 'post',
        url: "/psxj/rest/feedBack/saveFeedbackInf",
        data: {situation:$("#situation").val(),describe:$("#describe").val(),objectId:objectId,aid:aid,tableType:tableType,feedbackPersoncode:userCode,feedbackPerson:userName},
        dataType: 'json',
        success: function (result) {
        	if (result.code=='200') {//保存成功
        		feedBackId=result.data.id;
        		if($("#uploadfile").val() != ""){
                    $("#uploadfile").fileinput("upload");//提交图片
                }else{
                    layer.msg('保存成功！', {
                        icon: 1,
                        time: 4000
                    }, function () {
                    	window.parent.$("#table").bootstrapTable("refresh");
                        window.parent.layer.closeAll();
                    });
                }
            }
        }
    })
}
//可以解决中文乱码问题
function getParamsByUrl(name) {   
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");   
    var r = window.location.search.substr(1).match(reg);   
    if (r != null) return decodeURI(r[2]); return null;   
} 

function timetrans(date){
    var date = new Date(date);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}