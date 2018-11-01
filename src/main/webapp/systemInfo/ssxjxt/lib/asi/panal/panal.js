//页面弹窗操作相关的脚本

//layer弹出窗最新索引
var layerIndex = 0;
//layer弹出窗"id - 索引"的对应关系,属性名为id值,属性值为索引值
var relationBetweenIdAndIndex = {};

/**
 * 页面弹窗/panal
 * @param url url
 * @param title 标题
 * @param param {} 父页面向子页面窗口传参
 * @param width 宽
 * @param height 高
 * @param top 左上角定点的y坐标
 * @param left 左上角定点的x坐标
 * @param shade 默认false
 * @param maxmin 默认false
 * @param endCallBack 关闭窗口进行回调
 * @param id 弹窗的唯一id，如果已有相同id的弹窗，会把同id的替换，反之弹出新窗（可为null）
 */
function openLayerPanal(url, title, param, width, height, top, left, shade, maxmin, endCallBack, id) {
    var index = null;
    //根据id获取对应的layer索引,若存在,则关闭该layer
    if (id) {
        index = relationBetweenIdAndIndex[id];
        if (index) {
            layer.close(index);
        }
    }

    index = layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        shade: shade,
        maxmin: maxmin, //开启最大化最小化按钮
        area: [width + 'px', height + 'px'],
        offset: [top + 'px', left + 'px'],
        content: url,
        success: function (layero, index) {
            //父页面向子页面传参
            if (param) {
                var contentWindow = $(layero).find("iframe")[0].contentWindow;
                contentWindow.Index.init(param);
            }
        },
        cancel: function (index, layero) {
            //清除在线监控图层
            if (relationBetweenIdAndIndex.hasOwnProperty('omLayersTree')) {
                layer.close(relationBetweenIdAndIndex['omLayersTree']);
                //在线监控图层自身关闭自身的时候，不清除默认图层列表
                if (relationBetweenIdAndIndex['omLayersTree'] != index)
                    GisObject.onlinemonitorShownLayers = [];
            }
        },
        end: function () {
            if (endCallBack) {
                endCallBack();
            }
        }

    });

    //记录最新弹出窗索引
    layerIndex = index;

    if (id) {
        //保存弹出窗id与索引的关系
        relationBetweenIdAndIndex[id] = index;
    }
}