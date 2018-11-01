define(["jquery","awaterui","dateUtil","layer",'summernote','summernoteCN','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,awaterui,dateUtil,layer,summernote,summernoteCN){
	function init(_id,_yaId){
		id=_id;
		yaId=_yaId;

		$("#addJsdReportPRBtn").click(addData);
		$("#deleteJsdReportPRBtn").click(delData);
		$("#changenotePRBtn").click(changenote);
		$("#exportWordPRBtn").click(exportWord);

		if(id){	            
			$("#reportBtn").hide();
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/inputJson',
				data:{"id":id},
				dataType : 'json',  
				async:false,
				success:function(data){
					$('#processReportName').val(data.form.reportName)
					$('#processReportContent').html(data.form.reportContent);							
				},
				error:function (e){
					layer.msg("error");
				}
			});    
		} else {
			var time=new Date();  	            
			$("#processReportName").val(time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+time.getHours()+"时事中报告");
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/produceDistrictReportContent',
				dataType : 'json',  
				async:false,
				success:function(data){
					if(data.repeat!=null){
						layer.msg("已提交事中报告");
						var index = layer.getFrameIndex(window.name);
						layer.close(index);	
					} else if(data.nosupervise!=null) {
						layer.msg("当前无事中报告督办，不能提交");
						var index = layer.getFrameIndex(window.name);
						layer.close(index);
					} else {
						$('#processReportContent').html(data.content);
						superviseId=data.superviseId;
						groupId=data.groupId;
						changenote();							   
					}
				},
				error:function (e){
					layer.msg("error");
				}
			});    	               	            
		}
			
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordCity/getNowCityRecord',
			async : true,
			dataType : 'json',
			success : function(data) {  
				if(data!=0){
					cityYaId=data.id;
				}
			},
			error : function() {   
				layer.msg('error');
			}
		});

		$("#processReportTable").bootstrapTable({
			toggle:"table",
			height:340,
			url:"/psemgy/yaJsdReport/listJson?yaId="+yaId+"&reportType=1&reportId="+id,
			rowStyle:"rowStyle",
			toolbar: '#toolbar',
			pagination:true,
			sortable: false,
			striped: true,
			pageNumber:1,
			pageSize: 10,
			pageList: [10, 25, 50, 100],
			cache: false,
			queryParams: queryParams,
			sidePagination: "server",
			columns: [
				{visible:true,checkbox:true},
				{field:'jsdName',visible: true,title: '积水点名称',align:"center"},
				{field:'jsReason',visible: true,title: '积水原因',align:"center"},
				{field:'dutyUnit',visible: true,title: '责任单位',align:"center"},
				{field:'dutyPerson',visible: true,title: '责任人',align:"center"},
				{field:'reportCreater',visible: true,title: '创建人',align:"center"},
				{field:'reportCreateTime',visible: true,title: '创建时间',formatter:format_date,align:"center"},
				{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
			],
			onLoadSuccess: function(){
				$("#processReportTableDiv").mCustomScrollbar();
				$(".jsdReportDetailBtn").click(showJsdReport);
			}
		});
	}

	var id,yaId;
	var cityYaId;
	var superviseId;
	var groupId;
				
	function showJsdReport(e){
		//onclick=\"showJsdReport("+row.id+")\"
		$.get("/psemgy/eims/dispatch/pages/district/processReport/jsdReportInput.html",function(h){
			layer.open({
				type: 1,
				title: '修改积水点报告',
				shadeClose: true,
				shade: 0.5,
				area: ['920px', '570px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/processReport/js/jsdReportInput"],function(jsdReportInput){
                        jsdReportInput.init($(e.target).data("id"),index);
					});
				}
			}); 
		})
	}

	function changenote(){
		if($("#changenotePRBtn").attr("status")=="save"){
			$("#eg").removeClass("no-padding");
			var aHTML = $('.click2edit').code();
			$('.click2edit').destroy();
			$("#changenotePRBtn").attr("status","edit");
			$("#changenotePRBtn").text("修改事中报告");
			$("#processReportName").css("border","none");						
			$("#processReportName").attr("readonly",true);
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/saveJson',
				data:{"id":id,"cityYaId":cityYaId,"districtYaId":yaId,"reportName":$("#processReportName").val(),"reportContent":aHTML,"superviseId":superviseId,"groupId":groupId},
				dataType : 'json',  
				async:false,
				success:function(data){
					id=data.id;
					layer.msg(data.result);
					var index = layer.getFrameIndex(window.name);
					layer.close(index);	
				},
				error:function (e){
					layer.msg("保存失败");
				}
			});    
		} else {
			$("#eg").addClass("no-padding");
			$('.click2edit').summernote({
				height: 120, 		            
				lang: 'zh-CN',
				focus: true
			});
			$("#processReportName").attr("readonly",false);
			$("#processReportName").css("border","1px");
			$("#changenotePRBtn").attr("status","save");
			$("#changenotePRBtn").text("保存事中报告");
		}
	}	
				
	function addData(){
		$.get("/psemgy/eims/dispatch/pages/district/processReport/jsdReportInput.html",function(h){
			layer.open({
				type: 1,
				title: '新增积水点报告',
				maxmin: true, //开启最大化最小化按钮
				area: ['900px', '550px'],
				content: h,
				success: function(layero,index){
					//'jsdReportInput.html?yaId='+yaId+"&reportType=1&reportId="+id
					require(["psemgy/eims/dispatch/pages/district/processReport/js/jsdReportInput"],function(jsdReportInput){
						jsdReportInput.init("",index,yaId,"",id,1);
					})
				},
				end :function(){
					//$("#processReportTable").bootstrapTable('removeAll');
					$("#processReportTable").bootstrapTable('refresh', {url: "/psemgy/yaJsdReport/listJson?yaId="+yaId+"&reportType=1&reportId="+id});
				}
			});
		})
	}
	
	function closeLayer(index){
		layer.close(index);
		reloadData();
	}
	
	function delData(){
		var selList=$("#processReportTable").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项');
		else {
			var checkedIds= new Array();
			for (var i=0;i<selList.length;i++){
				checkedIds.push(selList[i].id);
			}
			$.ajax({  
				url:'/psemgy/yaJsdReport/deleteMoreJson',
				traditional: true,
				data: {"checkedIds" : checkedIds},
				type: "POST",
				dataType: "json",
				success: function(data) {
					layer.msg(data.result);
				}
			});
			reloadData();
		}
	}
	
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
	
	function reloadData(){
		var query=new Object();
		query.yaId=yaId;
		query.reportType=1;
		if(id!=""){
			query.reportId=id;
		}
		//if($("#jsdId").val()!="")
		//	query.jsdId=$("#jsdId").val();
		$("#processReportTable").bootstrapTable('refresh', {url: '/psemgy/yaJsdReport/listJson',query:query});
		
		//编辑状态下更新明显积水点数量
		if($("#changenotePRBtn").attr("status")=="save"){   					  
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/jsdNum?districtYaId='+yaId,
				dataType : 'json',  
				async:false,
				success:function(data){   
					var aHTML = $('.click2edit').code();
					var sIndex=aHTML.indexOf("<font id=\"jsdNum\">");
					var jsdHtml=aHTML.substr(sIndex);	
					var rLength=jsdHtml.indexOf("</font>");
					aHTML=aHTML.replace(aHTML.substr(sIndex,rLength),"<font id=\"jsdNum\">"+data);
					$('.click2edit').code(aHTML);							   
				},
				error:function (e){
					layer.msg("保存失败");
				}
			});
		}
	}

	function addBtnCol(value, row, index){
		return "<button type=\"button\" class=\"btn btn-primary jsdReportDetailBtn\" style=\"border:1px solid transparent;\" data-id=\""+row.id+"\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
	}

	function format_date(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}

	function detailDialog(id){
		layer.open({
			type: 2,
			title: '应急问题详细',
			maxmin: true, 
			area: ['900px', '550px'],
			content: 'eims/facility/problemReport/problemReportInput.html?id='+id
		});
	} 
	function exportWord(){
		if(id){
			var url = '/psemgy/yaProcessReport/exportWord?id='+id;
			window.open(url);
		}else{
			layer.msg("导出失败");
		}
	}

	return {
		init: init
	}
});	