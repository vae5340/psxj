define(['jquery','awaterui','layer','dateUtil','summernote','summernoteCN'],function($,awaterui,layer,dateUtil,summernote,summernoteCN){
	var id,cityYaId,pIndex;
	function init(_id,index){
		id=_id;
		pIndex=index;
	   $("#districtRainReportList #deleteYyybBtn").click(delData);
	   $("#districtRainReportList #changenote").click(changenote);
	   $("#districtRainReportList #changeword").click(exportWord);
		$.ajax({
			method:'GET',
			url:'/psemgy/yaRainReport/inputJson?id='+id,
			cache:false,
			async:false,
			dataType:'json',
			success:function(data){
				$("#districtRainReportList #content").html(data.reportContent);
				cityYaId=data.cityYaId;
				$("#districtRainReportList #reportName").val(data.reportName);
					$("#districtRainReportList #table").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaRainReport/getEachCityRainReport?cityYaId="+cityYaId,
					rowStyle:"rowStyle",
					cache: false,
					striped: true,
					pagination:true,
					queryParams: queryParams,
					sidePagination: "server",				
					columns: [{visible:true,checkbox:true},
						{field: 'districtName',title: '成员单位',align:'center'},
						{field: 'rescuePeopleNumber',title: '出动救援人员',align:'center'}, 
						{field: 'rescueCarNumber',title: '出动救援车辆',align:'center'},
						{field: 'reportCreateTime',title: '报告时间',align:'center',formatter:format_time},
						{field: 'reportCreater',title: '报告人',align:'center',formatter:formatter_normal}, 
						{title: '详情', formatter:formatter_detail,align:'center'}],
					onLoadSuccess: function(){
						$("#districtRainReportList .detailBtn").click(showWindow);
					}		
				});
			},
			error:function (e){}
		});
		
		$("#districtRainReportList #table").on('post-body.bs.table', function (row,obj) {
			var content=$("#districtRainReportList #content").html();
			content=$("#districtRainReportList #content").html().substr(0,content.length-1)+"。";      
			$("#districtRainReportList #content").html(content);			
		});		
	}

	function format_time(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value.time);
		return '';
	}
			
	function formatter_detail(value, row, index){
		return "<button class='btn btn-primary detailBtn' type=\"button\" data-id='"+row.id+"'>详情</button>";			
	}
		
	function formatter_normal(value, row, index){
		if(value)
			return value;
		return '';
	}
		
	function closeLayer() {
		layer.close(pIndex);
		reloadData();
	}
	
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}

	function showWindow(e){
		var id=$(e.target).data("id");
		var url="/psemgy/eims/dispatch/pages/district/rainReport/list.html?id="+id;
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/rainReport/list.html","成员单位防汛应急响应一雨一报",function(){
			require(["psemgy/eims/dispatch/pages/district/rainReport/js/list"],function(list){
				list.init(id);
			});
		});
	}

	function addData(){
		if(cityYaId!=null){
			$.get("/psemgy/eims/dispatch/pages/municipal/rainReport/yaDistrictList.html",function(h){
				layer.open({
				type: 1,
				title: '成员单位应急预案列表',
				shadeClose: false,
				shade: 0.1,
				area: ['800px', '400px'],
				content: h,
				success: function(layero,index){
						require(["psemgy/eims/dispatch/pages/municipal/rainReport/js/yaDistrictList"],function(yaDistrictList){
							yaDistrictList.init(cityYaId,index);
						})
					}
				});							
			});	
		}
	}

	function changenote(){
		if($("#districtRainReportList #changenote").attr("status")=="save"){
			layer.confirm('是否保存修改内容？', {
				btn: ['是','否'] //按钮
			}, function(){
				$("#districtRainReportList #eg").removeClass("no-padding");
				var str = $('.click2edit').code();
				$('.click2edit').destroy();
				$("#districtRainReportList #changenote").attr("status","edit");
				$("#districtRainReportList #changenote").text("修改一雨一报内容");
				$("#districtRainReportList #reportName").attr("readonly",true);
				$.ajax({
					method:'POST',
					url:'/psemgy/yaRainReport/saveContent',
					data:{ "id":id,"reportContent":str,"reportName":$("#districtRainReportList #reportName").val()},
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
			$("#districtRainReportList #eg").addClass("no-padding");
			$('.click2edit').summernote({
				lang: 'zh-CN',
				focus: true
			});
			$("#districtRainReportList #reportName").attr("readonly",false);
			$("#districtRainReportList #changenote").attr("status","save");
			$("#districtRainReportList #changenote").text("保存一雨一报内容");
		}
	}
			
	function delData(){		    
		var selList=$("#districtRainReportList #table").bootstrapTable('getSelections');
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
					url:'/psemgy/yaRainReport/deleteMoreJson',
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
			
	function reloadData(){
		$.ajax({
			method : 'GET',
			url :"/psemgy/yaRainReport/getEachCityRainReport?cityYaId="+cityYaId,
			async : false,
			success : function(data) {
				$("#districtRainReportList #table").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
			},
			error : function(e) {
				alert('error');
			}
		});
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