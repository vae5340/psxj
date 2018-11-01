var $p=new Object();
$p.openWins=new Array();
$p.nextWinNum=0;
$p.winReturnValue=null;
$(function () {
	$(".ui-table").uTable();
})
var $w={
	listFlesh:false,
	
	openWin:function(ops){
		$w.setWinReturn(null);
		$w.listFlesh=false;
		var wid="";
		if(ops.id)
			wid=ops.id;
		else{
			$p.nextWinNum=$p.nextWinNum+1;
			wid="_MailWinDiv"+$p.nextWinNum;
		}
		var bl=false;
		for(var i=0;i<$p.openWins.length;i++) 
	  {
	  	if($p.openWins[i]==wid){
	  		bl=true;
	  		break;
	  	}
	  }
	  
  	if(!bl){
  		$p.openWins.add(wid);
			var ic="icon_win";
			var doAfterClose;
			if(ops.afterClose)doAfterClose=ops.afterClose;
			else{
				doAfterClose=function(re){
					
				}
			}
			var closefun=function(){$p.openWins.remove(wid);$("iframe",$('#'+wid)).remove();$('#'+wid).window('destroy');ui_winTasks_del(wid);doAfterClose($w.getWinReturn());};
			$("<div id='"+wid+"'></div>").appendTo($(document.body));
			var wintitle=ops.title || '新窗口';
			$('#'+wid).window({
				title:wintitle,
				iconCls:ic,
		    width:ops.w,
		    height:ops.h,
		    modal:ops.modal,
		    inline:true,
		    collapsible:ops.collapsible || false,
		    minimizable:ops.minimizable,
		    maximizable:ops.maximizable,
		    resizable:ops.resizable,
		    maximized:ops.maximized,
		    onClose:closefun
			});
			$('#'+wid).window("refresh",ops.url);
		}else{
  		$('#'+wid).window("open");
  	}
			
	},
	openDialog:function(ops){
		ops.modal=true;
		if(!ops.collapsible)
			ops.collapsible=false
		if(!ops.minimizable)
		ops.minimizable=false;
		if(!ops.maximizable)
		ops.maximizable=false;
		this.openWin(ops);
	},
	
	reloadCurrWin:function(href){
		if(href)
			$w.currWin().window('refresh',href);
		else
			$w.currWin().window('refresh');
	},
	closeCurrWin:function(returnvalue){
		if(returnvalue)
			$w.setWinReturn(returnvalue);
		else{
			if($w.listFlesh)
				$w.setWinReturn(true);
			else
				$w.setWinReturn(null);
		}
			this.currWin().window('close');
	},
	setWinReturn:function(returnvalue){
		$p.winReturnValue=returnvalue;
	},
	getWinReturn:function(){
		return $p.winReturnValue;
	},
	
	currWin:function(){
		var cw;
		var czi=0;
		for(i=0;i<$p.openWins.length;i++){
			var zindex=parseInt($("#"+$p.openWins[i]).window("panel").css("zIndex"));
			if(zindex>czi){
				czi=zindex;
				cw=$("#"+$p.openWins[i]);
			}
		}
		return cw;
	},
	execForm:function(ops){
			var mform;
		if(ops && ops.form)mform=ops.form;
		else{
			mform=$w.currForm();
		}
		if(!mform.form("validate"))
			return false;
		var actionurl=mform.attr("action");
		if(actionurl.indexOf(ctx)==-1)actionurl=ctx+actionurl;
		if(ops && ops.target && ops.target!='undefined'){
				try{$("#"+ops.target).panel('refresh',{href:actionurl,data:mform.serializeArray()});}catch(e){ops.target.panel({href:ctx+mform.attr("action"),data:mform.serializeArray()});}
		}else{	
			mform.attr("action",actionurl)
			mform[0].submit();
		}
	},
	execPage:function(ops){
		var mform;
		if(ops && ops.form)mform=ops.form;
		else
		 mform=$w.currForm();
		if(ops && ops.target && ops.target!='undefined'){
				var panel=$("#"+ops.target);
				var olddata=panel.panel('options').data;
				olddata=$w.updateFormPageInfo(olddata,ops);
				try{panel.panel('refresh',{href:panel.panel('options').href,data:olddata});}catch(e){panel.panel({href:panel.panel('options').href,data:olddata});}
			
		}
		else{
			var actionurl=mform.attr("action");
			if(actionurl.indexOf(ctx)==-1)actionurl=ctx+actionurl;
			if(ops && ops.pageNum)$("[name='pageNum']",mform).val(ops.pageNum);
			if(ops && ops.pageSize)$("[name='pageSize_']",mform).val(ops.pageSize);
			mform.attr("action",actionurl);
			mform[0].submit();
		}
	},
	doForm:function(ops){
		var mform;
		if(ops && ops.form)mform=ops.form;
		else
		 mform=$w.currForm(ops?ops.target:'');
		if(!mform.form("validate"))
			return false;
		
		var dobackcall=function(json){
			if(json){
				$w._afterupdate(json.jsonpageinfo_);
				if(json && json.resetForm_=='true')mform.get(0).reset();
			}
			if(ops.callback){if(json.jsonpageinfo_ && json.jsonpageinfo_.stateCode=='300')return false;ops.callback(json);}
		}
		var actionurl=mform.attr("action");
		if(actionurl.indexOf(ctx)==-1)actionurl=ctx+actionurl;
		if(mform[0].enctype.toLowerCase()=="multipart/form-data"){
			$w._iframeCallback(mform,dobackcall);
			mform[0].action=actionurl;
			mform[0].submit();
		}else{
			$.ajax({
				type: 'POST',
				url:actionurl,
				data:mform.serializeArray(),
				dataType:"json",
				cache: false,
				success: dobackcall,
				error: $w.ajaxError
			});
		}
		
		return false;
	},
	doUrl:function(url,datas,callback){
		var dobackcall=function(json){
			if(json){
				$w._afterupdate(json.jsonpageinfo_);
			}
			if(callback)
				callback(json);
		}
		$.ajax({
			type: 'POST',
			url:url,
			data:datas,
			dataType:"json",
			cache: false,
			success: dobackcall,
			error: $w.ajaxError
		});
		return false;
	},
	execUrl:function(url,edata,target){
		if(target)
			try{$("#"+target).panel('refresh',{href:url,data:edata});}catch(e){target.panel({href:url,data:edata});}
		else
			window.location.href=url;
	},
	doWinForm:function(callback){
		var mform=$w.currWinForm();
		$w.doForm({form:mform,callback:callback});
	},
	updateFormPageInfo:function(datas,ops){
		if(datas &&$.isArray(datas)){
				for(i=0;i<datas.length;i++){
					if(ops && ops.pageNum){if(datas[i].name=='pageNum')datas[i].value=ops.pageNum;}
					if(ops && ops.pageSize){if(datas[i].name=='pageSize_')datas[i].value=ops.pageSize;}
				}
			}else{
				if(!datas)datas={};
				if(ops && ops.pageNum)datas.pageNum=ops.pageNum;
				if(ops && ops.pageSize)datas.pageSize_=ops.pageSize;
			}
			return datas;
	},
	currTabForm:function(){
		return $(".PageForm");
	},
	currWinForm:function(){
		return $("form", this.currWin().window("panel"));
	},
	currForm:function(target){
		if(target=='window')
				return $w.currWinForm();
		else
				return $w.currTabForm();
	},
	alertMsg:function(text,title){
		$.messager.alert(title || '系统信息提示',text,'warning');
	},
	infoMsg:function(text,title){
		$.messager.show({
				title:title || '系统信息提示',
				msg:"<span class='infoMsgicon'></span>"+text,
				showType:'slide',
				style:{
					right:'',
					top:document.body.scrollTop+document.documentElement.scrollTop,
					bottom:''
				}
			});
	},
	correctMsg:function(text,title){
		$.messager.show({
				title:title || '系统信息提示',
				msg:"<span class='okMsgicon'></span>"+text,
				showType:'slide',
				style:{
					right:'',
					top:document.body.scrollTop+document.documentElement.scrollTop,
					bottom:''
				}
			});
	},
	errorMsg:function(text,title){
		$.messager.alert(title || '系统错误提示',text,'error');
	},
	confirmMsg:function(text,callback,title){
		$.messager.confirm(title || '系统信息提示', text, function(r){
				callback(r);
			});
	},
	ajaxError:function(xhr, ajaxOptions, thrownError){
		$w.errorMsg(xhr.responseText);
	}
	,_afterupdate: function (jsonpage){
		if(jsonpage){
			$(jsonpage).each(function(){
				if(this.script_)
					window.eval(this.script_);
				else if(this.showInfoMsg_){
					var w=window;
					if(window.parent.$w)w=window.parent;
					w.$w.infoMsg(this.showInfoMsg_);
				}
				else if(this.showErrorMsg_){
					var w=window;
					if(window.parent.$w)w=window.parent;
					w.$w.errorMsg(this.showErrorMsg_);
				}
				else if(this.showAlertMsg_){
					var w=window;
					if(window.parent.$w)w=window.parent;
					w.$w.alertMsg(this.showAlertMsg_);
				}
				else if(this.showOkMsg_){
					var w=window;
					if(window.parent.$w)w=window.parent;
					w.$w.correctMsg(this.showOkMsg_);
				}
			});
		}
	},
	_iframeCallback:function(mform,callback){
		var $form = mform, $iframe = $("#callbackframe");
		if ($iframe.size() == 0) {
			$iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
		}
		if(!mform[0].ajax) {
			$form.append('<input type="hidden" name="ajax" value="1" />');
		}
		mform[0].target = "callbackframe";
		
		$document = $(document);
	
		$document.trigger("ajaxStart");
		
		$iframe.bind("load", function(event){
			$iframe.unbind("load");
			$document.trigger("ajaxStop");
			
			if ($iframe[0].src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
				$iframe[0].src == "javascript:'<html></html>';") { // For FF, IE
				return;
			}
	
			var doc = $iframe[0].contentDocument || $iframe[0].document;
	
			// fixing Opera 9.26,10.00
			if (doc.readyState && doc.readyState != 'complete') return; 
			// fixing Opera 9.64
			if (doc.body && doc.body.innerHTML == "false") return;
		   
			var response;
			
			if (doc.XMLDocument) {
				// response is a xml document Internet Explorer property
				response = doc.XMLDocument;
			} else if (doc.body){
				try{
					response = $iframe.contents().find("body").html();
					response = jQuery.parseJSON(response);
				} catch (e){ // response is html document or plain text
					response = doc.body.innerHTML;
				}
			} else {
				// response is a xml document
				response = doc;
			}
			
			callback(response);
		});
	}
}

$p.openWins.add=function(wid){
	$p.openWins[$p.openWins.length]=wid;
}

$p.openWins.remove=function(wid) 
{ 
    for(var i=0;i<this.length;i++) 
    { 
        if(this[i]==wid){
        	
        	for(var j=(i+1);j<this.length;j++){
        		this[j-1]=this[j];
        		
        	}
        	break
        }
    }
    if(this.length>=1)
    this.length-=1;
}


function ui_winTasks_add(title,wid){
	var taskdiv=$("<div class='ui-winTasks-li' id='ui-winTasks"+wid+"'><span class='ui-winTasks-icon' onclick=\"$('#"+wid+"').window('open')\"></span><span class='ui-winTasks-title' onclick=\"$('#"+wid+"').window('open')\">"+title+"</span><span class='ui-winTasks-close' onclick=\"ui_winTasks_del('"+wid+"')\">×</span></div>");
	taskdiv.appendTo($(".ui-winTasks"))
	taskdiv.mouseover(function(e){taskdiv.addClass('ui-winTasks-over')}).mouseout(function(e){taskdiv.removeClass('ui-winTasks-over')});
}
function ui_winTasks_del(wid){
	$("#"+wid).window('close');
	$("#ui-winTasks"+wid).remove();
	if($(".ui-winTasks-li").length<=0)
		$(".ui-winTasks").hide();
}


function $getByName(name,parent){
	var obj=document.body;
	if(parent)obj=parent;
	return $("[name='"+name+"']",obj);
}
function $getById(id,parent){
	var obj=document.body;
	if(parent)obj=parent;
	return $("#"+id,obj);
}
function $selAllTbBoxs(obj){
	var $grid = $(obj).parent().parent().parent().parent();
	$("[name='primaryKey_']",$grid).each(function(){
		if(obj.checked){
			this.checked=true;
		}
		else{
			this.checked=false;
		}
		})
		
}
function $formatDate(date, format) { 
    if (!date) return;   
    if (!format) format = "yyyy-MM-dd";   
    switch(typeof date) {   
        case "string":   
            date = new Date(date.replace(/-/, "/"));   
            break;   
        case "number":   
            date = new Date(date);   
            break;   
    }    
    if (!date instanceof Date) return;   
    var dict = {   
        "yyyy": date.getFullYear(),   
        "M": date.getMonth() + 1,   
        "d": date.getDate(),   
        "H": date.getHours(),   
        "m": date.getMinutes(),   
        "s": date.getSeconds(),   
        "MM": ("" + (date.getMonth() + 101)).substr(1),   
        "dd": ("" + (date.getDate() + 100)).substr(1),   
        "HH": ("" + (date.getHours() + 100)).substr(1),   
        "mm": ("" + (date.getMinutes() + 100)).substr(1),   
        "ss": ("" + (date.getSeconds() + 100)).substr(1)   
    };       
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {   
        return dict[arguments[0]];   
    });                   
} 