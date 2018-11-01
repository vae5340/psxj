var zTreeObj;
			// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
			var setting = {};
			// zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
			var zNodes = [{
						name: "全部文件",
						open: true,
						children: [{
							name: "国土",
							isParent: true,
						}, {
							name: "市政",
							isParent: true,
							children: [{
								name: "测试"
							}, {
								name: "测试"
							}]
						}, {
							name: "规划",
							isParent: true
						}]
					}];
						
						$(document).ready(function() {
							zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
						});