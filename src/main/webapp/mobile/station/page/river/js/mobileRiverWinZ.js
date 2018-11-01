var stcd;
var sttp;
var mnit;
var SOURCE;
var staionType;
var dataList;
var isRealTime = false;
var columns;
var maxValue ;
var myChart;
var echarts;
var visualMapObj = null;
var loadDivHeight=12.9;//自己计算高度，定死div总高度
var level1;
var level2;
var level3;
var total;
var rz;
var avgRz;
var maxRz;
var minRz;
var tm;
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
            $("#to_date").click(function () {
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
                level1=data.wrz;//警戒水位
                level2=data.grz;//井底高程
            }
            getHisData();
            initShape();//初始化剖面图
        }
    });
}

function initShape() {

    if(level1){
        $(".warn-level1").html("警戒水位:"+(level1).toFixed(2)+"m");
    }
    if(level2){
        $(".warn-level2").html("保证水位:"+(level2).toFixed(2)+"m");
    }
    if(level3){
        $(".warn-level3").html("死水位:"+(level3).toFixed(2)+"m");
    }
}

function playProfile() {
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
            updateWaterLevel(dataList[idx]);
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

    var fromDate = $('#from_date').val();
    var toDate = $('#to_date').val();
    stopPlaying();

    var timetype = $(".subnav li.active").html();
    isRealTime = (timetype.indexOf("当日")==-1&&timetype.indexOf("自定义")==-1);//是否调取瞬时数据表
    $.ajax({
        url:"/psxj/subject/getRiverDataByTime",
        type: "post",
        data:{stcd: stcd,timetype:timetype,time:toDate,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            if(result.content) {
                dataList= result.content;
                idx=dataList.length-1;
                $("#playButton").show();
                waterLevelRange=getWaterLevelRange(dataList);//获得水位区间
                z = dataList[0].z;
                maxZ = dataList[0].maxZ;
                tm = dataList[0].tm;
            }else{
                tm = "无检测值";
                $("#playButton").hide();
            }

            loadHisChart(result);
            loadHistoryWaterList(result);
            updateWaterLevel(dataList[0]);
            // hideLoading();
        }
    })
}

function getWaterLevelRange(dataList){//获得最大水位值
    var maxValue=-9999999;
    var minValue=9999999;
    if(dataList){
        if(isRealTime){
            maxValue=dataList[0].avgZ;
            for (var i=1;i<dataList.length;i++){
                maxValue=Math.max(maxValue,dataList[i].avgZ);
                minValue=Math.min(minValue,dataList[i].avgZ);
                maxValue=Math.max(maxValue,dataList[i].minZ);
                minValue=Math.min(minValue,dataList[i].minZ);
                maxValue=Math.max(maxValue,dataList[i].maxZ);
                minValue=Math.min(minValue,dataList[i].maxZ);
            }
        }else{
            maxValue=dataList[0].z;
            for (var i=1;i<dataList.length;i++){
                maxValue=Math.max(maxValue,dataList[i].z);
                minValue=Math.min(minValue,dataList[i].z);
            }
        }
    }
    if(level1){//&&isInFloodSeasonFlag
        maxValue=Math.max(maxValue,level1);
        minValue=Math.min(minValue,level1);
    }
    if(level2){
        maxValue=Math.max(maxValue,level2);
        minValue=Math.min(minValue,level2);
    }
    if(level3){
        maxValue=Math.max(maxValue,level3);
        minValue=Math.min(minValue,level3);
    }

    minValue=parseFloat(minValue<0?minValue*1.2:minValue*0.8);
    maxValue=parseFloat(maxValue<0?maxValue*0.8:maxValue*1.2);

    return  [minValue,maxValue,maxValue-minValue];
}

function loadHisChart(result) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }

    var data = result.content;
    var date = [];
    var dataArr = [];
    var avgArr = [];
    var minArr = [];
    var maxArr = [];
    if (data) {
        for (var i = data.length-1; i>=0; i--) {
            date.push(data[i].tm.replace(' ', '\n'));
            if(isRealTime){
                avgArr.push(data[i].z);
                minArr.push(data[i].minZ);
                maxArr.push(data[i].maxZ);
            }else{
                dataArr.push(data[i].z);
            }
        }
    }
    //标题颜色配置的对象
    var objConfig ={
        "normal":{title:"水位",filed:"z",color:"#90FCFC"},
        "avg":{title:"平均水位",filed:"avg",color:"#6bc6fb"},
        "max":{title:"最大水位",filed:"max",color:"#063e58"},//#fab51b，#063e58
        "min":{title:"最小水位",filed:"min",color:"#1ab382"},
        "level1":{title:"警戒水位",filed:"level1",color:"red"},
        "level2":{title:"保证水位",filed:"level2",color:"orange"},
        "level3":{title:"警戒水位",filed:"level3",color:"yellow"}
    };

    seriesArr=[];
    legendArr=[];

    var outOfRangeColor = objConfig.normal.color;
    if(isRealTime){
        pushChartData(objConfig.max.title,maxArr,objConfig.max.color);
        outOfRangeColor = objConfig.max.color;
    }else{
        pushChartData(objConfig.normal.title,dataArr,objConfig.normal.color);
    }
    addMarkLine(objConfig,outOfRangeColor);

    var option = {
        tooltip: {
            trigger: 'axis'
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
            name: '水位(m)',
            scale :true,//脱离0刻度
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
        series:seriesArr
    };
    myChart.setOption(option,true);
}

function pushChartData(_title,_data,_color,_isMarkLine){//echart数据项渲染

    var serieObj ={
        name: _title,
        type: 'line',
        showSymbol:false,
        symbolSize:[0,0],
        smooth: true,
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
                    fontWeight:'bold',
                    fontSize:14,
                    textBorderWidth:1,
                    textBorderColor :'rgba(0,0,0,0.25)',
                }
            },
            data: [{
                name: _title,
                yAxis: _data[0]
            }]
        }

    }
    seriesArr.push(serieObj);
    legendArr.push(_title);
}

function addMarkLine(objConfig,outOfRangeColor){//警戒线渲染

    var hasMarkLine = false;
    var visualMapObj = null;
    //渲染超警戒范围的数组
    piecesArr=[];
    if(level1>0){
        var _data=[level1];
        var _obj=objConfig.level1;
        pushChartData(_obj.title,_data,_obj.color,true);
        piecesArr.push({gte: level1,label: '超出'+_obj.title,color:_obj.color});
        hasMarkLine = true;
    }
    if(level2>0){
        var _data= [level2] ;
        var _obj=objConfig.level2;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(level1){
            piecesArr.push({gte: level2,lt: level1,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte: level2,label:'超出'+_obj.title,color:_obj.color});
        }
        hasMarkLine = true;
    }
    if(level3>0){
        var _data= [level3];
        var _obj = objConfig.level3;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(level2){
            piecesArr.push({gte:level3,lt: level2,label:'超出'+_obj.title,color: _obj.color});
        }else if(that.level1){
            piecesArr.push({gte:level3,lt: level1,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte: level3,label: '超出'+_obj.title,color:_obj.color});
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
        id: "sbsj",
        text: "上报时间",
        datafield: "tm",
        align: "center",
        cellsalign: "center"
    }];
    if(isRealTime){
        pushColumns("平均水位(m)","avgZ");
        pushColumns("最大水位(m)","maxZ");
        pushColumns("最小水位(m)","minZ");
    }else{
        pushColumns("水位(m)","z");
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
    var dataAdapter = new $.jqx.dataAdapter(gridDataSource);
    $("#historyList").jqxGrid({
        width: "99%",
        height:"100%",
        source: dataAdapter,
        rowsheight: 25,
        altrows: true,
        groupsheaderheight: 25,
        columnsheight: 25,
        columns: columns
    });
}

function updateWaterLevel(dataList){
    var HDGC=waterLevelRange[2];//整个水位的变化范围
    var currentDivHeight;//当前高度

    var waterLevel=isRealTime?parseFloat(dataList.maxZ?dataList.maxZ:0):parseFloat(dataList.z?dataList.z:0);

    currentDivHeight=((waterLevel-waterLevelRange[0])/HDGC)*loadDivHeight;
    $("#updateTime").text("上报时间："+dataList.tm);//采集时间
    var text =(isRealTime?"最大水位：":"水位：")+waterLevel.toFixed(2)+"m";
    $("#curWaterLevel").text(text);
    $("#load .box").css({
        "height":currentDivHeight+"em"
    });

    //警戒线
    if(level1){
        var level1Height = ((level1-waterLevelRange[0])/HDGC)*loadDivHeight;
        $(".warn-level1").css({
            "bottom":level1Height+"em",
        });
    }
    if(level2){
        var level2Height = ((level2-waterLevelRange[0])/HDGC)*loadDivHeight;
        $(".warn-level2").css({
            "bottom":level2Height+"em",
        });
    }
    if(level3){
        var level3Height = ((level3-waterLevelRange[0])/HDGC)*loadDivHeight;
        $(".warn-level3").css({
            "bottom":level3Height+"em",
        });
    }
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