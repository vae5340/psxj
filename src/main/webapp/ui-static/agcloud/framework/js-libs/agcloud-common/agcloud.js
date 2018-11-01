/**
 * 执行AgCloud框架的相关UI界面处理逻辑
 */
$(function() {
	//agcloud.ui.handleBootstrapTabsEasyuiLayoutPage();

    //当文档窗口发生改变时 触发
    /*$(window).resize(function(){
        agcloud.ui.handleBootstrapTabsEasyuiLayoutPage();
    });*/
});

var agcloud = function(){};

/**
 * UI界面的相关工具方法
 * @type {{handleBootstrapTabsEasyuiLayoutPage: agcloud.ui.handleBootstrapTabsEasyuiLayoutPage, resizeEasyuiLayoutPortletBody: agcloud.ui.resizeEasyuiLayoutPortletBody,
 * hideNonFirstActiveBootstrapTabs: agcloud.ui.hideNonFirstActiveBootstrapTabs, getViewPort: agcloud.ui.getViewPort, addCustomTab: agcloud.ui.addCustomTab,
 * closeCustomTab: agcloud.ui.closeCustomTab}}
 */
agcloud.ui = {
    metronic : {
        showErrorTip : function (message,time,closeWin) {
            this.showTip(message,"error",time,closeWin);
        },
        showSuccessTip : function (message,time,closeWin) {
            this.showTip(message,"success",time,closeWin);
        },
        //提示信息,message信息实体，time提示框显示时间,设置则时间到会自动关闭，单位毫秒,closeWin 为true时会关闭当前窗口
        showTip : function (message,type,time,closeWin) {
            var options = {
                message:message,
                time:time,
                type:type,
                closeWin:closeWin
            }
            this.showSwal(options);
        },
        //确认框，可带回调函数
        showConfirm : function (message,callback) {
            var options = {
                title:"确认信息",
                message:message,
                callback:callback
            }
            this.showSwal(options);
        },
        showSwal : function (options) {
            var width = 500;//默认宽度
            var type = "info";
            var title = "提示信息";
            if(options.width && typeof options.width == "number"){
                width = options.width;
            }
            if(options.type){
                type = options.type;
            }
            if(options.title){
                title = options.title;
            }
            var swalOptions = {
                title : title,
                html : options.message,
                type : type,
                width :width,
                showConfirmButton : true,
                confirmButtonText : "确定"
            };
            if(options.time && typeof options.time == "number"){
                swalOptions.timer = options.time;
                swalOptions.showConfirmButton = false;
            }
            if(options.closeWin){
                swalOptions.onClose = function () {
                    //关闭当前窗口
                    if(window)
                        window.close();
                    //刷新父源窗口
                    if(window && window.opener)
                        window.opener.location.reload();
                }
            }
            if(options.callback){
                swalOptions.showCancelButton = true;
                swalOptions.cancelButtonText = "取消";
                swal(swalOptions).then(function(result) {
                    if (result.value) {
                        options.callback();
                    }
                });
            }else{
                //构造提示框
                swal(swalOptions);
            }
        },
        //遮罩层
        showBlock : function () {
            mApp.blockPage();
        },
        hideBlock : function () {
            mApp.unblockPage();
        }
    },
    easyui :{},
    /**
     * 处理混合Bootstrap Tab和Easyui Layout的页面兼容性问题
     */
	handleBootstrapTabsEasyuiLayoutPage:function () {
		this.resizeEasyuiLayoutPortletBody();
		this.hideNonFirstActiveBootstrapTabs();
	},
    /**
     * 设置Easyui Layout的大小与窗口大小匹配
     */
    resizeEasyuiLayoutPortletBody: function(){
        $('.easyui-layout-portlet-body').each(function(){
            var target = $(this);
            var width = getViewPort().width-18;
            var height = getViewPort().height-90;
            target.layout('resize',{
                width: width,
                height: height
            })
        });
    },
    /**
     * 隐藏除第一个标签页外的其他Bootstrap Tab标签页（前提是Bootstrap Tab的class都要设置为active）
      */
    hideNonFirstActiveBootstrapTabs: function(){
        var index = 0;
        $('.tab-pane').each(function(){
            if(index > 0)
                $(this).removeClass('active');
            index++;
        });
    },
    // 开启一个新的tab页面
    addCustomTab:function (title, url,iframeId){
        //
        if ($('#tabArea').tabs('exists', title)){
            $('#tabArea').tabs('close', title);
        }

        var content = '<iframe src="'
            + url
            + '" scrolling="auto" style="width:100%;height:100%;border:0;" id="'+iframeId+'"></iframe>';

        $('#tabArea').tabs('add', {
            title: title,
            content: content,
            closable: true
        });

        var height = $(".page-content").height() - $(".page-bar").height() - 5;
        $("#"+iframeId).height(height-20);
        $("#tabArea").height(height);

    },// 开启一个新的tab页面
    closeCustomTab:function (){
            var tab=$('#tabArea').tabs('getSelected');//获取当前选中tabs
            var index = $('#tabArea').tabs('getTabIndex',tab);//获取当前选中tabs的index
            $('#tabArea').tabs('close',index);//关闭对应index的tabs
    },
};

/**
 * 常用的JS工具方法，包括日期格式化、数字货币化等
 * @type {{dateFormat: agcloud.utils.dateFormat, dateTimeNoSecendFormat: agcloud.utils.dateTimeNoSecendFormat, dateTimeFormat: agcloud.utils.dateTimeFormat, dateFormatByExp: agcloud.utils.dateFormatByExp, currencyFormat: agcloud.utils.currencyFormat}}
 */
agcloud.utils = {
    /**
     * 将日期格式化为yyyy-MM-dd格式
     * @param val
     * @returns {*}
     */
	dateFormat:function (val) {
		return this.dateFormatByExp(val, "yyyy-MM-dd");
	},
    /**
     * 将日期格式化为yyyy-MM-dd HH:mm格式
     * @param val
     * @returns {*}
     */
	dateTimeNoSecendFormat:function (val) {
		return this.dateFormatByExp(val, "yyyy-MM-dd hh:mm");
	},
    /**
     * 将日期格式化为yyyy-MM-dd HH:mm:ss格式
     * @param val
     * @returns {*}
     * 代替生成代码的 formatDatebox函数
     */
	dateTimeFormat:function (val) {
		return dateFormatByExp(val, "yyyy-MM-dd hh:mm:ss");
	},
    dateFormat:function (val) {
        return dateFormatByExp(val, "yyyy-MM-dd");
    },

    /**
     * 将日期格式化为指定的exp格式
     * @param value 日期值
     * @param exp 格式表达式
     * @returns {null}
    dateFormatByExp: function (value, exp) {
        if (value == null || value == '') {
            return null;
        }
        var dt;
        if (value instanceof Date) {
            dt = value;
        } else {
            dt = new Date(value);
        }
        return dt.format(exp); //扩展的Date的format方法(上述插件实现)
    },
    /**
     * 将数值四舍五入(保留2位小数)后格式化成金额形式
     * @param num 数值(Number或者String)
     * @return 金额格式的字符串,如'1,234,567.45'
     */
	currencyFormat:function (val) {
        if(num){
            num = num.toString().replace(/\$|\,/g,'');
            if(isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num*100+0.50000000001);
            cents = num%100;
            num = Math.floor(num/100).toString();
            if(cents<10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
                num = num.substring(0,num.length-(4*i+3))+','+
                    num.substring(num.length-(4*i+3));
            return "￥ "+(((sign)?'':'-') + num + '.' + cents);
        }else{
            return "￥ 0.00";
        }
	}
};


agcloud.easyuiExt = {
    /**
     * 选中指定grid的某一行
     * @param val
     * @returns {*}
     */
    selectDatagridRow:function(gridId,index){
        $('#'+gridId).datagrid('selectRow', index);
    }
    /*
     *刷新指定grid
     */
    ,reloadDatagrid:function(gridId) {
        $("#"+gridId).datagrid('reload');
    }

    ,//加载普通下拉框  公共方法,
     commonCombobox:function(baseDicCodeItemUrl,valueColumn,textColumn,inputNameorId,formID) {
    if(formID!=null&&formID!='undefined'){
        $("#"+formID+" input[name='"+inputNameorId+"']").combobox({
            url:baseDicCodeItemUrl,
            valueField:valueColumn,
            textField:textColumn,
            onDblClickRow: function (rowIndex, rowData) {
                /*console.log(rowData);*/
            },
            onLoadSuccess: function () { //加载完成后,设置选中第一项
                var val = $(this).combobox("getData");
                for (var item in val[1]) {
                    if (item == valueColumn) {
                        $(this).combobox("setValue", val[1][valueColumn]);
                    }
                }
            },onHidePanel : function() {
                var _options = $(this).combobox('options');
                var _data = $(this).combobox('getData');/* 下拉框所有选项 */
                var _value = $(this).combobox('getValue');/* 用户输入的值 */
                var _b = false;/* 标识是否在下拉列表中找到了用户输入的字符 */
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i][_options.valueField] == _value) {
                        _b=true;
                        break;
                    }
                }
                if(!_b){
                    $(this).combobox('setValue', '');
                }
            }
        });
    }else{
        // alert(baseDicCodeItemUrl+'\n'+valueColumn+'\n'+textColumn);
        $("#"+inputNameorId+"").combobox({
            url:baseDicCodeItemUrl,
            valueField:valueColumn,
            textField:textColumn,
            onDblClickRow: function (rowIndex, rowData) {
                /*console.log(rowData);*/
            },
            onLoadSuccess: function () { //加载完成后,设置选中第一项
                var val = $("#"+inputNameorId+"").combobox("getData");
                /*console.log(val);*/
                for (var item in val[0]) {
                    if (item == valueColumn) {
                        /*console.log(item);
                         console.log(val[0][valueColumn]);*/
                        $("#"+inputNameorId+"").combobox("setValue", val[0][valueColumn]);
                    }
                }
            },onHidePanel : function() {
                var _options = $(this).combobox('options');
                var _data = $(this).combobox('getData');/* 下拉框所有选项 */
                var _value = $(this).combobox('getValue');/* 用户输入的值 */
                var _b = false;/* 标识是否在下拉列表中找到了用户输入的字符 */
                for (var i = 0; i < _data.length; i++) {
                    if (_data[i][_options.valueField] == _value) {
                        _b=true;
                        break;
                    }
                }
                if(!_b){
                    $(this).combobox('setValue', '');
                }
            }
        });
    }
}

};

/**
 * 获取窗口大小
 * @returns {{width: *, height: *}}
 */
var getViewPort = function(){
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return {
        width: e[a + 'Width'],
        height: e[a + 'Height']
    };
}

/**
 * 居中打开新窗口
 */
function openCenterFixedWindow(url, width, height){
    var x = (screen.availWidth - width) / 2;
    var y = (screen.availHeight - height) / 2;
    var param = "left="+x+",top="+y+",width="+width+",height="+height;
    param += ',toolbar=no,menubar=no,status=yes,locationbar=no,directories=no,scrollbars=yes,resizable=yes';
    //var handle= window.open(url, '_blank', param);//钉钉不支持
    var handle= window.location.href=url;
    return handle;
}

/**
 * 居中打开新窗口
 */
function openCenterWindow(url){
    var param = "left=0,top=0,width="+screen.availWidth+",height="+screen.availHeight;
    param += ',toolbar=no,menubar=no,status=yes,locationbar=no,directories=no,scrollbars=yes,resizable=yes';
    var handle= window.open(url, '_blank', param);
    return handle;
}

/* utils 工具类相关方法 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//--------------------------------formatter start ----------------------------------------
function dateFormatByExp (value, exp) {
    if (value == null || value == '') {
        return null;
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else {
        dt = new Date(value);
    }
    return dt.format(exp); //扩展的Date的format方法(上述插件实现)
}

//中文日期转换
function dateFormatterCn(val){
    return dateFormatByExp(val,'yyyy年MM月dd日')
}

//日期转换
function dateFormatter(val){
    return dateFormatByExp(val,'yyyy-MM-dd')
}

//中文日期时间转换
function dateTimeFormatterCn(val){
    return dateFormatByExp(val,'yyyy年MM月dd日 hh时mm分ss秒')
}

//日期时间转换
function dateTimeFormatter(val){
    return dateFormatByExp(val,'yyyy-MM-dd hh:mm:ss')
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
function currencyFormatterRMB(num) {
    if(num){
        num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
                num.substring(num.length-(4*i+3));
        return "￥ "+(((sign)?'':'-') + num + '.' + cents);
    }else{
        return "￥ 0.00";
    }
}

//百分比转换器（保留两位小数）
function percentFormatter(num){
    if(num){
        return (Math.round(num * 10000)/100).toFixed(2) + '%';
    }else{
        return "0.00%";
    }
}
//--------------------------------formatter end ----------------------------------------

//--------------------------------表单数据加载----------------------
/**
 * 给表单赋值封装方法
 * @param isJsonData  true  是  否  不是
 * @param jsonData  数据
 * @param formId  '#表单id'
 */
function loadFormData(isJsonData,formId,jsonData){
    if(!isJsonData){
        jsonData = eval("("+jsonData+")");
    }
    var obj = jsonData;
    var key,value,tagName,type,arr;
    for(var x in obj){
        key = x;
        value = obj[x];
        $(formId + " [name='"+key+"'],"+ formId +" [name='"+key+"[]']").each(function(){
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if(tagName == 'INPUT'){
                if(type == 'radio'){
                    $(this).attr('checked',$(this).val()==value);
                }else if(type == 'checkbox'){
                    arr = value.split(',');
                    for(var i =0;i<arr.length;i++){
                        if($(this).val()==arr[i]){
                            $(this).attr('checked',true);
                            break;
                        }
                    }
                }else{
                    //加入文本框是日期类型的判断，和格式化
                    var dateType = $(this).attr("date-type");
                    var tempValue = value;
                    if(dateType){
                        if(typeof value == "number"){
                            if(dateType == "date"){
                                tempValue = dateFormatter(value);
                            }else if(dateType && dateType == "datetime"){
                                tempValue = dateTimeFormatter(value);
                            }
                        }else{
                            var date = new Date(value).getTime();
                            if(dateType == "date"){
                                tempValue = dateFormatter(date);
                            }else if(dateType && dateType == "datetime"){
                                tempValue = dateTimeFormatter(date);
                            }
                        }
                    }
                    $(this).val(tempValue);
                }
            }else if(tagName == 'TEXTAREA'){
                $(this).val(value);
            }else if(tagName=='SELECT'){
                if($(this).hasClass("selectpicker")){
                    var vs = value.split(",");
                    $(this).selectpicker('val',vs);//设置选中
                    $(this).selectpicker('refresh');
                }else{
                    $(this).val(value);
                }
            }
        });
    }
}
//-----------------------------end-------------------------------------------------------------