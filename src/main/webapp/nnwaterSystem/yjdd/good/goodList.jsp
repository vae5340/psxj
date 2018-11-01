<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>

 <form action="/gzps/yjdd/GoodPage@equipList.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<w:hidden bind="bean.type"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;名称：</td><td><w:text bind="bean.name" style="width:200px;"/></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm({target:'panInfopanel'})">查询</a>
				<a href="#" class="easyui-linkbutton" iconCls="icon_add" onclick="addUser('<w:write bind="bean.type"/>')">添加物资</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>,
																					target:'panInfopanel'">
		<thead>
				<tr class="ui_th">
					<th width="30" align="center"><input type="checkbox" name="all_box" value="all" onclick="$selAllTbBoxs(this)"></th>
	    			<th>名称</th>
	    			<th>类型</th>
	    			<th>编号</th>
	    			<th>物资型号</th>
	    			<th>数量</th>
	    			<th>存放地址</th>
	    			<th>权属单位</th>
	    			<th>购置时间</th>
	    			<th width="60" align="center">修改</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td><input type="checkbox" name="primaryKey_" value="<w:write bind="#info.id"/>"></td>
				    <td><w:write bind="#info.name"/></td>
				    <td><w:write bind="#info.typename"/></td>
				    <td><w:write bind="#info.code"/></td>
				    <td><w:write bind="#info.model"/></td>
				    <td><w:write bind="#info.amount"/><w:write bind="#info.unit"/></td>
				    <td><w:write bind="#info.address"/></td>
				    <td><w:write bind="#info.ownerdept"/></td>
				    <td><w:write bind="#info.buytime" format="yyyy-MM-dd"/></td>
				    <td><a href="#" onclick="editUser('<w:write bind="#info.id"/>')" class="data_edit" style="float:left" title="修改">修改</a><a href="#" onclick="delUser('<w:write bind="#info.id"/>')" class="data_del" title="删除">删除</a></td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
	</form>
