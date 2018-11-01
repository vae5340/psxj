define([
    'dojo/_base/array',
    'esri/geometry/mathUtils',
    'esri/geometry/Point',
    'esri/geometry/Polyline',
    'esri/geometry/Polygon',
    'esri/geometry/Extent'
], function(
    array,
    mathUtils,
    Point,
    Polyline,
    Polygon,
    Extent
){
    'use strict';
    var exports,
        getLineSegments,
        isIntersectionOnPaths,
        intersectGeometries,
        getLineEquation,
        intersectStraightLines;

    /**
     * 已知一个点是两根线段所在直线的交点，判断该交点是否落在两条线段上（相反的情况是交点落在至少一条线段的延长线上）
     * @param intersection {Object} 两直线已知的交点坐标，格式为{x:Number ,y:Number}
     * @param path1 {Array} 线段1，格式 [[x1,y1],[x2,y2]]
     * @param path2 {Array} 线段2，格式同上
     * @return {Boolean} 交点是否落在两条线段上
     */
    isIntersectionOnPaths = function(intersection, path1, path2){
        if(!intersection || !path1 || !path2){
            return false;
        }
        if(//交点x坐标是否在线段path1两个端点的x坐标之间，即交点是否落在线段path1上
            ((intersection.x >= Math.min(path1[0].x, path1[1].x) &&
             intersection.x <= Math.max(path1[0].x, path1[1].x)
            )&&//交点x坐标是否在线段path2两个端点的x坐标之间，即交点是否落在线段path2上
            (intersection.x >= Math.min(path2[0].x, path2[1].x) &&
             intersection.x <= Math.max(path2[0].x, path2[1].x))) &&
                //交点x坐标是否在线段path1两个端点的x坐标之间，即交点是否落在线段path1上
            ((intersection.y >= Math.min(path1[0].y, path1[1].y) &&
             intersection.y <= Math.max(path1[0].y, path1[1].y)
            )&&//交点x坐标是否在线段path2两个端点的y坐标之间，即交点是否落在线段path2上
            (intersection.y >= Math.min(path2[0].y, path2[1].y) &&
             intersection.y <= Math.max(path2[0].y, path2[1].y)))                
        ){
            return true; 
        }
        return false;
    };
    
    /**
     * 获取一个esri.geometry.Polyline/esri.geometry.Polygon类型的几何图形的子（直）线段集合
     * @param geometry {esri.geometry.Polyline | esri.geometry.Polygon} 要处理的几何图形
     * @param extent {esri.geometry.Extent} 要筛选的范围，可选
     * @return {Array} 子线段的集合。数组的元素类型为 [esri.geometry.Point, esri.geometry.Point]，即一条线段的起点和终点组成的数组
     */
    getLineSegments = function(geometry, extent){
        if(!geometry || !(geometry instanceof Polygon || geometry instanceof Polyline)){
            return [];
        }

        var type = geometry.paths? 0: 1,
            paths = type === 0? geometry.paths: geometry.rings,
            lines = [],
            path, pathIndex, pointIndex, cur,
            point1, point2;
        
        if(paths || paths.length){
            for(pathIndex = 0; pathIndex < paths.length; pathIndex ++){
                path = paths[pathIndex];
                if(path.length < 2){
                    continue;
                }
                for(pointIndex = 0; pointIndex < path.length - 1; pointIndex ++){
                    point1 = geometry.getPoint(pathIndex, pointIndex);
                    point2 = geometry.getPoint(pathIndex, pointIndex + 1);
                    if(extent && !(extent.contains(point1) && extent.contains(point2))){
                        continue;
                    }
                    lines.push([point1, point2]);
                }
            }
        }

        return lines;
    };

    /**
     * 求两个几何图形的交点集合
     * @param geometry1 {esri.geometry.Polyline | esri.geometry.Polygon} 第1个几何图形
     * @param geometry2 {esri.geometry.Polyline | esri.geometry.Polygon} 第2个几何图形
     * @param extent {esri.geometry.Extent} 要筛选的范围，可选
     * @return {Array} 交点的集合。数组的元素类型为 esri.geometry.Point
     */
    intersectGeometries = function(geometry1, geometry2, extent){
        if(!geometry1 || !geometry2 ||
           !(geometry1 instanceof Polyline || geometry1 instanceof Polygon) ||
           !(geometry2 instanceof Polyline || geometry2 instanceof Polygon)
          ){
            return [];
        }
        
        var intersectionPoints = [],
            lines1, lines2, intersectionPoint;

        lines1 = getLineSegments(geometry1, extent);
        lines2 = getLineSegments(geometry2, extent);

        if(lines1 && lines2){
            array.forEach(lines1, function(line1){
                array.forEach(lines2, function(line2){
                    intersectionPoint = mathUtils.getLineIntersection(line1[0], line1[1], line2[0], line2[1]);
                    if(intersectionPoint && isIntersectionOnPaths(intersectionPoint, line1, line2)){
                        intersectionPoints.push(intersectionPoint);
                    }
                });
            });
        }

        return intersectionPoints;
    };

    
    /**
     * 根据直线上的两点确定直线的方程.
     * @param point1 {Array} 表示一个点的坐标，[x,y]
     * @param point2 {Array} 表示一个点的坐标，格式同上
     * @param {Object} 直线的方程，格式 {k:Number, b:Number}，或者{c:Number}，分别代表直线方程 y=kx+2（有斜率情况）
     */
    getLineEquation = function(point1, point2){
        if(!point1 || !point2 ||
           (point1[0] === point2[0] && point1[1] === point2[1])){
            return null;
        }
        var eq = null, k, b;
        if(point1[0] === point2[0]){//平行Y轴的直线，无斜率
            eq = {
                'c': point1[0]
            };
        }else{
            //解方程组 {k*x1+b=y1 ; k*x2+b=y2}，求k,b
            k = (point2[1] - point1[1]) / (point2[0] - point1[0]);
            b = point1[1] - k * point1[0];
            eq = {
                'k': k,
                'b': b
            };
        }
        if(eq){
            eq.hasPitch = function(){
                //用于判断该直线是否有斜率
                return eq.k !== null && !isNaN(eq.k);
            };
        }
        return eq;
    };

    /**
     * 求两条线的交点。
     * 注： 该函数不判断是否两条线是否重合的情况，如果出现重合，那么返回的结果应该是空数组，但结果是空数组不代表两条线一定重合.
     * @param line1 {esri.geometry.Polyline} 
     * @param line2 {esri.geometry.Polyline} 
     * @return {Array} 交点坐标的数组，交点形式为{x:Number, y:Number}
     */
    intersectStraightLines = function(equation1, equation2){
        if(!equation1 || !equation2){
            return null;
        }
        if(equation1.k === equation2.k){
            //两直线平行
            //可能两者都是undefined,也可能两者不为undefined，这里都适用
            if((equation1.hasPitch() && equation1.b === equation2.b) ||
               //斜率存在，b相等，两直线重合
               (!equation1.hasPitch() && equation1.c === equation1.c)
              ){
                //斜率不存在，c相等，两直线重合
                return 'overlay';
            }
            //两直线平行且不重合，无交点
            return null;
        }
        var x, y;
        if(equation1.hasPitch() && !equation2.hasPitch()){
            //直线1有斜率，直线2无斜率
            x = equation2.c;
            y = equation1.k * x + equation1.b;
        }else if(!equation1.hasPitch() && equation2.hasPitch()){
            //直线2有斜率，直线1无斜率
            x = equation1.c;
            y = equation2.k * x + equation2.b;
        }else{
            //两条直线都有斜率，直接解方程组 { y=k1*x+b1 ; y=k2*x+b2 }，得出x,y
            x = (equation2.b - equation1.b) / (equation1.k - equation2.k);
            y = equation1.k * x + equation1.b;
        }
        return {
            'x': x,
            'y': y
        };
    };

    exports = {
        'intersectGeometries': intersectGeometries,
        'getLineEquation': getLineEquation,
        'intersectStraightLines': intersectStraightLines
    };

    return exports;
});
