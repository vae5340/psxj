//综合评价系统脚本
//依赖initMap.js

$.support.cors=true;

//时间戳转字串：yyyy-mm-dd
function timeStampToDate(timeStamp){
	var date = new Date(timeStamp);
	var dateStr =  date.getFullYear() + '-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'+date.getDate();
	return dateStr;
}

//考核评价列表
function khpjlb(){
	var options = {
        id:'khpjlb',
        content:'<iframe src="/awater_hangzhou/waterSystem/pjkh/khpjlb.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"考核评价汇总列表",
        top:'1px',
        left:'1px',
        width:'80%',
        height:'100%'
    }
	new popup.PopupWin(options);
    //popupWindow(options);
}

//考核评价汇总列表
function khpjhzlb(){
	var options = {
        id:'khpjhzlb',
		content:'<iframe src="/awater_hangzhou/waterSystem/pjkh/khpjhzlb.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"考核评价汇总列表",
        top:'1px',
        left:'1px',
        width:'80%',
        height:'100%'
    }
	new popup.PopupWin(options);
    //popupWindow(options);
}

function slideDiv(){
	if($("#table").is(":hidden")){
		$("#table").fadeIn();
		$("#template").fadeOut();
	}else{
		$("#template").fadeIn();
		$("#table").fadeOut();
	}
}




