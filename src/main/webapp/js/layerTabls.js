//三级菜单弹出框
function openLayer(url,text){
	//有
	if($("#layer-frame").attr("src") && url && url!="undefined" && url!=""){
		$("#layer-frame").attr("src",url);
	}else{//第一次
		if(url && url!="undefined" && url!=""){
			var html ='<iframe src="'+url+'" id="layer-frame" style="width:100%;height:100%" frameborder="no"></iframe>';
			$(html).appendTo("#smainPanel");
			$("#smainPanel").css("width", 464);
	        $(".desktop-map").css("left", 304+200);
	        $(".desktop-map").css("width", $(".desktop-map").width()-200);
		}
	}
	/*layer.open({
		type: 2,
		title: text,
		shade: 0,
		maxmin: true,
		offset: 'r',
		offset: 'rb',
		area: ['400px', '600px'],
		resize : false,
		content: [url,'yes']
	});*/
	//显示
	//三级菜单隐藏
	/*$("#smainPanel").animate({
        width: "hide",
        paddingLeft: "hide",
        paddingRight: "hide",
        marginLeft: "hide",
        marginRight: "hide"
    }, 300);*/
	//弹出页面
	/*$("#smainPanel_ifarme").animate({
        width: "show",
        paddingLeft: "show",
        paddingRight: "show",
        marginLeft: "show",
        marginRight: "show"
    }, 300);
	setTimeout(function () {
		var mapLeft=$(".desktop-map").css("left");
		if(mapLeft=="304px"){
			$(".desktop-map").css("left", 768);
	        $(".desktop-map").css("width", $(".desktop-map").width()-464);
	        $("#sidebar a").addClass("hover");
		}else if(mapLeft=="0px"){
			
		}
	       
    }, 300);*/
}
function hideLayer(){
	var left = $("#smainPanel_ifarme").css("left");
	setTimeout(function () {
		if(left=="300px"){
			$("#smainPanel_ifarme").css("left", 0);
			$(".desktop-map").css("left", 304);
	        $(".desktop-map").css("width", $(".desktop-map").width()+464);
	        $("#sidebar a").addClass("hover");
		}else{
			var mapLeft=$(".desktop-map").css("left");
			if( mapLeft == "768px")	
		        $(".desktop-map").css("left", 304);
		        $(".desktop-map").css("width", $(".desktop-map").width()+564);
		        $("#sidebar a").addClass("hover");
		}
			
		
    }, 300);
}

