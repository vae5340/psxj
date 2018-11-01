var serverName = GetQueryString("serverName");
var myChart;
var selectedList;
var gridDataSource = {};//统计表格数据源
var columns;
var beginDate;
var endDate;

var Index = {
    init: function () {
        var that = this;
        that.reset();
        that.bindUI();
        that.renderUI();
    },
    reset: function () {
        columns = [
            {
                id: "researchTimeStr",
                text: "时间周期",
                datafield: "researchTime",
                width: ($(window).width() - 20) / 4 + "px",
                align: "center",
                cellsalign: "center"
            },
            {
                id: "reportTotalNumStr",
                text: "上报案件数",
                datafield: "reportTotalNum",
                width: ($(window).width() - 20) / 4 + "px",
                align: "center",
                cellsalign: "center",
                resizable: false
            },
            {
                id: "rsearchNumStr",
                text: "调查株数",
                datafield: "rsearchNum",
                width: ($(window).width() - 20) / 4 + "px",
                align: "center",
                cellsalign: "center",
                resizable: false
            },
            {
                id: "endangerNumStr",
                text: "虫害被害株数",
                datafield: "endangerNum",
                width: ($(window).width() - 20) / 4 + "px",
                align: "center",
                cellsalign: "center",
                resizable: false
            }
        ];
        var date = new Date();
        var now = date.getFullYear() + "-" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : (date.getDate()));
        var lastyaer = (date.getFullYear()-1) + "-" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : (date.getDate()));
        beginDate = lastyaer;
        endDate = now;
    },
    renderUI: function () {
        $("#dateFrom").val(beginDate);
        $("#dateTo").val(endDate);
        prevGraphic = null;

        initGrid();
        loadBacsicData();
    },

    bindUI: function () {
        var that = this;
        $("#dateFrom").click(function () {
            WdatePicker({readOnly: true, maxDate: "#F{$dp.$D('dateTo')}"});
        });
        $("#dateTo").click(function () {
            WdatePicker({readOnly: true, minDate: "#F{$dp.$D('dateFrom')}"});
        });
        $(".stat-search").click(function () {
            loadBacsicData();
        });
        $("#export-search").click(function () {
            $(".stat-table").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true);
        });
    }
}

Index.init();

function initGrid() {
    var datadatafields = [];
    for (var i = 0; i < columns.length; i++) {
        datadatafields.push({name: columns[i].datafield, type: 'string'});
    }
    gridDataSource = {
        localdata: [],
        datadatafields: datadatafields,
        datatype: "array"
    };
    var columnsDisplay = [];
    columnsDisplay = columns;

    var dataAdapter = new $.jqx.dataAdapter(gridDataSource);
    $(".stat-table").jqxGrid(
        {
            width: ($(window).width() - 20),
            height: "40%",
            source: dataAdapter,
            theme: 'energyblue',
            rowsheight: 25,
            altrows: true,
            groupsheaderheight: 25,
            columnsheight: 25,
            selectionmode: 'singlecell',
            columns: columnsDisplay
        });
}

function loadBacsicData() {
    var dategroup = $("input[name='dategroup']:checked").val();
    beginDate = $("#dateFrom").val();
    endDate = $("#dateTo").val();
    var that = this;
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/xcyh/statistics/patrol-report-stat!getTrendStatisticsAnalyzeInfo.action";
    $.ajax({
        type: "post",
        data: {
            uploadStartTime: beginDate,
            uploadEndTime: endDate,
            dategroup:dategroup
        },
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var length = result.result.length;
            var list = result.result;
            var seriesData = {};
            var categories = [];
            var reportTotalNum = [];
            var endangerNum = [];
            for (var i = 0; i < length; i++) {
                //生成折线图数据
                categories.push(list[i].researchTime);
                reportTotalNum.push(list[i].reportTotalNum);
                endangerNum.push(list[i].endangerNum);
            }
            seriesData.reportTotalNum = reportTotalNum;
            seriesData.endangerNum = endangerNum;
            gridDataSource.localdata = list;
            $(".stat-table").jqxGrid({
                source: gridDataSource
            });
            if (length > 0) {
                $(".stat-chart-tip").hide();
                $(".stat-chart").show();
                that.drawStatBar(categories, seriesData);
            } else {
                $(".stat-chart").hide();
                $(".stat-chart-tip").show();
            }
        }
    });
}

function drawStatBar(categories, seriesData) {
    // 基于准备好的dom，初始化echarts图表
    if (myChart) {
        myChart.clear();
    }
    myChart = echarts.init($(".stat-chart")[0]);
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['上报案件数（件）', '被害株数（株）']
        },
        grid: {
            x: 50,
            y: 30,
            x2: 10,
            y2: 65
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: 45
            },
            data: categories
        },
        yAxis: {
            type: 'value',
            name: '统计结果'
        },
        series: [
            {
                name: '上报案件数（件）',
                type: 'line',
                data: seriesData.reportTotalNum
            },
            {
                name: '被害株数（株）',
                type: 'line',
                data: seriesData.endangerNum
            }
        ]
    };
    myChart.setOption(option);
}
