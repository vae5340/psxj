define([
    'module',
    'dojo/json',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/query',
    'dojo/string',
    'dojo/dom-construct',
    'dojo/dom-style',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'drainage-model/lib/resource-loader',
    'drainage-model/lib/basic-utils',
    'system-jslib/echarts/echarts',
    './../lib/very-simple-legend-panel',
    './../lib/map-utils'
], function(
    module,
    JSON,
    lang,
    request,
    query,
    string,
    domConstruct,
    domStyle,
    ArcGISDynamicMapServiceLayer,
    Extent,
    Point,
    resourceLoader,
    basicUtils,
    echarts,
    LegendPanel,
    mapUtils
){
    'use strict';
    var map,
        exports,
        constants = {},
        resources = {
            'CSS': '../../css/swmm-assessment.css'
        },
        templates = {
            'main': ""+
                "<div class=\"swmm-assessment\">"+
                  "<div class=\"swmm-assessment-header\">"+
                  "</div>"+
                 "<div class=\"swmm-assessment-table-wrapper\">"+
                  "<table class=\"swmm-assessment-table\"></table>"+
                 "</div>"+
                "</div>",
            'tableRow': ""+
                "<tr></tr>",
            'tableHeaderCell': ""+
                "<th data-fieldId=\"${name}\">${value}</th>",
            'tableBodyCell': ""+
                "<td data-fieldId=\"${name}\">${value}</td>",
            'chartContainer': ""+
                "<div class=\"assessment-chart-container\" data-name=\"${name}\"></div>",
            'resultHeader': ""+
                "<div class=\"assessment-result-header\">"+
                 "<>"+
                "</div>",
            'header': ""+
                "<ul>"+
                 "<li>工程名称：${projectname}</li>"+
                 "<li>方案名称：${schemename}</li>"+
                 "<li>降雨强度:${tsname}</li>"+
                "</ul>",
            'legendWrapper': ""+
                "<div class=\"swmm-assessment-legend-wrapper\">"+
                "</div>"
        },
        eventHandlers = {},
        eventHandlerMap = {},
        configMap = {
            'jsPanelId': 'swmm-assessment-jspanel',
            'jsPanelPosition': {
                'my': 'left-bottom',
                'at': 'left-bottom',
                'offsetX': 0
            },
            'jsPanelSize': {
                'width': 300,
                'height': 400
            },
            'jsPanelMinimizedMargin': {
                'left': 300
            },
            'jsPanelHeaderTitle': '内涝范围与排水能力分析结果',
            'legendTitle': '积水深度（cm）图例',
            'legendStops': [
                { 'color': '#FFCCCC', 'name': '0 - 10' },
                { 'color': '#FFB8B0', 'name': '10 - 20' },
                { 'color': '#FFA496', 'name': '20 - 30' },
                { 'color': '#FF907D', 'name': '30 - 40' },
                { 'color': '#FA7D66', 'name': '40 - 50' },
                { 'color': '#F7684F', 'name': '50 - 60' },
                { 'color': '#F2553D', 'name': '60 - 70' },
                { 'color': '#EB412A', 'name': '70 - 80' },
                { 'color': '#E32817', 'name': '80 - 90' },
                { 'color': '#DB0000', 'name': '90 - 100' }
            ]
        },
        assessmentModel = (function(){
            var numberToFixedFormatterFactory,
                gongqing2sqkmFormatter;
            
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

            gongqing2sqkmFormatter = function(value){//公顷换算成平方公里
                return numberToFixedFormatterFactory(2)(value / 100);
            };

            return {
                'name': '内涝范围与排水能力分析结果',
                'displayFields': [
                    /*'projectid', 'projectname', 'schemename', 'tsname', */'linelength', 'lineoverloadlength', 'modelearea', 'waterarea', 'totalprecipitation', 'totalinfiltration', 'totalrunoff', 'totalfinalsurfacestorage', 'runoffcoeff'
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
                    'tsname': {
                        'id': 'tsname',
                        'name': '降雨强度',
                        'displayFormatter': function(){
                            if(stateMap.curProject && stateMap.curProject.timeseries){
                                return stateMap.curProject.timeseries.tsname || '';
                            }
                            return '';
                        }
                    },
                    'linelength': {
                        'id': 'linelength',
                        'name': '管线总长度（m）',
                        'displayFormatter': numberToFixedFormatterFactory(2)
                    },
                    'lineoverloadlength':{
                        'id': 'lineoverloadlength',
                        'name': '超载长度（m）',
                        'displayFormatter': function(value, item){
                            var valInStr = numberToFixedFormatterFactory(2)(value),
                                total = item[assessmentModel.fields.linelength.id],
                                perc = value / total,
                                str = "";
                            if(basicUtils.isNumber(valInStr)){
                                str += valInStr;
                            }
                            if(basicUtils.isNumber(perc)){
                                str += "("+numberToFixedFormatterFactory(2)(perc * 100)+"%)";
                            }
                            return str;
                        }
                    },
                    'modelearea': {
                        'id': 'modelearea',
                        'name': '建模面积（km²）',
                        'displayFormatter': gongqing2sqkmFormatter
                    },
                    'waterarea': {
                        'id': 'waterarea',
                        'name': '积水面积（km²）',
                        'displayFormatter': function(value, item){
                            var valInStr = gongqing2sqkmFormatter(value),
                                total = item[assessmentModel.fields.modelearea.id],
                                perc = value / total,
                                str = "";
                            if(basicUtils.isNumber(valInStr)){
                                str += valInStr;
                            }
                            if(basicUtils.isNumber(perc)){
                                str += "("+numberToFixedFormatterFactory(2)(perc * 100)+"%)";
                            }
                            return str;
                        }
                    },
                    'totalprecipitation': {
                        'id': 'totalprecipitation',
                        'name': '总降雨量（mm）',
                        'displayFormatter': numberToFixedFormatterFactory(2)
                    },
                    'totalinfiltration': {
                        'id': 'totalinfiltration',
                        'name': '总下渗量（mm）',
                        'displayFormatter': function(value, item){
                            var valInStr = numberToFixedFormatterFactory(2)(value),
                                total = item[assessmentModel.fields.totalprecipitation.id],
                                perc = value / total,
                                str = "";
                            if(basicUtils.isNumber(valInStr)){
                                str += valInStr;
                            }
                            if(basicUtils.isNumber(perc)){
                                str += "("+numberToFixedFormatterFactory(2)(perc * 100)+"%)";
                            }
                            return str;
                        }
                    },
                    'totalrunoff': {
                        'id': 'totalrunoff',
                        'name': '总径流量（mm）',
                        'displayFormatter': function(value, item){
                            var valInStr = numberToFixedFormatterFactory(2)(value),
                                total = item[assessmentModel.fields.totalprecipitation.id],
                                perc = value / total,
                                str = "";
                            if(basicUtils.isNumber(valInStr)){
                                str += valInStr;
                            }
                            if(basicUtils.isNumber(perc)){
                                str += "("+numberToFixedFormatterFactory(2)(perc * 100)+"%)";
                            }
                            return str;
                        }
                    },
                    'totalfinalsurfacestorage': {
                        'id': 'totalfinalsurfacestorage',
                        'name': '总洼蓄量（mm）',
                        'displayFormatter': function(value, item){
                            var valInStr = numberToFixedFormatterFactory(2)(value),
                                total = item[assessmentModel.fields.totalprecipitation.id],
                                perc = value / total,
                                str = "";
                            if(basicUtils.isNumber(valInStr)){
                                str += valInStr;
                            }
                            if(basicUtils.isNumber(perc)){
                                str += "("+numberToFixedFormatterFactory(2)(perc * 100)+"%)";
                            }
                            return str;
                        }
                    },
                    'runoffcoeff': {
                        'id': 'runoffcoeff',
                        'name': '径流系数',
                        'displayFormatter': numberToFixedFormatterFactory(3)
                    }
                }
            };
        })(),
        queryMap = {},
        stateMap,
        //----
        jsPanelCloseHandler,
        mapResizeHandler,
        //----
        addPipeLengthPipeChart,
        addRainfallPipeChart,
        addWaterPipeChart,
        addWaterPortionChart,
        //----
        getLayerInfo,
        addFloodedAreaLayer,
        updateJsPanelTitle,
        loadAssessment,
        destroyFloodedAreaLayer,
        initHeader,
        initTable,
        initDom,
        destroyDom,
        loadResources,
        //----
        emit,
        init,
        use,
        cancel;

    addPipeLengthPipeChart = function(){
        if(!queryMap || !queryMap.chartWrapper  || !stateMap || !stateMap.assessment){
            return;
        }
        var container,
            option = {
                'title': {
                    'text': '超载管线长度统计（m）'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{c}m ({d}%)"
                },
                grid: {
                    'top': 40
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 'bottom',
                    data: ['超载长度', '非超载长度']
                },
                series: [
                    {
                        name: '超载管线长度',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        'label': {
                            'normal': {
                                'position': 'inside'
                            }
                        },
                        data:[
                            {
                                value: stateMap.assessment.lineoverloadlength.toFixed(2),
                                name:'超载长度',
                                itemStyle: {
                                    normal: {
                                        color: '#FF0000'
                                    }
                                }
                            },
                            {
                                value: (stateMap.assessment.linelength - stateMap.assessment.lineoverloadlength).toFixed(2),
                                name:'非超载长度',
                                itemStyle: {
                                    normal: {
                                        color: '#009500'
                                    }
                                }
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        container = domConstruct.toDom(string.substitute(templates.chartContainer, {
            'name': '超载管线长度统计'
        }));

        domConstruct.place(container, queryMap.chartWrapper);
        domStyle.set(container, {
            'width': queryMap.table.offsetWidth + 'px',
            'height': (configMap.jsPanelSize.height / 2 - 40) + 'px'
        });
        
        window.setTimeout(function(){
            if(queryMap){
                queryMap.pipeLengthPipeChart = echarts.init(container);
                queryMap.pipeLengthPipeChart.setOption(option);
            }
        }, 0);
    };

    addRainfallPipeChart = function(){
        if(!queryMap || !queryMap.chartWrapper || !stateMap || !stateMap.assessment){
            return;
        }
    };

    addWaterPipeChart = function(){
        if(!queryMap || !queryMap.chartWrapper || !stateMap || !stateMap.assessment){
            return;
        }
        var container,
            option = {
                'title': {
                    'text': '积水面积统计（km²）'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{c}km² ({d}%)"
                },
                grid: {
                    'top': 40
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 'bottom',
                    data: ['无积水', '积水']
                },
                series: [
                    {
                        name: '积水面积',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        'label': {
                            'normal': {
                                'position': 'inside'
                            }
                        },
                        data:[
                            {
                                value: (stateMap.assessment.waterarea / 100).toFixed(2),
                                name:'积水',
                                itemStyle: {
                                    normal: {
                                        color: '#FF0000'
                                    }
                                }
                            },
                            {
                                value: ((stateMap.assessment.modelearea - stateMap.assessment.waterarea) / 100).toFixed(2),
                                name:'无积水',
                                itemStyle: {
                                    normal: {
                                        color: '#009500'
                                    }
                                }                                
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        container = domConstruct.toDom(string.substitute(templates.chartContainer, {
            'name': '积水面积统计'
        }));

        domConstruct.place(container, queryMap.chartWrapper);

        domStyle.set(container, {
            'width': queryMap.table.offsetWidth + 'px',
            'height': (configMap.jsPanelSize.height / 2 - 40) + 'px'
        });
        
        window.setTimeout(function(){
            if(queryMap){
                queryMap.waterPipeChart = echarts.init(container);
                queryMap.waterPipeChart.setOption(option);
            }
        });
    };

    addWaterPortionChart = function(){
        if(!queryMap || !queryMap.chartWrapper || !stateMap || !stateMap.assessment){
            return;
        }
        var container,
            option = {
                'title': {
                    'text': '积水深度百分比统计'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{c}km² ({d}%)"
                },
                grid: {
                    'top': 40
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 'bottom',
                    data: ['无积水', '积水']
                },
                series: [
                    {
                        name: '积水面积',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        'label': {
                            'normal': {
                                'position': 'inside'
                            }
                        },
                        data:[
                            {
                                value: (stateMap.assessment.waterarea / 100).toFixed(2),
                                name:'积水',
                                itemStyle: {
                                    normal: {
                                        color: '#FF0000'
                                    }
                                }
                            },
                            {
                                value: ((stateMap.assessment.modelearea - stateMap.assessment.waterarea) / 100).toFixed(2),
                                name:'无积水',
                                itemStyle: {
                                    normal: {
                                        color: '#009500'
                                    }
                                }                                
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        container = domConstruct.toDom(string.substitute(templates.chartContainer, {
            'name': '积水面积统计'
        }));

        domConstruct.place(container, queryMap.chartWrapper);

        domStyle.set(container, {
            'width': queryMap.table.offsetWidth + 'px',
            'height': (configMap.jsPanelSize.height / 2 - 40) + 'px'
        });
        
        window.setTimeout(function(){
            if(queryMap){
                queryMap.waterPipeChart = echarts.init(container);
                queryMap.waterPipeChart.setOption(option);
            }
        });
    };
    
    mapResizeHandler = function(){
        if(queryMap && queryMap.jsPanel){
            queryMap.jsPanel.reposition(configMap.jsPanelPosition);
        }
    };

    jsPanelCloseHandler = function(event, id){
        if(id == configMap.jsPanelId && (stateMap && !stateMap.doNotTriggerCloseEvent)){
            stateMap.doNotTriggerCloseEvent = false;
            cancel(true);
            $(document).unbind('jspanelbeforeclose', jsPanelCloseHandler);
        }
    };

    updateJsPanelTitle = function(text, afterTime){
        if(queryMap && queryMap.jsPanel){
            if(basicUtils.isNumber(afterTime) && afterTime >= 0){
                window.setTimeout(function(){
                    if(queryMap && queryMap.jsPanel){
                        queryMap.jsPanel.headerTitle(text, afterTime);
                    }
                }, afterTime);
            }else{
                queryMap.jsPanel.headerTitle(text);
            }
        }
    };

    getLayerInfo = function(callback){
        updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(正在加载内涝范围图层信息)');
        request(configMap.serviceApis.floodedAreaServiceUrl+'/'+stateMap.curProject.schemename+'/MapServer', {
            'handleAs': 'json',
            'query': {
                'f': 'pjson'
            },
            'headers': {
                'X-Requested-With': ''
            }
        }).then(function(response){
            if(!response || !response.layers){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(加载内涝范围图层信息失败)');
                return;
            }
            updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(加载内涝范围图层信息成功)');
            if(callback && callback.apply){
                callback.apply(null, [response]);
            }
        }, function(){
            updateJsPanelTitle(configMap.jsPanelHeaderTitle+'(加载内涝范围图层信息失败)');
        });
    };

    addFloodedAreaLayer = function(){
        getLayerInfo(function(layerInfo){
            if(!layerInfo || !layerInfo.layers){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(未找到当前方案的内涝范围图层)");
                return;
            }
            var i, layer, subLayerIds, found;
            found = false;
            for(i=0;i<layerInfo.layers.length;i++){
                layer = layerInfo.layers[i];
                if(layer.name == stateMap.curProject.projectid){
                    found = true;
                    break;
                }
            }
            if(!found){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(未找到当前工程的内涝范围图层)");
                return;
            }
            request(configMap.serviceApis.floodedAreaServiceUrl+'/'+stateMap.curProject.schemename+'/MapServer/'+layer.id, {
                'handleAs': 'json',
                'headers': {
                    'X-Requested-With': ''
                },
                'query': {
                    'f': 'pjson'
                }
            }).then(function(layerDef){
                var tmpEvent;
                if(layerDef && layerDef.extent){
                    stateMap.floodedAreaLayer = new ArcGISDynamicMapServiceLayer(configMap.serviceApis.floodedAreaServiceUrl+'/'+stateMap.curProject.schemename+'/MapServer', {
                        'opacity': 0.7
                    });
                    stateMap.floodedAreaLayer.setVisibleLayers([layer.id]);
                    map.addLayer(stateMap.floodedAreaLayer);
                    tmpEvent = stateMap.floodedAreaLayer.on('load', function(){
                        var extentWidth;
                        if(tmpEvent){
                            tmpEvent.remove();
                            map.setExtent(new Extent(layerDef.extent));
                        }
                    });
                }
            });
        });
    };

    loadAssessment = function(callback){
        updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(正在加载分析结果)");
        return request(configMap.serviceApis.assessment, {
            'method': 'POST',
            'handleAs': 'json',
            'data': {
                'projectid': stateMap.curProject.projectid,
                'projectname': encodeURIComponent(stateMap.curProject.projectname)
            }
        }).then(function(response){
            if(!response){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(分析结果加载失败，请重试)");
            }
            if(!response.result){
                updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(未找到当前工程的分析结果)");
            }
            stateMap.assessment = response.result;
            updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(分析结果加载成功)");
            updateJsPanelTitle(configMap.jsPanelHeaderTitle, 2000);
            if(callback && callback){
                callback.apply(null, []);
            }
        }, function(){
            updateJsPanelTitle(configMap.jsPanelHeaderTitle+"(分析结果加载失败，请重试)");
        });
    };

    destroyFloodedAreaLayer = function(){
        if(stateMap && stateMap.floodedAreaLayer){
            map.removeLayer(stateMap.floodedAreaLayer);
            delete stateMap.floodedAreaLayer;
        }
    };

    initHeader = function(){
        if(!stateMap || !stateMap.assessment || !queryMap.header){
            return;
        }
        var domStr, domNode;
        domStr = string.substitute(templates.header, {
            'projectname': stateMap.curProject.projectname,
            'schemename': stateMap.curProject.schemename,
            'tsname': stateMap.curProject.timeseries.tsname
        });
        domNode = domConstruct.toDom(domStr);
        domConstruct.place(domNode, queryMap.header);
    };

    initTable = function(){
        if(!stateMap.assessment || !queryMap.table){
            return;
        }
        var field, fieldName, row, headerCell, bodyCell, i, value;
        for(i=0;i<assessmentModel.displayFields.length;i++){
            fieldName = assessmentModel.displayFields[i];
            field = assessmentModel.fields[fieldName];
            value = stateMap.assessment[fieldName];
            value = field.displayFormatter?field.displayFormatter(value, stateMap.assessment): assessmentModel.defaultFieldDisplayFormatter(value, stateMap.assessment);
            row = domConstruct.toDom(templates.tableRow);

            headerCell = domConstruct.toDom(string.substitute(templates.tableHeaderCell, {
                'name': fieldName,
                'value': field.name
            }));

            bodyCell = domConstruct.toDom(string.substitute(templates.tableBodyCell, {
                'name': fieldName,
                'value': value
            }));

            domConstruct.place(headerCell, row);
            domConstruct.place(bodyCell, row);

            domConstruct.place(row, queryMap.table);
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
            'headerTitle': configMap.jsPanelHeaderTitle,
            'contentSize': configMap.jsPanelSize,
            'position': configMap.jsPanelPosition,
            'minimizedMargin': configMap.jsPanelMinimizedMargin
        });

        queryMap.parent = map.root.parentNode;
        queryMap.main = query('.swmm-assessment', queryMap.jsPanel[0])[0];
        queryMap.tableWrapper = query('.swmm-assessment-table-wrapper', queryMap.main)[0];
        queryMap.table = query('.swmm-assessment-table', queryMap.tableWrapper)[0];
        queryMap.chartWrapper = queryMap.main;
        queryMap.header = query('.swmm-assessment-header', queryMap.main)[0];

        queryMap.legendWrapper = domConstruct.toDom(templates.legendWrapper);
        domConstruct.place(queryMap.legendWrapper, queryMap.parent);

        queryMap.legend = new LegendPanel(queryMap.legendWrapper, {
            'title': configMap.legendTitle,
            'stops': configMap.legendStops
        });

        $(document).bind('jspanelbeforeclose', jsPanelCloseHandler);
        eventHandlerMap.resizeMap = map.on('resize', mapResizeHandler);
    };
    
    destroyDom = function(fromEvent){
        if(eventHandlerMap && eventHandlerMap.resizeMap){
            eventHandlerMap.resizeMap.remove();
            delete eventHandlerMap.resizeMap;
        }
        if(queryMap && queryMap.legend){
            queryMap.legend.destroy();
            delete queryMap.legend;
        }
        if(queryMap && queryMap.legendWrapper){
            domConstruct.destroy(queryMap.legendWrapper);
            delete queryMap.legendWrapper;
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

    loadResources = function(){
        var dir = resourceLoader.getDojoModuleLocation(module);
        resourceLoader.addCSSFile(resources.CSS, dir);
    };


    emit = function(eventName, eventObject){
        if(eventName && eventHandlers[eventName]){
            return eventHandlers[eventName].apply(null, eventObject || {});
        }
        return true;
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }

        map = _map;
        
        lang.mixin(configMap, options);
        lang.mixin(eventHandlers, options.eventHandlers || {});

        configMap.jsPanelSize.height = map.root.parentNode.offsetHeight - 135;

        loadResources();
    };

    use = function(options){
        options = options || {};

        if(!options.curProject){
            return;
        }

        if(stateMap){
            cancel(false, true);
        }
        stateMap = {};

        stateMap.curProject = options.curProject;

        lang.mixin(configMap.serviceApis, options.featureServiceUrls || {});

        initDom();

        loadAssessment(function(){
            initHeader();
            initTable();
            addFloodedAreaLayer();
        }).then(addPipeLengthPipeChart).
            then(addRainfallPipeChart).
            then(addWaterPipeChart).
            then(addWaterPortionChart);
    };

    cancel = function(fromEvent, skipEmit){
        var prevProject = stateMap.curProject;
        destroyDom(fromEvent);
        destroyFloodedAreaLayer();
        stateMap = null;
        if(!skipEmit){
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
