<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <%@ include file="/platform/style.jsp"%>
	    <script type='text/javascript' src='<%=path%>/2DMap/com/augurit/resources/dojo/dojo/dojo.js'></script>
	    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.js"></script>
	    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.Control.js"></script>
	    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/MapInIt.js"></script>
	    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/Toolbar.js"></script>
    <style>
   .icon1{background:url('<%=path%>/gzps/yjdd/img/cancel.png') no-repeat;}
   </style>
   <script>
   var GisObject;
   var gpspoints=[];
   var timefun;
   var num=0;
   var feature = null;
   function gpgplay(n){
   	init();
   	num=0;
   	try{
   	GisObject.toolbar.clear();
   	window.parent.clearGpsVector();
   	}catch(e){}
   	if(timefun)window.clearTimeout(timefun);
   	$w.doUrl(ctx+"/gzps/yjdd/YjddPage@getGpsList.page?@p0="+$("#gps"+n).attr("time")+"&@p1="+$("#gps"+n).attr("uid"),{},function(re){
   		gpspoints=[];
   		$(re.list).each(function(){
   			gpspoints.push([this.longitude,this.latitude]);
   		})
   		monitor();
   	})
   	$("#gps"+n).html("<a href='javascript:pause("+n+");'>暂停</a>&nbsp;&nbsp;<a href='javascript:stop("+n+");'>停止</a>");
   }
   function pause(n){
   		if(timefun)window.clearTimeout(timefun);
   		$("#gps"+n).html("<a href='javascript:continuegps("+n+");'>继续</a>&nbsp;&nbsp;<a href='javascript:stop("+n+");'>停止</a>");
   }
   function continuegps(n){
   		monitor();
   		$("#gps"+n).html("<a href='javascript:pause("+n+");'>暂停</a>&nbsp;&nbsp;<a href='javascript:stop("+n+");'>停止</a>");
   }
   function stop(n){
   	init();
   	if(timefun)window.clearTimeout(timefun);
   }
   function monitor(){
		if(feature){
			//window.parent.gpsvector.removeFeatures(feature);
			feature = null;
		}
		var style = {
			strokeWeight: 1,
			strokeOpacity: 1,
			strokeColor: "#e6111b",
			strokeEndarrow : "block"
		}
		if(gpspoints.length>0 && num<gpspoints.length){
			if(num==0){
				GisObject.toolbar.setCenter(gpspoints[0][0],gpspoints[0][1]);
				var geometryp = new AG.MicMap.Geometry.Point(gpspoints[0][0],gpspoints[0][1]);
				var stylep={
				 	url : ctx+'/gzps/yjdd/img/start.png',
				    width : 20,
				    height : 22,
				    align:'left',
				    offset:{x:0,y:-10},
				    title:''
				}
				var featurep= new AG.MicMap.Feature(geometryp,null,stylep);
				window.parent.gpsvector.addFeatures(featurep);
			}
			else{
				var geometry = new AG.MicMap.Geometry.PolyLine(gpspoints.slice(0,num));
				feature= new AG.MicMap.Feature(geometry,null,style);
				window.parent.gpsvector.addFeatures(feature);
				
				if(num==(gpspoints.length-1)){
					var geometryp = new AG.MicMap.Geometry.Point(gpspoints[num][0],gpspoints[num][1]);
					var stylep={
					 	url : ctx+'/gzps/yjdd/img/end.png',
					    width : 20,
					    height : 22,
					    align:'left',
					    offset:{x:0,y:-10},
					    title:''
					}
					var featurep= new AG.MicMap.Feature(geometryp,null,stylep);
					window.parent.gpsvector.addFeatures(featurep);
					stop();
				}
			}
			num++;
			timefun=window.setTimeout(function(){monitor()},1000);
		}
	}
   function init(){
   	$(".gpshuif").each(function(i){
   		$(this).html("<a href='javascript:;' onclick=\"gpgplay('"+i+"')\">轨迹回放</a>");
   	})
   }
   $(function(){
     init();
     GisObject=window.parent.getGisObject();
   })
   </script>
  </head>
  <body style="margin:0px;overflow:auto" onunload="if(timefun)window.clearTimeout(timefun);GisObject.toolbar.clear();">
  
    <div class="easyui-panel border_bottom_Cls"title="轨迹回放" data-options="border:false,tools:'#gpsTool'">
     	<form action="/gzps/yjdd/YjddPage@gpsInfo.page" method="post" class="PageForm">
     	<w:hidden bind="pageNum"/>
		<w:hidden bind="pageSize_"/>
     	<div class="ui-queryBar" style="height:25px;">
     	<table>
     	<tr>
     		<td>&nbsp;人员：</td><td colspan="3"><w:text bind="name" style="width:150px;"/></td>
     	</tr>
     	<tr>
     		<td>&nbsp;时间：</td><td><w:text bind="start" style="width:120px;" styleClass="easyui-datetimebox"/></td>
     		<td>-</td>
     		<td><w:text bind="end" style="width:120px;" styleClass="easyui-datetimebox"/></td>
     	</tr>
     	<tr>
     		<td colspan="4" align="center"><a href="#" class="easyui-linkbutton" iconCls="icon_search" onclick="$w.execForm()">查询</a>&nbsp;<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="window.history.back()">退出</a></td>
     	</tr>
     	</table>
     	</div>
      	</form>
     </div>
     <table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:true,pginfo:false,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th>时间</th>
	    			<th>人员</th>
	    			<th width="62">回放</th>
				</tr>
			</thead>
			<tbody>
			<w:iterate id="info" bind="resultList_" indexId="n">
				<tr class="ui_td">
					<td><w:write bind="#info.time"/></td>
					<td><w:write bind="#info.name"/></td>
					<td align="center" class="gpshuif" id="gps<%=n %>" time="<w:write bind="#info.time"/>" title="<w:write bind="#info.name"/>" uid="<w:write bind="#info.userid"/>"></td>
				</tr>
			</w:iterate>
			</tbody>
		</table>
		
     <div id="gpsTool">
    	<a href="javascript:;" class="icon1" onclick="window.history.back();" title="退出，返回"></a>
	</div>
  </body>
</html>
