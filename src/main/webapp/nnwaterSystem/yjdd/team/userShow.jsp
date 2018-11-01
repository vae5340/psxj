<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script type="text/javascript">

function getPhone(obj){
	$w.doUrl(ctx+"/gzps/yjdd/TeamPage@queryOmUser.page?id="+obj.value,{},function(json){
			if(json.mobile){
				$("#phone").val(json.mobile.toString());
			}
	})
	
}

</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
<form method="post" action="/gzps/yjdd/TeamPage@updateUser.page">
	<w:hidden bind="bean.id"/>
	<w:hidden bind="bean.teamid"/>
	<w:hidden bind="new_"/>
	<div class="ui-formContent">
		<p>
			<label style="width:80px">姓名：</label>
			<select name="bean.userid" onchange="getPhone(this)" id="userid">
				<w:options bind="bean.userid" collection="beanList" value="user_id" text="user_name"  />
			</select>
		</p>
		<p>
			<label style="width:80px">职位：</label>
			<w:text bind="bean.post" style="width:250px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
		<p>
			<label style="width:80px">所属机构：</label>
			<w:text bind="bean.dept" style="width:250px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
		<p>
			<label style="width:80px">联系电话：</label>
			<w:text id="phone" bind="bean.phone" style="width:250px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="$w.doWinForm()">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>