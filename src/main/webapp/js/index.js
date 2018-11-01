var pageNow = 1;
$(function(){
	var screenHeight = $(window).height();
	$(".container").height(screenHeight);
	$("#content").mCustomScrollbar({
		scrollInertia:550,
		scrollEasing:"easeOutCirc",
		mouseWheel:"auto",
		autoDraggerLength:true,
	});	
	var ismove=true;
	$(function(){
		$('body').mousewheel(function(event, delta) {
			if(ismove){
				ismove=false;
				scrollFun(delta);			
				setTimeout(function(){	
					ismove=true;
				},500);
			}
		});
	});
	function scrollFun(a) {
		var pageSize = $("#directoryNav ul li").length;
			if(a == -1){
				if(pageNow >0 && pageNow <= pageSize){
					pageNow++;
					pageChange(pageNow);				
				}else if(pageNow > pageSize){
					pageNow = pageSize;
					pageChange(pageNow);
				}else if(pageNow <= 1){
					pageNow = 1;
					pageChange(pageNow);
				}
				/* (pageNow>0 && pageNow <= pageSize)?++pageNow:
							  pageNow>pageSize?pageNow = pageSize:
							  pageNow <= 1?pageNow = 1:
							  pageNow;
				pageChange(pageNow); */
			}else if(a == 1){
				if(pageNow > 1){
					pageNow--;
					pageChange(pageNow);
				}else if(pageNow <= 1){
					pageNow = 1;
					pageChange(pageNow);
				}
			}
	}
	function pageChange(index){
		setTimeout(function(){
			$('#content').mCustomScrollbar("scrollTo","#table"+index);
			var mark = index-1;	
			var pageSize = $("#directoryNav ul li").length;
			if(mark<pageSize){$(".cur-tag").css("top",30+mark*34);}			
		},20);
	}
	var directoryNav = new DirectoryNav($("h2,h3"),{
        scrollTopBorder:0   
    });
})


function DirectoryNav($h,config){
        this.opts = $.extend(true,{
            scrollThreshold:0.9,    //æ»å¨æ£æµéå¼ 0.5å¨æµè§å¨çªå£ä¸­é´é¨ä½
            scrollSpeed:50,        //æ»å¨å°æå®ä½ç½®çå¨ç»æ¶é´
            scrollTopBorder:500,    //æ»å¨æ¡è·ç¦»é¡¶é¨å¤å°çæ¶åæ¾ç¤ºå¯¼èªï¼å¦æä¸º0ï¼åä¸ç´æ¾ç¤º
            easing: 'linear',        //ä¸è§£é
            delayDetection:1,     //å»¶æ¶æ£æµï¼é¿åæ»å¨çæ¶åæ£æµè¿äºé¢ç¹
            scrollChange:function(){}
        },config);
        this.$win = $(window);
        this.$body =$("body")
        this.$h = $h;
        this.$pageNavList = "";
        this.$pageNavListLis ="";
        this.$curTag = "";
        this.$pageNavListLiH = "";
        this.offArr = [];
        this.curIndex = 0;
        this.scrollIng = false;
        this.init();
    }

DirectoryNav.prototype = {
init:function(){
    this.make();
    this.setArr();
    this.bindEvent();
},
make:function(){
    //çæå¯¼èªç®å½ç»æ,è¿æ¯æ ¹æ®éæ±èªå·±çæçãå¦æä½ ç´æ¥å¨é¡µé¢ä¸­è¾åºä¸ä¸ªç»æé£ä¹æºå¥½ä¸ç¨ æjs
    $("body").append('<div class="directory-nav" id="directoryNav"><ul></ul><span class="cur-tag"></span><span class="c-top"></span><span class="c-bottom"></span><span class="line"></span></div>');
    var $hs = this.$h,
        $directoryNav = $("#directoryNav"),
        temp = [],
        index1 = 0,
        index2 = 0;
    $hs.each(function(index){
        var $this = $(this),
        text = $this.text();
        if(this.tagName.toLowerCase()=='h2'){
            index1++;
            if(index1%2==0) index2 = 0;
            temp.push('<li class="l1"><span class="c-dot"></span>'+index1+'. <a class="l1-text" href="#table'+index1+'">'+text+'</a></li>');
        }else{
            index2++;
            temp.push('<li class="l2">'+index1+'.'+index2+' <a class="l2-text" href="#table'+index2+'">'+text+'</a></li>');

        }
    });
    $directoryNav.find("ul").html(temp.join(""));

    //è®¾ç½®åé
    this.$pageNavList = $directoryNav;
    this.$pageNavListLis = this.$pageNavList.find("li");
    this.$curTag = this.$pageNavList.find(".cur-tag");
    this.$pageNavListLiH = this.$pageNavListLis.eq(0).height();

    if(!this.opts.scrollTopBorder){
        this.$pageNavList.show();
    }
},
setArr:function(){
    var This = this;
    this.$h.each(function(){
        var $this = $(this),
            offT = Math.round($this.offset().top);
        This.offArr.push(offT);
    });
},
posTag:function(top){
    this.$curTag.css({top:top+'px'});
},
ifPos:function(st){
    var offArr = this.offArr;
    //var windowHeight = Math.round(this.$win.height() * this.opts.scrollThreshold);
    var windowHeight = Math.round(this.$win.height());
    var scrolled=true;
            
    for(var i=1;i<offArr.length;i++){
        if((offArr[i-1] - windowHeight) < st&&(offArr[i] - windowHeight) > st) {
            scrolled=false;
            var $curLi = this.$pageNavListLis.eq(i-1),
            tagTop = $curLi.position().top;
            $curLi.addClass("cur").siblings("li").removeClass("cur");
            this.curIndex = i-1;
            this.posTag(tagTop+this.$pageNavListLiH*0.5);
            //this.curIndex = this.$pageNavListLis.filter(".cur").index();
            this.opts.scrollChange.call(this);
        
       }
      }
       if(scrolled)
       {
           var $curLi = this.$pageNavListLis.eq(offArr.length-1),
            tagTop = $curLi.position().top;
            $curLi.addClass("cur").siblings("li").removeClass("cur");
            this.curIndex = offArr.length-1;
            this.posTag(tagTop+this.$pageNavListLiH*0.5);
            //this.curIndex = this.$pageNavListLis.filter(".cur").index();
            this.opts.scrollChange.call(this);
       }

},
bindEvent:function(){
    var This = this,
        show = false,
        timer = 0;
    this.$body.on("scroll",function(){
        var $this = $(this);
        var scrollTop =document.body.scrollTop;                
        clearTimeout(timer);
        timer = setTimeout(function(){
            This.scrollIng = true;
            if(scrollTop>=This.opts.scrollTopBorder){
                if(!This.$pageNavListLiH) This.$pageNavListLiH = This.$pageNavListLis.eq(0).height();
                if(!show){
                    This.$pageNavList.fadeIn();
                    show = true;
                }
                This.ifPos(scrollTop);
            }else{
                if(show){
                    This.$pageNavList.fadeOut();
                    show = false;
                }
            }
       },This.opts.delayDetection);
    });

     this.$pageNavList.on("click","li",function(){
        var $this = $(this),
            index = $this.index();
            pageNow=index+1;			 
			if(index == 0){
				$(".cur-tag").css("top",30);
			}else if(index == 1){
				$(".cur-tag").css("top",64);
			}else if(index == 2){
				$(".cur-tag").css("top",98);
			}else if(index == 3){
				$(".cur-tag").css("top",132);
			}else if(index == 4){
				$(".cur-tag").css("top",166);
			};			
			var $target = $($this.find("a").attr("href")); 			
            $('#content').mCustomScrollbar("scrollTo",$target);			
    })
},

scrollTo: function(offset,callback) {
    var This = this;
	//$(".container:eq(0)").css("margin-top",-(offset-40));
	
    $("html,body").animate({
        scrollTop: offset-40
    }, this.opts.scrollSpeed, this.opts.easing, function(){
        This.scrollIng = false;
        //ä¿®æ­£å¼¹ä¸¤æ¬¡åè° èç¼
        callback && this.tagName.toLowerCase()=='body' && callback();
    }); 
}
};

