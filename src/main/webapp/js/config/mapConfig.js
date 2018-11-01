var mapOptions = {
    extent: { center: [108.30669180908202,22.815586677246095], zoom: 5 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {
        pipeLayer:{url:location.protocol+"//"+location.hostname+"：6080/arcgis/rest/services/HangZhouPipe/MapServer/1",options:{id:"pipe",minScale:3000,maxScale:150,outField:"[*]"}},//杭州管线数据
    },
    service: {
        
    }

}

//    var url = location.protocol+"//"+location.hostname+":6080/arcgis/rest/services/HangZhouPipe/MapServer/1";
//    var fl = new esri.layers.FeatureLayer(url, {
//        id: "pipe",
//        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
//        outFields: ["*"],
//        showLabels:true,
//        minScale: 3000,
//        maxScale: 150
//    });
//    fl.on("click", pipeClickHandler);
//    fl.on("mouse-move", pipeOverHandler);
//    fl.on("mouse-out", pipeOutHandler);
//    return fl;