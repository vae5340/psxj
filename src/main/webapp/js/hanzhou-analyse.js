var jQuery = jQuery;
//定义杭州项目的分析工具集
define([
  'analyse-tools/analyse-tools',
  'analyse-tools/usages/select-and-analyse',
  'analyse-tools/usages/pick-and-analyse',
  'analyse-tools/usages/stroke-and-analyse',
  'analyse-tools/tools/flowdirect-analyse',
  'analyse-tools/tools/pitch-analyse',
  'analyse-tools/tools/reversed-pipe-analyse',
  'analyse-tools/tools/hdm-analyse',
  'analyse-tools/tools/zdm-analyse',
  'dojo/domReady!'
],function(analyseTools,SelectAndAnalyse,PickAndAnalyse,StrokeAndAnalyse,FlowdirectAnalyse,PitchAnalyse,ReversedPipeAnalyse,HDMAnalyse,ZDMAnalyse){//组装好工具集,以供使用
  "use strict";
  var 
    //usages
    selectAndAnalyse = new SelectAndAnalyse(jQuery),
    pickAndAnalyse = new PickAndAnalyse(jQuery),
    strokeAndAnalyse = new StrokeAndAnalyse(),
    //tools
    flowdirectAnalyse = new FlowdirectAnalyse(),
    zdmAnalyse = new ZDMAnalyse(),
    pitchAnalyse = new PitchAnalyse(),
    reversedPipeAnalyse = new ReversedPipeAnalyse(),
    hdmAnalyse = new HDMAnalyse();
  // analyseTools.config({});
  
  //addUsage
  analyseTools.setUsage(selectAndAnalyse.name,selectAndAnalyse);
  analyseTools.setUsage(pickAndAnalyse.name,pickAndAnalyse);
  analyseTools.setUsage(strokeAndAnalyse.name,strokeAndAnalyse);
  //addTool    
  analyseTools.setTool(flowdirectAnalyse.name,flowdirectAnalyse);
  analyseTools.setTool(zdmAnalyse.name,zdmAnalyse);
  analyseTools.setTool(pitchAnalyse.name,pitchAnalyse);
  analyseTools.setTool(reversedPipeAnalyse.name,reversedPipeAnalyse);
  analyseTools.setTool(hdmAnalyse.name,hdmAnalyse);
  
  return analyseTools;
});
