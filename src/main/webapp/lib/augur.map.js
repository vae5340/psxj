
/**************************开始***************************/
$(document).ready(function () {
    /*$("input").on({
        blur: function () { 
        	if(this.placeholder ==""){
        		this.placeholder = "查找河涌水系、城中村";
        	}
        }
    });*/
    var toggle = true;
    $("#search-input-btn").on("click", function () {
        //if (toggle) {
        //    $("#search").animate({ width: "335px" }, 1000);
        //    $("#inputBox").animate({ width: "80%" }, 1000);
        //    toggle = false;
        //}
        //else {
        //    $("#search").animate({ width: "58px" }, 1000);
        //    $("#inputBox").animate({ width: "0" }, 1000);
        //    toggle = true;
        //}
        layerQuery();
    });
    /*关闭信息显示框按钮*/
    var mark = true;
    $("#toggleLayer").click(function () {
        if (mark) {
            $("#selectLayer").slideDown("slow");
            $(this).addClass("icon-up").removeClass("icon-bottom");
            mark = false;
        } else {
            $("#selectLayer").slideUp("slow");
            $(this).addClass("icon-bottom").removeClass("icon-up");
            mark = true;
        }
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
            var measureName = $(this).text();
            switch (measureName) {
                case "测线":
                    break;
                case "测面":
                    break;
            }
        });
    });

    $("#list3").each(function (i, obj) {
        $(obj).find("a").on("click", function () {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
			//var checkStatues = $(this).siblings().find("input[type=checkbox]").is(':checked');
			//if(checkStatues === true){
			//	$(this).siblings().find("input[type=checkbox]").prop("checked",false);
			//}else if(checkStatues === false){
			//	$(this).siblings().find("input[type=checkbox]").prop("checked",true);
			//};
            var layer = map.getLayer($(this).attr("class"));
            layer.setVisibility(!layer.visible);
            $(this).siblings().find("input[type=checkbox]").prop("checked", layer.visible);
        });
    });
    $("#list4").each(function (i, obj) {
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

    $("#list5").each(function (i, obj) {
        $(obj).find("a").on("click", function () {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
            var measureName = $(this).text();
        });
    });

    $("input").filter('.layerSwitch').each(function (i, obj) {
        $(obj).on("click", function () {
            var parParent = $(obj).parent().parent();
            parParent.addClass("highlight").siblings().removeClass("highlight");
            var aEle = parParent.find("a");
            var layer = map.getLayer(aEle.attr("class"));
            layer.setVisibility(!layer.visible);
            $(obj).prop("checked", layer.visible);
        });
    });

    $(".layerStyle").each(function (i, obj) {
        $(obj).find("a").on("click", function (obj) {
            $(this).parent().addClass("highlight").siblings().removeClass("highlight");
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
    	//var ditu = map.getLayer("DiTu");
    	var vec = map.getLayer("vec");
    	var yingxiang = map.getLayer("img");
    	//var yingxiang_cia = map.getLayer("WeiXingYingXiang_cia");
    	//var dem = map.getLayer("gw_3");
        var actionName = $(this).data("name");
        switch (actionName) {
            case "normalMap":
            	//yingxiang.hide();
            	//ditu.show();
            	//vec.show();
            	//ditu.setVisibility(true);
            	vec.setVisibility(true);
            	yingxiang.setVisibility(false);
            	//yingxiang_cia.setVisibility(false);
            	//dem.setVisibility(false);
                break;
            case "earth":
            	//ditu.hide();
            	//vec.hide();
            	//yingxiang.show();
                //ditu.setVisibility(false);
            	vec.setVisibility(false);
            	yingxiang.setVisibility(true);
            	//yingxiang_cia.setVisibility(true);
            	//dem.setVisibility(false);
                break;
            case "dem":
            	//ditu.hide();
            	//vec.hide();
            	//yingxiang.hide();
            	//dem.show();
                //ditu.setVisibility(false);
            	//yingxiang.setVisibility(false);
            	//vec.setVisibility(false);
            	//dem.setVisibility(true);
            break;
        }
        $(this).addClass("active").siblings().removeClass("active");
    });
    $("#closeExpand").bind("click", function () {
        closeInfo();
    });
    $("#closeAll").bind("click", function () {
        $(".allInfoBox").hide();
    });
    $("#extentResultCloseAll").bind("click", function () {
        $("#extentResultWindow").hide();
    });
	$("#popupVideoWindowCloseAll").bind("click", function () {
        $("#popupVideoWindow").hide();
    });
    
	$(".tab_box").find("a").on("click", function () {
        $(".tab_box").find("a").each(function (i, obj) {
        	$(this).removeClass("active");
        	$(".content_box").find("#"+$(this).eq(0).attr('id')+"_content").hide();
        });
        $(this).addClass("active");
        $(".content_box").find("#"+$(this).eq(0).attr('id')+"_content").show();
	});
    
    var tabShow=true;
    
    $("#search-clear-btn").click(function () {
		$("#search_box").slideUp(500);
		document.getElementById('tab_box').innerHTML="";
		document.getElementById('tab_ContentAll').innerHTML="";
		$("#sole-input").value="";
		$(this).hide();
    });

	$(".pullup").bind("click", function () {
        $(".tab_box").slideToggle(500);
		if(tuliShow==true){
			tuliShow=false;
			$(this).addClass("pullup").removeClass("pulldown");
		}
		else{
			tuliShow=true;
			$(this).addClass("pulldown").removeClass("pullup");
		}
        
    });
    
    var tuliShow=false;
	$("#tuliSlideBtn").bind("click", function () {
		$(".tl_icon").slideToggle(1000);
		if(tuliShow==true){
			tuliShow=false;
			$(this).addClass("arrow_up").removeClass("arrow_down");
		}
		else{
			tuliShow=true;
			$(this).addClass("arrow_down").removeClass("arrow_up");
		}
		return false;
    });
    
	$("#tool_selectTool").bind("click", function () {
		$("#layer_box").slideToggle(100);
		return false;
    });
    
	$("#btn_HideLayerControl").bind("click", function () {
		$("#layer_box").slideToggle(100);
		return false;
    });
    
    $(".tool_btn").mouseenter(function () {
		$(".tool_btn .sub_toolmenu").show();
	});
    
	$(".tool_btn").mouseleave(function () {
		$(".tool_btn .sub_toolmenu").hide();
	});

    $(".tool_btn_layer").mouseenter(function () {
        $(".tool_btn_layer .sub_toolmenu").show();
    });

    $(".tool_btn_layer").mouseleave(function () {
        $(".tool_btn_layer .sub_toolmenu").hide();
    });
    
});
function showData() {
    $(".expandBox").animate({ width: "25em" }, "slow");
}
function closeInfo() {
    $(".expandBox").animate({ width: "0em" }, "slow");
}
/**************************结束***************************/