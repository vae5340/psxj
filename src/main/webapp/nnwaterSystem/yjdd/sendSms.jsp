<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
String panid=request.getParameter("panid");
String uid=request.getParameter("userid");
String username=request.getParameter("username");
if(panid==null)panid="";
if(uid==null)uid="";
if(username==null)username="";
%>
<script>
function selsmsuser(){
	$w.openDialog({url:ctx+'/gzps/xjdd/selUser.jsp?selIds='+$("[name='bean.userids']",$w.currWin()).val(),title:'选择人员',w:380,h:450,afterClose:function(){
		var re=window.parent.$w.getWinReturn();
		if(re){
			var uids="",unames="";
			for(i=0;i<re.length;i++){
				if(i!=0){uids+=",";unames+="、";}
				uids+=re[i].id;
				unames+=re[i].name;
			}
			$("[name='bean.userids']",$w.currWin()).val(uids);
			$("[name='bean.username']",$w.currWin()).val(unames);
			
		}
	}});
}
function tosendsms(){
	if($("[name='bean.userids']",$w.currWin()).val()==''){
		alert("请选择短信接收人");
	}else if($("[name='bean.content']",$w.currWin()).val()==''){
		alert("请编辑短信内容");
	}else{
		$w.doWinForm();
	}
}
</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:37,border:false" style="margin:1px">
<form method="post" action="/gzps/yjdd/YjddPage@sendSms.page">
	<input name="bean.userids" type="hidden" value="<%=uid %>">
	<input name="bean.tag" type="hidden" value="1">
	<input name="bean.panid" type="hidden"value="<%=panid %>">
	<div class="ui-formContent">
	<table>
	<tr>
	<td valign="top" width="70">接收人：</td>
	<td><textarea name="bean.username" style="width:275px;height:100px;"><%=username %></textarea></td>
	<td valign="top"><a href="javascript:selsmsuser();"><img src="<%=path %>/resources/images/icons/16_16/add.png"></a></td>
	</tr>
	<tr>
	<td valign="top" width="70">短信内容：</td>
	<td colspan="2"><textarea name="bean.content" style="width:290px;height:200px;"></textarea></td>
	</tr>
	</table>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_go.png'" onclick="tosendsms()">发 送</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>