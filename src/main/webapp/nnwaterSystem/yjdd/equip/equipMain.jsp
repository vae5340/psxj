<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
   <style>
   .icon_t1{background:url('<%=path%>/resources/images/icons/16_16/application_form_add.png') no-repeat center center;}
    .icon_t2{background:url('<%=path%>/resources/images/icons/16_16/application_edit.png') no-repeat center center;}
    .icon_t3{background:url('<%=path%>/resources/images/icons/16_16/application_form_delete.png') no-repeat center center;}
    
   </style>
   <script>
   var selnode;
   $(function(){
   	$("#panteamTree").tree({
   		lines:true,
	   	onContextMenu: function(e, node){
	   		selnode=node;
   			$('#mm1').menu('show', {
					left: e.pageX,
					top: e.pageY
			});
   			e.stopPropagation();
   			e.preventDefault();
   			return false;
	   	},
	   	onClick:function(node){
	   		var did=node.id;
	   		if(did=="root")
	   			$w.execUrl(ctx+"/gzps/yjdd/EquipPage@equipList.page",{},"panInfopanel");
	   		else
   			$w.execUrl(ctx+"/gzps/yjdd/EquipPage@equipList.page?bean.type="+did,{},"panInfopanel");
   			
	   	}
   	})
   	$w.execUrl(ctx+"/gzps/yjdd/EquipPage@equipList.page",{},"panInfopanel");
   })
  
  function addsptype(){
  	window.$w.openDialog({title:'添加装备分类',url:ctx+"/gzps/yjdd/EquipPage@typeShow.page?new_=true",w:300,h:180,afterClose:function(re){
		if(re){
			$("#panteamTree").tree("append",{
				parent: $("#panteamTree").tree("getRoot").target,
				data: [{
					id: re.id,
					text: re.name,
					iconUrl:ctx+'/gzps/yjdd/img/folder.gif'
				}]
			})
		}
	}});
  }
  function editsptype(){
  	var typeid="";
   	if(selnode){
   			typeid=selnode.id;
   	}else{
   		var node=$("#panteamTree").tree("getSelected");
   		if(node){
   			selnode=node;
   				typeid=node.id;
   		}
   	}
   	if(typeid){
	   		window.$w.openDialog({title:'修改装备分类',url:ctx+"/gzps/yjdd/EquipPage@typeShow.page?new_=false&id="+typeid,w:300,h:180,afterClose:function(re){
				if(re){
					$("#panteamTree").tree("update",{
						target: selnode.target,
						text: re.name
					})
				}
			}});
		}
  }
  function delsptype(){
  	var typeid="";
   	if(selnode){
   			typeid=selnode.id;
   	}else{
   		var node=$("#panteamTree").tree("getSelected");
   		if(node){
   		selnode=node;
   				typeid=node.id;
   		}
   	}
   	if(typeid){
	   		window.$w.confirmMsg("确定要删除分类："+selnode.text+"？",function(r){
		   	if(r){
		   		$w.doUrl(ctx+"/gzps/yjdd/EquipPage@delType.page?id="+id,{},function(){
		   			$("#panteamTree").tree("remove",selnode.target);
		   		})
				}
			})
	}
  }
  function addUser(type){
  	window.$w.openDialog({title:'添加装备',url:ctx+"/gzps/yjdd/EquipPage@addShow.page?bean.type="+type,w:400,h:400,afterClose:function(re){
			if(re){
					$w.execForm({target:'panInfopanel'})
			}
		}});
  } 
  function editUser(id){
  	window.$w.openDialog({title:'修改装备',url:ctx+"/gzps/yjdd/EquipPage@updateShow.page?id="+id,w:400,h:400,afterClose:function(re){
			if(re){
					$w.execForm({target:'panInfopanel'})
			}
		}});
  } 
   </script>
   </head>
   <body class="easyui-layout" fit="true">
    <div data-options="region:'west',split:true,border:false" style="width:170px">
    	<div class="easyui-panel" fit="true" title="应急装备分类" style="">
    		<div class="ui-toolBar">
				<a href="#" class="easyui-linkbutton" iconCls="icon_add" title="添加分类" plain="true" onclick="selnode=null;addsptype()"></a><a href="#" class="easyui-linkbutton" iconCls="icon_edit" title="修改分类" plain="true" onclick="selnode=null;editsptype()"></a><a href="#" class="easyui-linkbutton" iconCls="icon_del" title="删除分类" plain="true" onclick="selnode=null;delsptype()"></a>
			</div>
				<ul id="panteamTree" class="easyui-tree" style="margin-left:0px;margin-top:5px;">
					<li id="root"><span>应急装备分类</span>
					<ul>
					<w:iterate id="info" bind="resultList_">
					<li id="<w:write bind="#info.id"/>" data-options="iconUrl:'<%=path %>/gzps/yjdd/img/folder.gif'">  
					      <span><w:write bind="#info.name"/></span>
					</li>
					</w:iterate>
					</ul>
					</li>
				</ul>
		</div>
    </div>
    <div data-options="region:'center',border:false">
		<div class="easyui-panel" fit="true" title="应急装备信息" id="panInfopanel">
			
		</div>
	</div>
    <div id="mm1" class="easyui-menu" style="width:120px;display:none">
		<div onclick="addsptype()" data-options="iconCls:'icon_add'">添加分类</div>
		<div onclick="editsptype()" data-options="iconCls:'icon_edit'">修改分类</div>
		<div onclick="delsptype()" data-options="iconCls:'icon_del'">删除分类</div>
	</div>
</body>
</html>