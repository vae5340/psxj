var serverName = GetQueryString("serverName");
var node = null;
var curTableid;
var index=0;
var dataTypeList = new Dictionary();
var classPropertyList = new Dictionary();
var classPropertyNameList;
var savaState="modif";

var Index = {
    	init: function(){
    		var that = this;
    		this.vm = new ViewModel();
            ko.applyBindings(this.vm);
    		that.renderUI();
    		that.bindUI();
    		that.validateForm();
    		that.cleaMyFrom();
    	},
    	beforeRenderUI: function(callback){
    		
    	},
    	renderUI: function(data){
    		var self = this;
    		self.loadTreeData();
    	},
    	bindUI: function(){ 
    		var self = this;
    		self.getTemplateData();
    		self.getMetaCodeData();
    		self.getDataTypeListByOracle();
    		$(".tablefield-add").on("click",function(evt){
    			addTableFieldEdit();
    		});
    		$(".tablefield-del").on("click",function(evt){
    			delTableFieldEdit();
    		});
    		
    		$(".tablefield-match").on("click",function(evt){
				//matchTableFieldEdit();
				synMetaClassData();
    		});
    		
    		$(".tablefield-sync").on("click",function(evt){
				layer.confirm('将同步数据库表字段信息，并覆盖删除原有的模板表配置信息，确定删除？', {
					btn: ['确定','取消'] //按钮
				}, function() {
					syncTableFieldEdit();
				},function(){

				})
    		});
    		
    		$("#tableType").on("change",function(evt){
    			if($("#tableType").val()=="1"){
    				$("#layerType").show();
    			}else{
    				$("#layerType").hide();
    			}
    		});
    	},
    	validateForm: function(){
    		 $('#defaultForm').bootstrapValidator({
//    	        live: 'disabled',
    	        message: 'This value is not valid',
    	        feedbackIcons: {
    	            valid: 'glyphicon glyphicon-ok',
    	            invalid: 'glyphicon glyphicon-remove',
    	            validating: 'glyphicon glyphicon-refresh'
    	        },
    	        fields: {
    	        	primaryKeyName: {
    	                validators: {
    	                    notEmpty: {
    	                        message: '字段不能为空'
    	                    }
    	                }
    	            },
					relatedFieldName: {
						validators: {
							notEmpty: {
								message: '字段不能为空'
							}
						}
					},
    	            tableName: {
    	                validators: {
    	                    notEmpty: {
    	                        message: '字段不能为空'
    	                    },
    	                    callback: {
    	                        message: '输入名需加表用户如：agem.aa',
    	                        callback: function(value, validator) {
    	                            var index = value.indexOf(".");
    	                            return index>0;
    	                        }
    	                    }
    	                }
    	            },
    	            referenceTable: {
    	                validators: {
    	                    callback: {
    	                        message: '输入名需加表用户如：agem.aa',
    	                        callback: function(value, validator) {
    	                            var index = value.indexOf(".");
    	                            return index>0;
    	                        }
    	                    }
    	                }
    	            }
    	        }
    	    });
    	},
    	loadTreeData:function(){
    		var that = this;
    		//node = null;
    		var setting = {
    				isSimpleData : false,              //数据是否采用简单 Array 格式，默认false
    				treeNodeKey : "id",               //在isSimpleData格式下，当前节点id属性
    				treeNodeParentKey : "seniorid",        //在isSimpleData格式下，当前节点的父节点id属性
    				nameCol : "name",            //在isSimpleData格式下，当前节点名称 
    				expandSpeed : "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000) 
    				showLine : true,                  //是否显示节点间的连线
    				checkable : true,                  //每个节点上是否显示 CheckBox
    				callback: {
    					onClick: zTreeOnClick
    				}
    				
    			};
    		var zTree;
    		var requestURL = "";
    		requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getMetadatatableTree.action";
    		$.ajax({
    			type : "post" ,
    			data : {},
    			dataType : "json",
    			url : requestURL,
    			async : false,
    			success :function(result){
    				var list =result.result;
    				zTree= $.fn.zTree.init($("#metadatatable_tree"), setting, list);
					var nodes = zTree.getNodes();
					zTree.expandNode(nodes[0], true,false);
					if(node != null){
						var node1 = zTree.getNodeByParam("id", node.iconSkin == 'icon_group'?node.id:node.seniorid, null);
						zTree.expandNode(node1, true, false, true);
						zTree.selectNode(node);
					}
    			}
    		});    		
    		getMetadatatables(0);			
    	},
		getTemplateData:function(){
    		var requestURL = "";
    		requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getTemplateData.action";
    		$.ajax({
    			type : "post" ,
    			data : {},
    			dataType : "json",
    			url : requestURL,
    			async : false,
    			success :function(result){

    				var list =result.result;
    				for(var item in list){
    					var value=list[item];
    					$("#templateName").append("<option value='"+value.templateid+"'>"+value.displayname+"</option>");
    				}
    			}
    		});
		},
	getMetaCodeData:function(){
		var requestURL = "";
		requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatafield!getMetacodetypeData.action";
		$.ajax({
			type : "post" ,
			data : {},
			dataType : "json",
			url : requestURL,
			async : false,
			success :function(result){
				var list =result.result;
				for(var item in list){
					var value=list[item];
					$("#belongMetaCodeName").append("<option value='"+value.typecode+"'>"+value.name+"</option>");
				}
			}
		});
	},
		//获取oracle表数据类型信息
		getDataTypeListByOracle:function(){
			requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getDataTypeListByOracle.action";
			$.ajax({
				type : "post" ,
				data : {},
				dataType : "json",
				url : requestURL,
				async : false,
				success :function(result){
					var list =result.result;
					for(var item in list){
						var value=list[item];
						dataTypeList.put(value.datatypename,value.datatypename);
					}
				}
			}); 
		},
		
		refreshList:function(){
		},
	cleaMyFrom:function(){
		$('#myModal').on('hide.bs.modal', function () {
			$('#myform')[0].reset();
			$("#connectType").val("");
			$("#tbname").val("");
			$(".waring").remove();
			$("#dbuser").removeClass("error");
			$("#dbport").removeClass("error");
			$("#address").removeClass("error");
			$("#dbname").removeClass("error");
		})
	}
}
Index.init();

//创建一个View对象
function ViewModel() {
    var self = this;
    self.metadatatablelist = ko.observable();
    self.metadatatable = {};
    self.metadatatable.ID =  ko.observable();
    self.metadatatable.templateName = ko.observable();
    self.metadatatable.displayName = ko.observable();
    self.metadatatable.tableName = ko.observable();
    self.metadatatable.primaryKeyName = ko.observable();
    self.metadatatable.relatedFieldName = ko.observable();
    self.metadatatable.tableType = ko.observable();
    self.metadatatable.belongMetaCodeName = ko.observable();
    self.metadatatable.layerType = ko.observable();
    self.metadatatable.tableStateCode = ko.observable();
    self.metadatatable.fieldstatecode = ko.observable();
    self.metadatatable.referenceTable = ko.observable();
	self.metadatatable.hasfile = ko.observable();
	self.metadatatable.isDictionary = ko.observable();
    self.addMetadatatable = addMetadatatable;
    self.saveMetadatatable=saveMetadatatable;
    self.sortMetadatatable=sortMetadatatable;
    self.deleteMetadatatable=deleteMetadatatable;
    self.getTableField=getTableField;
    self.getDataSource=getDataSource;
//    //使用observableArray进行绑定可以动态变更option选项
//    self.selectOptions = ko.observableArray([
//         { "text": "请选择", "value": "0" }
//    ]);
//    self.result = ko.observable("0");//添加result监控属性，初始绑定值为0
};

function zTreeOnClick(event, treeId, treeNode) {
	node = treeNode;
	if(treeNode.iconCls=="icon-children"){
		$('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
		if(curTableid==node.id){
			
		}else{
			getMetaClassProperty(node.seniorid);
			getMetadatatableData();
		}
	}else{
		if(curTableid==node.id){
			
		}else{
			getMetadatatables(node.id);
		}
		$('#metadatatable_nav a[href="#metadatatable_list_tab"]').tab('show');
	}
	curTableid= node.id;
};

function getMetadatatables(nodeid){
	var requestURL = "";
	var metadatatable = {
			nodeid:nodeid
	};
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getMetadatatables.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			Index.vm.metadatatablelist(result.result);
		}
	}); 
}


function getMetadatatableData(){
	savaState="modif";
	$(".tablefield-sync").show();
	$(".tablefield-add").hide();
	$(".tablefield-del").hide();
	$("#tableName").attr("disabled",true);
	$("#referenceTable").attr("disabled",true);
	$("#getTableField").hide();
	var requestURL = "";
	var metadatatable = {
			tableid:node.id
	};
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getMetadatatableData.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var list =result.result[0];
			for(var item in list){
				var value=list[item];
				Index.vm.metadatatable.ID(value.id);
				Index.vm.metadatatable.templateName(value.templateid);
				Index.vm.metadatatable.displayName(value.displayname);
				Index.vm.metadatatable.tableName(value.tablename);
				Index.vm.metadatatable.primaryKeyName(value.primarykeyfieldname);
				Index.vm.metadatatable.relatedFieldName(value.relatedfieldname);
				Index.vm.metadatatable.belongMetaCodeName(value.metacodetypecode);
				Index.vm.metadatatable.tableType(value.tabletype);
				Index.vm.metadatatable.layerType(value.layertype);
				Index.vm.metadatatable.tableStateCode(value.tablestatecode);
				Index.vm.metadatatable.hasfile(value.hasfile);
				Index.vm.metadatatable.isDictionary(value.isDictionary);
			}
			
			initTableFieldTitle();
			var tableFieldList =result.result[1];
			//字段信息
			if (null != tableFieldList && tableFieldList.length > 0) {
				for (var i = 0; i < tableFieldList.length; i++) {
					index++;
					var htmlText = [];
					htmlText.push("<tr id='field_" + index + "'>");
					htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
					htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + index + "' value='" + tableFieldList[i].id + "' disabled /></td>");
					htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value='" + tableFieldList[i].fieldname + "' disabled/></td>");
					htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' value='" + (tableFieldList[i].displayname==undefined?"":tableFieldList[i].displayname) + "' /></td>");
					
					var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + index + "' disabled>";
					for(var item in dataTypeList.data){
						dataTypeText+="<OPTION value='"+item+"'"+(tableFieldList[i].datatypename==item?"selected":"")+">"+item+"</OPTION>";
					}
					dataTypeText+="<select/></td>";
					htmlText.push(dataTypeText);
					
					if(tableFieldList[i].datatypelength==undefined){
						htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + "' value='' disabled/></td>");
					}else{
						htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + "' value='" + tableFieldList[i].datatypelength + "' disabled/></td>");
					}					
					htmlText.push("<td style='display: none'><input type='text' class='textbox'  id='fieldID_" + index + "' value='" + tableFieldList[i].fieldid + "' disabled /></td>");
					
					var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + tableFieldList[i].fieldname +"\")'  id='classProperty_" + index + "'>";
					classPropertyText+="<OPTION value=''></OPTION>";
					for(var item in classPropertyList.data){
						classPropertyText+="<OPTION value='"+item+"'"+(tableFieldList[i].classpropertyid==item?"selected":"")+">"+classPropertyList.data[item]+"</OPTION>";
					}
					classPropertyText+="<select/></td>";

					htmlText.push(classPropertyText);
					htmlText.push("<td style='display: none'><input type='text' class='textbox' id='fieldstatecode_" + index + "' value='" + (tableFieldList[i].fieldstatecode==undefined?"":tableFieldList[i].fieldstatecode) + "' /></td>");
					if (0 == tableFieldList[i].nullflag) {
						htmlText.push("<td><input    type='checkbox'  id='nullFlag_" + index + "'>");
					} else {
						htmlText.push("<td><input  checked type='checkbox'  id='nullFlag_" + index + "'>");
					}
					if (0 == tableFieldList[i].queryfieldflag) {
						htmlText.push("<td><input  type='checkbox' id='queryFieldFlag_" + index + "'>");
					} else {
						htmlText.push("<td><input checked  type='checkbox' id='queryFieldFlag_" + index + "'>");
					}
					if (0 == tableFieldList[i].listfieldflag) {
						htmlText.push("<td><input  type='checkbox' id='listFieldFlag_" + index + "'>");
					} else {
						htmlText.push("<td><input checked  type='checkbox' id='listFieldFlag_" + index + "'>");
					}
					
					htmlText.push("</tr>");
					$("#editDetailTableField").append(htmlText.join(""));
				}				
			}
    		$("#paneltable").css('height',$("#tab-content-panel").height()-((($("#form-group-row").height()==-1 ? 35 : $("#form-group-row").height()) +6)*7)-45+'px');//
		}
	}); 
}

//初始化模板表结构字段表头
function initTableFieldTitle(){
	index=0;
	curTableid=null;
	 $("#editDetailTableField").empty();//清空元素
		var htmlText = [];
		htmlText.push("<tr>");
		htmlText.push("<td style='display:none'>ID</td>");
		htmlText.push("<td class=' col-xs-1'>序号<input type='checkbox'  id='allIndexCheck'></td>");
		htmlText.push("<td class=' col-xs-1'>字段名称</td>");
		htmlText.push("<td class=' col-xs-1'>显示名称</td>");
		htmlText.push("<td class=' col-xs-1'>字段类型</td>");
		htmlText.push("<td class=' col-xs-1'>字段长度</td>");
		htmlText.push("<td class=' col-xs-1' style='display: none'>字段标识</td>");
		htmlText.push("<td class=' col-xs-1'>基类属性</td>");
		htmlText.push("<td class=' col-xs-1' style='display: none'>字段状态标识</td>");
		htmlText.push("<td class=' col-xs-1'>可否为空<input type='checkbox'  id='allNullCheck'></td>");
		htmlText.push("<td class=' col-xs-1'>查询字段<input type='checkbox'  id='allQueryCheck'></td>");
		htmlText.push("<td class=' col-xs-1'>列表字段<input type='checkbox'  id='allListCheck'></td>");
		htmlText.push("</tr>");
		$("#editDetailTableField").append(htmlText.join(""));
		
		$("#allIndexCheck").on("click",function(evt){				
			var checked = $("#allIndexCheck")[0].checked;
			$('#editDetailTableField input[type="checkbox"]').each(function() {
		    	if ((this.id).indexOf("index_") > -1) {
		    		this.checked=checked;
		    	}
		    });
		});
		
		$("#allNullCheck").on("click",function(evt){				
			var checked = $("#allNullCheck")[0].checked;
			$('#editDetailTableField input[type="checkbox"]').each(function() {
		    	if ((this.id).indexOf("nullFlag_") > -1) {
		    		this.checked=checked;
		    	}
		    });
		});
		$("#allQueryCheck").on("click",function(evt){
			var checked = $("#allQueryCheck")[0].checked;
			$('#editDetailTableField input[type="checkbox"]').each(function() {
		    	if ((this.id).indexOf("queryFieldFlag_") > -1) {
		    		this.checked=checked;
		    	}
		    });
		});
		$("#allListCheck").on("click",function(evt){
			var checked = $("#allListCheck")[0].checked;
			$('#editDetailTableField input[type="checkbox"]').each(function() {
		    	if ((this.id).indexOf("listFieldFlag_") > -1) {
		    		this.checked=checked;
		    	}
		    });
		});
}

//增加模板表结构字段
function addTableFieldEdit(){
	index++;
	var htmlText = [];
	htmlText.push("<tr id='field_" + index + "'>");
	htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
	htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + index + "' value='0" + "'/></td>");
	htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value=''/></td>");
	htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' /></td>");	
	
	var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + index + "'>";
	for(var item in dataTypeList.data){
		dataTypeText+="<OPTION value='"+item+"'>"+item+"</OPTION>";
	}
	dataTypeText+="<select/></td>";
	htmlText.push(dataTypeText);
	
	htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + "' value=''/></td>");	
	htmlText.push("<td style='display: none'><input type='text'  class='textbox' id='fieldID_" + index + "' value='0"  + "' disabled /></td>");
	
	var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + index +"\")' id='classProperty_" + index + "'>";
	classPropertyText+="<OPTION value=''></OPTION>";
	for(var item in classPropertyList.data){
		classPropertyText+="<OPTION value='"+item+"'>"+classPropertyList.data[item]+"</OPTION>";
	}
	classPropertyText+="<select/></td>";
	htmlText.push(classPropertyText);
	htmlText.push("<td style='display: none'><input type='text' class='textbox' style='display: none' id='fieldstatecode_" + index + "' value=''/></td>");

	htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + index + "'>");
	htmlText.push("<td><input    type='checkbox'  id='queryFieldFlag_" + index + "'>");
	htmlText.push("<td><input    type='checkbox'  id='listFieldFlag_" + index + "'>");
	
	htmlText.push("</tr>");
	$("#editDetailTableField").append(htmlText.join(""));
}

//删除模板表结构字段
function delTableFieldEdit(){
	$('#editDetailTableField tr').each(function() {
		if (this.id.indexOf("field_") > -1) {
			var fieldName = this.id.replace("field_", "");
			if($("#index_" + fieldName)[0].checked==true){
				$("tr").remove("#"+this.id);//清空指定子元素
			}
        };			
	});
}

// 增加设施表模板
function addMetadatatable(){
	if(node==null){
		layer.alert('请选择市政设施组分类！', {icon: 7});
	}else if(node.state!="leaf"){
		layer.alert('请重新选择市政设施叶子节点分类！', {icon: 7});
	}else{
		savaState="add";
		getMetaClassProperty(node.id);
		$(".tablefield-sync").hide();
		$(".tablefield-add").show();
		$(".tablefield-del").show();
		$("#tableName").attr("disabled",false);
		$("#referenceTable").attr("disabled",false);
		$("#getTableField").show();
		initTableFieldTitle();
		$('#defaultForm').data('bootstrapValidator').resetForm(true);
		$('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
		for(var i in Index.vm.metadatatable){
			if(i == "templateName" || i=="tableType" || i=="layerType"){
				Index.vm.metadatatable[i]("-1");
			}else{
				Index.vm.metadatatable[i]("");
			}
		}
	}
}

//保存设施表模板
function saveMetadatatable(){
	if(node==null){
		layer.alert('请选择对应设施表模板！', {icon: 7});
		return;
	}
	var tableFieldList = [];

	$('#editDetailTableField tr').each(function() {
		if (this.id.indexOf("field_") > -1) {
			var fieldName = this.id.replace("field_", "");
			var fieldInfo = {
					"id":$("#ID_" + fieldName).val(),
                "fieldName": $("#fieldName_" + fieldName).val(),
                "displayName": $("#disName_" + fieldName).val(),
                "dataTypeName": $("#dtName_" + fieldName).val(),
                "dataTypeLength": $("#dataTypeLength_" + fieldName).val(),
                "fieldID": $("#fieldID_" + fieldName).val(),
                "classProperty": $("#classProperty_" + fieldName).val(),
				"fieldStateCode": $("#fieldstatecode_" + fieldName).val(),
                "relatedFieldFlag": (Index.vm.metadatatable["relatedFieldName"]()==fieldName?1:0),
                "primaryKeyFieldFlag": (Index.vm.metadatatable["primaryKeyName"]()==fieldName?1:0),
                "nullFlag": $("#nullFlag_" + fieldName)[0].checked==true?1:0,
                "queryFieldFlag": $("#queryFieldFlag_" + fieldName)[0].checked==true?1:0,
                "listFieldFlag": $("#listFieldFlag_" + fieldName)[0].checked==true?1:0
            };
			tableFieldList.push(fieldInfo);
		}
	});
	
	var metadatatable = {
			tableFieldList: JSON.stringify(tableFieldList),
			metadatacategoryid:node.id
	};
	for(var i in Index.vm.metadatatable){
		metadatatable[i] = Index.vm.metadatatable[i]();
	}
    if(metadatatable.tableName==""){
		layer.alert('请完善表物理名称信息后再保存！', {icon: 7});
		return;
	}else if(metadatatable.primaryKeyName==""){
		layer.alert('请完善主键信息后再保存！', {icon: 7});
		return;
	}
    else if(metadatatable.tableFieldList=="[]"){
		layer.alert('请添加表字段信息后再保存！', {icon: 7});
		return;
	}

	$.ajax({
		type : "post" ,
		data : {tablename:metadatatable.tableName},
		dataType : "json",
		url : "/"+serverName+"/asi/facilitymgr/facilitymgr/dynamictable!queTableExist.action",
		success :function(result){
			if(result.result == "true"){
				metadatatable["createState"] = "no";
				save(metadatatable);
			}else{
				//询问框
				layer.confirm('是否还需创建该表模板的物理表结构？', {
					btn: ['是','否'] //按钮
				}, function(){
					metadatatable["createState"] = "yes";
					save(metadatatable);
				}, function(){
					metadatatable["createState"] = "no";
					save(metadatatable);
				});
			}
		}
	});
}

//保存设施表模板数据
function save(metadatatable){
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!saveMetadatatableData.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			if(result.success){
			    savaState="modif";
				layer.msg('保存成功！', {
					  icon: 1,
					  time: 1000 //2秒关闭（如果不配置，默认是3秒）
					});
				$(".tablefield-add").show();
				$(".tablefield-del").show();
				$("#tableName").attr("disabled",false);
				$("#referenceTable").attr("disabled",false);
				$("#getTableField").show();
				Index.loadTreeData();				
				initTableFieldTitle();
				for(var i in Index.vm.metadatatable){
					if(i == "templateName" || i=="tableType" || i=="layerType"){
						Index.vm.metadatatable[i]("-1");
					}else{
    					Index.vm.metadatatable[i]("");
					}
				}
				getMetadatatableData();
			}else {
				layer.msg('保存失败！', {
					icon: 2,
					time: 2000
				});
			}
		}
	}); 
}

//排序设施表模板字段
function sortMetadatatable(){
    if(node.iconCls=="icon-children"){
    	layer.closeAll();
    	var width=$(window).width()/4;
    	var height=$(window).height()*4/5;
    	//iframe窗
        layer.open({
    	      type: 2,
    	      title: "字段排序",
    	      shadeClose: true,
    	      //closeBtn : [0 , true],
    	      shade: false,
    	      maxmin: false, //开启最大化最小化按钮
    	      area: [width+'px', height+'px'],
    	      offset: ['60px', $(window).width()/2+'px'],
    	      content: "fieldsort.html?serverName="+serverName+"&tableid="+node.id

    	    });
	}else{
		layer.alert('请重新选择对应设施表模板！', {icon: 7});
		return;
	}
}

//删除设施表模板
function deleteMetadatatable(){
	if(node==null){
		layer.alert('请选择对应设施表模板！', {icon: 7});
		return;
	}
    if(node.iconCls=="icon-children"){
    	//询问框
    	layer.confirm('将删除表模板结构以及数据库表结构和数据，是否继续删除？', {
    	  btn: ['确定','取消'] //按钮
    	}, function(){
        	var metadatatable = {
        			tableid:node.id
        	};
        	for(var i in Index.vm.metadatatable){
        		metadatatable[i] = Index.vm.metadatatable[i]();
        	}
        	var requestURL = "";
        	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!delMetadatatableData.action";
        	$.ajax({
        		type : "post" ,
        		data : metadatatable,
        		dataType : "json",
        		url : requestURL,
        		async : false,
        		success :function(result){
        			if(result.success){
        				layer.msg('删除成功！', {
      					  icon: 1,
      					  time: 2000 //2秒关闭（如果不配置，默认是3秒）
      					});
        				$(".tablefield-add").show();
        				$(".tablefield-del").show();
        				$("#tableName").attr("disabled",false);
        				$("#referenceTable").attr("disabled",false);
        				$("#getTableField").show();
        				Index.loadTreeData();
        				initTableFieldTitle();
        				for(var i in Index.vm.metadatatable){
        					if(i == "templateName" || i=="tableType" || i=="layerType"){
        						Index.vm.metadatatable[i]("-1");
        					}else{
            					Index.vm.metadatatable[i]("");
        					}
        				}
        			}
        		}
        	}); 
    	}, function(){
    		return;
    	});
	}else{
		layer.alert('请重新选择对应设施表模板！', {icon: 7});
		return;
	}
}

//参考物理表获取字段
function getTableField(){
	initTableFieldTitle();
	var metadatatable = {
	};
	for(var i in Index.vm.metadatatable){
		metadatatable[i] = Index.vm.metadatatable[i]();
	}
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getTableFieldListByName.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var list =result.result;
			for(var item in list){
				var value=list[item];
				var htmlText = [];
				htmlText.push("<tr id='field_" + value.fieldname + "'>");
				htmlText.push("<td><input    type='checkbox'  id='index_" +  value.fieldname + "'>");
				htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + value.fieldname + "' value='0" + "' disabled /></td>");
				htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + value.fieldname + "' value='" + value.fieldname + "' /></td>");
				htmlText.push("<td><input type='text' class='textbox' id='disName_" + value.fieldname + "' value='" + (value.displayname==undefined?"":value.displayname) + "'/></td>");
				
				var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + value.fieldname + "'>";
				for(var item in dataTypeList.data){
					dataTypeText+="<OPTION value='"+item+"'"+(value.datatypename==item?"selected":"")+">"+item+"</OPTION>";
				}
				dataTypeText+="<select/></td>";
				htmlText.push(dataTypeText);
				
				htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + value.fieldname + "' value='" + (value.datatypelength==undefined?'':value.datatypelength) + "'/></td>");
				htmlText.push("<td style='display: none'><input type='text' class='textbox'  id='fieldID_" + value.fieldname + "' value='0"  + "' disabled /></td>");
				
				var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + value.fieldname +"\")' id='classProperty_" + value.fieldname + "'>";
				classPropertyText+="<OPTION value=''></OPTION>";
				for(var item in classPropertyList.data){
					classPropertyText+="<OPTION value='"+item+"'>"+classPropertyList.data[item]+"</OPTION>";
				}
				classPropertyText+="<select/></td>";
				htmlText.push(classPropertyText);
				htmlText.push("<td style='display: none'><input type='text' class='textbox' style='display: none' id='fieldstatecode_" + value.fieldname + "'/></td>");
				htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + value.fieldname + "'>");
				htmlText.push("<td><input    type='checkbox'  id='queryFieldFlag_" + value.fieldname + "'>");
				htmlText.push("<td><input    type='checkbox'  id='listFieldFlag_" + value.fieldname + "'>");
				
				htmlText.push("</tr>");
				$("#editDetailTableField").append(htmlText.join(""));
			}
		}
	}); 
}

//获取其他数据源表字段
function getDataSource(){
	$("#myModal").modal();
	//layer.alert("test");
}

//获取设施基类模板属性
function getMetaClassProperty(nodeID){
	classPropertyList=new Dictionary();
	classPropertyNameList = null;
	var requestURL = "";
	var metaclassproperty = {
			nodeID:nodeID
	};
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getMetaClassProperty.action";
	$.ajax({
		type : "post" ,
		data : metaclassproperty,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var list =result.result;

			classPropertyNameList=list;
			for(var item in list){
				var value=list[item];
				classPropertyList.put(value.classpropertyid,value.displayname);
			}
			
		}
	}); 
}

//匹配模板表结构字段
function matchTableFieldEdit(){
	$('#editDetailTableField tr').each(function() {
		if (this.id.indexOf("field_") > -1) {
			var fieldName = this.id.replace("field_", "");
			for(var item in classPropertyNameList){
				var value=classPropertyNameList[item];
				if(fieldName.toUpperCase()==value.classpropertyname.toUpperCase()){
					$("#disName_" + fieldName).val(value.displayname);
					$("#classProperty_" + fieldName).val(value.classpropertyid);
					$("#fieldstatecode_" + fieldName).val(value.fieldstatecode),
					$("#nullFlag_" + fieldName)[0].checked=(value.nullflag==1?true:false);
					$("#queryFieldFlag_" + fieldName)[0].checked=(value.querypropertyflag==1?true:false);
					$("#listFieldFlag_" + fieldName)[0].checked=(value.listpropertyflag==1?true:false);
					break;
				}
			}
		}
	});
}
//同步基类模板数据
function  synMetaClassData(){
	var ifHasData = $('#editDetailTableField tr');
	if(ifHasData.length==1){
		$("#editDetailTableField").empty();
		initTableFieldTitle();
		var metaClassData = classPropertyNameList;
		if (null != metaClassData && metaClassData.length > 0) {
			index = 0;
			for (var i = 0; i < metaClassData.length; i++) {
				index++;
				var htmlText = [];
				htmlText.push("<tr id='field_" + index + "'>");
				htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
				htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + index + "' value='" + 0 + "' disabled /></td>");
				htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value='" + metaClassData[i].classpropertyname + "' "+ (savaState == 'modif'?'disabled':'')+"/></td>");
				htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' value='" + (metaClassData[i].displayname==undefined?"":metaClassData[i].displayname) + "' /></td>");

				var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + index + "'>";
				for(var item in dataTypeList.data){
					dataTypeText+="<OPTION value='"+item+"'>"+item+"</OPTION>";
				}
				dataTypeText+="<select/></td>";
				htmlText.push(dataTypeText);

				if(metaClassData[i].datatypelength==undefined){
					htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + "'/></td>");
				}else{
					htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + " ' value='" + metaClassData[i].datatypelength + "'/></td>");
				}
				htmlText.push("<td style='display: none'><input type='text' class='textbox' id='fieldID_" + index + "' value='" + 0 + "' disabled /></td>");

				var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + metaClassData[i].classpropertyname +"\")'  id='classProperty_" + index + "'>";
				classPropertyText+="<OPTION value=''></OPTION>";
				for(var item in classPropertyList.data){
					classPropertyText+="<OPTION value='"+item+"'"+(metaClassData[i].classpropertyid==item?"selected":"")+">"+classPropertyList.data[item]+"</OPTION>";
				}
				classPropertyText+="<select/></td>";
				htmlText.push(classPropertyText);

				htmlText.push("<td style='display: none'><input type='text' class='textbox' id='fieldstatecode_" + index + "' value='" + (metaClassData[i].fieldstatecode==undefined?"":metaClassData[i].fieldstatecode) + "' /></td>");
				if (0 == metaClassData[i].nullflag) {
					htmlText.push("<td><input    type='checkbox'  id='nullFlag_" + index + "'>");
				} else {
					htmlText.push("<td><input  checked type='checkbox'  id='nullFlag_" + index + "'>");
				}
				if (0 == metaClassData[i].querypropertyflag) {
					htmlText.push("<td><input  type='checkbox' id='queryFieldFlag_" + index + "'>");
				} else {
					htmlText.push("<td><input checked  type='checkbox' id='queryFieldFlag_" + index + "'>");
				}
				if (0 == metaClassData[i].listpropertyflag) {
					htmlText.push("<td><input  type='checkbox' id='listFieldFlag_" + index + "'>");
				} else {
					htmlText.push("<td><input checked  type='checkbox' id='listFieldFlag_" + index + "'>");
				}

				htmlText.push("</tr>");
				$("#editDetailTableField").append(htmlText.join(""));
			}
		}
	}else{
		matchTableFieldEdit();
	}

}
//是否存在物理表
function existTable(){
	var metadatatable = {
		referenceTable:Index.vm.metadatatable.tableName
	};
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getTableFieldListByName.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var list =result.result;
			if(list.length==0){
				return false;
			}else{
				return true;
			}
		}
	});
}

//改变基类属性选项事件
function classPropertyChange(fieldName) {
	var classpropertyid =$("#classProperty_" + fieldName).val();
	if(classpropertyid==""){
		$("#disName_" + fieldName).val("");
		$("#nullFlag_" + fieldName)[0].checked=true;
		$("#queryFieldFlag_" + fieldName)[0].checked=false;
		$("#listFieldFlag_" + fieldName)[0].checked=false;
	}else{
		for(var item in classPropertyNameList){
			var value=classPropertyNameList[item];
			if(classpropertyid==value.classpropertyid){
				$("#disName_" + fieldName).val(value.displayname);
				$("#nullFlag_" + fieldName)[0].checked=(value.nullflag==1?true:false);
				$("#queryFieldFlag_" + fieldName)[0].checked=(value.querypropertyflag==1?true:false);
				$("#listFieldFlag_" + fieldName)[0].checked=(value.listpropertyflag==1?true:false);
				break;
			}
		}
	}
}

//同步更新模板表结构字段
function syncTableFieldEdit(){
	initTableFieldTitle();
	var metadatatable = {
			tableID:node.id,
			tableName:Index.vm.metadatatable.tableName
	};
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getTableFieldListByTableName.action";
	$.ajax({
		type : "post" ,
		data : metadatatable,
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var list =result.result;
			index = 0;
			for(var item in list){
				var value=list[item];
				index++;
				var htmlText = [];
				htmlText.push("<tr id='field_" + index + "'>");
				htmlText.push("<td><input    type='checkbox'  id='index_" +  index + "'>");
				htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + index+ "' value='0" + "' disabled /></td>");
				htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value='" + value.fieldname + "' "+ (savaState == 'modif'?'disabled':'')+"/></td>");
				htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' /></td>");
				
				var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + index + "' disabled >";
				for(var item in dataTypeList.data){
					dataTypeText+="<OPTION value='"+item+"'"+(value.datatypename==item?"selected":"")+">"+item+"</OPTION>";
				}
				dataTypeText+="<select/></td>";
				htmlText.push(dataTypeText);

				htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + index + "' value='" + value.datatypelength + "' /></td>");
				htmlText.push("<td style='display: none'><input type='text' class='textbox' id='fieldID_" + index + "' value='" + value.fieldid  + "' disabled /></td>");
				
				var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + value.fieldname +"\")' id='classProperty_" + index + "'>";
				classPropertyText+="<OPTION value=''></OPTION>";
				for(var item in classPropertyList.data){
					classPropertyText+="<OPTION value='"+item+"'>"+classPropertyList.data[item]+"</OPTION>";
				}
				classPropertyText+="<select/></td>";
				htmlText.push(classPropertyText);
				htmlText.push("<td style='display: none'><input type='text' class='textbox' id='fieldstatecode_" + index + "'/></td>");
				htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + index + "'></td>");
				htmlText.push("<td><input    type='checkbox'  id='queryFieldFlag_" + index + "'></td>");
				htmlText.push("<td><input    type='checkbox'  id='listFieldFlag_" + index + "'></td>");
				
				htmlText.push("</tr>");
				$("#editDetailTableField").append(htmlText.join(""));
			}
		}
	}); 
}


function Dictionary(){
	this.data = new Array();

	this.put = function(key,value){
	 this.data[key] = value;
	};

	this.get = function(key){
	 return this.data[key];
	};

	this.remove = function(key){
	 this.data[key] = null;
	};

	this.isEmpty = function(){
	 return this.data.length == 0;
	};

	this.size = function(){
	 return this.data.length;
	};
}
$(window).resize(function() {
	$('.full-height').each(function() {
		$(this).height($(window).height() - $(this).offset().top - 90);
	});
});

//只能选中一个
function singleSelect(option){
	var selectedOptions = $('#connectType option:selected');
	if (selectedOptions.length > 1) {
		for(var i=0;i<selectedOptions.length;i++){
			selectedOptions[i].selected = false;
		}
		selectedOptions[0].selected = true;
	}

	var selectedValue = $("#connectType").val();
	if(selectedValue == 'Mysql'){
		$("#driverName").val("com.mysql.jdbc.Driver");
	}else{
		$("#driverName").val("");
	}
}
function matchFields(){
	var tbname = $("#tbname").val();
	var dbname = $("#dbname").val();
	var driname = $("#driverName").val();
	var address = $("#address").val();
	var dbport = $("#dbport").val();
	var dbuser = $("#dbuser").val();
	var connectType = $("#connectType").val();
	if(connectType == "" || connectType ==null){
		layer.alert("请选中连接类型！！");
	}else if(tbname=="" || tbname == null){
		layer.alert("表名称不能为空！");
	}else{
		var flag = $("#myform").valid();
		if(flag){
			var metadatatable = {
				referenceTable:Index.vm.metadatatable.tableName
			};
			var requestURL = "";
			requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getConnectOtherDatasource.action?tbname="+tbname;
			var testdata = $("#myform").serialize();
			$.ajax({
				type : "post" ,
				data : $("#myform").serialize(),
				dataType : "json",
				url : requestURL,
				async : false,
				success :function(result){
					var list =result.result;
					for(var item in list){
						var value=list[item];
						var htmlText = [];
						htmlText.push("<tr id='field_" + value.fieldname + "'>");
						htmlText.push("<td><input    type='checkbox'  id='index_" +  value.fieldname + "'>");
						htmlText.push("<td style='display:none'><input type='text' class='textbox' id='ID_" + value.fieldname + "' value='0" + "' disabled /></td>");
						htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + value.fieldname + "' value='" + value.fieldname + "' /></td>");
						htmlText.push("<td><input type='text' class='textbox' id='disName_" + value.fieldname + "' value='" + (value.displayname==undefined?"":value.displayname) + "'/></td>");

						var dataTypeText = "<td><select type='text' class='textbox' id='dtName_" + value.fieldname + "'>";
						for(var item in dataTypeList.data){
							dataTypeText+="<OPTION value='"+item+"'"+(value.datatypename==item?"selected":"")+">"+item+"</OPTION>";
						}
						dataTypeText+="<select/></td>";
						htmlText.push(dataTypeText);
						//value.datatypelength
						htmlText.push("<td><input type='text' class='textbox' id='dataTypeLength_" + value.fieldname + "' value='" + (value.datatypelength==undefined?"":value.datatypelength) + "'/></td>");
						htmlText.push("<td style='display: none'><input type='text' class='textbox'  id='fieldID_" + value.fieldname + "' value='0"  + "' disabled /></td>");

						var classPropertyText = "<td><select type='text' class='textbox' onChange='classPropertyChange(\"" + value.fieldname +"\")' id='classProperty_" + value.fieldname + "'>";
						classPropertyText+="<OPTION value=''></OPTION>";
						for(var item in classPropertyList.data){
							classPropertyText+="<OPTION value='"+item+"'>"+classPropertyList.data[item]+"</OPTION>";
						}
						classPropertyText+="<select/></td>";
						htmlText.push(classPropertyText);
						htmlText.push("<td style='display: none'><input type='text' class='textbox' style='display: none' id='fieldstatecode_" + value.fieldname + "'/></td>");
						htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + value.fieldname + "'>");
						htmlText.push("<td><input    type='checkbox'  id='queryFieldFlag_" + value.fieldname + "'>");
						htmlText.push("<td><input    type='checkbox'  id='listFieldFlag_" + value.fieldname + "'>");

						htmlText.push("</tr>");
						$("#editDetailTableField").append(htmlText.join(""));
					}
				}
			});
			$('#myModal').modal('hide');
			$('#myform')[0].reset();
		}
	}
}
function testconnect(){
	var dbname = $("#dbname").val();
	var driname = $("#driverName").val();
	var address = $("#address").val();
	var dbport = $("#dbport").val();
	var dbuser = $("#dbuser").val();
	var connectType = $("#connectType").val();
	if(connectType == "" || connectType ==null){
		layer.alert("请选中连接类型！！");
	}else{
		var flag = $("#myform").valid();
		if(flag){
			var requestURL = "";
			requestURL = "/"+serverName+"/asi/municipalBuild/facilityLayout/metadatatable!getConnectDataSource.action";
			var testdata = $("#myform").serialize();
			$.ajax({
				type : "post" ,
				data : $("#myform").serialize(),
				dataType : "json",
				url : requestURL,
				async : false,
				success :function(result){
					layer.alert(result.msg);
				}
			});
		}
	}
}


