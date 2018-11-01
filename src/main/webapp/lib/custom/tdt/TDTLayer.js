//TDTLayer类型(vec:电子地图,cva:电子地图标注,img:影像地图,cia:影像地图标注)
define(["dojo/_base/declare", "esri/layers/TiledMapServiceLayer", "esri/layers/TileInfo"],
function (declare, tiledMap) {
    return declare("tdt.TDTLayer", tiledMap, {
        constructor: function (type) {
            this.type = type;
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {
                    "x": -180,
                    "y": 90
                },
                "spatialReference": {
                    "wkid": 4326
                },
                "lods": [
              { "level": 0, "resolution": 1.40625, "scale": 590995186.11750006 },
              { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
              { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
              { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
              { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
              { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
              { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
              { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
              { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
              { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
              { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
              { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
              { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
              { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
              { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
              { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
              { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
              { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
              { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
              //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1128.4994333441375 }            
              //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 564.24971667206875 }
              ]
            });
            this.loaded = true;
            this.onLoad(this);
        },
        getTileUrl: function (level, row, col) {
            if(level<19) {
                return "http://t" + row % 8 + ".tianditu.cn/" + this.type + "_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" + this.type + "&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
            }else {
                this.getTileGraphic(level, row, col);
            }
        },
        getTileGraphic: function (level, row, col) {
            var tileSize;
            if (level == 19) {
                level = level - 1;
                if (row % 2 == 1)
                    row = row + 1;
                row = row / 2;
                if (col % 2 == 1)
                    col = col + 1;
                col = col / 2;
                tileSize = 256*2;
            }else if(level == 20){
                level = level - 2;
                row = Math.floor(row/4);
                col = Math.floor(col/4);
                tileSize = 256*4;
            }
            var tileUrl = "http://t" + row % 8 + ".tianditu.cn/" + this.type + "_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" + this.type + "&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles"
            if (tileArr.indexOf(tileUrl)==-1){
                tileArr.push(tileUrl);
                var markerSymbol = new esri.symbol.PictureMarkerSymbol(tileUrl,tileSize,tileSize);
                var x = -180 + col * (256*5.3644180297851563e-006);
                x = x+0.00073;
                var y = 90 - row * (256*5.3644180297851563e-006);
                y = y-0.00071;
                var point = new esri.geometry.Point(x,y,map.spatialReference);
                var graphic = new esri.Graphic(point,markerSymbol);
                tileGraphicsLayer.add(graphic);
            }
        }
    });
}
); 