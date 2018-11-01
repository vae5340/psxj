function car_dw(id){
	var layer=frames['map'].carLayer;
	var feature=layer.getFeatureById(id);
	if(feature){
		var geometry = feature.geometry;
		var param = {
		    x : geometry.x,
		    y : geometry.y,
		    title :feature.attributes.username,
		    context : '<iframe width="230" height="120" src="awater/nnwaterSystem/EmergenControl/Municipal/tip.html?id='+id+'"></iframe>',
		    allShow : false
		}
		getGisObject().toolbar.setCenter(geometry.x,geometry.y);
		var infowindow = getGisObject().mapcontrol.showInfowindow(param);
	}else
		window.parent.$w.infoMsg("没有找到GPS信号!");
}