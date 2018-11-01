
define(['jquery','layer','mousewheel','customScrollbar'],function($,layer){
	var id;
	function init(_id){
		id=_id;

		$("#alarmInfoNew").load("/psemgy/eims/dispatch/pages/municipal/alarm/alarmInfoNew.html",function(h){
			require(["psemgy/eims/dispatch/pages/municipal/alarm/js/alarmInfoNew"],function(alarmInfoNew){
				alarmInfoNew.init(id);
			})
		});

		$("#supervise").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(h){
			require(["psemgy/eims/dispatch/pages/district/supervise/js/superviseNews"],function(superviseNews){
				superviseNews.init(id);
			})
		});
		//$("#reloadBtn").click(reload);

		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordCity/getHistoryCityRecord?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {  
				if(data!=0){
					$("#cityRecord").html(data.templateName);
					$("#cityA").on("click",function(){
						showRecordWindow(data.id,'市级应急预案详细')
					});
				}
			},
			error : function() {   
				layer.msg('error');
			}
		});

		//Todo temp
		/*$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordDistrict/getDistrictStatusHis?yaCityId='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#tableResponeReview").append("<tr height='20px' id ='type2'><td colspan='2' class='unitTitle'>成员单位机构</td></td></tr>");
				$("#tableResponeReview").append("<tr height='20px' id ='type3'><td colspan='2' class='unitTitle'>有关单位</td></td></tr>");

				$.each(data.row,function(index,item){
				var districtName="";
				if(item.ORG_TYPE==3){
						if(item.STATUS)
							districtName="<a href='#' data-str='"+item.ORG_ID+"','"+item.ID+"'>"+item.ORG_NAME+"</a>";
						else
							districtName=item.ORG_NAME;
						if(item.STATUS==1){
							$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td>启动中</td></tr>")
						} else if(item.STATUS==2){
							$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>已结束</font></td></tr>")
						} else {
							$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>未开始</font></td></tr>")
						}
					}else{
						if(item.STATUS)
							districtName="<a href='#'  data-str='"+item.ORG_ID+"','"+item.ID+"'>"+item.ORG_NAME+"</a>";
						else
							districtName=item.ORG_NAME;
						if(item.STATUS==1){
							$("#type2").after("<tr height='20px'><td >"+districtName+"</td><td>启动中</td></tr>")
						} else if(item.STATUS==2){
							$("#type2").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>已结束</font></td></tr>")
						} else {
							$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td></tr>")
						}
					}
				});
			},
			error : function() {
				layer.msg('error');
			}
		});*/

        require(['psemgy/eims/dispatch/pages/municipal/dispatchMap/js/initMap','awaterui','ssjk-data'],function(initMap,awaterui,ssjkData){
			initMap.init("hisMunicipalMapDiv",ssjkData.ssjkInit);
			awaterui.mapLegend("hisMunicipalMapDiv",initMap.graphicLayerArr);
		})
	}

	//市级预案内容详细
	function showRecordWindow(id,title){
		$.get("/psemgy/eims/dispatch/pages/municipal/record/recordInput.html",function(h){
			layer.open({
				type: 1,
				title: title,
				shadeClose: false,
				shade: 0.5,
				area: ['800px', '700px'],
				content:h,
				success: function(layero,index){
					require(['/psemgy/eims/dispatch/pages/municipal/record/js/recordInput'],function(recordInput){
						recordInput.init(id,0,index);
					});
				}
			});
		})

	}
	//查看成员单位调度室
	function viewDistrictRecord(e){
		var orgStr=$(e.target).data("str");
		var districtUnitId=orgStr.split(",")[0];
		var yaDistrictId=orgStr.split(",")[1];
		$.get("/psemgy/eims/dispatch/pages/district/mainView.html",function(h){
			layer.open({
				type: 1,
				title: '浏览成员单位启动预案',
				shadeClose: false,
				shade: 0.5,
				area: ['100%', '100%'],
				content:h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/js/mainView"],function(mainView){
						mainView.init(districtUnitId,yaDistrictId,id);
					})
				}
			});
		})
		
	}

	return{
		init: init
	}
});
