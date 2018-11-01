//定时器，如果半个小时当前页面没有任何操作就弹出提示
/*var count=0;
document.body.onmousedown=function(){
	count++;
}
document.body.onkeydown=function(){
	count++;
}
function checkIsOutLogin(){
	if(count==0){
		alert("当前登录超时，请重新登录！");
		exitSystem();
	}else{//触发以后，重新记时
		count=0;
		setTimeout("checkIsOutLogin()",1800000);
	}
}
setTimeout("checkIsOutLogin()",1800000);*/
//定时器end

//序列化json对象
$.fn.serializeObject = function() {  
        var o = {};  
        var a = this.serializeArray();  
        $.each(a, function() {  
            if (o[this.name]) {  
                if (!o[this.name].push) {  
                    o[this.name] = [ o[this.name] ];  
                }  
                o[this.name].push(this.value || '');  
            } else {  
                o[this.name] = this.value || '';  
            }  
        });  
        return o;  
    }  

/**
 * 获取工程网络地址
 * @returns
 */
function getHtmlProjectBasePath(){
	var curWwwPath = window.document.location.href;
	var pathName =  window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPaht = curWwwPath.substring(0,pos);
	var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return (localhostPaht + projectName);
}
/**
 * 登录用户名称填写
 * @returns
 */
var user_={};
$.ajax({
	// url:'/psxj/om-user!getCurrentUserName.action',
	url:'/psxj/omOrgRest/getCurrentUserInfo',
	// url:'/psxj/data/awater/getCurrentUserName.json',
	method:'GET',
	async:true,
	dataType : 'json',
	success : function(data) {
        user_ = data;
		userCode=data.userCode;
		$("#userName").html(data.userName);
        $("#userName").data("user-id", data.userId);
		if(data.parentOrgName && data.parentOrgId){
			$("#parentOrgArea").val(data.parentOrgName);
			$("#parentOrgAreaId").val(data.parentOrgId);
		} 
		ownToDisplay=data.OwnToDisplay;
		//$("#deptmentName").html(data.DeptmentName);
	},
	error:function (){
		alert("获取用户信息失败，请重新登录");
		exitSystem();
	}
});
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
//根据url参数定位菜单功能
$(function(){
	var funNo = getQueryStr("funNo");
	if(funNo!=""){
		$("a[onclick$='showSecondMenu(\"" + funNo + "\")']").click();
		$("#leftMenu>li:first-child a").click();
	}
	setIframeTitle();
	setTableTitle();
});
//设置tab页面标题(使用titleName URL参数)
function setIframeTitle(){
	var title=getQueryStr("titleName");
	if(title!=""){
		if($("body .ibox-content").length>0){
			var titleHtml="<div style='width:100%;text-align:center;font-size:35px;background-color:#FFFFFF;line-height:75px;'><font face=\"宋体\" style='letter-spacing:8px;'>"+title+"</font></div>"
			$("body .ibox-content").prepend(titleHtml);
		} else {
			var titleHtml="<div style='width:100%;text-align:center;font-size:35px;background-color:#FFFFFF;line-height:75px;'><font face=\"宋体\" style='letter-spacing:8px;'>"+title+"</font></div>"
			$("body").prepend(titleHtml);
		}
	}
}
//设置leftMenuTable页面标题(使用tableTitleName URL参数)
function setTableTitle(){
	var tableTitleName=getQueryStr("tableTitleName");
	if(tableTitleName!=""){
		var str="<p style='font-size:24px;color:#333;text-align:center;'>"+tableTitleName+"</p>";
		$(".tabletitle").html(str);
	}
}
