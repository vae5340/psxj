define([
    'module',
    'dojo/json',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/query',
    'dojo/on',
    'dojo/html',
    'dojo/request',
    'dojo/promise/all',
    'dojox/gfx',
    'esri/graphic',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/layers/GraphicsLayer',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/Color',
    'drainage-model/lib/resource-loader',
    'drainage-model/lib/time-slider',
    'drainage-model/lib/geometry-utils',
    'drainage-model/lib/basic-utils',
    'drainage-model/swmm/swmm-pipe-model-utils',
    'drainage-model/swmm/swmm-pipe-node-model-utils',
    'system-jslib/way-simple-time-utils'    
], function(
    module,
    JSON,
    lang,
    array,
    domConstruct,
    domStyle,
    domAttr,
    domClass,
    query,
    on,
    html,
    request,
    all,
    gfx,
    Graphic,
    Query,
    QueryTask,
    IdentifyTask,
    IdentifyParameters,
    GraphicsLayer,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Color,
    resourceLoader,
    TimeSlider,
    geometryUtils,
    basicUtils,
    PipeUtils,
    PipeNodeUtils,
    timeUtils
){
    'use strict';
    var map,
        exports,
        resources = {
            'CSS': '../../css/swmm-pm-analysis.css'
        },
        symbols = {
            'SELECTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
            'SELECTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25])),            
            'HIGHLIGHTED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25])),
            'HIGHLIGHTED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2)
        },
        configMap = {
            'jsPanelHeaderTitle': '管剖面分析',
            'jsPanelId': 'swmm-pm-analysis-jspanel',
            'jsPanelSizeWithoutResult': {
                'width': 220,
                'height': 400
            },
            'jsPanelSizeWithResult': {
                'width': 1000,
                'height': 400
            },
            'jsPanelPosition': {
                'my': 'left-bottom',
                'at': 'left-bottom',
                'offsetX': '10px'
            },
            'chartOptions': {
                'leftRulerName': '标高(m)',
                'topRulerName': '',
                'bottomRulerName': '距离(m)',
                'padding_left': 10,
                'padding_right': 25,
                'padding_top': 50,
                'padding_bottom': 10,
                'font_size': 8,
                'font_padding_top': 2,
                'font_padding_bottom': 2,
                'text_line_height': 12, // 14 + 2 + 2
                'ruler_short_marker_length': 4,
                'ruler_long_marker_length': 7,
                'text_padding_left': 5,
                'text_padding_right': 5,
                'left_ruler_max_col_count': 5,
                'grid_padding_left_meter': 2,//unit: meter
                'grid_padding_right_meter': 2, //unit: meter
                'grid_padding_top_meter': 1, //unit: meter
                'grid_padding_bottom_meter': 0.5, //unit: meter
                'default_node_size_meter': 1, //unit: meter
                'bottom_ruler_marker_interval_meter': 20,//unit: meter
                //----
                'grid_border_color': '#000000',
                'grid_bg_color': '#FFFFFF',
                'left_ruler_line_color': '#000000',
                'left_ruler_marker_line_color': '#000000',
                'left_ruler_marker_ref_line_color': '#EEEEEE',
                'left_ruler_marker_text_color': '#000000',
                'left_ruler_name_text_color': '#000000',
                'bottom_ruler_line_color': '#000000',
                'bottom_ruler_marker_line_color': '#000000',
                'bottom_ruler_marker_text_color': '#000000',
                'bottom_ruler_marker_ref_line_color': '#EEEEEE',
                'bottom_ruler_name_text_color': '#000000',
                'pipe_node_border_color': '#000000',
                'top_ruler_marker_line_color': '#000000',
                'top_ruler_marker_text_color': '#000000',
                'pipe_border_color': '#000000',
                'surface_line_color': '#000000',
                'default_water_color': '#00FFFF',
                'default_water_line_color': '#0000FF'
            }
        },
        eventHandlers = {},
        eventHandlerMap = {},
        templates = {
            'main': ""+
                "<div class=\"swmm-pm-analysis\">"+
                 "<div class=\"control-panel\">"+
                  "<div class=\"control-btns\">"+
                   "<button data-role=\"clear\">清空</button>"+
                   "<button data-role=\"analyse\">分析</button>"+
                  "</div>"+
                  "<div class=\"pipe-info\">"+
                   "<div class=\"pipe-info-title\">"+
                    "已选管线(<span class=\"pipe-info-list-count\">0</span>)"+
                   "</div>"+
                   "<ul class=\"pipe-info-list\"></ul>"+
                  "</div>"+
                 "</div>"+
                 "<div class=\"result-panel\">"+
                  "<div class=\"result-panel-control-panel\">"+
                   "<div class=\"result-panel-time-slider-wrapper\">"+
                    "<div class=\"result-panel-time-slider-control-panel\">"+
                     "<div class=\"result-panel-time-slider-label\"></div>"+
                     "<label class=\"result-panel-input-wrapper\">"+
                      "播放间隔(毫秒):&nbsp;"+
                      "<input name=\"play-interval\" size=\"5\"/>"+
                     "</label>"+
                     "<div class=\"result-panel-control-btns\">"+
                      "<button data-role=\"play\">播放</button>&nbsp;"+
                      "<button data-role=\"stop\">停止</button>&nbsp;"+
                      "<button data-role=\"reset\">复位</button>"+
                     "</div>"+
                    "</div>"+
                    "<div class=\"result-panel-time-slider\"></div>"+
                   "</div>"+
                  "</div>"+
                  "<div class=\"result-panel-chart-wrapper\">"+
                  "</div>"+
                 "</div>"+
                "</div>",
            'pipeInfoListItem': ""+
                "<li></li>"
        },
        queryMap,
        gfxMap,
        stateMap,
        pipeNodeUtils,
        pipeUtils,
        //----
        clearPickerHandler,
        analyseHandler,
        jsPanelCloseHandler,
        jsPanelResizeHandler,
        clickPlayBtnHandler,
        clickStopBtnHandler,
        clickResetBtnHandler,
        mapResizeHandler,
        changePlayIntervalHandler,
        //----
        drawChart,
        addGraphicOnMap,
        pick,
        addPick,
        clearPicker,
        updatePipeInfo,
        //----
        initGraphicLayer,
        destroyGraphicLayer,
        initPicker,
        destroyPicker,
        startPick,
        stopPick,
        updateTimelineLabel,
        loadResources,
        destroyDom,
        initDom,
        showResultPanel,
        hideResultPanel,
        //----
        emit,
        init,
        use,
        cancel;

    clearPickerHandler = function(){
        clearPicker();
        delete stateMap.pickResult;
    };
    
    analyseHandler = function(){
        if(!stateMap || !stateMap.picker || !stateMap.picker.result || !stateMap.picker.result.selectedPipes){
            return;
        }
        if(!stateMap.picker.result.selectedPipes.length){
            alert("未选中任何管线，请先选择若干条相连的管线！");
            return;
        }
        showResultPanel(function(){
            startAnalysis();
        });
    };

    changePlayIntervalHandler = function(event){
        var value = domAttr.get(queryMap.playIntervalInput, 'value'),
            prevValue = domAttr.get(queryMap.playIntervalInput, 'data-prevValue');
        if(!value.match(/^\d*$/)){
            domAttr.set(queryMap.playIntervalInput, 'value', prevValue);
            return false;
        }
        queryMap.timeSlider.setPlayInterval(parseInt(value || prevValue));
        console.log(queryMap.timeSlider.getPlayInterval());
        return true;
    };

    clickPlayBtnHandler = function(){
        if(queryMap && queryMap.timeSlider){
            if(!stateMap.nodeWaterInfo || !stateMap.nodeWaterInfo.idMap){
                alert("数据未准备好，请稍等！");
                return;
            }
            queryMap.timeSlider.play();
        }
    };

    clickStopBtnHandler = function(){
        if(queryMap && queryMap.timeSlider){
            queryMap.timeSlider.stop();
        }
    };

    clickResetBtnHandler = function(){
        if(queryMap && queryMap.timeSlider){
            queryMap.timeSlider.toStop(0);
        }
    };

    jsPanelCloseHandler = function(event, id){
        if(id == configMap.jsPanelId && (stateMap && !stateMap.doNotTriggerCloseEvent)){
            stateMap.doNotTriggerCloseEvent = false;
            cancel(true);
            $(document).unbind('jspanelbeforeclose', jsPanelCloseHandler);
        }
    };

    jsPanelResizeHandler = function(){
        if(queryMap && queryMap.pipeInfoList){
            domStyle.set(queryMap.pipeInfoList, 'height', (queryMap.controlPanel.offsetHeight - queryMap.controlPanelBtns.offsetHeight - queryMap.pipeInfoTitle.offsetHeight)+'px');
        }
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.reposition(configMap.jsPanelPosition);
        }
        if(queryMap && queryMap.resultPanel && queryMap.chartWrapper){
            domStyle.set(queryMap.resultPanel, 'width', (queryMap.main.offsetWidth - queryMap.controlPanel.offsetWidth) + 'px');
            domStyle.set(queryMap.chartWrapper, 'width', (queryMap.main.offsetWidth - queryMap.controlPanel.offsetWidth) + 'px');
        }
        destroyChart();
        drawChart();
        if(stateMap.nodeWaterInfo){
            queryMap.timeSlider.toStop(0);
        }
    };

    mapResizeHandler = function(){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.reposition(configMap.jsPanelPosition);
        }
    };

    destroyDom = function(fromEvent){
        if(eventHandlerMap.clearPipeInfo){
            eventHandlerMap.clearPipeInfo.remove();
            delete eventHandlerMap.clearPipeInfo;
        }
        if(eventHandlerMap.analyse){
            eventHandlerMap.analyse.remove();
            delete eventHandlerMap.analyse;
        }
        if(eventHandlerMap.resizeMap){
            eventHandlerMap.resizeMap.remove();
            delete eventHandlerMap.resizeMap;
        }
        if(eventHandlerMap.changePlayInterval){
            eventHandlerMap.changePlayInterval.remove();
            delete eventHandlerMap.changePlayInterval;
        }
        if(eventHandlerMap.clickStopBtn){
            eventHandlerMap.clickStopBtn.remove();
            delete eventHandlerMap.clickStopBtn;
        }
        if(eventHandlerMap.clickResetBtn){
            eventHandlerMap.clickResetBtn.remove();
            delete eventHandlerMap.clickResetBtn;
        }
        if(eventHandlerMap.clickPlayBtn){
            eventHandlerMap.clickPlayBtn.remove();
            delete eventHandlerMap.clickPlayBtn;
        }
        if(queryMap && queryMap.timeSlider){
            queryMap.timeSlider.destroy();
        }
        if(queryMap && queryMap.jsPanel){
            $(queryMap.jsPanel).unbind('resize', jsPanelResizeHandler);
        }
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        if(!fromEvent && queryMap && queryMap.jsPanel){
            if(stateMap){
                stateMap.doNotTriggerCloseEvent = true;
            }
            queryMap.jsPanel.close(false, true, true);
        }

        queryMap = null;
    };

    showResultPanel = function(callback){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.resize(configMap.jsPanelSizeWithResult.width, configMap.jsPanelSizeWithResult.height, function(){
                queryMap.jsPanel.contentResize();
                
                domStyle.set(queryMap.resultPanel, 'width', (queryMap.main.offsetWidth - queryMap.controlPanel.offsetWidth) + 'px');
                !queryMap.resultPanel || domClass.remove(queryMap.resultPanel, 'result-panel-hidden');
                if(callback && callback.apply){
                    callback.apply(null, []);
                }
            });
        }
    };

    hideResultPanel = function(callback){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.resize(configMap.jsPanelSizeWithoutResult.width, configMap.jsPanelSizeWithoutResult.height, function(){
                queryMap.jsPanel.contentResize();
                !queryMap.resultPanel || domClass.add(queryMap.resultPanel, 'result-panel-hidden');
                queryMap.jsPanel.normalize();
                if(callback && callback.apply){
                    callback.apply(null, []);
                }
            });
        }
    };

    pick = function(event){
        var point,
            task, params,
            queryTask, queryParams;
        if(!event || !event.mapPoint || !stateMap || !stateMap.picker){
            return;
        }

		var tmpEvent = map.infoWindow.on('show', function(){
			tmpEvent.remove();
			map.infoWindow.hide();
		});

        point = event.mapPoint;
        task = stateMap.picker.identifyTask;
        params = stateMap.picker.identifyParameters;
        params.mapExtent = map.extent;
        params.geometry = point;
        task.execute(params).then(function(identifyResult){
            var obj;
            if(!identifyResult || !identifyResult.length){
                return;
            }
            obj = identifyResult[0];
            queryTask = new QueryTask(configMap.serviceApis.pipeServiceUrl + '/' + obj.layerId);
            queryParams = new Query();
            queryParams.returnGeometry = true;
            queryParams.outFields = ['*'];
            queryParams.objectIds = [pipeUtils.getOBJECTID(obj.feature)];
            queryTask.execute(queryParams).then(function(featureSet){
                if(!featureSet || !featureSet.features || !featureSet.features.length){
                    return;
                }
                addPick(featureSet.features[0]);
            });
        });
    };

    addGraphicOnMap = function(feature){
        if(!feature || !feature.geometry || !stateMap || !stateMap.graphicLayer){
            return;
        }
        var geometry = feature.geometry,
            graphic;

        if(geometry.type == 'polyline'){
            graphic = new Graphic(geometry, symbols.SELECTED_PIPE_LINE_SYMBOL);
        }else if(geometry.type == 'point'){
            graphic = new Graphic(geometry, symbols.SELECTED_PIPE_NODE_MARKER_SYMBOL);
        }
        if(graphic){
            stateMap.graphicLayer.add(graphic);
        }
    };

    addPick = function(feature){
        var pickResult, inMatch, outMatch, inPoint, outPoint;
        if(feature && stateMap && stateMap.picker && stateMap.picker.result){
            inPoint = pipeUtils.getInJuncID(feature);
            outPoint = pipeUtils.getOutJuncID(feature);

            pickResult = stateMap.picker.result;
            inMatch = true;
            outMatch = true;

            if(inPoint != pickResult.inPoint && pickResult.inPoint){
                inMatch = false;
            }else{
                pickResult.inPoint = outPoint;
                pickResult.outPipe = feature;
            }
            if(outPoint != pickResult.outPoint && pickResult.outPoint){
                outMatch = false;
            }else{
                pickResult.outPoint = inPoint;
                pickResult.inPipe = feature;
            }
            if(inMatch || outMatch){
                pickResult.selectedPipes.push(feature);
                addGraphicOnMap(feature);
                updatePipeInfo();
            }
        }
    };

    clearPicker = function(){
        destroyChart();
        if(stateMap && stateMap.graphicLayer){
            stateMap.graphicLayer.clear();
        }
        if(stateMap && stateMap.picker){
            stateMap.picker.result = {
                'inPipe': null,
                'outPipe': null,
                'inPoint': null,
                'outPoint': null,
                'selectedPipes': []
            };
        }
        updatePipeInfo();
        hideResultPanel();
    };

    updatePipeInfo = function(){
        var count = 0,
            listItem;
        if(stateMap && stateMap.picker && stateMap.picker.result && stateMap.picker.result.selectedPipes){
            count = stateMap.picker.result.selectedPipes.length;
        }
        domConstruct.empty(queryMap.pipeInfoList);
        if(count){
            array.forEach(stateMap.picker.result.selectedPipes, function(feature){
                listItem = domConstruct.toDom(templates.pipeInfoListItem);
                listItem.feature = feature;
                html.set(listItem, pipeUtils.getId(feature) || '');
                domConstruct.place(listItem, queryMap.pipeInfoList);
            });
        }

        html.set(queryMap.pipeInfoListCount, count + '' || '0');
    };

    stopPick = function(){
        if(eventHandlerMap.pick){
            eventHandlerMap.pick.remove();
            delete eventHandlerMap.pick;
        }
    };

    startPick = function(){
        stopPick();
        if(stateMap.picker){
            eventHandlerMap.pick = map.on('click', pick);
        }
    };

    initGraphicLayer = function(){
        if(stateMap.graphicLayer){
            destroyGraphicLayer();
        }
        stateMap.graphicLayer = new GraphicsLayer();
        map.addLayer(stateMap.graphicLayer);
    };

    destroyGraphicLayer = function(){
        if(stateMap.graphicLayer){
            map.removeLayer(stateMap.graphicLayer);
            delete stateMap.graphicLayer;
        }
    };

    destroyPicker = function(){
        stopPick();
        destroyGraphicLayer();
        if(stateMap && stateMap.picker){
        }
        stateMap.picker = null;
    };

    initPicker = function(){
        if(stateMap && stateMap.picker){
            destroyPicker();
        }
        stateMap.picker = {};
        stateMap.picker.identifyTask = new IdentifyTask(configMap.serviceApis.pipeServiceUrl);
        stateMap.picker.identifyParameters = new IdentifyParameters();
        stateMap.picker.identifyParameters.returnGeometry = true;
        stateMap.picker.identifyParameters.layerIds = configMap.layerIdMap.pipe;
        stateMap.picker.identifyParameters.tolerance = 1;
        stateMap.picker.result = {
            'inPoint': null,
            'outPoint': null,
            'outPipe': null,
            'inPipe': null,
            'selectedPipes': []
        };

        initGraphicLayer();
    };

    initDom = function(){
        if(queryMap && queryMap.main){
            destroyDom();
        }
        queryMap = {};
        queryMap.jsPanel = $.jsPanel({
            'id': configMap.jsPanelId,
            'container': map.root.parentNode,
            'content': templates.main,
            'headerTitle': configMap.jsPanelHeaderTitle,
            'contentSize': configMap.jsPanelContentSize,
            'position': configMap.jsPanelPosition,
            'onmaximized': jsPanelResizeHandler,
            'onnormalized': jsPanelResizeHandler,
            'onresized': jsPanelResizeHandler
        });
        
        queryMap.main = query('.swmm-pm-analysis', queryMap.jsPanel[0])[0];
        queryMap.controlPanel = query('.control-panel', queryMap.main)[0];
        queryMap.resultPanel = query('.result-panel', queryMap.main)[0];
        queryMap.resultPanelControlPanel = query('.result-panel-control-panel', queryMap.resultPanel)[0];
        queryMap.resultPanelControlBtns = query('.result-panel-control-btns', queryMap.resultPanelControlPanel)[0];
        queryMap.timeSliderPlayBtn = query('button[data-role=play]', queryMap.resultPanelControlBtns)[0];
        queryMap.timeSliderStopBtn = query('button[data-role=stop]', queryMap.resultPanelControlBtns)[0];
        queryMap.timeSliderResetBtn = query('button[data-role=reset]', queryMap.resultPanelControlBtns)[0];

        queryMap.resultPanelTimeSlider = query('.result-panel-time-slider', queryMap.resultPanel)[0];
        queryMap.timeSliderControlPanel = query('.result-panel-time-slider-control-panel', queryMap.resultPanelControlPanel)[0];

        queryMap.playIntervalInput = query('input[name=play-interval]', queryMap.timeSliderControlPanel)[0];
        queryMap.timeSliderLabel = query('.result-panel-time-slider-label', queryMap.timeSliderControlPanel)[0];
        queryMap.chartWrapper = query('.result-panel-chart-wrapper', queryMap.resultPanel)[0];

        queryMap.controlPanelBtns = query('.control-btns', queryMap.controlPanel)[0];
        queryMap.clearPipeInfoBtn = query('button[data-role=clear]', queryMap.controlPanelBtns)[0];
        queryMap.analyseBtn = query('button[data-role=analyse]', queryMap.controlPanelBtns)[0];

        queryMap.pipeInfo = query('.pipe-info', queryMap.controlPanel)[0];
        queryMap.pipeInfoTitle = query('.pipe-info-title', queryMap.pipeInfo)[0];
        queryMap.pipeInfoListCount = query('.pipe-info-list-count', queryMap.pipeInfoTitle)[0];
        queryMap.pipeInfoList = query('.pipe-info-list', queryMap.pipeInfo)[0];

        $(queryMap.jsPanel).bind('resize', jsPanelResizeHandler);
        $(document).bind('jspanelbeforeclose', jsPanelCloseHandler);
        eventHandlerMap.resizeMap = map.on('resize', mapResizeHandler);

        queryMap.timeSlider = new TimeSlider({
            'container': queryMap.resultPanelTimeSlider,
            'showMarkerLabel': false,
            'playInterval': 300,
            'eventHandlers': {
                'toStop': function(event){
                    if(!stateMap.nodeWaterInfo){
                        return;
                    }
                    drawWater(event.curStop.index);
                    var stop = event.curStop,
                        index = stop.index,
                        mills = (function(){
                            var date = new Date();
                            Date.parse(stateMap.curProject.simstarttime);
                            return date.getTime();
                        })(),
                        timeStr;
                    mills += index * parseInt(stateMap.curProject.reportstep) * 1000;
                    timeStr = timeUtils.formatTimeStrFromMill(mills, 'yyyy-MM-dd hh:mm');
//                    var dt = new Date();
//                    dt.setTime(mills);
//                    timeStr = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+(dt.getDate())+" "+dt.getHours()+":"+dt.getMinutes();
                    updateTimelineLabel(timeStr);
                }
            }
        });

        domAttr.set(queryMap.playIntervalInput, 'value', queryMap.timeSlider.getPlayInterval());
        domAttr.set(queryMap.playIntervalInput, 'data-prevValue', domAttr.get(queryMap.playIntervalInput, 'value'));
        domStyle.set(queryMap.pipeInfoList, 'height', (queryMap.controlPanel.offsetHeight - queryMap.controlPanelBtns.offsetHeight - queryMap.pipeInfoTitle.offsetHeight)+'px');

        eventHandlerMap.clearPipeInfo = on(queryMap.clearPipeInfoBtn, 'click', clearPickerHandler);

        eventHandlerMap.analyse = on(queryMap.analyseBtn, 'click', analyseHandler);

        eventHandlerMap.clickPlayBtn = on(queryMap.timeSliderPlayBtn, 'click', clickPlayBtnHandler);
        eventHandlerMap.clickStopBtn = on(queryMap.timeSliderStopBtn, 'click', clickStopBtnHandler);
        eventHandlerMap.clickResetBtn = on(queryMap.timeSliderResetBtn, 'click', clickResetBtnHandler);
        eventHandlerMap.changePlayInterval = on(queryMap.playIntervalInput, 'keyup', changePlayIntervalHandler);

        (function(){
            var count = 1,
                stops = [],
                i;

            if(!stateMap.curProject){
                return;
            }

            count = stateMap.curProject.reportcount;

            for(i=0;i<count;i++){
                stops.push({
                    'index': i,
                    'value': i + 1
                });
            }

            queryMap.timeSlider.setTimeData({
                'type': 'category',
                'stops': stops
            });

        })();
   };

    updateTimelineLabel = function(text){
        html.set(queryMap.timeSliderLabel, text === undefined || text === null?'':text);
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
    
    cancel = function(fromEvent, skipEmit){
        var prevProject = stateMap.curProject;

        destroyPicker();
        destroyChart();
        destroyDom(fromEvent);
        if(!skipEmit){
            emit('canceled', {
                'project': prevProject
            });
        }
        stateMap = null;
    };

    use = function(options){
        if(queryMap){
            cancel(false, true);
        }
        options = options || {};

        if(!options.curProject){
            throw "'curProject' is needed for use!";
        }
        if(!options.featureServiceUrls){
            throw "'featureServiceUrls' is needed for use!";
        }

        stateMap = {};
        lang.mixin(configMap.serviceApis, options.featureServiceUrls || {});

        stateMap.curProject = options.curProject;
        
        initDom();

        initPicker();

        startPick();

        hideResultPanel();
//        window.setTimeout(startAnalysis, 0);
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }
        map = _map;
        lang.mixin(configMap, options);
        lang.mixin(eventHandlers, options.eventHandlers || {});
        
        pipeUtils = new PipeUtils();
        pipeNodeUtils = new PipeNodeUtils();

        loadResources();
        //TODO
    };

    function updateJsPanelTitle(text,afterTime,text2,color){
        if(queryMap && queryMap.jsPanel){
            if(basicUtils.isNumber(afterTime) && afterTime >= 0){
                window.setTimeout(function(){
                    if(queryMap && queryMap.jsPanel){
                        queryMap.jsPanel.headerTitle(text, afterTime);
                    }
                }, afterTime);
            }else{
                if(!text2)
                   queryMap.jsPanel.headerTitle(text);
                else
                   queryMap.jsPanel.headerTitle(text+"<span style='color:"+color+"'>"+text2+"</span>");    
            }
        }
    }


    function decideSortOrder(){
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
    }

    function sortPipes(){
        var sorted = [],
            startPipe, endPipe, curPipe, pipe,
            startPoint, endPoint, i, counter;

        array.forEach(stateMap.pickResult.selectedPipes, function(pipe1){
            var hasPrev = false,
                hasNext = false;
            array.forEach(stateMap.pickResult.selectedPipes, function(pipe2){
                if(pipe1 !== pipe2){
                    if(pipeUtils.getOutJuncID(pipe2) == pipeUtils.getInJuncID(pipe1)){
                        hasPrev = true;
                    }
                    if(pipeUtils.getOutJuncID(pipe1) == pipeUtils.getInJuncID(pipe2)){
                        hasNext = true;
                    }
                }
            });

            if(!startPipe && !hasPrev){
                startPipe = pipe1;
            }
            if(!endPipe && !hasNext){
                endPipe = pipe1;
            }
        });

        if(!startPipe || !endPipe){
            console.error("startPipe:"+startPipe+", endPipe:"+endPipe);
            return;
        }

        curPipe = startPipe;
        endPoint = pipeUtils.getOutJuncID(curPipe);

        sorted.push(curPipe);

        counter = 0;

        while(curPipe && curPipe !== endPipe){
            counter ++;
            if(counter >= 1000000){
                console.error('some errors must occurred when sorting, counter:'+counter);
                break;
            }
            for(i=0;i<stateMap.pickResult.selectedPipes.length;i++){
                pipe = stateMap.pickResult.selectedPipes[i];
                if(pipe === curPipe){
                    continue;
                }
                startPoint = pipeUtils.getInJuncID(pipe);
                if(startPoint == endPoint){
                    sorted.push(pipe);
                    curPipe = pipe;
                    endPoint = pipeUtils.getOutJuncID(pipe);
                    break;
                }
            }
            if(i >= stateMap.pickResult.selectedPipes.length && curPipe !== endPipe){
                console.error('pipes not connected at pipe:'+pipeUtils.getId(curPipe));
                return;
            }
        }

        stateMap.pickResult.selectedPipes = sorted;
        stateMap.pickResult.startPipe = startPipe;
        stateMap.pickResult.endPipe = endPipe;
        stateMap.pickResult.startPoint  = pipeUtils.getInJuncID(startPipe);
        stateMap.pickResult.endPoint = pipeUtils.getOutJuncID(endPipe);

        decideSortOrder();
    }

    function getPipeNodes(){
        var queries = {},
            nodeIdMap = {},
            nodeIds = [],
            cond, i, pipe, point;

        for(i=0;i<stateMap.pickResult.selectedPipes.length;i++){
            pipe = stateMap.pickResult.selectedPipes[i];
            point = pipeUtils.getInJuncID(pipe);
            if(!nodeIdMap[point]){
                nodeIdMap[point] = true;
                nodeIds.push(point);
            }
            point = pipeUtils.getOutJuncID(pipe);
            if(!nodeIdMap[point]){
                nodeIdMap[point] = true;
                nodeIds.push(point);
            }
        }

        cond = " in("+array.map(nodeIds, function(nodeId){
            return "'"+nodeId+"'";
        }).join(',')+")";

        array.forEach(configMap.layerIdMap.pipeNode, function(layerId){
            var url = configMap.serviceApis.pipeNodeServiceUrl + "/" + layerId,
                layerInfo = configMap.layerInfoMap.pipeNode[layerId],
                queryTask = new QueryTask(url),
                query = new Query();

            query.returnGeometry = true;
            query.outFields = ['*'];
            query.where = " "+layerInfo.idField+cond;
            
            queries[layerId] = queryTask.execute(query);
        });
        
        return all(queries);
    }

    function computePipeTotalProjection(){
        var total = 0;
        array.forEach(stateMap.pickResult.selectedPipes, function(pipe){
            total += pipeUtils.getHorizontalProjection(pipe);
        });
        return total;
    }

    function computePipeNodeTotalWidth(){
        var total = 0, node;
        for(var nodeId in stateMap.pipeNodeInfo.idMap){
            if(stateMap.pipeNodeInfo.idMap.hasOwnProperty(nodeId)){
                total += configMap.chartOptions.default_node_size_meter;
            }
        }
        return total;
    }

    function computeMaxElev(){
        var max = - 10000000,
            node;
        array.forEach(stateMap.pickResult.selectedPipes, function(pipe){
            max = Math.max(max, pipeUtils.getInElev(pipe) + pipeUtils.getShapeDepth(pipe));
            max = Math.max(max, pipeUtils.getOutElev(pipe) + pipeUtils.getShapeDepth(pipe));
        });
        for(var nodeId in stateMap.pipeNodeInfo.idMap){
            if(stateMap.pipeNodeInfo.idMap.hasOwnProperty(nodeId)){
                node = stateMap.pipeNodeInfo.idMap[nodeId];
                max = Math.max(max, pipeNodeUtils.getBotElev(node) + pipeNodeUtils.getDepth(node));
            }
        }
        return max;
    }

    function computeMinElev(){
        var min = 10000000,
            node;
        array.forEach(stateMap.pickResult.selectedPipes, function(pipe){
            min = Math.min(min, pipeUtils.getInElev(pipe));
            min = Math.min(min, pipeUtils.getOutElev(pipe));
        });
        for(var nodeId in stateMap.pipeNodeInfo.idMap){
            if(stateMap.pipeNodeInfo.idMap.hasOwnProperty(nodeId)){
                node = stateMap.pipeNodeInfo.idMap[nodeId];
                min = Math.min(min, pipeNodeUtils.getBotElev(node));
            }
        }
        return min;
    }

    function drawFlowdirect(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y, length;
        x = scale.paddingLeftWidth;
        y = 25;
        length = 100;
        gfxMap.flowdirectGroup = gfxMap.surface.createGroup();
        gfxMap.flowdirectGroup.createLine({
            'x1': x,
            'y1': y,
            'x2': x + length,
            'y2': y
        }).setStroke('#000000');

        gfxMap.flowdirectGroup.createLine({
            'x1': x + length,
            'y1': y,
            'x2': x + length - 15,
            'y2': y - 6
        }).setStroke('#000000');

        gfxMap.flowdirectGroup.createLine({
            'x1': x + length,
            'y1': y,
            'x2': x + length - 15,
            'y2': y + 6
        }).setStroke('#000000');

        gfxMap.flowdirectGroup.createText({
            'x': x + length/2,
            'y': y - 5,
            'align': 'middle',
            'text': '流向'
        }).setFont({
            'size': (configMap.chartOptions.font_size * 1.5) + 'pt'
        }).setFill('#000000');
    }

    function drawGrid(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y, width, height;
        x = scale.paddingLeftWidth;
        y = scale.paddingTopHeight;
        width = scale.graphWidthInMeters * scale.x;
        height = scale.graphHeightInMeters * scale.y;
        gfxMap.gridGroup = gfxMap.surface.createGroup();
        gfxMap.grid = gfxMap.gridGroup.createRect({
            'x': x,
            'y': y,
            'width': width,
            'height': height
        }).setStroke(opts.grid_border_color).
            setFill(opts.grid_bg_color);
    }

    function drawLeftRuler(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y, height, tmp, tmp2,
            minHeight, maxHeight, curHeight,
            markerGroup, marker,
            graphWidth;

        graphWidth = scale.graphWidthInMeters * scale.x;

        x = scale.paddingLeftWidth;
        y = scale.paddingTopHeight;
        height = scale.graphHeightInMeters;

        minHeight = scale.minElev - opts.grid_padding_bottom_meter;
        maxHeight = minHeight + height;

        gfxMap.leftRulerGroup = gfxMap.surface.createGroup();

        gfxMap.leftRulerLine = gfxMap.leftRulerGroup.createLine({//line
            'x1': x,
            'y1': y,
            'x2': x,
            'y2': y + height
        }).setStroke(opts.left_ruler_line_color);
        
        tmp = x - opts.ruler_long_marker_length - opts.text_padding_right - opts.font_size * opts.left_ruler_max_col_count - opts.text_padding_left - opts.text_padding_right;
        tmp2 = y + (height / 2) * scale.y;

        gfxMap.leftRulerName = gfxMap.leftRulerGroup.createText({//name
            'x': tmp,
            'y': tmp2,
            'align': 'end',
            'text': '标高(m)'
        }).setFont({
            'size': opts.font_size + 'pt'
        }).setFill(opts.left_ruler_name_text_color);

        gfxMap.leftRulerName.applyTransform(gfx.matrix.rotategAt(90, tmp, tmp2 - opts.text_line_height));

        y = y - (Math.ceil(maxHeight) - maxHeight) * scale.y;
        
        curHeight = Math.ceil(maxHeight);

        gfxMap.leftRulerMarkers = [];

        while(true){
            if(curHeight >= minHeight && curHeight <= maxHeight ){
                markerGroup = gfxMap.leftRulerGroup.createGroup();
                gfxMap.leftRulerMarkers.push(markerGroup);
                markerGroup.createLine({//marker
                    'x1': x,
                    'y1': y,
                    'x2': x - opts.ruler_long_marker_length,
                    'y2': y
                }).setStroke(opts.left_ruler_marker_line_color);

                markerGroup.createText({//text
                    'x': x - opts.ruler_long_marker_length - opts.text_padding_right,
                    'y': y + opts.font_size / 2,
                    'text': curHeight,
                    'align': 'end'
                }).setFont({
                    'size' : opts.font_size + 'pt'
                }).setFill(opts.left_ruler_marker_text_color);

                markerGroup.createLine({//ref-line
                    'x1': x + 1,
                    'y1': y,
                    'x2': x + graphWidth,
                    'y2': y
                }).setStroke({
                    'style': 'Dot',
                    'color': opts.left_ruler_marker_ref_line_color
                });
            }else if(curHeight < minHeight){
                break;
            }
            curHeight -= 1;
            y += scale.y;
        }
    }

    function drawBottomRuler(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y, curWidth,
            maxWidth, minWidth,
            graphWidth, graphHeight,
            marker, markerGroup;
        
        graphHeight = scale.graphHeightInMeters * scale.y;
        graphWidth = scale.graphWidthInMeters * scale.x;
        
        minWidth = 0;
        maxWidth = minWidth + scale.graphWidthInMeters;

        x = scale.paddingLeftWidth;
        y = scale.paddingTopHeight + graphHeight;
        
        gfxMap.bottomRulerGroup = gfxMap.surface.createGroup();

        gfxMap.bottomRulerLine = gfxMap.bottomRulerGroup.createLine({//line
            'x1': x,
            'y1': y,
            'x2': x + graphWidth,
            'y2': y
        }).setStroke(opts.bottom_ruler_line_color);

        gfxMap.bottomRulerName = gfxMap.bottomRulerGroup.createText({//name
            'x': x + graphWidth / 2,
            'y': y + opts.ruler_long_marker_length + opts.text_line_height * 2,
            'text': '距离(m)',
            'align': 'middle'
        }).setFont({
            'size': opts.font_size + 'pt'
        }).setFill(opts.bottom_ruler_name_text_color);

        x += opts.grid_padding_left_meter * scale.x;

        curWidth = minWidth;

        while(true){
            if(curWidth >= minWidth && curWidth <= maxWidth){
                markerGroup = gfxMap.bottomRulerGroup.createGroup();
                markerGroup.createLine({//marker
                    'x1': x,
                    'y1': y,
                    'x2': x,
                    'y2': y + opts.ruler_long_marker_length
                }).setStroke(opts.bottom_ruler_marker_line_color);

                markerGroup.createLine({//ref-line
                    'x1': x,
                    'y1': y - 1,
                    'x2': x,
                    'y2': y - graphHeight
                }).setStroke({
                    'color': opts.bottom_ruler_marker_ref_line_color,
                    'style': 'Dot'
                });

                markerGroup.createText({//text
                    'x': x,
                    'y': y + opts.ruler_long_marker_length + opts.text_line_height,
                    'text': curWidth,
                    'align': 'middle'
                }).setFont({
                    'size': opts.font_size + 'pt'
                }).setFill(opts.bottom_ruler_marker_text_color);
            }else{
                break;
            }
            curWidth += opts.bottom_ruler_marker_interval_meter;
            x += scale.x * opts.bottom_ruler_marker_interval_meter;
        }
    }

    function drawPipes(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y,
            pipe, node;

        x = scale.paddingLeftWidth + opts.grid_padding_left_meter * scale.x;

        for(var i=0; i<stateMap.pickResult.selectedPipes.length; i++){
            pipe = stateMap.pickResult.selectedPipes[i];
            node = pipeUtils.getInNode(pipe);
            x = drawPipeNode(node, x);
            x = drawPipe(pipe, x);
            if(i + 1 >= stateMap.pickResult.selectedPipes.length){
                node = pipeUtils.getOutNode(pipe);
                x = drawPipeNode(node, x);
            }
        }
    }

    function drawPipe(pipe, curX){
        if(!pipe){
            return x;
        }
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            x, y, path, group,
            inNode, outNode,
            tmp, tmp2, projection;
        
        group = gfxMap.surface.createGroup();

        pipe.gfxGroup = group;

        inNode = pipeUtils.getInNode(pipe);
        outNode = pipeUtils.getOutNode(pipe);

        if(!inNode || !outNode){
            console.error("pipe["+pipeUtils.getId(pipe)+"]{'inNode': "+inNode+", 'outNode': "+outNode+"}");
            return curX;
        }

        path = group.createPath();

        tmp = x = curX;
        tmp2 = y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(inNode) + pipeUtils.getInletHeight(pipe))) * scale.y;

        path.moveTo(x, y);

        projection = pipeUtils.getHorizontalProjection(pipe) * scale.x;

        x += projection;
        y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(outNode) + pipeUtils.getOutletHeight(pipe))) * scale.y;

        path.lineTo(x, y);

        y -= pipeUtils.getShapeDepth(pipe) * scale.y;
        
        path.lineTo(x, y);
        
        x = tmp;
        y = tmp2 - pipeUtils.getShapeDepth(pipe) * scale.y;

        path.lineTo(x, y);

        path.closePath();

        path.setStroke(opts.pipe_border_color);

        return curX + projection;
    }

    function drawPipeNode(node, x){
        if(!node){
            return x;
        }
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            y, width, height, group,
            tmp, tmp2;
        
        group = gfxMap.surface.createGroup();

        node.gfxGroup = group;

        y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - pipeNodeUtils.getBotElev(node)) * scale.y;
        width = opts.default_node_size_meter * scale.x;
        height = pipeNodeUtils.getDepth(node) * scale.y;
        
        group.createRect({//rect
            'x': x,
            'y': y - height,
            'width': width,
            'height': height
        }).setStroke(opts.pipe_node_border_color);

        tmp = x + opts.default_node_size_meter * scale.x / 2;
        tmp2 = scale.paddingTopHeight - opts.ruler_long_marker_length - opts.font_padding_bottom;

        group.createLine({//marker
            'x1': tmp,
            'y1': scale.paddingTopHeight,
            'x2': tmp,
            'y2': tmp2
        }).setStroke(opts.top_ruler_marker_line_color);

        group.createText({//text
            'x': tmp,
            'y': tmp2,
            'align': 'middle',
            'text': pipeNodeUtils.getOBJECTID(node)
        }).setFont({
            'size': opts.font_size + 'pt'
        }).setFill(opts.top_ruler_marker_text_color);

        return x + opts.default_node_size_meter * scale.x;
    }

    function drawSurface(){
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            pipe, node, path, i,
            x, y;

        x = scale.paddingLeftWidth + opts.grid_padding_left_meter * scale.x;

        gfxMap.surfaceGroup = gfxMap.surface.createGroup();

        path = gfxMap.surfaceGroup.createPath();

        for(i=0;i<stateMap.pickResult.selectedPipes.length;i++){
            x += opts.default_node_size_meter * scale.x;
            pipe = stateMap.pickResult.selectedPipes[i];
            if(i === 0){
                node = pipeUtils.getInNode(pipe);
                y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(node) + pipeNodeUtils.getDepth(node))) * scale.y;
                path.moveTo(x, y);
            }

            node = pipeUtils.getOutNode(pipe);
            
            x += pipeUtils.getHorizontalProjection(pipe) * scale.x;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(node) + pipeNodeUtils.getDepth(node))) * scale.y;

            path.lineTo(x, y);
        }

        path.setStroke({
            'style': 'ShortDash',
            'color': opts.surface_line_color
        });
    }

    function loadNodeWater(){
        var nodeIds = [],
            nodeId;

        for(nodeId in stateMap.pipeNodeInfo.idMap){
            if(stateMap.pipeNodeInfo.idMap.hasOwnProperty(nodeId)){
                nodeIds.push(nodeId);
            }
        }

        return request(configMap.serviceApis.batchNodeWaterTimeseries, {
            'method': 'POST',
            'handleAs': 'json',
            'data': {
                'projectid': stateMap.curProject.projectid,
                'projectname': encodeURIComponent(stateMap.curProject.projectname),
                'inpcodesJson': JSON.stringify(nodeIds)
            }
        });
    }

    function drawNodeWater(node, nodeWater, x){
        if(!node || !nodeWater){
            return x;
        }
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            y, width, height, group,
            tmp, tmp2;
        /*
         gfxMap.nodeWaterGroups = gfxMap.nodeWaterGroups || [];
         gfxMap.nodeWaterGroups.push(group);
         */
        if(node.gfxWaterGroup){
            node.gfxWaterGroup.clear();
            node.gfxWaterGroup.removeShape();
            delete node.gfxWaterGroup;
        }

        group = gfxMap.surface.createGroup();
        node.gfxWaterGroup = group;

        y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - pipeNodeUtils.getBotElev(node)) * scale.y;

        width = opts.default_node_size_meter * scale.x;
        height = nodeWater.depth * scale.y;
        
        group.createRect({//rect
            'x': x,
            'y': y - height,
            'width': width,
            'height': height
        }).setFill(opts.default_water_color);

        return x + opts.default_node_size_meter * scale.x;
    }

    function drawPipeWater(pipe, inNodeWater, outNodeWater, curX){
        if(!pipe || !inNodeWater || !outNodeWater){
            return x;
        }
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            projection = pipeUtils.getHorizontalProjection(pipe),
            inNode, outNode, path, group, 
            inletHeight, outletHeight, pipeShapeDepth,
            inTopHeight, outTopHeight, inBotElev, outBotElev,
            inHeight, outHeight, x, y,
            eq1, eq2, eq3, intersectP1, intersectP2, 
            tmp, tmp2;

        if(pipe.gfxWaterGroup){
            pipe.gfxWaterGroup.clear();
            pipe.gfxWaterGroup.removeShape();
            delete pipe.gfxWaterGroup;
        }

        group = gfxMap.surface.createGroup();

        pipe.gfxWaterGroup = group;

        inNode = pipeUtils.getInNode(pipe);
        outNode = pipeUtils.getOutNode(pipe);

        inBotElev = pipeNodeUtils.getBotElev(inNode);
        outBotElev = pipeNodeUtils.getBotElev(outNode);

        inletHeight = pipeUtils.getInletHeight(pipe);
        outletHeight = pipeUtils.getOutletHeight(pipe);
        pipeShapeDepth = pipeUtils.getShapeDepth(pipe);

        inHeight = Math.max(inNodeWater.depth, inletHeight);
        outHeight = Math.max(outNodeWater.depth, outletHeight);

        inTopHeight = inletHeight + pipeShapeDepth;
        outTopHeight = outletHeight + pipeShapeDepth;

        if(!inNode || !outNode){
            console.error("pipe["+pipeUtils.getId(pipe)+"]{'inNode': "+inNode+", 'outNode': "+outNode+"}");
            return curX;
        }

        path = group.createPath();

        x = curX;
        y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inHeight)) * scale.y;

        path.moveTo(x, y);

        projection = pipeUtils.getHorizontalProjection(pipe) * scale.x;

        x += projection;
        y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outHeight)) * scale.y;

        path.lineTo(x, y);

        path.setStroke(opts.default_water_line_color);

        if(inNodeWater.depth <= inletHeight && outNodeWater.depth <= outletHeight){//water line below with bottom line |
            //NOTHING TO DO
        }else if((inNodeWater.depth < inletHeight && outNodeWater.depth >= outletHeight && outNodeWater.depth <= outTopHeight) ||
                 (outNodeWater.depth < outletHeight && inNodeWater.depth >= inletHeight && inNodeWater.depth <= inTopHeight)){//water line intersects with pipe bottom line |||
            x = curX;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inletHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outletHeight)) * scale.y;
            eq1 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            x = curX;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outHeight)) * scale.y;
            eq2 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            intersectP1 = geometryUtils.intersectStraightLines(eq1, eq2);
            if(intersectP1 != null && intersectP1 != 'overlay'){
                path = group.createPath();
                x = intersectP1.x;
                y = intersectP1.y;
                path.moveTo(x, y);
                x = curX + (inNodeWater.depth >= inletHeight?0 + 1: projection - 2);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inletHeight)?inBotElev + inletHeight:outBotElev + outletHeight) * scale.y;
                path.lineTo(x, y);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inletHeight)?inBotElev + inHeight:outBotElev + outHeight) * scale.y;
                path.lineTo(x, y);
                path.closePath();
                path.setFill(opts.default_water_color);
            }
        }else if(inNodeWater.depth >= inletHeight && inNodeWater.depth <= inTopHeight &&
                 outNodeWater.depth >= outletHeight && outNodeWater.depth <= outTopHeight){//water line intersects with neither top nor bottom line ||
            path = group.createPath();

            tmp = x = curX + 1;
            tmp2 = y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(inNode) + inletHeight)) * scale.y;

            path.moveTo(x, y);

            x += projection - 2;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(outNode) + outletHeight)) * scale.y;

            path.lineTo(x, y);

            y -= (outHeight - outletHeight) * scale.y;
            
            path.lineTo(x, y);
            
            x = tmp;
            y = tmp2 - (inHeight - inletHeight) * scale.y;

            path.lineTo(x, y);

            path.closePath();

            path.setFill(opts.default_water_color);
        }else if((inNodeWater.depth >= inletHeight && inNodeWater.depth < inTopHeight && outNodeWater.depth >= outTopHeight) ||
                 (outNodeWater.depth >= outletHeight && outNodeWater.depth < outTopHeight && inNodeWater.depth >= inTopHeight)){//water line intersects with pipe top line |||

            x = curX;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inTopHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outTopHeight)) * scale.y;
            eq1 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            x = curX;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outHeight)) * scale.y;
            eq2 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            intersectP1 = geometryUtils.intersectStraightLines(eq1, eq2);
            if(intersectP1 != null && intersectP1 != 'overlay'){
                path = group.createPath();
                x = intersectP1.x;
                y = intersectP1.y;
                path.moveTo(x, y);
                x = curX + (inNodeWater.depth >= inTopHeight?0 + 1: projection - 1);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?inBotElev + inTopHeight:outBotElev + outTopHeight) * scale.y;
                path.lineTo(x, y);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?inBotElev + inletHeight:outBotElev + outletHeight) * scale.y;
                path.lineTo(x, y);
                x = curX + (inNodeWater.depth >= inTopHeight?projection - 1:0 + 1);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?outBotElev + outletHeight:inBotElev + inletHeight) * scale.y;
                path.lineTo(x, y);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?outBotElev + outHeight:inBotElev + inHeight) * scale.y;
                path.lineTo(x, y);
                path.closePath();
                path.setFill(opts.default_water_color);
            }
        }else if(inNodeWater.depth >= inTopHeight && outNodeWater.depth >= outTopHeight){//water line above top line |
            path = group.createPath();

            tmp = x = curX + 1;
            tmp2 = y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(inNode) + inletHeight)) * scale.y;

            path.moveTo(x, y);

            x += projection - 2;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (pipeNodeUtils.getBotElev(outNode) + outletHeight)) * scale.y;

            path.lineTo(x, y);

            y -= pipeShapeDepth * scale.y;
            
            path.lineTo(x, y);
            
            x = tmp;
            y = tmp2 - pipeShapeDepth * scale.y;

            path.lineTo(x, y);

            path.closePath();

            path.setFill(opts.default_water_color);
        }else if((inNodeWater.depth < inletHeight && outNodeWater.depth > outTopHeight)||
                 (outNodeWater.depth < outletHeight && inNodeWater.depth > inTopHeight)){//water line intersects with both top and bottom line |||
            x = curX;
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outHeight)) * scale.y;
            eq1 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inletHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outletHeight)) * scale.y;
            eq2 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            y = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (inBotElev + inTopHeight)) * scale.y;
            tmp = scale.paddingTopHeight + ((scale.maxElev + opts.grid_padding_top_meter) - (outBotElev + outTopHeight)) * scale.y;
            eq3 = geometryUtils.getLineEquation([x, y], [x + projection, tmp]);
            intersectP1 = geometryUtils.intersectStraightLines(eq1, eq2);
            intersectP2 = geometryUtils.intersectStraightLines(eq1, eq3);
            if(intersectP1 && intersectP2 && intersectP1 != 'overlay' && intersectP2 != 'overlay'){
                path = group.createPath();
                x = intersectP1.x;
                y = intersectP1.y;
                path.moveTo(x, y);

                x = curX + (inNodeWater.depth >= inTopHeight?0 + 1: projection - 2);
                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?inBotElev + inletHeight:outBotElev + outletHeight) * scale.y;
                path.lineTo(x, y);

                y = scale.paddingTopHeight + (scale.maxElev + opts.grid_padding_top_meter) * scale.y - ((inNodeWater.depth >= inTopHeight)?inBotElev + inTopHeight:outBotElev + outTopHeight) * scale.y;
                path.lineTo(x, y);

                x = intersectP2.x;
                y = intersectP2.y;
                path.lineTo(x, y);

                path.closePath();
                path.setFill(opts.default_water_color);
            }
        }

        return curX + projection;
    }

    function drawWater(timeIndex){
        if(!gfxMap || !gfxMap.surface || !stateMap.nodeWaterInfo || !stateMap.nodeWaterInfo.idMap){
            return;
        }
        var opts = configMap.chartOptions,
            scale = stateMap.scaleFactors,
            pipe, inNode, outNode, i, x,
            inNodeWater, outNodeWater;

        x = scale.paddingLeftWidth + opts.grid_padding_left_meter * scale.x;

        for(i=0;i<stateMap.pickResult.selectedPipes.length;i++){
            pipe = stateMap.pickResult.selectedPipes[i];
            inNode = pipeUtils.getInNode(pipe);
            outNode = pipeUtils.getOutNode(pipe);
            inNodeWater = stateMap.nodeWaterInfo.idMap[pipeNodeUtils.getId(inNode)][timeIndex];
            outNodeWater = stateMap.nodeWaterInfo.idMap[pipeNodeUtils.getId(outNode)][timeIndex];
            if(i === 0){
                x = drawNodeWater(inNode, inNodeWater, x);
            }
            x = drawPipeWater(pipe, inNodeWater, outNodeWater, x);
            x = drawNodeWater(outNode, outNodeWater, x);
        }
    }

    function computeScaleFactors(){
        if(!stateMap || !stateMap.pickResult || !stateMap.pickResult.selectedPipes){
            return;
        }
        var opts = configMap.chartOptions,
            scale = {},
            paddingWidth, paddingHeight, graphWidth, graphHeight,
            graphWidthInMeters, graphHeightInMeters,
            totalWidth, totalHeight, minElev, maxElev,
            paddingLeftWidth, paddingRightWidth, paddingTopHeight, paddingBottomHeight;

        domStyle.set(queryMap.chartWrapper, 'height', (queryMap.resultPanel.offsetHeight - queryMap.resultPanelControlPanel.offsetHeight) + 'px');
        totalWidth = queryMap.chartWrapper.offsetWidth;
        totalHeight= queryMap.chartWrapper.offsetHeight;

        paddingLeftWidth = opts.padding_left + (opts.text_padding_left + opts.left_ruler_max_col_count * opts.font_size + opts.text_padding_right) + (opts.text_padding_left + opts.font_size + opts.text_padding_right) + opts.ruler_long_marker_length;
        paddingRightWidth = opts.padding_right;
        paddingTopHeight = opts.padding_top + opts.text_line_height+ opts.ruler_long_marker_length;
        paddingBottomHeight = opts.padding_bottom + opts.text_line_height * 2 + opts.ruler_long_marker_length;

        paddingWidth =  paddingLeftWidth + paddingRightWidth; //in pixel
        paddingHeight = paddingTopHeight + paddingBottomHeight; //in pixel
        
        minElev = computeMinElev();
        maxElev = computeMaxElev();

        graphWidthInMeters = opts.grid_padding_left_meter + computePipeTotalProjection() + computePipeNodeTotalWidth() + opts.grid_padding_right_meter;
        graphHeightInMeters = opts.grid_padding_top_meter + (maxElev - minElev) + opts.grid_padding_bottom_meter;

        scale.x = (totalWidth - paddingWidth) / graphWidthInMeters;
        scale.y = (totalHeight - paddingHeight) / graphHeightInMeters;

        if(scale.x < 0 || scale.y < 0){
            alert("数据有误, 无法计算缩放比例。");
            return;
        }

        stateMap.scaleFactors = {
            'x': scale.x,
            'y': scale.y,
            'maxElev': maxElev,
            'minElev': minElev,
            'paddingLeftWidth': paddingLeftWidth,
            'paddingRightWidth': paddingRightWidth,
            'paddingTopHeight': paddingTopHeight,
            'paddingBottomHeight': paddingBottomHeight,
            'totalWidth': totalWidth,
            'totalHeight': totalHeight,
            'graphWidthInMeters': graphWidthInMeters,
            'graphHeightInMeters': graphHeightInMeters
        };
    }

    function prepareNodeWaterData(response){
        if(!response){
            return;
        }
        stateMap.nodeWaterInfo = {
            'idMap': response
        };
        domAttr.remove(queryMap.timeSliderPlayBtn,"disabled");
        updateJsPanelTitle(configMap.jsPanelHeaderTitle,-1,'(数据加载完毕，可以播放)','green');
        updateJsPanelTitle(configMap.jsPanelHeaderTitle,2000);
        queryMap.timeSlider.toStop(0);
    }

    function destroyChart(){
        var feature;
        if(gfxMap && gfxMap.surface){
            gfxMap.surface.destroy();
        }
        if(stateMap && stateMap.pickResult && stateMap.pickResult.selectedPipes){
            array.forEach(stateMap.pickResult.selectedPipes, function(feature){
//                feature.gfxGroup.destroy();
//                feature.gfxWaterGroup.destroy();
                feature.gfxGroup = null;
                feature.gfxWaterGroup = null;
            });
        }
        if(stateMap && stateMap.pipeNodeInfo && stateMap.pipeNodeInfo.idMap){
            for(var nodeId in stateMap.pipeNodeInfo.idMap){
                if(stateMap.pipeNodeInfo.idMap.hasOwnProperty(nodeId)){
                    feature = stateMap.pipeNodeInfo.idMap[nodeId];
//                    feature.gfxGroup.destroy();
//                  feature.gfxWaterGroup.destroy();
                    feature.gfxGroup = null;
                    feature.gfxWaterGroup = null;
                }
            }
        }
        delete stateMap.scaleFactors;
        gfxMap = null;
    }

    function initChart(){
        if(!stateMap.scaleFactors){
            return;
        }
        var scale = stateMap.scaleFactors;
        gfxMap  = {};
        gfxMap.surface = gfx.createSurface(queryMap.chartWrapper, scale.totalWidth, scale.totalHeight);
        drawFlowdirect();
        drawGrid();
        drawLeftRuler();
        drawBottomRuler();
        drawPipes();
        drawSurface();
    }

    drawChart = function(){
        if(!stateMap || !stateMap.picker || !stateMap.picker.result || !stateMap.picker.result.selectedPipes || !stateMap.picker.result.selectedPipes.length){
            return;
        }
        computeScaleFactors();
        initChart();
    };

    function startAnalysis(){
/*        stateMap.pickResult = {
            'selectedInpcodes': ["103YS2888103YS2883", "103YS2883103YS2878", "103YS2878103YS3148", "103YS3148103YS3153", "103YS3153103YS3157", "103YS3157103YS3161", "103YS3161103YS3165"]
        };
*/
        destroyChart();
        if(!stateMap || !stateMap.picker || !stateMap.picker.result || !stateMap.picker.result.selectedPipes){
            return;
        }
        stateMap.pickResult = {
            'selectedInpcodes': array.map(stateMap.picker.result.selectedPipes, function(feature){
                return pipeUtils.getId(feature);
            })
        };
        var pipeQueries = {};

        array.forEach(configMap.layerIdMap.pipe, function(layerId){
            var queryTask = new QueryTask(configMap.serviceApis.pipeServiceUrl+"/"+layerId),
                query = new Query(),
                layerInfo = configMap.layerInfoMap.pipe[layerId];

            query.where = " "+layerInfo.idField+" in ("+array.map(stateMap.pickResult.selectedInpcodes, function(inpcode){
                return "'"+inpcode+"'";
            }).join(",")+")";
            
            query.returnGeometry = true;
            query.outFields = ['*'];

            pipeQueries[layerId] = queryTask.execute(query);
        });
        updateJsPanelTitle(configMap.jsPanelHeaderTitle,-1,'(正在加载管线数据)','red');
        all(pipeQueries).then(function(featureSets){
            var featureSet, pipeNodesQuery;
            stateMap.pickResult.selectedPipes = [];
            for(var layerId in featureSets){
                if(featureSets.hasOwnProperty(layerId)){
                    featureSet = featureSets[layerId];
                    array.forEach(featureSet.features, function(feature){
                        feature._layerInfo = configMap.layerInfoMap.pipe[layerId];
                        stateMap.pickResult.selectedPipes.push(feature);
                    });
                }
            }

            sortPipes();

            pipeNodesQuery = getPipeNodes();
            if(!pipeNodesQuery){
                console.error('Failed when querying pipe nodes!');
                return;
            }

            stateMap.pipeNodeInfo = {
                'idMap': {}
            };
            updateJsPanelTitle(configMap.jsPanelHeaderTitle,-1,'(正在加载管点数据)','red');
            pipeNodesQuery.then(function(pipeNodeSets){
                var featureSet,
                    layerInfo;
                for(var layerId in pipeNodeSets){
                    if(pipeNodeSets.hasOwnProperty(layerId)){
                        featureSet = pipeNodeSets[layerId];
                        layerInfo = configMap.layerInfoMap.pipeNode[layerId];
                        array.forEach(featureSet.features, function(feature){
                            feature._layerInfo = layerInfo;
                            stateMap.pipeNodeInfo.idMap[pipeNodeUtils.getId(feature)] = feature;
                        });
                    }
                }
            }).then(function(){
                pipeUtils.config(stateMap);
                drawChart();
                domAttr.set(queryMap.timeSliderPlayBtn,"disabled","true");
                updateJsPanelTitle(configMap.jsPanelHeaderTitle,-1,'(正在加载管点水深数据)','red');
                loadNodeWater().then(prepareNodeWaterData, function(){
                    updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(管点水深加载失败)');                    
                });
            }, function(){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(管点数据加载失败)');
            });
        }, function(){
            updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(管线数据加载失败)');            
        });
    }
    
    exports = {
        'init': init,
        'use': use,
        'cancel': cancel
    };

    return exports;
});
