/*
 * 设施管理总体页面
 * 1.点击设施
 * 2.通过设施tablename获取
 * */

var serverName;
var userCode;
var id;
var herf;
var templateid;
var templateCode;
var tablename;
var activityName;
var formList;
var dics
var diccode_fieldname = {};
var bhlxStr;//声明一个全局的问题类型，用来保存已经勾选的
var tabs = $('#content-main', window.parent.parent.document).parent().children(".content-tabs").children(".J_menuTabs").children();
$(function(){
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
        serverName = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[1].split("=")[1] != undefined) {
        templateid = herf.split("?")[1].split("&")[1].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[2].split("=")[1] != undefined) {
        templateCode = herf.split("?")[1].split("&")[2].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[3].split("=")[1] != undefined) {
        tablename = herf.split("?")[1].split("&")[3].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[4].split("=")[1] != undefined) {
        id = herf.split("?")[1].split("&")[4].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[5].split("=")[1] != undefined) {
        userCode = herf.split("?")[1].split("&")[5].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[6].split("=")[1] != undefined) {
        activityName = decodeURI(decodeURI(herf.split("?")[1].split("&")[6].split("=")[1]));
    }
    getFormField();
    initFileInput();
    $("#save").click(function (){
        saveCcproblem();
    });
    $("#cancel").click(function () {
        window.parent.layer.closeAll();
    });
})

function initFileInput(){
    $("#uploadfile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/"+serverName+"/asi/facilitymgr/facilitymgr/uploadfile!uploadFile.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {tablename:'GxProblemReport',entityId:id,activityName:activityName};
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
    		alert("照片上传失败");
    	}
    });
}




function getFormField(){
    $('#myTab').append('<li class="active" id="base_li"><a href="#'+"base_Tab"+'" data-toggle="tab">'+"基本信息"+'</a></li>');
    $('#myTabContent').append('<div class="tab-pane fade in active" id="'+"base_Tab"+'"><form id="myform" class="form-horizontal" role="form" style="margin-top:15px;width:95%;"></form></div>');
    $.ajax({
        type: 'post',
        url: '/psxj/ccProblem/getFormData',
        data: {templateId: templateid, masterEntitykey: id},
        dataType: 'json',
        success: function (result) {
            var table = result.result[0];
            var fields = result.result[1];
            dics = result.result[2];
            var dataArray = result.result[3];
            var fileData = result.result[4];
            var htmlText = [];
            var flag = 1;
            var hasX = false;
            var hasY = false;
            var hasObjectid = false;
            var hasXIndex;
            var hasYIndex;
            var hasObjectidIndex;
            for (var i in fields) {
                fields[i].fieldname = fields[i].fieldname.toLocaleLowerCase();
                if (fields[i].fieldname == 'x') {
                    hasX = true;
                    hasXIndex = i;
                    continue;
                }
                if (fields[i].fieldname == 'y') {
                    hasY = true;
                    hasYIndex = i;
                    continue;
                }
                if(hasX == true && hasY == true){
                	break;//前面都满足了，就直接跳出
                }
            }
            if (hasX == true && hasY == true) {
            	htmlText.push('<div class="col-sm-2">');
                htmlText.push('<input type="button" value="获取位置" onclick="locationByPoint(\'point\')" /></div>');
                htmlText.push('<br/><br/>');
                htmlText.push('<input id="X" type="hidden" name="' + fields[hasXIndex].fieldname + '" '+validaterules(fields[hasXIndex])+' class="form-control" value="' + (dataArray == undefined ? "" : dataArray[0][hasXIndex]== null?"":dataArray[0][hasXIndex]) + '" />');
                htmlText.push('<input id="Y" type="hidden" name="' + fields[hasYIndex].fieldname + '" '+validaterules(fields[hasYIndex])+' class="form-control" value="' + (dataArray == undefined ? "" : dataArray[0][hasYIndex]== null?"":dataArray[0][hasYIndex]) + '" />');
                
//                htmlText.push('<div class="form-group">');
//                htmlText.push('<label class="control-label col-sm-2" for="x">X坐标');
//                if(fields[hasXIndex].nullflag == 0){
//                    htmlText.push('<font color="red" style="vertical-align:middle">&nbsp;*</font>');
//                }
//                htmlText.push(':</label>');
//                htmlText.push('<div class="col-sm-4">');
//                htmlText.push('<input id="X" name="' + fields[hasXIndex].fieldname + '" '+validaterules(fields[hasXIndex])+' class="form-control" value="' + (dataArray == undefined ? "" : dataArray[0][hasXIndex]== null?"":dataArray[0][hasXIndex]) + '" /></div>');
//                htmlText.push('<label class="control-label col-sm-2" for="y">Y坐标');
//                if(fields[hasYIndex].nullflag == 0){
//                    htmlText.push('<font color="red" style="vertical-align:middle">&nbsp;*</font>');
//                }
//                htmlText.push(':</label>');
//                htmlText.push('<div class="col-sm-4">');
//                htmlText.push('<input id="Y" name="' + fields[hasYIndex].fieldname + '" '+validaterules(fields[hasYIndex])+' class="form-control" value="' + (dataArray == undefined ? "" : dataArray[0][hasYIndex]== null?"":dataArray[0][hasYIndex]) + '" /></div>');
//                htmlText.push('</div>');
            }
            for (var i in fields) {
                fields[i].fieldname = fields[i].fieldname.toLocaleLowerCase();
                if (fields[i].fieldname == 'x') {
                    hasX = true;
                    hasXIndex = i;
                    continue;
                }
                if (fields[i].fieldname == 'y') {
                    hasY = true;
                    hasYIndex = i;
                    continue;
                }
                if (fields[i].fieldname == 'xiaoban_objectid' || fields[i].fieldname == 'river_id') {
                    hasObjectid = true;
                    hasObjectidIndex = i;
                    continue;
                }
                if (fields[i].primarykeyfieldflag == 1) {
                    htmlText.push('<input id="primarykeyfieldflag" class="form-control" name="' + fields[i].fieldname + '" value="' + (dataArray == undefined ? "" : dataArray[0][i] == null?"":dataArray[0][i]) + '" type="hidden"/>');
                } else {
                    if (fields[i].colspan == 1) {
                        if (flag == 1) {
                            htmlText.push('<div class="form-group">');
                        }
                        htmlText.push('<label class="control-label col-sm-2" for="' + fields[i].fieldname + '">' + fields[i].displayname);
                        if (fields[i].nullflag == 0) {
                            htmlText.push('<font color="red" style="vertical-align:middle">&nbsp;*</font>');
                        }
                        htmlText.push(':</label>');
                        htmlText.push('<div class="col-sm-4">');
                    }
                    if (fields[i].colspan == 2) {
                        htmlText.push("</div>");
                        htmlText.push('<div class="form-group">');
                        htmlText.push('<label class="control-label col-sm-2" for="' + fields[i].fieldname + '">' + fields[i].displayname);
                        if (fields[i].nullflag == 0) {
                            htmlText.push('<font color="red" style="vertical-align:middle" id="isNull' + fields[i].fieldname + '">&nbsp;*</font>');
                        }
                        htmlText.push(':</label>');
                        htmlText.push('<div class="col-sm-10">');
                    }
                    if ((fields[i].componentid == 0 || fields[i].componentid == 3) && fields[i].fieldname!='bhlx') {
                        var dicAry = dics[0][fields[i].fieldname];
                        if (fields[i].componentid == 0) {
                            diccode_fieldname[fields[i].diccode] = fields[i].fieldname;
                            htmlText.push('<select id="' + fields[i].fieldname + '" name="' + fields[i].fieldname + '"  class="form-control" ');
                            if(fields[i].relateddiccode != undefined && fields[i].relateddiccode != null && fields[i].relateddiccode != ""){
                                htmlText.push('onchange="getRelatedDic(\''+fields[i].relateddiccode+'\',this.value)"');
                            }
                            htmlText.push(validaterules(fields[i]));
                            htmlText.push('><option value=""></option>');
                        }
                        for (var j in dicAry) {
                            if (fields[i].componentid == 0) {
                                htmlText.push('<option value="' + dicAry[j].code + '" ' + (dataArray == undefined ? "" : dicAry[j].code == dataArray[0][i] ? "selected" : "") + ' >' + dicAry[j].name + '</option>');
                            } else {
                                htmlText.push('<input name="' + fields[i].fieldname + '" type="checkbox" value="' + dicAry[j].code + '" ' + (dataArray == undefined ? "" : dicAry[j].code == dataArray[0][i] ? "checked" : "") + ' />');
                                htmlText.push(dicAry[j].name + "&nbsp;&nbsp;&nbsp;&nbsp;")
                            }
                        }

                        if (fields[i].componentid == 0) {
                            htmlText.push('</select>');
                        }
                        htmlText.push('</div>');
                    }else if(fields[i].fieldname=='bhlx'){//问题类型走这里，默认一个空白div
                    	diccode_fieldname[fields[i].diccode] = fields[i].fieldname;
                    	bhlxStr = dataArray[0][7];//数据库问题类型
                    	var sslxStr=dataArray[0][5];//数据库设施类型
                    	htmlText.push("<div id='sblxChecks' style='font-size: 15px;'>");
                    	htmlText.push(getDeafuleCheckes(sslxStr));
                    	htmlText.push("</div>");
                    	htmlText.push('</div>');
                    }
                    if (fields[i].componentid == 1) {
                        htmlText.push('<input id="' + fields[i].fieldname + '" name="' + fields[i].fieldname + '" value="' + (dataArray == undefined ? "" : dataArray[0][i] == null?"":dataArray[0][i]) + '" class="form-control"');
                        htmlText.push(validaterules(fields[i]));
                        htmlText.push('/></div>');
                    }
                    if (fields[i].componentid == 2) {
                        htmlText.push("<div class='input-group date mydate'>");
                        htmlText.push('<input class="form-control" name="' + fields[i].fieldname + '" value="' + (dataArray == undefined ? "" : dataArray[0][i]== null?"":dataArray[0][i]) + '"');
                        htmlText.push(validaterules(fields[i]));
                        htmlText.push('><div class="input-group-addon">');
                        htmlText.push('<span class="glyphicon glyphicon-th" ></span></div></div></div>');
                    }
                    if (fields[i].componentid == 4) {
                        htmlText.push(' <textarea id="' + fields[i].fieldname + '" name="' + fields[i].fieldname + '" class="form-control" rows="3">');
                        htmlText.push((dataArray == undefined ? "" : dataArray[0][i]== null?"":dataArray[0][i]));
                        htmlText.push('</textarea></div>');
                    }
                    if ((flag == 2 && fields[i].colspan == 1) || i == fields.length - 1 || fields[i].colspan == 2 || fields[i].componentid == 4) {
                        htmlText.push("</div>");
                        flag = 1;
                    } else {
                        flag++;
                    }
                }
            }
            if (hasObjectid == true) {
                htmlText.push('<div class="form-group">');
                htmlText.push('<label class="control-label col-sm-2">' + fields[hasObjectidIndex].displayname);
                if(fields[hasObjectidIndex].nullflag == 0){
                    htmlText.push('<font color="red" style="vertical-align:middle">&nbsp;*</font>');
                }
                htmlText.push(':</label>');
                htmlText.push('<div class="col-sm-4">');
                htmlText.push('<input id="' + fields[hasObjectidIndex].fieldname + '" name="' + fields[hasObjectidIndex].fieldname + '" '+validaterules(fields[hasObjectidIndex])+' class="form-control" value="' + (dataArray == undefined ? "" : dataArray[0][hasObjectidIndex]== null?"":dataArray[0][hasObjectidIndex]) + '" /></div>');
                htmlText.push('<div class="col-sm-4">');
                htmlText.push('<input type="button" value="选取小斑" onclick="selectFeature()"/></div>');
                htmlText.push('</div>');
            }
            if (htmlText.join("") == "") {
                $("#myform").append("未配置表单字段信息！")
            } else {
                $("#myform").append(htmlText.join(""));
            }
            dateInit(".mydate");
            if(table.hasfile == 1){
                $("#myTab").append('<li id="file_li"><a href="#'+"file_Tab"+'" data-toggle="tab">'+"照片上传"+'</a></li>');
                if(id != "" && id!= undefined){
                    loadFileList(fileData);
                }
            }
            //新增的时候绑定来源为测报员定点定期监测
            if(!$('#report_resource').val()) {
                $('#report_resource').val(2);
            }
        }
    })
}

function saveCcproblem() {
    var flag = false;
    if (formList && formList.length > 0) {
        for (var i = 0; i < formList.length; i++) {
            var tabDics = formList[i][0];
            flag = $("#" + "form_" + tabDics.code).valid();
            if(flag == false){
                break;
            }
        }
    }else{
        flag =  $("#myform").valid();
    }
    if (flag) {
        var jsonString = "{";
        if (formList && formList.length > 0) {
            for (var i = 0; i < formList.length; i++) {
                var tabDics = formList[i][0];
                var a = $("#" + "form_" + tabDics.code).serializeArray();
                $.each(a, function () {
                    if(this.type != 'button') {
                        jsonString += '"'+ this.name + '":';
                        jsonString += this.value == '' ? '"",' : '"' + this.value + '",'
                    }
                });
            }
        } else {
            var a = $("#myform").serializeArray();
            $.each(a, function () {
                if(this.type != 'button') {
                    jsonString += '"'+ this.name + '":';
                    jsonString += this.value == '' ? '"",' : '"' + this.value + '",'
                }
            });
        }
        if(jsonString.length>1) {
            jsonString = jsonString.substring(0, jsonString.length - 1);
        }
        if (id != "") {
            jsonString = jsonString + "}";
            var url = "/" + serverName + "/asi/xcyh/businessAccepted/ccproblem!saveData.action";
            $.ajax({
                type: 'post',
                url: url,
                data: {dataList: jsonString, templateId: templateid},
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        if($("#uploadfile").val() != ""){
                            $("#uploadfile").fileinput("upload");
                        }else{
                            layer.msg('保存成功！', {
                                icon: 1,
                                time: 2000
                            }, function () {
                            	window.parent.$("#table").bootstrapTable("refresh");
                                window.parent.layer.closeAll();
                            });
                        }
                    }
                }
            })
        } else {
            jsonString = jsonString + ',"templateCode":"' + templateCode + '"' + '}';
            var url = "/" + serverName + "/asiWorkflow/wfBusSave";
            /*$.getJSON(
                "/" + serverName + "/asiWorkflow/wfBusSave",
                {loginName: userCode, json: jsonString},
               function (json) {*/
            $.ajax({
                type : 'post',
                url : url,
                data : {loginName: userCode , json: jsonString},
                dataType : "json",
                success : function (json) {
                    if(json && json.noPriv){
                        layer.alert(json.noPriv,function(){
                            parent.layer.closeAll();
                        });


                    }
                    if(json && json.save){
                        activityName = json.save.task.activityName;
                        id = json.save.task.masterEntityKey;
                        if($("#uploadfile").val() != ""){
                            $("#uploadfile").fileinput("upload");
                        }
                    }
                    if(json && json.save){
                    	
//                       parent.layer.alert(json.save.message,function(){
                    	   parent.layer.alert("保存成功！",function(){
                    		if(typeof(window.parent.showWfSendPageAfterSave)!="function"){
                           		//alert("不是一个方法");
                           	}else{
                           		window.parent.showWfSendPageAfterSave(json.save.task);
                           	}
                            parent.layer.closeAll();
                            
                            
                        });
                    }

                }});
        }
    }
}

function getRelatedDic(relateddiccode,selectValue){
    var relatedFieldname = diccode_fieldname[relateddiccode];
    if(typeof($("#sblxChecks"))!='undefined' && $("#sblxChecks").html()!='' && relatedFieldname=='bhlx' ){
    	$("#sblxChecks").html("");//清空复选框
    }
    if(relateddiccode != undefined && dics[0][relatedFieldname] != undefined){
        $("#"+relatedFieldname).html("");
        $.ajax({
            type:'post',
            url: "/" + serverName + "/asi/facilitymgr/facilitymgr/dynamictable!getRelatedDicitem.action",
            data:{typecode:relateddiccode,parenttypecode:selectValue},
            dataType:'json',
            success:function(result){
            	if(result.result != null && result.result.length>0){
                	 //问题类型变成复选框
                    if(relatedFieldname=='bhlx'){
                    	var optionText2 = [];
                    	var bhlxArr =new Array();
                    	if (bhlxStr!=null && bhlxStr.indexOf(",") != -1) {//多种类型拼接
                    		bhlxArr = bhlxStr.split(",");
                    	}else{
                    		bhlxArr.push(bhlxStr);
                    	}
                        for(var i in result.result){
                        	var flag=false;
                        	for (var m in bhlxArr) {//里面的选中循环
                        		if(result.result[i].code == bhlxArr[m] ){
                        			flag=true;
                        			break;
                          		} 
                        	}
                        	optionText2.push('<input name="'+relatedFieldname+'" style="margin: 8px 0 0;"  type="checkbox" value="'+result.result[i].code+'" ' + (flag ? "checked" : "") + '/>'+result.result[i].name);
                        }
                        $("#sblxChecks").append(optionText2);
                        $("#isNullbhlx").html("&nbsp;*");//如果子字典有值，就把子字典必填*加上
                    }else{//以前的代码
                    	var optionText = [];
                        optionText.push('<option></option>')
                        for(var i in result.result){
                            optionText.push('<option value="'+result.result[i].code+'">'+result.result[i].name+'</option>')
                        }
                        $("#"+relatedFieldname).append(optionText.join(""));
                    }
                 }else if(relatedFieldname=='bhlx'){
                 	$("#isNullbhlx").html("&nbsp;&nbsp;");//如果子字典没有值，就把子字典必填*清除掉
                 }
            }
        })
    }
}   
 //默认选中   
function getDeafuleCheckes(selectValue){
	var relatedFieldname = "bhlx";
	if(typeof($("#sblxChecks"))!='undefined' && $("#sblxChecks").html()!='' && relatedFieldname=='bhlx'){
		$("#sblxChecks").html("");//清空复选框
	}
	var checksArr="";
	$.ajax({
        type:'post',
        url: "/" + serverName + "/asi/facilitymgr/facilitymgr/dynamictable!getRelatedDicitem.action",
        data:{typecode:"wtlx3",parenttypecode:selectValue},
        dataType:'json',
        async: false ,
        success:function(result){
        	var dicArr=result.result;
        	if(dicArr != null && dicArr.length>0){
        		if (bhlxStr!=null && bhlxStr.indexOf(",") != -1) {//多种类型拼接
            		var bhlxArr = bhlxStr.split(",");
            		for (var nn in dicArr) {//外面的大循环是全部
            			var flag=false;
                    	for (var m in bhlxArr) {//里面的选中循环
                    		if(dicArr[nn].code == bhlxArr[m] ){
                    			flag=true;
                    			break;
                      		} 
                    	}
                    	checksArr+='<input name="bhlx" style="margin: 8px 0 0;"  type="checkbox" value="' + dicArr[nn].code + '" ' + (flag ? "checked" : "") + ' />'+dicArr[nn].name;
                    }
            	}else{//一种类型
            		for (var nn in dicArr) {//外面的大循环是全部
            			var flag2=false;
            			if(dicArr[nn].code == bhlxStr){
                    		flag2=true;
                    	} 
            			checksArr+='<input name="bhlx" style="margin: 8px 0 0;"  type="checkbox" value="' + dicArr[nn].code + '" ' + (flag2 ? "checked" : "") + ' />'+dicArr[nn].name;
                    }
            	}
        	}
        }
    })
	return checksArr;
}
