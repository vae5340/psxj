var serverName = GetQueryString("serverName");
var GisObject;
var agcomMap;
//巡查人员树
var patrolTreeObj;
//责任网格图层树
var dutyGridTreeObj;

$(function () {
    //初始化地图
    // initMap();
    //初始化巡查人员树
    initPatrolUserTree();
});

//初始化地图
function initMap() {
    var mapFrame = $("#mapDiv");
    mapFrame.attr("src", "/agcom");
}

//初始化巡查人员树
function initPatrolUserTree() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/' + serverName + '/asi/municipalBuild/zrwgpz/duty-grid!getPatrolUserTree.action',
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                var result = JSON.parse(ajaxResult.result);
                var setting = {
                    isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
                    treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
                    nameCol: "name",            //在isSimpleData格式下，当前节点名称
                    expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
                    showLine: false,                  //是否显示节点间的连线
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            if (treeNode.level == 0) return;
                            if (!GisObject) {
                                initGisObject();
                            }
                            var attributes = treeNode.attributes;
                            //加载巡查员信息
                            for (var item in attributes) {
                                $('#' + item).val(attributes[item]);
                            }
                            patrolTreeObj.checkNode(treeNode, !treeNode.checked, true, !treeNode.checked);
                        },
                        onCheck: function (event, treeId, treeNode) {
                            //初始化责任网格图层树
                            initDutyGridTree(treeNode.id);
                        }
                    }
                };
                //隐藏根节点的checkbox
                result.nocheck = true;
                patrolTreeObj = $.fn.zTree.init($("#patrolUser_tree"), setting, result);
                patrolTreeObj.expandAll(true);
            }
        }
    });
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
function initDutyGridTree(userId) {
    $.ajax({
        type: "post",
        dataType: "json",
        data: {userId: userId},
        url: "/" + serverName + "/asi/municipalBuild/zrwgpz/duty-grid!getDutyGridLayerTreeBySqlWhere.action",
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                var result = JSON.parse(ajaxResult.result);
                var netCodeChecked = JSON.parse(result[0]);
                //清除上一次所画责任网格图层
                GisObject.layerdraw.clearFeature();
                GisObject.toolbar.clear();
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
                            if (treeNode.level == 0) return;
                            if (!GisObject) {
                                initGisObject();
                            }
                            GisObject.layerLocate.locateByWkt(treeNode.attributes.wkt, GisObject.getHighlightStyle('bufferStyle'), true, true, null);
                        }, onCheck: function (event, treeId, treeNode) {
                            if (treeNode.checked) {
                                GisObject.layerLocate.locateByWkt(treeNode.attributes.wkt, GisObject.getHighlightStyle('bufferStyle'), true, true, null);
                            } else {
                                GisObject.layerLocate.clearCoruscate();
                            }
                        }

                    }
                };
                dutyGridTreeObj = $.fn.zTree.init($("#dutyGrid_tree"), setting, JSON.parse(result[1]));
                if (netCodeChecked.length > 0) {
                    var nodes = dutyGridTreeObj.getNodesByFilter(function (node) {
                        return node.level == 1 && $.inArray(node.attributes.net_code, netCodeChecked) != -1;
                    });
                    //用于定位的多边形数组
                    var geometryList = [];
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        dutyGridTreeObj.checkNode(node, true, true);
                        node.checkedOld = node.checked;
                        var geometry = agcomMap.AG.MicMap.gis.Toolbar.getGeometryByWKT(node.attributes.wkt);
                        GisObject.layerdraw.addGeometry(geometry, null, GisObject.getHighlightStyle('mapsheetStyle'));
                        geometryList.push(geometry);
                    }
                    //定位到所有绑定的责任网格
                    GisObject.layerLocate.locateMoreGeometry(geometryList);
                }

                dutyGridTreeObj.expandAll(true);
            }
        }
    });
}

function savePatrolBinding() {
    var patNodes = patrolTreeObj.getCheckedNodes(true);
    if (patNodes.length == 0) {
        alert('请选择巡查员');
        return;
    }
    var param = {};
    param.userId = patNodes[0].id;
    var dutyNodes = dutyGridTreeObj.getChangeCheckedNodes();
    //要取消授权的责任网格
    var cancelAuthorize = [];
    //要授权的责任网格
    var addAuthorize = [];
    for (var i = 0, l = dutyNodes.length; i < l; i++) {
        var node = dutyNodes[i];
        if (node.level == 1) {
            if (node.checkedOld) {
                cancelAuthorize.push(node.attributes.net_code);
            } else {
                addAuthorize.push(node.attributes.net_code);
            }
        }
    }
    if (cancelAuthorize.length > 0) param.cancelAuthorize = JSON.stringify(cancelAuthorize);
    if (addAuthorize.length > 0) param.addAuthorize = JSON.stringify(addAuthorize);

    $.ajax({
        type: 'post',
        dataType: 'json',
        data: param,
        url: "/" + serverName + "/asi/municipalBuild/zrwgpz/duty-grid!savePatrolBinding.action",
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                layer.alert('保存成功！！');
                //重新加载道路树
                initDutyGridTree(patNodes[0].id);
            } else {
                layer.alert('保存失败！！');
            }
        }
    });
}