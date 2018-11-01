function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
var yaId=getQueryStr("yaId");
var districtUnitId=getQueryStr("districtUnitId");
    $(window).load(function(){
	$(".list_lh").mCustomScrollbar({
	   mouseWheelPixels:300
	});				
});
   		
var contentDic=[];
        
$(function(){
	var url;

       if(districtUnitId){
          url=location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-supervise-log!listJson.action?districtUnitId='+districtUnitId+'&yaId='+yaId;
       } else {
          url=location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-supervise-log!listJson.action?yaId='+yaId;
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
							 if(data[index]["response"]==1)
							    text="启动应急响应督办(已启动)";
							  else  
							    text="启动应急响应督办(未启动)";
							  break;
							case 2: 
							  if(data[index]["response"]==1)
							    text="提交事中报告督办(已提交)";
							  else  
							    text="提交事中报告督办(未提交)";
							  break; 
							case 3: 
							  if(data[index]["response"]==1)
							    text="结束应急响应督办(已结束)";
							  else  
							    text="结束应急响应督办(未结束)";
							  break;
						}
				contentDic[data[index]["id"]]=data[index]["content"];
				if(districtUnitId!=""&&data[index]["reply"]==null){
				   $("#ulList").append("<li><div class='superDiv'><a href='#'>"+data[index]["district"]+"</a></div><div class='superDiv'><p><a href='#' class='a_red' onclick='ReplySupervise("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>")
			    }else if(data[index]["response"]==1||data[index]["reply"]!=null){
			      $("#ulList").append("<li><div class='superDiv'><a href='#'>"+data[index]["district"]+"</a></div><div class='superDiv'><p><a href='#' class='a_red' onclick='ViewSuperviseAndReply("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p> </div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
			   }else{
			      $("#ulList").append("<li><div class='superDiv'><a href='#'>"+data[index]["district"]+"</a></div><div class='superDiv'><p><a href='#' class='a_red' onclick='ViewSupervise("+data[index]["id"]+")'>"+text+"&nbsp;&nbsp;</a></p></div><div class='superDiv'><p style='text-align: right;'><span>"+data[index]["time"]+"&nbsp;&nbsp;</span></p></div></li>") 
			    }
			}
		},
		error : function() {
			alert('error1');
		}
	});          
      });

function ViewSupervise(id){
	parent.layer.open({
		type: 2,
		title: '查看督办内容',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '280px'],
		content:'/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/SuperviseView.html?content='+contentDic[id]
	}); 
} 

function ViewSuperviseAndReply(id){
	parent.layer.open({
		type: 2,
		title: '查看督办内容',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '480px'],
		content:'/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseView.html?id='+id
	}); 
}  