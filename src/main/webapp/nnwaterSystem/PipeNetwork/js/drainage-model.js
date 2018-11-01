/**
 * 排水模型功能配置模块
 */
define([
    'dojo/_base/array',
    'dojo/_base/lang',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'drainage-model/swmm/global-setting',
    'drainage-model/swmm/feature-query',
    'drainage-model/swmm/feature-stats',
    'drainage-model/swmm/assessment',
    'drainage-model/swmm/pm-analysis',
    'drainage-model/swmm/rainfall-model'
], function(
    array,
    lang,
    ArcGISDynamicMapServiceLayer,
    setting,
    featureQuery,
    featureStats,
    assessment,
    pmAnalysis,
    rainfallModel
){
    'use strict';
    var ctxPath = '/agsupport';
    var arcgisBaseUrl = "http://192.168.30.147:6080";
    var serviceApis = {
        'schemeBaseServiceUrl': arcgisBaseUrl+'/arcgis/rest/services/SwmmNanNing',
        'floodedAreaServiceUrl': arcgisBaseUrl+"/arcgis/rest/services/SwmmNanNing",
        'floodedPortionServiceUrl': arcgisBaseUrl+"/arcgis/rest/services/SwmmNanNing",
        'projectList': ctxPath+'/swmm/swmmProject/swmm-project!list.action',
        'timeseries': ctxPath+'/swmm/swmmTimeseries/swmm-timeseries!get.action',
//        'pipeServiceUrl': arcgisBaseUrl+"/arcgis/rest/services/NanNing/MapServer",
//        'pipeNodeServiceUrl': arcgisBaseUrl+"/arcgis/rest/services/NanNing/MapServer",
        'nodeWaterDepthTimeseries': ctxPath+'/swmm/swmmNodeWater/swmm-node-water!list.action',
        'lineWaterDepthTimeseries': ctxPath+'/swmm/swmmConduitWater/swmm-conduit-water!list.action',
        'lineFlowSpeedTimeseries': ctxPath+'/swmm/swmmConduitWater/swmm-conduit-water!list.action',
        'lineFlowAmountTimeseries': ctxPath+'/swmm/swmmConduitWater/swmm-conduit-water!list.action',
        'lineOverloadStats': ctxPath+'/swmm/swmmConduitOverload/swmm-conduit-overload!list.action',
        'nodeOverloadStats': ctxPath+'/swmm/swmmNodeOverload/swmm-node-overload!list.action',
        'nodeFloodedStats': ctxPath+'/swmm/swmmNodeFlooded/swmm-node-flooded!list.action',
        'lineOverloadInpcodeList': ctxPath+'/swmm/swmmConduitOverload/swmm-conduit-overload!getAllInpcode.action',
        'nodeOverloadInpcodeList': ctxPath+'/swmm/swmmNodeOverload/swmm-node-overload!getAllInpcode.action',
        'nodeFloodedInpcodeList': ctxPath+'/swmm/swmmNodeFlooded/swmm-node-flooded!getAllInpcode.action',
        'assessment': ctxPath+'/swmm/swmmProjectSystem/swmm-project-system!findByProjectid.action',
        'batchNodeWaterTimeseries': ctxPath+'/swmm/swmmNodeWater/swmm-node-water!batchSearch.action',
        'shortestPath': ctxPath+'/swmm/analysis/pipe-analysis!findShortestPath.action'
    };
/*
 product
    var layerIdMap = {
        'pipe': [11, 28],
        'pipeNode': [1, 2, 3, 4]
 };
*/
    /*dev*/
    var layerIdMap = {
        'pipe': [6,7],
        'node': [1]
    };
    var layerInfoMap = {
        'pipe': {
            '6': {
                'id': 6,
                'modelId': 'SwmmSquareTube',
                'name': '方管',
                'idField': 'INPCODE'
            },
            '7': {
                'id': 7,
                'modelId': 'SwmmCircularTube',
                'name': '圆管',
                'idField': 'INPCODE'
            }
        },
        'node': {
            '1': {
                'id': 1,
                'modelId': 'SwmmManhole',
                'name': '检查井',
                'idField': 'INPCODE'
            }
/*
            '1': {
                'id': '1',
                'modelId': 'outfall',
                'name': '排放口',
                'idField': 'OUTFALLID'
            },
            '2': {
                'id': '2',
                'modelId': 'Manhole',
                'name': '检查井',
                'idField': 'NODEID'
            },
            '3': {
                'id': '3',
                'modelId': 'Comb',
                'name': '雨水口',
                'idField': 'COMBID'
            },
            '4': {
                'id': '4',
                'modelId': 'Valve',
                'name': '阀门',
                'idField': 'VALVEID'
            }
*/
        }
    };
//    var schemeBaseMapVisibleLayers = [11, 12, 13, 14, 15, 16, 17, 18, 21];
    var schemeBaseMapVisibleLayers = [0,1,2,3,4,5,6,7/*,9*/];
    var map,
        schemeBaseMapCache = {},
        configMap = {},
        stateMap = {
            'baseMapUseCount': 0,
            'curFunctionNames': []
        },
        //---
        addBaseMapForScheme,
        removeCurBaseMap,
        //---
        initSetting,
        initFeatureQuery,
        initFeatureStats,
        initAssessment,
        initPmAnalysis,
        initRainfallModel,
        //---
        hideSetting,
        use,
        init,
        set,
        cancel;

    removeCurBaseMap = function(){//隐藏排水模型专用的图层，恢复原有管线图层
        stateMap.baseMapUseCount -= 1;
        if(stateMap.curSchemeBaseMapLayer){
            if(stateMap.baseMapUseCount <= 0){
                map.removeLayer(stateMap.curSchemeBaseMapLayer);
                stateMap.curSchemeBaseMapLayer = null;
                if(mapGlobe && mapGlobe.pipeNetworkLayer && !mapGlobe.pipeNetworkLayer.visible){
                    mapGlobe.pipeNetworkLayer.show();
                }
            }
        }
    };

    addBaseMapForScheme = function(schemeName){//添加排水模型专用的图层暂时替换原有管线图层
        if(!schemeName){
            return null;
        }
        var url = serviceApis.schemeBaseServiceUrl + '/' + schemeName + '/MapServer',
            mapLayer = schemeBaseMapCache[schemeName];
        if(!mapLayer){
            mapLayer = schemeBaseMapCache[schemeName] = new ArcGISDynamicMapServiceLayer(url, {
                'opacity': 0.6
            });
            //Set Map Parameters Here
            mapLayer.setVisibleLayers(schemeBaseMapVisibleLayers);
        }
        if(mapLayer){
            if(mapGlobe && mapGlobe.pipeNetworkLayer && mapGlobe.pipeNetworkLayer.visible){
                mapGlobe.pipeNetworkLayer.hide();
            }
            if(stateMap.curSchemeBaseMapLayer !== mapLayer){
                if(stateMap.curSchemeBaseMapLayer){
                    map.removeLayer(stateMap.curSchemeBaseMapLayer);
                }
                map.addLayer(mapLayer);
                stateMap.curSchemeBaseMapLayer = mapLayer;
            }
            stateMap.baseMapUseCount += 1;
        }
        return mapLayer;
    };

    initSetting = function(){//初始化全局设置模块
        setting.init(map, {
            'serviceApis': serviceApis,
            'layerIdMap': layerIdMap,
            'position': {
                'top': '150px',
                'right': '15px'
            },
            'eventHandlers': {
                'selectProject': function(event){
                    var functionName= stateMap.delayFunction;
                    if(functionName){
                        stateMap.delayFunction = null;
                        use(functionName);
                        return;
                    }
                    for(var i=0;i<stateMap.curFunctionNames.length;i++){
                        functionName = stateMap.curFunctionNames[i];
                        stateMap.baseMapUseCount -= 1;
                        use(functionName, true);
                    }
                }
            }
            //TODO
        });
    };

    initFeatureQuery = function(){//初始化查询功能模块
        featureQuery.init(map, {
            'serviceApis': serviceApis,
            'layerIdMap': (function(){
                var idMap = {};
                idMap[featureQuery.FEATURE_TYPE_LINE] = layerIdMap.pipe;
                idMap[featureQuery.FEATURE_TYPE_NODE] = layerIdMap.node;
                return idMap;
            })(),
            'layerInfoMap': (function(){
                var infoMap = {};
                infoMap[featureQuery.FEATURE_TYPE_LINE] = layerInfoMap.pipe;
                infoMap[featureQuery.FEATURE_TYPE_NODE] = layerInfoMap.node;
                return infoMap;
            })(),
            'eventHandlers': {
                'canceled': function(){
                    stateMap.curFunctionNames = array.filter(stateMap.curFunctionNames, function(funcName){
                        return funcName.match(/feature-query/)?false:true;
                    });
                    removeCurBaseMap();
                }
                //TODO
            }
        });
    };

    initFeatureStats = function(){//初始化统计功能模块
        featureStats.init(map, {
            'serviceApis': serviceApis,
            'layerIdMap': (function(){
                var idMap = {};
                idMap[featureStats.FEATURE_TYPE_LINE] = layerIdMap.pipe;
                idMap[featureStats.FEATURE_TYPE_NODE] = layerIdMap.node;
                return idMap;
            })(),
            'layerInfoMap': (function(){
                var infoMap = {};
                infoMap[featureStats.FEATURE_TYPE_LINE] = layerInfoMap.pipe;
                infoMap[featureStats.FEATURE_TYPE_NODE] = layerInfoMap.node;
                return infoMap;
            })(),
            'eventHandlers': {
                'canceled': function(){
                    stateMap.curFunctionNames = array.filter(stateMap.curFunctionNames, function(funcName){
                        return funcName.match(/feature-stats/)?false:true;
                    });
                    removeCurBaseMap();
                }
                //TODO
            }
        });
    };

    initAssessment = function(){//初始化内涝风险分析模块
         assessment.init(map, {
            'serviceApis': serviceApis,
            'eventHandlers': {
                'canceled': function(){
                    stateMap.curFunctionNames = array.filter(stateMap.curFunctionNames, function(funcName){
                        return funcName.match(/assessment/i)?false:true;
                    });
                    removeCurBaseMap();
//                    setting.show();
                }
                //TODO
            }
        });
    };

    initPmAnalysis = function(){//初始化剖面分析模块
        pmAnalysis.init(map, {
            'serviceApis': serviceApis,
            'layerIdMap': (function(){
                var idMap = {};
                idMap.pipe = layerIdMap.pipe;
                idMap.pipeNode = layerIdMap.node;
                return idMap;
            })(),
            'layerInfoMap': (function(){
                var infoMap = {};
                infoMap.pipe = layerInfoMap.pipe;
                infoMap.pipeNode = layerInfoMap.node;
                return infoMap;
            })(),
            'eventHandlers': {
                'canceled': function(){
                    stateMap.curFunctionNames = array.filter(stateMap.curFunctionNames, function(funcName){
                        return funcName.match(/pm-analysis/i)?false:true;
                    });
                    removeCurBaseMap();
                }
                //TODO
            }
        });
    };

    initRainfallModel = function(){//初始化实时降雨模块
        rainfallModel.init(map, {});
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }

        map = _map;
        lang.mixin(configMap, options);

        initSetting();
        initFeatureQuery();
        initFeatureStats();
        initAssessment();
        initPmAnalysis();
        initRainfallModel();
        //TEST ONLY
//        set();

    };

    function callRainfallModel(functionName, options){//调用实时降雨图，这个功能不属于排水模型分析，只是借助排水模型对外提供调用接口
        if(functionName == 'realtime-rainfall-map' || functionName == 'rainfall-model'){
            centerGridMap();
            rainfallModel.use(options);
            return true;
        }
        return false;
    };

    use = function(functionName, skipCheckAlreayInUse, options){//单个功能调用入口
        var curProject = setting.getCurProject();

        if(callRainfallModel(functionName, options)){
            return;
        }
        if(!functionName){
            return;
        }
        set();

        //跳回地图页面
        createNewtab("mapDiv","地图服务");

        if(!curProject){
            stateMap.delayFunction = functionName;
            parent.layer.msg("请先选择工程",{icon:0});
            //alert("请先选择工程");
            return;
        }

        if(!skipCheckAlreayInUse){
            stateMap.curFunctionNames = array.filter(stateMap.curFunctionNames, function(funcName){
                if( funcName == functionName ||
                    (funcName.match(/feature-query/) && functionName.match(/feature-query/)) ||
                    (funcName.match(/feature-stats/) && functionName.match(/feature-stats/))){
                    stateMap.baseMapUseCount -= 1;
                    return false;
                }
                return true;
            });
        }
        if(!skipCheckAlreayInUse){
            stateMap.curFunctionNames.push(functionName);
        }

        addBaseMapForScheme(curProject.schemename);

        options = {
            'curProject': curProject,
            'featureServiceUrls': {
                'pipeServiceUrl': stateMap.curSchemeBaseMapLayer.url,
                'pipeNodeServiceUrl': stateMap.curSchemeBaseMapLayer.url
            }
        };
        
        switch(functionName){
	        case 'feature-query-node-water-depth':
	            lang.mixin(options, {
	                'featureType': featureQuery.FEATURE_TYPE_NODE,
	                'queryType': featureQuery.QUERY_TYPE_NODE_WATER_DEPTH
	            });
	            featureQuery.use(options);
	            break;
	        case 'feature-query-line-water-depth':
	            lang.mixin(options, {
	                'featureType': featureQuery.FEATURE_TYPE_LINE,
	                'queryType': featureQuery.QUERY_TYPE_LINE_WATER_DEPTH
	            });
	            featureQuery.use(options);
	            break;
	        case 'feature-query-line-flow-speed':
	            lang.mixin(options, {
	                'featureType': featureQuery.FEATURE_TYPE_LINE,
	                'queryType': featureQuery.QUERY_TYPE_LINE_FLOW_SPEED
	            });
	            featureQuery.use(options);
	            break;
	        case 'feature-query-line-flow-amount':
	            lang.mixin(options, {
	                'featureType': featureQuery.FEATURE_TYPE_LINE,
	                'queryType': featureQuery.QUERY_TYPE_LINE_FLOW_AMOUNT
	            });
	            featureQuery.use(options);
	            break;
	        case 'feature-stats-line-overload':
	            lang.mixin(options, {
	                'featureType': featureStats.FEATURE_TYPE_LINE,
	                'statsType': featureStats.STATS_TYPE_LINE_OVERLOAD
	            });
	            featureStats.use(options);
	            break;
	        case 'feature-stats-node-overload':
	            lang.mixin(options, {
	                'featureType': featureStats.FEATURE_TYPE_NODE,
	                'statsType': featureStats.STATS_TYPE_NODE_OVERLOAD
	            });
	            featureStats.use(options);
	            break;
	        case 'feature-stats-node-flooded':
	            lang.mixin(options, {
	                'featureType': featureStats.FEATURE_TYPE_NODE,
	                'statsType': featureStats.STATS_TYPE_NODE_FLOODED
	            });
	            featureStats.use(options);
	            break;
	        case 'assessment':
	            lang.mixin(options, {});
	            assessment.use(options);
	            $('#seperator').click();
//	            setting.hide();
	            break;
	        case 'pm-analysis':
	            lang.mixin(options, {});
	            pmAnalysis.use(options);
	            break;
	        default:
	            return;
        }
    };

    set = function(){
        setting.startIfNotRunning();
        setting.show();
    };

    hideSetting = function(){
        setting.hide();
    };

    cancel = function(){
        //TODO cancel all functions
        setting.destroy();
    };

    return {
        'rainfallModel': rainfallModel,
        'set': set,
        'use': use,
        'hideSetting': hideSetting,
        'init': init,
        'cancel': cancel
    };
});
