<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
 <form action="/gzps/yjdd/PanPage@problemList.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;名称：</td><td><w:text bind="bean.name" style="width:300px;"/></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm({form:$('form',$('#problemPanel')),target:'problemPanel'})">查询</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<table class="ui-table" width="98%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>,
																					target:'problemPanel'">
		<thead>
				<tr class="ui_th">
					<tr class="ui_th">
							<th style="padding-left:2px">事件名称</th>
			    			<th style="padding-left:2px">上报时间</th>
			    			<th style="padding-left:2px">上报人</th>
			    			<th style="padding-left:2px">状态</th>
				    </tr>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
     			<tr class="ui_td">
     				<td style="padding-left:2px;"><a href="javascript:addMisTab('应急事件处理','<%=path %>/gzps/xjdd/web/ProblemPage@showProblem.page?id=<w:write bind="#info.PROBLEMID"/>');$w.closeCurrWin();"><w:write bind="#info.MATTERS"/></a></td>
     				<td><w:write bind="#info.UPLOADTIME" format="yyyy-MM-dd"/></td>
     				<td><w:write bind="#info.USERNAME"/></td>
     				<td><w:write bind="#info.stateName"/></td>
     			</tr>
     			</tr>
     		</w:iterate>
			</tbody>
		</table>
</form>
