// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.16/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/analysis/templates/SummarizeNearby.html":'\x3cdiv class\x3d"esriAnalysis"\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" style\x3d"margin-top:0.5em; margin-bottom: 0.5em;"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"_aggregateToolContentTitle" class\x3d"analysisTitle"\x3e\r\n        \x3ctable class\x3d"esriFormTable" \x3e \r\n          \x3ctr\x3e\r\n            \x3ctd class\x3d"esriToolIconTd"\x3e\x3cdiv class\x3d"sumNearbyIcon"\x3e\x3c/div\x3e\x3c/td\x3e\r\n            \x3ctd class\x3d"esriAlignLeading esriAnalysisTitle" data-dojo-attach-point\x3d"_toolTitle"\x3e${i18n.summarizeNearby}\x3c/td\x3e\r\n            \x3ctd\x3e\r\n              \x3cdiv class\x3d"esriFloatTrailing" style\x3d"padding:0;"\x3e\r\n                  \x3cdiv class\x3d"esriFloatLeading"\x3e\r\n                    \x3ca href\x3d"#" class\x3d\'esriFloatLeading helpIcon\' esriHelpTopic\x3d"toolDescription"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e\r\n                  \x3cdiv class\x3d"esriFloatTrailing"\x3e\r\n                    \x3ca href\x3d"#" data-dojo-attach-point\x3d"_closeBtn" title\x3d"${i18n.close}" class\x3d"esriAnalysisCloseIcon"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e              \r\n              \x3c/div\x3e               \r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/table\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv style\x3d"clear:both; border-bottom: #CCC thin solid; height:1px;width:100%;"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/form/Form" data-dojo-attach-point\x3d"_form" readOnly\x3d"true"\x3e\r\n       \x3ctable class\x3d"esriFormTable"  data-dojo-attach-point\x3d"_aggregateTable"  style\x3d"border-collapse:collapse;border-spacing:5px;" cellpadding\x3d"5px" cellspacing\x3d"5px"\x3e \r\n         \x3ctbody\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_titleRow"\x3e\r\n            \x3ctd  colspan\x3d"3" class\x3d"sectionHeader" data-dojo-attach-point\x3d"_aggregateToolDescription" \x3e${i18n.summarizeDefine}\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_analysisLabelRow" style\x3d"display:none;"\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading  esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.oneLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.analysisLayerLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"sumNearbyLayer"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e  \r\n          \x3ctr data-dojo-attach-point\x3d"_selectAnalysisRow" style\x3d"display:none;"\x3e\r\n            \x3ctd  colspan\x3d"3" style\x3d"padding-top:0;"\x3e\r\n              \x3cselect class\x3d"esriLeadingMargin1 longInput esriLongLabel"  style\x3d"margin-top:1.0em;" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_analysisSelect" data-dojo-props\x3d"required:true" data-dojo-attach-event\x3d"onChange:_handleAnalysisLayerChange"\x3e\x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e            \r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.oneLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.chooseSummarizeLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"Summarize"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" style\x3d"padding-top:0;"\x3e\r\n              \x3cselect class\x3d"longInput esriLeadingMargin1 esriLongLabel"  style\x3d"margin-top:1.0em;" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_layersSelect" data-dojo-props\x3d"required:true" data-dojo-attach-event\x3d"onChange:_handleLayerChange"\x3e\x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" class\x3d"clear"\x3e\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel data-dojo-attach-point\x3d"_labelOne" class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.twoLabel}\x3c/label\x3e\r\n              \x3clabel data-dojo-attach-point\x3d"_measurelabel" class\x3d"esriAnalysisStepsLabel"\x3e${i18n.findNearLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' data-dojo-attach-point\x3d"_analysisFieldHelpLink" esriHelpTopic\x3d"BufferOption"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd style\x3d"padding:0.25em;" colspan\x3d"3"\x3e\r\n              \x3cdiv data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_nearTypeSelect" class\x3d"esriLeadingMargin1 longInput esriLongLabel esriAnalysisDriveMode"\x3e\r\n            \x3c/td\x3e            \r\n          \x3c/tr\x3e           \r\n          \x3ctr\x3e\r\n            \x3ctd style\x3d"padding-right:0;padding-bottom:0;width:20%;"\x3e\r\n              \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" data-dojo-attach-event\x3d"onChange:_handleDistValueChange" data-dojo-props\x3d"intermediateChanges:true,value:\'5\',required:true,missingMessage:\'${i18n.distanceMsg}\'" data-dojo-attach-point\x3d"_breakValuesInput" class\x3d"esriLeadingMargin1"  style\x3d"width:75%;"\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-left:0.25em;padding-bottom:0;width:60%;"\x3e\r\n              \x3cselect class\x3d"mediumInput esriAnalysisSelect" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-event\x3d"onChange:_handleDistUnitsChange" data-dojo-attach-point\x3d"_distanceUnitsSelect" style\x3d"width:80%;table-layout:fixed;"\x3e\r\n              \x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd style\x3d"padding:0" colspan\x3d"3"\x3e\r\n              \x3cdiv class\x3d"esriLeadingMargin1"\x3e\r\n                \x3clabel class\x3d"esriSmallLabel"\x3e${i18n.measureHelp}\x3c/label\x3e\r\n              \x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_useTrafficRow"\x3e\r\n            \x3ctd style\x3d"padding:0" colspan\x3d"3"\x3e\r\n              \x3cdiv style\x3d"width:100%;" data-dojo-type\x3d"esri/dijit/analysis/TrafficTime" data-dojo-attach-point\x3d"_trafficTimeWidget"\x3e\x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n         \x3ctr\x3e\r\n           \x3ctd colspan\x3d"3"\x3e\r\n              \x3clabel class\x3d"esriLeadingMargin1 esriSelectLabel"\x3e\r\n               \x3cdiv data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-attach-point\x3d"_returnBdrycCheck" data-dojo-props\x3d"checked:true"\x3e\x3c/div\x3e\r\n               ${i18n.returnBdrycCheckLabel}\r\n              \x3c/label\x3e             \r\n           \x3c/td\x3e\r\n         \x3c/tr\x3e           \r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" class\x3d"clear"\x3e\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.threeLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"" data-dojo-attach-point\x3d"_addStatsLabel"\x3e${i18n.addStats}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d"esriFloatTrailing helpIcon" data-dojo-attach-point\x3d"_addStatsHelpLink" esriHelpTopic\x3d"StatisticsNoLayer"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e                                                                                \r\n         \x3c/tr\x3e\r\n         \x3ctr\x3e\r\n           \x3ctd colspan\x3d"3"\x3e\r\n              \x3clabel class\x3d"esriLeadingMargin1 esriSelectLabel"\x3e\r\n                \x3cdiv class\x3d"esriLeadingMargin1" data-dojo-type\x3d"dijit/form/CheckBox"  data-dojo-attach-point\x3d"_sumMetricCheck" data-dojo-props\x3d"checked:true, disabled:true"\x3e\x3c/div\x3e\r\n                \x3cspan data-dojo-attach-point\x3d"_sumMetricLabel"\x3e\x3c/span\x3e\r\n              \x3c/label\x3e\r\n           \x3c/td\x3e\r\n         \x3c/tr\x3e\r\n         \x3ctr\x3e\r\n           \x3ctd colspan\x3d"3" style\x3d"padding-top: 0"\x3e\r\n              \x3cselect class\x3d"longInput esriLongLabel esriLeadingMargin1" data-dojo-type\x3d"dijit.form.Select"  data-dojo-props\x3d"style:{width:\'65%\', tableLayout: \'fixed\', overflowX:\'hidden\'}" data-dojo-attach-event\x3d"onChange:_handleShapeUnitsChange" data-dojo-attach-point\x3d"_shapeUnitsSelect"\x3e\x3c/select\x3e\r\n           \x3c/td\x3e\r\n         \x3c/tr\x3e         \r\n         \x3c!--\x3ctr\x3e\r\n           \x3ctd colspan\x3d"3"\x3e\r\n              \x3clabel class\x3d"longTextInput"\x3e\r\n                \x3cdiv data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-attach-point\x3d"_addStatesCheck" data-dojo-attach-event\x3d"onChange:_handleStatsCheckChange" data-dojo-props\x3d"checked:\'true\'"\x3e\x3c/div\x3e\r\n                ${i18n.addStatsLabel}                \r\n              \x3c/label\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"KeepBoundaryNoPoints"\x3e\x3c/a\x3e\r\n           \x3c/td\x3e           \r\n          \x3c/tr\x3e--\x3e           \r\n          \x3ctr data-dojo-attach-point\x3d"_afterStatsRow"\x3e\r\n            \x3ctd colspan\x3d"3" class\x3d"clear"\x3e\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.fourLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel" data-dojo-attach-point\x3d"_groupByLabel"\x3e${i18n.groupByLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"GroupBy"\x3e\x3c/a\x3e \r\n            \x3c/td\x3e             \r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n              \x3cselect class\x3d"esriLeadingMargin1 longInput" data-dojo-type\x3d"dijit.form.Select"  data-dojo-attach-point\x3d"_groupBySelect" data-dojo-attach-event\x3d"onChange:_handleGroupBySelectChange"\x3e\x3c/select\x3e\r\n            \x3c/td\x3e                \r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n           \x3ctd colspan\x3d"2"\x3e\r\n             \x3clabel class\x3d"esriLeadingMargin2 esriSelectLabel" data-dojo-attach-point\x3d"_minmajorityLabel"\x3e\r\n               \x3cdiv data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-attach-point\x3d"_minmajorityCheck" data-dojo-props\x3d"checked:false"\x3e\x3c/div\x3e\r\n               ${i18n.addMinMajorityLable}\r\n             \x3c/label\x3e\r\n           \x3c/td\x3e\r\n           \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"MinorityMajority"\x3e\x3c/a\x3e\r\n           \x3c/td\x3e\r\n          \x3c/tr\x3e    \r\n         \x3ctr\x3e\r\n           \x3ctd colspan\x3d"2"\x3e\r\n             \x3clabel class\x3d"esriLeadingMargin2 esriSelectLabel" data-dojo-attach-point\x3d"_percentPointsLabel"\x3e\r\n               \x3cdiv data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-attach-point\x3d"_percentPointsCheck" data-dojo-props\x3d"checked:false"\x3e\x3c/div\x3e\r\n               ${i18n.addPercentageLabel}\r\n             \x3c/label\x3e\r\n           \x3c/td\x3e\r\n           \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"PercentShape"\x3e\x3c/a\x3e\r\n           \x3c/td\x3e\r\n          \x3c/tr\x3e    \r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" class\x3d"clear"\x3e\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.fiveLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.outputLayerLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"OutputName"\x3e\x3c/a\x3e \r\n            \x3c/td\x3e             \r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n              \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" class\x3d"esriLeadingMargin1 esriOutputText"  data-dojo-props\x3d"trim:true,required:true" data-dojo-attach-point\x3d"_outputLayerInput" value\x3d""\x3e\x3c/input\x3e\r\n            \x3c/td\x3e                \r\n          \x3c/tr\x3e \r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n               \x3cdiv class\x3d"esriLeadingMargin1" data-dojo-attach-point\x3d"_chooseFolderRow"\x3e\r\n                 \x3clabel style\x3d"width:9px;font-size:smaller;"\x3e${i18n.saveResultIn}\x3c/label\x3e\r\n                 \x3cinput class\x3d"longInput esriFolderSelect" data-dojo-attach-point\x3d"_webMapFolderSelect" data-dojo-type\x3d"dijit/form/FilteringSelect" trim\x3d"true"\x3e\x3c/input\x3e\r\n               \x3c/div\x3e              \r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e                                      \r\n        \x3c/tbody\x3e         \r\n       \x3c/table\x3e\r\n     \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"_aggregateToolContentButtons" style\x3d"padding:5px;margin-top:5px;border-top:solid 1px #BBB;"\x3e\r\n      \x3cdiv class\x3d"esriExtentCreditsCtr"\x3e\r\n        \x3ca class\x3d"esriFloatTrailing esriSmallFont"  href\x3d"#" data-dojo-attach-point\x3d"_showCreditsLink" data-dojo-attach-event\x3d"onclick:_handleShowCreditsClick"\x3e${i18n.showCredits}\x3c/a\x3e\r\n       \x3clabel data-dojo-attach-point\x3d"_chooseExtentDiv" class\x3d"esriSelectLabel esriExtentLabel"\x3e\r\n         \x3cinput type\x3d"radio" data-dojo-attach-point\x3d"_useExtentCheck" data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-props\x3d"checked:true" name\x3d"extent" value\x3d"true"/\x3e\r\n           ${i18n.useMapExtent}\r\n       \x3c/label\x3e\r\n      \x3c/div\x3e\r\n      \x3cbutton data-dojo-type\x3d"dijit/form/Button" type\x3d"submit" data-dojo-attach-point\x3d"_saveBtn" class\x3d"esriLeadingMargin4 esriAnalysisSubmitButton" data-dojo-attach-event\x3d"onClick:_handleSaveBtnClick"\x3e\r\n          ${i18n.runAnalysis}\r\n      \x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/Dialog" title\x3d"${i18n.creditTitle}" data-dojo-attach-point\x3d"_usageDialog" style\x3d"width:40em;"\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/analysis/CreditEstimator"  data-dojo-attach-point\x3d"_usageForm"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriFormWarning esriRoundedBox" data-dojo-attach-point\x3d"_errorMessagePane" style\x3d"display:none;"\x3e\r\n      \x3ca href\x3d"#" title\x3d"${i18n.close}" class\x3d"esriFloatTrailing closeIcon" title\x3d\'${i18n.close}\' data-dojo-attach-event\x3d"onclick:_handleCloseMsg"\x3e\r\n        \x3cimg src\x3d\'images/close.gif\' border\x3d\'0\'/\x3e \r\n      \x3c/a\x3e\r\n      \x3cspan data-dojo-attach-point\x3d"_bodyNode"\x3e\x3c/span\x3e\r\n    \x3c/div\x3e        \r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/analysis/SummarizeNearby","require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/_base/fx dojo/has dojo/json dojo/string dojo/dom-style dojo/dom-attr dojo/dom-construct dojo/query dojo/dom-class dojo/number dojo/fx/easing dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dijit/registry dijit/form/Button dijit/form/CheckBox dijit/form/Form dijit/form/Select dijit/form/TextBox dijit/form/ValidationTextBox dijit/layout/ContentPane dijit/form/FilteringSelect ../../kernel ../../lang ./AnalysisBase ./_AnalysisOptions ./CreditEstimator ./utils ./TrafficTime dojo/i18n!../../nls/jsapi dojo/text!./templates/SummarizeNearby.html".split(" "),
function(z,s,d,g,q,h,v,A,L,n,l,f,m,B,t,r,w,C,D,E,F,G,x,M,N,O,y,P,Q,R,S,H,p,I,J,T,k,U,u,K){s=s([C,D,E,F,G,J,I],{declaredClass:"esri.dijit.analysis.SummarizeNearby",templateString:K,widgetsInTemplate:!0,sumNearbyLayer:null,summaryLayers:null,summaryFields:null,nearType:null,outputLayerName:null,summarizeMetric:!0,summaryLayer:null,groupByField:null,minorityMajority:!1,percentPoints:!1,distances:null,units:null,shapeUnits:null,sumShape:!0,enableTravelModes:!0,i18n:null,toolName:"SummarizeNearby",helpFileName:"SummarizeNearby",
resultParameter:"resultLayer",constructor:function(a){this._pbConnects=[];this._statsRows=[];a.containerNode&&(this.container=a.containerNode)},destroy:function(){this.inherited(arguments);g.forEach(this._pbConnects,q.disconnect);delete this._pbConnects;this._driveTimeClickHandles&&0<this._driveTimeClickHandles.length&&(g.forEach(this._driveTimeClickHandles,q.disconnect),this._driveTimeClickHandles=null)},postMixInProperties:function(){this.inherited(arguments);d.mixin(this.i18n,u.bufferTool);d.mixin(this.i18n,
u.driveTimes);d.mixin(this.i18n,u.summarizeNearbyTool)},postCreate:function(){this.inherited(arguments);t.add(this._form.domNode,"esriSimpleForm");this._breakValuesInput.set("validator",d.hitch(this,this.validateDistance));this._outputLayerInput.set("validator",d.hitch(this,this.validateServiceName));this._buildUI()},startup:function(){},_onClose:function(a){a&&(this._save(),this.emit("save",{save:!0}));this.emit("close",{save:a})},_handleShowCreditsClick:function(a){a.preventDefault();if(this._form.validate()){a=
{};var b;b=this.summaryLayers[this._layersSelect.get("value")];a.summaryLayer=h.toJson(k.constructAnalysisInputLyrObj(b));a.nearType=this.get("nearType");a.sumNearbyLayer=h.toJson(k.constructAnalysisInputLyrObj(this.sumNearbyLayer));a.summaryFields=h.toJson(this.get("summaryFields"));a.distances=h.toJson(this.get("distances"));a.units=this._distanceUnitsSelect.get("value");this._trafficTimeWidget.get("checked")&&(a.timeOfDay=this._trafficTimeWidget.get("timeOfDay"),"UTC"===this._trafficTimeWidget.get("timeZoneForTimeOfDay")&&
(a.timeZoneForTimeOfDay=this._trafficTimeWidget.get("timeZoneForTimeOfDay")));this.returnFeatureCollection||(a.OutputName=h.toJson({serviceProperties:{name:this._outputLayerInput.get("value")}}));a.sumShape=this._sumMetricCheck.get("checked");if("esriGeometryPoint"!==b.geometryType||"esriGeometryMultipoint"!==b.geometryType)a.shapeUnits=this.get("shapeUnits");"0"!==this._groupBySelect.get("value")&&(a.groupByField=this._groupBySelect.get("value"));a.returnBoundaries=this.get("returnBoundaries");this.showChooseExtent&&
this._useExtentCheck.get("checked")&&(a.context=h.toJson({extent:this.map.extent._normalize(!0)}));this.getCreditsEstimate(this.toolName,a).then(d.hitch(this,function(a){this._usageForm.set("content",a);this._usageDialog.show()}))}},_handleSaveBtnClick:function(){if(this._form.validate())if(!this._sumMetricCheck.get("checked")&&0===this.get("summaryFields").length)this._showMessages(this.i18n.statsRequiredMsg);else{this._saveBtn.set("disabled",!0);var a={},b={},c,e;c=this.summaryLayers[this._layersSelect.get("value")];
a.summaryLayer=h.toJson(k.constructAnalysisInputLyrObj(c));e=this._nearTypeSelect.getOptions(this._nearTypeSelect.get("value"));a.nearType=e.travelMode?h.toJson(e.travelMode):this._nearTypeSelect.get("value");a.sumNearbyLayer=h.toJson(k.constructAnalysisInputLyrObj(this.sumNearbyLayer));a.summaryFields=h.toJson(this.get("summaryFields"));a.distances=this.get("distances");a.units=this._distanceUnitsSelect.get("value");this._trafficTimeWidget.get("checked")&&(a.timeOfDay=this._trafficTimeWidget.get("timeOfDay"),
"UTC"===this._trafficTimeWidget.get("timeZoneForTimeOfDay")&&(a.timeZoneForTimeOfDay=this._trafficTimeWidget.get("timeZoneForTimeOfDay")));a.returnBoundaries=this.get("returnBoundaries");this.returnFeatureCollection||(a.OutputName=h.toJson({serviceProperties:{name:this._outputLayerInput.get("value")}}));a.sumShape=this._sumMetricCheck.get("checked");if("esriGeometryPoint"!==c.geometryType||"esriGeometryMultipoint"!==c.geometryType)a.shapeUnits=this.get("shapeUnits");"0"!==this._groupBySelect.get("value")&&
(a.groupByField=this._groupBySelect.get("value"),this.resultParameter=["resultLayer","groupBySummary"],a.minorityMajority=this.get("minorityMajority"),a.percentShape=this.get("percentPoints"));this.showChooseExtent&&this._useExtentCheck.get("checked")&&(a.context=h.toJson({extent:this.map.extent._normalize(!0)}));this.returnFeatureCollection&&(e={outSR:this.map.spatialReference},this.showChooseExtent&&this._useExtentCheck.get("checked")&&(e.extent=this.map.extent._normalize(!0)),a.context=h.toJson(e));
b.jobParams=a;this._saveBtn.set("disabled",!1);b.itemParams={description:n.substitute(this.i18n.itemDescription,{sumNearbyLayerName:this.sumNearbyLayer.name,summaryLayerName:c.name}),tags:n.substitute(this.i18n.itemTags,{sumNearbyLayerName:this.sumNearbyLayer.name,summaryLayerName:c.name}),snippet:this.i18n.itemSnippet};this.showSelectFolder&&(b.itemParams.folder=this.get("folderId"));this.execute(b)}},_initializeShapeUnits:function(a){this._prevGeometryType&&this._prevGeometryType===a||(this._shapeUnitsSelect.removeOption(this._shapeUnitsSelect.getOptions()),
l.set(this._shapeUnitsSelect.domNode,"display","esriGeometryPoint"===a||"esriGeometryMultipoint"===a?"none":""),"esriGeometryPolygon"===a?(this._shapeUnitsSelect.addOption([{value:"SquareMiles",label:this.i18n.sqMiles},{value:"SquareKilometers",label:this.i18n.sqKm},{value:"SquareMeters",label:this.i18n.sqMeters},{value:"Hectares",label:this.i18n.hectares},{value:"Acres",label:this.i18n.acres}]),"Kilometers"===this.units&&!this.shapeUnits?this.shapeUnits="SquareKilometers":"Kilometers"===this.get("shapeUnits")&&
this.set("shapeUnits","SquareKilometers")):"esriGeometryPolyline"===a&&(this._shapeUnitsSelect.addOption([{value:"Miles",label:this.i18n.miles},{value:"Feet",label:this.i18n.feet},{value:"Kilometers",label:this.i18n.kilometers},{value:"Meters",label:this.i18n.meters},{value:"Yards",label:this.i18n.yards}]),"Kilometers"===this.units&&!this.shapeUnits?this.shapeUnits="Kilometers":"SquareKilometers"===this.get("shapeUnits")&&this.set("shapeUnits","Kilometers")),this._shapeUnitsSelect.set("value",this.get("shapeUnits")),
this._prevGeometryType=a)},_handleLayerChange:function(a){if("browse"===a)this._analysisquery||(this._analysisquery=this._browsedlg.browseItems.get("query")),this._browsedlg.browseItems.set("query",this._analysisquery),this._isAnalysisSelect=!1,this._browsedlg.show();else if(a=this.summaryLayers[a]){this.sumNearbyLayer&&(this.outputLayerName=n.substitute(this.i18n.outputLayerName,{summaryLayerName:a.name,sumNearbyLayerName:this.sumNearbyLayer.name}),this._outputLayerInput.set("value",this.outputLayerName));
this._initializeShapeUnits(a.geometryType);"esriGeometryPolygon"===a.geometryType&&(f.set(this._sumMetricLabel,"innerHTML",this.i18n.summarizeMetricPoly),f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsPolygon"));if("esriGeometryPoint"===a.geometryType||"esriGeometryMultipoint"===a.geometryType)f.set(this._sumMetricLabel,"innerHTML",this.i18n.summarizeMetricPoint),f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsPoint");"esriGeometryPolyline"===a.geometryType&&(f.set(this._sumMetricLabel,
"innerHTML",this.i18n.summarizeMetricLine),f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsLine"));this.set("groupBySelect",this.groupByField);this._removeStatsRows();this._createStatsRow()}},_handleAttrSelectChange:function(a){var b;"0"!==a&&(a=this.get("statisticSelect"),"0"!==a.get("value")&&!a.get("isnewRowAdded")&&(b=a.get("removeTd"),l.set(b,"display","block"),b=a.get("referenceWidget"),d.hitch(b,b._createStatsRow()),b._sumMetricCheck.set("disabled",!1),a.set("isnewRowAdded",!0)))},
_handleStatsValueUpdate:function(a,b,c){this.get("attributeSelect")&&(a=this.get("attributeSelect"),"0"!==a.get("value")&&"0"!==c&&!this.get("isnewRowAdded")&&(c=this.get("removeTd"),l.set(c,"display","block"),c=this.get("referenceWidget"),d.hitch(c,c._createStatsRow()),c._sumMetricCheck.set("disabled",!1),this.set("isnewRowAdded",!0)))},_handleDistValueChange:function(a){this.set("outputLayerName")},_handleDistUnitsChange:function(a){this.set("outputLayerName");this.set("units",a)},_handleShapeUnitsChange:function(a){this.set("shapeUnits",
a)},_handleDistanceTypeChange:function(a){this.set("nearType",a);var b,c;c=this._nearTypeSelect.getOptions(this._nearTypeSelect.get("value"));p.isDefined(c)?(b="Time"===c.units,a="Time"===c.units&&"driving"===c.modei18nKey):(b=-1!==a.indexOf("Time"),a="DrivingTime"===a);l.set(this._useTrafficRow,"display",a?"":"none");this._trafficTimeWidget.set("disabled",!a);this._trafficTimeWidget.set("reset",!a);b?(this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()),this._distanceUnitsSelect.addOption([{value:"Seconds",
label:this.i18n.seconds},{value:"Minutes",label:this.i18n.minutes,selected:"selected"},{value:"Hours",label:this.i18n.hours}]),this.set("units",this._distanceUnitsSelect.get("value"))):(this.get("units")&&this.set("units",this.get("units")),this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()),this._distanceUnitsSelect.addOption([{value:"Miles",label:this.i18n.miles},{value:"Yards",label:this.i18n.yards},{value:"Feet",label:this.i18n.feet},{type:"separator"},{value:"Kilometers",
label:this.i18n.kilometers},{value:"Meters",label:this.i18n.meters}]),this._distanceUnitsSelect.set("value",this.units));this.set("outputLayerName")},_handleGroupBySelectChange:function(a){a="0"===a;t.toggle(this._minmajorityLabel,"esriAnalysisTextDisabled",a);t.toggle(this._percentPointsLabel,"esriAnalysisTextDisabled",a);this._percentPointsCheck.set("disabled",a);this._minmajorityCheck.set("disabled",a)},_save:function(){},_buildUI:function(){var a;k.initHelpLinks(this.domNode,this.showHelp);l.set(this._showCreditsLink,
"display",!0===this.showCredits?"block":"none");this.get("showSelectAnalysisLayer")&&(!this.get("sumNearbyLayer")&&this.get("sumNearbyLayers")&&this.set("sumNearbyLayer",this.sumNearbyLayers[0]),k.populateAnalysisLayers(this,"sumNearbyLayer","sumNearbyLayers"));this.distances?this._breakValuesInput.set("value",this.distances.toString().replace(/,/g," ")):(this.distances=[],this.distances.push(this._breakValuesInput.get("value")));k.populateTravelModes({selectWidget:this._nearTypeSelect,addStraightLine:!0,
widget:this,enableTravelModes:this.get("enableTravelModes")});this.sumNearbyLayer&&(f.set(this._aggregateToolDescription,"innerHTML",n.substitute(this.i18n.summarizeDefine,{sumNearbyLayerName:this.sumNearbyLayer.name})),"esriGeometryPoint"!==this.sumNearbyLayer.geometryType&&(this.set("enableTravelModes",!1),this._updateTravelModes(!1)));this.units&&this._distanceUnitsSelect.set("value",this.units);if(this.summaryLayers&&(g.forEach(this.summaryLayers,function(a,c){a!==this.sumNearbyLayer&&(this._layersSelect.addOption({value:c,
label:a.name}),this.summaryLayer&&this.summaryLayer===a&&this._layersSelect.set("value",c))},this),a=this.summaryLayers[this._layersSelect.get("value")])){!this.outputLayerName&&this.sumNearbyLayer&&(this.outputLayerName=n.substitute(this.i18n.outputLayerName,{summaryLayerName:a.name,sumNearbyLayerName:this.sumNearbyLayer.name}));f.set(this._addStatsLabel,"innerHTML",n.substitute(this.i18n.addStats,{summaryLayerName:a.name}));this._initializeShapeUnits(a.geometryType);this.shapeUnits&&this._shapeUnitsSelect.set("value",
this.shapeUnits);"esriGeometryPolygon"===a.geometryType&&(f.set(this._sumMetricLabel,"innerHTML",this.i18n.summarizeMetricPoly),f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsPolygon"));if("esriGeometryPoint"===a.geometryType||"esriGeometryMultipoint"===a.geometryType)f.set(this._sumMetricLabel,"innerHTML",this.i18n.summarizeMetricPoint),f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsPoint");"esriGeometryPolyline"===a.geometryType&&(f.set(this._sumMetricLabel,"innerHTML",this.i18n.summarizeMetricLine),
f.set(this._addStatsHelpLink,"esriHelpTopic","StatisticsLine"))}k.addReadyToUseLayerOption(this,[this._analysisSelect,this._layersSelect]);this.outputLayerName&&this._outputLayerInput.set("value",this.outputLayerName);!this.sumShape&&this.summaryFields&&this._sumMetricCheck.set("checked",this.sumShape);this._createStatsRow();g.forEach(this.summaryFields,function(a){a=a.split(" ");this._currentAttrSelect.set("value",a[0]);d.hitch(this._currentAttrSelect,this._handleAttrSelectChange,a[0])();this._currentStatsSelect.set("value",
a[1]);d.hitch(this._currentStatsSelect,this._handleStatsValueUpdate,"value","",a[1])()},this);l.set(this._chooseFolderRow,"display",!0===this.showSelectFolder?"block":"none");this.showSelectFolder&&this.getFolderStore().then(d.hitch(this,function(a){this.folderStore=a;k.setupFoldersUI({folderStore:this.folderStore,folderId:this.folderId,folderName:this.folderName,folderSelect:this._webMapFolderSelect,username:this.portalUser?this.portalUser.username:""})}));l.set(this._chooseExtentDiv,"display",!0===
this.showChooseExtent?"inline-block":"none");this.set("groupBySelect",this.groupByField);this.minorityMajority&&this._minmajorityCheck.set("checked",this.minorityMajority);this.percentPoints&&this._percentPointsCheck.set("checked",this.percentPoints);this._handleDistanceTypeChange("StraightLine");this._loadConnections()},validateDistance:function(){var a=this,b,c=[],e,f,h;this.set("distances");b=d.trim(this._breakValuesInput.get("value")).split(" ");"StraightLine"!==this._nearTypeSelect.get("value")&&
(h=k.getMaxInputByMode({type:this._nearTypeSelect.get("value").replace("-",""),units:this._distanceUnitsSelect.get("value")}));if(0===b.length)return!1;g.forEach(b,function(b){b=r.parse(b);if(isNaN(b)||b>h)return c.push(0),!1;e=r.format(b,{locale:"root"});p.isDefined(e)?p.isDefined(e)||(e=r.format(b,{locale:"en-us"})):e=r.format(b,{locale:"en"});p.isDefined(e)&&(f=d.trim(e).match(/\D/g));f&&g.forEach(f,function(b){"."===b||","===b?c.push(1):"-"===b&&"polygon"===a.inputType?c.push(1):c.push(0)})});
return-1!==g.indexOf(c,0)?(this._breakValuesInput.focus(),!1):!0},_loadConnections:function(){this.on("start",d.hitch(this,"_onClose",!0));this._connect(this._closeBtn,"onclick",d.hitch(this,"_onClose",!1));this._driveTimeClickHandles=[];this._driveTimeClickHandles.push(q.connect(this._nearTypeSelect,"onChange",d.hitch(this,"_handleDistanceTypeChange")));this.watch("enableTravelModes",d.hitch(this,function(a,b,c){this._updateTravelModes(c)}))},_createStatsRow:function(){var a,b,c,e,f;e=this.summaryLayers[this._layersSelect.get("value")];
a=m.create("tr",null,this._afterStatsRow,"before");c=m.create("td",{style:{width:"45%",maxWidth:"100px"}},a);b=m.create("td",{style:{width:"55%",maxWidth:"104px"}},a);c=new y({maxHeight:200,"class":"esriLeadingMargin1 mediumInput esriTrailingMargin05 attrSelect",style:{tableLayout:"fixed",overflowX:"hidden"}},m.create("select",null,c));this.set("attributes",{selectWidget:c,summaryLayer:e});b=new y({"class":"mediumInput statsSelect",style:{tableLayout:"fixed",overflowX:"hidden"}},m.create("select",
null,b));this.set("statistics",{selectWidget:b});c.set("statisticSelect",b);q.connect(c,"onChange",this._handleAttrSelectChange);f=m.create("td",{"class":"shortTextInput removeTd",style:{display:"none",maxWidth:"12px"}},a);e=m.create("a",{title:this.i18n.removeAttrStats,"class":"closeIcon statsRemove",innerHTML:"\x3cimg src\x3d'"+z.toUrl("./images/close.gif")+"' border\x3d'0''/\x3e"},f);q.connect(e,"onclick",d.hitch(this,this._handleRemoveStatsBtnClick,a));this._statsRows.push(a);b.set("attributeSelect",
c);b.set("removeTd",f);b.set("isnewRowAdded",!1);b.set("referenceWidget",this);b.watch("value",this._handleStatsValueUpdate);this._currentStatsSelect=b;this._currentAttrSelect=c;return!0},_handleRemoveStatsBtnClick:function(a){this._removeStatsRow(a);0===this.get("summaryFields").length&&(this._sumMetricCheck.set("disabled",!0),this._sumMetricCheck.set("checked",!0))},_removeStatsRows:function(){g.forEach(this._statsRows,this._removeStatsRow,this);this._statsRows=[]},_removeStatsRow:function(a){g.forEach(x.findWidgets(a),
function(a){a.destroyRecursive()});m.destroy(a)},_handleAnalysisLayerChange:function(a){"browse"===a?(this._analysisquery||(this._analysisquery=this._browsedlg.browseItems.get("query")),this._browsedlg.browseItems.set("query",this._analysisquery),this._isAnalysisSelect=!0,this._browsedlg.show()):(this.sumNearbyLayer=this.sumNearbyLayers[a],this._updateAnalysisLayerUI(!0))},_handleBrowseItemsSelect:function(a){a&&a.selection&&k.addAnalysisReadyLayer({item:a.selection,layers:this._isAnalysisSelect?
this.sumNearbyLayers:this.summaryLayers,layersSelect:this._isAnalysisSelect?this._analysisSelect:this._layersSelect,browseDialog:this._browsedlg,widget:this}).always(d.hitch(this,this._updateAnalysisLayerUI,!0))},_updateAnalysisLayerUI:function(a){var b=this.summaryLayers[this._layersSelect.get("value")],c=this._layersSelect.get("value");a&&(this.get("sumNearbyLayer")&&b)&&(this.outputLayerName=n.substitute(this.i18n.outputLayerName,{summaryLayerName:b.name,sumNearbyLayerName:this.sumNearbyLayer.name}),
this._outputLayerInput.set("value",this.outputLayerName));this.summaryLayers&&this.sumNearbyLayer&&(a=g.some(this._layersSelect.getOptions(),function(a){return"browse"===a.value},this),this._layersSelect.removeOption(this._layersSelect.getOptions()),g.forEach(this.summaryLayers,function(a,b){var d=!0;if(a.url&&this.sumNearbyLayer.url&&a.url!==this.sumNearbyLayer.url)d=!1;else if(this.sumNearbyLayer!==a&&(!a.analysisReady||!this.sumNearbyLayer.analysisReady))d=!1;d||(this._layersSelect.addOption({value:b,
label:a.name}),c===b&&this._layersSelect.set("value",b))},this),this.get("showReadyToUseLayers")&&a&&(this._layersSelect.addOption({type:"separator",value:""}),this._layersSelect.addOption({value:"browse",label:this.i18n.browseAnalysisTitle})))},_setAnalysisGpServerAttr:function(a){a&&(this.analysisGpServer=a,this.set("toolServiceUrl",this.analysisGpServer+"/"+this.toolName))},_setSumNearbyLayersAttr:function(a){this.sumNearbyLayers=a},_setSumNearbyLayerAttr:function(a){this.sumNearbyLayer=a},_setSummaryLayersAttr:function(a){this.summaryLayers=
a},_setSummaryLayerAttr:function(a){this.summaryLayer=a},_setLayersAttr:function(a){this.summaryLayers=[]},_setAttributesAttr:function(a){if(a.summaryLayer){var b,c;b=a.summaryLayer;c=a.selectWidget;a=b.fields;c.addOption({value:"0",label:this.i18n.attribute});g.forEach(a,function(a){-1!==g.indexOf(["esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble"],a.type)&&c.addOption({value:a.name,label:p.isDefined(a.alias)&&""!==a.alias?a.alias:a.name})},this)}},_setStatisticsAttr:function(a){a=
a.selectWidget;a.addOption({value:"0",label:this.i18n.statistic});a.addOption({value:"SUM",label:this.i18n.sum});a.addOption({value:"MIN",label:this.i18n.minimum});a.addOption({value:"MAX",label:this.i18n.maximum});a.addOption({value:"MEAN",label:this.i18n.average});a.addOption({value:"STDDEV",label:this.i18n.standardDev})},_setSummaryFieldsAttr:function(a){this.summaryFields=a},_getSummaryFieldsAttr:function(){var a="",b=[];B(".statsSelect",this.domNode).forEach(function(c){var e;c=x.byNode(c);e=
c.get("attributeSelect");"0"!==e.get("value")&&"0"!==c.get("value")&&(a+=e.get("value")+" "+c.get("value")+";",b.push(e.get("value")+" "+c.get("value")))});return b},_setGroupBySelectAttr:function(a){var b=this.summaryLayers[this._layersSelect.get("value")],c=p.isDefined(b)?b.fields:[];0<this._groupBySelect.getOptions().length&&this._groupBySelect.removeOption(this._groupBySelect.getOptions());this._groupBySelect.addOption({value:"0",label:this.i18n.attribute});g.forEach(c,function(a,c){-1!==g.indexOf(["esriFieldTypeSmallInteger",
"esriFieldTypeInteger","esriFieldTypeString","esriFieldTypeDate"],a.type)&&a.name!==b.objectIdField&&this._groupBySelect.addOption({value:a.name,label:p.isDefined(a.alias)&&""!==a.alias?a.alias:a.name})},this);a&&this._groupBySelect.set("value",a);this._handleGroupBySelectChange(this._groupBySelect.get("value"))},_setDisableRunAnalysisAttr:function(a){this._saveBtn.set("disabled",a)},_setNearTypeAttr:function(a){this.nearType=a},_getNearTypeAttr:function(){return this.nearType},_setDistancesAttr:function(a){if(a)this.distances=
a;else if(this._breakValuesInput&&this._breakValuesInput.get("value")){a=d.trim(this._breakValuesInput.get("value")).split(" ");var b=[];g.forEach(a,function(a){b.push(r.parse(a))});this.distances=b}},_getDistancesAttr:function(){return this.distances},_setUnitsAttr:function(a){this.units=a},_getUnitsAttr:function(){return this.units},_setShapeUnitsAttr:function(a){this.shapeUnits=a},_getShapeUnitsAttr:function(){return this.shapeUnits},_getSumShapeAttr:function(){return this._sumMetricCheck.get("checked")},
_setSumShapeAttr:function(a){this.sumShape=a},_setMinorityMajorityAttr:function(a){this.minorityMajority=a},_getMinorityMajorityAttr:function(a){this._minmajorityCheck&&(this.minorityMajority=this._minmajorityCheck.get("checked"));return this.minorityMajority},_setPercentPointsAttr:function(a){this.percentPoints=a},_getPercentPointsAttr:function(a){this._percentPointsCheck&&(this.percentPoints=this._percentPointsCheck.get("checked"));return this.percentPoints},_setEnableTravelModesAttr:function(a){this._set("enableTravelModes",
a)},_getReturnBoundariesAttr:function(){this._returnBdrycCheck&&(this.returnBoundaries=this._returnBdrycCheck.get("checked"));return this.returnBoundaries},_setReturnBoundariesAttr:function(a){this.returnBoundaries=a},validateServiceName:function(a){return k.validateServiceName(a,{textInput:this._outputLayerInput})},_connect:function(a,b,c){this._pbConnects.push(q.connect(a,b,c))},_showMessages:function(a){f.set(this._bodyNode,"innerHTML",a);v.fadeIn({node:this._errorMessagePane,easing:w.quadIn,onEnd:d.hitch(this,
function(){l.set(this._errorMessagePane,{display:""})})}).play()},_handleCloseMsg:function(a){a&&a.preventDefault();v.fadeOut({node:this._errorMessagePane,easing:w.quadOut,onEnd:d.hitch(this,function(){l.set(this._errorMessagePane,{display:"none"})})}).play()},_updateTravelModes:function(a){var b=this._nearTypeSelect.getOptions();g.forEach(b,function(b){"StraightLine"!==b.value&&(b.disabled=!a)});this._nearTypeSelect.updateOption(b)}});A("extend-esri")&&d.setObject("dijit.analysis.SummarizeNearby",
s,H);return s});