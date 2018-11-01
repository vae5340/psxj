<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.frame.database.JdataBean"%>
<%@page import="com.augurit.gzps.yjdd.YjddDao"%>
<%
String path = request.getContextPath();
String panid=request.getParameter("panid");
YjddDao dao =new YjddDao();
List<JdataBean> equipList=null;
if(panid!=null && !"".equals(panid))
	equipList=dao.queryGoodList(panid, 2, null, 100, 1).getList();
else
    equipList=dao.queryGoodList(null, null, null, 100, 1).getList();
%>
<ul>
<%for(JdataBean bean:equipList){ %>
     <li style="padding:2px;background:url('<%=path %>/resources/images/icons/16_16/away16.png') no-repeat 2px center;text-indent:16px;"><%=bean.get("name") %>（<%=bean.get("amount") %><%=bean.get("unit") %>）</li>
      	
<%} %>
</ul>