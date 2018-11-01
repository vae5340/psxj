<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
   <style>
   .icon_pan1{background:url('<%=path%>/resources/images/icons/16_16/application_get.png') no-repeat center center;}
   .icon_pan2{background:url('<%=path%>/resources/images/icons/16_16/application_put.png') no-repeat center center;}
   .icon_pan3{background:url('<%=path%>/resources/images/icons/16_16/application_error.png') no-repeat center center;}
   .icon_xls{background:url('<%=path%>/resources/images/icons/16_16/page_excel.png') no-repeat center center;}
   .state0{color:#000000}
   .state2{color:#550000}
   .panbg1{color:#008000;font-weight:bold}
   .panbg1 a{color:#008000;font-weight:bold}
   </style>
	<script>
	function openPanMain(id){
		window.addTab("YjddMap","应急调度室",ctx+"/gzps/yjdd/YjddPage.page","/UI/style/default/images/application_view_tile.png",true,true,false);
	}
	function startPanShow(){
		window.$w.openDialog({title:'启动预案',url:ctx+"/gzps/yjdd/PanPage@startPanShow.page",w:780,h:470,afterClose:function(re){
			if(re)
				$w.execForm()
		}});
	}
	function showPan(id){
		window.$w.openDialog({title:'预案管理',url:ctx+"/gzps/yjdd/PanPage@show.page?id="+id,w:730,h:480,afterClose:function(re){
			if(re)
				$w.execForm()
		}});
	}
	</script>
  </head>
  
  <body>
  	<form action="/gzps/yjdd/PanPage.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false" title="已启动或启动过的预案，您也可以启动新预案">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;预案编号：</td><td><w:text bind="bean.code" style="width:80px;"/></td>
			<td>&nbsp;预案名称：</td><td><w:text bind="bean.name" style="width:100px;"/></td>
			<td>&nbsp;预案级别：</td><td><select name="bean.pan_level" ><option>------</option><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></select></td>
			<td>&nbsp;预案分类：</td><td><select name="bean.type" ><option>------</option><w:options bind="bean.pan_level" typeCode="YJDD_PAN_TYPE"/></select></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<div class="easyui-panel ui-toolBar" border="false" data-options="doSize:false">
		<a href="#" class="easyui-linkbutton" iconCls="icon_add" plain="true" onclick="startPanShow()">启动新预案</a>
		<a href="#" class="easyui-line"></a>
		<a href="#" class="easyui-linkbutton" iconCls="icon_xls" plain="true" onclick="">导出Excel</a>
	</div>
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th width="30" align="center"><input type="checkbox" name="all_box" value="all" onclick="$selAllTbBoxs(this)"></th>
	    			<th>预案分类</th>
	    			<th>预案名称</th>
	    			<th>预案级别</th>
	    			<th>预案描述</th>
	    			<th>启动时间</th>
	    			<th>结束时间</th>
	    			<th width="45" align="center">状态</th>
	    			<th width="130" align="center">操作</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td panbg<w:write bind="#info.state"/>">
					<td><input type="checkbox" name="primaryKey_" value="<w:write bind="#info.id"/>"></td>
				    <td><w:write bind="#info.type" typeCode="YJDD_PAN_TYPE"/></td>
				    <td><a href="javascript:showPan('<w:write bind="#info.id"/>');"><w:write bind="#info.name"/></a></td>
				    <td><w:write bind="#info.pan_level" typeCode="YJDD_PAN_LEVEL"/></td>
				    <td><w:write bind="#info.content"/></td>
				    <td><w:write bind="#info.starttime" format="yyyy-MM-dd"/></td>
				    <td><w:write bind="#info.endtime" format="yyyy-MM-dd"/></td>
				    <td class="state<w:write bind="#info.state"/>"><w:write bind="#info.state" format="[未启动,已启动,已解除]"/></td>
				    <td style="padding-left:2px;"><w:equal bind="#info.state" value="1"><button style="width:105px;height:28px;cursor:pointer" onclick="openPanMain();return false;"><table><tr><td><img src="<%=path%>/resources/images/icons/16_16/application_group.png"></td><td>应急调度室</td></tr></table></botton><br/></w:equal>
<!-- 				    <button style="width:105px;height:28px;cursor:pointer" onclick="showPan('<w:write bind="#info.id"/>');return false;"> 
				    <table><tr><td><img src="<%=path%>/resources/images/icons/16_16/application_edit.png"></td><td>预案管理</td></tr></table></botton>
				    -->
				    </td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
	</form>
  </body>
</html>
