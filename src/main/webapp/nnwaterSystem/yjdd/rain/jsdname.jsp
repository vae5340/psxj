<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<script>
function jsdname_ok(){
	$w.closeCurrWin($getByName("aaarain",$w.currWin()).val());
}
</script>
<div style="margin-top:7px;">
&nbsp;请输入内涝点名称
</div>
<div style="text-align:center">
<input name="aaarain" style="width:220px;">
</div>
<div style="text-align:center;margin-top:7px;">
<input type="button" value=" 确定 " onclick="jsdname_ok()">&nbsp;<input type="button" value="重新选择" onclick="$w.closeCurrWin();rain_cc()">
&nbsp;<input type="button" value=" 取消 " onclick="$w.closeCurrWin()">
</div>