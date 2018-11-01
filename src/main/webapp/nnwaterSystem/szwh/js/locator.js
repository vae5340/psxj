   var pSymbol,pSymbolSelected;
   var locFeatureLayer,locGraphicLayer;
   
   function labelRoad(tableData){
	  var layerDefinition = {
	    "geometryType": "esriGeometryPoint",
		"objectIdField": "ObjectID",
	    "fields": [{
		            "name": "ObjectID",
		            "alias": "ObjectID",
		            "type": "esriFieldTypeOID"
		          },{
			      "name": "addressName",
			      "type": "esriFieldTypeString",
			      "alias": "地名"
			    }
			]
	  } 
	  var featureCollection = {
	    layerDefinition: layerDefinition,
	    featureSet: null
	  };
	  
      var infoTemplate = new esri.InfoTemplate("当前所处位置","${name}");	
	  if(map.getLayer("locGraphicLayer")){
		  locGraphicLayer=map.getLayer("locGraphicLayer");
	  }else{
		  locGraphicLayer = new esri.layers.GraphicsLayer({id: "locGraphicLayer"});
          map.addLayer(locGraphicLayer);
	  }	
	      
      if(map.getLayer("locationLayer")){
		  locFeatureLayer=map.getLayer("locationLayer");
		  locFeatureLayer.clear();
	  }else{
		  locFeatureLayer = new esri.layers.FeatureLayer(featureCollection, {
		        id: "locationLayer",
		        infoTemplate:infoTemplate
		  });
          map.addLayer(locFeatureLayer);
          locFeatureLayer.on("mouse-over", function (g) {
	         var pt = g.graphic.geometry;
	         var attr = g.graphic.attributes;
             changeInfoWindowUI(true);
	         map.infoWindow.setContent("<div align='center' style='font-size:13px'>"+attr.name+"</div>");
	         map.infoWindow.show(pt);
	      });
	      
	      locFeatureLayer.on("click", function (g) {
		     var pageData=document.getElementById("leftMenuTable").contentWindow.$("#table").bootstrapTable('getData',true);
		       for(var i=0;i<pageData.length;i++){
			        if(pageData[i].名称==g.graphic.attributes.name||pageData[i].OBJNAME==g.graphic.attributes.name){
			            graphicClick(pageData[i].geometry, g.graphic);
		                break;
			        }
		       }
	      });
	  }  
	  
     if(tableData.length==1){
            var point;
            if(tableData[0].geometry.type=="point"){
               point=new esri.geometry.Point(tableData[0].geometry.x,tableData[0].geometry.y);
            }else if(tableData[0].geometry.type=="polyline"){
               point=new esri.geometry.Point(tableData[0].geometry.paths[0][0][0],tableData[0].geometry.paths[0][0][1]);
            }else{
               point=new esri.geometry.Point(tableData[0].geometry.rings[0][0][0],tableData[0].geometry.rings[0][0][1]);
            }
            var name;
	        if(tableData[0].名称)
	          name=tableData[0].名称;
	        else
	          name=tableData[0].OBJNAME;
            var graphic= new esri.Graphic(point, pSymbolSelected,{"name":name});
		    locFeatureLayer.add(graphic);	
			locateGeometry(tableData[0].geometry,graphic);
       }else{
            var len=10;
            if(tableData.length<10)
              len=tableData.length;
	        for(var i=0;i<len;i++){
	            var point;
		        if(tableData[i].geometry.type=="point"){
                    point=new esri.geometry.Point(tableData[i].geometry.x,tableData[i].geometry.y);
		        }else if(tableData[i].geometry.type=="polyline"){
                    point=new esri.geometry.Point(tableData[i].geometry.paths[0][0][0],tableData[i].geometry.paths[0][0][1]);
		        }else{
                    point=new esri.geometry.Point(tableData[i].geometry.rings[0][0][0],tableData[i].geometry.rings[0][0][1]);
		        }
		        var name=tableData[i].Name;
		        //if(tableData[i].名称)
		        //  name=tableData[i].名称;
		        //else
		        //  name=tableData[i].OBJNAME;
		        var graphic= new esri.Graphic(point, pSymbol,{"name":name});
		        locFeatureLayer.add(graphic);	
	        }
            var centerPoint=new esri.geometry.Point(locFeatureLayer.graphics[0].geometry.x,locFeatureLayer.graphics[0].geometry.y,map.spatialReference);
            map.centerAt(centerPoint); 
        }
   }
   
   function showLocatorWindow(tableData,type){
        var title,title2;
          title='道路名称';
          title2='道路类型';
        var fm1=parent.window.frames["leftMenuTable"]; 
        var fmState=function(){ 
	          var state=null;   
	          if(document.readyState){     	              
	                 state=fm1.document.readyState;   
		               if(state=="complete" || !state){
				             $("#leftMenuTable")[0].contentWindow.$("#table").bootstrapTable({
								 toggle:"table",
								 height:390,
								 data: tableData,
								 rowStyle:"rowStyle",
								 cache: false, 
								 striped: true,
								 //pagination: true,   
								 //pageNumber:1,
								 //pageSize: 10,
							     //pageList: [10, 25, 50, 100],
								 //queryParams: queryParams,
								 //sidePagination: "client",
								 columns: [
								      //{visible: true,title:'道路名称',formatter:nameFormat,align:'center'},
								      //{visible: true,title:'道路类型',formatter:layerFormat,align:'center'}
								       {field:'Name',visible: true,title:'地物名称',align:'center'}
								      ]
				             });
				           					            
						     $("#leftMenuTable")[0].contentWindow.$table.on('click-row.bs.table', function (row,obj) {
						         for(var index in locFeatureLayer.graphics){
							         if(locFeatureLayer.graphics[index].attributes.name==obj.Name){
						                  locateGeometry(obj.geometry,locFeatureLayer.graphics[index]);
							              break;
							         }
							     }
					         });
					         
					         $("#leftMenuTable")[0].contentWindow.$("#table").on('page-change.bs.table', function (number, size) {
		                       	 changeLocPoints();
							 });
                             $("#leftMenuTable")[0].contentWindow.$("#locateDiv").css("cursor","default");
						     $("#leftMenuTable")[0].contentWindow.$("#roadName").css("cursor","default");
						     $("#leftMenuTable")[0].contentWindow.$("#locateBtn").css("cursor","default");					         if(fmState.timeoutInt){ 
						          window.clearTimeout(fmState.timeoutInt);
						          return;	
						     }
	                 }   
	                 window.setTimeout(fmState,10); 
	          } 
        }; 
        fmState.timeoutInt = window.setTimeout(fmState,400); 
   }
   
      function showResultLocate(tableData){
        $("#searchPanelContent")[0].src="/awater/nnwaterSystem/szwh/roadAnalysis/queryResultAll.html";
        var fm1=parent.window.frames["leftMenuTable"]; 
        var fmState=function(){ 
	          var state=null;   
	          if(document.readyState){     	              
	                 state=fm1.document.readyState;   
		               if(state=="complete" || !state){
		                    if(!$("#searchPanelContent")[0].contentWindow.$table){
		                       alert(state);
		                    }   
				            $("#searchPanelContent")[0].contentWindow.$table.bootstrapTable({
								 toggle:"table",
								 height:400,
								 data: tableData,
								 rowStyle:"rowStyle",
								 cache: false, 
								 pagination: true,   
								 pageNumber:1,
								 pageSize: 10,
							     pageList: [10, 25, 50, 100],
								 queryParams: queryParams,
								 showHeader:false,
								 sidePagination: "client",
								 columns: [
								      {field:'Name',visible: true,title: '名称',align:'center'}
								      //{visible: true,title: '类型',formatter:layerFormat,align:'center'}
								      ]
				             });
				           					            
						     $("#searchPanelContent")[0].contentWindow.$table.on('click-row.bs.table', function (row,obj) {
						         for(var index in locFeatureLayer.graphics){
						             if(locFeatureLayer.graphics[index].attributes.name==obj.Name){
							         //if(locFeatureLayer.graphics[index].attributes.name==obj.名称||locFeatureLayer.graphics[index].attributes.name==obj.OBJNAME){
						                  locateGeometry(obj.geometry,locFeatureLayer.graphics[index]);
							              break;
							         }
							     }
					         });
					         
					         $("#searchPanelContent")[0].contentWindow.$("#table").on('page-change.bs.table', function (number, size) {
		                       	 changePointsLocate();
							 });

	                          $("#searchInput").css("cursor","default");
		                      $("#searchBtn").css("cursor","default");
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
   
   var roadGraphic,selectedGraphic;
       
   function changeLocPoints(){
      locGraphicLayer.clear();
      locFeatureLayer.clear();
      roadGraphic=null;
      selectedGraphic=null;
      var pageData=$("#leftMenuTable")[0].contentWindow.$("#table").bootstrapTable('getData',true);
      for(var i=0;i<pageData.length;i++){
        var point;
        if(pageData[i].geometry.type=="point"){
            point=new esri.geometry.Point(pageData[i].geometry.x,pageData[i].geometry.y,map.spatialReference);
        }else if(pageData[i].geometry.type=="polyline"){
            point=new esri.geometry.Point(pageData[i].geometry.paths[0][0][0],pageData[i].geometry.paths[0][0][1]);
        }else{
           point=new esri.geometry.Point(pageData[i].geometry.rings[0][0][0],pageData[i].geometry.rings[0][0][1]);
        }
        var name;
        if(pageData[i].名称)
          name=pageData[i].名称;
        else
          name=pageData[i].OBJNAME;
        var graphic= new esri.Graphic(point, pSymbol,{"name":name});
        locFeatureLayer.add(graphic);	
      }
      var centerPoint=new esri.geometry.Point(locFeatureLayer.graphics[0].geometry.x,locFeatureLayer.graphics[0].geometry.y,map.spatialReference);
      map.centerAt(centerPoint); 
   }
   
   function changePointsLocate(){
      locGraphicLayer.clear();
      locFeatureLayer.clear();
      roadGraphic=null;
      selectedGraphic=null; 
      var pageData=$("#searchPanelContent")[0].contentWindow.$("#table").bootstrapTable('getData',true);
      for(var i=0;i<pageData.length;i++){
        var point;
        if(pageData[i].geometry.type=="point"){
            point=new esri.geometry.Point(pageData[i].geometry.x,pageData[i].geometry.y,map.spatialReference);
        }else if(pageData[i].geometry.type=="polyline"){
            point=new esri.geometry.Point(pageData[i].geometry.paths[0][0][0],pageData[i].geometry.paths[0][0][1]);
        }else{
           point=new esri.geometry.Point(pageData[i].geometry.rings[0][0][0],pageData[i].geometry.rings[0][0][1]);
        }
        var name;
        if(pageData[i].名称)
          name=pageData[i].名称;
        else
          name=pageData[i].OBJNAME;
        var graphic= new esri.Graphic(point, pSymbol,{"name":name});
        locFeatureLayer.add(graphic);	
      }
      var centerPoint=new esri.geometry.Point(locFeatureLayer.graphics[0].geometry.x,locFeatureLayer.graphics[0].geometry.y,map.spatialReference);
      map.centerAt(centerPoint); 
   }
   
   function locateGeometry(geometry,graphic){
      if(roadGraphic){
          locGraphicLayer.remove(roadGraphic);
          selectedGraphic.setSymbol(pSymbol);
      } 
      var point;
      selectedGraphic= graphic;
      if(geometry.type=="point"){
          roadGraphic= new esri.Graphic(geometry, pipeGis.symbol.markerSymbol);
          //map.setScale(4000);
          map.setZoom(16);
          map.centerAt(geometry);
          point=geometry;
      }else if(geometry.type=="polyline"){
          roadGraphic= new esri.Graphic(geometry, pipeGis.symbol.lineSymbol);
          map.setExtent(geometry.getExtent()); 
          point=new esri.geometry.Point(geometry.paths[0][0][0],geometry.paths[0][0][1],map.spatialReference);
      }else{
          roadGraphic= new esri.Graphic(geometry, pipeGis.symbol.fillSymbol);
          map.setExtent(geometry.getExtent()); 
          point=new esri.geometry.Point(geometry.rings[0][0][0],geometry.rings[0][0][1],map.spatialReference);
      }
      map.centerAt(point);
 	  locGraphicLayer.add(roadGraphic);
      graphic.setSymbol(pSymbolSelected);
  }
  
  function graphicClick(geometry,graphic){
      if(roadGraphic){
          locGraphicLayer.remove(roadGraphic);
          selectedGraphic.setSymbol(pSymbol);
      } 
      selectedGraphic= graphic;
      if(geometry.type=="point"){
          roadGraphic= new esri.Graphic(geometry, pisGis.symbol.markerSymbol);
      }else if(geometry.type=="polyline"){
          roadGraphic= new esri.Graphic(geometry, pisGis.symbol.lineSymbol);
      }else{
          roadGraphic= new esri.Graphic(geometry, pisGis.symbol.fillSymbol);
      }
 	  locGraphicLayer.add(roadGraphic);
      graphic.setSymbol(pSymbolSelected);
  }
   
  function queryParams(params) {
       return {
	        limit:params.limit,
	        offset:params.offset
       };
  }	
  	   
  /*function nameFormat2(value, row, index){  
	   if(row.OBJNAME){
	       if(row.layerName)
		      return row.OBJNAME+"-"+row.layerName;
		   else
		      return row.OBJNAME+"-"+row.TYPE; 
	   }
	   else{
	      if(row.layerName)
		      return row.名称+"-"+row.layerName;
		   else
		      return row.名称+"-"+row.TYPE; 
       }  
   }*/
  
  function nameFormat(value, row, index){  
	 if(row.OBJNAME)
		  return row.OBJNAM; 
	 else
		  return row.名称; 
  } 
  
  function layerFormat(value, row, index){  
	  if(row.layerName)
	      return row.layerName;
	   else
	      return row.TYPE;  
  } 
  
  /*function locate(roadName){
        var findTask = new esri.tasks.FindTask(baseMapService);
	    var findParams = new esri.tasks.FindParameters();
        findParams.layerIds=[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];  
        findParams.searchFields=["名称"];
		findParams.searchText = roadName;
		findParams.returnGeometry=true;
		map.infoWindow.hide();
		if(locGraphicLayer){
		   locGraphicLayer.clear();
	       locFeatureLayer.clear();
	       roadGraphic=null;
	       selectedGraphic=null;
        }
		findTask.execute(findParams, function(results){
		    if(results.length==0){
		       layer.msg("查询无此道路");
               document.getElementById("leftMenuTable").contentWindow.$("#locateDiv").css("cursor","default");
		       document.getElementById("leftMenuTable").contentWindow.$("#roadName").css("cursor","default");
		       document.getElementById("leftMenuTable").contentWindow.$("#locateBtn").css("cursor","default");		
		    }else if(results.length==1){
		       //centerAtGeometry(results[0].feature.geometry);
		       var attrs=results[0].feature.attributes;
		       attrs["geometry"]=results[0].feature.geometry;
		       labelRoad([attrs]);
		       showResultWindow([attrs]);
		    }else{
		        if(results.length==20000)
		            layer.msg("提示：查询结果记录大于20000，只显示前20000条记录");
		         var tableData=[];
		         $.each(results, function() { 
				    var attrs=this.feature.attributes;       	                     
		            if(this.feature.geometry){
			            attrs["geometry"]=this.feature.geometry;
			            tableData.push(attrs);
		             }    	           
		         });
		         //centerAtGeometry(results[0].feature.geometry);
		         labelRoad(tableData);
	             showResultWindow(tableData);
		    }      
		});
   }*/
   
   function locate(roadName){
		map.infoWindow.hide();
		if(locGraphicLayer){
		   locGraphicLayer.clear();
	       locFeatureLayer.clear();
	       roadGraphic=null;
	       selectedGraphic=null;
        }
        
        $.ajax({
			url : "/agsupport/rest/swmmTimeseriesRest/getGeoData?address="+encodeURI(roadName), 
			dataType : 'json',  
			success : function(data) {
			    var results=data.results;
			    if(results.length==0){
			       layer.msg("查询无此道路");
	               $("#leftMenuTable")[0].contentWindow.$("#locateDiv").css("cursor","default");
			       $("#leftMenuTable")[0].contentWindow.$("#roadName").css("cursor","default");
			      $("#leftMenuTable")[0].contentWindow.$("#locateBtn").css("cursor","default");		
			    }else if(results.length==1){
			       //centerAtGeometry(results[0].feature.geometry);
			     var attrs=[];
			       var geometry=new esri.geomerty.Point(results[0].X,results[0].Y);
				   attrs["Name"]= results[0].Name;      	                     
			       attrs["geometry"]=geometry;
			       labelRoad([attrs]);
			       showResultWindow([attrs]);
			    }else{
			         var tableData=[];
			         $.each(results, function() { 
					    var attrs=[];
					    attrs["Name"]= this.Name;      	                     
					    var geometry=new esri.geometry.Point(this.X,this.Y);
			            attrs["geometry"]=geometry;
				        tableData.push(attrs);
			         });
			         //centerAtGeometry(results[0].feature.geometry);
			         labelRoad(tableData);
		             showLocatorWindow(tableData);
			    }   
			},
			error : function(e) {
				layer.msg('请求失败');
			}
	   });
   }
           