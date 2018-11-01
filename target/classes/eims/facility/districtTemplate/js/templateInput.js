define(['jquery','layer','dateUtil','areaUtil','directoryNavUtil','bootstrap','bootstrapTable','bootstrapTableCN',
'bootstrapValidator','bootstrapValidatorCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN',
'bootstrapSelect','zTree','customScrollbar','mousewheel'],function($,layer,dateUtil,areaUtil,directoryNavUtil){

	//获取预案模板编号
	var id,view,layerIndex;
	//所属行政区编号
	var districtArea="";
	//市级预案模板编号
	var cityPanId;
	//获取所属行政区编号
	function initXzArea(){
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : true,
			success : function(data) {
				var districtName=data;
				for(var index=0;index<areaUtil.xzArea.length;index++){//var index in xzArea
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;
						break;
					}
				}
			},
			error : function(e) {
				layer.msg('获取所属行政区编号信息失败', {icon: 2,time: 1000});
			}
		});
	}

	//机构树设置
	var setting = {
		check: {enable: true,chkStyle : "checkbox",chkboxType: { "Y": "s", "N": "s" }},
		data: {
			key: {name: "orgName"},
			simpleData: {
				enable: true,
				idKey: "orgId",
				pIdKey: "parentOrgId",
				rootPId: 0
			}
		}
	};

	//获取预案板等级
	function getTemplateGrade(value, row, index){
		for (grade in dictionary.templateGrade){
			if(value==dictionary.templateGrade[grade].itemCode)
				return dictionary.templateGrade[grade].itemName;
		}
	}

	//日期格式化
	function format_date(value, row, index){
		if(value) return dateUtil.getLocalTime(value);
		return '';
	}
	//物资合并数量单位显示
	function operateFormatterNum(value, row, index) {
		return value+row.unit;
	}
	//物资输入框生成
	function getInputNumGood(value, row, index){
		if(value){
			return "<input type='text' name='gtepnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
		}else{
			return "<input type='text' name='gtepnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
		}
			
	}
	//队伍输入框生成
	function getInputNumTeam(value, row, index){
		if(value){
			return "<input type='text' name='ttepnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
		}else{
			return "<input type='text' name='ttepnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
		}
			
	}
	//队伍人员数量和单位合并显示
	function peopleFormat(value, row, index){
		return value+"人";		
	}
	//表格查询参数生成
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}

	//生成易涝隐患点调度详细按钮
	function addBtnCol(value, row, index){
		return "<button type='button' class='btn itemDetailBtn' data-id='"+row.id+"' data-combname='"+row.combName+"' style='border:1px solid transparent;'><span class='glyphicon' aria-hidden='true'></span>调度详细</button>";// onclick='detailDialog('"+row.id+"','"+row.combName+"')'
	}


	//易涝隐患点输入框序号
	var cId;
	//易涝隐患点调度情况
	var firstDispatch=true;
	//易涝隐患点调度详细
	function detailDialog(e){//combId,jsdName
		if(!id||id==''){
			layer.msg("保存当前预案后，才能进行易涝隐患点调度！", {icon: 0,time: 1000});
			return ;
		}

		var combId=$(e.target).data('id'),
		combName=$(e.target).data('combname');
		$.get("/psemgy/eims/facility/districtTemplate/templateJsdDispatch.html",function(h){
			layer.open({
				type: 1, 
				content: h,
				title:combName+" 调度详情",
				area: ['900px', '550px'],
				maxmin: true, 
				success: function(layero,index){
					require(['eims/facility/districtTemplate/js/templateJsdDispatch'],function(templateJsdDispatch){
						templateJsdDispatch.init(combId,id,view,index);
					});
				}
			});
			
		});  
		// layer.open({
		// 	type: 2,
		// 	title: jsdName+" 调度详情",
		// 	shadeClose: true,
		// 	shade: 0,
		// 	area: ['700px', '440px'],
		// 	content: "templateJsdDispatch.html?combId="+combId+"&modelId="+id
		// });
	}

	function refreshJsdTeam(teamData){
		var arr=teamData.split(",");
		$("#templateInputCY #tableJsdCY tr:eq("+(cId+1)+")").children("td:eq(1)").html(arr[0]);
		$("#templateInputCY #tableJsdCY tr:eq("+(cId+1)+")").children("td:eq(2)").html(arr[1]);
	}


	var closePage=false;
	function saveAndClose(){
		closePage=true;			
		save();
	}	

	function save(){
		var cityPanId=$("#templateInputCY #tableMuniCY").bootstrapTable("getSelections")[0]==undefined?undefined:$("#templateInputCY #tableMuniCY").bootstrapTable("getSelections")[0].id;
		var goods=$("#templateInputCY #tableGoodCY").bootstrapTable("getData");
		var goodIds=[];
		var gDispAmounts=[];
		var tDispAmounts=[];
		for(index in goods) {
			var amount=$("input[name='gtepnumbervalue"+goods[index]["id"]+"']").val();
			if(amount>0){
				goodIds.push(goods[index]["id"]);
				gDispAmounts.push(amount);
			}
		}
		var goodIdsStr=goodIds.join(",");
		var gDispAmountsStr=gDispAmounts.join(",");
		
		var teams=$("#templateInputCY #tableTeamCY").bootstrapTable("getData");
		var teamIds=[];
		for(index in teams) {
			var amount=$("input[name='ttepnumbervalue"+teams[index]["id"]+"']").val();
			if(amount>0){
				teamIds.push(teams[index]["id"]);
				tDispAmounts.push(amount);
			}					
		}
		var teamIdsStr=teamIds.join(",");
		var tDispAmountsStr=tDispAmounts.join(",");
		//单是调整了人员物资，而没有更改易涝隐患点调度，也要将易涝隐患点调度数据清除
		if(firstDispatch&&id!=""){
			$.ajax({  
				url: "/psemgy/yaTemplateDistrict/testDispatchAlter",
				data:"goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&id="+id,
				async:false,
				type: "get",
				dataType: "json",
				success: function(data) {
					if(data){
						layer.confirm('人员或物资调度已经调整，继续会将当前调整保存并将易涝隐患点调度数据清零，是否继续？', {
							btn: ['是','否'] //按钮
						}, function(index){ 
							$.ajax({  
								url: "/psemgy/yaGoodDispatch/clearJsdDispatch?modelId="+id+"&type=3",
								async:false,
								type: "get",
								dataType: "json",
								success: function(data) {
									layer.close(index);
									saveData();
								}
							});     									
						}, function(index){
							closePage=false;				 
							layer.close(index);
							return;
						});  					      
					} else {
						saveData();
					}
				}
			}); 
		} else {
			saveData();
		}
	}
	//保存数据
	function saveData(){
		//关联市级预案
		var cityPanId=$("#templateInputCY #tableMuniCY").bootstrapTable("getSelections")[0]==undefined?undefined:$("#templateInputCY #tableMuniCY").bootstrapTable("getSelections")[0].id;
		//物资调度设置
		var goods=$("#templateInputCY #tableGoodCY").bootstrapTable("getData");
		var goodIds=[];
		var gDispAmounts=[];
		var tDispAmounts=[];
		for(var index=0;index<goods.length;index++) {//index in goods
			var amount=$("input[name='gtepnumbervalue"+goods[index]["id"]+"']").val();
			if(amount>0){
				goodIds.push(goods[index]["id"]);
				gDispAmounts.push(amount);
			}
		}

		var goodIdsStr=goodIds.join(",");
		var gDispAmountsStr=gDispAmounts.join(",");
		//人员调度设置
		var teams=$("#templateInputCY #tableTeamCY").bootstrapTable("getData");
		var teamIds=[];
		for(var index=0;index<teams.length;index++) {//index in teams
			var amount=$("input[name='ttepnumbervalue"+teams[index]["id"]+"']").val();
			if(amount>0){
				teamIds.push(teams[index]["id"]);
				tDispAmounts.push(amount);
			}					
		}
		var teamIdsStr=teamIds.join(",");
		var tDispAmountsStr=tDispAmounts.join(",");
		//添加机构树状参数
		var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver");
		nodes=treeObj.getCheckedNodes(true);
		checkIds="";
		for(var i=0;i<nodes.length;i++){
			if(checkIds=="")
				checkIds=nodes[i].orgId;
			else
				checkIds+= ","+nodes[i].orgId;
		}
		var dataparam;
		if(cityPanId==undefined)
			dataparam=$("#templateInputCY #templateInputCYForm").serialize()+"&cityPanId=&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&templateSmsReceiver="+encodeURIComponent(checkIds);
		else
			dataparam=$("#templateInputCY #templateInputCYForm").serialize()+"&cityPanId="+cityPanId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&templateSmsReceiver="+encodeURIComponent(checkIds);
		if(districtUnitId!=undefined) {
			dataparam=dataparam+"&districtUnitId="+districtUnitId+"&districtUnitType="+districtUnitType;
		}
		
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateDistrict/saveJson',
			async : true,
			data: dataparam,
			dataType : 'json',  
			success : function(data) {
				if(closePage){
					layer.msg(data.result);
					require(['eims/facility/districtTemplate/js/templateList'],function(templateList){
						layer.close(layerIndex);
					});
				} else if(id=="") {
					id=data.id;
					$("#templateInputCY #id").val(id);
				}
			},
			error : function() {
				layer.msg("保存数据失败", {icon: 2,time: 1000});
			}
		});
	}
	//取消保存
	function cancel() {
		layer.close(layerIndex);
	}
	//获取短信
	function searchSms(value){
		var dataparms={alarmType : value};
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateSms/listSmsMessageAjax',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				$.each(eval(data.rows), function(){
					//$("#templateInputCY #templateSms").val(this.TEMPLATE_CONTET);
					this.TEMPLATE_CONTET? $("#templateInputCY #templateSms").val(this.TEMPLATE_CONTET) : $("#templateInputCY #templateSms").val("");
				});
			},
			error : function(){
				layer.msg('获取短信失败', {icon: 2,time: 1000});
			}
		});
	}
	//更新短信内容
	function freshSmsBtn() {
		$.ajax({
			type: 'post',
			url : '/psemgy/yaGoodDispatch/loadSmsJsdDispatchTemplate',
			data : {modelId:id},
			dataType : 'text',
			success : function(data){
				$("#templateInputCY #templateSms").val(data);
				layer.msg('更新短信内容成功', {icon: 1,time: 1000});
			},
			error : function(){
				layer.msg('加载短信内容失败', {icon: 2,time: 1000});
			}
		});
	}


	//初始化物资调度设置
	function initGoodsTable(goodTableRows){
		$("#templateInputCY #tableGoodCY").bootstrapTable({
			toggle:"table",
			data:goodTableRows,
			rowStyle:"rowStyle",
			height:320,
			cache: false, 
			checkboxHeader:false,
			singleSelect:false,
			clickToSelect:true,
			sidePagination: "server",
			columns: [
			{field:'id',visible: false,title: '编号',align:'center'},
			{field:'name',visible: true,title: '物资名称',align:'center'},
			{field:'code',visible: true,title: '物资代码',align:'center'},
			{field:'model',visible: true,title: '型号',align:'center'},
			{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
			{field:'amount',visible: true,title: '数量',align:'center',formatter:operateFormatterNum}
			],
			onPostBody:function(){
				$("#templateInputCY #tableGoodCY").on('post-body.bs.table', function (row,obj) {
					$(".templateInputCY #fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
				});
	  	}
		});	 
	}


	//初始化人员调度设置
	function initTeamTable(teamTableRows){
		$("#templateInputCY #tableTeamCY").bootstrapTable({
			toggle:"table",
			data:teamTableRows,
			rowStyle:"rowStyle",
			height:320,
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
			{field:'address',visible: false,title: '地址',align:'center'},
			{field:'dispAmount',visible: true,title: '调度人数',formatter:getInputNumTeam,align:'center'},
			{field:'amount',visible: true,title: '人数',formatter:peopleFormat,align:'center'}
			],
			onPostBody:function(){
				$("#templateInputCY #tableTeamCY").on('post-body.bs.table', function (row,obj) {
					$(".templateInputCY #fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
				});
	  	}
		});
	}
	//初始化关联市级预案
	function initCityYa(){
		$("#templateInputCY #tableMuniCY").bootstrapTable({
			toggle:"table",
			url:"/psemgy/yaTemplateCity/listJson",
			rowStyle:"rowStyle",
			height:140,
			cache: false, 
			checkboxHeader:false,
			singleSelect:true,
			clickToSelect:true,
			sidePagination: "server",
			columns: [
			{visible:true,title: '',checkbox:true},
			{field:'id',visible: false,title: '编号'},
			{field:'templateNo',visible: true,title: '预案编号',align:'center'},
			{field:'templateName',visible: true,title: '预案名称',align:'center'},
			/*{field:'templateCreateTime',visible: true,title: '创建时间',align:'center',formatter:format_date},*/
			{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:getTemplateGrade}
			],
			onPostBody:function(){
				$("#templateInputCY #tableMuniCY").on('post-body.bs.table', function (row,obj) {
					$(".templateInputCY #fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
				});
	  	}
		});
	}


	//初始化易涝点调度设置
	function initJsdTable(){
		$("#templateInputCY #tableJsdCY").bootstrapTable({
			toggle:"table",
			height:400,
			url:"/psfacility/pscomb/listNoPageJson?estType=13&area="+districtArea,
			rowStyle:"rowStyle", 
			cache: false, 
			pagination:true,
			pageNumber:1,
			pageSize: 10,
			pageList: [10,25],
			queryParams: queryParams,
			sidePagination: "server",
			columns: [
				{field:'combName',visible: true,title: '名称',width:"25%",align:'center'},
				/*{field:'xcoor',visible: true,title: '经度',align:'center'},
				{field:'ycoor',visible: true,title: '纬度',align:'center'},*/
				{field:'estDept',visible: true,title: '记录建立单位',align:'center'},
				{visible: true,title: '操作',align:'center',formatter:addBtnCol}
				],
			onLoadSuccess:function(){
				$('#templateInputCY .itemDetailBtn').click(detailDialog);
			},
			onPostBody:function(){
				$("#templateInputCY #tableJsdCY").on('post-body.bs.table', function (row,obj) {
					$(".templateInputCY #fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
				});
	  	}
		});
	}


	var dictionary;
	var districtUnitId;
	var districtUnitType;				
	function initData(){
		if(id==""){
			searchSms(11);
			$.ajax({
				type: 'post',
				url : '/psemgy/yaTeamDispatch/listJsdTeam?modelId='+id+"&type=1",
				async:false,
				dataType : 'json',  
				success : function(data) {
					teamData=data;
				},
				error : function() {
					layer.msg("获取数据失败", {icon: 2,time: 1000});
				}
			});
			//获取成员单位ID			
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateDistrict/inputJson',
				async : true,
				dataType : 'json',
				success : function(data) {
			
					dictionary=data.Dict;
					districtUnitId=data.id;
					districtUnitType=data.type;
					for (itemname in dictionary){
						for (var num=0;num<dictionary[itemname].length;num++){//num in dictionary[itemname]
							$("#templateInputCY #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
						}
					}
					var orgTree = data.Tbmap["orgTable"];
					$.fn.zTree.init($("#templateInputCY #templateSmsReceiver"), setting,orgTree);
					
					var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
					initGoodsTable(goodTableRows);  	
					
					var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
					initTeamTable(teamTableRows); 

					initJsdTable();
					initCityYa();
				},
				error : function() {
					layer.msg("获取数据失败", {icon: 2,time: 1000});
				}
			});
		} else {
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateDistrict/inputJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					cityPanId=data.form.cityPanId;
					dictionary=data.Dict;
					//填充字典，并选中值
					for (itemname in dictionary){
						for (var num=0;num<dictionary[itemname].length;num++){//num in dictionary[itemname]
							var selText="";
							if(dictionary[itemname][num].itemCode==data.form[itemname])
								selText="selected='true'";
							$("#templateInputCY #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
						}
					}
					//填充表单内容 
					for (var key in data.form){
						$("#templateInputCY #"+key).val(data.form[key]);
						if(key=="templateSmsReceiver"&&data.form[key]!=null) {					       
							var arr=data.form[key].split(',');
							$("#templateInputCY #smsReceiver").selectpicker('val', arr);
						}					    
						if(key=="cityPanId"&&data.form[key]!=null) {
							var panIdData=$("#templateInputCY #tableMuniCY").bootstrapTable("getData",true);
							for(var index in panIdData) { 
								if(data.form[key]==panIdData[index]["id"]) {
									$("#templateInputCY #tableMuniCY").bootstrapTable("check",index);
								}		                    
							}
						}
					}
					//填充机构内容，并选中 
					var orgTree = data.Tbmap["orgTable"];
					$.fn.zTree.init($("#templateInputCY #templateSmsReceiver"), setting,orgTree);
					for (var key in data.form){
						if(key.toLowerCase().indexOf("time")!=-1&&data.form[key]!=null)
							$("#templateInputCY #"+key).val(dateUtil.getLocalTime(data.form[key].time));
						else if(key=="templateSmsReceiver"){
							var strArray=data.form[key].split(",");
							var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
							for(var i=0;i<strArray.length;i++){
								var node = zTree.getNodeByParam("orgId",strArray[i]);
								if(node!=null){
									node.checked = true;
									zTree.updateNode(node);
								}
							}
						}else if(key=="templateSms"){ 
							searchSms(11);
						}else
						$("#templateInputCY #"+key).val(data.form[key]);
					}

					var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
					initGoodsTable(goodTableRows); 
					
					if(goodTableRows){
						$.each(goodTableRows,function(index,item){
							if(item["goodChecked"]==1)
								$("#templateInputCY #tableGoodCY").bootstrapTable("check",index);
						});
					}
					var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
					initTeamTable(teamTableRows); 
					
					if(teamTableRows){
						$.each(teamTableRows,function(index,item){
							if(item["teamChecked"]==1)
								$("#templateInputCY #tableTeamCY").bootstrapTable("check",index);
						});
					}
					initJsdTable();
					initCityYa();
					//自动勾选关联市级预案
					$("#templateInputCY #tableMuniCY").on('post-body.bs.table', function (row,obj) {
						var allMuniTableData = $("#templateInputCY #tableMuniCY").bootstrapTable('getData');//获取表格的所有内容行 
						$.each(allMuniTableData,function(index,item){
							if(item["id"]==cityPanId)
								$("#templateInputCY #tableMuniCY").bootstrapTable("check",index);
						});			
					});
				},
				error : function(error) {
					layer.msg("获取数据失败", {icon: 2,time: 1000});
				}
			});			
		}
	}
	

	function initBtn(){
		if(view)
			$('#templateInputCY #templateInputCYSaveBtn').hide();
		else
			$('#templateInputCY #templateInputCYSaveBtn').click(saveAndClose);
		$('#templateInputCY #templateInputCYCancelBtn').click(cancel);
		$('#templateInputCY #templateInputCYFreshSmsBtn').click(freshSmsBtn);
		$("#templateInputCY #templateCreateTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii:ss',
			autoclose:true,
			pickerPosition:'top-right',
			minView:1,
		});
	}


	function init(_id,_view,_layerIndex){
		id=_id,
		view=_view;
		layerIndex=_layerIndex;
		initXzArea();
		initBtn();
		initData();	
		$('#templateInputCY #templateInputCYForm').bootstrapValidator();
		directoryNavUtil.init($("#templateInputCY"),"templateInputCY");
	}

	return{
	  init:init
	}
})