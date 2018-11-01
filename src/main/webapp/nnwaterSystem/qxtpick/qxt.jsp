<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<style>
		html, body {width:100%; height:100%; overflow:hidden;margin:0;padding:0}
		*{margin:0;padding:0;}
	</style>
	<script type="text/javascript" language="javascript">
		function iFrameHeight(id) {   
			var ifm= document.getElementById(id); 
			ifm.height = 340;
			ifm.width = 550;
		}   
	</script>
  </head>
  
  <body>
    <table style="width: 100%;height: 100%;">
    	<tr>
    		<td width="550" style="text-align: center;height: 5px;">大陆区域彩色</td>
    		<td width="550" style="text-align: center;">大陆区域红外</td>
    	</tr>
    	<tr>
    		<td height="300"><iframe id="iframepage" onLoad="iFrameHeight('iframepage')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/cs.html"></iframe></td>
    		<td><iframe id="iframepage1" onLoad="iFrameHeight('iframepage1')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/hw.html"></iframe></td>
    	</tr>
    	<tr>
    		<td height="6" style="text-align: center;">大陆区域水气</td>
    		<td style="text-align: center;">海区红外</td>
    	</tr>
    	<tr>
    		<td height="300"><iframe id="iframepage2" onLoad="iFrameHeight('iframepage2')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/sq.html"></iframe></td>
    		<td ><iframe id="iframepage3" onLoad="iFrameHeight('iframepage3')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/hqhw.html"></iframe></td>
    	</tr>
    </table>
  </body>
</html>
