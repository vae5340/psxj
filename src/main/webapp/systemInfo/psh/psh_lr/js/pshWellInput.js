var SGuid = getQueryStr("SGuid");
var id = getQueryStr("id");
var title = getQueryStr("title");
var type = getQueryStr("type");//修改还是查看
var url=""; 
$(function(){
	initClick();
	//扩展获取表单方法
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
	};
	loadData();
});
function loadData(){
	if(type=="update"){
		var data=window.parent.wellDateNow;
		$("#wellIndex").val(data.wellIndex);
		if(data.id){
			$("#id").val(data.id);
		}
		if(data.x){
			$("#x").val(data.x);
		}
		if(data.y){
			$("#y").val(data.y);
		}
		if(data.pipeType && data.pipeType!=""){
			$(":radio[name='pipeType'][value='"+data.pipeType+"']").prop("checked", "checked");
			if($('input[name="pipeType"]:checked').val()==undefined){
				$(":radio[name='pipeType'][value='其他']").prop("checked", "checked");
				$("#pipeType").val(data.pipeType);
				$("#glb").show();
			}
			
		}
		if(data.wellId && data.wellId!=""){
			$("#wellId").val(data.wellId);
			$("#wellIdName").val("窨井("+data.wellId+")");
		}
		if(data.wellType && data.wellType!=""){
			$(":radio[name='wellType'][value='"+data.wellType+"']").prop("checked", "checked");
			if($('input[name="wellType"]:checked').val()==undefined){
				$(":radio[name='wellType'][value='其他']").prop("checked", "checked");
				$("#wellType").val(data.wellType);
				$("#jlb").show();
			}
			if(data.wellType=="合流检测井" || data.wellType=="污水检测井"){
		   		$("#wsld").show();
		   		$("#qtysld").hide();
		   	}else{
		   		$("#wsld").hide();
		   		$("#qtysld").show();
		   	}
		}
		if(data.wellPro && data.wellPro!=""){
			var wellProData="淤积,堵塞,无水流动,晴天有水流动";
			if(data.wellPro.indexOf(",")>=0){
				var wellPros=data.wellPro.split(",");
				for(var i in wellPros){
					if(wellProData.indexOf(wellPros[i])>=0){
						$(":checkbox[name='wellPro'][value='"+wellPros[i]+"']").prop("checked", "checked");
					}else{
						$(":checkbox[name='wellPro'][value='其他']").prop("checked", "checked");
						if(wellPros[i].indexOf("其他：") >= 0){
							$("#wellPro").val(wellPros[i].substring(3,wellPros[i].length));
						}else{
							$("#wellPro").val(wellPros[i]);
						}
						$("#jczdwt").show();
					}
				}
			}else{
				if(wellProData.indexOf(data.wellPro)>=0){
					$(":checkbox[name='wellPro'][value='"+data.wellPro+"']").prop("checked", "checked");
				}else{
					$(":checkbox[name='wellPro'][value='其他']").prop("checked", "checked");
					if(data.wellPro.indexOf("其他：") >= 0){
						$("#wellPro").val(data.wellPro.substring(3,data.wellPro.length));
					}else{
						$("#wellPro").val(data.wellPro);
					}
					$("#jczdwt").show();
				}
			}
		}
		if(data.wellDir && data.wellDir!=""){
			$(":radio[name='wellDir'][value='"+data.wellDir+"']").prop("checked", "checked");
			if($('input[name="wellDir"]:checked').val()==undefined){
				$(":radio[name='wellDir'][value='其他']").prop("checked", "checked");
				$("#wellDir").val(data.wellDir);
				$("#psqx").show();
			}
			
		}
		if(data.drainPro && data.drainPro!=""){
			if(data.drainPro.indexOf("#")>=0){
				var drainPros=data.drainPro.split("#");
				if(drainPros[0] && drainPros[0]=="雨污混接"){
					$(":checkbox[name='drainPro'][value='雨污混接']").prop("checked", "checked");
				}
				if(drainPros[1] && drainPros[1]!=""){
					$(":checkbox[name='drainPro'][value='排水性状异常(描述)']").prop("checked", "checked");
					$("#ycms").val(drainPros[1]);
					$("#ycms").show();
				}
				if(drainPros[2] && drainPros[2]=="偷排"){
					$(":checkbox[name='drainPro'][value='偷排']").prop("checked", "checked");
				}
				if(drainPros[3] && drainPros[3]!=""){
					$(":checkbox[name='drainPro'][value='其他(描述)']").prop("checked", "checked");
					$("#qtms").val(drainPros[3]);
					$("#qtms").show();
				}
			}
		}
	}
}
//格式化排水存在的问题
function formatDrainPro(drainPro){
	if(drainPro==null) return '';
	drainPro=drainPro.replace(/##/g, '#').replace(/##/g, '#');
	if(drainPro.length>1){
		if(drainPro.charAt(drainPro.length-1)=='#'){
			drainPro=drainPro.substring(0,drainPro.length-1);
		}
	}
	if(drainPro.length>0){
		if(drainPro.charAt(0)=='#'){
			drainPro=drainPro.replace(/#/, '');
		}
	}
	drainPro=drainPro.replace(/#/g, '、');
	return drainPro;
}
function initClick(){
	$("input[name='pipeType']").click(function(){
       if($(this).val()=="其他"){
    	   $("#glb").show();
       }else{
    	   $("#glb").hide();
       }
    });
	$("input[name='wellType']").click(function(){
       if($(this).val()=="其他"){
    	   $("#jlb").show();
       }else{
    	   $("#jlb").hide();
       }
       $(":checkbox[name='wellPro']").removeAttr("checked");//取消全选
	   	if($(this).val()=="合流检测井" || $(this).val()=="污水检测井"){
	   		$("#wsld").show();
	   		$("#qtysld").hide();
	   	}else{
	   		$("#wsld").hide();
	   		$("#qtysld").show();
	   	}
    });
	$("input[name='wellPro']").click(function(){
		var wellPro="";
		$("input:checkbox[name='wellPro']:checked").each(function() { 
			wellPro+="%"+$(this).val();
		});
       if($(this).val()=="其他"){
    	   if(wellPro.indexOf("%其他")>=0){
    		   $("#jczdwt").show();
    	   }else{
    		   $("#jczdwt").hide(); 
    	   }
       }
    });
	$("input[name='wellDir']").click(function(){
       if($(this).val()=="其他"){
    	   $("#psqx").show();
       }else{
    	   $("#psqx").hide();
       }
    });
	$("input[name='drainPro']").click(function(){
		var drainPro="";
		$("input:checkbox[name='drainPro']:checked").each(function() { 
			drainPro+="%"+$(this).val();
		});
       if($(this).val()=="排水性状异常(描述)"){
    	   if(drainPro.indexOf("%排水性状异常(描述)")>=0){
    		   $("#ycms").show();
    	   }else{
    		   $("#ycms").hide(); 
    	   }
       }else if($(this).val()=="其他(描述)"){
    	   if(drainPro.indexOf("%其他(描述)")>=0){
    		   $("#qtms").show();
    	   }else{
    		   $("#qtms").hide(); 
    	   }
       }
    });
}
//选择接驳井
function connectWell() {    
    layer.open({
		type: 2,
		title: "选择接驳井",
		shadeClose: false,
		// closeBtn : [0 , true],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['700px', '350px'],
		//offset: ['0px', $(window).width()/2-230+'px'],
		content: "/awater_swj/psh/psh_lr/wellDW.html?SGuid="+SGuid+"&wellId="+$('#wellId').val(),
		cancle:function(){
		},
		end : function(){

		}

	});
}
function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}
//保存
function save(){
	var wellPro="";
	$("input:checkbox[name='wellPro']:checked").each(function() { 
		wellPro+="%"+$(this).val();
	});
	var drainPro="";
	$("input:checkbox[name='drainPro']:checked").each(function() { 
		drainPro+="%"+$(this).val();
	});
	
	//校验
	if($('input[name="pipeType"]:checked').val() == undefined){
		layer.msg('管类别不能为空', {icon: 7});
		return;
	}else if($('input[name="pipeType"]:checked').val() == "其他" && $("#pipeType").val() == ""){
		layer.msg('管类别-其他不能为空', {icon: 7});
		return;
	} else if($('input[name="wellType"]:checked').val() == undefined){
		layer.msg('井类别不能为空', {icon: 7});
		return;
	}else if($('input[name="wellType"]:checked').val() == "其他" && $("#wellType").val() == ""){
		layer.msg('井类别-其他不能为空', {icon: 7});
		return;
	}else if(wellPro.indexOf("%其他")>=0 && $("#wellPro").val() == ""){
		layer.msg('井存在问题-其他不能为空', {icon: 7});
		return;
	}else if($('input[name="wellDir"]:checked').val() == undefined){
		layer.msg('排水去向不能为空', {icon: 7});
		return;
	}else if($('input[name="wellDir"]:checked').val() == "其他" && $("#wellDir").val() == ""){
		layer.msg('排水去向-其他不能为空', {icon: 7});
		return;
	}else if(drainPro.indexOf("%排水性状异常(描述)")>=0 && $("#ycms").val() == ""){
		layer.msg('排水存在的问题-排水性状异常不能为空', {icon: 7});
		return;
	}else if(drainPro.indexOf("%其他(描述)")>=0 && $("#qtms").val() == ""){
		layer.msg('排水存在的问题-其他不能为空', {icon: 7});
		return;
	}
	//获取表单数据及处理
	var well = $("#well").serializeObject();
	var ywell= $("#well").serializeObject();
	if(well.pipeType=="其他"){
		if(well.glb!=""){
			well.pipeType=well.glb;
		}
	}
	if(well.wellType=="其他"){
		if(well.jlb!=""){
			well.wellType=well.jlb;
		}
	}
	if(well.wellPro && well.wellPro.length>0){
		var wellPro="";
		if(isArray(well.wellPro)){
			for( var i = 0; i <well.wellPro.length; i++){
				if(i==0){
					wellPro+=well.wellPro[i];
				}else{
					wellPro+=","+well.wellPro[i];
				}
			}
		}else{
			wellPro=well.wellPro;
		}
		
		if(wellPro.indexOf("其他")>=0){
			wellPro=wellPro.replace(/其他/g, "其他："+well.jczdwt)
			//well.wellPro="其他："+well.jczdwt;
		}
		well.wellPro=wellPro;
	}else{
		well.wellPro="";
	}
	if(well.wellDir=="其他"){
		if(well.psqx!=""){
			well.wellDir=well.psqx;
		}
	}
	if(well.drainPro && well.drainPro.length>0){
		var drainPro="";
		/*for( var i = 0; i <well.drainPro.length; i++){
			drainPro+=well.drainPro[i]+"#";
		}*/
		$("input:checkbox[name='drainPro']").each(function() {
			if($(this).prop('checked')){
				drainPro+=$(this).val()+"#";
			}else{
				drainPro+="#";
			}
		});
		if(drainPro.indexOf("排水性状异常(描述)")>=0){
			drainPro=drainPro.replace("排水性状异常(描述)", well.ycms)
		}
		if(drainPro.indexOf("其他(描述)")>=0){
			drainPro=drainPro.replace("其他(描述)", well.qtms)
		}
		well.drainPro=drainPro;
	}else{
		well.drainPro="####";
	}
	window.parent.addWell(ywell,well);
	window.parent.layer.closeAll();
}
//接驳井定位
function position(objectId){
	toMap();
	window.parent.parent.positionObjId(objectId);
}
//跳回到map地图
function toMap(){
	var aTab = parent.parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}