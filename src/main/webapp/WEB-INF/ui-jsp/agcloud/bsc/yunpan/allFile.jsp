<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    String ip = request.getRemoteAddr();
    String userId = (String)request.getAttribute("userId");
    String dirId = (String)request.getAttribute("dirId");
    boolean simplePage = (boolean)request.getAttribute("simplePage");
    long maxFileUploadSize = (long)request.getAttribute("maxFileUploadSize");
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>全部文件</title>
    <!-- 所有JSP必须引入的公共JSP子页面 -->
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>

    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>
    <%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp" %>
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/style.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath%>/ui-static/agcloud/bsc/yunpan/css/popup.css" />
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/jquery.min.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/bootstrap-3.3.7/js/bootstrap.min.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/jquery.form.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/fileMd5/spark-md5.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/xmlHttpRequest.js"></script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/popup.js"></script>
    <script>
        var ctx = "<%=basePath %>";
        var userId = "<%=userId %>" == "null" ? "afcf4734-7a1a-4243-971e-4b91baa0984b": "<%=userId %>";//不能为空，为空检索不出数据
        var dirId = "<%=dirId %>" == "null" ? "": "<%=dirId %>";//记录当前所在目录id，为空时，默认是根目录
        var maxFileUploadSize = "<%=maxFileUploadSize %>" == "null" ? 1073741824 : "<%=maxFileUploadSize %>";//记录当前所在目录id，为空时，默认是根目录
        var simplePage = <%=simplePage %>;
        var isCommon = parseInt('${isCommon}');//0代表管理员界面,1代表业务界面
    </script>
    <script src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/js/main.js"></script>
</head>
<body>
<!-- 侧边栏 -->
<%--<%@include file="slider.jsp"%>--%>
<div>
    <!-- 工具栏 -->
    <div id="tool_change">
        <div class="tool">
            <c:choose>
                <c:when test="${isCommon=='1'}">
                    <a href="#" id="upload" class="active simplePage">
                        <img src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/img/sc_active.png" />
                        <span>上传</span>
                    </a>
                </c:when>
                <c:otherwise>
                    <a href="#" id="createDir" class="simplePage">
                        <img src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/img/xj.png" />
                        <span>新建文件夹</span>
                    </a>
                </c:otherwise>
            </c:choose>
            <div class="wj-tool">
                <a href="#" id="multiDownload">
                    <img src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/img/xz.png" />
                    <span>下载</span>
                </a>
                <a href="#" id="remove" class="simplePage" style="border-top-right-radius: 4px;border-bottom-right-radius: 4px;">
                    <img src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/img/shanchu.png" />
                    <span>删除</span>
                </a>
                <%--<a class="more">
                    <img src="<%=basePath%>/ui-static/agcloud/bsc/yunpan/img/gd.png"  />
                    <span>更多</span>
                </a>--%>
                <%--<ul class="moreMenu hide">
                    <li><span>重命名</span></li>
                    <li><span>复制到</span></li>
                    <li><span>移动到</span></li>
                    <li><span>推送到云设备</span></li>
                </ul>--%>
            </div>
        </div>
        <div class="tool-right">
        <%--<a href="#" class="pl"></a>--%>
        <%--<a href="#" class="sx"></a>--%>
        <div class="search">
            <input type="text" id="searchKey" placeholder="请输入关键字" />
            <span class="search-icon" id="search"></span>
        </div>
    </div>
    </div>
    <div class="clear" ></div>
    <!-- 当前位置 -->
    <div class="weizhi hide">
        <a href="#" style="padding-right: 5px;border-right: 1px solid #4287ed;" id="backToLast">返回上一级</a>
        <a href="#" id="allFiles">全部文件 </a>
        <span id="dirXpath"></span>
    </div>
    <div id="allFiles-two" class="hide" style="margin-top: 10px;font-size: 12px;cursor: pointer">
        <span style="color: #4287ed">全部文件</span>
    </div>
    <div class="allFile" style="margin-top: 10px;font-size: 12px;">
        <span>全部文件</span>
    </div>
    <table>
        <thead>
        <tr>
            <td style="width: 40%" id="text-td"><input type="checkbox" id="checkAll"/>文件名</td>
            <td class="size">大小</td>
            <c:if test="${isCommon!='1'}">
                <td class="modifyTime" >修改日期</td>
            </c:if>
            <td class="uploadTime" id="modifyTime-td" >上传日期</td>
            <td class="dir hide">所在目录</td>
        </tr>
        </thead>
    </table>
    <div class="wrap-table" style="overflow: auto;height: calc(100vh - 120px)">
        <table id="fileDirTable">
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
<script>
    $(function () {
        var bheight =  $('body').width();
        if(bheight<593){
            $('#tool_change').addClass('tool-change');
            $('.tool-right').css('padding',5);
            $('.wrap-table').height($('.wrap-table').height()-45);
        }
    })
</script>
</body>
</html>
