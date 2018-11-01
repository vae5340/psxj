/**
 * 
 */


function creatDemo(){	
	createPoint("areaPointLayer","兴宁区",108.36,22.86,bulidHtmlContent({name:'林  涛',tel:'13977196060'}),"img/city_32px_581809_easyicon.net.png");
	createPoint("areaPointLayer","江南区",108.27,22.78,bulidHtmlContent({name:'李秋果',tel:'13768118236'}),"img/city_32px_581809_easyicon.net.png");
	createPoint("areaPointLayer","良庆区",108.34,22.74,bulidHtmlContent({name:'魏  辉',tel:'13877195373'}),"img/city_32px_581809_easyicon.net.png");
	createPoint("areaPointLayer","西乡塘区",108.31,22.84,bulidHtmlContent({name:'宁世朝',tel:'13037785769'}),"img/city_32px_581809_easyicon.net.png");
	createPoint("areaPointLayer2","邕宁区(未启动)",108.48,22.76,bulidHtmlContent({name:'仙学文',tel:'18677122208'}),"img/city_32px_581809_easyicon.net_red.png");
	createPoint("areaPointLayer","青秀区",108.49,22.79,bulidHtmlContent({name:'刘  卡',tel:'13878662888'}),"img/city_32px_581809_easyicon.net.png");
}

/**
 * 新增点
 */
function createPoint(featureLayreId,title,x,y,content,iconUrl,iconW,iconH){
	require([
	         "esri/geometry/Point",
	         "esri/layers/FeatureLayer",
	         "esri/graphic",
	         "esri/dijit/InfoWindowLite",
	         "esri/InfoTemplate",
	         "esri/dijit/PopupTemplate",
	         "esri/symbols/TextSymbol",
	         "esri/renderers/SimpleRenderer",
	         "esri/layers/LabelClass",
	         "dojo/_base/connect",
	         "esri/Color",
	         "esri/symbols/Font"
	       ], function(Point,
	    		   FeatureLayer,
	    		   Graphic,
	    		   InfoWindowLite,
	    	       InfoTemplate,
	    	       PopupTemplate,
	    	       TextSymbol,
	    	       SimpleRenderer,
	    	       LabelClass,
	    	       connect,
	    	       Color,
	    	       Font
	       	) {

				iconW=(iconW==null)?iconW=24:iconW=iconW;
				iconH=(iconH==null)?iconH=24:iconH=iconH;

		 	var featureCollection = {
		          "layerDefinition": null,
		          "featureSet": {
		            "features": [],
		            "geometryType": "esriGeometryPoint"
		          }
		        };
		        featureCollection.layerDefinition = {
		          "geometryType": "esriGeometryPoint",
		          "objectIdField": "ObjectID",
		          "drawingInfo": {
		            "renderer": {
		              "type": "simple",
		              "symbol": {
		                "type": "esriPMS",
		                "url": iconUrl,
		                "contentType": "image/png",
		                "width": iconW,
		                "height": iconH
		              }
		            }
		          },
		          "fields": [
		                     {
		            "name": "ObjectID",
		            "alias": "ObjectID",
		            "type": "esriFieldTypeOID"
		          }, {
		            "name": "description",
		            "alias": "Description",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "title",
		            "alias": "Title",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "mapValue",
		            "alias": "mapValue",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "content",
		            "alias": "content",
		            "type": "esriFieldTypeString"
		          },{
		        	"name": "iconUrl",
		            "alias": "iconUrl",
		            "type": "esriFieldTypeString"
		          }
		          ]
		        };
		   var infoTemplate  =   new InfoTemplate("${title}", "${content}")
		  connect.connect(infoTemplate, "onShow", function(evt) {
//			 	 var attributes=evt.graphic.attributes;
//			 	 var combId=attributes.combId;
//			 	 getMonitorStationByCombId(combId);
		  });
//		  var popupTemplate = new PopupTemplate({
//			  title: "2222"
//	          //title: "{title}",
//	          //description: "{description}"
//	       });
//		  popupTemplate.setContent(content);
		  var featureLayer=null;
		if(map.getLayer(featureLayreId)){
			featureLayer=map.getLayer(featureLayreId);
		}else{
			featureLayer = new FeatureLayer(featureCollection, {
		          id: featureLayreId,
		          //infoTemplate: popupTemplate
		          infoTemplate:infoTemplate
		        });
			map.addLayers([featureLayer]);
			//featureLayreOnClickHandler(featureLayer);
			
			var labelSymbol = new TextSymbol(); 
			labelSymbol.setColor(new Color([255,0,0,1]));
			var font  = new Font();
			font.setSize("12pt");
			font.setWeight(Font.WEIGHT_BOLD);
			labelSymbol.setFont(font);

			//var labelRenderer = new SimpleRenderer(labelSymbol);


			var json = {
			  "labelExpressionInfo": {"value": "{mapValue}"}
			  };

			//create instance of LabelClass
			  var lc = new LabelClass(json);
			  lc.symbol = labelSymbol; // symbol also can be set in LabelClass' json
			  featureLayer.setLabelingInfo([ lc ]);			
		}	
		//featureLayer.setInfoTemplate(popupTemplate);
		featureLayer.setInfoTemplate(infoTemplate);
		var features = [];
 		var attr = {title:title,mapValue:title,content:content,iconUrl:iconUrl};
 		var geometry = new Point(x, y);		
 		var graphic = new Graphic(geometry);
 		graphic.setAttributes(attr);
 		features.push(graphic);
 		featureLayer.add(graphic);
	});
}

/**
 * 建立html文字信息
 * @param obj
 */
function bulidHtmlContent(obj){
	var html="<table>" +
			"<tr>" +
			"<td>责任人：</td>" +
			"<td>"+obj.name+"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>联系方式：</td>" +
			"<td>"+obj.tel+"</td>" +
			"</tr>" +
			"<tr>" +
			"<td><a href='#' onclick=showWindow('/awater/nnwaterSystem/EmergenControl/District/Template/Template_Input.html?id=121')>打开预案</a></td>" +
			"<td></td>" +
			"</tr>" +
			"</table>";
	return html;
}

function showWindow(url){
	//iframe层
	layer.open({
	  type: 2,
	  title: '应急调度情况',
	  shadeClose: true,
	  shade: 0.5,
	  area: ['100%', '100%'],
	  content: url //iframe的url
	}); 	
}

/**
 * 定位
 * @param x
 * @param y
 */
function locationPoint(x,y){
	require(["esri/geometry/Point"], function(Point){
		var point=new Point(x, y);
		map.centerAt(point);
	});
	
	
}
