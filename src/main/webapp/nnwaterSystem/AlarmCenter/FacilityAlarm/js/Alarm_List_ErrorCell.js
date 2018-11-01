var oTableInit;	
  		//显示地址查询模态窗口
		function toAlarm(value){ 
			var index=layer.open({
		      type: 2,
		      title: "设施管理",
		      area: ['320px', '195px'],
  			  maxmin: true,
		      content: '/awater/waterSystem/establishment/comb.html?combName=' +value+ '&num='+2000,
		      cancel: function(index){ 
		    	//关闭时刷新table
		    	  $("#table").bootstrapTable("refresh");
		    	  layer.close(index);
		    	  return true; 
		    	} 
		    }); 
		    layer.full(index);   
		}
		
		function operation(value,row,index){
			return "<button class='btn btn-primary' onclick=showBGWindow()>详情</button>";
		}
		function icon(value,row,index){
			return "<img src='/awater/img/danger.png' width='18' height='18'>";
		}	       
		function color(value,row,index){
			return "<font style='color:red;'>"+value+"</font>";
		}
		
		function combname(value,row,index){
			return '<a href="#" onclick=toAlarm("'+value+'")>' +value+ '</a>';
			
		}
			     
		function time(value,row,index){
			if(value)
				return getLocalTime(value.time);
			return '';
		}	
		     
		function descrip(value, row, index){
			if(value)
				return value;
			else
				return '';
		}
		function est_type(value, row, index){
			if(value==6)
				return "排水泵站";
			if(value==13)
				return "积水点";
			if(value==18)
				return "内河站点";
			if(value==19)
				return "雨量站";
			if(value==20)
				return "水文站";
			if(value==21)
				return "窨井";
			if(value==22)
				return "仓库";
			else
				return '';
		}
		
	    function form_status(value, row, index){
	    	if(value==1) return "<font style='color:#FF8F59;'>电量低于30%</font>";
	    	if(value==2) return "<font style='color:red;'>电量低于25%</font>";
	    	else
	    		return '';
	    }
	    
		function owner(value, row, index){
			for(var i=0;i<nnArea.length;i++){
				if(nnArea[i].code==value)
					return nnArea[i].name;
			}
			return '';
		}
		var nnArea=[];
		$(function(){ 
			nnArea.push({code:'450102',name:'B区'});
			nnArea.push({code:'450103',name:'H区'});
			nnArea.push({code:'450105',name:'A区'});
			nnArea.push({code:'450107',name:'D区'});
			nnArea.push({code:'450108',name:'C区'});
			nnArea.push({code:'450109',name:'E区'});
			nnArea.push({code:'450122',name:'J区'});
			nnArea.push({code:'450123',name:'K区'});
			nnArea.push({code:'450124',name:'L区'});
			nnArea.push({code:'450125',name:'M区'});
			nnArea.push({code:'450126',name:'N区'});
			nnArea.push({code:'450127',name:'O区'});
			
			//2.初始化Table
	        var oTable = new TableInit();
	        oTable.Init();
		});
		
		var TableInit = function () {
        oTableInit = new Object();
        //初始化Table
		oTableInit.Init = function (){
			$("#tableCell").bootstrapTable({
						toggle:"tableCell",
						url:"/agsupport/jk-alarm-info!listErrorCell.action",
						rowStyle:"rowStyle",
						cache: false, 
						pagination:true,
						striped: true,
						pageNumber:1,
						pageSize: 10,
						pageList: [10, 25, 50, 100],
						queryParams: oTableInit.queryParams,
						sidePagination: "server",
						columns: [{field: 'icon',title: '',visible: true,align:'center',formatter:format_icon},
							{field: 'ID',title: '报警编号',visible: false,align:'center'},
							{field: 'combId',title: '设施编号',visible: false,align:'center'},
							{field: 'combName',title: '设施地址',align:'center',formatter:format_combname}, 
							{field: 'deviceId',title: '设备编号',visible: false,align:'center'},
							{field: 'estType',title: '设备类型',align:'center',formatter:format_est_type},
							{field: 'deviceName',title: '设备名称',align:'center'},
							{field: 'itemId',title: '监控项编号',visible: false,align:'center',}, 
							{field: 'itemName',title: '监控项名称',visible: false,align:'center'}, 
							{field: 'sys_update_time',title: '检查时间',align:'center',formatter:format_time},
							{field: 'device_update_time',title: '数据更新时间',align:'center',formatter:format_time}, 
							{field: 'battery_status',title: '故障类型',align:'center',formatter:form_status},
							{field: 'errorDate',title: '故障时间',align:'center'}]
					});
		 };
		
		//得到查询的参数
	 oTableInit.queryParams = function (params) {
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize:params.limit,
		        pageNo: params.offset/params.limit+1,
				combName:$("#comb_name").val(),
            };
            return temp;
        };
        return oTableInit;
    };

	
	//搜索 
	function reloadDataCell(){
        refreshTable();
	}
	//刷新 
	function refreshTable(){
		 $("#tableCell").bootstrapTable('refresh');
	}
	
	function exportDeviceBatteryExcel(){
	var params = oTableInit.queryParams({
		'limit': 1,
		'offset': 0
	}), queryStr, url;
	
	delete params.pageSize;
	delete params.pageNo;
	
	$.extend(params, {
		'page.pageSize': 99999999,
		'page.pageNo': 1
	});
	
	queryStr = objToQueryStr(params);
	url = '/agsupport/jk-alarm-info!exportDeviceBatteryAlarmInfoExcel.action' + queryStr;
	
	window.open(url);
}
