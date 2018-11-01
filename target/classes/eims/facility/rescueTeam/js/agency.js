define(['jquery','layer'],
	function($,layer){
	
	function init(treeNode){
		$.each(treeNode,function(key){
			$("#"+key).val(treeNode[key]);
		});
	}
	return{
		init:init
	}
})

