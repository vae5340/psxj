var objectid = getQueryStr("objectid");
var layerId = getQueryStr("layerId");
var type = getQueryStr("type");//修改还是查看
var url=""; 
$(function(){
	reloadData();
});
function reloadData(){
	if(objectid && layerId){
		parent.parent.openQueryslayerId(objectid,layerId,queryResultLayer);
	}
}

//取图层信息
function queryResultLayer(result){
	$('#layerId').attr('readonly',"readonly");
	console.log(result);
	if(result && result.features && result.features["0"].attributes){
		var data = result.features["0"].attributes;
		var P = result.features["0"].geometry;
		$("#x").val(P.x);
		$("#y").val(P.y);
		$("#layerId").val(layerId);
		$("#objectid").val(data.OBJECTID);
		$("#addr").val(data.ADDR);
		$("#name").val(data.NAME);
		$("#district").val(data.DISTRICT);
		$("#sort").val(data.SORT);
		$("#state").val(data.STATE);
		$("#managedept").val(data.MANAGEDEPT);
		$("#ownerdept").val(data.OWNERDEPT);
		$("#remark").val(data.REMARK);
	}
}
	
function locationByPoint(type) {    
    layer.open({
		type: 2,
		title: "获取位置",
		shadeClose: false,
		// closeBtn : [0 , true],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['480px', '450px'],
		offset: ['0px', $(window).width()/2-230+'px'],
//		content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/mapDW.html?x="+$("#x").val()+"&y="+ $("#y").val(),
		content: "/psxj/systemInfo/ssxjxt/problem_report/repair/mapDW.html?x="+$("#x").val()+"&y="+ $("#y").val(),
		cancle:function(){
		},
		end : function(){

		}

	});
}



//初始化时间
function loadTime(){
	$("#markTime").datetimepicker({
		language:  'zh-CN',
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
  	});
}


Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}

function save(){
	debugger
	//获取一下xy，如果没有不允许提交
	   var x= $("#x").val();
	   var y= $("#y").val();
	   if(x==null || x=="" ||y==""  || y==null){
		   parent.layer.alert("xy坐标没有值，不允许提交，请点击“获取位置”定位获取");
		   return;
	   }
	   var data = $("#jbqkForm").serializeArray();
		$.ajax({
	     type : 'post',
	     url:'/psxj/repair!saveRepair.action',
	     data: data,
	     dataType: 'json',
	     success: function (data) {
	         if(data.code=='200'){
	        	 var index = parent.layer.getFrameIndex(window.name); 
			     parent.layer.close(index);
	             parent.refreshTable();
	         }else{
	        	 parent.layer.msg("保存失败!",{icon: 2});
	         }
	     },error:function (message) {
	    	 parent.layer.msg("保存失败!",{icon: 2});
	         console.log(message.statusText);
	     }
		 });
}
function update(){
	debugger
	//获取一下xy，如果没有不允许提交
	var x= $("#x").val();
	var y= $("#y").val();
	if(x==null || x=="" ||y==""  || y==null){
		parent.layer.alert("xy坐标没有值，不允许提交，请点击“获取位置”定位获取");
		return;
	}
	var data = $("#jbqkForm").serializeArray();
	$.ajax({
		type : 'post',
		url:'/psxj/repair!saveRepair.action',
		data: data,
		dataType: 'json',
		success: function (data) {
			if(data.code=='200'){
				var index = parent.layer.getFrameIndex(window.name); 
			    parent.layer.close(index);
				parent.refreshTable();
			}else{
				parent.layer.msg("修改失败!",{icon: 2});
			}
		},error:function (message) {
			parent.layer.msg("修改失败!",{icon: 2});
			console.log(message.statusText);
		}
	});
}


