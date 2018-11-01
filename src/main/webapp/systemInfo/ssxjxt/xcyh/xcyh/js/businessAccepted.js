//地图初始化相关的脚本1
require([
"esri/map",
"custom/tdt/TDTLayer", 
"custom/tdt/TomcatLayer", 
"custom/tdt/SuperMapLayer",
"custom/tdt/SuperMapImgLayer",
"custom/tdt/SuperMapBZLayer",
"esri/dijit/LocateButton",
"esri/dijit/Scalebar",
"esri/dijit/HomeButton",
"esri/dijit/LayerSwipe",
"esri/geometry/Geometry",
"esri/geometry/Circle",
"esri/geometry/Extent",
"esri/geometry/mathUtils",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/TextSymbol",
"esri/symbols/Font",
"esri/symbols/SimpleMarkerSymbol",  
"esri/symbols/SimpleFillSymbol",
"esri/symbols/PictureFillSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/Color",
"esri/InfoTemplate",
"esri/dijit/InfoWindow",
"custom/popup/PopupWin",
"custom/NewPopup/NewPopupWin",
"custom/InfoPanel/InfoPanel",
"esri/layers/FeatureLayer",
"esri/layers/WMTSLayer",
"esri/layers/WMTSLayerInfo",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/layers/ArcGISTiledMapServiceLayer",
"esri/layers/ArcGISImageServiceLayer",
"esri/layers/LabelLayer",
"esri/renderers/SimpleRenderer",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/geometry/Point",
"esri/tasks/query",
"esri/tasks/GeometryService",
"esri/tasks/AreasAndLengthsParameters",
"esri/tasks/LengthsParameters",
"esri/tasks/BufferParameters",
"esri/tasks/QueryTask",   
"esri/tasks/FindTask",
"esri/tasks/FindParameters",  
"esri/tasks/IdentifyTask",  
"esri/tasks/IdentifyParameters",  
"esri/tasks/StatisticDefinition",
"esri/toolbars/draw",  
"esri/tasks/FeatureSet",
"esri/SpatialReference"
]);
require(["dojo/ready"], function (ready) {
	ready(function () {
		initMapArc();
	});	
});
var mapArc;
//  加载地图  结束

var serverName;
var userCode;
var agcomServerName;
var pagenum = 1;
var pagesi = 10;
var totalrows = 0;
var tabs;
var herf;
var viewId;
var dbViewId='b342144e-17ba-4d35-a427-16a02a704385';
var ybViewId='b96ee82f-b49c-47cd-8132-3fffb9bfa9b5';
var bjViewId='5639506c-80b9-4cbe-b95a-19e497bbb28e';
var viewIds = [];
var infoData = [];
var templateId;
var templateObject;
var templateCode;
var mySwiper;
var viewtype;
var activityName;
var processTable_;
var metacodeItem={};

var buttonDatas = [{elementName:"新增",elementCode:"addForm",elementRender:"addForm()"},//添加新增按钮
                   {elementName:"发送",elementCode:"wfBusSend",elementRender:"showWfSendPage()"},
                   /*{elementName:"填写意见",elementCode:"addTaskComment"},*/
                   {elementName:"历史审批意见",elementCode:"listHistoryTaskComment",elementRender:"listHistoryTaskComment()"},
                   {elementName:"查看流程图",elementCode:"showDiagramDialog",elementRender:"viewWfDiagram()"},
                   {elementName:"转派",elementCode:"send_on_task",elementRender:"showReassignPage()"},
                   {elementName:"回退",elementCode:"wfTaskReturn",elementRender:"newWfReturnPrevTask()"}];
$(function () {
    herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
        templateCode = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    serverName = GetQueryString("serverName");
    userCode = GetQueryString("userCode");
    agcomServerName = GetQueryString("agcom_url");
    // initMap();
    getTabs();
    initInfoTab();
    dateInit(".mydate");
    processTable_ = new ProcessTable_();
    processTable_.Init();
    if(window.top.awater){
        metacodeItem.sslx={};
        metacodeItem.bhlx={};
        for(var i in window.top.awater?window.top.awater.code.pcode:[]){
            var item = window.top.awater.code.pcode[i];
            if(item.code){
                metacodeItem.sslx[item.code]=item.name;
            }
        }
        for(var i in window.top.awater?window.top.awater.code.childCode:[]){
            var item = window.top.awater.code.childCode[i];
            if(item.code){
                metacodeItem.bhlx[item.code]=item.name;
            }
        }
        metacodeItem.data=window.top.awater.code.data;
    }
    /*$("#save").click(function () {
        saveCcproblem();
    })*/
   /* $("#send").click(function () {
        wfSend();
    })*/
    //绑定点击图片打开lightbox事件
    $('#swiper_wrapper').click(function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = this.getElementsByTagName('a');
        blueimp.Gallery(links, options);
    });
});

// 地图初始化  开始
function initMapArc(){
	mapArc = new esri.Map("mapDiv", {
		showLabels: true,
	    logo:false,
	    center: [113.33863778154898,23.148347272756297],
	    extent: new esri.geometry.Extent({          
	    	xmin: 112.94442462654136,
	    	ymin: 22.547612828115952,
	    	xmax: 114.05878172043404,
	    	ymax: 23.938714362742893,
	    	/* xmin: 107.23452588182978,
	      ymin: 21.813379881292327,
	      xmax: 110.3840906318817,
	      ymax: 24.252829164596033,*/
	      spatialReference:{wkid:4326}
	    }),
//	    zoom: 17
	    zoom: 9,
	    maxZoom:10
	  });	
	
	
	// 底图、影像图、水利设施
    /*var tdtvecLayer = new tdt.TDTLayer("vec",{visible:true,id:'vec'}); 
    mapArc.addLayer(tdtvecLayer);
    var tdtcvaLayer = new tdt.TDTLayer("cva",{visible:true,id:'DiTu'});
    mapArc.addLayer(tdtcvaLayer);*/
    mapArc.addLayer(createDitu());
    mapArc.addLayer(createGW());
    
}
//地图初始化  结束

//管网
function createGW(){
	var url_=window.parent.awater.url.url_h;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:'gw_b1'});
    return layer;
}

//底图
function createDitu(){
	var url_=window.parent.awater.url.url_vec;
	 var layer = new esri.layers.ArcGISTiledMapServiceLayer(url_[0],{id:url_[1]});
	 return layer;
}

//地图初始化
function initMap() {
    //地图
    var mapFrame = $("#mapDiv");
    mapFrame.attr("src", "/"+agcomServerName);
}

function initPagePlugin(pageSize, pageNumber, totalRowNum) {
    $('#page-plugin-div').empty();
    //初始化分页控件
    $('#page-plugin-div').pageView({
        //每页行数
        pageSize: pageSize,
        //当前页数（第一页是1）
        pageNumber: pageNumber,
        //记录总行数（不分页），一般在加载数据时自动设置，不手动传入
        totalRowNum: totalRowNum,
        //改变页码的事件
        onChangePage: function (pageData) {
            /**
             * 这里进行数据列表的变更
             *
             * pageData对象里有2个属性:
             * 1.pageSize代表每页数据条数
             * 2.pageNumber代表当前页数
             */
            loadData(pageData.pageSize, pageData.pageNumber);
        }
    });

    //调用加载分页方法
    $('#page-plugin-div').pageView("loadPage");
}

/**
 * 1.5    获取tabs分类标题数据
 * @param tablename 表名称  or  tableid  表id
 * @param
 */
var tabLi=0;
function getTabs() {
    $.ajax({
        type: 'post',
        url: "/psxj/asiWorkflow/getTabsData",
        dataType: 'json',
        success: function (results) {
            if (results != null) {
                $("#tabList").html('');
                tabLi=results.length;
                for (var i = 0; i < tabLi; i++) {
                    var tabDics = results[i];
                    if (i == 0) {
                        viewId = tabDics.VIEW_ID;
                        $("#tabList").append('<li class="cur" id="tab_' + viewId + '">' + tabDics.VIEW_COMMENT + '</li>');
                        $("#tabCon").prepend('<div style="display:block;" id="tabCon_' + viewId + '"><div class="tool_bar"><ul class="toolList" id="toolList' + i + '"></ul></div></div>');
                    } else {
                        viewIds[i-1] = tabDics.VIEW_ID;
                        $("#tabList").append('<li id="tab_' + tabDics.VIEW_ID + '">' + tabDics.VIEW_COMMENT + '</li>');
                        $("#tabCon").prepend('<div style="display:none;" id="tabCon_' + tabDics.VIEW_ID + '"><div class="tool_bar"><ul class="toolList" id="toolList' + i + '"></ul></div></div>');
                    }
                    var menuList = tabDics.wfMenu;
                    var buttons=[];//排序后按钮
                    initAndSortButton(menuList,buttons);
                    if(tabDics.VIEW_ID==dbViewId){
                        $("#toolList" + i).append('<li class="handle" id="addFormLi" onclick="addForm()"><a href="" onclick="return false;">新增</a></li>');
                    }
                    for (var j = 0; j < buttons.length; j++) {
                        $("#toolList" + i).append('<li class="handle" id="' + buttons[j].ELEMENT_CODE + '" onclick="' + buttons[j].ELEMENT_RENDER + '"><a href="" onclick="return false;">' + buttons[j].ELEMENT_NAME + '</a></li>');
                    }

                }
                $("#tabList li").click(function () {
                    viewId = this.id.replace("tab_", "");
                    $(this).addClass('cur').siblings().removeClass('cur');
                    $("#tabCon").children().hide();
                    $("#tabCon_" + viewId).show();
                    loadData(10, 1);
                });
                loadData(10, 1);
            }
        }
    });
}
function initAndSortButton(menuList,buttons){
    for(var j=0; j<buttonDatas.length; j++){
        var temp = buttonDatas[j];
        for(var i=0;i<menuList.length;i++){
            if(menuList[i].ELEMENT_CODE==temp.elementCode){
                menuList[i].ELEMENT_RENDER=temp.elementRender;
                menuList[i].ELEMENT_NAME=temp.elementName;
                buttons.push(menuList[i]);
            }
        }
    }

}
function getTabs备份() {
    var userId = parent.$("#userName").data("userId");
    $.ajax({
        type: 'post',
        // url: "/" + serverName + "/asi/xcyh/businessAccepted/ccproblem!getTabsData.action", /*"/"+serverName+"/asi/xcyh/businessAccepted/ccproblem!getTabsData.ation"*/
        url: "/psxj/ccProblem/getTabsData",
        data: {"templateCode": templateCode, "userId": userId},
        dataType: 'json',
        success: function (results) {
            if (results != null) {
                templateObject = results[0];
                templateId = templateObject.id;
                var list = results[1];
                if (list && list.length > 0) {
                	$("#tabList").html('');
                	tabLi=list.length;
                    for (var i = 0; i < list.length; i++) {
                        var tabDics = list[i];
                        if (i == 0) {
                            viewId = tabDics.id;
                            viewtype = tabDics.viewtype;
                            $("#tabList").append('<li class="cur" id="tab_' + tabDics.id + '_' + tabDics.viewtype + '">' + tabDics.viewdisplayname + '</li>');
                            $("#tabCon").prepend('<div style="display:block;" id="tabCon_' + tabDics.id + '"><div class="tool_bar"><ul class="toolList" id="toolList' + i + '"></ul></div></div>');//<div class="tool_r"><a href="javascript:sortMetadatatable()" class="setting"></a></div>
                        } else {
                        	viewIds[i-1] = tabDics.id;
                            $("#tabList").append('<li id="tab_' + tabDics.id + '_' + tabDics.viewtype + '">' + tabDics.viewdisplayname + '</li>');
                            $("#tabCon").prepend('<div style="display:none;" id="tabCon_' + tabDics.id + '"><div class="tool_bar"><ul class="toolList" id="toolList' + i + '"></ul></div></div>');
                        }
                        var menuList = list[i].wfMenu;
                        for (var j = 0; j < menuList.length; j++) {
                            $("#toolList" + i).append('<li class="handle" id="' + menuList[j].elementCode + '" onclick="' + menuList[j].elementInvoke + '"><a href="" onclick="return false;">' + menuList[j].elementName + '</a></li>');
                        }

                    }
                    $("#tabList li").click(function () {
                        var a = this.id.replace("tab_", "");
                        viewId = a.split("_")[0];
                        viewtype = a.split("_")[1];
                        $(this).addClass('cur').siblings().removeClass('cur');
                        $("#tabCon").children().hide();
                        $("#tabCon_" + viewId).show();
                        loadData(10, 1);
                    });
                    loadData(10, 1);
                }
            }
        }
    });

    // 模拟单击页签
    /*
    setTimeout(function(){
    	var str=" ";
        for(var i=0;i<tabLi;i++){
        	var str1=" setTimeout(function(){  \n  $('#tabList li').eq("+(i)+").click(); \n "+str+" \n },500); ";
        	str=str1;
        }
        eval(str);
    },500);
    */
}

function editForm() {
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var id = rowData[0].masterEntityKey;
        activityName = rowData[0].activityName;
        addForm(id);
    } else {
        layer.alert("请选中一条记录！");
    }
}

function addForm(id) {
    id = id == undefined ? "" : id;
    //var appId = "e0c56e22-dc24-4cac-8905-47f083b20ecc";//起草GX_EXCH
    //var appId = "e5ce4d90-8eeb-4c88-ae41-31f7a1842054";//起草GX_EXCH_RGRM_TEST

    // var viewId ="b342144e-17ba-4d35-a427-16a02a704385";//待办
    //var viewId ="b96ee82f-b49c-47cd-8132-3fffb9bfa9b5";//已办
    //var viewId ="5639506c-80b9-4cbe-b95a-19e497bbb28e";//办结
    layer.closeAll();
    //iframe窗
    layer.open({
        type: 2,
        title: "问题上报",
        shadeClose: false,
        //closeBtn : [0 , true],
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: ['700px', '475px'],
        offset: ['30px', $(window).width()/2-400+'px'],
        // content: "tabs.html?serverName="+serverName+"&templateId="+templateId+"&templateCode="+templateCode+"&tablename="+templateObject.masterEntity+"&id="+id+"&userCode="+userCode+"&activityName="+activityName,
        content: "tabs.html?serverName="+serverName+"&id="+id+"&viewId="+dbViewId,
        cancel: function(){
        },
        end : function(){
            loadData(10,1);
            var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
            if(rowData.length>0){
                LoadDetailData(rowData[0]);
            }
        }

    });

}

function setTableColumn() {
    var headcolumns = [];
    var headcolumn = {};
    headcolumn.field = '';
    headcolumn.checkbox = true;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'SZWZ';
    headcolumn.title = '问题地点';
    headcolumn.visible = true;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'TASK_NAME';
    headcolumn.title = '节点名称';
    headcolumn.visible = true;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'SSLX';
    headcolumn.title = '设施类型';
    headcolumn.visible = true;
    headcolumn.formatter = function(val,row,index){
        if(metacodeItem.sslx){
            return metacodeItem.sslx[val];
        }
    };
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'BHLX';
    headcolumn.title = '问题类型';
    headcolumn.visible = true;
    headcolumn.formatter = function(val,row,index){
        if(!val)
            return "";
        if(metacodeItem.bhlx){
            var code = "";
            if(val){
                for(var i in val.split(',')){
                    var item = val.split(',')[i];
                    code+=code?","+metacodeItem.bhlx[item]:metacodeItem.bhlx[item];
                }
            }
            return code;
        }
    };
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'ID';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'PROC_INST_ID';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'SBSJ';
    headcolumn.title = '上报时间';
    // headcolumn.formatter = function(value, row, index){
    //     if(value)
    //         return getLocalTime(value);
    //     return '';
    // }	;
    headcolumn.visible = true;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'SBR';
    headcolumn.title = '上报人';
    headcolumn.visible = true;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'JJCD';
    headcolumn.title = '紧急程度';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'WTMS';
    headcolumn.title = '问题描述';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'PARENT_ORG_NAME';
    headcolumn.title = '上报单位';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'TASK_ID';
    headcolumn.title = '节点ID';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'TASK_CODE';
    headcolumn.title = '节点CODE';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    headcolumn = {};
    headcolumn.field = 'PROCDEF_KEY';
    headcolumn.title = '流程KEY';
    headcolumn.visible = false;
    headcolumns.push(headcolumn);
    return headcolumns;
}



function loadData(pageSize, pageNumber) {
    var url = '/' + serverName + '/asiWorkflow/getDZbSummary';
    var orderBy = 'create';
    var title = '创建时间';
    if(viewId!=dbViewId){
        isCheck=1
    }
    if(viewId==ybViewId){
        url = '/' + serverName + '/asiWorkflow/getYbSummary';//已办
    }else if(viewId==bjViewId){
        url = '/' + serverName + '/asiWorkflow/getBjSummary';
    }
    var headcolumns = setTableColumn();
    $.getJSON(
        url,
        {
             pageNo : pageNumber,
            pageSize: pageSize
        },
        function (result) {
            var data = result.rows;
            $('#exampleTableEvents').bootstrapTable('destroy');
            $('#bootstrapDataGrid').show();
            $("#exampleTableEvents").bootstrapTable({
                data: data,
                clickToSelect: true,//点击选中行
                singleSelect: true,
                columns: headcolumns,
                onClickRow: function (row) {
                    LoadDetailData(row);
                },
                onDblClickRow: function(row){
                    layer.closeAll();
                    //iframe窗
                    layer.open({
                    	id:"ajxq",
                        type: 2,
                        title: "问题详情",
                        shadeClose: false,
                        //closeBtn : [0 , true],
                        shade: 0.5,
                        maxmin: true, //开启最大化最小化按钮
                        area: [$(window).width() * 0.9+'px', $(window).height() * 0.9+'px'],
                        offset: [$(window).height() * 0.05+'px', $(window).width() * 0.05+'px'],
                        content: "detail.html?serverName="+serverName+"&procInstId="+row.PROC_INST_ID+"&masterEntityKey="+row.ID+"&taskName="+row.TASK_NAME+"&taskId="+row.TASK_ID,
                        cancel: function(){
                        },
                        end : function(){
                            loadData(10,1);
                            var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
                            if(rowData.length>0){
                                LoadDetailData(rowData[0]);
                            }
                        }

                    });
                }
            });

            totalrows = result.total;

            var b = "" + $("#tab_" + viewId ).html();
            if (b.indexOf("(") != -1) {
                b = b.substring(0, b.indexOf("(") + 1) + totalrows + b.substring(b.indexOf(")"), b.length);
                $("#tab_" + viewId ).html("").append(b);
            } else {
                $("#tab_" + viewId).append("(" + totalrows + ")");
            }
            if (totalrows < 11) {
                $('#page-plugin-div').hide();
            } else {
                $('#page-plugin-div').show();
                initPagePlugin(pageSize, pageNumber, totalrows);
            }
        });
}



function initInfoTab() {
    $("#infoTab li").click(function () {
        var id = this.id.replace("_tab", "");
        $(this).addClass('cur').siblings().removeClass('cur');
        $("#infoCon").children().hide();
        $("#" + id).show();
    });
}

function getDicName(dicAry, value) {
    if (dicAry != null && dicAry != undefined) {
        value = "" + value;
        if (value.indexOf(",") != -1) {
            var disname = "";
            var checkboxAry = value.split(",");
            for (var k in checkboxAry) {
            	for (var j in dicAry) {
                    if (dicAry[j].code == checkboxAry[k]) {
                        disname += dicAry[j].name + ",";
                        break;//满足一个就弹出
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

//排序设施表模板字段
function sortMetadatatable() {
    var width = $(window).width() / 2;
    var height = $(window).height() * 3 / 4;
    //iframe窗
    layer.open({
        type: 2,
        title: "显示字段配置",
        shadeClose: true,
        //closeBtn : [0 , true],
        shade: false,
        maxmin: false, //开启最大化最小化按钮
        area: [width + 'px', height + 'px'],
        offset: ['30px', $(window).width() / 2 + 'px'],
        content: "fieldsort.html?viewId=" + viewId + "&templateid=" + templateId+"&serverName="+serverName

    });
}
$('#myModal').on('hidden.bs.modal', function () {
    $(".error").remove();
});

//加载图像
function loadImages(data) {
    var $swiper_wrapper = $('#swiper_wrapper');
    $swiper_wrapper.empty();
    $('#swiper_container').hide();
    if (data.length > 0) {
        //不销毁的话重新加载会有bug
        if (mySwiper) mySwiper.destroy(true, true);
        for (var i = 0; i < data.length; i++) {
            var $swiper_slide = $('<div class="swiper-slide"></div>').appendTo($swiper_wrapper);
            var $a = $('<a href="' + data[i].attPath + '"></a>').appendTo($swiper_slide);
            $('<img src="' + data[i].attPath  + '" width=100% height=100% />').appendTo($a);
        }
        $('#swiper_container').show();
        if (data.length == 1) {
            //只有一条数据的时候隐藏切换按钮
            $swiper_wrapper.siblings().hide();
        } else {
            $swiper_wrapper.siblings().show();
        }
        mySwiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            loop: false,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev'
        });
    }
}
function clearFormData(){
    $("#SSLX").text("");
    $("#JJCD").text("");
    $("#BHLX").text("");
    $("#SZWZ").text("");
    $("#WTMS").text("");
    $("#SBR").text("");
    $("#SBSJ").text("");
    $("#PARENT_ORG_NAME").text("");
}
function LoadDetailData(row){
    $("#gxForm").hide();
    if (row) {
        $.get("/psxj/ccProblem/getProblemTableData",{id:row.ID},function(result){
            if(result.success && result.data){
                //定位
                locationPointPositionArc(result.data.x,result.data.y);
            }
        },'json');
        clearFormData();
        formToData(row,"#gxForm ");
        $("#gxForm").show();
        //基本信息
        $.ajax({
            type:'post',
            url:'/psxj/asiWorkflow/getTraceInfo',
            data:{id:row.ID,taskId:row.TASK_ID},//row.masterEntityKey
            dataType:'json',
            success:function(result){
                if(result.data)
                    processTable_.load("#processTable",result.data);
                else
                    processTable_.load("#processTable",[]);
            }
        });

        //图片
        $.ajax({
            type: 'post',
            url: '/' + serverName + '/asiWorkflow/getImages.do',
            data: {'masterEntityKey': row.ID},
            dataType: 'json',
            success: function (ajaxResult) {
                if (ajaxResult) {
                    if (ajaxResult.success) {
                        loadImages(ajaxResult.content);
                    }
                }
            }
        });
    }
}
var ProcessTable_ = function(){
    var $processTable_ = new Object();
    $processTable_.Init= function(){
        $("#processTable").bootstrapTable({
            cache:false,
            pagination:true,
            striped:true,
            sidePagination:"client",
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            clickToSelect:true,
            columns: [
                {field: 'name',title: '环节名称',width: 120, align: 'center' },
                {field: 'description',title: '办理意见', width: 200,align: 'center'},
                { field: 'assignee',title: '办理人', width: 100, align: 'center',visible: false },
                { field: 'assigneeName',title: '办理人', width: 100, align: 'center' },
                {field: 'startTime',title: '开始时间',width: 150, align: 'center',
                    formatter:function(val,row,index){
                        if(val) return getLocalTime(val);
                        return val;
                }}, {
                field: 'endTime',title: '结束时间', width: 150, align: 'center',
                    formatter:function(val,row,index){
                        if(val) return getLocalTime(val);
                        return val;
                    }}, {
                field: 'state', title: '办理状态',   width: 100,    align: 'center',
                formatter:function(val,row,index){
                        if(val=='start') return '<font color="red">办理中</font>';
                        if(val=='end') return '<font color="green">已办理</font>';
                        if(val=='trans') return '<font color="green">已转派</font>';
                        if(val=='return') return '<font color="green">已回退</font>';
                        return '';
                }}]
        });
    },
    $processTable_.load=function(eve,data){
        $(eve).bootstrapTable("load",data);
    }
    return $processTable_;
}
function formToData(data,eve){
    var formType = function(name,data){
        if(name=='BHLX'){
            if(metacodeItem.bhlx){
                var code = data.split(',');
                var codeVal="";
                for(var k in code){
                    codeVal+= codeVal? ","+metacodeItem.bhlx[code[k]]:metacodeItem.bhlx[code[k]];
                }
                return codeVal;
            }
        }else if(name=='SSLX'){
            if(metacodeItem.sslx){
                return metacodeItem.sslx[data];
            }else{
                return data;
            }
        }else if(name=='JJCD'){
            var jjcd = "";
            if(data=='1') jjcd='一般';
            if(data=='3') jjcd='紧急';
            if(data=='2') jjcd='较紧急';
            return jjcd;
        } else if(name=='SBSJ'){
            // return getLocalTime(data);
            return data;
        }else if(name=='startTime'){
            return getLocalTime(data);
        } else if(name=='endTime'){
            return getLocalTime(data);
        }else{
            return data;
        }
    }
    if(typeof data == 'object'){
        for(var i in data){
            if(!i) continue;
            var $tag = $(eve+"#"+i);
            if($tag[0]){
                var tagName =$tag[0].tagName;
                if(tagName=='input'){
                    $tag.val(formType(i,data[i]));
                }else{
                    $tag.html(formType(i,data[i]));
                }
            }
        }
    }
}
function getProgressBar(createDate,endDate,dueDate){
    if(endDate && dueDate){
        endDate = new Date(endDate);
        dueDate = new Date(dueDate);
        var percent = endDate.getTime()/dueDate.getTime();
        if(percent <1){
            return '<div class="progress progress-mini" title="'+getTitle(percent,dueDate,endDate,'ended')+'"><div style="width: 100%;" class="progress-bar-navy-light"></div></div>';
        }else{
            return '<div class="progress progress-mini" title="'+getTitle(percent,dueDate,endDate,'ended')+'"><div style="width: 100%;" class="progress-bar-danger"></div></div>';
        }
    }else if(endDate) {
        endDate = new Date(endDate);
        return '<div title="已办理，该任务无时间限制，完成时间：'+getFormartDate(endDate)+'" class="progress progress-mini"><div style="width: 100%;" class="progress-bar-navy-light"></div></div>';
    }else if(createDate && dueDate){
        var now = new Date();
        dueDate = new Date(dueDate);
        createDate = new Date(createDate);
        var percent = (now.getTime()-createDate.getTime())/(dueDate.getTime()-createDate.getTime());
        var width = (percent * 100)+'%';
        if(percent<=0.8){
            return '<div class="progress progress-mini" title="'+getTitle(percent,dueDate,now)+'"><div style="width: '+width+';" class="progress-bar-navy-light"></div></div>';
        }else if(percent > 0.8 && percent <1){

            return '<div class="progress progress-mini" title="'+getTitle(percent,dueDate,now)+'"><div style="width: '+width+';" class="progress-bar-warning"></div></div>';
        }else{
            return '<div class="progress progress-mini" title="'+getTitle(percent,dueDate,now)+'"><div style="width: '+width+';" class="progress-bar-danger"></div></div>';
        }
    }else{
        return '<div title="未办理，该任务无时间限制" class="progress progress-mini"><div style="width: 100%;" class="progress-bar"></div></div>';
    }
}

function getTitle(percent,dueDate,now,state){
    var title = "";
    var d = new Date(dueDate);
    d = getFormartDate(d);
    if(percent < 1){
        if(state != undefined && state == 'ended'){
            title += "已办理, 截止时间：" + d + ",完成时间："+getFormartDate(now)+",未超时";
            return title;
        }else {
            title += "未办理, 截止时间：" + d + ", 剩余时间：";
            var date = dueDate.getTime() - now.getTime();
            return title + getDays(date);
        }
    }else{
        if(state != undefined && state == 'ended'){
            title += "已办理,截止时间：" + d + ",完成时间："+getFormartDate(now)+"超时：";
        }else {
            title += "未办理, 截止时间：" + d + ", 超时：";
        }
        var date = now.getTime() - dueDate.getTime();
        return title + getDays(date);
    }
}
function getFormartDate(d){
    return d.getFullYear() + '-' + ((d.getMonth() + 1)<10?"0"+(d.getMonth() + 1):(d.getMonth() + 1)) + '-'
    + (d.getDate()<10?"0"+ d.getDate(): d.getDate())
    + ' ' + (d.getHours()<10?"0"+ d.getHours(): d.getHours())
    + ':' + (d.getMinutes()<10?"0"+ d.getMinutes(): d.getMinutes())
    + ':' + (d.getSeconds()<10?"0"+ d.getSeconds(): d.getSeconds());
}
function getDays(date){
    //计算出相差天数
    var days=Math.floor(date/(24*3600*1000));
    //计算出小时数
    var leave1=date%(24*3600*1000);//计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);//计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);

    return (days == 0?"":days+"天")+(hours==0?"":hours+"小时")+(minutes == 0?"":minutes+"分钟")+(seconds == 0?"":seconds+"秒");
}

function changePageStyle(e){
    if($(e).attr("class") == 'btn_l'){
        $(e).attr("class",'btn_r');
        $(".list_box").css({'margin-left':"16px"});
        $(".container_left").css({width:'0'});
    }else if($(e).attr("class") == 'btn_r'){
        $(e).attr("class",'btn_l');
        $(".list_box").css({'margin-left':"0"});
        $(".container_left").css({width:'26%'});
    }else if($(e).attr("class") == 'b_b'){
        $(e).attr("class",'b_t');
        $(".info_box").css({'height':"0"});
        $("#tabCon").css({height:'98%'});
    }else if($(e).attr("class") == 'b_t'){
        $(e).attr("class",'b_b');
        $(".info_box").css({'height':"calc(42% - 41px)"});
        $("#tabCon").css({height:'58%'});
    }
}

// 领取
function acceptAction(){
	var row=$('#exampleTableEvents').bootstrapTable('getSelections');
	if(row.length==1){
		layer.confirm('确定领取此任务吗？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {
        	// 领取
			$.ajax({
				url:'/' + serverName + '/task/work-task!takeTasks.action',
				cache:false,
				anysc:false,
				method: 'POST',
				data:{
					taskInstDbids:row[0].taskInstDbid
				},
				success:function(result){
					// 模拟单击页签
					/*
				    setTimeout(function(){
				    	var str=" ";
				        for(var i=0;i<tabLi;i++){
				        	var str1=" setTimeout(function(){  \n  $('#tabList li').eq("+(i)+").click(); \n "+str+" \n },500); ";
				        	str=str1;
				        }
				        eval(str);
				    },500);
				    */
					layer.close(index);
				}
			});
        }, function () {
            return;
        });
	}else if(row.length>1){
		layer.alert("请选中一条记录！");
	}else{
		layer.alert("请选中一条记录！");
	}
}