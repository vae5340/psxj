<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>


<div class="ui-queryBar" style="text-align:center;height:60px;width:100%">
<div style="width:100%;padding-top:8px;">
<span style="font-size:16px;"><w:write bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/>：</span>
<span style="font-size:16px;color:red;font-weight:bold"><w:write bind="bean.name"/></span>
</div>
<div style="text-align:center;width:100%;margin-top:5px;">启动时间：<w:write bind="bean.starttime" format="yyyy-MM.dd HH:mm:ss"/></div>

</div>
	<table class="ui-table" width="100%" align="center" cellpadding="1" cellspacing="1" data-options="showPage:false">
		<thead>
				<tr class="ui_th">
	    			<th width="120" style="text-align:center">时间</th>
	    			<th width="120" style="text-align:center">事件名称</th>
	    			<th style="text-align:center">操作内容</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td style="text-align:center"><w:write bind="#info.time" format="MM月dd日 HH时mm分"/></td>
					<td style="text-align:center"><w:write bind="#info.act_name"/></td>
					<td style="padding-left:3px;"><w:write bind="#info.act_user"/><w:write bind="#info.act_content"/></td>
				</tr>
			</w:iterate>
			</tbody>
</table>