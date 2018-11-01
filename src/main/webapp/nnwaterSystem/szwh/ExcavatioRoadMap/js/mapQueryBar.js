var awaterui=(function(){
	return{
		//创建地图查询菜单
		mapQueryBar:function(){
			var innerHtml='<div class="queryBar" style="bottom:-365px;">'+
				'<div class="top-queryBar" status="flod"><a id="togger_link" href="#">查询条件<em1></em1></a></div>'+
				'<div class="content-queryBar clearfix"><iframe id="queryIframe" name="queryIframe" frameborder="0" src="queryBar.html" style="width:100%;height:100%;overflow: hidden;"></iframe></div></div>';
			$("#mapDiv").append(innerHtml);
			$(".queryBar").animate({ bottom: - $(".queryBar").height()+25 }, 100);
			$(".top-queryBar").attr("status","flod");
			$(".top-queryBar").click(function(){ 
				var status=$(".top-queryBar").attr("status");
				if(status=="flod"){
					$(".queryBar").animate({ bottom: - $(".queryBar").height()+300 }, 100);
					$(".top-queryBar").attr("status","unflod");
					$(".top-queryBar").html("<a id=\"togger_link\" href=\"#\">查询内容<em></em>");
				} else {
					$(".queryBar").animate({ bottom: - $(".queryBar").height()+25 }, 100);
					$(".top-queryBar").attr("status","flod");
					$(".top-queryBar").html("<a id=\"togger_link\" href=\"#\">查询内容<em1></em1>");
				}
			});
			$(".top-queryBar").click();
		}
	}
})();