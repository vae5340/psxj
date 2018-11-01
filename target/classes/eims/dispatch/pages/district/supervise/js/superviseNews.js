define(['jquery','layer','mousewheel','customScrollbar'],function($,layer,mousewheel,customScrollbar){
	var contentDic=[];
	var districtUnitId;
	var url;	

	function init(yaId,_districtUnitId){
		districtUnitId=_districtUnitId;
		if(!yaId){
			$.ajax({
				method: 'GET',
				url:  '/psemgy/yaRecordCity/getNowCityRecord',
				async: false,
				dataType: 'json',
				success: function(data){			  
					if(data!=0){
						yaId=data.id;
					} else {
						yaId=0;
					}                 
				},
				error : function() {
					layer.msg('获取预案信息失败');
				}
			});  
		}          
						
		if(districtUnitId){
			url='/psemgy/yaSuperviseLog/listJson?districtUnitId='+districtUnitId+'&yaId='+yaId;
		} else {
			url='/psemgy/yaSuperviseLog/listJson?yaId='+yaId;
		}
		$.ajax({
			method : 'GET',
			url :  url,
			async : true,
			dataType : 'json',
			success : function(data) {
				for (var index=0;index<data.length;index++){
					var text="";
					switch(data[index]["type"]){ 
						case 1:
							text = "启动应急响应督办";
							if(data[index]["response"]==1)
								text+="<span class='doneSupervise'>(已启动)</span>";
							else  
								text+="<span class='noDoneSupervise'>(未启动)</span>";
							break;
						case 2:
							text="提交事中报告督办";
							if(data[index]["response"]==1)
								text+="<span class='doneSupervise'>(已提交)</span>";
							else  
								text+="<span class='noDoneSupervise'>(未提交)</span>";
							break; 
						case 3: 
							text="结束应急响应督办";
							if(data[index]["response"]==1)
								text+="<span class='doneSupervise'>(已结束)</span>";
							else  
								text+="<span class='noDoneSupervise'>(未结束)</span>";
							break;
						case 4: 
							text="抢险通知督办";
							if(data[index]["response"]==1)
								text+="<span class='doneSupervise'>(已回复)</span>";
							else  
								text+="<span class='noDoneSupervise'>(未回复)</span>";
							break;
						case 5: 
							text="抢险队督办";
							/*if(data[index]["response"]==1)
								text+="<span class='doneSupervise'>(已回复)</span>";
							else  
								text+="<span class='noDoneSupervise'>(未回复)</span>";*/
							var regex="\\【.+?\\】";
							var content = data[index]["content"].match(regex);
							if(content)
								text=content+text;
							break;
					}
					contentDic[data[index]["id"]]=data[index]["content"];
					if(districtUnitId!=""&&data[index]["reply"]==null){
						$("#superviseNews #ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red replyA' data-id='"+data[index]["id"]+"'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>")
					} else if(data[index]["response"]==1||data[index]["reply"]!=null) {
						$("#superviseNews #ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red viewAndReplyA'  data-id='"+data[index]["id"]+"'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
					} else {
						$("#superviseNews #ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red viewA'  data-id='"+data[index]["id"]+"'>"+text+"&nbsp;&nbsp;</a></p></div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
					}
				}

				$("#superviseNews .replyA").click(ReplySupervise);
				$("#superviseNews .viewAndReplyA").click(ViewSuperviseAndReply);
				$("#superviseNews.viewA").click(ViewSupervise);

				$("#superviseNews #dist_list_lh").mCustomScrollbar({
					mouseWheelPixels:300
				});	
			},
			error : function() {
				layer.msg('获取督办信息失败');
			}
		});         
	}
			
	function ReplySupervise(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/pages/district/supervise/superviseReply.html",function(h){
			layer.open({
				type: 1,
				title: '督办回复',
				shadeClose: false,
				shade: 0.5,
				area: ['650px', '400px'],
				content:h,
				success: function(layero,index){
					require(['/psemgy/eims/dispatch/pages/district/supervise/js/superviseReply'],function(superviseReply){
						superviseReply.init(id,contentDic[id],index);
					});
				}
			});
		})
		 
	} 
			
	function ViewSupervise(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/pages/municipal/supervise/superviseView.html",function(h){
			layer.open({
				type: 1,
				title: '查看督办内容',
				shadeClose: false,
				shade: 0.5,
				area: ['650px', '250px'],
				content:h,
				success: function(layero,index){
					require(['/psemgy/eims/dispatch/pages/municipal/supervise/js/superviseView'],function(superviseView){
						superviseView.init(contentDic[id],index);
					});
				}
		    }); 
		});
	}
			
	function ViewSuperviseAndReply(e){
		var id=$(e.target).data("id");		
		$.get("/psemgy/eims/dispatch/pages/district/supervise/superviseView.html",function(h){
			layer.open({
				type: 1,
				title: '查看督办内容',
				shadeClose: false,
				shade: 0.5,
				area: ['650px', '450px'],
				content:h,
				success: function(layero,index){
					require(['/psemgy/eims/dispatch/pages/district/supervise/js/superviseView'],function(superviseView){
						superviseView.init(id,index);
					});
				}
			}); 
		});
	}

	return{
		init: init
	}
});