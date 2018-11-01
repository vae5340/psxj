﻿var awaterui=(function(){
	return{
		//地图工具栏创建
		toolbar:function(){
			//1.构造工具栏容器
			var toolbar='<div class="tool-box">'+
						'<div class="tool-container clearfix">';
			//2.遍历父节点，增加一级菜单
			for(var i=0;i<mapToolbarSet.items.length;i++){
				var item=mapToolbarSet.items[i];
				var id=item.id;
				var name=item.name;
				var child=item.children;
				var checked=item.checked;
				var imgSrc=item.imgSrc;
				var onclick=item.onclick;
				//2.1 构造一级菜单，并且绑定事件
				toolbar+='<div class="noline tool">';
				if(child instanceof Array){
					toolbar+='<a id='+id+' href="#" onclick='+onclick+'><b><img  src="'+imgSrc+'">'+name+'</b><em></em></a><ul class="menu-xl">';
					//3.遍历子节点，构造二级菜单并绑定事件
					  for(var j=0;j<child.length;j++){
						  var toolId=child[j].id;
						  var toolName=child[j].name;
						  var toolImg=child[j].imgSrc;
						  var toolOnclick=child[j].onclick;
						  toolbar+='<li><a id='+toolId+' href="#" onclick='+toolOnclick+'><img  src="'+toolImg+'">'+toolName+'</a></li>';
					  }
					  toolbar+='</ul>';
				}else if(checked){
					toolbar+='<a id='+id+' href="#" onclick='+onclick+'><b>'+name+'</b><em></em></a>';
				}else{
					toolbar+='<a id='+id+' href="#" onclick='+onclick+'><img  src="'+imgSrc+'">'+name+'</a>';
				}
				toolbar+='</div>';			  
				}			  
			 toolbar+='</div>'
			 '</div>';
			$(".J_iframe").append(toolbar);
		},
		//创建图例菜单
		mapLegend:function(){	
			if(!mapLegendSet.show)return;
			var legend='<div class="legend" style="bottom:-365px;">'+
				'<div class="top-legend" status="flod"><a id="togger_link" href="#">图例<em1></em1></a></div>'+
				'<div class="content-legend clearfix">'+
				'<ul id="treeLegend" class="ztree">'/*'<ul class="list-legend">'*/;
			legend+='</ul></div></div>';
			$(".J_iframe").append(legend);
			mapLegendClickHandler();
			if(!mapLegendSet.toggle){		
				$(".legend").animate({ bottom: -$(".legend").height()+30 }, 100);
				$("#togger_link").html("图例<em1></em1>");
				$(".top-legend").attr("status","flod");
			} else {
				$(".legend").animate({ bottom: 0 }, 100);
				$("#togger_link").html("图例<em></em>");
				$(".top-legend").attr("status","unflod");
			}
			$.fn.zTree.init($("#treeLegend"), mapLegendSet.ztree.setting, mapLegendSet.ztree.zNodes);
		},
		//创建图例菜单
		mapAlarm:function(){	
			if(!mapLegendSet.show)return;
			var legend='<div class="legend">'+
			'<div class="top-legend" status="unflod"><a id="togger_link" href="#">图例<em></em></a></div>'+
			'<div class="content-legend clearfix">'+
			'<ul class="list-toptitle">';
			//1.遍历父节点，增加一级菜单
			for(var i=0;i<mapLegendSet.items.length;i++){
				var item=mapLegendSet.items[i];
				var id=item.id;
				var name=item.name;
				var checked=item.checked;
				if(checked){
					legend+= '<li class="oneMenu">';
				}else{
					legend+= '<li>';
				}
				legend+='<a id="'+id+'" onclick="checkChildId(this),toggleStyle(this)">'+name+'</a></li>';
			} 
            //增加二级菜单，调用childInit方法			
			//legend+='</ul>'+childInit()+'</div></div>';
			legend+='</ul></div></div>';
			$(".J_iframe").append(legend);
		},
		//创建地图报警弹出
		alarmWindow:function(){
			setInterval("ShowAlarmWinInterval()",10000);
		},
		mapForecast:function(){
			var legend='<div class="legend" scrolling="no" style="opacity:0.8;position:absolute;left:0px;top:125px;z-index:21;height:47px;">'+
				'<iframe style="width:295px;height:47px;overflow-x:none;border:none;"'+
				' src="nnwaterSystem/Alarm/WeatherInfo.html"></iframe></div>';
			$(".J_iframe").append(legend);
		},
		//创建图例菜单
		alarmBJInfo:function(){
			$.ajax({
				method : 'GET',
				url : '/psxj/meteo-hydrolog-alarm!NewestAlarm.action',
				async : true,
				dataType : 'json',                                                  
				success : function(data) {
					if(data.form){
						var imgSrc='/psxj'+data.imgsrc;
					    var time=getCNLocalTime(data.form.alarmTime.time);
					    var imghtml="<div style=\"position: absolute;left:292px;top:0px;z-index: 30;\"><img id=\"img\" src=\""+imgSrc+"\" width=\"100\" height=\"85\" /></div>";
					    $(".J_iframe").append(imghtml);
					    var texthtml="<div style=\"position: absolute;left:392px;top:0px;z-index: 30;\"><p style=\"margin: 0px; background-color: white;\"><font id=\"time\">"+time+"</font>市气象局发布<font id=\"title\" style=\"color: red;\">"+data.form.alarmTitle+"</font></p></div>";
						$(".J_iframe").append(texthtml);
					}
				},
				error : function() {
					parent.layer.msg('获取气象报警信息失败');
				}
			});
		},
		addressLocate:function(){
            var locator="<style>input#searchInput::-ms-clear{display:none;}</style><div class='input-group' style='position:absolute;right:10px;top:55px;z-index:31;width:293px;height:35px'>"+
            "<input id='searchInput' type='text' style='width:253px;height:35px;padding-left:10px' placeholder='搜地点、道路'onkeypress='goSearch(event)' onkeydown='goSearch(event)'>"+
            "<a href='javascript:;' class='clearInput' style='display:none;'></a><span class='input-group-btn'>"+
		    "<button id='searchBtn' class='btn btn-default' style='background:#fff;height:35px;width:40px;background-image:url(/awater/img/search.png);"+
		    "background-repeat:no-repeat;background-position:50% 50%' type='button' onclick='goSearch(event)'></button></span></div>"+
            "<div class='panel panel-default' id='searchPanel' style='position:absolute;display:none;right:10px;top:90px;z-index:31;width:293px'>"+
            "<div class='panel-body' style='height:348px;padding:0px'><iframe id='searchPanelContent' width='100%' height='100%' frameborder='0'></iframe></div></div>";    
		    $(".J_iframe").append(locator);
		},
		partsChange:function(){
			//setInterval("ShowAlarmWinParts()",10000);
			var topHtml = '<div class="tool-box" id="tool-box-top"' +
				'style="height:10%;overflow:auto;right:-6px;"></div>';
			$(".J_iframe").append(topHtml);
		},
		featureLayers : {
			'tool_gaw':{"layerName":"管网数据","layerId":'gw_1','className':'','check':true},
            'tool_check':{"layerName":"数据上报","layerId":'map_rep','className':'','check':false},
            'tool_problem':{"layerName":"问题上报","layerId":'wtsbXx','className':'','check':false},
            'ronghe':{"layerName":"数据融合","layerId":'sjrh_tc','className':'','check':false},
            'tool_psh':{"layerName":"排水户上报","layerId":'pshsb_tc','className':'','check':false},
            'menpai':{"layerName":"门牌数据","layerId":'mp_tc','className':'','check':false},
			'qsfw_tc' : {"layerName":"权属范围","layerId":'qsfw_tc','className':'','check':true}
		}
	}
})();
var hasAlarmWindow = false;
//显示广州的城市列表
function showCityList(){
	$(".list-city").toggle();
}	
/**
 * 图例图层控制初始化
 */
/*绑定事件控制选择父节点的同时弹出子节点*/
//匹配子节点并添加
function childInit(){
	var s="<div>";
	for(var i=0;i<mapLegendSet.items.length;i++){
		var item=mapLegendSet.items[i];
		var pid=item.id;
		var child=item.children;
		var pchecked=item.checked;
		if(pchecked){
			s+='<ul class="list-legend" id="ul_'+pid+'">';
		}else{
			s+='<ul style="display:none;" class="list-legend" id="ul_'+pid+'">';
		}
			  for(var j=0;j<child.length;j++){
				var id=child[j].id;
				var name=child[j].name;
				var imgSrc=child[j].imgSrc;
				var init=child[j].init;
				var number=child[j].number;
				var ways=child[j].ways;
					try{
					eval(init)
					}catch(e){
						console.error("图例自定义方法错误")
					}
					var handler=child[j].handler;		
					var checked=child[j].checked;
					if(checked){
						s+= '<li id="li_'+id+'" class="hover">';
					}else{
						s+= '<li id="li_'+id+'">';
					}
				    s+='<a id="a_'+id+'" href="#" onclick=mapLegendItemClickHandler(this);'+handler+';><img src="'+imgSrc+'">'+name+'</a><span onclick='+ways+'>'+number+'</span></li>';  					
				}	
				s+='</ul>';
			}
        s+='</div>';			
    return s;		
}

//初始化显示二级菜单(不是创建)
function checkChildId(obj){
	//1.判断是否有高亮的一级菜单
	var oneId=obj.id;
	for (var i=0;i<mapLegendSet.items.length;i++){
		var item=mapLegendSet.items[i];
		var itemId=item.id;
		//2.显示该一级菜单的二级菜单
		var parentUl=$('#ul_'+itemId);
		if(oneId==itemId&&parentUl.hide()){
			parentUl.show().siblings().hide();
		}
	}	
}
function toggleStyle(p){
	var m=$(p).parent();
    m.addClass('oneMenu').siblings().removeClass('oneMenu');
}

/**
 * 图例图层控制点击事件
 */
function mapLegendClickHandler(){
	$(".top-legend").click(function(){
		if($(".top-legend").attr("status")=="unflod"){
			$(".legend").animate({ bottom: -$(".legend").height()+20 }, 100);
			$("#togger_link").html("图例<em1></em1>");
			$(".top-legend").attr("status","flod");
		} else if($(".top-legend").attr("status")=="flod"){
			$(".legend").animate({ bottom: "0" }, 100);
			$("#togger_link").html("图例<em></em>");
			$(".top-legend").attr("status","unflod");
		}
	});
}

/**
 * 图例内容点击
 * @param obj
 * @param type
 * @returns
 */
function mapLegendItemClickHandler(obj){
	$(obj).parent().toggleClass("hover");
}

/**
 * 点击图例列表调用例子
 * @param obj 
 * @param msg 自定义信息
 */
function testLegend(obj,msg){
	var isChecked=$(obj).parent().hasClass("hover");//判断a标签是否保存hover对象，如果包含则认为选中
	if(isChecked){
		console.log("选中"+msg);
	}else{
		console.log("取消选中"+msg);
	}
}
/**
 * 图例列表个数初始化例子
 * @param show 是否显示
 */
function testLegendInit(show,msg){
	if(show){
		console.log("初始化,显示:"+msg)
	}else{
		
	}
}
/*用户信息菜单*/
$(document).ready(function(){
	$(".userInfo").hover(
		function(){$(".setting").css({display:"block"});},
		function(){
			$(".setting").css({display:"none"});					
		}
	);
	$(".setting li").each(function(i){
		switch(i){
			case 0:
				$(this).click(function(){
					layer.open({
						type: 2,
						title: '修改密码',
						area: ['465px', '200px'],
						content: ['/psxj/adsorg/auth/updatePassword.jsp', 'no'] //iframe的url，no代表不显示滚动条
					});
				});
				break;
			case 1:
				$(this).click(function(){
					layer.open({
						type: 1,
						title: 'Android版本下载',
						closeBtn: 0,
						area: ['290px','330px'],
						shadeClose:true,
						content: '<img style="width:280px;height:280px" src="img/androidApp.png"/>'
					});
				});
				break;
			case 2:
				/*$(this).click(function(){
					var confirmMsg = layer.confirm('您是否确认退出系统？',{
						btn:['确认','取消']
					},function(){
						exitSystem();
					},function(){
						layer.close(confirmMsg);
					});
				});	*/
				break;
			default:break;
		}
	})
});

function ShowAlarmWinInterval(){
	$.ajax({
		method : 'GET',
		url : '/psxj/jk-alarm-info!checkHasAlarm.action',
		cache : false,
		dataType : 'json',                                                  
		success : function(data) {
			if(data.status==1&&hasAlarmWindow==false){
				hasAlarmWindow=true;
				layer.open({
					type: 2,
					title: "实时报警",
					shadeClose: false,
					shade: 0,
					offset: 'rb',
					maxmin: true,
					area: ['200px', '250px'],
					content: ["nnwaterSystem/Alarm/AlarmPopup/AlarmInfo.html",'#mapDiv'],
					cancel: function(){
						hasAlarmWindow=false;
					}    
				});
			}
		},
		error : function() {
			layer.msg('获取设施设备报警信息失败');
		}
	});
}
//上报总类前10条展示(暂时不需要)
function ShowInfoLatestTen(){
	$.ajax({
		method : 'get',
		url : '/psxj/rest/parts/getLatestTen',
		dataType: 'json',
		success : function(data){
			if(data.code==200 && data.data){
				var item = data.data;
				for(var i in item){
					var person,time,teamName,layerName,correctType;//上报人，时间，单位，设施类型，上报类型
					if(item[i].indexOf("lack")){
						
					}else if(item[i].indexOf("correct")){
						
					}else if(item[i].indexOf("problem")){
						layerName = item[i].LAYER_NAME;
						teamName = item[i].TEAM_ORG_NAME ? item[i].TEAM_ORG_NAME : 
										(item[i].DIRECT_ORG_NAME? item[i].DIRECT_ORG_NAME: 
											(item[i].SUPERVISE_ORG_NAME? item[i].SUPERVISE_ORG_NAME: tem[i].PARENT_ORG_NAME));
					}
					
				}
			}
		}
	});
	
}
//部件上报信息展示
function ShowAlarmWinParts(){// 部件上报信息展示
	var form = {"VALVE":"阀门","PUMP":"泵站","WELL":"窖井",
			"SPOUT":"排放口","YLY":"溢流堰","PM":"拍门","COMB":"雨水口","PIPE":"排水管道"};
	var type = [{"layerName":"阀门","layerId":0},{"layerName":"泵站","layerId":1},
				{"layerName":"窖井","layerId":2},{"layerName":"排放口","layerId":3},
				{"layerName":"溢流堰","layerId":4},{"layerName":"拍门","layerId":5},
				{"layerName":"雨水口","layerId":6},{"layerName":"排水管道","layerId":7}];
	var username,createTime,tableName,flag;
	$.ajax({
		method: 'get',
		url:'/psxj/ps-jk-data-his!reporData.action',
		dataType: 'json',
		success: function(data){
			var username,createTime,tableName,flag,objId,layerId,disitr;
			if(data.form.length>0){
				var html="";
				//$("#layer-report").html("");
				for(i in data.form){
					var table=data.form[i].tableName;
					for(a in form){
						if(a==table) tableName = form[a];
					}
					for(k in data.form[i].data){
						objId = data.form[i].data[k].OBJECTID;
						username = data.form[i].data[k].REPAIR_COM;
						createTime=data.form[i].data[k].REPAIR_DAT+1000*60*60*8;
						flag=data.form[i].data[k].FLAG_;
						disitr=data.form[i].data[k].DISTRICT;
						var newDate = new Date(createTime);
						var sta="";
						if(flag ==1) sta="修正";
						if(flag ==2) sta="新增";
						for(var v in type){
							if(type[v].layerName==tableName) layerId = type[v].layerId;
						}
						html+= "<li style=\"font-weight:400;\">&nbsp;"+disitr+username+"于"
						+"<a class='a_red' objid="+objId+" layerid="+layerId+">"+
						"<span style='color:#333;'>"+newDate.toLocaleString()+"</span></a>"+ (flag==1?  
								"<span style='color:red;'>": "<span style='color:#0176da;'>")
								+sta+"</span>了一个"+tableName
							+"<input type=\"hidden\" id=\"tableName\" value=\""+tableName+"\"/><br/>";
					}
				}
				$(".J_iframe #tool-box-top").html(html);
				$(".J_iframe #tool-box-top li a").click(function(){
					var ObjectIds = $(this).attr("objid");
					var layerIds = $(this).attr("layerid")
					openQuerys(ObjectIds,layerIds);
				});
			}
		}
	});
}