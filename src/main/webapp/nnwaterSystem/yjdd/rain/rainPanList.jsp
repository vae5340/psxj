<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
   <style>

   </style>
	<script>
	function look(code){
		window.parent.addTab('rainlist','一雨一报信息',ctx+"/gzps/yjdd/RainRescuePage@showList.page?id="+code)
		}
	</script>
  </head>
  
  <body>
  	<form action="/gzps/yjdd/RainRescuePage.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false" title="“一雨一报”应急预案列表">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;预案编号：</td><td><w:text bind="bean.code" style="width:80px;"/></td>
			<td>&nbsp;预案名称：</td><td><w:text bind="bean.name" style="width:100px;"/></td>
			<td>&nbsp;预案级别：</td><td><select name="bean.pan_level" ><option value="">------</option><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></select></td>
			<td>&nbsp;预案分类：</td><td><select name="bean.type" ><option value="">------</option><w:options bind="bean.type" typeCode="YJDD_PAN_TYPE"/></select></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th style="padding-left:2px;">预案分类</th>
	    			<th>预案名称</th>
	    			<th>预案级别</th>
	    			<th>预案描述</th>
	    			<th>启动时间</th>
	    			<th>结束时间</th>
	    			<th width="45" align="center">状态</th>
	    			<th width="115" align="center">查看</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td style="padding-left:2px;"><w:write bind="#info.type" typeCode="YJDD_PAN_TYPE"/></td>
				    <td><w:write bind="#info.name"/></td>
				    <td><w:write bind="#info.pan_level" typeCode="YJDD_PAN_LEVEL"/></td>
				    <td><w:write bind="#info.content"/></td>
				    <td><w:write bind="#info.starttime" format="yyyy-MM-dd"/></td>
				    <td><w:write bind="#info.endtime" format="yyyy-MM-dd"/></td>
				    <td ><w:write bind="#info.state" format="[未启动,已启动,已解除]"/></td>
				    <td style="padding-left:2px;"><button style="width:110px;height:28px;cursor:pointer" onclick="look('<w:write bind="#info.code"/>');return false;"><table><tr><td><img src="<%=path%>/resources/images/icons/16_16/application_form_magnify.png"></td><td>查看一雨一报</td></tr></table></botton>
				    </td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
	</form>
  </body>
</html>
