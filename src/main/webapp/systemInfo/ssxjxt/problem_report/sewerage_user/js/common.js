//页面共性操作相关的脚本

function dateInit(n){
    $(n).datepicker({
        autoclose: true,//选中之后自动隐藏日期选择框
        clearBtn: true,//清除按钮
        todayBtn: true,//今日按钮
        showMeridian:true,
        format: "yyyy-mm-dd"//日期格式
    });
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function downloadFile(sysFileId) {
    var url = "/psxj/sewerage-user-attachment!downloadFile.action?id="+sysFileId;
    window.location.href=url;
}

function deleteFile(sysFileId,type) {
    var url = "/psxj/sewerage-user-attachment!deleteById.action";
    layer.confirm('是否确定删除该文件？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: 'post',
            url: url,
            data:{"id":sysFileId},
            dataType: 'json',
            success: function (result) {
                if (result.success) {
                    layer.msg('删除成功！', {
                        icon: 1,
                        time: 2000
                    });
                    refreshFilelist(type);
                }else {
                    layer.msg('删除失败！', {
                        icon: 2,
                        time: 2000
                    });
                }

            }
        })
    },function(){
        return;
    });
}

function refreshFilelist(type){
    $.ajax({
        type:'post',
        url:"/psxj/sewerage-user-attachment!getByTypeAndSewerageUserId.action",
        data:{attType:type,sewerageUserId:id},
        dataType:'json',
        success: function (result) {
        	/*if(result==null || result.length==0){
        		$("#"+type).hide();
        	}*/
            $("#"+type).bootstrapTable("destroy");
            var fileData = result;
            var total=0;
            var imgs='<ul id="img-view-ul">';
            for (var i in fileData) {
                fileData[i].opt = '<button type="button" class="btn btn-primary btn-sm" onclick="downloadFile(\'' + fileData[i].sysFileId + '\')">' + '下载' + '</button>' + '   <button type="button" class="btn btn-primary btn-sm" onclick="deleteFile(\'' + fileData[i].sysFileId +'\',\''+ type+'\')">' + '删除' + '</button>';
                imgs+='<li class="img-view-li"><img data-original="'+fileData[i].filePath+'"' +
 		       ' src="'+fileData[i].filePath+'" alt="附件'+(total+1)+'" width=80 height=80 style="cursor:pointer;"></li>';
                fileData[i].filePath ='<ul  class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px"><li class="img-view-li" id="'+total+'"><img data-original="'+fileData[i].filePath+'"' +
					' src="'+fileData[i].filePath+'" alt="附件'+(total+1)+'" width=80 height=80 style="cursor:pointer;"></li></ul>';
                total++;
            }
            imgs+='/ul';
            $("#"+type).bootstrapTable({
                columns: [{
                    field: 'sysFileId',
                    visible: false
                }, {
                    field: 'fileName',
                    title: '名称',
                    align: 'center'
                }, {
                    field: 'filePath',
                    title: '附件',
                    align:'center'
                }, {
                    field: 'cdt',
                    title: '创建时间',
                    align: 'center'
                }, {
                    field: 'opt',
                    title: '操作',
                    align: 'center'
                }]
            });
            $("#"+type).bootstrapTable('load', fileData);
          //执行父页面图片预览初始化
            if(parent.initViewer)
    			parent.initViewer(imgs,"img-view-ul");
    		if(parent.parent.initViewer)
    			parent.parent.initViewer(imgs,"img-view-ul");
    		$(".img-view-li").click(function(){
    			if(parent.viewer){
    				parent.viewer.show($(this).attr("id"));
    			}else if(parent.parent.viewer){
    				parent.parent.viewer.show($(this).attr("id"));
    			}else{
    				layer.msg("未检测到图片插件!",{icon: 2});
    			}
    		});
            $('.fixed-table-loading').hide();
        }
    })
}
function loadFileList(fileData,type){
    if(fileData != null && fileData != undefined){
    	var total=0;
    	var imgs='<ul id="img-view-ul">';
        for(var i in fileData){
            fileData[i].opt = '<button type="button" class="btn btn-primary btn-sm" onclick="downloadFile(\''+fileData[i].sysFileId+'\')">'+'下载'+'</button>'+'   <button type="button" class="btn btn-primary btn-sm" onclick="deleteFile(\''+fileData[i].sysFileId+'\',\''+ type+'\')">'+'删除'+'</button>';
            imgs+='<li class="img-view-li"><img data-original="'+fileData[i].filePath+'"' +
		       ' src="'+fileData[i].filePath+'" alt="附件'+(total+1)+'" width=60 height=60 style="cursor:pointer;"></li>';
            fileData[i].filePath ='<ul  class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px"><li class="img-view-li" id="'+total+'"><img data-original="'+fileData[i].filePath+'"' +
            						' src="'+fileData[i].filePath+'" alt="附件'+(total+1)+'" width=60 height=60 style="cursor:pointer;"></li></ul>';
            total++;
        }
        imgs+='/ul';
        $("#"+type).bootstrapTable({
            columns: [{
                field: 'sysFileId',
                visible: false
            }, {
                field: 'fileName',
                title: '名称',
                align: 'center'
            }, {
                field: 'filePath',
                title: '附件',
                align:'center'
            }, {
                field: 'cdt',
                title: '创建时间',
                align:'center'
            }, {
                field: 'opt',
                title: '操作',
                align:'center'
            }]
        });
        $("#"+type).bootstrapTable('load',fileData);
        //执行父页面图片预览初始化
        if(parent.initViewer)
			parent.initViewer(imgs,"img-view-ul");
		if(parent.parent.initViewer)
			parent.parent.initViewer(imgs,"img-view-ul");
		$(".img-view-li").click(function(){
			if(parent.viewer){
				parent.viewer.show($(this).attr("id"));
			}else if(parent.parent.viewer){
				parent.parent.viewer.show($(this).attr("id"));
			}else{
				layer.msg("未检测到图片插件!",{icon: 2});
			}
		});
        $('.fixed-table-loading').hide();
    }
}

function validaterules(field) {
    var str = "";
    if (field.editflag == 0) {
        str += " readonly ";
    }
    if (field.nullflag == 0 || field.relatedfieldflag == 1) {
        str += " required ";
    }
    if (field.datatypelength != null && field.datatypelength != undefined && field.datatypelength != "") {
        str += " maxlength='"+field.datatypelength+"'";
    }
    return str;
}