
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var yaCityId=getQueryStr("yaCityId");
   
//存放字典变量
var DictList=null;

function format_grade(value, row, index){
	if(DictList){
		 for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	} else {
		$.ajax({
			method : 'GET',
			url : '/agsupport/ya-template-district!getAllDict.action',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;	
			},
			error : function() {
				parent.layer.msg('数据加载失败');
			}
		});
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	}
}

function format_type(value, row, index){
	if(DictList){
		 for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	} else {
		$.ajax({
			method : 'GET',
			url : '/agsupport/ya-template-district!getAllDict.action',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;	
			},
			error : function() {
				parent.layer.msg('数据加载失败');
			}
		});
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	}
}
$(function(){                  
	$("#tableDistrict").bootstrapTable({
		toggle:"table",
		height:300,
		url:"/agsupport/ya-template-district!listDistrictJson.action",
		rowStyle:"rowStyle",
		cache: false, 
		striped: true,
		checkboxHeader:false,
		singleSelect:true,
		clickToSelect:true,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'templateNo',visible: true,title: '预案编号',width:"15%"},
			{field:'templateName',visible: true,title: '预案名称'},
			{field:'templateGrade',visible: true,title: '预案级别',formatter:format_grade},
			{field:'templateType',visible: true,title: '预案类型',formatter:format_type},
			{field:'templateContent',visible: true,title: '预案内容'},
			{field:'templateCreatePerson',visible: true,title: '编制人'}
		]
	});
	$("#tableDistrict").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
	});
});
  	
function startYA(){
	var selectObj=$('#tableDistrict').bootstrapTable('getSelections');
	if(selectObj.length==0){
		parent.layer.msg('请先选中预案模板');
	} else {
		parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?template_id='+selectObj[0].id+"&districtUnitId="+ selectObj[0].districtUnitId+"&yaCityId="+yaCityId,"成员单位应急预案-启动预案"); 						
		var index = parent.layer.getFrameIndex(window.name);
		window.parent.layer.close(index);
	}				
}	 
  	
function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

