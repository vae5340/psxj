/*
基于easyui的时间轴，控制历史回放进度
未封装完成
*/

var lastIndex=0;
/**
* 滑动条改变事件
*/
function sliderOnChange(value){

	var index=Math.floor(value / 5);
	if(lastIndex==index){
		return;
	}
	lastIndex=index;
	changeDemoJXSS(index);
	changeDemoCSK(index);
	if(controlMap.changeTeam){
		controlMap.changeTeam(index);
	} else {
		controlMap.contentWindow.changeTeam(index);
	}
}
var changeValue=0;
var isstopback=false;
/**
* 启动回放
*/
function playbackBtnOnClick(){
	isstopback=true;
	doPlayback();
}

/**
* 执行回放
*/
function doPlayback(){
	var value=$('#ss').slider("getValue");
	changeValue=value+1;
	if(changeValue<=100 && isstopback){
		changeSlider(changeValue);
		setTimeout("doPlayback()",300)		
	}	
}
/**
* 停止回放
*/
function stopbackBtnOnClick(){
	parent.layer.msg("播放结束");
	isstopback=false;
	player.Pause();
}

/**
* 改变滚动的值
*/
function changeSlider(value){
	$('#ss').slider("setValue",changeValue);
}

$("#ss").slider({
	showTip: false,
	min:'1',
	max:'100',
	tipFormatter: function(value){
		return value;
	},
	converter:{
		toPosition:function(value, size){
			var opts = $(this).slider('options');
			return (value-opts.min)/(opts.max-opts.min)*size;
		},
		toValue:function(pos, size){
			var opts = $(this).slider('options');
			return opts.min + (opts.max-opts.min)*(pos/size);
		}
	},
	onChange: function(value){
		sliderOnChange(value);
	}
});