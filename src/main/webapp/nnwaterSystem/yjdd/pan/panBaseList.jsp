<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
	<script>
	function panbase_add(){
		$w.openDialog({title:'预案方案编制',url:ctx+"/gzps/yjdd/PanPage@panBaseShow.page?new_=true",w:700,h:440,afterClose:function(re){
			if(re)
				$w.execForm()
		}});
	}
	function panbase_edit(id){
		$w.openDialog({title:'修改预案方案编制',url:ctx+"/gzps/yjdd/PanPage@panBaseShow.page?new_=false&id="+id,w:700,h:440,afterClose:function(re){
			if(re)
				$w.execForm()
		}});
	}
	function panbase_del(){
		$w.confirmMsg("确定要删除？",function(r){
			if(r)
				$w.doUrl(ctx+"/gzps/yjdd/PanPage@panBaseDel.page",$w.currForm().serializeArray(),function(){
					$w.execForm()
				})
		});
	}
	function fabu(id,n){
		$w.doUrl(ctx+"/gzps/yjdd/PanPage@panBase_fabu.page?id="+id+"&@p0="+n,$w.currForm().serializeArray(),function(){
			$w.execForm()
		})
	}
	</script>
  </head>
  
  <body class="easyui-layout" fit="true">
  	<form action="/gzps/yjdd/PanPage@panBaseList.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false" title="编制预案的方案，以便应急启用">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;方案编号：</td><td><w:text bind="bean.code" style="width:100px;"/></td>
			<td>&nbsp;方案名称：</td><td><w:text bind="bean.name" style="width:200px;"/></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<div class="easyui-panel ui-toolBar" border="false" data-options="doSize:false">
		<a href="#" class="easyui-linkbutton" iconCls="icon_add" plain="true" onclick="panbase_add()">添加方案</a>
		<a href="#" class="easyui-linkbutton" iconCls="icon_del" plain="true" onclick="panbase_del()">删除</a>
	</div>
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th width="30" align="center"><input type="checkbox" name="all_box" value="all" onclick="$selAllTbBoxs(this)"></th>
	    			<th width="100">方案分类</th>
	    			<th>方案编号</th>
	    			<th>方案名称</th>
	    			<th>预案级别</th>
	    			<th>编制时间</th>
	    			<th>编制人</th>
	    			<th>发布时间</th>
	    			<th width="45" align="center">状态</th>
	    			<th width="80" align="center">发布</th>
	    			<th width="45" align="center">修改</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td><input type="checkbox" name="primaryKey_" value="<w:write bind="#info.id"/>"></td>
				    <td><w:write bind="#info.type" typeCode="YJDD_PAN_TYPE"/></td>
				    <td><w:write bind="#info.code"/></td>
				    <td><w:write bind="#info.name"/></td>
				    <td><w:write bind="#info.pan_level" typeCode="YJDD_PAN_LEVEL"/></td>
				    <td><w:write bind="#info.writetime" format="yyyy-MM-dd"/></td>
				    <td><w:write bind="#info.writer"/></td>
				    <td><w:write bind="#info.outtime" format="yyyy-MM-dd"/></td>
				    <td><w:write bind="#info.state" format="[未发布,已发布]"/></td>
				    <td><w:equal bind="#info.state" value="1"><input type="button" value="取消发布" onclick="fabu('<w:write bind="#info.id"/>',0)" style="width:80px;cursor:pointer"></w:equal><w:notEqual bind="#info.state" value="1"><input type="button" value=" 发 布 " onclick="fabu('<w:write bind="#info.id"/>',1)" style="width:80px;cursor:pointer"></w:notEqual></td>
				    <td><a href="#" onclick="panbase_edit('<w:write bind="#info.id"/>')" class="data_edit">修改</a></td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
	</form>
  </body>
</html>
