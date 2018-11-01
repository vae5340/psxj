<!DOCTYPE html>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	request.setAttribute("ctx", basePath);
%>
<html>
  <head>
		<title>监测项管理</title>
		<link href="/awater/lib/jquery-easyui-1.4.5/themes/default/easyui.css" rel="stylesheet" type="text/css" />
		<script src="js/swfobject.js" type="text/javascript"></script>
		<script src="/awater/lib/jquery.min.js?v=2.1.4"></script>
		<script src="/awater/lib/jquery-easyui-1.4.5/jquery.easyui.min.js" type="text/javascript" ></script>
		
		<style>
			.iconsp{background:url(img/shipin.png) no-repeat}
			.shipdiv{float:left;margin:4px;width:100%;}
			.shipdiv #title{width:100%;height:23px;line-height:23px;float:left;background:#D3E0F1;border:1px solid #95B8E7;font-weight:bold;padding-left:2px;}
			.shipdiv .title{float:left}
			.shipdiv .icon{float:right;padding-right:3px;background:url(img/full.png) no-repeat;width:16px;height:16px;cursor:pointer}
			.spdiv{ width:100%;height:100%;}
		</style>
		<script>
		  function checkHandler(node, checked) {
			  var id = 'ply' + $(node).attr("id");
			  if (checked) {
				  if (!$("#" + id)[0]) {
					  $("<div id='" + id + "' class='shipdiv'><div id='title'><span class='title'>" + node.text + "</span><span class='icon' title='放大播放' onclick=\"fullplay('" + $(node).attr("id") + "','" + node.text + "')\"></span></div><div id='" + id + "_obj' style='width:100%'></div></div>").appendTo($("#container" + $(node).attr("id")));
					  var s1 = new SWFObject("ply/player.swf", "ply", "100%", "176", "9", "red");
					  s1.addParam("allowfullscreen", "false");
					  s1.addParam("allowscriptaccess", "always");
					  s1.addParam("flashvars", "file=/awater/nnwaterSystem/popup/ply/a" + $(node).attr("id") + ".flv&image=img/preview.gif&autostart=true");
					  s1.write(id + "_obj");
				  }
			  } else {
				  $("#" + id).remove();
			  }
		  }
		</script>
	</head>
	<body>
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'west',split:true" title="排涝点" style="width:240px" id="main_menus">
				<ul class="easyui-tree" id="tree" data-options="checkbox:true,onCheck:checkHandler,onlyLeafCheck:true" >
					<li id="0">
						<span>排涝视频监控点</span>
						<ul>
							<li id="1" data-options="iconCls:'iconsp'"><span>大沙头南路</span></li>
							<li id="2" data-options="iconCls:'iconsp'"><span>人民大街北</span></li>
							<li id="3" data-options="iconCls:'iconsp'"><span>桥东路口</span></li>
							<li id="4" data-options="iconCls:'iconsp'"><span>人民大街东</span></li>
							<li id="5" data-options="iconCls:'iconsp'"><span>四通路桥下</span></li>
							<li id="6" data-options="iconCls:'iconsp'"><span>铁北二路路口</span></li>
						</ul>
					</li>
				</ul>
			</div>
			<div data-options="region:'center'">
				<table style="width:100%;height:100%;cellspacing:0,cellpadding:0,border:0">
					<tr>
						<td width="32%" height="50%"><div class="spdiv" id="container1"><div class="shipdiv" id="ply1"><div id="title"><span class="title">大沙头南路</span><span title="放大播放" class="icon" onclick="fullplay('1','大沙头南路')"></span></div><div id="ply1_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a1.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
						<td width="32%" height="50%"><div class="spdiv" id="container2"><div class="shipdiv" id="ply2"><div id="title"><span class="title">人民大街北</span><span title="放大播放" class="icon" onclick="fullplay('2','人民大街北')"></span></div><div id="ply2_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a2.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
						<td width="32%" height="50%"><div class="spdiv" id="container3"><div class="shipdiv" id="ply3"><div id="title"><span class="title">桥东路口</span><span title="放大播放" class="icon" onclick="fullplay('3','桥东路口')"></span></div><div id="ply3_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a3.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
					</tr>
					<tr>
						<td width="32%" height="50%"><div class="spdiv" id="container4"><div class="shipdiv" id="ply4"><div id="title"><span class="title">人民大街东</span><span title="放大播放" class="icon" onclick="fullplay('4','人民大街东')"></span></div><div id="ply4_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a4.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
						<td width="32%" height="50%"><div class="spdiv" id="container5"><div class="shipdiv" id="ply5"><div id="title"><span class="title">四通路桥下</span><span title="放大播放" class="icon" onclick="fullplay('5','四通路桥下')"></span></div><div id="ply5_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a5.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
						<td width="32%" height="50%"><div class="spdiv" id="container6"><div class="shipdiv" id="ply6"><div id="title"><span class="title">铁北二路路口</span><span title="放大播放" class="icon" onclick="fullplay('6','铁北二路路口')"></span></div><div id="ply6_obj" style="width: 100%;"><embed name="ply" width="100%" height="176" id="ply" src="ply/player.swf" type="application/x-shockwave-flash" flashvars="file=/awater/nnwaterSystem/popup/ply/a6.flv&amp;image=img/preview.gif&amp;autostart=true" allowscriptaccess="always" allowfullscreen="false" quality="high" bgcolor="red"></div></div></div></td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>
