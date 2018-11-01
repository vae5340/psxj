$(function(){
	$('.theme-header-navigate-combobox').each(function(){
		$(this).combo('panel').panel({cls:"theme-header-navigate-combobox-panel"});
	});
	
	var theme_left_layout=$(".theme-layout").layout("panel",'west');
	var theme_left_menu_switch=true;
	$(".theme-left-menu-switch").on("click",function(event) {
		if(theme_left_menu_switch){
			$(".theme-left-user-panel").hide(); /*隐藏左侧菜单用户面板*/
			$(".theme-left-menu dl dd").hide(); /*隐藏左侧子菜单*/

			theme_left_layout.panel('resize',{width:50});
			$(".theme-left-menu").css({"width":"50px"});

			theme_left_menu_switch=false;
		}else{
			$(".theme-left-user-panel").show(); /*显示左侧菜单用户面板*/
			$(".theme-left-menu dl dd").show(); /*显示左侧子菜单*/

			theme_left_layout.panel('resize',{width:180});
			$(".theme-left-menu").css({"width":"180px"});

			theme_left_menu_switch=true;
		}
		$(".theme-layout").layout('resize', {width:'100%'}); /*重置框架*/
	});

	var theme_left_menu_switch_hide=true;
	$(".theme-left-menu-switch-hide").on("click",function(event) {
		if(theme_left_menu_switch_hide){
			//theme_left_layout.panel('resize',{width:1});
			$(".theme-layout").layout('remove','west'); 
			//$(".theme-left-layout").addClass('theme-left-layout-hide');
			theme_left_menu_switch_hide=false;
		}else{
			//theme_left_layout.panel('resize',{width:180});
			$(".theme-layout").layout('add',{
				region: 'west',
				bodyCls:'theme-left-layout',
				href:'menu_hide_left_content.html',
				border:false,
				width:200
			}); 
			//$(".theme-left-layout").removeClass('theme-left-layout-hide');
			theme_left_menu_switch_hide=true;
		}
		$(".theme-layout").layout('resize', {width:'100%'}); /*重置框架*/
	});


	$(".theme-left-menu dl dt,.theme-inside-left-menu dl dt").on("click",function(event) {
		if(theme_left_menu_switch){
			var node=$(this).next("dd");
			if(node.is(":hidden")){
	       		node.show(); /*如果元素为隐藏,则将它显现*/
			}else{
			    node.hide(); /*如果元素为显现,则将其隐藏*/
			}
		}
	});

	/*
	$(".theme-left-menu dl dt").on("mousemove",function(event) {
		if(!theme_left_menu_switch){
			var node=$(this).next("dd");
			node.addClass(".theme-left-menu-node-show");
			
		}
	});
	*/

	$(".theme-left-menu li").on("click",function(event){
		$(".theme-left-menu li").removeClass("selected");
		$(this).addClass("selected");
	});
	$(".theme-inside-left-menu li").on("click",function(event){
		$(".theme-inside-left-menu li").removeClass("selected");
		$(this).addClass("selected");
	});


	/*
	setInterval(function(){
		var nowDate  = new Date();
		var nowYear  = nowDate.getFullYear();
		var nowMonth = nowDate.getMonth().toString().length==1?"0"+nowDate.getMonth():nowDate.getMonth();
		var nowDays  = nowDate.getDate().toString().length==1?"0"+nowDate.getDate():nowDate.getDate();

		var nowHours = nowDate.getHours().toString().length==1?"0"+nowDate.getHours():nowDate.getHours();
		var nowMinute  = nowDate.getMinutes().toString().length==1?"0"+nowDate.getMinutes():nowDate.getMinutes();
		var nowSeconds  = nowDate.getSeconds().toString().length==1?"0"+nowDate.getSeconds():nowDate.getSeconds();

	    $("#theme-header-navigate-datetime").html(nowYear+"年"+nowMonth+"月"+nowDays+"日 "+nowHours+":"+nowMinute+":"+nowSeconds);
	},1000);
	*/
	

});