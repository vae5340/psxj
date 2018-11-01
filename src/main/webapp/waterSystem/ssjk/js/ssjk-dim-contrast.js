var chartTitle="",
chartTitlePlus="",
seriesName="",
seriesNamePlus="",
yAxisText="",
yAxisTextPlus="",
valueSuffix="",
valueSuffixPlus="",
dValueArr=[],//历史查询值
timeArr=[];//历史查询时间轴
timeArrPlus=[];//历史查询时间轴
var unitV=1;//监控数据转为专题图的单位系数。专题图单位为cm，数据为m时，需要设置为100；
var minTickInterval=0;
var hChart;
var hChartPlus;
var isNow=true;
var nowvalue={rows:[{d_value:0}]},//实时数据
realDataLoaded=false,//实时数据加载成功
hisDataLoaded=false,//历史数据加载成功
timeNum=120000,//计时器时间(毫秒)
topHisDatas={rows:[]},//最近的历史数据
topHisDatasDesc={rows:[]};//最近的历史数据,倒序
var $selectedElem;
var $selectedElemPlus;
var rrIndex;			          
			          
$(window).resize(function () {  
	$('#table').bootstrapTable('resetView',{height:($(".panel-body").height()-185)/2});
	$('#tablePlus').bootstrapTable('resetView',{height:($(".panel-body").height()-185)/2});
});

$(function(){
        creatDatetimepicker();
	    $("#table").bootstrapTable({
			toggle:"table",
			height:($(".panel-body").height()-185)/2,
			data:{},
			rowStyle:"rowStyle",
			cache: false, 
			checkboxHeader:false,
			columns: [{visible:true,checkbox:true},
			    {field: 'combName',title: '设施名称',align:'center'},
			    {title: '',align:'center',formatter:format_color,width:30}]
	     });
	     $("#table").on('check.bs.table', function (row,obj,index) {
	         if(recIndex==1){
	            return;
	         //上一个series还在加载中则不执行
	         }if($("#loadImg").is(':visible')&&!recCheck){
	            $("#table").bootstrapTable("uncheckBy",{field:"combName", values:[obj.combName]});
	            return;
	         }   
	         if(!isNow){
	             if($("#startTime").val()==""){
					parent.layer.msg("请选择开始日期!",{icon:7});
					$("#table").bootstrapTable('uncheckAll');
					return;
				 }
			     if($("#endTime").val()==""){
			    	parent.layer.msg("请选择结束日期!",{icon:7});
					$("#table").bootstrapTable('uncheckAll');
					return;
			     }
	         }
	         if(!recCheck)
	             $("#loadImg").show();
			 seriesName=obj.combName;
			 getMonitorStationByCombId(obj.combId,1);
			 if($selectedElem){
				$selectedElem.css("background-color","white");
			    $selectedElem=null;
			 }
	     });
	     
	     $("#table").on('uncheck.bs.table', function (row,obj) {
	         if(!hChart.series)
	            return;
	         for(var i in hChart.series) {
	            if(hChart.series[i].name==obj.combName){
				   hChart.series[i].remove();
				   $("#"+obj.combName).parent().css("background-color","white");
				   break;
				}
			 } 
	     });
	     
	     $("#tablePlus").bootstrapTable({
			toggle:"table",
			height:($(".panel-body").height()-185)/2,
			data:{},
			rowStyle:"rowStyle",
			cache: false, 
			checkboxHeader:false,
			columns: [{visible:true,checkbox:true},
			    {field: 'combName',title: '设施名称',align:'center'},
			    {title: '',align:'center',formatter:format_color,width:30}]
	     });
	     $("#tablePlus").on('check.bs.table', function (row,obj,index) {
	     	 if(recIndex==1){
	            return;
	         }   
	         //上一个series还在加载中则不执行
	         if($("#loadImgPlus").is(':visible')&&!recCheck){
	            $("#tablePlus").bootstrapTable("uncheckBy",{field:"combName", values:[obj.combName]});
	            return;
	         }   
	         if(!isNow){
	             if($("#startTime").val()==""){
					parent.layer.msg("请选择开始日期!",{icon:7});
					$("#tablePlus").bootstrapTable('uncheckAll');
					return;
				 }
			     if($("#endTime").val()==""){
			    	parent.layer.msg("请选择结束日期!",{icon:7});
					$("#tablePlus").bootstrapTable('uncheckAll');
					return;
			     }
	         }
	         if(!recCheck)
	            $("#loadImgPlus").show();
			 seriesNamePlus=obj.combName;
			 getMonitorStationByCombId(obj.combId,2);
			 if($selectedElemPlus){
				$selectedElemPlus.css("background-color","white");
			    $selectedElemPlus=null;
			 }
	     });
	     
	     $("#tablePlus").on('uncheck.bs.table', function (row,obj) {
	         if(!hChartPlus.series)
	            return;
	         for(var i in hChartPlus.series) {
	            if(hChartPlus.series[i].name==obj.combName){
				   hChartPlus.series[i].remove();
				   $("#"+obj.combName).parent().css("background-color","white");
				   break;
				}
			 } 
	     });
})

function creatDatetimepicker(){
	$('.form_date').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 1,
		forceParse: 0,
		format:'yyyy-mm-dd hh:00:00'
    });
}

function getMonitorStationByCombId(combId,index){
	$.ajax({ url: "/agsupport/ps-comb!getMonitorStationByCombId.action", 
		data:{combId:combId},
		cache:false,
		dataType:'json',
		success: function(results){
		    if(results.rows[0].device.length==0){
		       //parent.layer.msg("当前设施无监控设备",{icon:5});
		       if(index==1){
		          $("#loadImg").hide();
		          $("#table").bootstrapTable("uncheckBy",{field:"combName", values:[seriesName]});
		       }else{
		          $("#loadImgPlus").hide();
		          $("#tablePlus").bootstrapTable("uncheckBy",{field:"combName", values:[seriesNamePlus]}); 
		       }
		       return;
		    }
		    var itemID=results.rows[0].device[0].itemDim[0].itemId;
			if(isNow){
			   	getItemDimRealData(itemID);	
	            getItemDimRealDataTop(itemID,10);
	            if(index==1){
	               rrIndex=1;
		           loadChart(1);
		        }else{
		           rrIndex=2;
		           loadChart(2);
		        }   
			}else{
			    var startDate=$("#startTime").val();
			    var endDate=$("#endTime").val();
		     	if(index==1)
		           getItemDimHisData(itemID,startDate,endDate,1);
		        else
		           getItemDimHisData(itemID,startDate,endDate,2);
		    } 	
		},	
		error:function(){
		}
	});	
}

/**
 * 曲线图
 */
function loadHighChart(index){	
    if(isNow){
       timeArr=null;
       timeArrPlus=null;
    }if(index==1)    	  
		hChart=Highcharts.chart('containerHis',{                                                
	        chart: {                                                                
	            type: 'line',                                                     
	            animation: Highcharts.svg, 
	            marginRight: 10,                                                                                                                      
	        },                                                                     
	        title: {                                                                
	            text: chartTitle                                            
	        },                                                                      
	        xAxis: {      
	        	categories: timeArr,
	        	type: 'datetime',      
	        	labels: { 
	        		formatter:function(){
	        		  if(!isNow)
				         return Highcharts.dateFormat('%Y-%m-%d %H:%M',this.value);
				      else
				         return Highcharts.dateFormat('%H:%M',this.value);    
				    }
	        	},
	            minTickInterval:minTickInterval,
	            tickPixelInterval: 100  
	        },                                                                      
	        yAxis: {                                                                
	            title: {                                                            
	                text: yAxisText                                                   
	            },                                                                  
	 			tickInterval: 0.5//自定义刻度                                                             
	        },
	        plotOptions: {
	             series: {
	                 marker: {
	                     radius: 3,  
	                     symbol: 'circle' 
	                 }
	             }
	        },                                                                       
	        tooltip: {       
	        	valueSuffix: valueSuffix,
	            formatter: function() {                                             
	                    return '<b>'+ this.series.name +'</b><br/>'+                
	                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
	                    Highcharts.numberFormat(this.y, 3)+"("+valueSuffix+")";                         
	            } ,
	            zlevel:20     
					                                                            
	        },                                                                      
	        legend: {                                                               
	            enabled: false                                                      
	        },                                                                      
	        exporting: {                                                            
	            enabled: false                                                      
	        },                                                                      
	        series: [{                                                              
	            name: seriesName,      
	            data: dValueArr                                                             
	        }]                                                                      
	    });  
    else
	    hChartPlus=Highcharts.chart('containerHisPlus',{                                                
	        chart: {                                                                
	            type: 'line',                                                     
	            animation: Highcharts.svg, 
	            marginRight: 10,                                                                                                                      
	        },                                                                     
	        title: {                                                                
	            text: chartTitlePlus                                          
	        },                                                                      
	        xAxis: {      
	        	categories: timeArr,
	        	type: 'datetime',      
	        	labels: { 
	        		formatter:function(){
	        		  if(!isNow)
				         return Highcharts.dateFormat('%Y-%m-%d %H:%M',this.value);
				      else
				         return Highcharts.dateFormat('%H:%M',this.value);    
				    }
	        	},
	            minTickInterval:minTickInterval,
	            tickPixelInterval: 100  
	        },                                                                      
	        yAxis: {                                                                
	            title: {                                                            
	                text: yAxisTextPlus                                                  
	            },                                                                  
	 			tickInterval: 0.5//自定义刻度                                                             
	        },
	        plotOptions: {
	             series: {
	                 marker: {
	                     radius: 3,  
	                     symbol: 'circle' 
	                 }
	             }
	        },                                                                       
	        tooltip: {       
	        	valueSuffix: valueSuffixPlus,
	            formatter: function() {                                             
	                    return '<b>'+ this.series.name +'</b><br/>'+                
	                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
	                    Highcharts.numberFormat(this.y, 3)+"("+valueSuffixPlus+")";                         
	            } ,
	            zlevel:20     
					                                                            
	        },                                                                      
	        legend: {                                                               
	            enabled: false                                                      
	        },                                                                      
	        exporting: {                                                            
	            enabled: false                                                      
	        },                                                                      
	        series: [{                                                              
	            name: seriesNamePlus,      
	            data: dValueArr                                                             
	        }]                                                                      
	    });        	          	    
}	

var timePlus,lastLength=0;
/**
 * 获取历史监控
 */
function getItemDimHisData(itemDimId,fromTime,toTime,index){
	timeArr=[];
	timeArrPlus=[];
	timePlus=[];
	dValueArr=[];
	$.ajax({ url: "/agsupport/rest/psitemdim/getItemDimHistoryData/"+itemDimId+"/"+fromTime+"/"+toTime+"?d="+new Date(),  
		data:{},
		dataType:'json',
		success: function(results){
	    	hisjson=results.rows;
	    	if(hisjson.length==0){
	    	   if(recCheck)
                  dealData(index);
               else{
                 if(index==1)
				    $("#loadImg").hide();
			     else
				    $("#loadImgPlus").hide();
               }
	    	   return;
	    	}
	    	var plus="";
            if(index==1&&!hChart){
                 minTickInterval=Math.floor(hisjson.length/4);
                 for(var i=0;i<hisjson.length;i++){
                    timeArr.push(hisjson[i].device_update_time);
              	    dValueArr.push(parseFloat(hisjson[i].d_value*unitV));
	             }
	             //timeArr[timeArr.length-1] = new Date(Date.parse(toTime.replace(/-/g,"/"))).getTime();
	             lastLength=timeArr.length;
				 loadHighChart(index);
			}else if(index==2&&!hChartPlus){
			     minTickInterval=Math.floor(hisjson.length/4);
                 for(var i=0;i<hisjson.length;i++){
                    timeArr.push(hisjson[i].device_update_time);
              	    dValueArr.push(parseFloat(hisjson[i].d_value*unitV));
	             }
	             timeArr[timeArr.length-1] = new Date(Date.parse(toTime.replace(/-/g,"/"))).getTime();
	             lastLength=timeArr.length;
				 loadHighChart(index);
			}else{
			    for(var i=0;i<hisjson.length;i++){
                     timePlus.push(hisjson[i].device_update_time);
	              	 dValueArr.push(parseFloat(hisjson[i].d_value*unitV));
	            }
	            if(index==1){
	               if(timePlus.length>lastLength){
			           lastLength=timePlus.length;
			           timePlus[timePlus.length-1] = new Date(Date.parse(toTime.replace(/-/g,"/"))).getTime();
			           hChart.xAxis[0].setCategories(timePlus);
			       }
			       hChart.addSeries({name:seriesName,data: dValueArr});
			    }else{
			       if(timePlus.length>lastLength){
			           lastLength=timePlus.length;
			           timePlus[timePlus.length-1] = new Date(Date.parse(toTime.replace(/-/g,"/"))).getTime();
			           hChartPlus.xAxis[0].setCategories(timePlus);
			       }
			       hChartPlus.addSeries({name:seriesNamePlus,data: dValueArr});
			    }   
			}
			if(index==1){
		        $("#table #"+seriesName).parent().css("background-color",hChart.series[hChart.series.length-1].color);
		        sortTableRowIndex(seriesName,1);
		    }else{
		       	$("#tablePlus #"+seriesNamePlus).parent().css("background-color",hChartPlus.series[hChartPlus.series.length-1].color);
                sortTableRowIndex(seriesNamePlus,2);
            }
            if(recCheck){
               dealData(index);
            }else{
	             if(index==1)
				    $("#loadImg").hide();
			     else
				    $("#loadImgPlus").hide();		
            }
		},
		error:function(){
			
		}
	});	
}

var recIndex=0,recCheck=false,plusLoaded=false,recFirstTime=false;
function loadChart(index){
	if(realDataLoaded && hisDataLoaded){
		loadRealChart(index);
		hisDataLoaded=false;
		realDataLoaded=false;
		$("#loadImg").hide();
		if(recCheck)
           dealData(index);
	}else{
	    
		setTimeout("loadChart("+rrIndex+")",500);
	}
}

//地图框选实时类型处理
function dealData(index){  
    recIndex=recIndex+1;   
	if(recIndex==dataRows.length){
	   if($("#monitorTypePlus").val()!=0&&!plusLoaded){
	      plusLoaded=true;
	      index=2;
          monitorTypeChange(2);
          $("#loadImg").hide();
          $("#loadImgPlus").show();
          addSelectedStations(drawExtent,$("#monitorTypePlus").val(),2);
          return;
       }else{
          recIndex=0;
          recCheck=false;
	      $("#loadImgPlus").hide();
	      return;
	   }
	}
	loadSeriesByOrder(recIndex,index,dataRows);
}
/**
 * 实时曲线图
 */
function loadRealChart(index){
    dValueArr=[];
    var i=0;
    for(i;i<topHisDatas.rows.length;i++){
	    var topHisData=topHisDatas.rows[i]; 
		dValueArr.push({                                                 
			x: topHisData.device_update_time,                                     
			y: topHisData.d_value*unitV
        }); 
    }
    
    if(index==1){
	    if(!hChart){
		   loadHighChart(1);
		}else{
		   hChart.addSeries({name:seriesName,data: dValueArr});
		}
		$("#table #"+seriesName).parent().css("background-color",hChart.series[hChart.series.length-1].color);
		sortTableRowIndex(seriesName,1);
    }else{
	    //if($("#tablePlus").bootstrapTable('getSelections').length==1){
	    if(!hChartPlus){
		   loadHighChart(2);
		}else{
		   //setTimeout("loadChart("+index+")",500);
		   hChartPlus.addSeries({name:seriesNamePlus,data: dValueArr});
		}
		$("#tablePlus #"+seriesNamePlus).parent().css("background-color",hChartPlus.series[hChartPlus.series.length-1].color);    
        sortTableRowIndex(seriesNamePlus,2);
    }
    if(!recCheck){
        if(index==1)
	       $("#loadImg").hide();
        else
	       $("#loadImgPlus").hide();		
    }
}	


/**
 * 获取单个监控项数值
 * @param itemDimId 监测项ID
 * @param returnOp 操作，请求后操作操作
 */
function getItemDimRealData(itemDimId,returnOp){
	$.ajax({ url: "/agsupport/rest/psitemdim/getItemDimRealData/"+itemDimId+"?d="+new Date(), 
		//data:{},
		dataType:'json',
		success: function(results){
			//if(returnOp==null){
			//	setTimeout("getItemDimRealData('"+itemDimId+"')",timeNum);//放在上面，避免异常导致无法获取数据				
				if(results.length<1){
					return;
				}
				realDataLoaded=true;
				nowvalue=results[0];						
			//}
		},
		error:function(){
			
		}
	});	
}

/**
 * 获取最近的几条历史数据
 * @param itemId 监测项ID
 * @param top 请求的数据
 */
function getItemDimRealDataTop(itemId,top,returnOp){
	$.ajax({ url: "/agsupport/rest/psitemdim/getItemDimHistoryDataTop/"+itemId+"?d="+new Date( ), 
		data:{
			top:top
		},
		dataType:'json',
		success: function(results){
			//if(returnOp==null){
			//	setTimeout("getItemDimRealDataTop('"+itemId+"','10','2')",timeNum);	
				if(results.length<1){
					return;
				}
				hisDataLoaded=true;
				topHisDatas=results;
				topHisDatasDesc=dataDesc(topHisDatas);
			/*}else if(returnOp=="2"){
				setTimeout("getItemDimRealDataTop('"+itemId+"','10','2')",timeNum);
				topHisDatas=results;
				topHisDatasDesc=dataDesc(topHisDatas);
			}*/			
		},
		error:function(){
			
		}
	});	
}

function monitorTypeChange(index){
          var mTypeValue;
          if(index==1){
		     mTypeValue=parseInt($("#monitorType").val());
		     if(hChart&&hChart.series.length>0){
		        for(var i = hChart.series.length -1; i > -1; i--) {
		            hChart.series[i].remove();
		        }
		     }
		     if(mTypeValue==0){
		        $("#table").bootstrapTable("refreshOptions",{data:{}});  
		        return;
		     }
		     $("#loadImg").hide(); 
	      }else{
	         mTypeValue=parseInt($("#monitorTypePlus").val());
	         if(hChartPlus&&hChartPlus.series.length>0){
		        for(var i = hChartPlus.series.length -1; i > -1; i--) {
		            hChartPlus.series[i].remove();
		        }
		     }
		     if(mTypeValue==0){
		        $("#tablePlus").bootstrapTable("refreshOptions",{data:{}});  
		        return;
		     }
		     $("#loadImgPlus").hide();
          }
         
          $.ajax({
			method : 'GET',
		    url: "/agsupport/rest/pscomb/getAllMonitorStationNew?estType="+mTypeValue, 
			async : true,
			dataType : 'json',
			success : function(data) {
			    if(index==1){
			     	//$("#containerHis").html("");
			     	hChart=null;
			     	switch(mTypeValue){
				       case 30:
				          if(!isNow)
				            chartTitle='水文站历史降雨量';
				          else
				            chartTitle='水文站降雨量实时监控';
				          yAxisText='降雨量(mm)';
				          valueSuffix='mm';
				          break;
				       case 31:
				          if(!isNow)
				            chartTitle='自建站历史降雨量';
				          else
				            chartTitle='自建站降雨量实时监控';
				          yAxisText='降雨量(mm)';
				          valueSuffix='mm';
				          break;
				       default:
						  $("#table").bootstrapTable("refreshOptions",{data:{}});  
				    }
				    $("#table").bootstrapTable("refreshOptions",{data:data.rows});  
			    }else{
			        //$("#containerHisPlus").html("");
			        hChartPlus=null;
			        switch(mTypeValue){
				       case 30:
				          if(!isNow)
				            chartTitlePlus='水文站历史降雨量';
				          else
				            chartTitlePlus='水文站降雨量实时监控';
				          yAxisTexPlust='降雨量(mm)';
				          valueSuffixPlus='mm';
				          break;
				       case 31:
				          if(!isNow)
				            chartTitlePlus='自建站历史降雨量';
				          else
				            chartTitlePlus='自建站降雨量实时监控';
				          yAxisTextPlus='降雨量(mm)';
				          valueSuffixPlus='mm';
				          break;
				       case 33:
				          if(!isNow)
				            chartTitlePlus='井下水深历史水位';
				          else
				            chartTitlePlus='井下水深实时监控';
				          yAxisTextPlus='水位(m)';
				          valueSuffixPlus='m';
				          break;
				       case 29:
				          if(!isNow)
				            chartTitlePlus='内河历史水位';
				          else
				            chartTitlePlus='内河水位实时监控';
				          yAxisTextPlus='水位(m)';
				          valueSuffixPlus='m';
				          break;
				       case 37:
				          if(!isNow)
				            chartTitlePlus='泵站历史水位';
				          else
				            chartTitlePlus='泵站水位实时监控';
				          yAxisTextPlus='水位(m)';
				          valueSuffixPlus='m';
				          break;
				       case 35:
				          if(!isNow)
				            chartTitlePlus='管道历史流量';
				          else
				            chartTitlePlus='管道流量实时监控';
				          yAxisTextPlus='流量(单位：m3/s)';
				          valueSuffixPlus='m3/s';
				          break;
				       case 36:
				          if(!isNow)
				            chartTitlePlus='河道历史流量';
				          else
				            chartTitlePlus='河道流量实时监控';
				          yAxisTextPlus='流量(单位：m3/s)';
				          valueSuffixPlus='m3/s';
				          break;    
				       case 34:
				          if(!isNow)
				            chartTitlePlus='河道历史水位';
				          else
				            chartTitlePlus='河道水位实时监控';
				          yAxisTextPlus='水位(m)';
				          valueSuffixPlus='m';
				          break;   
				       default:
						  $("#tablePlus").bootstrapTable("refreshOptions",{data:{}});  
				    }
				    $("#tablePlus").bootstrapTable("refreshOptions",{data:data.rows});  
			    }
			},
			error : function() {
				alert('error');
			}
		});
}

function format_color(value, row, index){
	return "<div id="+row.combName+"></div>";
}
    
function creatDatetimepicker(){
	$('.form_date').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 1,
		forceParse: 0,
		format:'yyyy-mm-dd hh:00:00'
    });
}
    
 function queryParams(params) {
	  return {
		  pageSize:params.limit,
		  pageNo: params.offset/params.limit+1
	  };
 }
 
 function analysisTypeChange(){
       if($("#analysisType").val()=="1"){
          $("#hisQueryDiv").hide();
          isNow=true;
       }else{
          $("#hisQueryDiv").show();
          isNow=false;
       }
       if($("#table").bootstrapTable('getSelections').length>0)
          monitorTypeChange(1);
       if($("#tablePlus").bootstrapTable('getSelections').length>0)
          monitorTypeChange(2);   
 }
 
 function kfilterComb(index){
    if(window.event.keyCode==13){
       filterComb(index);
    }
 }
 
 function filterComb(index){
      var filterValue,plus="";
      if(index==1){
         filterValue=$("#searchComb").val();
         if($selectedElem){
			$selectedElem.css("background-color","white");
		    $selectedElem=null;
		 }
      }else{
         plus="Plus";
         filterValue=$("#searchCombPlus").val();
         if($selectedElemPlus){
			$selectedElemPlus.css("background-color","white");
		    $selectedElemPlus=null;
		 }
      }   
      if($("#table"+plus+" tr").filter(":contains('"+filterValue+"')").length==0)
         return;
      var elem=$("#table"+plus+" tr").filter(":contains('"+filterValue+"')")[0];
      var height,theIndex;
      if(index==1){
          $selectedElem= $(elem);
          height=$selectedElem.height();
          theIndex=$selectedElem.data('index');
          $selectedElem.css("background-color","#FFE1FF");
      }else{
          $selectedElemPlus= $(elem);
          height=$selectedElemPlus.height()
          theIndex=$selectedElemPlus.data('index');
          $selectedElemPlus.css("background-color","#FFE1FF");    
      }
      $("#table"+plus).bootstrapTable('scrollTo',theIndex*height);
 }
 
function clearSelection(index){
   monitorTypeChange(index);
}

var firstTime=true;
var intervalIndex,drawExtent;

function queryContrast2(){
    $("#table").bootstrapTable("check",0);
}

function queryContrast(){
    if($("#monitorTypePlus").val()==0){
        parent.layer.msg("请先选择监控类型",{icon:0});
        return;
    }
    plusLoaded=false;
    if(firstTime){
        parent.layer.msg("请在地图上框选所选类型站点",{icon:0});
        firstTime=false;
    }    
    parent.createNewtab("mapDiv","地图服务");
    parent.getMonitorRectangle();
 }
 
 function getExtentAndAnalysis(extent){
       recCheck=true;
       drawExtent=extent;
       returnContrast();
       if($("#monitorType").val()==0){
           plusLoaded=true;
           monitorTypeChange(2);
           $("#loadImgPlus").show();	
           addSelectedStations(extent,$("#monitorTypePlus").val(),2);
       }else{
           monitorTypeChange(1);
           $("#loadImg").show();
           addSelectedStations(extent,$("#monitorType").val(),1);
       }

 }
 var dataRows,emptyCheck=false;
 function addSelectedStations(extent,estType,index){
 	  $.ajax({
			method : 'GET',
			url : '/agsupport/rest/pscomb/getComIdByExtent',
			data:{xmin:extent.xmin,xmax:extent.xmax,ymin:extent.ymin,ymax:extent.ymax,estType:estType},
			async : false,
			dataType : 'json',
			success : function(data) {	  		
                    if(data.rows.length==0){
                        if(index==1){
                           parent.layer.msg("当前范围无所选雨量站数据",{icon:0});
                           $("#loadImg").hide();
                           plusLoaded=true;
	                       monitorTypeChange(2);
	                       addSelectedStations(drawExtent,$("#monitorTypePlus").val(),2);
                        }else{
                           $("#loadImgPlus").hide();
                           parent.layer.msg("当前范围无所选类型数据",{icon:0});
                        }
                        return;  
                    }   
                    dataRows=[data.rows[0]].concat(data.rows);
                    recIndex=0;
                    loadSeriesByOrder(recIndex,index,dataRows);         
			},
			error : function(error) {
				alert('error');
			}
	});
 }
 
 function loadSeriesByOrder(i,index,dataRows){
        if(index==1){
            seriesName=dataRows[i].comb_name;
            $("#table").bootstrapTable("checkBy",{field:"combName", values:[dataRows[i].comb_name]});
            if(recIndex==1){         
               dealData(index);  
            }   
        }else{
          if(!dataRows[i].comb_name)
             seriesNamePlus=dataRows[i].comb_name;
             $("#tablePlus").bootstrapTable("checkBy",{field:"combName", values:[dataRows[i].comb_name]});
             if(recIndex==1){             
               dealData(index); 
             }  
        }
 }

 function returnContrast(){
	var aTab=parent.$(".page-tabs-content a[data-id*='ssjk-dim-contrast.html']");
	aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='ssjk-dim-contrast.html']");
    aContent.show().siblings(".J_iframe").hide();
}

function sortTableRowIndex(name,index){
    var moveTr=$("#"+name).parent().parent();
    if(index==1)
	   moveTr.insertBefore($("#table tbody tr:first-child"));
	else
	   moveTr.insertBefore($("#tablePlus tbody tr:first-child"));  
}
 
