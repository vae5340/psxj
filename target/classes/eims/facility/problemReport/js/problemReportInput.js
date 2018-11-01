define(['jquery','jqueryForm','bootstrap','bootstrapTable','bootstrapTableCN','layer','fileInput','fileInputLocaleZh','areaUtil','dateUtil','mousewheel','customScrollbar'],
	function($,jqueryForm,bootstrap,bootstrapTable,bootstrapTableCN,layer,fileInput,fileInputLocaleZh,areaUtil,dateUtil){

	//数据填充

	var id,districtYaId,layerIndex,districtArea;


	function initItemBtn(){
		// $('#problemReportInput .deleteImgItem').click(deleteImg);
		// $('#problemReportInput .imgItem').click(changeBigger);
		$('#problemReportInput .deleteImgItem').unbind("click").bind("click",deleteImg);
		$('#problemReportInput .imgItem').unbind("click").bind("click",changeBigger);
	
	}
	function save(){		
		var jsdSelections=$("#problemReportInput #tableJsd").bootstrapTable("getSelections");		        
		if(jsdSelections[0]){
			$("#problemReportInput #jsdId").val(jsdSelections[0].id);
		} else {
			layer.msg("请选择上报积水点", {icon: 0,time: 1000});
			return;			   
		}
		$('#problemReportInput #problemform').attr("action",'/psemgy/yjProblemReport/uploadJson?id='+id);
		$('#problemReportInput #problemform').ajaxSubmit(function(){
	    layer.msg("保存成功", {icon: 1,time: 1000});
      require(['eims/facility/problemReport/js/problemReportList'],function(problemReportList){
      	problemReportList.reloadData();
    	});
    	layer.close(layerIndex);
			// var index = parent.layer.getFrameIndex(window.name);
			// window.parent.closeLayer(index);   			        
		});
	}

	function cancel() {
		layer.close(layerIndex);
	}

	function format_img_del(value, row, index){
		return "<a data-id='"+row.id+"' class='deleteImgItem'><span class='glyphicon' aria-hidden='true'></span>删除</a>";//onclick='deleteImg("+row.id+")'
	}
	function format_img(event,value, row, index){ 
	    var src="/agsupport"+value.filePath;
		return '<img class="imgItem" imgInfo="'+src+'" src="'+src+'"  style="width:350px;"></img>';//onclick="changeBigger(this);"
	}


	var jsd;
	var jsdLocation;
	function createDescription() {
		var problemName = $("#problemReportInput #problemName").val();
		var jsdArea = $("#problemReportInput #jsdArea").val();
		var jsdDeep = $("#problemReportInput #jsdDeep").val();
		var jsdName = jsd || "";
		var jlocation = jsdLocation || "";

		var info = "";
		//info += (problemName == "") ? "" : (problemName + ((jsdName == "" && jsdArea == "" && jlocation == "") ? "" : "，"));
		info += (jsdName == "") ? "" : ("在<" + jsdName + ">有积水" + ((jlocation == "") ? "" : ("，管理单位：" + jlocation)) + ((jsdArea == "") ? "" : "，"));
		info += (jsdArea == "") ? "" : ("积水面积：" + jsdArea + " m²");
		info += (jsdDeep == "") ? "" : ("，积水深度：" + jsdDeep + " m");

		$("#problemReportInput #problemDescription").text(info);
	}

	function jsdSelected(row, element, field) {
		//$(":radio").removeAttr("checked");
		//$("input:radio").attr("checked",false);
		$('input:radio[name="btn"]').removeAttr("checked");
		$("#problemReportInput #radio" + element.id).prop("checked", "checked");
		jsd = element.combName;
		jsdLocation = element.orgDept;

		$("#problemReportInput #problemName").val("'" + jsd + "'有积水")
		
		createDescription();
	}

	//点击放大图片
	function changeBigger(o){
		var $img=$(o.target);
		var width = $img.width()*1.5;
		var height = $img.height()*1.5;
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		if(width>=screenWidth || height>=screenHeight){
			width = $img.width();
			height = $img.height();
		}	
		var imgInfo = $img.attr("imgInfo");
		var index = window.top.layer.open({
			type:1,
			title:false,
			shadeClose:true,
			area:[width,height],
			content:'<img id="closePic" src="'+imgInfo+'" style="width:'+width+'px;height:'+height+'"px></img>'
		});
		$("#problemReportInput #closePic").click(function(){
			window.top.layer.close(index);
		});
		// $(window.top.document).on("click","#closePic",function(){			
		// 	window.top.layer.close(index); 
		// });
	}

	function deleteImg(e){			
		var id=$(e.target).data('id');
		if (confirm("确定删除吗？")) {
			$.ajax({
				method : 'GET',
				url : '/agsupport/sys-uploadfile-manage!deleteJson.action?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					$("#problemReportInput #problemReportTable").bootstrapTable('remove', {field: 'id', values: [id]}); 
					$("#problemReportInput #problemReportTable2").bootstrapTable('remove', {field: 'id', values: [id]}); 								    
				},
				error : function() {
					alert('error');
				}
			});				   				  	     
		}
	}
	function initBtn(){
		$("#problemReportInput #problemReportSaveBtn").click(save);
		$("#problemReportInput #problemReportCancelBtn").click(cancel);

		$('#problemName').change(createDescription);
		$('#jsdArea').change(createDescription);
		$('#jsdDepth').change(createDescription);

		$("#problemReportInput #uploadImage").fileinput({
			showUpload : false,
			showRemove : false,
			language : 'zh',
			allowedPreviewTypes : ['image'],
			allowedFileExtensions : ['jpg','png','gif'],
			maxFileSize : 20000,
			maxFileCount: 10
		});
		$("#problemReportInput #tableJsd").on("click-row.bs.table", jsdSelected);
	}

	function init(_id,_districtYaId,_layerIndex){	 
		id=_id;
		districtYaId=_districtYaId;
		layerIndex =_layerIndex;			
    	initBtn();
		//
		if(districtYaId!="")	$("#problemReportInput #yaId").val(districtYaId);
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : false,
			success : function(data) {
				districtName=data;	
				for(var index =0 ;index < areaUtil.xzArea.length;index++){//var index in areaUtil.xzArea
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;			  
						break;
					}
				}			
			},
			error : function(e) {
				alert('error');
			}
		});
    ///
    var url="/psfacility/pscomb/listNoPageJson?estType=13";
    if(districtArea){
       url+="&area="+districtArea;
    }
	 	//初始化详细内容		
    if(id!=""){
			$("#problemReportInput #uploadInfo").show();
		    $.ajax({
				method : 'GET',
				url : '/psemgy/yjProblemReport/listJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					for (var key in data.row){//var key = 0 ;key< data.row.length;key++
						if(key.toLowerCase().indexOf("status")!=-1){
						   if(data.row[key]=="1")
								$("#problemReportInput #"+key).val(1);
							else if(data.row[key]=="0")
								$("#problemReportInput #"+key).val(0);
						}else if(key.toLowerCase().indexOf("time")!=-1&&data.row[key]!=null){
							$("#problemReportInput #"+key).val(dateUtil.getLocalTime(data.row[key].time));
						}else if(key.toLowerCase().indexOf("jsdid")!=-1){
						    var JsdData=$("#problemReportInput #tableJsd").bootstrapTable("getData",true);
							for(var index in JsdData) { 
								if(data.row[key]==JsdData[index]["id"])
									$("#problemReportInput #tableJsd").bootstrapTable("check",index);
							}
						}else if (key.toLowerCase().indexOf("problemAction")!=-1){
							$("#problemReportInput #" + key).find("option[value='" + data.row[key] + "']").attr("selected", true);
						}else if(key!="fileGroupId"){
						  $("#problemReportInput #"+key).val(data.row[key]);
					  }
					}
					//已处理
					if(data.row["problemStatus"] == 1){
						//隐藏提交按钮
						$("#problemReportInput #submitBtn").css("display","none");
						//显示已处理信息
						var h = '<div class="form-group">'
						+ '<label class="col-sm-2 control-label">处理人</label>'
						+ '<div class="col-sm-10">'
						+ '<div class="col-xs-12" style="font-size:18px">' + data.row["problemSolvePerson"] + '</div>'
						+ '</div>'
						+ '</div>';
						h += '<div class="form-group">'
						+ '<label class="col-sm-2 control-label">处理结果</label>'
						+ '<div class="col-sm-10">'
						//+ '<input class="form-control input-lg" type="text" id="problemSolveResult" name="problemSolveResult" value="' + data.row["problemSolveResult"] + '">'
						+ '<div class="col-xs-12" style="font-size:18px">' + data.row["problemSolveResult"] + '</div>'
						+ '</div>'
						+ '</div>';
						h += '<div class="form-group">'
						+ '<label class="col-sm-2 control-label">处理时间</label>'
						+ '<div class="col-sm-10">'
						//+ '<input class="form-control input-lg" type="text" id="problemSolveResult" name="problemSolveResult" value="' + data.row["problemSolveResult"] + '">'
						+ '<div class="col-xs-12" style="font-size:18px">' + dateUtil.getLocalTime(data.row["problemSolveTime"].time) + '</div>'
						+ '</div>'
						+ '</div>';
						h += '<div class="form-group">'
						+ '<label class="col-sm-2 control-label">处理备注</label>'
						+ '<div class="col-sm-10">'
						//+ '<input class="form-control input-lg" type="text" id="problemSolveRemark" name="problemSolveRemark" value="' + data.row["problemSolveRemark"] + '">'
						+ '<div class="col-xs-12" style="font-size:18px">' + data.row["problemSolveRemark"] + '</div>'
						+ '</div>'
						+ '</div>';
						
						$("#problemReportInput #form-content").append(h)
					}
					//现场展示
					if(data.fileInfos){
						$("#problemReportInput #problemReportView").show();						
						$("#problemReportInput #problemReportTable").bootstrapTable({
							toggle:"table",
							data:data.fileInfos,
							rowStyle:"rowStyle",
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
							{visible: true,title: '图片',align:'center',formatter:format_img},						
							{visible: true,title: '操作',width:100,align:'center',formatter:format_img_del}]
						});		
						initItemBtn();	
					};
					//处理后现场展示	
					if(data.fileSolveInfos){
					   $("#problemReportInput #problemReportView2").show();						   				
					   $("#problemReportInput #problemReportTable2").bootstrapTable({
							toggle:"table",
							data:data.fileSolveInfos,
							rowStyle:"rowStyle",		
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
								 {visible: true,title: '图片',align:'center',formatter:format_img},						
								 {visible: true,title: '操作',width:100,align:'center',formatter:format_img_del}]
						});	
						initItemBtn();
					};
				},
				error : function() {
					alert('error');
				}
			});
		

		}

		//积水点编号
		$.ajax({
			method : 'GET',
			url : url,
			async : false,
			dataType : 'json',
			success : function(data) {
				$("#problemReportInput #tableJsd").bootstrapTable({
					toggle:"table",
					data:data.rows,
					rowStyle:"rowStyle",
					height:250,
					pagination:false,
					cache: false, 
					checkboxHeader:false,
					singleSelect:true,
					clickToSelect:true,
					sidePagination: "server",
					columns: [
						{visible:true,radio:true},
						{field:'combName',visible: true,title: '名称',width:"15%",align:'center'},
						{field:'xcoor',visible: true,title: '经度',align:'center'},
						{field:'ycoor',visible: true,title: '纬度',align:'center'},
						{field:'estDept',visible: true,title: '记录建立单位',align:'center'}
					]
				});
			},
			error : function() {
				alert('error');
			}
		});


		//$("#problemReportInput #content").mCustomScrollbar();
		//$("#problemReportInput #tableJsd").on("click-row.bs.table", jsdSelected);

	};



	return{ 
		init: init
	}
})

