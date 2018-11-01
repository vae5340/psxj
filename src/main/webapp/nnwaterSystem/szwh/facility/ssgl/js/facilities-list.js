var FacList=null;

$(function(){ 
    var type=getQueryStr("type");
	readFacilities(type);
});

function getQueryStr(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
		
function readFacilities(type){
	var para="";
	if($("#facilityName").val().trim()!= ""){
	   para +="?faclitiesName="+encodeURI($("#facilityName").val().trim());
	   if($("#facilityType").val().trim() != "")
	     para +="&faclitiesType="+encodeURI($("#facilityType").val().trim());
	}
	else if($("#facilityType").val().trim() != ""){
	   para +="?faclitiesType="+encodeURI($("#facilityType").val().trim());
	}
	
	if(type!=""){
	    switch(type){
	      case 'gl':
		   	   para +="?faclitiesType="+encodeURI("公路");
		   	   $("#facilityType").val("公路");
	           break;
	      case 'zgl':
		   	   para +="?faclitiesType="+encodeURI("主干路");
		   	   $("#facilityType").val("主干路");		   	   
	           break;
	      case 'cgl':
		   	   para +="?faclitiesType="+encodeURI("次干路");
	     	   $("#facilityType").val("次干路");	     
	           break;
	      case 'ksl':
		   	   para +="?faclitiesType="+encodeURI("快速路");
		   	   $("#facilityType").val("快速路");	   	   
	           break;
	      case 'zl':
		   	   para +="?faclitiesType="+encodeURI("支路");
		   	   $("#facilityType").val("支路");		   	   
	           break;
	   }	   
	}

	var url="/agsupport/sz-facilities!facilityListJson.action" + (para?para:"")
	$("#table").bootstrapTable('destroy');
	$("#table").bootstrapTable({
		toggle: "table",
		url: url,
	    height:parent.$("#content-main").height()-210,							
		type: "post",
		rowStyle: "rowStyle",
		classes: 'table table-bordered table-hover',
		cache: false,
		pagination:true,
		striped: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
				[{visible:true,rowspan:2,checkbox:true,valign:'middle'},			
				{field: 'id',rowspan:2,title: 'ID',align:'center',valign:'middle',visible:false},
				{field: 'faclitiesName',rowspan:2,title: '道路名称',align:'center',valign:'middle'},
				{field: 'faclitiesType',rowspan:2,title: '道路类型',align:'center',valign:'middle'},
				{field: 'totallength',rowspan:2,title: '道路<br/>总长度<br/>(m)',align:'center',valign:'middle'},
				//{field: 'redlinewidth',rowspan:2,title: '道路路幅<br/>红线宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'totalarea',rowspan:2,title: '道路<br/>总面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',colspan:5,title: '车行道',align:'center',valign:'middle'},
				{field: '',colspan:2,title: '分隔带',align:'center',valign:'middle'}, 
				//{field: '',colspan:2,title: '土路肩/人行道',align:'center',valign:'middle'},
				//{field: '',colspan:3,title: '浆砌片石排水沟',align:'center',valign:'middle'},
				//{field: 'bridgeculvert',rowspan:2,title: '桥涵<br/>(座)',align:'center',valign:'middle'},
				//{field: 'completiondate',rowspan:2,title: '竣工日期',align:'center',valign:'middle',formatter:date_formatter},
				//{field: 'receiveddate',rowspan:2,title: '接受日期',align:'center',valign:'middle',formatter:date_formatter},
				//{field: 'releaseliabilitydate',rowspan:2,title: '解除质保<br/>责任日期',align:'center',valign:'middle',formatter:date_formatter},
				//{field: 'remark',rowspan:2,title: '备注',align:'center',valign:'middle'},
		        {visible: true,title: '操作',rowspan:2,width:100,align:'center',valign:'middle',formatter:addBtnCol}],
		        [{field: 'roadwaywidth',title: '宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'roadwayarea',title: '合计面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea1',title: '水泥<br/>砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea2',title: '沥青<br/>砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea3',title: '改性沥<br/>青砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'dividingstripwidth',title: '宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'dividingstrip',title: '面积<br/>(m²)',align:'center',valign:'middle'},
				//{field: 'footwalkwidth',title: '宽度<br/>(m)',align:'center',valign:'middle'},
				//{field: 'footwalkarea',title: '面积<br/>(m²)',align:'center',valign:'middle'},
				//{field: 'stormsewerlength',title: '长度<br/>(m)',align:'center',valign:'middle'},
				//{field: 'checkwell',title: '检查井<br/>(座)',align:'center',valign:'middle'},
				//{field: 'storminlet',title: '雨水井<br/>(座)',align:'center',valign:'middle'},
				]
		]
	});
    //$(".fixed-table-header").css("height","110px");
    $(".fixed-table-header").height("110px");
}
 
function queryParams(params){
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit + 1
	};
}

function addBtnCol(value, row, index){
	  return "<button id=\"btn_edit\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"modifiedFac("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function option_formatter(value, row, index){
	var temp = "<div style='width:70px'>"
	temp += "<button class='btn btn-success' style='padding:5px;margin-right:5px' onclick='modifiedFac(" + row.id + ")'>改</button>";
	temp += "<button class='btn btn-danger' style='padding:5px' onclick='delFac(" + row.id + ")'>删</button>"
	temp += "</div>"
	return temp;
}

function delData(){		    
 	var selList=$("#table").bootstrapTable('getSelections');
 	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else{
	  	var checkedIds= new Array();
	  	for (var i=0;i<selList.length;i++){
	  		checkedIds.push(selList[i].id);
	  	}
 	    $.ajax({  
		    url: location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/sz-facilities!deleteMoreJson.action',  
		    traditional: true,
		    data: {"checkedIds" : checkedIds},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		        //alert(data.status);
		        layer.msg(data.result);
				location.reload();
		    }
		});
 	}
}

function date_formatter(value, row, index){
	//console.log(value)
	if(value){
		return getLocalTime(value.time);
	}
	return '';
}

function addFacilities(){
	layer.open({
		type: 2, 
		title: '新增设施',
		area: ['900px','550px'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/facilities-upload.html'
	})
}


function delFac(id){
	var r = confirm("确定要删除数据?")
	if(r){
		$.ajax({
			url: '/agsupport/sz-facilities!delete.action?id=' + id,
			success: function(){
				location.reload();
			},
			error: function(XHR,error,errorThrown){
				alert("删除失败：" + error);
			}
		})
	}
}

function modifiedFac(id){
	layer.open({
		type: 2, 
		title: '修改设施',
		area: ['900px','550px'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/facilities-upload.html?id=' + id
	});
}