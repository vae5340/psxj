var realRecInterval = [];
var ctx = "";
$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $("input[name='id']").each(function () {
        var id = $(this).val();
        if (id != null && id != "") {
            //开始组装图标对象
            var itemtype = $("#itemtype" + id).val();

            if (itemtype == 1) {
                //	    			生成液位图表--开始
                getRealRec(id);
                //	    			生成液位图表--结束
            }
            if (itemtype == 3) {
                //	    			生成雨量图表--开始
                getRealRec(id);
                //	    			生成雨量图表--结束
            }

        }

    })

});

function getRealRec(itemId) {
    var itemTypeId = $("#itemtype" + itemId).val();
    //	生成液位图表--开始
    //	清楚旧定时器，以免highchart控件报错
    if (realRecInterval["interval" + itemId] != null) {
        clearInterval(realRecInterval["interval" + itemId]);
    }
     
    //  $.get(ctx + "/rest/JkMobileService/getMonitorDataByItemId/" + itemId, {}, function (da) {
    var nowvalue;
    var da = '[{"DValue":52,"alarm":0,"alarmid":0,"dValueArr":"","diff":0,"endDate":null,"id":9,"itemId":"00000000008","itemUid":109,"startDate":null,"timeArr":"","timeKey":{"date":27,"day":0,"hours":22,"minutes":47,"month":2,"nanos":0,"seconds":53,"time":1459090073000,"timezoneOffset":-480,"year":116}}]';
    var nowcolor;
    if (da != null && da != "") {
        da = eval(da);
        if (typeof (da) != null && da.length > 0) {
            nowvalue = da[0].DValue;
        }
    }

    $('#container' + itemId).highcharts({
    credits:{enabled:false},
        chart: {
            type: 'areaspline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                  [0, 'rgb(255, 255, 255)'],
                  [1, 'rgb(200, 200, 255)']
              ]
            },
            events: {
                load: function () {
                    // set up the updating of the chart each second
                    var series = this.series[0];

                    var recInterval = setInterval(function () {
                        series.addPoint([(new Date()).getTime(),getNowValue()], true, true);
                    }, $("#rate" + itemId).val() * 1000);
                    realRecInterval["interval" + itemId] = recInterval;
                }
            }
        },
        title: {
            text: $("#itemname" + itemId).val()
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: $("#unit" + itemId).val()
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#FF0099'
            }],
            min: $("#lowerLimit" + itemId).val(),
            tickInterval: 10,
            max: $("#upperLimit" + itemId).val()
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: '实时值',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: getNowValue(),
                        color: nowcolor
                    });
                }
                return data;
            } ())
        }]
    });

    //    });


    //	生成液位图表--结束

}

//function hisRecSearch(itemId) {
//    var startDate = $("#startDate" + itemId).val();
//    var endDate = $("#endDate" + itemId).val();
//    var itemTypeId = $("#itemtype" + itemId).val();
//    var item = $("#itemid" + itemId).val();
//    if (startDate == "") {
//        alert("请选择开始日期!");
//        return;
//    }
//    if (endDate == "") {
//        alert("请选择结束日期!");
//        return;
//    }
//    $.get(ctx + "/jk-item-table!getHisData.action", { item: item, itemTypeId: itemTypeId, startDate: startDate, endDate: endDate }, function (data) {
//        if (data != null && data != "") {
//            data = eval(data);
//            if (data.length > 0) {
//                //    			生成历史数据图表--开始
//                //        		清楚旧定时器，以免highchart控件报错
//                if (realRecInterval["interval" + itemId] != null) {
//                    clearInterval(realRecInterval["interval" + itemId]);
//                }


//                var unit = data[0].itemId;
//                var dValueArr = [];
//                var timeArr = [];
//                for (var i = 0; i < data.length; i++) {
//                    timeArr.push(data[i].timeArr);
//                    dValueArr.push(parseFloat(data[i].dValueArr));
//                }
//                $('#container' + itemId).highcharts({
//                    chart: {
//                        type: 'areaspline'
//                    },
//                    title: {
//                        text: startDate + "至" + endDate + '历史监测数据',
//                        x: -20 //center
//                    },
//                    xAxis: {
//                        categories: timeArr
//                    },
//                    yAxis: {
//                        title: {
//                            text: unit
//                        },
//                        plotLines: [{
//                            value: 0,
//                            width: 1,
//                            color: '#808080'
//                        }, {
//                            label: {
//                                text: '管顶高度',
//                                style: {
//                                    color: 'red',
//                                    fontWeight: 'bold'
//                                }
//                            },
//                            value: $("#warnLimit" + itemId).val(),
//                            width: 2,
//                            color: 'red'
//                        }, {
//                            label: {
//                                text: '井盖深度',
//                                style: {
//                                    color: 'red',
//                                    fontWeight: 'bold'
//                                }
//                            },
//                            value: $("#warnLimit2" + itemId).val(),
//                            width: 2,
//                            color: 'red'
//                        }],
//                        min: $("#lowerLimit" + itemId).val(),
//                        tickInterval: 10,
//                        max: $("#upperLimit" + itemId).val()
//                    },
//                    tooltip: {
//                        valueSuffix: unit
//                    },
//                    legend: {
//                        layout: 'vertical',
//                        align: 'right',
//                        verticalAlign: 'middle',
//                        borderWidth: 0
//                    },
//                    series: [{
//                        name: $("#itemname" + itemId).val(),
//                        data: dValueArr
//                    }]
//                });

//                //    			生成历史数据图表--结束
//            } else {
//                if (realRecInterval["interval" + itemId] != null) {
//                    clearInterval(realRecInterval["interval" + itemId]);
//                }
//                $('#container' + itemId).html("该时间段无历史数据!");
//                $('#container' + itemId).attr("style", "text-align:center;vertical-align:middle;width:100%;height:235px;border:1px solid #C0C0C0;")
//            }

//        } else {

//        }
//    });


//}