var zNodes = []
var z;
//setting
var zSetting = {
	check: {
		enable: false,
		chkStyle: "checkbox"
	},
	view: {
		addHoverDom: "",
		removeHoverDom: "",
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: ""
		}
	},
	callback: {
		onClick: function(event, treeId, treeNode, clickFlag){
			var zTree = $.fn.zTree.getZTreeObj("facTree");
			if(treeNode.isParent){
				zTree.expandNode(treeNode);
				return false;
			}else{
				file_iframe.attr("src","/awater/nnwaterSystem/szwh/facility/ssgl/document-list.html?fileTreeId="+treeNode.id)
			}
			var zTree = $.fn.zTree.getZTreeObj("facTree");
		}
	}
}

//用于存放iframe的jq对象
var file_iframe;
$(function(){
	$.ajax({
		url: '/agsupport/sz-file-tree!listjson.action',
		dataType: 'json',
		success: function(res){
			//console.log(res);
			for(a in res){
				var temp = "{id:" + res[a].id + ",pId:" + res[a].pid + ",name:\"" + res[a].treeName + "\", Para:\"" + res[a].treePara + "\",value:\"" + res[a].treeValue + "\",open:true}";
				//console.log(temp);
				zNodes.push(eval("(" + temp + ")"))
			}
			z = $.fn.zTree.init($("#facTree"), zSetting, zNodes);
			
			file_iframe = $("#fileIframe");
		},
		error: function(XHR,error,errorThrown){
			alert(error);
		}
	})
})
var uploadTreeIndex;
//新增
function addTree(){
	$.ajax({
		url: '/agsupport/sz-file-tree!listjson.action',
		dataType: 'json',
		success: function(res){
			console.log(res)
			//先生成option
			var file_option = "";
			for(a in res){
				if(res[a].pid == 0){
					file_option += "<option value='" + res[a].id + "'>" + res[a].treeName + "</option>"
				}
			}
			//
			uploadTreeIndex = layer.open({
				title: '新增节点',
				type: 1,
				area:['20%','60%'],
				content: '<form id="submitForm" class="col-sm-12" action="/agsupport/sz-file-tree!save.action" style="padding:10px">'
				//节点名称
				+ '<div class="form-group">'
				+ '<label class="control-label" for="treeName" style="padding-top:5px">节点名称</label>'
				+ '<input class="form-control" type="text" name="treeName" id="treeName" placeholder="节点名称">'
				+ '</div>'
				//是否子节点
				+ '<div class="form-group">'
				+ '<label class="" style="padding-top:5px"><input type="checkbox" id="isPPoint" value="" onchange="chkChange(this)">是否为子节点</label>'
				+ '</div>'
				//所属的父节点
				+ '<div class="form-group">'
				+ '<label class="control-label" for="formGroupInputLarge" style="padding-top:5px">所属父节点</label>'
				+ '<select id="fjd" class="form-control" disabled>'
				+ '<option value="-1"></option>'
				+ file_option
				+ '</select>'
				+ '</div>'
				+ '<input type="hidden" name="pid">'
				+ '<input type="hidden" name="treeType">'
				+ '<input type="hidden" name="treePara">'
				+ '<input type="hidden" name="treeValue">'
				+ '</form>'
				+ '<button type="button" class="btn btn-success" onclick="submitTree()" style="margin-left:5px">新增</button>'
				+ '<button type="button" class="btn btn-default" onclick="closeUploadTree()" style="margin-left:5px">返回</button>'
			})
		},
		error: function(XHR, error, errorThrown){
			alert("读取目录数据库失败:" + error);
		}
	})
}
//编辑
var editStatus = false;//记录编辑状态
function editTree(){
	if(editStatus){//编辑-->关闭
		zSetting.check.enable = false
		//zSetting.view.addHoverDom = function(){return false};
		//zSetting.view.removeHoverDom = function(){return false}
		
		$("#deleteTree").attr("disabled",true)
		
		editStatus = false
	}else{//关闭-->编辑
		zSetting.check.enable = true;
		//zSetting.view.addHoverDom = addHoverDom;
		//zSetting.view.removeHoverDom = removeHoverDom;
		
		$("#deleteTree").attr("disabled",false)
		
		editStatus = true
	}
	z = $.fn.zTree.init($("#facTree"), zSetting, zNodes);
}
function addHoverDom(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	var addStr = "<span class='button remove' id='removeBtn_" + treeNode.tId
			+ "' title='add node' onfocus='this.blur();'></span>";

	addStr += "<span class='button add' id='addBtn_" + treeNode.tId + "'></span>";
	addStr += "<span class='button edit' id='editBtn_" + treeNode.tId + "'></span>";
	sObj.after(addStr);
};

function removeHoverDom(treeId, treeNode) {
	$("#addBtn_"+treeNode.tId).unbind().remove();
	$("#removeBtn_"+treeNode.tId).unbind().remove();
	$("#editBtn_"+treeNode.tId).unbind().remove();
};
//删除
function deleteTree(){
	
	var tree = $.fn.zTree.getZTreeObj("facTree");
	var checkedNode = tree.getCheckedNodes(true);
	//console.log(checkedNode);
	//获取选中的节点,并存在ids中,用于删除
	var ids = new Array();
	for(a in checkedNode){
		if(checkedNode[a].isParent && checkedNode[a].children.length > 0){
			var childNum = 0;
			for(b in checkedNode[a].children){
				if(checkedNode[a].children[b].checked){
					childNum++
				}
			}
			if(childNum == checkedNode[a].children.length){
				ids.push(checkedNode[a].id)
			}
		}else{
			ids.push(checkedNode[a].id)
		}
	}
	//console.log(ids);
	if(ids.length == 0){
		layer.msg("请选择需要删除的节点",{icon:2})
	}else{
		var r = confirm("确定要删除")
		if(r){
			$.ajax({
				url: '/agsupport/sz-file-tree!deleteMore.action',
				data: {
					"checkedIds": ids
				},
				traditional:true,
				type: 'post',
				success: function(){
					console.log("删除成功");
					$("#deleteTree").attr("disabled",false);
					location.reload();
				},
				error: function(XHR,error,errorThrown){
					alert("删除失败:" + error)
				}
			})
		}
	}
}
//checkbox的change事件
function chkChange(chk){
	if(chk.checked){//true时为子节点，需要选择父节点
		$("#fjd").attr("disabled",false);
	}else{//false时为父节点
		$("#fjd").attr("disabled",true);
	}
}
function submitTree(){
	if($("#treeName").val() == ""){
		layer.msg("节点名称不能为空",{icon:2})
		return;
	}
	
	if(document.getElementById("isPPoint").checked){//子节点
		if($("#fjd").val() == -1){
			layer.msg("请选择父节点",{icon:2})
			return ;
		}
		$("[name='pid']").val($("#fjd").val())
	}else{//父节点
		$("[name='pid']").val(0);
		$("[name='treeType']").val()
	}
	//提交
	$("#submitForm").ajaxSubmit({
		url: "/agsupport/sz-file-tree!save.action",
		type: 'post',
		success: function(){
			console.log("成功")
			location.reload();
		}
	})
}

//关闭按钮
function closeUploadTree(){
	layer.close(uploadTreeIndex);
}