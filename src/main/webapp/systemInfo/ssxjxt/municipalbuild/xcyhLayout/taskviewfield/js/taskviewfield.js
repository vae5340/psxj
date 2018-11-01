var serverName = GetQueryString("serverName");
var templateid;
var setting;
var nodeid;
var appModule = angular.module('formApp', [], function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            query += encodeURIComponent(name) + '=' + JSON.stringify(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

appModule.directive('tree', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
        }
    };
});

appModule.controller('formController', function ($scope, $http) {
    var tableid = -1;
    var projectName = "/"+serverName;
    //初始化tree表
    setting = {
        isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
        treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
        nameCol: "name",            //在isSimpleData格式下，当前节点名称
        expandSpeed: "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
        showLine: false,                  //是否显示节点间的连线
        checkable: true,                 //每个节点上是否显示 CheckBox
        callback: {
            onClick: function (event, treeId, treeNode, clickFlag) {
                templateid = treeNode.templateid;
                nodeid = treeNode.id;
                $scope.getWfTemplateViewFieldRefData(templateid,nodeid);
            }
        }
    };
    //获取节点字段
    $scope.getWfTemplateViewFieldRefData= function(templateid,nodeid){
        //先根据templateid获取可选列表和已选列表
        $http.get(projectName + '/asi/municipalBuild/xcyhLayout/wf-template-view-field-ref!getWfTemplateViewFieldRefData.action', {
            params: {templateid: templateid,id:nodeid}
        }).success(function (data, status, headers, config) {
            if (data.result[0] != null) {
                var fielddata = data.result[0];
                $scope.leftFields = fielddata;
            } else {
                $scope.leftFields = [];
                $scope.leftFieldIndex = -1;
            }

            if (data.result[1] != null) {
                var formdata = data.result[1];
                $scope.middleFields = formdata;
            } else {
                $scope.middleFields = [];
                $scope.middleFieldIndex = -1;
            }
            if (data.result[2] != null) {
                var rightdata = data.result[2];
                $scope.rightFields = rightdata;
            } else {
                $scope.rightFields = [];
                $scope.rightFieldIndex = -1;
            }
        }).error(function (data, status, headers, config) {
        });
    }
    //获取业务模板数据
    $http.get("/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfBusTemplateData.action", {
        params: {}
    }).success(function (data, status, headers, config) {
        var list = data.result;
        for (var item in list) {
            var value = list[item];
            $("#wfbustemplate").append("<option value='" + value.id + "'>" + value.templateName + "</option>");
        }
        templateid = $("#wfbustemplate").val();
        loadtreeData();
    }).error(function (data, status, headers, config) {
    });

    //左侧选中字段
    $scope.selectLeftField = function (index) {
        $scope.leftFieldIndex = index;
    }
    //中间选中字段
    $scope.selectMiddleField = function (index) {
        $scope.middleFieldIndex = index;
    }
    //右边选中字段
    $scope.selectRightField = function (index) {
        $scope.rightFieldIndex = index;
    }

    //左向中间移动
    $scope.leftToMiddleClick = function () {
        var leftfield = $scope.leftFields[$scope.leftFieldIndex];
        var middleData = $scope.middleFields;
        for(var i=0;i<middleData.length;i++){
            var mdata = middleData[i];
            if(mdata.elementId == leftfield.elementId){
                layer.alert('字段已配置！！');
                return;
            }
        }
        var rightData = $scope.rightFields;
        for(var i=0;i<rightData.length;i++){
            var rdata = rightData[i];
            if(rdata.elementId == leftfield.elementId){
                layer.alert('字段已配置！！');
                return;
            }
        }
        if ($scope.leftFieldIndex > -1) {
            $scope.middleFields.unshift($scope.leftFields[$scope.leftFieldIndex]);
            //$scope.leftFields.splice($scope.leftFieldIndex, 1);
            $scope.leftFieldIndex = -1;
            $scope.middleFieldIndex = -1;
        }
    }
    //中间向左移动
    $scope.middleToLeftMoveClick = function () {
        if ($scope.middleFieldIndex > -1) {
           var selectfield = $scope.middleFields[$scope.middleFieldIndex];
           if(selectfield.id != undefined){
               var id = selectfield.id;
               $http.get(projectName + '/asi/municipalBuild/xcyhLayout/wf-template-view-field-ref!deleteWfTemplateViewFieldRefData.action', {
                   params: {ids: id}
               }).success(function (data, status, headers, config) {
               }).error(function (data, status, headers, config) {
               });
           }

            $scope.middleFields.splice($scope.middleFieldIndex, 1);
            $scope.middleFieldIndex = -1;
            $scope.leftFieldIndex = -1;
        }
    }
    //中间向右移动
    $scope.middleToRightClick = function () {
        if ($scope.middleFieldIndex > -1) {
            $scope.rightFields.unshift($scope.middleFields[$scope.middleFieldIndex]);
            $scope.middleFields.splice($scope.middleFieldIndex, 1);
            $scope.middleFieldIndex = -1;
            $scope.rightFieldIndex = -1;
        }
    }

//右边向中间移动
    $scope.rightToMiddleClick = function () {
        if ($scope.rightFieldIndex > -1) {
            $scope.middleFields.unshift($scope.rightFields[$scope.rightFieldIndex]);
            $scope.rightFields.splice($scope.rightFieldIndex, 1);
            $scope.rightFieldIndex = -1;
            $scope.middleFieldIndex = -1;
        }
    }

    //将左边全部移到中间
    $scope.allLeftToMiddleMoveClick = function () {
        //中间或者右边面板已有的不再移动
        for (var i = 0; i < $scope.leftFields.length; i++) {
            var flag = false;
            for(var j=0;j<$scope.middleFields.length;j++){
                if($scope.leftFields[i].elementId == $scope.middleFields[j].elementId){
                    flag = true;
                }
            }
            for(var j=0;j<$scope.rightFields.length;j++){
                if($scope.leftFields[i].elementId == $scope.rightFields[j].elementId){
                    flag = true;
                }
            }
            if(flag==false){
                $scope.middleFields.unshift($scope.leftFields[i]);
            }
        }
        //$scope.leftFields = [];
        $scope.leftFieldIndex = -1;
    }
    //将右边全部移到中间
    $scope.allRightToMiddleMoveClick = function () {
        for (var i = 0; i < $scope.rightFields.length; i++) {
            $scope.middleFields.unshift($scope.rightFields[i]);
        }
        $scope.rightFields = [];
        $scope.rightFieldIndex = -1;
    }
    //将中间全部移到左边
    $scope.allMiddleToLeftMoveClick = function () {
            var ids = "";
            for(var j=0;j<$scope.middleFields.length;j++){
                if($scope.middleFields[j].id != undefined){
                    ids += $scope.middleFields[j].id+",";
                }
            }
        if(ids != ""){
            ids = ids.substring(0, ids.length - 1);
            $http.get(projectName + '/asi/municipalBuild/xcyhLayout/wf-template-view-field-ref!deleteWfTemplateViewFieldRefData.action', {
                params: {ids: ids}
            }).success(function (data, status, headers, config) {
            }).error(function (data, status, headers, config) {
            });
        }

        $scope.middleFields = [];
        $scope.middleFieldIndex = -1;
    }

//将中间全部移到右边
    $scope.allMiddleToRightMoveClick = function () {
        for (var i = 0; i < $scope.middleFields.length; i++) {
            $scope.rightFields.unshift($scope.middleFields[i]);
        }
        $scope.middleFields = [];
        $scope.middleFieldIndex = -1;
    }

    $scope.saveBtnClick = function () {
        var resultData = [];
        var middleData = $scope.middleFields;
        if(middleData.length!=0){
            for(var i=0;i<middleData.length;i++){
                var mdata = middleData[i];
                if(mdata.displayFlag == undefined){
                    mdata.displayFlag = 0;
                    mdata.id = "";
                }
                mdata.displayFlag = 0;
                resultData.push(mdata);
            }
        }

        var rightData = $scope.rightFields;
        if(rightData.length!=0){
            for(var i=0;i<rightData.length;i++){
                var rdata = rightData[i];
                if(rdata.displayFlag == undefined){
                    rdata.displayFlag = 1;
                    rdata.id = "";
                }
                rdata.displayFlag = 1;
                resultData.push(rdata);
            }
        }
        for(var i=0;i<resultData.length;i++){
            resultData[i].displayOrder = i;
        }
        middleData = {middleFields:resultData};

        var config = {params: {}};
        $http.post(projectName + '/asi/municipalBuild/xcyhLayout/wf-template-view-field-ref!saveWfTemplateViewFieldRefData.action?nodeid=' + nodeid+'&&templateid='+templateid,middleData
        ).success(function (data, status, headers, config) {
             layer.alert('保存成功！！');
             $scope.getWfTemplateViewFieldRefData(templateid,nodeid);
            }).error(function (data, status, headers, config) {
            });
    }

    //向上移动
    $scope.upMoveClick = function(){
        if($scope.rightFieldIndex > 0){
            var temp = $scope.rightFields[$scope.rightFieldIndex-1];
            $scope.rightFields[$scope.rightFieldIndex-1] = $scope.rightFields[$scope.rightFieldIndex];
            $scope.rightFields[$scope.rightFieldIndex] = temp;
            $scope.rightFieldIndex--;
        }
    }
    //向下移动
    $scope.downMoveClick = function(){
        if($scope.rightFieldIndex < $scope.rightFields.length-1){
            var temp = $scope.rightFields[$scope.rightFieldIndex];
            $scope.rightFields[$scope.rightFieldIndex] = $scope.rightFields[$scope.rightFieldIndex+1];
            $scope.rightFields[$scope.rightFieldIndex+1] = temp;
            $scope.rightFieldIndex++;
        }
    }
    //置顶
    $scope.topMoveClick = function(){
        if($scope.rightFieldIndex > 0){
            var temp = $scope.rightFields[$scope.rightFieldIndex];
            $scope.rightFields[$scope.rightFieldIndex] = $scope.rightFields[0];
            $scope.rightFields[0] = temp;
            $scope.rightFieldIndex = 0;
        }
    }
    //置底
    $scope.bottomMoveClick = function(){
        if($scope.rightFieldIndex < $scope.rightFields.length-1){
            var temp = $scope.rightFields[$scope.rightFieldIndex];
            $scope.rightFields[$scope.rightFieldIndex] = $scope.rightFields[$scope.rightFields.length-1];
            $scope.rightFields[$scope.rightFields.length-1] = temp;
            $scope.rightFieldIndex = $scope.rightFields.length-1;
        }
    }

});


//加载tree数据
var zTree;

function loadtreeData() {
    templateid = $("#wfbustemplate").val();
    var requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfTemplateViewTree.action";
    $.ajax({
        type: "post",
        data: {templateid: templateid},
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var zNodes = result.result;
            zTree = $.fn.zTree.init($("#formpageconfiguration_tree"), setting, zNodes);
            var nodes = zTree.getNodes();
            zTree.expandNode(nodes[0], true, false);
        }
    });
}


