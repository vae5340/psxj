define(["jquery","awaterui","dateUtil","layer",'summernote','summernoteCN','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,awaterui,dateUtil,layer,summernote,summernoteCN){
    function init(id,yaId){
		var jsdUrl; 
		$("#processReport_changeNote").click(changenote);
		$("#processReport_exportNote").click(exportWord);  	            
		if(id){
			$("#reportBtn").hide();
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/inputJson',
				data:{"id":id},
				dataType : 'json',  
				async:false,
				success:function(data){
					groupId = data.form.groupId;
					$('#processReport_reportName').val(data.form.reportName)
					$('#processReport_content').html(data.form.reportContent);
					if(groupId)
						loadTable();
				},
				error:function (e){
					layer.msg("error");
				}
			}); 
			jsdUrl= "/psemgy/yaJsdReport/listJson?yaId="+yaId;
		} else {
			var time=new Date();  	            
			$("#processReport_reportName").val(time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+time.getHours()+"时事中报告");	            
			$.ajax({
				method:'GET',
				url:'/psemgy/yaProcessReport/produceCityReportContent',
				dataType : 'json',
				async:false,
				success:function(data){
					if(data.repeat!=null){
						layer.msg("已提交事中报告");
						var index = layer.getFrameIndex(window.name);
						layer.close(index);	
					} else if(data.lack!=null) {
						lack=1;
						$('#processReport_content').html(data.content);
						id=data.id;
						groupId=data.groupId;	
						changenote();	
					} else {
						$('#processReport_content').html(data.content);
						groupId=data.groupId;	
						id=data.id;							    
						changenote();							   
					}
				},
				error:function (e){
					layer.msg("error");
				}
			});
			jsdUrl= "/psemgy/yaJsdReport/listJson?cityYaId="+yaId;
		}
		$("#processReport_tableDiv").mCustomScrollbar();
	}

			
	var groupId;
	var lack;
			
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			cityYaId:yaId,
			groupId:groupId
		};
	}
	function loadTable(){
		$("#processReport_table").bootstrapTable({
			toggle:"table",
			height:380,					
			url:"/psemgy/yaProcessReport/listAllDistrictReport",
			rowStyle:"rowStyle",
			toolbar: '#toolbar',
			sortable: false,
			striped: true,
			cache: false,
			pagination:true,
			queryParams: queryParams,
			sidePagination: "server",
			columns: [
				{field: '2',title: '报告名称',align:'center'}, 
				{field: '3',title: '成员单位',align:'center'},
				{field: '4',title: '报告时间',align:'center',formatter:format_time},
				{field: '5',title: '报告人',align:'center'}, 
				{title: '详情', formatter:formatter_detail,align:'center'}],
			onSuccessLoad: function(){
				$(".detailBtn").click(openszbg);
			}
		});
	}
	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}

	function formatter_detail(value, row, index){
		return "<button class='btn btn-primary detailBtn' type=\"button\" data-ids='"+row[0]+"','"+row[1]+"'>详情</button>";		
	}

	function openszbg(e){
		var id=$(e.target).data("ids").split(",")[0];
		var districtYaId=$(e.target).data("ids").split(",")[1];
		 // onclick=openszbg('"+row[0]+"','"+row[1]+"')id,districtYaId
		//var url = "/psemgy/eims/dispatch/pages/district/processReport/processReport.html?id="+id+"&yaId="+districtYaId;
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/processReport/processReport.html","查看事中报告");
		require(["psemgy/eims/dispatch/pages/district/processReport/js/processReport"],function(processReport){
			processReport.init(id,districtYaId);
		});			 
	}
				
	function showJsdReport(id){
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
            jsdReportInput.init(id,index);
			  	});
				}
			});
		})

	}
			
	function changenote(){
		if($("#processReport_changeNote").attr("status")=="save"){
			if(lack==1){
				layer.confirm('当前有成员单位尚未提交事中报告，是否提交市级报告？', {btn: ['是','否'] //按钮
				}, function(index){
					$("#processReport_eg").removeClass("no-padding");
					var aHTML = $('.click2edit').code();
					$('.click2edit').destroy();
					$("#processReport_changeNote").attr("status","edit");
					$("#processReport_changeNote").text("修改事中报告");
					$("#processReport_reportName").css("border","none");						
					$("#processReport_reportName").attr("readonly",true);
					$.ajax({
						method:'GET',
						url:'/psemgy/yaProcessReport/saveJson',
						data:{"id":id,"cityYaId":yaId,"reportName":$("#processReport_reportName").val(),"reportContent":aHTML,"groupId":groupId},
						dataType : 'json',  
						async:false,
						success:function(data){
							id=data.id;						
							layer.msg(data.result);
							layer.close(pIndex);	
						},
						error:function (e){
							layer.msg("保存失败");
						}
					}); 
					layer.close(index);															 
				}, function(index){
					layer.close(index);
				}); 	  			       
			} else {			        					
				$("#processReport_eg").removeClass("no-padding");
				var aHTML = $('.click2edit').code();
				$('.click2edit').destroy();
				$("#processReport_changeNote").attr("status","edit");
				$("#processReport_changeNote").text("修改事中报告");
				$("#processReport_reportName").css("border","none");						
				$("#processReport_reportName").attr("readonly",true);
				$.ajax({
					method:'GET',
					url:'/psemgy/yaProcessReport/saveJson',
					data:{"id":id,"cityYaId":yaId,"reportName":$("#processReport_reportName").val(),"reportContent":aHTML,"groupId":groupId},
					dataType : 'json',  
					async:false,
					success:function(data){
						id=data.id;						
						layer.msg(data.result);
						layer.close(pIndex);	
					},
					error:function (e){
						layer.msg("保存失败");
					}
				});  
			}
		} else {
			$("#processReport_eg").addClass("no-padding");
			$('.click2edit').summernote({height: 140,lang: 'zh-CN',focus: true});
			$("#processReport_reportName").attr("readonly",false);
			$("#processReport_reportName").css("border","1px");
			$("#processReport_changeNote").attr("status","save");
			$("#processReport_changeNote").text("保存事中报告");
		}
	}
				
	function closeWindow(){
		layer.close(pIndex);
	}

	function exportWord(){
		if(id){
			var url = '/psemgy/yaProcessReport/exportWord?id='+id;
			window.open(url);
		}else{
			layer.msg("导出失败");
		}
	}

	return{
		init: init
	}
});