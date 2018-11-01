
/*
    子系统管理，前台编写好全部的子系统，根据后台发送的系统数据，进行系统名称名称，
    相同则显示。
*/

var screenHeihgt = 0;

$(function(){
    screenHeihgt = $(window).height();   
    var pageSize = $("#directoryNav ul li").length;
    var pageNow = 1;
    $.ajax({	
    	url:"/agsupport/ps-comb!getPsCombCount.action", 
    	dataType:"json", 
    	success:function (res) {
			//获取指定的设施类型
			var ssTypes4Index=new Array();
			for(var item in ssTypes){
				ssTypes[item].index = item;
				ssTypes[item].val = 0;
				ssTypes4Index.push(ssTypes[item]);
			}
			for(var i=0;i<res["rows"].length;i++){
				var r = res["rows"][i];
				for(var j =0;j<nnArea.length;j++){
					if($(nnArea[j].val).length<=0)
						nnArea[j].val = 0;
					if(nnArea[j].code==r.AREA){
						nnArea[j].val += parseInt(r.NUM);
					}
				}
				for(var m=0;m<ssTypes4Index.length;m++){			
					if(ssTypes4Index[m].index==r.EST_TYPE){
						ssTypes4Index[m].val += parseInt(r.NUM);
					}
				}
				for(var m=0;m<ssTypes4Index.length;m++){	
					$('#'+ssTypes4Index[m].layerId).html(ssTypes4Index[m].val+'&nbsp;');
				}
			}
			//console.log(ssTypes4Index);
			//console.log(nnArea);
			var tableInfo =$('#tableInfo');
			for(var j =0;j<nnArea.length;j++){//区
				var header = '';
				var rowHtml = '';
				var imgIndex = (j%10);
					imgIndex = imgIndex==0?5:imgIndex;
				if(Number(nnArea[j].code)>450109&&Number(nnArea[j].code)<450128)
					continue;
				if(j==0){//第一行
					header = '<tr class="headTr" style="font-size:12px" ><td width="" ><span style="font-size: 18px; font-family: 宋体;font-weight: bold;">城区</span></td>';
					rowHtml = '<tr style="font-size:12px" ><td width="" ><span">'+nnArea[j]['name']+'</span></td>';
				}
				else {
					rowHtml = '<tr style="font-size:12px" ><td width="" ><span">'+nnArea[j]['name']+'</span></td>';
				}
				for(var m=21;m<ssTypes4Index.length;m++){//设备类型
					//console.log(ssTypes4Index[m]);
					var val = 0;
					for(var i=0;i<res["rows"].length;i++){
						var r = res["rows"][i];
						if(r.AREA == nnArea[j].code && r.EST_TYPE == ssTypes4Index[m].index){
							val = r.NUM;
						}
					}
					if(j==0){//第一行
						header+='<td width=""><a class="a_title">'+ssTypes4Index[m]['layerName']+'</a></td>';
						rowHtml+='<td width="">'+val+'</td>';
					}
					else{
						rowHtml+='<td width="">'+val+'</td>';
					}
				}
				if(j==0 ){//第一行
					header+='<td width=""><a class="a_title">总计</a></td></tr>';
					$('#tableInfo').append(header);
					rowHtml+='<td width="">'+nnArea[j].val+'</td></tr>';
				}
				else {
					rowHtml+='<td width="">'+nnArea[j].val+'</td></tr>';
				}
				//console.log(header);
				$('#tableInfo').append(rowHtml);		
			}
		}
	});
	$.ajax({
		
    	url:"/agsupport/ps-comb!getPsCombCount.action", 
    	dataType:"json", 
    	success:function (data) {
			//行政区统计图
			
			var nnsArea=[];
			for(var k =0;k<nnArea.length;k++){				
				if(k<6 || k>11){					
					nnsArea.push(nnArea[k]);									
				}		
			}
			var districtArray=$.extend(true,{},nnsArea);			
			for(var i=0;i<data.rows.length;i++){
				for(var j=0;j<districtArray.length;j++){
					if(data.rows[i].AREA==districtArray[j].code){							
							if(districtArray[j].num==null)
								districtArray[j].num=data.rows[i].NUM;
							else
								districtArray[j].num+=data.rows[i].NUM;
						}
					}
			}
			//设施统计图
			var ssTypes4Index=new Array();
			
			for(var m=0;m<ssTypes.length;m++){
				if(m>=22&&m!=32){
					ssTypes[m].index = m;
					ssTypes[m].num = 0;	
					ssTypes4Index.push(ssTypes[m]);
				}
			}
			for(var i=0;i<data.rows.length;i++){
				for(var j=0;j<ssTypes4Index.length;j++){
					if(data.rows[i].EST_TYPE==ssTypes4Index[j].index){
						ssTypes4Index[j].num+=data.rows[i].NUM;
					}
				}
			}
			BulidChart(districtArray,ssTypes4Index);
		}
	});
})

function DirectoryNav($h,config){
        this.opts = $.extend(true,{
            scrollThreshold:0.5,    //滚动检测阀值 0.5在浏览器窗口中间部位
            scrollSpeed:700,        //滚动到指定位置的动画时间
            scrollTopBorder:500,    //滚动条距离顶部多少的时候显示导航，如果为0，则一直显示
            easing: 'swing',        //不解释
            delayDetection:200,     //延时检测，避免滚动的时候检测过于频繁
            scrollChange:function(){}
        },config);
        this.$win = $(window);
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
    //生成导航目录结构,这是根据需求自己生成的。如果你直接在页面中输出一个结构那也挺好不用 搞js
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
            temp.push('<li class="l1"><span class="c-dot"></span>'+index1+'. <a class="l1-text">'+text+'</a></li>');
        }else{
            index2++;
            temp.push('<li class="l2">'+index1+'.'+index2+' <a class="l2-text">'+text+'</a></li>');

        }
    });
    $directoryNav.find("ul").html(temp.join(""));

    //设置变量
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
    //console.log(st);
    var windowHeight = Math.round(this.$win.height() * this.opts.scrollThreshold);
    for(var i=0;i<offArr.length;i++){
        if((offArr[i] - windowHeight) < st) {
            var $curLi = this.$pageNavListLis.eq(i),
                tagTop = $curLi.position().top;
            $curLi.addClass("cur").siblings("li").removeClass("cur");
            this.curIndex = i;
            this.posTag(tagTop+this.$pageNavListLiH*0.5);
            //this.curIndex = this.$pageNavListLis.filter(".cur").index();
            this.opts.scrollChange.call(this);
        }
    }
},
bindEvent:function(){
    var This = this,
        show = false,
        timer = 0;
    this.$win.on("scroll",function(){
        var $this = $(this);
        clearTimeout(timer);
        timer = setTimeout(function(){
            This.scrollIng = true;
            if($this.scrollTop()>=This.opts.scrollTopBorder){
                if(!This.$pageNavListLiH) This.$pageNavListLiH = This.$pageNavListLis.eq(0).height();
                if(!show){
                    This.$pageNavList.fadeIn();
                    show = true;
                }
                This.ifPos( $(this).scrollTop() );
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
        This.scrollTo(This.offArr[index]);
    })
},
scrollTo: function(offset,callback) {
    var This = this;
    $('html,body').animate({
        scrollTop: offset-40
    }, this.opts.scrollSpeed, this.opts.easing, function(){
        This.scrollIng = false;
        //修正弹两次回调 蛋疼
        callback && this.tagName.toLowerCase()=='body' && callback();
    });
}
};


function showWindow(url){
	parent.backToMap();
	parent.changeMenuDataGrid("ssst");

	//iframe层
//	layer.open({
//	  type: 2,
//	  title: '详细',
//	  shadeClose: true,
//	  shade: 0.5,
//	  area: ['70%', '70%'],
//	  content: url //iframe的url
//	}); 	
}
function BulidChart(districtArray,ssTypes4Index){
	var districtNames=new Array();
	var districtNum=new Array();
	$.each(districtArray, function(i,obj){
		districtNames.push(obj.name);
		districtNum.push(obj.val);
	});
	
	var pieOption = {
	    tooltip: {},
	    xAxis: {
	        data: districtNames,
	        silent: false,
	        splitLine: {
	            show: true
	        },
	        axisLabel: {
	        	interval:0
	    	}
	    },
	    grid: {
	    	x: 30,
	    	y:10,
	    	x2: 00,
	    	y2: 80,
		},
	    yAxis: {
	    },
	    series: [{
	        name: '设施数量',
	        type: 'bar',
	        data: districtNum
	    }],
	    animationEasing: 'elasticOut',
	    animationDelayUpdate: function (idx) {
	        return idx * 5;
	    }
	};

	var pieChart = echarts.init(document.getElementById('pie-chart'));
	    pieChart.setOption(pieOption);
	    
	var FacilityNames=new Array();
	
	for(var i=0;i<ssTypes4Index.length;i++){
		FacilityNames.push(ssTypes4Index[i].layerName);
	}
	var FacilityValue=new Array();
	for(var i=0;i<ssTypes4Index.length;i++){
		FacilityValue.push(ssTypes4Index[i].val);
	}
	var pieOption2 = {
	    tooltip: {},
	    xAxis: {
	        data: FacilityNames,
	        silent: false,
	        splitLine: {
	            show: true
	        },
	        axisLabel: {
	        	interval:0
	    	}
	    },
	    grid: {
	    	x: 30,
	    	y:10,
	    	x2: 00,
	    	y2: 80,
		},
	    yAxis: {
	    },
	    series: [{
	        name: '设施数量',
	        type: 'bar',
	        data: FacilityValue
	    }],
	    animationEasing: 'elasticOut',
	    animationDelayUpdate: function (idx) {
	        return idx * 5;
	    }
	};

    var radarChart = echarts.init(document.getElementById('pie-chart2'));
    radarChart.setOption(pieOption2);
}