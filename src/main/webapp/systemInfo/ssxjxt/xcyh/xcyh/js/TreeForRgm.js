
// 给管理层调用
function loadDataForRgm(param,type,orgId,roleId,ele){
	$.ajax({
		type:'get',
		url:'/'+serverName+'/asiWorkflow/getAllOrg.do',
		dataType:'json',
		success:function(res){
			loadSelectedTreeForRgm(res,ele);
		}
	});
}

// 加载树
function loadSelectedTreeForRgm(res,ele){
	var result = res;
	var setting = {
        isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
        data: {
    		key: {
    			name: "name"//这个地方显示节点，比如json是name  那么这里就写上Name
    		}
    	},
    	view:{
    		expandSpeed:500  //加载速度延迟1s  防止点击过快
    	},
        // treeNodeKey: "text",               //在isSimpleData格式下，当前节点id属性
        // nameCol: "text",            //在isSimpleData格式下，当前节点名称
        expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
        showLine: false,                  //是否显示节点间的连线
        callback: {
            onClick: function (event, treeId, treeNode) {
            	if(treeNode.level==0 && !treeNode.open && typeof(treeNode.children)=='undefined'){//只有父节点才能点击,已经展开了或者有子节点，就不再请求
            		$.ajax({
                		type:'get',
                		url:'/'+serverName+'/asiWorkflow/getUsersByorgCode.do',
                		data:{
                			"orgCode":treeNode.code,
                			"orgName":treeNode.name
                		},
                		dataType:'json',
                		success:function(res){
                			var treeObj = $.fn.zTree.getZTreeObj("selectedUser_tree");//获取树
                            treeObj.addNodes(treeNode,res.userFormList);  //往树上面新增子节点（第一个参数是父节点，第二个子节点）
                		}
                	});
            	}else if(treeNode.level!=0){
            		parent.$("#assignee").val(treeNode.code);
            		parent.$("#assigneeName").val(treeNode.name); 
            	}
            }
        }
    };
	debugger;
	//隐藏根节点的checkbox
    result.nocheck = true; 
    $.fn.zTree.init($("#"+ele+""), setting, result).expandAll(true);
}
