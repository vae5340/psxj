var stcd;
var sttp;
var mnit;
var SOURCE;
var dataList;
var staionType;
var isRealTime = false;
var maxValue ;
var myChart;
var echarts;
var visualMapObj = null;
var idx;
var upz;
var dwz;
var chanb;
var tm;
var zsSW;
var zxSW;
var qxSW;
var hasData = false;
var hasQx=false;//是否有渠箱
var hasBz=false;//是否有泵站
var QXFALL=13.6;//水箱总高
var YZFALL=14.9;//em堰闸总高
var qxRange=[0,0,10];//渠箱水位区间
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

            $("#from_date").val(getPastDate(maxDate,1));
            $("#to_date").val(maxDate);
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

function playProfile(){
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
                idx=dataList-1;
                return;
            }
            var zsSW=dataList[idx].upz;
            var zxSW=dataList[idx].dwz;
            var qxSW=dataList[idx].chanb;

            $("#updateTime").text("上报时间："+dataList[idx].tm);//采集时间
            if(zsSW){
                $("#zsSW").text(zsSW.toFixed(2)+"m");//闸上水位
                updateHeightCss($("#load .box_l"),YZFALL,zsSW-qxRange[0],qxRange[2]);
            }
            if(zxSW){
                $("#zxSW").text(zxSW.toFixed(2)+"m");//闸下水位
                updateHeightCss($("#load .box_r"),YZFALL,zxSW-qxRange[0],qxRange[2]);
            }

            if(qxSW){
                $("#qxSW").text(qxSW.toFixed(2)+"m");
                updateHeightCss($("#qxload .boxdiv"),QXFALL,qxSW-qxRange[0],qxRange[2]);
            }
            idx--;
        },speed*1000);
    }
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
            // initShape();//初始化剖面图
            getHisData();
        }
    });
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
                idx=dataList-1;
                return;
            }
            var zsSW=dataList[idx].upz;
            var zxSW=dataList[idx].dwz;
            var qxSW=dataList[idx].chanb;

            $("#updateTime").text("上报时间："+dataList[idx].tm);//采集时间
            if(zsSW){
                $("#zsSW").text(zsSW.toFixed(2)+"m");//闸上水位
                updateHeightCss($("#load .box_l"),YZFALL,zsSW-qxRange[0],qxRange[2]);
            }
            if(zxSW){
                $("#zxSW").text(zxSW.toFixed(2)+"m");//闸下水位
                updateHeightCss($("#load .box_r"),YZFALL,zxSW-qxRange[0],qxRange[2]);
            }

            if(qxSW){
                $("#qxSW").text(qxSW.toFixed(2)+"m");
                updateHeightCss($("#qxload .boxdiv"),QXFALL,qxSW-qxRange[0],qxRange[2]);
            }

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
        url:"/psxj/subject/getWasDateByTime",
        type: "post",
        data:{stcd: stcd,timetype:timetype,time:toDate,fromDate: fromDate,toDate: toDate},
        dataType:'json',
        success: function(result){
            if(result) {
                idx=result.content.length-1;
                dataList= result.content;
                $("#playButton").show();
                upz = dataList[0].upz;
                dwz = dataList[0].dwz;
                chanb = dataList[0].chanb;
                tm = dataList[0].tm;

                if(chanb){
                    hasQx=true;//是否有渠箱
                }
                if(upz||dwz){
                    hasBz=true;
                }
                getWaterLevelRange(dataList);//获得水位区间
                hasData=true;
            }else{
                idx=-1;
                $("#playButton").hide();
                tm = "无检测值";
                upz = null;
                dwz = null;
                chanb = null;
                hasQx=false;
            }
            changeWaterLevel(dataList[0]);
            updateShape();

            loadHisChart(result);
            loadHistoryWaterList(result);
            // hideLoading();
        }
    })
}

function waterHeightChange(value,maxValue){
    //生成水位
    $(".water-container").height((value/maxValue)*248);
    $(".water-value").html(value+"m").css({top:"-1.3em"});
    $("#updateTime").text("上报时间："+dataList.content[idx].tm);
}

function getWaterLevelRange(dataList){//获得最大水位值
    // var data = dataList;
    if(!dataList) return;
    //堰闸
    var maxValue=-9999;
    var minValue=9999;
    //渠箱
    var qmaxValue=-9999;
    var qminValue=9999;
    for (var i=0;i<dataList.length;i++){
        if(dataList[i].upz){
            maxValue=Math.max(maxValue,dataList[i].upz);
            minValue=Math.min(minValue,dataList[i].upz);
        }
        if(dataList[i].dwz){
            maxValue=Math.max(maxValue,dataList[i].dwz);
            minValue=Math.min(minValue,dataList[i].dwz);
        }
        if(hasQx){
            qmaxValue=Math.max(qmaxValue,dataList[i].chanb);
            qminValue=Math.min(qminValue,dataList[i].chanb);
        }

    }
    minValue=parseFloat(minValue<0?minValue*1.2:minValue*0.8);
    maxValue=parseFloat(maxValue<0?maxValue*0.8:maxValue*1.2);
    qxRange=[minValue,maxValue,maxValue-minValue];
    if(hasQx){
        qmaxValue=Math.max(qmaxValue,chanb);
        qminValue=Math.min(qminValue,chanb);
        qminValue=parseFloat(qminValue<0?qminValue*1.2:qminValue*0.8);
        qmaxValue=parseFloat(qmaxValue<0?qmaxValue*0.8:qmaxValue*1.2);
        qxRange=[qminValue,qmaxValue,qmaxValue-qminValue];
    }
}

function changeWaterLevel(dataList){
    // var dataList = result.content;
    zsSW=upz!=null?dataList.upz:qxRange[0];
    zxSW=dwz!=null?dataList.dwz:qxRange[0];
    qxSW=chanb!=null?dataList.chanb:qxRange[0];

    $("#updateTime").text("上报时间："+tm);//采集时间
    $("#zsSW").text(zsSW.toFixed(2)+"m");//站上水位
    $("#zxSW").text(zxSW.toFixed(2)+"m");//站下水位
    $("#qxSW").text(qxSW.toFixed(2)+"m");//渠箱水位

    updateHeightCss($("#qxload .boxdiv"),QXFALL,qxSW-qxRange[0],qxRange[2]);
    updateHeightCss($("#load .box_l"),YZFALL,zsSW-qxRange[0],qxRange[2]);
    updateHeightCss($("#load .box_r"),YZFALL,zxSW-qxRange[0],qxRange[2]);
}

function updateShape(){//站上站下渠泵站显示
    zsSW=upz!=null?upz:qxRange[0];//站上水位
    zxSW=dwz!=null?dwz:qxRange[0];//站下水位：
    qxSW=chanb!=null?chanb:qxRange[0];//渠箱水位：
    if(idx==-1){//没有返回值
        var max=Math.max(zsSW,zxSW);
        var min=Math.min(zsSW,zxSW);
        min=parseFloat(min<0?min*1.2:min*0.8);
        max=parseFloat(max<0?max*0.8:max*1.2);
        qxRange= [min,max,max-min];
    }
    var width=39.7;
    var paddingLeft=0;

    if(hasQx){//如果有渠箱
        width=40.5;//30.5;
        $("#quxiang").attr("data-show",true).show();
        paddingLeft=21;
    }
    if(hasBz||!hasData){//如果没有数据，默认显示泵站
        paddingLeft=0;
        $("#profileInfo").attr("data-show",true).show();
        $("#profileInfo").css({'width':width+"em"});
    }

    $(".profileItem[data-show]").eq(0).css({"margin-left":paddingLeft+"em"});
}

function updateHeightCss($elem,totalHeight,sw,range){
    var curDivHeight=(sw/range)*totalHeight;
    // var curTop=totalHeight-curDivHeight;
    $elem.css({
        "height":curDivHeight+"em",
        // "top":curTop+"em"
    });
}

function loadHisChart(result) {
    if(!myChart){
        myChart = echarts.init(document.getElementById('hisChart'));
    }else{
        myChart.clear();
    }
    var upz = [], dwz = [], chanb =[],date = [],legendData=[],seriesData=[],colorData=[];
    if (result.content) {
        for (var i = result.content.length-1; i >=0; i--) {
            var data = result.content[i];
            upz.push(data.upz);
            dwz.push(data.dwz);
            chanb.push(data.chanb);
            date.push(data.tm.replace(' ', '\n'));
        }
    }
    legendData=['闸上水位', '闸下水位'];
    colorData=['#87CEFA', '#fa6af6'];
    seriesData=[
        {
            name: '闸上水位',
            type: 'line',
            smooth: true,
            symbol: 'none',
            showSymbol:false,
            data: upz
        },
        {
            name: '闸下水位',
            type: 'line',
            smooth: true,
            symbol: 'none',
            showSymbol:false,
            data: dwz
        },
    ];
    if(hasQx){
        seriesData.push({
            name: '渠箱水位',
            type: 'line',
            smooth: true,
            symbol: 'none',
            showSymbol:false,
            data: chanb
        });
        legendData.push('渠箱水位');
        colorData.push('#EBB813');
    }
    var option = {
        title: {
            text: '水闸历史水位变化图',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        color:colorData,
        legend: {
            data:legendData,
            top: 30
        },
        calculable: true,
        grid: {
            right: 50,
            left: 50,
            //bottom: 70
        },
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
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: date
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水位(m)',
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(2);
                    }
                }
            }
        ],
        series: seriesData
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
        width:150,
        cellsalign: "center"
    },{
        id: "zssw",
        text: "闸上水位(m)",
        datafield: "upz",
        align: "center",
        cellsalign: "center",
        cellsformat: 'f2',
    },{
        id: "sxsw",
        text: "闸下水位(m)",
        datafield: "dwz",
        align: "center",
        cellsalign: "center",
        cellsformat: 'f2',
    },
    ];
    if(hasQx){
        columns.push({
            id: "qxsw",
            text: "渠箱水位(m)",
            datafield: "chanb",
            align: "center",
            cellsalign: "center",
            cellsformat: 'f2',
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
        localdata: result.content,
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
        selectionmode: 'singlecell',
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