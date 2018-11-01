var $ = jQuery; 
/**
 * 分析查询器 
 */
define([
  'dojo/_base/lang',
  'dojo/json',
  'esri/tasks/query'
],function(lang,JSON,Query){
  "use strict";
  var 
    exports,
    esriGeometryTypeMap = {
      'polygon': 'esriGeometryPolygon',
      'line': 'esriGeometryPolyline',
      'polyline': 'esriGeometryPolyline'
    },
    query;
    
  query = function(geometry,callback,optMap){
    var 
      callbackOptions = lang.clone(optMap.toolOptions) || {};
    
    callbackOptions.selectAreaGeometry = geometry;
    
    optMap.queryParams[optMap.geometryParamName] = JSON.stringify(geometry);
    optMap.queryParams[optMap.geometryTypeParamName] = esriGeometryTypeMap[geometry.type];

    $.ajax({
      url:optMap.queryUrl,
      type: 'post',
      data: optMap.queryParams,
      success:function(data){
        if(data.substring){//如果是字符串，先解析
          data = JSON.parse(data);
        }
        callback(data,callbackOptions);
      },
      error:function(a,b,c){
        console.log(a);
        console.log(b);
        console.log(c);
        throw "获取数据失败...";
      }
    });
  };
  
  exports = {
    query: query
  };
  return exports;
});
