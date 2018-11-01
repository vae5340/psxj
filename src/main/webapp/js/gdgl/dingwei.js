//定位脚本
var dingwei = null;
var require = parent.require;

var zoneJsons = [
	//0下城区
	{rings:[[[120.11768193121338,30.295522331352235],[120.11974186773682,30.295522331352235],[120.11944146032715,30.294975160713197],[120.1171454894104,30.294739126319886],[120.11768193121338,30.295522331352235]]],spatialReference:{wkid:4326}},
	//1上城区
	{rings:[[[120.12293440995055,30.296126505178037],[120.12532694039183,30.295879741948667],[120.12513382134276,30.294753214162412],[120.12266618904906,30.29460301045758],[120.12293440995055,30.296126505178037]]],spatialReference:{wkid:4326}}
]
$.support.cors = true 

$(function(){
	init();
});

function init(){
	require(["esri/layers/GraphicsLayer","esri/toolbars/draw","esri/symbols/SimpleLineSymbol","esri/symbols/CartographicLineSymbol","esri/symbols/SimpleFillSymbol","esri/Color"],function(GraphicsLayer,Draw,SimpleLineSymbol,CartographicLineSymbol,SimpleFillSymbol,Color){
		//drawTool = new DrawTool(parent.map,new GraphicsLayer(),new Draw(parent.map),new SimpleLineSymbol(),new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("blue"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5));	
		var col = new Color('#f4cccc');
		var num = col.toRgb();
		num[3] = 0.5;
		col = new Color(num);
		dingwei = new DingWei(parent.map,
			new GraphicsLayer(),
			new GraphicsLayer(),
			new Draw(parent.map),
			new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,col,1),col),
			new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("blue"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5),
			new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID,new Color("red"), 2,CartographicLineSymbol.CAP_ROUND,CartographicLineSymbol.JOIN_MITER, 5)
		);	
	});
}
function DingWei(m,l,dwl,t,s,ls,rls){
	//构造
	var map = m;
	var layer=l;
	var dwLayer=dwl;
	var toolbar=t;
	var symbol = s;
	var lineSymbol = ls;
	var redLineSymbol = rls;
	//~
	map.addLayer(layer); //添加一个图层
	map.addLayer(dwLayer); //定位标记管线的图层
	
	//定位，显示属性
	this.dingwei =function(att,path){
		var attObj = JSON.parse(att); 
		dwLayer.clear();
		require(["esri/geometry/Point","esri/geometry/Polyline","esri/SpatialReference","esri/graphic"],function(Point,Polyline,SpatialReference,Graphic){
			map.infoWindow.setTitle("管线属性");
			map.infoWindow.setContent("起点:"+attObj.StartPoint+"<br/>终点:"+attObj.EndPoint+"<br/>路名:"+attObj.RoadName+"<br/>起点埋深(m):"+attObj.StartDeep+"<br/>	终点埋深(m):"+attObj.EndDeep);
			var  point = new Point((path[0][0][0]+path[0][1][0])/2, (path[0][0][1]+path[0][1][1])/2);
			map.infoWindow.show(point);
			map.centerAt(point);
			
			var line = new Polyline(new SpatialReference({wkid:4326}));
			line.paths = path;
			dwLayer.add(new Graphic(line,redLineSymbol,attObj));
		});
		
	}
	
	//清空grapihc
	this.cancel = function(){
		layer.clear();
		dwLayer.clear();
		toolbar.deactivate();
		map.infoWindow.hide();
		$("#table").empty();
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
}
	

