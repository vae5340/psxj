<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/adsfw/taglibs.jsp"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  	<link rel="stylesheet" type="text/css" href="${ctx}/UI/easyui-1.3.3/themes/default/easyui.css"/>
	<link rel="stylesheet" type="text/css" href="${ctx}/UI/style/default/css.css"/>
	<link rel="stylesheet" type="text/css" href="${ctx}/UI/easyui-1.3.3/themes/icon.css"/>
	<script type="text/javascript" src="${ctx}/util/js/jquery.js"></script>
	<script type="text/javascript" src="${ctx}/UI/easyui-1.3.3/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="${ctx}/UI/easyui-1.3.3/locale/easyui-lang-zh_CN.js" charset="utf-8"></script>
	<script type="text/javascript">
		$(function(){
			changeNum();
		})
		var psTimer;
		function changeNum(){
			if(psTimer){
				window.clearInterval(psTimer);   
			}
		
			psTimer=window.setInterval(function(){
				$("#swj1").html(GetRandomNum(10,0.10)); 
				$("#swj2").html(GetRandomNum(10,0.10));
				$("#swj3").html(GetRandomNum(10,0.10));
				$("#swj4").html(GetRandomNum(10,0.10));
				$("#swj5").html(GetRandomNum(10,0.10));
				$("#swj6").html(GetRandomNum(1000,1500));    
				changeNum();
			},5000);
		}
		
		function GetRandomNum(Min,Max){   
			var Range = Max - Min;   
			var Rand = Math.random();   
			return((Min + (Rand * Range)).toFixed(2));   
		} 
	</script>
  </head>
  <body style="overflow:scroll;overflow-y:hidden"> 
	<div>
<!--		<div style="z-index:999999;position:absolute;top:300px;left:300px">aaaaa</div>-->
		<div  style="z-index:999999;position:absolute;top:29px;left:205px;width:150px;height:55px;border:1px solid #DEDEDE">
	        <table width="150" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">超声波水位计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span>LT101-1 : <span id="swj1">0.80</span></span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    <div  style="z-index:9999999;position:absolute;top:88px;left:205px;width:150px;height:55px;border:1px solid #DEDEDE">
	        <table width="150" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">超声波水位计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span>LT101-2 : <span id="swj2">1.20</span></span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    
	    <div  style="z-index:9999999;position:absolute;top:365px;left:390px;width:100px;height:45px;border:1px solid #DEDEDE">
	        <table width="100" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">超声波水位计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span>LT101-4 : <span id="swj3">9.05</span></span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    <div  style="z-index:9999999;position:absolute;top:365px;left:280px;width:100px;height:45px;border:1px solid #DEDEDE">
	        <table width="100" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">超声波水位计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span>LT101-3 : <span id="swj4">0.02</span></span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    <div  style="z-index:9999999;position:absolute;top:170px;left:535px;width:100px;height:45px;border:1px solid #DEDEDE">
	        <table width="100" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">超声波水位计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span>LT102 : <span id="swj5">2.91</span></span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    
	    <div  style="z-index:9999999;position:absolute;top:210px;left:800px;width:100px;height:45px;border:1px solid #DEDEDE">
	        <table width="100" cellpadding="0" cellspacing="0">
	        	<tr style="background-color: #EDEDED;line-height: 30px;">
	        		<td align="center">不满管流量计</td>
	        	</tr>
	        	<tr>
	        		<td align="center">
	        			<span id="swj6">1318.6</span>
	        		</td>
	        	</tr>
	        </table>
	    </div>
	    
	    <div>
		    <div class="easyui-tabs" data-options="tabWidth:150" style="width:250px;height:110px;z-index:9999999;position:absolute;top:295px;left:698px;border:1px solid #DEDEDE">
				<div title="潜水泵P1" style="padding:10px">
					
				</div>
				<div title="潜水泵P2" style="padding:10px">
					
				</div>
			</div>
			<div class="easyui-panel" data-options="doSize:false" style="width:245px;height:45px;z-index:9999999;position:absolute;top:359px;left:701px;border:1px solid #DEDEDE">
		  		<div style="float: left;margin-top:8px;">
		  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'">本地</a>
		  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'">手动</a>
		  		</div>
		  		<div style="float: left;margin-left:30px;">
			        <table border="0px;">
		  				<tr>
		  					<td width="30px;"><img src="<%=path%>/gzps/yjdd/popup/img/sz.png"  style="cursor:hand" /></td>
		  					<td width="30px;"><img src="<%=path%>/gzps/yjdd/popup/img/zc.png" style="cursor:hand"/></td>
		  					<td width="30px;"><img src="<%=path%>/gzps/yjdd/popup/img/hz.png" style="cursor:hand"/></td>
		  				</tr>
		  				<tr>
		  					<td style="cursor:hand">停止</td>
		  					<td style="cursor:hand">正常</td>
		  					<td style="cursor:hand">合闸</td>
		  				</tr>
		  			</table>	
		        </div>
		    </div>
	    </div>
		<img src="<%=path%>/gzps/yjdd/popup/img/nsbz1.png" style="z-index: -99999;width:100%;height:100%;">
	 </div>
  </body>
</html>
