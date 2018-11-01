define([
    'module',
    'dojo/request',
    'dojo/promise/all',
    'dojo/string',
    'dojo/_base/lang',
    'dojo/_base/array',
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
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/PictureMarkerSymbol',
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
    'pipe-network/lib/map-utils',
    'pipe-network/pipe-model-utils',
    'pipe-network/data-model',
    'pipe-network/analysis/analysis-table-panel'
], function(
    module,
    request,
    all,
    string,
    lang,
    array,
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
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
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
    mapUtils,
    pipeUtils,
    dataModel,
    TablePanel
){
    'use strict';
    /**
     * Events: ready, beforeUse, afterUse, beforeCancel, afterCancel
     */
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
            resultPanel,
            picker,
            //----
            initPicker,
            initControlPanel,
            initResultPanel,
            //----
            emit,
            isInUse,
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
                    configMap = {
                        'UNSELECTED_DATA_ITEM_TEXT': '未选择'
                    },
                    stateMap = {},
                    queryMap = {},
                    eventHandlers = {},
                    eventHandlerMap = {},
                    //----
                    resources = {
                        'IMGS': {
                            'LOADING': '../../img/loading.gif'
                        },
                        'CSS': '../../css/up-down-stream-analysis-control-panel.css'
                    },
                    templates = {
                        'main': ""+
                            "<div class=\"up-down-stream-analysis-control-panel\">"+
                             "<div class=\"control-panel-title\">"+
                              "<div class=\"control-panel-title-text\">上下游分析</div>"+
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
                              "<div class=\"control-panel-tip\" title=\"提示：在地图上点选要分析的目标管线，输入要分析的管线长度，选择要分析的类型，最后点击“分析”按钮\">?</div>"+
                              "<div class=\"control-panel-data\">"+
                               "<label class=\"control-panel-data-title\">目标管线：</label><br/>"+
                               "<div class=\"control-panel-data-item\" title=\"所选择的管线\">未选择</div>"+
                              "</div>"+
                              "<label>"+
                               "<input type=\"checkbox\" data-role=\"specify-length\"/>&nbsp;指定分析长度"+
                              "</label>"+
                              "<label class=\"control-panel-length-input-label\" style=\"display: none;\">分析长度：<input data-role=\"length\" type=\"number\" placeholder=\"请输入\" value=\"1000\"/>&nbsp;米</label>"+
                              "<label class=\"control-panel-type-select-label\">分析类型："+
                               "<select>"+
                                "<option value=\"0\">全部</option>"+
                                "<option value=\"2\">上游</option>"+
                                "<option value=\"1\">下游</option>"+
                               "</select>"+
                              "</label>"+
                             "</div>"+
                             "<div class=\"control-panel-control-btns\">"+
                              "<button class=\"control-panel-control-btn\" data-role=\"clear\"><span>清空</span></button>"+
                              "<button class=\"control-panel-control-btn\" data-role=\"confirm\"><span>分析</span></button>"+
                             "</div>"+
                            "</div>"
                    },
                    //----
                    loadResources,
                    //----
                    closeHandler,
                    toggleHandler,
                    clearHandler,
                    confirmHandler,
                    lengthInputKeyupHandler,
                    toggleSpecifyLengthHandler,
                    typeSelectChangeHandler,
                    clickTargetDataItemHandler,
                    //----
                    registerDomEvents,
                    removeDomEvents,
                    //----
                    clearState,
                    //----
                    initDom,
                    destroyDom,
                    //----
                    startLoading,
                    stopLoading,
                    submit,
                    //----
                    emit,
                    init,
                    addPipe,
                    open,
                    close;

                toggleSpecifyLengthHandler = function(){
                    var spec = domAttr.get(queryMap.specifyLengthCheckbox, 'checked');
                    if(spec){
                        domStyle.set(queryMap.lengthInputLabel, 'display', '');                        
                        stateMap.specifyLength = true;
                    }else{
                        domStyle.set(queryMap.lengthInputLabel, 'display', 'none');
                        stateMap.specifyLength = false;
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
                    html.set(queryMap.dataItem, configMap.UNSELECTED_DATA_ITEM_TEXT);
                    stateMap.selectedPipe = null;
                    emit('afterClear');
                    //TODO
                };

                confirmHandler = function(){
                    submit();
                };

                lengthInputKeyupHandler = function(event){
                    if(event.keyCode === 13){
                        submit();
                    }
                };

                clickTargetDataItemHandler = function(event){
                    emit('clickTargetDataItem');
                };

                typeSelectChangeHandler = function(event){
                };

                registerDomEvents = function(){
                    if(queryMap){
                        eventHandlerMap.close = on(queryMap.closeBtn, 'click', closeHandler);
                        eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', toggleHandler);
                        eventHandlerMap.clear = on(queryMap.clearBtn, 'click', clearHandler);
                        eventHandlerMap.confirm = on(queryMap.confirmBtn, 'click', confirmHandler);
                        eventHandlerMap.lengthInputKeyup = on(queryMap.lengthInput, 'keyup', lengthInputKeyupHandler);
                        eventHandlerMap.typeSelectChange = on(queryMap.typeSelect, 'change', typeSelectChangeHandler);
                        eventHandlerMap.clickTargetDataItem = on(queryMap.dataItem, 'click', clickTargetDataItemHandler);
                        eventHandlerMap.toggleSpecifyLength = on(queryMap.specifyLengthCheckbox, 'click', toggleSpecifyLengthHandler);
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
                    if(eventHandlerMap.clickTargetDataItem){
                        eventHandlerMap.clickTargetDataItem.remove();
                        delete eventHandlerMap.clickTargetDataItem;
                    }
                    if(eventHandlerMap.toggleSpecifyLengthHandler){
                        eventHandlerMap.toggleSpecifyLengthHandler.remove();
                        delete eventHandlerMap.toggleSpecifyLengthHandler;
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

                initDom = function(){
                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);

                    queryMap.title = query('.control-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.control-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.control-panel-title-btns', queryMap.title)[0];
                    queryMap.toggleBtn = query('.control-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];
                    queryMap.closeBtn = query('.control-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];

                    queryMap.content = query('.control-panel-content', queryMap.main)[0];
                    queryMap.data = query('.control-panel-data', queryMap.content)[0];
                    queryMap.dataTitle = query('.control-panel-data-title', queryMap.data)[0];
                    queryMap.dataItem = query('.control-panel-data-item', queryMap.data)[0];

                    queryMap.lengthInputLabel = query('.control-panel-length-input-label', queryMap.content)[0];
                    queryMap.lengthInput = query('.control-panel-length-input-label input[data-role=length]', queryMap.content)[0];
                    queryMap.specifyLengthCheckbox = query('label input[data-role=specify-length]', queryMap.content)[0];
                    queryMap.typeSelect = query('.control-panel-type-select-label select', queryMap.content)[0];

                    queryMap.controlBtns = query('.control-panel-control-btns', queryMap.main)[0];
                    queryMap.clearBtn = query('.control-panel-control-btn[data-role=clear]', queryMap.controlBtns)[0];
                    queryMap.confirmBtn = query('.control-panel-control-btn[data-role=confirm]', queryMap.controlBtns)[0];

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

                addPipe = function(feature){
                    var pipeId;
                    if(feature){
                        stateMap.selectedPipe = feature;
                        pipeId = pipeUtils.getId(feature);
                        html.set(queryMap.dataItem, pipeId);
                    }
                };

                init = function(){
                    options = options || {};
                    
                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, configMap.eventHandlers || {});

                    loadResources();
                    //TODO
                };

                submit = function(){
                    if(!stateMap.selectedPipe){
                        alert('请先选择要分析的目标管线');
                        return;
                    }
                    var length = parseFloat(domAttr.get(queryMap.lengthInput, 'value')),
                        type = parseInt(domAttr.get(queryMap.typeSelect, 'value'));
                    if(!basicUtils.isNumber(length) || length <= 0 || length > 99999999){
                        alert("请输入正确的长度");
                        return;
                    }
                    emit('submit', {
                        'selectedPipe': stateMap.selectedPipe,
                        'length': length,
                        'type': type,
                        'specifyLength': stateMap.specifyLength
                    });
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
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
                    if(map.infoWindow){
                        map.infoWindow.hide();
                    }
                    //TODO
                    emit('afterClose');
                };

                //TODO

                init();

                return {
                    'open': open,
                    'close': close,
                    'addPipe': addPipe,
                    'stopLoading': stopLoading,
                    'startLoading': startLoading
                };
            })(options);
        };
        
        initPicker = function(options){
            /**
             * Events: 
             */
            picker = (function(options){
                var map,
                    configMap = {
                    },
                    symbols = {
                        'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                        'SELECTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25])),
                        'HIGHLIGHTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2)
                    },
                    eventHandlers = {},
                    eventHandlerMap = {},
                    stateMap,
                    graphicLayer,
                    //----
                    pipeIdentifyTask,
                    pipeIdentifyParameters,
                    //----
                    clickHandler,
                    //----
                    addGraphicToMap,
                    pick,
                    clear,
                    initGraphicLayer,
                    destroyGraphicLayer,
                    initState,
                    clearState,
                    registerEvents,
                    removeEvents,
                    //----
                    initIdentifyTask,
                    destroyIdentifyTask,
                    emit,
                    init,
                    //----
                    locateTarget,
                    pause,
                    resume,
                    start,
                    stop;

                clickHandler = function(event){
                    if(event && event.mapPoint){
                        pick(event.mapPoint);
                    }
                };

                clear = function(){
                    clearState();
                    emit('afterClear');
                };

                addGraphicToMap = function(){
                    var graphic, feature;
                    if(graphicLayer && stateMap.selectedPipe){
                        feature = stateMap.selectedPipe;
                        graphic = new Graphic(feature.geometry, symbols.SELECTED_PIPE_LINE_SYMBOL, feature.attributes);

                        feature.graphic = graphic;
                        graphic.feature = feature;

                        graphicLayer.add(graphic);
                    }
                };

                locateTarget = function(){
                    var feature = stateMap.selectedPipe,
                        pipeType = pipeUtils.getPipeType(feature),
                        model = dataModel.models[pipeType];
                    
                    if(feature && feature.graphic && model && graphicLayer){
                        mapUtils.locateGraphicOnGraphicLayer(map, feature.graphic, feature, model, graphicLayer);
                    }
                };

                pick = function(point){
                    if(!point){
                        return;
                    }
                    pipeIdentifyParameters.geometry = point;
                    pipeIdentifyParameters.mapExtent = map.extent;

                    pipeIdentifyTask.execute(pipeIdentifyParameters).then(function(identifyResult){
                        var identifiedFeature, query, queryTask;
                        if(!identifyResult || !identifyResult.length){
                            return;
                        }
                        identifiedFeature = identifyResult[0];

                        queryTask = new QueryTask(configMap.pipeServiceUrl + '/' + identifiedFeature.layerId);
                        query = new Query();

                        query.returnGeometry = true;
                        query.outFields = ['*'];
//                        query.objectIds = [identifiedFeature.feature.attributes.OBJECTID];
                        query.objectIds = [pipeUtils.getOBJECTID(identifiedFeature.feature)];
                        queryTask.execute(query).then(function(featureSet){
                            var feature;
                            if(featureSet && featureSet.features && featureSet.features.length){
                                feature = featureSet.features[0];
                                stateMap.selectedPipe = feature;
                                addGraphicToMap();
                                emit('pick', {
                                    'selectedPipe': stateMap.selectedPipe
                                });
                            }
                        });
                    });
                };

                initGraphicLayer = function(){
                    if(graphicLayer){
                        destroyGraphicLayer();
                    }
                    graphicLayer = new GraphicsLayer();
                    map.addLayer(graphicLayer);
                };

                destroyGraphicLayer = function(){
                    if(graphicLayer){
                        graphicLayer.clear();
                        map.removeLayer(graphicLayer);
                    }
                };

                initState = function(){
                    stateMap = {};
                };

                clearState = function(){
                    stateMap = null;
                    if(graphicLayer){
                        graphicLayer.clear();
                    }
                };
                
                registerEvents = function(){
                    removeEvents();
                    eventHandlerMap.clickMap = map.on('click', clickHandler);
                };

                removeEvents = function(){
                    if(eventHandlerMap.clickMap){
                        eventHandlerMap.clickMap.remove();
                        delete eventHandlerMap.clickMap;
                    }
                };

                start = function(){
                    if(emit('beforeStart')){
                        initState();
                        initIdentifyTask();
                        initGraphicLayer();
                        registerEvents();
                        //TODO
                        emit('afterStart');
                    }
                };

                stop = function(){
                    if(emit('beforeStop')){
                        clearState();
                        removeEvents();
                        destroyGraphicLayer();
                        destroyIdentifyTask();
                        //TODO
                        emit('afterStop');
                    }
                };

                pause = function(){
                    if(stateMap){
                        removeEvents();
                    }
                };

                resume = function(){
                    if(stateMap){
                        delete stateMap.selectedPipe;
                        if(graphicLayer){
                            graphicLayer.clear();
                        }
                        registerEvents();
                    }
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                        return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
                };

                destroyIdentifyTask = function(){
                    pipeIdentifyTask = null;
                    pipeIdentifyParameters = null;
                };

                initIdentifyTask = function(){
                    pipeIdentifyTask = new IdentifyTask(configMap.pipeServiceUrl);
                    pipeIdentifyParameters = new IdentifyParameters();

                    pipeIdentifyParameters.tolerance = 5;
                    pipeIdentifyParameters.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                    pipeIdentifyParameters.returnGeometry = true;
                    
                    lang.mixin(pipeIdentifyParameters, configMap.pipeIdentifyParameters);
                };

                init = function(options){ 
                    options = options || {};
                    if(!options.map){
                        throw "'map' is needed for options!";
                    }
                    if(!options.pipeIdentifyParameters){
                        throw "'pipeIdentifyParameters' is needed for options!";
                    }
                    
                    if(!options.pipeServiceUrl){
                        throw "'pipeServiceUrl' is needed for options!";
                    }
                    
                    if(!options.pipeNodeServiceUrl){
                        throw "'pipeNodeServiceUrl' is needed for options!";
                    }
                    
                    if(!options.pipeNodeQueryParameters){
                        throw "'pipeNodeQueryParameters' is needed for options!";
                    }

                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, options.eventHandlers || {});
                    lang.mixin(symbols, options.symbols || {});
                    //TODO
                };
                
                init(options);

                return {
                    'pause': pause,
                    'resume': resume,
                    'locateTarget': locateTarget,
                    'start': start,
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
                    configMap = {
                        'maxTableHeight': 270
                    },
                    symbols = {
                        'UPSTREAM_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0]), 3),
                        'DOWNSTREAM_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 3),
                        'UPSTREAM_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'DOWNSTREAM_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                        'SELECTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),
                        'HIGHLIGHTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
                        'HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25])),
                        'TARGET_MARKER_SYMBOL': new PictureMarkerSymbol({ 'url':resourceLoader.getPathFromDir('../../img/target-marker.png', resourceLoader.getDojoModuleLocation(module)), 'height':20, 'width':14, 'yoffset': 10}),
                        'START_MARKER_SYMBOL': new PictureMarkerSymbol({ 'url':resourceLoader.getPathFromDir('../../img/start-marker.png', resourceLoader.getDojoModuleLocation(module)), 'height':20, 'width':14, 'yoffset': 10}),
                        'END_MARKER_SYMBOL': new PictureMarkerSymbol({ 'url':resourceLoader.getPathFromDir('../../img/end-marker.png', resourceLoader.getDojoModuleLocation(module)), 'height':20, 'width':14, 'yoffset': 10})
                    },
                    stateMap = {},
                    eventHandlerMap = {},
                    eventHandlers = {},
                    tablePanel,
                    queryMap,
                    graphicLayer,
                    //----
                    resources = {
                        'CSS': '../../css/up-down-stream-analysis-result-panel.css'
                    },
                    templates = {
                        'main': ""+
                            "<div class=\"up-down-stream-analysis-result-panel\">"+
                             "<div class=\"result-panel-title\">"+
                              "<div class=\"result-panel-title-text\">上下游分析结果</div>"+
                              "<div class=\"result-panel-title-btns\">"+
                               "<a class=\"result-panel-title-btn\" data-role=\"toggle\" href=\"#\" data-minimizedText=\"□\" data-normalText=\"-\">-</a>"+
                               "<a class=\"result-panel-title-btn\" data-role=\"close\" href=\"#\">×</a>"+
                              "</div>"+
                             "</div>"+
                             "<div class=\"result-panel-table-wrapper\">"+
                             "</div>"+
                            "</div>",
                         'legend': "<div id='upDownLegend'><table><th colspan='2'>图例</th>"+
                        "<tr><td><img src='/awater/nnwaterSystem/PipeNetwork/img/end-marker.png'/></td>"+
                        "<td>排放口/出水口</td></tr><tr><td><img src='/awater/nnwaterSystem/PipeNetwork/img/start-marker.png'/></td>"+
                        "<td>接驳井/雨水口</td></tr><tr><td><img src='/awater/nnwaterSystem/PipeNetwork/img/target-marker.png'/></td>"+
                        "<td>目标管线</td></tr></table></div>"  
                            
                    },
                    //----
                    loadResources,
                    //----
                    prepareTableData,
                    prepareData,
                    //----
                    closeHandler,
                    toggleHandler,
                    //----
                    registerDomEvents,
                    removeDomEvents,
                    //----
                    clearState,
                    //----
                    drawGraphicsOnMap,
                    //----
                    legend,
                    initGraphicLayer,
                    destroyGraphicLayer,
                    initLegendPanel,
                    destroyLegendPanel,
                    initDom,
                    destroyDom,
                    initTable,
                    destroyTable,
                    //----
                    initTablePanel,
                    //----
                    emit,
                    init,
                    initResult,
                    destroyResult;


                closeHandler = function(){
                    destroyResult();
                };

                toggleHandler = function(){
                    if(domClass.contains(queryMap.main, 'result-panel-minimized')){
                        domClass.remove(queryMap.main, 'result-panel-minimized');
                        html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-normalText'));
                    }else{
                        domClass.add(queryMap.main, 'result-panel-minimized');
                        html.set(queryMap.toggleBtn, domAttr.get(queryMap.toggleBtn, 'data-minimizedText'));
                    }
                };

                registerDomEvents = function(){
                    eventHandlerMap.close = on(queryMap.closeBtn, 'click', closeHandler);
                    eventHandlerMap.toggle = on(queryMap.toggleBtn, 'click', toggleHandler);
                };

                removeDomEvents = function(){
                    if(eventHandlerMap.toggle){
                        eventHandlerMap.toggle.remove();
                        delete eventHandlerMap.toggle;
                    }
                    if(eventHandlerMap.close){
                        eventHandlerMap.close.remove();
                        delete eventHandlerMap.close;
                    }
                };

                initGraphicLayer = function(){
                    destroyGraphicLayer();

                    graphicLayer = new GraphicsLayer();
                    map.addLayer(graphicLayer);
                    //TODO
                };

                destroyGraphicLayer = function(){
                    if(graphicLayer){
                        graphicLayer.clear();
                        map.removeLayer(graphicLayer);
                    }
                    graphicLayer = null;
                };
                
                initLegendPanel = function(){
                      if(!legend){
	                      legend=domConstruct.toDom(templates.legend); 
	                      domConstruct.place(legend, map.root.parentNode);
                      }
                }
                
                destroyLegendPanel = function(){
                    if(legend){
                        domConstruct.destroy(legend);   
                    }
                    legend=null;
                };
                
                initTablePanel = function(){
                    tablePanel = new TablePanel({
                        'tabsOutOfBox': false,
                        'eventHandlers': {
                            'mouseOverRow': function(event){
                                var modelId = event.modelId,
                                    feature = event.data;
                            },
                            'mouseOutRow': function(event){
                                var modelId = event.modelId,
                                    feature = event.data;
                            },
                            'clickRow': function(event){
                                var tableId = event.modelId || "",
                                    feature = event.data,
                                    modelId, model;
                                
                                modelId = tableId.split('-');

                                if(modelId.length === 2){
                                    modelId = modelId[1];
                                }else{
                                    modelId = tableId;
                                }
                                model = dataModel.models[modelId];

                                if(feature && model){
                                    mapUtils.locateGraphicOnGraphicLayer(map, feature.graphic, feature, model, graphicLayer);
                                }
                                //TODO
                            }
                        }
                    });
                };

                initDom = function(){
                    queryMap = {};

                    queryMap.parent = map.root.parentNode;
                    queryMap.main = domConstruct.toDom(templates.main);

                    queryMap.title = query('.result-panel-title', queryMap.main)[0];
                    queryMap.titleText = query('.result-panel-title-text', queryMap.title)[0];
                    queryMap.titleBtns = query('.result-panel-title-btns', queryMap.title)[0];
                    queryMap.closeBtn = query('.result-panel-title-btn[data-role=close]', queryMap.titleBtns)[0];
                    queryMap.toggleBtn = query('.result-panel-title-btn[data-role=toggle]', queryMap.titleBtns)[0];

                    queryMap.tableWrapper = query('.result-panel-table-wrapper', queryMap.main)[0];

                    domConstruct.place(queryMap.main, queryMap.parent);
                    registerDomEvents();
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

                initTable = function(){
                    if(tablePanel && stateMap.tableData){
                        var tableHeight = queryMap.main.offsetHeight - queryMap.title.offsetHeight;
                        domStyle.set(queryMap.tableWrapper, {
                            'width': '100%',
                            'height': tableHeight + 'px'
                        });
                        
                        tablePanel.setData(stateMap.tableData, {
                            'parentNode': queryMap.tableWrapper
                        });
                    }
                };

                destroyTable = function(){
                    if(stateMap){
                        delete stateMap.tableData;
                    }
                };

                init = function(){
                    options = options || {};

                    if(!options.map){
                        throw "map is needed for options!";
                    }

                    if(!options.pipeServiceUrl){
                        throw "'pipeServiceUrl is needed for options'";
                    }

                    if(!options.pipeQueryParameters){
                        throw "'pipeQueryParameters' is needed for options";
                    }

                    if(!options.pipeQueryParameters.modelLayerMap){
                        throw "'modelLayerMap' is needed for pipeQueryParameters";
                    }
                    
                    map = options.map;

                    lang.mixin(configMap, options);
                    lang.mixin(eventHandlers, configMap.eventHandlers || {});
                    lang.mixin(symbols, configMap.symbols || {});

                    loadResources();

                    initTablePanel();
                    //TODO
                };

                emit = function(eventName, eventObject){
                    if(eventName && eventHandlers[eventName] && eventHandlers[eventName].apply){
                       return eventHandlers[eventName].apply(null, [eventObject || {}]);
                    }
                    return true;
                };

                drawGraphicsOnMap = function(){
                    if(graphicLayer && stateMap.pipeInfo && stateMap.pipeNodeInfo){
                        var resultTypeMarkerMap = {
                            'upstream': symbols.START_MARKER_SYMBOL,
                            'downstream': symbols.END_MARKER_SYMBOL
                        },
                            graphic, targetPoint, feature, point1, point2, symbol, model, nodeId,
                            featureSets, featureSet, modelType, pipeSymbolMap, pipeNodeSymbolMap;

                        pipeSymbolMap = {
                            'upstream': symbols.UPSTREAM_PIPE_LINE_SYMBOL,
                            'downstream': symbols.DOWNSTREAM_PIPE_LINE_SYMBOL
                        };

                        pipeNodeSymbolMap = {
                            'upstream': symbols.UPSTREAM_PIPE_NODE_MARKER_SYMBOL,
                            'downstream': symbols.DOWNSTREAM_PIPE_NODE_MARKER_SYMBOL
                        };
                        for(var resultType in stateMap.pipeInfo){//依次添加上游,下游的图形
                            if(stateMap.pipeInfo.hasOwnProperty(resultType)){
                                //添加管线的图形
                                symbol = pipeSymbolMap[resultType];
                                featureSets = stateMap.pipeInfo[resultType];
                                for(modelType in featureSets){
                                    if(featureSets.hasOwnProperty(modelType)){
                                        featureSet = featureSets[modelType];
                                        array.forEach(featureSet, function(feature){
                                            graphic = new Graphic(feature.geometry, symbol);

                                            graphic.feature = feature;
                                            feature.graphic = graphic;

                                            graphicLayer.add(graphic);
                                        });
                                    }
                                }
                                //添加管点的图形
                                featureSets = stateMap.pipeNodeInfo.featureSets[resultType];
                                if(featureSets){
                                    for(modelType in featureSets){
                                        if(featureSets.hasOwnProperty(modelType)){
                                            model = dataModel.models[modelType];
                                            featureSet = featureSets[modelType];
                                            array.forEach(featureSet, function(feature){
                                                symbol = pipeNodeSymbolMap[resultType];
                                                graphic = new Graphic(feature.geometry, symbol);

                                                graphic.feature = feature;
                                                feature.graphic = graphic;
                                                
                                                graphicLayer.add(graphic);

                                                nodeId = feature.attributes[model.idField];
                                                
                                                if(stateMap.pipeNodeInfo.resultEdgeNodeIdMap[resultType][nodeId]){
                                                    symbol = resultTypeMarkerMap[resultType];
                                                    graphic = new Graphic(feature.geometry, symbol);
                                                    graphicLayer.add(graphic);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        
                        feature = stateMap.selectedPipe;

                        graphic = new Graphic(feature.geometry, symbols.SELECTED_PIPE_LINE_SYMBOL);
                        graphic.feature = feature;
                        feature.graphic = graphic;
                        graphicLayer.add(graphic);

                        point1 = graphic.geometry.getPoint(0, 0);
                        point2 = graphic.geometry.getPoint(0, 1);

                        targetPoint = new Point((point1.x + point2.x)/ 2, (point1.y + point2.y) / 2, map.spatialReference);
                        graphic = new Graphic(targetPoint, symbols.TARGET_MARKER_SYMBOL);
                        graphicLayer.add(graphic);

                        mapUtils.locatePointToViewPosition(targetPoint, '50%', '25%', map);
//                        mapUtils.toExtent(targetPoint, map, 1000, 0.5, 0.5);
                    }
                };

                //构造用于表格展示的数据
                prepareTableData = function(){
                    if(!stateMap.pipeInfo || !stateMap.pipeNodeInfo || !stateMap.pipeType){
                        alert("无法分析");//not expected
                        return;
                    }
                    var pipeType = stateMap.pipeType,
                        tableData = {
                            'tableIds': [],
                            'tableData': {},
                            'rowStyles': [
                                {
                                    'desc': '上游',
                                    'match': function(feature, model){
                                        if(model && !model.name.match(/Conduit|Pipe/i)){
                                            if(stateMap.pipeNodeInfo.resultEdgeNodeIdMap.upstream[feature.attributes[model.idField]]){
                                                return true;
                                            }
                                        }
                                        return false;
                                    },
                                    'style': {
                                        'background': '#00FF00'
                                    }
                                },
                                {
                                    'desc': '下游',
                                    'match': function(feature, model){
                                        if(model && !model.name.match(/Conduit|Pipe/i)){
                                            if(stateMap.pipeNodeInfo.resultEdgeNodeIdMap.downstream[feature.attributes[model.idField]]){
                                                return true;
                                            }
                                        }
                                        return false;
                                    },
                                    'style': {
                                        'background': '#FF0000',
                                        'color': '#FFFFFF'
                                    }
                                }
                            ]
                        },
                        resultTypeNames = {//结果类型的中文名称
                            'upstream': '上游',
                            'downstream': '下游'
                        },
                        tabLabelStyleMap = {//表格标签TAB的样式
                            'upstream': {
                                'background': '#00FF00'
                            },
                            'downstream': {
                                'background': '#FF0000',
                                'color': '#FFFFFF'
                            }
                        },
                        tabStyleMap = {//表格表格TAB的样式
                            'upstream': {
                                'background': '#00FF00',
                                'color': '#000000'
                            },
                            'downstream': {
                                'background': '#FF0000',
                                'color': '#FFFFFF'
                            }
                        },
                        pipeModel, pipeNodeModel, featureSet, tabName,
                        resultSets, tableId, resultType, modelType;

                    //这里开始构造用于表格展示的数据，这里表格添加的顺序会与最后表格展示时TAB的顺序相同
                    array.forEach(['upstream', 'downstream'], function(resultType){
                        if(stateMap.pipeInfo.hasOwnProperty(resultType)){
                            //每一种结果类型先添加一个标签TAB，再添加各要素类型的TAB
                            tableData.tableIds.push("label:"+resultTypeNames[resultType]);
                            tableData.tableData["label:"+resultTypeNames[resultType]] = {
                                'style': tabLabelStyleMap[resultType]
                            };
                            resultSets = stateMap.pipeInfo[resultType];
                            //添加各管线要素类型的TAB及表格数据
                            for(modelType in resultSets){
                                if(resultSets.hasOwnProperty(modelType)){
                                    pipeModel = dataModel.models[modelType];
                                    tableId = resultType+'-'+modelType;
                                    featureSet = resultSets[modelType];
                                    tabName = pipeModel.displayName;

                                    //管线要素的TAB中要展现管线的总长度
                                    if(basicUtils.isNumber(stateMap.pipeLengthInfo[resultType][modelType])){
                                        tabName += "("+(stateMap.pipeLengthInfo[resultType][modelType].toFixed(1))+"米)";
                                    }

                                    tableData.tableIds.push(tableId);
                                    tableData.tableData[tableId] = {
                                        'model': pipeModel,
                                        'data': featureSet,
                                        'name': tabName,
                                        'tabStyle': tabStyleMap[resultType],
                                        'hideCount': true //默认表格TAB中会显示记录数，这里我们隐藏掉记录数的显示，因为要展示长度
                                    };
                                }
                            }
                            //添加各管点要素类型的TAB及表格数据
                            resultSets = stateMap.pipeNodeInfo.featureSets[resultType];
                            if(resultSets){
                                for(modelType in resultSets){
                                    if(resultSets.hasOwnProperty(modelType)){
                                        featureSet = resultSets[modelType];
                                        if(featureSet.length){
                                            pipeNodeModel = dataModel.models[modelType];
                                            tableId = resultType+'-'+modelType;
                                            tableData.tableIds.push(tableId);
                                            tableData.tableData[tableId] = {
                                                'model': pipeNodeModel,
                                                'name': pipeNodeModel.displayName,
                                                'data': featureSet,
                                                'resultType': tabStyleMap[resultType],
                                                'tabStyle': tabStyleMap[resultType]
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    });

                    stateMap.tableData = tableData;
                    //TODO
                };

                //进行管线，管点查询，并构造合适的数据结构存储查询结果
                //使用管线查询结果构造合适的数据结构，数据结构为二层结构：结果类型（result type：上游|下游） -> 要素类型/数据模型（管线，沟渠，各种管线类型等） -> 要素数组
                prepareData = function(callback){
                    if(stateMap.selectedPipe && basicUtils.isNumber(stateMap.type) && basicUtils.length){
                        alert("参数缺失");
                        return;
                    }
                    var pipeType = pipeUtils.getPipeType(stateMap.selectedPipe),
                        params;
                    stateMap.pipeType = pipeType;

                    if(!pipeType){// unexpected
                        alert('数据出错');
                        return;
                    }

                    params = {
                        'pipeType': stateMap.pipeType,
                        'target': stateMap.selectedPipe.attributes.OBJECTID,
                        'type': stateMap.type
                    };
                    if(stateMap.specifyLength){
                        params.length = stateMap.length;
                    }
                    //调用服务器分析服务进行分析
                    request(configMap.analysisUrl, {
                        'handleAs': 'json',
                        'query': params
                    }).then(function(response){
                        if(!response){
                            emit('analysisFail');
                            console.error('response = null');
                            alert("分析失败！");
                            return;
                        }
                        if(response.error){
                            emit('analysisFail');
                            console.error('error: '+response.error);
                            alert("分析失败，原因："+response.error);
                            return;
                        }
                        if(!response.downstream && !response.upstream){
                            emit('analysisFail');
                            console.error('no downstream or upstream data');
                            alert("分析失败！");
                            return;
                        }
                        var pipeQueries = {},
                            pipeQueryTasks = {},
                            layers, layerModelMap, length;
                        

                        layerModelMap = configMap.pipeQueryParameters.modelLayerMap;

                        //构造各查询任务（QueryTask，用于查询管线）
                        array.forEach(['downstream', 'upstream'], function(resultType){
                            //遍历第一层：结果类型
                            var dataSet = response[resultType],
                                layers;

                            if(!dataSet){
                                return;
                            }

                            //遍历第二层：要素类型
                            for(var modelType in dataSet){
                                if(dataSet.hasOwnProperty(modelType)){
                                    layers = layerModelMap[modelType];
                                    if(!layers){
                                        emit('analysisFail');
                                        alert("分析失败");
                                        return;
                                    }

                                    array.forEach(layers, function(layerId){
                                        var query, queryTask;
                                        queryTask = new QueryTask(configMap.pipeServiceUrl + '/' + layerId);
                                        query = new Query();

                                        query.returnGeometry = true;
                                        query.outFields = ['*'];
                                        query.objectIds = response[resultType][modelType];
                                        query.outSpatialReference = map.spatialreference;
                                        //为了使用 dojo/promise/all API 进行多个异步查询的整合，构造一个由 结果类型+要素类型+图层ID组成的key来存储该图层的查询任务
                                        pipeQueries[resultType+'-'+modelType+'-'+layerId] = queryTask.execute(query);
                                    });
                                }
                            }
                        });

                        //将上面构造的多个管线查询任务统一查询，并得到整合好的结果
                        all(pipeQueries).then(function(featureSets){
                            var resultSets = {},
                                pipeNodeIds = {}, pipeNodeIdMap = {},
                                pipeNodeQueries = {}, allNodeIds = [],
                                tmpMap = { 'count': 0, 'empty': 0 },
                                featureSet, nameParts, resultType, modelType, layerId,
                                cond, modelCount;
                            
                            //对整合过的结果进行解析，并构造存储结果的数据结构
                            for(var combinedName in featureSets){
                                if(featureSets.hasOwnProperty(combinedName)){
                                    nameParts = combinedName.split('-');
                                    featureSet = featureSets[combinedName];
                                    if(featureSet && featureSet.features.length && nameParts && nameParts.length === 3){
                                        resultType = nameParts[0];
                                        modelType = nameParts[1];
                                        layerId = nameParts[2];
                                        if(!resultSets[resultType]){
                                            resultSets[resultType] = {};
                                        }
                                        if(!resultSets[resultType][modelType]){
                                            resultSets[resultType][modelType] = [];
                                        }
                                        if(!pipeNodeIdMap[resultType]){
                                            pipeNodeIdMap[resultType] = [];
                                        }
                                        //遍历管线查询结果的过程中，顺便将管点ID的信息收集起来，用于后面进行管点的查询
                                        tmpMap.count += 1;
                                        array.forEach(featureSet.features, function(feature){
                                            var inJuncID = pipeUtils.getInJuncID(feature),
                                                outJuncID = pipeUtils.getOutJuncID(feature);;
                                            
                                            //我们把目标管线过滤掉，不加入结果集
                                            if(pipeUtils.getPipeType(stateMap.selectedPipe) == modelType && pipeUtils.getOBJECTID(feature) == pipeUtils.getOBJECTID(stateMap.selectedPipe)){
                                                return;
                                            }

                                            resultSets[resultType][modelType].push(feature);
                                            
                                            //把每根管线的起点终点的ID存起来
                                            !inJuncID || (pipeNodeIdMap[resultType].push(inJuncID));
                                            !outJuncID || (pipeNodeIdMap[resultType].push(outJuncID));
                                        });
                                        
                                        //如果该结果类型的该要素类型的结果集为空，则不保存该要素类型
                                        if(!resultSets[resultType][modelType].length){
                                            delete resultSets[resultType][modelType];
                                            tmpMap.empty += 1;
                                        }
                                    }
                                }
                            }

                            //如果查询结果一根管线都没有，就发出一个"emptyResult"事件，告诉外部，结果为空
                            if(tmpMap.empty >= tmpMap.count){
                                emit('emptyResult');
                                return;
                            }

                            //存储管线信息
                            stateMap.pipeInfo = resultSets;

                            //这里我们把没有任何要素结果的结果类型也删除，主要是为了后面表格展示的时候不出现该结果类型的TAB
                            for(resultType in stateMap.pipeInfo){
                                if(stateMap.pipeInfo.hasOwnProperty(resultType)){
                                    modelCount = 0;
                                    for(modelType in stateMap.pipeInfo[resultType]){
                                        if(stateMap.pipeInfo[resultType].hasOwnProperty(modelType)){
                                            modelCount ++;
                                        }
                                    }
                                    if(!modelCount){
                                        delete stateMap.pipeInfo[resultType];
                                    }
                                }
                            }

                            stateMap.pipeLengthInfo = {};
                            //计算上下游管线的长度，主要用于表格展示
                            for(resultType in stateMap.pipeInfo){
                                if(stateMap.pipeInfo.hasOwnProperty(resultType)){
                                    if(!stateMap.pipeLengthInfo[resultType]){
                                        stateMap.pipeLengthInfo[resultType] = {};
                                    }
                                    for(modelType in stateMap.pipeInfo[resultType]){
                                        if(stateMap.pipeInfo[resultType].hasOwnProperty(modelType)){
                                            length = 0;
                                            array.forEach(stateMap.pipeInfo[resultType][modelType], function(feature){
                                                length += pipeUtils.getLength(feature);
                                            });
                                            stateMap.pipeLengthInfo[resultType][modelType] = length;
                                        }
                                    }
                                }
                            }

                            //开始查询管点信息
                            stateMap.pipeNodeInfo = {};
                            (function(){
                                var idArray, allIdMap, idMap, i, id;

                                stateMap.pipeNodeInfo.nodeIdMap = {};
                                
                                allIdMap = {};

                                //管线数据结构构造过程中存储的管点ID数组中有重复的元素，我们在这里去重
                                for(resultType in pipeNodeIdMap){
                                    if(pipeNodeIdMap.hasOwnProperty(resultType)){
                                        idMap = {};
                                        idArray = pipeNodeIdMap[resultType];
                                        for(i=0;i<idArray.length;i++){
                                            id = idArray[i];
                                            if(!allIdMap[id]){
                                                allIdMap[id] = idMap[id] = true;
                                                allNodeIds.push(id);
                                            }
                                        }
                                        //并把结果存储起来，方便后面判断查询结果中的点是上游还是下游
                                        stateMap.pipeNodeInfo.nodeIdMap[resultType] = idMap;
                                    }
                                }
                            })();

                            //构造ArcGIS服务查询where条件
                            cond = " in ("+array.map(allNodeIds, function(nodeId){
                                return "'"+nodeId+"'";
                            }).join(",")+")";

                            //构造管点查询任务
                            array.forEach(configMap.pipeNodeQueryParameters.layers, function(layer){
                                var pipeNodeQuery, pipeNodeQueryTask;
                                pipeNodeQueryTask = new QueryTask(configMap.pipeNodeServiceUrl + '/' + layer.id);
                                pipeNodeQuery = new Query();

                                pipeNodeQuery.returnGeometry = true;
                                pipeNodeQuery.outFields = ['*'];
                                pipeNodeQuery.where = layer.idField + cond;
                                pipeNodeQuery.outSpatialReference = map.spatialReference;
                                
                                pipeNodeQueries[layer.name] = pipeNodeQueryTask.execute(pipeNodeQuery);
                            });
                            
                            //管点统一查询
                            all(pipeNodeQueries).then(function(pipeNodeFeatureSets){
                                var result = {},
                                    nodeIdMap, model;

                                stateMap.pipeNodeInfo.featureSets = pipeNodeFeatureSets;
                                
                                //对管点数据进行构造，结构同管线
                                for(var resultType in stateMap.pipeNodeInfo.nodeIdMap){
                                    if(stateMap.pipeNodeInfo.nodeIdMap.hasOwnProperty(resultType)){
                                        nodeIdMap = stateMap.pipeNodeInfo.nodeIdMap[resultType];

                                        if(!result[resultType]){
                                            result[resultType] = {};
                                        }
                                        
                                        for(modelType in pipeNodeFeatureSets){
                                            if(pipeNodeFeatureSets.hasOwnProperty(modelType)){
                                                model = dataModel.models[modelType];
                                                if(!result[resultType][modelType]){
                                                    result[resultType][modelType] = [];
                                                }
                                                array.forEach(pipeNodeFeatureSets[modelType].features, function(feature){
                                                    if(nodeIdMap[feature.attributes[model.idField]]){
                                                        result[resultType][modelType].push(feature);
                                                    }
                                                });
                                                //我们把没有任何要素的要素类型删除
                                                if(!result[resultType][modelType].length){
                                                    delete result[resultType][modelType];
                                                }
                                            }
                                        }
                                    }
                                }

                                //存储管点信息
                                stateMap.pipeNodeInfo.featureSets = result;

                                stateMap.pipeNodeInfo.resultEdgeNodeIdMap = {};
                                stateMap.pipeNodeInfo.resultEdgeNodeIdMap.upstream = {};
                                //找上游的远端的点
                                var isEdgePoint, nodeId, feature, i;
                                for(nodeId in stateMap.pipeNodeInfo.nodeIdMap.upstream){
                                    if(stateMap.pipeNodeInfo.nodeIdMap.upstream.hasOwnProperty(nodeId)){
                                        isEdgePoint = true;
                                        for(modelType in stateMap.pipeInfo.upstream){
                                            if(stateMap.pipeInfo.upstream.hasOwnProperty(modelType)){
                                                featureSet = stateMap.pipeInfo.upstream[modelType];
                                                for(i=0;i<featureSet.length;i++){
                                                    feature = featureSet[i];
                                                    if(pipeUtils.getOutJuncID(feature) == nodeId){
                                                        isEdgePoint = false;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if(isEdgePoint){
                                            stateMap.pipeNodeInfo.resultEdgeNodeIdMap.upstream[nodeId] = true;
                                        }
                                    }
                                }

                                //找下游远端的点
                                stateMap.pipeNodeInfo.resultEdgeNodeIdMap.downstream = {};
                                for(nodeId in stateMap.pipeNodeInfo.nodeIdMap.downstream){
                                    if(stateMap.pipeNodeInfo.nodeIdMap.downstream.hasOwnProperty(nodeId)){
                                        isEdgePoint = true;
                                        for(modelType in stateMap.pipeInfo.downstream){
                                            if(stateMap.pipeInfo.downstream.hasOwnProperty(modelType)){
                                                featureSet = stateMap.pipeInfo.downstream[modelType];
                                                for(i=0;i<featureSet.length;i++){
                                                    feature = featureSet[i];
                                                    if(pipeUtils.getInJuncID(feature) == nodeId){
                                                        isEdgePoint = false;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if(isEdgePoint){
                                            stateMap.pipeNodeInfo.resultEdgeNodeIdMap.downstream[nodeId] = true;
                                        }
                                    }
                                }

                                //准备用于表格展示的数据
                                prepareTableData();

                                //数据准备完毕，调用回调函数
                                if(callback && callback.apply){
                                    callback.apply(null, []);
                                }
                            });

                        });

                        return;
                    });
                };

                initResult = function(data){
                    if(queryMap){
                        destroyResult();
                    }
                    var resultDeferred;
                    lang.mixin(stateMap, data);
                    emit('beforeInitResult');
                    prepareData(function(){
                        initGraphicLayer();
                        drawGraphicsOnMap();
                        initLegendPanel();
                        initDom();
                        initTable();
                        //TODO
                        emit('afterInitResult');
                    });
                };

                destroyResult = function(){
                    emit('beforeDestroyResult');
                    if(tablePanel){
                        tablePanel.destroy();
                    }
                    destroyDom();
                    destroyGraphicLayer();
                    destroyLegendPanel();
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
                console.warn("module 'up-down-stream-analysis' has already been inititiated!");
                return; 
            }

            options = options || {};

            if(!options.map){
                throw "map is needed for options";
            }

            map = options.map;

            lang.mixin(configMap, options);
            lang.mixin(eventHandlers, configMap.eventHandlers || {});

            initControlPanel({
                'map': map,
                'eventHandlers': {
                    'clickCloseBtn': function(){
                        cancel();
                    },
                    'afterClear': function(){
                        if(picker && resultPanel){
                            resultPanel.destroyResult();
                            picker.resume();
                        }
                        emit('startMapOccupation');
                    },
                    'submit': function(data){
                        if(resultPanel && controlPanel){
                            try{
                                resultPanel.initResult(data);
                            }catch(e){
                                controlPanel.stopLoading();
                                throw e;
                            }
                        }
                    },
                    'clickTargetDataItem': function(){
                        if(picker){
                            picker.locateTarget();
                        }
                    }
                    //TODO
                }
            });

            initResultPanel({
                'map': map,
                'pipeServiceUrl': options.pipeServiceUrl,
                'pipeNodeServiceUrl': options.pipeNodeServiceUrl,
                'analysisUrl': options.analysisUrl,
                'pipeQueryParameters': options.pipeQueryParameters,
                'pipeNodeQueryParameters': options.pipeNodeQueryParameters,
                'symbols': configMap.symbols,
                'eventHandlers': {
                    'beforeInitResult': function(){
                        if(controlPanel){
                            controlPanel.startLoading();
                        }
                    },
                    'afterInitResult': function(templates){
                        if(controlPanel){
                            controlPanel.stopLoading();
                        }
                    },
                    'emptyResult': function(){
                        alert("未查询到任何符合条件的管线！");
                        if(controlPanel){
                            controlPanel.stopLoading();
                        }
                    },
                    'analysisFail': function(event){
                        event = event || {};
                        alert(event.errorMsg || '分析失败');
                        if(controlPanel){
                            controlPanel.stopLoading();
                        }
                    }
                    //TODO
                }
            });

            initPicker({
                'map': map,
                'pipeServiceUrl': options.pipeServiceUrl,
                'pipeNodeServiceUrl': options.pipeNodeServiceUrl,
                'pipeIdentifyParameters': options.pipeIdentifyParameters,
                'pipeNodeQueryParameters': options.pipeNodeQueryParameters,
                'symbols': configMap.symbols,
                'eventHandlers': {
                    'beforeStart': function(){
                        if(controlPanel){
                            emit('startMapOccupation');
                            return true;
                        }
                        return false;
                    },
                    'afterStop': function(){
                        if(controlPanel){
                            emit('releaseMapOccupation');
                            return true;
                        }
                        return false;
                    },
                    'pick': function(data){
                        if(controlPanel){
                            picker.pause();
                            controlPanel.addPipe(data.selectedPipe);
                            emit('releaseMapOccupation');
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
                throw "module 'up-and-down-stream-analysis' has not been initiated yet!";
            }
            if(!stateMap.isInUse){
                emit('beforeUse');
                if(controlPanel && picker && resultPanel){
                    controlPanel.open();
                    picker.start();
                    //TODO
                    stateMap.isInUse = true;
                }
                emit('afterUse');
            }
        };

        cancel = function(){
            if(!initDone){
                throw "module 'up-and-down-stream-analysis' has not been initiated yet!";
            }
            if(stateMap){
                emit('beforeCancel');
                if(controlPanel && picker && resultPanel){
                    resultPanel.destroyResult();
                    controlPanel.close();
                    picker.stop();
                }
                stateMap.isInUse = false;
                //TODO
                emit('afterCancel');
            }
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
});
