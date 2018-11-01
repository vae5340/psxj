<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.frame.database.DbOperate"%>
<%@page import="com.frame.database.JdataBean"%>
<%
String path = request.getContextPath();
String id=request.getParameter("id");
String type=request.getParameter("type");
DbOperate db=DbOperate.getInstance("metadata");
if("car".equals(type)){
    String sql="select * from gpsinfo where userid in (select userid from Yj_equip_use where equipid=?) and rownum<=1 order by uploadtime desc";
    JdataBean data= db.getBean(sql,new Object[]{id});
 %>
 <script>

</script>
<% }
%>
