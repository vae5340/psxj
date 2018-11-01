<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.frame.database.DbOperate"%>
<%@page import="com.frame.database.JdataBean"%>
<%
String path = request.getContextPath();
String id=request.getParameter("id");
String type=request.getParameter("type");
DbOperate db=DbOperate.getInstance("metadata");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <style>
  *{font-size:12px;}
  </style>
  </head>
  
  <body style="margin:0px;overflow:hidden">
    <%
    if("car".equals(type)){
        JdataBean bean=db.query("select * from Yj_equip where id=?",new Object[]{id}).get(0);
        List<JdataBean> list=db.query("select u.user_name,us.userid from Yj_equip_use us,"+DbOperate.getInstance().getConnUserName()+".om_user u where us.userid=u.user_id and us.equipid=?",new Object[]{id});
        String uname="",uid="";
        if(list.size()>0){uname=list.get(0).getString("user_name");uid=list.get(0).getString("userid");}
    %>
    <table width="100%" cellpadding="1" cellspacing="1" bgcolor="#ADCFDE">
    <tr>
    	<td width="70" bgcolor="#F7FBFF" height="21">车辆名称：</td><td bgcolor="#ffffff"><%=bean.getString("name") %></td>
    </tr>
    <tr>
    	<td bgcolor="#F7FBFF" height="21">驾驶司机：</td><td bgcolor="#ffffff"><%=uname %></td>
    </tr>
    <tr>
    	<td bgcolor="#F7FBFF" height="21">权属单位：</td><td bgcolor="#ffffff"><%=(bean.getString("ownerdept")==null?"":bean.getString("ownerdept")) %></td>
    </tr>
    </table>
    <table width="100%">
    <tr>
    <table>
    <tr>
    <td>
    </table>
    <table>
    <tr>
    </tr>
    </table>
    <%}else if("user".equals(type)){ 
        JdataBean bean=db.query("select * from Yj_team_user where userid=?",new Object[]{id}).get(0);
        
    %>
    <table width="100%" cellpadding="1" cellspacing="1" bgcolor="#ADCFDE">
    <tr>
    	<td width="50" bgcolor="#F7FBFF" height="21">姓名：</td><td bgcolor="#ffffff"><%=bean.getString("username") %></td>
    </tr>
    <tr>
    	<td bgcolor="#F7FBFF" height="21">职务：</td><td bgcolor="#ffffff"><%=(bean.getString("post")==null?"":bean.getString("post")) %></td>
    </tr>
    <tr>
    	<td bgcolor="#F7FBFF" height="21">电话：</td><td bgcolor="#ffffff"><%=(bean.getString("phone")==null?"":bean.getString("phone")) %></td>
    </tr>
    </table>
    <div width="100%" style="text-align: center;vertical-align: middle;">
    <div 
    	style="color:white;width:100%;height:30px;background-image:url('<%=path %>/gzps/yjdd/secondSchedule.png');cursor:pointer;vertical-align: middle;line-height: 30px"
    onclick="window.parent.$w.infoMsg('请选择二次调度的目的地!');parent.secondSchedule('<%=bean.getString("username") %>',${param.x},${param.y});return false;">
    	二次调度
    </div>
    </div>
    <%} %>
  </body>
</html>
