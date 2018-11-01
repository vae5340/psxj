<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.frame.database.JdataBean"%>
<%@page import="com.augurit.gzps.yjdd.YjddDao"%>
<%
String path = request.getContextPath();
String panid=request.getParameter("panid");
YjddDao dao =new YjddDao();
List<JdataBean> equipList=null;
if(panid!=null && !"".equals(panid))
	equipList=dao.queryEquipList(panid, 2, null, 100, 1).getList();
else
    equipList=dao.queryEquipList(null, null, null, 100, 1).getList();
%>
<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:false">
<tbody>
<%for(JdataBean bean:equipList){ %>
	<tr class="ui_td">
		<td align="center" title="点击地图定位" style="cursor:pointer" onclick="window.parent.car_dw('<%=bean.get("id") %>')"><img src="<%=path %>/resources/images/icons/16_16/blue-gislocate.png"></td>
		<td ondblclick="window.parent.car_dw('<%=bean.get("id") %>')"><%=bean.get("typename") %>：<%=bean.get("code") %>（<%=bean.get("name") %>）</td>
	</tr>
<%} %>
</tbody>
</table>