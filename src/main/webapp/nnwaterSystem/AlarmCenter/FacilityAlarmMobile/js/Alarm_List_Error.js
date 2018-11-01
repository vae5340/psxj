$(function(){
    if(window.parent){
        $(".mainwrapper").width($(window.parent).width());
        $(".mainwrapper .panel").height($(window.parent.document).height());
        $(".mainwrapper .panel").css({
            'padding-bottom': '75px'
        });
        console.log($(".mainwrapper .panel")[0].className);
        console.log($(window.parent.document).height());
    }
});

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
			return "<font style='color:red;'>"+value+"</font>";
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
	    
	    
	    
		function format_owner(value, row, index){
			for(var i=0;i<nnArea.length;i++){
				if(nnArea[i].code==value)
					return nnArea[i].name;
			}
			return '';
		}
		var nnArea=[];
		$(function(){ 
			nnArea.push({code:'450102',name:'兴宁区'});
			nnArea.push({code:'450103',name:'青秀区'});
			nnArea.push({code:'450105',name:'江南区'});
			nnArea.push({code:'450107',name:'西乡塘区'});
			nnArea.push({code:'450108',name:'良庆区'});
			nnArea.push({code:'450109',name:'邕宁区'});
			nnArea.push({code:'450122',name:'武鸣县'});
			nnArea.push({code:'450123',name:'隆安县'});
			nnArea.push({code:'450124',name:'马山县'});
			nnArea.push({code:'450125',name:'上林县'});
			nnArea.push({code:'450126',name:'宾阳县'});
			nnArea.push({code:'450127',name:'横县'});
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
				columns: [
//                    {field: 'icon',title: '',visible: true,align:'center',formatter:format_icon},
					{field: 'ID',title: '报警编号',visible: false,align:'center'},
					{field: 'combId',title: '设施编号',visible: false,align:'center'},
					{field: 'combName',title: '设施地址',align:'center'/*,formatter:format_combname*/}, 
					{field: 'deviceId',title: '设备编号',visible: false,align:'center'},
					{field: 'estType',title: '设备类型',align:'center',formatter:format_est_type},
					{field: 'deviceName',title: '设备名称',align:'center'},
					/*{field: 'deviceOwner',title: '设备权属单位',align:'center',formatter:format_owner},*/
					{field: 'itemId',title: '监控项编号',visible: false,align:'center'}, 
					{field: 'itemName',title: '监控项名称',align:'center'}, 
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
		
