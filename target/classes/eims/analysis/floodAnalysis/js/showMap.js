define(['jquery','layer','highcharts','highchartsCN'],function($,layer,highcharts,highchartsCN){

  var itemId, itemName,combName,dateStr;
  var titleText;
  var xArr = new Array();
  var yArr = new Array();

  function asc(x, y) {
    return x - y;
  }
  //
  function getData(){
    $.ajax({
      url:  "/psfacility/pscomb/getAvgList?itemId=" + itemId+"&startTime="+dateStr,
      type: "POST",
      dataType: "json",
      success: function(data) {
        var avgListStr = "";

        for (var index =0 ;index < data.length;index++) {//var index in data
          avgListStr += data[index].TM + "*" + data[index].VAL + ",";
        }

        if (avgListStr != "") avgListStr = avgListStr.substring(0, avgListStr.length - 1);

        var byArr = [];
        var sortArr = [],xArr=[],yArr=[];

        var avgList = avgListStr.split(",");
        for (var i =0 ;i < avgList.length;i++) {//var i in avgList
          var subArr = avgList[i].split("*");
          var key = parseInt(subArr[0].split(":")[1]);
          sortArr.push(key);
          byArr[key] = ((parseFloat(subArr[1])).toFixed(2)) * 10;
        }


        //sortArr.sort(asc);

        for (var i =0 ;i < sortArr.length;i++) {//var i in sortArr
          xArr.push(sortArr[i] + ":00")
          yArr.push(byArr[sortArr[i]]);
        }

        $('#showMap_container').highcharts({
          credits: {  
            enabled: false  
          },
          chart: {
            zoomType: 'xy'
          },
          title: {
            text: titleText,
            style: {
              fontFamily: "宋体",
              fontSize: "25px"
            }
          },
          xAxis: [{
            categories: xArr
          }],
          yAxis: [{ // Secondary yAxis
            title: {
              text: '',
              style: {
                color: '#4572A7'
              }
            },
            labels: {
              format: '{value} mm',
              style: {
                color: '#4572A7'
              }
            },
            opposite: true
          }],
          tooltip: {
            shared: true
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            floating: false,
            backgroundColor: '#FFFFFF',
            borderWidth: 0
          },
          series: [{
            name: combName,
            color: '#4572A7',
            type: 'spline',
            data: yArr,
            tooltip: {
              valueSuffix: 'mm'
            }
          }]
        });
      },
      error: function(e) {
       layer.msg("初始化数据错误！", {icon: 2,time: 1000});
      }
    });
  }


  function init(_itemId, _itemName,_combName,_dateStr) {
    itemId=_itemId,
    combName=_combName,
    titleText= _combName + _itemName + "统计";
    dateStr=_dateStr;
    getData();
  };
  return{
    init:init
  }


})

