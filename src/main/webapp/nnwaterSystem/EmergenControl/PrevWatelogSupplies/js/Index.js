var zTree;
var setting = {
	view: {
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "parent_id",
			rootPId: 1
		}
	},
	callback: {
	    onClick : function(event, treeId, treeNode) {
	    	if(treeNode.id==1)
	    		return;
	        else
	            $("#iframepage").attr("src","List.html?name="+encodeURIComponent(treeNode.name));
	    },
	    onNodeCreated:function (event, treeId, treeNode){
	    	if(treeNode.id==1)
				$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
	    }
	}
};
var qssetting = {
	view: {
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "parent_id",
			rootPId: 0
		}
	},
    callback: {
		onClick : function(event, treeId, treeNode) {
       		if(treeNode.id==1)
       			return;
           	else if(treeNode.address)
               	$("#iframepage").attr("src","List.html?address="+encodeURIComponent(treeNode.address));
			else
				$("#iframepage").attr("src","List.html?ownerdept="+encodeURIComponent(treeNode.id));
       },
       onNodeCreated:function (event, treeId, treeNode){
			if(treeNode.id==1)
       			$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
		}
	}
};
  
$.ajax({
	method : 'GET',
	url : "/agsupport/yj-good!getTreeJson.action",
	async : true,
	dataType : 'json',
	success : function(data) {
		var zNodes=data[1];
		$.fn.zTree.init($("#tree"), setting,zNodes);
	    var qszNodes=data[0];
	    $.fn.zTree.init($("#qstree"), qssetting,qszNodes);
	}
});

function displayTree(){
   	if($("#type").val()=="wz"){
   		$("#qstree").hide();
   		$("#tree").show();
   	} else if ($("#type").val()=="qs") {
   		$("#qstree").show();
   		$("#tree").hide();	
   	}
}