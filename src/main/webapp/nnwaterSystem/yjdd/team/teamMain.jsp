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
   var typeid;
   var selnode;
   $(function(){
   	$("#panteamTree").tree({
   		lines:true,
	   	onContextMenu: function(e, node){
	   		var did=node.id;
   			if(did.indexOf("team_")!=-1){
   				selnode=node;
   				$('#mm2').menu('show', {
					left: e.pageX,
					top: e.pageY
				});
   			}else if(did=='root'){
   				$('#mm').menu('show', {
					left: e.pageX,
					top: e.pageY
				});
   			}else{
   				typeid=did.replace("type_","");
   				selnode=node;
   				$('#mm1').menu('show', {
					left: e.pageX,
					top: e.pageY
				});
   			}
   			e.stopPropagation();
   			e.preventDefault();
   			return false;
	   	},
	   	onClick:function(node){
	   		var did=node.id;
   			if(did.indexOf("team_")!=-1){
   				$w.execUrl(ctx+"/gzps/yjdd/TeamPage@showTeamUserList.page?bean.teamid="+did.replace("team_",""),{},"panInfopanel");
   			}
	   	}
   	})
		$w.execUrl(ctx+"/gzps/yjdd/TeamPage@showTeamUserList.page",{},"panInfopanel");
   })
   function addtype(){
   	window.$w.openDialog({title:'添加队伍分类',url:ctx+"/gzps/yjdd/TeamPage@typeShow.page?new_=true",w:300,h:180,afterClose:function(re){
		if(re){
			window.location.reload();
		}
	}});
   }
   function edittype(){
   		window.$w.openDialog({title:'修改队伍分类',url:ctx+"/gzps/yjdd/TeamPage@typeShow.page?new_=false&id="+typeid,w:300,h:180,afterClose:function(re){
			if(re){
				window.location.reload();
			}
		}});
   }
   function deltype(){
   window.$w.confirmMsg("确定要删除队伍分类？",function(r){
   	if(r){
   		$w.doUrl(ctx+"/gzps/yjdd/TeamPage@delType.page?id="+typeid,{},function(){
   			window.location.reload();
   		})
		}
	})
   }
   function addsptype(){
   		var typeid="";
   		if(selnode){
   			var did=selnode.id;
   			if(did.indexOf("team_")!=-1)did=$("#panteamTree").tree("getParent",selnode.target).id;
   			typeid=did.replace("type_","");
   		}
   		window.$w.openDialog({title:'队伍管理',url:ctx+"/gzps/yjdd/TeamPage@addShow.page?typeid="+typeid,w:400,h:350,afterClose:function(re){
			if(re){
				window.location.reload();
			}
		}});
   }
   function editsptype(){
   		var id="";
   		if(selnode){
   			id=selnode.id.replace("team_","");
   		}else{
   			var node=$("#panteamTree").tree("getSelected");
   			if(node){
   				id=node.id.replace("team_","");
   			}
   		}
   		if(id){
	   		window.$w.openDialog({title:'队伍管理',url:ctx+"/gzps/yjdd/TeamPage@updateShow.page?id="+id,w:400,h:350,afterClose:function(re){
				if(re){
					window.location.reload();
				}
			}});
		}
   }
   function delsptype(){
   		var id="";
   		if(selnode){
   			id=selnode.id.replace("team_","");
   		}else{
   			var node=$("#panteamTree").tree("getSelected");
   			if(node){
   				id=node.id.replace("team_","");
   			}
   		}
   		if(id){
	   		window.$w.confirmMsg("确定要删除队伍？",function(r){
		   	if(r){
		   		$w.doUrl(ctx+"/gzps/yjdd/TeamPage@del.page?id="+id,{},function(){
		   			window.location.reload();
		   		})
				}
			})
		}
   }
   
   function addUser(teamid){
   		window.$w.openDialog({title:'添加队伍人员',url:ctx+"/gzps/yjdd/TeamPage@userShow.page?new_=true&bean.teamid="+teamid,w:400,h:350,afterClose:function(re){
			if(re){
					$w.execForm({target:'panInfopanel'})
			}
		}});
   }
   function editUser(id){
   		window.$w.openDialog({title:'添加队伍人员',url:ctx+"/gzps/yjdd/TeamPage@userShow.page?new_=false&id="+id,w:400,h:350,afterClose:function(re){
			if(re){
					$w.execForm({target:'panInfopanel'})
			}
		}});
   }
   function delUser(id){
   		window.$w.confirmMsg("确定要删除人员？",function(r){
		   	if(r){
		   		$w.doUrl(ctx+"/gzps/yjdd/TeamPage@delUser.page?id="+id,{},function(){
		   			$w.execForm({target:'panInfopanel'})
		   		})
			}
		})
   }
   </script>
   </head>
   <body class="easyui-layout" fit="true">
    <div data-options="region:'west',split:true,border:false" style="width:200px">
    	<div class="easyui-panel" fit="true" title="应急队伍信息" style="">
    		<div class="ui-toolBar">
				<a href="#" class="easyui-linkbutton" iconCls="icon_add" title="添加队伍" plain="true" onclick="selnode=null;addsptype()"></a><a href="#" class="easyui-linkbutton" iconCls="icon_edit" title="修改队伍" plain="true" onclick="selnode=null;editsptype()"></a><a href="#" class="easyui-linkbutton" iconCls="icon_del" title="删除队伍" plain="true" onclick="selnode=null;delsptype()"></a>
			</div>
				<ul id="panteamTree" class="easyui-tree" style="margin-left:0px;margin-top:5px;">
					<li id="root"><span>应急队伍分类</span>
					<ul>
					<w:iterate id="info" bind="resultList_">
					<li id="type_<w:write bind="#info.id"/>" data-options="iconUrl:'<%=path %>/gzps/yjdd/img/folder.gif'">  
					      <span><w:write bind="#info.name"/></span>
					      <ul>
					     	<w:iterate id="team" bind="#info.teamList">
					      	<li id="team_<w:write bind="#team.id"/>" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_group.png'"><span><w:write bind="#team.name"/></span></li>
					      	</w:iterate>
					      </ul>
					</li>
					</w:iterate>
					</ul>
					</li>
				</ul>
		</div>
    </div>
   <div data-options="region:'center',border:false">
		<div class="easyui-panel" fit="true" title="队伍人员信息" id="panInfopanel">
			
		</div>
	</div>
	<div id="mm" class="easyui-menu" style="width:120px;display:none">
		<div onclick="addtype()" data-options="iconCls:'icon_t1'">添加分类</div>
	</div>
	<div id="mm1" class="easyui-menu" style="width:120px;display:none">
		<div onclick="addtype()" data-options="iconCls:'icon_t1'">添加分类</div>
		<div onclick="edittype()" data-options="iconCls:'icon_t2'">修改分类</div>
		<div onclick="deltype()" data-options="iconCls:'icon_t3'">删除分类</div>
		<div class="menu-sep"></div>
		<div onclick="addsptype()" data-options="iconCls:'icon_add'">添加队伍</div>
	</div>
	<div id="mm2" class="easyui-menu" style="width:120px;display:none">
		<div onclick="addsptype()" data-options="iconCls:'icon_add'">添加队伍</div>
		<div onclick="editsptype()" data-options="iconCls:'icon_edit'">修改队伍</div>
		<div onclick="delsptype()" data-options="iconCls:'icon_del'">删除队伍</div>
	</div>
</body>
</html>