<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
    <title>应急调度室</title>
    <link rel="stylesheet" type="text/css" href="<%=path %>/gzps/yjdd/css.css">
    <script type='text/javascript' src='<%=path%>/2DMap/com/augurit/resources/dojo/dojo/dojo.js'></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.Control.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/MapInIt.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/Toolbar.js"></script>
    <style>
    .icon-set{background:url('<%=path%>/resources/images/icons/16_16/wrench_orange.png') no-repeat center center;}
    .icon-aa{background:url('<%=path%>/resources/images/icons/16_16/award_star_silver_1.png') no-repeat center center;}
    .icon-bb{background:url('<%=path%>/resources/images/icons/16_16/application_cascade.png') no-repeat center center;}
    .icon-cc{background:url('<%=path%>/resources/images/icons/16_16/calculator.png') no-repeat center center;}
    </style>
	<script>
	//	window.parent.showShield();
		var layers=new Array();
		var currzoom;
		var interval='20000';
		var gpsvector;
		$(function(){
			document.getElementById("mapFrame").src="map.jsp";
// 		loadok();
		})
		function panShow(id){
			window.parent.$w.openDialog({title:'预案管理',url:ctx+"/gzps/yjdd/PanPage@show.page?id="+id,w:730,h:480,afterClose:function(re){
				if(re)
					window.location.reload();
			}});
		}
		function paninfoList(){
			window.parent.addMisTab("预案管理",ctx+"/gzps/yjdd/PanPage.page");
		
		}
		function startPan(){
			window.parent.$w.openDialog({title:'启动新预案',url:ctx+"/gzps/yjdd/PanPage@startPanShow.page",w:780,h:470,afterClose:function(re){
				
			}});
		}
		//加载监测图层
		function loadLayer(){
			if(layers.length==0){
				$("[name='yjLayer']").each(function(){
					var vector=new AG.MicMap.Layer.Vector("yjlayer"+this.value);
					getGisObject().map.addLayer(vector);
					var lobj=new Object();
					lobj.id=this.value;
					lobj.vector=vector;
					layers[layers.length]=lobj;
				})
			}
			gpsvector=new AG.MicMap.Layer.Vector("gpsvector");
			getGisObject().map.addLayer(gpsvector);
			
			//加载积水点图层（只加载一次）
			$w.doUrl(ctx+"/gzps/yjdd/jsd.txt",{},function(re){//测试写死
				$(re.data).each(function(index,val){
					var geometry = new AG.MicMap.Geometry.Point(this.x,this.y);
					var style = {
					    url : 'true',
					    width : 14,
					    height : 14,
					    align:'left',
					    title:'html:<div style="width:80px;float:left" title="积水点：'+this.name+'"><span style="margin-top:1px;float:left;"><img src="'+ctx+'/gzps/fljk/img/layer_sw_jsd.png" width=14 height=14></span><span id="jsd'+this.code+'"></span></div>'
					}
					var feature = new AG.MicMap.Feature(geometry,null,style);
					getLayer('jsd').vector.addFeatures(feature);
				})
				$("#la_jsd_num").html("("+re.data.length+")");
			});
			
// 			currzoom=getGisObject().toolbar.getZoom();
// 			alert(1);
// 			loadJsdLayer();
// 			loadGpsLayer();
// 			getGisObject().map.events.on({
// 				    'moveend' : function(re){if(re.object.zoom!=currzoom){loadJsdLayer();loadGpsLayer();}currzoom=re.object.zoom;},
// 				    scope : this
// 			})
		}
		//gps监测
		function loadGpsLayer(){
			$w.doUrl(ctx+"/gzps/yjdd/YjddPage@showLayerGet.page",{},function(re){
				if(document.getElementById("userLayer").checked){
					getLayer('user').vector.removeAllFeatures();
					$(re.userList).each(function(){
						var geometry = new AG.MicMap.Geometry.Point(this.longitude,this.latitude);
						var style = {
						    url : 'true',
						    width : 14,
						    height : 14,
						    align:'left',
						     title:'html:<div title="" style="width:90px" onclick="user_dw('+this.userid+')"><span style="float:left;"><img src="'+ctx+'/resources/images/icons/16_16/user_suit.gif"/></span><span style="float:left">-</span><span style="background:#7EA03E;float:left;color:#ffffff;padding-left:2px;padding-right:2px;">'+this.username+'</span></div>'
						}
						var feature = new AG.MicMap.Feature(geometry,null,style);
						feature.id=this.userid;
						feature.attributes={"username":this.username}
						getLayer('user').vector.addFeatures(feature);
					})
					$("#la_user_num").html("("+re.userList.length+")");
				}
				if(document.getElementById("carLayer").checked){
					getLayer('car').vector.removeAllFeatures();
					$(re.carList).each(function(){
						var geometry = new AG.MicMap.Geometry.Point(this.longitude,this.latitude);
						var style = {
						    url : 'true',
						    width : 14,
						    height : 14,
						    align:'left',
						    title:'html:<div title="" style="width:100px" onclick="car_dw('+this.carid+')"><span style="float:left;"><img src="'+ctx+'/gzps/yjdd/img/busstation.png"/></span><span style="float:left">-</span><span style="background:#CD941D;float:left;color:#ffffff;padding-left:2px;padding-right:2px;">'+this.carcode+'</span></div>'
						}
						var feature = new AG.MicMap.Feature(geometry,null,style);
						feature.id=this.carid;
						feature.attributes={"carcode":this.carcode}
						getLayer('car').vector.addFeatures(feature);
					})
					$("#la_car_num").html("("+re.carList.length+")");
				}
				
				window.setTimeout(loadGpsLayer,interval);
			})
		}
		//积水点监测
		function loadJsdLayer(){
			if(document.getElementById("jsdLayer").checked){
				$w.doUrl(ctx+"/gzps/fljk/FljkService@queryNewTimeData.page?pro_type=jsd",{},function(re){
					$(re.datas).each(function(){
						var value="";
						for(i=0;i<this.itemList.length;i++){
							value=this.itemList[i].d_value+this.itemList[i].unit;
						}
						if(value!="")
						getMap().setDivValue("jsd"+this.code,'<span style="float:left">-</span><span style="background:#0082FF;float:left;color:#ffffff;padding-left:2px;padding-right:2px;">'+value+'</span>');
					})
				});
			}
			window.setTimeout(loadJsdLayer,interval);
		}
		function car_dw(id){
			var layer=frames['mapFrame'].carLayer;
			var feature=layer.getFeatureById(id);
			if(feature){
				var geometry = feature.geometry;
				var param = {
				    x : geometry.x,
				    y : geometry.y,
				    title :feature.attributes.username,
				    context : '<iframe width="230" height="120" src="'+ctx+'/gzps/yjdd/tip.jsp?id='+id+'&type=car" frameborder="0"></iframe>',
				    allShow : false
				}
				getGisObject().toolbar.setCenter(geometry.x,geometry.y);
				var infowindow = getGisObject().mapcontrol.showInfowindow(param);
			}else
				window.parent.$w.infoMsg("没有找到GPS信号!");
		}
		
		function loadok(){
// 			window.parent.hideShield();
		}
		
		function user_dw(id){
			var layer=frames['mapFrame'].userLayer;
			var feature=layer.getFeatureById(id);
			if(feature){
				var geometry = feature.geometry;
				var param = {
				    x : geometry.x,
				    y : geometry.y,
				    title :feature.attributes.username,
				    context : '<iframe width="230" height="120" src="'+ctx+'/gzps/yjdd/tip.jsp?x='+geometry.x+'&y='+geometry.y+'&id='+id+'&type=user" frameborder="0"></iframe>',
				    allShow : false
				}
				getGisObject().toolbar.setCenter(geometry.x,geometry.y);
				var infowindow = getGisObject().mapcontrol.showInfowindow(param);
			}else
				window.parent.$w.infoMsg("没有找到GPS信号!");
		}
	function getGisObject(){
		return window.frames["mapFrame"].getGisObject();
	}
	function getMap(){
		return window.frames["mapFrame"];
	}
	function showhideLayer(type,obj){
		getLayer(type).vector.setVisibility(obj.checked);
	}
	function showSendSms(uid,uname){
		var u="",un="";
		if(uid)u=uid;
		if(uname)un=uname;
		window.parent.$w.openDialog({title:'发送短信通知',url:ctx+"/gzps/yjdd/sendSms.jsp?userid="+u+"&username="+encodeURIComponent(un),w:400,h:430});
	}
	function getLayer(type){
		for(i=0;i<layers.length;i++){
			if(layers[i].id==type)
			return layers[i];
		}
	}
	function clearMap(){
		getGisObject().toolbar.clear();
		clearGpsVector();
	}
	function clearGpsVector(){
		if(gpsvector)
			gpsvector.removeAllFeatures();
	}
	function loadRight(url){
		document.getElementById("pan_right_frame").src=url;
	}
	function huif(){
		if($("[name='curPanId']").val()!="")
			window.parent.addMisTab('应急回放',ctx+"/gzps/yjdd/pan/playbackMain.jsp?panid="+$("[name='curPanId']").val(),ctx+"/resources/images/icons/16_16/plugin.png");
		else
			window.parent.$w.openDialog({title:'选择应急预案',url:ctx+"/gzps/yjdd/PanPage@panSelList.page",w:700,h:430});
	}
	</script>
  </head>
  
  <body class="easyui-layout">
    <div data-options="region:'center',split:false,border:false">
    	<input id="curPanId" name="curPanId" type="hidden">
    	<div class="easyui-layout" fit="true">
    		<div data-options="region:'center',split:false,border:false" style="overflow:hidden">
    			<iframe id="mapFrame" name="mapFrame" src="" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
    		</div>
    		<div data-options="region:'south',split:true,border:true" style="height:110px;">
    			<table width="100%" height="100%" cellpadding="0" cellspacing="0">
    			<tr>
    				<td width="23" bgcolor="#D1E1F8" align="center" valign="top" style="padding-top:15px">图层列表</td>
    				<td width="110" valign="top">
						<table cellpadding="2" cellspacing="2">
						<tr><td height="20"><input type="checkbox" name="yjLayer" id="jsdLayer" value="jsd" checked="checked" onclick="showhideLayer('jsd',this)"></td><td><img src="<%=path %>/gzps/fljk/img/layer_sw_jsd.png" width="12" height="12"></td><td>积水点<span id="la_jsd_num"></span></td></tr>
						<tr><td height="20"><input type="checkbox" name="yjLayer" id="carLayer" value="car" checked="checked" onclick="showhideLayer('car',this)"></td><td><img src="<%=path %>/gzps/yjdd/img/busstation.png" width="12" height="12"></td><td>应急车辆<span id="la_car_num"></span></td></tr>
						<tr><td height="20"><input type="checkbox" name="yjLayer" id="userLayer" value="user" checked="checked" onclick="showhideLayer('user',this)"></td><td><img src="<%=path %>/resources/images/icons/16_16/user_comment.png" width="12" height="12"></td><td>应急人员<span id="la_user_num"></span></td></tr>
						</tr>
						</table>
					</td>
    				<td width="23" bgcolor="#D1E1F8" align="center" valign="top" style="padding-top:15px">应急事件</td>
    				<td valign="top">
						<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:false">
			      		<thead>
							<tr class="ui_th">
								<th style="padding-left:2px">事件名称</th>
				    			<th style="padding-left:2px">上报时间</th>
				    			<th style="padding-left:2px">上报人</th>
				    			<th style="padding-left:2px">状态</th>
				    			<th width="16" title="更多应急事件" style="cursor:pointer" onclick="window.parent.addMisTab('应急事件处理','<%=path %>/myps/yjdd/ProblemPage@showNoDealList.page?form.type=1');">>></th>
							</tr>
						</thead>
						<tbody> 
			     		<w:iterate id="info" bind="#problemList">
			     			<tr class="ui_td">
			     				<td style="padding-left:2px;"><a href="javascript:window.parent.addMisTab('应急事件处理','<%=path %>/myps/yjdd/ProblemPage@showProblem.page?id=<w:write bind="#info.ID"/>');">
			     				<w:write bind="#info.MATTERS"/></a></td>
			     				<td><w:write bind="#info.UPLOADTIME" format="yyyy-MM-dd"/></td>                                  
			     				<td><w:write bind="#info.USERNAME"/></td>
			     				<td><w:write bind="#info.stateName"/></td>
			     				<td></td>
			     			</tr>
			     			</tr>
			     		</w:iterate>
						</tbody>
			     	</table>
					</td>
    			</tr>
    			</table>
    		</div>
    	</div>
    </div>
    <div data-options="region:'east',split:true,border:true,iconUrl:'<%=path %>/resources/images/icons/16_16/brick.png',tools:'#panTool'" style="width:303px;overflow:hidden" title="应急预案">
     	<div class="easyui-panel border_bottom_Cls" data-options="doSize:false,layoutH:55,border:false" style="overflow:hidden">
     		<iframe id="pan_right_frame" name="pan_right_frame" src="<%=path %>/gzps/yjdd/YjddPage@showRight.page" frameborder="0" width="100%" height="100%"></iframe>
      	</div>
      	<div class="easyui-panel" data-options="border:false,iconUrl:'<%=path %>/resources/images/icons/16_16/application_go.png'" title="快捷通道" style="padding-left:1px;padding-top:3px;">
	      	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-aa" onclick="startPan()">启动预案</a>&nbsp;<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-bb" onclick="huif()">应急回放</a>&nbsp;
<!-- 	      	<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-cc" onclick="showSendSms()">发布通知</a> -->
	      </div>
    </div>
    <div id="panTool">
    	<span onclick="paninfoList()" style="cursor:pointer" onmouseover="$(this).css('text-decoration','underline')" onmouseout="$(this).css('text-decoration','none')">预案管理</span>
	</div>
  </body>
</html>
