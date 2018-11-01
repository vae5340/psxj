<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>
<%
String path = request.getContextPath();
%>
<script>
function rain_cc(){
	showGisTab();
	var GisObject=GisFrame.getGisObject();
	GisObject.toolbar.clear();
	GisObject.toolbar.setMouseCursor(6);
	GisObject.map.events.on({
	    'click' : rain_ccclick,
	    scope : this
	})
}
function rain_ccclick(evt){
	var GisObject=GisFrame.getGisObject();
	var lonlat=GisObject.toolbar.getLonLatFromViewPortPx(evt.xy.x,evt.xy.y);
	GisObject.map.events.un({
	    'click' : rain_ccclick,
	    scope : this
	})
	GisObject.toolbar.clear();
	window.parent.$w.openDialog({title:'自定义内涝点',url:ctx+"/gzps/yjdd/rain/jsdname.jsp",w:250,h:140,afterClose:function(re){
		if(re){
			var s=$getByName("form.waterloggingId",$w.currWin()).get(0);
			s.options[0].text=re;
			s.selectedIndex=0;
			$getByName("form.x",$w.currWin()).val(lonlat[0]);
			$getByName("form.y",$w.currWin()).val(lonlat[1]);
		}
	}});
}
function rain_ok(){
	try{
		GisObject.map.events.un({
		    'click' : rain_ccclick
		})
	}catch(e){}
	var s=$getByName("form.waterloggingId",$w.currWin()).get(0);
	$getByName("form.waterloggingName",$w.currWin()).val(s.options[s.selectedIndex].text);
	$w.doWinForm();
}
</script>
<div class="easyui-panel" data-options="doSize:false,layoutH:45,border:false" style="margin:5px">
<form method="post" action="/gzps/yjdd/RainRescuePage@updaterain.page" enctype="multipart/form-data">
	<w:hidden bind="form.x"/>
	<w:hidden bind="form.y"/>
	<w:hidden bind="form.waterloggingName"/>
	<div class="ui-formContent">
		<p>
			<label style="width:80px">预警编号：</label>
			<w:text bind="form.warningNo" value="NO0983" style="width:210px"/>
		</p>
		<p>
			<label style="width:80px">内涝点：</label>
			<select name="form.waterloggingId"style="width:210px">
			<option value="" selected="selected">龙旺公寓</option>
			<w:options bind="" collection="#jsdlist"  value="value" text="text"/>
			</select>
			<input type="button" value="自定义" onclick="rain_cc()">
		</p>
		<p>
			<label style="width:80px">面积：</label>
			<w:text bind="bean.DEGREE_a" value="4.4" style="width:40px"/>长*<w:text value="3.2" bind="bean.DEGREE_b" style="width:40px"/>宽*<w:text value="5" bind="bean.DEGREE_c" style="width:40px"/>高
		</p>
		<p>
			<label style="width:80px">积水程度：</label>
			<w:text bind="form.waterDegree" value="严重影响交通"  style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">内涝原因：</label>
			<w:text bind="form.reason" value="排水口堵塞" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">抢险措施：</label>
			<w:text bind="form.measure" value="打扫排水口" style="width:250px"/>
		</p>
		<p>
			<label style="width:80px">开始时间：</label>
			<w:text bind="form.startTime" value="2016-04-04 10:42:33" style="width:210px" styleClass="easyui-datetimebox"/>
		</p>
		<p>
			<label style="width:80px">结束时间：</label>
			<w:text bind="form.endTime" value="2016-04-05 11:42:33" style="width:210px" styleClass="easyui-datetimebox"/>
		</p>
		<table>
		<tr>
		<td width="80" valign="top">现场照片：</td>
		<td><input type="file" name="file1" style="width:250px;">
			<input type="file" name="file2" style="width:250px;">
			<input type="file" name="file3" style="width:250px;"></td>
		</tr>
		</table>
	</div>
</form>
</div>
<div class="ui-buttonBar">
	<a href="#" class="easyui-linkbutton" iconCls="icon_save" onclick="rain_ok()">保 存</a>
	<a href="#" class="easyui-linkbutton" iconCls="icon_cancel" onclick="$w.closeCurrWin()">取 消</a>
</div>