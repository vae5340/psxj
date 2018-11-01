//数据填充
function getQueryStr(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
var districtYaId=getQueryStr("districtYaId");
var view=getQueryStr("view");		    
if(districtYaId!=""){
	$("#yaId").val(districtYaId);
}
var districtArea="";
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : false,
	success : function(data) {
		var districtName=data;	
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
				districtArea=nnArea[index].code;
				break;
			}
		}
	},
	error : function(e) {
		alert('error');
	}
});

function save(){		
	var jsdSelections=$("#tableJsd").bootstrapTable("getSelections");		        
	if(jsdSelections[0]){
	   $("#jsdId").val(jsdSelections[0].id);
	}
	else{
		parent.layer.msg("请选择上报积水点");
		return;			   
	}
	$('#problemform').attr("action",'/agsupport/yj-problem-report!uploadJson.action?id='+id);
	$('#problemform').ajaxSubmit(function(){
		parent.layer.msg("保存成功");
		var index = parent.layer.getFrameIndex(window.name);
		window.parent.closeLayer(index);   			        
	});
}
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
		
function addBtnCol(value, row, index){
	return "<a onclick=\"deleteImg("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>删除</a>";
}

function format_img(event,value, row, index){
    var src="/agsupport"+value.filePath;
	return '<img imgInfo="'+src+'" src="'+src+'" onclick="changeBigger(this);" style="width:350px;"></img>'
}

//点击放大图片
function changeBigger(o){
	var width = $(o).width()*2;
	var height = $(o).height()*2;
	var imgInfo = $(o).attr("imgInfo");
	window.top.layer.open({
		type:1,
		title:false,
		//closeBtn:true,
		shadeClose:true,
		area:[width,height],
		content:'<img src="'+imgInfo+'" style="width:'+width+';height:'+height+'"></img>'
	});
}				
		
function deleteImg(id){					  
	if (confirm("确定删除吗？")){
		$.ajax({
			method : 'GET',
			url : '/agsupport/sys-uploadfile-manage!deleteJson.action?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
					$("#table").bootstrapTable('remove', {field: 'id', values: [id]}); 					    
			},
			error : function() {
				alert('error');
			}
		});				   				  	     
	}
}
$(function(){
	var tableColumns;
    if(view){
       $("#uploadDiv").hide();
       tableColumns=[{visible: false,field: 'id'},						
		 {visible: true,title: '图片',align:'center',formatter:format_img}];
    }else{	    						    
	    $("#uploadImage").fileinput({
	        showUpload : false,
	        showRemove : false,
	        language : 'zh',
	        allowedPreviewTypes : ['image'],
	        allowedFileExtensions : ['jpg','png','gif'],
       		maxFileSize : 20000,
       		maxFileCount: 10
	    });
		tableColumns=[{visible: false,field: 'id'},						
			{visible: true,title: '图片',align:'center',formatter:format_img}];
    }
    
    var url="/agsupport/ps-comb!listJson.action?estType=13";
    if(districtArea){
       url+="&area="+districtArea;
    }
    if(id!=""){
        $("#uploadInfo").show();
		$.ajax({
			method : 'GET',
			url : '/agsupport/yj-problem-report!listJson.action?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				console.log(data)
				for (var key in data.row){
					if(key.toLowerCase().indexOf("status")!=-1){
					   if(data.row[key]=="1")
							$("#"+key).val(1);
						else if(data.row[key]=="0")
							$("#"+key).val(0);
					}
					else if(key.toLowerCase().indexOf("time")!=-1&&data.row[key]!=null){
						$("#"+key).val(getLocalTime(data.row[key].time));
					}
					else if(key.toLowerCase().indexOf("jsdid")!=-1){
					    var JsdData=$("#tableJsd").bootstrapTable("getData",true);
						for(var index in JsdData) { 
							if(data.row[key]==JsdData[index]["id"])
								$("#tableJsd").bootstrapTable("check",index);
						}
					}
					else if (key.toLowerCase().indexOf("problemAction")!=-1){
						$("#" + key).find("option[value='" + data.row[key] + "']").attr("selected", true);
					}
					else if(key!="fileGroupId"){
					   	$("#"+key).val(data.row[key]);
				    }
				}
				//已处理
				if(data.row["problemStatus"] == 1){
					//隐藏提交按钮
					//$("#submitBtn").css("display","none");
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
					+ '<div class="col-xs-12" style="font-size:18px">' + getLocalTime(data.row["problemSolveTime"].time) + '</div>'
					+ '</div>'
					+ '</div>';
					h += '<div class="form-group">'
					+ '<label class="col-sm-2 control-label">处理备注</label>'
					+ '<div class="col-sm-10">'
					//+ '<input class="form-control input-lg" type="text" id="problemSolveRemark" name="problemSolveRemark" value="' + data.row["problemSolveRemark"] + '">'
					+ '<div class="col-xs-12" style="font-size:18px">' + data.row["problemSolveRemark"] + '</div>'
					+ '</div>'
					+ '</div>';
					
					$("#problemform").append(h)
				}
				
				//for (var index in data.fileInfos){						  
				   //$("#imgList").append("<img src="+src+" width='100%'>")
				if(data.fileInfos){
					$("#view").show();						
					$("#table").bootstrapTable({
						toggle:"table",
						data:data.fileInfos,
						rowStyle:"rowStyle",
						toolbar: '#toolbar',
						cache: false, 
						striped: true,
						columns: [{visible: false,field: 'id'},				
							 {visible: true,title: '图片',align:'center',formatter:format_img},						
							 {visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}]
					});		
				};
				if(data.fileSolveInfos){
				   $("#view2").show();						
				   $("#table2").bootstrapTable({
						toggle:"table",
						data:data.fileSolveInfos,
						rowStyle:"rowStyle",
						toolbar: '#toolbar',
						cache: false, 
						striped: true,
						columns: [{visible: false,field: 'id'},				
							 {visible: true,title: '图片',align:'center',formatter:format_img},						
							 {visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}]
					});
				};
			},
			error : function() {
				alert('error');
			}
		});
	}
	$(window).load(function(){
		$("#content").mCustomScrollbar();
	});
});

function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}