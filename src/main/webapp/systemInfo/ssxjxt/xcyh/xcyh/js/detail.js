/*
 * 设施管理总体页面
 * 1.点击设施
 * 2.通过设施tablename获取
 * */

var serverName;
var procInstId;
var masterEntityKey;//数据主键id
var herf;
var infoData;
var taskName;
var taskId;

$(function(){
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
        serverName = getQueryStr("serverName");//herf.split("?")[1].split("&")[0].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[1].split("=")[1] != undefined) {
        procInstId = getQueryStr("procInstId");//herf.split("?")[1].split("&")[1].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[2].split("=")[1] != undefined) {
        masterEntityKey = getQueryStr("masterEntityKey");//herf.split("?")[1].split("&")[2].split("=")[1];
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[3].split("=")[1] != undefined) {
        taskName = getQueryStr("activityChineseName");//decodeURI(decodeURI(herf.split("?")[1].split("&")[3].split("=")[1]));
    }
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[1] != undefined && herf.split("?")[1].split("&")[4].split("=")[1] != undefined) {
        taskId = getQueryStr("taskInstDbid");//herf.split("?")[1].split("&")[4].split("=")[1];
    }
    showDetailData();
})

//加载办理经过列表
function loadProcessTable(data) {
    $("#processTable").bootstrapTable({
        columns: [{
            field: 'activityName',
            visible: false
        }, {
            field: 'activityChineseName',
            title: '环节名称',
            width: 120,
            align: 'center'
        }, {
            field: 'handleComments',
            title: '办理意见',
            width: 200,
            align: 'center'
        }, {
            field: 'assignee',
            title: '办理人',
            width: 100,
            align: 'center'
        }, {
            field: 'createDate',
            title: '开始时间',
            width: 150,
            align: 'center'
        }, {
            field: 'endDate',
            title: '结束时间',
            width: 150,
            align: 'center'
        }, {
            field: 'status',
            title: '办理状态',
            width: 100,
            align: 'center'
        }, {
            field: 'reassignName',
            title: '改派人',
            width: 100,
            align: 'center',
            visible: false
        }, {
            field: 'reassignCommentsTime',
            title: '改派时间',
            width: 150,
            align: 'center',
            visible: false
        }, {
            field: 'reassignComments',
            title: '改派说明',
            width: 200,
            align: 'center',
            visible: false
        }, {
            field: 'signTime',
            visible: false
        }]
    });
    var pageSize = 5;
    infoData = data;
    if (infoData.length <= pageSize) {
        $('#info-page-plugin-div').hide();
    } else {
        $('#info-page-plugin-div').show();
        initProcessTablePagePlugin(pageSize, 1, infoData.length);
    }
    $('#processTable').bootstrapTable('load', infoData.slice(0, pageSize));

}

//初始化办理经过表格分页插件
function initProcessTablePagePlugin(pageSize, pageNumber, totalRowNum) {
    $('#info-page-plugin-div').empty();
    //初始化分页控件
    $('#info-page-plugin-div').pageView({
        //每页行数
        pageSize: pageSize,
        //当前页数（第一页是1）
        pageNumber: pageNumber,
        //记录总行数（不分页），一般在加载数据时自动设置，不手动传入
        totalRowNum: totalRowNum,
        //改变页码的事件
        onChangePage: function (pageData) {
            var start = (pageData.pageNumber - 1) * pageData.pageSize;
            var end = start + pageData.pageSize;
            $('#processTable').bootstrapTable('load', infoData.slice(start, end));
        }
    });

    //调用加载分页方法
    $('#info-page-plugin-div').pageView("loadPage");
}

function getDicName(dicAry, value) {
    if (dicAry != null && dicAry != undefined) {
        value = "" + value;
        if (value.indexOf(",") != -1) {
            var disname = "";
            var checkboxAry = value.split(",");
            for (var k in checkboxAry) {
            	for (var j in dicAry){
                    if (dicAry[j].code == checkboxAry[k]) {
                        disname += dicAry[j].name + ",";
                        break;
                    }
                }

            }
            return disname.substring(0, disname.length - 1);
        } else {
            for (var j in dicAry) {
                if (dicAry[j].code == value) {
                    return dicAry[j].name;
                }
            }
            return "";
        }
    }
}

function showDetailData(){
    var data = {};
    data["instance.procInstId"] = procInstId;
    // if(taskInstDbid == undefined){
    //     data["instance.procInstId"] = procInstId;
    // }else{
    //     data["instance.taskInstDbid"] = taskInstDbid;
    // }
    //办理经过
    /*$.ajax({
        type: 'post',
        //url: '/' + serverName + '/trace/trace-record!getTraceInfo.action',
        url: '/' + serverName + '/gx-problem-report!getTraceInfo.action',
        data: data,
        dataType: 'json',
        success: function (ajaxResult) {
            if(ajaxResult) {
                if(ajaxResult.success) {
                    loadProcessTable(ajaxResult.result);
                }
            }
        }
    });*/

    //基本信息
    $.ajax({
        type:'post',
        url:'/psxj/asiWorkflow/getProblemForm.do',
        data:{id:masterEntityKey},
        dataType:'json',
        success:function(result){
            cleanJbxx();
            $("#szwzTD").text(result.szwz);
            $("#sslxTD").text(result.sslx);
            $("#jjcdTD").text(result.jjcd);
            $("#bhlxTD").text(result.bhlx);
            $("#wtmsTD").text(result.wtms);
            $("#sbrTD").text(result.sbr);
            $("#sbsjTD").text(result.sbsjStr);
            $("#sbdwTD").text(result.parentOrgName);
            //图片
            $.ajax({
                type: 'post',
                url: '/' + serverName + '/asiWorkflow/getImages.do',
                data:{masterEntityKey:masterEntityKey},
                dataType: 'json',
                success: function (ajaxResult) {
                    if(ajaxResult.success) {
                        var data = ajaxResult.content;
                        if (data != undefined) {
                            loadImagesList(data);
                        }
                    }
                }
            });
        }
    });
    
    //施工过程按钮taskId=="task1533796371857"
    if(taskName=="任务处置"){
    	$("#sggcButton").append('<div class="tool_bar"><ul class="toolList"  id=""><li class="handle" style="float:none" id="" onclick="addSggc()"><a href="" onclick="return false;">新增施工日志</a></li></ul></div>');
    }else{
    	$("#sggcButton").append('<div class="tool_bar"><ul class="toolList" id=""><li class="handle" style="float:none" id="" onclick="content()"><a href="" onclick="return false;">新增意见建议</a></li></ul></div>');
    }
    
    //处理情况
    loadSgrz();
    
}
function cleanJbxx(){
    $("#szwzTD").text("");
    $("#sslxTD").text("");
    $("#jjcdTD").text("");
    $("#bhlxTD").text("");
    $("#wtmsTD").text("");
    $("#sbrTD").text("");
    $("#sbsjTD").text("");
    $("#sbdwTD").text("");
}
function loadSgrz(){
	$.ajax({
        type: 'get',
        url: '/' + serverName + '/asiWorkflow/getTraceRecordAndSggcLogList',
        data:{sjid:masterEntityKey,procInstId:procInstId},
        dataType: 'json',
        success: function (data) {
            if(data.code==200 && data.data!=undefined) {
            	var result=data.data;
            	if(result!=null && result.length>0){
            		var htmlText="";
            		for(var i = 0; i < result.length; i++){
            			if((result[i].time && result[i].time>0) || i==0){//(result[i].time && result[i].time>0) || i==0
            				if(result[i].time<=0){
                    			htmlText+='<li><time class="cbp_tmtime" ><span></span> <span></span></time>';
            				}else{
            					var time=todate('time',result[i].time);
                    			var date =todate('date',result[i].time);
                    			htmlText+='<li><time class="cbp_tmtime" ><span>'+date+'</span> <span>'+time+'</span></time>';
            				}
                			htmlText+='<div class="cbp_tmicon cbp_tmicon-phone"></div><div class="cbp_tmlabel">';
                			if(result[i].lx && result[i].lx == "0"){
                				htmlText+='<h2>'+(i+1)+'.'+'施工日志'+'</h2>';
                				htmlText+='<p>填写人:&nbsp;&nbsp;&nbsp;'+result[i].opUser+'</p>';
                				htmlText+='<p>内容:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                			}else if(result[i].lx && result[i].lx == "1"){
                				htmlText+='<h2>'+(i+1)+'.'+'管理层意见'+'</h2>';
                				htmlText+='<p>填写人:&nbsp;&nbsp;&nbsp;'+result[i].opUser+'</p>';
                				htmlText+='<p>意见:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                			}else if(result[i].lx && result[i].lx == "2"){
                				htmlText+='<h2>'+(i+1)+'.'+result[i].linkName+'</h2>';
                				htmlText+='<p>经办人:&nbsp;&nbsp;&nbsp;'+result[i].opUser+'</p>';
                				htmlText+='<p>处理意见:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                			}else{
                				htmlText+='<h2>'+(i+1)+'.'+result[i].linkName+'</h2>';
                				if(i==0){
                					htmlText+='<p>上报人:&nbsp;&nbsp;&nbsp;'+result[i].opUser+'</p>';
                				}else{
                					htmlText+='<p>经办人:&nbsp;&nbsp;&nbsp;'+result[i].opUser+'</p>';
                				}
                				htmlText+='<p>电话:&nbsp;&nbsp;&nbsp;'+result[i].opUserPhone+'</p>';
                				if(result[i].time>0){
                				    if(result[i].lx=="task3"){
                                        htmlText+='<p>回退原因:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                                    }else if(result[i].lx=="task4"){
                                        htmlText+='<p>转派意见:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                                    }else{
                                        htmlText+='<p>处理意见:&nbsp;&nbsp;&nbsp;'+result[i].content+'</p>';
                                    }
                				}
                				if(result[i].nextOpUser && result[i].nextOpUser!=""){
                					htmlText+='<p>下一环节处理人:&nbsp;&nbsp;&nbsp;'+result[i].nextOpUser+'</p>';
                    				htmlText+='<p>电话:&nbsp;&nbsp;&nbsp;'+result[i].nextOpUserPhone+'</p>';
                				}
                			}
                			if(result[i].files&&result[i].files.length>0){
                				var total=0;
                				htmlText+='<ul id="img-view-clqk-'+i+'" class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px">';
                				for (var j = 0; j < result[i].files.length; j++) {
                					if(result[i].files[j].attPath.indexOf("imgSmall/")>=0){
                						result[i].files[j].attPath=result[i].files[j].path.replace("imgSmall/","");
                					}
                					htmlText+='<li class="img-view-li"><img data-original="'+result[i].files[j].attPath+'"' +
        							' src="'+result[i].files[j].attPath+'" alt="照片'+(total+1)+'" width=80 height=80></li>';

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
            	}
            }
        }
    });
}

function loadImagesList(data){
	var total=0,imgHtml='',img_view='';
	if(data && data.length>0){
		for (var i = 0; i < data.length; i++) {
			var rowData=data[i];
			var timeText,imgUrl;
			/*if(rowData.time)
				timeText = new Date().pattern("yyyy-MM-dd HH:mm:ss");*/
			imgUrl = rowData.attPath;
			img_view+='<li class="img-view-mx"><img data-original="'+imgUrl+'"' +
			' src="'+imgUrl+'" alt="照片'+(total+1)+'" width=100 height=100></li>';
			
			total++;
		}
	}else{
		img_view+='暂无照片';
	}
	$("#img-view").append(img_view);
	//$("#img-view").viewer({ url: 'data-original',fullscreen:false});//加载图片完调用viewer图片插件
	//执行父页面图片预览初始化
	$(".img-view-mx").click(function(){
		if(parent.initViewer)
			parent.initViewer($("#img-view").parent().html(),"img-view");
		if(parent.parent.initViewer)
			parent.parent.initViewer($("#img-view").parent().html(),"img-view");
		if(parent.viewer){
			parent.viewer.show($(this).index());
		}else if(parent.parent.viewer){
			parent.parent.viewer.show($(this).index());
		}else{
			layer.msg("未检测到图片插件!",{icon: 2});
		}
	});
}
function addSggc(){
	layer.closeAll();
	parent.layer.open({
        type: 2,
        title: "新增施工过程日志",
        shadeClose: false,
        //closeBtn : [0 , true],
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: [$(parent.window).width() * 0.5+'px', $(parent.window).height() * 0.8+'px'],
        offset: [$(parent.window).height() * 0.1+'px', $(parent.window).width()*0.25+'px'],
        content: "sggctabs.html?serverName="+serverName+"&taskId="+taskId+"&id="+masterEntityKey+"&type=add",
        cancel: function(){
        },
        end : function(){
        }

    });
}
function content(){
	layer.closeAll();
	parent.layer.open({
        type: 2,
        title: "评论",
        shadeClose: false,
        //closeBtn : [0 , true],
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: [$(parent.window).width() * 0.5+'px', $(parent.window).height() * 0.8+'px'],
        offset: [$(parent.window).height() * 0.1+'px', $(parent.window).width()*0.25+'px'],
        content: "sggctabs.html?serverName="+serverName+"&taskId="+taskId+"&id="+masterEntityKey+"&type=content",
        cancel: function(){
        },
        end : function(){
        }

    });
}
/** 
 * 时间戳格式化函数 
 * @return {string}           格式化的时间字符串 
 */
function todate(type,str){
	var date = new Date(str);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = (date.getDate()<10?'0'+date.getDate(): date.getDate())+ '';
	h = (date.getHours()<10?'0'+date.getHours(): date.getHours())+ ':';
	m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
	s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds(); 
	if(type=="date") {
		return Y+M+D;
	}else{
		return h+m+s;
	}
}

