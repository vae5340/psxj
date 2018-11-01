var FacList=null;
var fieldArr=[];
var fieldDic=[];
$(function(){ 
	readFacilities();
	fieldDic['totallength']='道路总长度';
	fieldDic['totalarea']='道路总面积(m²)';
	fieldDic['dividingstrip']='分隔带面积(m²)'; 
	fieldDic['footwalkarea']='人行道铺装面积(m²)'; 
	fieldDic['stormsewerlength']='雨水管渠总长度(m)';
	fieldDic['checkwell']='检查井(座)';
	fieldDic['storminlet']='雨水井(座)';
	fieldDic['bridgeculvert']='桥涵(座)';
	fieldDic['railwayoverpass']='铁路立交桥(座)';
	fieldDic['offtakelength']='排水干渠总长度(m)';
	fieldDic['remark']='备注';
	fieldDic['detail']='详细';
	fieldDic['roadwayarea']='车行道合计面积(m²)';
	fieldDic['roadwaysubarea1']='车行道水泥砼面积(m²)';
	fieldDic['roadwaysubarea2']='车行道沥青砼面积(m²)';
	fieldDic['roadwaysubarea3']='车行道改性沥青砼面积(m²)';	
	fieldArr.push('totallength');
	fieldArr.push('totalarea');
    fieldArr.push('roadwayarea');
	fieldArr.push('roadwaysubarea1');
	fieldArr.push('roadwaysubarea2');
	fieldArr.push('roadwaysubarea3');
	fieldArr.push('dividingstrip');
	fieldArr.push('footwalkarea');
	fieldArr.push('stormsewerlength');
	fieldArr.push('checkwell');
	fieldArr.push('storminlet');
	fieldArr.push('bridgeculvert');
	fieldArr.push('railwayoverpass');  
	//$("#myTab li:eq(1)").click(function(){
	    //$('.highcharts-container:eq(0)').css("width",$("#myTab").css("width"));
	//});
});

$(window).resize(function() {
    resizeTableContent();	         
 });

$(window).load(function(){
    $.ajax(
    {	
    	url:"/agsupport/sz-facilities!getSum.action", 
    	dataType:"json", 
    	success:function (data) {
			var tableInfo =$('#tableInfo');
			if(data.total>0){
			    var row=data.rows[0];
			    var rows=data.rows;
			    var rowHtml = "";	 
			    var glIndex=getTypeRowIndex(rows,"公路");
  			    var zglIndex=getTypeRowIndex(rows,"主干路");
  			    var cglIndex=getTypeRowIndex(rows,"次干路");
  			    var kslIndex=getTypeRowIndex(rows,"快速路");
  			    var zlIndex=getTypeRowIndex(rows,"支路");	

			    for(var index in fieldArr){
			       key=fieldArr[index];
			       if(key!="faclitiesType"&&fieldDic[key]!=null){
			           var total=rows[glIndex][key]+rows[zglIndex][key]+rows[cglIndex][key]+rows[kslIndex][key]+rows[zlIndex][key];
				       rowHtml = '<tr style="font-size:14px"><td class="td">'+fieldDic[key]+'</td><td>'+rows[glIndex][key]+'</td><td>'+rows[zglIndex][key]+
				       '</td><td>'+rows[cglIndex][key]+'</td><td>'+rows[kslIndex][key]+'</td><td>'+rows[zlIndex][key]+'</td><td>'+total+'</td></tr>';  
				       $('#tableInfo').append(rowHtml);				       
			       }	 
			    }	
			}
			
			$("#gl").html(rows[glIndex]["count"]);
			$("#zgl").html(rows[zglIndex]["count"]);
			$("#cgl").html(rows[cglIndex]["count"]);
			$("#ksl").html(rows[kslIndex]["count"]);
			$("#zl").html(rows[zlIndex]["count"]);		
			$('table tbody').css("overflow","auto");
			resizeTableContent();	 
		    $(".table").find("tbody tr td").each(function(){
			     if($(this).html()=="null")
			       $(this).html("")
			});
		    for(var i=0;i<data.total;i++){
    	      statisticArr.push(data.rows[i].totallength);
    	    } 
    	    generateMap();	
		}
	});
});

function readFacilities(){
	/*$("#table").bootstrapTable({
		toggle:"table",
		url: "/agsupport/sz-facilities!getSum.action",
		rowStyle:"rowStyle",
		classes: 'table table-bordered table-hover',
		cache: false, 
		pagination:true,
		striped: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			[
				{field: 'id',rowspan:2,title: 'ID',align:'center',valign:'middle',visible:false},
				{field: 'faclitiesType',rowspan:2,title: '道路类别',align:'center',valign:'middle'},
				{field: 'totallength',rowspan:2,title: '道路总长度<br/>(m)',align:'center',valign:'middle'},
				{field: 'totalarea',rowspan:2,title: '道路总面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',title: '车行道',colspan:4,align:'center',valign:'middle'},
				{field: 'dividingstrip',rowspan:2,title: '分隔带面积<br/>(m²)',align:'center',valign:'middle'}, 
				{field: 'footwalkarea',rowspan:2,title: '人行道铺装面积<br/>(m²)',align:'center',valign:'middle'}, 
				{field: 'stormsewerlength',rowspan:2,title: '雨水管渠总长度<br/>(m)',align:'center',valign:'middle'},
				{field: 'checkwell',rowspan:2,title: '检查井<br/>(座)',align:'center',valign:'middle'},
				{field: 'storminlet',rowspan:2,title: '雨水井<br/>(座)',align:'center',valign:'middle'},
				{field: 'bridgeculvert',rowspan:2,title: '桥涵<br/>(座)',align:'center',valign:'middle'},
				{field: 'railwayoverpass',rowspan:2,title: '铁路立交桥<br/>(座)',align:'center',valign:'middle'},
				{field: 'offtakelength',rowspan:2,title: '排水干渠总长度<br/>(m)',align:'center',valign:'middle'},
				{field: 'remark',rowspan:2,title: '备注',align:'center',valign:'middle'},
				{field: 'detail',rowspan:2,title: '详细',align:'center',valign:'middle',formatter:detail_formatter}
				//{field: 'option',rowspan:2,title: '操作',align:'center',valign:'middle',formatter:option_formatter}
			],[
				{field: 'roadwayarea',title: '合计面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea1',title: '水泥砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea2',title: '沥青砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea3',title: '改性沥青砼面积<br/>(m²)',align:'center',valign:'middle'}
			]
		]
	});*/
}

function resizeTableContent(){
   $('table th').css("width",($('table').css("width").substr(0,$('table').css("width").length-2)*14)/100+"px");	
   $('#th').css("width",($('table').css("width").substr(0,$('table').css("width").length-2)*16)/100+"px");		
   $('table td').css("width",($('table').css("width").substr(0,$('table').css("width").length-2)*14)/100+"px");		
   $('.td').css("width",($('table').css("width").substr(0,$('table').css("width").length-2)*16)/100+"px");		
}

function getTypeRowIndex(rows,type){
   for(var index in rows){
      if(rows[index].faclitiesType==type){
           return index;
      }   
   }
} 
function queryParams(params){
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit + 1
	};
}

function openType(type){
   switch(type){
      case 'gl':
       parent.createNewtab("/awater/nnwaterSystem/szwh/facility/ssgl/facilities-list.html?type=gl","设施列表");	
       break;
      case 'zgl':
       parent.createNewtab("/awater/nnwaterSystem/szwh/facility/ssgl/facilities-list.html?type=zgl","设施列表");	     
       break;
      case 'cgl':
       parent.createNewtab("/awater/nnwaterSystem/szwh/facility/ssgl/facilities-list.html?type=cgl","设施列表");	      
       break;
      case 'ksl':
       parent.createNewtab("/awater/nnwaterSystem/szwh/facility/ssgl/facilities-list.html?type=ksl","设施列表");	     
       break;
      case 'zl':
       parent.createNewtab("/awater/nnwaterSystem/szwh/facility/ssgl/facilities-list.html?type=zl","设施列表");	     
       break;
   }
}

 var statisticArr=[];
	  
 function generateMap(){
      $('#container').highcharts({
        chart: {
            type: 'column',
	        backgroundColor:'#F1F1F3'
        },
        title: {
            text: '道路长度柱状图'
        },
        xAxis: {
            categories: [
                '公路',
                '主干路',
                '次干路',
                '快速路',
                '支路'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '长度（米）'
            }
        },
        legend: {
	         enabled: false
	    },
        tooltip: {
	          shared: false,
	          hideDelay:500
	    },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
		                return this.y + '米';   
		            }
                }
            }
        }, 
        series: [{
        	name:'长度',
            data: [{y:statisticArr[0],color:"rgba(255,197,59,1)"},{y:statisticArr[1],color:"rgba(209,255,115,1)"},
                 {y:statisticArr[2],color:"rgba(255,102,0,1)"},{y:statisticArr[3],color:"rgba(255,165,56,1)"},
                 {y:statisticArr[4],color:"rgba(255,165,36,1)"}]
        }]
    });
    
    //$(".highcharts-container").css("width","100%").css("height","100%");
    $('#containerPie').highcharts({
		    chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            backgroundColor:'#F1F1F3'
	        },
	        title: {
	            text: '道路长度饼状图'
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
	            hideDelay:500
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '所占比例',
	            data: [{
						name:'公路',
	                    y: statisticArr[0],
	                    sliced: true,
	                    selected: true,
	                    color:"rgba(255,197,59,1)"		                
	                },{
						    name:'主干路',
	                    y: statisticArr[1],
	                    color:"rgba(209,255,115,1)"		                
	                },{
	                    name:'次干路',
	                    y: statisticArr[2],
	                    color:"rgba(255,102,0,1)"
	                },{
	                    name:'快速路',
	                    y: statisticArr[3],
	                    color:"rgba(255,165,56,1)"		
	                },{
						name:'支路',
	                    y: statisticArr[4],
	                    color:"rgba(255,165,56,1)"		                
	                }]
	        }]
	    });
  }
	  
function detail_formatter(value, row, index){
	return "<button class='btn btn-success' onclick='document_click(" + row.id + ",\"" + row.faclitiesType + "\")'>详细</button>";
}

function option_formatter(value, row, index){
	var temp = "<button class='btn btn-success' onclick='modifiedFac(" + row.id + ")'>改</button>";
	temp += "<button class='btn btn-danger' onclick='delFac(" + row.id + ")'>删</button>"
	return temp;
}

function createDate_formatter(value, row, index){
	//console.log(value)
	if(value){
		return getLocalTime(value.time);
	}
	return '';
}
//档案'详细'点击事件
function document_click(id,name){
	var typename = encodeURI(encodeURI(name));
	//console.log(name)
	layer.open({
		type: 2, 
		title: name + '-详细',
		area: ['70%','95%'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/file-list.html?faclitiesType=' + typename
	})
}
//新增设施按钮点击事件
function addFacilities(){
	layer.open({
		type: 2, 
		title: '新增设施',
		area: ['35%','60%'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/facilities-upload.html'
	})
}
//'删'事件
function delFac(id){
	$.ajax({
		url: '/agsupport/sz-facilities!delete.action?id=' + id,
		success: function(){
			location.reload();
		},
		error: function(XHR,error,errorThrown){
			alert("删除失败：" + error);
		}
	})
}
//'改'事件
function modifiedFac(id){
	var typename = encodeURI(encodeURI(name));
	layer.open({
		type: 2, 
		title: '修改设施',
		area: ['35%','60%'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/facilities-upload.html?faclitiesType=' + typename
	})
}