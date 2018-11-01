<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>

<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
<form method="post" action="/gzps/yjdd/GoodPage@update.page">
	<w:hidden bind="bean.id"/>
	<w:hidden bind="new_"/>
	<div class="ui-formContent">
		<p>
			<label style="width:80px">物资分类：</label>
			<select name="bean.type"  style="width:200px" class="easyui-validatebox" data-options="required:true"><option value=""></option><w:options bind="bean.type" collection="#typelist" value="value" text="text"/></select>
		</p>
		<p>
			<label style="width:80px">物资编号：</label>
			<w:text bind="bean.code" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">物资型号：</label>
			<w:text bind="bean.model" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">物资名称：</label>
			<w:text bind="bean.name" style="width:250px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
		<p>
			<label style="width:80px">计量单位：</label>
			<w:text bind="bean.unit" style="width:250px" />
		</p>
		<p>
			<label style="width:80px">入库数量：</label>
			<w:text bind="bean.amount" style="width:250px" />
		</p>
		<p>
			<label style="width:80px">存放地址：</label>
			<w:text bind="bean.address" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">责任人：</label>
			<w:text bind="bean.trustuser" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">权属单位：</label>
			<w:text bind="bean.ownerdept" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">备 注：</label>
			<w:textarea bind="bean.bz" style="width:250px;height:80px" />
		</p>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="$w.doWinForm()">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>