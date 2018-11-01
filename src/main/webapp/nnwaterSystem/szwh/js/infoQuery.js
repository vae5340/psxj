var roadIndet=0;

function identityRoad(p){
     map.infoWindow.hide();
     map.graphics.clear();
     $("#mapDiv_container").css("cursor","wait");
     var symbol= new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,6,
      (new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")),new esri.Color([255,0,0]));
     var graphic= new esri.Graphic(p,symbol);
     map.graphics.add(graphic);
     var identifyTask = new esri.tasks.IdentifyTask(arcgisMapBaseUrl+"/arcgis/rest/services/map2015/MapServer");
     var identifyParams = new esri.tasks.IdentifyParameters();
     identifyParams.tolerance = 3;
     identifyParams.returnGeometry = true;
     identifyParams.layerIds = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];              
     identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
     identifyParams.mapExtent = map.extent;
     identifyParams.geometry=p;
     identifyTask.execute(identifyParams,function(results){
         $("#mapDiv_container").css("cursor","default");
         if(results.length>0){
            for(var i=0;i<results.length;i++){
                if(results[i].feature.attributes.名称||results[i].feature.attributes.NAME){
		          	map.infoWindow.setTitle(results[i].value);
		          	var content="名称："+(function(){return results[i].feature.attributes.名称||results[i].feature.attributes.NAME})()+
		          	(function(){return results[i].feature.attributes.TYPE?("<br>类型："+results[i].feature.attributes.TYPE):""})()+
		          	 "<br>道路长度："+parseFloat(results[i].feature.attributes.SHAPE_LEN).toFixed(2)+"米";
		          	 if(results[i].feature.attributes.SHAPE_AREA)
		            	content+="<br>道路面积："+parseFloat(results[i].feature.attributes.SHAPE_AREA).toFixed(2)+"平方米";
		             if(results[i].feature.attributes.现状描述)	
		                content+="<br>描述："+results[i].feature.attributes.现状描述;
			        map.infoWindow.setContent(content);
			        changeInfoWindowUI();
			        map.infoWindow.show(p);
			        break;
			    }else
			       continue;    
		    }    
         }else{
            layer.msg("所选位置无道路");
         }
     });
}

var roadStatisticArr,roadTableHtml;
function getRoadStatistic(layerIds,statisticArr,i){
    var queryTask = new esri.tasks.QueryTask(arcgisMapBaseUrl+"/arcgis/rest/services/map2015/MapServer"+"/"+layerIds[i]);
    var query = new esri.tasks.Query();
    query.outFields = ["*"];
    query.where = "1=1";
	//var statisticDefinition = new esri.tasks.StatisticDefinition();
    //statisticDefinition.statisticType = "sum";
    //statisticDefinition.onStatisticField = "SHAPE_LEN";
    //statisticDefinition.outStatisticFieldName = "rLength";
    //query.outStatistics = [statisticDefinition];
    queryTask.execute(query,function(result){
         var length=0;
         //if(result.features[0])
         //   length=parseFloat(result.features[0].attributes.roadLength.toFixed(2));
         if(result.features[0].attributes.SHAPE_LEN){
	         for(var index=0;index<result.features.length;index++){
	             length+=result.features[index].attributes.SHAPE_LEN;
	         }
         }
         else if(result.features[0].attributes.SHAPE_Leng){
	         for(var index=0;index<result.features.length;index++){
	             length+=result.features[index].attributes.SHAPE_Leng;
	         }
         }
           
         statisticArr.push(parseFloat(length.toFixed(2)));
         if(i<16){
            i=i+1;
            getRoadStatistic(layerIds,statisticArr,i);
          }else{
            roadTableHtml= '<table id="tableInfo"><thead><tr style="font-size:15px;width:100%">'+
            '<td>高速公路</td><td>'+statisticArr[0]+'</td><td>快速路</td><td>'+statisticArr[1]+'</td><td>轻轨线</td><td>'+statisticArr[2]+'</td>'+
            '<td>水南高速</td><td>'+statisticArr[3]+'</td><td>省道</td><td>'+statisticArr[4]+'</td><td>县乡道路</td><td>'+statisticArr[5]+'</td></tr><tr>'+
            '<td>国道</td><td>'+statisticArr[6]+'</td><td>高架桥_高速公路</td><td>'+statisticArr[7]+'</td>'+
            '<td>高架桥_快速路</td><td>'+statisticArr[8]+'</td><td>高架桥_主干道</td><td>'+statisticArr[9]+'</td><td>高架桥_次要道路</td><td>'+statisticArr[10]+'</td>'+
            '<td>主干道</td><td>'+statisticArr[11]+'</td></tr><tr><td>次要道路</td><td>'+statisticArr[12]+'</td><td>支道</td><td>'+statisticArr[13]+'</td>'+
            '<td>双线铁路</td><td>'+statisticArr[14]+'</td><td>单线铁路</td><td>'+statisticArr[15]+'</td><td>地下隧道</td><td>'+statisticArr[16]+'</td><td colspan="2">单位：米</td></tr></thead></table>';
            roadStatisticArr=statisticArr;
          } 
    },function(e){
       alert(e);
    });
}