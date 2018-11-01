<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String address = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>防涝物资储备资料库</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<!--<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=yes">-->
		
		<link rel="stylesheet" href="css/fluid-layout.css" type="text/css" />
		<link rel="stylesheet" href="css/fluid-bootstrap.css" type="text/css" />
		<link rel="stylesheet" href="/awater/lib/zTree/css/zTreeStyle/metro.css">
	    <script src="/awater/lib/zTree/js/jquery-1.4.4.min.js"></script>
	    <script src="/awater/lib/zTree/js/jquery.ztree.all-3.5.min.js"></script>
	    <script src="/awater/js/common.js"></script> 
	    <style>
	    	.title{color:#333;padding:5px 10px;font-size:18px;}
	    </style>
	</head>
	<body style="margin-top: 20px;padding:0 40px;">
		<div class="container-fluid">
			<div class="row-fluid">
				<div style="float: left;width: 200px;margin-right:20px;">
					<div class="well sidebar-nav">
						<div class="form-group">
							<label class="control-label title">统计方式</label>
							<select id="type" name="type" class="form-control" onchange="displayTree()" style="width:100%;">
								<option value="wz">按物资类型</option>
								<option value="qs">按权属单位</option>
								<option value="ck">按储备点</option>
							</select>
							<label class="control-label title">目录树</label>
		           			<ul id="tree" class="ztree" style="width:100% overflow:auto;display: block; "></ul>
		           			<ul id="qstree" class="ztree" style="width:100% overflow:auto;display:none; "></ul>
		           			<ul id="cktree" class="ztree" style="width:100% overflow:auto;display:none; "></ul>
						</div> 
						
	          		</div>
	        	</div>
	        	<div style="float: left;width:calc(100% - 220px);">
	          		<div id="grid" class="well sidebar-nav" style="margin-left: 10px;">
	          			<iframe src="" width="99%" height="99%" id="iframepage" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
	          		</div>
	    		 </div>
	    	 </div>
	     </div>
	     <script>
		    var zTree;
	     	var setting = {
		        view: {
		            dblClickExpand: false,
		            showLine: true,
		            selectedMulti: false
		        },
				data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "parent_id",
						rootPId: 1
					}
				},
		        callback: {
		            onClick : function(event, treeId, treeNode) {
		            	if(treeNode.id==1)
		            		return;
		                else
		                    $("#iframepage").attr("src","List.jsp?name="+treeNode.name);
		            },
		            onNodeCreated:function (event, treeId, treeNode){
		            	if(treeNode.id==1)
		            		$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
		            }
		        }
		    };
		    var qssetting = {
		        view: {
		            dblClickExpand: false,
		            showLine: true,
		            selectedMulti: false
		        },
				data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "parent_id",
						rootPId: 0
					}
				},
		        callback: {
		            onClick : function(event, treeId, treeNode) {
		            	if(treeNode.id==1)
		            		return;
		                else
		                    $("#iframepage").attr("src","List.jsp?ownerdept="+treeNode.id);
		            },
		            onNodeCreated:function (event, treeId, treeNode){
		            	if(treeNode.id==1)
		            		$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
		            }
		        }
		    };
		    var cksetting = {
		        view: {
		            dblClickExpand: false,
		            showLine: true,
		            selectedMulti: false
		        },
				data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "parent_id",
						rootPId: 0
					}
				},
		        callback: {
		            onClick : function(event, treeId, treeNode) {
		            	if(treeNode.id==1)
		            		return;
		                else
		                    $("#iframepage").attr("src","List.jsp?address="+treeNode.name);
		            },
		            onNodeCreated:function (event, treeId, treeNode){
		            	if(treeNode.id==1)
		            		$.fn.zTree.getZTreeObj("tree").expandNode(treeNode, true, true, true);
		            }
		        }
		    };
			$.ajax({
				method : 'GET',
				url : "<%=address%>/agsupport/com/augurit/nnps/yjdd/GoodPage@getTreeJson.page",
				async : true,
				dataType : 'json',
				success : function(data) {
					var zNodes=data[2];
					$.fn.zTree.init($("#tree"), setting,zNodes);
				    var qszNodes=data[1];
				    $.fn.zTree.init($("#qstree"), qssetting,qszNodes);
					var ckzNodes=data[0];
					$.fn.zTree.init($("#cktree"), cksetting,ckzNodes);
				}
			});
			
		    function displayTree(){
		    	if($("#type").val()=="wz"){
		    		$("#qstree").hide();
		    		$("#cktree").hide();
		    		$("#tree").show();
		    	} else if ($("#type").val()=="qs") {
		    		$("#qstree").show();
		    		$("#cktree").hide();
		    		$("#tree").hide();	
		    	} else if ($("#type").val()=="ck") {
		    		$("#qstree").hide();
		    		$("#cktree").show();
		    		$("#tree").hide();	
		    	}
		    }
	     </script>
	</body>
</html>