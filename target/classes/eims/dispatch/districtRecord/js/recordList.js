define(['jquery','awaterui','dateUtil','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],
	function($,awaterui,dateUtil){


	//字典列表数据
	var DictList=null;
	//成员单位名称
	var orgName;

	//格式化预案状态
	function formatter_status(value,row,index){
		if(value==1)
	   		return "<font color='red'>启动中</font>";     		
	    return "预案结束";
	}
	//格式化按钮-预案详细信息
	function formatter_detail(value,row,index){
	   return "<button class='btn btn-primary itemDetailBtn' data-id='"+row.id+"'>详细</button>";//onclick='showWindow("+row.id+")'
	}
	//格式化按钮-应急调度室
	function formatter_overView(value,row,index){
		if(row.status==1)
			return "<button class='btn btn-primary viewNowDispatchBtn' data-id='"+row.id+"' data-unitid='"+row.districtUnitId+"'>查看调度</button>";//onclick=showNowTabWindow('"+row.districtUnitId+"','"+row.id+"')
		else
			return "<button class='btn btn-primary viewHisDispatchBtn' data-id='"+row.id+"' data-unitid='"+row.districtUnitId+"'>查看调度</button>";//onclick=showHistoryTabWindow('"+row.districtUnitId+"','"+row.id+"')	         
	}
	//格式化按钮-查看汇总报告
	function formatter_report(value,row,index){
	    return "<button class='btn btn-primary reportsBtn' data-id='"+row.id+"'>详情</button>";//onclick=showBGWindow('/psemgy/eims/dispatch/pages/district/reportList.html?id="+row.id+"')
	}
	//格式化日期时间
	function formatter_time(value,row,index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}	     
	//表格查询参数设置
	function queryParams(params) {
		return {
			pageSize:params.limit,
	    pageNo: params.offset/params.limit+1
		};
	}
	//格式化字典字段数据-预案类型
	function format_type(value, row, index){
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	}
	//格式化成员单位名称
	function format_org(value, row, index){			
		return orgName;
	}
	//格式化字典字段数据-预案等级
	function format_grade(value, row, index){
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	}
	var userType;
	function initUnit(){
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!obtainUserType.action',
			async : false,
			dataType : 'json',
			success : function(data) {
				userType=data.userType;
			},
			error : function() {
				layer.msg("获取成员单位信息失败", {icon: 2,time: 1000});
			}
		});
	}

	function initData(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/getAllDict',
			async : false,
			dataType : 'json',
			success : function(data) {
				orgName=data.orgName;
				DictList=data;
				$("#recordListCY_table").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaRecordDistrict/listDistrictJson",
					rowStyle:"rowStyle",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: queryParams,
					sidePagination: "server",
					columns: [{field: 'templateNo',title: '方案编号',align:'center'},
						{field: 'templateType',title: '方案分类',align:'center',formatter:format_type}, 
						{field: 'templateName',title: '方案名称',align:'center'},
						{field: 'templateGrade',title: '方案级别',align:'center',formatter:format_grade},
						{field: 'templateCreateTime',title: '成员单位',align:'center',formatter:format_org}, 
						{field: 'templateCreatePerson',title: '编制人',align:'center'}, 
						{field: 'recordCreateTime',title: '发布时间',align:'center',formatter:formatter_time},
						{field: 'status',title: '状态',align:'center',formatter:formatter_status}, 
						{title: '查看',formatter:formatter_overView,align:'center'},
						{title: '查看报告',formatter:formatter_report,align:'center'}],
					onLoadSuccess: function(){
						$("#recordListCY .viewNowDispatchBtn").click(showNowTabWindow);
						$("#recordListCY .viewHisDispatchBtn").click(showHistoryTabWindow);
						$("#recordListCY .reportsBtn").click(showBGWindow);
					}
				});
			},
			error : function() {
				layer.msg("页面加载数据失败", {icon: 2,time: 1000});
			}
		});
	}
	function initBtn(){
		$("#recordListCY_startTime").datetimepicker({
			language: 'zh-CN',
		  	format: 'yyyy-mm-dd',
		  	autoclose:true,
		  	minView:2,
		  	pickerPosition:'bottom-right'
		});
			   
		$("#recordListCY_endTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		$("#recordListCY_btn_query").click(reloadData);
	}

	//进入实时成员单位调度室
	function showNowTabWindow(e){
		// var url="/psemgy/eims/dispatch/pages/district/main.html?districtUnitId="+districtUnitId+"&yaDistrictId="+id;
		// parent.createNewtab(url,"成员单位调度");	

		var id=$(e.target).data("id");
		var districtUnitId=$(e.target).data("unitid");
		var url="/psemgy/eims/dispatch/pages/district/main.html";
		awaterui.createNewtab(url,"成员单位调度",function(){
			require(["psemgy/eims/dispatch/pages/district/js/main"],function(main){
				main.init(id,districtUnitId);
			});	
		});	
	}
	//进入历史成员单位调度室
	function showHistoryTabWindow(e){
		// var url="/psemgy/eims/dispatch/pages/district/mainView.html?districtUnitId="+districtUnitId+"&yaDistrictId="+id;
		// parent.createNewtab(url,"历史成员单位调度");	
		var id=$(e.target).data("id");
		var districtUnitId=$(e.target).data("unitid");
		var url="/psemgy/eims/dispatch/pages/district/mainView.html";
		awaterui.createNewtab(url,"历史成员单位调度",function(){
			require(["psemgy/eims/dispatch/pages/district/js/mainView"],function(mainView){
				mainView.init(id,districtUnitId);
			});	
		});	

	}

	//进入成员单位汇总报告
	function showBGWindow(e){
		//parent.createNewtab(url,"查看报告"); 	
		var id=$(e.target).data("id");
		var url="/psemgy/eims/dispatch/pages/district/reportList.html";
		awaterui.createNewtab(url,"查看报告",function(){
			require(["psemgy/eims/dispatch/pages/district/js/reportList"],function(reportList){
				reportList.init(id);
			});	
		});	
		
	}
	//重新加载表格数据
	function reloadData(){
		var query=new Object();
		if($("#recordListCY_startTime").val()!="")
			query.startTime=dateUtil.getTimeLong($("#recordListCY_startTime").val());
		if($("#recordListCY_endTime").val()!="") 
			query.endTime=dateUtil.getTimeLong($("#recordListCY_endTime").val());
		$("#recordListCY_table").bootstrapTable('refresh', {url: '/psemgy/yaRecordDistrict/listDistrictJson',query:query});
	}

	//关闭弹出tab页面
	function closeLayer(){
		layer.close(layerIndex);
	  reloadData();
	}

	function init(){ 		
		initUnit();
		//if(userType==2||userType==3){		  
			initData();	
	  //}
	  initBtn();
	};

	return{
	    init:init,
		closeLayer:closeLayer
	}

});