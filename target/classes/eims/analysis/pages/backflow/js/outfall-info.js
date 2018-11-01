define([
    'module',
    'dojo/request',
    'dojo/_base/lang',
    'esri/geometry/Extent',
    'esri/symbols/PictureMarkerSymbol',
    'esri/Color',
    'esri/graphic',
    'esri/geometry/Point'
    ],function(
            module,
		    request,
		    lang,
		    Extent,
		    PictureMarkerSymbol,
		    Color,
		    Graphic,
		    Point
		){
        var options,
            use,
            outfallArr,
            backOutfalls,
            stations,
            backStations,
            map,
            flowSymbolRed,
            flowSymbolBlue,
            backCountArr;
            
         //outfallID,x,y,value,combID,outfallName
         outfallArr=[{"id":1,"x":108.239000,"y":22.843000,"value":70,"combId":84,"name":'a'},
                {"id":2,"x":108.238000,"y":22.844000,"value":70,"combId":84,"name":'b'},
                {"id":3,"x":108.283000,"y":22.842000,"value":70,"combId":85,"name":'c'},
                {"id":4,"x":108.282000,"y":22.843000,"value":70,"combId":85,"name":'d'},
                {"id":5,"x":108.302000,"y":22.817000,"value":70,"combId":86,"name":'e'},
                {"id":6,"x":108.301000,"y":22.818000,"value":70,"combId":86,"name":'f'},
                {"id":7,"x":108.326000,"y":22.863000,"value":80,"combId":87,"name":'g'},
                {"id":8,"x":108.325000,"y":22.864000,"value":70,"combId":87,"name":'h'},
                {"id":9,"x":108.331000,"y":22.832000,"value":70,"combId":88,"name":'i'},
                {"id":10,"x":108.330000,"y":22.833000,"value":70,"combId":88,"name":'j'},
                {"id":11,"x":108.324000,"y":22.799000,"value":70,"combId":92,"name":'k'},
                {"id":12,"x":108.323000,"y":22.780000,"value":70,"combId":92,"name":'l'},
                {"id":13,"x":108.321000,"y":22.766000,"value":70,"combId":93,"name":'m'},
                {"id":14,"x":108.320000,"y":22.767000,"value":70,"combId":93,"name":'n'},
                {"id":15,"x":108.327680,"y":22.779812,"value":70,"combId":475,"name":'o'},
                {"id":16,"x":108.326680,"y":22.780812,"value":70,"combId":475,"name":'p'},
                {"id":17,"x":108.328399,"y":22.778321,"value":70,"combId":493,"name":'q'},
                {"id":18,"x":108.327399,"y":22.779321,"value":70,"combId":493,"name":'r'},
                {"id":19,"x":108.259493,"y":22.819286,"value":80,"combId":495,"name":'s'},
                {"id":20,"x":108.258493,"y":22.820286,"value":70,"combId":495,"name":'t'}
          ];
                
          use=function(opts){
              options={};
              lang.mixin(options,opts);
              backOutfalls=[];
		      backCountArr=[];
		      backStations=[];
              flowSymbolRed = new PictureMarkerSymbol({'url':'/awater/pipe/pipeNetwork/img/end-marker.png', 'height':20, 'width':14, 'yoffset': 10}),
              flowSymbolBlue = new PictureMarkerSymbol({'url':'/awater/pipe/pipeNetwork/img/target-marker.png', 'height':20, 'width':14, 'yoffset': 10}),
              map=options.map;
              getRiverStation(options.stationUrl);
          };   
          
          function getRiverStation(url){
               request(url,{
                        'handleAs': 'json',
                    }).then(function(response){
                        stations=response.result;
                        for(var i in stations){
                           var flowback=true;
                           var stationCoor=[stations[i].x,stations[i].y];
                           var backCount=0,allCount=0;
                           for(var j in outfallArr){
                              if(outfallArr[j].combId==stations[i].combId){
                                  allCount++;
                                  if(outfallArr[j].value<stations[i].value){
                                      backCount++;
	                                  backOutfalls.push(outfallArr[j]);
	                                  var outfallCoor=[outfallArr[j].x,outfallArr[j].y];
	                                  addFlowbackToMap(stationCoor,outfallCoor,flowback);
	                                  if(flowback){
	                                    backStations.push(stations[i]);
	                                  }
	                                  flowback=false;
	                              }
                              }
                           }
                           if(backCount>0)
                              backCountArr.push([backCount,allCount-backCount]);
                        }
                        showResult(backStations,backOutfalls,backCountArr);
                    });
          }
          
          function showResult(stations,outfallBacks,backCountArr){
		        $.jsPanel({
		            id:'flowbackPanel',
				    contentIframe:{src:"/psemgy/eims/analysis/pages/backflow/analysis.html",name:'analysisFrame'},
				    contentSize: {width: 750, height: 365},
				    resizable: {disabled:true},
				    theme: 'default',
				    headerControls: {maximize:'remove'},
				    content: function(){$(this).css('border-top','');},
				    position:{my:'right-bottom',at:'right-bottom',offsetX:-20,offsetY:-10},
				    headerTitle:'<span style="padding-left:300px">倒灌分析结果图表</span>',
				    callback:function(){
						   $($("iframe[name='analysisFrame']")[0].contentWindow).load(function(){
						       $("iframe[name='analysisFrame']")[0].contentWindow.stations=stations; 
							   $("iframe[name='analysisFrame']")[0].contentWindow.outfallBacks=outfallBacks;  
							   $("iframe[name='analysisFrame']")[0].contentWindow.backCountArr=backCountArr;
							   $("iframe[name='analysisFrame']")[0].contentWindow.outfallCount=outfallArr.length;
						   });
                         },
				    onclosed: function(){map.graphics.clear();}
			   });
		  }
         
          function addFlowbackToMap(stationCoor,outfallCoor,back){
             if(back){
                var stationPoint=new esri.geometry.Point(stationCoor[0],stationCoor[1]);
                map.graphics.add(new Graphic(stationPoint, flowSymbolBlue));
             }
             var outfallPoint=new esri.geometry.Point(outfallCoor[0],outfallCoor[1]);
             map.graphics.add(new Graphic(outfallPoint, flowSymbolRed));
          }
                
          return{
            'use':use
          };       
});