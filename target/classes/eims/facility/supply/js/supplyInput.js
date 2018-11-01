define(['jquery','layer'],function($,layer){

	var id,layerIndex;

	function save(){
		if($("#supplyInput #name").val()==""){
			layer.msg("物资名称不能为空", {icon:0,time: 1000});
			return;
		}
		if($("#supplyInput #ownerdept").val()==""){
			layer.msg("权属单位不能为空", {icon:0,time: 1000});
			return;
		}
		if($("#supplyInput #address").val()==""){
			layer.msg("存放地址不能为空", {icon:0,time: 1000});
			return;
		}
		var dataparam=$("#supplyInput #supplyInputForm").serializeArray();
	    $.ajax({
			type: 'post',
			url : '/psemgy/yjGood/saveJson',
			data:dataparam,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				layer.close(layerIndex);
			},
			error : function(e) {
				layer.msg("新增失败", {icon: 2,time: 1000});
			}
		});
	}

	function cancel(){
		layer.close(layerIndex);
	}

	function initBtn(){
	  $("#supplyInputSaveBtn").click(save);
	  $("#supplyInputCancelBtn").click(cancel);
	}

	function initData(){
		var url ='/psemgy/yjGood/inputJson';
		if(id&&id!=''){
			url+="?id="+id;
		}
		$.ajax({
			method : 'GET',
			url :url,
			async : true,
			dataType : 'json',
			success : function(data) {
				var ownerdept='';
				for (var key in data.form){
					$("#"+key).val(data.form[key]);
					if(key=='ownerdept') 
						ownerdept=data.form[key];
				}
				for (var key = 0 ;key < data.DistrictList.length; key ++){//var key in data.DistrictList
					if(ownerdept!=''&&ownerdept==data.DistrictList[key].orgId){
						$("#ownerdept").append("<option value='"+data.DistrictList[key].orgId+"' selected='selected'>"+data.DistrictList[key].orgName+"</option>");
					}else{
						$("#ownerdept").append("<option value='"+data.DistrictList[key].orgId+"'>"+data.DistrictList[key].orgName+"</option>");
					}
					
				}

			},
			error : function() {
				layer.msg("获取数据失败", {icon: 2,time: 1000});
			}
		});
	};

	function init(_id,_layerIndex){
		id=_id;
		layerIndex=_layerIndex;
		initBtn();
		initData();
	}
	return{
	  init:init
	}
})
