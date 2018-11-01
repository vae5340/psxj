<%@ page contentType="text/html;charset=UTF-8"%>
<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	String userId = (String)request.getAttribute("userId");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<meta charset="utf-8"/>
	<title>他人共享</title>
	<link type="text/css" rel="stylesheet"
		  href="<%=basePath%>/agcom/ui/sc/yunpan/bootstrap-3.3.7/css/bootstrap.min.css"/>
	<link type="text/css" rel="stylesheet" href="<%=basePath%>/agcom/ui/sc/yunpan/css/style.css"/>
	<script src="<%=basePath%>/agcom/ui/sc/yunpan/js/jquery.min.js"></script>
	<script src="<%=basePath%>/agcom/ui/sc/yunpan/bootstrap-3.3.7/js/bootstrap.min.js"></script>
	<script src="<%=basePath%>/agcom/ui/sc/yunpan/js/share.js"></script>
	<script>
		var ctx = "<%=basePath %>";
		var userId = "<%=userId %>";//不能为空，为空检索不出数据
		var isOwner = false;
		var dirId = "";
	</script>
</head>

<body>
<!-- 侧边栏 -->
<div class="main">
	<!-- 工具栏 -->
	<div class="tool">
		<div class="wj-tool">
			<a href="#" id="multiDownload">
				<img src="<%=basePath%>/agcom/ui/sc/yunpan/img/xz.png" />
				<span>下载</span>
			</a>
		</div>
	</div>
	<div class="tool-right">
		<div class="search">
			<input type="text" id="searchKey" placeholder="请输入关键字" />
			<span class="search-icon" id="search"></span>
		</div>
	</div>
	<div class="clear" ></div>
	<!-- 当前位置 -->
	<div class="weizhi hide">
		<a href="#" style="padding-right: 5px;border-right: 1px solid #4287ed;" id="backToLast">返回上一级</a>
		<a href="#" id="allFiles">全部文件 </a>
		<span id="dirXpath"></span>
	</div>
	<div class="allFile" style="margin-top: 10px;font-size: 12px;">
		<span>全部文件</span>
	</div>
	<div class="wrap-table">
		<table id="fileDirTable">
			<thead>
			<tr>
				<td><input type="checkbox" id="checkAll"/>文件名</td>
				<td class="size">大小</td>
				<td class="uploadTime">共享日期</td>
				<td class="dir hide">所在目录</td>
			</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</div>
</body>
</html>