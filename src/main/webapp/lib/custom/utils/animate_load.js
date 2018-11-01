(function($,window,document,undefined){
	var pluginName = "loading",//插件调用名
	//默认属性
	defaults = {
		
		height: 12.7,	//元素高
		top:"5em",			//元素距离顶端位置
		left:"0",		//元素距离左端位置
		linetick:1,			//警戒线

		width: "inherit",   //元素宽
		tickHeight:1,		//蓝色方块刻度		
		
		hasTwo:false,		//是否有两种水位情况,默认只有一种水位。水闸有两种情况
		width_l: "60%",   	//左边元素宽
		width_r: "40%",   	//右边元素宽	
		tickHeight_l:1,		//蓝色方块刻度
		tickHeight_r:1,		//蓝色方块刻度
	};
	//参数:元素，属性
	function Plugin(element,options){
		this.element = $(element);
		this.settings = $.extend({},defaults,options);//扩展属性，将defaults和options属性添加到第一个参数并返回，有相同属性就覆盖
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	//面向对象，设置原型
	Plugin.prototype = {
		
		//初始化函数
		init:function(){
			var $this = this.element,//绑定元素								
				$height = this.settings.height,
				$width = this.settings.width,
				$top = this.settings.top,
				$left = this.settings.left,
				$hasTwo=this.settings.hasTwo,
				$linetick = this.settings.linetick,
				lineHeight = $height - $height * $linetick ,
				obj = this;//调用对象
				//公共部分
				$this.css({
					"top":$top,
					"left":$left,
					"height":$height+"em",
					"width":$width
				}).find(".line").css({
					"bottom":-$height+"em"
				}).animate({
					"top":lineHeight+"em",					
				},500)
				.end()
				.find(".lineTip").css({					
					//"bottom":-$height+"em"
				})
				.animate({
					"top":(lineHeight-1.5)+"em"					
				},1000);	

				if($hasTwo){
					var $width_r = this.settings.width_r,	
					$width_l = this.settings.width_l,
					$tickHeight_l = this.settings.tickHeight_l,				
					currentHeight_l=$height * $tickHeight_l;
					topHeight_l = $height -currentHeight_l ,
					$tickHeight_r = this.settings.tickHeight_r,
					currentHeight_r=$height * $tickHeight_r;
					topHeight_r = $height - currentHeight_r;
					$this.find(".box_r").css({
						"width":$width_r,					
					}).animate({					
						"height":currentHeight_r+"em",
						"top":topHeight_r+"em"
					},500)			
					.end()
					.find(".box_l").css({
						"width":$width_l,					
					}).animate({					
						"height":currentHeight_l+"em",
						"top":topHeight_l+"em"
					},500)			
					.end()
				}else{
					var $width = this.settings.width,
					$tickHeight = this.settings.tickHeight,
					currentHeight = $height * $tickHeight,
					topHeight = $height - currentHeight,
					$linetick = this.settings.linetick;
					$this.find(".box").css({
						"width":$width,					
					})
					.animate({					
						"height":currentHeight+"em",
						"top":topHeight+"em"
					},500)			
					.end()
				}	
							
		}
	};
	
	$.fn[pluginName] = function(options){
		this.each(function(){
			var el = $(this);
			if(el.data(pluginName)){
				el.data(pluginName).remove();
			}
			el.data(pluginName,new Plugin(this,options));
		});		
		return this;
	};
})(jQuery,window,document);