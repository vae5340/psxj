<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
String ids=request.getParameter("ids");
String[] ss=null;
if(ids!=null)ss=ids.split(",");
%>
<script>
function user_tree_ok(){
	var nodes=$("#panteamTree").tree("getChecked");
	var relist=new Array();
	for(i=0;i<nodes.length;i++){
		if(nodes[i].id){
			var n=relist.length;
			relist[n] = new Object();
			relist[n].id=nodes[i].id
			relist[n].name=nodes[i].text;
		}
	}
	if(relist.length==0){
		 alert('您没有选择队伍');
       	 return false;
	}
	$w.closeCurrWin(relist);	
}
</script>
<ul id="panteamTree" class="easyui-tree" data-options="checkbox:true" >
<w:iterate id="info" bind="resultList_">
<li>  
      <span><w:write bind="#info.name"/></span>
      <ul>
     	<w:iterate id="team" bind="#info.teamList">
     	<w:define id="tid" bind="#team.id"/>
     	<%boolean bl=false;if(ss!=null){for(String s:ss){if(s.equals(tid.toString()))bl=true;}} %>
      	<li id="<w:write bind="#team.id"/>" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_group.png',checked:<%=bl %>"><span><w:write bind="#team.name"/></span></li>
      	</w:iterate>
      </ul>
</li>
</w:iterate>
</ul>
<table align="center"><tr><td><input type="button" value=" 确 定 " style="cursor:pointer" onclick="user_tree_ok()">&nbsp;&nbsp;<input type="button" value=" 关 闭 " onclick="$w.closeCurrWin()" style="cursor:pointer"></td></tr></table>
