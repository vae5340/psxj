var serverName = GetQueryString("serverName");
var appModule = angular.module('sortApp', [], function($httpProvider) {
	  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	    for(name in obj) {
	      value = obj[name];
	      query += encodeURIComponent(name) + '=' + JSON.stringify(value)+ '&';
	    }
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
});

appModule.controller('sortController',function($scope,$http){
	var projectName="/"+serverName;
	var tableid=window.document.location.search.split("?")[1].split("&")[1].split("=")[1];
	//先根据tableID获取可选列表和已选列表
	$http.get(projectName+'/asi/municipalBuild/facilityLayout/metadatatable!getMetadatatableData.action',{params:{tableid:tableid}
	}).success(function(data,status,headers,config){
		$scope.formFields = data.result[1];
	}).error(function(data,status,headers,config){
	});
	$scope.selectFormField = function(index){
		$scope.formFieldIndex = index;
	}
	//向上移动
	$scope.upMoveClick = function(){
		if($scope.formFieldIndex > 0){
			var temp = $scope.formFields[$scope.formFieldIndex-1];
			$scope.formFields[$scope.formFieldIndex-1] = $scope.formFields[$scope.formFieldIndex];
			$scope.formFields[$scope.formFieldIndex] = temp;
			$scope.formFieldIndex--;
		}
	}
	//向下移动
	$scope.downMoveClick = function(){
		if($scope.formFieldIndex < $scope.formFields.length-1){
			var temp = $scope.formFields[$scope.formFieldIndex];
			$scope.formFields[$scope.formFieldIndex] = $scope.formFields[$scope.formFieldIndex+1];
			$scope.formFields[$scope.formFieldIndex+1] = temp;
			$scope.formFieldIndex++;
		}
	}
	//置顶
	$scope.topMoveClick = function(){
		if($scope.formFieldIndex > 0){
			var temp = $scope.formFields[$scope.formFieldIndex];
			$scope.formFields[$scope.formFieldIndex] = $scope.formFields[0];
			$scope.formFields[0] = temp;
			$scope.formFieldIndex = 0;
		}
	}
	//置底
	$scope.bottomMoveClick = function(){
		if($scope.formFieldIndex < $scope.formFields.length-1){
			var temp = $scope.formFields[$scope.formFieldIndex];
			$scope.formFields[$scope.formFieldIndex] = $scope.formFields[$scope.formFields.length-1];
			$scope.formFields[$scope.formFields.length-1] = temp;
			$scope.formFieldIndex = $scope.formFields.length-1;
		}
	}
	$scope.saveBtnClick = function(){
		var tableID = -1;
		if($scope.formFields.length>0){
			tableID = $scope.formFields[0].tableid;
		}else{
			//tableID = $scope.fields[0].tableID;
		}
		var postData = {fields:$scope.formFields,tableID:tableID};
		var config = {params:{}};
		$http.post(projectName+'/asi/municipalBuild/facilityLayout/metadatatable!saveFieldSort.action',postData
				).success(function(data,status,headers,config){
					layer.msg('字段排序保存成功！', {
						  icon: 1,
						  time: 1000 //1秒关闭（如果不配置，默认是3秒）
						}, function(){
						  //do something
						    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
							parent.layer.close(index); //再执行关闭  
						}); 

					this.close();
		}).error(function(data,status,headers,config){
			
		});
	}
});
