<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
function pan_seluser2(){
	$w.openDialog({url:ctx+'/gzps/xjdd/selUser.jsp?selIds='+$("[name='bean.sms_xz_user']",$w.currWin()).val(),title:'选择人员',w:380,h:450,afterClose:function(){
		var re=window.parent.$w.getWinReturn();
		if(re){
			var uids="",unames="";
			for(i=0;i<re.length;i++){
				if(i!=0){uids+=",";unames+="、";}
				uids+=re[i].id;
				unames+=re[i].name;
			}
			$("[name='bean.sms_xz_user']",$w.currWin()).val(uids);
			$("[name='bean.xz_username']",$w.currWin()).val(unames);
			
		}
	}});
}
function pan_seldw2(){
	$w.openDialog({url:ctx+'/gzps/yjdd/TeamPage@selBox.page?ids='+$("[name='bean.sms_dw_user']",$w.currWin()).val(),title:'选择应急队伍',w:370,h:380,afterClose:function(){
		var re=window.parent.$w.getWinReturn();
		if(re){
			var uids="",unames="";
			for(i=0;i<re.length;i++){
				if(i!=0){uids+=",";unames+="、";}
				uids+=re[i].id;
				unames+=re[i].name;
			}
			$("[name='bean.sms_dw_user']",$w.currWin()).val(uids);
			$("[name='bean.dw_username']",$w.currWin()).val(unames);
			
		}
	}});
}

function pan_addequip2(){
	$w.openDialog({url:ctx+'/gzps/yjdd/EquipPage@selBox.page',title:'选择应急装备',w:570,h:420,afterClose:function(){
		var re=window.parent.$w.getWinReturn();
		if(re){
			var id="";
			for(i=0;i<re.length;i++){
				if(i!=0){uids+=",";}
				id+=re[i].id;
			}
			$w.doUrl(ctx+"/gzps/yjdd/EquipPage@getEquipByIds.page?id="+id,{},function(re){
				$(re.datas).each(function(){
					$("#equipTd").append("<tr class='ui_td'><td><input name='eduipIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td>"+this.typename+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb2('equipTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function pan_addgood2(){
	$w.openDialog({url:ctx+'/gzps/yjdd/GoodPage@selBox.page',title:'选择应急物资',w:570,h:420,afterClose:function(){
		var re=window.parent.$w.getWinReturn();
		if(re){
			var id="";
			for(i=0;i<re.length;i++){
				if(i!=0){uids+=",";}
				id+=re[i].id;
			}
			$w.doUrl(ctx+"/gzps/yjdd/GoodPage@getGoodByIds.page?id="+id,{},function(re){
				$(re.datas).each(function(){
					$("#goodTd").append("<tr class='ui_td'><td><input name='goodIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td><input name='goodAmounts' style='width:60px'></td><td>"+this.amount+this.unit+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb2('goodTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function deltb2(tbid,obj){
	var r=obj.parentNode.parentNode.rowIndex;
	$("#"+tbid).children().each(function(i){
		if(i==(r-1)){
			$(this).remove();
			return false;
		}
	})
}
function startPan(){
	if(!$("[name='bean.name']",$w.currWin())[0]){
		alert("请选择要启动的预案方案");
		return false;
	}
	if($("[name='bean.name']",$w.currWin()).val()==""){
		alert("请输入预案名称")
		return false;
	}else if($("[name='bean.code']",$w.currWin()).val()==""){
		alert("请输入预案编号")
		return false;
	}
	$w.doWinForm();	
}
</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:35,border:false">
	<table width="100%" height="100%">
	<tr>
		<td width="180" valign="top">
			<div class="easyui-panel" fit="true" title="预案方案列表" style="">
				<ul id="panTree" class="easyui-tree" data-options="lines:true">
					<w:iterate id="info" bind="resultList_">
					<li>  
					      <span><w:write bind="#info.name"/></span>
					      <ul>
					     	<w:iterate id="team" bind="#info.panList">
					      	<li id="<w:write bind="#team.id"/>"><span><w:write bind="#team.name"/></span></li>
					      	</w:iterate>
					      </ul>
					</li>
					</w:iterate>
				</ul>
			</div>
		</td>
		<td valign="top">
			<div class="easyui-panel" fit="true" title="预案信息" id="panInfopanel">
				<table align="center" height="90%">
				<tr>
				<td align="center" style="color:#747474;font-size:14px;"><-请在左侧选择预案方案</td>
				</tr>
				</table>
			</div>
		</td>
	</tr>
	</table>
</div>
<div class="ui-buttonBar" style="text-align:center">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="startPan()">启动预案</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>
<script>
$("#panTree").tree({
lines:true,
	onClick:function(node){
		$w.execUrl(ctx+"/gzps/yjdd/PanPage@panBaseInfoShow.page?id="+node.id,{},"panInfopanel");
	}
})
</script>