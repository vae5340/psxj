var stations,outfallBacks,backCountArr,outfallCount;

 $(window).load(function(){
    //生成表格
   $("#resultTable").bootstrapTable({
          data: stations,
          method: 'get',
          detailView: true,//父子表
          pageSize: 10,
          pageList: [10, 25],
          columns: [{
              field: 'combId',
              title: '站点编号',
              align:'center'
          }, {
              field: 'combName',
              title: '站点名称',
              align:'center'
          },{
              field: 'x',
              title: '纬度',
              align:'center'
          },{
              field: 'y',
              title: '经度',
              align:'center'
          },{
              field: 'value',
              title: '液位',
              align:'center',
              formatter:unitFormat
          },{
              title: '',
              align:'center',
              formatter:imgFormat
          }],
          //注册加载子表的事件。注意下这里的三个参数！
          onExpandRow: function (index, row, $detail) {
             initSubTable(index, row, $detail);
          }
   });

   $("#resultTable").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar();				
	});
	
	$("#resultTable").on('click-row.bs.table', function (row,obj) {
        parent.centerAtCoor(obj.x,obj.y);
    });
   
   //生成饼图
   var categories=[],data=[],columnData=[],unColumnData=[];
   //var colors = Highcharts.getOptions().colors;
   var colors = ['#B2DFEE','#DEB887','#CDC1C5','#6B8E23','#B4EEB4','#EEDC82','#FFD39B','#AB82FF','#BDBDBD','#FFEC8B'];
   for(var i in stations){
      var combName=stations[i].combName;
      categories.push(combName);     
      data.push({
	        y: (1/stations.length)*100,
	        color: colors[i],
	        drilldown: {
	            name: combName,
	            categories: ['倒灌', '无倒灌'],
	            data: [(backCountArr[i][0]/(backCountArr[i][0]+backCountArr[i][1]))*100,(backCountArr[i][1]/(backCountArr[i][0]+backCountArr[i][1]))*100], 
	            color: ['red','#90EE90']
	        }
      });
      columnData.push(backCountArr[i][0]);
      unColumnData.push(backCountArr[i][1]);
   }
   generateMap(categories,data,columnData,unColumnData);
});

 var initSubTable = function (index, row, $detail) {
      var parentid = row.combId;
      var subData=outfallBacks.filter(function (value) {
      if(value.combId==parentid)
        return value;
   });
      var cur_table = $detail.html('<table></table>').find('table');
      $(cur_table).bootstrapTable({
          height:150,
          data: subData,
          method: 'get',
          //queryParams: {"combId": parentid },
          //ajaxOptions: {"combId": parentid },
          clickToSelect: true,
          uniqueId: "id",
          pageSize: 10,
          pageList: [10, 25],
          columns: [{
              field: 'id',
              title: '排放口ID',
              align:'center'
          }, {
              field: 'name',
              title: '排放口名称',
              align:'center'
          }, {
              field: 'x',
              title: '纬度',
              align:'center'
          }, {
              field: 'y',
              title: '经度',
              align:'center'
          }, {
              field: 'value',
              title: '高度',
              align:'center',
              formatter:unitFormat
          },{
              title: '',
              align:'center',
              formatter:imgFormat
          }]
      });
      
      $(cur_table).on('click-row.bs.table', function (row,obj) {
	       parent.centerAtCoor(obj.x,obj.y);
	   });
 };
 
 function unitFormat(value, row, index){
     return row.value+"米";
 };
 
 function imgFormat(value, row, index){
    if(row.id)
       return "<img src='/awater/nnwaterSystem/PipeNetwork/img/end-marker.png' height=20, width=14></img>";
    else
       return "<img src='/awater/nnwaterSystem/PipeNetwork/img/target-marker.png' height=20, width=14></img>";
 };
    	  
 function generateMap(categories,data,columnData,unColumnData){
        //$(".highcharts-container").css("width","100%").css("height","100%");
        var riverData = [],
        backData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;
	    // Build the data arrays
	    for (i = 0; i < dataLen; i += 1) {
	        riverData.push({
	            name: categories[i],
	            y: data[i].y,
	            color: data[i].color
	        });

	        drillDataLen = data[i].drilldown.data.length;
	        for (j = 0; j < drillDataLen; j += 1) {
	            brightness = 0.2 - (j / drillDataLen) / 5;
	            backData.push({
	                name: data[i].drilldown.categories[j],
	                y: data[i].drilldown.data[j],
	                color:data[i].drilldown.color[j]
	            });
	        }
	    }
		    
	    // Create the chart
	    /*$('#containerPie').highcharts({
	        chart: {
	            type: 'pie'
	        },
	        title: {
	            text: '倒灌分析饼状图'
	        },
	        yAxis: {
	            title: {
	                text: ''
	            }
	        },
	        plotOptions: {
	            pie: {
	                shadow: false,
	                center: ['50%', '50%']
	            }
	        },
	        tooltip: {
	           formatter: function () {
		              if(this.series.index==0)
		                  return false;
		               else{
		                  if(this.point.name="倒灌")
		                     return  this.point.name + '排放口: ' + this.y + '%' 
		                  else
		                     return  this.point.name + '排放口: ' + this.y + '%' 
		               }      
			   }
	        },
	        series: [{
	            name: '内河站点',
	            data: riverData,
	            size: '80%',
	            dataLabels: {
	                formatter: function () {
	                    return this.y > 5 ? this.point.name : null;
	                },
	                color: 'black',
	                distance: -50
	            }
	        }, {
	            name: '排放口',
	            data: backData,
	            size: '100%',
	            innerSize: '60%',
	            dataLabels: {
	                formatter: function () {
	                    // display only if larger than 1
	                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%'  : null;
	                }
	            }
	        }]
	 });*/
	 $('#containerPie').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '全市排放口倒灌比例饼图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '所占比例',
            data: [
                {name:'倒灌排放口', y:(outfallBacks.length/outfallCount)*100,sliced:true,selected:true,color:"red"},
                {name:'无倒灌排放口', y:((outfallCount-outfallBacks.length)/outfallCount)*100,color:"#90EE90"}
            ]            
            //color:['red','#90EE90']
        }]
     });
	      
	 $('#container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: '倒灌分析柱状图'
	        },
	        xAxis: {
	            categories: categories,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '数量（个）'
	            }
	        },
	        legend:{
	           enabled:false
	        },
	        plotOptions: {
		            column: {
		                pointPadding: 0.2,
		                grouping: true,
		                shadow: false,
		                borderWidth: 0,
		                dataLabels: {
		                    enabled: true,
		                    formatter: function () {
				              if(this.series.index==0)
				                  return '倒灌排放口'+this.y + '个';
				               else
				                  return '无倒灌排放口'+this.y + '个';       
				            }
		                }
		            }
		        },
	        series: [{
	            name: '倒灌排放口',
	            data:columnData,
	            tooltip: {
		                valueSuffix: '个'
		        },
	            color:'red'
	        }, {
	            name: '无倒灌排放口',
	            data: unColumnData,
	            tooltip: {
		                valueSuffix: '个'
		        },
	            color:'#90EE90'
	        }]
	    });
  }	  
