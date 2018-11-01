<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/agcloud/frame/jsp/meta-easyui.jsp" %>
<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	String ip = request.getRemoteAddr();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/agcom/ui/sc/service/service.css">
</head>
	<body>
		<div align="center">
			<div class="demo-info">
				<div class="demo-tip icon-tip"></div>
				<div>${message}</div>
			</div>
		</div>
	</body>
</html>