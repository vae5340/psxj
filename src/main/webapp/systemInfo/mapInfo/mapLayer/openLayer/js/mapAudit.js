$(function(){
	var tables = new Table();
	tables.Init();
	
	
	
});

var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/lackMark/getLackMarks',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
				{field:'markPerson',title:'巡查人',visible:true,align:'center'},
				{field:'componentType',title:'上报类型',visible:true,align:'center'},
				{field:'markTime',title:'标识时间',visible:true,align:'center',formatter: format_date},
				{field:'updateTime',title:'更新时间',visible:true,align:'center',formatter: format_date},
				{field:'correctType',title:'纠错种类',visible:true,align:'center'},
				{field:'road',title:'所属道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:true,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:true,align:'center'},
				{field:'parentOrgName',title:'业主单位',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        parentOrgName: $("#parentOrgName").val(),
	        componentType : $("#componentType").val()
		};
		return temp;
	}
	return Table;
}