var serverName = GetQueryString("serverName");
var templateid;
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
 //获取viewid（nodeid）和templateid
     nodeid=window.document.location.search.split("?")[1].split("&")[0].split("=")[1];
     templateid=window.document.location.search.split("?")[1].split("&")[1].split("=")[1];

        $http.get(projectName + '/asi/municipalBuild/xcyhLayout/wf-template-view-field-ref!getWfTemplateViewFieldRefData.action', {
            params: {templateid: templateid,id:nodeid}
        }).success(function (data, status, headers, config) {
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


    //中间选中字段
    $scope.selectMiddleField = function (index) {
        $scope.middleFieldIndex = index;
    }
    //右边选中字段
    $scope.selectRightField = function (index) {
        $scope.rightFieldIndex = index;
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

    //将右边全部移到中间
    $scope.allRightToMiddleMoveClick = function () {
        for (var i = 0; i < $scope.rightFields.length; i++) {
            $scope.middleFields.unshift($scope.rightFields[i]);
        }
        $scope.rightFields = [];
        $scope.rightFieldIndex = -1;
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
                layer.msg('保存成功！', {
                    icon: 1,
                    time: 1000 //1秒关闭（如果不配置，默认是3秒）
                }, function(){
                    parent.loadData(10, 1);
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                });

                this.close();
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


