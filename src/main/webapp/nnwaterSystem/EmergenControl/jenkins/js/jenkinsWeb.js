$(function(){
	var TabJen = new TabJenkins();	
	TabJen.Init();	
				
});

var TabJenkins = function(){
	var tabjen = new Object();
	tabjen.Init = function(){
		$("#tableJenkins").bootstrapTable({
			method : 'GET',
			toggle:"tableJenkins",
			url : '/agsupport/ps-jenkins-data!getJobs.action',
			rowStyle:"rowStyle",
			cache: false, 
			striped: false,
			pagination:true,
			pageNumber:1,
		    pageSize: 100,
			pageList: [100],
			queryParams: tabjen.queryParams,
			clickToSelect:true,
			singleSelect:true,
			uniqueId　: "name",
			sidePagination: "server",
			columns: [{checkbox: true},
				{field : 'name', title : '作业',align : 'center',formatter : formatName},
				{field : 'color',title : '运行情况', align : 'center',formatter: coolorformat},
				{field : 'lastSuccess',title : '上次成功',align : 'center', formatter: formatSuccessLog},
				{field : 'lastFailed',title : '上次失败',align : 'center', formatter: formatFulitLog},
				{title:'操作',align : 'center',width:100,formatter: build}]
		});
	
	};
	tabjen.queryParams = function(params){
		var temp = {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
		};
		return temp;
	};
	return tabjen;
	
};

function message(){
	return '操作';
}

function coolorformat(rows,value,index){
	if(rows.indexOf('blue') > -1) return '<font style="color:blue">成功</font>';
	if(rows.indexOf('red') > -1) return '<font style="color:red">失败</font>';
	if(rows.indexOf('notbuilt') > -1) return '<font style="color:red">没有运行</font>';
	else
		return '没有';
}
//查询日志记录
function formatName(value,row,index){
	var jobname = encodeURI(value);
	return '<a href="jenkinsBuildContent.html?name='+jobname+'">'+value+'</a>';
}

function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

function toAdd(){
	layer.open({
			type: 2,
			title: '新增',
			maxmin: true, //开启最大化最小化按钮
			area: ['800px', '400px'],
		    content: 'jenkinsInput.html'
	});
}
function toUpdate(){
	var names =$("#tableJenkins").bootstrapTable('getSelections');
	if(names.length > 1){
		parent.layer.msg('提示,编辑只能选中一条记录!')
		return ;
	}else{
		var namels = names[0].name;
		if(namels)
			layer.open({
					type: 2,
					title: '修改',
					maxmin: true, //开启最大化最小化按钮
					area: ['800px', '400px'],
				    content: ['jenkinsInput.html?name='+namels,'yes']
			});
	}
}
function doDelete(){
	var names =$("#tableJenkins").bootstrapTable('getSelections');
	if(names.length<1){
		layer.msg('请先选中!')
		return ;
	}else if(names.length > 1){
		layer.msg('提示,删除只能选中一条记录!')
		return ;
	}else{
		if(window.confirm('你确定要删除吗？')){
			var namels = names[0].name;
			$.ajax({
				method: 'get',
				url: '/agsupport/ps-kettle-job!deleteJob.action?jobName='+namels,
				dataType: 'json',
				success: function(data){
					if(data.status == "200"){
						layer.msg("删除成功!");
						refreshTable();
					}else{
						layer.msg("删除失败!");
						refreshTable();
					}
				},error:function(){ }
			});
          	return true;
	     }else{
	        return false;
	   	 }
		
		
	}
}
function refreshTable(){
	$("#tableJenkins").bootstrapTable('refresh');
}
function build(value,row,index){
	return "<button type=\"button\" class=\"btn btn-primary\" onclick=\"buildJob('"+row.name +"')\">启动</button>";
}
function buildJob(valueName){
	if(valueName)
		$.ajax({
			method : 'get',
			url: '/agsupport/ps-jenkins-data!runJob.action?jonname='+valueName,
			dataType : 'json',
			success : function(data){
				if(data.status == "200"){
					layer.msg("启动成功 正在执行 请隔30s后刷新查看日志！");
				}else{
					layer.msg("启动失败!");
				}
			},error: function(){
				layer.msg("启动失败!");
			}
		});
}
// 日志
function formatSuccessLog(value,row,index){
	if(value.length>2){
		var counts = value.match(/\((.+?)\)/g)[0];
		var count = counts.split('#')[1].replace(')','');
		if(count) return "<a onclick=\"detailLogs('"+row.name+"','"+count+"')\">"+value+"</a>";
	}else{
		return value;
	}
}
function formatFulitLog(value,row,index){
	if(value.length>4){
		var counts = value.match(/\((.+?)\)/g)[0];
		var count = counts.split('#')[1].replace(')','');
		if(count) return "<a onclick=\"detailLogs('"+row.name+"','"+count+"')\">"+value+"</a>";
	}else{
		return value;
	}
}

function detailLogs(name,number){
	layer.open({
			type: 2,
			title: '日志',
			maxmin: true, //开启最大化最小化按钮
			area: ['900px', '500px'],
		    content: 'jenkinsJobLog.html?name='+name+'&count='+number
	});
}