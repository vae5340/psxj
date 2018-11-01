<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
   <script>
   function dingw(jsd,x,y,name,id){
   	if(x){
   		window.parent.showGisTab();
   		var GisObject=window.parent.GisFrame.getGisObject();
   		var style = {
			url:ctx+'/2DMap/com/augurit/resources/images/info.gif',
			width:18,
			height:18
		}
		GisObject.layerLocate.locateByPoint(x,y,null,true, false,style);
   		var param = {
		    x : x,
		    y : y,
		    title :"积水点："+name,
		    context : '<iframe width="230" height="240" src="'+ctx+'/gzps/yjdd/RainRescuePage@showRainRescuestat.page?id='+jsd+'&name='+id+'" frameborder="0"></iframe>',
		    allShow : false
		}
		var infowindow =GisObject.mapcontrol.showInfowindow(param);
   	}
   }
   function rain_add(){
   	window.$w.openWin({title:'添加一雨一报',url:ctx+"/gzps/yjdd/RainRescuePage@addShow.page",w:400,h:430,afterClose:function(re){
		if(re)
				$w.execForm()
	}});
   }
   function rain_del(){
   		window.$w.confirmMsg("确定要删除？",function(r){
			if(r)
				$w.doUrl(ctx+"/gzps/yjdd/RainRescuePage@del.page",$w.currForm().serializeArray(),function(){
					$w.execForm()
				})
		});
   }
   </script>
</head>
<body>
 <form action="/gzps/yjdd/RainRescuePage.page" method="post" class="PageForm">
	<w:hidden bind="pageNum"/>
	<w:hidden bind="pageSize_"/>
	<w:hidden bind="id"/>
	<div class="easyui-panel ui-queryBar" border="false" data-options="doSize:false" title="一雨一报信息">
	<table cellpadding="0" cellspacing="0" style="margin-top:5px">
		<tr>
			<td>&nbsp;积水点：</td><td><w:text bind="bean.name" style="width:100px;"/></td>
			<td>&nbsp;应急预案：</td><td><select bind="bean.code"><option value=""></option><w:options bind="bean.code" collection="#panList" value="value" text="text"/></select></td>
			<td>&nbsp;上报人：</td><td><w:text bind="bean.username" style="width:90px;"/></td>
			<td>&nbsp;上报时间：</td><td><w:text bind="bean.start" style="width:90px;" styleClass="easyui-datebox"/></td>
			<td>-</td><td><w:text bind="bean.end" style="width:90px;" styleClass="easyui-datebox"/></td>
			<td>
				<a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>
			</td>
		</tr>
		</tr>
	</table>
	</div>
	<div class="easyui-panel ui-toolBar" border="false" data-options="doSize:false">
		<a href="#" class="easyui-linkbutton" iconCls="icon_add" plain="true" onclick="rain_add()">添加一雨一报</a>
		<a href="#" class="easyui-linkbutton" iconCls="icon_del" plain="true" onclick="rain_del()">删除</a>
	</div>
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th width="30" align="center"><input type="checkbox" name="all_box" value="all" onclick="$selAllTbBoxs(this)"></th>
	    			<th><div style="text-align:center">积水点</div></th>
	    			<th><div style="text-align:center">积水程度</div></th>
	    			<th><div style="text-align:center">积水原因</div></th>
	    			<th><div style="text-align:center">抢险措施</div></th>
	    			<th><div style="text-align:center">交通影响</div></th>
	    			<th><div style="text-align:center">水浸改造</div></th>
	    			<th><div style="text-align:center">上报时间</div></th>
	    			<th><div style="text-align:center">上报人</div></th>
	    			<th width="45" align="center"><div style="text-align:center">定位</div></th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_">
				<tr class="ui_td">
					<td><input type="checkbox" name="primaryKey_" value="<w:write bind="#info.info_id"/>"></td>
				   <td style="padding-left:2px;"><w:write bind="#info.WATERLOGGING_NAME"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.WATER_DEGREE"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.REASON"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.MEASURE"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.TRAFFIC_IMPACT"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.MODIFICATION"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.CREATE_DATE" format="yyyy-MM-dd"/></td>
				    <td style="padding-left:2px;"><w:write bind="#info.user_name"/></td>
				    <td align="center"><a href="javascript:dingw('<w:write bind="#info.WATERLOGGING_ID"/>','<w:write bind="#info.x"/>','<w:write bind="#info.y"/>','<w:write bind="#info.WATERLOGGING_NAME"/>','<w:write bind="#info.info_ID"/>');"><img src="<%=path %>/resources/images/icons/16_16/blue-gislocate.png"></a></td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
</form>
</body>
</html>