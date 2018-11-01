define([
    'dojo/dom-construct'
], function(
    domConstruct
){
    'use strict';
    return (function(){
        var dpcm, //单位: px/cm
            cm2px,
            px2cm;

        dpcm = (function(){
            var dpcm = {},
                tmpNode = domConstruct.toDom("<div style=\"width:1cm;height:1cm;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden\"></div>");
            domConstruct.place(tmpNode, document.body);
            dpcm.x = parseInt(tmpNode.offsetWidth);
            dpcm.y = parseInt(tmpNode.offsetHeight);
            domConstruct.destroy(tmpNode);
            return dpcm;
        })();

        /**
         * cm/m -> px/m
         * @param scale {Object} 格式：{x: Number, y: Number}; x,y的单位是 地图上1cm/实际cm
         * @return {Object} 格式：{x: Number, y: Number}; x,y的单位是 px/m
         */
        cm2px = function(scaleInCm){
            var scaleInPx = {};
            scaleInPx.x = dpcm.x * 100 / scaleInCm.x;
            scaleInPx.y = dpcm.y * 100 / scaleInCm.y;
            return scaleInPx;
        };
        
        /**
         * px/m -> cm/m
         * @param scale {Object} 格式：{x: Number, y: Number}; x,y的单位是 px/m
         * @return {Object} 格式：{x: Number, y: Number}; x,y的单位是 地图上1cm/实际cm
         */
        px2cm = function(scaleInPx){
            var scaleInCm = {};
            scaleInCm.x = dpcm.x * 100 / scaleInPx.x;
            scaleInCm.y = dpcm.y * 100 / scaleInPx.y;
            return scaleInCm;
        };

        return {
            'cm2px': cm2px,
            'px2cm': px2cm
        };
    })();
});
