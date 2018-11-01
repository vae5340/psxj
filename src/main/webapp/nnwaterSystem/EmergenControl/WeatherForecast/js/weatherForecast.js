jQuery.support.cors = true; 
var jsons='{"code":0,"data":{"city":{"cityId":285150,"counname":"中国","name":"兴宁区","pname":"广西壮族自治区","timezone":"8"},"forecast":[{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"31","conditionNight":"多云","predictDate":"2017-03-26","tempDay":"21","tempNight":"13","updatetime":"2017-03-26 23:09:00","windDirDay":"东北风","windDirNight":"东风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"7","conditionNight":"小雨","predictDate":"2017-03-27","tempDay":"23","tempNight":"13","updatetime":"2017-03-27 09:10:00","windDirDay":"东风","windDirNight":"东风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"中雨","conditionIdDay":"8","conditionIdNight":"7","conditionNight":"小雨","predictDate":"2017-03-28","tempDay":"20","tempNight":"16","updatetime":"2017-03-27 09:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"小雨","conditionIdDay":"7","conditionIdNight":"7","conditionNight":"小雨","predictDate":"2017-03-29","tempDay":"23","tempNight":"18","updatetime":"2017-03-27 09:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"小雨","conditionIdDay":"7","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-30","tempDay":"29","tempNight":"21","updatetime":"2017-03-27 09:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"中雨","conditionIdDay":"8","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-31","tempDay":"25","tempNight":"16","updatetime":"2017-03-27 09:10:00","windDirDay":"东北风","windDirNight":"东北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-04-01","tempDay":"24","tempNight":"15","updatetime":"2017-03-27 09:10:00","windDirDay":"东北风","windDirNight":"东北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"31","conditionNight":"多云","predictDate":"2017-04-02","tempDay":"25","tempNight":"16","updatetime":"2017-03-27 09:10:00","windDirDay":"东北风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-03","tempDay":"24","tempNight":"14","updatetime":"2017-03-27 09:10:00","windDirDay":"东南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-04","tempDay":"23","tempNight":"18","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-05","tempDay":"25","tempNight":"17","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"31","conditionNight":"多云","predictDate":"2017-04-06","tempDay":"25","tempNight":"18","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-07","tempDay":"28","tempNight":"19","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"31","conditionNight":"多云","predictDate":"2017-04-08","tempDay":"27","tempNight":"19","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"多云","conditionIdDay":"1","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-09","tempDay":"30","tempNight":"21","updatetime":"2017-03-27 09:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-10","tempDay":"31","tempNight":"16","updatetime":"2017-03-27 09:10:00","windDirDay":"东北风","windDirNight":"东北风","windLevelDay":"3","windLevelNight":"3"}]},"msg":"success","rc":{"c":0,"p":"success"}}';


/**
var dataSource;
$.ajax({
	method : 'get',
	url : '/agsupport/getWeather',
	data : {"lat":'22.815705579771244',"lon":'108.318335943728'},
	dataType: 'json',
	async: false,
	success: function(data){
		dataSource  =data;
	},error:function(){}
});
*/



var app = angular.module('weatherApp', []);
app.controller('weatherCtrl', function($scope,$http) {
	//dataSource=dataSource.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日');
	jsons = jsons.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日');
   	var dataWeather = JSON.parse(jsons);
  	 $scope.updateTime = dataWeather.data.forecast[1].updatetime;
  	 
  	 
	var now = new Date();
	var nowHour = now.getHours();
	if(nowHour<18){
		//实时时间为白天
		$scope.cond = dataWeather.data.forecast[1].conditionIdDay;
		$scope.type = dataWeather.data.forecast[1].conditionDay;
		$scope.temp = dataWeather.data.forecast[1].tempDay;
		$scope.wind = dataWeather.data.forecast[1].windDirDay;
		$scope.strength = dataWeather.data.forecast[1].windLevelDay;
	} else {
		//实时时间为晚上
		$scope.cond = dataWeather.data.forecast[1].conditionIdNight;
		$scope.type = dataWeather.data.forecast[1].conditionNight;
		$scope.temp = dataWeather.data.forecast[1].tempNight;
		$scope.wind = dataWeather.data.forecast[1].windDirNight;
		$scope.strength = dataWeather.data.forecast[1].windLevelNight;
		
	}
	$scope.records = dataWeather.data.forecast.splice(1);
});





function ajaxData(){
	/*$http({
    	method: 'GET',
    	url : '/agsupport/getWeather',
    	//params : {"lat":"22.815705579771244","lon":"108.318335943728"},
  	}).success(function(data, status) {
  		var dataWeather = JSON.parse('{"code":0,"data":{"city":{"cityId":285150,"counname":"中国","name":"兴宁区","pname":"广西壮族自治区","timezone":"8"},"forecast":[{"conditionDay":"小雨","conditionIdDay":"7","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-19","tempDay":"21","tempNight":"14","updatetime":"2017-03-19 23:09:00","windDirDay":"东南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"小雨","conditionIdDay":"7","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-20","tempDay":"26","tempNight":"18","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"7","conditionNight":"小雨","predictDate":"2017-03-21","tempDay":"21","tempNight":"18","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"中雨","conditionIdDay":"8","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-22","tempDay":"23","tempNight":"17","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-23","tempDay":"24","tempNight":"18","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"7","conditionNight":"小雨","predictDate":"2017-03-24","tempDay":"27","tempNight":"16","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-25","tempDay":"26","tempNight":"13","updatetime":"2017-03-20 17:10:00","windDirDay":"东北风","windDirNight":"东北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-26","tempDay":"19","tempNight":"13","updatetime":"2017-03-20 17:10:00","windDirDay":"东北风","windDirNight":"东北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-03-27","tempDay":"20","tempNight":"12","updatetime":"2017-03-20 17:10:00","windDirDay":"东北风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-03-28","tempDay":"18","tempNight":"14","updatetime":"2017-03-20 17:10:00","windDirDay":"东北风","windDirNight":"北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-03-29","tempDay":"23","tempNight":"14","updatetime":"2017-03-20 17:10:00","windDirDay":"北风","windDirNight":"北风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"阴","conditionIdDay":"2","conditionIdNight":"2","conditionNight":"阴","predictDate":"2017-03-30","tempDay":"25","tempNight":"17","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"31","conditionNight":"多云","predictDate":"2017-03-31","tempDay":"24","tempNight":"17","updatetime":"2017-03-20 17:10:00","windDirDay":"南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-01","tempDay":"28","tempNight":"18","updatetime":"2017-03-20 17:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-02","tempDay":"25","tempNight":"19","updatetime":"2017-03-20 17:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"},{"conditionDay":"雨","conditionIdDay":"8","conditionIdNight":"8","conditionNight":"雨","predictDate":"2017-04-03","tempDay":"25","tempNight":"19","updatetime":"2017-03-20 17:10:00","windDirDay":"东南风","windDirNight":"东南风","windLevelDay":"3","windLevelNight":"3"}]},"msg":"success","rc":{"c":0,"p":"success"}}');
  		$scope.updateTime = dataWeather.data.forecast[0].updatetime;
		var now = new Date();
		var nowHour = d.getHours();
		if(nowHour<12){
			//实时时间为上午
			
		} else {
			//实时时间为下午
		}
		alert("success");
  	}).error(function(data, status) {
		alert("error");
  	});*/
}