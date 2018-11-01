define([
    'esri/Color',
    'esri/InfoTemplate',
    'esri/geometry/Point',
    'esri/geometry/Extent',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/geometry/ScreenPoint',
    'esri/geometry/screenUtils'
], function(
    Color,
    InfoTemplate,
    Point,
    Extent,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    ScreenPoint,
    screenUtils
){
    'use strict';
    var configMap = {},
        symbols = {
            'HIGHLIGHTED_MARKER_SYMBOL': new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 6, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([255,0,0,0.5])),
            'HIGHLIGHTED_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247,255,0]), 3)
        },
        genInfoTemplate,
        isNumber,
        locateGraphicOnGraphicLayer,
        locatePointToViewPosition,
        getCenterPointOfMap,
        toExtent,
        init;

    isNumber= function(tar){
        return tar !== null && !isNaN(tar);
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

    getCenterPointOfMap = function(map){
        if(!map){
            return null;
        }
        var extent = map.extent,
            center;
        center = new Point((map.extent.xmin + map.extent.xmax)/2,
                           (map.extent.ymin + map.extent.ymax)/2,
                           map.spatialReference);
        return center;
    };
/*
    toExtent = function(point, map, extentWidth, leftPortion, topPortion, oriExtent){
        if(!map){
            return;
        }
        oriExtent = oriExtent || map.extent;

        var screenPoint = screenUtils.toScreenGeometry(map.extent, map.width, map.height, point),
            screenExtent = {
            'xmin': 0,
            'xmax': map.width,
            'ymin': 0,
            'ymax': map.height
        };

    };
*/
    toExtent = function(point, map, extentWidth, leftPortion, topPortion, oriExtent){
        if(!map){
            return null;
        }
        point = new Point(point.x, point.y, map.spatialReference);
        oriExtent = oriExtent || map.extent;
        if(!extentWidth/* || extentWidth < 1*/){
            extentWidth = Math.abs(oriExtent.xmin - oriExtent.xmax);
        }
        if(!point && !(point = getCenterPointOfMap(map))){
            return oriExtent;
        }
        var oriWidth, oriLeft, left,
            oriHeight, oriTop, top, extentHeight,
            scale, newExtent;

        leftPortion = leftPortion;
        topPortion = 1 - topPortion;

        //----
        left = point.x - extentWidth * leftPortion;
        //----
        oriWidth = Math.abs(oriExtent.xmin - oriExtent.xmax);
        oriHeight = Math.abs(oriExtent.ymin - oriExtent.ymax);
        extentHeight = (extentWidth / oriWidth) * oriHeight;
        top = point.y - extentHeight * topPortion;
        //----
        newExtent = new Extent(left, top, left + extentWidth, top + extentHeight, map.spatialReference);

        console.log("point: " + JSON.stringify(point));
        console.log("extent-delta: " + JSON.stringify({
            'xmin': newExtent.xmin - oriExtent.xmin,
            'xmax': newExtent.xmax - oriExtent.xmax,
            'ymin': newExtent.ymin - oriExtent.ymin,
            'ymax': newExtent.ymax - oriExtent.ymax
        }));
        
        map.setExtent(newExtent);

        return newExtent;
    };

    /**
     * 将一个指定的点定位到视图上指定的位置
     */
    locatePointToViewPosition = function(point, viewLeft , viewTop, map, newExtentWidth){
        if(!point || ! map){
            return;
        }

        //TEMP
//        point = new Point(point.x, point.y, map.spatialReference);
//        map.centerAt(point);
//        toExtent(point, map, 1000, 0.5, 0.25);
//        return;
        var targetScreenPoint, targetPoint,
            oldExtent, newExtent,
            leftPortion, topPortion,
            dx, dy, zoom, tmpEvent,
            oriExtent, oriMapWidth, oriMapHeight, oriScreenWidth, oriScreenHeight;

        oriScreenWidth = map.root.parentNode.offsetWidth;
        oriScreenHeight = map.root.parentNode.offsetHeight;
        oriMapWidth = Math.abs(map.extent.xmin - map.extent.xmax);
        oriMapHeight = Math.abs(map.extent.ymin - map.extent.ymax);

        if(isNumber(viewLeft)){
            viewLeft = parseFloat(viewLeft);
            leftPortion = viewLeft / oriMapWidth;
        }else if(viewLeft && viewLeft.match(/^ *\d+(\.\d+)?px *$/)){
            viewLeft = parseFloat(viewLeft.replace(/[px ]+/g, ''));
            leftPortion = viewLeft / oriScreenWidth;
        }else if(viewLeft && viewLeft.match(/^ *\d+(\.\d+)?% *$/)){
            viewLeft = parseFloat(viewLeft.replace(/[% ]+/g, ''));
            leftPortion = viewLeft / 100;
        }else{
            return;
        }
        if(isNumber(viewTop)){
            viewTop = parseFloat(viewTop);
            topPortion = viewTop / oriMapHeight;
        }else if(viewTop && viewTop.match(/^ *\d+(\.\d+)?px *$/)){
            viewTop = parseFloat(viewTop.replace(/[px ]+/g, ''));
            topPortion = viewTop / oriScreenHeight;
        }else if(viewTop && viewTop.match(/^ *\d+(\.\d+)?% *$/)){
            viewTop = parseFloat(viewTop.replace(/[% ]+/g, ''));
            topPortion = viewTop / 100;
        }else{
            return;
        }

        if(isNumber(newExtentWidth)){
            newExtentWidth = newExtentWidth;
        }else if(newExtentWidth && newExtentWidth.match(/^ *\d+(\.\d+)?px *$/)){
            newExtentWidth = parseFloat(newExtentWidth.replace(/[px ]+/g, ''));
            newExtentWidth = (newExtentWidth / oriScreenWidth) * oriMapWidth;
        }

        toExtent(point, map, /*newExtentWidth || */0.005, !isNaN(leftPortion)?leftPortion:0.5, !isNaN(topPortion)?topPortion:0.3);
    };

    /**
     * 定位GraphicLayer上的一个图形，需要的话还可以弹出信息框显示要素属性
     */
    locateGraphicOnGraphicLayer = function(map, graphic, feature, model, graphicLayer, nopopup){
        var modelName, found, path, point, zoom, tmpEvent;
        if(graphic && feature && model && graphicLayer){
            if(graphic.geometry.type == 'point'){
                point = graphic.geometry;
            }else if(graphic.geometry.type == 'polyline'){
                path = graphic.geometry.paths[0];
                point = new Point((path[0][0]+path[1][0])/2, (path[0][1]+path[1][1])/2, graphic.geometry.spatialReference);
            }
            try{
                if(!nopopup && map.infoWindow){
                    if(!feature.infoTemplate){
                        feature.setInfoTemplate(genInfoTemplate(model, feature));
                    }

                    map.infoWindow.lineSymbol = symbols.HIGHLIGHTED_LINE_SYMBOL;
                    map.infoWindow.markerSymbol = symbols.HIGHLIGHTED_MARKER_SYMBOL;

                    map.infoWindow.setFeatures([feature]);

                    tmpEvent = map.on('extent-change', function(){
                        tmpEvent.remove();
                        map.infoWindow.show(point);
                    });
                }
//                zoom = map.getMaxZoom() - 2 >=  map.getMinZoom()? map.getMaxZoom() - 2 : map.getMaxZoom();
//                map.centerAndZoom(point, zoom);
                locatePointToViewPosition(point, '50%', '30%', map, 0.005);
            }catch(e){
                console.warn(e);
            }
        }
    };
    
    return {
        'locateGraphicOnGraphicLayer': locateGraphicOnGraphicLayer,
        'locatePointToViewPosition': locatePointToViewPosition,
        'toExtent': toExtent
    };

});
