define([
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/tasks/QueryTask',
    'esri/tasks/query',
    'esri/dijit/Popup',
    'esri/Color',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/InfoTemplate',
    'pipe-network/data-model',
    'pipe-network/pipe-model-utils'
],function(
    lang,
    array,
    domConstruct,
    IdentifyTask,
    IdentifyParameters,
    QueryTask,
    Query,
    Popup,
    Color,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    InfoTemplate,
    dataModel,
    pipeUtils
){
    'use strict';
    var exports,
        allowPopup = true,
        symbols = {
            'IDENTIFIED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 2),
            'IDENTIFIED_PIPE_NODE_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 1), new Color([0,0,255,0.25]))
        },
        configMap = {
        },
        stateMap = {},
        popup,
        serviceUrl,
        identifyParams,
        identifyTask,
        map,
        //-----
        init,
        initIdentifyParams,
        initIdentifyTask,
        initPopup,
        genInfoTemplate,
        identify,
        setAllowPopup,
        isVisibleInCurZoom;

    isVisibleInCurZoom = function(){
        var minVisibleZoom = parseInt(configMap.minVisibleZoom),
            curZoom = parseInt(map.getZoom());
        if(!map){
            return false;
        }
        if(isNaN(minVisibleZoom) || isNaN(curZoom) || curZoom < 0 || curZoom >= minVisibleZoom){
            return true;
        }
        
        return false;
    };

    setAllowPopup = function(_allowPopup){
        allowPopup = _allowPopup?true:false;
    };

    initPopup = function(){
        map.infoWindow.lineSymbol = symbols.IDENTIFIED_PIPE_LINE_SYMBOL;
        map.infoWindow.markerSymbol = symbols.IDENTIFIED_PIPE_NODE_MARKER_SYMBOL;
    };

    initIdentifyTask = function(){
        identifyTask = new IdentifyTask(serviceUrl);
    };

    initIdentifyParams = function(){
        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 3;
        identifyParams.returnGeometry = true;
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
        identifyParams.width = map.width;
        identifyParams.height = map.height;

        lang.mixin(identifyParams, configMap.identifyParameters);
    };

    init = function(_map, params){
        if(!_map){
            throw "need a esri.Map Object to init pipe identify function!";
        }

        params = params || {};

        if(!params.layerModelMap){
            throw "need 'layerModelMap' to init identify";
        }
        if(!params.serviceUrl){
            throw "need service url to init pipe identify";
        }
        if(!params.identifyParameters || !params.identifyParameters.layerIds){
            throw "need 'identifyParameters' to init identify";
        }
        map = _map;
        
        lang.mixin(configMap, params);
        lang.mixin(symbols, configMap.symbols || {});

        serviceUrl = params.serviceUrl;
        initPopup();
        initIdentifyTask();
        initIdentifyParams();
    };

    genInfoTemplate = function(model, feature){
        if(!model || !feature || !feature.attributes){
            return "${*}";
        }
        var template,i, fieldName, field, value;

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

    /*
     genInfoTemplate = function(feature){
     if(!feature || !feature.attributes){
     return "${*}";
     }
     var template = "";
     for(var attr in feature.attributes){
     if(feature.attributes.hasOwnProperty(attr)){
     if(attr != '坐标X' && attr != '坐标Y' && attr.match(/[A-z]/)){
     continue;
     }else{
     template += attr+": ${"+attr+"}<br/>";
     }
     }
     }
     return new InfoTemplate("OBJECTID:${OBJECTID}", template);
     };
     */
    identify = function(point){
        if(!allowPopup || !isVisibleInCurZoom()){
            return;
        }

        identifyParams.geometry = point;
        identifyParams.mapExtent = map.extent;

        var deferred = identifyTask.execute(identifyParams).addCallback(function (response) {
            var arr = [], point, feature;
            if(response && response.length){
                for(var i=0;i<response.length;i++){
                    feature = response[i].feature;
                    if(feature.geometry.type == 'point'){
                        point = response[i];
                        break;
                    }
                }
            }
            return point? [point]: array.map(response, function (result) {
                var feature = result.feature;
                return result;
            });
        }).addCallback(function(response){
            if(map.getScale()>configMap.displayScale)
                return;
            else if(response && response.length){
                var item = response[0],
                    query = new Query(),
                    queryTask = new QueryTask(serviceUrl + '/' + item.layerId),
                    modelName = configMap.layerModelMap[item.layerId],
                    model = dataModel.models[modelName];

                query.objectIds = [pipeUtils.getOBJECTID(item.feature)];
                //                query.objectIds = [];
                query.returnGeometry = true;
                query.outFields = ['*'];

                queryTask.execute(query).then(function(featureSet){
                    var feature = featureSet.features[0];
                    if(featureSet && featureSet.features && featureSet.features.length){
                        feature.setInfoTemplate(genInfoTemplate(model, feature));
                        map.infoWindow.setFeatures([feature]);
                        map.infoWindow.show(point);
                    }
                });
            }else{
                map.infoWindow.hide();
            }
        });
    };
    exports = {
        'init': init,
        'identify': identify,
        'setAllowPopup': setAllowPopup
    };
    return exports;
});
