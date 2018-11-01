//设施巡检脚本

$.support.cors=true;

//任务列表
function list(param){
		var options = {
        id:'list'+param,
        content:'<iframe src="/awater_hangzhou/waterSystem/ssxj/list.html?handlestate='+param+'" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"问题列表",
        top:'1px',
        left:'1px',
        width:'80%',
        height:'100%'
    }
	new popup.PopupWin(options);
}

//上报
function add(){
	var options = {
        id:'add',
        content:'<iframe src="/awater_hangzhou/waterSystem/ssxj/web-input.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"问题上报",
        top:'1px',
        left:'1px',
        width:'50%',
        height:'100%'
    }
	new popup.PopupWin(options);
}
//巡检问题模板列表
function template(){
		var options = {
        id:'template',
        content:'<iframe src="/awater_hangzhou/waterSystem/ssxj/template.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"巡检问题模板管理",
        top:'1px',
        left:'1px',
        width:'80%',
        height:'100%'
    }
	new popup.PopupWin(options);
}
function slideDiv(){
	if($("#table").is(":hidden")){
		$("#table").fadeIn();
		$("#input").fadeOut();
	}else{
		$("#input").fadeIn();
		$("#table").fadeOut();
	}
}

function slideTab(id){
	if($("#"+id).is(":hidden")){
		if($("#info").is(":hidden")){
			$("#info").fadeIn();
			$("#record").fadeOut();
			$("#li1").addClass('active');
			$("#li2").removeClass('active');
		}else{
			$("#record").fadeIn();
			$("#info").fadeOut();
			$("#li2").addClass('active');
			$("#li1").removeClass('active');
		}
	}
	
}

function getParamByUrl(url){
	var reg = /handlestate=(\d)/; 
	var arr = url.match(reg); 
	return arr[1]+'';
}

