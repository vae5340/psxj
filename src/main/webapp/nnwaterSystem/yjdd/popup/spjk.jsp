<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    request.setAttribute("ctx", basePath);
    %>
    <title>监测项管理</title>
     <link href="themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
    <script src="js/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="js/swfobject.js" type="text/javascript"></script>
	<style>
	.iconsp{background:url(img/shipin.png) no-repeat}
	.shipdiv{float:left;margin:4px;width:100%;}
	.shipdiv #title{width:100%;height:23px;line-height:23px;float:left;background:#D3E0F1;border:1px solid #95B8E7;font-weight:bold;padding-left:2px;}
	.shipdiv .title{float:left}
	.shipdiv .icon{float:right;padding-right:3px;background:url(img/full.png) no-repeat;width:16px;height:16px;cursor:pointer}
	.spdiv{ width:100%;height:100%;}
	</style>
  </head>
  <script type="text/javascript">
      function checkHandler(node, checked) {
          var id = 'ply' + $(node).attr("id");
          if (checked) {
              if (!$("#" + id)[0]) {
                  $("<div id='" + id + "' class='shipdiv'><div id='title'><span class='title'>" + node.text + "</span><span class='icon' title='放大播放' onclick=\"fullplay('" + $(node).attr("id") + "','" + node.text + "')\"></span></div><div id='" + id + "_obj' style='width:100%'></div></div>").appendTo($("#container" + $(node).attr("id")));
                  var s1 = new SWFObject("ply/player.swf", "ply", "100%", "176", "9", "red");
                  s1.addParam("allowfullscreen", "false");
                  s1.addParam("allowscriptaccess", "always");
                  s1.addParam("flashvars", "file=${ctx}gzps/yjdd/popup/ply/a" + $(node).attr("id") + ".flv&image=preview.jpg&autostart=true");
                  s1.write(id + "_obj");
              }
          } else {
              $("#" + id).remove();
          }
      }
  </script>
<body onload="">


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
 		<td width="32%" height="50%"><div id="container1" class="spdiv"></div></td>
        <td width="32%" height="50%"><div id="container2" class="spdiv"></div></td>
        <td width="32%" height="50%"><div id="container3" class="spdiv"></div></td>
 	</tr>
 	<tr>
 		<td width="32%" height="50%"><div id="container4" class="spdiv"></div></td>
        <td width="32%" height="50%"><div id="container5" class="spdiv"></div></td>
        <td width="32%" height="50%"><div id="container6" class="spdiv"></div></td>
 	</tr>
 </table>

</div>
</div>

  </body>
</html>
