//空间查询
var drawTool = null;
var require = parent.require;

var zoneJsons = [
	//0下城区
	{rings:[[[120.11768193121338,30.295522331352235],[120.11974186773682,30.295522331352235],[120.11944146032715,30.294975160713197],[120.1171454894104,30.294739126319886],[120.11768193121338,30.295522331352235]]],spatialReference:{wkid:4326}},
	//1上城区
	{rings:[[[120.12293440995055,30.296126505178037],[120.12532694039183,30.295879741948667],[120.12513382134276,30.294753214162412],[120.12266618904906,30.29460301045758],[120.12293440995055,30.296126505178037]]],spatialReference:{wkid:4326}}
]
$.support.cors = true 

$(function(){
	initDrawTool();
	drawTool.bindColseEvent();
	//drawTool.location();
	//drawTool.draw();
});

function initDrawTool(){
	require(["esri/layers/GraphicsLayer","esri/toolbars/draw","esri/symbols/SimpleLineSymbol","esri/symbols/CartographicLineSymbol","esri/symbols/SimpleFillSymbol","esri/Color"],function(GraphicsLayer,Draw,SimpleLineSymbol,CartographicLineSymbol,SimpleFillSymbol,Color){
		//drawTool = new DrawTool(parent.map,new GraphicsLayer(),new Draw(parent.map),new SimpleLineSymbol(),new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("blue"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5));	
		var col = new Color('#f4cccc');
		var num = col.toRgb();
		num[3] = 0.5;
		col = new Color(num);
		drawTool = new DrawTool(parent.map,
			new GraphicsLayer(),
			new GraphicsLayer(),
			new Draw(parent.map),
			new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,col,1),col),
			new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("blue"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5),
			new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("red"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5)
		);	
	});
}
function DrawTool(m,l,dwl,t,s,ls,rls){
	//构造
	var map = m;
	var layer=l;
	var dwLayer=dwl;
	var toolbar=t;
	var symbol = s;
	var lineSymbol = ls;
	var redLineSymbol = rls;
	var url = location.protocol+"//"+location.hostname+":6080/arcgis/rest/services/HangZhouPipe/MapServer/1/query";
	var propertyParam=""; //属性查询参数
	var ringsParam="";  //多边形查询参数
	var param ="?geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=OBJECTID,StartPoint,EndPoint,StartDeep,EndDeep,RoadName&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&returnTrueCurves=false&f=pjson";  //其它参数
	//var param ="?geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&returnTrueCurves=false&f=pjson";  //其它参数
	//~
	map.addLayer(layer); //添加一个图层
	map.addLayer(dwLayer); //定位标记管线的图层
	//定位到下城区
	this.location = function(){
		require(["esri/geometry/Point"],function(Point){
			var  point = new Point(120.16095876750862, 30.258243234318485);
			map.centerAt(point);
		});
	}
	//创建绘图工具，绑定结束事件
	this.draw = function (isClear){
		if(isClear){
			this.cancel();
		}else{
			removeOldDraw();
		}
		drawend();
		//激活
		toolbar.activate('polygon');
	};
	//根据坐标画图
	this.drawByZone = function (isClear){
		if(isClear){
			this.cancel();
		}else{
			removeOldDraw();
		}
		if($("#zone").val()==-1) return ;
		//显示多边形
		var polygon;
		require(["esri/graphic","esri/geometry/Polygon"],function(Graphic,Polygon){
	    	polygon = new Polygon(zoneJsons[$("#zone").val()]);
	    	var graphic = new Graphic(polygon,symbol);
	       	layer.add(graphic);
	    });
    	setRingsParam(polygon.rings[0]);
    	drawTool.search();
	}
	//定位，显示属性
	this.dingwei =function(id){
		var graphics = layer.graphics;
		$.each(graphics,function(index){
			if(graphics[index].attributes!=undefined){
				if(graphics[index].attributes.OBJECTID==id){
					dwLayer.clear();
					var g = graphics[index];
					require(["esri/geometry/Point","esri/geometry/Polyline","esri/SpatialReference","esri/graphic"],function(Point,Polyline,SpatialReference,Graphic){
			 	  		var att = g.attributes;
						map.infoWindow.setTitle("管线属性");
						map.infoWindow.setContent("起点:"+att.StartPoint+"<br/>终点:"+att.EndPoint+"<br/>路名:"+att.RoadName+"<br/>起点埋深(m):"+att.StartDeep+"<br/>	终点埋深(m):"+att.EndDeep);
						var  point = new Point((g.geometry.paths[0][0][0]+g.geometry.paths[0][1][0])/2, (g.geometry.paths[0][0][1]+g.geometry.paths[0][1][1])/2);
						map.infoWindow.show(point);
						map.centerAt(point);
						
						var line = new Polyline(new SpatialReference({wkid:4326}));
						line.paths = g.geometry.paths;
						dwLayer.add(new Graphic(line,redLineSymbol,att));
					});
					return ;
				}
			}
		});
		
	}
	//查询
	this.search = function(){
		removeOldGraphic();
		setPropetyParam();
		buildTable();
	}
	//清空grapihc
	this.cancel = function(){
		ringsParam="";
		layer.clear();
		dwLayer.clear();
		toolbar.deactivate();
		map.infoWindow.hide();
		$("#table").empty();
		$("#table").append("<thead><tr><th>起点</th><th>终点</th><th>路名</th><th>起点埋深(m)</th><th>终点埋深(m)</th></tr></thead>");
	}
	//绑定绘画结束事件
	function drawend(){
		toolbar.on("draw-end", function(evt){
			toolbar.deactivate();
			//显示多边形
			require(["esri/graphic"],function(Graphic){
		    	var graphic = new Graphic(evt.geometry,symbol);
		       	layer.add(graphic);
		    });
	    	setRingsParam(evt.geometry.rings[0]);
	    	drawTool.search();
	    	//buildTable();
		});
	}
	//根据多边形的参数
	function setRingsParam(rings){
		var coordinate = "";
		$.each(rings,function(i){
			coordinate = coordinate+ "["+rings[i]+"],";
		});
		coordinate = coordinate.substring(0,coordinate.length-1);
		coordinate = "[["+coordinate+"]]";
		ringsParam = "&geometry={rings:"+coordinate+",spatialReference:{wkid:4326}}";
	}
	function setPropetyParam(){
		var status = $("#Status").val();  //状态
		var gj = $("#gj").val(); //管径
		var temp = "&where=1=1";
		var flag = false;
		if(status!=undefined && status!=""){
			temp += " and Status='"+status+"'";
			flag = true;
		}
   	 	if(gj!=undefined && gj!=""){
	        temp += " and DS"+$("#ysf").val()+"'"+gj+"'";
	        flag = true;
    	}
		propertyParam = temp;
    	/*if(flag){
			propertyParam = temp;
    	}else{
    		propertyParam="";
    	}*/
	}
	//构建数据
	function buildTable(){
		$.ajax({
			type: "get",
			url:url+param+propertyParam+ringsParam,
			//async: false,
			dataType: "jsonp",
			success: function(data){
				var obj = data.features;
				var tableStr = "";
				var i=1;
				$.each(obj,function(index){
					var graphic = getGraphicAndDraw(obj[index].geometry.paths,obj[index].attributes);
					var att = JSON.stringify(obj[index].attributes);
				 	att=att.replace(/"/g,"\\\"");
				 	var pathStr = JSON.stringify(obj[index].geometry.paths);
					tableStr+= "<tr data-index=\""+i+"\" onclick='dingwei.dingwei(\""+att+"\","+pathStr+")'>"+
						"<td>"+i+"</td>"+
						"<td>"+obj[index].attributes.RoadName+"</td>"+
						"</tr>";
						if(i==10) return false;
						i++;
				
				});
				localStorage.removeItem("tableStrb");
				window.localStorage.setItem("tableStrb",tableStr);
				var iframe = $(parent.document.getElementById("leftMenuTable"));
				iframe.attr("src", "waterSystem/gdgl/list.html");
			},
			error:function(XHR, textStatus, errorThrown){
				
			}
		});	
	}
	
	//获取Graphic对象，并标注
	function getGraphicAndDraw(paths,attributes){
		var graphic = null;
		require(["esri/geometry/Polyline","esri/SpatialReference","esri/graphic"],function(Polyline,SpatialReference,Graphic){
			var line = new Polyline(new SpatialReference({wkid:4326}));
			line.paths = paths;
			graphic  = new Graphic(line,lineSymbol,attributes);
		});
		layer.add(graphic);
		return graphic;
	}
	
	//删除旧的查询结果标注
	function removeOldGraphic(){
		var flag = true;
		while(flag && layer.graphics.length>0){
			var _flag = false;
			for(var i=0;i<layer.graphics.length;i++){
				if(layer.graphics[i].attributes!=undefined){
					layer.remove(layer.graphics[i]);
					_flag=true;
					break;
				}
			}
			flag = _flag;
		}
	}
	//删除上次画的多边形
	function removeOldDraw(){
		var flag = true;
		while(flag && layer.graphics.length>0){
			var _flag = false;
			for(var i=0;i<layer.graphics.length;i++){
				if(layer.graphics[i].attributes==undefined){
					layer.remove(layer.graphics[i]);
					_flag=true;
					break;
				}
			}
			flag = _flag;
		}
			
	}
	//绑定关闭事件，关闭需要请空图层
	this.bindColseEvent = function(){
		var imgs = $(window.parent.document.getElementsByTagName("img"));
		$.each(imgs,function(index){
			if("img/popupwin/close.png"==$(imgs[index]).attr("src")){
				$(imgs[index]).click(function(){
					drawTool.cancel();
				});
				return ;	
			}
		});
	}
}
	

