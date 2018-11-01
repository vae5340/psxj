define([
  'dojo/_base/lang'
],function(lang){
  "use strict";
  var 
    exports,
    initDone = false,
    configDone = false,
    map,
    configMap = {},
    toolMap = {},
    usageMap = {},
    init,
    config,
    setUsage,
    getUsage,
    removeUsage,
    setTool,
    getTool,
    removeTool,
    useTool,
    stopUse,
    stopAll;
  
  init = function(pMap,initMap){
    var prop;
    
    if(!configDone){
      config();
    }
    
    if(!pMap){
      throw "A esri.Map object is neccessary for init analyse tools!";
    }
    
    initMap = lang.clone(initMap) || {};
    
    map = pMap;
    
    for(prop in usageMap){
      if(usageMap.hasOwnProperty(prop)){
        usageMap[prop].init(pMap,initMap[prop]);
      }
    }
    
    for(prop in toolMap){
      if(toolMap.hasOwnProperty(prop)){
        toolMap[prop].init(pMap,initMap[prop]);
      }
    }
    
    initDone = true;
  };
  
  config = function(configMap){
    configDone = true;
  };
  
  setTool = function(name,analyseTool){
    if(name && analyseTool){
      toolMap[name] = analyseTool;
    }
  };
  
  getTool = function(name){
    var tool;
    if(name){
      tool = toolMap[name];
    }
    return tool;
  };
  
  removeTool = function(name){
    if(name){
      delete toolMap[name];
    }
  };
  
  getUsage = function(name){
    var usage;
    if(name){
      usage = usageMap[name];
    }
    return usage;
  };
  
  setUsage = function(name,usage){
    if(name && usage){
      usageMap[name] = usage;
    }
  };
  
  removeUsage = function(name){
    if(name){
      delete usageMap[name];
    }
  };
  
  useTool = function(usageName,toolName,options){
    if(usageName && toolName && usageMap[usageName] && toolMap[toolName]){
      usageMap[usageName].use(toolMap[toolName],options);
    }
  };
  
  stopUse = function(usageName,options){
    if(usageName && usageMap[usageName]){
      usageMap[usageName].stop(options);
    }
  };
  
  stopAll = function(options){
    options = lang.clone(options) || {};
    var prop;
    for(prop in usageMap){
      if(usageMap.hasOwnProperty(prop)){
        usageMap[prop].stop(options[prop]);
      }
    }        
  };
  
  exports = {
    init:init,
    config:config,
    setTool:setTool,
    getTool:getTool,
    useTool:useTool,
    getUsage:getUsage,
    removeUsage:removeUsage,
    setUsage:setUsage,
    stopUse:stopUse,
    stopAll:stopAll
  };

  return exports;  
});
