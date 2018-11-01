<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>

<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
<form method="post" action="/gzps/yjdd/TeamPage@updateType.page">
	<w:hidden bind="bean.id"/>
	<w:hidden bind="new_"/>
	<div class="ui-formContent">
		<p>
			<label style="width:80px">分类名称：</label>
			<w:text bind="bean.name" style="width:250px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="$w.doWinForm(function(json){$w.closeCurrWin({'id':json.id,'name':json.name});})">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>