define(['jquery','layer','awaterui','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapValidator','bootstrapValidatorCN'],function($,layer,awaterui,dateUtil,areaUtil){
   function init(_template_id,_id,_view,_districtUnitId,_yaCityId){
	   template_id=_template_id;
	   id=_id;
	   view=_view; 
	   districtUnitId=_districtUnitId;
	   yaCityId=_yaCityId;

	   if(view)
		 $("#saveRecordAlarmBtn").hide();
	   else
	  	 $("#saveRecordAlarmBtn").click(saveAndClose);
	   $("#cancelRecordAlarmBtn").click(cancel);

	   $("#recordAlarmInputContent #templateCreateTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii:ss',
			autoclose:true,
			pickerPosition:'top-right'
		});

	    $.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : false,
			success : function(data) {
				var districtName=data;	
				for(var index in areaUtil.xzArea){
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;
						break;		  
					}
				}
				recordAlarmInputContent
				$("#recordAlarmInputContent #tableJsd").bootstrapTable({
					toggle:"table",
					height:400,
					url:"/psfacility/pscomb/listJson?estType=13&area="+districtArea,
					rowStyle:"rowStyle", 
					cache: false, 
					pagination:true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10,25],
					queryParams: queryParams,
					sidePagination: "server",
					columns: [
						{field:'combName',visible: true,title: '名称',width:"45%",align:'center'},
						{field:'xcoor',visible: false,title: '经度',align:'center'},
						{field:'ycoor',visible: false,title: '纬度',align:'center'},
						{field:'estDept',visible: true,title: '记录建立单位',width:"35%",align:'center'},
						{visible: true,title: '操作',align:'center',formatter:addBtnCol}],
					onLoadSuccess: function(){
						$(".editDispatch").click(detailDialog);
					}
				});
			},
			error : function(e) {
				layer.msg("获取当前用户机构信息失败");
			}
		});

		if(template_id){
			url='/psemgy/yaTemplateDistrict/inputJsonRecord?id='+template_id;
			$("#recordAlarmInputContent #recordCreatePerson").hide();
		} else {
			url='/psemgy/yaRecordDistrict/inputJson?id='+id;
		}  

		$.ajax({
			method : 'GET',
			url :url,
			async : true,
			dataType : 'json',
			success : function(data) {
				var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						var selText="";
						if(dictionary[itemname][num].itemCode==data.form[itemname])
							selText="selected='true'";
						$("#recordAlarmInputContent #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
					}
				}
				
				var orgTree = data.Tbmap["orgTable"];
				$.fn.zTree.init($("#recordAlarmInputContent #templateSmsReceiver"), setting,orgTree);					
				
				$("#recordAlarmInputContent #templateId").val(template_id);
				for (var key in data.form){
					if(key=="id")
					continue;
					if(key=="templateCreateTime"&&data.form[key]!=null){                        						
						$("#recordAlarmInputContent #templateCreateTime").val(dateUtil.getLocalTime(data.form[key].time));
					}
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
					}
					else if(key=="templateRemark")
						$("#recordAlarmInputContent #remark").val(data.form[key]);
					else
						$("#recordAlarmInputContent #"+key).val(data.form[key]);
				}
				
				if(data.Goodmap){
					var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
					$("#recordAlarmInputContent #tableGood").bootstrapTable({
						toggle:"table",
						data:goodTableRows,
						rowStyle:"rowStyle",
						height:450,
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
							{field:'amount',visible: true,title: '数量',align:'center'},
							{field:'unit',visible: true,title: '单位',align:'center'}
						]
					});
					
					$.each(goodTableRows,function(index,item){
						if(item["goodChecked"]==1)
							$("#recordAlarmInputContent #tableGood").bootstrapTable("check",index);
					});
				}

				if(data.Teammap){
					var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
					$("#recordAlarmInputContent #tableTeam").bootstrapTable({
						toggle:"table",
						data:teamTableRows,
						rowStyle:"rowStyle",
						height:450,
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
							{field:'dispAmount',visible: true,title: '调度人数',formatter:getInputNumTeam,align:'center'},
							{field:'amount',visible: true,title: '人数',formatter:peopleFormat,align:'center'}
						]
					});

					$.each(teamTableRows,function(index,item){
						if(item["teamChecked"]==1)
							$("#tableTeam").bootstrapTable("check",index);
					});	
				}   	  
			},
			error : function(e) {
				layer.msg("加载预案信息失败");
			}
		});

		$("#recordAlarmInputContent #tableGood").on('post-body.bs.table', function (row,obj) {
			$("#recordAlarmInputContent .fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
		});
		
		$("#recordAlarmInputContent #tableTeam").on('post-body.bs.table', function (row,obj) {
			$("#recordAlarmInputContent .fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
		});
		
		$("#recordAlarmInputContent #tableJsd").on('post-body.bs.table', function (row,obj) {
			$("#recordAlarmInputContent .fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
		});
   }


	var template_id,id,view, districtUnitId,yaCityId;

	var setting = {
		check: {
			enable: true,
			chkStyle : "checkbox",
			chkboxType: { "Y": "s", "N": "s" }
		},
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
	var districtArea="";
			
	function getInputNumGood(value, row, index){
		if(value)
			return "<input type='text' name='grecnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
		else
			return "<input type='text' name='grecnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
	}

	function getInputNumTeam(value, row, index){
		if(value)
			return "<input type='text' name='trecnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
		else
			return "<input type='text' name='trecnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
	}

	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
				
	function addBtnCol(value, row, index){
		return "<button type=\"button\" class=\"btn editDispatch\" style=\"border:1px solid transparent;\" data-id="+row.id+" data-name='"+row.combName+"'><span class=\"glyphicon\" aria-hidden=\"true\"></span>调度详细</button>";
	}

	function peopleFormat(value, row, index){
		return value+"人";		
	}
			
	var firstDispatch=true;
	function detailDialog(e){
		//onclick=\"javascript:recordAlarmInput.detailDialog("+row.id+",'"+row.combName+"')
		var combId = $(e.target).data("id");
		var jsdName = $(e.target).data("name");
		
		/*if(view){
			$.get("/psemgy/eims/dispatch/pages/district/template/jsdDispatch.html",function(h){
				layer.open({
					type: 1,
					title: jsdName+" 调度详情",
					shadeClose: true,
					shade: 0,
					area: ['700px', '440px'],
					content: h,
					success: function(layero,index){
						require(["psemgy/eims/dispatch/pages/district/template/js/jsdDispatch"],function(jsdDispatch){
							//combId="+combId+"&modelId="+id+"&yaType=2&type=4&view=1"
							jsdDispatch.init(combId,id,4,1,SetRecordDispatchIds,index)
						});
					}
				});	
			});			         
		} else {*/
			//分为两种情况，当预案未进行积水点人员物资调整的时候按照原方式（南宁现状）是可以的，但是一旦调整，模板时候的调度保存不应该再纳入计算中，
	    	//不然会产生逻辑错误，顾虑到此种情况，启动预案时先禁止进行人员物资调整	
			$.get("/psemgy/eims/dispatch/pages/district/record/jsdDispatchRecord.html",function(h){
				layer.open({
					type: 1,
					title: jsdName+" 调度详情",
					shadeClose: true,
					shade: 0,
					area: ['700px', '440px'],
					content: h,
					success: function(layero,index){
						require(["psemgy/eims/dispatch/pages/district/record/js/jsdDispatchRecord"],function(jsdDispatchRecord){
							//combId="+combId+"&modelId="+template_id+"&type=2
							jsdDispatchRecord.init(combId,template_id,2,1,index);
						});
					}
				});	
			});
		//}
	}
	var url;
			
	var closePage=false;
	function saveAndClose(){
		closePage=true;
		$.ajax({  
			url: "/psemgy/yaRecordDistrict/checkStatus",
			data:{yaCityId:yaCityId},
			async:false,
			type: "get",
			dataType: "json",
			success: function(data) {
				if(data.statusId==0){
					//未启动预案
					save();
				} else if(data.statusId==1){
					//启动中
					layer.msg("启动预案失败，当前已有预案启动中");
				} else if(data.statusId==2) {
					//已结束
					layer.msg("启动预案失败，当前已有预案启动，且预案已经结束");
				} else {
					//未知状态
					layer.msg("启动预案失败，未知错误");
				}
			},
			error:function(){
				layer.msg("检查成员单位预案状态失败");
			}
		});
	}	
				
	function save(){
		var goods=$("#recordAlarmInputContent #tableGood").bootstrapTable("getData");
		var goodIds=[];
		var gDispAmounts=[];
		for(index in goods) {
			var amount=$("input[name='grecnumbervalue"+goods[index]["id"]+"']").val();
			if(amount>0){
				goodIds.push(goods[index]["id"]);
				gDispAmounts.push(amount);
			}
		}
		var goodIdsStr=goodIds.join(",");
		var gDispAmountsStr=gDispAmounts.join(",");
		
		var teams=$("#recordAlarmInputContent #tableTeam").bootstrapTable("getData");
		var teamIds=[];
		var tDispAmounts=[];
		for(index in teams) {
			var amount=$("input[name='trecnumbervalue"+teams[index]["id"]+"']").val();
			if(amount>0){
				teamIds.push(teams[index]["id"]);
				tDispAmounts.push(amount);
			}				
		}
		var teamIdsStr=teamIds.join(",");
		var tDispAmountsStr=tDispAmounts.join(",");
		
		if(firstDispatch){
			$.ajax({  
				url: "/psemgy/yaTemplateDistrict/testDispatchAlter",
				data:"goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&id="+template_id,
				async:false,
				type: "get",
				dataType: "json",
				success: function(data) {
					if(data){
						layer.confirm('人员或物资调度已经调整，继续会将当前调整保存并无积水点调度信息数据，是否继续？', {
							btn: ['是','否'] //按钮
						}, function(index){ 
							var dataparam=getStrParamByArray()+"&goodIdsStr="+
							encodeURIComponent(goodIdsStr)+"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
							"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr;
							$.ajax({
								type: 'post',
								url : '/psemgy/yaRecordDistrict/saveJson',
								data:dataparam,
								dataType : 'json',  
								success : function(data) {
									if(closePage){
										layer.msg(data.result);
										showTabWindow(data.districtUnitId,data.id)			
										awaterui.closeTab();
									} else if(id=="") {
										id=data.id;
										$("#recordAlarmInputContent #id").val(id);										    
									}
								},
								error : function(e) {
									alert('error');
								}
							});							
						}, function(index){
							closePage=false;				 
							layer.close(index);
							return;
					});  					      
				}else if(data==0){
					//将模板中所有调度信息复制至预案,提前获取id
						$.ajax({
						method : 'GET',
						url :"/psemgy/yaRecordDistrict/copyTemplateDispatch?templateId="+template_id,
						async : true,
						dataType : 'json',
						success : function(data) {		
						if(data>0){
							id=data;
							$("#recordAlarmInputContent #id").val(id);
							var dataparam=getStrParamByArray()+"&goodIdsStr="+
							encodeURIComponent(goodIdsStr)+"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
							"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr;
							$.ajax({
								type: 'post',
								url :'/psemgy/yaRecordDistrict/saveJson',
								data:dataparam,
								dataType : 'json',  
								success : function(data) {
									if(closePage){
										layer.msg(data.result);
										showTabWindow(data.districtUnitId,data.id)			
										awaterui.closeTab();
									}
									else if(id==""){
										id=data.id;
										$("#recordAlarmInputContent #id").val(id);										    
									}
								},
								error : function(e) {
									alert('error');
								}
							});							  	               
						}
						},
						error : function() {
							alert('error');
						}
					});	
				
				}
				}
			}); 
		} else {		
			var dataparam=getStrParamByArray()+
				"&goodIdsStr="+encodeURIComponent(goodIdsStr)+
				"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
				"&gDispAmountsStr="+encodeURIComponent(gDispAmountsStr)+
				"&tDispAmountsStr="+encodeURIComponent(tDispAmountsStr);
			$.ajax({
				type: 'post',
				url : '/psemgy/yaRecordDistrict/saveJson?'+dataparam,
				async:false,
				dataType : 'json',  
				success : function(data) {	
					if(closePage){
						layer.msg(data.result);
						showTabWindow(data.districtUnitId,data.id)			
						awaterui.closeTab();
					}
					else if(id==""){
						id=data.id;
						$("#recordAlarmInputContent #id").val(id);						      
					}
				},
				error : function(e) {
					alert('error');
				}
			});
		}
	}
			
	function showTabWindow(districtUnitId,districtYaId){
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/main.html","成员单位调度室",function(){
              require(["psemgy/eims/dispatch/pages/district/js/main"],function(main){
				 main.init(districtYaId,districtUnitId)
			  });
		});	
	}

	function getStrParamByArray(){
		var param=$("#recordAlarmInputContent #form").serialize();
		
		//添加机构树状参数
		var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver"),
		nodes=treeObj.getCheckedNodes(true),
		checkIds="";
		for(var i=0;i<nodes.length;i++){
			if(checkIds=="")
				checkIds=nodes[i].orgId;
			else
				checkIds+= ","+nodes[i].orgId;
		}
		param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
		
		param+="&districtUnitId="+encodeURIComponent(districtUnitId)+"&yaCityId="+encodeURIComponent(yaCityId)+"&status=1";
		
		return param;
	}

	function cancel() {
		awaterui.closeTab();
	}

	function freshSmsBtn() {
		$.ajax({
			type: 'post',
			url : '/psemgy/yaGoodDispatch/loadSmsJsdDispatchRecord',
			data : {modelId:template_id},
			dataType : 'text',
			success : function(data){
				$("#recordAlarmInputContent #templateSms").val(data);
				layer.msg('更新短信内容成功');
			},
			error : function(){
				layer.msg('加载短信内容失败');
			}
		});
	}

	 //设置启动预案的积水点调度ids-启动预案后将该调度的model改为当前预案id
	 function SetRecordDispatchIds(data){
        var goodDispatchIds =$("#goodDispatchIds").val();
        if(goodDispatchIds)
            $("#goodDispatchIds").val(goodDispatchIds+","+data.goodDispatchIds);
        else
            $("#goodDispatchIds").val(data.goodDispatchIds);
        
        var teamDispatchIds =$("#teamDispatchIds").val();
        if(teamDispatchIds)
            $("#teamDispatchIds").val(teamDispatchIds+","+data.teamDispatchIds);
        else
           $("#teamDispatchIds").val(data.teamDispatchIds);
    }

	return{
		init: init
	}
});	