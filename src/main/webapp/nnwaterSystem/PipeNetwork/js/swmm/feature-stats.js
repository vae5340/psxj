define([
    'module',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/html',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/query',
    'dojo/on',
    'dojo/request',
    'dojo/promise/all',
    'esri/Color',
    'esri/graphic',
    'esri/geometry/Point',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/layers/GraphicsLayer',
    'esri/tasks/QueryTask',
    'esri/tasks/query',
    'drainage-model/lib/resource-loader',
    'drainage-model/lib/basic-utils',
    'drainage-model/lib/map-utils'
], function(
    module,
    lang,
    array,
    html,
    dom,
    domConstruct,
    domStyle,
    domClass,
    domAttr,
    query,
    on,
    request,
    all,
    Color,
    Graphic,
    Point,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    GraphicLayer,
    QueryTask,
    Query,
    resourceLoader,
    basicUtils,
    mapUtils
){
    'use strict';
    var map,
        exports,
        configMap = {
            'jsPanelId': 'swmm-feature-stats-jspanel',
            'pageSize': 100,
            'jsPanelContentSize': { 'width': 820, 'height': 210 },
            'jsPanelPosition': {
                'my': 'center-bottom',
                'at': 'center-bottom',
                'offsetX': '-50px'
            },
            'jsPanelMinimizedMargin': {
                'left': 300
            }
        },
        stateMap,
        eventHandlers = {},
        eventHandlerMap = {},
        resources = {
            'CSS': '../../css/swmm-feature-stats.css'
        },
        constants = {
            'FEATURE_TYPE_LINE': 'line',
            'FEATURE_TYPE_NODE': 'node',
            'STATS_TYPE_NODE_OVERLOAD': 'nodeOverload',
            'STATS_TYPE_NODE_FLOODED': 'nodeFlooded',
            'STATS_TYPE_LINE_OVERLOAD': 'lineOverload'
        },
        nameMaps = {
            'featureTypeNameMap': (function(){
                var nameMap = {};
                nameMap[constants.FEATURE_TYPE_LINE] = '排水管线';
                nameMap[constants.FEATURE_TYPE_NODE] = '检查井';
                return nameMap;
            })(),
            'statsTypeNameMap': (function(){
                var nameMap = {};
                nameMap[constants.STATS_TYPE_NODE_OVERLOAD] = '过载';
                nameMap[constants.STATS_TYPE_NODE_FLOODED] = '溢流';
                nameMap[constants.STATS_TYPE_LINE_OVERLOAD] = '过载';
                return nameMap;
            })()
        },
        apiMaps = {
            'statsTypeApiMap': null
        },
        symbolMaps = {
            'statsTypeSymbolMap': (function(){
                var symbolMap = {},
                    lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
                    markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,0,255,0.25]));
                symbolMap[constants.STATS_TYPE_LINE_OVERLOAD] = lineSymbol;
                symbolMap[constants.STATS_TYPE_NODE_OVERLOAD] = markerSymbol;
                symbolMap[constants.STATS_TYPE_NODE_FLOODED] = markerSymbol;
                return symbolMap;
            })(),
            'statsTypeHighlightSymbolMap': (function(){
                var symbolMap = {},
                    lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                    markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 14, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,0,255,0.5]));
                symbolMap[constants.STATS_TYPE_LINE_OVERLOAD] = lineSymbol;
                symbolMap[constants.STATS_TYPE_NODE_OVERLOAD] = markerSymbol;
                symbolMap[constants.STATS_TYPE_NODE_FLOODED] = markerSymbol;
                return symbolMap;
            })()
        },
        modelMaps = {
            'statsTypeModelMap': (function(){
                var fieldMap = {},
                    numberToFixedFormatterFactory,
                    numberToFixedFormatterFor2;
                
                numberToFixedFormatterFactory = function(digits){
                    var instances = {};
                    instances[digits] = instances[digits] || function(value){
                        if(basicUtils.isNumber(value)){
                            return value.toFixed(digits);
                        }
                        return value || '';
                    };
                    return instances[digits];
                };

                fieldMap[constants.STATS_TYPE_LINE_OVERLOAD] = {
                    'statsType': constants.STATS_TYPE_LINE_OVERLOAD,
                    'name': '超载管线',
                    'featureIdField': 'inpcode',
                    'displayFields': [
                        'inpcode', 'hoursabovefullnormalflow', 'hourscapacitylimited'
                    ],
                    'defaultFieldDisplayFormatter': function(value){
                        if(basicUtils.isNumber(value)){
                            return value;
                        }else{
                            return value || '';
                        }
                    },
                    'fields': {
                        'id': {
                            'id': 'id',
                            'name': 'ID'
                        },
                        'projectid': {
                            'id': 'projectid',
                            'name': '工程编号'
                        },
                        'projectname': {
                            'id': 'projectname',
                            'name': '工程名称'
                        },
                        'schemename': {
                            'id': 'schemename',
                            'name': '方案名称'
                        },
                        'inpcode': {
                            'id': 'inpcode',
                            'name': '唯一标识'
                        },
                        'hoursabovefullnormalflow': {
                            'id': 'hoursabovefullnormalflow',
                            'name': '超载时长(小时)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        },
                        'hourscapacitylimited': {
                            'id': 'hourscapacitylimited',
                            'name': '受限时长(小时)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        }
                    }
                };
                
                fieldMap[constants.STATS_TYPE_NODE_FLOODED] = {
                    'statsType': constants.STATS_TYPE_NODE_FLOODED,
                    'name': '溢流节点',
                    'featureIdField': 'inpcode',
                    'displayFields': [
                        'inpcode', 'hoursflooded', 'totalfloodvolume'
                    ],
                    'fields': {
                        'id': {
                            'id': 'id',
                            'name': 'ID'
                        },
                        'projectid': {
                            'id': 'projectid',
                            'name': '工程编号'
                        },
                        'projectname': {
                            'id': 'projectname',
                            'name': '工程名称'
                        },
                        'schemename': {
                            'id': 'schemename',
                            'name': '方案名称'
                        },
                        'inpcode': {
                            'id': 'inpcode',
                            'name': '唯一标识'
                        },
                        'hoursflooded': {
                            'id': 'hoursflooded',
                            'name': '溢流时长(小时)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        },
                        'totalfloodvolume': {
                            'id': 'totalfloodvolume',
                            'name': '总溢流容积(升)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        }
                    }
                };

                fieldMap[constants.STATS_TYPE_NODE_OVERLOAD] = {
                    'statsType': constants.STATS_TYPE_NODE_OVERLOAD,
                    'name': '超载节点',
                    'featureIdField': 'inpcode',
                    'displayFields': [
                        'inpcode', 'hoursflooded', 'maxheightabovecrown', 'mindepthbelowrim'
                    ],
                    'fields': {
                        'id': {
                            'id': 'id',
                            'name': 'ID'
                        },
                        'projectid': {
                            'id': 'projectid',
                            'name': '工程编号'
                        },
                        'projectname': {
                            'id': 'projectname',
                            'name': '工程名称'
                        },
                        'schemename': {
                            'id': 'schemename',
                            'name': '方案名称'
                        },
                        'inpcode': {
                            'id': 'inpcode',
                            'name': '唯一标识'
                        },
                        'hoursflooded': {
                            'id': 'hoursflooded',
                            'name': '超载时长(小时)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        },
                        'maxheightabovecrown': {
                            'id': 'maxheightabovecrown',
                            'name': '过管顶最大深度(米)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        },
                        'mindepthbelowrim': {
                            'id': 'mindepthbelowrim',
                            'name': '距井顶最小深度(米)',
                            'displayFormatter': numberToFixedFormatterFactory(2)
                        }
                    }
                };
                return fieldMap;
            })()
        },
        templates = {
            'main': ""+
                "<div class=\"swmm-feature-stats\">"+
                 "<div class=\"control-panel\">"+
                 "</div>"+
                 "<div class=\"stats-content-wrapper\">"+
                  "<table class=\"stats-table-wrapper\">"+
                  "</table>"+
                 "</div>"+
                 "<div class=\"status-panel\">"+
                 "</div>"+
                "</div>"
        },
        //----
        queryMap,
        graphicLayer,
        //----
        highlightFeature,
        unhighlightFeature,
        addGraphicOnMap,
        loadFeatureInpcode,
        //----
        clickTableRowHandler,
        mapResizeHandler,
        jsPanelCloseHandler,
        jsPanelResizeHandler,
        //----
        resizeTable,
        initTable,
        destroyTable,
        initDom,
        destroyDom,
        initGraphicLayer,
        destroyGraphicLayer,
        //----
        loadResources,
        //----
        emit,
        init,
        use,
        cancel;
    
    clickTableRowHandler = function(row, ele){
        if(!graphicLayer){
            return;
        }
        var featureModel = modelMaps.statsTypeModelMap[stateMap.statsType],
            idField, featureIdField, graphic, layerInfo, point, path;
        if(!featureModel){
            return;
        }
        featureIdField = featureModel.featureIdField;
        if(!featureIdField){
            return;
        }
        for(var i=0;i<graphicLayer.graphics.length;i++){
            graphic = graphicLayer.graphics[i];
            layerInfo = graphic._layerInfo;
            if(graphic.attributes[layerInfo.idField] == row[featureIdField]){
                if(stateMap.highlightedFeature){
                    unhighlightFeature();
                }
                if(graphic.geometry.type == 'polyline'){//TEMP
                    path = graphic.geometry.paths[0];
                    point = new Point((path[0][0]+path[1][0])/2, (path[0][1]+path[1][1])/2, graphic.geometry.spatialReference);
                }else{
                    point = graphic.geometry;
                }
                mapUtils.locateGraphicOnGraphicLayer(map, graphic, graphic.attributes, true, graphicLayer, true);
//                mapUtils.locatePointToViewPosition(point, map, 2000, 0.5, 0.25);
//                map.setZoom(Math.max(map.getMaxZoom() - 1, map.getZoom()));
                highlightFeature(graphic);
                stateMap.justClickARow = true;
                break;
            }
        }
    };

    jsPanelCloseHandler = function(event, id){
        if(id == configMap.jsPanelId && (stateMap && !stateMap.doNotTriggerCloseEvent)){
            stateMap.doNotTriggerCloseEvent = false;
            cancel(true);
            $(document).unbind('jspanelbeforeclose', jsPanelCloseHandler);
            if(queryMap && queryMap.jsPanel){
                $(queryMap.jsPanel).unbind('resize', jsPanelResizeHandler);
            }
        }
    };

    mapResizeHandler = function(){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.reposition(configMap.jsPanelPosition);
        }
    };

    jsPanelResizeHandler = function(){
        if(queryMap && queryMap.table){
            resizeTable();
        }
    };

    highlightFeature = function(graphic){
        var symbol;
        symbol = symbolMaps.statsTypeHighlightSymbolMap[stateMap.statsType];
        if(graphic){
            graphic.setSymbol(symbol);
            stateMap.highlightedFeature = graphic;
        }
    };

    unhighlightFeature = function(){
        var symbol;
        symbol = symbolMaps.statsTypeSymbolMap[stateMap.statsType];
        if(!stateMap.justClickARow && stateMap.highlightedFeature){
            stateMap.highlightedFeature.setSymbol(symbol);
        }
        stateMap.justClickARow = false;
    };

    addGraphicOnMap = function(){
        if(!stateMap.featureInfo || !graphicLayer){
            return;
        }
        var featureInfo = stateMap.featureInfo.layerIdMap,
            featureSet, layerInfo;

        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（正在渲染图层）');
        }

        for(var layerId in featureInfo){
            if(featureInfo.hasOwnProperty(layerId)){
                featureSet = featureInfo[layerId];
                layerInfo = featureSet.layerInfo;
                array.forEach(featureSet.features, function(feature){
                    var graphic = new Graphic(feature.geometry, symbolMaps.statsTypeSymbolMap[stateMap.statsType], feature.attributes);
                    graphic._layerInfo = layerInfo;
                    graphicLayer.add(graphic);
                });
            }
        }
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（图层渲染完毕!）');
            window.setTimeout(function(){
                if(queryMap && queryMap.jsPanel && stateMap){
                    queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计');
                }
            }, 2000);
        }
    };

    loadFeatureInpcode = function(callback){
        var url = apiMaps.statsTypeInpcodeListApiMap[stateMap.statsType],
            arcgisUrl = apiMaps.featureTypeArcgisServiceUrlMap[stateMap.featureType],
            layerIds = configMap.featureTypeToLayerIds[stateMap.featureType],
            layerInfos = configMap.featureTypeToLayerInfo[stateMap.featureType];

        if(!url && arcgisUrl && layerIds && layerInfos){
            return;
        }
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（正在获取要素图形信息）');
        }
        request(url, {
            'method': 'POST',
            'handleAs': 'json',
            'data': {
                'projectid': stateMap.curProject.projectid,
                'projectname': encodeURIComponent(stateMap.curProject.projectname)
            }
        }).then(function(arr){
            if(!arr){
                return;
            }
            var queries = {},
                cond;

            cond = ' in ('+(array.map(arr, function(item){
                return "'"+item+"'";
            })).join(',')+')';
            array.forEach(layerIds, function(layerId){
                var queryTask, query, layerInfo;
                layerInfo = layerInfos[layerId];
                if(!layerId){
                    return;
                }
                queryTask = new QueryTask(arcgisUrl+'/'+layerId);
                query = new Query();
                query.outFields = [layerInfo.idField];
                query.returnGeometry = true;
                query.where = layerInfo.idField+cond;
                queries[layerId] = queryTask.execute(query);
            });
            if(queryMap && queryMap.jsPanel){
                queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（正在加载要素数据）');
            }
            all(queries).then(function(featureSets){
                var featureInfo = {
                    'layerIdMap': {}
                },
                    featureSet;

                for(var layerId in featureSets){
                    if(featureSets.hasOwnProperty(layerId)){
                        featureSet = featureSets[layerId];
                        if(featureSet.features && featureSet.features.length){
                            featureInfo.layerIdMap[layerId] = {
                                'layerInfo': layerInfos[layerId],
                                'features': featureSet.features
                            };
                        }
                    }
                }
                stateMap.featureInfo = featureInfo;

                if(stateMap.featureInfo && callback && callback.apply){
                    callback.apply(null, []);
                }
            }, function(){
                if(queryMap && queryMap.jsPanel){
                    queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（加载要素数据获取失败）');
                }
            });
        }, function(){
            if(queryMap && queryMap.jsPanel){
                queryMap.jsPanel.headerTitle(stateMap.statsName+'风险统计（要素图形信息获取失败）');
            }
        });
    };

    initGraphicLayer = function(){
        if(graphicLayer){
            destroyGraphicLayer();
        }
        graphicLayer = new GraphicLayer();
        map.addLayer(graphicLayer);

        loadFeatureInpcode(function(){
            addGraphicOnMap();
        });
    };

    destroyGraphicLayer = function(){
        if(!graphicLayer){
            return;
        }
        graphicLayer.clear();
        map.removeLayer(graphicLayer);
        graphicLayer = null;
    };

    destroyTable = function(){
        if(queryMap && queryMap.table){
            queryMap.table.bootstrapTable('destroy');
            delete queryMap.table;
        }
    };

    resizeTable = function(){
        var fixedHeaderTable = query('.fixed-table-header .stats-table-wrapper', queryMap.main)[0],
            fixedBodyTable = query('.fixed-table-body .stats-table-wrapper', queryMap.main)[0];
        if(queryMap.table){
            queryMap.table.bootstrapTable('resetView');
        }
        if(fixedHeaderTable && fixedBodyTable){
            domStyle.set(fixedBodyTable, 'width', domStyle.get(fixedHeaderTable, 'width') + 'px');
        }
    };

    initTable = function(){
        var columns, model;
        if(queryMap && queryMap.tableWrapper){
            model = modelMaps.statsTypeModelMap[stateMap.statsType];
            if(!model){
                console.error('model for stats type '+stateMap.statsName+' is null!');
                return;
            }
            columns = (function(){
                var cols, field, fieldName;
                cols = [];
                for(var i=0;i<model.displayFields.length;i++){
                    fieldName = model.displayFields[i];
                    field = model.fields[fieldName];
                    cols.push({
                        'field': fieldName,
                        'title': field.name,
                        'formatter': field.displayFormatter || model.deafultFieldDisplayFormatter,
                        'align': 'center',
                        'valign': 'bottom'
                    });
                }
                return cols;
            })();
            
            columns.unshift({
                'field': 'id',
                'title': '序号',
                'align': 'center',
                'valign': 'bottom',
                'formatter': function(value, item, index){
                    return index + 1;
                }
            });

            $(queryMap.tableWrapper).bootstrapTable({
                'url': apiMaps.statsTypeApiMap[stateMap.statsType],
                'queryParams': function(params){
                    
                    return {
                        'page.pageNo': Math.floor(params.offset/params.limit)+1,
                        'page.pageSize': params.limit,
                        'projectid': stateMap.curProject.projectid                        
                    };
                },
                'responseHandler': function(response){
                    if(!response){
                        return null;
                    }
                    return {
                        'total': response.totalItems,
                        'rows': response.result
                    };
                },
                'pageList': [100, 200, 500, 1000],
                'onPostBody': resizeTable,
                'onPostHeader': resizeTable,
                'onClickRow': clickTableRowHandler,
                'height': queryMap.main.offsetHeight - 5,
//                'showRefresh': true,
//                'showColumns': true,
                'pagination': true,
                'sidePagination': 'server',
                'pageSize': configMap.pageSize,
                'columns': columns
            });

            queryMap.table = $(queryMap.tableWrapper);
        }
    };

    initDom = function(){
        if(queryMap){
            destroyDom();
        }
        queryMap = {};

        queryMap.jsPanel = $.jsPanel({
            'id': configMap.jsPanelId,
            'container': map.root.parentNode,
            'content': templates.main,
            'headerTitle': stateMap.statsName+'风险统计',
            'contentSize': configMap.jsPanelContentSize,
            'position': configMap.jsPanelPosition,
            'minimizedMargin': configMap.jsPanelMinimizedMargin,
            'onmaximized': jsPanelResizeHandler,
            'onnormalized': jsPanelResizeHandler
        });

        queryMap.main = query('.swmm-feature-stats', map.root.parentNode)[0];
        queryMap.controlPanel = query('.control-panel', queryMap.main)[0];
        queryMap.contentWrapper = query('.stats-content-wrapper', queryMap.main)[0];
        queryMap.tableWrapper = query('.stats-table-wrapper', queryMap.contentWrapper)[0];
        queryMap.statusPanel = query('.status-panel', queryMap.main)[0];

        initTable();

        $(queryMap.jsPanel).bind('resize', jsPanelResizeHandler);
        $(document).bind('jspanelbeforeclose', jsPanelCloseHandler);
        eventHandlerMap.resizeMap = map.on('resize', mapResizeHandler);
        eventHandlerMap.clickSpace = on(document, 'click', unhighlightFeature);
    };

    destroyDom = function(){
        if(eventHandlerMap.clickSpace){
            eventHandlerMap.clickSpace.remove();
            delete eventHandlerMap.clickSpace;
        }
        if(eventHandlerMap.resizeMap){
            eventHandlerMap.resizeMap.remove();
            delete eventHandlerMap.resizeMap;
        }
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        queryMap = null;
    };

    loadResources = function(){
      var dir = resourceLoader.getDojoModuleLocation(module);
        resourceLoader.addCSSFile(resources.CSS, dir);
      };

    emit = function(eventName, eventObject){
        if(eventName && eventHandlers[eventName]){
            return eventHandlers[eventName].apply(null, [eventObject || {}]);
        }
        return true;
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }
        if(!options.serviceApis){
            throw "'serviceApis' is needed for init!";
        }
        if(!options.layerIdMap){
            throw "'layerIdMap' is needed for init!";
        }

        map = _map;

        lang.mixin(configMap, options);
        lang.mixin(eventHandlers, configMap.eventHandlers || {});
        lang.mixin(symbolMaps.statsTypeSymbolMap, configMap.symbols || {});
        
        configMap.featureTypeToLayerIds = {};

        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_LINE] = configMap.layerIdMap.pipe;
        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_NODE] = configMap.layerIdMap.pipe;

        loadResources();

        apiMaps.statsTypeApiMap = (function(){
            var apiMap = {};
            apiMap[constants.STATS_TYPE_LINE_OVERLOAD] = configMap.serviceApis.lineOverloadStats;
            apiMap[constants.STATS_TYPE_NODE_OVERLOAD] = configMap.serviceApis.nodeOverloadStats;
            apiMap[constants.STATS_TYPE_NODE_FLOODED] = configMap.serviceApis.nodeFloodedStats;
            return apiMap;
        })();

        apiMaps.statsTypeInpcodeListApiMap = (function(){
            var apiMap = {};
            apiMap[constants.STATS_TYPE_LINE_OVERLOAD] = configMap.serviceApis.lineOverloadInpcodeList;
            apiMap[constants.STATS_TYPE_NODE_OVERLOAD] = configMap.serviceApis.nodeOverloadInpcodeList;
            apiMap[constants.STATS_TYPE_NODE_FLOODED] = configMap.serviceApis.nodeFloodedInpcodeList;
            return apiMap;
        })();

        configMap.featureTypeToLayerIds = {};
        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_LINE] = configMap.layerIdMap[constants.FEATURE_TYPE_LINE];
        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_NODE] = configMap.layerIdMap[constants.FEATURE_TYPE_NODE];

        configMap.featureTypeToLayerInfo = {};
        configMap.featureTypeToLayerInfo[constants.FEATURE_TYPE_LINE] = configMap.layerInfoMap[constants.FEATURE_TYPE_LINE];
        configMap.featureTypeToLayerInfo[constants.FEATURE_TYPE_NODE] = configMap.layerInfoMap[constants.FEATURE_TYPE_NODE];
    };

    use = function(options){
        if(queryMap){
            cancel(false, true);
        }
        options = options || {};
        if(!options.featureType){
            throw "'featureType' is needed for use!";
        }
        if(!options.statsType){
            throw "'statsType' is needed for use!";
        }
        if(!options.curProject){
            throw "'curProject' is needed for use!";
        }
        if(!options.featureServiceUrls){
            throw "'featureServiceUrls' is needed for use!";
        }

        stateMap = {};

        lang.mixin(configMap.serviceApis, options.featureServiceUrls);

        stateMap.featureType = options.featureType;
        stateMap.statsType = options.statsType;
        stateMap.curProject = options.curProject;

        stateMap.statsName = nameMaps.featureTypeNameMap[stateMap.featureType]+nameMaps.statsTypeNameMap[stateMap.statsType];

        apiMaps.featureTypeArcgisServiceUrlMap = (function(){
            var apiMap = {};
            apiMap[constants.FEATURE_TYPE_NODE] = configMap.serviceApis.pipeNodeServiceUrl;
            apiMap[constants.FEATURE_TYPE_LINE] = configMap.serviceApis.pipeServiceUrl;
            return apiMap;
        })();

        initGraphicLayer();
        initDom();
    };

    cancel  = function(fromEvent, skitEmit){
        if(!fromEvent && queryMap && queryMap.jsPanel){
            if(stateMap){
                stateMap.doNotTriggerCloseEvent = true;
            }
            queryMap.jsPanel.close(null, true, true);
        }
        var prevProject = stateMap?stateMap.curProject:null;
        destroyGraphicLayer();
        destroyDom();
        stateMap = null;
        if(!skitEmit){
            emit('canceled', {
                'project': prevProject
            });
        }
    };

    exports = {
        'init': init,
        'use': use,
        'cancel': cancel
    };

    lang.mixin(exports, constants);

    return exports;
});
