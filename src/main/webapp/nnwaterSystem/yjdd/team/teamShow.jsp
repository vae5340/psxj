<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
function team_addtype(){
	var selobj=$getByName("bean.typeid",$w.currWin()).get(0);
	window.parent.$w.openDialog({title:'添加队伍分类',url:ctx+"/gzps/yjdd/TeamPage@typeShow.page?new_=true",w:300,h:180,afterClose:function(re){
		if(re){
			var l=selobj.options.length;
			var op = new Option(re.name,re.id);
			selobj.options.add(op);
			selobj.selectedIndex=l;
		}
	}});
}
</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
<form method="post" action="/gzps/yjdd/TeamPage@update.page">
	<w:hidden bind="bean.id"/>
	<w:hidden bind="new_"/>
	<div class="ui-formContent">
		<p>
			<label style="width:70px">队伍分类：</label>
			<select name="bean.typeid"  style="width:200px" class="easyui-validatebox" data-options="required:true"><option value=""></option><w:options bind="bean.typeid" collection="typeList" value="value" text="text"/></select>
			<span><input type="button" value="添加分类" style="cursor:pointer" onclick="team_addtype()"></span>
		</p>
		<p>
			<label style="width:70px">队伍名称：</label>
			<w:text bind="bean.name" style="width:280px" styleClass="easyui-validatebox" dataOptions="required:true"/>
		</p>
		<p>
			<label style="width:70px">责任人：</label>
			<w:text bind="bean.contact"  style="width:280px"/>
		</p>
		<p>
			<label style="width:70px">联系电话：</label>
			<w:text bind="bean.phone"  style="width:280px"/>
		</p>
		<p>
			<label style="width:70px">责任区：</label>
			<w:text bind="bean.address"  style="width:280px"/>
		</p>
		<p>
			<label style="width:70px">备注：</label>
			<w:textarea bind="bean.bz" style="width:280px;height:70px"/>
		</p>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="$w.doWinForm()">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>