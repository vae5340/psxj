<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>

<div style="text-align:center;height:60px;width:100%" class="ui-queryBar">
<div style="width:100%;padding-top:8px;">
<span style="font-size:16px;"><w:write bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/>：</span>
<span style="font-size:16px;color:red;font-weight:bold"><w:write bind="bean.name"/></span>
</div>
<div style="text-align:center;width:100%;margin-top:5px;">启动时间：<w:write bind="bean.starttime" format="yyyy-MM.dd HH:mm:ss"/></div>
</div>

<div id="timbackdiv">	
	<w:iterate bind="resultList_" id="info">
	<script>
		addbacklist('<w:write bind="#info.time" format="MM月dd日 HH时mm分"/>','<w:write bind="#info.act_name"/>','<w:write bind="#info.act_user"/><w:write bind="#info.act_content"/>');
	</script>
	</w:iterate>
</div>
<div style="height:30px;">
</div>
<script>
	backplay('timbackdiv');
</script>