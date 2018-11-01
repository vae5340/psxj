<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
function pan_seldw3(){
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

function pan_addequip3(){
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
					$("#equipTd").append("<tr class='ui_td'><td><input name='eduipIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td>"+this.typename+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb3('equipTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function pan_addgood3(){
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
					$("#goodTd").append("<tr class='ui_td'><td><input name='goodIds' type='hidden' value='"+this.id+"'>"+this.code+"</td><td>"+this.name+"</td><td><input name='goodAmounts' style='width:60px'></td><td>"+this.amount+this.unit+"</td><td>"+this.address+"</td><td><a href='javascript:;' onclick=\"deltb3('goodTd',this);\"><img src='"+ctx+"/platform/images/no.gif'></a></td></tr>")
				})
			})
		}
	}});
}
function deltb3(tbid,obj){
	var r=obj.parentNode.parentNode.rowIndex;
	$("#"+tbid).children().each(function(i){
		if(i==(r-1)){
			$(this).remove();
			return false;
		}
	})
}
function showSendSms(){
	$w.openDialog({title:'发送短信通知',url:ctx+"/gzps/yjdd/sendSms.jsp",w:400,h:430});
}
function pan_jiechu(id){
	window.parent.$w.confirmMsg("确定要解除该预案？",function(r){
			if(r)
				$w.doUrl(ctx+"/gzps/yjdd/PanPage@panJiechu.page?id="+id,$w.currForm().serializeArray(),function(){
					$w.closeCurrWin('ok');
				})
		});
}
function pan_shenj(id){
	$w.openDialog({title:'预案升级',url:ctx+"/gzps/yjdd/PanPage@panLevelShow.page?id="+id,w:300,h:150,afterClose:function(re){
		if(re)
		$w.doUrl(ctx+"/gzps/yjdd/PanPage@panShenji.page?id="+id+"&@p0="+encodeURIComponent(re),{},function(){
			$w.closeCurrWin('ok');
		})
	}});
}
function pan_jianj(id){
	$w.openDialog({title:'预案降级',url:ctx+"/gzps/yjdd/PanPage@panLevelShow.page?id="+id,w:300,h:150,afterClose:function(re){
		if(re)
		$w.doUrl(ctx+"/gzps/yjdd/PanPage@panJianji.page?id="+id+"&@p0="+encodeURIComponent(re),{},function(){
			$w.closeCurrWin('ok');
		})
	}});
}
function pan_restart(id){
	window.parent.$w.confirmMsg("确定要重新启动该预案？",function(r){
		if(r){
			$w.doUrl(ctx+"/gzps/yjdd/PanPage@restartPan.page?id="+id,{},function(){
				$w.closeCurrWin('ok');
			})
		}
	});
}
function pan_huif(id){
	window.parent.addTab('panhuiftab','应急回放',ctx+"/gzps/yjdd/pan/playbackMain.jsp?panid="+id,"/resources/images/icons/16_16/plugin.png");
	$w.closeCurrWin();
}
</script>
<div class="easyui-panel bodybg" data-options="doSize:false,layoutH:35,border:false">
	<div style="text-align:center;height:30px;line-height:30px;"><span style="font-size:16px;font-weight:bold;"><w:write bind="bean.name"/></span><span style="color:red;font-size:16px;font-weight:bold;">（<w:write bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/>）</span></div>
	<table width="99%" align="center">
	<tr>
		<td align="right" height="25">预案编号：</td><td><w:write bind="bean.code"/></td>
		<td align="right">预案级别：</td><td><w:write bind="bean.pan_level" typeCode="YJDD_PAN_LEVEL"/></td>
		<td align="right">发布时间：</td><td><w:write bind="bean.starttime" format="yyyy-MM-dd"/></td>
		<td align="right">预案状态：</td><td><w:write bind="bean.state" format="[,启动中,已解除]"/></td>
	</tr>
	</table>
	<div id="panBase_Tabs" class="easyui-tabs" data-options="" style="width:715px;height:350px;">
		<div title="应急事件">
			<div class="easyui-panel" id="problemPanel" data-options="doSize:false,border:false,href:'<%=path %>/gzps/yjdd/PanPage@problemList.page'">
			
			</div>
		</div>
		<div title="短信通知">
			<div class="easyui-panel" id="pansmsPanel" data-options="doSize:false,border:false,href:'<%=path %>/gzps/yjdd/PanPage@smsList.page?id=<w:write bind="bean.id"/>'">
			
			</div>
		</div>
		<div title="应急队伍人员">
			<div style="text-align:right;padding-bottom:2px;padding-top:4px;"><button style="cursor:pointer" onclick="pan_seldw3()">添加应急人员</button></div>
        	<table  class="ui-table" width="99%" align="center" cellpadding="1" cellspacing="1" data-options="showPage:false">
      		<thead>
				<tr class="ui_th">
					<th style="padding-left:2px">姓名</th>
	    			<th style="padding-left:2px">职务</th>
	    			<th style="padding-left:2px">联系电话</th>
	    			<th style="padding-left:2px">所属队伍</th>
				</tr>
			</thead>
			<tbody id="teamTd">
			<w:notEqual bind="bean.teamuserlist" value="null">
			<w:iterate id="info" bind="bean.teamuserlist">
			<tr class='ui_td'>
				<td><w:write bind="#info.username"/></td>
				<td><w:write bind="#info.post"/></td>
				<td><w:write bind="#info.phone"/></td>
				<td><w:write bind="#info.teamname"/></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
		</div>
		<div title="应急装备">
			<div style="text-align:right;padding-bottom:2px;padding-top:4px;"><button style="cursor:pointer" onclick="pan_addequip3()">添加装备</button></div>
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
				<td><a href='javascript:;' onclick="deltb3('equipTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
		</div>
		<div title="应急物资">
			<div style="text-align:right;padding-bottom:2px;padding-top:4px;"><button style="cursor:pointer" onclick="pan_addgood3()">添加物资</button></div>
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
				<td><a href='javascript:;' onclick="deltb3('goodTd',this);"><img src='<%=path %>/platform/images/no.gif'></a></td>
			</tr>
			</w:iterate>
			</w:notEqual>
			</tbody>
			</table>
		</div>
	</div>

</div>
<div class="ui-buttonBar" style="text-align:center">
	<w:equal bind="bean.state" value="1">
		<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_group.png'" onclick="window.parent.addTab('YjddMap','应急调度室',ctx+'/gzps/yjdd/YjddPage.page','/UI/style/default/images/application_view_tile.png',true,true,false);$w.closeCurrWin()">应急调度室</a>
		<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_get.png'" onclick="pan_shenj('<w:write bind="bean.id"/>')">预案升级</a>
		<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_put.png'" onclick="pan_jianj('<w:write bind="bean.id"/>')">预案降级</a>
		<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_form_delete.png'" onclick="pan_jiechu('<w:write bind="bean.id"/>')">预案解除</a>
		<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/calculator.png'" onclick="showSendSms()">发布通知</a>
	</w:equal>
	<w:equal bind="bean.state" value="2">
	<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_form_add.png'" onclick="pan_restart('<w:write bind="bean.id"/>')">重启启动</a>
	</w:equal>
	<a href="javascript:;" class="easyui-linkbutton" data-options="iconUrl:'<%=path %>/resources/images/icons/16_16/application_cascade.png'" onclick="pan_huif('<w:write bind="bean.id"/>')">应急回放</a>
	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">关 闭</a>
</div>
