function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var districtUnitId=getQueryStr("districtUnitId");
$(window).load(function(){
	$(".list_lh").mCustomScrollbar({
	   mouseWheelPixels:300
	});				
});

var contentDic=[];
        
$(function(){
	var yaId;
	var url;
	$.ajax({
		method: 'GET',
		url:  '/agsupport/ya-record-city!getNowCityRecord.action',
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
            	       
    if(districtUnitId!=""){
		url='/agsupport/ya-supervise-log!listJson.action?districtUnitId='+districtUnitId+'&yaId='+yaId;
    } else {
		url='/agsupport/ya-supervise-log!listJson.action?yaId='+yaId;
    }
    $.ajax({
		method : 'GET',
		url :  url,
		async : true,
		dataType : 'json',
		success : function(data) {
			for (index in data){
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
					$("#ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red' onclick='ReplySupervise("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>")
		    	} else if(data[index]["response"]==1||data[index]["reply"]!=null) {
		      		$("#ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red' onclick='ViewSuperviseAndReply("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
		   		} else {
		      		$("#ulList").append("<li><div class='superDiv'>"+data[index]["district"]+"</div><div class='superDiv'><p><a href='#' class='a_red' onclick='ViewSupervise("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p></div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
		   		}
			}
		},
		error : function() {
			layer.msg('获取督办信息失败');
		}
	});          
});
		
function ReplySupervise(id){
	parent.layer.open({
		type: 2,
		title: '督办回复',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '400px'],
		content:'/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseReply.html?id='+id+'&content='+contentDic[id]
	}); 
} 
		
function ViewSupervise(id){
	parent.layer.open({
		type: 2,
		title: '查看督办内容',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '250px'],
		content:'/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/SuperviseView.html?content='+contentDic[id]
	}); 
}
		
function ViewSuperviseAndReply(id){
	parent.layer.open({
		type: 2,
		title: '查看督办内容',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '450px'],
		content:'/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseView.html?id='+id
	}); 
}