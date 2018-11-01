
$(window).load(function(){
	$("#startTime").datetimepicker({
		language: 'zh-CN',
	  	format: 'yyyy-mm-dd',
	  	autoclose:true,
	  	minView:2,
	  	pickerPosition:'bottom-right'
	});
	$("#endTime").datetimepicker({
		language: 'zh-CN',
	  	format: 'yyyy-mm-dd',
	  	autoclose:true,
	  	minView:2,
	  	pickerPosition:'bottom-right'
	});
	$("#choseDimItem").bootstrapTable({
		toggle:"table",
		rowStyle:"rowStyle",
		cache: false,
		pagination:false,
		striped: true,
		clickToSelect:true,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field: 'comb_name',title: '设施地址',width:"45%",align:'center'},
			{field: 'device_name',title: '设备名称',width:"25%",align:'center'}, 
			{field: 'dim_name',title: '监控项',width:"25%",align:'center'}, 
			{field: 'item_id',title: '监控项编码',visible:false,align:'center'}, 
			{field: 'dim_id',title: '监控项表编码',visible:false,align:'center'}, 
			{field: 'dim_type',title: '监控项类型',visible: false,align:'center'}]
	});
	$("#choseDimItem").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});				
	});
});

function queryDimInfo(){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	if(startTime==""||endTime==""){
		alert("请选择时间");
		return;
	} else if(choseDimItem.length==0){
		alert("请勾选监测项");
		return;
	} else {
		addcloud();
		$.ajax({  
		    url:"/agsupport/ps-item-dim!getAllDimList.action",
		    data: {"itemType" : $("#itemType").val(),"area" :$("#area").val(),"orgDept" :$("#orgDept").val(),"startTime":getTimeLong($("#startTime").val()),"endTime":getTimeLong($("#endTime").val())},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		    	$("#loadingDiv").remove();
	    		$("#bgDiv").remove();
		    	if(data.total>0){
			    	$("#choseDimItem").bootstrapTable('removeAll');
				    $("#choseDimItem").bootstrapTable('load',data);
			    } else {
			    	parent.layer.msg("当前查询无监控项数据");
			    }
			    
		    },
		    error:function(){
		    	$("#loadingDiv").remove();
	    		$("#bgDiv").remove();
		    	parent.layer.msg("数据加载失败");
		    }
		});
	}
}

function queryData(){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var choseDimItem=$('#choseDimItem').bootstrapTable('getSelections');
	if(startTime==""||endTime==""){
		alert("请选择时间");
		return;
	} else if(choseDimItem.length==0){
		alert("请勾选监测项");
		return;
	} else {
		addcloud();
		var checkedIds= new Array();
	   	for (var i=0;i<choseDimItem.length;i++)
	   		checkedIds.push(choseDimItem[i].dim_id);
		$.ajax({
			method : 'GET',
			url : '/agsupport/ps-item-dim!getDimHistory.action',
			traditional: true,
			data:{"checkedIds" : checkedIds,"startTime":getTimeLong($("#startTime").val()),"endTime":getTimeLong($("#endTime").val())},
			async : false,
			dataType : 'json',
			success : function(data) {
				loadEchartData(data);
				$("#loadingDiv").remove();
	    		$("#bgDiv").remove();
			},
			error : function() {
				alert('error');
				$("#loadingDiv").remove();
	    		$("#bgDiv").remove();
			}
		});
	}
}

function loadEchartData(data){
	if(data.length>0){
		var seriesArray=new Array();
		var yAxisArray = new Array();
		for(var i=0;i<data.length;i++){
			var series = {type: 'areaspline'};
			series.name=data[i].DIM_NAME;
	       	if(data[i].ITEM_TYPE=="DP_WL"||data[i].ITEM_TYPE=="JX_WL"||data[i].ITEM_TYPE=="ZQ_WL"){
	       		//水位
	       		pushYAxisArray(yAxisArray,0);
	       		series.yAxis=getYAxisArrayIndex(yAxisArray,"水位");
	       	} else if( data[i].ITEM_TYPE=="YL_WL"){
	       		//降雨量
	       		pushYAxisArray(yAxisArray,1);
	       		series.yAxis=getYAxisArrayIndex(yAxisArray,"降雨量");
	       	} else if(data[i].ITEM_TYPE=="Q"){
	       		//流量
	       		pushYAxisArray(yAxisArray,2);
	       		series.yAxis=getYAxisArrayIndex(yAxisArray,"流量");
	       	} else if(data[i].ITEM_TYPE=="TPT"){
	       		//温度
	       		pushYAxisArray(yAxisArray,3);
	       		series.yAxis=getYAxisArrayIndex(yAxisArray,"温度");
	       	}
	       	series.data=new Array();
	       	for(var j=0;j<data[i].history.length;j++){
	       		var point = new Object();
	       		point.x=new Date(data[i].history[j].TM.replace(/-/g,"/"));
	       		point.y=data[i].history[j].D_VALUE;
	       		series.data.push(point);
			}
	       	seriesArray.push(series);
		}
		Highcharts.setOptions({ global: { useUTC: false  } });
		$('#container').highcharts({
			chart: {
	 			zoomType: 'x',
	           	marginBottom: 150,
	           	marginLeft: 100,
	           	marginRight: 100,
	       	},
	       	title: {
	           	text: '监测数据展示',
	           	style: {
	               	fontWeight: 'bold',
	               	fontSize:'30px',
	               	fontFamily:'宋体'
	           	}
	       	},
	       	plotOptions: {
	       		areaspline: {fillOpacity: 0.20}
	       	},
	       	tooltip: {
	           	formatter: function () {
	           		var d = new Date(this.x);
	           		var s = '<b>' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()  + '</b>';
	               	$.each(this.points, function (index,item) {
	               		var unit ='';
	               		if(this.series.name.indexOf("井下水位")!=-1||this.series.name.indexOf("内河水位")!=-1||this.series.name.indexOf("河道水位")!=-1||this.series.name.indexOf("泵站水位")!=-1)
	               			unit='m';
	               		if(this.series.name.indexOf("流量")!=-1)
	               			unit='m³/s';
	               		if(this.series.name.indexOf("降水量")!=-1||this.series.name.indexOf("降雨量")!=-1)
	               			unit='mm';
	               		if(this.series.name.indexOf("温度")!=-1)
	               			unit='℃';
	                   	s += '<br/>' + this.series.name + ': ' + this.y + unit;
	               	});
	               	return s;
	           	},
	           	shared: true
	       	},
	       	xAxis: {
	           	type: 'datetime',
	           	labels: {
	               	formatter: function () {
	                   	return Highcharts.dateFormat('%Y-%m-%d %H:%M',this.value);
	               	},
	               	style: {
	                	fontSize:'14px',  //字体
	               		fontWight:'blod'
	                },
	                staggerLines: 2
	           }
	       	},
	       	yAxis: yAxisArray,
	       	legend: {
				enabled: true,
	           	align: 'center',
				verticalAlign: 'bottom',
	       	},
			lang: {noData: "Nichts zu anzeigen"},
	       	noData: {
				style: {
					fontWeight: 'bold',
	               	fontSize: '15px',
	               	color: '#303030'
	           	}
	       	},
	       	plotOptions: {
				area: {
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                   	stops: [
	                       	[0, Highcharts.getOptions().colors[0]],
	                       	[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                   	]
	               	},
	               	marker: {radius: 2},
	               	lineWidth: 1,
	               	states: {hover: {lineWidth: 1}}
				},
				series:{
					turboThreshold: 0
				}
			},
			series: seriesArray
		});
	} else {
  		parent.layer.msg("当前监控项无数据");
  	}
}


function addcloud() {
    var bodyWidth = document.documentElement.clientWidth;
    var bodyHeight = Math.max(document.documentElement.clientHeight, document.body.scrollHeight);
    var bgObj = document.createElement("div" );
    bgObj.setAttribute( 'id', 'bgDiv' );
    bgObj.style.position = "absolute";
    bgObj.style.top = "0";
    bgObj.style.background = "#000000";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75" ;
    bgObj.style.opacity = "0.5";
    bgObj.style.left = "0";
    bgObj.style.width = bodyWidth + "px";
    bgObj.style.height = bodyHeight + "px";
    bgObj.style.zIndex = "10000"; //设置它的zindex属性，让这个div在z轴最大，用户点击页面任何东西都不会有反应|
    document.body.appendChild(bgObj); //添加遮罩
    var loadingObj = document.createElement("div");
    loadingObj.setAttribute( 'id', 'loadingDiv' );
    loadingObj.style.position = "absolute";
    loadingObj.style.top = bodyHeight / 2 - 62 + "px";
    loadingObj.style.left = bodyWidth / 2 -62 + "px";
    loadingObj.style.background = "url(/awater/nnwaterSystem/PipeNetwork/img/loading.gif)" ;
    loadingObj.style.width = "124px";
    loadingObj.style.height = "124px";
    loadingObj.style.zIndex = "10000"; 
    document.body.appendChild(loadingObj); //添加loading动画
}
var YaxisArray=[{
   	title: {
       	text: '水位',
       	style: {
           	fontSize:'14px',  //字体
        	fontWight:'blod'
       	}
   	},
  	labels: {
		format: '{value} m',
		style: {
	       	fontSize:'14px',  //字体
	       	fontWight:'blod'
		}
	}
},{
	title: {
     	text: '降雨量',
     	style: {
         	fontSize:'14px',  //字体
     		fontWight:'blod'
     	}
   	},
   	labels: {
   		format: '{value} mm',
       	style: {
         	fontSize:'14px',  //字体
         	fontWight:'blod'
		}
	},
	opposite: true
},{
	title: {
       	text: '流量',
       	style: {
           	fontSize:'14px',  //字体
       		fontWight:'blod'
       	}
   	},
   	labels: {
   		format: '{value} m³/s',
    	style: {
        	fontSize:'14px',  //字体
        	fontWight:'blod'
		}
	}
},{
	title: {
       	text: '温度',
       	style: {
           	fontSize:'14px',  //字体
       		fontWight:'blod'
       	}
   	},
   	labels: {
   		format: '{value} ℃',
    	style: {
        	fontSize:'14px',  //字体
        	fontWight:'blod'
		}
	}
}];

function pushYAxisArray(array,YAxisIndex){
	var YAxisName;
	var hasYaix;
	if(YAxisIndex==0)
		YAxisName = '水位';
	else if(YAxisIndex==1)
		YAxisName = '降雨量';
	else if(YAxisIndex==2)
		YAxisName = '流量';
	else if(YAxisIndex==3)
		YAxisName = '温度';
	$.each(array,function(index,item){
		if(item.title.text==YAxisName)
			hasYaix = true ;
	});
	if(hasYaix==null)
		array.push(YaxisArray[YAxisIndex]);
}

function getYAxisArrayIndex(yAxisArray,YAxisName){
	var YAxisIndex = 0;
	$.each(yAxisArray,function(index,item){
		YAxisIndex = index;
	});
	return YAxisIndex;
}