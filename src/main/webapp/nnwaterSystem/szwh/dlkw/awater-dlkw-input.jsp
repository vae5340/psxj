<%@ page language="java"  pageEncoding="utf-8"%>
<%@ taglib prefix="wf" uri="/augurit-wf"%>
<%@ include file="/adsfw/taglibs.jsp"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%
String baseServer=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">





<head>
<title></title>
	
	<%@ include file="/adsfw/meta.jsp"%>
	
	<!-- 引入基础的JS和CSS文件 -->	
	<script src="${ctx}/resources/js/jquery/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/resources/js/jquery/form/jquery.form.js" type="text/javascript"></script>
	<script src="${ctx}/adswf/engine/public/MasterFormSubmit4Iframe.js" type="text/javascript"></script>

	<script src="${ctx}/awaterdrain/dlkw/js/AwaterDlkw.js" type="text/javascript"></script>

  <style type="text/css">
        .center_td{
        	text-align: center;
        }
        .left_td{
        	text-align: center;
        }
        .right_td{
        }
        body{
			color:#000000;
		}
		.text_border{
			border-width: 0px 0px 1px 0px;
			border-color:#000000;
		}
		.bn_css{
			display:none;
		}
    </style>
</head>

<body topmargin="0">
<form  method="post" >
	<!---------------- 隐藏域区域 开始 ----------------->
	<input type="hidden" name="id" value="" />
	<input type="hidden" name="coor" value="" id="coor" />
	<!---------------- 隐藏域区域 结束 ----------------->

    <!---------------- 标题栏 开始 ----------------->
	<table class="tb_custom" border="0" align="center" bordercolor="#000000" style="width:660px;">
			<td style="width:660px;" align="center" colspan="2">
			&nbsp;
			</td>
		</tr>
		<tr>
			<td style="width:660px;" align="center" colspan="2">
				<span style="font-size:16px;text-align:center;font-weight:bold;">临时占用、挖掘城市道路申请表</span>
			</td>
		</tr>
		<tr>
			<td style="width:330px;" align="left">
				<span style="font-size:12px;text-align:right;padding-left:40px;" id="acceptNum">编号：</span>
			</td>
			<td style="width:330px;" align="right">
<!-- <span style="font-size:12px;text-align:right;padding-right:30px;">占（挖）证号:</span> -->

<button onclick="inputdata()">快速输入</button>
			</td>
		</tr>
	</table>
	
	<!---------------- 标题栏 结束 ----------------->	
	
	<!---------------- 业务表单 开始 ----------------->
	<table class="tb_custom" border="1" align="center" bordercolor="#000000" style="width:662px;">
		<tr height="30">
		     <td class="center_td" align="left"  >申请单位</td>
		     <td class="right_td">
		        <wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="unitName" value="" id="unitName" />
		     </td>
		     <td class="center_td" align="right"  >规划许可证号</td>
		     <td class="right_td">
		       	<wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="fileName" value="" id="fileName" />
		     </td>
		</tr>
		 <tr height="30">
		   <td class="center_td" align="left"  >用 途 原 因</td>
		     <td class="right_td">
		        <wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="itemName" value="" id="itemName" />
		     </td>
		     <td class="center_td" align="right"  >联系人</td>
		     <td class="right_td">
		       	<wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="unitContacts" value="" id="unitContacts" />
		     </td>
		</tr>
		<tr height="30">
		   <td class="center_td" align="left"  >占用、挖掘地点</td>
		     <td class="right_td">
		        <wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="itemAddr" value="" id="itemAddr" />
		     </td>
		     <td class="center_td" align="right"  >电  话</td>
		     <td class="right_td">
		       	<wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="unitContactsTel" value="" id="unitContactsTel" />
		     </td>
		</tr>   
		<tr height="30">
		   <td class="center_td" align="left"  >路面类别</td>
		     <td class="right_td">
		        <wf:input type="text" style="width: 190px;margin-left:5px;margin-right:5px;border-width:0;" size="30" name="itemType" value="" id="itemType" />
		     </td>
		     <td class="center_td" align="right"  >申请日期</td>
		     <td class="right_td">
		     <wf:datetime type="text" onfocus="WdatePicker({skin:'ext', dateFmt:'yyyy年MM月dd日', lang: 'zh-cn'})" cssClass="xx-input-style6" format="yyyy年MM月dd日" name="createDate" id="createDate" value="createDate"></wf:datetime>

		     </td>
		</tr>  
		<tr height="30">
		   <td class="center_td" align="left" >申请占用起止日期</td>
		     <td class="right_td" colspan="6">
		        <wf:datetime type="text" onfocus="WdatePicker({skin:'ext', dateFmt:'yyyy年MM月dd日', lang: 'zh-cn'})" cssClass="xx-input-style6" format="yyyy年MM月dd日" name="startDate" id="startDate" value="startDate"></wf:datetime>至
		        <wf:datetime type="text" onfocus="WdatePicker({skin:'ext', dateFmt:'yyyy年MM月dd日', lang: 'zh-cn'})" cssClass="xx-input-style6" format="yyyy年MM月dd日" name="endDate" id="endDate" value="endDate"></wf:datetime>
		     </td>
		</tr> 
		
		<tr height="30">
		   <td class="center_td" align="left" >许可占用起止日期</td>
		     <td class="right_td" colspan="6">
		        <wf:datetime type="text" onfocus="WdatePicker({skin:'ext', dateFmt:'yyyy年MM月dd日', lang: 'zh-cn'})" cssClass="xx-input-style6" format="yyyy年MM月dd日" name="startDateSp" id="startDateSp" value="startDateSp"></wf:datetime>至
		        <wf:datetime type="text" onfocus="WdatePicker({skin:'ext', dateFmt:'yyyy年MM月dd日', lang: 'zh-cn'})" cssClass="xx-input-style6" format="yyyy年MM月dd日" name="endDateSp" id="endDateSp" value="endDateSp"></wf:datetime>
		     </td>
		</tr>
		
	
	
</form>
<tr height="30">
		   <td class="center_td" align="left" colspan="8">开挖范围示意图</td>
		</tr>
		<tr height="350">
		  <td  colspan="8">
		     <iframe frameborder="0" style="width:100%;height:350px;" src="<%=baseServer %>agcom_nn/servlet/LoginByCasServlet?userName=admin"></iframe>
		  </td>
		</tr>
	</table>
	<table height="10"><tr><td></td></tr></table>
	<!---------------- 业务表单 结束 -------------------->
</body>
</html>