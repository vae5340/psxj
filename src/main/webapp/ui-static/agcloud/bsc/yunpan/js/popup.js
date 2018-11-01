/**
 * 等待加载界面
 */
var maxlen2 = 100;//名称超过最大长度截取
$(function () {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    var textWidth = windowWidth * 0.38 + 50;
    console.log(textWidth);
    maxlen2 = textWidth/13;
});
function showWait(text) {
    var modal = '<div id="waitTip" class="l-wrapper">' +
        '<svg viewBox="0 0 120 120" version="1.1" id="waitPic" >' +
        '<g id="circle" class="g-circles g-circles--v1">' +
        '<circle id="12" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " cx="35" cy="16.6987298" r="10"></circle>' +
        '<circle id="11" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " cx="16.6987298" cy="35" r="10"></circle>' +
        '<circle id="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " cx="10" cy="60" r="10"></circle>' +
        '<circle id="9" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " cx="16.6987298" cy="85" r="10"></circle>' +
        '<circle id="8" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " cx="35" cy="103.30127" r="10"></circle>' +
        '<circle id="7" cx="60" cy="110" r="10"></circle>' +
        '<circle id="6" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " cx="85" cy="103.30127" r="10"></circle>' +
        '<circle id="5" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " cx="103.30127" cy="85" r="10"></circle>' +
        '<circle id="4" transform="translate(110, 60) rotate(-90) translate(-110, -60) " cx="110" cy="60" r="10"></circle>' +
        '<circle id="3" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " cx="103.30127" cy="35" r="10"></circle>' +
        '<circle id="2" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " cx="85" cy="16.6987298" r="10"></circle>' +
        '<circle id="1" cx="60" cy="10" r="10"></circle>' +
        '</g>' +
        '</svg>';
    if(text){
        modal += '<div style="width:100%;position: absolute;top:55px;font-size:22px;color:#1C64AD;text-align: center">' + text + "</div>";
    }
    modal += '</div>';
    if ($("#waitTip").length > 0) {
        $("#waitTip").show();
    } else {
        $("body").append(modal);
        $("#waitPic").css("marginTop", window.innerHeight / 2 - 60);
    }
}
function hideWait() {
    if ($("#waitTip").length > 0) {
        $("#waitTip").hide();
    }
}
//options是配置信息
function showPanel(options,initCall,confirmCall,cancelCall) {
    var t = options.title ? options.title : "标题";
    var css = '';
    if(options.css){
        css = ' style = "' + options.css + '" ';
    }
    var panel = '<div class="popup myPanel" '+ css +'>' +
        '<div class="title">' +
        '<span>'+ t +'</span>';
            if(options.close){
                panel += '<span class="glyphicon glyphicon-remove"></span>';
            }
        panel += '</div>';
        if(options.buttons){
            panel += '<div class="panelContents panel80">'+ options.content +'</div>'+
                '<div class="wrap-button">' +
                '<button style="float: right;" class="cancel">取消</button>' +
                '<button style="float: right;" class="confirm">确定</button>' +
                '</div>';
        }else{
            panel += '<div class="panelContents">'+ options.content +'</div>';
        }
    panel += '</div>';
    $('body').find(".myPanel").remove();
    $('body').append(panel);
    if(initCall){
        if(options.initData){
            initCall(options.initData);
        }else{
            initCall();
        }
    }
    if(confirmCall){
        $(".confirm").click(function () {
            if(options.confirmData){
                confirmCall(options.confirmData);
            }else{
                confirmCall();
            }
        });
    }
    if(cancelCall){
        $(".cancel").click(cancelCall);
    }
    if(options.close){
        $(".glyphicon-remove").click(function () {
            hidePanel();
        });
    }
}
function hidePanel(clazz) {
    var select  = clazz ? clazz : ".myPanel";
    $('body').find(select).remove();
}
//展示上传面板
function showUploadPanel(fileData) {
    var cont =  '<div class="wrap-table">' +
        '<table id="uploadTable">' +
        '<thead>' +
        '<tr>' +
        '<td class="file-name-td" style="width: 40%">文件名</td>' +
        '<td style="width: 60%" class="uploadProgress">上传进度</td>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    for(var i=0; i<fileData.length; i++){
        var id =  fileData[i].size + fileData[i].lastModified;
        cont += '<tr id="file_'+ id +'">' +
            '<td>'+ cutString2(fileData[i].name,maxlen2) +'</td>' +
            '<td class="uploadProgress">' +
            '<div class="progress">' +
            '<div  id="progress_'+ id +'" class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + fileData[i].size + '" style="width: 0">' +
            '<span class="sr-only"></span>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '</tr>';
    }
    cont += '</tbody>' +
    '</table>'+
    '</div>';
    var options = {
        title : "上传列表",
        close : true,
        content : cont
    };
    showPanel(options)
}
function showRolePanel(data) {
    var cont =  '<div class="roleTable" style="height: 90%">' +
        '<table id="roleTable"></table>'+
        '</div>';
    var width = 500;
    var height = 550;
    var left = (window.innerWidth - width)/2;
    var top = (window.innerHeight - height)/2;
    var options = {
        title : "角色列表",
        close : false,
        content : cont,
        buttons : true,
        css : "width:" + width + "px;height:"+ height +"px;top:"+ top +"px;left:"+ left +"px",
        initData : data
    };
    //负责窗口初始化事件，表格是加载数据
    function init(data) {
        $('#roleTable').bootstrapTable({
            height:350,
            pagination: true,
            clickToSelect: true,
            paginationHAlign: 'left',
            columns: [{
                field: 'checked',
                checkbox: true
            }, {
                field: 'id',
                visible: false
            }, {
                field: 'name',
                title: 'Item Name'
            }],
            data:data
        });
    }
    //取消则关闭窗口
    function cancel() {
        hidePanel();
    }
    function confirm(data) {
        var checkedDirs = $("#contents")[0].contentWindow.getCheckedDirs();
        var checkedFiles = $("#contents")[0].contentWindow.getCheckedFiles();
        var roles = $('#roleTable').bootstrapTable('getSelections');
        if((checkedDirs.length > 0 || checkedFiles.length > 0) &&　roles.length > 0){
            var shareData = {files:checkedFiles,dirs:checkedDirs};
            shareData.roles = roles;
            var url = ctx + "/share/doShare"
            $.ajax({
                url: url,
                data: {userId:userId,shareData: JSON.stringify(shareData)},
                dataType: 'json',
                success: function (result) {
                    if(result.success){
                        hidePanel();
                    }else{
                        alert("共享资源失败");
                    }
                },
                error: function (text) {
                    alert(text);
                }

            });
        }
    }
    showPanel(options,init,confirm,cancel);
}
//设置进度条信息
function updateProgress(index,value,total) {
    var progress = $("#progress_" + index);
    progress.attr("aria-valuemax",total);
    progress.attr("aria-valuenow",value);
    var temp;
    if(total == 0){
        temp = "100%";
    }else{
        temp = (value / total * 100).toFixed(0) + "%";
    }
    progress.css("width",temp);
    progress.find(".sr-only").text(temp);
}
function setProgressTip(text) {
    $("#uploadTable").find(".sr-only").text(text);
}
//上传进度实现方法，上传过程中会频繁调用该方法
function progressMonitor(evt) {
    // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
    updateProgress(this.progressName,evt.loaded,evt.total);
}
function testProgress() {
    var i = 1;
    var int = setInterval(function () {
        updateProgress(0,i*20);
        if(i == 5){
            clearInterval(int);
        }
        i++;
    },1000);
}
function cutString2(str, len) {
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