define([
    'pipe-network/lib/basic-utils'
], function(
    basicUtils
){
    'use strict';
    var exports,
        //----
        getMaterial,
        getConduitCategory,
        getPipeCategory,
        getShapeType,
        getShapeWidth,
        getShapeDeep,
        getInElev,
        getOutElev,
        getInJuncID,
        getOutJuncID,
        getLength,
        getId,
        getPipeType,
        getPipeSlope,
        getOBJECTID,
        getPipeColor,
        getPipeHorizontalProjection;

    getMaterial = function(feature){
        return feature? feature.attributes.MATERIAL||feature.attributes.Material: null;
    };

    getPipeCategory = function(feature){
        return feature? feature.attributes.PIPE_CATEGORY||feature.attributes.Pipe_Category: null;
    };

    getConduitCategory = function(feature){
        return feature? feature.attributes.CONDUIT_CATEGORY||feature.attributes.Conduit_Category: null;
    };

    /**
     * 判断管道/沟渠的截面形状
     * @param feature {Object} 要判断的要素
     * @return {Number} 0 | 1；0代表圆形，1代表矩形
     */
    getShapeType = function(feature){
        var pipeAttrs = feature.attributes;
        if(!(basicUtils.isNumber(pipeAttrs.SHAPE_DATA2||pipeAttrs.Shape_Data2)&& (pipeAttrs.SHAPE_DATA2||pipeAttrs.Shape_Data2))){
            return 0; //circle
        }
        return 1; //rectangle
    };

    /**
     * 获取管道/沟渠截面的（水平）宽度。如果是圆形截面，则该宽度等于直径。
     * @param feature {Object} 要素
     * @return {Number} 截面宽度，单位：米。如果是数据异常或其他原因导致无法获取该值，则返回0，调用者对返回0的情况进行适当的处理。
     */
    getShapeWidth = function(feature){//unit: m
        var pipeAttrs = feature.attributes,
            width = 0;
        if(basicUtils.isNumber(pipeAttrs.SHAPE_DATA2||pipeAttrs.Shape_Data2) && (pipeAttrs.SHAPE_DATA2||pipeAttrs.Shape_Data2)/* must not be 0 */){
            width = (pipeAttrs.SHAPE_DATA2||pipeAttrs.Shape_Data2)/ 1000; //unit: mm -> m
        }else if(basicUtils.isNumber(pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1) && (pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1)){
            width = (pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1) / 1000; //unit: mm -> m
        }
        return width;
    };

    /**
     * 获取管道/沟渠截面的（竖直）。如果是圆形截面，则该深度等于直径。
     * @param feature {Object} 要素
     * @return {Number} 截面深度，单位：米。如果是数据异常或其他原因导致无法获取该值，则返回0，调用者对返回0的情况进行适当的处理。
     */
    getShapeDeep = function(feature){//unit: m
        var pipeAttrs = feature.attributes,
            deep = 0;
        if(basicUtils.isNumber(pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1) && (pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1)){
            deep = (pipeAttrs.SHAPE_DATA1||pipeAttrs.Shape_Data1) / 1000; //unit: mm -> m
        }
        return deep;
    };

    /**
     * 获取管道/沟渠的流入点（起点）标高，需要这个函数是因为数据中管道与沟渠的表示该含义的字段名称不同，所以使用这个函数来对上一级调用者消除这种差异，使上级调用者可以将两者使用相同的处理方法。
     * @param feature {Object} 要素
     * @return {Number} 流入点（起点）标高，单位：米。
     */
    getInElev = function(feature){
        var pipeAttr = feature.attributes;
        if(basicUtils.isNumber(pipeAttr.IN_ELEV||pipeAttr.In_Elev)){
            return pipeAttr.IN_ELEV||pipeAttr.In_Elev;
        }else{
            return pipeAttr.IN_ELE;
        }
    };

    /**
     * 类似 getInElev，该函数用于获取管道/沟渠的流出点（终点）标高。
     * @param feature {Object} 要素
     * @return {Number} 流出点（终点）标高，单位：米。
     */
    getOutElev = function(feature){
        var pipeAttr = feature.attributes;
        if(basicUtils.isNumber(pipeAttr.OUT_ELEV||pipeAttr.Out_Elev)){
            return pipeAttr.OUT_ELEV||pipeAttr.Out_Elev;
        }else{
            return pipeAttr.OUT_ELE;
        }
    };

    /**
     * 用于获取管线/沟渠的流入点（起点）编号
     * @param feature {Object} 要素
     * @return {Number} 流入点（起点）的编号
     */
    getInJuncID = function(feature){
        var pipeAttr = feature.attributes;
        return pipeAttr.IN_JUNCID||pipeAttr.In_JuncID;
    };

    /**
     * 用于获取管线/沟渠的流出点（终点）编号
     * @param feature {Object} 要素
     * @return {Number} 流出点（终点）的编号
     */
    getOutJuncID = function(feature){
        var pipeAttr = feature.attributes;
        return pipeAttr.OUT_JUNCID||pipeAttr.Out_JuncID;
    };

    getId = function(feature){
        var pipeAttr = feature.attributes;
        return pipeAttr.PIPEID || pipeAttr.CONDUITID;
    };

    getPipeType = function(feature){
        var pipeAttr = feature.attributes;
        if(!pipeAttr){
            return null;
        }
        if(pipeAttr.hasOwnProperty('CONDUITID')){
            return 'Conduit';
        }else if(pipeAttr.hasOwnProperty('PIPEID')||pipeAttr.hasOwnProperty('PipeID')){
            return 'Pipe';
        }
        return null;
    };

    getLength = function(feature){
        var pipeAttrs = feature.attributes;
        if(feature){
            if(basicUtils.isNumber(pipeAttrs.PIPE_LEN||pipeAttrs.Pipe_Len)){
                return pipeAttrs.PIPE_LEN||pipeAttrs.Pipe_Len;
            }else if(basicUtils.isNumber(pipeAttrs.CONDUIT_LEN||pipeAttrs.Conduit_Len)){
                return pipeAttrs.CONDUIT_LEN||pipeAttrs.Conduit_Len;
            }
            return pipeAttrs.SHAPE_Length;
        }
        return null;
    };

    getPipeHorizontalProjection = function(feature){
        var elevDelta, projection;
        if(feature){
            elevDelta = getInElev(feature) - getOutElev(feature);
            projection = Math.sqrt(Math.pow(getLength(feature), 2) - Math.pow(elevDelta, 2));
        }
        return projection;
        
    };
    
    getPipeSlope = function(feature){
        var slope, projection;
        if(feature){
            projection = getPipeHorizontalProjection(feature);
            slope = (getInElev(feature) - getOutElev(feature)) / projection;
        }
        return slope;
        
    };

    getOBJECTID = function(feature){
        if(feature && feature.attributes){
            return feature.attributes.OBJECTID || feature.attributes.objectid || feature.attributes['实体ID'] || feature.attributes['实体编号'];
        }
        return null;
    };

    getPipeColor = function(feature){
        if(feature && feature.attributes && (feature.attributes.PIPE_CATEGORY || feature.attributes.Pipe_Category || feature.attributes.CONDUIT_CATEGORY|| feature.attributes.Conduit_Category)){
            var colors = {
                '1': '#00FFC5',
                '2': '#E600A9',
                '3': '#E69800'
            };
            return colors[feature.attributes.PIPE_CATEGORY] || colors[feature.attributes.CONDUIT_CATEGORY|| feature.attributes.Pipe_Category || feature.attributes.Conduit_Category ] || '#FFFFFF';
        }
        return '#FFFFFF';
    };

    exports = {
        'getOBJECTID': getOBJECTID,
        'getPipeColor': getPipeColor,
        'getShapeType': getShapeType,
        'getShapeWidth': getShapeWidth,
        'getShapeDeep': getShapeDeep,
        'getInElev': getInElev,
        'getOutElev': getOutElev,
        'getInJuncID': getInJuncID,
        'getOutJuncID': getOutJuncID,
        'getLength': getLength,
        'getId': getId,
        'getPipeType': getPipeType,
        'getPipeSlope': getPipeSlope,
        'getPipeCategory': getPipeCategory,
        'getConduitCategory': getConduitCategory,
        'getMaterial': getMaterial,
        'getPipeHorizontalProjection': getPipeHorizontalProjection
    };

    return exports;
});
