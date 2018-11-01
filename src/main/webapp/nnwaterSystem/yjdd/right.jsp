<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <%@ include file="/platform/style.jsp"%>
   <link rel="stylesheet" type="text/css" href="<%=path %>/gzps/yjdd/css.css">
   <script>
	   $(function(){
	   		var hei=document.body.clientHeight;
			var h=(hei-25)/3;
			//$("#equippanel").panel("resize",{height:(h)});
			//$("#teampanel").panel("resize",{height:'50px'})
			//$("#goodpanel").panel("resize",{height:(h-20)})
	   })
   </script>
  </head>
  <body style="margin:0px;overflow:hidden">
    <div id="panpanel" class="easyui-panel border_bottom_Cls" style="min-height:20px;max-height:60px" data-options="border:false">
     	<w:notEqual bind="#panList" value="null">
     		<w:define id="panid" bind="#panList.id"/>
     		<div class="curspan">当前启动的预案：<span style="color:red"><w:write bind="#panList.pan_level" typeCode="YJDD_PAN_LEVEL"/></span></div><div class="curpantitle"><a href="javascript:window.parent.panShow('<w:write bind="#panList.id"/>');" class="curpana"><w:write bind="#panList.name"/></a></div>
     		<script>window.parent.document.getElementById("curPanId").value='<%=panid%>';</script>
     	</w:notEqual>
     	<w:equal bind="#panList" value="null">
     		<ul class="panList">
     		<w:iterate id="info" bind="#basepanList"><li style="padding:2px;background:url('<%=path %>/resources/images/icons/16_16/medal_gold_3.png') no-repeat 4px center;text-indent:18px;"><a href="javascript:window.parent.panShow('<w:write bind="#info.id"/>');" class="curpana2"><w:write bind="#info.name"/>（<w:write bind="#info.state" format="[,已启动,已解除]"/>）</a></li></w:iterate>
     		</ul>
     	</w:equal>
     </div>
      <div class="easyui-panel border_bottom_Cls"  data-options="border:false,iconUrl:'<%=path %>/gzps/yjdd/img/busstation.png',tools:'#equipTool'" title="装备信息">
      	<div class="ui-queryBar" style="height:25px;"><select name="equiptype"><option value="">--装备分类--</option><w:options bind="" collection="#equipTypeList" value="value" text="text"/></select><input name="equipname" style="height:20px;width:120px"><a href="javascript:;" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execUrl('<%=path %>/gzps/yjdd/right_equip.jsp',{},'equippanel')">查询</a></div>
      	<div class="easyui-panel" data-options="doSize:false,border:false,href:'<%=path %>/gzps/yjdd/right_equip.jsp'" id="equippanel" >
      	
     	</div>
      </div>
      <div id="teampanel" class="easyui-panel border_bottom_Cls" data-options="border:false,iconUrl:'<%=path %>/resources/images/icons/16_16/application_group.png',tools:'#teamTool'" title="应急人员信息">
      	<div class="ui-queryBar" style="height:25px;"><input name="" style="height:20px;width:220px"><a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="">查询</a></div>
      	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:false">
			<tbody>
     		<w:iterate id="info" bind="#teamUserList">
				<tr class="ui_td">
					<td align="center" title="点击地图定位" style="cursor:pointer" onclick="window.parent.user_dw('<w:write bind="#info.userid"/>')"><img src="<%=path %>/resources/images/icons/16_16/blue-gislocate.png"></td>
					<td ondblclick="window.parent.user_dw('<w:write bind="#info.userid"/>')"><w:write bind="#info.teamname"/>：<w:write bind="#info.username"/></td>
				</tr>
			</w:iterate>
			</tbody>
     	</table>
      </div>
       <div class="easyui-panel" data-options="border:false,iconUrl:'<%=path %>/resources/images/icons/16_16/brickss.png',tools:'#goodTool'" title="应急物资">
       	<div class="ui-queryBar" style="height:25px;"><select name="goodtype"><option value="">--物资分类--</option><w:options bind="" collection="#goodTypeList" value="value" text="text"/></select><input name="" style="height:20px;width:120px"><a href="javascript:;" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execUrl('<%=path %>/gzps/yjdd/right_good.jsp',{},'goodpanel')">查询</a></div>
      	<div class="easyui-panel" data-options="doSize:false,border:false,href:'<%=path %>/gzps/yjdd/right_good.jsp'" id="goodpanel" >
      	
     	</div>
      	
      </div>
      
    <div id="equipTool">
    	<span onclick="window.parent.parent.addMisTab('装备管理','<%=path %>/gzps/yjdd/EquipPage.page');" style="cursor:pointer" onmouseover="$(this).css('text-decoration','underline')" onmouseout="$(this).css('text-decoration','none')">装备管理&nbsp;&nbsp;</span>
	</div>
	<div id="teamTool">
    	<span onclick="window.parent.parent.addMisTab('队伍管理','<%=path %>/gzps/yjdd/TeamPage.page');" style="cursor:pointer" onmouseover="$(this).css('text-decoration','underline')" onmouseout="$(this).css('text-decoration','none')">人员管理&nbsp;&nbsp;</span>
	</div>
	<div id="goodTool">
    	<span onclick="window.parent.parent.addMisTab('物资管理','<%=path %>/gzps/yjdd/GoodPage.page');" style="cursor:pointer" onmouseover="$(this).css('text-decoration','underline')" onmouseout="$(this).css('text-decoration','none')">物资管理&nbsp;&nbsp;</span>
	</div>
  </body>
</html>
