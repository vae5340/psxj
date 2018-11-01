//问题任务脚本
var statusTypes = null; //状态类型
$(function(){
	//获取状态类型
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-ccproblem!ajaxGetStatusType.action",
		async: false,
		dataType: "json",
		success: function(data){
			statusTypes = data;
		},
		error:function(XHR, textStatus, errorThrown){
		}		
	});
	
});


function loadTypeAndDw(){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-ccproblem!ajaxWebinput.action",
//		data: {"id":id},
		dataType: "json",
		success: function(data){
			var types = data.types;
			var dws = data.dws;
			$("#type").empty();
			$("#dw").empty();
			var typeOptions = "";
			var dwOptions = "";
			$.each(types, function(index){
				typeOptions += "<option value='"+types[index].value+"'>"+types[index].label+"</option>";
			});
			$.each(dws, function(index){
				dwOptions += "<option value='"+dws[index].value+"'>"+dws[index].label+"</option>";
			});
			var userId = data.userId;
			$("input[name='form.username']").val(userId);
			$("#type").append(typeOptions);
			$("#dw").append(dwOptions);
	

		},
		error:function(XHR, textStatus, errorThrown){
			alert('error: ' + errorThrown);
		}
	});
  if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getLocation);
	}
	else{}
}
//加载问题类型和处理单位以及用户ID
function getLocation(position){
	
	if(position.coords.latitude!=null && position.coords.longitude!=null){
		$("input[name='form.longitude']").val(position.coords.longitude+"");
		$("input[name='form.latitude']").val(position.coords.latitude+"");
		
	}
}

//根据问题类型加载处理单位
function loadDwByType(selObject){
	if(selObject!=null && selObject!=""){
		$.get("/agsupport_hangzhou/new-ccproblem!ajaxGetDwByType.action",{id:selObject.value},function(data){
			var html="";
			if(data!=null&&data!=""){
				data=eval(data);
				for(var i=0;i<data.length;i++){
					html+="<option value='"+data[i].value+"'>"+data[i].label+"</option>"
				}
			}
			$("#dw").empty();
			$("#dw").html(html);
		});
		$("#problemtype").val(selObject.options[selObject.selectedIndex].text);
	}
}


//保存或修改
function ajaxSave(){
	//if($('#inputForm').validate().form()){
		$.ajax({
			type: "POST",
			url: "/agsupport_hangzhou/new-ccproblem!ajaxSave.action",
			data:$("#inputForm").serialize(),
			dataType: "json",
			success: function(data){
				if(data){
					$.messager.alert('提示','保存成功!');
					$("#list").datagrid("reload");
					slideDiv();
				}else{
					$.messager.alert('提示','保存失败!');
				}
			},
			error:function(XHR, textStatus, errorThrown){
				$.messager.alert('提示','保存失败!');
			}		
		});
	//}
}

//处理
function handle(id){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-ccproblem!ajaxInput.action",
		data: {"id":id},
		dataType: "json",
		success: function(data){
			//载入表单内容
			var form = data.form;
			$("#emergencydreege").html(form.emergencydreege);
			$("#username").html(form.username);
			$.each(statusTypes, function(index){
				var s_value = form.handlestate+'';
				var s_type = statusTypes[index].value+'';
				if(s_value==s_type){
					$("#status").html(statusTypes[index].label);
					return ;
				}
			});
			var dws = data.dws;
			var dwOptions="";
			$.each(dws, function(index){
				if(form.mainun==dws[index].value){
					dwOptions += "<option selected value='"+dws[index].value+"'>"+dws[index].label+"</option>";
				}else{
					dwOptions += "<option value='"+dws[index].value+"'>"+dws[index].label+"</option>";
				}
				
			});
			$("input[name='form.id']").val(id);
			$("input[name='id']").val(id);
			$("#dw").empty();
			$("select[name='form.mainun']").append(dwOptions);
			$("input[name='form.matters']").val(form.matters);
			$("input[name='form.location']").val(form.location);
			$("input[name='form.uploadtimeStr']").val(form.uploadtimeStr);
			$("input[name='form.source']").val(form.source);
			$("input[name='form.problemtype']").val(form.problemtype);
			$("input[name='form.involunit1']").val(form.involunit1);
			$("textarea[name='form.description']").val(form.description);//~
			
			//载入记录表内容
			var tasks = data.tasks;
			var tbody = "";
			$.each(tasks, function(index){
				var stepName = "";
				var sysUserName="";
				var timeStr="";
				var dealcontent="";
				if(tasks[index].stepName!=null){
					stepName = tasks[index].stepName
				}
				if(tasks[index].sysUserName!=null){
					sysUserName = tasks[index].sysUserName
				}
				if(tasks[index].timeStr!=null){
					timeStr = tasks[index].timeStr
				}
				if(tasks[index].dealcontent!=null){
					dealcontent = tasks[index].dealcontent
				}
				tbody+="<tr><td>"+stepName+"</td>"
				+ "<td>"+sysUserName+"</td>"
				+ "<td>"+timeStr+"</td>"
				+ "<td>"+dealcontent+"</td>"
				+"</tr>";
			});
			$("#tbody").empty();
			$("#tbody").append(tbody);
			
			slideDiv();
			slideTab('info');
			
			
			//按钮
			var next = '<button type="button" class="btn btn-info" onclick="taskDownDlg();">任务下发</button>';
			var over = '<button type="button" class="btn btn-info" onclick="jaDlg();">直接结案</button>';
			var cancel = '<button type="button" class="btn btn-info" onclick="cancelProblem();">问题作废</button>';
			var save = '<button type="button" class="btn btn-info" onclick="ajaxSave();">保存修改</button>';
			var ret = '<button type="button" class="btn btn-info" onclick="slideDiv();">返回</button>';
			$("#btn").empty();
			if(form.handlestate+''=='0'){
				$("#btn").append(next+over+cancel+save+ret);
			}else if(form.handlestate+''=='1' || form.handlestate+''=='2' || form.handlestate+''=='3' || form.handlestate+''=='4'){
				$("#btn").append(over+cancel+ret);
			}else{
				$("#btn").append(ret);
			}
			
			//图片
			var photos = data.photos;
			var photoHtml = "";
			var active = "active";
			$.each(photos, function(index){
				photoHtml += "<center><div class='item "+active+"'><img src='/agsupport_hangzhou"+photos[index].photopath+"' style='width:338px;height:200px'></div></center>";	
				active="";		
			});
			if(photoHtml!=""){
				$("#photo").empty();
				$("#photo").append(photoHtml);
			}
		
			var afterPhotos = data.afterPhotos;
			var afterPhotoHtml = "";
			active = "active";
			$.each(afterPhotos, function(index){
				afterPhotoHtml += "<center><div class='item "+active+"'><img src='/agsupport_hangzhou"+afterPhotos[index].photopath+"' style='width:338px;height:200px'></div></center>";	
				active="";		
			});
			if(afterPhotoHtml!=""){
				$("#afterPhotos").empty();
				$("#afterPhotos").append(afterPhotoHtml);
			}

		},
		error:function(XHR, textStatus, errorThrown){
			
		}		
	});

}


//任务下发对话框
function taskDownDlg(){
	$('#dlg').dialog({
		title: '任务下发',
		width: 400,
		height: 200,
		closed: false,
		cache: false,
		modal: true
	});
}



//任务下发
function taskDown(){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-ccproblem!ajaxAssignTask.action",
		data:$("#assignTaskForm").serialize(),
		dataType: "json",
		success: function(data){
			closeDlg();
			if(data){
				closeDlg();
				$.messager.alert('提示','任务下发成功!');
				$("#list").datagrid("reload");
				slideDiv();
			}else{
				$.messager.alert('提示','任务下发失败!');
			}
		},
		error:function(XHR, textStatus, errorThrown){
			closeDlg();
			$.messager.alert('提示','任务下发失败!');
		}		
	});
}

//关闭任务下发对话框
function closeDlg(){
	$('#dlg').dialog('close');
}
//结案对话框
function jaDlg(){
	$('#jaDlg').dialog({
		title: '直接结案',
		width: 400,
		height: 350,
		closed: false,
		cache: false,
		modal: true
	});
}
//结案
function ja(){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-ccproblem!ajaxJa.action?id="+$("input[name='form.id']").val(),
		data:$("#jaForm").serialize(),
		dataType: "json",
		success: function(data){
			closeJaDlg();
			if(data){
				$.messager.alert('提示','结案成功!');
				$("#list").datagrid("reload");
				slideDiv();
			}else{
				$.messager.alert('提示','结案失败!');
			}
		},
		error:function(XHR, textStatus, errorThrown){
			closeJaDlg();
			$.messager.alert('提示','结案失败!');
		}		
	});
}
//关闭结案对话框
function closeJaDlg(){
	$('#jaDlg').dialog('close');
}


//问题作废
function cancelProblem(){
	var problemId  = $("input[name='form.id']").val();
	if(problemId!=null){
		$.ajax({
			type: "POST",
			url: "/agsupport_hangzhou/new-ccproblem!ajaxCancelProblem.action",
			data:{"id":problemId},
			dataType: "json",
			success: function(data){
				if(data){
					$.messager.alert('提示','问题作废成功!');
					$("#list").datagrid("reload");
					slideDiv();
				}else{
					$.messager.alert('提示','问题作废失败!');
				}
			},
			error:function(XHR, textStatus, errorThrown){
				$.messager.alert('提示','问题作废失败!');
			}		
		});
	}
}

//定位
function dingwei(index){
	var rows = $("#list").datagrid("getRows");
	var row = rows[index];
	window.parent.require(["esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol"],function(SimpleMarkerSymbol,SimpleLineSymbol){
		var  mapPoint = new window.parent.esri.geometry.Point(row.longitude, row.latitude);
		var black = new window.parent.esri.Color("black");
		var red = new window.parent.esri.Color("red");
		var symbol=new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
			    		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
					    black, 1),
					    red);
		window.parent.map.centerAt(mapPoint);
		var graphic = new window.parent.esri.Graphic(mapPoint, symbol);
		window.parent.map.graphics.add(graphic);
	});
	
}