define(['jquery','layer','dateUtil','awaterui','summernote','summernoteCN'],function($,layer,dateUtil,awaterui){
   function init(_id){
	   id=_id;
	   $("#addJsdReportBtn").click(addData);
	   $("#deleteJsdReportBtn").click(delData);
	   $("#changenoteBtn").click(changenote);
	   $("#exportWordBtn").click(exportWord);

		$.ajax({
			method : 'GET',
			url : "/psemgy/yaRainReport/inputJsonDistrict?id="+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#rainReport_list_content").html(data.form.reportContent);
				cityYaId=data.cityYaId;
				$("#rainReport_list_reportName").val(data.form.reportName);
				districtYaId=data.form.districtYaId; 	          
				$("#rainReport_list_table").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaJsdReport/listJson?yaId="+districtYaId+"&reportType=2&reportId="+id,
					rowStyle:"rowStyle",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: queryParams,
					sidePagination: "server",
					columns: [
							{visible:true,checkbox:true},
							{field:'jsdName',visible: true,title: '积水点名称',align:"center"},
							{field:'jsReason',visible: true,title: '积水原因',align:"center"},
							{field:'dutyUnit',visible: true,title: '责任单位',align:"center"},
							{field:'dutyPerson',visible: true,title: '责任人',align:"center"},
							{field:'reportCreater',visible: true,title: '创建人',align:"center"},
							{field:'reportCreateTime',visible: true,title: '创建时间',formatter:format_time,align:"center"},
							{visible: true,title: '涝情回顾',formatter:addLQHGBtnCol,width:100,align:"center"},
							{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
						],
					onLoadSuccess: function(){
						$(".addBtn").click(showJsdReport);
						$(".addLQHGBtn").click(showLQHGTab);
					}		
				});  
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
   } 

	var id, DistrictYaId,pIndex;

	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value.time);
		return '';
	}

	function formatter_detail(value, row, index){
		return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary detailBtn\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
	}

	function formatter_normal(value, row, index){
		if(value==null)
		return '';
		return value;
	}

	function addBtnCol(value, row, index){
		return "<button type=\"button\" class=\"btn btn-success addBtn\" style=\"border:1px solid transparent;\" data-id='"+row.id+"'\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
	}

	function addLQHGBtnCol(value, row, index){
		return "<button type=\"button\" class=\"btn btn-success addLQHGBtn\" style=\"border:1px solid transparent;\" data-ids='"+row.id+","+row.yaId+","+row.jsdId+"'\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>回顾</button>";
	}

	function closeLayer(){
		reloadData();
	}

	function reloadData(){
		$.ajax({
			method : 'GET',
			url : "/psemgy/yaJsdReport/listJson?yaId="+districtYaId+"&reportType=2&reportId="+id,
			async : false,
			success : function(data) {
	//		    $("#rainReport_list_table").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	 
				$("#rainReport_list_table").bootstrapTable('refresh');	
			},
			error : function(e) {
				alert('error');
			}
		});	
	}

	function detailDialog(id){
		layer.open({
			type: 2,
			title: '应急问题详细',
			maxmin: true, 
			area: ['900px', '600px'],
			content: '/psemgy/eims/facility/problemReport/problemReportInput.html?id='+id
		});
	}

	function showJsdReport(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/pages/district/rainReport/jsdReportInput.html",function(h){
			layer.open({
				type: 1,
				title: '修改积水点报告',
				shadeClose: true,
				shade: 0.5,
				area: ['900px', '550px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/rainReport/js/jsdReportInput"],function(jsdReportInput){
						jsdReportInput.init(id,index);
					})
				}
			});
		}); 	
	}

	var districtYaId;    

	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
	
	function showWindow(url){
		//iframe层
		layer.open({
			type: 2,
			title: '详细',
			shadeClose: true,
			shade: 0.5,
			area: ['70%', '70%'],
			content: url //iframe的url
		});
	}
	//新建tab - 显示对应积水点涝情回顾
	function showLQHGTab(e){
		var ids=$(e.target).data("ids").split(",");
		var yaDistrcitId=ids[1];
		var jsdId=ids[2];
		awaterui.createNewtab("/psemgy/eims/analysis/floodReview/history.html","涝情回顾",function(){
			require(["psemgy/eims/analysis/floodReview/js/history"],function(history){
				history.init(jsdId,yaDistrcitId);
			});
		});
	}

	function addData(){
		if(districtYaId!=null){
			$.get("/psemgy/eims/dispatch/pages/district/rainReport/jsdReportInput.html",function(h){
				layer.open({
					type: 1,
					title: '新增积水点报告',
					maxmin: true, 
					area: ['900px', '550px'],
					//content: 'jsdReportInput.html?yaId='+districtYaId+"&reportType=2&reportId="+id,	
					content: h,					
					success: function(layero,index){
						require(["psemgy/eims/dispatch/pages/district/rainReport/js/jsdReportInput"],function(jsdReportInput){
							jsdReportInput.init("",index,2,id,districtYaId,"");
						})
					},
					end: function(){
						$("#rainReport_list_table").bootstrapTable('refresh');	
					}
				});	
			});			
		}
	}
	function changenote(){
		if($("#changenoteBtn").attr("status")=="save"){
			layer.confirm('是否保存修改内容？', {btn: ['是','否'] //按钮
			}, function(){
				$("#rainReport_list_eg").removeClass("no-padding");
				var str = $('.click2edit').code();
				$('.click2edit').destroy();
				$("#changenoteBtn").attr("status","edit");
				$("#changenoteBtn").text("修改一雨一报内容");
				$("#rainReport_list_reportName").attr("readonly",true);
				$.ajax({
					method:'POST',
					url:'/psemgy/yaRainReport/saveContent',
					data:{ "id":id,"reportContent":str,"reportName":$("#rainReport_list_reportName").val()},
					async:false,
					success:function(data){
						layer.msg(data.result);
					},
					error:function (e){
						layer.msg("保存失败");
					}
				});
			}, function(){
				
			});
		} else {
			$("#rainReport_list_eg").addClass("no-padding");
			$('.click2edit').summernote({
				lang: 'zh-CN',
				focus: true
			});
			$("#rainReport_list_reportName").attr("readonly",false);
			$("#changenoteBtn").attr("status","save");
			$("#changenoteBtn").text("保存一雨一报内容");
		}
	}
	function delData(){		    
		var selList=$("#rainReport_list_table").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项');
		else{
			layer.confirm('是否删除选中项？', {
				btn: ['是','否'] //按钮
			}, function(){
				var checkedIds= new Array();
				for (var i=0;i<selList.length;i++){
					checkedIds.push(selList[i].id);
				}
				$.ajax({  
					url: '/psemgy/yaJsdReport/deleteMoreJson',
					traditional: true,
					data: {"checkedIds" : checkedIds},
					type: "POST",
					dataType: "json",
					success: function(data) {
						layer.msg(data.result);
						reloadData();
					}
				});
			}, function(){
				
			});
		}
	}
	function exportWord(){
		if(id){
			var url = '/psemgy/yaRainReport/exportWord?id='+id;
			window.open(url);
		}else{
			layer.msg("导出失败");
		}
	}

	return{ 
		init: init
	}
});