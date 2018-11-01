//考核评价列表脚本
$(function(){
	$.messager.defaults.ok="确定";
	$.messager.defaults.cancel="取消";
	$('#list').datagrid({
		url:'/agsupport_hangzhou/hz-score!ajaxList.action?form.typeIndex=5',
		fitColumns:true,
		singleSelect:true,
		pagination:true,
		height:750,
		columns:[[
		{
			field:'type',
			title:'类型',
			width:100,
			formatter: function(value,row,index){
				if(row.name!=null){
					return value+"-"+row.name;
				}
				return value;
			}
		},
		{
			field:'person',
			title:'考核评分人',
			width:100
		},
		{
			field:'time',
			title:'时间',
			width:100,
			formatter: function(value,row,index){
				return timeStampToDate(value);
			}
		},
		{
			field:'id',
			title:'操作',
			width:100,
			formatter: function(value,row,index){
				var edit = "<a href=\"javascript:edit('"+row.name+"','"+row.person+"',"+row.time+","+row.typeIndex+","+row.hzScoreSummaryId+")\">编辑</a>";
				var del = "<a href='javascript:del("+value+")'>删除</a>";
				return edit+"&nbsp;"+del;
			}
		}
		]]
	});
	var page = $('#list').datagrid('getPager');
	page.pagination({
		beforePageText: '第',//页数文本框前显示的汉字 
		afterPageText: '页    共 {pages} 页',
		displayMsg: '共{total}条数据',
	}); 
})
//修改
function edit(name,person,time,typeIndex,hzScoreSummaryId){
	slideDiv();
	if(name==null || name=='null'){
		name='';
	}
	if(person==null || person=='null'){
		person='';
	}
	if(typeIndex==null || typeIndex=='null'){
		typeIndex='';
	}
	loadTemplate(typeIndex,hzScoreSummaryId);
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/hz-score!ajaxInput.action",
		data: {"form.typeIndex":typeIndex, "form.name":name,"form.person":person,"form.time":timeStampToDate(time)},
		dataType: "json",
		success: function(data){
			 $.each(data, function(index){
				if(data[index].problem!=null){
					$("textarea[name='tables["+index+"].problem']").text(data[index].problem);
				}
				
				$("input[name='tables["+index+"].score']").val(data[index].score);
				$("input[name='tables["+index+"].id']").val(data[index].id);
			 });
			 $("input[name='form.person']").val(person);
			 $("input[name='form.name']").val(name);
			 $("input[name='form.time']").val(timeStampToDate(time));
			 calScore();
	
		},
		error:function(XHR, textStatus, errorThrown){
			alert('error: ' + errorThrown);
		}
	});
	
		
}

function add(){
	slideDiv();
	loadTemplate($("#typeIndex").val());

}
//保存或更新
function update(){
	if($('#myForm').validate().form()){
		$.ajax({
			type: "POST",
			url: "/agsupport_hangzhou/hz-score!ajaxSave.action",
			data:$("#myForm").serialize(),
			dataType: "json",
			success: function(data){
				if(data){
					$.messager.alert('提示','保存成功!');
					$("#list").datagrid("reload");
				}else{
					$.messager.alert('提示','保存失败!');
				}
			},
			error:function(XHR, textStatus, errorThrown){
				$.messager.alert('提示','保存失败!');
			}		
		});
		$("#template").empty();
		slideDiv();
	}
	
	
}
//删除
function del(id){

	$.messager.confirm('确认删除？', '是否确认删除？', function(r){
		if (r){
			$.ajax({
				type: "POST",
				url: "/agsupport_hangzhou/hz-score!ajaxDelete.action",
				data:{"id":id},
				dataType: "json",
				success: function(data){
					if(data){
						$.messager.alert('','删除成功');
						$("#list").datagrid("reload");
					}else{
						$.messager.alert('','删除失败');
					}
				},
				error:function(XHR, textStatus, errorThrown){
					$.messager.alert('','删除失败');
				}
			});
			$("#template").empty();
		}
	});

}

//加载模板
function loadTemplate(typeIndex,hzScoreSummaryId){
	var templateUrl = 'dailyInput.html';
	switch(typeIndex+''){
		case '0':templateUrl='dailyInput.html';
		break;
		case '1':templateUrl='emergencyInput.html';
		break;
		case '2':templateUrl='pumpInput.html';
		break;
		case '3':templateUrl='pipeInput.html';
		break;
		case '4':templateUrl='factoryInput.html';
		break;
	}
	$("#template").empty();
	$.ajax({
		type: "POST",
		url: templateUrl,
		async: false,
		//data: {username:$("#username").val(), content:$("#content").val()},
		//dataType: "json",
		success: function(data){
			 $("#template").append(data);
			 loadSelect(typeIndex,hzScoreSummaryId);
			// $.parser.parse();
		},
		error:function(XHR, textStatus, errorThrown){
			alert('error: ' + errorThrown);
		}
	});
}

//加载下拉列表
function loadSelect(typeIndex,hzScoreSummaryId){
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/hz-score-summary!ajaxSelect.action",
		async: false,
		data: {"form.priority":typeIndex},
		dataType: "json",
		success: function(data){
			$("#hzSelect").empty();
			$("#hzSelect").append("<option value=''>请选择</option>")
			$.each(data, function(index){
				var sel = "";
				if(hzScoreSummaryId+''==data[index].id+''){
					sel = "selected ";
				}
				var option="<option "+sel+"value='"+data[index].id+"'>"+data[index].company+"</option>";
				$("#hzSelect").append(option);
			});
		},
		error:function(XHR, textStatus, errorThrown){
			alert('error: ' + errorThrown);
		}
	});
}

//计算总得分
function calScore(){
	var sum = 0;
	$("input[name$='.score']").each(function(){
		var num = Number($(this).val());
		if(!isNaN(num)){
			sum+= num;
		}
	});
	$("#result").empty();
	$("#result").append(sum);
}
