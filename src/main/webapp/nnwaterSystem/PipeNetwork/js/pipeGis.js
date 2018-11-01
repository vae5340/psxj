function initPipeGis(){
		//搜地点道路
       //awaterui.addressLocate();
       pipeGis.toolBar.tb = new esri.toolbars.Draw(map)   ;  
	   pipeGis.geometryService=new esri.tasks.GeometryService(arcgisBaseUrl+"/arcgis/rest/services/Utilities/Geometry/GeometryServer");
	   pipeGis.symbol.lineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color([230,255,0])).setWidth(3);
	   pipeGis.symbol.markerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color([230,255,0])).setSize(6).setOutline(pipeGis.symbol.lineSymbol);
	   pipeGis.symbol.fillSymbol=(new esri.symbol.SimpleFillSymbol()).setOutline(pipeGis.symbol.lineSymbol);	 
       pSymbol = new esri.symbol.PictureMarkerSymbol('/awater/img/labelLoc.png', 26, 26);
       pSymbolSelected = new esri.symbol.PictureMarkerSymbol('/awater/img/clickLoc.png', 26, 26); 
       map.on("pan-end", function (e){
          if(pipeGis.label.divPoint)
             rePositionLable();
	   });
	   
	   map.on("zoom-end", function (e) {
	      if(pipeGis.label.divPoint)
             rePositionLable();
          if(pipeGis.grid.imgGraphic){
              gridGraphicLayer.remove(pipeGis.grid.imgGraphic);
              var mapDivH=$("#mapDiv_container").css("height");
			  var height=(0.189821023/map.extent.getHeight())*(parseInt(mapDivH.substr(0,mapDivH.length-2)));
			  var locPoint=new esri.geometry.Point(108.293106747,22.8078552815,map.spatialReference)
			  var imgSymbol=new esri.symbol.PictureMarkerSymbol({
			    "url":pipeGis.grid.imgUrl,
			    "height":height+25*(250000/map.getScale()),
			    "width":height+25*(250000/map.getScale()),
			    "type":"esriPMS"
			  });
			  pipeGis.grid.imgGraphic=new esri.Graphic(locPoint, imgSymbol);
		      gridGraphicLayer.add(pipeGis.grid.imgGraphic);
          }  
	   });  
       $("#searchInput").on('input',function(){
        if($(this).val().trim()!="") { 
            $(".clearInput").css("display","inline")
		 }else{
            $(".clearInput").css("display","none")
		 }
       });
       $(".clearInput").click(function(){
          $("#searchInput").val("");
          $("#searchPanel").hide();
          $(".clearInput").css("display","none");
          if(locFeatureLayer)
	         locFeatureLayer.clear();
	      if(locGraphicLayer)
	         locGraphicLayer.clear();   
       });
    }
    
    var pipeGis={
        measureType:0,
        geometryService:null,
        toolBar:{
            tb:null,
            tbDrawEventObject:null
        },
        jsPipePanel:null,
        symbol:{
           markerSymbol:null,
           lineSymbol:null,
           fillSymbol:null,
           textSymbol:null,
           mapDrawSybmol:null
        },
        angle:{
           pipeArr:[],
           pointArr:[]
        },
        grid:{
           imgGraphic:null,
           imgUrl:""
        },
        label:{
           domContent:"",
           divPoint:null,
           divH:24,
           divW:0,
           type:0,
           geometry:null
        }
    };
    
    function getMeasurement(evtObj){
	      pipeGis.label.geometry = evtObj.geometry;
	      var geometry=pipeGis.label.geometry;
	      map.graphics.clear();
	      switch(pipeGis.measureType){   	      
	        case "area":
	              map.graphics.add(new esri.Graphic(geometry,pipeGis.symbol.mapDrawSybmol));      
			      var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
			      areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
			      areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
			      areasAndLengthParams.calculationType = "preserveShape";
			      pipeGis.geometryService.simplify([geometry], function(simplifiedGeometries){
			         areasAndLengthParams.polygons = simplifiedGeometries;
			         pipeGis.geometryService.areasAndLengths(areasAndLengthParams);
			      });
	             break;
	        case "length":
	        	  map.graphics.add(new esri.Graphic(geometry,pipeGis.symbol.mapDrawSybmol));      
			      var lengthParams = new esri.tasks.LengthsParameters();
			      lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
			      lengthParams.calculationType = "preserveShape";
			      pipeGis.geometryService.simplify([geometry], function(simplifiedGeometries){
			         lengthParams.polylines = simplifiedGeometries;
			         pipeGis.geometryService.lengths(lengthParams);
			      });
	             break;	     
	     }     
    };

    function outputMeasurement(evtObj){
	      var result = evtObj.result;
          var text,len;
	      switch(pipeGis.measureType){
	        case "area":
  			     text="面积:"+result.areas[0].toFixed(3) + "平方米";
  			     len=65+(result.areas[0].toFixed(3).length)*10.2;
	             break;
	        case "length":
  			     text="长度:"+ result.lengths[0].toFixed(3) + "米";
  			     len=35+(result.lengths[0].toFixed(3).length)*10.2;
	             break;
	     }
	     pipeGis.label.divW=len;
	     getLabelPoints(text,pipeGis.label.geometry);
	 };

     function measure(type){
         if(pipeGis.toolBar.tbDrawEventObject)
            pipeGis.toolBar.tbDrawEventObject.remove();
         pipeGis.measureType=type;
	     switch(type){
	        case "area":
	             pipeGis.geometryService.on("areas-and-lengths-complete", outputMeasurement);	           
	          	 pipeGis.toolBar.tbDrawEventObject=pipeGis.toolBar.tb.on("draw-end", getMeasurement);
	          	 pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleFillSymbol()).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));	        
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.POLYGON);  
	             break;
	        case "length":
	        	 pipeGis.geometryService.on("lengths-complete", outputMeasurement);	           
	          	 pipeGis.toolBar.tbDrawEventObject=pipeGis.toolBar.tb.on("draw-end", getMeasurement);
	          	 pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red"));
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.POLYLINE);  
	             break;
	        case "angle":
	             pipeGis.angle.pipeArr=[];
	             pipeGis.angle.pointArr=[];
	        	 drawTool("point");       
	        	 break;        	  
	     }     
     }
     
     function drawTool(type){ 
          if(pipeGis.toolBar.tbDrawEventObject)
            pipeGis.toolBar.tbDrawEventObject.remove();
         switch(type){
           case "point":
	             pipeGis.symbol.mapDrawSybmol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.POINT);  
	             break;
	        case "polyline":
	             pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red"));
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.POLYLINE);  
	             break;
	        case "circle":
	        	 pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleFillSymbol()).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));	        
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.CIRCLE);  
	             break;  
	        case "rectangle":
	        	 pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleFillSymbol()).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));	        
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.RECTANGLE);  
	             break;
	        case "polygon":
	        	 pipeGis.symbol.mapDrawSybmol= (new esri.symbol.SimpleFillSymbol()).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));	        
	             pipeGis.toolBar.tb.activate(esri.toolbars.Draw.POLYGON);  
	             break;            
	     }	     
	     pipeGis.toolBar.tbDrawEventObject=pipeGis.toolBar.tb.on("draw-end", selectPipeLine);	             
     }
     
     function getLabelPoints(text,geometry){
          /*if(geometry.type=="polyline"){
              var pExtent=geometry.getExtent();
              var polygonJson  = {"rings":[[[pExtent.xmin,pExtent.ymin],[pExtent.xmax,pExtent.ymin],[pExtent.xmax,pExtent.ymax],
			    [pExtent.xmin,pExtent.ymax],[pExtent.xmin,pExtent.ymin]]]};
			  geometry = new esri.geometry.Polygon(polygonJson);
          }    
	      if(geometry.rings.length > 0){
	          pipeGis.geometryService.labelPoints([geometry], function(labelPoints) { 
	          var font = new esri.symbol.Font("17px",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Courier");
	          $.each(labelPoints, function(i) {
	             var pipeGis.symbol.pipeGis.symbol.textSymbol = new esri.symbol.TextSymbol(text,font,new esri.Color([0, 0, 255]));
	             var labelPointGraphic = new esri.Graphic(labelPoints[i], pipeGis.symbol.pipeGis.symbol.textSymbol);
		         map.graphics.add(labelPointGraphic);
	          });
	        });
	      }*/
	      if(geometry.type=="polyline"){
	          var path=geometry.paths[geometry.paths.length-1];
	          var lastPath= path[path.length-1];
	          pipeGis.label.divPoint=new esri.geometry.Point(lastPath[0],lastPath[1]);
	          var firstPoint=new esri.geometry.Point(geometry.paths[0][0][0],geometry.paths[0][0][1]);
	          var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 6,
                   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new esri.Color([255,0,0]), 1),new esri.Color([255,255,255]));
	          var firstGraphic=new esri.Graphic(firstPoint, markerSymbol);
	          var lastGraphic=new esri.Graphic(pipeGis.label.divPoint, markerSymbol);
		      map.graphics.add(firstGraphic);
		      map.graphics.add(lastGraphic);
	          if(lastPath[1]>path[path.length-2][1]){
	              pipeGis.label.type=0;
	              createLableDiv(pipeGis.label.divPoint,pipeGis.label.divW,pipeGis.label.divH,text,pipeGis.label.type);
	          }else{
	              pipeGis.label.type=1;
	              createLableDiv(pipeGis.label.divPoint,pipeGis.label.divW,pipeGis.label.divH,text,pipeGis.label.type);
	          }
	      }else if(geometry.type=="polygon"){
	          pipeGis.label.divPoint=geometry.getExtent().getCenter();
	          pipeGis.label.type=2;
	          createLableDiv(pipeGis.label.divPoint,pipeGis.label.divW,pipeGis.label.divH,text,pipeGis.label.type);
	      }else {
	          alert("无效面");
	          return;
	      }
     }
     
     function selectPipeLine(evtObj) {
        var geo=evtObj.geometry;
        if(!(geo.type=="point"&&pipeGis.angle.pipeArr.length==1)) 
            map.graphics.clear();
	    var graphic = map.graphics.add(new esri.Graphic(geo,pipeGis.symbol.mapDrawSybmol));	           
        var identifyTask = new esri.tasks.IdentifyTask(arcgisBaseUrl+"/arcgis/rest/services/nnpsfacility/MapServer");
        identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.tolerance = 3;
        identifyParams.returnGeometry = true;
        var layerIds=pipeLayers.pipePointLayer.subIds.concat(pipeLayers.drainageLayer.subIds);
        layerIds[layerIds.length]=pipeLayers.pipeLayer.layerId;
        layerIds[layerIds.length]=pipeLayers.conduitLayer.layerId;
        identifyParams.layerIds = layerIds;              
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.mapExtent = map.extent;
        identifyParams.geometry=geo;
        identifyTask.execute(identifyParams,function(results){
             if(geo.type=="point"){
                 if(results.length==0){
                     layer.msg("未选中管线");
                 }else if(results.length==1){
                     if(pipeGis.angle.pipeArr.length==0){
                       pipeGis.angle.pipeArr.push(results[0]);
                       pipeGis.angle.pointArr.push(geo);
                       layer.msg("请选择另外一条管线");
                     }else if(pipeGis.angle.pipeArr.length==1){
                          pipeGis.angle.pipeArr.push(results[0]);
                          pipeGis.angle.pointArr.push(geo);
		                  calculateAngle(pipeGis.angle.pipeArr[0].feature.geometry,pipeGis.angle.pipeArr[1].feature.geometry);        
		                  pipeGis.angle.pipeArr=[];
		                  pipeGis.angle.pointArr=[];
                     }
                 }else if(results.length==2){
                     pipeGis.angle.pointArr.push(geo);
                     calculateAngle(results[0].feature.geometry,results[1].feature.geometry);
                     pipeGis.angle.pointArr=[];
                 }else{
                    layer.msg("所选管线数目大于二");
                    map.graphics.remove(graphic);
                 }   
	         }else{   
	             if(results.length<2){
	                layer.msg("请选择两条管线");
	             }else if(results.length>2){
	                layer.msg("所选管线数目大于二");
	                map.graphics.clear();
	             }else{
	                  calculateAngle(results[0].feature.geometry,results[1].feature.geometry);          
	            }
	        }           
        }); 
     }
     
     function calculateAngle(geo,geo2){
           var line1start=new esri.geometry.Point(geo.paths[0][0]);
           var line1end=new esri.geometry.Point(geo.paths[0][1]);
           var line2start=new esri.geometry.Point(geo2.paths[0][0]);
           var line2end=new esri.geometry.Point(geo2.paths[0][1]);                
           var intersectPoint=esri.geometry.getLineIntersection(line1start,line1end,line2start,line2end);
           var angle=getAngle(line1start,line1end,line2start,line2end,intersectPoint);
           var labelPoint;
           if(pipeGis.angle.pointArr.length==2){
               //labelPoint=new esri.geometry.Point((anglePointArr[0].x+anglePointArr[1].x)/2,(anglePointArr[0].y+anglePointArr[1].y)/2);
               if(pipeGis.angle.pointArr[0].y>pipeGis.angle.pointArr[1].y){
		           pipeGis.label.type=0; 
	           }else{
			       pipeGis.label.type=1;
	           }
	           pipeGis.label.divPoint=pipeGis.angle.pointArr[1];
           }else if(pipeGis.angle.pointArr.length==1){
              labelPoint=new esri.geometry.Point(pipeGis.angle.pointArr[0].x,pipeGis.angle.pointArr[0].y);
              pipeGis.label.divPoint=labelPoint;
              pipeGis.label.type=0;
           }var font = new esri.symbol.Font("18px",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL);
		   	   pipeGis.label.divW=35+(angle.toFixed(3).length)*10.2;
	       createLableDiv(pipeGis.label.divPoint,pipeGis.label.divW,pipeGis.label.divH,"角度:"+angle.toFixed(3)+ "度",pipeGis.label.type);
		   //var pipeGis.symbol.pipeGis.symbol.textSymbol = new esri.symbol.TextSymbol("角度:"+angle.toFixed(3) + "度",font,new esri.Color([0, 0, 0]));
           //var labelPointGraphic = new esri.Graphic(labelPoint, pipeGis.symbol.textSymbol);
	       //map.graphics.add(labelPointGraphic); 
     }
   
     function getAngle(line1start,line1end,line2start,line2end,intersectPoint){
        var line1far,line1near,line2far,line2near,fp,sp;                                           
        if(Math.pow(line1start.x-intersectPoint.x,2)+Math.pow(line1start.y-intersectPoint.y,2)>
        Math.pow(line1end.x-intersectPoint.x,2)+Math.pow(line1end.y-intersectPoint.y,2)){
            line1near=line1end;
            line1far=line1start;
        }   
        else{                      
            line1near=line1start;
            line1far=line1end;
        }
       if(Math.pow(line2start.x-intersectPoint.x,2)+Math.pow(line2start.y-intersectPoint.y,2)>
        Math.pow(line2end.x-intersectPoint.x,2)+Math.pow(line2end.y-intersectPoint.y,2)){
            line2near=line2end;
            line2far=line2start;
        }   
        else{                      
            line2near=line2start;
            line2far=line2end;
        }
        var fpx=line1far.x;
        var fpy=line1far.y;
        var spx=line2far.x;
        var spy=line2far.y;
        var px=intersectPoint.x;
        var py=intersectPoint.y;
        var fSlope,sSlope;
        if(fpx==px)
           fSlope=0;
        else
           fSlope= (fpy-py)/(fpx-px);    
        if(spx==px)         
           sSlope = 0;
        else
           sSlope = (py-spy)/(px-spx);            
        var fAngle = (Math.atan(fSlope)*180)/3.14159;
        var sAngle = (Math.atan(sSlope)*180)/3.14159;
        return Math.abs(fAngle-sAngle);
   }
   
   function openQueryPanel(url,title,width,height){
        pipeGis.jsPipePanel=$.jsPanel({
		    contentAjax:url,
		    contentSize: {width: width, height: height},
		    theme: 'primary',
		    position:{my:'right-top',at:'right-top',offsetX:-10,offsetY:210},
		    headerTitle:title,
		    headerControls: {maximize:'remove'},
		    onclosed: function () {
		        pipeGis.toolBar.tb.deactivate();
		        map.graphics.clear();
		        if($("#leftMenuTable")[0].contentWindow.$table)
		        	$("#leftMenuTable")[0].contentWindow.$table.bootstrapTable('removeAll');
		        if(pipeGis.label.domContent)
		           clearLableDivFunc();    
		    }
	   });
	   createNewtab("mapDiv","地图服务");
	   roadIndet=0;
   }
   
   function centerAtCoor(x,y){
      map.setZoom(17);
      map.centerAt(new esri.geometry.Point(x,y));
   }
   
   function centerAtGeometry(geometry){
   	  map.graphics.clear();
      var graphic;
      if(geometry.type=="point"){
          graphic= new esri.Graphic(geometry, pipeGis.symbol.markerSymbol);
          //var newPoint=new esri.geometry.Point(geometry.x,geometry.y,map.spatialReference)
          map.setZoom(17);
          map.centerAt(geometry); 
          setTimeout(function(){
            map.graphics.add(graphic);
		         setTimeout(function(){
	          	    map.graphics.remove(graphic);
		            setTimeout(function(){
		            map.graphics.add(graphic);
		         },200);
		      },300);
          },300);
      }else if(geometry.type=="polyline"){
          graphic= new esri.Graphic(geometry, pipeGis.symbol.lineSymbol);
          map.setExtent(geometry.getExtent()); 
          setTimeout(function(){
            map.graphics.add(graphic);
		         setTimeout(function(){
	          	    map.graphics.remove(graphic);
		            setTimeout(function(){
		            map.graphics.add(graphic);
		         },200);
		      },300);
          },300);
      }else{
          graphic= new esri.Graphic(geometry, pipeGis.symbol.fillSymbol);
          map.setExtent(geometry.getExtent()); 
           setTimeout(function(){
            map.graphics.add(graphic);
		         setTimeout(function(){
	          	    map.graphics.remove(graphic);
		            setTimeout(function(){
		            map.graphics.add(graphic);
		         },200);
		      },300);
        },300);
     }
   }
   	   
   function closeJsPanel(){
    	pipeGis.jsPipePanel.close(false, true);
   }
   
   function showStatisticWindow(tableData){
        $("#leftMenuTable")[0].src="/awater/nnwaterSystem/PipeNetwork/queryResult.html";		
        var fm1=parent.window.frames["leftMenuTable"]; 
        var fmState=function(){ 
	          var state=null;   
	          if(document.readyState){     	              
	                 state=fm1.document.readyState;   
		               if(state=="complete" || !state){
				            $("#leftMenuTable")[0].contentWindow.$table.bootstrapTable({
								toggle:"table",
								height:400,
								data: tableData,
								rowStyle:"rowStyle",
								cache: false, 
								striped: true,
								sidePagination: "server",
								columns: [
									{visible: true,title: '管道材质',formatter:materialFormat,align:'center'},
									{visible: true,title: '管道类别',formatter:categoryFormat,align:'center'},
									{field:'管道长度',visible: true,title: '管道长度',align:'center'},
									{field:'所在道路名称',visible: true,title: '道路名称',align:'center'}]
					       });	

						   $("#leftMenuTable")[0].contentWindow.$table.on('click-row.bs.table', function (row,obj) {
						       centerAtGeometry(obj);
					       });
					       if(fmState.timeoutInt){ 
						          window.clearTimeout(fmState.timeoutInt);
						          return;	
						   }
	                 }   
	                 window.setTimeout(fmState,10); 
	          } 
        }; 
        fmState.timeoutInt = window.setTimeout(fmState,400); 
   }
     
   function categoryFormat(value, row, index){
      var catagoryValue;
      if(row.管道类别)
         catagoryValue=row.管道类别;
      else if(row.渠道类别)  
         catagoryValue=row.渠道类别;
	  switch(catagoryValue){
             case "1":   	              
                return "雨水";
             case "2":   	              
                return "污水";
             case "3":   	              
                return "合流";
             case "4":   	              
                return "其它";
       }	  
	   return "";
   }  
   
   function materialFormat(value, row, index){
      var catagoryValue;
      if(row.管道材质)
        return row.管道材质;
      else if(row.渠道材质) 
         return row.渠道材质;
      else   
	    return "";
   }  
   
   function lengthFormat(value, row, index){  
	    return parseFloat(value).toFixed(2)+"米&nbsp;";
   }  
   	  
   function changeInfoWindowUI(h){
        if(h){
	 	    if($(".titlePane").is(":visible")){
	           $(".titlePane").hide();
	           $(".esriPopupWrapper").css("width","180px");
	           $(".sizer").css("width","180px");  
	        }
        }else{
            if(!$(".titlePane").is(":visible")){
 			   $(".titlePane").show();
	           $(".esriPopupWrapper").css("width","260px");
	           $(".sizer").css("width","260px");	 
	        }        
        }
   }

   function goSearch(event){   
        if(event.keyCode&&event.keyCode!=13){        
           return;
        }
        if($("#searchInput").val().trim()==""){
           layer.msg("请输入地点或道路名称");
           return;
        }
        $("#searchInput").css("cursor","wait");
	    $("#searchBtn").css("cursor","wait");
	    map.infoWindow.hide();
		if(locGraphicLayer){
		   locGraphicLayer.clear();
	       locFeatureLayer.clear();
	       roadGraphic=null;
	       selectedGraphic=null;
        }	

        $.ajax({
			url : "/agsupport/rest/swmmTimeseriesRest/getGeoData?address="+encodeURI($("#searchInput").val()), 
			dataType : 'json',  
			success : function(data) {
			    var results=data.results;
			    if(results.length==0){
			       layer.msg("查询无此地点");
			       $("#searchInput").css("cursor","default");
		           $("#searchBtn").css("cursor","default");	
		           $(".clearInput").click();
			    }else if(results.length==1){
			       //centerAtGeometry(results[0].feature.geometry);
			       var attrs=[];
			       var geometry=new esri.geomerty.Point(results[0].X,results[0].Y);
				   attrs["Name"]= results[0].Name;      	                     
			       attrs["geometry"]=geometry;
			       labelRoad([attrs]);
	               $("#searchInput").css("cursor","default");
			       $("#searchBtn").css("cursor","default");		       
			       //showResultWindow([attrs]);
			    }else{
			        if(results.length==20000)
			            layer.msg("提示：查询结果记录大于20000，只显示前20000条记录");
			         var tableData=[];
			         $.each(results, function() { 
					    var attrs=[];
					    attrs["Name"]= this.Name;      	                     
					    var geometry=new esri.geometry.Point(this.X,this.Y);
			            attrs["geometry"]=geometry;
			            tableData.push(attrs);
			         });
			         labelRoad(tableData);
			         $("#searchPanel").show();
			         showResultLocate(tableData);
			    } 
			},
			error : function(e) {
				layer.msg('请求失败');
			}
	   });
    }
 
	function clearMapGraphic(){
	   map.graphics.clear();
	   if(locGraphicLayer)
	      locGraphicLayer.clear();
	   if(locFeatureLayer)
	      locFeatureLayer.clear();
	   if(gridGraphicLayer)
	      gridGraphicLayer.clear();
	   pipeGis.toolBar.tb.deactivate();
	   if(pipeGis.toolBar.tbDrawEventObject)
           pipeGis.toolBar.tbDrawEventObject.remove();
	   if(pipeGis.label.domContent)			   
		   clearLableDivFunc(); 
	}
	
	function addImgToMap(url){
	      pipeGis.grid.imgUrl=url;
		  //var mapDivW=$("#mapDiv_container").css("width");
		  var mapDivH=$("#mapDiv_container").css("height");
		  //var width=(0.278021378/map.extent.getWidth())*(parseInt(mapDivW.substr(0,mapDivW.length-2)));
		  var height=(0.189821023/map.extent.getHeight())*(parseInt(mapDivH.substr(0,mapDivH.length-2)));
		  var locPoint=new esri.geometry.Point(108.293106747,22.8078552815,map.spatialReference)
		  var imgSymbol=new esri.symbol.PictureMarkerSymbol({
		    "url":pipeGis.grid.imgUrl,
		    "height":height+25,
		    "width":height+25,
		    "type":"esriPMS"
		  });
		  pipeGis.grid.imgGraphic=new esri.Graphic(locPoint, imgSymbol);
	      gridGraphicLayer.add(pipeGis.grid.imgGraphic);
	}
	
	var gridGraphicLayer;
	function centerGridMapLayer(){
        if(map.getLayer("gridGraphicLayer")){
			  gridGraphicLayer=map.getLayer("gridGraphicLayer");
		}else{
			 gridGraphicLayer = new esri.layers.GraphicsLayer({id: "gridGraphicLayer"});
			 gridGraphicLayer.opacity=0.6;
	         map.addLayer(gridGraphicLayer);
		 }	
	   	 centerGridMap();
	}
	
	function centerGridMap(){
	   	 var locPoint=new esri.geometry.Point(108.293106747,22.8078552815,map.spatialReference);
	   	 map.setScale(250000);
	   	 map.centerAt(locPoint);
	}
	
	function createLableDiv(point,w,h,text,type){
		require([
			    'dojo/dom-construct',
			    'dojo/html',
			    'esri/geometry/screenUtils'
		       ], function(domConstruct,
						   html,
						   screenUtils){
			      if(pipeGis.label.domContent)			   
				     domConstruct.destroy(pipeGis.label.domContent);
				  var mapDivW=$("#mapDiv_container").css("width");
			      mapDivW=parseInt(mapDivW.substr(0,mapDivW.length-2));
			      var mapDivH=$("#mapDiv_container").css("height");
			      mapDivH=parseInt(mapDivH.substr(0,mapDivH.length-2));		   
	              var resultP=screenUtils.toScreenGeometry(map.extent, mapDivW, mapDivH, point);
	              var left,top;
	              if(type==0){
	                 left=resultP.x;
	                 top=resultP.y-8-pipeGis.label.divH;
	              }else if(type==1){
	                 left=resultP.x;
	                 top=resultP.y+8;
	              }else if(type==2){
	                 left=resultP.x-w/2;
	                 top=resultP.y-h/2;
	              }
	              var divHtml="<div id=\"lableDiv\" style=\"background:#FEFEFE;border:1px solid red;width:"+w+"px;height:"+h+"px;left:"+left+"px;top:"+top+"px;position:absolute;z-index:10000;padding:3px 0px;font-size:13px;font-weight:bold;text-align:center;\">"+text+"</div>";
	              pipeGis.label.domContent = domConstruct.toDom(divHtml);
	              domConstruct.place(pipeGis.label.domContent, map.root.parentNode);
		       });
	}
	
	function clearLableDivFunc(){
		require([
			    'dojo/dom-construct'
		       ], function(domConstruct
						){
				     domConstruct.destroy(pipeGis.label.domContent);
				     pipeGis.label.divPoint=null;
		       });
	}
	
	function rePositionLable(p){
		require([
		    'esri/geometry/screenUtils'
	       ], function(screenUtils){
			  var mapDivW=$("#mapDiv_container").css("width");
		      mapDivW=parseInt(mapDivW.substr(0,mapDivW.length-2));
		      var mapDivH=$("#mapDiv_container").css("height");
		      mapDivH=parseInt(mapDivH.substr(0,mapDivH.length-2));		   
              var resultP=screenUtils.toScreenGeometry(map.extent, mapDivW, mapDivH, pipeGis.label.divPoint);
              var left,top;
              if(pipeGis.label.type==0){
                 left=resultP.x;
                 top=resultP.y-8-pipeGis.label.divH;
              }else if(pipeGis.label.type==1){
                 left=resultP.x;
                 top=resultP.y+8;
              }else if(pipeGis.label.type==2){
                 left=resultP.x-pipeGis.label.divW/2;
                 top=resultP.y-pipeGis.label.divH/2;
              }
              $("#lableDiv").animate({left:left+"px",top:top+"px"},10);
	       });
	
	}
	
    var pipeAttributes={
         "pipeAttr":{
            "name":["Lane_Way","PipeID","SystemID","Pipe_Category","Pipe_Len","Material","In_JuncID","Out_JuncID","In_Elev","Out_Elev",
                           "ShapeType","Shape_Data1","Shape_Data2","Shape_Data3","Shape_Data4","Shape_XYData","Roughness","DataSource"],
            "alias":["所在道路名称","排水管标识码","排水系统编码","管道类别","管道长度","管道材质","终点编码","起点编码","起点管底标高",
                     		"终点管底标高","断面形式","断面数据1","断面数据2","断面数据3","断面数据4","断面数据5","管道糙率","数据来源"],
            "type":[0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0]          		
        },
        "conduitAttr":{
            "name":["Lane_Way","ConduitID","SystemID","Conduit_Category","Conduit_Style","Conduit_Len","Material","In_JuncID","Out_JuncID","In_Ele","Out_Ele",
  				  	"ShapeType","Shape_Data1","Shape_Data2","Shape_Data3","Shape_Data4","Shape_XYData","Roughness","DataSource"],
            "alias":["所在道路名称","排水渠标识码","排水系统编码","渠道类别","沟渠类型","沟渠长度","沟渠材质","终点编码","起点编码","起点渠底标高",
   					 "终点渠底标高","断面形式","断面数据1","断面数据2","断面数据3","断面数据4","断面数据5","沟渠糙率","数据来源"],
   		    "type":[0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0] 			 
        },"outfallAttr":{
		    "name":["OutfallID","SystemID","ReceiveWater","Category","Flap","BotEle","OutfallType","DataSource"],
		    "alias":["排放口标识码","排水系统编码","受纳水体编号","类别","是否有拍门","底部高程","出流形式","数据来源"],
		    "type":[0,0,0,1,1,1,1,0]
        },"juncAttr":{   
            "name":["Surface_Ele","SystemID","NodeID","Lane_Way","Junc_Category","Junc_Type","Junc_Style","Depth","DataSource"],
            "alias":["地面高程","排水系统编码","检查井标识码","所在道路名称","检查井类别","检查井类型","检查井形式","检查井井深","数据来源"],
            "type":[1,0,0,0,1,0,0,1,0]
        },"inletAttr":{
		     "name":["Lane_Way","SystemID","CombID","Inlet_Type","MaxDepth","Surface_Ele","DataSource"],
  			 "alias":["所在道路","排水系统编码","雨水口标识码","雨水口形式","雨水口最大深度","雨水口地表高程","数据来源"],
  			 "type":[0,0,0,1,1,1,0]
        },"valveAttr":{   
            "name":["Name","SystemID","ValveID","Type","Manufacturer","Model","DataSource"],
  			"alias":["阀门名称","排水系统编码","阀门标识码","阀门类型","生产厂家","阀门型号","数据来源"],
  			"type":[0,0,0,1,0,0,0]
        },"gateAttr":{
            "name":["Name","Height","Width","Category","GateID","SystemID","Manufacturer","Model","Top_Ele","DataSource"],
            "alias":["闸门名称","闸门净高","闸门净宽","类别","闸门标识码","排水系统编码","生产厂家","闸门型号","闸门高程","数据来源"],
            "type":[0,1,1,1,0,0,0,0,0,0]
        },"weirAttr":{
            "name":["Top_Ele","Bot_Ele","Category","WeirID","SystemID","Height","Width","DataSource"],
            "alias":["堰顶高程","堰底高程","类别","溢流堰标识码","排水系统编码","堰高","堰宽","数据来源"],
            "type":[1,1,1,0,0,1,1,0]
        },"pumpAttr":{
           "name":["Name","Addr","PumpStationID","SystemID","PS_Category1","PS_Category2","PS_Num","Design_Storm","Design_Sewer","Min_Level","Control_Level","Warnning_Level","DataSource"],
           "alias":["泵站名称","泵站地址","排水泵站标识码","排水系统编码","泵站大类","泵站小类","泵台数","设计雨水排水能力","设计污水排水能力","最低控制水位","控制水位","警戒水位","数据来源"],
           "type":[0,0,0,0,1,1,1,1,1,1,1,1,0]
        }        
    }
    
    var pipeLayers={
        "pipePointLayer":{
           "name":"管点",
           "id":0,
           "subLayers":{
                "outfallLayer":{
		             "name":"排放口",
		             "layerId":1
              },"juncLayer":{
	                 "name":"检查井",
		             "layerId":2
		      },"inletLayer":{
                     "name":"雨水口",
	                 "layerId":3
              },"valveLayer":{
                     "name":"阀门",
	                 "layerId":4
              }
           },
           "subIds":[1,2,3,4]
        },"drainageLayer":{
           "name":"排水设施",
           "id":5,
           "subLayers":{
                 "gateLayer":{
		             "name":"闸门",
		             "layerId":6
              },"weirLayer":{
	                 "name":"溢流堰",
		             "layerId":7
              },"pumpLayer":{
                     "name":"排水泵站",
	                 "layerId":8
              }
           },
           "subIds":[6,7,8]
        },"pipeLayer":{
           "name":"管线",
           "id":10,
           "subLayers":{
                 "rainLayer":{
		             "name":"雨水",
		             "id":12,
		             "subIds":[13,14,15,16]
              },"sewageLayer":{
	                 "name":"污水",
		             "id":17,
		             "subIds":[18,19,20,21]
              },"mixLayer":{
                     "name":"雨污合流",
	                 "id":22,
	                 "subIds":[23,24,25,26]
              }
           },
           "layerId":11,
           "subIds":[13,14,15,16,18,19,20,21,23,24,25,26]
        },
        "conduitLayer":{
           "name":"沟渠",
           "id":27,
           "subLayers":{
              "rainLayer":{
                   "name":"雨水",
	               "id":29,
	               "subIds":[30,31,32,33]
	              },
	             "sewageLayer":{
	                   "name":"污水",
		             "id":34,
		             "subIds":[35,36,37,38]
	              },
	              "mixLayer":{
	                   "name":"雨污合流",
			           "id":39,
			           "subIds":[40,41,42,43]
                  }
           },
           "layerId":28,          
           "subIds":[30,31,32,33,35,36,37,38,40,41,42,43]
        }
    }