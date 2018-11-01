define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],
	function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,customScrollbar){

	var layerIndex,jsdId,modelId,view;     	    

	function operateFormatterNum(value, row, index) {     
		return value+row.unit;
	};
	        
	function operateFormatter(value, row, index){     
		if(value==undefined) return "";
		else return value;
	};
		   
	function getInputNumGood(value, row, index){
		if(value)
			return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control itemNumGood' max='"+(row["amount"]+value)+"' 'min='0'  value="+value+" style='text-align:center;width:80px;margin-left:30px'>";//onblur='resetValue(this)'		
		else
			return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0' style='text-align:center;width:80px;margin-left:30px'></input>";
	}
			
	function getInputNumTeam(value, row, index){
		if(value)
			return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control itemNumTeam'  max='"+(row["amount"]+value)+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";// onblur='resetValue(this)'  
		else
			return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0'  style='text-align:center;width:80px;margin-left:30px'></input>";
	}

	function peopleFormat(value, row, index){
	    return value+"人";		
	}
		     
	function resetValue(o){
		if($(".help-block:visible")[0]){
			$("#templateJsdDispatchSaveBtn").prop("disabled",true);
		} else {
			$("#templateJsdDispatchSaveBtn").prop("disabled",false);	          
		}  
	}

	//保存
	function save(){
		var goods=$("#templateJsdDispatch #table_good").bootstrapTable("getData");
		var goodIds=[];
		var gDispAmounts=[];
		for(index in goods) {
			var amount=$("input[name='gnumbervalue"+goods[index]["id"]+"']").val();
			if(!amount)
				amount=0;
			goodIds.push(goods[index]["id"]);
			gDispAmounts.push(amount);
		}
		var goodIdsStr=goodIds.join(",");
		var gDispAmountsStr=gDispAmounts.join(",");
		
		var teams=$("#templateJsdDispatch #table_team").bootstrapTable("getData");
		var teamIds=[];
		var tDispAmounts=[];
		for(index in teams) {
			var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
			if(!amount)
				amount=0;
			teamIds.push(teams[index]["id"]);
			tDispAmounts.push(amount);					
		}
		
		if(teams[0]){
		   var teamData=teams[0].contact+","+$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
		}
		
		var teamIdsStr=teamIds.join(",");
		var tDispAmountsStr=tDispAmounts.join(",");

		var dataparam="jsdId="+jsdId+"&modelId="+modelId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&type=2";
		
		$.ajax({
			type: 'post',
			url :'/psemgy/yaGoodDispatch/saveJsdDispatch',
			data: dataparam,
			dataType : 'json',  
			success : function(data) {
				SetRecordDispatchIds(data);
				layer.msg(data.result);
				layer.close(layerIndex);
			},
			error : function(e) {
				layer.msg("保存数据失败！", {icon: 2,time: 1000});
			}
		});
	}
	//设置启动预案的积水点调度ids-启动预案后将该调度的model改为当前预案id
	function SetRecordDispatchIds(data){
		var goodDispatchIds = parent.$("#templateJsdDispatch #goodDispatchIds").val();
		if(goodDispatchIds)
			parent.$("#templateJsdDispatch #goodDispatchIds").val(goodDispatchIds+","+data.goodDispatchIds);
		else
			parent.$("#templateJsdDispatch #goodDispatchIds").val(data.goodDispatchIds);
		
		var teamDispatchIds = parent.$("#templateJsdDispatch #teamDispatchIds").val();
		if(teamDispatchIds)
			parent.$("#templateJsdDispatch #teamDispatchIds").val(teamDispatchIds+","+data.teamDispatchIds);
		else
			parent.$("#templateJsdDispatch #teamDispatchIds").val(data.teamDispatchIds);
	}
	//关闭
	function closeWindow() {
		layer.close(layerIndex);
	}

	//初始化点击事件
	function initBtn(){
		$("#templateJsdDispatchSaveBtn").click(save);
		$("#templateJsdDispatchCloseBtn").click(closeWindow);
	}

	//初始化数据
	function initData(){
		var tHeight = $("#templateJsdDispatch #myTabContent").height();
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaGoodDispatch/inputJsdJsonTemplate?jsdId='+jsdId+"&modelId="+modelId+"&type=2",
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#templateJsdDispatch #table_good").bootstrapTable({
					toggle:"table",
					data:data.Goodmap["goodTable"],
					rowStyle:"rowStyle",
					height:tHeight,
					cache: false, 
					checkboxHeader:false,
					singleSelect:false,
					clickToSelect:true,
					sidePagination: "server",
					columns: [
						{field:'id',visible: false,title: '编号'},
						{field:'name',visible: true,title: '物资名称',align:'center'},
						{field:'code',visible: true,title: '物资代码',align:'center'},
						{field:'model',visible: true,title: '型号',align:'center'},
						{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
						{field:'amount',visible: true,title: '剩余数量',align:'center',formatter:operateFormatterNum}],	  	
					onPostBody:function(){
						$('#templateJsdDispatch .itemNumGood').blur(resetValue);
						/*$("#templateJsdDispatch #table_good").on('post-body.bs.table', function (row,obj) {
							$("#templateJsdDispatch .fixed-table-body").mCustomScrollbar();
							$('#templateJsdDispatch #form').bootstrapValidator();							
						});	*/	
					}
				});
				
				$.each(data.Goodmap["goodTable"],function(index,item){
					 if(item["goodChecked"]==1)
					   $("#templateJsdDispatch #table_good").bootstrapTable("check",index);
				});
				
				$("#templateJsdDispatch #table_team").bootstrapTable({
					toggle:"table",
					data:data.Teammap["teamTable"],
					rowStyle:"rowStyle",
					height:tHeight,  
					cache: false, 
					checkboxHeader:false,
					singleSelect:false,
					clickToSelect:true,
					sidePagination: "server",
					columns: [
						{field:'id',visible: false,title: '编号'},
						{field:'name',visible: true,title: '名称',align:'center'},
						{field:'contact',visible: true,title: '联系人',align:'center'},
						{field:'phone',visible: true,title: '电话',align:'center'},
						{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumTeam,align:'center'},
						{field:'amount',visible: true,title: '剩余人数',formatter:peopleFormat,align:'center'}
					],	  	
					onPostBody:function(){
						$('#templateJsdDispatch .itemNumTeam').blur(resetValue);
						$("#templateJsdDispatch #table_team").on('post-body.bs.table', function (row,obj) {
							$("#templateJsdDispatch .fixed-table-body").mCustomScrollbar();
							$('#templateJsdDispatch #form').bootstrapValidator();							
						});		
					}
				});
				$.each(data.Teammap["teamTable"],function(index,item){
					 if(item["teamChecked"]==1)
					   $("#templateJsdDispatch #table_team").bootstrapTable("check",index);
				});	   
			},
			error : function(error) {
				alert('error');
			}
		});
	}

	function init(combId,_modelId,_view,_layerIndex){
		jsdId=combId;
		modelId=_modelId;
		view=_view;
		layerIndex=_layerIndex;
		if(view!=""){
			$("#templateJsdDispatchSaveBtn").hide();	        
			$("#templateJsdDispatchCloseBtn").show();		           
		}			    
		initBtn();    	
		initData();
	}

	return{
	  init:init
	}
});
