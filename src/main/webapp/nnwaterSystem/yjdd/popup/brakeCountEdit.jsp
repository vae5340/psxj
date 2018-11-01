<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib uri="/WEB-INF/page-base.tld" prefix="w"%>

<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/adsfw/taglibs.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  	<%@ include file="/adsfw/meta_ext3.jsp"%>
  
	<link rel="stylesheet" type="text/css" href="${ctx}/UI/easyui-1.3.3/themes/default/easyui.css"/>
	<link rel="stylesheet" type="text/css" href="${ctx}/UI/style/default/css.css"/>
	<link rel="stylesheet" type="text/css" href="${ctx}/UI/easyui-1.3.3/themes/icon.css"/>
	<script type="text/javascript" src="${ctx}/util/js/jquery.js"></script>
	<script type="text/javascript" src="${ctx}/UI/easyui-1.3.3/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="${ctx}/UI/easyui-1.3.3/locale/easyui-lang-zh_CN.js" charset="utf-8"></script>
	
	<script src="<%=path %>/gzps/yjdd/popup/highchart4.1.9/highcharts.js"></script>
	<script src="<%=path %>/gzps/fljk/highchart/js/modules/exporting.js"></script>
	<script src="<%=path %>/gzps/fljk/complex/js/HighchartsSet.js"></script>
	
	
	<script  type="text/javascript">
		var result;
		$(function(){
			showPumpInfo(0);
			showChart(300,500,389,548,496); 
		})
		
		//获取随机数字
		function GetRandomNum(Min,Max){   
			var Range = Max - Min;   
			var Rand = Math.random();   
			return((Min + (Rand * Range)).toFixed(2));   
		} 
		
		//格式化日期
		Date.prototype.Format = function (fmt) { //author: meizz 
		    var o = {
		        "M+": this.getMonth() + 1, //月份 
		        "d+": this.getDate(), //日 
		        "h+": this.getHours(), //小时 
		        "m+": this.getMinutes(), //分 
		        "s+": this.getSeconds(), //秒 
		        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		        "S": this.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
		
		//显示泵信息
		var psTimer;
		function showPumpInfo(type){
			
			if(type==0){
				//获取显示几号泵
				$("#bpl").html(5689/100); 
				$("#buab").html(100*10);
				$("#bubc").html(52*10);
				$("#buca").html(87*10);
				$("#bua").html(68*10);
				$("#bub").html(32*10);
				$("#buc").html(45*10);
				$("#bia").html(125/10);
				$("#bib").html(57/10);
				$("#bic").html(45/10); 
				$("#bp").html(88);
				$("#bq").html(12);
				$("#glys").html(45/100);
				
				$("#scyxsj").html(100);
				$("#bcyxsj").html(120);
				$("#ljyxsj").html(300);
				
				$("#dqyxsj").html(new Date().Format("yyyy-MM-dd hh:mm:ss")); 
				showPumpInfo(1);
			}else{
				if(psTimer){
					window.clearInterval(psTimer);   
				}
				
				psTimer=window.setInterval(function(){
						$("#bpl").html(GetRandomNum(100,30)); 
						$("#buab").html(GetRandomNum(1000,900));
						$("#bubc").html(GetRandomNum(500,450));
						$("#buca").html(GetRandomNum(1000,800));
						$("#bua").html(GetRandomNum(600,500));
						$("#bub").html(GetRandomNum(300,200));
						$("#buc").html(GetRandomNum(500,300));
						$("#bia").html(GetRandomNum(50,10));
						$("#bib").html(GetRandomNum(10,5));
						$("#bic").html(GetRandomNum(10,5)); 
						$("#bp").html(GetRandomNum(100,50));
						$("#bq").html(GetRandomNum(15,5));
						$("#glys").html(45/100);
						
						$("#scyxsj").html(106);
						$("#bcyxsj").html(139);
						$("#ljyxsj").html(181);
						
						$("#dqyxsj").html(new Date().Format("yyyy-MM-dd hh:mm:ss")); 
						showPumpInfo(1); 
				},5000);
			}
			
		}
		
		//运行时间统计图表
		function showChart(b1,b2,b3,b4,b5){
				$('#container').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: '本月累计运行时间'   
		        },
		        xAxis: {
		            categories: [
		                '1号泵',
		                '2号泵',
		                '3号泵',
		                '4号泵',
		                '5号泵'
		            ]
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: 'H'
		            }
		        },
		        tooltip: {
		            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                '<td style="padding:0"><b>{point.y:.1f} H</b></td></tr>',
		            footerFormat: '</table>',
		            shared: true,
		            useHTML: true
		        },
		        plotOptions: {
		            column: {
		                pointPadding: 0.2,
		                borderWidth: 0
		            }
		        },
		        series: [{
		            name: '本月累计运行时间', 
		            data: [b1,b2,b3,b4,b5]
		
		        }]
		    });
		}
	</script>
  </head>
   <body> 
  		<div class="easyui-layout" fit="true" style="background-color: #f4f0e0">
			<table>
				<tr>
					<td>
				  	   <div style="float: left;">
						  	<div class="easyui-tabs" data-options="tabWidth:112" style="width:512px;height:250px;margin-top: 10px;margin-left: 3px;">
									<div title="泵闸在线监测基本信息" style="padding:10px">
									<table cellspacing="0px;" border="1" bordercolor="#EBEBEB"  style="width: 480px;border-collapse:collapse; line-height: 25px;text-align: center;">
						            	<tr>
						            		<td colspan="3">
						            			运行电流电压
						            		</td>
						            		<td colspan="3">
						            			运行时间统计
						            		</td>
						            	</tr>
						            	<tbody style="background-color: #F2F2F2;">
						            		<th width="20%;" style="text-align: center;">参数项</th>
						            		<th width="15%"  style="text-align: center;">值</th>
						            		<th width="10%;" style="text-align: center;" >单位</th>
						            		<th width="25%;" style="text-align: center;">参数项</th>
						            		<th width="15%"  style="text-align: center;">值</th>
						            		<th width="10%;" style="text-align: center;" >单位</th>
						            	</tbody>
						            	<tr>
						            		<td>泵频率</td>
						            		<td><div id="bpl"></div></td>
						            		<td>HZ</td>
						            		<td>上次运行时间</td>
						            		<td><div id="scyxsj"></div></td>
						            		<td>Min</td>
						            	</tr>
						            	<tr>
						            		<td>泵Uab</td>
						            		<td><div id="buab"></div></td>
						            		<td>V</td>
						            		<td>本次运行时间</td>
						            		<td><div id="bcyxsj"></div></td>
						            		<td>Min</td>
						            	</tr>
						            	<tr>
						            		<td>泵Ubc</td>
						            		<td><div id="bubc"></div></td>
						            		<td>V</td>
						            		<td>累计运行时间</td>
						            		<td><div id="ljyxsj"></div></td>
						            		<td>H</td>
						            	</tr>
						            	<tr>
						            		<td>泵Uca</td>
						            		<td><div id="buca"></div></td>
						            		<td>V</td>
						            		<td colspan="3" rowspan="11"></td>
						            	</tr>
						            	<tr>
						            		<td>泵Ua</td>
						            		<td><div id="bua"></div></td>
						            		<td>V</td>
						            	</tr>
						            	<tr>
						            		<td>泵Ub</td>
						            		<td><div id="bub"></div></td>
						            		<td>V</td>
						            	</tr>
						            	<tr>
						            		<td>泵Uc</td>
						            		<td><div id="buc"></div></td>
						            		<td>V</td>
						            	</tr>
						            	<tr>
						            		<td>泵Ia</td>
						            		<td><div id="bia"></div></td>
						            		<td>A</td>
						            	</tr>
						            	<tr>
						            		<td>泵Ib</td>
						            		<td><div id="bib"></div></td>
						            		<td>A</td>
						            	</tr>
						            	<tr>
						            		<td>泵Ic</td>
						            		<td><div id="bic"></div></td>
						            		<td>A</td>
						            	</tr>
						            	<tr>
						            		<td>泵P</td>
						            		<td><div id="bp"></div></td>
						            		<td>1w</td>
						            	</tr>
						            	<tr>
						            		<td>泵Q</td>
						            		<td><div id="bq"></div></td>
						            		<td>1w</td>
						            	</tr>
						            	<tr>
						            		<td>功率因数</td>
						            		<td><div id="glys"></div></td>
						            		<td></td>
						            	</tr>
						            	<tr>
						            		<td>数据更新时间</td>
						            		<td colspan="2"><div id="dqyxsj"></div></td>
						            	</tr>
						            </table>
						            </div>
							</div>
						  	<div class="easyui-panel" data-options="doSize:false" style="width:510px;height:40px;margin-left: 3px;border-top:0px;"">
						  		<div style="float: left;">
						  			<font style="font-weight:bold;">泵组</font>&nbsp;&nbsp;
						  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'" style="margin-top: 10px;" onclick="showPumpInfo(1)" >1号泵</a>
						  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'" onclick="showPumpInfo(2)" >2号泵</a>
						  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'" onclick="showPumpInfo(3)" >3号泵</a>
						  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'" onclick="showPumpInfo(4)" >4号泵</a>
						  			 <a href="#" class="easyui-linkbutton" data-options="toggle:true,group:'g1'" onclick="showPumpInfo(5)" >5号泵</a>
						  		</div>
						  		<div style="float: left;margin-left: 40px;margin-top: 5px;">
						  			<table border="0px;">
						  				<tr>
						  					<td width="40px;"><img src="<%=path%>/gzps/yjdd/popup/img/refresh.png" style="cursor:hand" alt="刷新" onclick="showData()" /></td>
						  				</tr>
						  			</table>	
						        </div>
						    </div> 
					    </div>
					    
					    <div style="float: left;margin-top: 10px;margin-left: 5px;">   
						    <div class="easyui-tabs" style="width:310px;height:290px;">
						    	<div  title="当月累计运行时间统计图表">
						    		<div id="container" style="min-width:290px;height:250px"></div>
						    	</div>
						    </div>
					    </div>
					     
					 </td>
				</tr>
				<tr>
					<td>
						<img src="<%=path%>/gzps/yjdd/popup/img/bz.png" style="margin-top: 55px;"/>
					</td>
				</tr>
			</table>
			
		</div>
  </body>
  </html>
