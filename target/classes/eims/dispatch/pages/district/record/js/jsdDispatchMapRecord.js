define(['jquery','layer','dateUtil','psemgy/eims/dispatch/pages/district/alarm/js/alarmInfoNew','customScrollbar','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapValidator','bootstrapValidatorCN'],function($,layer,dateUtil,alarmInfoNew){
    function init(_jsdId,_view,index){
		jsdId = _jsdId;
		view = _view;
		pIndex = index;

		modelId = alarmInfoNew.getDistrictYaId();
		
		
		$("#jsdDispatchMapRecord #save").click(save);
		$("#jsdDispatchMapRecord #close").click(closeWindow);

		if(view!=""){
			$("#jsdDispatchMapRecord #save").hide();
			$("#jsdDispatchMapRecord #close").show();
		}
		var tHeight = $("#templateJsdDispatch #myTabContent").height();

		$.ajax({
			method : 'GET',
			url : '/psemgy/yaGoodDispatch/inputJsdJsonAfter?jsdId='+jsdId+"&modelId="+modelId,
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#jsdDispatchMapRecord #table_good").bootstrapTable({
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
						{field:'amount',visible: true,title: '剩余数量',align:'center',formatter:operateFormatterNum}]
				});
				
				$.each(data.Goodmap["goodTable"],function(index,item){
					if(item["goodChecked"]==1)
						$("#jsdDispatchMapRecord #table_good").bootstrapTable("check",index);
				});
				
				$("#jsdDispatchMapRecord #table_team").bootstrapTable({
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
					]
				});
				
				$.each(data.Teammap["teamTable"],function(index,item){
					if(item["teamChecked"]==1)
					$("#jsdDispatchMapRecord #table_team").bootstrapTable("check",index);
				});	   
			},
			error : function(error) {
				alert('error');
			}
		});

		$("#jsdDispatchMapRecord #table_team").on('post-body.bs.table', function (row,obj) {
			$("#jsdDispatchMapRecord .fixed-table-body").mCustomScrollbar();
		   	$('#jsdDispatchMapRecord #form').bootstrapValidator();							
		});					         								
		$("#jsdDispatchMapRecord #table_good").on('post-body.bs.table', function (row,obj) {
			$("#jsdDispatchMapRecord .fixed-table-body").mCustomScrollbar();
		});
	}


	var jsdId,modelId, type,view,pIndex;

	function operateFormatterNum(value, row, index) {     
		return value+row.unit;
	};

	function operateFormatter(value, row, index){     
		if(value)
			return value;
		else
			return "";
	};

	function operateFormatterNum(value, row, index) {     
		return value+row.unit;
	};

	function getInputNumGood(value, row, index){
		if(value)
			return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control' max='"+(row["amount"]+value)+"' 'min='0' onblur='resetValue(this)' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
		else
			return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0' style='text-align:center;width:80px;margin-left:30px'></input>";
	}

	function getInputNumTeam(value, row, index){
		if(value)
			return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' onblur='resetValue(this)' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
		else
			return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+(row["amount"]+value)+"' min='0' value='0'  style='text-align:center;width:80px;margin-left:30px'></input>";
	}

	function resetValue(o){
		if($("#jsdDispatchMapRecord .help-block:visible")[0]){
			$("#jsdDispatchMapRecord #save").prop("disabled",true);
		} else {
			$("#jsdDispatchMapRecord #save").prop("disabled",false);
		}
	}

	function peopleFormat(value, row, index){
		return value+"人";
	}
	
	function save(){
		var goods=$("#jsdDispatchMapRecord #table_good").bootstrapTable("getData");
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
		
		var teams=$("#jsdDispatchMapRecord #table_team").bootstrapTable("getData");
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

		var dataparam="jsdId="+jsdId+"&modelId="+modelId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&type=4";
		
		$.ajax({
			type: 'post',
			url :'/psemgy/yaGoodDispatch/saveJsdDispatchRecord',
			data: dataparam,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				layer.close(pIndex);
			},
			error : function(e) {
				layer.msg('error');
			}
		});
	}

	function closeWindow() {
		layer.close(pIndex);
	}

	return {
		init: init
	}
});	