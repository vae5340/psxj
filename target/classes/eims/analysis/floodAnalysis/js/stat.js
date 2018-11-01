define(['jquery','layer','highcharts','highchartsCN'],function($,layer,highcharts,highchartsCN){
  var itemId, itemName,combName;
  //数据是假的
  function getData(){
    $('#container').highcharts({
          credits: {  
            enabled: false  
          },
          chart: {
              zoomType: 'xy'
          },
          title: {
              text: '青秀区A号气象站降雨量-南湖隧道积水点统计',
              style:{
                fontFamily: "宋体",
                  fontSize: "25px"
              }
          },
          xAxis: [{
              categories: ['10:20', '10:40', '11:00', '11:20', '11:40', '12:00','12:20', '12:40', '13:00', '13:20', '13:40', '14:00']
          }],
          yAxis: [{ // Primary yAxis
              labels: {
                  format: '{value}mm',
                  style: {
                      color: '#65B2D6'
                  }
              },
              title: {
                  text: '降雨量',
                  style: {
                      color: '#65B2D6'
                  }
              },
              reversed:true
          }, { // Secondary yAxis
              title: {
                  text: '积水深度',
                  style: {
                      color: '#4572A7'
                  }
              },
              labels: {
                  format: '{value} cm',
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
          series: [ {
              name: '青秀区A号气象站',
              color: '#65B2D6',
              type: 'area',
              data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
              tooltip: {
                  valueSuffix: 'mm'
              }
          },{
              name: '南湖隧道积水点',
              color: '#4572A7',
              type: 'spline',
              yAxis: 1,
              data: [4.9, 5.5, 16.4, 24.2, 28.0, 31.0, 34.6, 38.8, 44.4, 46.1, 32.6, 27.4],
              tooltip: {
                  valueSuffix: 'cm'
              }
          }]
      });
 }
 function (_itemId, _itemName,_combName){
  itemId=_itemId,
  combName=_combName,
  titleText= _combName + _itemName + "统计";
  getData();
 }


  return{
    init:init
  }

})   