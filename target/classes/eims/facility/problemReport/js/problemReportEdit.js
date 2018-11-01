define(['jquery','layer','areaUtil','dateUtil','fileInput','fileInputLocaleZh','mousewheel','customScrollbar'],function($,layer,areaUtil,dateUtil){
	 function init(_id,_districtYaId,index){
        id=_id;
		districtYaId=_districtYaId;
		pIndex=index;
		$("#problemReportEdit #reportSaveBtn").click(save);
		$("#problemReportEdit #reportCancelBtn").click(cancel);
		if(districtYaId!="")
			$("#problemReportEdit #yaId").val(districtYaId);
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
			},
			error : function(e) {
				alert('error');
			}
		});

		$("#problemReportEdit #uploadImage").fileinput({
			showUpload : false,
			showRemove : false,
			language : 'zh',
			allowedPreviewTypes : ['image'],
			allowedFileExtensions : ['jpg','png','gif'],
				maxFileSize : 20000,
				maxFileCount: 10
		});
		
		if(id!=""){
			$("#problemReportEdit #uploadInfo").show();
			$.ajax({
				method : 'GET',
				url : '/psemgy/yjProblemReport/listJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					console.log(data);
					for (var key in data.row){
						if(key.toLowerCase().indexOf("status")!=-1){
						if(data.row[key]=="1")
								$("#problemReportEdit #"+key).val(1);
							else if(data.row[key]=="0")
								$("#problemReportEdit #"+key).val(0);
						} else if(key.toLowerCase().indexOf("time")!=-1&&data.row[key]!=null){
							$("#problemReportEdit #"+key).val(dateUtil.getLocalTime(data.row[key].time));
						} else if(key.toLowerCase().indexOf("jsdid")!=-1){
							fillJsdTable(data.row[key]);
						} else if (key.indexOf("problemAction")!=-1){
							$("#problemReportEdit #" + key).find("option[value='" + data.row[key] + "']").attr("selected", true);
						}
						else if(key!="fileGroupId"){
							$("#problemReportEdit #"+key).val(data.row[key]);
						}
					}
					//已处理
					if(data.row["problemStatus"] == 1){
						//隐藏提交按钮
						$("#problemReportEdit #submitBtn").css("display","none");
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
						
						$("#problemReportEdit #form-content").append(h)
					}
					
					//for (var index in data.fileInfos){						  
					//$("#problemReportEdit #imgList").append("<img src="+src+" width='100%'>")
					if(data.fileInfos){
					$("#problemReportEdit #problemReportEdit_view").show();						
					$("#problemReportEdit #problemReportEdit_table").bootstrapTable({
							toggle:"table",
							data:data.fileInfos,
							rowStyle:"rowStyle",
							toolbar: '#toolbar',
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
								{visible: true,title: '图片',align:'center',formatter:format_img},						
								{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
							onSuccessLoad: function(){
								$("#problemReportEdit .imgInfo").click(changeBigger);
								$("#problemReportEdit .deleteA").click(deleteImg);
							}	
						});		
					};
					if(data.fileSolveInfos){
					$("#problemReportEdit #problemReportEdit_view2").show();						
					$("#problemReportEdit #problemReportEdit_table2").bootstrapTable({
							toggle:"table",
							data:data.fileSolveInfos,
							rowStyle:"rowStyle",
							toolbar: '#toolbar',
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
								{visible: true,title: '图片',align:'center',formatter:format_img},						
								{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
							onSuccessLoad: function(){
								$("#problemReportEdit .imgInfo").click(changeBigger);
								$("#problemReportEdit .deleteA").click(deleteImg);
							}	
						});		
					};
				},
				error : function() {
					alert('error');
				}
			});
		}
		$("#problemReportEdit #problemReportEdit_content").mCustomScrollbar();
	 }

	var id,districtYaId,districtArea,pIndex;

	
	function save(){	
		/*	
		var jsdSelections=$("#problemReportEdit #tableJsd").bootstrapTable("getSelections");		        
		if(jsdSelections[0]){
			$("#problemReportEdit #jsdId").val(jsdSelections[0].id);
		} else {
			layer.msg("请选择上报积水点");
			return;			   
		}*/
		$('#problemReportEdit #problemReportEdit_Form').attr("action",'/psemgy/yjProblemReport/uploadJson?id='+id);
		$('#problemReportEdit #problemReportEdit_Form').ajaxSubmit(function(){
			layer.msg("保存成功");
			layer.close(pIndex);   			        
		});
	}
			
	function addBtnCol(value, row, index){
		return "<a class=\"deleteA\" data-id=\""+row.id+"\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>删除</a>";
	}
	function format_img(event,value, row, index){ 
		var src="/agsupport"+value.filePath;
		return '<img class="imgInfo" imgInfo="'+src+'" src="'+src+'" style="width:350px;"></img>'
	}
	function format_status(event,value, row, index){
		console.log(value)
	}
	//点击放大图片
	function changeBigger(e){
		var o=e.target;
		var width = $(o).width()*1.5;
		var height = $(o).height()*1.5;
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		if(width>=screenWidth || height>=screenHeight){
			width = $(o).width();
			height = $(o).height();
		}	
		var imgInfo = $(o).attr("imgInfo");
		var index = layer.open({
			type:1,
			title:false,
			shadeClose:true,
			area:[width,height],
			content:'<img id="closePic" src="'+imgInfo+'" style="width:'+width+'px;height:'+height+'"px></img>'
		});
		$(window.top.document).on("click","#closePic",function(){			
			layer.close(index); 
		});
	}

	function deleteImg(e){		
		var id=$(e.target).data("id");
		if (confirm("确定删除吗？")) {
			$.ajax({
				method : 'GET',
				url : '/agsupport/sys-uploadfile-manage!deleteJson.action?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					$("#problemReportEdit #problemReportEdit_table").bootstrapTable('remove', {field: 'id', values: [id]}); 					    
				},
				error : function() {
					alert('error');
				}
			});				   				  	     
		}
	}

	function createDescription() {
		var problemName = $("#problemReportEdit #problemName").val();
		var jsdArea = $("#problemReportEdit #jsdArea").val();
		var jsdDeep = $("#problemReportEdit #jsdDeep").val();
		var problemDescription = $("#problemReportEdit #problemDescription").val();

		var info = "";
		//info += (problemName == "") ? "" : (problemName + ((jsdName == "" && jsdArea == "" && jlocation == "") ? "" : "，"));
		//info = problemDescription.substring(0,problemDescription.indexOf("管"));
		info += (problemName == "") ? "" : (problemName);
		info += (jsdArea == "") ? "" : (",积水面积：" + jsdArea + " m²");
		info += (jsdDeep == "") ? "" : ("，积水深度：" + jsdDeep + " m");

		$("#problemReportEdit #problemDescription").val(info);
	}

	function fillJsdTable(jsdId){
		var url="/psfacility/pscomb/listNoPageJson?estType=13&id="+jsdId;
		if(districtArea){
			url+="&area="+districtArea;
		}
		
		$.ajax({
			method : 'GET',
			url : url,
			async : false,
			dataType : 'json',
			success : function(data) {
				$("#problemReportEdit #tableJsd").bootstrapTable({
					toggle:"table",
					data:data.rows,
					rowStyle:"rowStyle",
					cache: false,
					columns: [
						{field:'combName',visible: true,title: '名称',width:"45%",align:'center'},
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
	}

	function cancel() {
		layer.close(pIndex);
	}

	return {
		init: init
	}
});	