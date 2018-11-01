<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <%@ include file="/platform/style.jsp"%>
  </head>
  
  <body style="margin:0px;overflow:hidden">
  <div style="height:235px;overflow:auto;width:100%">
  <FIELDSET>
        <LEGEND align=left><b>一雨一报统计</b></LEGEND>
        <table width="100%" cellpadding="1" cellspacing="1" bgcolor="#AACCDD">
   <tr>
   <td align="right" width="80" height="24" bgcolor="#F6FAFE">总上报数&nbsp;</td><td bgcolor="#ffffff">&nbsp;<w:write bind="bean.num"/></td>
   </tr>
   <tr>
   <td align="right" width="80" height="24" bgcolor="#F6FAFE">最近上报&nbsp;</td><td bgcolor="#ffffff">&nbsp;<w:write bind="bean.newdate" format="yyyy-MM-dd HH:mm"/></td>
   </tr>
   <tr>
   <td align="right" width="80" height="24" bgcolor="#F6FAFE">最近上报人&nbsp;</td><td bgcolor="#ffffff">&nbsp;<w:write bind="bean.username"/></td>
   </tr>
   </table>
   </FIELDSET>
   <FIELDSET>
        <LEGEND align=left><b>现场照片</b></LEGEND>
        <table>
        <tr>
        	<td> 
        	<img src="<%=path %>/upload/photo/rescue89/1433903941896_img.jpg" width="200" height="100" style="border:1px solid #cccccc;cursor:pointer" >
<!--         	<w:iterate bind="#polist" id="info"> -->
<!--         		<img src="<%=path %><w:write bind="#info.picurl"/>" width="200" height="100" style="border:1px solid #cccccc;cursor:pointer" onclick="window.open('<%=path %><w:write bind="#info.picurl"/>')"> -->
<!--         	</w:iterate> -->
        	</td>
        </tr>
        </table>
   </FIELDSET>
   </div>
  </body>
</html>
