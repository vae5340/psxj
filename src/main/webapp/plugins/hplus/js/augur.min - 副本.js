$(document).ready(function () {
    $("input").on({
        focus: function () {
            $("#selectLayer").slideDown("slow");
        },
        blur: function () { this.placeholder = "查找河涌水系、城中村"; }
    });
    /*搜索功能*/
//        	var str = [
//        						'<div class="infoTitle">'
//        				,			'<ul class="infoTitle-t clear">'
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="showData()">详情</a></li>'								
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="alert(1231)">详情</a></li>'
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="alert(1231)">详情</a></li>'
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="alert(1231)">详情</a></li>'
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="alert(1231)">详情</a></li>'
//        				,				'<li><h3>地铁B涌</h3><strong>荔湾区</strong><a href="#" onclick="alert(1231)">详情</a></li>'
//        				,			'</ul>'										
//        				,		'</div>'
//        		].join('');
    $("#search-button").click(function () {
        $(".infoPanel").css({ "border-top": "1px solid #fff"})
			.mCustomScrollbar({
			    mousewheelPixels: 300,
			    scrollButtons: {
			        scrollType: 'pixels',
			        enable: true,
			        scrollAmount: 40
			    }
			});
        layerQuery();
//        $(".infoBox").html(str);
//        $(".infoPanel").mCustomScrollbar("update");
    });
    /*关闭信息显示框按钮*/
    $("#closeLayer").click(function () {
        $("#selectLayer").slideUp("slow");
		closeInfo();
    });

    /*工具栏弹出框*/
    $(".down").each(function (i, obj) {
        $(obj).hover(
			function () {
			    $(this).find("ul").stop(true, true).fadeIn();
			},
			function () {
			    $(this).find("ul").stop(true, true).fadeOut();
			}
		);
    });
    $("#list1").each(function (i, obj) {
        $(obj).find("a").on("click", function () {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
            var measureName = $(this).text();
            switch (measureName) {
                case "测线":
                    break;
                case "测面":
                    break;
            }
        });
    });
    $("#list2").each(function (i, obj) {
        $(obj).find("a").on("click", function () {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
            var layer = map.getLayer($(this).attr("class"));
            layer.setVisibility(!layer.visible);
        });
    });

    $(".layerStyle").each(function (i, obj) {
        $(obj).find("a").on("click", function (obj) {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
            selectLayer = map.getLayer($(this).attr("class"));
        });
    });

    $("#mapType").hover(
		function () {
		    $("#mapType-wrapper").addClass("expand");
		},
		function () {
		    $("#mapType-wrapper").removeClass("expand");
		}
	)
    $("[data-name]").on("click", function () {
        var actionName = $(this).data("name");
        switch (actionName) {
            case "normalMap":
                //  alert(actionName);
                layerVisible(shiliangLayer, true);
                layerVisible(yingxiangLayer, false);
                break;
            case "earth":
                //     alert(actionName);
                layerVisible(shiliangLayer, false);
                layerVisible(yingxiangLayer, true);
                break;
        }
        $(this).addClass("active").siblings().removeClass("active");
    });	
	$("#closeExpand").bind("click",function(){
		closeInfo();
	});
	$("#closeAll").bind("click",function(){
		$(".allInfoBox").hide();
	});
});
function showData(){	
	$(".expandBox").animate({width:"25em"},"slow");
}
function closeInfo(){
	$(".expandBox").animate({width:"0em"},"slow");
}