<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>

 <form action="/gzps/yjdd/TeamPage@showTeamUserList.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<w:hidden bind="bean.teamid"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;姓名：</td><td><w:text bind="bean.name" style="width:200px;"/></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm({target:'panInfopanel'})">查询</a>
				<a href="#" class="easyui-linkbutton" iconCls="icon_add" onclick="addUser('<w:write bind="bean.teamid"/>')">添加队伍人员</a>
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
	    			<th>用户姓名</th>
	    			<th>职位</th>
	    			<th>所属机构</th>
	    			<th>联系电话</th>
	    			<th width="60" align="center">修改</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td><input type="checkbox" name="primaryKey_" value="<w:write bind="#info.id"/>"></td>
				    <td><w:write bind="#info.username"/></td>
				    <td><w:write bind="#info.post"/></td>
				    <td><w:write bind="#info.dept"/></td>
				    <td><w:write bind="#info.phone"/></td>
				    <td><a href="#" onclick="editUser('<w:write bind="#info.id"/>')" class="data_edit" style="float:left" title="修改">修改</a><a href="#" onclick="delUser('<w:write bind="#info.id"/>')" class="data_del" title="删除">删除</a></td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
	</form>
