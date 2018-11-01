<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>

<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
	<div class="ui-formContent">
		<p>
			<label style="width:80px">预案等级：</label>
			<select name="pan_level" style="width:150px;"><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL" /></select>
		</p>
	</div>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="$w.closeCurrWin($getByName('pan_level',$w.currWin()).val())">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>