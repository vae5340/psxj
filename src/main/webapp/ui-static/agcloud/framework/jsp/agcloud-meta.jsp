<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="java.util.Date" %>
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="com.augurit.agcloud.framework.config.FrameworkUiProperties" %>
<%@ page import="com.augurit.agcloud.framework.util.StringUtils" %>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1" name="viewport"/>

<%
    //获取平台配置
    ServletContext context = request.getSession().getServletContext();
    ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(context);
    FrameworkUiProperties uiProperties = (FrameworkUiProperties)ctx.getBean(StringUtils.replaceFirstCharToLower(FrameworkUiProperties.class.getSimpleName()));

    //是否调试模式运行
    boolean debug = uiProperties.isDebug();
    String isDebugMode = debug ? "date="+new Date().getTime() : "1=1";
%>

<!-- JS全局变量 -->
<script type="text/javascript">
    var ctx = "${pageContext.request.contextPath}";
</script>

<!-- jquery and AgCloud Public JS -->
<script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/jquery1/jquery-1.11.3.min.js?<%=isDebugMode%>" type="text/javascript"></script>
