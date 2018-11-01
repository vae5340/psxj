<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
function panhuif(id){
	window.parent.addMisTab('应急回放',ctx+"/gzps/yjdd/pan/playbackMain.jsp?panid="+id,ctx+"/resources/images/icons/16_16/plugin.png");
	$w.closeCurrWin();
}
</script>
<form action="/gzps/yjdd/PanPage@panSelList.page" method="post" class="PageForm">
<w:hidden bind="pageNum"/>
<w:hidden bind="pageSize_"/>
<div class="ui-queryBar">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;编号：</td><td><w:text bind="bean.code" style="width:80px;"/></td>
			<td>&nbsp;名称：</td><td><w:text bind="bean.name" style="width:100px;"/></td>
			<td>&nbsp;级别：</td><td><select name="bean.pan_level" ><option>------</option><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></select></td>
			<td>&nbsp;分类：</td><td><select name="bean.type" ><option>------</option><w:options bind="bean.pan_level" typeCode="YJDD_PAN_TYPE"/></select></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>
				<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">关闭</a>
			</td>
		</tr>
		</tr>
	</table>
</div>
	<table class="ui-table" width="100%" align="center" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
	    			<th width="100" style="text-align:center">预案编号</th>
	    			<th style="text-align:center">预案名称</th>
	    			<th style="text-align:center">预案级别</th>
	    			<th style="text-align:center">预案分类</th>
	    			<th style="text-align:center"width="80">启动时间</th>
	    			<th style="text-align:center"width="70">预案状态</th>
	    			<th style="text-align:center"width="72">应急回放</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td ><w:write bind="#info.code"/></td>
					<td ><w:write bind="#info.name"/></td>
					<td><w:write bind="#info.pan_level" typeCode="YJDD_PAN_LEVEL"/></td>
					<td ><w:write bind="#info.type" typeCode="YJDD_PAN_TYPE"/></td>
					<td ><w:write bind="#info.starttime" format="yyyy-MM-dd"/></td>
					<td ><w:write bind="#info.state" format="[未启动,已启动,已解除]"/></td>
					<td style="text-align:center"><a href="javascript:panhuif('<w:write bind="#info.id"/>');">应急回放</a></td>
				</tr>
			</w:iterate>
			</tbody>
</table>
</form>