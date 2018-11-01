//考核评价汇总列表脚本
$(function(){
	$.messager.defaults.ok="确定";
	$.messager.defaults.cancel="取消";
	$('#list').datagrid({
		url:'/agsupport_hangzhou/hz-score-summary!ajaxList.action',
		fitColumns:true,
		singleSelect:true,
		pagination:true,
		height:750,
		columns:[[
		{
			field:'company',
			title:'被考核单位',
			width:100,
			formatter: function(value,row,index){
				if(row.name!=null){
					return value+"-"+row.name;
				}
				return value;
			}
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
				var edit = "<a href=\"javascript:edit("+value+")\">编辑</a>";
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
function edit(id){
	slideDiv();
	loadTemplate();
	$.ajax({
		type: "POST",
		url: "/agsupport_hangzhou/hz-score-summary!ajaxInput.action",
		data: {"id":id},
		dataType: "json",
		success: function(data){
			 $.each(data, function(index){
				$("input[name='tables["+index+"].assessmentScore']").val(data[index].assessmentScore);
				$("input[name='tables["+index+"].comprehensiveScore']").val(data[index].comprehensiveScore);
				$("input[name='tables["+index+"].id']").val(data[index].id);
			 });
			$("input[name='form.company']").val(data[0].company);
			$("input[name='form.time']").val(timeStampToDate(data[0].time));
			calAssessmentScore();
			calComprehensiveScore();
	
		},
		error:function(XHR, textStatus, errorThrown){
			alert('error: ' + errorThrown);
		}
	});
	
	
		
}

//加载模板
function loadTemplate(){
	$("#template").empty();
	$.ajax({
		type: "POST",
		url: "hzinput.html",
		async: false,
		//data: {username:$("#username").val(), content:$("#content").val()},
		//dataType: "json",
		success: function(data){
			$("#template").append(data);
			//$.parser.parse();
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
			url: "/agsupport_hangzhou/hz-score-summary!ajaxSave.action",
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
				url: "/agsupport_hangzhou/hz-score-summary!ajaxDelete.action",
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

function calAssessmentScore(){
	var sum = 0;
	$("input[name$='.assessmentScore']").each(function(){
		var num = Number($(this).val());
		if(!isNaN(num)){
			sum+= num;
		}
	});
	$("#score1").empty();
	$("#score1").append(sum);
}
function calComprehensiveScore(){
	var sum = 0;
	$("input[name$='.comprehensiveScore']").each(function(){
		var num = Number($(this).val());
		if(!isNaN(num)){
			sum+= num;
		}
	});
	$("#score2").empty();
	$("#score2").append(sum);
}




