//巡案模板脚本


//获取模板状态
function loadTypes(){
	var result = null;
	$.ajax({
		type: "POST",
		url:"/agsupport_hangzhou/new-awater-modules!ajaxTypes.action",
		async: false,
		dataType: "json",
		success: function(data){
			//moduleTypes = data;
			result = data;
		},
		error:function(XHR, textStatus, errorThrown){
		}		
	});
	return result;
}

//加载下拉列表
function loadSelect(moduleTypes){
	//加载案件小类下拉
	$("select[name='form.smallTypeid']").empty();
	var caseTypes = moduleTypes.caseTypes;
	var smallTypeOptions = "";
	$.each(caseTypes,function(index){
		smallTypeOptions+="<option value='"+caseTypes[index].itemId+"'>"+caseTypes[index].itemName+"</option>";
	});
	$("select[name='form.smallTypeid']").append(smallTypeOptions);
	//加载环节下拉
	$("select[name='form.ringid']").empty();
	var moduleTypes = moduleTypes.moduleTypes;
	var caseTypeComboOptions = "";
	$.each(moduleTypes,function(index){
		caseTypeComboOptions+="<option value='"+moduleTypes[index].value+"'>"+moduleTypes[index].label+"</option>";
	});
	$("select[name='form.ringid']").append(caseTypeComboOptions);
}





//巡检问题模板对话框
function templateDlg(index){

	if(index!=null){ //回显
		var rows = $("#list").datagrid("getRows");
		var row = rows[index];
		$("input[name='id']").val(row.id);
		$("input[name='form.moduleName']").val(row.moduleName);
		$("input[name='form.moduleContent']").val(row.moduleContent);
		$("select[name='form.ringid']").val(row.ringid);
		$("select[name='form.smallTypeid']").val(row.smallTypeid);	
	}else{
		//清空表单
		$("input[name='id']").val('');
		$("input[name='form.moduleName']").val('');
		$("input[name='form.moduleContent']").val('');
		$("select[name='form.ringid']").val('');
		$("select[name='form.smallTypeid']").val('');
	}
	//弹出对话框
	$('#templateDlg').dialog({
		title: '添加模板',
		width: 500,
		height: 450,
		closed: false,
		cache: false,
		modal: true
	});
}
//关闭巡检问题模板对话框
function closeTemplateDlg(){
	$('#templateDlg').dialog("close");
}
//保存或修改模板
function saveTemplate(){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/new-awater-modules!ajaxSave.action",
		data:$("#myForm").serialize(),
		dataType: "json",
		success: function(data){
			closeTemplateDlg();
			if(data){
				$.messager.alert('提示','保存成功!');
				$("#list").datagrid("reload");
			}else{
				$.messager.alert('提示','保存失败!');
			}
		},
		error:function(XHR, textStatus, errorThrown){
			closeTemplateDlg();
			$.messager.alert('提示','保存失败!');
		}		
	});
}

//删除模板
function deleteTempate(id){
	$.messager.confirm('确认删除？', '是否确认删除？', function(r){
		if (r){
			$.ajax({
				type: "POST",
				url: "/agsupport_hangzhou/new-awater-modules!ajaxDelete.action?id="+id,
				dataType: "json",
				success: function(data){
					if(data){
						$.messager.alert('提示','删除成功!');
						$("#list").datagrid("reload");
					}else{
						$.messager.alert('提示','删除失败!');
					}
				},
				error:function(XHR, textStatus, errorThrown){	
					$.messager.alert('提示','删除失败!');
				}		
			});
		}
	});
}