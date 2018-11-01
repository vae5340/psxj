
//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return "";
}
var templateGrade=getQueryStr("templateGrade");
var templateUnitCode=getQueryStr("templateUnitCode");

var oTableInit;
var table=$('#smsTable');
var areaUnit;

$(function () {
	// 初始化所属区域
	ajaxUnitArea();
	
	//2.初始化Table
	var oTable = new TableInit();
	oTable.Init();
 
	//3.初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();
	//初始化日期控件
	creatDatetimepicker();	 
});
function ajaxUnitArea(){
	$.ajax({
		method : 'get',
		url : '/agsupport/ya-temlate-sms!getUnitArea.action',
		async : false,
		dataType : 'json',
		success : function(data){
			areaUnit=data.rows;
		}, error : function(){  }
	});
}
		
	var TableInit = function () {
		
		oTableInit = new Object();
		//初始化Table
		oTableInit.Init = function (){
			table.bootstrapTable({
	        	url:'/agsupport/ya-temlate-sms!listSmsMessageJson.action?d='+new Date(),    //请求后台的URL（*）
	            method: 'get',
	           	toolbar: '#smsTableToolbar',		//工具按钮容器
				rowStyle:"rowStyle",
				striped: true,                      //是否显示行间隔色
				cache: false,			           //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,                   //是否显示分页（*）
	            queryParams: oTableInit.queryParams,//传递参数（*） 
	            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	            pageNumber:1,                       //初始化加载第一页，默认第一页
	            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
	            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
	            clickToSelect:true,
				singleSelect:true,
				columns: [{checkbox: true},
					{field: 'id',title: '编号',visible: false,align:'center'},
					{field: 'templateName',title: '模板名称',align:'center'}, 
					{field: 'templateCode',title: '模板编号',align:'center'}, 
					{field: 'templateContet',title: '短信内容',align:'center'}, 
					{field: 'templateCreatePerson',visible: false,align:'center'}, 
					{field: 'templateUnitCode',title: '所属区域',align:'center',formatter:format_unitcode},
					/*{field: 'templateCreateTime',title: '创建时间',align:'center',formatter:format_time}, */
					{field: 'state',title: '状态',align:'center',formatter:format_status}]
			});
		};
 
		//得到查询的参数
		oTableInit.queryParams = function (params) {
			var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	        	pageSize:params.limit,
				pageNo: params.offset/params.limit+1,
					templateGrade:templateGrade,
					templateUnitCode:templateUnitCode,
					templateCode: $("#templateCode").val(),
					templateName: $("#templateName").val(),
					state:$("#state").val()
	            };
	            return temp;
	        };
        	return oTableInit;
    	};
		var ButtonInit = function () {
			var oInit = new Object();
			var postdata = {};
	
			oInit.Init = function () {
				//初始化页面上面的按钮事件
				searchBtn();
			};
			return oInit;
		};
		
	function operations(value,row,index){
		var s = '<button type="button" class="btn btn-primary btn-xs" onclick="toUpdate('+row.id +')">修改</button>'; 
		var v = '<button type="button" class="btn btn-primary btn-xs" >查看</button>'; 
		return s;
	}
	//设置状态
	function format_status(value){
		if(value === 1){
			return '<font color="#00EC00">启用</font>';
		}else
			return '<font color="red">停用</font>';
	}
	
	function format_time(value,row,index){
		if(value)
			return getLocalTime(value.time).split(" ")[0];
		return '';
	}
	/**所属区域*/
	function format_unitcode(value,row,index){
		if(areaUnit){
			for(key in areaUnit){
				if(areaUnit[key].ORG_ID == value) return areaUnit[key].ORG_NAME;
			}
		}else{
			return '';
		}
	}
	//设置日期空间
	function creatDatetimepicker(){
		$('.form_date').datetimepicker({
	        language:  'zh-CN',
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			format:'yyyy-mm-dd'
	    });
	}

	//刷新 
	function refreshTable(){
		$("#smsTable").bootstrapTable('refresh');
	}
	
	//搜索 
	function searchBtn(){
		$("#btn_query").on('click',function(){
        	   refreshTable();
		});
	}
		
	//添加页面
	function toAdd(){
		layer.open({
			type: 2,
			area: ['770px', '400px'],
			title : "新增短信",	
			content: ['/awater/nnwaterSystem/EmergenControl/smsMessage/smsInput.html', 'yes']
		});
	}
	/**
	* 修改页面
	*/
	function toUpdate(id){
	 	var selList;
		if(id){ selList = id;}
		else {
			var selects = new Array();
			selects = table.bootstrapTable('getSelections');
			if(selects.length >1){
				parent.layer.msg('提示,编辑只能选中一条记录！')
				return ;
			}else if(selects.length < 1){
				parent.layer.msg('提示,请选中一条记录！')
				return ;
			}else{
				selList=selects[0].id;
			}
		}	
		layer.open({
			type: 2,
			area: ['770px', '400px'],
			title : "修改短信",
			content: ['/awater/nnwaterSystem/EmergenControl/smsMessage/smsInput.html?id='+selList, 'yes']
		});
	}	
	//删除	
	function doDelete(){
	    var selList=table.bootstrapTable('getSelections');
	    if(selList.length==0)
	    	parent.layer.msg('请选中删除项');
	    else {
	    	parent.layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
			}, function(){
				var checkedIds= new Array();
			   	for (var i=0;i<selList.length;i++){
			   		checkedIds.push(selList[i].id);
			   	}
		        $.ajax({  
				    url : '/agsupport/ya-temlate-sms!doDeleteMore.action',
					traditional: true,
				    data: {"checkedIds" : checkedIds},
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				        parent.layer.msg(data.result);
				    	refreshTable();
				    }
				});
			}, function(){
			});
	   	}
	}
	
   	var setting = {
		view: {
           dblClickExpand: false,
           showLine: true,
           selectedMulti: false
       },
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "parent_id",
				rootPId: 1
			}
		},
       	callback: {
			onClick : function(event, treeId, treeNode) {
				var query=new Object();
				if(treeNode.id==1){
					table.bootstrapTable('refresh', {url: '/agsupport/ya-temlate-sms!listSmsMessageJson.action',query:query});
               	} else if(treeNode.id==2){
           			query.templateGrade=1;
           			table.bootstrapTable('refresh', {url: '/agsupport/ya-temlate-sms!listSmsMessageJson.action',query:query});
               	} else if(treeNode.id==3){
           			query.templateGrade=2;
           			table.bootstrapTable('refresh', {url: '/agsupport/ya-temlate-sms!listSmsMessageJson.action',query:query});
               	} else if(treeNode.parent_id==2){
           			query.templateGrade=1;
           			query.templateUnitCode=treeNode.id;
           			table.bootstrapTable('refresh', {url: '/agsupport/ya-temlate-sms!listSmsMessageJson.action',query:query});
               	}else{
	               	query.templateGrade=2,
	               	query.templateUnitCode=treeNode.id,
               		table.bootstrapTable('refresh', {url: '/agsupport/ya-temlate-sms!listSmsMessageJson.action',query:query});
           		}
			},
           	onNodeCreated:function (event, treeId, treeNode){
           		if(treeNode.id==1)
           			$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
           	}
       	}
   	};
	$.ajax({
		method : 'GET',
		url : "/agsupport/ya-temlate-sms!getTreeJson.action",
		async : true,
		dataType : 'json',
		success : function(data) {
			var zNodes=data[0];
			$.fn.zTree.init($("#tree"), setting,zNodes);
		}
	});
	
function toAddAll(){
	layer.open({
			type: 2,
			area: ['770px', '400px'],
			title : "一键新增未录短信",	
			content: ['smsAddAll.html', 'yes']
		});
	
	
}