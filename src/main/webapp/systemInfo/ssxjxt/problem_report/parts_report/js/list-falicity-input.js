var layerIds,tableId,rowDatas=[],tables=["table_all","table_yj","table_ysk","table_pfk","table_bz","table_pm","table_fm","table_yly"]
	url="";
$(function(){
	//初始化点击事件
	btn_click();
	
	for(var i=0;i<tables.length;i++){
		initTable(tables[i]);
	}
	loadMaptoQuery();
	initMyEchars();
});
function initMyEchars(){
	if(options){
		option = options;
		option.title.text="数据修正统计";
		option.series[0].name="数据修正统计";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(option);
		window.onresize = myChar.resize; //自适应窗口大小
	}
    //绑定点击事件
    myChar.on('click',echartsLoadDate);
}
function btn_click(){
	//parentMethod('6');
	//tableId="table_yj";
	$("#panel_all_").click(function(){
		loadMaptoQuery();
		tableId="table_all";
	});
	$("#panel_yj_").click(function(){
		parentMethod('6');
		tableId="table_yj";
	});
	$("#panel_ysk_").click(function(){
		parentMethod('5');
		tableId="table_ysk";
	});
	$("#panel_pfk_").click(function(){
		parentMethod('3');
		tableId="table_pfk";
	});
	$("#panel_bz_").click(function(){
		parentMethod('1');
		tableId="table_bz";
	});
	$("#panel_pm_").click(function(){
		parentMethod('4');
		tableId="table_pm";
	});
	$("#panel_fm_").click(function(){
		parentMethod('0');
		tableId="table_fm";
	});
	$("#panel_yly_").click(function(){
		parentMethod('2');
		tableId="table_yly";
	});
}
var quertResult = function(result){
	var rows=[];
	var features = result.features;
	for(var i=0;i<features.length;i++){
		var form = features[i].attributes;
		rows[i] = form;
	}
	loadDataTable(tableId,rows);
}
//调取父页面的方法
function parentMethod(layerId){
	layerIds=layerId;
	window.parent.querysData("",layerId,"1=1 and REPAIR_DAT is not null",quertResult);
}

//初始化table
function initTable(tableId){
	$("#"+tableId).bootstrapTable({
		toggle:"tableCell",
		//data: rows,
		rowStyle:"rowStyle",
		cache:false,
		pagination:true,
		dataType:'json',
		striped:true,
		pageNumber:1,
		pageSize:10,
		pageList:[10,25,50,100],
		//queryParams:Table.queryParams,
		sidePagination:"client",
		clickToSelect:true,
		columns:[
			{field:'OBJECTID',title:'设施编号',visible:false,align:'center'},
			{field:'DISTRICT',title:'所属区域',visible:true,align:'center'},
			//{field:'layerName',title:'设施类型',visible:true,align:'center',formatter: format_comb},
			{field:'REPAIR_COM',title:'调查单位',visible:true,align:'center'},
			{field:'REPAIR_DAT',title:'调查日期',visible:true,align:'center',formatter: format_Data},
			{field:'SORT',title:'类别',visible:true,align:'center'},
			{field:'x',title:'经度',visible:false,align:'center'},
			{field:'y',title:'纬度',visible:false,align:'center'},
			{field:'STATE',title:'设施状态',visible:true,align:'center'},
			{field:'DATA_ORIGI',title:'数据来源',visible:true,align:'center'},
			{field:'MANAGEDEPT',title:'管理单位',visible:true,align:'center'},
			{field:'OWNERDEPT',title:'权属单位',visible:true,align:'center'},
			{title:'操作',visible:true,align:'center',formatter: format_ck}
		]
	});
}
function format_ck(value,row,index){
	if(row.x && row.y){
		return "<button type=\"button\" class=\"btn btn-primary btn-sm\"" +
		"onclick=\"openMapToPoint('"+row.x+"','"+row.y+"')\">" +
		"定位</button>";
	}else{
		return "<button type=\"button\" class=\"btn btn-primary btn-sm\"" +
		"onclick=\"openMap('"+layerIds+"','"+row.OBJECTID+"')\">" +
		"定位</button>";
	}
}
function format_Data(value,row,index){
	if(value){
		return getLocalTime(value);
	}else{
		return '';
	}
}
function format_comb(value,row,index){
	if(value=='0')
		return '阀门';
	else if(value=='1')
		return '泵站';
	else if(value=='2')
		return '溢流堰';
	else if(value=='3')
		return '排放口';
	else if(value=='4')
		return '拍门';
	else if(value=='5')
		return '雨水口';
	else if(value=='6')
		return '窨井';
	else return '';
}
function openMap(layerId,objId){
	toMap();
	window.parent.openQuerys(objId,layerId);
}
function openMapToPoint(x,y){
	toMap();
	window.parent.positPoint(x,y);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
//时间排序
function sortTime(a,b){  
    return b.REPAIR_DAT-a.REPAIR_DAT  
}
function reloadMapToQuery(){
	url="";
	loadMaptoQuery();
}
//初始化查询
function loadMaptoQuery(){
	rowDatas=[];
	var ids=[0,1,2,3,4,5,6];
	var ik=0;
	var where = "1=1 and REPAIR_DAT is not null";// and FLAG_ is not null
	for(var i=0;i<ids.length;i++){
		var layer_id = ids[i];
		window.parent.querysData(url,layer_id,where,function(result){
			var rows=[];
			var features = result.features;
			for(var i=0;i<features.length;i++){
				var geometry = features[i].geometry;
				var form = features[i].attributes;
				if(geometry && geometry.type=='point'){
					form.x = geometry.x;
					form.y = geometry.y;
				}
				rowDatas.push(form);
			}
			if(ik==6)
				if(rowDatas && rowDatas.length>0)
					loadDatas(rowDatas);
				else
					reloadMapToQuery();
			ik++;
		});
	}
	//console.log(rowDatas);
}
/*var quertResultList = function(result){
	
}*/
function loadDataTable(tableId,rows){
	rows.sort(sortTime);
	row=[];
	for(var i=0;i<rows.length;i++){
		row[i] = rows[i];
	}
	$("#"+tableId).bootstrapTable('load',row);
}
function loadDatas(data){
	data.sort(sortTime);
	rows=[];
	for(var i=0;i<data.length;i++){
		rows[i] = data[i];
	}
	$("#table_all").bootstrapTable('load',rows);
    groupArr(rows);
}

//js分组方法
function groupArr(array){
    var map = {};
    for(var i = 0; i < array.length; i++){
        var ai = array[i];
        if(!map[ai.DISTRICT]){
            if(ai.DISTRICT) map[ai.DISTRICT] = [ai];
        }else{
            if(ai.DISTRICT) map[ai.DISTRICT].push(ai);
        }
    }
    seriesDatas=map;
    var arrData = option.xAxis[0].data;
    var seriesData =option.series[0].data;
    for(var k in map){
        for(var i=0;i<arrData.length;i++){
            if(k.indexOf(arrData[i]) != -1){
                seriesData[i] = map[k].length;
            }
        }
    }
    option.series[0].data=seriesData;
    setOption();
}
//图表的点击事件查询
function echartsLoadDate(params){
    var name = params.name;
    for(var i in seriesDatas){
        if(i.indexOf(name)!=-1){
            $("#table_all").bootstrapTable('load',seriesDatas[i]);
        }
    }
}
//刷新图表数据
function setOption(){
    myChar.setOption(option);
}
