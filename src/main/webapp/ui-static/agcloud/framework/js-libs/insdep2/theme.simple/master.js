(function($){
	"use strict";
	function layout(){
		$('.theme-console').panel('resize',{
			width: "100%",
			height: ($(window).height()-50)+"px"
		});
		$(".theme-left-menu").css({ height:($(window).height()-70)+"px"});
	}
	$(function(){
		
		var consoled=$('.theme-console').panel({border:false});
		$(".theme-left-menu dl").each(function(){
		    var obj=$(this).find("dt");
		    var list=$(this).find("dd ul");
		    var icons=obj.attr("icons");
			if(typeof(icons)!="undefined"){
				obj.html(obj.html()+"<div class='iconcode'>"+icons+"</div>");
			}
			/*
			$(this).find("dd ul li").each(function(){
				var li=$(this);
				var li_icons=li.attr("icons");
				if(typeof(li_icons)!="undefined"){
					li.html(li.html()+"<div class='iconcode'>"+icons+"</div>");
				}
			});
			*/
		    
		});

		layout();
		$(window).resize(function() {
			layout();
		});
		$('.theme-header-navigate-combobox').each(function(){ $(this).combo('panel').panel({cls:"theme-header-navigate-combobox-panel"});});
		
		var theme_left_menu_switch=true;
		$(".theme-left-menu,.theme-inside-left-menu").on("click","dl dt",function(event) {
			if(theme_left_menu_switch){
				var node=$(this).next("dd");
				var dt=node.prev("dt");
				var li=node.find("ul li");
				if(node.is(":hidden")){
					(li.hasClass("hover")?dt.removeClass('hover'):"");
		       		node.show();
				}else{
					(li.hasClass("hover")?dt.addClass('hover'):"");
				    node.hide();
				}
			}
		});

		$(document).on("mouseover",".theme-left-indent-menu dl dt",function(event) {

			$(".theme-left-indent-menu dl dt").removeClass("active");
			$(".theme-left-indent-menu-panel").remove();

			var _this_=$(this);
			
			if(!theme_left_menu_switch){
				var node=$(this).next("dd");
				var ul=node.find("ul");
				if(ul.length > 0){
					_this_.addClass("active");
					if($(".theme-left-indent-menu-panel").length==0){
						$("body").append("<div class='theme-left-indent-menu-panel'><ul>"+ul.html()+"</ul></div>");
						$(".theme-left-indent-menu-panel").css({
							top: _this_.offset().top+"px"
						});
					}
				}
			}
		});
		$(document).on("mouseout",".theme-left-indent-menu-panel",function(event) {
			$(".theme-left-indent-menu dl dt").removeClass("active");
			$(".theme-left-indent-menu-panel").remove();
		});

		$(".theme-left-menu-switch").on('click',function(event) {
			if(theme_left_menu_switch){

				$(".theme-left-menu dl dt").removeClass("hover");
				$(".theme-left-menu dl dd").hide();

				$(".theme-left-layout").css({ width:"49px"});
				$(".theme-right-layout").css({ left:"50px"});

				$(".theme-left-logo").addClass('theme-left-mini-logo');
				$(".theme-left-menu").addClass('theme-left-indent-menu');

				theme_left_menu_switch=false;
			}else{
				$(".theme-left-menu dl dd").show();

				$(".theme-left-layout").css({ width:"199px"});
				$(".theme-right-layout").css({ left:"200px"});

				$(".theme-left-logo").removeClass('theme-left-mini-logo');
				$(".theme-left-menu").removeClass('theme-left-indent-menu');

				theme_left_menu_switch=true;
			}
			layout();
			
		});

		function menu_event(obj,event){

			$(".theme-left-menu *").removeClass('hover');
			obj.addClass('hover');


			
			var href=obj.attr("href");
			if(typeof(href)!="undefined"){
				/*console.log(href);*/
				consoled.panel({"href":href});
				//$('.theme-console').panel({border:false,href:href});
			}
			

		};

		$(".theme-left-menu").on("click","dl dt",function(event) {
			var t=$(this);
			(!t.next("dd").find("ul li").length > 0?menu_event(t,event):"");
		});
		$(".theme-left-menu").on("click","dl dd ul li",function(event) {
			menu_event($(this),event);
		});
		

	});

	$.insdep.theme.operate = function(c) {
		var c = (typeof c == 'string'?{"href":c}:c);
		var d = {
				object:".theme-console",
				module:"panel",
				href:"",
				method:"post",
				queryParams:{}
			};
		var opts = $.extend(true,d,c);
		switch(opts.module)
		{
		case "tab":
			break;
		case "window":
			var e={
               id:"temp-window",
               href:"",
               cache:false,
               width : 680,
               height : 550,
               modal : true,
               title:"",
               border:false,
               collapsible:false,
               minimizable:false,
               maximizable:false,
               queryParams:"",
               onClose:function() {
                  $(this).window('destroy');
               },
               buttons:[]
			};
			opts=$.extend(true,e,opts);

		  	$('<div/>').window(opts);
		  break;
		case "panel":
		default:
			$(opts.object).panel({    
				href:opts.href,
				cache:false,
				method:opts.method,
				queryParams:opts.queryParams?opts.queryParams:{},    
				onLoad:function(){},
				onBeforeLoad:function(){$(this).panel('clear');},
				onDestroy:function(){}
			});
		}

	};
	$.insdep.theme.href=function(c){
		$.insdep.theme.operate({"href":c});
	};
	$.insdep.theme.window=function(c){
		var d = { module:"window"};
		var opts = $.extend(true,d,c);
		$.insdep.theme.operate(opts);
	};
	$.insdep.theme.windowClose=function(c){
		$((c?c:"#temp-window")).window('destroy');
	};

})(jQuery);