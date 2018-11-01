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
    		<td width="550" style="text-align: center;height: 5px;">全国雷达图</td>
    		<td width="550" style="text-align: center;">西南雷达图</td>
    	</tr>
    	<tr>
    		<td height="300"><iframe id="iframepage" onLoad="iFrameHeight('iframepage')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/qgld.html"></iframe></td>
    		<td><iframe id="iframepage1" onLoad="iFrameHeight('iframepage1')" frameborder=0 scrolling=no marginheight="0" marginwidth="0" src="/awater/amazeplatform/qxtpick/xnld.html"></iframe></td>
    	</tr>
    </table>
  </body>
</html>
