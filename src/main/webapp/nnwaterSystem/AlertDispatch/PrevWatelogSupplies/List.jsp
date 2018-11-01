<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String name = request.getParameter("name");
String ownerdept = request.getParameter("ownerdept");
String address = request.getParameter("address");
String urladdress = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>防涝物资储备资料列表</title>
		<link href="/awater/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
	    <link href="/awater/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
	    <link href="/awater/css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
	    <link href="/awater/css/animate.min.css" rel="stylesheet">
	    <link href="/awater/css/augur.expand.css" rel="stylesheet" type="text/css"/>	
	    <script>
			function showPoint(){
				var frames=window.parent.window.document.getElementById("main"); 
				frames.contentWindow.getInfo(); 
			}	
		</script>
		<style>
			 body {height:80%;}
		</style>
	</head>
	<body style="background-color:white;">
	    <div class="animated fadeInRight">
			<div class="col-sm-12">
				<!-- Example Events -->
				<div id="toolbar">
					<button type="button" class="btn btn-w-m btn-primary" onclick="opennewlayer();">新增</button>
			        <button type="button" class="btn btn-w-m btn-info" onclick="openeditlayer();">修改</button>
			        <button type="button" class="btn btn-w-m btn-danger" onclick="opendellayer();">删除</button>
			    </div>
				<table id="table" 
						data-toggle="table"
						data-toolbar="#toolbar" 
						data-search="true" 
						data-show-refresh="true" 
						data-show-toggle="true" 
						data-show-columns="true" 
						data-show-export="true" 
						data-show-pagination-switch="true" 
						data-pagination="true" 
						data-page-list="[10, 25, 50, 100, ALL]" 
						data-click-to-select="true">
					<thead>
					
					<tr>
						<th data-field="id" data-checkbox="true"></th>
						<th data-field="name" data-align="center">名称</th>
						<th data-field="code" data-align="center">编号</th>
						<th data-field="model" data-align="center">物资型号</th>
						<th data-field="amount" data-align="center">数量</th>
						<th data-field="address" data-align="center">存放地址</th>
						<th data-field="org_name" data-align="center">权属单位</th>
					</tr>
					</thead>
				</table>
				<!-- End Example Events -->
			</div>
	    </div>
	    <script src="/awater/lib/jquery.min.js?v=2.1.4"></script>
	    <script src="/awater/lib/bootstrap.min.js?v=3.3.6"></script>
	    <script src="/awater/lib/content.min.js?v=1.0.0"></script>
	    <script src="/awater/lib/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	    <script src="/awater/lib/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	    <script src="/awater/lib/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
	    
	    <script src="/awater/lib/plugins/layer-v2.4/layer/layer.js"></script>
		<script type="text/javascript">
		
		function queryParams() {
	        return {
	            type: 'owner',
	            sort: 'updated',
	            direction: 'desc',
	            per_page: 100,
	            page: 1
	        };
	    }
		
		var $table = $('#table'), $remove = $('#re_send_selected');
	
	    $(function () {
			$table.on('click-row.bs.table', function (row,obj) {
		        window.parent.showInfoWindowByPoint('bz',obj);
	        });
	        var url=encodeURI('<%=urladdress%>/agsupport/com/augurit/nnps/yjdd/GoodPage@equipList.page<%if(name!=null){%>?bean.name=<%=name%><%} else if(ownerdept!=null){%>?bean.ownerdept=<%=ownerdept%><%} else if(address!=null){%>?bean.address=<%=address%><%}%>');
			$.ajax({
				method : 'GET',
				url : url,
				async : true,
				dataType : 'json',
				success : function(data) {
					var row=new Array();
					for (i in data){
						var obj=new Object();
						obj.id=data[i].id;
						obj.name=data[i].name;
						obj.code=data[i].code;
						obj.model=data[i].model;
						obj.amount=data[i].amount;
						obj.address=data[i].address;
						obj.org_name=data[i].org_name;
						row.push(obj);
					}
					$table.bootstrapTable('load', row);
				},
				error : function() {
					alert('error');
				}
			});
	    });
	    function opennewlayer(){
				layer.open({
					type: 2,
					area: ['770px', '400px'],
					title : "新增应急物资",
					skin: 'layui-layer-rim', //加上边框
					content: [location.protocol+"//"+location.hostname+":"+location.port+'/awater/nnwaterSystem/AlertDispatch/PrevWatelogSupplies/Input.html', 'yes']
				});
		}
		function openeditlayer(){
				layer.open({
					type: 2,
					area: ['770px', '400px'],
					title : "修改应急物资",
					skin: 'layui-layer-rim', //加上边框
					content: [location.protocol+"//"+location.hostname+":"+location.port+'/awater/nnwaterSystem/AlertDispatch/PrevWatelogSupplies/Input.html', 'yes']
				});
			}
			function opendellayer(){
				layer.confirm('是否删除选中数据？', {
				  btn: ['确认','取消'] //按钮
				}, function(){
				  layer.msg('操作成功', {icon: 1});
				}, function(){
				
				});
			}
	    </script>
	</body>
</html>
