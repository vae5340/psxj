<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
var pan_n=0;
function pan_next(){
	pan_n++;
	var us=$(".ui-formContent",$w.currWin());
	us.each(function(i){
		$(this).hide();
		if(i==pan_n){
			$(this).show();
		}
	});
	if(pan_n>0)$("#pan_lastbu").show();
	if(pan_n==(us.length-1))$("#pan_nextbu").hide();
	$("#pan_nav",$w.currWin()).children().each(function(i){
		$(this).css("background","");
		if(i==pan_n){
			$(this).css("background","url("+ctx+"/gzps/yjdd/img/b.png)");
		}
	})
}
function pan_last(){
	pan_n--;
	if(pan_n<0)pan_n=0;
	$(".ui-formContent",$w.currWin()).each(function(i){
		$(this).hide();
		if(i==pan_n){
			$(this).show();
		}
	});
	if(pan_n==0)$("#pan_lastbu").hide();
	$("#pan_nextbu").show();
	$("#pan_nav",$w.currWin()).children().each(function(i){
		$(this).css("background","");
		if(i==pan_n){
			$(this).css("background","url("+ctx+"/gzps/yjdd/img/b.png)");
		}
	})
}
function pan_seluser(){
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
function pan_seldw(){
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

function pan_addequip(){
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
					$("#equipTd").append("<tr class='ui_td'><td><input name='eduipIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td>"+this.typename+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb('equipTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function pan_addgood(){
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
					$("#goodTd").append("<tr class='ui_td'><td><input name='goodIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td><input name='goodAmounts' style='width:60px'></td><td>"+this.amount+this.unit+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb('goodTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function deltb(tbid,obj){
	var r=obj.parentNode.parentNode.rowIndex;
	$("#"+tbid).children().each(function(i){
		if(i==(r-1)){
			$(this).remove();
			return false;
		}
	})
}
function panbase_save(){
	if($("[name='bean.name']",$w.currWin()).val()==""){
		alert("请输入预案方案名称")
		return false;
	}else if($("[name='bean.code']",$w.currWin()).val()==""){
		alert("请输入预案方案编号")
		return false;
	}
	$w.doWinForm();
}
</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:36,border:false" style="margin-right:2px;">
<form method="post" action="/gzps/yjdd/PanPage@panBaseSave.page">
	<w:hidden bind="bean.id"/>
	<w:hidden bind="new_"/>
	<table height="100%">
	<tr>
	<td width="120" valign="top" bgcolor="#AED9F3">
	<br/>
	<ul style="margin-left:7px;" id="pan_nav">
		<li style="width:113px;height:31px;line-height:31px;background:url(<%=path %>/gzps/yjdd/img/b.png);cursor:pointer" onclick="pan_n=-1;pan_next()">&nbsp;1、预案基本信息</li>
<!-- 		<li style="width:113px;margin-top:5px;height:31px;line-height:31px;cursor:pointer" onclick="pan_n=0;pan_next()">&nbsp;2、预案应急小组</li> -->
		<li style="width:113px;margin-top:5px;height:31px;line-height:31px;cursor:pointer" onclick="pan_n=0;pan_next()">&nbsp;2、预案应急队伍</li>
		<li style="width:113px;margin-top:5px;height:31px;line-height:31px;cursor:pointer" onclick="pan_n=1;pan_next()">&nbsp;3、预案应急装备</li>
		<li style="width:113px;margin-top:5px;height:31px;line-height:31px;cursor:pointer" onclick="pan_n=2;pan_next()">&nbsp;4、预案应急物资</li>
	</ul>
	</td>
	<td valign="top">
	<div class="ui-formContent">
		<FIELDSET style="margin-left:3px;padding:8px;">
        	<LEGEND align=left><b>预案基本信息</b></LEGEND>
        	<table style="margin-top:5px;">
        	<tr>
				<td align="right" height="30">预案分类：</td><td><select name="bean.type" style="width:160px;"><w:options bind="bean.type" typeCode="YJDD_PAN_TYPE"/></select></td>
				<td></td><td></td>
			</tr>
        	<tr>
				<td align="right" height="30"><font color="red">*</font>预案名称：</td><td colspan="3"><w:text bind="bean.name"  style="width:410px;" styleClass="easyui-validatebox" dataOptions="required:true"/></td>
			</tr>
			<tr>
				<td width="85" align="right" height="30">预案号：</td><td><w:text bind="bean.code" style="width:150px;"/></td>
				<td width="80" align="right">预案级别：</td><td><select name="bean.pan_level" style="width:150px;"><w:options bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></select></td>
			</tr>
			<tr>
				<td width="80" align="right" height="30">编制人：</td><td><w:text bind="bean.writer" style="width:150px;"/></td>
				<td width="80" align="right">编制时间：</td><td><w:text bind="bean.writetime" styleClass="easyui-datebox" style="width:150px;" dataOptions=""/></td>
			</tr>
			<tr>
				<td align="right" height="30" valign="top">预案描述：</td><td colspan="3"><textarea style="width:410px;height:150px">由于现时防汛形势严峻,百种设备已整装待发,特发布三级应急预案
				</textarea></td>
			</tr>
			</table>
        </FIELDSET>
	</div>
	<!-- <div class="ui-formContent" style="display:none">
		<FIELDSET style="margin-left:3px;padding:8px;">
        	<LEGEND align=left><b>应急小组成员</b></LEGEND>
        	<table>
        	<tr>
        	<td></td>
        	<td align="right"><button style="cursor:pointer" onclick="pan_seluser()">选择人员</button></td>
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
        </FIELDSET>
        
	</div>
	 -->
	<div class="ui-formContent" style="display:none">
		<FIELDSET style="margin-left:3px;padding:8px;">
        	<LEGEND align=left><b>预案应急队伍</b></LEGEND>
        	<table>
        	<tr>
        	<td></td>
        	<td align="right"><button style="cursor:pointer" onclick="pan_seldw()">选择应急队伍</button></td>
        	</tr>
        	<tr>
        	<td valign="top" width="70" style="padding-top:5px;" align="right">应急队伍：</td>
        	<td><w:hidden bind="bean.sms_dw_user"/><w:textarea bind="bean.dw_username" style="width:400px;height:120px;"/></td>
        	</tr>
        	<tr>
        	<td valign="top" style="padding-top:5px;" align="right">短信编辑：</td>
        	<td><textarea bind="bean.sms_dw_con" style="width:400px;height:150px;">由于现时防汛形势严峻,百种设备已整装待发,现通知各位队员做好出发准备</textarea></td>
        	</tr>
        	</table>
        </FIELDSET>
	</div>
	<div class="ui-formContent" style="display:none">
		<FIELDSET style="margin-left:3px;padding:8px;">
        	<LEGEND align=left><b>预案应急装备</b></LEGEND>
        	<div style="text-align:right;padding-bottom:2px;"><button style="cursor:pointer" onclick="pan_addequip()">添加装备</button></div>
        	<table  class="ui-table" width="515" cellpadding="1" cellspacing="1" data-options="showPage:false">
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
				<td><a href='javascript:;' onclick="deltb('equipTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
        </FIELDSET>
	</div>
	<div class="ui-formContent" style="display:none">
		<FIELDSET style="margin-left:3px;padding:8px;">
        	<LEGEND align=left><b>预案应急物资</b></LEGEND>
        	<div style="text-align:right;padding-bottom:2px;"><button style="cursor:pointer" onclick="pan_addgood()">添加物资</button></div>
        	<table  class="ui-table" width="515" cellpadding="1" cellspacing="1" data-options="showPage:false">
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
				<td><a href='javascript:;' onclick="deltb('goodTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
        </FIELDSET>
	</div>
	</td>
	</tr>
	</table>
	
</form>
</div>
<div class="ui-buttonBar">
	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon_save" id="pan_lastbu" onclick="pan_last()" style="display:none">&lt;上一步</a>
	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon_save" id="pan_nextbu" onclick="pan_next()">下一步&gt;</a>
	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon_save" onclick="panbase_save()">保 存</a>
	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>