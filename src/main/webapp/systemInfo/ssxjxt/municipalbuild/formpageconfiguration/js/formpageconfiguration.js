var serverName = GetQueryString("serverName");
var dicsdata;
var metacodeitemname;
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
    var projectName = "/" + serverName;
    //初始化tree表
    var setting = {
        isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
        treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
        treeNodeParentKey: "seniorid",        //在isSimpleData格式下，当前节点的父节点id属性
        nameCol: "name",            //在isSimpleData格式下，当前节点名称
        expandSpeed: "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
        showLine: true,                  //是否显示节点间的连线
        checkable: true,                  //每个节点上是否显示 CheckBox
        callback: {
            onClick: function (event, treeId, treeNode, clickFlag) {
                tableid = treeNode.id;
                //先根据tableID获取可选列表和已选列表
                $http.get(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getMetadatafieldData.action', {
                    params: {tableid: treeNode.id}
                }).success(function (data, status, headers, config) {
                    if (data.result[0] != null) {
                        $scope.metacodeitems = null;
                        metacodeitemname = null;
                        var fielddata = data.result[0];
                        if(fielddata.length != 0){
                            for(var i=0;i<fielddata.length;i++){
                                for(var j=0;j<dicsdata.length;j++){
                                    if(fielddata[i].belongmetacodename == dicsdata[j].typecode){
                                        metacodeitemname = fielddata[i].belongmetacodename;
                                        $scope.metacodeitems = data.result;
                                        fielddata[i].belongmetacodename = dicsdata[j].name;
                                    }
                                }
                            }
                            if(metacodeitemname != null){
                                $http.get(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getMetaCodeItem.action', {
                                    params: {metacodename: metacodeitemname}
                                }).success(function (data, status, headers, config) {
                                    $scope.metacodeitems = data.result;
                                }).error(function (data, status, headers, config) {

                                });
                            }
                        }

                        $scope.fields = fielddata;

                    } else {
                        $scope.fields = [];
                        $scope.fieldIndex = -1;
                    }
                    if (data.result[1] != null) {
                        $scope.metacodeitems = null;
                        metacodeitemname = null;
                        var formdata = data.result[1];
                        if(formdata.length != 0){
                            for(var i=0;i<formdata.length;i++){
                                for(var j=0;j<dicsdata.length;j++){
                                    if(formdata[i].belongmetacodename == dicsdata[j].typecode){
                                        metacodeitemname = formdata[i].belongmetacodename;
                                        formdata[i].belongmetacodename = dicsdata[j].name;
                                    }
                                }
                            }
                            if(metacodeitemname != null){
                                $http.get(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getMetaCodeItem.action', {
                                    params: {metacodename: metacodeitemname}
                                }).success(function (data, status, headers, config) {
                                    $scope.metacodeitems = data.result;
                                }).error(function (data, status, headers, config) {

                                });
                            }
                        }
                        $scope.formFields = formdata;
                    } else {
                        $scope.formFields = [];
                        $scope.formFieldIndex = -1;
                    }

                }).error(function (data, status, headers, config) {

                });
            }
        }

    };
    var zTree;
    $http.get(projectName + "/asi/municipalBuild/facilityLayout/metadatatable!getMetadatatableTree.action", {
        params: {}
    }).success(function (data, status, headers, config) {
        var zNodes = data.result;
        zTree = $.fn.zTree.init($("#formpageconfiguration_tree"), setting, zNodes);
        var nodes = zTree.getNodes();
        zTree.expandNode(nodes[0], true,false);
    }).error(function (data, status, headers, config) {
    });

    //初始化字典表数据
    $http.get(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getMetacodetypeData.action', {
        params: {}
    }).success(function (data, status, headers, config) {
/*        var dicObject = {};
        dicObject.id = "";
        dicObject.memo = "";
        dicObject.name = "";
        dicObject.seniorid = "";
        dicObject.typecode = "";
        var dicAry = [];
        dicAry = data.result;
        dicAry.push(dicObject);*/
        $scope.dics = data.result;
        dicsdata = data.result;

    }).error(function (data, status, headers, config) {

    });

    //用来联动是否为字典表
    $scope.isDic = false;

    $scope.relatedtabletypecode = false;

    //组件类型变化
    $scope.componentChange = function (componentid) {

        if (componentid == "0" || componentid == "3") {
            $scope.isDic = true;
        } else {
            $scope.isDic = false;
        }
    }

    $scope.dicChange = function (diccode){
        var formfields = this.formFields;
        var formfieldindex = this.formFieldIndex;
        var a;
        for(var i in dicsdata){
            if(diccode == dicsdata[i].typecode && dicsdata[i].isTable == 1){
                a = diccode;
                break;
            }
        }
        if(a != undefined){
            $http.post(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getTableFieldsByTableid.action?tableid='+a
            ).success(function (data, status, headers, config) {
                    $scope.typecodes = data.result;
                    $scope.diccodes = data.result;
                    $scope.dicnames = data.result;
                    $scope.relatedtabletypecode = true;
                }).error(function (data, status, headers, config) {

                });
        }else{
            formfields[formfieldindex].relatedtabletypecode = "";
            formfields[formfieldindex].relatedtablediccode = "";
            formfields[formfieldindex].relatedtabledicname = "";
            $scope.relatedtabletypecode = false;
        }
    }

    //左侧选中字段
    $scope.selectField = function (index) {
        $scope.fieldIndex = index;
    }
    //右侧选中字段
    $scope.selectFormField = function (index) {
        $scope.formFieldIndex = index;

        if ($scope.formFields[index].componentid == 0) {
            $scope.isDic = true;
        } else {
            $scope.isDic = false;
        }
        if($scope.formFields[index].relatedtablediccode != undefined){
            $http.post(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!getTableFieldsByTableid.action?tableid='+$scope.formFields[index].diccode
            ).success(function (data, status, headers, config) {
                    $scope.typecodes = data.result;
                    $scope.diccodes = data.result;
                    $scope.dicnames = data.result;
                    $scope.relatedtabletypecode = true;
                }).error(function (data, status, headers, config) {

                });
            $scope.relatedtabletypecode = true;
        }else{
            $scope.relatedtabletypecode = false;
        }
    }
    //右移动
    $scope.rightMoveClick = function () {
        if ($scope.fieldIndex > -1) {
            $scope.formFields.unshift($scope.fields[$scope.fieldIndex]);
            $scope.fields.splice($scope.fieldIndex, 1);
            $scope.fieldIndex = -1;
            $scope.formFieldIndex = -1;
        }
    }
    //左移动
    $scope.leftMoveClick = function () {
        if ($scope.formFieldIndex > -1) {
            $scope.fields.unshift($scope.formFields[$scope.formFieldIndex]);
            $scope.formFields.splice($scope.formFieldIndex, 1);
            $scope.formFieldIndex = -1;
            $scope.fieldIndex = -1;
        }
    }
    //全部移到右边
    $scope.allRightMoveClick = function () {
        for (var i = 0; i < $scope.fields.length; i++) {
            $scope.formFields.unshift($scope.fields[i]);
        }
        $scope.fields = [];
        $scope.fieldIndex = -1;
    }
    //全部移到左边
    $scope.allLeftMoveClick = function () {
        for (var i = 0; i < $scope.formFields.length; i++) {
            $scope.fields.unshift($scope.formFields[i]);
        }
        $scope.formFields = [];
        $scope.formFieldIndex = -1;
    }

    $scope.saveBtnClick = function () {
        var postData = $scope.formFields;
        for(var i=0;i<postData.length;i++){
            for(var j=0;j<dicsdata.length;j++){
                if(postData[i].belongmetacodename == dicsdata[j].name){
                    postData[i].belongmetacodename = dicsdata[j].typecode;
                    continue;
                }
            }
        }
        postData = {fields: postData};
        if ($scope.formFields.length == 0) {
            layer.alert('请选择表单字段！！');
            return;
        }
        var config = {params: {}};
        $http.post(projectName + '/asi/municipalBuild/facilityLayout/metadatafield!saveFieldAttribute.action?nodeid=' + tableid, postData
        ).success(function (data, status, headers, config) {
                layer.alert('保存成功！！');
            }).error(function (data, status, headers, config) {

            });
    }
});
