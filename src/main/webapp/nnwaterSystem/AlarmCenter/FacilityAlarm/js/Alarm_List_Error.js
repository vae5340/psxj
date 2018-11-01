
document.getElementById("ryxxxx").style.display='none';
$("#jgxx").click(function(){
	document.getElementById("ryxxxx").style.display='none';//隐藏
	document.getElementById("jgxxxx").style.display='block';//显示
});
$("#ryxx").click(function(){
	document.getElementById("jgxxxx").style.display='none';//隐藏
	document.getElementById("ryxxxx").style.display='block';//显示
});
//显示地址查询模态窗口
function toAlarmList(value){ 
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
  		
		function format_operation(value,row,index){
			return "<button class='btn btn-primary' onclick=showBGWindow()>详情</button>";
		}
		function format_icon(value,row,index){
			return "<img src='/awater/img/danger.png' width='18' height='18'>";
		}	       
		function format_color(value,row,index){
			return "<font style='color:red;'>"+value+"米</font>";
		}
		
		function format_combname(value,row,index){
			//return "<a href='/awater/waterSystem/establishment/comb.html?combName="+value+'&num='+2000+"'>"+value+"</a>";
			return '<a href="#" onclick=toAlarmList("'+value+'")>' +value+ '</a>';
			
		}
			     
		function format_time(value,row,index){
			if(value)
				return getLocalTime(value.time);
			return '';
		}	     
		function queryParams(params) {
			return {
				pageSize:params.limit,
				pageNo: params.offset/params.limit+1,
				alarmType:$("#alarmType").val(),
				estType:$("#estType").val(),
				errDate:$("#errDate").val(),
				deviceOwner:$("#deviceOwner").val(),
			};
		}
		function format_descrip(value, row, index){
			if(value)
				return value;
			else
				return '';
		}
		function format_est_type(value, row, index){
			if(value==13)
				return "积水点";
			if(value==29)
				return "内河站降雨量";
			if(value==30)
				return "水文雨量站";
			if(value==31)
				return "自建雨量站";
			if(value==33)
				return "路面(管渠)水位";
			if(value==34)
				return "河道水位";
			if(value==35)
				return "管渠流量";
			if(value==36)
				return "河道流量";
			if(value==37)
				return "泵站水位";
			else
				return '';
		}
	    
	    
	    
		function format_owner(value, row, index){
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
			$("#table").bootstrapTable({
				toggle:"table",
				url:"/agsupport/jk-alarm-info!listErrorJson.action",
				rowStyle:"rowStyle",
				cache: false, 
				pagination:true,
				striped: true,
				pageNumber:1,
				pageSize: 10,
				pageList: [10, 25, 50, 100],
				queryParams: queryParams,
				sidePagination: "server",
				columns: [{field: 'icon',title: '',visible: true,align:'center',formatter:format_icon},
					{field: 'ID',title: '报警编号',visible: false,align:'center'},
					{field: 'combId',title: '设施编号',visible: false,align:'center'},
					{field: 'combName',title: '设施地址',align:'center',formatter:format_combname}, 
					{field: 'deviceId',title: '设备编号',visible: false,align:'center'},
					{field: 'estType',title: '设备类型',align:'center',formatter:format_est_type},
					{field: 'deviceName',title: '设备名称',align:'center'},
					/*{field: 'deviceOwner',title: '设备权属单位',align:'center',formatter:format_owner},*/
					{field: 'itemId',title: '监控项编号',visible: false,align:'center',}, 
					{field: 'itemName',title: '监控类型',align:'center'}, 
					{field: 'd_value',title: '监控值',align:'center',formatter:format_color},
					{field: 'sys_update_time',title: '检查时间',align:'center',formatter:format_time},
					{field: 'device_update_time',title: '数据更新时间',align:'center',formatter:format_time}, 
					{field: 'errorDate',title: '故障时间',align:'center'}
					/*{field: 'ERROR_CODE',title: '故障类型',align:'center',formatter:format_type},
					{field: 'alarmDescription',title: '故障描述',align:'center',formatter:format_descrip}*/]
			});
			$("#startTime").datetimepicker({
	        	language: 'zh-CN',
    			format: 'yyyy-mm-dd hh:ii:ss',
    			autoclose:true,
    			pickerPosition:'bottom-right'
    		});
		});
	  	function showWindow(id){
			layer.open({
			  type: 2,
			  title: '应急调度情况',
			  shadeClose: false,
			  shade: 0.5,
			  area: ['900px', '600px'],
			  content:'/awater/nnwaterSystem/EmergenControl/District/Record/Record_Input.html?id='+id
			}); 	
		}		
		
		function showTabWindow(url){
			parent.createNewtab(url,"成员单位调度详情");	
		}
		
		function showBGWindow(){
			parent.createNewtab("/awater/nnwaterSystem/EmergenControl/District/RainNews/list.html","抢险情况"); 	
		}
		
		function reloadData(){
			var query=new Object();
			if($("#alarmType").val()!="")
				query.alarmType=$("#alarmType").val();
			if($("#estType").val()!="")
				query.estType=$("#estType").val();
			if($("#deviceOwner").val()!="")
				query.deviceOwner=$("#deviceOwner").val();
			if($("#errDate").val()!=""){
				query.errDate=$("#errDate").val();
			}
			$("#table").bootstrapTable('refresh', {url: '/agsupport/jk-alarm-info!listErrorJson.action',query:query});
     	}
		
		function objToQueryStr(obj){
			var query = "?",
				first = true,
				prop;
			if(obj){
				for(prop in obj){
					if(!obj.hasOwnProperty(prop)){
						continue;
					}
					if(!first){
						query += "&";
					}else{
						first = false;
					}
					
					query += prop+"="+obj[prop];
				}
			}
			return query;
		}
		
		function exportDeviceErrorExcel(){
			var params = queryParams({
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
			url = "/agsupport/jk-alarm-info!exportDeviceFaultInfoExcel.action" + queryStr
			
			window.open(url);
		}
		
function statReport(){
	var param = statReportParam();
	var queryStr = objToQueryStr(param);
	layer.open({
		type: 2,
		title: "设施设备质量报表",
		shadeClose: true,
		shade: 0,
		area: ['860px', '520px'],
		content: ["/awater/nnwaterSystem/AlarmCenter/FacilityAlarm/statisticReportRun.html"+queryStr]
	});
}

function statReportParam() {
	return {
		alarmType:$("#alarmType").val(),
		estType:$("#estType").val(),
		errDate:$("#errDate").val(),
		deviceOwner:$("#deviceOwner").val(),
	};
}

function statReportBattery(){
	layer.open({
		type: 2,
		title: "设施设备质量报表",
		shadeClose: true,
		shade: 0,
		area: ['860px', '520px'],
		content: ["/awater/nnwaterSystem/AlarmCenter/FacilityAlarm/statisticReportBat.html"]
	});
}