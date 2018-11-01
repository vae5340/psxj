var stcd;
var sttp;
var mnit;
var SOURCE;
var staionType;
var dataList;
var isRealTime = false;
var maxValue ;
var myChart;
var echarts;
var visualMapObj = null;
var gdsd;
var yjsd;
var jjsw;
var jdgc;
var idx;
var z;
var maxZ;
var tm;
var waterLevelRange;
var loadDivHeight=14;//模拟水位div最大高度
var loadSideDivHeight=1.8;//两边水位div最大高度
var loadBootHeight =1.5;//底部的高度
var seriesArr=[];
var legendArr=[];

$(function () {
    // 加载数据
    initData();
    //初始化数据
    initEvent();
});

function initData() {
    stcd = request("stcd");
    sttp = request("sttp");
    mnit = request("mnit");
    SOURCE = decodeURI(request("stsys")); //数据来源
    staionType = decodeURI(request("staionType")); //监测点类型

    $.ajax({
        url: "/psxj/subject/getDateRange",
        // type:post,
        data:{stcd:stcd,sttp:sttp,mnit:mnit},
        dataType:'json',
        success: function(result){
            var data = result.content;
            var maxDate = data.maxDate;//common.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
            var minDate = data.minDate;
            $("#from_date").val(getPastDate(maxDate,1));
            $("#to_date").val(maxDate);

            getData();//历史数据

            $("#from_date").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate:minDate,
                    maxDate: "#F{$dp.$D('to_date')}"
                });
            });
            $("#from_date").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate: "#F{$dp.$D('from_date')}",
                    maxDate:'%y-%M-%d %H:%m:%s'
                });
            });
        }
    });
}

function initEvent(){

    $('.subnav-wrap li').click(function() {
        var lastValue = $(".subnav li.active").html();
        var currentValue = $(this).html();
        $(this).addClass('active').siblings().removeClass('active');
        $('.time-group').hide();
        //所选值不同是再请求
        if(lastValue!=currentValue){
            clickSearchBtn();
        }
    });
    $('#custombtn').click(function() {
        $('.time-group').show();
    });

    $("#source").html(SOURCE);
    $("#titleContent").html(staionType);
}

function clickSearchBtn(showLoading) {
    // var that = this;
    // //如果是自定义搜索
    // if(showLoading){
    //     common.showLoading($("#"+that.data.contentId));
    // };
    getHisData();
}

function getData() {

    $.ajax({
        url: "/psxj/subject/getStationProperties",
        type:"post",
        data:{stcd:stcd,sttp:sttp},
        dataType:'json',
        success: function(result){
            if(result) {
                var data = result.content;
                gdsd=data.mdep;//最高管顶深度
                yjsd=data.fwd;//满管预警深度
                jjsw=data.wndep;//预警水位
                jdgc=data.btelv;//井底高程
            }
            getHisData();
        }
    });
}

function initShape(dataList) {

    var WATER_LEVEL = dataList.z;//水位高度 5  data.z;

    //给各指标赋值
    loadValueToItem(dataList);
    //模拟警戒水位
    loadWarnHeight();
    if(WATER_LEVEL){
        changeWaterHeight(dataList);
    }
}

function loadValueToItem(dataList){

    var WATER_LEVEL=dataList.z;//水位高度 5  data.z;
    var TIME_KEY=dataList.tm;
    var JDGC=jdgc;//井底高程     井底高程+井深=地面高程
    var GDGC=0;//管底高程
    var BG=JDGC+WATER_LEVEL;//标高=井底高程+水位高度

    $("#updateTime").html("上报时间:"+TIME_KEY);

    $(".topTip.warn-value1").html("最高管顶:"+gdsd+"m");
    $(".topTip.warn-value2").html("满管预警:"+yjsd+"m");
    $(".topTip.warn-value3").html("警戒水位:"+jjsw+"m");

    if(WATER_LEVEL){
        $(".water-level-yz").html("液位:"+WATER_LEVEL+"m");
        $(".water-level-bg").html("标高:"+BG+"m");
    }else {
        // 若水位没有值，则水位高度不显示
        $(".box,.box-left,.box-right").css("display","none");
    }

    if(GDGC&&GDGC>0){
        $(".pipeTip.value2").html("管底标高:"+GDGC+"m");
    }
    if(JDGC&&JDGC>0){
        $(".pipeTip.value3").html("井底标高:"+JDGC+"m");
    }
}

function loadWarnHeight(){
    // var that = this;
    var totalValue=gdsd;//总高度
    var yjsdDivHeight=(1-yjsd/totalValue)*loadDivHeight;
    //预警深度
    $yjsd = $(".warn-value2");
    yjsdDivHeight -=($yjsd.height()/parseInt($yjsd.css('fontSize').substring(0,$yjsd.css('fontSize').length-2)))/2;
    $yjsd.css({top:yjsdDivHeight+"em"});

    //警戒水位
    var jjswDivHeight=(1-jjsw/totalValue)*loadDivHeight;
    $jjsw = $(".warn-value3");
    jjswDivHeight -=($jjsw.height()/parseInt($jjsw.css('fontSize').substring(0,$jjsw.css('fontSize').length-2)))/2;
    $jjsw.css({top:jjswDivHeight+"em"});
}

function changeWaterHeight(dataList){

    var currValue = dataList.z;
    var totalValue=gdsd;

    var currentDivHeight=(currValue/totalValue)*loadDivHeight;
    var currentSideDivHeight=currentDivHeight-loadBootHeight;

    var info="<strong>水位：</strong><span> "+currValue.toFixed(2)+"m</span>";

    $("#updateTime").text("上报时间："+dataList.tm);//采集时间

    //当前水位
    $(".water-level-yz").text("液位:"+currValue.toFixed(2)+"m");
    $(".water-level-bg").text("标高:"+(jdgc+currValue).toFixed(2)+"m");
    $("#load .box-right,#load .box-left").css({
        "height":(currentSideDivHeight>loadSideDivHeight?loadSideDivHeight:currentSideDivHeight)+"em",
    });
    $("#load .box").css({
        "height":currentDivHeight+"em",
    });
}

function playProfile() {
    var HDGC=waterLevelRange[2];//that.newestWaterLevel;//河道高程
    var currentDivHeight;//当前高度
    var that = this;
    if(!dataList)
        return;
    if(that.isPlaying){
        that.isPlaying = false;
        $("#playBtn").text("播放");
        clearInterval(interval);
    }else{
        var speed=$("#speed").val();
        that.isPlaying = true;
        $("#playBtn").text("停止");
        interval = setInterval(function(){
            if(idx<0){
                that.isPlaying = false;
                clearInterval(interval);
                $("#playBtn").text("播放");
                idx=dataList.length-1;
                return;
            }
            changeWaterHeight(dataList[idx]);
            idx--;
        },speed*1000);

    }
}

function stopPlaying(){
    var that=this;
    if(that.isPlaying){
        that.isPlaying = false;
        $("#playBtn").text("播放");
        clearInterval(interval);
    }
}

function getHisData() {

    stopPlaying();
    var fromDate = $('#from_date').val();
    var toDate = $('#to_date').val();

    var timetype = $(".subnav li.active").html();
    isRealTime = (timetype.indexOf("当日")==-1&&timetype.indexOf("自定义")==-1);//是否调取瞬时数据表
    $.ajax({
        url:"/psxj/subject/getDrainageDataByTime",
        type: "post",
        data:{stcd: stcd,timetype:timetype,time:toDate,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            if(result) {
                dataList = result.content;
                idx = dataList.length-1;
                z = dataList[0].z;
                tm = dataList[0].tm;
                $("#playButton").show();
                waterLevelRange = getWaterLevelRange(dataList);//获得水位区间
            }else{
                $("#playButton").hide();
                tm = "无检测值";
                z = null;
            }

            initShape(dataList[0]);//初始化剖面图
            loadHisChart(result);
            loadHistoryWaterList(result);
            // hideLoading();
        }
    })
}

function getWaterLevelRange(dataList){//获得最大水位值
    var maxValue=-9999999;
    var minValue=9999999;
    if(jjsw){
        maxValue = jjsw;
        minValue = 0;
    }
    if(!jjsw&&dataList){
        maxValue=dataList[0].z;
        for (var i=1;i<dataList.length;i++){
            maxValue=Math.max(maxValue,dataList[i].z);
            minValue=Math.min(minValue,dataList[i].z);
        }

        if(jjsw){
            maxValue=Math.max(maxValue,jjsw);
            minValue=Math.min(minValue,jjsw);
        }
    }

    minValue=parseFloat(minValue<0?minValue*1.2:minValue*0.8);
    maxValue=parseFloat(maxValue<0?maxValue*0.8:maxValue*1.2);

    return [minValue,maxValue,maxValue-minValue];
}

function loadHisChart(data) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }

    var date = [];
    var dataArr = [];
    var avgArr = [];
    var minArr = [];
    var maxArr = [];

    seriesArr=[];
    legendArr=[];

    if (data) {
        for (var i = data.content.length-1; i >=0; i--) {
            date.push(data.content[i].tm.indexOf(" ")>-1?data.content[i].tm.replace(' ', '\n'):data.content[i].tm);
            if(isRealTime){
                avgArr.push(data.content[i].avgZ);
                minArr.push(data.content[i].minZ);
                maxArr.push(data.content[i].maxZ);
            }else{
                dataArr.push(data.content[i].z);
            }

        }
    }

    //标题颜色配置的对象
    var objConfig ={
        "normal":{title:"水深",filed:"z",color:"#90FCFC"},
        "avg":{title:"平均水深",filed:"avg",color:"#6bc6fb"},
        "max":{title:"最大水深",filed:"max",color:"#063e58"},//#fab51b，#063e58
        "min":{title:"最小水深",filed:"min",color:"#1ab382"},
        "level1":{title:"最高管顶深度",filed:"gdsd",color:"red"},
        "level2":{title:"满管预警深度",filed:"yjsd",color:"orange"},
        "level3":{title:"警戒水位",filed:"jjsw",color:"yellow"}
    };

    var outOfRangeColor = objConfig.normal.color;
    if(isRealTime){
        pushChartData(objConfig.max.title,maxArr,objConfig.max.color);
        outOfRangeColor = objConfig.max.color;
    }else{
        pushChartData(objConfig.normal.title,dataArr,objConfig.normal.color);
    }

    addMarkLine(data,objConfig,outOfRangeColor);

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            x: 'center',
            text: '管道水位过程线',
            show:false
        },
        legend: {
            itemGap:5,
            itemWidth:15,
            data: legendArr,
            x: 'left'
        },
        visualMap: visualMapObj,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            name: '水深(m)',
            nameLocation:'middle',
            nameGap :50,
            max: function(value) {
                var max = value.max;
                return parseFloat((max*1.1).toFixed(2));
            },
            min:function(value) {
                var min = value.min;
                return parseFloat((min*0.9).toFixed(2));//min - parseFloat((min*0.1).toFixed(10));
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 10,
            end: 100,
            filterMode:'none'
        }, {
            show: true,
            showDetail:false,
            start: 10,
            end: 100,
            filterMode:'none'
        }],
        splitArea: {
            show: true
        },
        series:seriesArr
    };
    myChart.setOption(option);
}

function pushChartData(_title,_data,_color,_isMarkLine){//echart数据项渲染

    var serieObj ={
        name: _title,
        type: 'line',
        showSymbol:false,
        symbolSize:[0,0],
        data: _data
    };
    if(_color){
        serieObj.itemStyle = {
            normal: {
                color: _color  //线的颜色
            }
        }
    }
    if(_isMarkLine){//如果是划线
        serieObj.markLine= {
            symbolSize: [0, 0],
            label:{
                normal:{
                    position:'middle',
                    formatter: function (param) {
                        return param.name + ":" + param.value;
                    }
                }
            },
            data: [{
                name:_title,
                yAxis: _data[0]
            }]
        }

    }
    seriesArr.push(serieObj);
    legendArr.push(_title);
}

function addMarkLine(data,objConfig,outOfRangeColor){//警戒线渲染

    var hasMarkLine = false;
    var visualMapObj = null;
    //渲染超警戒范围的数组
    piecesArr=[];
    if(gdsd>0){
        var _data=[gdsd];
        var _obj=objConfig.level1;
        pushChartData(_obj.title,_data,_obj.color,true);
        piecesArr.push({gte: gdsd,label: '超出'+_obj.title,color:_obj.color});
        hasMarkLine = true;
    }
    if(yjsd>0){
        var _data= [yjsd] ;
        var _obj=objConfig.level2;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(gdsd){
            piecesArr.push({gte: yjsd,lt: gdsd,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte: yjsd,label:'超出'+_obj.title,color:_obj.color});
        }
        hasMarkLine = true;
    }
    if(jjsw>0){
        var _data= [jjsw];
        var _obj = objConfig.level3;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(yjsd){
            piecesArr.push({gte:jjsw,lt: yjsd,label:'超出'+_obj.title,color: _obj.color});
        }else if(gdsd){
            piecesArr.push({gte:jjsw,lt: gdsd,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte: jjsw,label: '超出'+_obj.title,color:_obj.color});
        }
        hasMarkLine = true;
    }
    if(hasMarkLine){
        visualMapObj = {
            show:false,
            dimension: 1,
            pieces:piecesArr,
            controller: {
                outOfRange: {
                    symbolSize: [30, 100]
                }
            },
            outOfRange: {
                color: outOfRangeColor
            }
        }
    }
}

function loadHistoryWaterList(result) {

    columns = [{
        id: "tm",
        text: "上报时间",
        datafield: "tm",
        align: "center",
        cellsalign: "center",
        sortable:true,
        sortorder :"desc"
    }];
    if(isRealTime){
        pushColumns("平均水深(m)","avgZ");
        pushColumns("最大水深(m)","maxZ");
        pushColumns("最小水深(m)","minZ");
    }else{
        pushColumns("水深(m)","z")
    }
    var datadatafields = [];
    for (var i = 0; i < columns.length; i++) {
        datadatafields.push({
            name: columns[i].datafield,
            type: 'string'
        });
    }
    var gridDataSource = {
        localdata: result.content?result.content:null,
        datadatafields: datadatafields,
        datatype: "array"
    };
    if(result){
        gridDataSource.localdata=result.content;
    }
    var dataAdapter = new $.jqx.dataAdapter(gridDataSource);
    $("#historyList").jqxGrid({
        width: "99%",
        height: "100%",
        source: dataAdapter,
        rowsheight: 25,
        altrows: true,
        groupsheaderheight: 25,
        columnsheight: 25,
        columns: columns
    });
}

function pushColumns(_title,_filed){

    columns.push({
        id: _filed,
        text: _title,
        datafield: _filed,
        align: "center",
        cellsformat: 'f2',
        type:'float',
        cellsalign: "center"
    });
}

function changeChartTable(arg) {
    $(".hisChart").toggle();
    $(".hisTable").toggle();
    if($(arg).hasClass('chart-icon')){
        $(arg).removeClass('chart-icon').addClass('table-icon').attr("title","查看数据");
    }else{
        $(arg).removeClass('table-icon').addClass('chart-icon').attr("title","查看过程线");
    }
}

/**
 * js获取url参数值
 * var De = decodeURI(request("Due"));//De=‘未设置’
 */
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = { };
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

function formatDate(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getPastDate(dateStr,past,fmt){//字符串日期,天数
    var pastDate = new Date();
    pastDate.setTime(new Date(dateStr.replace(new RegExp("-","gm"),"/")).getTime()  - parseInt(past) * 24 * 60 * 60 * 1000);
    if(fmt){
        return formatDate(pastDate,fmt);
    }
    return formatDate(pastDate,'yyyy-MM-dd hh:mm:ss');
}