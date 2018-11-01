<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<form method="post" action="/gzps/yjdd/PanPage@update.page" style="width:100%;height:100%">
<w:hidden bind="bean.baseid"/>
<div id="panBase_Tabs" class="easyui-tabs" data-options="fit:true,border:false">
<div title="基本信息">
	<table style="margin-top:5px;">
      	<tr>
		<td align="right" height="30">预案分类：</td><td><select name="bean.type" style="width:160px;"><w:options bind="bean.type" typeCode="YJDD_PAN_TYPE"/></select></td>
		<td></td><td></td>
		</tr>
	      	<tr>
			<td align="right" height="30"><font color="red">*</font>预案名称：</td><td colspan="3"><w:text bind="bean.name"  style="width:410px;" styleClass="easyui-validatebox" dataOptions="required:true"/></td>
		</tr>
		<tr>
			<td width="85" align="right" height="30"><font color="red">*</font>预案编号：</td><td><w:text bind="bean.code" style="width:150px;" styleClass="easyui-validatebox" dataOptions="required:true"/></td>
			<td width="80" align="right">预案级别：</td><td><select name="bean.pan_level" style="width:150px;"><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></select></td>
		</tr>
		<tr>
			<td width="80" align="right" height="30">编制人：</td><td><w:text bind="bean.writer" style="width:150px;"/></td>
			<td width="80" align="right">编制时间：</td><td><w:text bind="bean.writetime" styleClass="easyui-datebox" style="width:150px;" dataOptions=""/></td>
		</tr>
		<tr>
			<td align="right" height="30" valign="top">预案描述：</td><td colspan="3"><w:textarea bind="bean.content" style="width:410px;height:150px"/></td>
		</tr>
	</table>
</div>
<!--<div title="应急小组">
	<table>
    	<tr>
    	<td></td>
    	<td align="right"><button style="cursor:pointer" onclick="pan_seluser2()">选择人员</button></td>
    	</tr>
    	<tr>
    	<td valign="top" width="70" style="padding-top:5px;" align="right">小组成员：</td>
    	<td><w:hidden bind="bean.sms_xz_user"/><w:textarea bind="bean.xz_username" style="width:400px;height:120px;"/></td>
    	</tr>
    	<tr>
    	<td valign="top" style="padding-top:5px;" align="right">短信编辑：</td>
    	<td><w:textarea bind="bean.sms_xz_con" style="width:400px;height:150px;"/></td>
    	</tr>
    	</table>
</div>-->
<div title="应急队伍">
	<table>
        	<tr>
        	<td></td>
        	<td align="right"><button style="cursor:pointer" onclick="pan_seldw2()">选择应急队伍</button></td>
        	</tr>
        	<tr>
        	<td valign="top" width="70" style="padding-top:5px;" align="right">应急队伍：</td>
        	<td><w:hidden bind="bean.sms_dw_user"/><w:textarea bind="bean.dw_username" style="width:400px;height:120px;"/></td>
        	</tr>
        	<tr>
        	<td valign="top" style="padding-top:5px;" align="right">短信编辑：</td>
        	<td><w:textarea bind="bean.sms_dw_con" style="width:400px;height:150px;"/></td>
        	</tr>
        	</table>
</div>
<div title="应急装备">
	<div style="text-align:right;padding-bottom:2px;padding-top:4px;"><button style="cursor:pointer" onclick="pan_addequip2()">添加装备</button></div>
        	<table  class="ui-table" width="99%" align="center" cellpadding="1" cellspacing="1" data-options="showPage:false">
      		<thead>
				<tr class="ui_th">
					<th style="padding-left:2px">编号</th>
	    			<th style="padding-left:2px">装备名称</th>
	    			<th style="padding-left:2px">装备类型</th>
	    			<th style="padding-left:2px">存放地址</th>
	    			<th align="center" width="35">移除</th>
				</tr>
			</thead>
			<tbody id="equipTd">
			<w:notEqual bind="bean.euipList" value="null">
			<w:iterate id="info" bind="bean.euipList">
			<tr class='ui_td'>
				<td><input name="eduipIds" type="hidden" value="<w:write bind="#info.id"/>"/><w:write bind="#info.code"/></td>
				<td><w:write bind="#info.name"/></td>
				<td><w:write bind="#info.typename"/></td>
				<td><w:write bind="#info.address"/></td>
				<td><a href='javascript:;' onclick="deltb2('equipTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
</div>
<div title="应急物资">
	<div style="text-align:right;padding-bottom:2px;padding-top:4px;"><button style="cursor:pointer" onclick="pan_addgood2()">添加物资</button></div>
        	<table  class="ui-table" width="99%" align="center" cellpadding="1" cellspacing="1" data-options="showPage:false">
      		<thead>
				<tr class="ui_th">
					<th style="padding-left:2px">编号</th>
	    			<th style="padding-left:2px">物资名称</th>
	    			<th style="padding-left:2px" width="62">分配数量</th>
	    			<th style="padding-left:2px">库存</th>
	    			<th style="padding-left:2px">存放地址</th>
	    			<th align="center" width="35">移除</th>
				</tr>
			</thead>
			<tbody id="goodTd">
			<w:notEqual bind="bean.goodList" value="null">
			<w:iterate id="info" bind="bean.goodList">
			<tr class='ui_td'>
				<td><input name="goodIds" type="hidden" value="<w:write bind="#info.id"/>"/><w:write bind="#info.code"/></td>
				<td><w:write bind="#info.name"/></td>
				<td><input name="goodAmounts" value="<w:write bind="#info.good_amount"/>" style="width:60px;"/></td>
				<td><w:write bind="#info.amount"/><w:write bind="#info.unit"/></td>
				<td><w:write bind="#info.address"/></td>
				<td><a href='javascript:;' onclick="deltb2('goodTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
</div>
</div>
</form>