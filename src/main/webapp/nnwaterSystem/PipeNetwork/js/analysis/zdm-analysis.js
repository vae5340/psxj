/**
 * 管网分析-纵剖面分析模块
 * 注意： 管线和沟渠可能是相连的，所以选的之后再准备表格数据时需要将两者分开以保证属性能正常显示。
 */
define([
    'module',
    'dojo/promise/all',
    'dojo/string',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/request',
    'dojo/query',
    'dojo/html',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojox/gfx',
    'esri/symbols/SimpleLineSymbol',
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
    'pipe-network/lib/resource-loader',
    'pipe-network/lib/basic-utils',
    'pipe-network/lib/map-utils',
    'pipe-network/data-model',
    'pipe-network/lib/scale-factor-convertor',
    'pipe-network/pipe-model-utils',
    'pipe-network/pipe-node-model-utils',
    'pipe-network/analysis/analysis-table-panel'
], function(
    module,
    all,
    string,
    lang,
    array,
    on,
    request,
    query,
    html,
    domClass,
    domAttr,
    domConstruct,
    domStyle,
    gfx,
    SimpleLineSymbol,
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
    resourceLoader,
    basicUtils,
    mapUtils,
    dataModel,
    scaleFactorConverter,
    pipeUtils,
    pipeNodeUtils,
    TablePanel
){
    'use strict';
    return (function(){
        var exports,
            configMap = {
            },
            symbols = {
                'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                'MOUSEOVER_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
                'SELECTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                'MOUSEOVER_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25]))
            },
            stateMap = {
                'inInUse': false,
                'pickResult': null
            },
            map,
            graphicLayer,
            controlPanel,
            resultPanel,
            picker,
            //----
            eventHandlerMap = {},
            //----
            isInUse,
            use,
            cancel,
            init,
            emit,
            highlightGraphic,
            unhighlightGraphic,
            initGraphicLayer,
            removeGraphicLayer,
            destroyGraphicLayer,
            addPipeGraphic,
            addPipeNodeGraphic,
            initPicker,
            initControlPanel,
            initResultPanel,
            destroyResultPanel,
            genInfoTemplate,
            locateFeature,
            startAnalysis,
            startDrawChart,
            decideSortOrder,
            sortPipes,
            getPipeNodes,
            relocateMap,
            clearResult;

        initControlPanel = function(options){//COMPONENT: Control Panel
            controlPanel = (function(options){
                options = options || {};
                if(!options.map){
                    throw "map is needed for options!";
                }
                var exports,
                    map = options.map,
                    resources = {
                        'IMGS': {
                            'LOADING': '../../img/loading.gif'
                        },
                        'CSS': '../../css/zdm-analysis-control-panel.css'
                    },
                    configMap = {},
                    queryMap = {},
                    eventHandlers = {},
                    eventHandlerMap = {},
                    templates = {
                        'main': ""+
                            "<div class=\"zdm-analysis-control-panel\">"+
                             "<div class=\"control-panel-title\">"+
                              "<div class=\"control-panel-title-text\"></div>"+
                              "<div class=\"control-panel-title-btns\">"+
                               "<a href=\"#\" class=\"control-panel-title-btn\" data-role=\"toggle\" title=\"收起\">-</a>"+
                               "<a href=\"#\" class=\"control-panel-title-btn\" data-role=\"close\" title=\"取消\">×</a>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"analysis-loading analysis-loading-hidden\">"+
                              "<img class=\"loading-img\" src=\""+(resourceLoader.getPathFromDir(resources.IMGS.LOADING, resourceLoader.getDojoModuleLocation(module)))+"\"/>"+
                              "<div class=\"loading-text\">分析中，请稍等</div>"+
                             "</div>"+
                             "<div class=\"control-panel-content\">"+
                              "<div class=\"pipe-info\">"+
                               "<div class=\"pipe-info-title\"></div>"+
                               "<div class=\"operation-tip\"></div>"+
                               "<ul class=\"pipe-info-list\"></ul>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"control-panel-control-btns\">"+
                              "<button class=\"control-panel-control-btn\" data-role=\"clear\"><span>清空</span></button>"+
                              "<button class=\"control-panel-control-btn\" data-role=\"confirm\"><span>分析</span></button>"+
                             "</div>"+
                            "</div>",
                        'pipeInfoTitle': "已选管线(${count})",
                        'pipeInfoListItem': ""+
                            "<li>"+
                             "<span class=\"pipe-info-list-item-text\"></span>"+
//                             "<a href=\"#\" class=\"pipe-info-list-item-remove-btn\" data-id=\"${OBJECTID}\">移除</a>"+
                             "<a href=\"#\" class=\"pipe-info-list-item-locate-btn\" data-id=\"${OBJECTID}\">定位</a>"+
                             
                            "</li>",
                        'operationTip': ""+
                            "<span style=\"color: #0000FF;\">操作提示：</span>"+
                            "<p><span style=\"margin-left: 2em;\"></span>点击选择地图上连续的管线，并点击【分析】。</p>"+
                            "<p><span style=\"margin-left: 2em;\"></span>点击【清空】可以清空当前的选择的管线及分析的结果。</p>"
                    },
                    emit,
                    setForZdmAnalysis,
                    setTitle,
                    addPipe,
                    removePipe,
                    clear,
                    closeHandler,
                    clearHandler,
                    toggleHandler,
                    confirmHandler,
                    loadResources,
                    updatePipeInfoTitle,
                    startShowingResult,
                    endShowingResult,
                    setOperationTip,
                    showOperationTip,
                    hideOperationTip,
                    startLoading,
                    stopLoading,
                    initDom,
                    initPipeInfoList,
                    destroyDom,
                    startup,
                    destroy,
                    init;
                
                lang.mixin(configMap, options);
                lang.mixin(eventHandlers, options.eventHanders || {});

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                };

                loadResources = function(){
                    var dir = resourceLoader.getDojoModuleLocation(module);
                    resourceLoader.addCSSFile(resources.CSS, dir);
                };

                setTitle = function(text){
                    text = text || '';
                    html.set(queryMap.titleText, text);
                };
                
                setForZdmAnalysis = function(){
                    setTitle('纵剖面分析');
                };

                toggleHandler = function(){
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

                closeHandler = function(){
//                    if(confirm('确定要取消当前功能？')){
                        cancel();
//                    emit('releaseMapOccupation');
//                    }
                };

                clearHandler = function(){
                    //TODO
                    showOperationTip();
                    clearResult();
                };

                confirmHandler = function(){
                    //TODO
                    startAnalysis();
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

                updatePipeInfoTitle = function(){
                    html.set(queryMap.pipeInfoTitle, string.substitute(templates.pipeInfoTitle, {
                        'count': query('li', queryMap.pipeInfoList).length
                    }));
                };

                initPipeInfoList = function(){
                    on(queryMap.pipeInfoList, '.pipe-info-list-item-locate-btn:click', locateFeature);
                    updatePipeInfoTitle();
                };

                setOperationTip = function(text){
                    if(queryMap && queryMap.operationTip){
                        html.set(queryMap.operationTip, text || '');
                    }
                };

                showOperationTip = function(){
                    if(queryMap && queryMap.operationTip){
                        domClass.remove(queryMap.operationTip, 'operation-tip-hidden');
                    }
                };

                hideOperationTip = function(){
                    if(queryMap && queryMap.operationTip){
                        domClass.add(queryMap.operationTip, 'operation-tip-hidden');
                    }
                };

                initDom = function(){
                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);
                    domConstruct.place(queryMap.main, queryMap.parent);

                    queryMap.content = query('.control-panel-content')[0];

                    queryMap.title = query('.control-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.control-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.control-panel-title-btns', queryMap.title)[0];
                    queryMap.toggleBtn = query('.control-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];
                    queryMap.closeBtn = query('.control-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];

                    queryMap.controlBtns = query('.control-panel-control-btns', queryMap.main)[0];
                    queryMap.clearBtn = query('.control-panel-control-btn[data-role=clear]', queryMap.controlBtns)[0];
                    queryMap.confirmBtn = query('.control-panel-control-btn[data-role=confirm]', queryMap.controlBtns)[0];

                    queryMap.operationTip = query('.operation-tip', queryMap.content)[0];
                    setOperationTip(templates.operationTip);

                    queryMap.pipeInfo = query('.pipe-info', queryMap.content)[0];
                    queryMap.pipeInfoTitle = query('.pipe-info-title', queryMap.pipeInfo)[0];
                    queryMap.pipeInfoList = query('.pipe-info-list', queryMap.pipeInfo)[0];

                    queryMap.loading = query('.analysis-loading', queryMap.main)[0];

                    eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', toggleHandler);
                    eventHandlerMap.close = on(queryMap.closeBtn, 'click', closeHandler);
                    eventHandlerMap.clear = on(queryMap.clearBtn, 'click', clearHandler);
                    eventHandlerMap.confirm = on(queryMap.confirmBtn, 'click', confirmHandler);

                    initPipeInfoList();
                };

                addPipe = function(pipe, featureSet, addToHead){
                    if(pipe && featureSet){
                        var item = domConstruct.toDom(string.substitute(templates.pipeInfoListItem, pipe)),
                            value = pipe[featureSet.displayFieldName];
                        
                        hideOperationTip();

                        item.feature = pipe;

                        query('.pipe-info-list-item-text', item).forEach(function(textDom){
                            html.set(textDom, value);
                        });;
                        
                        domConstruct.place(item, queryMap.pipeInfoList, addToHead?'first':'last');
                        updatePipeInfoTitle();
                    }
                };

                removePipe = function(id){
                };

                clear = function(){
                    emit('beforeClear');
                    domConstruct.empty(queryMap.pipeInfoList);
                    updatePipeInfoTitle();
                };

                destroyDom = function(){
                    if(eventHandlerMap.confirm){
                        eventHandlerMap.confirm.remove();
                        delete eventHandlerMap.confirm;
                    }
                    if(eventHandlerMap.close){
                        eventHandlerMap.close.remove();
                        delete eventHandlerMap.close;
                    }
                    if(eventHandlerMap.clear){
                        eventHandlerMap.clear.remove();
                        delete eventHandlerMap.clear;
                    }
                    if(eventHandlerMap.toggle){
                        eventHandlerMap.toggle.remove();
                        delete eventHandlerMap.toggle;
                    }

                    domConstruct.destroy(queryMap.main);
                };

                destroy = function(){
                    destroyDom();
                };

                startup = function(){
                    initDom();
                    setForZdmAnalysis();
                };

                init = function(){
                    loadResources();
                };

                startShowingResult = function(){
                    //TODO
                    domAttr.set(queryMap.confirmBtn, 'disabled', true);
                    domClass.add(queryMap.confirmBtn, 'control-panel-control-btn-disabled');
                };

                endShowingResult = function(){
                    //TODO
                    domAttr.set(queryMap.confirmBtn, 'disabled', false);
                    domClass.remove(queryMap.confirmBtn, 'control-panel-control-btn-disabled');
               };

                exports = {
                    'setTitle': setTitle,
                    'addPipe': addPipe,
                    'removePipe': removePipe,
                    'startShowingResult': startShowingResult,
                    'endShowingResult': endShowingResult,
                    'startup': startup,
                    'destroy': destroy,
                    'clear': clear,
                    'startLoading': startLoading,
                    'stopLoading': stopLoading
                };

                init();

                return exports;
            })(options);
        };

        initPicker = function(options){//COMPONENT: Picker
            picker = (function(options){
                options = options || {};

                if(!options.map){
                    throw "map is needed for options!";
                }
                if(!options.serviceUrl){
                    throw "serviceUrl is needed for options!";
                }
                if(!options.identifyParameters){
                    throw "identifyParameters is needed for options!";
                }
                if(!options.identifyParameters.layerIds || !options.identifyParameters.layerIds.length){
                    throw "parameter 'layerIds' is needed for identifyParamters !";
                }

                var map = options.map,
                    serviceUrl = options.serviceUrl,
                    configMap = {
                        'layerDefs': {}
                    },
                    acceptPoints = {},
                    eventHandlers = {},
                    startPipe,
                    endPipe,
                    selectedPipes = [],
                    identifyTask,
                    identifyParams,
                    eventHandlerMap = {},
                    queryLayerDef,
                    queryAfterIdentify,
                    emit,
                    getResult,
                    addPipe,
                    start,
                    clear,
                    pick,
                    stop,
                    abort,
                    resume,
                    relocateMap,
                    startShowingResult,
                    endShowingResult;

                identifyTask = new IdentifyTask(serviceUrl);
                identifyParams = (function(params){
                    var iParams = new IdentifyParameters();
                    
                    iParams.tolerance = 3;
                    iParams.returnGeometry = true;
                    iParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                    iParams.width = map.width;
                    iParams.height = map.height;

                    lang.mixin(iParams, params);
                    return iParams;
                })(options.identifyParameters);

                lang.mixin(configMap, options);
                lang.mixin(eventHandlers, configMap.eventHandlers);

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                };

                queryLayerDef = function(identifiedObject){
                    if(identifiedObject){
                        return request(
                            serviceUrl+'/'+identifiedObject.layerId+'?f=pjson',
                            {
                                'handleAs': 'json',
                                'headers': {
                                    'X-Requested-With': ""
                                }
                            }
                        );
                    }
                    return null;
                };

                queryAfterIdentify = function(identifiedObject){
                    if(identifiedObject){
                        var queryUrl = serviceUrl+'/'+identifiedObject.layerId,
                            queryTask = new QueryTask(queryUrl),
                            query = new Query();
                        query.returnGeometry = true;
                        query.outFields = ['*'];
                        query.objectIds = [pipeUtils.getOBJECTID(identifiedObject.feature)];
                        return queryTask.execute(query);
                    }
                    return null;
                };

                getResult = function(){
                    return {
                        'selectedPipes': selectedPipes,
                        'startPipe': startPipe,
                        'endPipe': endPipe,
                        'In_JuncID': acceptPoints.Out_JuncID,
                        'Out_JuncID': acceptPoints.In_JuncID
                    };
                };

                addPipe = function(feature){
                    var added = false;
                    if(!acceptPoints.In_JuncID && !acceptPoints.Out_JuncID){//第1根管线
                        startPipe = feature;
                        endPipe = feature;
                        acceptPoints.In_JuncID = pipeUtils.getOutJuncID(feature);
                        acceptPoints.Out_JuncID = pipeUtils.getInJuncID(feature);
                        selectedPipes.push(feature);//没有在添加每一条管线时排序，在添加完所有管之后再进行一次排序
                        added = true;
                    }else if(pipeUtils.getInJuncID(feature) == acceptPoints.In_JuncID){//管线连接到尾部
                        endPipe = feature;
                        acceptPoints.In_JuncID = pipeUtils.getOutJuncID(feature);
                        selectedPipes.push(feature);
                        added = true;
                    }else if(pipeUtils.getOutJuncID(feature) == acceptPoints.Out_JuncID){//管线连接到头部
                        startPipe = feature;
                        acceptPoints.Out_JuncID = pipeUtils.getInJuncID(feature);
                        selectedPipes.push(feature);
                        added = true;
                    }
                    return added;
                };

                pick = function(point){
                    var pipeDeferred,
                        layerDefDeferred;

                    identifyParams.geometry = point;
                    identifyParams.mapExtent = map.extent;

                    identifyTask.execute(identifyParams).addCallback(function(identifyResult){
                        if(identifyResult && identifyResult.length){
                            pipeDeferred = queryAfterIdentify(identifyResult[0]);
                            layerDefDeferred = queryLayerDef(identifyResult[0]);
                            if(pipeDeferred && layerDefDeferred){
                                all([pipeDeferred, layerDefDeferred]).then(function(data){
                                    var featureSet = data[0],
                                        layerDef = data[1];

                                    if(layerDef){
                                        configMap.layerDefs[layerDef.id] = layerDef;
                                    }

                                    if(featureSet && featureSet.features && featureSet.features.length){
                                        if(addPipe(featureSet.features[0])){
                                            featureSet.features[0]._layerDef = configMap.layerDefs[identifyResult[0].layerId];
                                            controlPanel.addPipe(featureSet.features[0].attributes, featureSet);

                                            emit('afterPick', featureSet.features[0]);
                                        }
                                    }
                                });
                            }
                        }
                    });
                };

                start = function(){
                    clear();
                    resume();
                };

                resume = function(){
                    if(!eventHandlerMap.clickMap){
                        eventHandlerMap.clickMap = map.on('click', function(event){
                            pick(event.mapPoint);
                        });
                    }
                };

                stop = function(){
                    if(eventHandlerMap.clickMap){
                        eventHandlerMap.clickMap.remove();
                        delete eventHandlerMap.clickMap;
                    }
                };

                abort = function(){
                    clear();
                    stop();
                };

                clear = function(){
                    acceptPoints = {};
                    startPipe = null;
                    endPipe = null;
                    selectedPipes = [];
                };

                startShowingResult = function(){
                    //TODO
                    stop();
                };

                endShowingResult = function(){
                    //TODO
                    resume();
                };

                return {
                    'pick': pick,
                    'start': start,
                    'clear': clear,
                    'stop': stop,
                    'abort': abort,
                    'getResult': getResult,
                    'startShowingResult': startShowingResult,
                    'endShowingResult': endShowingResult
                };

            })(options);
        };

        removeGraphicLayer = function(){
            if(graphicLayer){
                if(eventHandlerMap.clickGraphicLayer){
                    eventHandlerMap.clickGraphicLayer.remove();
                    delete eventHandlerMap.clickGraphicLayer;
                }
                if(eventHandlerMap.hoverGraphicLayer){
                    eventHandlerMap.hoverGraphicLayer.remove();
                    delete eventHandlerMap.hoverGraphicLayer;
                }
                if(eventHandlerMap.unhoverGraphicLayer){
                    eventHandlerMap.unhoverGraphicLayer.remove();
                    delete eventHandlerMap.unhoverGraphicLayer;
                }
                graphicLayer.clear();
                map.removeLayer(graphicLayer);
                graphicLayer = null;
            }
        };

        highlightGraphic = function(graphic){
            if(graphic){
                if(graphic !== stateMap.mouseoverGraphic){
                    unhighlightGraphic();
                }

                if(graphic.geometry.type == 'point'){
                    graphic.setSymbol(symbols.MOUSEOVER_PIPE_NODE_MARKER_SYMBOL);
                }else if(graphic.geometry.type == 'polyline'){
                    graphic.setSymbol(symbols.MOUSEOVER_PIPE_LINE_SYMBOL);
                }

                if(resultPanel){
                    resultPanel.highlightFeature(graphic.feature);
                }

                stateMap.mouseoverGraphic = graphic;
            }
        };

        unhighlightGraphic = function(){
            var graphic = stateMap.mouseoverGraphic;
            if(graphic){
                if(graphic.geometry.type == 'point'){
                    graphic.setSymbol(symbols.SELECTED_PIPE_NODE_MARKER_SYMBOL);
                }else if(graphic.geometry.type == 'polyline'){
                    graphic.setSymbol(symbols.SELECTED_PIPE_LINE_SYMBOL);
                }
                delete stateMap.mouseoverGraphic;

                if(resultPanel){
                    resultPanel.unhighlightFeature();
                }
            }
        };

        initGraphicLayer = function(){
            if(graphicLayer){
                graphicLayer.clear();
            }else{
                graphicLayer = new GraphicsLayer();
                map.addLayer(graphicLayer);
            }
            if(eventHandlerMap.clickGraphicLayer){
                eventHandlerMap.clickGraphicLayer.remove();
                delete eventHandlerMap.clickGraphicLayer;
            }
            eventHandlerMap.clickGraphicLayer = graphicLayer.on('click', function(event){
                if(event.graphic){
                    event.stopPropagation();
                }
            });
            eventHandlerMap.hoverGraphicLayer = graphicLayer.on('mouse-over', function(event){
                if(event.graphic){
                    highlightGraphic(event.graphic);
                }else{
                    unhighlightGraphic();
                }
            });
            eventHandlerMap.unhoverGraphicLayer = graphicLayer.on('mouse-out', function(event){
                if(stateMap.mouseoverGraphic){
                    unhighlightGraphic();
                }
            });

        };

        genInfoTemplate = function(model, feature){
            if(!model || !feature || !feature.attributes){
                return "${*}";
            }
            var template,
                i, fieldName, field, value;

            template = "";

            for(i=0;i<model.displayFields.length;i++){
                fieldName = model.displayFields[i];
                field = model.fields[fieldName];
                value = feature.attributes[fieldName];
                value = !field.displayFormatter?model.defaultFieldDisplayFormatter(value): field.displayFormatter(value);
                if(field){
                    template += field.name+": "+value+"<br/>";
                }
            }

            return new InfoTemplate(model.displayName+": ${"+model.idField+"}",template);
        };

        locateFeature = function(event){
            var id = domAttr.get(event.target, 'data-id'),
                modelName, model, isConduit, found, feature, path, point;
            
            console.log(event.target.parentNode.feature);

            found = false;
            for(var i=0;i<graphicLayer.graphics.length;i++){
                feature = graphicLayer.graphics[i];
                if(feature.attributes && feature.attributes.OBJECTID == id){
                    found = true;
                    break;
                }
            }

            if(found){
                isConduit = pipeUtils.getPipeType(feature) == 'Conduit';

                modelName = isConduit? 'Conduit': 'Pipe';
                model = dataModel.models[modelName];


                if(model){
                    mapUtils.locateGraphicOnGraphicLayer(map, feature, feature, model, graphicLayer);
/*
                    path = feature.geometry.paths[0];
                    point = new Point((path[0][0]+path[1][0])/2, (path[0][1]+path[1][1])/2, feature.geometry.spatialReference);

                    if(!feature.infoTemplate){
                        feature.setInfoTemplate(genInfoTemplate(model, feature));
                    }
                    try{
                        map.infoWindow.setFeatures([feature]);
                        map.infoWindow.show(point);

                        map.centerAndZoom(point, map.getMaxZoom() - 1);
                    }catch(e){
                        console.warn(e);
                    }
*/
                }
            }
        };

        addPipeNodeGraphic = function(feature){
            var added = false,
                symbol = symbols.SELECTED_PIPE_NODE_MARKER_SYMBOL,
                graphic;
            if(graphicLayer){
                graphic = new Graphic(feature.geometry, symbol, feature.attributes);
                feature.graphic = graphic;
                graphic.feature = feature;
                graphicLayer.add(graphic);
                added = true;
            }
            return added;
        };

        addPipeGraphic = function(feature){
            var added = false,
                symbol = symbols.SELECTED_PIPE_LINE_SYMBOL,
                graphic;
            if(graphicLayer){
                graphic = new Graphic(feature.geometry, symbol, feature.attributes);
                feature.graphic = graphic;
                graphic.feature = feature;
                graphicLayer.add(graphic);
                added = true;
            }
            return added;
        };

        emit = function(eventName, eventObject){
            if(eventName && eventHandlerMap[eventName] && eventHandlerMap[eventName].apply){
                eventHandlerMap[eventName].apply(null, [eventObject || {}]);
            }
        };

        init = function(options){
            options = options || {};
            if(!options.map){
                throw "map is needed for options!";
            }
            if(!options.pipeNodeQueryParameters){
                throw "'pipeNodeQueryParameters' needed for options!";
            }
            if(!options.pipeNodeQueryParameters.layers){
                throw "'layers' needed for pipeNodeQueryParameters!";
            }
            map = options.map;

            lang.mixin(eventHandlerMap, options.eventHandlers);
            lang.mixin(configMap, options);
            lang.mixin(symbols, configMap.symbols || {});

            initControlPanel({
                'map': map,
                'symbols': configMap.symbols,
                'eventHandlers': {
                    'beforeClear': function(){
                        if(resultPanel){
                            resultPanel.destroyResult();
                        }
                    }
                }
            });

            initPicker({
                'map': map,
                'symbols': configMap.symbols,
                'serviceUrl': options.serviceUrl,
                'identifyParameters': options.pipeIdentifyParameters,
                'eventHandlers': {
                    'afterPick': addPipeGraphic
                }
            });

            initResultPanel({
                'map': map,
                'symbols': configMap.symbols,
                'pipeNodeDefInfo': options.pipeNodeQueryParameters.layers,
                'eventHandlers': {
                    'beforeOpen': function(){
                        if(controlPanel){
                            controlPanel.startShowingResult();
                        }
                        if(picker){
                            picker.startShowingResult();
                        }
                        emit('releaseMapOccupation');
                    },
                    'afterClose': function(){
                        if(controlPanel){
                            controlPanel.endShowingResult();
                        }
                        if(picker){
                            picker.endShowingResult();
                        }
                        emit('startMapOccupation');
                    },
                    'startDraw': function(){
                        if(controlPanel){
                            controlPanel.stopLoading();
                        }
                    }
                }
            });
        };

        use = function(){
            if(!stateMap.inUse){
                emit('startMapOccupation');
                initGraphicLayer();
                controlPanel.startup();
                picker.start();
                stateMap.isInUse = true;
            }
        };

        decideSortOrder = function(){
            var reversed = false,
                vertical = false,
                end1, end2, pitch, angle, angleToNorth,
                direction, startEnd, endEnd;

            if(stateMap.pickResult.startPipe && stateMap.pickResult.endPipe){
                startEnd = stateMap.pickResult.startPipe.geometry.getPoint(0, 0);
                endEnd = stateMap.pickResult.endPipe.geometry.getPoint(0, 1);
            }

            end1 = [startEnd.x, startEnd.y];
            end2 = [endEnd.x, endEnd.y];

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

            stateMap.pickResult.reversed = reversed;
//            stateMap.pickResult.angleToNorth = angleToNorth;
        };

        sortPipes = function(){
            var pickResult = stateMap.pickResult,
                curPipe, i, p,
                sortResult = [];

            decideSortOrder();

            curPipe = pickResult.startPipe;
            while(curPipe !== pickResult.endPipe){
                sortResult.push(curPipe);
                for(i=0;i<pickResult.selectedPipes.length;i++){
                    p = pickResult.selectedPipes[i];
                    if(pipeUtils.getOutJuncID(curPipe) == pipeUtils.getInJuncID(p)){
                        break;
                    }
                }
                if(i<pickResult.selectedPipes.length){
                    curPipe = p;
                }else{//异常情况，一般不会发生
                    break;
                }
            }
            sortResult.push(curPipe);

//            stateMap.pickResult.reversed = false; //always false，如果需要排序方向相反，只需要该标志置为true
            if(stateMap.pickResult.reversed){
                sortResult.reverse();
            }
            
            stateMap.pickResult.selectedPipes = sortResult;
        };

        getPipeNodes = function(){
            if(!configMap.pipeNodeQueryParameters || !configMap.pipeNodeQueryParameters.layers){
                return null;
            }
            var layers = configMap.pipeNodeQueryParameters.layers,
                nodeIds = [],
                nodeMap = {},
                queries = {},
                cond,
                deferred;
            
            array.forEach(stateMap.pickResult.selectedPipes, function(pipe){
                if(pipeUtils.getInJuncID(pipe)){
                    nodeMap[pipeUtils.getInJuncID(pipe)] = true;
                }
                if(pipeUtils.getOutJuncID(pipe)){
                    nodeMap[pipeUtils.getOutJuncID(pipe)] = true;
                }
            });

            for(var nodeId in nodeMap){
                if(nodeMap.hasOwnProperty(nodeId)){
                    nodeIds.push(nodeId);
                }
            }

            nodeIds = array.map(nodeIds, function(str){
                return "'"+str+"'";
            });
            cond =  ' in ('+nodeIds.join(',')+')';

            array.forEach(layers, function(layer){
                var query = new Query(),
                    queryTask = new QueryTask(configMap.serviceUrl + '/' + layer.id);
                query.returnGeometry = true;
                query.where = layer.idField+cond;
                query.outFields = ['*'];
                queries[layer.name] = queryTask.execute(query);
            });

            deferred = all(queries);

            return deferred;
        };

        relocateMap = function(){
            if(!picker || !picker.getResult()){
                return;
            }
            var pickResult = picker.getResult(),
                startPipe, endPipe, targetPoint, startPoint, endPoint;

            startPipe = pickResult.startPipe;
            endPipe = pickResult.endPipe;

            if(!startPipe || !endPipe){
                return;
            }

            startPoint = startPipe.geometry.getPoint(0, 0);
            endPoint = endPipe.geometry.getPoint(0, 1);

            targetPoint = new Point((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2, map.spatialReference);

            mapUtils.locatePointToViewPosition(targetPoint, '50%', '30%', map, 400);
        };

        startAnalysis = function(){
            var pipeNodeDeferred;
            stateMap.pickResult = picker.getResult();
            if(stateMap.pickResult && stateMap.pickResult.selectedPipes && stateMap.pickResult.selectedPipes.length){
                if(controlPanel){
                    controlPanel.startLoading();
                }
                sortPipes();
                pipeNodeDeferred = getPipeNodes();
                if(!pipeNodeDeferred){
                    alert("分析失败，无法获取管点信息！");
                    throw "getPipeNodes() returns null!";
                }
                pipeNodeDeferred.then(function(result){
                    var layers = configMap.pipeNodeQueryParameters.layers,
                        layerMap = {},
                        pipeNodeInfo = {
                            idMap: {},
                            typeMap: result
                        };

                    array.forEach(layers, function(layer){
                        layerMap[layer.name] = layer;
                    });

                    for(var type in result){
                        if(result.hasOwnProperty(type)){
                            result[type].features.forEach(function(feature){
                                feature._layerDef = layerMap[type];
                                pipeNodeInfo.idMap[feature.attributes[layerMap[type].idField]] = feature;
                                addPipeNodeGraphic(feature);
                            });
                        }
                    }
                    
                    stateMap.pipeNodeInfo = pipeNodeInfo;

                    relocateMap();
                    startDrawChart();
                });
            }else{
                alert('未选中任何管线，请先选择要分析的管线，再点击“分析”按钮！');
            }
        };

        startDrawChart = function(){
            if(resultPanel){
                resultPanel.initResult({
                    'pickResult': stateMap.pickResult,
                    'pipeNodeInfo': stateMap.pipeNodeInfo
                });
            }
        };

        initResultPanel = function(options){//COMPONENT: Result Panel
            resultPanel = (function(options){
                options = options || {};
                if(!options.map){
                    throw "map is needed for options!";
                }
                if(!options.pipeNodeDefInfo){
                    throw "'pipeNodeDefInfo' is needed for options!";
                }

                var map = options.map,
                    resources = {
                        'CSS': '../../css/zdm-analysis-result-panel.css'
                    },
                    templates = {
                        'main': ""+
                            "<div class=\"zdm-analysis-result-panel\">"+
                             "<div class=\"result-panel-title\">"+
                              "<div class=\"result-panel-title-text\">纵剖面分析结果</div>"+
                              "<div class=\"result-panel-title-btns\">"+
                               "<a class=\"result-panel-title-btn\" data-role=\"toggle\" href=\"#\" data-minimizedText=\"□\" data-normalText=\"-\">-</a>"+
                               "<a class=\"result-panel-title-btn\" data-role=\"close\" href=\"#\">×</a>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"result-panel-control-bar\">"+
                              "<div class=\"result-panel-control-bar-scaler\">"+
                               "<label title=\"根据当前画布大小自动计算合适的比例，取消勾选后可以手动指定比例尺\"><input name=\"equalScale\" type=\"checkbox\"/>&nbsp;等比例</label>&nbsp;&nbsp;|&nbsp;&nbsp;"+
                               "<label title=\"使X,Y两个比例尺保持相等\"><input checked=\"true\" name=\"autoFit\" type=\"checkbox\"/>&nbsp;自适应</label>&nbsp;&nbsp;|&nbsp;&nbsp;"+
                               "<label>x 比例尺 1 : <input title=\"输入比例尺之后，点击【重绘】按钮或者按【回车键】\" name=\"scaleFactorX\" type=\"number\" disabled=\"disabled\"/></label>&nbsp;&nbsp;|&nbsp;&nbsp;"+
                               "<label>y 比例尺 1 : <input title=\"输入比例尺之后，点击【重绘】按钮或者按【回车键】\" name=\"scaleFactorY\" type=\"number\" disabled=\"disabled\"/></label>&nbsp;&nbsp;"+
                               "<button title=\"非自适应情况下点击重绘图表\" data-role=\"repaint\" disabled=\"disabled\">重绘</button>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"result-panel-chart-wrapper\"></div>"+
                             "<div class=\"result-panel-table-wrapper\"></div>"+
                            "</div>"
                    },
                    configMap = {
                        'autoFit': true, //是否自适应画布
                        'equalScale': false, //X,Y方向比例尺是否相同
                        //如无特别说明，单位为: px
                        'graph_min_width': 140, //管线图像区域最小宽度
                        'graph_min_height': 50, //管线图像区域最小高度
                        'air_height': 40, //顶部留白
                        'padding_bottom': 10, //底部留白
                        'padding_left': 10, //左侧留白
                        'padding_right': 20, //右侧留白
                        'vertical_ruler_padding_left': 5, //标高尺左侧留白
                        'vertical_ruler_padding_right': 15, //标高尺右侧留白
                        'vertical_ruler_width': 2, //标高尺宽度（厚度）
                        'vertical_ruler_mark_width': 5, //标高尺刻度长度
                        'vertical_ruler_text_padding_right': 5, //标高尺刻度文字右侧留白
                        'vertical_ruler_text_padding_left': 5, //标高尺刻度文字左侧留白
                        'vertical_ruler_text_col_count': 3, //标高尺文字长度
                        'horizontal_ruler_padding_top': 40, //水平标尺顶部留白，距离最小的管底标高的距离
                        'horizontal_ruler_padding_bottom': 10, //水平标尺底部留白
                        'horizontal_ruler_width': 2, //水平标尺宽度（厚度）
                        'pipe_attr_line_count': 2,//管线属性行数
                        'pipe_node_point_padding_top': 40 /*horizontal_ruler_padding_top*/ + 40, //管点符号（下方属性处）顶部留白，距离最小管底标高的距离，必须大于 horizontal_ruler_padding_top
                        'pipe_node_point_padding_bottom': 15, //管点符号底部留白
                        'pipe_node_attr_line_count': 2, //管点符号处属性行数
                        'attr_font_size': 12, //属性文字字体大小
                        'attr_font_padding_top': 3, //属性文字顶部留白
                        'attr_font_padding_bottom': 3, //属性文字底部留白
                        'attr_font_padding_left': 3,
                        'attr_font_padding_right': 3,
                        'surface_line_width': 1,
                        'flowdirect_line_width': 1,
                        'flowdirect_line_length': 60,
                        'flowdirect_arrow_x_length': 12,
                        'flowdirect_arrow_y_height': 6,
                        'flowdirect_color': '#000000',
                        'flowdirect_text_color': '#000000',
                        'manhole_width': 0.7, //检查井默认尺寸，单位：m
                        //------------------------
                        'vertical_ruler_bgcolor': '#000000',
                        'vertical_ruler_mark_color': '#000000',
                        'vertical_ruler_text_color': '#000000',
                        'horizontal_ruler_bgcolor': '#000000',
                        'default_pipe_node_color': '#888888',
                        'pipe_node_ref_line_color': '#888888',
                        'default_pipe_fill_color': '#4D677E',
                        'default_pipe_border_color': '#C8C8C8',
                        'pipe_attr_text_color': '#000000',
                        'pipe_node_attr_text_color': '#000000',
                        'surface_line_color': '#C0C0C0'
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
                    tablePanel,
                    eventHandlerMap = {},
                    eventHandlers = {},
                    stateMap = {},
                    queryMap,
                    gfxMap,
                    loadResources,
                    emit,
                    init,
                    initResult,
                    initDom,
                    initGfx,
                    destroyDom,
                    destroyGfx,
                    destroyResult,
                    computeFitScaleFactors,
                    computeSpecifiedScaleFactors,
                    getScaleFactors,
                    setChartScrollable,
                    resize,
                    //----
                    highlightFeature,
                    unhighlightFeature,
                    //----
                    initTablePanel,
                    destroyTable,
                    initTable,
                    drawTable,
                    //-------------
                    mouseoverChartHandler,
                    mouseoutChartHandler,
                    scaleFactorInputValidator,
                    //-------------
                    computePipeNodeTotalWidth,
                    computePipeTotalWidth,
                    computeMaxPipeNodeSurfaceElev,
                    computeMinPipeBottomElev,
                    computeMinPipeNodeElev,
                    //--
                    prepareTableData,
                    prepareData,
                    //---draw chart
                    repaint,
                    clearChart,
                    drawChart,
                    drawFlowdirect,
                    drawVerticalRuler,
                    drawHorizontalRuler,
                    drawSurface,
                    drawPipes,
                    drawPipe,
                    drawPipeNode
                    //------------
                    ;

                lang.mixin(configMap, options);

                lang.mixin(eventHandlers, options.eventHandlers || {});

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                };

                resize = function(){
                    domStyle.set(queryMap.chartWrapper, {
                        'height': (queryMap.main.offsetHeight - queryMap.title.offsetHeight - queryMap.controlBar.offsetHeight) + 'px'
                    });
                    domStyle.set(queryMap.tableWrapper, {
                        'height': (queryMap.main.offsetHeight - queryMap.title.offsetHeight - queryMap.controlBar.offsetHeight) + 'px'
                    });
                    if(gfxMap){
                        repaint();
                    }
                };

                scaleFactorInputValidator = function(event){
                    if(event.keyCode === 13){
                        repaint();
                        return true;
                    }

                    var value = domAttr.get(event.target, 'value');
                    if(basicUtils.isNumber(value) || !((''+value).match(/^\d+(\.\d{1,2})?$/))){
                        event.preventDefault();
                        return false;
                    }
                    if(configMap.equalScale){
                        domAttr.set(queryMap.scaleFactorXInput, 'value', value);
                        domAttr.set(queryMap.scaleFactorYInput, 'value', value);
                    }

                    return true;
                };

                computeSpecifiedScaleFactors = function(){
                    var cmScaleFactors, pxScaleFactors,
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom,
                        pipeNodeTotalWidth, pipeTotalWidth,
                        maxPipeNodeSurfaceElev, minPipeBottomElev, minPipeNodeElev,
                        paddingWidth, paddingHeight,
                        graphWidth, graphHeight,
                        totalWidth, totalHeight;

                    cmScaleFactors = {
                        'x': parseFloat(domAttr.get(queryMap.scaleFactorXInput, 'value')),
                        'y': parseFloat(domAttr.get(queryMap.scaleFactorYInput, 'value'))
                    };

                    pxScaleFactors = scaleFactorConverter.cm2px(cmScaleFactors);

                    paddingWidth = configMap.padding_left + configMap.padding_right + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_width + configMap.vertical_ruler_padding_right + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_padding_right + configMap.attr_font_size * configMap.vertical_ruler_text_col_count; //单位：px

                    paddingHeight = configMap.air_height + configMap.padding_bottom + attr_font_line_height + Math.max((configMap.horizontal_ruler_padding_top + configMap.horizontal_ruler_width + configMap.horizontal_ruler_padding_bottom + attr_font_line_height * configMap.pipe_attr_line_count),(configMap.pipe_node_point_padding_top + configMap.pipe_node_point_padding_bottom + attr_font_line_height * configMap.pipe_attr_line_count)); //单位：px
                    
                    pipeNodeTotalWidth = computePipeNodeTotalWidth();

                    pipeTotalWidth = computePipeTotalWidth();

                    maxPipeNodeSurfaceElev = computeMaxPipeNodeSurfaceElev();

                    minPipeBottomElev = computeMinPipeBottomElev();

                    minPipeNodeElev = computeMinPipeNodeElev();

                    graphWidth = (pipeTotalWidth + pipeNodeTotalWidth) * pxScaleFactors.x;
                    graphHeight = (maxPipeNodeSurfaceElev - Math.min(minPipeBottomElev, minPipeNodeElev)) * pxScaleFactors.y;

                    totalWidth = paddingWidth + graphWidth;
                    totalHeight = paddingHeight + graphHeight;

                    pxScaleFactors.totalWidth = totalWidth;
                    pxScaleFactors.totalHeight = totalHeight;
                    
                    pxScaleFactors.graphWidth = graphWidth;
                    pxScaleFactors.graphHeight = graphHeight;

                    pxScaleFactors.maxElev = maxPipeNodeSurfaceElev;
                    pxScaleFactors.minElev = Math.min(minPipeBottomElev, minPipeNodeElev);

                    return pxScaleFactors;
                };

                //比例尺 = cm/m
                //缩放系数 = px/m
                //CSS支持单位: cm, mm, in
                computeFitScaleFactors = function(){
                    var scaleFactors = {},
                        totalWidth = queryMap.chartWrapper.offsetWidth,
                        totalHeight = queryMap.chartWrapper.offsetHeight,
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom,
                        pipeNodeTotalWidth, pipeTotalWidth,
                        maxPipeNodeSurfaceElev, minPipeBottomElev, minPipeNodeElev,
                        paddingWidth, paddingHeight,
                        graphWidth, graphHeight,
                        availWidth, availHeight;

                    paddingWidth = configMap.padding_left + configMap.padding_right + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_width + configMap.vertical_ruler_padding_right + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_padding_right + configMap.attr_font_size * configMap.vertical_ruler_text_col_count; //单位：px

                    paddingHeight = configMap.air_height + configMap.padding_bottom + attr_font_line_height + Math.max((configMap.horizontal_ruler_padding_top + configMap.horizontal_ruler_width + configMap.horizontal_ruler_padding_bottom + attr_font_line_height * configMap.pipe_attr_line_count),(configMap.pipe_node_point_padding_top + configMap.pipe_node_point_padding_bottom + attr_font_line_height * configMap.pipe_attr_line_count)); //单位：px

                    graphWidth = totalWidth - paddingWidth;
                    graphHeight = totalHeight - paddingHeight;

                    if(graphWidth < configMap.graph_min_width || graphHeight < configMap.graph_min_height){
                        scaleFactors.compromised = true;
                        graphHeight = (graphHeight < configMap.graph_min_height)?configMap.graph_min_height: graphHeight;
                        graphWidth = (graphWidth < configMap.graph_min_width)?configMap.graph_min_width: graphWidth;
                        totalWidth = paddingWidth + graphWidth;
                        totalHeight = paddingHeight + graphHeight;
                    }

                    pipeNodeTotalWidth = computePipeNodeTotalWidth();

                    pipeTotalWidth = computePipeTotalWidth();

                    maxPipeNodeSurfaceElev = computeMaxPipeNodeSurfaceElev();

                    minPipeBottomElev = computeMinPipeBottomElev();

                    minPipeNodeElev = computeMinPipeNodeElev();

                    scaleFactors.x = graphWidth / (pipeTotalWidth + pipeNodeTotalWidth);
                    scaleFactors.y = graphHeight / (maxPipeNodeSurfaceElev - Math.min(minPipeBottomElev, minPipeNodeElev));

                    if(configMap.equalScale){
                        scaleFactors.x = scaleFactors.y = Math.min(scaleFactors.x, scaleFactors.y);

                        graphWidth = (pipeTotalWidth + pipeNodeTotalWidth) * scaleFactors.x;
                        graphHeight = (maxPipeNodeSurfaceElev - Math.min(minPipeBottomElev, minPipeNodeElev)) * scaleFactors.y;
                        
                        totalWidth = paddingWidth + graphWidth;
                        totalHeight = paddingHeight + graphHeight;
                    }

                    scaleFactors.graphWidth = graphWidth;
                    scaleFactors.graphHeight = graphHeight;

                    scaleFactors.totalHeight = totalHeight;
                    scaleFactors.totalWidth = totalWidth;

                    scaleFactors.maxElev = maxPipeNodeSurfaceElev;
                    scaleFactors.minElev = Math.min(minPipeBottomElev, minPipeNodeElev);

                    return scaleFactors;
                };
                
                computePipeNodeTotalWidth = function(){//单位：米
                    var nodeDefs = configMap.pipeNodeDefInfo,
                        totalWidth = 0;
                    array.forEach(nodeDefs, function(def){
                        var features, node;
                        if(def.size){
                            features = stateMap.pipeNodeInfo.typeMap[def.name].features;
                            totalWidth += features.length * def.size;
                        }
                    });

                    return totalWidth;
                };

                computePipeTotalWidth = function(){//单位：米
                    var features = stateMap.pickResult.selectedPipes,
                        total = 0;
                    array.forEach(features, function(feature){
                        total += pipeUtils.getPipeHorizontalProjection(feature);
                    });
                    return total;
                };

                computeMaxPipeNodeSurfaceElev = function(){//单位：米
                    var pipeNodes = stateMap.pipeNodeInfo.idMap,
                        node,
                        max = -10000000;
                    for(var pipeId in pipeNodes){
                        if(pipeNodes.hasOwnProperty(pipeId)){
                            node = pipeNodes[pipeId];
                            if(basicUtils.isNumber(pipeNodeUtils.getSurfaceElev(node))){
                                max = Math.max(pipeNodeUtils.getSurfaceElev(node), max);
                            }else if(basicUtils.isNumber(pipeNodeUtils.getBotEle(node))){
                                max = Math.max(pipeNodeUtils.getBotEle(node), max);
                            }
                        }
                    }
                    return max;
                };

                computeMinPipeBottomElev = function(){//单位：米
                    var pipes = stateMap.pickResult.selectedPipes,
                        min = 10000000;
                    array.forEach(pipes, function(feature){
                        var pipe = feature;
                        min = Math.min(pipeUtils.getInElev(pipe), min);
                        min = Math.min(pipeUtils.getOutElev(pipe), min);
                    });
                    return min;
                };

                computeMinPipeNodeElev = function(){//单位：米
                    var pipeNodes = stateMap.pipeNodeInfo.idMap,
                        node, depth = 0,
                        min = 10000000;
                    for(var pipeId in pipeNodes){
                        if(pipeNodes.hasOwnProperty(pipeId)){
                            node = pipeNodes[pipeId];
                            if(basicUtils.isNumber(pipeNodeUtils.getSurfaceElev(node))){
                                if(basicUtils.isNumber(pipeNodeUtils.getDepth(node))){
                                    depth = pipeNodeUtils.getDepth(node);
                                }else if(basicUtils.isNumber(pipeNodeUtils.getMaxDepth(node))){
                                    depth = pipeNodeUtils.getMaxDepth(node);
                                }
                                min = Math.min(pipeNodeUtils.getSurfaceElev(node) - depth, min);
                            }else if(basicUtils.isNumber(pipeNodeUtils.getBotEle(node))){
                                min = Math.min(pipeNodeUtils.getBotEle(node), min);
                            }
                        }
                    }
                    return min;
                };


                drawHorizontalRuler = function(){
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_font_padding_top,
                        startX = configMap.padding_left + configMap.vertical_ruler_text_padding_left + configMap.attr_font_size * configMap.vertical_ruler_text_col_count + configMap.vertical_ruler_text_padding_right + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right,
                        rulerY = configMap.air_height + scale.graphHeight + configMap.horizontal_ruler_padding_top + attr_font_line_height;

                    gfxMap.horizontalRulerGroup = gfxMap.surface.createGroup();
                    gfxMap.horizontalRulerGroup.createRect({
                        'x': startX,
                        'y': rulerY,
                        'width': scale.graphWidth,
                        'height': configMap.horizontal_ruler_width
                    }).setFill(configMap.horizontal_ruler_bgcolor);
                };

                drawPipe = function(pipe, reversed, curX, theLastOne){
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_font_padding_top,
                        maxElev = scale.maxElev,
                        topElev = reversed?pipeUtils.getOutElev(pipe):pipeUtils.getInElev(pipe),
                        projection = pipeUtils.getPipeHorizontalProjection(pipe),
                        pipeGroup,
                        pipeDeep,
                        pipeX1, pipeY1, pipeX2, pipeY2,
                        elev, fillColor, strokeColor;

                    strokeColor = configMap.default_pipe_border_color;
                    fillColor = pipeUtils.getPipeColor(pipe)?pipeUtils.getPipeColor(pipe): configMap.default_pipe_fill_color;

                    pipeGroup = pipe.gfxGroup = gfxMap.pipeGroupEles[pipe.attributes.OBJECTID] = gfxMap.pipeGroup.createGroup();

                    pipeGroup.feature = pipe;
                    
                    pipeDeep = pipeUtils.getShapeDeep(pipe);
                    pipeX1 = curX;

                    pipeY1 = configMap.air_height + attr_font_line_height + (maxElev - topElev - pipeDeep) * scale.y;

                    elev = reversed?pipeUtils.getInElev(pipe):pipeUtils.getOutElev(pipe);

                    pipeX2 = pipeX1 + projection * scale.x;

                    pipeY2 = configMap.air_height + attr_font_line_height + (maxElev - elev - pipeDeep) * scale.y;

                    pipeGroup.createPath().moveTo(pipeX1, pipeY1).lineTo(pipeX2, pipeY2).lineTo(pipeX2, pipeY2 + pipeDeep * scale.y).lineTo(pipeX1, pipeY1 + pipeDeep * scale.y).closePath().setStroke(strokeColor).setFill(fillColor); //绘制管线图形

                    pipeGroup.createText({ //绘制管线左端标高
                        'x': pipeX1 + configMap.attr_font_padding_left,
                        'y': pipeY1 + pipeDeep * scale.y + attr_font_line_height + 5 /*TO BE MADE CONFIGURABLE*/,
                        'text': reversed?pipeUtils.getOutElev(pipe).toFixed(3):pipeUtils.getInElev(pipe).toFixed(3),
                        'align': 'start'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_attr_text_color);
                    
                    if(theLastOne){//最后一根管线的时候才画右端标高
                        pipeGroup.createText({ //绘制管线右端标高
                            'x': pipeX2  - configMap.attr_font_padding_right,
                            'y': pipeY2 + pipeDeep * scale.y + attr_font_line_height + 5 /*TO BE MADE CONFIGURABLE*/,
                            'text': !reversed?pipeUtils.getOutElev(pipe).toFixed(3):pipeUtils.getInElev(pipe).toFixed(3),
                            'align': 'end'
                        }).setFont({
                            'size': configMap.attr_font_size
                        }).setFill(configMap.pipe_attr_text_color);
                    }
                    pipeGroup.createText({ //绘制管线属性，行 1
                        'x': curX + projection / 2 * scale.x,
                        'y': configMap.air_height + attr_font_line_height + scale.graphHeight + configMap.horizontal_ruler_padding_top + configMap.horizontal_ruler_width + configMap.horizontal_ruler_padding_bottom + configMap.attr_font_padding_top,
                        'text': '管底坡度：' + pipeUtils.getPipeSlope(pipe).toFixed(4),
                        'align': 'middle'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_attr_text_color);

                    pipeGroup.createText({ //绘制管线属性，行 2
                        'x': curX + projection / 2 * scale.x,
                        'y': configMap.air_height + attr_font_line_height + scale.graphHeight + configMap.horizontal_ruler_padding_top + configMap.horizontal_ruler_width + configMap.horizontal_ruler_padding_bottom + attr_font_line_height + configMap.attr_font_padding_top,
                        'text': '管长：' + pipeUtils.getLength(pipe).toFixed(2),
                        'align': 'middle'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_attr_text_color);

                    return curX + projection * scale.x;
                };

                drawPipeNode = function(node, nodeId, curX, pipeBotElev, theLastOne){
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom,                        
                        maxElev = scale.maxElev,
                        nodeHeightInPx, nodeGroup,
                        layer,
                        topElev = pipeBotElev,
                        botElev,
                        nodeX, nodeY, nodeSize;

                    nodeGroup = node.gfxGroup = gfxMap.pipeNodeGroupEles[nodeId] = gfxMap.pipeNodeGroup.createGroup();
                    nodeGroup.feature = node;

                    layer = node._layerDef;

                    if(pipeNodeUtils.getSurfaceElev(node)){
                        topElev = pipeNodeUtils.getSurfaceElev(node);
                    }else if(pipeNodeUtils.getBotEle(node)){
                        topElev = pipeNodeUtils.getBotEle(node);
                    }

                    if(basicUtils.isNumber(pipeNodeUtils.getDepth(node))){
                        botElev = pipeNodeUtils.getDepth(node)?(topElev - pipeNodeUtils.getDepth(node)):pipeBotElev;
                    }else if(basicUtils.isNumber(pipeNodeUtils.getMaxDepth(node))){
                        botElev = pipeNodeUtils.getMaxDepth(node)?(topElev - pipeNodeUtils.getMaxDepth(node)):pipeBotElev;
                    }else{
                        nodeHeightInPx = 0;
                    }
                    
                    if(nodeHeightInPx !== 0){
                        nodeHeightInPx = Math.abs(topElev - botElev) * scale.y;
                    }

                    nodeX = curX;
                    nodeY = configMap.air_height + attr_font_line_height + (maxElev - topElev) * scale.y;

                    nodeSize = layer.size?(layer.size * scale.x):1;

                    if(nodeHeightInPx > 0){
                        nodeGroup.createRect({//绘制管点图形
                            'x': nodeX,
                            'y': nodeY,
                            'width': nodeSize,
                            'height': nodeHeightInPx
                        }).setStroke(layer.fillColor || configMap.default_pipe_node_color);
                    }
                    
                    nodeGroup.createLine({ //绘制管点参考线
                        'x1': nodeX + nodeSize/2,
                        'y1': nodeY + nodeHeightInPx,
                        'x2': nodeX + nodeSize/2,
                        'y2': configMap.air_height + attr_font_line_height + scale.graphHeight + configMap.pipe_node_point_padding_top
                    }).setStroke({
                        'style': 'Dash',
                        'width': 1,
                        'color': configMap.pipe_node_ref_line_color
                    });

                    nodeGroup.createText({//绘制管点属性，行 1
                        'x': nodeX + nodeSize/2,
                        'y': configMap.air_height + attr_font_line_height + scale.graphHeight + configMap.pipe_node_point_padding_top + configMap.pipe_node_point_padding_bottom + configMap.attr_font_padding_top,
                        'text': layer.displayName,
                        'align': 'middle'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_node_attr_text_color);

                    nodeGroup.createText({//绘制管点属性，行 2
                        'x': nodeX + nodeSize/2,
                        'y': configMap.air_height + attr_font_line_height + scale.graphHeight + configMap.pipe_node_point_padding_top + configMap.pipe_node_point_padding_bottom + attr_font_line_height + configMap.attr_font_padding_top,
                        'text': node.attributes[layer.idField],
                        'align': 'middle'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_node_attr_text_color);

                    nodeGroup.createLine({//绘制井盖线
                        'x1': nodeX,
                        'y1': nodeY,
                        'x2': nodeX + nodeSize,
                        'y2': nodeY
                    }).setStroke({
                        'color': layer.fillColor
                    });

                    nodeGroup.createText({//绘制地面高程文字
                        'x': nodeX + nodeSize/2,
                        'y': configMap.air_height + attr_font_line_height - configMap.attr_font_padding_bottom + (maxElev - topElev) * scale.y,
                        'text': (basicUtils.isNumber(pipeNodeUtils.getSurfaceElev(node)))?pipeNodeUtils.getSurfaceElev(node).toFixed(3): '',
                        'align': 'middle'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.pipe_node_attr_text_color);

                    return curX + nodeSize;
                };

                drawPipes = function(){ //绘制管线和管点
                    var scale = getScaleFactors(),
                        reversed = stateMap.pickResult.reversed,
                        pipes = stateMap.pickResult.selectedPipes,
                        pipeNodes = stateMap.pipeNodeInfo.idMap,
                        maxElev = scale.maxElev,
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_top + configMap.attr_font_padding_bottom,
                        surfaceElevs = [],
                        layers, nodeGroup, pipe,
                        node, nodeId, topElev, layer, i,
                        projection,
                        startX, curX, pipeX1, pipeY1, pipeX2, pipeY2, elev, pipeGroup, pipeDeep,
                        path;

                    startX = configMap.padding_left + configMap.vertical_ruler_text_padding_left + configMap.attr_font_size * configMap.vertical_ruler_text_col_count + configMap.vertical_ruler_text_padding_right + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right;

                    gfxMap.pipeGroup = gfxMap.surface.createGroup();
                    gfxMap.pipeNodeGroup = gfxMap.surface.createGroup();
                    gfxMap.pipeGroupEles = {};
                    gfxMap.pipeNodeGroupEles = {};

                    curX = startX;

                    for(i=0;i<pipes.length;i++){
                        pipe = pipes[i];
                        projection = pipeUtils.getPipeHorizontalProjection(pipe);
                        nodeId = reversed?pipeUtils.getOutJuncID(pipe):pipeUtils.getInJuncID(pipe);
                        node = pipeNodes[nodeId];
                        topElev = reversed?pipeUtils.getOutElev(pipe):pipeUtils.getInElev(pipe);
                        if(node){
                            curX = drawPipeNode(node, nodeId, curX, topElev);
                        }
                        curX = drawPipe(pipes[i], reversed, curX, i + 1 >= pipes.length);
                        if(i + 1 >= pipes.length){
                            nodeId = !reversed?pipeUtils.getOutJuncID(pipe):pipeUtils.getInJuncID(pipe);
                            node = pipeNodes[nodeId];
                            topElev = !reversed?pipeUtils.getOutElev(pipe):pipeUtils.getInElev(pipe);                            
                            curX = drawPipeNode(node, nodeId, curX, topElev);
                        }
                    }
                };

                drawSurface = function(){
                    var scale = getScaleFactors(),
                        reversed = stateMap.pickResult.reversed,
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_font_padding_top,
                        pipes = stateMap.pickResult.selectedPipes,
                        pipeNodes = stateMap.pipeNodeInfo.idMap,
                        maxElev = scale.maxElev,
                        pipe, node, nodeId, layer, nodeSize,
                        stop, stop2, surfaceStops = [],
                        curX, startX, baseY, path, i;
                    
                    baseY = configMap.air_height + attr_font_line_height;

                    startX = configMap.padding_left + configMap.vertical_ruler_text_padding_left + configMap.attr_font_size * configMap.vertical_ruler_text_col_count + configMap.vertical_ruler_text_padding_right + configMap.vertical_ruler_padding_left + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width + configMap.vertical_ruler_padding_right;

                    for(i=0;i<pipes.length;i++){
                        pipe = pipes[i];
                        nodeId = reversed?pipeUtils.getOutJuncID(pipe):pipeUtils.getInJuncID(pipe);
                        node = pipeNodes[nodeId];
                        layer = pipeNodes[nodeId]._layerDef;
                        nodeSize = layer.size?(layer.size * scale.x): 1;
                        stop = {
                            'nodeSize': nodeSize,
                            'pipeProjection': pipeUtils.getPipeHorizontalProjection(pipe)
                        };
                        if(pipeNodeUtils.getSurfaceElev(node)){
                            stop.surfaceElev = pipeNodeUtils.getSurfaceElev(node);
                        }
                        surfaceStops.push(stop);
                        if(i + 1 >= pipes.length){
                            nodeId = !reversed?pipeUtils.getOutJuncID(pipe):pipeUtils.getInJuncID(pipe);
                            node = pipeNodes[nodeId];
                            layer = pipeNodes[nodeId]._layerDef;
                            nodeSize = layer.size?(layer.size * scale.x): 1;
                            stop = {
                                'nodeSize': nodeSize
                            };
                            if(pipeNodeUtils.getSurfaceElev(node)){
                                stop.surfaceElev = pipeNodeUtils.getSurfaceElev(node);
                            }
                            surfaceStops.push(stop);
                        }
                    }

                    gfxMap.surfaceGroup = gfxMap.surface.createGroup();
                    path = gfxMap.surfaceGroup.createPath();
                    
                    for(i=0;i<surfaceStops.length;i++){
                        stop = surfaceStops[i];
                        if(!(basicUtils.isNumber(stop.surfaceElev))){
                            if(i - 1 >= 0 && (basicUtils.isNumber(surfaceStops[i-1].surfaceElev))){
                                stop.surfaceElev = surfaceStops[i-1].surfaceElev;
                            }else if(i + 1 < surfaceStops.length && (basicUtils.isNumber(surfaceStops[i+1].surfaceElev))){
                                stop.surfaceElev = surfaceStops[i+1].surfaceElev;
                            }
                        }
                    }
                    
                    curX = startX;

                    for(i=0;i<surfaceStops.length - 1;i++){
                        curX += stop.nodeSize;
                        stop = surfaceStops[i];
                        stop2 = surfaceStops[i+1];
                        path.moveTo(curX, baseY + (maxElev - stop.surfaceElev) * scale.y).
                            lineTo(curX + stop.pipeProjection * scale.x, baseY + (maxElev - stop2.surfaceElev) * scale.y);
                        curX += stop.pipeProjection * scale.x;

                    }

                    path.setStroke({
                        'style': 'Solid',
                        'color': configMap.surface_line_color
                    });
                };

                drawFlowdirect = function(){
                    var scale = getScaleFactors(),
                        reversed = stateMap.pickResult.reversed,
                        startX, startY;

                    gfxMap.flowdirectGroup = gfxMap.surface.createGroup();

                    startY = Math.floor(configMap.air_height / 2) - configMap.flowdirect_line_width;
                    startX = scale.totalWidth / 2 - configMap.flowdirect_line_length;
                    
                    gfxMap.flowdirectGroup.createLine({
                        'x1': startX,
                        'y1': startY,
                        'x2': startX + configMap.flowdirect_line_length,
                        'y2': startY
                    }).setStroke({
                        'width': configMap.flowdirect_line_width,
                        'color': configMap.flowdirect_color
                    });

                    gfxMap.flowdirectGroup.createPath().
                        moveTo(reversed?startX+configMap.flowdirect_arrow_x_length:startX + configMap.flowdirect_line_length - configMap.flowdirect_arrow_x_length, startY - configMap.flowdirect_arrow_y_height).
                        lineTo(reversed?startX:startX+configMap.flowdirect_line_length, startY).
                        lineTo(reversed?startX+configMap.flowdirect_arrow_x_length:startX + configMap.flowdirect_line_length - configMap.flowdirect_arrow_x_length, startY + configMap.flowdirect_arrow_y_height).
                        setStroke({
                        'width': configMap.flowdirect_line_width,
                        'color': configMap.flowdirect_color
                    });

                    gfxMap.flowdirectGroup.createText({
                        'x': startX + configMap.attr_font_padding_left + configMap.flowdirect_line_length,
                        'y': startY + configMap.attr_font_padding_top,
                        'text': '流向',
                        'align': 'start'
                    }).setFont({
                        'size': configMap.attr_font_size
                    }).setFill(configMap.flowdirect_text_color);

                };

                drawVerticalRuler = function(){ //绘制标高尺
                    var scale = getScaleFactors(),
                        attr_font_line_height = configMap.attr_font_size + configMap.attr_font_padding_bottom + configMap.attr_font_padding_top,
                        rulerLenInPx,
                        rulerX, startY, curY, curLen,
                        maxElev, additionalLen, showFirstMark;
                    rulerX = configMap.padding_left + configMap.attr_font_size * configMap.vertical_ruler_text_col_count + configMap.vertical_ruler_text_padding_left + configMap.vertical_ruler_padding_left;
                    maxElev = Math.ceil(scale.maxElev);

                    additionalLen = (maxElev - scale.maxElev) * scale.y ;
                    showFirstMark = true;

                    if(additionalLen > configMap.air_height){
                        additionalLen = configMap.air_height;
                        showFirstMark = false;
                    }

                    startY = configMap.air_height + attr_font_line_height - additionalLen;

                    rulerLenInPx = scale.graphHeight + additionalLen;

                    gfxMap.verticalRulerGroup = gfxMap.surface.createGroup();
                    gfxMap.verticalRulerGroupEles = {};
                    gfxMap.verticalRulerGroupEles.ruler = gfxMap.verticalRulerGroup.createRect({
                        'x': rulerX,
                        'y': startY,
                        'width': configMap.vertical_ruler_width,
                        'height': rulerLenInPx
                    }).setFill(configMap.vertical_ruler_bgcolor);

                    curY = showFirstMark?startY:startY + (scale.maxElev - Math.floor(scale.maxElev)) * scale.y + additionalLen;
                    curLen = showFirstMark?0:(scale.maxElev - Math.floor(scale.maxElev)) * scale.y + additionalLen;

                    while(curLen <= rulerLenInPx){
                        gfxMap.verticalRulerGroup.createLine({
                            'x1': rulerX + configMap.vertical_ruler_width,
                            'y1': curY,
                            'x2': rulerX + configMap.vertical_ruler_width + configMap.vertical_ruler_mark_width,
                            'y2': curY
                        }).setStroke(configMap.vertical_ruler_mark_color);

                        gfxMap.verticalRulerGroup.createText({
                            'x': rulerX - configMap.vertical_ruler_text_padding_right,
                            'y': curY + configMap.attr_font_padding_top,
                            'text': (showFirstMark?Math.ceil(scale.maxElev):Math.floor(scale.maxElev)) - Math.floor(curLen/scale.y),
                            'align': 'end'
                        }).setFont({'size': configMap.attr_font_size}).
                            setFill(configMap.vertical_ruler_text_color);

                        curLen += 1*scale.y;
                        curY += 1*scale.y;
                    }
                };

                setChartScrollable = function(scallable){
                    if(scallable){
                        domClass.add(queryMap.chartWrapper, 'result-panel-chart-scrollable');
                    }else{
                        domClass.remove(queryMap.chartWrapper, 'result-panel-chart-scrollable');
                    }
                };

                getScaleFactors = function(){
                    if(!stateMap.scaleFactors){
                        if(configMap.autoFit){
                            stateMap.scaleFactors = computeFitScaleFactors();
                            var scaleFactorsInCm = scaleFactorConverter.px2cm({
                                'x': stateMap.scaleFactors.x,
                                'y': stateMap.scaleFactors.y
                            });
                            domAttr.set(queryMap.scaleFactorXInput, 'value', scaleFactorsInCm.x.toFixed(2));
                            domAttr.set(queryMap.scaleFactorYInput, 'value', scaleFactorsInCm.y.toFixed(2));
                            if(stateMap.scaleFactors.compromised){
//                                alert('窗口尺寸过小，无法适应窗口大小显示，已经帮您将结果调整到最小的尺寸');
                                setChartScrollable(true);
                            }else{
                                setChartScrollable(false);
                            }
                        }else{
                            stateMap.scaleFactors = computeSpecifiedScaleFactors();
                            setChartScrollable(true);
                        }
                    }
                    return stateMap.scaleFactors;
                };

                destroyGfx = function(){
                    if(gfxMap){

                        if(eventHandlerMap.mouseoverChart){
                            eventHandlerMap.mouseoverChart.remove();
                            delete eventHandlerMap.mouseoverChart;
                        }

                        if(eventHandlerMap.mouseoutChart){
                            eventHandlerMap.mouseoutChart.remove();
                            delete eventHandlerMap.mouseoutChart;
                        }

                        gfxMap.surface.destroy();
                        gfxMap = null;
                    }
                };

                destroyDom = function(){
                    if(eventHandlerMap.toggle){
                        eventHandlerMap.toggle.remove();
                        delete eventHandlerMap.toggle;
                    }

                    if(eventHandlerMap.close){
                        eventHandlerMap.close.remove();
                        delete eventHandlerMap.close;
                    }

                    if(eventHandlerMap.toggleAutoFit){
                        eventHandlerMap.toggleAutoFit.remove();
                        delete eventHandlerMap.toggleAutoFit;
                    }

                    if(eventHandlerMap.toggleEqualScale){
                        eventHandlerMap.toggleEqualScale.remove();
                        delete eventHandlerMap.toggleEqualScale;
                    }

                    if(eventHandlerMap.scaleXInputChange){
                        eventHandlerMap.scaleXInputChange.remove();
                        delete eventHandlerMap.scaleXInputChange;
                    }

                    if(eventHandlerMap.scaleYInputChange){
                        eventHandlerMap.scaleYInputChange.remove();
                        delete eventHandlerMap.scaleYInputChange;
                    }

                    if(eventHandlerMap.clickRepaint){
                        eventHandlerMap.clickRepaint.remove();
                        delete eventHandlerMap.clickRepaint;
                    }
                    
                    if(eventHandlerMap.resize){
                        eventHandlerMap.resize.remove();
                        delete eventHandlerMap.resize;
                    }

                    if(queryMap){
                        domConstruct.destroy(queryMap.main);
                        queryMap = null;
                    }
                };

                destroyResult = function(){
                    destroyGfx();
                    if(tablePanel){
                        tablePanel.destroy();
                    }
                    destroyDom();
                    stateMap = null;
                    emit('afterClose');
                };

                clearChart = function(){
                    destroyGfx();
                    stateMap.scaleFactors = null;
                };

                loadResources = function(){
                    var dir = resourceLoader.getDojoModuleLocation(module);
                    resourceLoader.addCSSFile(resources.CSS, dir);
                };

                initGfx = function(){
                    var scale = getScaleFactors();
                    gfxMap = {};
                    gfxMap.surface = gfx.createSurface(queryMap.chartWrapper, scale.totalWidth, scale.totalHeight);
                    eventHandlerMap.mouseoverChart = gfxMap.surface.on('mouseover', mouseoverChartHandler);
                    eventHandlerMap.mouseoutChart = gfxMap.surface.on('mouseout', mouseoutChartHandler);
                };

                initDom = function(){
                    queryMap = {};

                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);
                    domConstruct.place(queryMap.main, queryMap.parent);
                    queryMap.title = query('.result-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.result-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.result-panel-title-btns', queryMap.title)[0];

                    queryMap.controlBar = query('.result-panel-control-bar', queryMap.main)[0];
                    queryMap.closeBtn = query('.result-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];
                    queryMap.toggleBtn = query('.result-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];
                    
                    queryMap.scaler = query('.result-panel-control-bar-scaler', queryMap.controlBar)[0];
                    queryMap.autoFitCheckBox = query('input[name=autoFit]', queryMap.scaler)[0];
                    queryMap.equalScaleCheckbox = query('input[name=equalScale]', queryMap.scaler)[0];
                    queryMap.scaleFactorXInput = query('input[name=scaleFactorX]', queryMap.scaler)[0];
                    queryMap.scaleFactorYInput = query('input[name=scaleFactorY]', queryMap.scaler)[0];
                    queryMap.repaintBtn = query('button[data-role=repaint]', queryMap.scaler)[0];

                    queryMap.chartWrapper = query('.result-panel-chart-wrapper', queryMap.main)[0];
                    queryMap.tableWrapper = query('.result-panel-table-wrapper', queryMap.main)[0];

                    resize();

                    eventHandlerMap.close = on(queryMap.closeBtn, 'click', function(){
                        destroyResult();
                    });

                    eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', function(){
                        if(domClass.contains(queryMap.main, 'result-panel-minimized')){
                            domClass.remove(queryMap.main, 'result-panel-minimized');
                            html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-normalText'));
                            repaint();
                        }else{
                            domClass.add(queryMap.main, 'result-panel-minimized');
                            html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-minimizedText'));
                        }
                    });

                    eventHandlerMap.toggleAutoFit = on(queryMap.autoFitCheckBox, 'click', function(){
                        configMap.autoFit = domAttr.get(queryMap.autoFitCheckBox, 'checked');
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
                    });

                    eventHandlerMap.toggleEqualScale = on(queryMap.equalScaleCheckbox, 'click', function(){
                        configMap.equalScale = domAttr.get(queryMap.equalScaleCheckbox, 'checked');
                        if(configMap.equalScale && !configMap.autoFit){
                            var xScale = parseFloat(domAttr.get(queryMap.scaleFactorXInput, 'value')),
                                yScale = parseFloat(domAttr.get(queryMap.scaleFactorYInput, 'value'));
                            
                            xScale = yScale = Math.max(xScale, yScale);

                            domAttr.set(queryMap.scaleFactoryXInput, 'value', xScale);
                            domAttr.set(queryMap.scaleFactoryYInput, 'value', yScale);
                        }
                        repaint();
                    });

                    eventHandlerMap.scaleXInputChange = on(queryMap.scaleFactorXInput, 'keyup', scaleFactorInputValidator);
                    
                    eventHandlerMap.scaleYInputChange = on(queryMap.scaleFactorYInput, 'keyup', scaleFactorInputValidator);

                    eventHandlerMap.clickRepaint = on(queryMap.repaintBtn, 'click', repaint);

                    eventHandlerMap.resize = map.on('resize', resize);

                };

                mouseoverChartHandler = function(event){
                    var target = event.gfxTarget,
                        cur,feature;
                    if(target){
                        cur = target;
                        while(cur.parent){
                            if(cur.feature){
                                feature = cur.feature;
                                break;
                            }
                            cur = cur.parent;
                        };
                        if(feature){
                            highlightFeature(feature);
                            highlightGraphic(feature.graphic);
                        }
                    }else{
                        unhighlightFeature();
                    }
                };

                mouseoutChartHandler = function(event){
                    unhighlightFeature();
                    unhighlightGraphic();
                };

                drawTable = function(){
                    //TODO
                };
                
                initTable = function(){
                    prepareTableData();
                    if(tablePanel){
                        tablePanel.setData(stateMap.tableData, {
                            'parentNode': queryMap.tableWrapper
                        });
                    }
                    //TODO
                };

                destroyTable = function(){
                    delete stateMap.tableData;
                    //TODO
                };

                prepareTableData = function(){
                    if(stateMap.tableData){
                        destroyTable();
                    }

                    var pipeLikeDataSets = {},
                        pipeNodeDataSets = {},
                        data = {
                            'tableIds': [],
                            'tableData': {}
                        },
                        nodeIds = [],
                        lineModelId, isConduit, pipeData, pipe, node, type,
                        pipeNodeData, nodeInfo, model, i;

                    pipeData = stateMap.pickResult.selectedPipes;

                    for(i=0;i<pipeData.length;i++){
                        pipe = pipeData[i];
                        type = pipeUtils.getPipeType(pipe);
                        if(type != 'Pipe' && type != 'Conduit'){
                            continue;
                        }
                        if(!pipeLikeDataSets[type]){
                            pipeLikeDataSets[type] = {
                                'modelId': type,
                                'model': dataModel.models[type],
                                'data': []
                            };
                        }
                        pipeLikeDataSets[type].data.push(pipe);

                        //准备对管点进行排序
                        !pipeUtils.getInJuncID(pipe) || (nodeIds.push(pipeUtils.getInJuncID(pipe)));
                        !pipeUtils.getOutJuncID(pipe) || (nodeIds.push(pipeUtils.getOutJuncID(pipe)));
                    }

                    array.forEach(['Pipe', 'Conduit'], function(modelId){
                        var dataSet = pipeLikeDataSets[modelId];
                        if(dataSet){
                            data.tableIds.push(modelId);
                            data.tableData[modelId] = {
                                'id': modelId,
                                'name': dataSet.model.displayName,
                                'model': dataSet.model,
                                'data': dataSet.data
                            };
                        }
                    });
                    
                    //接下来是管点们
                    //过滤掉重复的管点
                    nodeIds = (function(){
                        var nodeIdMap = {};
                        return array.filter(nodeIds, function(nodeId){
                            if(!nodeIdMap[nodeId]){
                                nodeIdMap[nodeId] = true;
                                return true;
                            }
                            return false;
                        });
                    })();

                    //分装不同类型的管点
                    for(i=0;i<nodeIds.length;i++){
                        node = stateMap.pipeNodeInfo.idMap[nodeIds[i]];
                        if(!node){
                            continue;
                        }
                        type = node._layerDef.name;
                        if(!pipeNodeDataSets[type]){
                            pipeNodeDataSets[type] = {
                                'modelId': type,
                                'model': dataModel.models[type],
                                'data': []
                            };
                        }
                        pipeNodeDataSets[type].data.push(node);
                    }

                    array.forEach(['Manhole', 'Comb', 'Outfall', 'Valve'], function(modelId){
                        var model;
                        if(pipeNodeDataSets[modelId]){
                            model = dataModel.models[modelId];
                            data.tableIds.push(modelId);
                            data.tableData[modelId] = {
                                'id': modelId,
                                'name': model.displayName,
                                'model': model,
                                'data': pipeNodeDataSets[modelId].data
                            };
                        }
                    });

                    stateMap.tableData = data;
                };

                prepareData = function(){
                };

                repaint = function(){
                    clearChart();
                    drawChart();
                };

                drawChart = function(){
                    emit('startDraw');
                    var scale = getScaleFactors();
                    if(!scale){
                        alert('比例尺计算失败，无法绘制结果！');
                        destroyResult();
                        return;
                    }
                    initGfx();
                    drawFlowdirect();
                    drawVerticalRuler();
                    drawHorizontalRuler();
                    drawPipes();
                    drawSurface();
                };

                initResult = function(data){
                    emit('beforeOpen');
                    configMap.autoFit = true;
                    configMap.equalScale = false;
                    stateMap = {};
                    lang.mixin(stateMap, data);
                    prepareData();
                    initDom();
                    drawChart();
                    initTable();
                };

                highlightFeature = function(feature){
                    if(!stateMap){
                        return;
                    }
                    var gfxGroup, nodes;
                    unhighlightFeature();
                    if(feature && feature.gfxGroup){
                        stateMap.selectedGfxGroup = gfxGroup = feature.gfxGroup;
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

                        if(tablePanel && feature.tableRow){
                            tablePanel.highlightRowByRowDom(feature.tableRow);
                        }
                    }
                };

                unhighlightFeature = function(){
                    if(!stateMap){
                        return;
                    }
                    var gfxGroup = stateMap.selectedGfxGroup,
                        nodes;
                    if(gfxGroup){
                        nodes = gfxGroup.children;
                        array.forEach(nodes, function(node){
                            var shape = node.shape,
                                stroke = node.normalStroke,
                                fill = node.normalFill;

                            node.setStroke(stroke);
                            node.setFill(fill);
                        });
                        if(tablePanel){
                            tablePanel.unhighlightRow();
                        }
                    }
                };
                
                initTablePanel = function(){
                    tablePanel = new TablePanel({
                        'tabsOutOfBox': false,
                        'eventHandlers': {
                            'mouseOverRow': function(event){
                                var modelId = event.modelId,
                                    feature = event.data;
                                
                                highlightGraphic(feature.graphic);
                                highlightFeature(feature);
                            },
                            'mouseOutRow': function(event){
                                var modelId = event.modelId,
                                    feature = event.data;

                                unhighlightGraphic(feature.graphic);
                                unhighlightFeature();
                            }
                        }
                    });
                };

                init = function(){
                    loadResources();
                    initTablePanel();
                };

                init();

                return {
                    'destroyResult': destroyResult,
                    'initResult': initResult,
                    'highlightFeature': highlightFeature,
                    'unhighlightFeature': unhighlightFeature
                };
            })(options);
        };

        destroyResultPanel = function(){
            if(resultPanel){
                resultPanel.destroyResult();
            }
        };

        clearResult = function(){
            destroyResultPanel();
            if(graphicLayer){
                graphicLayer.clear();
            }
            if(controlPanel){
                controlPanel.clear();
            }
            if(picker){
                picker.clear();
            }
            delete stateMap.pickResult;
            delete stateMap.pipeNodeInfo;
            stateMap.pickResult = null;
            map.infoWindow.hide();
        };

        cancel = function(){
            if(stateMap){
                //TODO cancel
                picker.abort();
                controlPanel.destroy();
            }
            clearResult();
            removeGraphicLayer();
            stateMap.isInUse = false;
            emit('afterCancel');
        };

        isInUse = function(){
            return stateMap && stateMap.isInUse?true:false;
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
