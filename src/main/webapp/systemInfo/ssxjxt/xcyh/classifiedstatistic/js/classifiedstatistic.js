var serverName = GetQueryString("serverName");
var myChart;
var columns;
var className;
var restablename;
var Index = {
    init: function () {
        var that = this;
        that.reset();
        that.bindUI();
        that.renderUI();
    },
    reset: function () {
       var cellclass = getHandClass(className);
        columns = [
            {id: "UploadUsernameStr",
                text: "有害生物种类",
                datafield: "harmfulKind",
                align: "center",
                cellsalign: "center",
                cellclassname: cellclass
            },
            {id: "ProblemTypeStr",
                text: "上报案件数",
                datafield: "harmfulKindCount",
                align: "center",
                cellsalign: "center"
            },
            {id: "ReportEffectiveNumStr",
                text: "被害株数",
                datafield: "endangerNum",
                align: "center",
                cellsalign: "center"
            }
        ];
    },
    renderUI: function () {
        //时间选择器
        var date = new Date();
        var lastYear = date.getFullYear()-1 + "-" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : (date.getDate()));
        var now = date.getFullYear() + "-" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : (date.getDate()));
        $("#dateFrom").val(lastYear);
        $("#dateTo").val(now);
        className="stat-cursor";
        loadBacsicData();
    },
    bindUI: function () {
        $("#dateFrom").click(function () {
            WdatePicker({readOnly: true, maxDate: "#F{$dp.$D('dateTo')}"});
        });
        $("#dateTo").click(function () {
            WdatePicker({readOnly: true, minDate: "#F{$dp.$D('dateFrom')}"});
        });
        $(".stat-search").click(function () {
            className="stat-cursor";
            loadBacsicData();
        });
        $("#export-search").click(function () {
            $(".stat-table").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true);
        });
        $("#harmfulKind").click(function () {
            className="stat-cursor";
            loadBacsicData();
        });
        $(".stat-table").on("cellclick", function (event) {
            var args = event.args;
            var columnIndex = args.columnindex;
            if (columnIndex > 0) {
                return;
            } else if (columnIndex == 0) {
                var args = event.args;
                restablename =  args.value;
                var temp= $("#lower").is(":visible");
                $("#harmfulName").show();
                $("#lower").show();
                if(temp == true){
                    return;
                }else{
                    className="";
                    $("#harmfulName").text(restablename);
                    getReSearch();
                }
            }
            /*if (heatmap) {
                window.parent.removeHeatmap();
            }*/
        });
    }
};

Index.init();

//初始化表格
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
            columns: columns
        });
}
function getReSearch(){
    Index.reset();
    initGrid();
    var beginDate = $("#dateFrom").val();
    var endDate = $("#dateTo").val();
    var that = this;
    $.ajax({
        type: "post",
        data: {
            startTime: beginDate,
            endTime: endDate,
            restablename:restablename
        },
        dataType: "json",
        url: "/" + serverName + "/asi/xcyh/statistics/patrol-report-stat!getReSearch.action",
        async: false,
        success: function (result) {
            var resultList = result.result;
            gridDataSource.localdata = resultList;
            //加载统计结果列表
            $(".stat-table").jqxGrid({
                source: gridDataSource
            });

            //加载柱状统计图
            var seriesData = {};
            var categories = [];
            var endangerNum = [];
            var harmfulKindCount = [];
            for (var i = 0; i < resultList.length; i++) {
                var statisticResult = resultList[i];
                endangerNum.push(statisticResult.endangerNum);
                harmfulKindCount.push(statisticResult.harmfulKindCount);
                categories.push(statisticResult.harmfulKind);
            }
            seriesData.endangerNum = endangerNum;
            seriesData.harmfulKindCount = harmfulKindCount;

            //显示统计图和热力图
            if (resultList.length > 0) {
                $(".stat-chart-tip").hide();
                $(".stat-chart").show();
                that.drawStatBar(categories, seriesData);
                loadHeatMapData();
            } else {
                $(".stat-chart").hide();
                $(".stat-chart-tip").show();
            }
        }
    });
}

//加载表格数据
function loadBacsicData() {
    restablename=null;
    Index.reset();
    initGrid();
    var beginDate = $("#dateFrom").val();
    var endDate = $("#dateTo").val();
    $("#harmfulName").hide();
    $("#lower").hide();
    var that = this;
    $.ajax({
        type: "post",
        data: {
            startTime: beginDate,
            endTime: endDate
        },
        dataType: "json",
        url: "/" + serverName + "/asi/xcyh/statistics/patrol-report-stat!getClassifiedListData.action",
        async: false,
        success: function (result) {
            var resultList = result.result;
            gridDataSource.localdata = resultList;
            //加载统计结果列表
            $(".stat-table").jqxGrid({
                source: gridDataSource
            });

            //加载柱状统计图
            var seriesData = {};
            var categories = [];
            var endangerNum = [];
            var harmfulKindCount = [];
            for (var i = 0; i < resultList.length; i++) {
                var statisticResult = resultList[i];
                endangerNum.push(statisticResult.endangerNum);
                harmfulKindCount.push(statisticResult.harmfulKindCount);
                categories.push(statisticResult.harmfulKind);
            }
            seriesData.endangerNum = endangerNum;
            seriesData.harmfulKindCount = harmfulKindCount;

            //显示统计图和热力图
            if (resultList.length > 0) {
                $(".stat-chart-tip").hide();
                $(".stat-chart").show();
                that.drawStatBar(categories, seriesData);
                loadHeatMapData();
            } else {
                $(".stat-chart").hide();
                $(".stat-chart-tip").show();
            }
        }
    });
}

//画柱状图
function drawStatBar(categories, seriesData) {
    // 基于准备好的dom，初始化echarts图表
    if (myChart) {
        myChart.clear();
    }
    myChart = echarts.init($(".stat-chart")[0]);
    option = {
        color: ['#ffd700', '#c23531'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
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
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    interval: 0
                },
                data: categories
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '统计结果（条）'
            }
        ],
        series: [
            {
                name: '上报案件数（件）',
                type: 'bar',
                data: seriesData.harmfulKindCount
            },
            {
                name: '被害株数（株）',
                type: 'bar',
                data: seriesData.endangerNum
            }
        ]
    };
    myChart.setOption(option);
}

//加载热力图
function loadHeatMapData() {
    //清除之前所画的热力图
    window.parent.removeHeatmap();
    var beginDate = $("#dateFrom").val();
    var endDate = $("#dateTo").val();
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/xcyh/statistics/patrol-report-stat!getClassifiedChartStatInfo.action";
    $.ajax({
        type: "post",
        data: {
            startTime: beginDate,
            endTime: endDate,
            restablename:restablename
        },
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {

            var length = result.result.length;
            var heatData = result.result;
            var heatMapData = {
                max: length,
                data: heatData
            };
            window.parent.addheatmap(heatMapData);
        }
    });
}
function getHandClass(className) {
    return className;
};