define([
    'dojo/_base/array',
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/geometry/Circle",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/LabelLayer",
    "esri/renderers/SimpleRenderer",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/tasks/query",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    //-------------
    "pipe-network/pipe-identify",
    //--管网分析----
    "pipe-network/analysis/zdm-analysis", //纵断面分析
    "pipe-network/analysis/hdm-analysis", //横断面分析
    "pipe-network/analysis/up-and-down-stream-analysis",//上下游分析
], function(
    array,
    Map,
    Scalebar,
    Circle,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    TextSymbol,
    Font,
    SimpleFillSymbol,
    Color,
    FeatureLayer,
    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    LabelLayer,
    SimpleRenderer,
    GraphicsLayer,
    Graphic,
    Point,
    Query,
    Extent,
    SpatialReference,
    pipeIdentify,
    zdmAnalysis,
    hdmAnalysis,
    upDownStreamAnalysis
){
    var map;
    var allowPopupByDefault = true;
    var serviceUrls = {
        'baseLayer': arcgisMapBaseUrl+"/arcgis/rest/services/map2015/MapServer",
        'pipeNetwork': arcgisBaseUrl+"/arcgis/rest/services/nnpsfacility/MapServer",
//        'baseLayer': arcgisBaseUrl+"/arcgis/rest/services/nnbm/MapServer",//dev
        //'pipeNetwork': arcgisBaseUrl+"/arcgis/rest/services/NanNing/MapServer",//dev
        'upAndDownStreamAnalysis': '/agsupport/pipeNetwork/analysis/pipe-analysis!analyseUpAndDownStream.action'
    };

    var layerModelMap = {//图层ID与数据Model ID之间的映射关系
        '1': 'Outfall',
        '2': 'Manhole',
        '3': 'Comb',
        '4': 'Valve',
        '6': 'Gate',
        '7': 'Weir',
        '8': 'Pumpstation',
        '10': 'Pipe',
        '11': 'Pipe',
        '12': 'Pipe',
        '13': 'Pipe',
        '14': 'Pipe',
        '15': 'Pipe',
        '16': 'Pipe',
        '17': 'Pipe',
        '18': 'Pipe',
        '19': 'Pipe',
        '20': 'Pipe',
        '21': 'Pipe',
        '22': 'Pipe',
        '23': 'Pipe',
        '24': 'Pipe',
        '25': 'Pipe',
        '26': 'Pipe',
        '27': 'Conduit',
        '28': 'Conduit',
        '29': 'Conduit',
        '30': 'Conduit',
        '31': 'Conduit',
        '32': 'Conduit',
        '33': 'Conduit',
        '34': 'Conduit',
        '35': 'Conduit',
        '36': 'Conduit',
        '37': 'Conduit',
        '38': 'Conduit',
        '39': 'Conduit',
        '40': 'Conduit',
        '41': 'Conduit',
        '42': 'Conduit',
        '43': 'Conduit'
    };

    var pipeNodeLayerInfo = [ //管点图层信息
            {
                'id': 1,
                'name': 'Outfall',
                'displayName': '排放口',
                'idField': 'OutfallID',
                'size': 0.7
            },
            {
                'id': 2,
                'name': 'Manhole',
                'displayName': '检查井',
                //'idField': 'NODEID',
                'idField': 'NodeID',
                'size': 0.7
            },
            {
                'id': 3,
                'name': 'Comb',
                'displayName': '雨水口',
                'idField': 'CombID',
                'size': 0.7
            },
            {
                'id': 4,
                'name': 'Valve',
                'displayName': '阀门',
                'idField': 'ValveID',
                'size': 0.7
            }
    ],
        pipeLayerIds = [12, 17, 22, 29, 34, 39],//管线/沟渠图层id，不含"全部管线"和"全部沟渠"两个图层
        allPipeLayerId = [11],//"全部管线"图层
        allConduitLayerId = [28],//"全部沟渠"图 层
//        identifyLayerIds = [12, 17, 22, 29, 34, 39, 0, 5],//用于Identify操作的图层id，含管线和管点
        identifyLayerIds = [11, 28, 0, 5],
        roadLayerIds = [19, 20, 23, 24, 25, 26, 31, 32, 33, 36];//路网图层id

    var symbols = {
        'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
        'CROSSLINE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
        'IDENTIFIED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
        'UPSTREAM_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0]), 3),
        'DOWNSTREAM_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 3),
        'SELECTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
        'IDENTIFIED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
        'PIPE_INTERSECTION_POINT_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25])),
        'ROAD_INTERSECTION_POINT_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 6, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
        'UPSTREAM_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
        'DOWNSTREAM_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
        'HIGHLIGHTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
        'HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25])),
        'MOUSEOVER_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
        'MOUSEOVER_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25]))
    };

    function initPipeIdentify(){//初始化Identify（点选）操作模块
        pipeIdentify.init(map, {
            'serviceUrl': serviceUrls.pipeNetwork,
            'layerModelMap': layerModelMap,
            'minVisibleZoom': 7,
            'displayScale':16000,
            'identifyParameters': {
                'layerIds': identifyLayerIds
            }
        });
        map.on('click', function(event){
            pipeIdentify.identify(event.mapPoint);
        });
    }

    function initPipeAnalysis(){
        hdmAnalysis.init({//初始化横断面分析模块
            'map': map,
            'pipeNetworkServiceUrl': serviceUrls.pipeNetwork,
            'roadNetworkServiceUrl': serviceUrls.baseLayer,
/*
            'roadIdentifyParameters': {
                'layerIds': roadLayerIds
            },
*/
            'pipeIdentifyParameters': {
                'layerIds': pipeLayerIds
            },
            'layerModelMap': layerModelMap,
            'pipeNodeQueryParameters':{
                'models': pipeNodeLayerInfo
            },
            'pipeQueryParameters': {
            },
            'symbols': symbols,
            'eventHandlers': {
                'startMapOccupation': function(){
                    pipeIdentify.setAllowPopup(false);
                },
                'releaseMapOccupation': function(){
                    pipeIdentify.setAllowPopup(true);
                },
                'afterCancel': function(){
                    pipeIdentify.setAllowPopup(allowPopupByDefault);
                }
            }
        });

        zdmAnalysis.init({//初始化纵断面分析模块
            'map': map,
            'serviceUrl': serviceUrls.pipeNetwork,
            'symbols': symbols,
            'pipeIdentifyParameters': {
//                'layerIds': pipeLayerIds
                'layerIds': (function(){
                    var arr = [];
                    array.forEach([allConduitLayerId, allPipeLayerId], function(ids){
                        array.forEach(ids, function(id){
                            arr.push(id);
                        });
                    });
                    return arr;
                })()                
            },
            'pipeNodeQueryParameters': {
                'layers': pipeNodeLayerInfo
            },
            'eventHandlers': {
                'beforeStart': function(){
                    pipeIdentify.setAllowPopup(false);
                },
                'beforeCancel': function(){
                    pipeIdentify.setAllowPopup(true);
                },
                'releaseMapOccupation': function(){
                    pipeIdentify.setAllowPopup(true);
                },
                'startMapOccupation': function(){
                    pipeIdentify.setAllowPopup(false);
                },
                'afterCancel': function(){
                    pipeIdentify.setAllowPopup(allowPopupByDefault);
                }
            }
        });

        upDownStreamAnalysis.init({//初始化上下游分析模块
            'map': map,
            'pipeServiceUrl': serviceUrls.pipeNetwork,
            'pipeNodeServiceUrl': serviceUrls.pipeNetwork,
            'analysisUrl': serviceUrls.upAndDownStreamAnalysis,
            'symbols': symbols,
            'pipeIdentifyParameters': {
//                'layerIds': pipeLayerIds
                'layerIds': (function(){
                    var arr = [];
                    array.forEach([allConduitLayerId, allPipeLayerId], function(ids){
                        array.forEach(ids, function(id){
                            arr.push(id);
                        });
                    });
                    return arr;
                })()
            },
            'pipeQueryParameters': {
                'modelLayerMap': {
                    'Conduit': allConduitLayerId,
                    'Pipe': allPipeLayerId
                }
            },
            'pipeNodeQueryParameters': {
                'layers': pipeNodeLayerInfo
            },
            'eventHandlers': {
                'releaseMapOccupation': function(){
                    pipeIdentify.setAllowPopup(true);
                },
                'startMapOccupation': function(){
                    pipeIdentify.setAllowPopup(false);
                },
                'afterCancel': function(){
                    pipeIdentify.setAllowPopup(allowPopupByDefault);
                }
            }
        });

        pipeIdentify.setAllowPopup(allowPopupByDefault);
    }

    function init(_map){//外部初始化调用接口
        map = _map;
        initPipeIdentify();
        initPipeAnalysis();
    }

    /**
     * 外部调用管网分析功能的接口
     * @param name {String} 取值为['hdm-analysis' | 'zdm-analysis' | 'up-down-stream-analysis']，分别代表"横断面分析"，"纵断面分析", "上下游分析"
     */
    function analyse(name){ 
        var analysisInUse = [];

        array.forEach([hdmAnalysis, zdmAnalysis, upDownStreamAnalysis], function(analysis){
            if(analysis.isInUse()){
                analysisInUse.push(analysis);
            }
        });

        //跳回地图页面
        createNewtab("mapDiv","地图服务");

        if(analysisInUse.length){
            if(confirm("当前有其他分析功能正在使用中，是否关闭当前功能，开始新的功能?")){
                array.forEach(analysisInUse, function(analysis){
                    analysis.cancel();
                });
            }else{
                return;
            }
        }

        switch(name){
	        case 'hdm-analysis':
	            hdmAnalysis.use();
	            break;
	        case 'zdm-analysis':
	            zdmAnalysis.use();
	            break;
	        case 'up-down-stream-analysis':
	            upDownStreamAnalysis.use();
	            break;
	        default:
	            alert("无编号为：'"+name+"'的功能");
	            return;
        }

//        pipeIdentify.setAllowPopup(allowPopupByDefault);
    };

    return {
        'init': init,
        'analyse': analyse,
        'pipeIdentify': pipeIdentify
    };

});
