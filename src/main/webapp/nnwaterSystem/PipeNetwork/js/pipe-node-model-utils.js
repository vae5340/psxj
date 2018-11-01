define([
    'pipe-network/lib/basic-utils'
], function(
    basicUtils
){
    'use strict';
    var exports,
        getSurfaceElev,
        getDepth,
        getMaxDepth,
        getBotEle;
        //----

    getBotEle = function(feature){
        return feature?feature.attributes.BOTELE:null;
    };

    getSurfaceElev = function(feature){
        return feature?feature.attributes.SURFACE_ELE||feature.attributes.Surface_Ele:null;
    };

    getDepth = function(feature){
        return feature?feature.attributes.DEPTH||feature.attributes.Depth:null;
    };

    getMaxDepth = function(feature){
        return feature?feature.attributes.MAXDEPTH:null;
    };

    exports = {
        'getSurfaceElev': getSurfaceElev,
        'getDepth': getDepth,
        'getMaxDepth': getMaxDepth,
        'getBotEle': getBotEle
    };

    return exports;
});
