var ADMIN_ATT_URL = ctx + "/bsc/att/admin";
var COMMON_ATT_URL = ctx + "/me/bsc/att";

//业务附件上传参数
var tableName = parent._tableName;
var pkName = parent._pkName;
var recordIds = parent.recordIds?parent.recordIds:"";//用于附件查询
var recordId = parent.taskId;//用于附件上传

//开关
var btnDisable = parent.btnDisable?parent.btnDisable:false;//按钮链接是否可以点

var checkDirInput = function(id){
    return isCommon?'':'<input type="checkbox" data-type="dir" data-key="'+ id +'" />';
}
var reNameBtn = isCommon?'':'<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/gd.png" class="pointer rename" title="重命名"/>';
var showCreateTime = function (date) {
    return isCommon?'':'<td class="uploadTime">' + custDateFormat(date) + '</td>';
}

var maxlen = 100;//名称超过最大长度截取
var cutDateStr = false;//是否只显示日期
$(function () {
    var textlength = $('#text-td').width() - 90;
    maxlen = textlength/12;
    cutDateStr = $('#modifyTime-td').width() < 125;
    bingGlobalAction();//执行绑定事件
    loadPersonData();//加载文件夹下子文件和文件
});
    var fileList = [];
    var lastDirId = [];
    var inputFiles;//输入框的选择后的 文件对象
    var currentIndex = 0;//用于每次解析文件md5Key时，记录解析到第几个。
    var currentFileLength = 0;//用于每次解析文件md5Key时，记录当前文件集的长度用于判断是否该执行上传检查方法了。
    var join = ",";
    //绑定相关全局事件
    function bingGlobalAction() {
        if(btnDisable){
            return;
        }
        //绑定选择文件按钮事件
        var el = document.getElementById('uploadDo');
        el.addEventListener('change',uploadChange , false);

        //绑定上传按钮的点击事件
        var el = document.getElementById('upload');
        if(el){
            el.addEventListener('click', uploadClick, false);
        }


        //绑定上面工具栏，下载按钮功能，批量下载
        $("#multiDownload").click(function () {
            doDownload(1);//暂时只支持文件批量下载，不支持文件夹的批量下载
        });
        //绑定上面工具栏，删除按钮功能，批量删除，文件删除和文件夹删除区别对待
        $("#remove").click(function () {
            doRemove();
        });
        //绑定创建目录事件
        $("#createDir").click(function () {
            createDir();
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
            loadPersonData(temp);
        });
        $("#allFiles-two").click(function () {
            dirId = "";//置空默认到 根目录
            function temp() {
                $(".allFile").removeClass("hide");
                $(".weizhi").addClass("hide");
                $("#allFiles-two").addClass("hide");
            }
            loadPersonData(temp);
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
        //绑定查询按钮事件
        /*$("#share").click(function () {
            doShare();
        });*/
        if(simplePage){
            $(".simplePage").hide();
        }
    }

    //解析文件内容，生成md5 key
    function readAndParse(file,callback) {
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 2097152,  // Read in chunks of 2MB 缓冲区
            chunks = Math.ceil(file.size / chunkSize),// 循环读取次数
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),//md5解析器
            fileReader = new FileReader();//文件流读取器

        fileReader.onload = function (e) {
            // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
            spark.append(e.target.result);                   // Append array buffer
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                // console.log('finished loading');
                //生成文件流对应的 md5 key
                var md5Str = spark.end();
                // console.info('computed hash', md5Str);  // Compute hash
                //解析完成  调用回调函数
                if(callback){
                    var data = {
                        messageDigest:md5Str,
                        attName:file.name,
                        attSize:file.size,
                        lastModified:file.lastModified
                    };
                    callback(data,file);
                }
            }
        };
        fileReader.onerror = function () {
            console.warn('oops, something went wrong.');
        };
        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    }

    //上传按钮触发真正的文件选择按钮事件
    function uploadClick() {
        var node = document.getElementById('uploadDo');
        node.click();
    }

    //选择文件按钮的点击事件
    function uploadChange() {
        showWait("正在解析文件信息，等待上传中......");
        //全局文件对象，记录用户选择的文件
        inputFiles = this.files;
        //全局辅助参数 重置
        fileList = [];
        currentIndex = 0;
        currentFileLength = this.files.length;
        for(var i=0;  i < currentFileLength; i++){
            var file = inputFiles[i];
            if(file.size > maxFileUploadSize){
                //超出上传大小限制
                agcloud.ui.metronic.showErrorTip("文件 " + file.name + " 大小超过服务器文件上传大小限制（"+ formatSize(maxFileUploadSize) +"）",1500);
                continue;
            }
            var fileObj = {
                name: file.name,
                size: file.size,
                lastModified: file.lastModified
            }
            fileList.push(fileObj);
            //在解析完成后，通过回调确定是否需要上传，是自动的，可以在此处设置开关，展示文件列表，手动上传
            readAndParse(file,onParseComplete);
        }
        showUploadPanel(fileList);
    }

    //-----------------------------------------------
    //解析完成后回调函数 第一版，解析完所有文件会上传
    function onParseComplete(data) {
        fileList[currentIndex].md5Key = data.md5Key;
        currentIndex++;
        if(currentIndex == currentFileLength){
            //解析完成开始执行上传检查方法
            uploadCheck();
        }
    }

    //检查文件是否需要上传，并调用上传逻辑 ，第一版，对所有文件 进行check ，然后根据返回情况决定哪些文件需要上传，
    //由于无法操作 input file对象，所以无法在前端完成想要的功能，只能到后台判断要不要读取当前文件，影响性能。
    function uploadCheck() {
        var url = ctx + "/uploadCheck";
        var keyJson = "";
        var realInputFile = document.getElementById("uploadDo1");
        for(var i=0; i<fileList.length; i++){
            if(i == 0){
                keyJson += fileList[i].md5Key;
            }else{
                keyJson += join + fileList[i].md5Key;
            }
        }
        $.post(url,{keyJson:keyJson},function (data) {
            var data = JSON.parse(data);
            if(data.success == false){
                //没有返回列表，则当前选择的所有文件都上传过
                doUpload();
            }else{
                //有的文件已经上传过，并且key在返回值中,过滤掉这些文件
                for(var i=0 ; i<data.length; i++){
                    for(var j=0; j<fileList.length; j++){
                        if(data[i] == fileList[j].md5Key){
                            realInputFile.files[i] = inputFiles[j];
                        }
                    }
                }
                doUpload();
            }
        });
    }

    //处理上传  第一版  跟上面两个方法结合的
    function doUpload() {
        $("#userId").val(userId);
        $("#mapJson").val(JSON.stringify(fileList));
        $('#uploadForm').ajaxSubmit({
            url: ctx + "/upload",
            success: function (data) {
                var data = eval('(' + data + ')');
                if (data.success) {
                    loadPersonData();
                } else {
                    agcloud.ui.metronic.showErrorTip(data.message,1500);
                }
            },
            error: function () {
                agcloud.ui.metronic.showErrorTip('上传失败！',1500);
            }
        });
    }
    //-----------------------------------------------

    //-----------------------------------------------
    //解析完成后回调函数，第二版，解析完一个上传 一个   目前使用这个
    function onParseComplete(data,file) {
        //解析完成开始执行上传检查方法
        uploadCheckOne(data,file);
    }
    //一个一个check并决定是否需要上传
    function uploadCheckOne(data, file) {
        /*var checkUrl = ADMIN_ATT_URL + "/uploadCheck.do";
        $.post(checkUrl,{md5Key:data.messageDigest},function (result) {
            data.hasFile = result;
            if(!result){//没有上传过文件才将file对象作为一个属性上传到后台
                data.Filedata = file;
            }
            doUploadOne(data);
        });*/
        data.Filedata = file;
        data.existFile = false;
        doUploadOne(data);
    }
    //执行上传
    function doUploadOne(data) {
        currentIndex++;
        var url,params;
        if(isCommon){
            url = COMMON_ATT_URL + "/uploadAttachmentInfoAndFile.do";
            params = $.extend({
                tableName:tableName,
                pkName:pkName,
                recordId:recordId,
                dirId:dirId
            },data);
        }else{
            url = ADMIN_ATT_URL + "/upload.do";
            params = $.extend({
                modelCode:"test",
                dirId:dirId
            },data);
        }
        myHttpRequest.doSend(url,"post",params,progressMonitor,afterUpload);
    }
    //上传后回调
    function afterUpload(result) {
        if(currentIndex == currentFileLength)
            hideWait();
        var data = JSON.parse(result);
        if(data.success){
            loadPersonData();
        }else{
            agcloud.ui.metronic.showErrorTip(data.message,1500);
        }
    }
    //-----------------------------------------------
    //加载目录文件列表
    function loadPersonData(callback) {
        if(btnDisable) return;
        var url ;
        var params
        if(isCommon){
            url = COMMON_ATT_URL + "/loadData.do";
            params = {
                dirId:dirId,
                tableName:tableName,
                recordIds:recordIds
            };
        }else{
            url = ADMIN_ATT_URL + "/loadData.do";
            params = {
                dirId:dirId
            };
        }
        $.post(url,params,function (data) {
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
                    '<input type="checkbox" data-type="dir" data-key="'+ dir.dirId +'"/>' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/folder.png" class="folderIcon" /><span class="itemName pointer" title='+dir.dirName+'>'+ cutString(dir.dirName,maxlen) +'</span>' +
                    '<span class="editName hide">' +
                    '<input type="text" class="editItem"/>' +
                    '<span>' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/close.png" class="pointer editCancel" />' +
                    '</span>' +
                    '</span>' +
                    '<span class="wjj-tool hide" data-type="dir" data-key="'+ dir.dirId +'">' +
                    /*'<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/fx_active.png" class="pointer share" title="分享"/>' +*/
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/xz.png" class="pointer download" title="下载"/>' +
                    reNameBtn+
                    '</span>' +
                    '</td>' +
                    '<td class="size">-</td>' +
                    showCreateTime(dir.modifyTime)+
                    '<td class="uploadTime">' + custDateFormat(dir.createTime) + '</td>' +
                    '</tr>';
            }
            for(var i in files){
                var file = files[i];
                setFileIcon(file);
                tbody += '<tr>'+
                    '<td class="name">' +
                    '<input type="checkbox" data-type="file" data-key="'+ file.detailId +'"/>' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/file/file_'+file.icon+'.png" class="fileIcon"/><span class="itemName pointer" title="'+file.attName+'">'+ cutString(file.attName,maxlen) +'</span>' +
                    '<span class="editName hide">' +
                    '<input type="text" class="editItem"/>' +
                    '<span>' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/close.png" class="pointer editCancel" />' +
                    '</span>' +
                    '</span>' +
                    '<span class="wjj-tool hide" data-type="file" data-key="'+ file.detailId +'">' +
                   /* '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/fx_active.png" class="pointer share" title="分享"/>' +*/
                    '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/xz.png" class="pointer download" title="下载"/>' +
                    reNameBtn +
                    '</span>' +
                    '</td>' +
                    '<td class="size">'+ formatSize(file.attSize) +'</td>' +
                    showCreateTime(file.modifyTime)+
                    '<td class="uploadTime">' + custDateFormat(file.createTime) + '</td>' +
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
        var keyword = $("#searchKey").val();
        var url;
        var params;
        if(!keyword){
            return;
        }
        if(isCommon){
            url = COMMON_ATT_URL + "/search.do";
            params = {
                keyword:keyword,
                tableName:tableName,
                pkName:pkName,
                recordIds:recordIds

            };
        }else{
            url = ADMIN_ATT_URL + "/search.do";
            params = {
                fileName:keyword,
            };
        }
        $.post(url,params,function (data) {
            if(!data||data.list.length<=0){
                $("#fileDirTable").find("tbody").empty();
                $("#fileDirTable").find("tbody").append('<div style="width: 100%;text-align: center">未查询到文件</div>');
                return;
            }
            var entitys = data.list;
            var total = data.total;
            if(entitys == null || entitys.length == 0){
                $("#fileDirTable").find("tbody").empty();
                return;
            }
            var dirTag = "";
            var fileTag = "";
            for(var i in entitys){
                var entity = entitys[i];
                var isDir = entity.fileType=='dir';
                var dirName =  entity.parentName?entity.parentName:'根目录';
                var dirId = entity.parentId?entity.parentId:'';
                if(isDir){
                    dirTag +='<tr>'+
                        '<td class="name">' +
                        '<input type="checkbox" data-type="dir" data-key="'+ entity.fileId +'"/>' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/folder.png" class="folderIcon" /><span class="itemName pointer" title="'+entity.fileName+'">'+ cutString(entity.fileName,maxlen) +'</span>' +
                        '<span class="editName hide">' +
                        '<input type="text" class="editItem"/>' +
                        '<span>' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/close.png" class="pointer editCancel" />' +
                        '</span>' +
                        '</span>' +
                        '<span class="wjj-tool hide" data-type="dir" data-key="'+ entity.fileId +'">' +
                        /*'<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/fx_active.png" class="pointer share" title="分享"/>' +*/
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/xz.png" class="pointer download" title="下载"/>' +
                        reNameBtn +
                        '</span>' +
                        '</td>' +
                        '<td class="size">-</td>' +
                        showCreateTime(entity.modifyTime)+
                        '<td class="uploadTime">' + custDateFormat(entity.createTime) + '</td>' +
                        '<td class="dir"><a href="#" class="toDir" data-key="'+ dirId +'">' + dirName + '</a></td>' +
                        '</tr>';
                }else{
                    entity.attName = entity.fileName;
                    setFileIcon(entity);
                    fileTag += '<tr>'+
                        '<td class="name">' +
                        '<input type="checkbox" data-type="file" data-key="'+ entity.fileId +'"/>' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/file/file_'+entity.icon+'.png" class="fileIcon"/><span class="itemName pointer" title="'+entity.fileName+'">'+ cutString(entity.fileName,maxlen) +'</span>' +
                        '<span class="editName hide">' +
                        '<input type="text" class="editItem"/>' +
                        '<span>' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/confirm.png" class="pointer editConfirm" />' +
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/close.png" class="pointer editCancel" />' +
                        '</span>' +
                        '</span>' +
                        '<span class="wjj-tool hide" data-type="file" data-key="'+ entity.fileId +'">' +
                       /* '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/fx_active.png" class="pointer share" title="分享"/>' +*/
                        '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/xz.png" class="pointer download" title="下载"/>' +
                        reNameBtn +
                        '</span>' +
                        '</td>' +
                        '<td class="size">'+ formatSize(entity.fileSize) +'</td>' +
                        showCreateTime(entity.modifyTime)+
                        '<td class="uploadTime">' + custDateFormat(entity.createTime) + '</td>' +
                        '<td class="dir"><a href="#" class="toDir" data-key="'+ dirId +'">' + dirName + '</a></td>' +
                        '</tr>';
                }
            }
            $("#fileDirTable").find("tbody").empty();
            $("#fileDirTable").find("tbody").append(dirTag+fileTag);
            $("#checkAll").attr("checked",false);
            $('.allFile').addClass("hide");
            $("#allFiles-two").removeClass("hide");
            $(".weizhi").addClass("hide");
            $(".dir").removeClass("hide");
            $(".toDir").click(function () {
                $('#allFiles-two').addClass('hide');
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
        if(btnDisable){
            return;
        }
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
        //绑定新建文件夹编辑框确认按钮事件
        $(".createConfirm").on('click',function () {
            var name = $("#currentEditInput").val();
            doCreateDir(name);
        })
        //绑定编辑框取消按钮事件
        $(".createCancel").on('click',function () {
            loadPersonData();
        })
        //绑定编辑框确认按钮事件
        $(".editConfirm").on('click',function () {
            var name = $(this).parent('span').prev('.editItem').val();
            var $input = $(this).parent('span').parent('span').siblings('input[type=checkbox]');
            var type = $input.attr("data-type");
            var id = $input.attr("data-key");
            var data = {type:type,id:id,name:name};
            doEdit(data);
        })
        //绑定编辑框取消按钮事件
        $(".editCancel").on('click',function () {
            loadPersonData();
        })
        //绑定重命名按钮事件
        $(".rename").on('click',function () {
            var $itemName = $(this).parent().siblings('.itemName');
            var title = $itemName.attr('title');
            $itemName.html(title);
            $itemName.addClass("hide");
            var $editName = $(this).parent().siblings('.editName');
            $editName.removeClass("hide");
            $editName.children('input').val($itemName.text());
        })
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
            var url = ADMIN_ATT_URL + "/download.do?fileId=" + key;
            window.location.href = url;
        }else if(type == 1){
            var fileIds = getCheckedFiles();
            var dirIds = getCheckedDirs();
            if(dirIds.length > 0){
                agcloud.ui.metronic.showTip('只支持批量文件下载，不支持文件夹下载','info',1500);
                return;
            }
            if(fileIds.length > 0){
                var fileIdsStr = fileIds.join(join);
                var url = ADMIN_ATT_URL + "/multiDownload.do?fileIds=" + fileIdsStr;
                window.location.href = url;
            }else{
                agcloud.ui.metronic.showTip('请勾选要下载的文件','info',1500);
            }
        }else if(type == 2){
            agcloud.ui.metronic.showTip('文件夹下载 暂时未开发','info',1500);
        }else{
            agcloud.ui.metronic.showTip('文件夹批量下载 暂时未开发','info',1500);
        }
    }
    //处理删除，批量删除
    function doRemove() {
        var fileIds = getCheckedFiles();
        var dirIds;
        if(isCommon){
            if(fileIds==null||fileIds.length<=0){
                agcloud.ui.metronic.showErrorTip('请选择要删除的文件',1500);
                return;
            }
            dirIds =[];
        }else{
            dirIds = getCheckedDirs();
            if((fileIds==null||fileIds.length<=0)||(dirIds==null||dirIds.length<=0)){
                agcloud.ui.metronic.showErrorTip('请选择要删除的文件或文件夹',1500);
                return;
            }
        }
        var params = {
            dirIds: dirIds.join(join),
            fileIds: fileIds.join(join)
        };
        var msg = '你确定要删除吗？';
        swal({
            title: '',
            text: msg,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(function (result) {
            if (result.value) {
                var url = ADMIN_ATT_URL + "/remove.do";
                $.ajax({
                    url:url,
                    data:params,
                    type:'POST',
                    dataType:"json",
                    success: function (data) {
                        if(data.success){
                            // alert(data.message);
                            loadPersonData();
                        }
                    },
                    error : function (status) {
                        agcloud.ui.metronic.showErrorTip('删除失败',1500);
                    }
                });
            }
        });
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
    //创建文件夹相关操作
    function createDir() {
        var tr = '<tr>'+
            '<td class="name">' +
            '<input type="checkbox" data-type="dir" />' +
            '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/folder.png" class="folderIcon"/>' +
            '<span class="editName">' +
            '<input type="text" class="editInput" id="currentEditInput" value="新建文件夹"/>' +
            '<span>' +
            '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/confirm.png" class="pointer createConfirm" />' +
            '<img src="' + ctx + '/ui-static/agcloud/bsc/yunpan/img/close.png" class="pointer createCancel" />' +
            '</span>' +
            '</span>' +
            '</td>' +
            '<td class="size">-</td>' +
            '<td class="modifyTime"></td>' +
            '<td class="uploadTime"></td>' +
            '</tr>';
        if($("#fileDirTable").find("tbody tr").first().length > 0){
            $("#fileDirTable").find("tbody tr").first().before(tr);
        }else{
            $("#fileDirTable").find("tbody").append(tr);
        }
        bindingAction();
    }
    //创建文件夹提交接口
    function doCreateDir(dirName){
        var url = ADMIN_ATT_URL + "/createDir.do";
        var params = {
            dirName : dirName,
            parentId : dirId,
            dirLevel:"4"
        };
        $.ajax({
            url:url,
            data:params,
            type:'POST',
            dataType:"json",
            success: function (data) {
                if(data.success){
                    loadPersonData();
                }
            },
            error : function (status) {
                agcloud.ui.metronic.showErrorTip('创建文件夹失败!',1500);
            }
        });
    }
    //编辑，重命名接口
    function doEdit(data) {
        var url = ADMIN_ATT_URL + "/rename.do";
        $.ajax({
            url:url,
            data:data,
            type:'POST',
            dataType:"json",
            success: function (data) {
                if(data.success){
                    loadPersonData();
                }
            },
            error : function (status) {
                agcloud.ui.metronic.showErrorTip('重命名失败！',1500);
            }
        });
    }
    //进入目录接口
    function doEnterDir(id) {
        if(!id){
            dirId = '';
            loadPersonData();
            return;
        }
        dirId = id;//记录当前目录id
        var url = ADMIN_ATT_URL + "/getDir.do";
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
                    var dirNameSeq = data.dirNameSeq.split(".");
                    var dirSeq = data.dirSeq.split(".");
                    var dirPath = '';
                    for(var i=0; i<dirSeq.length; i++){
                        if(i == dirSeq.length -1){
                            dirPath += '<span> > '+ dirNameSeq[i] +'</span>'
                        }else{
                            dirPath += '<a href="#" class="dirItem" id="' + dirSeq[i] + '"> > '+ dirNameSeq[i] +'</a>'
                        }
                    }
                    $("#dirXpath").append(dirPath);
                    //点击任意目录路径的事件
                    $(".dirItem").click(function () {
                        dirId = $(this)[0].id;
                        doEnterDir(dirId);
                    });
                }
                loadPersonData(innerFunc);
            },
            error : function (status) {
                agcloud.ui.metronic.showErrorTip('进入目录失败！',1500);
            }
        });
    }
    //返回上一级目录
    function backToLast() {
        var url = ADMIN_ATT_URL + "/getDir.do";
        $.ajax({
            url:url,
            data:{dirId:dirId},
            type:'POST',
            dataType:"json",
            success: function (data) {
                dirId = data.parentId;
                if(!dirId){
                    function temp() {
                        $(".allFile").removeClass("hide");
                        $(".weizhi").addClass("hide");
                    }
                    loadPersonData(temp);
                }else{
                    var lastLink = $("#dirXpath a").last();
                    var spanDom = '<span>'+lastLink.html()+'</span>';
                    lastLink.remove();
                    $("#dirXpath span").remove();
                    $("#dirXpath").append(spanDom);
                    loadPersonData();
                }
            },
            error : function (status) {
                agcloud.ui.metronic.showErrorTip('返回上级目录失败！',1500);
            }
        });
    }

    //获取角色列表，进行共享操作
    function doShare() {
        //判断是否勾选了文件文件夹
        if(getCheckedDirs().length == 0 && getCheckedFiles().length == 0){
            agcloud.ui.metronic.showErrorTip('请选择共享的资源',1500);
            return;
        }
        var url = ctx + "/share/getRoles";
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            success: function (data) {
                //打开角色列表时
                parent.showRolePanel(data);
            },
            error : function (status) {
                agcloud.ui.metronic.showErrorTip('获取角色列表失败！',1500);
            }
        });
    }
    //检查浏览器 H5 FileReader支持
    function getFileReaderSupport() {
        if (typeof FileReader == "undefined") {
            document.write("您的浏览器不支持FileReader");
        } else {
            document.write("您的浏览器支持FileReader");
        }
    }
    function custDateFormat(dateStr) {
        if(cutDateStr){
            return dateStr? dateFormatByExp(dateStr,'yyyy/MM/dd') : "-";
        }else{
            return dateStr? dateFormatByExp(dateStr,'yyyy/MM/dd hh:mm') : "-";
        }

    }
    function setFileIcon(file) {
        var fm = file.attName;
        for(var key in fileRegexs){
            if(fileRegexs[key].test(fm)){
                file.icon = key;
                return;
            }
        }
        file.icon = 'empty';
    }
    var fileRegexs = {
        text:(/\.(txt|md)$/i),
        word:(/\.(docx|doc|wps)$/i),
        pdf:(/\.pdf$/i),
        picture:(/\.(png|jpg|jpeg|bmp|gif|svg|tiff)$/i),
        excel:(/\.(xls|xlsx)$/i),
        sound:(/\.(mp3|wav|cad|wma|ra|midi|ogg|ape|flac|aac)$/i),
        video:(/\.(rm|rmvb|avi|flv|mp4|mkv|wmv|3gp|amv|mpeg1-4|mov|mtv|dat|dmv)$/i),
        code:(/\.(java|js|css|html)/i),
        exe:(/\.exe/i),
        psd:(/\.psd$/i),
        zip:(/\.(zip|rar|7z|gz|tar|bz2)$/i)
    };
    function cutString(str, len) {
        //length属性读出来的汉字长度为1
        if(str.length*2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for(var i = 0;i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if(strlen >= len){
                    return s.substring(0,s.length-1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if(strlen >= len){
                    return s.substring(0,s.length-2) + "...";
                }
            }
        }
        return s;
    }

