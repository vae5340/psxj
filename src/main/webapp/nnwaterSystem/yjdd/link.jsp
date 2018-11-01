<%@ page contentType="text/html;charset=UTF-8"%>
<%@page import="java.net.URLEncoder"%>
<%
String rootPath="http://localhost:8080/engine5/link.jsp";//��ĿӦ����תҳ
String requesturl=request.getQueryString().replace("reurl=","");
response.sendRedirect(rootPath+"?reurl="+URLEncoder.encode(requesturl,"GBK"));
%>