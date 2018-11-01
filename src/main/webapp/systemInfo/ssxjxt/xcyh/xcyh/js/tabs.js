/*
 * 设施管理总体页面
 * 1.点击设施
 * 2.通过设施tablename获取
 * */

var serverName;
var id;
var herf;
var taskId;
var tabs = $('#content-main', window.parent.parent.document).parent().children(".content-tabs").children(".J_menuTabs").children();
var bhlxArr;
$(function(){
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
        serverName = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[1].split("=")[1] != undefined) {
        id = herf.split("?")[1].split("&")[1].split("=")[1];
    }
    // if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[2] != undefined && herf.split("?")[1].split("&")[2].split("=")[1] != undefined) {
    //     appId = herf.split("?")[1].split("&")[2].split("=")[1];
    // }
    // if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[3] != undefined && herf.split("?")[1].split("&")[3].split("=")[1] != undefined) {
    //     viewId = herf.split("?")[1].split("&")[3].split("=")[1];
    // }
    getFormField();
    initFileInput();
    $("#save").click(function (){
        saveCcproblem();
    });
    $("#cancel").click(function () {
        window.parent.layer.closeAll();
    });
    initSslx();
})
function initSslx(){
    var sslx = parent.metacodeItem.sslx;
    var html = "<option value=\"\"></option>";
    for(var key in sslx?sslx:[]){

        html +="<option value=\""+key+"\">"+sslx[key]+"</option>";
    }
    $("#sslx").append(html);
}
function initFileInput(){
    $("#uploadfile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/"+serverName+"/uploadfile/uploadFile", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
            return {tableName:"DRI_GX_PROBLEM_REPORT",pkName:id,recordId:taskId,attType:"",isDbStore:"0",isEncrypt:"0",fileParam:"file"};
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
        if(!data.response.success){
            alert("上传失败");
        }
        //$("#uploadfile").initFileActions();
        /*layer.msg('保存成功！', {
         icon: 1,
         time: 2000
         }, function () {
         window.parent.layer.closeAll();
         });*/
    });
}
function getFormField(){
    //新增的时候绑定来源为测报员定点定期监测
    if(!$('#report_resource').val()) {
        $('#report_resource').val(2);
    }
}

function saveCcproblem() {
    var flag =  $("#myform").valid();
    //获取一下xy，如果没有不允许提交
    var x= $("#X").val();
    var y= $("#Y").val();
    if(x==null || x=="" ||y==""  || y==null){
        parent.layer.alert("xy坐标没有值，不允许提交，请点击“获取位置”定位获取");
        flag=false;
    }
    if (flag) {
        var jsonString = "{";
        var a = $("#myform").serializeArray();
        var bhlxValue="";
        $.each(a, function () {
            if(this.type != 'button') {
                if(this.name=="bhlx"){
                    bhlxValue+=this.value==''?"":","+this.value;
                }else{
                    jsonString += '"'+ this.name + '":';
                    jsonString += this.value == '' ? '"",' : '"' + this.value + '",'
                }
            }
        });
        if(bhlxValue.length>1){
            bhlxValue = bhlxValue.substr(1,bhlxValue.length-1);
        }
        if(jsonString.length>1) {
            jsonString = jsonString.substring(0, jsonString.length - 1);
        }
        if($("#uploadfile").val() == ""){
            layer.alert("请上传至少一张现场照片！");
            return;
        }
        jsonString = jsonString +",\"bhlx\":\""+bhlxValue+"\"}";
        // jsonString = jsonString + ',"appId":"' + appId + '"' + '}';
        // console.log(jsonString);
        var url = "/" + serverName + "/asiWorkflow/selfWorkFlowBusSave.do";
        $.ajax({
            type : 'post',
            url : url,
            data : {json: jsonString},
            dataType : "json",
            success : function (json) {
                if(!json.success){
                    layer.alert(json.message,function(){
                        parent.layer.closeAll();
                    });
                }
                if(json.success && json.content){
                    taskId = json.content.taskId;
                    id = json.content.masterEntityKey;
                    if($("#uploadfile").val() != ""){
                        $("#uploadfile").fileinput("upload");
                    }
                }
                if(json.success && json.content){
                    var content = json.content;
                    parent.layer.alert("保存成功！",function(){
                        if(typeof(window.parent.showWfSendPageAfterSave)!="function"){
                            //alert("不是一个方法");
                        }else{
                            window.parent.showWfSendPageAfterSave(content);
                        }
                        parent.layer.closeAll();

                    });
                }

            }});
    }
}

function getRelatedDic(selectValue){
    if(selectValue==undefined||selectValue==""){
        $("#sblxChecks").html("");//清空复选框
        $("#isNullbhlx").html("&nbsp;*");//子字典必填*加上
        return ;
    }
    if(typeof($("#sblxChecks"))!='undefined' && $("#sblxChecks").html()!=''){
        $("#sblxChecks").html("");//清空复选框
    }
    var optionText=[];
    var data =parent.metacodeItem.data;
    for(var i in data){
        var item = data[i];
        if(item["code"]==selectValue){
            var child = item["data"];
            for(var ch in child){
                var result=child[ch];
                if(result.code){
                    optionText.push('<input name="bhlx" style="margin: 8px 0 0;" type="checkbox" value="'+result.code+'" />'+result.name);
                }
            }
            break;
        }
    }
    if(optionText.length==0){
        $("#isNullbhlx").html("&nbsp;&nbsp;");//如果子字典没有值，就把子字典必填*清除掉
    }else{
        $("#sblxChecks").append(optionText);
        $("#isNullbhlx").html("&nbsp;*");//如果子字典有值，就把子字典必填*加上
    }
}
