define([
    'dojo/Deferred',
    'dojo/promise/all',
    'dojo/string',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/html',
    'dojo/on',
    'esri/tasks/FeatureSet',
    'esri/tasks/Geoprocessor',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/GraphicsLayer',
    "esri/layers/ImageParameters",
    'esri/geometry/Point',
    'esri/graphic',
    'esri/symbols/Font',
    'esri/Color',
    'esri/symbols/TextSymbol',
    'system-jslib/way-simple-time-utils',
    './../lib/very-simple-legend-panel'
], function(
    Deferred,
    all,
    string,
    array,
    lang,
    request,
    domConstruct,
    query,
    html,
    on,
    FeatureSet,
    Geoprocessor,
    ArcGISDynamicMapServiceLayer,
    ArcGISImageServiceLayer,
    GraphicsLayer,
    ImageParameters,
    Point,
    Graphic,
    Font,
    Color,
    TextSymbol,
    timeUtils,
    LegendPanel
){
    'use strict';
    var map,
        exports,
        configMap = {
            'useFakeData': false,//是否使用测试数据
            'fakeData': [0.2, 0.4, 0.55, 0.1, 0.2, 0.25, 1.4, 0.52, 0.35, 0.5, 1.2, 0.2, 0.6],//测试数据, 循环读取
            'serviceApis': {
                'userInfo': '/agsupport/om-user!getCurrentUserName.action',
                'realtimeDataByItemId': '/agsupport/rest/psitemdim/getItemDimRealData/${ITEMID}',
                'historyDataByItemId': '/agsupport/rest/psitemdim/getItemDimHistoryData/${ITEMID}',
                'allStation': '/agsupport/rest/pscomb/getAllMonitorStationNew',
                'rainfallModelServiceUrl': arcgisBaseUrl+'/arcgis/rest/services/RainfallModel7/GPServer/RainfallModel',
                'rainfallModelMapServiceUrl': arcgisBaseUrl+'/arcgis/rest/services/RainfallModel7/MapServer',
                'rainfallLegendImage': '/awater/nnwaterSystem/PipeNetwork/img/rainfall_legend.png'
            },
            'legendStops': [
                { 'color': '#FFFFFF', 'name': '0 - 0.1' },
                { 'color': '#00EBEB', 'name': '0.1 - 0.5' },
                { 'color': '#00A0F5', 'name': '0.5 - 1' },
                { 'color': '#0000F6', 'name': '1 - 2' },
                { 'color': '#00FE00', 'name': '2 - 5' },
                { 'color': '#00C900', 'name': '5 - 10' },
                { 'color': '#008F00', 'name': '10 - 15' },
                { 'color': '#FEFE00', 'name': '15 - 20' },
                { 'color': '#E3BD00', 'name': '20 - 30' },
                { 'color': '#FE8E00', 'name': '30 - 40' },
                { 'color': '#FE0000', 'name': '40 - 50' },
                { 'color': '#D40000', 'name': '50 - 60' },
                { 'color': '#BF0000', 'name': '70 - 80' },
                { 'color': '#FE00FE', 'name': '大于 80' }
            ],
            'stationFilter': function(station){
                return station && station.ITEMID && station.ORGDEPT == '南宁市城市管理局';
            },
            'gpServiceParamIndex': {
                'featureSetParam': 0,
                'valueFieldParam': 1,
                'result': 2
            },
            'gpServiceParams': {},
            'playInterval': 1000 * 60 * 10
        },
        templates = {
            'main': ""+
                "<div style=\"min-width: 232px; background: #FEFEFE; box-shadow: 0 0 5px #555555; width: auto; position: absolute; z-index: 10000000; bottom: 30px; right: 15px; padding: 10px; font-size: 1.2em; text-align: center;\"><span class=\"rainfall-model-title\">实时雨量图</span>&nbsp;<span style=\"font-size: 80%; opacity: 0.5;\">|</span>&nbsp;<a style=\"text-decoration: none; color: red;\" href=\"#\" data-role=\"close\">关闭</a><br/><span style=\"width: auto; margin: 0 10px 0 10px;\" data-role=\"updateTime\">加载中...</span><br/><hr style=\"margin: 5px 0 5px 0;\"/><div data-role=\"legendWrapper\"></div></div>",
            "legend": ""+
                "<div style=\"box-shadow: 0 0 5px #555555; width: 220px; height: auto; position: absolute; z-index: 10000000; top: 160px; left: 15px; text-align: center; background: #E5EFF7; padding: 5px 0 3px 0;\"><span style=\"font-size: 1.2em;\">降雨量图例（毫米）</span><img data-role=\"legend\" width=\"100%\"></div>",
            "content": ""+
                "更新时间 ${time}"
        },
        stateMap = {},
        queryMap = {},
        tmpMap = {},
        eventHandlerMap = {},
        graphicLayer,
        //----
        geoProcess,
        loadLatest,
        run,
        initLoad,
        loadUserInfo,
        loadStationInfo,
        filterStation,
        loadFeatureSet,
        createFeatureObject,
        //----
        addLabelToMap,
        updateInfo,
        initGraphicLayer,
        destroyGraphicLayer,
        initDom,
        destroyDom,
        //----
        addPointsToMap,
        updateInfoWithOptions,
        runOnce,
        addGridToMap,
        useByDefault,
        useWithOptions,
        optinal,
        historyTime,
        //goPlay,
        //----
        stop,
        start,
        use,
        cancel,
        init;
    
    run = function(){
        if(!stateMap){
            return;
        }
        if(!historyTime)
            stateMap.lastRunTime = new Date().getTime();
        else
            stateMap.lastRunTime = new Date(Date.parse(historyTime.replace(/-/g,"/"))).getTime();
        loadLatest(function(){
            geoProcess(function(){
                updateInfo();
                if(!stateMap.playing){
                    return;
                }
                var now = new Date().getTime();
                if(!historyTime){
	                if(now - stateMap.lastRunTime >= configMap.playInterval){
	                    window.setTimeout(run, 0);
	                }else{
	                    window.setTimeout(run, configMap.playInterval - (now - stateMap.lastRunTime));
	                }
                }else{
                    historyTime=null;
                }
            });
        });
    };
    
    loadUserInfo = function(){
        return request(configMap.serviceApis.userInfo, {
            'handleAs': 'json'
        }).then(function(response){
            if(response && response.UserId !== null && response.UserId !== undefined){
                stateMap.userInfo = response;
            }
        });
    };

    filterStation = function(response){
        if(!response || !response.total || !response.rows){
            return;
        }
        var stations = array.filter(response.rows, function(station){
            return configMap.stationFilter(station);
        });

        stateMap.stations = stations;
    };

    loadFeatureSet = function(){
        return request(configMap.serviceApis.rainfallModelServiceUrl, {
            'handleAs': 'json',
            'headers': {
                'X-Requested-With': ''
            },
            'query': {
                'f': 'pjson'
            }
        }).then(function(serviceInfo){
            if(!serviceInfo){
                return;
            }
            var featureSet = serviceInfo.parameters[configMap.gpServiceParamIndex.featureSetParam].defaultValue,
                valueField = serviceInfo.parameters[configMap.gpServiceParamIndex.valueFieldParam].defaultValue;
            stateMap.serviceParameters = {
                'featureSet': featureSet,
                'valueField': valueField
            };
            stateMap.serviceParamsDef = serviceInfo.parameters;
        });
    };

    addLabelToMap = function(){
        if(!graphicLayer || !stateMap.stations){
            return;
        }
        array.forEach(stateMap.stations, function(station){
            var point = new Point(station.XCOOR, station.YCOOR, map.spatialReference),
                symbol = new TextSymbol(' ', new Font(
                    18,
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD
                ), new Color([255, 0, 0])),
                graphic;
            symbol.setOffset(0,10);
            graphic = new Graphic(point, symbol);

            graphic.station = station;
            graphicLayer.add(graphic);
        });
    };

    loadStationInfo = function(){
        return request(configMap.serviceApis.allStation, {
            'handleAs': 'json',
            'query': {
                'f': 'table',
                'dimType': 'YL_WL'
            }
        }).then(filterStation).
            then(addLabelToMap);
    };

    initLoad = function(){
/*
        if(stateMap.stations && stateMap.serviceParameters && stateMap.serviceParameters.featureSet && stateMap.serviceParameters.valueField){
            return null;
        }
*/
        return loadStationInfo().
            then(loadFeatureSet);
    };


    geoProcess = function(callback){
        if(!stateMap || !stateMap.serviceParameters || !stateMap.serviceParameters.featureSet || !stateMap.serviceParameters.valueField){
            if(callback && callback.apply){
                callback.apply(null);
            }
            return;
        }
        var gp = new Geoprocessor(configMap.serviceApis.rainfallModelServiceUrl),
            fields = stateMap.serviceParamsDef,
            params = {};
        params[fields[configMap.gpServiceParamIndex.featureSetParam].name] = JSON.stringify(stateMap.serviceParameters.featureSet);
        //'{"displayFieldName":"","geometryType":"esriGeometryPoint","spatialReference":{"wkid":4326,"latestWkid":4326},"fields":[{"name":"OBJECTID","type":"esriFieldTypeOID","alias":"OBJECTID"},{"name":"NAME","type":"esriFieldTypeString","alias":"NAME","length":254},{"name":"CODE","type":"esriFieldTypeDouble","alias":"CODE"},{"name":"X","type":"esriFieldTypeDouble","alias":"X"},{"name":"Y","type":"esriFieldTypeDouble","alias":"Y"},{"name":"D_VALUE","type":"esriFieldTypeDouble","alias":"D_VALUE"}],"features":[{"geometry":{"type":"point","x":108.408611,"y":22.849444,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.408611,"Y":22.849444,"D_VALUE":80,"OBJECTID":null,"NAME":"火车东站","CODE":null}},{"geometry":{"type":"point","x":108.268728,"y":22.807205,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.268728,"Y":22.807205,"D_VALUE":0,"OBJECTID":null,"NAME":"富宁立交站","CODE":null}},{"geometry":{"type":"point","x":108.246926,"y":22.805344,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.246926,"Y":22.805344,"D_VALUE":40,"OBJECTID":null,"NAME":"华南城站","CODE":null}},{"geometry":{"type":"point","x":108.288099,"y":22.860282,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.288099,"Y":22.860282,"D_VALUE":0,"OBJECTID":null,"NAME":"花卉公园站","CODE":null}},{"geometry":{"type":"point","x":108.340684,"y":22.860742,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.340684,"Y":22.860742,"D_VALUE":50,"OBJECTID":null,"NAME":"狮山公园站","CODE":null}},{"geometry":{"type":"point","x":108.326828,"y":22.816455,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.326828,"Y":22.816455,"D_VALUE":100,"OBJECTID":null,"NAME":"民族广场站","CODE":null}},{"geometry":{"type":"point","x":108.458042,"y":22.806393,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.458042,"Y":22.806393,"D_VALUE":0,"OBJECTID":null,"NAME":"仙湖长福路站","CODE":null}},{"geometry":{"type":"point","x":108.324609,"y":22.801314,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.324609,"Y":22.801314,"D_VALUE":5,"OBJECTID":null,"NAME":"植物路站","CODE":null}},{"geometry":{"type":"point","x":108.268273,"y":22.750422,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.268273,"Y":22.750422,"D_VALUE":10,"OBJECTID":null,"NAME":"那洪收费站","CODE":null}},{"geometry":{"type":"point","x":108.368333,"y":22.783056,"spatialReference":{"wkid":4326,"latestWkid":4326}},"attributes":{"X":108.368333,"Y":22.783056,"D_VALUE":20,"OBJECTID":null,"NAME":"南宁大桥站","CODE":null}}],"exceededTransferLimit":false}'
        
        params[fields[configMap.gpServiceParamIndex.valueFieldParam].name] = stateMap.serviceParameters.valueField;

        gp.submitJob(params, function(result, message){
            if(!stateMap){
                return;
            }
            if(!result || !result.jobId || !result.results){
                if(callback && callback.apply){
                    callback.apply(null);
                }
                return;
            }

            if(stateMap.dynamicLayer){
                map.removeLayer(stateMap.dynamicLayer);
                delete stateMap.dynamicLayer;
            }
            
            stateMap.dynamicLayer = new ArcGISDynamicMapServiceLayer(configMap.serviceApis.rainfallModelMapServiceUrl+'/jobs/'+result.jobId, {
                'opacity': 0.5
            });

            map.addLayer(stateMap.dynamicLayer);
            
            if(callback && callback.apply){
                callback.apply(null);
            }
        });
    };

    createFeatureObject = function(station, data){
        if(!station || !data){
            return null;
        }
        var value;
        if(configMap.useFakeData){//TEST ONLY
            if(stateMap.fakeDataIndex === undefined){
                stateMap.fakeDataIndex = 0;
            }
            stateMap.fakeDataIndex = (stateMap.fakeDataIndex + 1) % stateMap.fakeData.length;
            value = stateMap.fakeData[stateMap.fakeDataIndex];
        }else{
            if(isNaN(parseFloat(data[0].d_value))){
                return null;
            }
            value = parseFloat(data[0].d_value);
        }

        if(isNaN(parseFloat(data[0].d_value))){
            return null;
        }

        var point = new Point(station.XCOOR, station.YCOOR, stateMap.serviceParameters.featureSet.spatialReference);
        var obj = {
            'geometry': point,
            'attributes': {
                'X': station.XCOOR,
                'Y': station.YCOOR,
                'D_VALUE': value,
                'OBJECTID': null,
                'NAME': station.COMBNAME,
                'CODE': null
            }
        };
        return obj;
    };

    loadLatest = function(callback){
        if(!stateMap && !stateMap.stations){
            if(callback && callback.apply){
                callback.apply(null, []);
            }
            return;
        }
        var queries = [],
            i, station, url;
        for(i=0;i<stateMap.stations.length;i++){
            station = stateMap.stations[i];
            if(!historyTime)
               url = string.substitute(configMap.serviceApis.realtimeDataByItemId, station);
            else{
               url = string.substitute(configMap.serviceApis.historyDataByItemId, station);    
               url=url+"/"+historyTime+"/"+historyTime;
            }queries.push(request(url, {
                'handleAs': 'json'
            }));
        }
        all(queries).then(function(response){
            if(!stateMap || !stateMap.stations || !response || response.length !== stateMap.stations.length){
                if(callback && callback.apply){
                    callback.apply(null, []);
                }
                return;
            }
            var featureSet = [],
                station, data, feature, value, symbol;

            for(var i=0;i<response.length;i++){
                data =  response[i].rows||response[i];
                station = stateMap.stations[i];
                if(data && station){
                    feature = createFeatureObject(station, data);
                    if(!feature){
                        continue;
                    }
                    featureSet.push(feature);
                    if(graphicLayer && feature && feature.attributes && !isNaN(feature.attributes.D_VALUE)){
                        array.forEach(graphicLayer.graphics, function(graphic){
                            if(graphic && graphic.station && graphic.station.ITEMID == station.ITEMID){
                                symbol = graphic.symbol;
                                symbol.text = feature.attributes.D_VALUE + '';
                                graphic.setSymbol(symbol);
                            }
                        });
                    }
                }
            }
            
            stateMap.serviceParameters.featureSet.features = featureSet;
            if(callback && callback.apply){
                callback.apply(null, []);
            }
        });
    };

    start = function(){
        if(stateMap && !stateMap.playing){
            stateMap.playing = true;
            window.setTimeout(run, 0);
        }
    };

    stop = function(){
        stateMap.playing = false;
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }
/*
        if(!options.serviceApis){
            throw "'options.serviceApis' is needed for init!";
        }
        if(!options.serviceApis.gpServiceApi){
            throw "'options.serviceApis.gpServiceApi' is needed for init!";
        }
 */
        map = _map;
        lang.mixin(configMap, options);
    };

    updateInfo = function(){
        var info, time;
        if(queryMap && queryMap.info && stateMap && stateMap.lastRunTime){
            time = timeUtils.formatTimeStrFromMill(stateMap.lastRunTime, 'yyyy-MM-dd hh:mm');
            info = string.substitute(templates.content, {
                'time': time
            });
            html.set(queryMap.info, info);
        }
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
            graphicLayer = null;
        }        
    };

    initDom = function(){
        destroyDom();
        queryMap = {};
        queryMap.parent = map.root.parentNode;
        queryMap.main = domConstruct.toDom(templates.main);
        queryMap.title = query('.rainfall-model-title', queryMap.main)[0];
        if(historyTime)
           queryMap.title.innerText='历史雨量图';
        queryMap.info = query('span[data-role=updateTime]', queryMap.main)[0];
        if(optinal)
             html.set(queryMap.info, "");
        queryMap.cancelBtn = query('a[data-role=close]', queryMap.main)[0];
        //if(goPlay)
        //     html.set(queryMap.cancelBtn, "");
        /*
        queryMap.legend = domConstruct.toDom(templates.legend);
        queryMap.legendImg = query('img[data-role=legend]', queryMap.legend)[0];
        
        queryMap.legendImg.src = configMap.serviceApis.rainfallLegendImage;
         */

        queryMap.legendWrapper = query('div[data-role=legendWrapper]', queryMap.main)[0];
        queryMap.legend = new LegendPanel(queryMap.legendWrapper, {
            'title': '降雨量（毫米）图例',
            'stops': configMap.legendStops
        });
        domConstruct.place(queryMap.main, queryMap.parent);

        eventHandlerMap.clickCancelBtn = on(queryMap.cancelBtn, 'click', cancel);
    };

    destroyDom = function(){
        if(eventHandlerMap.clickCan5celBtn){
            eventHandlerMap.clickCancelBtn.remove();
            delete eventHandlerMap.clickCancelBtn;
        }
        if(queryMap && queryMap.legend){
            queryMap.legend.destroy();
            delete queryMap.legend;
        }
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        queryMap = null;
    };

    addGridToMap =function(options){
        var i=0;
        options.coorData.forEach(function(coor){
            if(!coor){
                return;
            }
            var coorArr=coor.split(",");
            var point = new Point(coorArr[0], coorArr[1], map.spatialReference),
               symbol = new TextSymbol(options.valueData[i], new Font(
                    18,
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD
                ), new Color([255, 0, 0])),
            graphic;
            graphic = new Graphic(point, symbol);
            map.graphics.add(graphic);
            i=i+1;
        });
    
    };
    
    addPointsToMap = function(featureSet){
        if(!featureSet || !featureSet.features || !featureSet.features.length){
            return;
        }
        featureSet.features.forEach(function(feature){
            if(!feature || !feature.attributes || !feature.geometry){
                return;
            }
            var geometry = feature.geometry,
                point = new Point(geometry.x, geometry.y, featureSet.spatialReference),
                symbol = new TextSymbol(feature.attributes.D_VALUE, new Font(
                    18,
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD
                ), new Color([255, 0, 0])),
                graphic;

            graphic = new Graphic(point, symbol);

            graphic.feature = feature;
            graphicLayer.add(graphic);
        });
    };

    runOnce = function(options){
        loadFeatureSet().then(function(){
            var valueField = options.input.valueField,
                features = options.input.featureSet.features,
                fields = stateMap.serviceParamsDef;
            
            features.forEach(function(feature){
                if(valueField != 'D_VALUE'){
                    feature.attributes.D_VALUE = feature.attributes[valueField];
                    delete feature.attributes[valueField];
                }
            });
            stateMap.serviceParameters.featureSet.features = features;

            geoProcess(function(){
                addPointsToMap(options.input.featureSet);
                updateInfoWithOptions(options);

            });
        });
    };

    updateInfoWithOptions = function(options){
        var info;
        info = options.info || '';
        if(queryMap && queryMap.info){
            html.set(queryMap.info, info);
        }
    };

    useWithOptions = function(options){
        if(!options){
            return;
        }
        stateMap = {
            'playing': false
        };
        //initGraphicLayer();
        initDom(); 
        html.set(queryMap.title, options.title.substr(0,19)+'<br>'+options.title.substr(19)|| '降雨图');
        //runOnce(options);
        addGridToMap(options);
    };

    useByDefault = function(){
        stateMap = {
            'lastRunTime': 0,
            'playing': false,
            'fakeData': configMap.fakeData//TEST ONLY
        };
        initGraphicLayer();
        initDom();
        initLoad().then(start);
    };

    use = function(options){
        options = options || {};
        if(options && options.title && options.coorData && options.valueData)
           optinal=true;
        else
           optinal=false;  
        /*if(options.play)  
            goPlay=true;
        else
            goPlay=false;*/
       if(options && options.historyTime)
            historyTime=options.historyTime;    
        if(stateMap&&!optinal){
            cancel();
        }
        if(optinal){
            useWithOptions(options);
        }else{
            useByDefault();
        }
    };
        
    cancel = function(){
        stop();
        if(stateMap && stateMap.dynamicLayer){
            map.removeLayer(stateMap.dynamicLayer);
        }
        if(optinal){
            if(map.getLayer("gridGraphicLayer")){
	             var layer=map.getLayer("gridGraphicLayer");
		         layer.clear();
		         map.removeLayer(layer);
	         }
	         map.graphics.clear();
        }else
            destroyGraphicLayer();
        destroyDom();
        stateMap = null;
    };

    exports = {
        'init': init,
        'use': use,
        'cancel': cancel,
    };

    return exports;
});
