// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.16/esri/copyright.txt for details.
//>>built
define("esri/layers/RasterLayer","dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/sniff dojo/dom-construct dojo/dom-style dojo/number ../lang ../domUtils ./layer ./ImageServiceLayerMixin ../SpatialReference ../geometry/Point".split(" "),function(h,k,d,l,m,n,f,s,p,g,q,r,t,u){return h([q,r],{declaredClass:"esri.layers.RasterLayer",managedSuspension:!0,constructor:function(a,b){this.drawMode=b&&void 0!==b.drawMode?b.drawMode:!0;this.drawType=b&&b.drawType?b.drawType:"2d";
this._initialize(a,b);(null===this.format||void 0===this.format)&&this.setImageFormat("LERC",!0)},opacity:1,setDrawMode:function(a){this.drawMode=a},setOpacity:function(a){if(this.opacity!=a)this.onOpacityChange(this.opacity=a)},onOpacityChange:function(){},refresh:function(){if(!this._canDraw()||10>m("ie"))this.onError(Error("Unable to refresh. This layer is not supported in the current browser."));else this._map&&this._extentChangeHandler(this._map.extent)},clear:function(){this._canDraw()&&"2d"===
this.drawType&&this._context.clearRect(0,0,this._mapWidth,this._mapHeight)},getContext:function(){return this._context},onResume:function(){this.inherited(arguments);this._toggleTime();this._displayTimer=this._displayTimer||setTimeout(k.hitch(this,function(){this._extentChangeHandler(this._map.extent,null,!0)}),0)},onSuspend:function(){this.inherited(arguments);this._toggleTime();clearTimeout(this._displayTimer);this._displayTimer=null},_setMap:function(a,b){this.inherited(arguments);var c=this._canvas=
n.create("canvas",{id:"canvas",width:a.width+"px",height:a.height+"px",style:"position: absolute; left: 0px; top: 0px;"},b);p.isDefined(this.opacity)&&f.set(c,"opacity",this.opacity);(this._context=c.getContext(this.drawType))||console.error("Unable to create the context. This browser might not support \x3ccanvas\x3e elements.");this._mapWidth=a.width;this._mapHeight=a.height;this._connects=[];this._connects.push(d.connect(a,"onPan",this,this._panHandler));this._connects.push(d.connect(a,"onPanEnd",
this,this._panEndHandler));this._connects.push(d.connect(a,"onZoom",this,this._onZoomHandler));this._connects.push(d.connect(a,"onZoomEnd",this,this._onZoomEndHandler));this._connects.push(d.connect(a,"onResize",this,this._onResizeHandler));this._connects.push(d.connect(a,"onExtentChange",this,this._extentChangeHandler));this._connects.push(d.connect(this,"onVisibilityChange",this,this._visibilityChangeHandler));this._connects.push(d.connect(this,"onOpacityChange",this,this._opacityChangeHandler));
this._startRect={left:0,top:0,width:a.width,height:a.height};this.evaluateSuspension();if(this.suspended&&!a.loaded)var e=d.connect(a,"onLoad",this,function(){d.disconnect(e);e=null;this.evaluateSuspension()});return c},_unsetMap:function(a,b){l.forEach(this._connects,d.disconnect,this);this._canvas&&b.removeChild(this._canvas);this._map=this._canvas=this._context=this.data=this._connects=null;clearTimeout(this._displayTimer);this._displayTimer=null;this.inherited(arguments)},_canDraw:function(){return this._map&&
this._canvas&&this._context?!0:!1},_requestDataErrorHandler:function(a){"CancelError"!==a.name&&(this.clear(),this.onError(a))},_drawPixelData:function(){f.set(this._canvas,{left:"0px",top:"0px",width:this._map.width+"px",height:this._map.height+"px"});this._startRect={left:0,top:0,width:this._map.width,height:this._map.height};if(this._canDraw&&this.drawMode)if(this._useBrowserDecoding())this._fireUpdateEnd();else if(this.drawMode)if(!this.pixelData||!this.pixelData.pixelBlock)this.clear();else{var a=
this.pixelData.pixelBlock,b=this._context,c=b.createImageData(a.width,a.height);c.data.set(a.getAsRGBA());b.putImageData(c,0,0);this._fireUpdateEnd()}},_panHandler:function(a,b){f.set(this._canvas,{left:this._startRect.left+b.x+"px",top:this._startRect.top+b.y+"px"})},_panEndHandler:function(a,b){b&&(this._startRect.left+=b.x,this._startRect.top+=b.y)},_onZoomHandler:function(a,b,c){var e=this._startRect;a=e.width*b;b*=e.height;var d=e.left-(a-e.width)*(c.x-e.left)/e.width;c=e.top-(b-e.height)*(c.y-
e.top)/e.height;f.set(this._canvas,{left:d+"px",top:c+"px",width:a+"px",height:b+"px"});this._endRect={left:d,top:c,width:a,height:b}},_onZoomEndHandler:function(){this._endRect&&(this._startRect=this._endRect)},_onResizeHandler:function(a,b,c){f.set(this._canvas,{width:b+"px",height:c+"px"});this._startRect.width=this._canvas.width=b;this._startRect.height=this._canvas.height=c},_extentChangeHandler:function(a,b,c,d){this.suspended||(this._fireUpdateStart(),a=this._map,this._requestData(a.extent,
a.width,a.height))},_visibilityChangeHandler:function(a){a?g.show(this._canvas):g.hide(this._canvas)},_opacityChangeHandler:function(a){f.set(this._canvas,"opacity",a)}})});