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
var jjsw1;
var jjsw2;
var jjsw3;
var tm;
var z;
var columns;
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
        type:"post",
        data:{stcd:stcd,sttp:sttp,mnit:mnit},
        dataType:'json',
        success: function(result){
            var data = result.content;
            var maxDate = data.maxDate;//common.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
            var minDate = data.minDate;

            getData();//历史数据

            var endDateTime = Date.parse(new Date(maxDate.replace(/-/g,'/')));
            var beginDate = new Date(endDateTime-60 * 60 * 1000);//前推一个小时
            var beginDateStr = formatDate(beginDate, 'yyyy-MM-dd hh:mm:ss');
            $("#from_date").val(beginDateStr);
            $("#to_date").val(maxDate);
            $("#from_date").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate: minDate,
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
                jjsw1=data.bdep;//严重积水深度
                jjsw2=data.mdep;//中度积水深度
                jjsw3=data.sdep;//轻度积水深度
            }
            getHisData();
            initShape();//初始化剖面图
        }
    });
}

function initShape() {

    var WATER_LEVEL= z;//data.z;//当前水深

    maxValue = jjsw1?jjsw1+0.05:3;

    loadRuler(maxValue);
    loadWarnLevel(maxValue);
    if(WATER_LEVEL){
        waterHeightChange(WATER_LEVEL,maxValue);
    }
}

// function initShape(result) {
//     var data = result.content;
//
//     var WATER_LEVEL=data.z;//data.z;//当前水深
//     var TIME_KEY=data.tm?data.tm:"无检测值";
//     // SOURCE="智能水网";//数据来源
//
//     maxValue = data.bdep?data.bdep+0.05:3;
//
//     loadRuler(maxValue);
//     loadWarnLevel(result,maxValue);
//     if(WATER_LEVEL){
//         waterHeightChange(WATER_LEVEL,maxValue);
//     }
// }

function loadRuler(max){

    const step = 10;//十个刻度
    const stepPx = 248/100;//一刻度代表5像素
    var stepValue = 0.3/(248/stepPx);//每个刻度代表的数值
    for (var i = 0; i <= 100; i++) {
        var className = (i%step==0)?"cm":"mm";
        if(i%step!=0&&i%5===0){
            className = "mm1";
        }
        var kd = (i%step==0)? parseFloat((i*stepValue).toFixed(10)):"";
        var bottomValue = stepPx*i;
        $(".ruler").append("<div class='"+className+"' style='bottom:"+bottomValue+"px'>"+kd+"</div>");
    }
}

function loadWarnLevel(maxValue) {
    if(jjsw1){
        $(".warn-level.level1").height((jjsw1/maxValue)*248).find(".warn-value").html("严重积水深度:"+jjsw1+"m");
    }
    if(jjsw2){
        $(".warn-level.level2").height((jjsw2/maxValue)*248).find(".warn-value").html("中度积水深度:"+jjsw2+"m");
    }
    if(jjsw3){
        $(".warn-level.level3").height((jjsw3/maxValue)*248).find(".warn-value").html("轻度积水深度:"+jjsw3+"m");
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
            var waterLevel=parseFloat(that.isRealTime?dataList[idx].maxZ:dataList[idx].z);
            waterHeightChange(waterLevel,maxValue);
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
        url:"/psxj/subject/getFloodPointDateByTime",
        type: "post",
        data:{stcd: stcd,timetype:timetype,time:toDate,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            if(result) {
                idx = result.content.length-1;
                dataList= result.content;
                tm = dataList[0].tm;
                z = dataList[0].z;
                $("#playButton").show();
                waterLevelRange = getWaterLevelRange(result);//获得水位区间
                waterHeightChange(isRealTime?dataList[0].maxZ:dataList[0].z,maxValue);
            }else{
                $("#playButton").hide();
                tm = "无检测值";
                z = null;
            }

            loadHisChart(result);
            loadHistoryWaterList(result);
            // hideLoading();
        }
    })
}

function waterHeightChange(value,maxValue){
    //生成水位
    $(".water-container").height((value/maxValue)*248);
    $(".water-value").html(value+"m").css({top:"-1.2em"});
    $("#updateTime").text("上报时间："+dataList[idx].tm);
}

function getWaterLevelRange(result){//获得最大水位值
    var maxValue=-9999999;
    var minValue=9999999;
    var diff=0;
    if(result.content){
        maxValue=result.content[0].z;
        for (var i=1;i<result.content.length;i++){
            var sw=parseFloat(result.content[i].z);
            maxValue=Math.max(maxValue,sw);
            minValue=Math.min(minValue,sw);
        }
    }
    minValue=parseFloat((parseFloat(minValue))<0?minValue*1.5:minValue*0.5).toFixed(2);//Math.floor
    maxValue=parseFloat((parseFloat(maxValue))<0?maxValue*0.5:maxValue*1.5).toFixed(2);//Math.ceil
    diff=maxValue-minValue;
    if(maxValue==0&&diff==0){//如果范围是0，且最大值和最小值都是0
        diff=1;
    }
    return  [minValue,maxValue,diff];
}

function loadHisChart(data) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }
    // var that = this;
    //标题颜色配置的对象
    var objConfig ={
        "normal":{title:"积水深度",filed:"z",color:"#90FCFC"},
        "avg":{title:"平均深度",filed:"avg",color:"#6bc6fb"},
        "max":{title:"最大深度",filed:"max",color:"#063e58"},//#fab51b，#063e58
        "min":{title:"最小深度",filed:"min",color:"#1ab382"},
        "level1":{title:"严重积水深度",filed:"jjsw1",color:"red"},
        "level2":{title:"中度积水深度",filed:"jjsw2",color:"orange"},
        "level3":{title:"轻度积水深度",filed:"jjsw3",color:"yellow"}
    };

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
            avgArr.push(data.content[i].avgZ);
            minArr.push(data.content[i].minZ);
            maxArr.push(data.content[i].maxZ);
            dataArr.push(data.content[i].z);
        }
    }

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
            text: '积水点水深变化图',
            show:false
        },
        legend: {
            itemGap:5,
            itemWidth:15,
            data:legendArr,
            x: 'left'
        },
        visualMap:visualMapObj,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            name: '水深(m)'
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
    //渲染超警戒范围的数组
    piecesArr=[];
    if(jjsw1>0){
        var _data=[jjsw1];
        var _obj=objConfig.level1;
        pushChartData(_obj.title,_data,_obj.color,true);
        piecesArr.push({gte: jjsw1,label: '超出'+_obj.title,color:_obj.color});
        hasMarkLine = true;
    }
    if(jjsw2>0){
        var _data= [jjsw2] ;
        var _obj=objConfig.level2;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(jjsw1){
            piecesArr.push({gte: jjsw2,lt: jjsw1,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte: jjsw2,label:'超出'+_obj.title,color:_obj.color});
        }
        hasMarkLine = true;
    }
    if(jjsw3>0){
        var _data= [jjsw3];
        var _obj = objConfig.level3;
        pushChartData(_obj.title,_data,_obj.color,true);
        if(jjsw2){
            piecesArr.push({gte:jjsw3,lt: jjsw2,label:'超出'+_obj.title,color: _obj.color});
        }else if(jjsw1){
            piecesArr.push({gte:jjsw3,lt: jjsw1,label: '超出'+_obj.title,color: _obj.color});
        }else{
            piecesArr.push({gte:jjsw3,label: '超出'+_obj.title,color:_obj.color});
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
        width:"240px",
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