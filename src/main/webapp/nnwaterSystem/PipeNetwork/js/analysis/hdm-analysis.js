define([
    'module',
    'dojo/promise/all',
    'dojo/string',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/request',
    'dojo/on',
    'dojo/query',
    'dojo/html',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojox/gfx',
    'esri/geometry/mathUtils',
    'esri/geometry/scaleUtils',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/Color',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/geometry/Point',
    'esri/InfoTemplate',
    'esri/toolbars/draw',
    'pipe-network/lib/resource-loader',
    'pipe-network/lib/basic-utils',
    'pipe-network/data-model',
    'pipe-network/lib/scale-factor-convertor',
    'pipe-network/pipe-model-utils',
    'pipe-network/pipe-node-model-utils',
    'pipe-network/lib/geometry-utils',
    'pipe-network/lib/map-utils'
], function(
    module,
    all,
    string,
    lang,
    array,
    request,
    on,
    query,
    html,
    domClass,
    domAttr,
    domConstruct,
    domStyle,
    gfx,
    mathUtils,
    scaleUtils,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    Color,
    IdentifyTask,
    IdentifyParameters,
    GraphicsLayer,
    Graphic,
    Query,
    QueryTask,
    Point,
    InfoTemplate,
    Draw,
    resourceLoader,
    basicUtils,
    dataModel,
    scaleFactorConvertor,
    pipeUtils,
    pipeNodeUtils,
    geometryUtils,
    mapUtils
){
    'use strict';
    /**
     * Events: ready, beforeUse, afterUse, beforeCancel, afterCancel
     */
    return (function(){
        var exports,
            map,
            //----
            initDone = false,
            //----
            configMap = {},
            stateMap = {},
            eventHandlers = {},
            eventHandlerMap = {},
            //----
            symbols = {},
            //----
            controlPanel,
            stroker,
            resultPanel,
            //----
            initControlPanel,
            initStroker,
            initResultPanel,
            //----
            isInUse,
            emit,
            init,
            use,
            cancel;

        initControlPanel = function(options){//COMPONENT CONTROL PANEL
            /**
             * Events: clickCloseBtn, beforeOpen, afterOpen, beforeClose, afterClose,
             *         beforePause, afterPause, beforeResume, afterResume, beforeClear,
             *         afterClear
             */
            controlPanel = (function(options){
                var map,
                    //----
                    configMap = {},
                    stateMap = {},
                    queryMap = {},
                    eventHandlers = {},
                    eventHandlerMap = {},
                    //----
                    resources = {
                        'IMGS': {
                            'LOADING': '../../img/loading.gif'
                        },
                        'CSS': '../../css/hdm-analysis-control-panel.css'
                    },
                    templates = {
                        'main': ""+
                            "<div class=\"hdm-analysis-control-panel\">"+
                             "<div class=\"control-panel-title\">"+
                              "<div class=\"control-panel-title-text\">横断面分析</div>"+
                              "<div class=\"control-panel-title-btns\">"+
                               "<a href=\"#\" class=\"control-panel-title-btn\" data-role=\"toggle\" title=\"收起\">-</a>"+
                               "<a href=\"#\" class=\"control-panel-title-btn\" data-role=\"close\">×</a>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"analysis-loading analysis-loading-hidden\">"+
                              "<img class=\"loading-img\" src=\""+(resourceLoader.getPathFromDir(resources.IMGS.LOADING, resourceLoader.getDojoModuleLocation(module)))+"\"/>"+
                              "<div class=\"loading-text\">分析中，请稍等</div>"+
                             "</div>"+
                             "<div class=\"control-panel-content\">"+
                             "</div>"+
                             "<div class=\"control-panel-control-btns\">"+
                              "<button class=\"control-panel-control-btn\" data-role=\"pause\"><span>暂停</span></button>"+
                              "<button class=\"control-panel-control-btn\" data-role=\"clear\"><span>清空</span></button>"+
                             "</div>"+
                            "</div>",
                        'operationTip': ""+
                            "<span style=\"color: #0000FF;\">操作提示：</span>"+
                            "<p><span style=\"margin-left: 2em;\"></span>点击并拖拽鼠标，在地图上划取一线段与管线相交。</p>"+
                            "<p><span style=\"margin-left: 2em;\"></span>划取线段期间无法移动地图。点击【暂停】之后可以移动地图。暂停期间，点击【恢复】，可以重新划取线段。</p>"+
                            "<p><span style=\"margin-left: 2em;\"></span>点击【清空】可以清空当前分析结果。</p>"
                            
                    },
                    //----
                    loadResources,
                    //----
                    pauseHandler,
                    closeHandler,
                    toggleHandler,
                    clearHandler,
                    confirmHandler,
                    //----
                    registerDomEvents,
                    removeDomEvents,
                    //----
                    clearState,
                    //----
                    setTipContent,
                    startLoading,
                    stopLoading,
                    //----
                    initDom,
                    destroyDom,
                    //----
                    emit,
                    init,
                    resume,
                    pause,
                    open,
                    close;

                pauseHandler = function(){
                    //TODO
                    var btnRole = domAttr.get(queryMap.pauseBtn, 'data-role');
                    if(btnRole == 'pause'){
                        if(emit('beforePause')){
                            pause();
                        }
                    }else if(btnRole == 'resume'){
                        if(emit('beforeResume')){
                            resume();
                        }
                    }
                };

                closeHandler = function(){
                    emit('clickCloseBtn');
                };

                toggleHandler = function(){
                    if(!queryMap.main){
                        return;
                    }
                    if(domClass.contains(queryMap.main, 'minimized')){
                        domClass.remove(queryMap.main, 'minimized');
                        html.set(queryMap.toggleBtn, "-");
                        domAttr.set(queryMap.toggleBtn, 'title', '收起');
                    }else{
                        domClass.add(queryMap.main, 'minimized');
                        html.set(queryMap.toggleBtn, "□");
                        domAttr.set(queryMap.toggleBtn, 'title', '展开');
                    }
                };

                clearHandler = function(){
                    emit('beforeClear');
                    //TODO
                    emit('afterClear');
                };

                confirmHandler = function(){
                    //TODO
                };

                registerDomEvents = function(){
                    if(queryMap){
                        eventHandlerMap.close = on(queryMap.closeBtn, 'click', closeHandler);
                        eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', toggleHandler);
                        eventHandlerMap.pause = on(queryMap.pauseBtn, 'click', pauseHandler);
                        eventHandlerMap.clear = on(queryMap.clearBtn, 'click', clearHandler);
                    }
                    //TODO
                };

                removeDomEvents = function(){
                    if(eventHandlerMap.close){
                        eventHandlerMap.close.remove();
                        delete eventHandlerMap.close;
                    }
                    if(eventHandlerMap.toggle){
                        eventHandlerMap.toggle.remove();
                        delete eventHandlerMap.toggle;
                    }
                    if(eventHandlerMap.pause){
                        eventHandlerMap.pause.remove();
                        delete eventHandlerMap.pause;
                    }
                    if(eventHandlerMap.clear){
                        eventHandlerMap.clear.remove();
                        delete eventHandlerMap.clear;
                    }
                    //TODO
                };

                startLoading = function(){
                    if(queryMap && queryMap.loading){
                        domClass.remove(queryMap.loading, 'analysis-loading-hidden');
                    }
                };

                stopLoading = function(){
                    if(queryMap && queryMap.loading){
                        domClass.add(queryMap.loading, 'analysis-loading-hidden');
                    }
                };

                setTipContent = function(content){
                    if(queryMap && queryMap.content){
                        html.set(queryMap.content, content);
                    }
                };

                initDom = function(){
                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);

                    queryMap.title = query('.control-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.control-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.control-panel-title-btns', queryMap.title)[0];
                    queryMap.toggleBtn = query('.control-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];
                    queryMap.closeBtn = query('.control-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];

                    queryMap.content = query('.control-panel-content', queryMap.main)[0];

                    queryMap.controlBtns = query('.control-panel-control-btns', queryMap.main)[0];
                    queryMap.pauseBtn = query('.control-panel-control-btn[data-role=pause]', queryMap.controlBtns)[0];
                    queryMap.clearBtn = query('.control-panel-control-btn[data-role=clear]', queryMap.controlBtns)[0];
//                    queryMap.confirmBtn = query('.control-panel-control-btn[data-role=confirm]', queryMap.controlBtns)[0];
                                        
                    setTipContent(templates.operationTip);

                    queryMap.loading = query('.analysis-loading', queryMap.main)[0];

                    domConstruct.place(queryMap.main, queryMap.parent);

                    //TODO
                    registerDomEvents();
                };

                clearState = function(){
                    stateMap = {};
                    //TODO
                };

                destroyDom = function(){
                    removeDomEvents();
                    domConstruct.destroy(queryMap.main);
                    queryMap = {};
                    //TODO
                };

                loadResources = function(){
                    var dir = resourceLoader.getDojoModuleLocation(module);
                    resourceLoader.addCSSFile(resources.CSS, dir);
                };

                init = function(){
                    options = options || {};
                    
                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, configMap.eventHandlers || {});

                    loadResources();
                    //TODO
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
                };

                resume = function(){
                    if(emit('beforeResume')){
                        domAttr.set(queryMap.pauseBtn, 'data-role', 'pause');
                        html.set(queryMap.pauseBtn, '<span>暂停</span>');
                        emit('afterResume');
                    }
                };

                pause = function(){
                    if(emit('beforePause')){
                        domAttr.set(queryMap.pauseBtn, 'data-role', 'resume');
                        html.set(queryMap.pauseBtn, '<span>恢复</span>');
                        emit('afterPause');
                    }
                };

                open = function(){
                    emit('beforeOpen');
                    initDom();
                    //TODO
                    emit('afterOpen');
                };

                close = function(){
                    emit('beforeClose');
                    destroyDom();
                    clearState();
                    //TODO
                    emit('afterClose');
                };

                //TODO

                init();

                return {
                    'open': open,
                    'close': close,
                    'resume': resume,
                    'pause': pause,
                    'startLoading': startLoading,
                    'stopLoading': stopLoading
                };
            })(options);
        };
        
        initStroker = function(options){//COMPONENT STROKER
            /**
             * Events: beforeStart, afterStart, beforeActivate, afterActivate, 
             *         beforeDeactivate, afterDeactivate, beforeClear, afterClear, 
             *         beforeStop, afterStop, strokeSuccess, strokeFail, querySuccess
             */
            stroker = (function(options){
                var map,
                    //----
                    roadIdentifyTask,
                    roadIdentifyParameters,
                    identifyTask,
                    identifyParameters,
                    drawTool,
                    //----
                    configMap = {
                        'layerDefs': {}
                    },
                    stateMap = {},
                    queryMap = {},
                    //----
                    eventHandlerMap = {},
                    eventHandlers = {},
                    //----
                    getRoads,
                    getPipeNodes,
                    stroke,
                    //----
                    drawCompleteHandler,
                    //----
                    registerDrawToolEvents,
                    removeDrawToolEvents,
                    //----
                    destroyDrawTool,
                    initDrawTool,
                    destroyIdentifyTask,
                    initIdentifyTask,
                    //----
                    emit,
                    init,
                    start,
                    stop,
                    clear,
                    activate,
                    deactivate;

                getRoads = function(callback){//获取截取的道路数据
                    if(roadIdentifyTask && roadIdentifyParameters){//如果有道路查询相关参数，才进行路网查询，如果没有就不查

                        roadIdentifyParameters.geometry = stateMap.crossLine;
                        roadIdentifyParameters.mapExtent = map.extent;
                        roadIdentifyParameters.width = map.width;
                        roadIdentifyParameters.height = map.height;
                        
                        roadIdentifyTask.execute(roadIdentifyParameters).then(function(identifyResult){
                            /*
                            var sls = new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_DASH,
                                new Color([255,0,0]),
                                3
                            ), sfs = new SimpleFillSymbol(
                                SimpleFillSymbol.STYLE_SOLID,
                                new SimpleLineSymbol(
                                    SimpleLineSymbol.STYLE_DASHDOT,
                                    new Color([255,0,0]), 2
                                ),
                                new Color([255,255,0,0.25])
                            );

                            array.forEach(identifyResult, function(obj){
                                var f = obj.feature,
                                    g;
                                g = new Graphic(f.geometry, f.geometry.type == 'polyline'?sls:sfs);
                                map.graphics.add(g);
                            });
                             */
                            if(callback && callback.apply){
                                callback.apply(null, [identifyResult]);
                            }
                        });
                    }else{
                        if(callback && callback.apply){
                            callback.apply(null, [null]);
                        }
                    }
                };

                getPipeNodes = function(pipeFeatures, callback){//获取所截选的管线相关联的管点
                    var pipeNodeModels = configMap.pipeNodeQueryParameters.models,
                        nodeIds = [],
                        resultMap = {},
                        queries = {},
                        pipeNodeDeferreds,
                        cond;

                    array.forEach(pipeFeatures, function(pipeFeature){//先收集所有管线起点和终点编号
                        var InJuncID = pipeUtils.getInJuncID(pipeFeature),
                            OutJuncID = pipeUtils.getOutJuncID(pipeFeature);
                        !InJuncID || nodeIds.push(InJuncID);
                        !OutJuncID || nodeIds.push(OutJuncID);
                    });

                    cond = ' in (' + array.map(nodeIds, function(nodeId){//组装查询条件
                        return "'"+nodeId+"'";
                    }).join(',') + ')';

                    array.forEach(pipeNodeModels, function(model){//对每一个管点图层进行查询
                        var query = new Query(),
                            queryTask = new QueryTask(configMap.pipeNetworkServiceUrl+'/'+model.id);
                        query.returnGeometry = true;
                        query.where = model.idField + cond;
                        query.outFields = ['*'];

                        queries[model.name] = queryTask.execute(query);
                    });

                    all(queries).then(function(data){//将各个管点图层的查询结果进行统一处理
                        //将管点要素存入一个以管点ID为key的Map中
                        array.forEach(pipeNodeModels, function(model){
                            array.forEach(data[model.name].features, function(pipeNodeFeature){
                                resultMap[pipeNodeFeature.attributes[model.idField]] = pipeNodeFeature;
                            });
                        });

                        if(callback && callback.apply){//将结果集传给回调函数进行处理
                            callback.apply(null, [resultMap]);
                        }
                    });
                };

                stroke = function(crossLine){
                    stateMap.crossLine = crossLine;

                    identifyParameters.geometry = crossLine;
                    identifyParameters.mapExtent = map.extent;
                    identifyParameters.width = map.width;
                    identifyParameters.height = map.height;
                    identifyTask.execute(identifyParameters, function(identifyResult){
                        if(!identifyResult || !identifyResult.length){
                            emit('emptyResult');
                            return;
                        }

                        var pipeModels = configMap.layerModelMap,
                            layer2model = configMap.layerModelMap,
                            queryLayerIds = {},
                            queries = {},
                            defQueries = {},
                            queryResult = {},
                            allDefferreds = [],
                            queryTask, query, queryCond,
                            featureQuery, layerDefQuery;

                        //将Identify操作返回的要素集中的要素的OBJECTID取出，作为Query的参数
                        array.forEach(identifyResult, function(object){
                            var feature = object.feature,
                                layerId = object.layerId;
                            if(!queryLayerIds[layerId]){
                                queryLayerIds[layerId] = {
                                    'id': layerId,
                                    'objectIds': []
                                };
                            }
                            queryLayerIds[layerId].objectIds.push(feature.attributes.OBJECTID);
                        });

                        for(var layerId in queryLayerIds){
                            //对每一个图层都进行Query操作
                            if(queryLayerIds.hasOwnProperty(layerId)){
                                queryTask = new QueryTask(configMap.pipeNetworkServiceUrl + '/' + layerId);

                                query = new Query();
                                query.returnGeometry = true;
                                query.objectIds = queryLayerIds[layerId].objectIds;
                                query.outFields = ['*'];
                                queries[layerId] = queryTask.execute(query);
                            }
                            //如果缓存中没有当前图层的图层定义数据，则到服务器获取，并存入缓存
                            if(!configMap.layerDefs[layerId]){
                                defQueries[layerId] = request(
                                    configMap.pipeNetworkServiceUrl + '/' + layerId + '?f=pjson',
                                    {
                                        'handleAs': 'json',
                                        'headers': {
                                            "X-Requested-With": ""
                                        }
                                    }
                                );
                            }
                        }

                        featureQuery = all(queries);
                        layerDefQuery = all(defQueries);

                        //对所有Query，以及图层定义查询的请求进行集中处理
                        all([featureQuery, layerDefQuery]).then(function(data){
                            var featureSets = data[0],
                                layerDefs = data[1],
                                allFeatures = [],
                                layerId,
                                featureSet,
                                modelResult;


                            //要素结果集中按数据模型进行分类
                            array.forEach(['Pipe', 'Conduit'], function(modelName){
                                queryResult[modelName] = {
                                    'modelDef': dataModel.models[modelName],
                                    'features': []
                                };
                            });

                            //对本次查询的图层定义进行缓存
                            for(layerId in layerDefs){
                                if(layerDefs.hasOwnProperty(layerId)){
                                    configMap.layerDefs[layerId] = layerDefs[layerId];
                                }
                            }

                            for(layerId in featureSets){
                                if(featureSets.hasOwnProperty(layerId)){
                                    featureSet = featureSets[layerId];

                                    modelResult = queryResult[layer2model[layerId]];

                                    array.forEach(featureSet.features, function(feature){
                                        //为每一个要素添加所属图层的定义信息（引用），并将要素加入结果集
                                        feature._layerDef = configMap.layerDefs[layerId];
                                        modelResult.features.push(feature);
                                        allFeatures.push(feature);
                                    });
                                }
                            }

                            //因为需要计算路面高程，所以需要查询管点
                            getPipeNodes(allFeatures, function(pipeNodeIdMap){
                                getRoads(function(roadInfo){
                                    //数据查询完毕，触发一个查询成功事件，通知订阅者对数据进行处理
                                    emit('querySuccess', {
                                        'crossLine': stateMap.crossLine,
                                        'pipeInfo': queryResult,
                                        'roadInfo': roadInfo,
                                        'pipeNodeInfo': {
                                            'idMap': pipeNodeIdMap
                                        }
                                    });
                                });
                            });

                        });
                    });
                };

                drawCompleteHandler = function(event){
                    var crossLine = event.geometry;
                    if(crossLine){
                        stroke(crossLine);
                        emit('strokeSuccess');
                    }else{
                        alert("横截线获取失败，请重画！");
                        emit('strokeFail');
                    }
                    //TODO
                };

                registerDrawToolEvents = function(){
                    removeDrawToolEvents();

                    if(drawTool){
                       eventHandlerMap.drawComplete = drawTool.on('draw-complete', drawCompleteHandler);
                    }
                    //TODO
                };
                
                removeDrawToolEvents = function(){
                    if(eventHandlerMap.drawComplete){
                        eventHandlerMap.drawComplete.remove();
                        delete eventHandlerMap.drawComplete;
                    }
                    //TODO
                };

                destroyIdentifyTask = function(){
                    identifyParameters = null;  
                    identifyTask = null;
                    roadIdentifyParameters = null;
                    roadIdentifyTask = null;
                };

                initIdentifyTask = function(){
                    identifyTask = new IdentifyTask(configMap.pipeNetworkServiceUrl);
                    identifyParameters = (function(params){
                        var idParams = new IdentifyParameters();

                        idParams.tolerance = 3;
                        idParams.returnGeometry = true;
                        idParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

                        lang.mixin(idParams, params);

                        return idParams;
                    })(configMap.pipeIdentifyParameters);

                    if(configMap.roadNetworkServiceUrl && configMap.roadIdentifyParameters && configMap.roadIdentifyParameters.layerIds){
                        roadIdentifyTask = new IdentifyTask(configMap.roadNetworkServiceUrl);
                        roadIdentifyParameters = (function(params){
                            var idParams = new IdentifyParameters();

                            idParams.tolerance = 3;
                            idParams.returnGeometry = true;
                            idParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                            
                            lang.mixin(idParams, params);

                            return idParams;
                        })(configMap.roadIdentifyParameters);
                    }
                };

                destroyDrawTool = function(){
                    removeDrawToolEvents();
                    drawTool = null;
                    //TODO
                };

                initDrawTool = function(){
                    if(drawTool){
                        throw "draw tool already exists, failed to create a new one!";
                    }
                    drawTool = new Draw(map, {
                        'showTooltips': false
                    });
                    //TODO
                };

                init = function(){
                    options = options || {};

                    if(!options.map){
                        throw "map is needed for options!";
                    }

                    if(!options.pipeNetworkServiceUrl){
                        throw "'pipeNetworkServiceUrl' is needed for options!";
                    }

                    if(!options.pipeQueryParameters){
                        throw "'pipeQueryParameters' is needed for options!";
                    }

                    if(!options.layerModelMap){
                        throw "'layerModelMap' is needed for options!";
                    }

                    if(!options.pipeNodeQueryParameters){
                        throw "'pipeNodeQueryParameters' is needed for options!";
                    }

                    if(!options.pipeNodeQueryParameters.models){
                        throw "'models' is needed for pipeNodeQueryParameters!";
                    }

                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, configMap.eventHandlers || {});
                    //TODO
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                       return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
                };

                start = function(){
                    emit('beforeStart');
                    initIdentifyTask();
                    initDrawTool();
                    activate();
                    //TODO
                    emit('afterStart');
                };

                activate = function(){
                    if(drawTool && !stateMap.activated){
                        emit('beforeActivate');
                        drawTool.activate(Draw.LINE);
                        registerDrawToolEvents();
                        //TODO
                        stateMap.activated = true;
                        emit('afterActivate');
                    }
                };

                deactivate = function(){
                    if(drawTool && stateMap.activated){
                        emit('beforeDeactivate');
                        removeDrawToolEvents();
                        drawTool.deactivate();
                        //TODO
                        stateMap.activated = false;
                        emit('afterDeactivate');
                    }
                };

                clear = function(){
                    emit('beforeClear');
                    stateMap = {};
                    //TODO
                    emit('afterClear');
                };

                stop = function(){
                    emit('beforeStop');
                    deactivate();
                    clear();
                    destroyDrawTool();
                    destroyIdentifyTask();
                    //TODO
                    emit('afterStop');
                };

                //TODO

                init();

                return {
                    'start': start,
                    'activate': activate,
                    'deactivate': deactivate,
                    'clear': clear,
                    'stop': stop
                };
            })(options);
        };

        initResultPanel = function(options){//COMPONENT RESULT PANEL
            /**
             * Events: beforeInitResult, afterInitResult, beforeDestroyResult, afterDestroyResult
             */
            resultPanel = (function(options){
                var map,
                    //----
                    symbols = {
                        'CROSSLINE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
                        'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                        'PIPE_INTERSECTION_POINT_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25])),
                        'ROAD_INTERSECTION_POINT_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 6, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'HIGHLIGHTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2)
                    },
                    configMap = {
                        'autoFit': true,
                        'equalScale': true,
                        //---- chart options
                        'graph_min_width': 150, //自适应时，图像部分最小宽度（不含属性表格，各边距，文字等，其实就是所有以"米"为单位的对象的宽度总和），如果可用空间小于这个值，将采取这个值，同时画板会出现滚动条
                        'graph_min_height': 40, //自适应时，图像部分最小高度，同上
                        //--
                        'padding_top': 40, //画板上边距
                        'padding_bottom': 10, //画板下边距
                        'padding_left': 20, //画板左边距
                        'padding_right': 40, //画板右边距
                        //--
                        'attr_table_header_cell_padding_left': 5, //属性表格表头左内边距
                        'attr_table_header_cell_padding_right': 5, //属性表格表头右内边距
                        'attr_table_line_padding_top': 3, //属性表格表头上内边距
                        'attr_table_line_padding_bottom': 3, //属性表格表头底内边距
                        'attr_table_padding_top': 30, //属性表格（整体）上外边距
                        //--
                        'vertical_ruler_width': 2, //竖尺宽度（线粗）
                        'vertical_ruler_padding_left': 5, //竖尺左外边距
                        'vertical_ruler_padding_right': 45, //竖尺右外边距
                        'vertical_ruler_mark_width': 5, //竖尺刻度线长度
                        'vertical_ruler_text_padding_left': 5, //竖尺文字左边距（不是每个字符的间距），是整个文字对象的左外边距
                        'vertical_ruler_text_padding_right': 5, //竖尺文字右边距
                        'vertical_ruler_text_col_count': 3, //竖尺文字（最大）宽度（最多有多少个字符）
                        //--
                        'attr_font_size': 12, //属性文字字体大小，其实图中所有文字都是这个大小
                        'attr_font_padding_top': 3, //文字上外边距
                        'attr_font_padding_bottom': 3, //文字下外边距
                        'attr_font_padding_left': 3, //文字左边距（类似竖尺那里，这不是字符间距）
                        'attr_font_padding_right': 3, //文字右边距
                        'attr_font_letter_space': 0, //字符间距
                        //--
                        'surface_text_line_count': 3, //地面以上的文字行数
                        'surface_line_width': 1, //地面线的宽度（线粗）
                        //--
                        'direction_circle_radius': 15, //方向标志圆形半径
                        'direction_circle_line_width': 1, //方向标志圆形线宽
                        'direction_pointer_line_width': 2, //方向标志指针线宽
                        //--
                        'pipe_ref_line_color': '#9D9D9D', //管线参考线的颜色
                        'default_pipe_border_color': '#000000', //默认的管线截面图形边框颜色
                        'default_pipe_fill_color': '#FFFFFF', //默认的管线截面图形填充颜色
                        'vertical_ruler_bgcolor': '#000000', //竖尺主体颜色
                        'vertical_ruler_mark_line_color': '#000000', //竖尺刻度线颜色
                        'vertical_ruler_mark_text_color': '#000000', //竖尺刻度文字颜色
                        'surface_line_color': '#000000', //地面线颜色
                        'surface_vertical_ref_line_color': '#A2A2A2', //地面参考线（最左，最右两端的垂直参考线）颜色
                        'attr_table_border_color': '#000000', //属性表格边框颜色
                        'attr_table_header_text_color': '#000000', //属性表格表头文字颜色
                        'attr_table_body_text_color': '#000000', //属性表格内容文字颜色
                        'road_border_line_color': '#FFA0A0', //道路边线颜色
                        'road_center_line_color': '#000000', //道路中心线颜色
                        'road_text_color': '#000000',
                        //--
                        'direction_pointer_color': '#000000', //方向标志指针颜色
                        'direction_circle_line_color': '#000000', //方向标志圆形边框颜色
                        'direction_circle_fill_color': '#FAFAFA', //方向标志圆形填充颜色
                        'direction_text_color': '#000000',//方向标志文字颜色
                        //--
                        'attrTableDisplayFields': [//属性表格中要展示的属性，用于自动绘制表格，也用于计算表格所需的高度
                            {
                                'displayName': '类别',
                                'get': function(feature, index){
                                    var type = feature.attributes.hasOwnProperty('PIPE_CATEGORY')? 0:1,
                                        value = pipeUtils.getPipeCategory(feature) || pipeUtils.getConduitCategory(feature),
                                        categoryMap = {
                                            '1': '雨水',
                                            '2': '污水',
                                            '3': '合流',
                                            '4': '其他'
                                        };

                                    return  (categoryMap[''+value] || '') + (type === 0?'管':'渠');
                                }
                            },
                            {
                                'displayName': '地面高程（米）', //属性的名称
//                                'rotated': true, //排列方式，取值[rotated | vertical | 不填 | null]。 其中，roated代表文字顺时针旋转90°；vertical代表每个字一行竖排；其他情况代表正常排列（横排）
                                'get': function(feature,index){ //该属性值的获取方式
                                    //TODO no elev for now
                                    return basicUtils.isNumber(feature.intersectionSurfaceElev)? feature.intersectionSurfaceElev.toFixed(2) : '';
                                }
                            },
                            {
                                'displayName': '管底高程（米）',
//                                'rotated': true,
                                'get': function(feature, index){
                                    var elev = feature.intersectionPointElev;
                                    if(basicUtils.isNumber(elev)){
                                        return elev.toFixed(2);
                                    }
                                    return '';
                                }
                            },
                            {
                                'displayName': '管径（毫米）',
//                                'rotated': true,
                                'get': function(feature, index){
                                    var deep = pipeUtils.getShapeDeep(feature),
                                        width = pipeUtils.getShapeWidth(feature),
                                        value = '';
                                    
                                    if(!basicUtils.isNumber(deep)){
                                        value = '';
                                    }else if(!basicUtils.isNumber(width)){
                                        value += deep * 1000;
                                    }else if(pipeUtils.getShapeType(feature) === 0){
                                        value += deep * 1000;
                                    }else{
                                        value += (deep * 1000) + '×' + (width * 1000);
                                    }
                                    return value;
                                }
                            },
                            {
                                'displayName': '管材',
//                                'rotated': true,
                                'get': function(feature, index){
                                    return pipeUtils.getMaterial(feature) || '';
                                }
                            },
                            {
                                'displayName': '间距(米)',
                                'right': true,
                                'get': function(feature, index){
                                    var value = feature.distanceToNext;
                                    if(basicUtils.isNumber(value)){
                                        return value.toFixed(1);
                                    }
                                    return '';
                                }
                            }
                        ]
                    },
                    stateMap = {},
                    eventHandlerMap = {},
                    eventHandlers = {},
                    gfxMap,
                    queryMap,
                    graphicLayer,
                    //----
                    resources = {
                        'CSS': '../../css/hdm-analysis-result-panel.css'
                    },
                    templates = {
                        'main': ""+
                            "<div class=\"hdm-analysis-result-panel\">"+
                             "<div class=\"result-panel-title\">"+
                              "<div class=\"result-panel-title-text\">横断面分析结果</div>"+
                              "<div class=\"result-panel-title-btns\">"+
                               "<a class=\"result-panel-title-btn\" data-role=\"toggle\" href=\"#\" data-minimizedText=\"□\" data-normalText=\"-\">-</a>"+
                               "<a class=\"result-panel-title-btn\" data-role=\"close\" href=\"#\">×</a>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"result-panel-control-bar\">"+
                              "<div class=\"result-panel-control-bar-scaler\">"+
                               "<h5>选项</h5>"+
                               "<label title=\"使X,Y两个比例尺保持相等\"><input checked=\"true\" name=\"equalScale\" type=\"checkbox\"/>&nbsp;等比例</label>"+
                               "<label title=\"根据当前画布大小自动计算合适的比例，取消勾选后可以手动指定比例尺\"><input checked=\"true\" name=\"autoFit\" type=\"checkbox\"/>&nbsp;自适应</label>"+
                               "<hr/>"+
                               "<h5>比例尺</h5>"+
                               "<label>X - 1 : <input name=\"scaleFactorX\" type=\"number\" disabled=\"disabled\"/></label>"+
                               "<label>Y - 1 : <input name=\"scaleFactorY\" type=\"number\" disabled=\"disabled\"/></label>"+
                               "<hr/>"+
                               "<button data-role=\"repaint\" disabled=\"disabled\" title=\"非自适应情况下点击重绘图表\">重绘</button>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"result-panel-chart-wrapper\">"+
                             "</div>"+
                             "<div class=\"result-panel-table-wrapper\">"+
                             "</div>"+
                            "</div>"
                    },
                    strokes = {
                        'highlight': {
                            'text': null,
                            'rect': { 'color': '#FF0000' },
                            'circle': { 'color': '#FF0000' },
                            'ellipse': { 'color': '#FF0000' },
                            'line': { 'color': '#FF0000' },
                            'path': { 'color': '#FF0000' }
                        }
                    },
                    fills = {
                        'highlight': {
                            'text': '#FF0000',
                            'rect': '#FF0000',
                            'circle': '#FF0000',
                            'ellipse': '#FF0000',
                            'line': '#FF0000',
                            'path': '#FF0000'
                        }
                    },
                    //----
                    loadResources,
                    //----
                    computeFeatureFieldValueLineNum,
                    computePipeTopMost,
                    computeLeftMost,
                    computeRightMost,
                    computeTopMost,
                    computeBottomMost,
                    computeAttrTableHeaderWidth,
                    computeAttrTableHeight,
                    computeFitScaleFactors,
                    computeSpecifiedScaleFactors,
                    setChartScrollable,
                    getScaleFactors,
                    //----
                    computeRoadIntersection,
                    computePipeIntersection,
                    decideSortOrder,
                    prepareData,
                    //----
                    highlightGfx,
                    unhighlightGfx,
                    highlightGraphic,
                    unhighlightGraphic,
                    drawGraphicsOnMap,
                    drawPipes,
                    drawVerticalRuler,
                    drawDirection,
                    drawRoads,
                    drawSurface,
                    drawAttrTable,
                    clearChart,
                    drawChart,
                    repaint,
                    //----
                    mouseoverGraphicLayerHandler,
                    mouseoverChartHandler,
                    mouseoutChartHandler,
                    //----
                    closeHandler,
                    toggleHandler,
                    toggleAutoFitHandler,
                    toggleEqualScaleHandler,
                    scaleFactorInputHandler,
                    repaintHandler,
                    resizeHandler,
                    //----
                    registerDomEvents,
                    removeDomEvents,
                    //----
                    clearState,
                    //----
                    resize,
                    initGraphicLayer,
                    destroyGraphicLayer,
                    initGfx,
                    destroyGfx,
                    initDom,
                    destroyDom,
                    //----
                    emit,
                    init,
                    initResult,
                    destroyResult;

                setChartScrollable = function(scallable){
                    if(scallable){
                        domClass.add(queryMap.chartWrapper, 'result-panel-chart-scrollable');
                    }else{
                        domClass.remove(queryMap.chartWrapper, 'result-panel-chart-scrollable');
                    }
                };

                computePipeTopMost = function(){
                    var max = 0;
                    array.forEach(stateMap.pipeFeatureArray, function(feature){
                        var deep = pipeUtils.getShapeDeep(feature);
                        max = Math.max(feature.intersectionPointElev + deep, max);
                    });

                    return max;
                };

                computeLeftMost = function(){//unit: m
                    var min = 0;
                    array.forEach(stateMap.pipeFeatureArray, function(feature){
                        var width = pipeUtils.getShapeWidth(feature);
                        min = Math.min(feature.distanceToStart - width / 2, min);
                    });
                    return min;
                };

                computeRightMost = function(){//unit: m
                    var max = stateMap.crossLineLength;
                    array.forEach(stateMap.pipeFeatureArray, function(feature){
                        var width = pipeUtils.getShapeWidth(feature);
                        max = Math.max(feature.distanceToStart + width / 2, max);
                    });
                    return max;
                };

                computeTopMost = function(){//unit: m
                    var max = -99999999,
                        avail = false,
                        i, feature, surfaceElev;
                    for(i=0;i<stateMap.pipeFeatureArray.length;i++){
                        feature = stateMap.pipeFeatureArray[i];
                        surfaceElev = feature.intersectionSurfaceElev;
                        if(basicUtils.isNumber(surfaceElev)){
                            max = Math.max(surfaceElev, max);
                            avail = true;
                        }
                    }
                    if(!avail){
                        max = computePipeTopMost() + 1.5;
                        stateMap.fakeSurface = true;
                    }

                    return max;
                };

                computeBottomMost = function(){//unit: m
                    var min = 100000;
                    array.forEach(stateMap.pipeFeatureArray, function(feature){
                        min = Math.min(feature.intersectionPointElev, min);
                    });
                    return min;
                };

                //计算属性表格的表头总宽度
                computeAttrTableHeaderWidth = function(){
                    var maxCols = 0;
                    array.forEach(configMap.attrTableDisplayFields, function(field){
                        maxCols = Math.max(field.displayName.length, maxCols);
                    });
                    return configMap.attr_table_header_cell_padding_left + configMap.attr_font_padding_left + maxCols * (configMap.attr_font_size + configMap.attr_font_letter_space) + configMap.attr_font_padding_right + configMap.attr_table_header_cell_padding_right;
                };

                computeFeatureFieldValueLineNum = function(field, features, scale){
                    var availWidth = [],
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        result = [],
                        feature, value, needWidth, height,
                        useLine, lineSelected, i, k, textWidth;

                    for(i=0;i<features.length;i++){
                        feature = features[i];
                        value = field.get(feature);
                        textWidth = basicUtils.getTextNetWidth(value, configMap.attr_font_size);
                        needWidth = configMap.attr_font_padding_left + textWidth + configMap.attr_font_padding_right;
                        lineSelected = false;
                        for(k=0;k<availWidth.length;k++){
                            if(!lineSelected && availWidth[k] >= needWidth){
                                useLine = k;
                                availWidth[k] = feature.distanceToNext * scale;
                                lineSelected = true;
                            }else{
                                availWidth[k] += feature.distanceToNext * scale;
                            }
                        }
                        if(!lineSelected){
                            availWidth.push(feature.distanceToNext * scale);
                            useLine = availWidth.length - 1;
                        }
                        result.push(useLine);
                    }
                    return result;
                };
                
                //计算属性表格的总高度
                computeAttrTableHeight = function(scale){
                    var totalHeight = 0,
                        minLineHeight = configMap.attr_table_line_padding_top + configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_table_line_padding_bottom,
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        field;

                    array.forEach(configMap.attrTableDisplayFields, function(field){
                        var maxHeight = 0;
                        if(field.rotated || field.vertical){
                            array.forEach(stateMap.pipeFeatureArray, function(feature){
                                var value = field.get(feature),
                                    textWidth = basicUtils.getTextNetWidth(value, configMap.attr_font_size),
                                    height = 0;
                                if(field.rotated){
                                    height = configMap.attr_table_line_padding_top + configMap.attr_font_padding_left + textWidth + configMap.attr_font_padding_right + configMap.attr_table_line_padding_bottom;
                                }else if(field.vertical){
                                    height = configMap.attr_table_line_padding_top + attr_font_line_height * value.length + configMap.attr_table_line_padding_bottom;
                                }else{
                                    height = configMap.attr_table_line_padding_top + attr_font_line_height + configMap.attr_table_line_padding_bottom;
                                }
                                maxHeight = Math.max(height, maxHeight);
                            });
                        }else{
                            (function(){
                                var availWidth = [],
                                    feature, value, needWidth, height, textWidth,
                                    useLine, maxLine, lineSelected, i, k;
                                for(i=0;i<stateMap.pipeFeatureArray.length;i++){
                                    feature = stateMap.pipeFeatureArray[i];
                                    value = field.get(feature);
                                    textWidth = basicUtils.getTextNetWidth(value, configMap.attr_font_size);
                                    needWidth = configMap.attr_font_padding_left + textWidth + configMap.attr_font_padding_right;
                                    lineSelected = false;
                                    for(k=0;k<availWidth.length;k++){
                                        if(!lineSelected && availWidth[k] >= needWidth){
                                            useLine = k;
                                            availWidth[k] = feature.distanceToNext * scale;
                                            lineSelected = true;
                                        }else{
                                            availWidth[k] += feature.distanceToNext * scale;
                                        }
                                    }
                                    if(!lineSelected){
                                        availWidth.push(feature.distanceToNext * scale);
                                        useLine = availWidth.length - 1;
                                        maxLine = maxLine || useLine + 1;
                                    }
                                    maxLine = Math.max(useLine + 1, maxLine);
                                    height = configMap.attr_table_line_padding_top + maxLine * attr_font_line_height + configMap.attr_table_line_padding_bottom;
                                }
                                maxHeight = Math.max(height, maxHeight);
                            })();
                        }
                        field.rowHeight = Math.max(maxHeight, minLineHeight);
                        totalHeight += field.rowHeight;
                    });

                    return totalHeight;
                };

                //计算用户指定的比例尺（单位cm），对应的像素比例尺（单位px），用于绘图
                computeSpecifiedScaleFactors = function(){
                    var cmScaleFactors, pxScaleFactors,
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        attr_table_header_width,
                        leftMost, rightMost, topMost, bottomMost, pipeTopMost,
                        paddingWidth, paddingHeight,
                        graphWidth, graphHeight,
                        totalWidth, totalHeight;
                    
                    cmScaleFactors = {
                        'x': parseFloat(domAttr.get(queryMap.scaleFactorXInput, 'value')),
                        'y': parseFloat(domAttr.get(queryMap.scaleFactorYInput, 'value'))
                    };

                    pxScaleFactors = scaleFactorConvertor.cm2px(cmScaleFactors);

                    attr_table_header_width = computeAttrTableHeaderWidth();
                    
                    paddingWidth = configMap.padding_left + attr_table_header_width + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right + configMap.padding_right;

                    paddingHeight = configMap.padding_top + attr_font_line_height * configMap.surface_text_line_count + configMap.surface_line_width + configMap.attr_table_padding_top + computeAttrTableHeight(pxScaleFactors.x) + configMap.padding_bottom;

                    leftMost = computeLeftMost();

                    rightMost = computeRightMost();

                    topMost = computeTopMost();

                    bottomMost = computeBottomMost();

                    pipeTopMost = computePipeTopMost();

                    graphWidth = (rightMost - leftMost) * pxScaleFactors.x;
                    graphHeight = (topMost - bottomMost) * pxScaleFactors.y;

                    totalWidth = paddingWidth + graphWidth;
                    totalHeight = paddingHeight + graphHeight;

                    pxScaleFactors.totalWidth = totalWidth;
                    pxScaleFactors.totalHeight = totalHeight;

                    pxScaleFactors.graphWidth = graphWidth;
                    pxScaleFactors.graphHeight = graphHeight;
                    
                    pxScaleFactors.leftMost = leftMost;
                    pxScaleFactors.rightMost = rightMost;
                    pxScaleFactors.topMost = topMost;
                    pxScaleFactors.bottomMost = bottomMost;
                    pxScaleFactors.pipeTopMost = pipeTopMost;

                    return pxScaleFactors;
                    //TODO
                };

                //计算自适应的比例尺
                computeFitScaleFactors = function(){
                    var scaleFactors = {},
                        totalWidth = queryMap.chartWrapper.offsetWidth,
                        totalHeight = queryMap.chartWrapper.offsetHeight,
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        attr_table_header_width,
                        paddingWidth, paddingHeight,
                        graphWidth, graphHeight,
                        leftMost, rightMost,
                        topMost, bottomMost, pipeTopMost;
                    
                    attr_table_header_width = computeAttrTableHeaderWidth();


                    leftMost = computeLeftMost();
                    
                    rightMost = computeRightMost();

                    topMost = computeTopMost();

                    bottomMost = computeBottomMost();
                    
                    pipeTopMost = computePipeTopMost();


                    paddingWidth = configMap.padding_left + attr_table_header_width + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right + configMap.padding_right;

                    graphWidth = totalWidth - paddingWidth;

                    if(graphWidth < configMap.graph_min_width){
                        scaleFactors.compromised = true;
                        graphWidth = Math.max(graphWidth, configMap.graph_min_width);
                        totalWidth = paddingWidth + graphWidth;
                    }

                    scaleFactors.x = graphWidth / (rightMost - leftMost);

                    paddingHeight = configMap.padding_top + attr_font_line_height * configMap.surface_text_line_count + configMap.surface_line_width + configMap.attr_table_padding_top + computeAttrTableHeight(scaleFactors.x) + configMap.padding_bottom;

                    graphHeight = totalHeight - paddingHeight;

                    if(graphHeight < configMap.graph_min_height){
                        scaleFactors.compromised = true;
                        graphHeight = Math.max(graphHeight, configMap.graph_min_height);
                        totalHeight = paddingHeight + graphHeight;
                    }

                    scaleFactors.y = graphHeight / (topMost - bottomMost);

                    if(configMap.equalScale){
//                        if(stateMap.pipeFeatureArray.length <= 1){
//                            scaleFactors.x = scaleFactors.y = Math.min(scaleFactors.x, scaleFactors.y);
                        scaleFactors.compromised = scaleFactors.y < scaleFactors.x;
                        
                        scaleFactors.y = scaleFactors.x;

//                        }else{
//                            scaleFactors.x = scaleFactors.y = Math.max(scaleFactors.x, scaleFactors.y);
//                        }
                        graphWidth = (rightMost - leftMost) * scaleFactors.x;
                        graphHeight = (topMost - bottomMost) * scaleFactors.y;
                        
                        totalWidth = paddingWidth + graphWidth;
                        totalHeight = paddingHeight + graphHeight;
                    }

                    scaleFactors.graphWidth = graphWidth;
                    scaleFactors.graphHeight = graphHeight;
                    
                    scaleFactors.totalHeight = totalHeight;
                    scaleFactors.totalWidth = totalWidth;

                    scaleFactors.leftMost = leftMost;
                    scaleFactors.rightMost = rightMost;
                    scaleFactors.topMost = topMost;
                    scaleFactors.bottomMost = bottomMost;
                    scaleFactors.pipeTopMost = pipeTopMost;

                    return scaleFactors;
                    //TODO
                };

                //获取当前比例尺，如果未计算，则进行计算后返回
                getScaleFactors = function(){
                    if(!stateMap.scaleFactors){
                        if(configMap.autoFit){
                            stateMap.scaleFactors = computeFitScaleFactors();
                            var scaleFactorsInCm = scaleFactorConvertor.px2cm({
                                'x': stateMap.scaleFactors.x,
                                'y': stateMap.scaleFactors.y
                            });
                            domAttr.set(queryMap.scaleFactorXInput, 'value', scaleFactorsInCm.x.toFixed(2));
                            domAttr.set(queryMap.scaleFactorYInput, 'value', scaleFactorsInCm.y.toFixed(2));
                            if(stateMap.scaleFactors.compromised){
                                setChartScrollable(true);
                            }else{
                                setChartScrollable(false);
                            }
                        }else{
                            stateMap.scaleFactors = computeSpecifiedScaleFactors();
                            setChartScrollable(true);
                        }
                    }
                    //TODO
                    return stateMap.scaleFactors;
                };

                //判断排序的方向，按照自西向东，自北向南的顺序
                decideSortOrder = function(){
                    var reversed = false,
                        vertical = false,
                        end1, end2, pitch, angle, angleToNorth,
                        direction, startEnd, endEnd;

                    end1 = stateMap.crossLine.paths[0][0];
                    end2 = stateMap.crossLine.paths[0][1];
                    if(end1[0] === end2[0]){ //没有斜率，刚好位于南北方向上
                        vertical = true;
                        angle = 90;
                    }else{
                        pitch = (end1[1]-end2[1])/(end1[0]-end2[0]);
                        if(pitch > -1 && pitch < 1){//斜率位于(-1,1)之间，即东西方向
                            vertical = false;
                        }else{//斜率位于(-infinity,-1]U[1,+infinity)，即南北方向上
                            vertical = true;
                        }
                        angle = Math.atan(pitch) / Math.PI * 180;
                    }
                    //南北朝向（vertical = true）, 判断顺序是从横截线的起点到终点，还是相反（reversed）
                    //东西朝向（vertical = false），同上
                    if((vertical && end1[1] < end2[1]) || (!vertical && end1[0] > end2[0])){
                        reversed = true;
                    }

                    if(vertical && angle === 90){//自北向南
                        direction = "南";
                        angleToNorth = -180;
                    }else if(vertical && end1[0] < end2[0]){//自北向南，自西向东
                        direction = "南偏东";
                        angleToNorth = -(90-angle);
                    }else if(vertical && end1[0] > end2[0]){//自北向南，自东向西
                        direction = "南偏西";
                        angleToNorth = -270 + angle;
                    }else if(!vertical && end1[1] < end2[1]){//自北向南，自西向东
                        direction = "南偏东";
                        angleToNorth = -(90-angle);
                    }else if(!vertical && end1[1] > end2[1]){//自南向北，自西向东
                        direction = "北偏东";
                        angleToNorth = -(90-angle);
                    }

                    startEnd = reversed?end2:end1;
                    endEnd = reversed?end1:end2;

                    stateMap.sortOrder = reversed;
                    stateMap.angleToNorth = angleToNorth;
                    stateMap.crossLineStartPoint = new Point(startEnd[0], startEnd[1], stateMap.crossLine.spatialReference);
                    stateMap.crossLineEndPoint = new Point(endEnd[0], endEnd[1], stateMap.crossLine.spatialReference);
                    stateMap.crossLineLength = mathUtils.getLength(stateMap.crossLineStartPoint, stateMap.crossLineEndPoint) * scaleUtils.getUnitValueForSR(stateMap.crossLine.spatialReference);
                };

                computeRoadIntersection = function(road){
                    var intersectionPoints = geometryUtils.intersectGeometries(stateMap.crossLine, road.feature.geometry),
                        srUnitValue = scaleUtils.getUnitValueForSR(road.feature.geometry.spatialReference);
                    array.forEach(intersectionPoints, function(point){
                        point._road = road;
                        point.distanceToStart = mathUtils.getLength(stateMap.crossLineStartPoint, point) * srUnitValue;
                    });
                    return intersectionPoints;
                };

                //计算交点坐标，交点距离截线起点距离，交点处高程，埋深
                computePipeIntersection = function(feature){
                    var path = feature.geometry.paths[0],
                        srUnit, point1, point2, intersectionPoint,
                        distanceToStart, distanceToPipeStart, pipeLength,
                        pipeInElev, pipeOutElev;

                    srUnit = scaleUtils.getUnitValueForSR(feature.geometry.spatialReference);
                    point1 = new Point(path[0][0], path[0][1], feature.geometry.spatialReference);
                    point2 = new Point(path[1][0], path[1][1], feature.geometry.spatialReference);
//                        intersectionPoint = mathUtils.getLineIntersection(point1, point2, stateMap.crossLineStartPoint, stateMap.crossLineEndPoint);
                    intersectionPoint = geometryUtils.intersectGeometries(stateMap.crossLine, feature.geometry);
                    if(intersectionPoint && intersectionPoint.length){
                        intersectionPoint = intersectionPoint[0];
                    }else{
                        return false;
                    }
                    distanceToStart = mathUtils.getLength(intersectionPoint, stateMap.crossLineStartPoint);
                    distanceToPipeStart = mathUtils.getLength(intersectionPoint, point1);
                    pipeLength = mathUtils.getLength(point1, point2);
                    pipeInElev = pipeUtils.getInElev(feature);
                    pipeOutElev = pipeUtils.getOutElev(feature);

                    if(basicUtils.isNumber(feature.inSurfaceElev) && basicUtils.isNumber(feature.outSurfaceElev)){
                        feature.intersectionSurfaceElev = feature.inSurfaceElev + (feature.outSurfaceElev - feature.inSurfaceElev) * (distanceToPipeStart / pipeLength);
                    }else{
                        feature.intersectionSurfaceElev = null;
                    }

                    feature.intersectionPoint = intersectionPoint;
                    feature.distanceToStart = distanceToStart * srUnit;
                    feature.intersectionPointElev = pipeInElev + (pipeOutElev - pipeInElev) * (distanceToPipeStart / pipeLength);
                    return true;
                };

                //准备画图所需的数据，主要是交点的计算和管线的排序
                prepareData = function(){
                    if(!stateMap.crossLine || !stateMap.pipeInfo){
                        return;
                    }

                    var pipeFeatures = [],
                        reversed = stateMap.sortOrder,
                        pipeNodeIdMap = stateMap.pipeNodeInfo.idMap,
                        roadPoints = [],
                        featureSet, feature, feature2, i, j, found,
                        inJuncNode, outJuncNode, inSurfaceElev, outSurfaceElev,
                        inBurialDepth, outBurialDepth;

                    decideSortOrder();//确定排序方向

                    for(var modelName in stateMap.pipeInfo){
                        if(stateMap.pipeInfo.hasOwnProperty(modelName)){
                            featureSet = stateMap.pipeInfo[modelName];
                            array.forEach(featureSet.features, function(feature){
                                feature._modelDef = featureSet.modelDef;
                                pipeFeatures.push(feature);
                            });
                        }
                    }

                    array.forEach(pipeFeatures, function(feature){
                        inJuncNode = pipeNodeIdMap[pipeUtils.getInJuncID(feature)];
                        outJuncNode = pipeNodeIdMap[pipeUtils.getOutJuncID(feature)];
                        inSurfaceElev = inJuncNode? pipeNodeUtils.getSurfaceElev(inJuncNode): null;
                        outSurfaceElev = outJuncNode? pipeNodeUtils.getSurfaceElev(outJuncNode): null;
                        feature.inSurfaceElev = inSurfaceElev;
                        feature.outSurfaceElev = outSurfaceElev;
                    });

                    pipeFeatures = array.filter(pipeFeatures, function(feature){
                        return computePipeIntersection(feature);//计算交点，距离等
                    });

                    //按交点距离截线起点排序（东西方向，以西为起点；南北方向，以北为起点）
                    pipeFeatures.sort(function(a, b){
                        return a.distanceToStart - b.distanceToStart;
                    });

                    for(i=0;i<pipeFeatures.length;i++){
                        feature = pipeFeatures[i];
                        if(i + 1 >= pipeFeatures.length){
                            feature.distanceToNext = stateMap.crossLineLength - feature.distanceToStart;
                        }else{
                            feature2 = pipeFeatures[i+1];
                            feature.distanceToNext = feature2.distanceToStart - feature.distanceToStart;
                        }
                    }

                    stateMap.pipeFeatureArray = pipeFeatures;

                    if(stateMap.roadInfo){//计算截线与所截取到的道路的交点集合，以及交点距离截线起点的距离
                        array.forEach(stateMap.roadInfo, function(road){
                            array.forEach(computeRoadIntersection(road), function(point){
                                roadPoints.push(point); 
                            });
                        });

                        roadPoints.sort(function(a, b){
                            return a.distanceToStart - b.distanceToStart;
                        });

                        stateMap.roadPoints = roadPoints;
                    }

                };

                highlightGfx = function(gfxGroup){
                    var nodes;
                    if(gfxGroup){
                        if(stateMap.highlightedGfxGroup){
                            unhighlightGfx();
                        }
                        nodes = gfxGroup.children;
                        array.forEach(nodes, function(node){
                            var shape = node.shape,
                                stroke = strokes.highlight[shape.type],
                                fill = fills.highlight[shape.type];
                            
                            node.normalStroke = node.normalStroke || node.strokeStyle;
                            node.normalFill = node.normalFill || node.fillStyle;

                            node.setStroke(stroke);
                            node.setFill(fill);
                        });
                        stateMap.highlightedGfxGroup = gfxGroup;
                    }
                };

                unhighlightGfx = function(){
                    var gfxGroup, nodes;
                    if(stateMap.highlightedGfxGroup){
                        gfxGroup = stateMap.highlightedGfxGroup;
                        nodes = gfxGroup.children;
                        array.forEach(nodes, function(node){
                            var shape = node.shape,
                                stroke = node.normalStroke,
                                fill = node.normalFill;

                            node.setStroke(stroke);
                            node.setFill(fill);
                        });
                    }
                    stateMap.highlightedGfxGroup = null;
                };

                highlightGraphic = function(graphic){
                    if(graphic){
                        if(stateMap.mouseoverGraphic){
                            unhighlightGraphic();
                        }

                        if(graphic.geometry.type == 'point'){
                            graphic.normalSymbol = graphic.normalSymbol || graphic.symbol;
                            graphic.setSymbol(symbols.HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL);
                        }else if(graphic.geometry.type == 'polyline'){
                            graphic.normalSymbol = graphic.normalSymbol || graphic.symbol;
                            graphic.setSymbol(symbols.HIGHLIGHTED_PIPE_LINE_SYMBOL);
                        }

                        stateMap.mouseoverGraphic = graphic;
                    }
                };

                unhighlightGraphic = function(){
                    var graphic, geometry;
                    if(stateMap.mouseoverGraphic){
                        graphic = stateMap.mouseoverGraphic;
                        geometry = graphic.geometry;

                        if(graphic.normalSymbol){
                            graphic.setSymbol(graphic.normalSymbol);
                        }

                    }
                    stateMap.mouseoverGraphic = null;
                };

                //在地图上高亮显示横截线，截取的管，以及截取的交点
                drawGraphicsOnMap = function(){
                    if(!graphicLayer){
                        return;
                    }
                    var graphic, point, path;
                    if(stateMap.crossLine){
                        graphic = new Graphic(stateMap.crossLine, symbols.CROSSLINE_LINE_SYMBOL);
                        graphicLayer.add(graphic);
                    }
                    if(stateMap.pipeFeatureArray){
                        array.forEach(stateMap.pipeFeatureArray, function(feature){
                            var graphic;
                            graphic = new Graphic(feature.intersectionPoint, symbols.PIPE_INTERSECTION_POINT_MARKER_SYMBOL);
                            graphicLayer.add(graphic); 

                            graphic = new Graphic(feature.geometry, symbols.SELECTED_PIPE_LINE_SYMBOL);
                            graphic.feature = feature;
                            feature.graphic = graphic;

                            graphicLayer.add(graphic);
                        });
                    }
                    if(stateMap.roadPoints){
                        array.forEach(stateMap.roadPoints, function(point){
                            var graphic;
                            graphic = new Graphic(point, symbols.ROAD_INTERSECTION_POINT_MARKER_SYMBOL);
                            graphicLayer.add(graphic);
                        });
                    }

                    path = stateMap.crossLine.paths[0];

                    point = new Point((path[0][0] + path[1][0]) / 2, (path[0][1] + path[1][1]) / 2, stateMap.crossLine.spatialReference);
                    
                    mapUtils.locatePointToViewPosition(point, '50%', '30%', map, 400);
                };

                //绘制管线截面图形，参考线，以及将管线各属性填入表格
                drawPipes = function(){
                    var scale = getScaleFactors(),
                        attrFields = configMap.attrTableDisplayFields,
                        attrTableHeight = computeAttrTableHeight(scale.x),
                        attrTableHeaderWidth = computeAttrTableHeaderWidth(),
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        featureFieldValueLineNums = [],
                        feature, field, value, i, j, k, pipeGroup, textWidth,
                        startX, startY, curY, shapeWidth, shapeDeep, fillColor, strokeColor;

                    for(i=0;i<attrFields.length;i++){
                        field = attrFields[i];
                        if(!field.rotated && !field.vertical){
                            featureFieldValueLineNums.push(computeFeatureFieldValueLineNum(field, stateMap.pipeFeatureArray, scale.y));
                        }else{
                            featureFieldValueLineNums.push([]);
                        }
                    }

                    console.log(featureFieldValueLineNums);

                    gfxMap.pipesGroup = gfxMap.surface.createGroup();

                    for(i=0;i<stateMap.pipeFeatureArray.length;i++){ //对于每一根管线
                        feature = stateMap.pipeFeatureArray[i];

                        pipeGroup = gfxMap.pipesGroup.createGroup();

                        feature.gfxGroup = pipeGroup;
                        pipeGroup.feature = feature;

                        shapeWidth = pipeUtils.getShapeWidth(feature);
                        shapeDeep = pipeUtils.getShapeDeep(feature);

                        startX = configMap.padding_left + attrTableHeaderWidth + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right + (feature.distanceToStart - shapeWidth / 2) * scale.x;
                        startY = scale.totalHeight - configMap.padding_bottom - attrTableHeight - configMap.attr_table_padding_top - (feature.intersectionPointElev + shapeDeep - scale.bottomMost) * scale.y;
                        
                        fillColor = configMap.default_pipe_fill_color;
                        strokeColor = pipeUtils.getPipeColor(feature)?pipeUtils.getPipeColor(feature):configMap.default_pipe_border_color;

                        if(pipeUtils.getShapeType(feature) === 0){//判断管线截面形状，0代表圆形，1代表矩形
                            pipeGroup.createEllipse({// 如果是圆形，则实际绘制时使用椭圆形绘制，这样，无论X,Y轴比例尺是否相等，该绘制方法都通用
                                'cx': startX + shapeWidth * scale.x / 2,
                                'cy': startY + shapeDeep * scale.y / 2,
                                'rx': shapeWidth * scale.x / 2,
                                'ry': shapeDeep * scale.y / 2
                            }).setStroke(strokeColor).
                                setFill(fillColor);
                        }else{//如果是矩形
                            pipeGroup.createRect({ //绘制矩形
                                'x': startX,
                                'y': startY,
                                'width': shapeWidth * scale.x,
                                'height': shapeDeep * scale.y
                            }).setStroke(strokeColor).
                                setFill(fillColor);
                        }

                        pipeGroup.createLine({//绘制参考线
                            'x1': startX + shapeWidth * scale.x / 2,
                            'y1': startY + shapeDeep * scale.y,
                            'x2': startX + shapeWidth * scale.x / 2,
                            'y2': scale.totalHeight - configMap.padding_bottom
                        }).setStroke({
                            'style': 'LongDash',
                            'color': configMap.pipe_ref_line_color
                        });

                        curY = scale.totalHeight - configMap.padding_bottom - attrTableHeight;

                        for(j=0;j<attrFields.length;j++){ //绘制当前管的每一个属性
                            field = attrFields[j];
                            value = field.get(feature, i) + ''; //获取属性值
                            textWidth = basicUtils.getTextNetWidth(value, configMap.attr_font_size);
                            if(value.length > 0){
                                if(field.rotated){ //文字需要旋转90度的情况
                                    pipeGroup.createText({
                                        'x': startX + shapeWidth / 2 * scale.y + (field.right?configMap.attr_font_padding_left: - attr_font_line_height),
                                        'y': curY + configMap.attr_table_line_padding_top + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom,
                                        'text': value,
                                        'align': 'start'
                                    }).setFont({
                                        'size': configMap.attr_font_size
                                    }).setFill(configMap.attr_table_body_text_color).
                                        applyTransform(gfx.matrix.rotategAt(90, startX + shapeWidth / 2 * scale.y + (field.right?configMap.attr_font_padding_left: - attr_font_line_height), curY + configMap.attr_table_line_padding_top + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom));
                                }else if(field.vertical){//文字需要每个字单独一行竖排的情况
                                    for(k=0;k<value.length;k++){
                                        pipeGroup.createText({
                                            'x': startX + (field.right?configMap.attr_font_padding_right + configMap.attr_font_size: shapeWidth * scale.x / 2 - configMap.attr_font_padding_right),
                                            'y': curY + (k + 1) * attr_font_line_height,
                                            'text': value.charAt(k),
                                            'align': 'end'
                                        }).setFont({
                                            'size': configMap.attr_font_size
                                        }).setFill(configMap.attr_table_body_text_color);
                                    }
                                }else{//正常情况
                                    pipeGroup.createText({
                                        'x': startX + (field.right?configMap.attr_font_padding_right + configMap.attr_font_padding_left + shapeWidth * scale.y / 2: shapeWidth * scale.x / 2 - configMap.attr_font_padding_right),
                                        'y': curY + configMap.attr_table_line_padding_top + (configMap.attr_font_padding_top + configMap.attr_font_size) * (featureFieldValueLineNums[j][i] + 1) ,
                                        'text': value,
                                        'align': field.right?'start':'end'
                                    }).setFont({
                                        'size': configMap.attr_font_size
                                    }).setFill(configMap.attr_table_body_text_color);

                                    if(i === 0 && j === 5){//这里是为了绘制出左边界距离第一根管的间距，这里破坏了根据配置自动绘制属性的机制，如果要展示的属性修改了，这里要注意更新
                                        value = basicUtils.isNumber(feature.distanceToStart)?feature.distanceToStart.toFixed(1): '';
                                        if(value.length){
                                            pipeGroup.createText({
                                                'x': startX - feature.distanceToStart * scale.x / 2,
                                                'y': curY + configMap.attr_table_line_padding_top + configMap.attr_font_padding_top + configMap.attr_font_size,
                                                'text': value,
                                                'align': 'middle'
                                            }).setFont({
                                                'size': configMap.attr_font_size
                                            }).setFill(configMap.attr_table_body_text_color);
                                        }
                                    }
                                }
                            }
                            curY += field.rowHeight;
                        }

                    }
                    //TODO
                };

                //绘制标高尺（竖尺）
                drawVerticalRuler = function(){
                    var scale = getScaleFactors(),
                        attrTableHeaderWidth = computeAttrTableHeaderWidth(),
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        startX, startY, maxElev, rulerLen, additionalLen,
                        drawFirstMark, curLen;

                    gfxMap.verticalRulerGroup = gfxMap.surface.createGroup();
                    
                    maxElev = Math.ceil(scale.pipeTopMost); //管最大高程向上取整，为了使画出的尺比实际使用的范围适当延伸一点

                    startX = configMap.padding_left + attrTableHeaderWidth + configMap.vertical_ruler_width;
                    startY = configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - maxElev) * scale.y;

                    if(startY > attr_font_line_height){ //判断延伸之后尺是否出了上边界（并且上边界顶部至少还要有一个行高的留白），如果超出，就延伸到边界即可
                        drawFirstMark = true;
                        additionalLen = (maxElev - scale.pipeTopMost) * scale.y;
                        rulerLen = (maxElev - scale.bottomMost) * scale.y;
                    }else{//如果不超出边界，那么就延伸到向上取整的那个整数的地方
                        drawFirstMark = false;
                        startY = attr_font_line_height;
                        additionalLen =  configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + configMap.surface_line_width - startY + (scale.topMost - scale.pipeTopMost) * scale.y;
                        rulerLen = (scale.topMost - scale.pipeTopMost) * scale.y + additionalLen;
                    }

                    gfxMap.verticalRulerGroup.createLine({//绘制标尺的主体部分
                        'x1': startX,
                        'y1': startY,
                        'x2': startX,
                        'y2': startY + rulerLen
                    }).setStroke({
                            'width': configMap.vertical_ruler_width,
                            'color': configMap.vertical_ruler_bgcolor
                        });

                    curLen = drawFirstMark?0:(scale.pipeTopMost - Math.floor(scale.pipeTopMost)) * scale.y + additionalLen;

                    while(curLen <= rulerLen){ //依次绘制标尺的刻度线和刻度处的文字
                        gfxMap.verticalRulerGroup.createLine({//绘制刻度线
                            'x1': startX,
                            'y1': startY + curLen,
                            'x2': startX + configMap.vertical_ruler_mark_width,
                            'y2': startY + curLen
                        }).setStroke(configMap.vertical_ruler_mark_line_color);
                        
                        gfxMap.verticalRulerGroup.createText({//绘制刻度文字
                            'x': startX - configMap.attr_font_padding_right,
                            'y': startY + curLen + configMap.attr_font_padding_top,
                            'text': drawFirstMark?maxElev - Math.floor(curLen / scale.y):Math.floor(scale.pipeTopMost) - Math.floor(curLen / scale.y),
                            'align': 'end'
                        }).setFont({
                            'size': configMap.attr_font_size
                        }).setFill(configMap.vertical_ruler_mark_text_color);

                        curLen += 1 * scale.y;
                    }
                };

                drawDirection = function(){
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        circleX, circleY, curX, curY, temp, textLeft, textTop, textBottom;
                    
                    gfxMap.directionGroup = gfxMap.surface.createGroup();
                    
                    circleX = configMap.padding_left + configMap.direction_circle_radius + configMap.attr_font_padding_left + configMap.attr_font_size + configMap.attr_font_padding_right;
                    circleY = attr_font_line_height * 2 + configMap.direction_circle_radius;

                    gfxMap.directionGroup.createCircle({
                        'cx': circleX,
                        'cy': circleY,
                        'r': configMap.direction_circle_radius
                    }).setStroke({
                        'width': configMap.direction_circle_line_width,
                        'color': configMap.direction_circle_line_color
                    }).setFill(configMap.direction_circle_fill_color);
                    
                    temp = Math.sqrt(Math.pow(configMap.direction_circle_radius,2)/5);

                    curX = circleX - 2 * temp;
                    curY = circleY - temp;

                    gfxMap.directionGroup.createPath().moveTo(circleX, circleY).lineTo(circleX + configMap.direction_circle_radius, circleY).lineTo(circleX - 2 * temp, circleY - temp).lineTo(circleX, circleY).lineTo(circleX - 2 * temp, circleY + temp).lineTo(circleX + configMap.direction_circle_radius, circleY).lineTo(circleX, circleY).setStroke({
                        'width': configMap.direction_circle_line_width,
                        'color': configMap.direction_circle_line_color
                    }).applyTransform(gfx.matrix.rotategAt(stateMap.angleToNorth, circleX, circleY));

                    gfxMap.directionGroup.createPath().moveTo(circleX, circleY).lineTo(circleX + configMap.direction_circle_radius, circleY).lineTo(circleX - 2 * temp, circleY - temp).lineTo(circleX, circleY).closePath().setFill(configMap.direction_pointer_color).applyTransform(gfx.matrix.rotategAt(stateMap.angleToNorth, circleX, circleY));              

                    textLeft = stateMap.angleToNorth < -90 || stateMap.angleToNorth > 90;

                    textTop = stateMap.angleToNorth > -135 && stateMap.angleToNorth < -45;

                    textBottom = stateMap.angleToNorth > 45 && stateMap.angleToNorth < 135;

                    gfxMap.directionGroup.createText({
                        'x': circleX + (configMap.direction_circle_radius + configMap.attr_font_padding_right) * ((textTop || textBottom)? 0: (textLeft?-1:1)),
                        'y': circleY + ((textTop || textBottom)? (textBottom?1:-1)*(configMap.direction_circle_radius + configMap.attr_font_padding_bottom): attr_font_line_height / 2),
                        'text': '北',
                        'align': textTop || textBottom? 'middle':(textLeft?'end':'start')
                    }).setFill(configMap.direction_text_color);
                };
                //绘制道路线（竖线）
                drawRoads = function(){
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        i, road, startX, startY, endY, curX, curRoad, value;

                    gfxMap.roadGroup = gfxMap.surface.createGroup();

                    startX = scale.totalWidth - configMap.padding_right - scale.graphWidth;
                    startY = configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height;
                    endY = scale.totalHeight - configMap.padding_bottom;


                    for(i=0;i<stateMap.roadPoints.length;i++){
                        road = stateMap.roadPoints[i];
                        curX = startX + road.distanceToStart * scale.x;
                        
                        if(road._road.feature.geometry){
                            if(road._road.feature.geometry.type == 'polyline'){
                                value = road._road.value || '道路中心线';
                            }else if(road._road.feature.geometry.type == 'polygon'){
                                value = (road._road.value?road._road.value+'边线':'道路边线');
                            }else{//unexpected
                                value = (road._road.value?road._road.value+'边线':'道路边线');
                            }
                        }else{
                            value = (road._road.value?road._road.value+'边线':'道路边线');
                        }

                        gfxMap.roadGroup.createLine({
                            'x1': curX,
                            'y1': startY,
                            'x2': curX,
                            'y2': endY
                        }).setStroke({
                            'style': 'Dash',
                            'color': configMap.road_border_line_color
                        });

                        gfxMap.roadGroup.createText({
                            'x': curX,
                            'y': startY - configMap.attr_font_padding_bottom,
                            'text': value,
                            'align': 'middle'
                        }).setFont({
                            'size': configMap.attr_font_size
                        }).setFill(configMap.road_text_color);
                    }
                };

                //绘制地面
                drawSurface = function(){
                    var scale = getScaleFactors(),
                        attrTableHeaderWidth = computeAttrTableHeaderWidth(),
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        startX, startY, curX, i, j, found, feature, feature2, path,
                        leftMostElev, rightMostElev, nextElev, prevElev, curElev;

                    gfxMap.surfaceGroup = gfxMap.surface.createGroup();

                    startX = configMap.padding_left + attrTableHeaderWidth + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right;

                    if(stateMap.fakeSurface){//无法通过计算得出地面高程，根据预设的默认值画出地面线
                        startY = configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height;

                        gfxMap.surfaceGroup.createLine({
                            'x1': startX,
                            'y1': startY,
                            'x2': scale.totalWidth - configMap.padding_right,
                            'y2': startY
                        }).setStroke({
                            'width': configMap.surface_line_width,
                            'color': configMap.surface_line_color
                        });

                        gfxMap.surfaceGroup.createLine({
                            'x1': startX,
                            'y1': startY,
                            'x2': startX,
                            'y2': scale.totalHeight - configMap.padding_bottom
                        }).setStroke({
                            'style': 'ShortDash',
                            'color': configMap.surface_vertical_ref_line_color
                        });

                        gfxMap.surfaceGroup.createLine({
                            'x1': scale.totalWidth - configMap.padding_right,
                            'y1': startY,
                            'x2': scale.totalWidth - configMap.padding_right,
                            'y2': scale.totalHeight - configMap.padding_bottom
                        }).setStroke({
                            'style': 'ShortDash',
                            'color': configMap.surface_vertical_ref_line_color
                        });

                    }else{//至少有一个管点的地面高程有效，根据实际数据绘制地面线
                        curX = startX;

                        path = gfxMap.surfaceGroup.createPath();

                        for(i=0;i<stateMap.pipeFeatureArray.length;i++){
                            feature = stateMap.pipeFeatureArray[i];
                            curElev = feature.intersectionSurfaceElev;
                            if(!basicUtils.isNumber(curElev)){
                                found = false;
                                for(j=i+1;j<stateMap.pipeFeatureArray.length;j++){
                                    feature2 = stateMap.pipeFeatureArray[j];
                                    nextElev = feature2.intersectionSurfaceElev;
                                    if(basicUtils.isNumber(nextElev)){
                                        curElev = nextElev;
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found && basicUtils.isNumber(prevElev)){
                                    curElev = prevElev;
                                }
                            }

                            if(i === 0){
                                leftMostElev = curElev;
                                path.moveTo(curX, configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - leftMostElev) * scale.y);
                                curX += feature.distanceToStart * scale.x;

                                gfxMap.surfaceGroup.createLine({
                                    'x1': startX,
                                    'y1': configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - leftMostElev) * scale.y,
                                    'x2': startX,
                                    'y2': scale.totalHeight - configMap.padding_bottom
                                }).setStroke({
                                    'style': 'ShortDash',
                                    'color': configMap.surface_vertical_ref_line_color
                                });

                            }
                            
                            path.lineTo(curX, configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - curElev) * scale.y);

                            curX += feature.distanceToNext * scale.x;

                            if(i + 1 >= stateMap.pipeFeatureArray.length){
                                rightMostElev = curElev;
                                path.lineTo(scale.totalWidth - configMap.padding_right, configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - rightMostElev) * scale.y);
                                gfxMap.surfaceGroup.createLine({
                                    'x1': scale.totalWidth - configMap.padding_right,
                                    'y1': configMap.padding_top + configMap.surface_text_line_count * attr_font_line_height + (scale.topMost - rightMostElev) * scale.y,
                                    'x2': scale.totalWidth - configMap.padding_right,
                                    'y2': scale.totalHeight - configMap.padding_bottom
                                }).setStroke({
                                    'style': 'ShortDash',
                                    'color': configMap.surface_vertical_ref_line_color
                                });

                            }

                            prevElev = curElev;
                        }

                        path.setStroke({
                            'width': configMap.surface_line_width,
                            'color': configMap.surface_line_color
                        });
                    }


                };

                //绘制属性表格（表头，表体，不含数据）
                drawAttrTable = function(){
                    var scale = getScaleFactors(),
                        fields = configMap.attrTableDisplayFields,
                        attr_table_height = computeAttrTableHeight(scale.x),
                        minLineHeight = minLineHeight = configMap.attr_table_line_padding_top + configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_table_line_padding_bottom,
                        attr_font_line_height = configMap.attr_font_padding_top + configMap.attr_font_size + configMap.attr_font_padding_bottom,
                        tableHeaderWidth, tableWidth, field, startX, startY, i, curY,
                        maxHeight;

                    gfxMap.attrTableGroup = gfxMap.surface.createGroup();

                    startX = configMap.padding_left;
                    startY = scale.totalHeight - configMap.padding_bottom - attr_table_height;
                    
                    tableWidth = scale.totalWidth - configMap.padding_left - configMap.padding_right;

                    tableHeaderWidth = computeAttrTableHeaderWidth();

                    gfxMap.attrTableGroup.createRect({//绘制外边框
                        'x': startX,
                        'y': startY,
                        'width': tableWidth,
                        'height': attr_table_height
                    }).setStroke(configMap.attr_table_border_color);

                    gfxMap.attrTableGroup.createLine({//绘制表头边界线
                        'x1': startX + tableHeaderWidth,
                        'y1': startY,
                        'x2': startX + tableHeaderWidth,
                        'y2': startY + attr_table_height
                    }).setStroke(configMap.attr_table_border_color);

                    curY = startY;

                    for(i=0;i<fields.length;i++){//每一个属性占表格的一行
                        field = fields[i];
                        maxHeight = 0;

                        gfxMap.attrTableGroup.createText({ //绘制表头的文字
                            'x': startX + configMap.attr_table_header_cell_padding_left + configMap.attr_font_padding_left,
                            'y': curY + attr_font_line_height,
                            'text': field.displayName,
                            'align': 'start'
                        }).setFont({ 'size': configMap.attr_font_size }).
                            setFill(configMap.attr_table_header_text_color);

                        curY += field.rowHeight;

                        gfxMap.attrTableGroup.createLine({ //绘制当前行的底边
                            'x1': startX,
                            'y1': curY,
                            'x2': startX + tableWidth,
                            'y2': curY
                        }).setStroke(configMap.attr_table_border_color);
                    }
                };

                clearChart = function(){
                    destroyGfx();
                    stateMap.scaleFactors = null;
                };

                drawChart = function(){
                    emit('startDraw');
                    var scale = getScaleFactors();
                    if(!scale){
                        alert('比例尺计算失败，无法绘制结果！');
                        destroyResult();
                        return false;
                    }
                    initGfx();
                    drawAttrTable();
                    drawDirection();
                    drawSurface();
                    if(configMap.roadIdentifyParameters){
                        drawRoads();
                    }
                    drawVerticalRuler();
                    drawPipes();
                    return true;
                    //TODO
                };

                repaint = function(){
                    clearChart();
                    drawChart();
                    //TODO
                };

                mouseoverGraphicLayerHandler = function(event){
                    var graphic = event.graphic;

                    if(graphic && graphic.feature){
                        highlightGraphic(graphic);
                        highlightGfx(graphic.feature.gfxGroup);
                    }else{
                        unhighlightGraphic();
                        unhighlightGfx();
                    }
                };

                mouseoverChartHandler = function(event){
                    var target = event.gfxTarget,
                        cur, feature;
                    if(target){
                        cur = target;
                        while(cur.parent){
                            if(cur.feature){
                                feature = cur.feature;
                                break;
                            }
                            cur = cur.parent;
                        }
                        if(feature){
                            highlightGraphic(feature.graphic);
                            highlightGfx(feature.gfxGroup);
                        }
                    }else{
                        unhighlightGraphic();
                        unhighlightGfx();
                    }
                };

                mouseoutChartHandler = function(){
                    unhighlightGraphic();
                    unhighlightGfx();
                };

                closeHandler = function(){
                    destroyResult();
                };

                toggleHandler = function(){
                    if(domClass.contains(queryMap.main, 'result-panel-minimized')){
                        domClass.remove(queryMap.main, 'result-panel-minimized');
                        html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-normalText'));
                        repaint();
                    }else{
                        domClass.add(queryMap.main, 'result-panel-minimized');
                        html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-minimizedText'));
                    }
                };

                toggleAutoFitHandler = function(){
                    configMap.autoFit = domAttr.get(queryMap.autoFitCheckbox, 'checked');
                    if(configMap.autoFit){
                        domAttr.set(queryMap.scaleFactorXInput, 'disabled', true);
                        domAttr.set(queryMap.scaleFactorYInput, 'disabled', true);
                        domAttr.set(queryMap.repaintBtn, 'disabled', true);
                    }else{
                        domAttr.set(queryMap.scaleFactorXInput, 'disabled', false);
                        domAttr.set(queryMap.scaleFactorYInput, 'disabled', false);
                        domAttr.set(queryMap.repaintBtn, 'disabled', false);
                    }
                    repaint();
                };

                toggleEqualScaleHandler = function(){
                    configMap.equalScale = domAttr.get(queryMap.equalScaleCheckbox, 'checked');

                    if(configMap.equalScale && !configMap.autoFit){
                        var xScale = parseFloat(domAttr.get(queryMap.scaleFactorXInput, 'value')),
                            yScale = parseFloat(domAttr.get(queryMap.scaleFactorYInput, 'value'));
                        
                        xScale = yScale = Math.max(xScale, yScale);

                        domAttr.set(queryMap.scaleFactoryXInput, 'value', xScale);
                        domAttr.set(queryMap.scaleFactoryYInput, 'value', yScale);
                    }
                    repaint();
                    //TODO
                };

                scaleFactorInputHandler = function(event){
                    if(event.keyCode === 13){
                        repaint();
                        return true;
                    }
                    var value = domAttr.get(event.target, 'value');

                    if(configMap.equalScale){
                        domAttr.set(queryMap.scaleFactorXInput, 'value', value);
                        domAttr.set(queryMap.scaleFactorYInput, 'value', value);
                    }

                    return true;
                    //TODO validation
                };

                repaintHandler = function(){
                    repaint();
                };

                resizeHandler = function(){
                    resize();
                };

                registerDomEvents = function(){
                    if(queryMap){
                        eventHandlerMap.close = on(queryMap.closeBtn, 'click', closeHandler);
                        eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', toggleHandler);
                        eventHandlerMap.toggleAutoFit = on(queryMap.autoFitCheckbox, 'click', toggleAutoFitHandler);
                        eventHandlerMap.toggleEqualScale = on(queryMap.equalScaleCheckbox, 'click', toggleEqualScaleHandler);
                        eventHandlerMap.scaleFactorXInput = on(queryMap.scaleFactorXInput, 'keyup', scaleFactorInputHandler);
                        eventHandlerMap.scaleFactorYInput = on(queryMap.scaleFactorYInput, 'keyup', scaleFactorInputHandler);
                        eventHandlerMap.repaint = on(queryMap.repaintBtn, 'click', repaintHandler);
                        eventHandlerMap.resize = map.on('resize', resizeHandler);
                    }
                    //TODO
                };

                removeDomEvents = function(){
                    if(eventHandlerMap.repaint){
                        eventHandlerMap.repaint.remove();
                        delete eventHandlerMap.repaint;
                    }
                    if(eventHandlerMap.scaleFactorYInput){
                        eventHandlerMap.scaleFactorYInput.remove();
                        delete eventHandlerMap.scaleFactorYInput;
                    }
                    if(eventHandlerMap.scaleFactorXInput){
                        eventHandlerMap.scaleFactorXInput.remove();
                        delete eventHandlerMap.scaleFactorXInput;
                    }
                    if(eventHandlerMap.toggleEqualScale){
                        eventHandlerMap.toggleEqualScale.remove();
                        delete eventHandlerMap.toggleEqualScale;
                    }
                    if(eventHandlerMap.toggleAutoFit){
                        eventHandlerMap.toggleAutoFit.remove();
                        delete eventHandlerMap.toggleAutoFit;
                    }
                    if(eventHandlerMap.toggle){
                        eventHandlerMap.toggle.remove();
                        delete eventHandlerMap.toggle;
                    }
                    if(eventHandlerMap.close){
                        eventHandlerMap.close.remove();
                        delete eventHandlerMap.close;
                    }
                    if(eventHandlerMap.resize){
                        eventHandlerMap.resize.remove();
                        delete eventHandlerMap.resize;
                    }
                    //TODO
                };

                resize = function(){
                    domStyle.set(queryMap.chartWrapper, {
                        width: (queryMap.main.offsetWidth - queryMap.controlBar.offsetWidth - 2) + 'px',
                        height: (queryMap.main.offsetHeight - queryMap.title.offsetHeight) + 'px'
                    });
                    domStyle.set(queryMap.controlBar, {
                        height: (queryMap.main.offsetHeight - queryMap.title.offsetHeight) + 'px'
                    });
                    if(gfxMap){
                        repaint();
                    }
                };

                initGraphicLayer = function(){
                    destroyGraphicLayer();

                    graphicLayer = new GraphicsLayer();
                    map.addLayer(graphicLayer);

                    eventHandlerMap.mouseoverGraphicLayer = graphicLayer.on('mouse-over', mouseoverGraphicLayerHandler);
                    //TODO
                };

                destroyGraphicLayer = function(){
                    if(eventHandlerMap.mouseoverGraphicLayer){
                        eventHandlerMap.mouseoverGraphicLayer.remove();
                        delete eventHandlerMap.mouseoverGraphicLayer;
                    }
                    if(graphicLayer){
                        graphicLayer.clear();
                        map.removeLayer(graphicLayer);
                    }
                    graphicLayer = null;
                };

                initGfx = function(){
                    var scale = getScaleFactors();
                    gfxMap = {};
                    gfxMap.surface = gfx.createSurface(queryMap.chartWrapper, scale.totalWidth, scale.totalHeight);

                    eventHandlerMap.mouseoverChart = gfxMap.surface.on('mouseover', mouseoverChartHandler);
                    eventHandlerMap.mouseoutChart = gfxMap.surface.on('mouseout', mouseoutChartHandler);
                    //TODO
                };

                destroyGfx = function(){
                    if(gfxMap && gfxMap.surface){
                        if(eventHandlerMap.mouseoverChart){
                            eventHandlerMap.mouseoverChart.remove();
                            delete eventHandlerMap.mouseoverChart;
                        }
                        if(eventHandlerMap.mouseoutChart){
                            eventHandlerMap.mouseoutChart.remove();
                            delete eventHandlerMap.mouseoutChart;
                        }
                        gfxMap.surface.destroy();
                    }
                    array.forEach(configMap.attrTableDisplayFields, function(field){
                        delete field.rowHeight;
                    });
                    gfxMap = null;
                    //TODO
                };

                initDom = function(){
                    queryMap = {};

                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);
                    domConstruct.place(queryMap.main, queryMap.parent);

                    queryMap.title = query('.result-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.result-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.result-panel-title-btns', queryMap.title)[0];
                    queryMap.closeBtn = query('.result-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];
                    queryMap.toggleBtn = query('.result-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];

                    queryMap.controlBar = query('.result-panel-control-bar', queryMap.main)[0];
                    queryMap.scaler = query('.result-panel-control-bar-scaler', queryMap.main)[0];
                    queryMap.autoFitCheckbox = query('input[name=autoFit]', queryMap.scaler)[0];
                    queryMap.equalScaleCheckbox = query('input[name=equalScale]', queryMap.scaler)[0];
                    queryMap.scaleFactorXInput = query('input[name=scaleFactorX]', queryMap.scaler)[0];
                    queryMap.scaleFactorYInput = query('input[name=scaleFactorY]', queryMap.scaler)[0];
                    queryMap.repaintBtn = query('button[data-role=repaint]', queryMap.scaler)[0];
                    queryMap.chartWrapper = query('.result-panel-chart-wrapper', queryMap.main)[0];
                    queryMap.tableWrapper = query('.result-panel-table-wrapper', queryMap.main)[0];

                    //TODO
                    registerDomEvents();

                    resize();
                };

                clearState = function(){
                    stateMap = {};
                    //TODO
                };

                destroyDom = function(){
                    removeDomEvents();
                    if(queryMap && queryMap.main){
                        domConstruct.destroy(queryMap.main);                        
                    }
                    queryMap = null;
                    //TODO
                };

                loadResources = function(){
                    var dir = resourceLoader.getDojoModuleLocation(module);
                    resourceLoader.addCSSFile(resources.CSS, dir);
                };

                init = function(){
                    options = options || {};

                    if(!options.map){
                        throw "map is needed for options!";
                    }
                    
                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, configMap.eventHandlers || {});
                    lang.mixin(symbols, configMap.symbols || {});

                    loadResources();
                    //TODO
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                       return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
                };

                initResult = function(data){
                    if(queryMap){
                        destroyResult();
                    }
                    emit('beforeInitResult');
                    configMap.autoFit = true;
                    configMap.equalScale = true;
                    lang.mixin(stateMap, data);
                    initGraphicLayer();
                    initDom();
//                    toggleHandler.apply(null, []);
                    prepareData();
                    drawGraphicsOnMap();
                    drawChart();
                    //TODO
                    emit('afterInitResult');
                };

                destroyResult = function(){
                    emit('beforeDestroyResult');
                    destroyGfx();
                    destroyDom();
                    destroyGraphicLayer();
                    clearState();
                    //TODO
                    emit('afterDestroyResult');
                };

                //TODO
                
                init();

                return {
                    'initResult': initResult,
                    'destroyResult': destroyResult
                };
            })(options);
        };

        init = function(options){
            if(initDone){
                console.warn("module 'hdm-analysis' has already been inititiated!");
                return; 
            }

            options = options || {};

            if(!options.map){
                throw "map is needed for options";
            }

            if(!options.pipeNetworkServiceUrl){
                throw "'pipeNetworkServiceUrl' is needed for options!";
            }

            if(!options.pipeQueryParameters){
                throw "'pipeQueryParameters' is needed for options!";
            }

            map = options.map;

            lang.mixin(configMap, options);
            lang.mixin(eventHandlers, configMap.eventHandlers || {});

            initControlPanel({
                'map': map,
                'eventHandlers': {
                    'beforeOpen': function(){
                        emit('startMapOccupation');
                    },
                    'clickCloseBtn': function(){
//                        if(confirm('确定要取消当前功能？')){
                            cancel();
//                        }
                    },
                    'beforePause': function(){
                        if(controlPanel && stroker){
                            stroker.deactivate();
                            emit('releaseMapOccupation');
                            return true;
                        }
                        return false;
                    },
                    'beforeResume': function(){
                        if(controlPanel && stroker){
                            stroker.activate();
                            emit('startMapOccupation');
                            return true;
                        }
                        return false;
                    },
                    'beforeClear': function(){
                        if(stroker && resultPanel){
                            stroker.clear();
                            resultPanel.destroyResult();
                        }
                    }
                    //TODO
                }
            });

            initStroker({
                'map': map,
                'pipeNetworkServiceUrl': options.pipeNetworkServiceUrl,
                'roadNetworkServiceUrl': options.roadNetworkServiceUrl,
                'pipeIdentifyParameters': options.pipeIdentifyParameters,
                'pipeQueryParameters': options.pipeQueryParameters,
                'roadIdentifyParameters': options.roadIdentifyParameters,
                'pipeNodeQueryParameters': options.pipeNodeQueryParameters,
                'layerModelMap': options.layerModelMap,
                'eventHandlers': {
                    'strokeSuccess': function(){
                        if(controlPanel){
                            controlPanel.pause();
                            controlPanel.startLoading();
                        }
                    },
                    'strokeFail': function(){
                        if(controlPanel){
                            controlPanel.resume();
                            controlPanel.stopLoading();
                        }
                    },
                    'emptyResult': function(){
                        if(controlPanel && stroker){
                            alert('未选中任何管线，请重画！');
                            controlPanel.resume();
                            controlPanel.stopLoading();
                        }
                    },
                    'querySuccess': function(data){
                        if(controlPanel && resultPanel && stroker){
                            resultPanel.initResult(data);
                        }
                    }
                    //TODO
                }
            });

            initResultPanel({
                'map': map,
                'symbols': configMap.symbols,
                'roadIdentifyParameters': configMap.roadIdentifyParameters,
                'eventHandlers': {
                    'afterDestroyResult': function(){
                        if(controlPanel){
                            controlPanel.resume();
                        }
                    },
                    'afterInitResult': function(){
                        if(controlPanel){
                            controlPanel.pause();
                        }
                    },
                    'startDraw': function(){
                        if(controlPanel){
                            controlPanel.stopLoading();
                        }
                    }
                    //TODO
                }
            });

            initDone = true;
            emit('ready');
        };

        emit = function(eventName, eventObject){
            if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
               return eventHandlers[eventName].apply(null, [eventObject || {}]);
            }
            return true;
        };

        use = function(){
            if(!initDone){
                throw "module 'hdm-analysis' has not been initiated yet!";
            }
            if(!stateMap.isInUse){
                emit('beforeUse');
                if(controlPanel && stroker && resultPanel){
                    controlPanel.open();
                    stroker.start();
                    //TODO
                    stateMap.isInUse = true;
                }
                emit('afterUse');
            }
        };

        cancel = function(){
            if(!initDone){
                throw "module 'hdm-analysis' has not been initiated yet!";
            }
            if(stateMap){
                emit('beforeCancel');
                if(controlPanel && stroker && resultPanel){
                    resultPanel.destroyResult();
                    controlPanel.close();
                    stroker.stop();
                }
                stateMap.isInUse = false;
                emit('afterCancel');
            }
            //TODO
        };

        isInUse = function(){
            return stateMap.isInUse?true:false;
        };

        exports = {
            'init': init,
            'use': use,
            'cancel': cancel,
            'isInUse': isInUse
        };

        return exports;
    })();
});
