//地图初始化相关的脚本
mapOptions = {
    extent: { center: [108.40669180908202,22.815586677246095], zoom: 3 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {
        //pipeLayer:{url:location.protocol+"//"+location.hostname+":6080/arcgis/rest/services/HangZhouPipe/MapServer/1",options:{id:"pipe",minScale:3000,maxScale:150,outField:"[*]"}},//杭州管线数据
    },
    service: {
        
    }

}

require(["esri/map", "custom/tdt/TDTLayer", "custom/tdt/TomcatLayer","custom/tdt/SuperMapLayer","custom/tdt/SuperMapBZLayer", "esri/dijit/LocateButton", "esri/dijit/Scalebar", "esri/dijit/HomeButton",
"esri/symbols/SimpleLineSymbol", "esri/Color", "custom/popup/PopupWin","custom/InfoPanel/InfoPanel", "esri/layers/FeatureLayer"]);
require(["dojo/ready"], function (ready) {
    ready(function () {
        initMap();
    });
});

var map;
var fl;
var mapGlobe = {

};

var graphicsArr = new Array();
var graphicsNNArr = new Array();
//地图初始化
function initMap() {
    map = new esri.Map("mapDiv", { logo: false, showLabels: true, center: mapOptions.extent.center, zoom: mapOptions.extent.zoom });
    //map.on('load', NNmapLoadHandler);
    map.addLayer(createVECLayer()); //添加底图
    map.addLayer(createCVALayer()); //添加底图
    creatDemo();
}

function toDecimal2(x) {  
        var f = parseFloat(x);  
        if (isNaN(f)) {  
            return false;  
        }  
        var f = Math.round(x*100)/100;  
        var s = f.toString();  
        var rs = s.indexOf('.');  
        if (rs < 0) {  
            rs = s.length;  
            s += '.';  
        }  
        while (s.length <= rs + 2) {  
            s += '0';  
        }  
        return s;  
}   

//添加定位按钮
function addLocationButton() {
    var geoLocate = new esri.dijit.LocateButton({
        map: map
    }, "LocateButton");
    geoLocate.startup();
}

//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
        // "dual" displays both miles and kilmometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: "dual"
    });
}

//添加HOME键
function addHomeButton() {
    var home = new esri.dijit.HomeButton({
        map: map
    }, "HomeButton");
    home.startup();
}

function createGTWMTSLayer(){
	var layer = new tdt.SuperMapLayer({id: "GTWMTS" });
	layer.setOpacity(.60);
    return layer;
}
function createGTBZWMTSLayer(){
	var layer = new tdt.SuperMapBZLayer({id: "GTBZWMTS" });
	layer.setOpacity(.60);
    return layer;
}
function createTomcatLayer() {
    var layer = new tdt.TomcatLayer({ url: "/nnmap/Layers/_alllayers", id: "NNVectorLayer" });
    return layer;
}
//创建地图
function createVECLayer(){
    var layer = new tdt.TDTLayer("vec");
    layer.setOpacity(.60);
    return layer;
}
//创建地图
function createCVALayer(){
    var layer = new tdt.TDTLayer("cva");
    layer.setOpacity(.60);
    return layer;
}
