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
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/agcom/ui/sc/yunpan/bootstrap-3.3.7/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/agcom/ui/sc/yunpan/css/style.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/agcom/ui/sc/yunpan/css/popup.css" />
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/js/jquery.min.js"></script>
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/bootstrap-3.3.7/js/bootstrap.min.js"></script>
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/js/jquery.form.js"></script>
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/js/fileMd5/spark-md5.js"></script>
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/js/xmlHttpRequest.js"></script>
    <script src="<%=basePath%>/agcom/ui/sc/yunpan/js/main.js"></script>
    <%--<script src="<%=basePath%>/agcom/ui/sc/yunpan/js/popup.js"></script>--%>
    <script>
        var ctx = "<%=basePath %>";
        var userId = "<%=userId %>" == "null" ? "afcf4734-7a1a-4243-971e-4b91baa0984b": "<%=userId %>";//不能为空，为空检索不出数据
        var dirId = "<%=dirId %>" == "null" ? "": "<%=dirId %>";//记录当前所在目录id，为空时，默认是根目录
    </script>
    <style>
        .pointer{cursor: pointer}
        .hide{display: none}
        .fileIcon{
            width: 20px;
            height: 20px;
        }
        .mainDiv{
            padding: 15px;
        }
    </style>
</head>
<body>
<!-- 侧边栏 -->
<%--<%@include file="slider.jsp"%>--%>
<div class="mainDiv">
    <!-- 工具栏 -->
    <div class="tool">
        <a href="#" id="upload" class="active">
            <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/sc_active.png" />
            <span>上传</span>
        </a>
        <a href="#" id="createDir">
            <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/xj.png" />
            <span>新建文件夹</span>
        </a>
        <!--
        <div class="wj-tool">
            <a href="#">
                <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/fx_active.png" />
                <span>分享</span>
            </a>
            <a href="#">
                <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/gx.png" />
                <span>共享</span>
            </a>
            <a href="#" id="multiDownload">
                <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/xz.png" />
                <span>下载</span>
            </a>
            <a href="#" id="remove">
                <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/shanchu.png" />
                <span>删除</span>
            </a>
            <a class="more">
                <img src="<%=basePath%>/agcom/ui/sc/yunpan/img/gd.png"  />
                <span>更多</span>
            </a>
            <ul class="moreMenu hide">
                <li><span>重命名</span></li>
                <li><span>复制到</span></li>
                <li><span>移动到</span></li>
                <li><span>推送到云设备</span></li>
            </ul>
        </div>
        -->
    </div>
    <div class="tool-right">
        <%--<a href="#" class="pl"></a>--%>
        <%--<a href="#" class="sx"></a>--%>

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
                <td class="modifyTime">修改日期</td>
                <td class="uploadTime">上传日期</td>
                <td class="dir hide">所在目录</td>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>
<!--隐藏起来的上传模块-->
<input type="file" id="uploadDo" name="file"  multiple="multiple" class="hide"/>
<form id="uploadForm" method="post" enctype="multipart/form-data" class="hide">
    <input type="file" id="uploadDo1" name="file" multiple="multiple"/>
    <input type="text" id="userId" name="userId" />
    <input type="text" id="mapJson" name="mapJson" />
    <input type="text" id="dirId" name="dirId" value="" />
</form>
</body>
</html>
