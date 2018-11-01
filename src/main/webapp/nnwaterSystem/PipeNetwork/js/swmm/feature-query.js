define([
    'module',
    'dojo/string',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/query',
    'dojo/on',
    'dojo/request',
    'esri/graphic',
    'esri/Color',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/layers/GraphicsLayer',
    'drainage-model/lib/resource-loader',
    'system-jslib/echarts/echarts',
    'system-jslib/way-simple-time-utils',
    'drainage-model/lib/map-utils'
], function(
    module,
    string,
    array,
    lang,
    domConstruct,
    domAttr,
    domStyle,
    query,
    on,
    request,
    Graphic,
    Color,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    IdentifyTask,
    IdentifyParameters,
    GraphicLayer,
    resourceLoader,
    echarts,
    timeUtils,
    mapUtils
){
    'use strict';
    var map,
        exports,
        resources = {
            'CSS': '../../css/swmm-feature-query.css'
        },
        constants = {
            'FEATURE_TYPE_LINE': 'line',
            'FEATURE_TYPE_NODE': 'node',
            'QUERY_TYPE_NODE_WATER_DEPTH': 'nodeWaterDepth',
            'QUERY_TYPE_LINE_WATER_DEPTH': 'lineWaterDepth',
            'QUERY_TYPE_LINE_FLOW_SPEED': 'lineWaterFlowSpeed',
            'QUERY_TYPE_LINE_FLOW_AMOUNT': 'lineWaterFlowAmount'
        },
        nameMaps = {
            'featureTypeNameMap': (function(){
                var nameMap = {};
                nameMap[constants.FEATURE_TYPE_LINE] = '管';
                nameMap[constants.FEATURE_TYPE_NODE] = '井';
                return nameMap;
            })(),
            'queryTypeNameMap': (function(){
                var nameMap = {};
                nameMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = '水深';
                nameMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = '水深';
                nameMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = '流速';
                nameMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = '流量';
                return nameMap;
            })()
        },
        unitMaps = {
            'queryTypeUnitMap': (function(){
                var unitMap = {};
                unitMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = '米';
                unitMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = '米';
                unitMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = '米/秒';
                unitMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = '立方米/秒';
                return unitMap;
            })()
        },
        valueFieldMaps = {
            'queryTypeValueFieldMap': (function(){
                var valueFieldMap = {};
                valueFieldMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = 'depth';
                valueFieldMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = 'depth';
                valueFieldMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = 'velocity';
                valueFieldMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = 'flow';
                return valueFieldMap;
            })()
        },
        apiMaps = {
            'queryTypeApiMap': null
        },
        symbolMaps = {
            'queryTypeSymbolMap': (function(){
                var symbolMap = {},
                    lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 3),
                    markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25]));
                symbolMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = markerSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = lineSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = lineSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = lineSymbol;
                return symbolMap;
            })(),
            'queryTypeHighlightSymbolMap': (function(){
                var symbolMap = {},
                    lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
                    markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.25]));
                symbolMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = markerSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = lineSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = lineSymbol;
                symbolMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = lineSymbol;
                return symbolMap;
            })()
        },
        configMap = {
            'showRainfall': true,
            'chartType': 'line',
            'jsPanelId': 'swmm-feature-query-jspanel',
            'jsPanelSize': {
                'width': 900,
                'height': 300
            }
        },
        stateMap = {},
        eventHandlers = {},
        eventHandlerMap = {},
        templates = {
            'main': ""+
                "<div class=\"swmm-feature-query\">"+
                 "<div class=\"swmm-feature-query-control-panel\">"+
                  "<div class=\"control-panel-form\">"+
                   "<div class=\"form-title\">选项</div>"+
                   "<label>图表类型&nbsp;"+
                "<select name=\"chartType\">"+
//                     "<option value=\"bar\">柱状图</option>"+
                     "<option value=\"line\">折线图</option>"+
                     "<option value=\"area\">面积图</option>"+
                    "</select>"+
                   "</label>"+
                   "<label>"+
                    "<input name=\"showRainfall\" type=\"checkbox\"/>&nbsp;显示降雨量"+
                   "</label>"+
                  "</div>"+
                  "<div class=\"control-panel-feature-list-wrapper\">"+
                   "<div class=\"feature-list-title\">选择要素</div>"+
                   "<ul class=\"feature-list\">"+
                   "</ul>"+
                  "</div>"+
                 "</div>"+
                 "<div class=\"swmm-feature-query-result-panel\">"+
                  "<div class=\"chart-wrapper\"></div>"+
                 "</div>"+
                "</div>",
            'featureListItem': ""+
                "<li>${value}<a href=\"#\" data-role=\"remove\">移除</a></li>"
        },
        queryMap,
        graphicLayer,
        //----
        unhighlightGraphic,
        //----
        prepareData,
        newSeries,
        addFeatureListItem,
        addChartSeries,
        addFeature,
        loadTimeseries,
        loadFeatureTimeseries,
        addGraphicOnMap,
        //----
        clickFeatureListItemHandler,
        removeFeatureHandler,
        jsPanelResizeHandler,
        jsPanelCloseHandler,
        chartTypeChangeHandler,
        toggleShowRainfallHandler,
        mapResizeHandler,
        //----
        initGraphicLayer,
        destroyGraphicLayer,
        initChart,
        initPicker,
        destroyPicker,
        initDom,
        destroyDom,
        //----
        loadResources,
        use,
        cancel,
        init,
        emit;
    
    newSeries = function(chartType){
        var series = {
            'showSymbol': false
        };
        switch(chartType){
	        case 'line':
	            series.type = 'line';
	            series.smooth = true;
	            break;
	        case 'bar':
	            series.type = 'bar';
	            break;
	        case 'area':
	            series.type = 'line';
	            series.smooth = true;
	            series.areaStyle = {
	                'normal': {}
	            };
	            break;
	        default:
	            return null;
        }
        return series;
    };

    loadFeatureTimeseries = function(featureItem, callback){
        if(stateMap && stateMap.curProject){
            var inpcode = featureItem.feature.feature.attributes.INPCODE,
                projectid = stateMap.curProject.projectid,
                projectname = stateMap.curProject.projectname;
            request(apiMaps.queryTypeApiMap[stateMap.queryType], {
                'method': 'POST',
                'data': {
                    'inpcode': inpcode,
                    'projectid': projectid,
                    'projectname': encodeURIComponent(projectname),
                    'page.pageNo': 1,
                    'page.pageSize': 99999999
                },
                'handleAs': 'json'
            }).then(function(response){
                var hasResult = false;
                if(response && response.result){
                    featureItem.timeseries  = response;
                    hasResult = true;
                }
                if(callback && callback.apply){
                    callback.apply(null, [hasResult]);
                }
            });
        }
    };

    addGraphicOnMap = function(featureItem){
        var geometry, graphic;
        if(graphicLayer){
            geometry = featureItem.feature.feature.geometry;
            graphic = new Graphic(geometry, symbolMaps.queryTypeSymbolMap[stateMap.queryType]);
            featureItem.graphic = graphic;
            graphicLayer.add(graphic);
        }
    };

    initGraphicLayer = function(){
        if(graphicLayer){
            destroyGraphicLayer();
        }
        graphicLayer = new GraphicLayer();
        map.addLayer(graphicLayer);
    };

    destroyGraphicLayer = function(){
        if(!graphicLayer){
            return;
        }
        graphicLayer.clear();
        map.removeLayer(graphicLayer);
        graphicLayer = null;
    };

    initChart = function(){
        var options, i, value, item,
            timeseriesData = [];
        
        for(i=0;i<stateMap.timeseries.values.length;i++){
            item = stateMap.timeseries.values[i];
            timeseriesData.push([
//                i * stateMap.timeseries.timestepInSecs,
                new Date(stateMap.curProject.simstarttimeInMills + i * stateMap.timeseries.timestepInSecs * 1000).toString(),
                item.value
            ]);
        }

        options = {
            'title': {
                'text': stateMap.queryName
            },
            'tooltip': {
                'trigger': 'axis',
                'formatter': function(paramArr){
                    var timeStr;                        
                    if(paramArr[0].dataIndex>0&&paramArr.length>1)    
                        timeStr= paramArr[1].data[0];
                    else
                        timeStr= paramArr[0].data[0];
                     var xText = '',
                        params,
                        date;
                    xText += timeUtils.formatTimeStrFromMill(new Date(timeStr).getTime(), 'yyyy/MM/dd hh:mm');
                    for(var i=0;i<paramArr.length;i++){
                        if(paramArr[i].data[1] - 0 > 0){
                            xText += "<br/>"+paramArr[i].seriesName+":"+paramArr[i].data[1].toFixed(2);
                        }
                    }
                    return xText;
                }
            },
            'legend': {
                'data': [],
                'orient': 'vertical',
                'right': 5
            },
            'grid': {
                'top': '10%',
                'left': '60px',
                'right': '220px',
                'bottom': '10px',
                'show': true,
                'containLabel': true
            },
            'xAxis': [
                {
                    'type': 'time',
                    'name': '',
                    'nameGap': 50
                }
            ],
            'yAxis': [
                {
                    'type': 'value',
                    'name': '降雨量(mm)',
                    'nameLocation': 'middle',
                    'nameGap': 40,
                    'inverse': true
                },
                {
                    'type': 'value',
                    'name': nameMaps.queryTypeNameMap[stateMap.queryType]+'('+unitMaps.queryTypeUnitMap[stateMap.queryType]+')',
                    'nameLocation': 'middle',
                    'nameRotate': 90,
                    'nameGap': 40
                }
            ],
            'series': [
                {
                    'name': '降雨量',
                    'type': 'line',
                    'showSymbol': false,
                    'areaStyle': {
                        'normal': {
                            'color': '#69EEFD'
                        }
                    },
                    'data': timeseriesData,
                    'yAxisIndex': 0,
                    'xAxisIndex': 0,
                    'itemStyle': {
                        'normal': {
                            'color': '#66EEFD'
                        }
                    }
                }
            ]
        };

        queryMap.chart = echarts.init(queryMap.chartWrapper);
        queryMap.chart.setOption(options);
        queryMap.chart.on('mouseover', function(event){
            console.log('mouseover chart');
            console.log(event);
        });
        queryMap.chart.on('legendselectchanged', function(event){
            console.log(event);
        });
        queryMap.chart.on('dblclick', function(event){
            console.log('dblclick');
            console.log(event);
        });
    };

    prepareData = function(){
        var timePart = stateMap.timeseries.timestep.split(':'),
            factors = [3600, 60, 1],
            seconds = 0,
            i, index, digit, factor;
        for(i=0; i< timePart.length; i++){
            digit = parseInt(timePart[i]);
            factor = factors[i];
            seconds += digit * factor;
        }
        if(!isNaN(seconds)){
            stateMap.timeseries.timestepInSecs = seconds;
        }
    };

    loadTimeseries = function(callback){
        request(configMap.serviceApis.timeseries, {
            'handleAs': 'json',
            'query': {
                'id': stateMap.curProject.timeseries.id,
                'page.pageNo': 1,
                'page.pageSize': 99999999
            }
        }).then(function(response){
            if(!response){
                alert('加载降雨数据失败，请重试！');
                cancel();
                return;
            }
           
            stateMap.timeseries = response;

            if(callback && callback.apply){
                callback.apply(null, []);
            }
        }, function(){
            alert('加载降雨数据失败，请重试！');
            cancel();
        });
    };

    addFeatureListItem = function(item){
        if(!item){
            return false;
        }
        var exists = (function(item){
            var mark = false;
            array.forEach(stateMap.features, function(featureItem){
                if(item.feature.feature.attributes.INPCODE == featureItem.feature.feature.attributes.INPCODE){
                    mark = true;
                }
            });
            return mark;
        })(item);
        if(exists){
//            alert("该要素已选");
            return false;
        }
        var listItem = domConstruct.toDom(string.substitute(templates.featureListItem, {
            'value': item.feature.feature.attributes.INPCODE
        }));

        listItem.item = item;
        item.listItem = listItem;
        
        domConstruct.place(listItem, queryMap.featureList);
        return true;
    };

    addChartSeries = function(item){
        var chartOptions = queryMap.chart.getOption(),
            timeseries = item.timeseries.result,
            series, i;
        series = newSeries(stateMap.chartType);
        if(!series){
            alert('不支持的图表类型: '+stateMap.chartType+'！');
            return;
        }
        series.yAxisIndex = 1;
        series.xAxisIndex = 0;

        series.data = [];
        series.name = item.feature.feature.attributes.INPCODE;

        for(i=0;i<timeseries.length;i++){
            series.data.push([
                new Date(stateMap.curProject.simstarttimeInMills + timeseries[i].time * stateMap.curProject.reportstep * 1000).toString(),
                timeseries[i][valueFieldMaps.queryTypeValueFieldMap[stateMap.queryType]]
            ]);
        }

        chartOptions.series.push(series);
        chartOptions.legend[0].data.push(series.name);

        queryMap.chart.setOption(chartOptions);
    };

    addFeature = function(feature){
        var item = {
            'feature': feature,
            'data': null
        };
        loadFeatureTimeseries(item, function(hasResult){
            if(!hasResult){
                alert("该要素无数据");
                domStyle.set("mapDiv_container", "cursor", "default");
                return;
            }
            if(addFeatureListItem(item)){
                addChartSeries(item);
                stateMap.features.push(item);
                addGraphicOnMap(item);
                domStyle.set("mapDiv_container", "cursor", "default");
            }
        });
    };

    unhighlightGraphic = function(){
        if(stateMap.highlightedGraphic){
            stateMap.highlightedGraphic.setSymbol(symbolMaps.queryTypeSymbolMap[stateMap.queryType]);
        }
    };

    clickFeatureListItemHandler = function(event){
        var itemDom = event.target,
            featureItem = itemDom.item,
            graphic = featureItem.graphic;
        unhighlightGraphic();
        if(graphic){
            graphic.setSymbol(symbolMaps.queryTypeHighlightSymbolMap[stateMap.queryType]);
            stateMap.highlightedGraphic = graphic;
            mapUtils.locateGraphicOnGraphicLayer(map, graphic, featureItem.feature.feature, true, graphicLayer, true);
        }
        event.stopPropagation();
    };

    removeFeatureHandler = function(event){
        var chartOption, featureItem, listItem;
        if(event && event.target && event.target.parentNode && event.target.parentNode.item){
            listItem = event.target.parentNode;
            featureItem = event.target.parentNode.item;
            domConstruct.destroy(listItem);
            if(featureItem.graphic){
                graphicLayer.remove(featureItem.graphic);
            }
            stateMap.features = array.filter(stateMap.features, function(item){
                return item !== featureItem;
            });
            if(queryMap && queryMap.chart){
                chartOption = queryMap.chart.getOption();
                chartOption.series = array.filter(chartOption.series, function(series){
                    return series.name != featureItem.feature.feature.attributes.INPCODE;
                });
                queryMap.chart.setOption(chartOption, true);
            }
        }
    };

    mapResizeHandler = function(){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.reposition({
                'my': 'center-bottom',
                'at': 'center-bottom',
                'offsetX': '-50px'
            });
        }
    };

    jsPanelResizeHandler = function(){
        if(queryMap.chart){
            queryMap.chart.resize();
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

    chartTypeChangeHandler = function(){
        stateMap.chartType = domAttr.get(queryMap.chartTypeSelect, 'value');
        var chartOptions, i, series;
        if(queryMap.chart){
            chartOptions = queryMap.chart.getOption();
            for(i=1;i<chartOptions.series.length;i++){
                series = chartOptions.series[i];
                if(stateMap.chartType == 'area'){
                    series.areaStyle = {
                        'normal': {}
                    };
                    series.type = 'line';
                }else{
                    series.areaStyle = null;
                    series.type = stateMap.chartType;
                }
            }
            queryMap.chart.setOption(chartOptions);
        }
    };

    toggleShowRainfallHandler = function(){
        stateMap.showRainfall = domAttr.get(queryMap.showRainfallCheckbox, 'checked');
        var chartOptions;
        if(queryMap && queryMap.chart){
            chartOptions = queryMap.chart.getOption();
            if(!stateMap.showRainfall){
                stateMap.rainfallSeries = chartOptions.series.shift();
            }else if(stateMap.rainfallSeries){
                chartOptions.series.unshift(stateMap.rainfallSeries);
            }
            queryMap.chart.setOption(chartOptions, true);
        }
    };

    destroyPicker = function(){
        if(eventHandlerMap.clickMap){
            eventHandlerMap.clickMap.remove();
            delete eventHandlerMap.clickMap;
        }
        if(eventHandlerMap.preventInfoWindow){
            stateMap.preventInfoWindow = false;
            eventHandlerMap.preventInfoWindow.remove();
            delete eventHandlerMap.preventInfoWindow;
        }
        if(stateMap && stateMap.picker){
            delete stateMap.picker;
        }
    };

    initPicker = function(){
        destroyPicker();
        stateMap.picker = {};
        (function(){
            stateMap.identifyParams = new IdentifyParameters();
            stateMap.identifyParams.tolerance = 3;
            stateMap.identifyParams.returnGeometry = true;
            stateMap.identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            stateMap.identifyParams.width = map.width;
            stateMap.identifyParams.height = map.height;
        })();

        stateMap.preventInfoWindow = true;

        eventHandlerMap.preventInfoWindow = map.infoWindow.on('show', function(event){
            !stateMap.preventInfoWindow || map.infoWindow.hide();
            return !stateMap.preventInfoWindow;
        });

        eventHandlerMap.clickMap = map.on('click', function(event){
            if(!event.mapPoint){
                return;
            }
            domStyle.set("mapDiv_container", "cursor", "wait");
            var point = event.mapPoint,
            identifyTask = new IdentifyTask(configMap.featureTypeToServiceUrl[stateMap.featureType]);
            stateMap.identifyParams.layerIds = configMap.featureTypeToLayerIds[stateMap.featureType];
            stateMap.identifyParams.geometry = point;
            stateMap.identifyParams.mapExtent = map.extent;
            identifyTask.execute(stateMap.identifyParams, function(identifyResult){
                if(identifyResult && identifyResult.length){
                    addFeature(identifyResult[0]);
                }else{
                   domStyle.set("mapDiv_container", "cursor", "default");
                   parent.layer.msg("请点选正确的要素类型",{icon:0});
                }
            });
        });
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
            'headerTitle': stateMap.queryName+'查询',
            'contentSize': configMap.jsPanelSize,
            'position': {
                'my': 'center-bottom',
                'at': 'center-bottom',
                'offsetX': '-50px'
            },
            'minimizedMargin': {
                'left': 300
            },
            'onmaximized': jsPanelResizeHandler,
            'onnormalized': jsPanelResizeHandler
        });

        queryMap.main = query('.swmm-feature-query', map.root.parentNode)[0];
        queryMap.controlPanel = query('.swmm-feature-query-control-panel', queryMap.main)[0];

        queryMap.controlPanelForm = query('.control-panel-form', queryMap.controlPanel)[0];
        queryMap.chartTypeSelect = query('select[name=chartType]', queryMap.controlPanelForm)[0];
        queryMap.showRainfallCheckbox = query('input[name=showRainfall]', queryMap.controlPanelForm)[0];
        
        queryMap.featureListWrapper = query('.control-panel-feature-list-wrapper', queryMap.controlPanel)[0];
        queryMap.featureList = query('.feature-list', queryMap.featureListWrapper)[0];

        queryMap.resultPanel = query('.swmm-feature-query-result-panel', queryMap.main)[0];

        queryMap.chartWrapper = query('.chart-wrapper', queryMap.resultPanel)[0];

        domAttr.set(queryMap.chartTypeSelect, 'value', stateMap.chartType);
        domAttr.set(queryMap.showRainfallCheckbox, 'checked', stateMap.showRainfall);

        $(document).bind('jspanelbeforeclose', jsPanelCloseHandler);
        $(queryMap.jsPanel).bind('resize', jsPanelResizeHandler);
        eventHandlerMap.resizeMap = map.on('resize', mapResizeHandler);

        eventHandlerMap.chartTypeChange = on(queryMap.chartTypeSelect, 'change', chartTypeChangeHandler);
        eventHandlerMap.toggleShowRainfall = on(queryMap.showRainfallCheckbox, 'click', toggleShowRainfallHandler);
        eventHandlerMap.removeFeature = on(queryMap.featureList, 'li a[data-role=remove]:click', removeFeatureHandler);
        eventHandlerMap.clickFatureListItem = on(queryMap.featureList, 'li:click', clickFeatureListItemHandler);
        eventHandlerMap.clickSpace = on(document, 'click', unhighlightGraphic);
    };

    destroyDom = function(){
        if(queryMap && queryMap.chart){
            queryMap.chart.dispose();
        }
        if(eventHandlerMap.chartTypeChange){
            eventHandlerMap.chartTypeChange.remove();
            delete eventHandlerMap.chartTypeChange;
        }
        if(eventHandlerMap.toggleShowRainfall){
            eventHandlerMap.toggleShowRainfall.remove();
            delete eventHandlerMap.toggleShowRainfall;
        }
        if(eventHandlerMap.clickSpace){
            eventHandlerMap.clickSpace.remove();
            delete eventHandlerMap.clickSpace;
        }
        if(eventHandlerMap.clickFeatureListItem){
            eventHandlerMap.clickFeatureListItem.remove();
            delete eventHandlerMap.clickFeatureListItem;
        }
        if(eventHandlerMap.removeFeature){
            eventHandlerMap.removeFeature.remove();
            delete eventHandlerMap.removeFeature;
        }
        if(eventHandlerMap.resizeMap){
            eventHandlerMap.resizeMap.remove();
            delete eventHandlerMap.resizeMap;
        }
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        queryMap = null;
    };

    emit = function(eventName, eventObject){
        if(eventName && eventHandlers[eventName]){
            return eventHandlers[eventName].apply(null, [eventObject || {}]);
        }
        return true;
    };

    loadResources = function(){
        var dir = resourceLoader.getDojoModuleLocation(module);
        resourceLoader.addCSSFile(resources.CSS, dir);
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
        lang.mixin(symbolMaps.queryTypeSymbolMap, configMap.symbols || {});

        configMap.featureTypeToServiceUrl = {};

        configMap.featureTypeToLayerIds = {};

        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_LINE] = configMap.layerIdMap[constants.FEATURE_TYPE_LINE];
        configMap.featureTypeToLayerIds[constants.FEATURE_TYPE_NODE] = configMap.layerIdMap[constants.FEATURE_TYPE_NODE];

        loadResources();

        apiMaps.queryTypeApiMap = (function(){
            var apiMap = {};
            apiMap[constants.QUERY_TYPE_NODE_WATER_DEPTH] = configMap.serviceApis.nodeWaterDepthTimeseries;
            apiMap[constants.QUERY_TYPE_LINE_WATER_DEPTH] = configMap.serviceApis.lineWaterDepthTimeseries;
            apiMap[constants.QUERY_TYPE_LINE_FLOW_SPEED] = configMap.serviceApis.lineFlowSpeedTimeseries;
            apiMap[constants.QUERY_TYPE_LINE_FLOW_AMOUNT] = configMap.serviceApis.lineFlowAmountTimeseries;
            return apiMap;
        })();
    };

    use = function(options){
        if(queryMap){
            cancel(false, true);
        }
        options = options || {};
        if(!options.featureType){
            throw "'featureType' is needed for use!";
        }
        if(!options.queryType){
            throw "'queryType' is needed for use!";
        }
        if(!options.curProject){
            throw "'curProject' is needed for use!";
        }
        if(!options.featureServiceUrls){
            throw "'featureServiceUrls' is needed for use!";
        }

        stateMap = {
            'features': []
        };

        lang.mixin(configMap.serviceApis, options.featureServiceUrls);

        stateMap.featureType = options.featureType;
        stateMap.queryType = options.queryType;
        stateMap.curProject = options.curProject;

        stateMap.chartType = configMap.chartType;
        stateMap.showRainfall = configMap.showRainfall;

        stateMap.queryName = nameMaps.featureTypeNameMap[stateMap.featureType]+nameMaps.queryTypeNameMap[stateMap.queryType];

        configMap.featureTypeToServiceUrl[constants.FEATURE_TYPE_LINE] = configMap.serviceApis.pipeServiceUrl;
        configMap.featureTypeToServiceUrl[constants.FEATURE_TYPE_NODE] = configMap.serviceApis.pipeNodeServiceUrl;

        loadTimeseries(function(){
            initDom();
            initGraphicLayer();
            initPicker();
            prepareData();
            initChart();
        });
        //TODO
    };

    cancel = function(fromEvent, skipEmit){
        if(!fromEvent && queryMap && queryMap.jsPanel){
            if(stateMap){
                stateMap.doNotTriggerCloseEvent = true;
            }
            queryMap.jsPanel.close(null, true, true);
        }
        var prevProject;
        if(stateMap){
            prevProject = stateMap.curProject;
        }
        destroyPicker();
        destroyGraphicLayer();
        destroyDom();
        stateMap = null;
        if(!skipEmit){
            emit('canceled', {
                'project': prevProject
            });
        }
        //TODO
    };

    exports = {
        'init': init,
        'use': use,
        'cancel': cancel
    };

    lang.mixin(exports, constants);

    return exports;
});
