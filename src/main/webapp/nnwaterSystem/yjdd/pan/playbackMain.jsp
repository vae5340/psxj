<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<%
String panid=request.getParameter("panid");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <%@ include file="/platform/style.jsp"%>
   <style>
   .linestart{background:url(<%=path %>/gzps/yjdd/img/icon06.gif) no-repeat 172px;height:69px;}
   .line{background:url(<%=path %>/gzps/yjdd/img/line04.gif) repeat-y 201px;}
   .line .left{width:190px;text-align:right}
   .line #line_left{margin-right:15px;font-size:18px;color:#1DB702;font-weight:bold}
   .line #line_right{background:url(<%=path %>/gzps/yjdd/img/icon07.gif) no-repeat left center;padding-left:30px;font-size:18px;}
   </style>
	<script>
	var backlist=new Array();
	var num=0;
	function addbacklist(time,name,content){
		var obj=new Object();
		obj.time=time;
		obj.name=name;
		obj.content=content;
		backlist[backlist.length]=obj;
	}
	function backplay(div){
		$("#"+div).append('<div class="linestart"></div>');
		playnext(div);
	}
	function playnext(div){
		if(num>=backlist.length)return;
		var base=$("#"+div);
		var line=$("<div class='line' style='height:2px;'></div>").appendTo(base);
		line.animate({"height": "+=50px"}, 600,null,function(){
			var line=$('<div class="line"><table><tr><td class="left"><span id="line_left">'+backlist[num].time+'</span></td><td><span id="line_right">'+backlist[num].name+'：'+backlist[num].content+'</span></td></tr></table></div>').appendTo(base);
			num++;
			var h=base.parent().get(0).scrollHeight;
			if(h>base.parent().height())
				base.parent().scrollTop(h+20);
			playnext(div);
		})
	}
	</script>
  </head>
  <body>
  	 <div class="easyui-panel" data-options="border:false,fit:true" title="应急预案事件回放">
     	<div class="easyui-tabs" data-options="tabPosition:'left',fit:true,border:false" id="panbacktab">
     		<div title="事件时间抽" data-options="href:'<%=path %>/gzps/yjdd/PanPage@panplaybackTime.page?id=<%=panid %>'"  style="overflow-y:scroll">
     		
     		</div>
     		<div title="事件列表" data-options="href:'<%=path %>/gzps/yjdd/PanPage@panplaybackList.page?id=<%=panid %>'"  style="overflow-y:scroll">
     			
     		</div>
     	</div>
     </div>
  </body>
</html>
