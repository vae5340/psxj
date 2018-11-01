var stcd;
var sttp;
var mnit;
var staionType;
var isRealTime = false;
var maxValue ;
var myChart;
var echarts;
var gdsd; //预警压力
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

            getData();//历史数据

            $("#drainageWinQFromDate").val(getPastDate(maxDate,1));
            $("#drainageWinQToDate").val(maxDate);
            $("#drainageWinQFromDate").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate: minDate,
                    maxDate: "#F{$dp.$D('drainageWinQToDate')}"
                });
            });
            $("#drainageWinQToDate").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate: "#F{$dp.$D('drainageWinQFromDate')}",
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
            if(result.content) {
                gdsd=result.content.wnpre;//预警压力
            }
            getHisData();
        }
    });
}

function getHisData() {

    var fromDate = $('#drainageWinQFromDate').val();
    var toDate = $('#drainageWinQToDate').val();

    var timetype = $(".subnav li.active").html();
    isRealTime = (timetype.indexOf("当日")==-1&&timetype.indexOf("自定义")==-1);//是否调取瞬时数据表
    $.ajax({
        url:"/psxj/subject/getDrainageDataByTime",
        type: "post",
        data:{stcd: stcd,timetype:timetype,time:toDate,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            loadHisChart(result,isRealTime);
            loadHistoryWaterList(result,isRealTime);
            // hideLoading();
        }
    })
}

//初始化管网流速折线图
function loadHisChart(data,isRealTime) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }

    //标题颜色配置的对象
    var objConfig ={
        "normal":{title:"流量",filed:"z",color:"#90FCFC"},
        "avg":{title:"平均流量",filed:"avg",color:"#6bc6fb"},
        "max":{title:"最大流量",filed:"max",color:"#fab51b"},
        "min":{title:"最小流量",filed:"min",color:"#1ab382"},
        "level1":{title:"警戒流量1",filed:"gdsd",color:"red"},
        "level2":{title:"警戒流量2",filed:"yjsd",color:"orange"},
        "level3":{title:"警戒流量3",filed:"jjsw",color:"yellow"}
    };

    var date = [];
    var dataArr = [];
    var avgArr = [];
    var minArr = [];
    var maxArr = [];
    var warnArr =[];
    
    seriesArr=[];
    legendArr=[];

    if (data) {
        for (var i = data.content.length-1; i >=0; i--) {
            date.push(data.content[i].tm.indexOf(" ")>-1?data.content[i].tm.replace(' ', '\n'):data.content[i].tm);
            warnArr.push(0.03);
            if(isRealTime) {
                maxArr.push(data.content[i].maxQ);
                minArr.push(data.content[i].minQ);
                avgArr.push(data.content[i].avgQ);
            }else {
                dataArr.push(data.content[i].q);
            }
        }
    }

    //非瞬时表
    var dataObj = objConfig.normal;
    if(isRealTime){
        dataObj = objConfig.avg;
        pushChartData(dataObj.title,avgArr,dataObj.color);
        dataObj = objConfig.max;
        pushChartData(dataObj.title,maxArr,dataObj.color);
        dataObj = objConfig.min;
        pushChartData(dataObj.title,minArr,dataObj.color);
    }else{
        pushChartData(dataObj.title,dataArr,dataObj.color);
    }
    pushChartData('警戒值',[0.03],'red',true);

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            x: 'center',
            text: '管道流量过程线',
            show:false
        },
        legend: {
            data: legendArr,
            x: 'left'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            name: '流量(m3/s)'
        },
        dataZoom: [{
            type: 'inside',
            start: 10,
            end: 100,
            filterMode:'empty'
        }, {
            show: true,
            showDetail:false,
            start: 10,
            end: 100,
            filterMode:'empty'
        }],
        splitArea: {
            show: true
        },
        series: seriesArr
    };
    myChart.setOption(option);
}

function pushChartData(_title,_data,_color,_isMarkLine){//echart数据项渲染

    var serieObj ={
        name: _title,
        type: 'line',
        showSymbol:false,
        areaStyle: {normal: {}},
        symbolSize:[0,0],
        smooth:true,
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

function loadHistoryWaterList(result,isRealTime) {

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
        columns.push({
            id: "q",
            text: "平均流量",
            datafield: "avgQ",
            align: "center",
            cellsformat: 'f3',
            type:'float',
            cellsalign: "center"
        });
        columns.push({
            id: "maxQ",
            text: "最大流量",
            datafield: "maxQ",
            align: "center",
            cellsformat: 'f3',
            type:'float',
            cellsalign: "center"
        });
        columns.push({
            id: "minQ",
            text: "最小流量",
            datafield: "minQ",
            align: "center",
            cellsformat: 'f3',
            type:'float',
            cellsalign: "center"
        });
    }else{
        columns.push({
            id: "q",
            text: "流量",
            datafield: "q",
            align: "center",
            cellsformat: 'f3',
            type:'float',
            cellsalign: "center"
        });
    }
    var datadatafields = [];
    for (var i = 0; i < columns.length; i++) {
        datadatafields.push({
            name: columns[i].datafield,
            type: 'string'
        });
    }
    var gridDataSource = {
        localdata: null,
        datadatafields: datadatafields,
        datatype: "array"
    };
    if(result.content){
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