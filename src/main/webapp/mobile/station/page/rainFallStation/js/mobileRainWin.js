var stcd;
var sttp;
var mnit;
var data;
var SOURCE;
var staionType;
var isRealTime = false;
var maxValue ;
var myChart;
var echarts;

$(function () {
    // 加载数据
    initData();
    //初始化标题
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
        data:{stcd:stcd,sttp:"PP",mnit:mnit},
        dataType:'json',
        success: function(result){
            var data = result.content;
            var maxDate = data.maxDate;//common.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
            var minDate = data.minDate;

            //这里是有雨量的时间
            var toDateStr='2017-11-14 16:00:00';//that.data.tm1||common.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
            var fromStr = getYestday8Clock(toDateStr);
            $("#from_date").val(fromStr);
            $("#to_date").val(toDateStr);

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
                    maxDate:maxDate
                });
            });

            getData();//历史数据
        }
    });
}

function initEvent(){

    $("#titleContent").html(staionType);
}

function clickSearchBtn(showLoading) {
    // var that = this;
    // //如果是自定义搜索
    // if(showLoading){
    //     common.showLoading($("#"+that.data.contentId));
    // };
    getData();
}

function getData() {

    var tm_s = $('#from_date').val();
    var tm_e = $('#to_date').val();

    if(tm_s || tm_e) {
        $.ajax({
            url: "/psxj/subject/queryRainfallOneTime",
            type:"post",
            data:{tm_s:tm_s,tm_e:tm_e,stcd:stcd},
            dataType:'json',
            success: function(result){
                loadChart(result);
                loadHistoryList(result);
            }
        });
    }

}

function loadChart(result) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }
    // var that = this;
    var tempSum=0;
    var tm_s = $('#from_date').val();
    var tm_e = $('#to_date').val();
    var dateArr = getHourAll(tm_s,tm_e);
    var xData = [], yData = [], ySumData=[]; //xData:时间, yData:一小时降雨量
    xData=dateArr;
    yData=new Array(dateArr.length);
    ySumData=new Array(dateArr.length);
    if (result) {
        tempSum=0;
        for (var i = 0; i < dateArr.length; i++) {
            yData[i]=0;
            for (var j = 0; j < result.content.length; j++) {
                if(dateArr[i]==result.content[j].tm){
                    yData[i]=result.content[j].drp;
                    break;
                }
            }
            tempSum+=yData[i];
            yData[i]=parseFloat(yData[i]).toFixed(2);
            ySumData[i]=parseFloat(tempSum).toFixed(2);//tempSum;
        }
    }
    // 点击自定义legend图标
    var option={
        color: ['#5E5EFF','#FF0000'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            orient: 'horizontal', // 'vertical'
            x: 'left', // 'center' | 'left' | {number},
            y: 'top', // 'center' | 'bottom' | {number}
            data: ['降雨量','累计雨量'],
            show: true
        },
        dataZoom : {//实现缩放功能
            type:'slider',
            show : true,
            showDetail:false,
            start : 10,
            end : 100 ,
            filterMode:'empty'//不过滤数据，只改变数轴范围
        },
        title: {
            text: '时段降雨量',
            left: 'center'
        },
        grid: {
            right: 70,
            left: 60
        },
        xAxis: {
            data: xData,
            boundaryGap: false
        },
        yAxis: [
            {
                type: 'value',
                name: '降雨量(mm)',
                nameLocation: 'middle',
                nameGap: '25',
                scale: true,//脱离0值比例，放大聚焦到最终_min，_max区间
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(1);
                    }
                }
            },
            {
                type: 'value',
                name: '累计雨量(mm)',
                nameLocation: 'middle',
                nameGap: '25',
                min: 0,
                scale: true,//脱离0值比例，放大聚焦到最终_min，_max区间
                splitLine : {
                    show: false
                },
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(1);
                    }
                }

            }
        ],
        series: [
            {
                name: '降雨量',
                type: 'bar',
                yAxisIndex:0,
                data: yData
            },{
                name: '累计雨量',
                type: 'line',
                showSymbol:false,
                symbolSize: [0,0],
                lineStyle:{
                    normal:{
                        width:1
                    },
                },
                yAxisIndex:1,
                data: ySumData,
                smooth:true
            }]
    };
    myChart.setOption(option);
    myChart.on("legendselectchanged",function(params){
        var target = params.name;  // 获取当前被点击的标签
        if(target=='降雨量'){
            if(params.selected[target]){
                option.yAxis[0].name='降雨量(mm)';
            }else{
                option.yAxis[0].name='';
            }
        }
        if(target=='累计雨量'){
            if(params.selected[target]){
                option.yAxis[1].name='累计雨量(mm)';
            }else{
                option.yAxis[1].name='';
            }
        }
        myChart.setOption(option);
    });

}

function loadHistoryList(result){
    var data=[];
    var dataList = result.content;
    if (dataList) {
        data=new Array(dataList.length);
        var tempSum=0;
        for (var i = 0; i < dataList.length; i++) {
            tempSum+=dataList[i].drp;
            dataList[i].sumDrp=tempSum;

            data[dataList.length-i-1]=dataList[i];

        }
        sumItem={
            tm:"累计雨量",
            drp:tempSum,
        };
        data.push(sumItem);
    }
    var columns = [
        {
            id: "tm",
            text: "时间",
            datafield: "tm",
            width: "50%",
            align: "center",
            cellsalign: "center"
        },{
            id: "drp",
            text: "雨量(mm)",
            datafield: "drp",
            width: "50%",
            align: "center",
            cellsalign: "center",
            cellsformat: 'f1'
        }
    ];
    var datadatafields = [];
    for (var i = 0; i < columns.length; i++) {
        datadatafields.push({
            name: columns[i].datafield,
            type: 'string'
        });
    }
    var gridDataSource = {
        localdata: data,
        datadatadatafields: datadatafields,
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
        //selectionmode: 'singlecell',
        columns: columns
    });
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
function getYestday8Clock(dateStr){//获得前一天8点
    var tm_s = new Date();
    tm_s.setTime(new Date(dateStr.replace(new RegExp("-","gm"),"/")).getTime()  - 24 * 60 * 60 * 1000);
    //前一天八点
    return tm_s.getFullYear() +
        "-" + ((tm_s.getMonth() + 1)<10 ? "0"+(tm_s.getMonth()+1) : (tm_s.getMonth()+1)) +
        "-" + (tm_s.getDate()<10 ? ("0"+tm_s.getDate()) : tm_s.getDate()) +
        " 08:00:00";
}

//按日查询
function getHourAll(begin,end){
    // var that=this;
    var dateAllArr = [];
    var db =Date.parse(begin.replace(/-/g,'/'));
    var de =Date.parse(end.replace(/-/g,'/'));
    for(var k=db;k<=de;){
        dateAllArr.push(formatDate(new Date(parseInt(k)),'yyyy-MM-dd hh:mm:ss'));
        k=k+60*60*1000;
    }
    return dateAllArr;
}