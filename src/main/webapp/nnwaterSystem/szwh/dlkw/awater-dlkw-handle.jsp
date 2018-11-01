<%@ page language="java"  pageEncoding="utf-8"%>
<%@ taglib prefix="wf" uri="/augurit-wf"%>
<%@ include file="/adsfw/taglibs.jsp"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%
String basePath = request.getScheme() + "://"
		+ request.getServerName() + ":" + request.getServerPort();
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
<script src="${ctx}/resources/js/aos/ext_ux/BasicGrid.js" type="text/javascript"></script>
	<script src="${ctx}/resources/js/aos/ext_ux/CrudGrid.js" type="text/javascript"></script>
	<script src="${ctx}/resources/js/aos/ext_ux/PageSizePlugin.js" type="text/javascript"></script>

<script type="text/javascript">
function writeJudgment(index) {
		    var divid = '';
		    switch(index) {
		        case 'A': divid = 'xksh'; break;
		        case 'B': divid = 'xksp'; break;
		    }
		    var divobj = document.getElementById(divid);
		    if (divid == '' || !divobj) {
		        alert('参数错误！');
		        return;
		    }
		   
		    var win = new Ext.ux.wf.WfOpinionWin({
		        taskInstanceId: Ext.getCmp('WF_TOOLBAR').taskInstanceId
		    }); 
		  
		    win.show();
		    win.on('complete', function (opinion) {
		        divobj.innerHTML = opinion + '<br><br>${CurrUserName}&nbsp;&nbsp;'+getDate();
		    });
		}
		function getDate() {
			var date = new Date();
			return date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
					+ date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
					+ ":" + date.getSeconds();
		}
</script>
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
<form  method="post">
	<!---------------- 隐藏域区域 开始 ----------------->
	<input type="hidden" name="id" value="${id}" />
	<!---------------- 隐藏域区域 结束 ----------------->

    <!---------------- 标题栏 开始 ----------------->
	<table class="tb_custom" border="0" align="center" bordercolor="#000000" style="width:660px;">
			<td style="width:660px;" align="center" colspan="2">
			&nbsp;
			</td>
		</tr>
		<tr>
			<td style="width:660px;" align="center" colspan="2">
				<span style="font-size:16px;text-align:center;font-weight:bold;">临时占用、挖掘城市道路审批表</span>
			</td>
		</tr>
		<tr>
			<td style="width:330px;" align="left">
				<span style="font-size:12px;text-align:right;padding-left:40px;" id="acceptNum">编号：</span>
			</td>
			<td style="width:330px;" align="right">
<span style="font-size:12px;text-align:right;padding-right:30px;">占（挖）证号:</span>
			</td>
		</tr>
	</table>
	
	<!---------------- 标题栏 结束 ----------------->	
	
	<!---------------- 业务表单 开始 ----------------->
	<table class="tb_custom" border="1" align="center" bordercolor="#000000" style="width:662px;">
		
		
		<tr >
		    <td class="center_td" align="left" width="30%" height="50" >公安交通部门意见</td>
		    <td class="center_td" align="left"  width="70%" rowspan="4">
		    <iframe frameborder="0" scrolling="no" style="width:463px;height:500px" src="<%=baseServer %>agcom_nn/servlet/LoginByCasServlet?userName=admin"></iframe>
		    </td>
		</tr>
		<tr height="200">
		    <td class="center_td" align="left" width="30%" >
		       <table width="100%" border="0" height="90">
					<tr>
						<td align="left" height="50">
							<span style="margin-left:5px;">
								<wf:opinion activities="xksh" name="opinions_dept"/>
								<div id="xksh"></div>&nbsp;
							</span>	
						</td>
					</tr>
					<tr>
						<td align="right" height="20">
							<wf:input type="button" name="bzsp_bn" id="bzsp_bn" value="填写意见" cssClass="tpl_ui_btn" onclick="writeJudgment('A');" />
						</td>
					</tr>
				</table>
		    
		    </td>
		</tr>
		<tr height="50">
		    <td class="center_td" align="left" width="30%" >市政主管部门意见</td>
		</tr>
		<tr height="200">
		    <td class="center_td" align="left" width="30%" >
		       <table border="0" width="100%" height="90">
					<tr>
						<td align="left" height="50">
							<span style="margin-left:5px;">
								<wf:opinion activities="xksp" name="opinions_dept"/>
								<div id="xksp"></div>&nbsp;
							</span>	
						</td>
					</tr>
					<tr>
						<td align="right" height="20">
							<wf:input type="button" name="zgsp_bn" id="zgsp_bn" value="填写意见" cssClass="tpl_ui_btn" onclick="writeJudgment('B');" />
						</td>
					</tr>
				</table>
		    </td>
		</tr>
	</table>
	<table height="10"><tr><td></td></tr></table>
	<!---------------- 业务表单 结束 -------------------->
	
</form>

</body>
</html>