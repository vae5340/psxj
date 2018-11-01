//管线查询脚本
$.support.cors=true;

//空间查询
function kjcx(){
	var options = {
        id:'kjcx',
        content:'<iframe src="/awater_hangzhou/waterSystem/gdgl/kjcx.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"空间查询",
        top:'1px',
        left:'1px',
        width:'300px',
        height:'210px'
    }
	new popup.PopupWin(options);
}
//属性查询
function sxcx(){
	var options = {
        id:'sxcx',
        content:'<iframe src="/awater_hangzhou/waterSystem/gdgl/sxcx.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"属性查询",
        top:'1px',
        left:'1px',
        width:'700px',
        height:'450px'
    }
	new popup.PopupWin(options);
}
//管径查询
function gjcx(){
	var options = {
        id:'gjcx',
        content:'<iframe src="/awater_hangzhou/waterSystem/gdgl/gjcx.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"管径查询",
        top:'1px',
        left:'1px',
        width:'300px',
        height:'210px'
    }
	new popup.PopupWin(options);
}

//联合查询
function lhcx(){
	var options = {
        id:'lhcx',
        content:'<iframe src="/awater_hangzhou/waterSystem/gdgl/lhcx.html" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title:"联合查询",
        top:'1px',
        left:'1px',
        width:'700px',
        height:'450px'
    }
	new popup.PopupWin(options);
}



