var zTree;
var demoIframe;

function addHoverDom(treeId, treeNode) {
       var sObj = $("#" + treeNode.tId + "_span");
       if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
       var addStr = "<span class='button remove' id='removeBtn_" + treeNode.tId
               + "' title='add node' onfocus='this.blur();'></span>";

       addStr += "<span class='button add' id='addBtn_" + treeNode.tId + "'></span>";
       addStr += "<span class='button edit' id='editBtn_" + treeNode.tId + "'></span>";
       sObj.after(addStr);
       var btn = $("#addBtn_"+treeNode.tId);
       if (btn) btn.bind("click", function(){
           var zTree = $.fn.zTree.getZTreeObj("treeDemo");
           zTree.addNodes(treeNode, {id:(1000 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
           return false;
       });
   };

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
    $("#removeBtn_"+treeNode.tId).unbind().remove();
    $("#editBtn_"+treeNode.tId).unbind().remove();
};
	
//树基本参数设置	
var setting = {
    check: {
        enable: true
    },
    view: {
        //addHoverDom: addHoverDom,
        //removeHoverDom: removeHoverDom,
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
        beforeClick: function(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("tree");
            if (treeNode.isParent) {
                zTree.expandNode(treeNode);
                return false;
            } else {
                demoIframe.attr("src",treeNode.file + ".html");
                return true;
            }
        },
        onCheck: function(event, treeId, treeNode) { 
		    //alert(treeNode.id + ", " + treeNode.name + "," + treeNode.checked);
		    
			 toCheckCombTree(treeNode.id,treeNode.checked);
		    
		}
    }
};
   
//角色树结构
function getRoleTree(){
	var roleNodes;
	$.ajax({ 
       	url: "/agsupport/comb/ps-comb!getRoleTree.action", 
       	data: "",
       	type: "post", 
       	dataType: "json",
       	async: false,
        success: function(data){
		    roleNodes=data;
		},
		error: function(){
		
		}
	});
	return roleNodes;
}
//设施树结构
function getCombTree(){
	var combNodes;
	$.ajax({ 
       	url: "/agsupport/comb/ps-comb!getCombTree.action", 
       	data: "",
       	type: "post", 
       	dataType: "json",
       	async: false,
        success: function(data){
		    combNodes=data;
		},
		error: function(){
		
		}
	});	 
	return combNodes;
}

//初始化
var roleTreeObj;
var combTreeObj;
 $(document).ready(function(){
     var roleTree = $("#roleTree");
     var combTree = $("#combTree");
     
     var roleNodes=getRoleTree();
     var combNodes=getCombTree();
	 roleTree = $.fn.zTree.init(roleTree, setting, roleNodes);
     combTree = $.fn.zTree.init(combTree, setting, combNodes); 
     //demoIframe = $("#testIframe");
     //demoIframe.bind("load", loadReady);
     roleTreeObj = $.fn.zTree.getZTreeObj("roleTree");
     combTreeObj = $.fn.zTree.getZTreeObj("combTree");
     //zTree.selectNode(zTree.getNodeByParam("id", 101));
	$("#saveBtn").bind("click",function(){
		var roleNodes = roleTreeObj.getCheckedNodes(true);
		var combNodes = combTreeObj.getCheckedNodes(true);
		var roleNodeLen=roleNodes.length;
		var combNodeLen=combNodes.length;
		//获取checked的id
		var roleIdStr="";
		for(var i=0;i<roleNodeLen;i++){
			roleIdStr+=roleNodes[i].id +",";
		}
		//获取设施-设备-监控项ID
		var itemDimIdStr="";
		for(var j=0;j<combNodeLen;j++){
			var isParent = combNodes[j].isParent;
			if(!isParent){
				itemDimIdStr+=combNodes[j].id +",";
			}
		}
		
		if(roleIdStr!="" && itemDimIdStr!=""){
			//发送保存请求
			$.post("/agsupport/comb/ps-comb!doSaveAuth.action",
					{"roleIds":roleIdStr,"itemDimIds":itemDimIdStr},     
					function(result){ 
						
						//消息提醒
						toastr.success("提示", "授权成功!")
						
					}
			 );
		}else{
			toastr.success("提示", "请选择角色或监控项!")
		}
	});
 });
 
 //保存权限
 function doSaveAuth(){
 	var roleNodes = roleTreeObj.getSelectedNodes();
 	//alert(roleNodes);  
 
 }
 
 //展示选中角色拥有的权限
 function toCheckCombTree(id,isCheck){
 	if(id==""){
 		return;
 	}
 	$.post("/agsupport/comb/ps-comb!getRoleAuth.action",
			{"roleIds":id},     
			function(data){ 
				//消息提醒
				//toastr.success("提示", "授权成功!")
				//将json字符串转json对象
				var roleAuth=eval('(' + data + ')');
				var roleNodes;
				//取消选中
				//combTreeObj.checkAllNodes(false);
				
				for (var i=0;i<roleAuth.length; i++) {
					//roleNodes=combTreeObj.getSelectedNodes();
					//for (var j=0;j<roleNodes.length; j++) {
						//combTreeObj.checkNode(roleAuth[i].item_dim_id, true, true);
					//}
					if(isCheck){
						combTreeObj.checkNode(combTreeObj.getNodeByParam("id", roleAuth[i].item_dim_id, null), true, true);
					}else{
						//combTreeObj.setChkDisabled(combTreeObj.getNodeByParam("id", roleAuth[i].item_dim_id, null), false);
						combTreeObj.checkNode(combTreeObj.getNodeByParam("id", roleAuth[i].item_dim_id, null), false, false);
					}
				}
				//alert(roleAuth[0].role_id);
			}
	 );
 }
 
 
    
    