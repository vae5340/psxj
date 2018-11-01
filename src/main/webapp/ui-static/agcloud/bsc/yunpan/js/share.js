$(function () {
    //执行绑定事件
    bingGlobalAction();
    //加载个人上传的所有文件数据
    loadShareData();
});
var join = ",";
function bingGlobalAction() {
    //绑定上面工具栏，下载按钮功能，批量下载
    $("#multiDownload").click(function () {
        doDownload(1);//暂时只支持文件批量下载，不支持文件夹的批量下载
    });
    //绑定返回上一级目录事件
    $("#backToLast").click(function () {
        backToLast();
    });
    //绑定全部文件事件
    $("#allFiles").click(function () {
        dirId = "";//置空默认到 根目录
        function temp() {
            $(".allFile").removeClass("hide");
            $(".weizhi").addClass("hide");
        }
        loadShareData(temp);
    });
    //绑定查询按钮事件
    $("#search").click(function () {
        globalSearch();
    });
    //绑定回车查询事件
    $("#searchKey").bind('keypress', function(event) {
        if (event.keyCode == "13") {
            event.preventDefault();
            //回车执行查询
            globalSearch();
        }
    });
}
//加载个人的目录文件列表
function loadShareData(callback) {
    var url = ctx + "/share/loadShareData";
    //调试中，参数暂时写死
    var params = {
        userId:userId,
        isOwner:isOwner,
        dirId:dirId
    };
    $.post(url,params,function (data) {
        var data = JSON.parse(data);
        if(data == null || data.length == 0){
            $("#fileDirTable").find("tbody").empty();
            return;
        }
        var dirs = data["dirs"];
        var files = data["files"];
        var tbody = "";
        for(var i in dirs){
            var dir = dirs[i];
            tbody += '<tr>'+
                '<td class="name">' +
                '<input type="checkbox" data-type="dir" data-key="'+ dir.id +'"/>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/wjj.png" class="fileIcon" /><span class="itemName pointer">'+ dir.name +'</span>' +
                '<span class="editName hide">' +
                '<input type="text" class="editItem"/>' +
                '<span>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/close.png" class="pointer editCancel" />' +
                '</span>' +
                '</span>' +
                '<span class="wjj-tool hide" data-type="dir" data-key="'+ dir.id +'">' +
                '</span>' +
                '</td>' +
                '<td class="size">-</td>' +
                '<td class="shareTime">' + dir.shareTime + '</td>' +
                '</tr>';
        }
        for(var i in files){
            var file = files[i];
            tbody += '<tr>'+
                '<td class="name">' +
                '<input type="checkbox" data-type="file" data-key="'+ file.id +'"/>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/qbwj.png" class="fileIcon"/><span class="itemName pointer">'+ file.fileName +'</span>' +
                '<span class="editName hide">' +
                '<input type="text" class="editItem"/>' +
                '<span>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/close.png" class="pointer editCancel" />' +
                '</span>' +
                '</span>' +
                '<span class="wjj-tool hide" data-type="file" data-key="'+ file.id +'">' +
                '</span>' +
                '</td>' +
                '<td class="size">'+ formatSize(file.fileSize) +'</td>' +
                '<td class="shareTime">' + file.shareTime + '</td>' +
                '</tr>';
        }
        $("#fileDirTable").find("tbody").empty();
        $("#fileDirTable").find("tbody").append(tbody);
        $("#checkAll").attr("checked",false);
        $(".dir").addClass("hide");
        bindingAction();
        if(callback){
            callback();
        }
    });
}
//搜索文件列表
function globalSearch(type,callback) {
    var url = ctx + "/share/search";
    var key = $("#searchKey").val();
    var params = {
        userId:userId,
        key:key,
        isOwner:isOwner
    };
    $.post(url,params,function (data) {
        var files = JSON.parse(data);
        if(files == null || files.length == 0){
            $("#fileDirTable").find("tbody").empty();
            return;
        }
        var tbody = "";
        for(var i in files){
            var file = files[i];
            tbody += '<tr>'+
                '<td class="name">' +
                '<input type="checkbox" data-type="file" data-key="'+ file.id +'"/>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/qbwj.png" class="fileIcon"/><span class="itemName pointer">'+ file.fileName +'</span>' +
                '<span class="editName hide">' +
                '<input type="text" class="editItem"/>' +
                '<span>' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                '<img src="' + ctx + '/agcom/ui/sc/yunpan/img/close.png" class="pointer editCancel" />' +
                '</span>' +
                '</span>' +
                '<span class="wjj-tool hide" data-type="file" data-key="'+ file.id +'">' +
                '</span>' +
                '</td>' +
                '<td class="size">'+ formatSize(file.fileSize) +'</td>' +
                '<td class="shareTime">' + file.shareTime + '</td>' +
                '<td class="dir"><a href="#" class="toDir" data-key="'+ file.dirId +'">' + file.md5Key + '</a></td>' +
                '</tr>';
        }
        $("#fileDirTable").find("tbody").empty();
        $("#fileDirTable").find("tbody").append(tbody);
        $("#checkAll").attr("checked",false);
        $(".allFile").removeClass("hide");
        $(".weizhi").addClass("hide");
        $(".dir").removeClass("hide");
        $(".toDir").click(function () {
            var key = $(this).attr("data-key");
            doEnterDir(key);
        });
        bindingAction();
        if(callback){
            callback();
        }
    });
}
//格式化文件大小
function formatSize(size){
    var unit = 1024;
    var unit1 = unit * unit;
    var unit2 = unit1 * unit;
    var unit3 = unit2 * unit;
    var result;
    if(size >= unit && size < unit1){
        result = (size / unit).toFixed(1) + "KB";
    }else if(size >= unit1 && size < unit2){
        result = (size / unit1).toFixed(1) + "MB";
    }else if(size >= unit2 && size < unit3){
        result = (size / unit2).toFixed(1) + "GB";
    }else if(size >= unit3){
        result = (size / unit3).toFixed(1) + "TB";
    }else{
        result = size + "B";
    }
    return result;
}
//绑定表格中的各个事件
function bindingAction() {
    //绑定tr相关事件，悬浮显示工具栏
    $("#fileDirTable").find("tr").each(function () {
        //悬浮显示工具栏
        $(this).mouseover(function () {
            $(this).find(".wjj-tool").removeClass("hide");
            $(this).find(".wjj-tool").show();
        });
        $(this).mouseout(function () {
            $(this).find(".wjj-tool").hide();
        });
    });
    //绑定checkbox的事件
    $("#checkAll").on('click',function () {
        var flag = false;
        if($(this).is(':checked')){
            flag = true;
        }
        $("#fileDirTable tbody").find('input:checkbox').each(function () {
            $(this).prop('checked',flag);//此处不要用attr方法，会点击后失效
        });
    });
    //绑定表格中下载按钮功能
    $(".download").on('click',function () {
        var parent = $(this).parent("span");
        var key = parent.attr("data-key");
        var type = parent.attr("data-type");
        if("file" == type){
            doDownload(0,key);
        }else{
            doDownload(2,key);//暂时没做
        }
    });
    //绑定文件夹\文件点击事件
    $(".itemName").on('click',function () {
        var $input = $(this).siblings('input[type=checkbox]');
        var type = $input.attr("data-type");
        var id = $input.attr("data-key");
        if("dir" == type){
            //进入文件夹
            doEnterDir(id);
        }else{
            //获取文件，预览操作，暂时不做

        }
    })
    $('input[type=checkbox]').click(function (e) {
        e.stopPropagation();
    })
    $("#fileDirTable").find("tbody tr").on('click',function () {
        var $input = $(this).find('input[type=checkbox]');
        var flag = $input.prop("checked");
        $input.prop('checked',!flag);
    })
}
//处理下载,0 是根据 每一行的点击下载按钮进行下载， 1 是根据勾选的文件批量下载， 2 是单个文件夹下载， 3 是多个文件夹下载
function doDownload(type,key) {
    if(type == 0){
        var url = ctx + "/share/download?fileId=" + key;
        window.location.href = url;
    }else if(type == 1){
        var fileIds = getCheckedFiles();
        var dirIds = getCheckedDirs();
        if(dirIds.length > 0){
            alert("只支持批量文件下载，不支持文件夹下载");
            return;
        }
        if(fileIds.length > 0){
            var fileIdsStr = fileIds.join(join);
            var url = ctx + "/share/multiDownload?fileIds=" + fileIdsStr;
            window.location.href = url;
        }else{
            alert("请勾选要下载的文件");
        }
    }else if(type == 2){
        alert("文件夹下载 暂时未开发");
    }else{
        alert("文件夹批量下载 暂时未开发");
    }
}
//获取勾选的文件
function getCheckedFiles() {
    var filesId = [];//文件key列表
    $("#fileDirTable tbody").find('input:checkbox').each(function () {
        if($(this).is(':checked') && "file" == $(this).attr("data-type")){
            var key = $(this).attr("data-key");
            filesId.push(key);
        }
    });
    return filesId;
}
//获取勾选的文件夹
function getCheckedDirs() {
    var dirsId = [];//文件key列表
    $("#fileDirTable tbody").find('input:checkbox').each(function () {
        if($(this).is(':checked') && "dir" == $(this).attr("data-type")){
            var key = $(this).attr("data-key");
            dirsId.push(key);
        }
    });
    return dirsId;
}
//进入目录接口
function doEnterDir(id) {
    dirId = id;//记录当前目录id
    var url = ctx + "/share/getDir";
    $.ajax({
        url:url,
        data:{dirId:id},
        type:'POST',
        dataType:"json",
        success: function (data) {
            function innerFunc() {
                $(".allFile").addClass("hide");
                $(".weizhi").removeClass("hide");
                $("#dirXpath").empty();
                var xpath = data.xpath.split("/");//注意：第一个 元素是空的 干掉
                xpath.shift();
                var dirSeq = data.dirSeq.split(",").reverse();
                var dirPath = '';
                for(var i=1; i<dirSeq.length; i++){
                    if(i == dirSeq.length -1){
                        dirPath += '<span> > '+ xpath[i] +'</span>'
                    }else{
                        dirPath += '<a href="#" class="dirItem" id="' + dirSeq[i] + '"> > '+ xpath[i] +'</a>'
                    }
                }
                $("#dirXpath").append(dirPath);
                //点击任意目录路径的事件
                $(".dirItem").click(function () {
                    dirId = $(this)[0].id;
                    doEnterDir(dirId);
                });
            }
            //如果当前目录是 根目录则 不再显示路径和返回按钮
            if(data.name == "root"){
                loadShareData();
            }else{
                loadShareData(innerFunc);
            }
        },
        error : function (status) {
            alert("进入目录失败！");
        }
    });
}
//返回上一级目录
function backToLast() {
    var url = ctx + "/share/getDir";
    $.ajax({
        url:url,
        data:{dirId:dirId},
        type:'POST',
        dataType:"json",
        success: function (data) {
            dirId = data.parentId;
            var dirSeq = data.dirSeq.split(",");
            if(dirId == dirSeq[dirSeq.length - 1]){
                function temp() {
                    $(".allFile").removeClass("hide");
                    $(".weizhi").addClass("hide");
                }
                loadShareData(temp);
            }else{
                loadShareData();
            }
        },
        error : function (status) {
            alert("返回上级目录失败！");
        }
    });
}