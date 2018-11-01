define(["jquery","layer","jqueryForm","psemgy/eims/dispatch/pages/district/map/js/initMap","customScrollbar","fileInput","fileInputLocaleZh","bootstrapTable","bootstrapTableCN"],function($,layer,jqueryForm,initMap){

	var id,map,pIndex;
	var mapClickEventObject;
	var districtArea;

	function init(_id,districtYaId,index) {
		id = _id;
		pIndex = index;

		$("#yaId").val(districtYaId);
		map = initMap.getMap();

		$("#otherProblemSubmitBtn").click(submit_upload);
		$("#otherProblemCancelBtn").click(cancel);
		$("#locationPointBtn").click(locationPoint);
		$("#uploadImage").fileinput({
			showUpload : false,
			showRemove : false,
			language : 'zh',
			allowedPreviewTypes : ['image'],
			allowedFileExtensions : ['jpg', 'png', 'gif'],
			maxFileSize : 20000,
			maxFileCount : 10
		});
		/*$.ajax({
			method  :   'post',
			url  :   '/psemgy/yaRecordDistrict/getNowDistrict',
			async  :  false,
			dataType : 'json',
			success  :  function(data)  {
				if (data) {
					$("#yaId").val(data.id);
				}
			},
			error  :  function(xhr, error, errorThrown)  {
				alert('读取单位编号失败！' + error);
			}
		});*/
		//获取事件类型的option，在json/otherProblemType.json
		
		if(id){
			$("#upload").hide();
			$.ajax({
				method : 'GET',
				url : '/psemgy/yjProblemReport/listJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					for (var key in data.row){
						if(key.toLowerCase().indexOf("time")!=-1&&data.row[key]!=null){
							$("#"+key).val(getLocalTime(data.row[key].time));
						} else if (key.toLowerCase().indexOf("problemName")!=-1){
							$("#" + key).find("option[text='" + data.row[key] + "']").attr("selected", true);
						} else if(key!="fileGroupId"){
							$("#"+key).val(data.row[key]);
						}
					}
					
					if(data.row.latitude!=null&&data.row.longitude!=null){
						$("#locationStatus").text("已定位");
						$("#locationStatus").css("color","black");
					}
					
					if(data.fileInfos){
						$("#otherProblemView").show();
						$("#otherProblemTable").bootstrapTable({
							toggle:"table",
							data:data.fileInfos,
							rowStyle:"rowStyle",
							toolbar: '#toolbar',
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
								{visible: true,title: '图片',align:'center',formatter:format_img},						
								{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
						    onLoadSuccess: function(){
								$(".deleteImgA").click(deleteImg);
								$(".changeImg").click(initMap.changeBigger);
							}		
						});		
					};
					if(data.fileSolveInfos){
					$("#otherProblemView2").show();						
					$("#otherProblemTable2").bootstrapTable({
							toggle:"table",
							data:data.fileSolveInfos,
							rowStyle:"rowStyle",
							toolbar: '#toolbar',
							cache: false, 
							striped: true,
							columns: [{visible: false,field: 'id'},				
								{visible: true,title: '图片',align:'center',formatter:format_img},						
								{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}],
							onLoadSuccess: function(){
								$(".deleteImgA").click(deleteImg);
								$(".changeImg").click(initMap.changeBigger);
							}		
						});		
					};
					//已处理
					if(data.row["problemStatus"] == 1){
						//隐藏提交按钮
						$("#submitBtn").css("display","none");
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
						
						$("#form-content").append(h)
					}
				},
				error : function() {
					alert('error');
				}
			});
		}
		$("#otherProblemInputDiv").mCustomScrollbar();
	}

	//提交按钮方法
	function submit_upload() {
		//时间名称的验证
		if ($("#problemName").val() === "") {
			layer.msg("请选择事件类型！", {
				icon : 2
			})
			return;
		}
		
		$('#problemform').attr("action", '/psemgy/yjProblemReport/uploadJson');
		var r = confirm("确定要提交？")
			if (r) {
				$('#problemform').ajaxSubmit({
					url : '/psemgy/yjProblemReport/uploadJson',
					type : 'post',
					data:{"problemAction" : 5},
					success : function () {
						layer.msg("问题上报成功");
						cancel();
					},
					error : function (XHR, error, errorThrown) {
						layer.msg("上传失败:" + error, {
							icon : 2
						})
					}
				});
				//parent.location.reload()
			}
			//layer.msg("操作成功")
	}

	function getProblemType(){
		$.ajax({
			url:"/awater/mobile/json/otherProblemType.json",
			dataType:"json",
			success:function(res){
				//console.log(res)
				for(var a in res){
					$("#"+a).append(res[a]);
				}
			},
			error:function( XHR ,error,errorThrown){
				layer.msg("获取问题类型失败！" + error)
			}
		})
	}

	var quality = 40;
	var imgStr = "";
	function imgCompress() {

		var imgFiles = document.getElementById("uploadImage").files;
		console.log(imgFiles);
		if (imgFiles.length == 0) {
			return;
		} else {
			for (var a = 0; a < imgFiles.length; a++) {
				var file = imgFiles[a];
				var reader = new FileReader();

				reader.readAsDataURL(file);

				reader.onload = function () {
					var i = new Image();//document.getElementById("uploadImage");
					i.src = this.result;

					var obj = compress(i, quality);
					i.src = obj.result_image_obj.src;

					// data是压缩后的图片的64位编码数据，可以用post传
					var data = obj.newImageData;
					i.src = data;
					//console.log(data);
				}
			}
		}
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
					$("#otherProblemTable").bootstrapTable('remove', {field: 'id', values: [id]}); 					    
				},
				error : function() {
					alert('error');
				}
			});				   				  	     
		}
	}

	function addBtnCol(value, row, index){
		return "<a class=\"deleteImgA\" data-id="+row.id+"><span class=\"glyphicon\" aria-hidden=\"true\"></span>删除</a>";
	}

	function format_img(event,value, row, index){ 
		var src="/agsupport"+value.filePath;
		return '<img class=""changeImg" imgInfo="'+src+'" src="'+src+'" style="width:350px;"></img>'
	}

	function locationPoint(){
		layer.msg("请在地图点选定位");
		pickPoint(window);
		layer.min(pIndex);
	}
	
	//其他问题上报，点位采集
	function pickPoint(OPwindow){
		mapClickEventObject=map.on("mouse-down", function (p) {
			var x=p.mapPoint.x;
			var y=p.mapPoint.y;
			
			OPwindow.$("#longitude").val(x);
			OPwindow.$("#latitude").val(y);
			maxThisLayer();
			
			OPwindow.$("#locationStatus").text("已定位");
			OPwindow.$("#locationStatus").css("color","black");
			
			mapClickEventObject.remove();
		});
	}

	function maxThisLayer(){
		layer.restore(pIndex);
	}

	function cancel() {
		layer.close(pIndex);
	}

	return {
		init: init
	}
});