var stcd;
var sttp;
var mnit;
var stnm;
var SOURCE;
var staionType;
var myChart;
var echarts;
var titleTop ="实时";
var timeType = "real";
var dateFormat = 'yyyy-MM-dd HH:mm:ss';

$(function () {
    fieldDataArr=[{
        dataType:"ss",
        dataName:"悬浮物",
        dataUnit:"mg/L",
        cellsformat: "f2",
        dataShow:false}, {
        dataType:"codcr",
        dataName:"CODcr",
        dataUnit:"mg/L",
        cellsformat: "f3",
        dataShow:true},{
        dataType:"nh3n",
        dataName:"氨氮",
        dataUnit:"mg/L",
        cellsformat: "f2",
        dataShow:false},{
        dataType:"q2",
        dataName:"水流量",
        dataUnit:"l/s",
        cellsformat: "f2",
        dataShow:false,
        yAxisIndex:1},{
        dataType:"tn",
        dataName:"总氮",
        dataUnit:"mg/L",
        cellsformat: "f3",
        dataShow:false},{
        dataType:"tp",
        dataName:"总磷",
        dataUnit:"mg/L",
        cellsformat: "f3",
        dataShow:false},{
        dataType:"ph",
        dataName:"PH",
        dataUnit:"",
        cellsformat: "f2",
        dataShow:false}];

    initData();
    loadData();
    initEvent();
});

function loadData() {
    $(".zm").text(stnm);
    $(".czlx").text(sttp);
}

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
            //实时
            var maxTime = result.content.maxTime;
            var minTime = result.content.minTime;
            $("#from_time").val(getPastDate(maxTime,7));
            $("#to_time").val(maxTime);
            $("#from_time").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate:minTime,
                    maxDate: "#F{$dp.$D('to_time')}",
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                });
            });
            $("#to_time").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    minDate: "#F{$dp.$D('from_time')}",
                    maxDate:maxTime,
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                });
            });

            //日均
            var maxDate = result.content.maxDate;
            var minDate = result.content.minDate;
            $("#from_date").val(getPastDate(maxDate,7,"yyyy-MM-dd"));
            $("#to_date").val(maxDate);

            $("#from_date").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd',
                    minDate:minDate,
                    maxDate: "#F{$dp.$D('to_date')}"
                });
            });
            $("#to_date").click(function () {
                WdatePicker({
                    onpicked: function (dp) {
                        clickSearchBtn(true);
                    },
                    dateFmt: 'yyyy-MM-dd',
                    minDate: "#F{$dp.$D('from_date')}",
                    maxDate:maxDate
                });
            });
            //获取历史数据
            getHisData();
        }
    });
}

function initEvent(){

    $("input[name='time_type']").change(function(){
        timeType=$(this).val();
        if(timeType == "day"){
            titleTop ="日均";
            $("#dateGroup").show();
            $("#timeGroup").hide();
        }else{
            titleTop ="实时";
            $("#timeGroup").show();
            $("#dateGroup").hide();
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
    // if(showLoading){
    //     common.showLoading($("#"+that.data.contentId));
    // };
    getHisData();
}

function getHisData() {

    var fromDate = $('#from_time').val();
    var toDate = $('#to_time').val();

    var url="/psxj/subject/queryAllItemHis";
    if(timeType=='day'){
        url="/psxj/subject/queryAllItemHisDay";
        fromDate = $('#from_date').val();
        toDate = $('#to_date').val();
    }
    $.ajax({
        url:url,
        type: "post",
        data:{stcd: stcd,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            if(result.content) {
                loadHisChart(result);
                loadHistoryList(result);
                loadRealData(result.content[0]);//最新一条数据在水质详情中显示
            }
        }
    })
}

function loadHisChart(result) {
    var data = result.content;
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }
    var date = [],
        legendData=[],
        legendSelectedData="{",
        seriesArr=[],
        ssData=[],//悬浮物
        codcrData=[],//化学需氧量COD
        q2Data=[],//水流量
        nh3nData=[],//氨氮
        phData=[],//PH
        tnData=[],//总氮
        tpData=[]//总磷
    ;
    if (data) {
        for (var i = 0; i < data.length; i++) {
            var dataList = data[i];
            if(dataList.ss){
                ssData.push(dataList.ss);//悬浮物
            }
            if(dataList.codcr){
                codcrData.push(dataList.codcr);//化学需氧量
            }
            if(dataList.q2){
                q2Data.push(dataList.q2);//水流量
            }
            if(dataList.tp){
                tpData.push(dataList.tp);//总磷
            }
            if(dataList.tn){
                tnData.push(dataList.tn);//总氮
            }
            if(dataList.ph){
                phData.push(dataList.ph);//PH
            }
            if(dataList.nh3n){
                nh3nData.push(dataList.nh3n);
            }
            date.push(dataList.spt.replace(' ', '\n'));//时间
        }
    }

    for (var i = 0; i < fieldDataArr.length; i++){
        var field=fieldDataArr[i];
        var title= field.dataName;
        if(field.dataUnit){
            title+='('+field.dataUnit+')';
        }
        var seriesItem ={
            showSymbol:false,symbol: 'emptyCircle',
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    { type: 'average', name: '平均值' }
                ],
                label:{position:'middle'}
            },
            name: title,
            type: 'line',
            data: eval(field.dataType+"Data")
        };
        if(field.yAxisIndex){
            seriesItem.yAxisIndex=field.yAxisIndex;
        }
        legendData.push(title);
        legendSelectedData+= '"'+title+'":'+ field.dataShow+',';
        seriesArr.push(seriesItem);
    }
    legendSelectedData=legendSelectedData.substring(0,legendSelectedData.length-1) +"}";
    var option = {
        showAllSymbol: true,
        title: {
            text: '水质水量'+titleTop+'过程线',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        color: ['#ff7f50', '#87cefa', '#da70d6','#32cd32', '#6495ed','#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500','#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700','#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'],
        calculable: true,
        grid: {
            x: 50,y: 50,width:400
        },
        legend: {
            orient:'vertical',
            right:5,
            itemGap:20,
            top:60,
            itemWidth:10,
            itemHeight:15,
            selected:JSON.parse(legendSelectedData),
            data: legendData
        },
        xAxis: [
            {
                type: 'category',
                position: 'bottom',
                boundaryGap: false,
                data: date
            }
        ],
        yAxis: [
            {
                // precision: 4,
                splitNumber: 4,
                type: 'value',
                axisLabel: { formatter: '{value}'},
                name: '监测值'//(' + unit + ')
            },{
                show:false,
                name:'水流量',
                splitNumber: 4,
                type: 'value',
                axisLabel: { formatter: '{value}'},
            }
        ],
        dataZoom: [{
            type: 'inside',
            start: 10,
            end: 100,
        }, {
            show: true,
            showDetail:false,
            start: 10,
            end: 100
        }],
        series: seriesArr
    };

    myChart.setOption(option);
    myChart.on("legendselectchanged",function(params){
        var _option=this._api.getOption();
        var target = params.name;  // 获取当前被点击的标签
        if(target=='水流量(l/s)'){
            if(params.selected[target]){
                _option.yAxis[1].name=target;
                _option.yAxis[1].show=true;
            }else{
                _option.yAxis[1].name='';
                _option.yAxis[1].show=false;
            }
        }
        myChart.setOption(_option);
    });
}

function loadHistoryList(result) {
    var columns = [{
            id: "spt",
            text: "检测时间",
            datafield: "spt",
            align: "center",
            cellsalign: "center",
            width:"25%"
        }],
        datadatafields = [{
            name: "spt",
            type: 'string'
        }],
        columnGroups=[];
    for (var i = 0; i < fieldDataArr.length; i++){
        var field=fieldDataArr[i];
        var columnItem ={
            id: field.dataType,
            datafield: field.dataType,
            align: "center",
            cellsalign: "center",
            cellsformat:field.cellsformat,
            width:"11%"
        };
        if(field.dataUnit!=""){//如果有单位,列名是单位，属于 类别组
            columnItem.columngroup=field.dataName;
            columnItem.text=field.dataUnit;
            var columnGroupItem={
                text: field.dataName,
                name: field.dataName,
                align: 'center'
            };
            columnGroups.push(columnGroupItem);
        }else{
            columnItem.text=field.dataName;
        }
        columns.push(columnItem);
        datadatafields.push({
            name: field.dataType,
            type: 'string'
        });
    }

    var gridDataSource = {
        localdata: result.content,
        datadatafields: datadatafields,
        datatype: "array"
    };
    var dataAdapter = new $.jqx.dataAdapter(gridDataSource);
    $("#historyList").jqxGrid({
        width: "100%",
        height:"100%",
        source: dataAdapter,
        rowsheight: 25,
        altrows: true,
        groupsheaderheight: 25,
        columnsheight: 25,
        selectionmode: 'singlecell',
        columns: columns,
        columngroups:columnGroups
    });
}

function loadRealData(dataList) {
    $(".zh").text(dataList.stcd);
    $(".hjwd").text((dataList.envt==null?'':dataList.envt.toFixed(1)));
    $(".wd").text(dataList.humid==null?'':dataList.humid.toFixed(1));
    $(".sll").text(dataList.q2==null?'':dataList.q2.toFixed(2));
    $(".hxxyl").text(dataList.codcr==null?'':dataList.codcr.toFixed(2));
    $(".zd").text(dataList.tn==null?'':dataList.tn.toFixed(3));
    $(".zl").text(dataList.tp==null?'':dataList.tp.toFixed(3));
    $(".ad").text(dataList.nh3n==null?'':dataList.nh3n.toFixed(3));
    $(".rjy").text(dataList.dox==null?'':dataList.dox.toFixed(3));
    $(".cjsj").text(dataList.spt==null?'':dataList.spt);
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