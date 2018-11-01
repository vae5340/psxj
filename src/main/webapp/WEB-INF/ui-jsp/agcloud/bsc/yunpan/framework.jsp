<%@ page contentType="text/html;charset=UTF-8" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    String ip = request.getRemoteAddr();
    String userId = (String)request.getAttribute("userId");
    String dirId = (String)request.getAttribute("dirId");
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>全部文件</title>
    <!-- 所有JSP必须引入的公共JSP子页面 -->
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>

    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/jquery.min.js"></script>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>
    <%@ include file="/ui-static/agcloud/framework/jsp/lib-agtree3.jsp"%>
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/orgTheme.css" />
    <%--<script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/ztree3/js/jquery.ztree.core.js?<%=isDebugMode%>" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/ztree3/js/jquery.ztree.excheck.js?<%=isDebugMode%>" type="text/javascript"></script>
    <link href="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/ztree3/css/metroStyle/metroStyle.css?<%=isDebugMode%>" type="text/css" rel="stylesheet"/>--%>
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/css/bootstrap-table.min.css">
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/style.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/popup.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/main.css" />
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/js/bootstrap.min.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/js/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/js/bootstrap-table-zh-CN.min.js"></script>
    <%--<script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/popup.js"></script>--%>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/slider.js"></script>
    <script>
        var userId = "<%=userId %>" == "null" ? "afcf4734-7a1a-4243-971e-4b91baa0984b": "<%=userId %>";//不能为空，为空检索不出数据
        var dirId = "<%=dirId %>" == "null" ? "": "<%=dirId %>";//记录当前所在目录id，为空时，默认是根目录
    </script>
     <style>
       .ztree li a.curSelectedNode span{
           color: #36a3f7!important;
       }
       .ztree li a:hover span{
           color: #36a3f7!important;
       }
   </style>
</head>
<body>
<div class="header">
    <span class="logo"></span>
    <i class="fa fa-expand"></i>
    <i class="fa fa-compress"></i>
    <%--<span class="org-name"></span>--%>
</div>
<!-- 侧边栏 -->
<div class="page" style="width:100%">
    <div class="slider">
        <div class="silder-title">
            <span>附件管理</span>
            <i class="collapse"></i>
            <i class="expand"></i>
        </div>
        <div class="tree-content">
            <ul id="dirTree" class="ztree"></ul>
        </div>
    </div>
    <div class="content">
        <div style="height:100%;padding: 10px 5px 0 10px" >
            <iframe style="height: 100%"  id="contents" src="${pageContext.request.contextPath}/bsc/att/admin/allFile.do" ></iframe>
        </div>
    </div>
</div>
</body>
</html>
