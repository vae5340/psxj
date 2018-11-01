//行业大类
var pcodeData=window.parent.parent.awater.code.pcodeData;
//行业小类
var codeData=window.parent.parent.awater.code.codeData;
var id = getQueryStr("id");
var title = getQueryStr("title");
var type = getQueryStr("type");//修改还是查看
var area = getQueryStr("area");
var town = getQueryStr("town");
var village = getQueryStr("village");
var street = getQueryStr("street");
var mph = getQueryStr("mph");
var sfdtl = getQueryStr("sfdtl");
var SGuid = getQueryStr("SGuid");
var url="",wellData=[],wellDataShow=[],deletewellBeen="";
var isClick=false,wellIndex=0,wellDateNow;
//原图片展示参数
var xctpPreview=[],xctpPreviewConfig=[],yyzzPreview=[],yyzzPreviewConfig=[],
hzsPreview=[],hzsPreviewConfig=[],psxkzPreview=[],psxkzPreviewConfig=[],pwxkzPreview=[],pwxkzPreviewConfig=[];
//选择图片数量与原图片数量
var xctpNum=0,yyzzNum=0,hzsNum=0,psxkzNum=0,pwxkzNum=0,xctpNumY=0,yyzzNumY=0,hzsNumY=0,psxkzNumY=0,pwxkzNumY=0;
$(function(){
	//动态是否只读
	/*if(type=='view'){
		$('form').find('input,textarea,select,radio').not('button').attr('readonly',true);
		//$('form').find('input,textarea,select,radio').not('button').attr('disabled',false);
	}*/
	$("#jbqk").validate({
	    rules: {
	    	volume:{
	    		number:true
	    	}
	    },
	    messages: {
	    	volume:{
	    		number:'<font class="waring" color="red">请输入数字</font>'
	    	}
	    }
	});
	//初始化时间
	//loadTime();
	if(type=='add'){//填充门牌数据
		$("#town").val(town);
		$("#mph").val(mph);
		$("#addr").val(area+town+mph);
		$("#area").val(area);
		$("#village").val(village);
		$("#street").val(street);
		$("#jzwcode").val(mph);
		$("#sfdtl").val(sfdtl);
		$("#doorplateAddressCode").val(SGuid);
	}
	//初始化行业类别
	for(var i in pcodeData){
		var item = pcodeData[i];
		$("#dischargerType1").append("<option value='"+item.name+"'>"+item.name+"</option>");
	}
	//初始化点击事件
	initClick();
	if(id){
		//填充数据
		reloadData();
	}
	//初始化附件上传控件
	initFileInput();
	fileMethod();
	
});
//文件上传事件，记录修改文件数量
function fileMethod(){
	//现场图片
	$("#xctpFile").on("filebatchselected", function(event, files) {
		xctpNum=files.length;
		$("#xctpNum").html(xctpNum+xctpNumY);
	});
	$('#xctpFile').on('fileremoved', function(event, id, index) {
		xctpNum--;
		$("#xctpNum").html(xctpNum+xctpNumY);
	});
	$('#xctpFile').on('filedeleted', function(event, key, jqXHR, data) {
		xctpNumY--;
		$("#xctpNum").html(xctpNum+xctpNumY);
	});
	//营业执照
	$("#yyzzFile").on("filebatchselected", function(event, files) {
		yyzzNum=files.length;
		$("#yyzzNum").html(yyzzNum+yyzzNumY);
	});
	$('#yyzzFile').on('fileremoved', function(event, id, index) {
		yyzzNum--;
		$("#yyzzNum").html(yyzzNum+yyzzNumY);
	});
	$('#yyzzFile').on('filedeleted', function(event, key, jqXHR, data) {
		yyzzNumY--;
		$("#yyzzNum").html(yyzzNum+yyzzNumY);
	});
	//核准书
	$("#hzsFile").on("filebatchselected", function(event, files) {
		hzsNum=files.length;
		$("#hzsNum").html(hzsNum+hzsNumY);
	});
	$('#hzsFile').on('fileremoved', function(event, id, index) {
		hzsNum--;
		$("#hzsNum").html(hzsNum+hzsNumY);
	});
	$('#hzsFile').on('filedeleted', function(event, key, jqXHR, data) {
		hzsNumY--;
		$("#hzsNum").html(hzsNum+hzsNumY);
	});
	//排水许可证
	$("#psxkzFile").on("filebatchselected", function(event, files) {
		psxkzNum=files.length;
		$("#psxkzNum").html(psxkzNum+psxkzNumY);
	});
	$('#psxkzFile').on('fileremoved', function(event, id, index) {
		psxkzNum--;
		$("#psxkzNum").html(psxkzNum+psxkzNumY);
	});
	$('#psxkzFile').on('filedeleted', function(event, key, jqXHR, data) {
		psxkzNumY--;
		$("#psxkzNum").html(psxkzNum+psxkzNumY);
	});
	//排污许可证
	$("#pwxkzFile").on("filebatchselected", function(event, files) {
		pwxkzNum=files.length;
		$("#pwxkzNum").html(pwxkzNum+pwxkzNumY);
	});
	$('#pwxkzFile').on('fileremoved', function(event, id, index) {
		pwxkzNum--;
		$("#pwxkzNum").html(pwxkzNum+pwxkzNumY);
	});
	$('#pwxkzFile').on('filedeleted', function(event, key, jqXHR, data) {
		pwxkzNumY--;
		$("#pwxkzNum").html(pwxkzNum+pwxkzNumY);
	});
}
function change(dwlx){
	if(dwlx=="其他"){
		$("#dwlx").show();
	}else{
		$("#dwlx").hide();
	}
	
}
function changeHylb(hydl){
	$("#dwlx").hide();
	$("#dischargerType2").html("");//清空下拉框 
	$("#dischargerType2").append("<option value=''></option>");
	for(k in codeData){
		if(hydl==codeData[k].pCode){
			var result=codeData[k].data;
			for(var i in result){
				var item = result[i];
				$("#dischargerType2").append("<option value='"+item.name+"'>"+item.name+"</option>");
			}
			break;
		}
	}
}
function initFileInput(){
	$("#xctpFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/agsupport_swj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForPsh.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"1",pshId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : false, //显示移除按钮
        showCancel: true,
        showClose: false,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        //minFileCount: 2,
        maxFileCount: 9, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
		initialPreviewAsData: true,
		initialPreview: xctpPreview,
		initialPreviewConfig:xctpPreviewConfig,
        //msgFilesTooLess:"你必须选择最少 <b>{n}</b> {files} 来上传！",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        },
        layoutTemplates:{
        	actionUpload:''
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if(yyzzNum>0){
                $("#yyzzFile").fileinput("upload");
            }else if(hzsNum>0){
                $("#hzsFile").fileinput("upload");
            }else if(psxkzNum>0){
                $("#psxkzFile").fileinput("upload");
            }else if(pwxkzNum>0){
                $("#pwxkzFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	if(type=="update"){
                		window.parent.$("#table").bootstrapTable("refresh");
                	}
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
	$("#yyzzFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/agsupport_swj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForPsh.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"2",pshId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : false, //显示移除按钮
        showCancel: true,
        showClose: false,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 3, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
		initialPreviewAsData: true,
		initialPreview: yyzzPreview,
		initialPreviewConfig:yyzzPreviewConfig,
        //msgFilesTooLess:"你必须选择最少 <b>{n}</b> {files} 来上传！",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        },
        layoutTemplates:{
        	actionUpload:''
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if(hzsNum>0){
                $("#hzsFile").fileinput("upload");
            }else if(psxkzNum>0){
                $("#psxkzFile").fileinput("upload");
            }else if(pwxkzNum>0){
                $("#pwxkzFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	if(type=="update"){
                		window.parent.$("#table").bootstrapTable("refresh");
                	}
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
    $("#hzsFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/agsupport_swj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForPsh.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"3",pshId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : false, //显示移除按钮
        showCancel: true,
        showClose: false,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 3, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
		initialPreviewAsData: true,
		initialPreview: hzsPreview,
		initialPreviewConfig:hzsPreviewConfig,
        //msgFilesTooLess:"你必须选择最少 <b>{n}</b> {files} 来上传！",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        },
        layoutTemplates:{
        	actionUpload:''
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if(psxkzNum>0){
                $("#psxkzFile").fileinput("upload");
            }else if(pwxkzNum>0){
                $("#pwxkzFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	if(type=="update"){
                		window.parent.$("#table").bootstrapTable("refresh");
                	}
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
    $("#psxkzFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/agsupport_swj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForPsh.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"4",pshId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : false, //显示移除按钮
        showClose: false,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 3, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
		initialPreviewAsData: true,
		initialPreview: psxkzPreview,
		initialPreviewConfig:psxkzPreviewConfig,
        //msgFilesTooLess:"你必须选择最少 <b>{n}</b> {files} 来上传！",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        },
        layoutTemplates:{
        	actionUpload:''
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		if(pwxkzNum>0){
                $("#pwxkzFile").fileinput("upload");
            }else{
            	layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000
                }, function () {
                	if(type=="update"){
                		window.parent.$("#table").bootstrapTable("refresh");
                	}
                    window.parent.layer.closeAll();
                });
            }
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
    $("#pwxkzFile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/agsupport_swj/asi/facilitymgr/facilitymgr/uploadfile!uploadFileForPsh.action", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {attType:"5",pshId:id};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : false, //显示移除按钮
        showClose: false,
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 3, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
		initialPreviewAsData: true,
		initialPreview: pwxkzPreview,
		initialPreviewConfig:pwxkzPreviewConfig,
        //msgFilesTooLess:"你必须选择最少 <b>{n}</b> {files} 来上传！",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        },
        layoutTemplates:{
        	actionUpload:''
        }
    }).on('fileerror', function(event, data, msg) {
        alert("上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
        //$("#uploadfile").initFileActions();
    	if(data.response.success){
    		layer.msg('保存成功！', {
                icon: 1,
                time: 2000
            }, function () {
            	if(type=="update"){
            		window.parent.$("#table").bootstrapTable("refresh");
            	}
                window.parent.layer.closeAll();
            });
    	}else{
    		isClick=false;
    		alert("附件上传失败");
    	}
    });
}
function initClick(){
	//工商营业执照
	$("input[name='hasCert1']").click(function(){
       if($(this).val()=="0"){
    	   $(".yyzz").hide();
    	   //$("#yyzz").hide();
       }else{
    	   $(".yyzz").show();
    	   if(id && id!=""){
    		   //$("#yyzz").show();
    	   }
       }
    });
	//接驳意见核准书
	$("input[name='hasCert2']").click(function(){
       if($(this).val()=="0"){
    	   $(".hzs").hide();
    	   //$("#hzs").hide();
       }else{
    	   $(".hzs").show();
    	   if(id && id!=""){
    		   //$("#hzs").show();
    	   }
       }
    });
	//排水许可证
	$("input[name='hasCert3']").click(function(){
       if($(this).val()=="0"){
    	   $(".psxkz").hide();
    	   //$("#psxkz").hide();
       }else{
    	   $(".psxkz").show();
    	   if(id && id!=""){
    		   //$("#psxkz").show();
    	   }
       }
    });
	//排污许可证
	$("input[name='hasCert4']").click(function(){
       if($(this).val()=="0"){
    	   $(".pwxkz").hide();
    	   //$("#pwxkz").hide();
       }else{
    	   $(".pwxkz").show();
    	   if(id && id!=""){
    		   //$("#pwxkz").show();
    	   }
       }
    });
	//隔油池
	$("input[name='fac1']").click(function(){
       if($(this).val()=="无"){
    	   $("#gyc").hide();
       }else{
    	   $("#gyc").show();
       }
    });
	//格栅
	$("input[name='fac2']").click(function(){
       if($(this).val()=="无"){
    	   $("#gs").hide();
       }else{
    	   $("#gs").show();
       }
    });
	//沉淀池
	$("input[name='fac3']").click(function(){
       if($(this).val()=="无"){
    	   $("#cdc").hide();
       }else{
    	   $("#cdc").show();
       }
    });
	//其他预处理设施
	$("input[name='fac4']").click(function(){
       if($(this).val()=="无"){
    	   $("#qtyclss").hide();
       }else{
    	   $("#qtyclss").show();
       }
    });
	//运行情况
	$("input[name$='Cont']").click(function(){
       if($(this).val()=="其他"){
    	   if($(this).attr("name")=="fac1Cont"){
    		   $("#gycYxqk").show();  
    	   }else if($(this).attr("name")=="fac2Cont"){
    		   $("#gsYxqk").show();  
    	   }else if($(this).attr("name")=="fac3Cont"){
    		   $("#cdcYxqk").show();  
    	   }else if($(this).attr("name")=="fac4Cont"){
    		   $("#qtyclssYxqk").show();  
    	   }
    	   
       }else{
    	   if($(this).attr("name")=="fac1Cont"){
    		   $("#gycYxqk").hide();  
    	   }else if($(this).attr("name")=="fac2Cont"){
    		   $("#gsYxqk").hide();  
    	   }else if($(this).attr("name")=="fac3Cont"){
    		   $("#cdcYxqk").hide();  
    	   }else if($(this).attr("name")=="fac4Cont"){
    		   $("#qtyclssYxqk").hide();  
    	   }
       }
    });
}
function reloadData(){
	if(id)
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/psh-discharger!seePsh.action?id='+id,
			dataType:'json',
			async:false,
			success: function(data){
				//接驳井
				if(data.code==200 && data.wells){
					if(data.wells.length>0){
						for(var i in data.wells){
							addWell(null,data.wells[i]);
						}
					}
				}
				//排水户
				if(data.code==200 && data.form){
					//var typeName = data.form.layerName;
					//$("#newlab").html("("+typeName+")");
					$("#sbDiv").show();
					SGuid=data.form.doorplateAddressCode;
					changeHylb(data.form.dischargerType1);
					for(var i in data.form){
						if(i=='markTime' && data.form[i]){
							$("#markTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='checkTime' && data.form[i]){
							$("#checkTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='updateTime' && data.form[i]){
							$("#updateTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='state'){
							//var checkStateView=""
							var state = data.form.state;
							if(state == '1'){
								//checkStateView="未审核";
							}else{
								$("#shDiv").show();
								/*if(state == "2")
									checkStateView="审核通过";
								if(state == "3")
									checkStateView="存在疑问";*/
							}
							//$("#state").val(checkStateView);
						}else if(i=="dischargerType2"){
							if(data.form.dischargerType2.indexOf("其他：") >= 0){
								$("#"+i).val("其他");
								$("#dwlx").show();
								$("#dischargerType3").val(data.form.dischargerType2.substring(3,data.form.dischargerType2.length));
							}else{
								$("#"+i).val(data.form[i]);
							}
						}else if(i=='hasCert1' || i=='hasCert2' ||i=='hasCert3' ||i=='hasCert4'
							|| i.indexOf("fac1") >= 0 || i.indexOf("fac2") >= 0 || i.indexOf("fac3") >= 0 || i.indexOf("fac4") >= 0){
							$(":radio[name='"+i+"'][value='" + data.form[i] + "']").prop("checked", "checked");
							//其他预处理设施有值且不为“无”
							if(i=="fac4" && data.form[i]!=null && data.form[i]!="" && data.form[i]!="无"){
								$(":radio[name='"+i+"'][value='有']").prop("checked", "checked");
								$("#qtyclss").show();
								if(data.form[i]!="有"){
									$("#ssmc").val(data.form[i]);
								}
							}else if(i=="fac1" && data.form[i]=="有"){//有隔油池
								$("#gyc").show();
							}else if(i=="fac2" && data.form[i]=="有"){//有格栅
								$("#gs").show();
							}else if(i=="fac3" && data.form[i]=="有"){//有沉淀池
								$("#cdc").show();
							}
							//运行情况为其他
							if(i=="fac1Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#gycYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac2Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#gsYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac3Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#cdcYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac4Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#qtyclssYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}
						}else{
							$("#"+i).val(data.form[i]);
						}
					}
					//工商营业执照
					if(data.form.hasCert1=="1"){
						$(".yyzz").show();
						//$("#yyzz").show();
						//formatImage(data.yyzz,"yyzz-img-view","yyzz-img-view-cj");
					}
					if(data.yyzz!=null && data.yyzz.length>0){
						for(var i in data.yyzz){
							yyzzPreview.push(data.yyzz[i].attPath);
	            			var config={};
	            			config.caption=data.yyzz[i].attName;
	            			config.size=data.yyzz[i].fileSize;
	            			config.url="/agsupport_swj/sewerage-user-attachment!deleteById.action";
	            			config.key=data.yyzz[i].id;
	            			yyzzPreviewConfig.push(config);
	            		}
						yyzzNumY=data.yyzz.length;
	            		$("#yyzzNum").html(yyzzNumY);
	            		//$("#yyzz").show();
	            		//loadFileList(data.yyzz,"yyzzFileTable");
	            	}
					//接驳意见核准书
					if(data.form.hasCert2=="1"){
						$(".hzs").show();
						//$("#hzs").show();
						//formatImage(data.hzs,"hzs-img-view","hzs-img-view-cj");
					}
					if(data.hzs!=null && data.hzs.length>0){
						for(var i in data.hzs){
							hzsPreview.push(data.hzs[i].attPath);
	            			var config={};
	            			config.caption=data.hzs[i].attName;
	            			config.size=data.hzs[i].fileSize;
	            			config.url="/agsupport_swj/sewerage-user-attachment!deleteById.action";
	            			config.key=data.hzs[i].id;
	            			hzsPreviewConfig.push(config);
	            		}
						hzsNumY=data.hzs.length;
	            		$("#hzsNum").html(hzsNumY);
	            		//$("#yyzz").show();
	            		//loadFileList(data.hzs,"hzsFileTable");
	            	}
					//排水许可证
					if(data.form.hasCert3=="1"){
						$(".psxkz").show();
						//$("#psxkz").show();
						//formatImage(data.psxkz,"psxkz-img-view","psxkz-img-view-cj");
					}
					if(data.psxkz!=null && data.psxkz.length>0){
						for(var i in data.psxkz){
							psxkzPreview.push(data.psxkz[i].attPath);
	            			var config={};
	            			config.caption=data.psxkz[i].attName;
	            			config.size=data.psxkz[i].fileSize;
	            			config.url="/agsupport_swj/sewerage-user-attachment!deleteById.action";
	            			config.key=data.psxkz[i].id;
	            			psxkzPreviewConfig.push(config);
	            		}
						psxkzNumY=data.psxkz.length;
	            		$("#psxkzNum").html(psxkzNumY);
	            		//$("#yyzz").show();
	            		//loadFileList(data.psxkz,"psxkzFileTable");
	            	}
					//排污许可证
					if(data.form.hasCert4=="1"){
						$(".pwxkz").show();
						//$("#pwxkz").show();
						//formatImage(data.pwxkz,"pwxkz-img-view","pwxkz-img-view-cj");
					}
					if(data.pwxkz!=null && data.pwxkz.length>0){
						for(var i in data.pwxkz){
							pwxkzPreview.push(data.pwxkz[i].attPath);
	            			var config={};
	            			config.caption=data.pwxkz[i].attName;
	            			config.size=data.pwxkz[i].fileSize;
	            			config.url="/agsupport_swj/sewerage-user-attachment!deleteById.action";
	            			config.key=data.pwxkz[i].id;
	            			pwxkzPreviewConfig.push(config);
	            		}
						pwxkzNumY=data.pwxkz.length;
	            		$("#pwxkzNum").html(pwxkzNumY);
	            		//$("#yyzz").show();
	            		//loadFileList(data.pwxkz,"pwxkzFileTable");
	            	}
				}
				//现场图片
				if(data.rows!=null && data.rows.length>0){
            		for(var i in data.rows){
            			xctpPreview.push(data.rows[i].attPath);
            			var config={};
            			config.caption=data.rows[i].attName;
            			config.size=data.rows[i].fileSize;
            			config.url="/agsupport_swj/sewerage-user-attachment!deleteById.action";
            			config.key=data.rows[i].id;
            			xctpPreviewConfig.push(config);
            		}
            		xctpNumY=data.rows.length;
            		$("#xctpNum").html(xctpNumY);
            		/*$("#xctp").show();
            		loadFileList(data.rows,"xctpFileTable");*/
            	}
				/*var total=0,imgHtml='',img_view='';
				if(data.code==200 && data.rows && data.rows.length>0){
					for(var i in data.rows){
						var rowData=data.rows[i];
						var timeText,imgUrl,thumPath;
						if(rowData.attTime)
							timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
						if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
							imgUrl = rowData.attPath;
							thumPath=rowData.thumPath;
						}
						if(timeText && imgUrl && thumPath){
							img_view+='<li class="img-view-lack" style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
							' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
							
							total++;
						}
					}
					//$("#lack-img").append(imgHtml);
					
				}else{
					//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
					img_view+='暂无照片';
				}
				$("#img-view").append(img_view);
				
				//执行父页面图片预览初始化
				$(".img-view-lack").click(function(){
					if(parent.initViewer)
						parent.initViewer($("#img-view").parent().html(),"img-view");
					if(parent.parent.initViewer)
						parent.parent.initViewer($("#img-view").parent().html(),"img-view");
					if(parent.viewer){
						parent.viewer.show($(this).index());
					}else if(parent.parent.viewer){
						parent.parent.viewer.show($(this).index());
					}else{
						layer.msg("未检测到图片插件!",{icon: 2});
					}
				});*/
			},error:function(){ }
		});
	
}

//初始化时间
function loadTime(){
	/*$("#markTime").datetimepicker({
		language:  'zh-CN',
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
  	});*/
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
function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}
function getImgNum(value){
	if(isArray(value)){
		return value.length;
	}else{
		return 0;
	}
}
function save() {
	if(!isClick){
		//校验
		var xctp=$("#xctpFileTable").bootstrapTable('getData');
		var yyzz=$("#yyzzFileTable").bootstrapTable('getData');
		var hzs=$("#hzsFileTable").bootstrapTable('getData');
		var psxkz=$("#psxkzFileTable").bootstrapTable('getData');
		var pwxkz=$("#pwxkzFileTable").bootstrapTable('getData');
		if(xctpNum+xctpNumY<2){
			layer.msg('现场图片不能为空,且最少两张', {icon: 7});
			return;
		}else if($("#name").val() == ""){
			layer.msg('排水户名称不能为空', {icon: 7});
			return;
		}else if($("#town").val() == ""){
			layer.msg('所属镇(街)不能为空', {icon: 7});
			return;
		}else if($("#mph").val() == ""){
			layer.msg('门牌号不能为空', {icon: 7});
			return;
		}else if($("#addr").val() == ""){
			layer.msg('详细地址不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert1"]:checked').val()=="1" && $("#cert1Code").val() == ""){
			layer.msg('营业执照编码不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert1"]:checked').val()=="1" && yyzzNum+yyzzNumY<1){
			layer.msg('营业执照图片不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert2"]:checked').val()=="1" && hzsNum+hzsNumY<1 ){
			layer.msg('核准书图片不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert3"]:checked').val()=="1" && $("#cert3Code").val() == ""){
			layer.msg('排水许可证编码不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert3"]:checked').val()=="1" && psxkzNum+psxkzNumY<1 ){
			layer.msg('排水许可证图片不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert4"]:checked').val()=="1" && $("#cert4Code").val() == ""){
			layer.msg('排污许可证编码不能为空', {icon: 7});
			return;
		}else if($('input[name="hasCert4"]:checked').val()=="1" && pwxkzNum+pwxkzNumY<1 ){
			layer.msg('排污许可证图片不能为空', {icon: 7});
			return;
		}else if($("#dischargerType1").val() == ""){
			layer.msg('污水类别不能为空', {icon: 7});
			return;
		}else if($("#dischargerType2").val() == ""){
			layer.msg('单位类型不能为空', {icon: 7});
			return;
		}else if($("#dischargerType2").val() == "其他" && $("#dischargerType3").val()==""){
			layer.msg('单位类型-其他不能为空', {icon: 7});
			return;
		}else if($('input[name="fac1"]:checked').val()=="有" && $('input[name="fac1Cont"]:checked').val() == undefined){
			layer.msg('隔油池运行情况不能为空', {icon: 7});
			return;
		}else if($('input[name="fac1"]:checked').val()=="有" && $('input[name="fac1Cont"]:checked').val() == "其他" && $("#fac1Cont").val()==""){
			layer.msg('隔油池运行情况-其他不能为空', {icon: 7});
			return;
		}else if($('input[name="fac1"]:checked').val()=="有" && $('input[name="fac1Main"]:checked').val() == undefined){
			layer.msg('隔油池是否进行养护不能为空', {icon: 7});
			return;
		}else if($('input[name="fac1"]:checked').val()=="有" && $('input[name="fac1Record"]:checked').val() == undefined){
			layer.msg('隔油池养护记录与台账不能为空', {icon: 7});
			return;
		}else if($('input[name="fac2"]:checked').val()=="有" && $('input[name="fac2Cont"]:checked').val() == undefined){
			layer.msg('格栅运行情况不能为空', {icon: 7});
			return;
		}else if($('input[name="fac2"]:checked').val()=="有" && $('input[name="fac2Cont"]:checked').val() == "其他" && $("#fac2Cont").val()==""){
			layer.msg('格栅运行情况-其他不能为空', {icon: 7});
			return;
		}else if($('input[name="fac2"]:checked').val()=="有" && $('input[name="fac2Main"]:checked').val() == undefined){
			layer.msg('格栅是否进行养护不能为空', {icon: 7});
			return;
		}else if($('input[name="fac2"]:checked').val()=="有" && $('input[name="fac2Record"]:checked').val() == undefined){
			layer.msg('格栅养护记录与台账不能为空', {icon: 7});
			return;
		}else if($('input[name="fac3"]:checked').val()=="有" && $('input[name="fac3Cont"]:checked').val() == undefined){
			layer.msg('沉淀池运行情况不能为空', {icon: 7});
			return;
		}else if($('input[name="fac3"]:checked').val()=="有" && $('input[name="fac3Cont"]:checked').val() == "其他" && $("#fac3Cont").val()==""){
			layer.msg('沉淀池运行情况-其他不能为空', {icon: 7});
			return;
		}else if($('input[name="fac3"]:checked').val()=="有" && $('input[name="fac3Main"]:checked').val() == undefined){
			layer.msg('沉淀池是否进行养护不能为空', {icon: 7});
			return;
		}else if($('input[name="fac3"]:checked').val()=="有" && $('input[name="fac3Record"]:checked').val() == undefined){
			layer.msg('沉淀池养护记录与台账不能为空', {icon: 7});
			return;
		}else if($('input[name="fac4"]:checked').val()=="有" && $('#ssmc').val() == ""){
			layer.msg('设施名称不能为空', {icon: 7});
			return;
		}else if($('input[name="fac4"]:checked').val()=="有" && $('input[name="fac4Cont"]:checked').val() == undefined){
			layer.msg('其他预处理设施运行情况不能为空', {icon: 7});
			return;
		}else if($('input[name="fac4"]:checked').val()=="有" && $('input[name="fac4Cont"]:checked').val() == "其他" && $("#fac4Cont").val()==""){
			layer.msg('其他预处理设施运行情况-其他不能为空', {icon: 7});
			return;
		}else if($('input[name="fac4"]:checked').val()=="有" && $('input[name="fac4Main"]:checked').val() == undefined){
			layer.msg('其他预处理设施是否进行养护不能为空', {icon: 7});
			return;
		}else if($('input[name="fac4"]:checked').val()=="有" && $('input[name="fac4Record"]:checked').val() == undefined){
			layer.msg('其他预处理设施养护记录与台账不能为空', {icon: 7});
			return;
		}
		var flag1 = $("#jbqk").valid();
		//var flag2 = $("#hylb").valid();
		//var flag3 = $("#jbqk2").valid();
		//var flag4 = $("#yclss").valid();
		if(flag1){
			isClick=true;
			//获取表单值
			var data1 = $("#jbqk").serializeObject();
			var data2 = $("#hylb").serializeObject();
			var data4 = $("#yclss").serializeObject();
			if(data1.hasCert1!="1"){
				data1.cert1Code="";
				$("#yyzzFile").val("");
			}if(data1.hasCert2!="1"){
				$("#hzsFile").val("");
			}
			if(data1.hasCert3!="1"){
				data1.cert3Code="";
				$("#psxkzFile").val("");
			}
			if(data1.hasCert4!="1"){
				data1.cert4Code="";
				$("#pwxkzFile").val("");
			}
			if(data2.dischargerType2=="其他"){
				data2.dischargerType2="其他："+$("#dischargerType3").val();
			}
			if(data4.fac1!="有"){
				data4.fac1Cont="";
				data4.fac1Main="";
				data4.fac1Record="";
			}
			if(data4.fac2!="有"){
				data4.fac2Cont="";
				data4.fac2Main="";
				data4.fac2Record="";
			}
			if(data4.fac3!="有"){
				data4.fac3Cont="";
				data4.fac3Main="";
				data4.fac3Record="";
			}
			if(data4.fac4!="有"){
				data4.fac4Cont="";
				data4.fac4Main="";
				data4.fac4Record="";
			}else{
				data4.fac4=data4.ssmc;
			}
			if(data4.fac1Cont=="其他"){
				if(data4.Cont1!=""){
					data4.fac1Cont=data4.Cont1;
				}
			}
			if(data4.fac2Cont=="其他"){
				if(data4.Cont2!=""){
					data4.fac2Cont=data4.Cont2;
				}
			}
			if(data4.fac3Cont=="其他"){
				if(data4.Cont3!=""){
					data4.fac3Cont=data4.Cont3;
				}
			}
			if(data4.fac4Cont=="其他"){
				if(data4.Cont4!=""){
					data4.fac4Cont=data4.Cont4;
				}
			}
			 var data={};
			 for(var attr in data1){
				 data[attr]=data1[attr];
			 }
			 for(var attr in data2){
				 data[attr]=data2[attr];
			 }
			 for(var attr in data4){
				 data[attr]=data4[attr];
			 }
			 if(wellData.length>0){
				 data.wellBeen=JSON.stringify(wellData);
			 }
			 data.deletewellBeen=deletewellBeen;
			$.ajax({
	            type: 'post',
	            url: "/agsupport_swj/psh-discharger!addRow.action",
	            data: data,
	            dataType: 'json',
	            success: function (result) {
	                if (result.success) {
	                	id=result.id;
	                	$("#id").val(id);
	                    if(xctpNum>0){
	                        $("#xctpFile").fileinput("upload");
	                    }else if(yyzzNum>0){
	                        $("#yyzzFile").fileinput("upload");
	                    }else if(hzsNum>0){
	                        $("#hzsFile").fileinput("upload");
	                    }else if(psxkzNum>0){
	                        $("#psxkzFile").fileinput("upload");
	                    }else if(pwxkzNum>0){
	                        $("#pwxkzFile").fileinput("upload");
	                    }else{
	                        layer.msg('保存成功！', {
	                            icon: 1,
	                            time: 2000
	                        }, function () {
	                        	if(type=="update"){
	                        		window.parent.$("#table").bootstrapTable("refresh");
	                        	}
	                            window.parent.layer.closeAll();
	                        });
	                    }
	                }else{
	                	isClick=false;
	                	layer.msg('保存失败！', {
	                        icon: 1,
	                        time: 2000
	                    });
	                }
	            }
	        })
		}
	}
	
}
//接驳井修改与删除
function well_click(index){
	for(var i = 0; i <wellData.length; i++){
		if(wellData[i].wellIndex==index){
			wellDateNow=wellData[i];
			layer.open({
				type: 2,
				area: ['850px', '450px'],
				title : "接驳井修改",	
				maxmin: true,
				btn:['保存','删除','取消'],
				content: ['/awater_swj/psh/psh_lr/pshWellInput.html?type=update&SGuid='+SGuid, 'yes'],
				btn1: function(index,layero){
					$(layero).find("iframe")[0].contentWindow.save();
		   		},
		   		btn2: function(index2,layero){
		   			$("#"+index).remove();
		   			if(wellData[i].id && wellData[i].id!=""){
		   				if(deletewellBeen==""){
		   					deletewellBeen=wellData[i].id;
		   				}else{
		   					deletewellBeen+=","+wellData[i].id;
		   				}
		   			}
		   			wellData.splice(i,1);
		   			layer.close(index2);
		   		},success: function(layero){
				    //layero.find('.layui-layer-min').hide();
				    layero.find('.layui-layer-btn1')[0].style.color="black";
				    layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#fb4a4a";
				}
			});
			break;
		}
	}
}
//js暂时保存接驳井
function addWell(ydata,data){
	var htmls='<div class="wells" onclick="well_click(this.id)" style="text-align: center;" id="well'+wellIndex+'">';
	var html='<div class="form-group"><p style="font-size:16px;font-weight:500">'+data.pipeType;
	if(data.wellId && data.wellId!=""){
		html+='('+data.wellId+')'
	}
	html+='</p></div>';
	html+='<div class="form-group"><p>'+data.wellType+' | '+data.wellDir+'</p></div>';
	if(data.wellPro!=""){
		html+='<div class="form-group"><p>'+'井存在的问题:'+data.wellPro+'</p></div>';
	}
	if(data.drainPro!="####"){
		var drainPro="";
		if(data.drainPro.indexOf("#")>=0){
			var drainPros=data.drainPro.split("#");
			for( var i = 0; i <drainPros.length; i++){
				if(drainPros[i]!=""){
					drainPro+="、"+drainPros[i];
				}
			}
		}
		drainPro=drainPro.substring(1,drainPro.length);
		html+='<div class="form-group"><p>'+'排水存在的问题:'+drainPro+'</p></div>';
	}
	html+='<hr style="height:1px;border:none;border-top:1px solid #555555;" />';
	htmls+=html+'</div>';
	if(data.wellIndex && data.wellIndex!=""){//修改接驳井
		for(i in wellData){
			if(data.wellIndex==wellData[i].wellIndex){
				wellData[i]=data;
				break;
			}
		}
		$("#"+data.wellIndex).html(html);
	}else{//新增接驳井
		data.wellIndex="well"+wellIndex;
		wellData.push(data);
		$("#jbqkForm").prepend(htmls);
		wellIndex++;
	}
}
//新增接驳井
function addWellShow(){
	layer.open({
		type: 2,
		area: ['850px', '450px'],
		title : "接驳井新增",	
		maxmin: true,
		btn:['保存','取消'],
		content: ['/awater_swj/psh/psh_lr/pshWellInput.html?type=add&SGuid='+SGuid, 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.save();
   		}
	});
}
// 审核记录
function checkRecord(){
	if(id){
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/check-record!searchCheckRecord.action?reportType=add&reportId='+id,
			dataType:'json',
			success: function(data){
				console.log(data);
				if(data.code==200 && data.rows){
					var length = data.rows.length;
					if(length <2){
						parent.layer.alert("没有历史审核意见！");
						return ;
					}
					$("#sendForm").html("");
					var HtmlText = [];
				   HtmlText.push('<table class="table"> <thead>');
				   HtmlText.push('<tr> <th width=15%>审核人</th><th width=15%>审核时间</th><th width=14%>审核状态</th><th width=56%>审核意见</th></tr> ');
				   HtmlText.push('</thead><tbody>');
					for(var i in data.rows){
						var d=data.rows[i].checkTime;
						var t =d.time;
						var newDate = new Date();
						newDate.setTime(t);
						var formatDate = newDate.format('yyyy-MM-dd h:m:s');
						var checkState = data.rows[i].checkState;
						var checkStateView = "";
						if(checkState == 2){
							checkStateView = "审核通过";
						}else if(checkState == 3){
							checkStateView = "存在疑问";
						}
						HtmlText.push('<tr> <td>'+data.rows[i].checkPerson+'</td><td class="form_datetime">'+formatDate +'</td><td>'+checkStateView+'</td><td>'+data.rows[i].checkDesription+'</td></tr>');
					}
					HtmlText.push('</tbody></table>');
					 $("#sendForm").html(HtmlText.join(""));
					$("#sendModal").modal();
				}else{
					parent.layer.alert("没有历史审核意见！");
				}
				
			},error:function(){ }
		});
	}
}
//格式化营业执照、接驳意见核准书、排水许可证、排污许可证图片
function formatImage(data,idd,classs){
	var total=0,imgHtml='',img_view='';
	for(var i in data){
		var rowData=data[i];
		var timeText,imgUrl,thumPath;
		if(rowData.attTime)
			timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
		if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
			imgUrl = rowData.attPath;
			thumPath=rowData.thumPath;
		}
		if(timeText && imgUrl && thumPath){
			img_view+='<li class="'+classs+'" style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
			' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
			
			total++;
		}
	}
		
	$("#"+idd).append(img_view);
	
	//执行父页面图片预览初始化
	$("."+classs).click(function(){
		if(parent.initViewer)
			parent.initViewer($("#"+idd).parent().html(),idd);
		if(parent.parent.initViewer)
			parent.parent.initViewer($("#"+idd).parent().html(),idd);
		if(parent.viewer){
			parent.viewer.show($(this).index());
		}else if(parent.parent.viewer){
			parent.parent.viewer.show($(this).index());
		}else{
			layer.msg("未检测到图片插件!",{icon: 2});
		}
	});
}
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