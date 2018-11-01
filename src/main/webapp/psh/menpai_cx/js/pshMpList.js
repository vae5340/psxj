$(function(){
	var Tables = new Table();
	Tables.Init();	
});

//加载列表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			//url:'/psxj/exGongan77DzMpdy/getMpList',//
            url:'js/getMapList.json',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"client",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			columns:[
			    {field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
			    {field:'SGuid',title:'主键',visible:false,align:'center'},
				{field:'mpwzhm',title:'门牌号',visible:true,align:'center'},
				{field:'dzqc',title:'地址',visible:true,align:'center'},
				{field:'ssjlxdm',title:'街路巷',visible:false,align:'center'},
				{field:'sssqcjwhdm',title:'社区居委会',visible:false,align:'center'},
				{field:'ssxzjddm',title:'乡政街',visible:false,align:'center'},
				{field:'ssxzqhdm',title:'行政区',visible:false,align:'center'},
				{field:'sfdtl',title:'是否自增',visible:true,align:'center',formatter: format_isBySelf},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        ssxzqhdm : $("#ssxzqh").val(),
	        dzqc : $("#dzqc").val(),
	        mpwzhm : $("#mpwzhm").val()
	     };
		return temp;
	}
	return Table;
}
//是否自增
function format_isBySelf(val,row,index){
	var b="是";
	if(val=='no'){
		b="否"
	}
	return b;
}
//操作
function format_oper(val,row,index){
	var b="",c="";
	if(row.SGuid){
		b+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint(\''+row.SGuid+'\')">定位</button>';
	}
	//c+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="addShow(\''+row.ssxzqhdm+'\',\''+row.ssxzjddm+'\',\''+row.sssqcjwhdm+'\',\''+row.ssjlxdm+'\',\''+row.mpwzhm+'\',\''+row.sfdtl+'\',\''+row.SGuid+'\')">新增排水户</button>';
	return b+c;
}
//刷新 
function refreshTable(){
	$("#table").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	refreshTable();
}
//新增排水户
function addShow(ssxzqh,ssxzjd,sssqcjwh,ssjlx,mpwzhm,sfdtl,SGuid){
	layer.open({
		type: 2,
		area: ['1000px', '580px'],
		title : "排水户新增",	
		maxmin: true,
		btn:['保存','取消'],
		content: ['/psxj/psh/psh_lr/pshLrInput.html?type=add&area='+ssxzqh+'&town='+ssxzjd+'&village='+sssqcjwh+'&street='+ssjlx+'&mph='+mpwzhm+'&sfdtl='+sfdtl+'&SGuid='+SGuid, 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.save();
   		}
	});
}
//接驳井定位
function toPoint(sGuid){
	toMap();
	window.parent.positionSGuid(sGuid);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}

