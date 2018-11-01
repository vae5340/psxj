var serverName = GetQueryString("serverName");
var GisObject;
var agcomMap;
$(function () {
    //初始化地图
   // initMap();
    //初始化责任网格图层树
    initDutyGridTree();
});

//保存数据
function saveDutyGrid() {
    var dutyGridId = $('#dutyGridId').val();
    if (!dutyGridId) {
        alert('请点选相应的责任网格图层');
        return;
    }
    var param = {dutyGridId: dutyGridId};
    param.netCode = $('#netCode_input').val();
    //只有更改名字才上传参数
    var netName = $('#netName_input').val();
    var oldName = $('#dutyGridOldName').val();
    if (netName.trim() != oldName.trim()) {
        param.netNewName = $('#netName_input').val();
    }

    var url = "/" + serverName + "/asi/municipalBuild/zrwgpz/duty-grid!saveDutyGrid.action";
    //获取选中的道路图层
    var treeObj = $.fn.zTree.getZTreeObj("street_tree");
    var nodes = treeObj.getChangeCheckedNodes();
    //要取消授权的路段
    var cancelAuthorize = [];
    //要授权的路段
    var addAuthorize = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        if (node.level == 2) {
            if (node.checkedOld) {
                cancelAuthorize.push(node.attributes.objectid);
            } else {
                addAuthorize.push(node.attributes.objectid);
            }
        }
    }
    if (cancelAuthorize.length > 0) param.cancelAuthorize = JSON.stringify(cancelAuthorize);
    if (addAuthorize.length > 0) param.addAuthorize = JSON.stringify(addAuthorize);

    $.ajax({
        type: "post",
        data: param,
        dataType: "json",
        url: url,
        async: false,
        success: function (result) {
            if (result.success) {
                layer.alert('保存成功！！');
                //更新责任网格树节点名称
                var treeObj = $.fn.zTree.getZTreeObj("dutyGrid_tree");
                var node = treeObj.getNodeByTId($('#tId').val());
                node.name = netName;
                treeObj.updateNode(node);
                //重新加载道路树
                $("#" + node.tId + "_a").click();
            } else {
                layer.alert('保存失败！！');
            }
        }
    });
}

//初始化地图
function initMap() {
    var mapFrame = $("#mapDiv");
    mapFrame.attr("src", "/agcom");
}

function initGisObject() {
	/*
    agcomMap = window.document.getElementById('mapDiv').contentWindow;
    var agcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
    GisObject = agcomWindow.GisObject;
    agcomMap = window.parent.parent.document.getElementById("mapDiv").contentWindow[1];
    */
}

//初始化责任网格图层树
function initDutyGridTree() {
    $.ajax({
        type: "post",
        dataType: "json",
        url: "/" + serverName + "/asi/municipalBuild/zrwgpz/duty-grid!getDutyGridLayerTree.action",
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                var result = JSON.parse(ajaxResult.result);
                var setting = {
                    isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
                    treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
                    nameCol: "name",            //在isSimpleData格式下，当前节点名称
                    expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
                    showLine: false,                  //是否显示节点间的连线
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            if (treeNode.level == 0) return;
                            if (!GisObject) {
                                initGisObject();
                            }
                            //点击后显示责任网格编号和责任网格名称
                            var attributes = treeNode.attributes;
                            $('#netCode_input').val(attributes.net_code);
                            $('#netName_input').val(treeNode.name);
                            $('#dutyGridId').val(treeNode.id);
                            $('#dutyGridOldName').val(treeNode.name);
                            $('#tId').val(treeNode.tId);

                            /*
                            //清除上一次所画责任网格图层
                            GisObject.layerdraw.clearFeature();
                            GisObject.toolbar.clear();
                            //在图上画出wkt
                            var geometry = agcomMap.AG.MicMap.gis.Toolbar.getGeometryByWKT(attributes.wkt);
                            GisObject.map.zoomToExtent(geometry.getBounds());
                            GisObject.layerdraw.addGeometry(geometry, null, GisObject.getHighlightStyle('mapsheetStyle'));
                            //加载道路树
                            loadStreetTree(attributes.net_code);
                            */
                        }
                    }
                };
                var zTree = $.fn.zTree.init($("#dutyGrid_tree"), setting, result);
                zTree.expandAll(true);
            }
        }
    });
}

//加载道路树
function loadStreetTree(net_code) {
    $.ajax({
        type: "post",
        dataType: "json",
        data: {net_code: net_code},
        url: "/" + serverName + "/asi/municipalBuild/zrwgpz/duty-grid!getStreetTree.action",
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                var result = JSON.parse(ajaxResult.result);
                var setting = {
                    isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
                    treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
                    nameCol: "name",            //在isSimpleData格式下，当前节点名称
                    expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
                    showLine: false,                  //是否显示节点间的连线
                    checkable: true,                  //每个节点上是否显示 CheckBox
                    check: {
                        enable: true,
                        chkboxType: {"Y": "s", "N": "ps"}
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            if (!GisObject) {
                                initGisObject();
                            }

                            //在图上画出道路
                            GisObject.layerLocate.locateByWkt(treeNode.attributes.wkt, GisObject.getHighlightStyle('bufferStyle'), true, true, null);
                        },
                        onCheck: function (event, treeId, treeNode) {
                            if (treeNode.checked) {
                                GisObject.layerLocate.locateByWkt(treeNode.attributes.wkt, GisObject.getHighlightStyle('bufferStyle'), true, true, null);
                            } else {
                                GisObject.layerLocate.clearCoruscate();
                            }
                        }
                    }
                };
                var treeObj = $.fn.zTree.init($("#street_tree"), setting, result);
                treeObj.expandAll(true);
                var node = treeObj.getNodesByFilter(function (node) {
                    return (node.level == 2 && node.checked == true);
                });
                for (var i = 0; i < node.length; i++) {
                    var geometry = agcomMap.AG.MicMap.gis.Toolbar.getGeometryByWKT(node[i].attributes.wkt);
                    GisObject.layerdraw.addGeometry(geometry, null, GisObject.getHighlightStyle('bufferStyle'));
                }
            }
        }
    });
}