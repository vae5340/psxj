
/*
 * author：sam
 * time：2018年5月22日
 * version ：V1.0
 * 
 */
;(function($, window, document, undefined) {
	$.fn.commonSearch = function(options, callback) {
		$.fn.commonSearch.callback = callback;
		$.fn.commonSearch.RequestPramData = new Array();
		$.fn.commonSearch.RequestUrl = null;
		$.fn.commonSearch.param = null;
		var defaults = {
			url: "",
			title: "你已选择",
			initParam:null,
			dataList: [],
			style:{},
		};
		var settings = $.extend({}, defaults, options);
		$.fn.commonSearch.RequestUrl = settings.url;

		if(settings.initParam != null){
			onclickForBuildDIV(settings.initParam);
			$.fn.commonSearch.RequestPramData.push(settings.initParam);
		}
		return this;
	}

    showOrHiddenMoreBtn();

})(jQuery, window, document);


//点击查询按钮
function searchBtnClick(){
    var paramArray = new Array();
    var keywordVal = $("#searchInput_keyword").val();
    if(keywordVal!=""){
        var keywordAObj = $('#keywordForA');
        if(keywordAObj){
            keywordAObj.remove();
        }

        var $aa = $('<a id="keywordForA"><span id="keyword_span">' + keywordVal + '（关键字）</span><span class="tit-close">×</span></a>');
        $(".yixuanNavList").append($aa);
        $aa.bind("click", function() {
            $(this).remove();
            resetData("keyword");
            $("#searchInput_keyword").val(null);
        });

        var param = {
            columnValue: keywordVal,
            columnValueName: "keyword"
        };
        paramArray.push(param);
        var requestData = {
            columnName: "keyword",
            parentName: "关键词",
            requestData: paramArray
        };
        $.each($.fn.commonSearch.RequestPramData, function(index, value) {
            if("keyword" == value.columnName) {
                $.fn.commonSearch.RequestPramData.remove(index);
            }
        });
        $.fn.commonSearch.RequestPramData.push(requestData);
    }

    Get_AJAX();

    //显示清空按钮
    var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
    clearAllBtnObj.css('display','block');
}

//多选按钮点击事件
function multiBtnClick(_this) {
    //选项组div
    var $selectDiv = $(_this).parent("section").siblings("div");
    //设置选项组高度切换
    $selectDiv.toggleClass("divMulti");
    $(_this).hide();
    $(_this).next("a").hide();
    $(_this).next("a").next("a").removeClass("hidden").show();

    //为每个选项设置复选框和点击事件
	var $i = $selectDiv.find("i");
    $i.toggleClass("ch").removeClass("chbackground");

    //augurit：打开多选时，去掉span标签上的onClick事件
    var spanObj = $selectDiv.find("span");
    spanObj.unbind("click");
    spanObj.removeAttr("onclick");

    //augurit:给多选i绑定点击事件
    $.each($i, function() {
        $(this).unbind("click");
		$(this).bind("click", function() {
            $(this).toggleClass("chbackground");
		});
    });

    //augurit:在多选复选框上选中当前已单选中的项
	var selectedAObj = spanObj.parent("a.selected");
    selectedAObj.removeClass('selected');
    selectedAObj.find("i").addClass('chbackground');

    $selectDiv.find("span").bind("click", function() {
        $(this).siblings("i").toggleClass("chbackground");
    });
    //隐藏更多按钮
    $selectDiv.children().siblings("div").show();
}
//更多按钮点击事件
function moreBtnClick(_this) {
    //_this ：更多按钮
    //选项组div
    var $selectDiv = $(_this).parent("section").siblings("div");
    //设置选项组高度切换
    $selectDiv.toggleClass("divMulti");
    $(_this).prev("a").hide();
    $(_this).hide();
    $(_this).next("a").removeClass("hidden").show();
    //屏蔽选项组中的确认取消按钮
    $selectDiv.children().siblings("div").hide();

    var spanObj = $selectDiv.find("span");
    spanObj.unbind("click");
    spanObj.removeAttr("onclick");
    $selectDiv.find("span").bind("click", function() {
        onclickFor(this);
    });
}

function shouqi(_this) {
    //_this ：收起按钮
    //选项组div
    var $selectDiv = $(_this).parent("section").siblings("div");
    //设置选项组高度切换
    $selectDiv.toggleClass("divMulti");
    $(_this).hide();
    $(_this).prev("a").show();
    $(_this).prev("a").prev("a").show();
    $selectDiv.find("i").removeClass("ch").removeClass("chbackground");
    //屏蔽选项组中的确认取消按钮
    $selectDiv.children().siblings("div").hide();
    var spanObj = $selectDiv.find("span");
    spanObj.unbind("click");
    spanObj.removeAttr("onclick");
    $selectDiv.find("span").bind("click", function() {
        onclickFor(this);
    });

    //augurit:原来选中项，取消时需保留
    var yixuanParentId = spanObj.attr('data-parent_id');
    $.each($.fn.commonSearch.RequestPramData, function(index, value) {
        if(value){
            if(yixuanParentId == value.columnName) {
                var requestData = value.requestData
                $.each(requestData, function(index, va) {
                    $selectDiv.find('a[data-id="'+va.columnValue+'"]').addClass('selected');
                });
            }
        }
    });
}

function multiCancel(_this) {
    //_this ：取消按钮
    //选项组div
    var $selectDiv = $(_this).parent("div").parent("div");
    //设置选项组高度切换
    $selectDiv.toggleClass("divMulti");
    $selectDiv.find("i").removeClass("ch").removeClass("chbackground");
    //屏蔽选项组中的确认取消按钮
    $selectDiv.children().siblings("div").hide();
    $selectDiv.siblings("section").children("a:first-child").show().next("a").show().next("a").hide();
    var spanObj = $selectDiv.find("span");
    spanObj.unbind("click");
    spanObj.removeAttr("onclick");
    $selectDiv.find("span").bind("click", function() {
        onclickFor(this);
    });

    //augurit:原来选中项，取消时需保留
    var yixuanParentId = spanObj.attr('data-parent_id');
    $.each($.fn.commonSearch.RequestPramData, function(index, value) {
        if(value){
            if(yixuanParentId == value.columnName) {
            	var requestData = value.requestData
                $.each(requestData, function(index, va) {
                    $selectDiv.find('a[data-id="'+va.columnValue+'"]').addClass('selected');
				});
            }
        }
    });
}

function multiSave(_this) {
    //_this ：确认按钮
    //选项组div
    var $selectDiv = $(_this).parent("div").parent("div");
    var _parentId = null;
    var _parentName = null;
    var paramArray = new Array();
    $.each($selectDiv.find("i"), function() {
        if($(this).hasClass("chbackground")) {
            var parentId = $(this).attr("data-parent_id");
            var parentName = $(this).attr("data-parent_title");
            var id = $(this).attr("data-id");
            var name = $(this).attr("data-name");
            _parentId = parentId;
            _parentName = parentName;
            var param = {
                columnValue: id,
                columnValueName: name
            }
            paramArray.push(param);

            //augurit:确定多选后，在列表中选中多选的项
            $selectDiv.find("a[data-id='"+id+"']").addClass("selected");
        }
    });
    if(_parentId != null) {
        var requestData = {
            columnName: _parentId,
            parentName: _parentName,
            requestData: paramArray
        };
        onclickForBuildDIV(requestData);
        $.fn.commonSearch.RequestPramData.push(requestData);

        //多选确定时去掉全部选中效果
        $('#allA_'+_parentId).removeClass("selected");
    };

    //关闭多选div
    multiCancel(_this);
    Get_AJAX();
}

function onclickForBuildDIV(requestData) {
    var parentId = requestData.columnName;
    var parentName = requestData.parentName;
    var nameShow = "";
    for(var i = 0; i < requestData.requestData.length; i++) {
        var id = requestData.requestData[i].columnValue;
        var name = requestData.requestData[i].columnValueName;
        nameShow = nameShow + name + "、";

    }

    //augurit:判断是否存在当前类型的选中项
    var yixuanNavObj = $(".yixuanNavList").find('a[data-parent_id="'+parentId+'"]');
    if(yixuanNavObj.length>0){
        yixuanNavObj.remove();
        resetData(parentId);
    }

    var $aa = $('<a data-parent_id="' + parentId + '">' + parentName + '：' + nameShow.substr(0, nameShow.length - 1) + '<span class="tit-close">×</span></a>');
    $(".yixuanNavList").append($aa);
    $aa.bind("click", function() {
        $(this).remove();
        resetData(parentId);
        var delParentId = $(this).attr("data-parent_id");
        $("#" + parentId).show();
        //$("#" + parentId).find("span").unbind("click");

        var spanObj = $("#" + parentId).find("span");
        spanObj.unbind("click");
        spanObj.removeAttr("onclick");

        //augurit:取消选中效果
        spanObj.parent("a").removeClass("selected");

        $("#" + parentId).find(".jzq span").bind("click", function() {
            onclickFor(this);
        });

        //在点击取消选择的时候，选中全部项
        $('#allA_'+parentId).addClass('selected');
    });
    //augurit:取消隐藏
    //$("#" + parentId).hide();

    //显示清空按钮
    var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
    clearAllBtnObj.css('display','block');
}

//点击选中触发方法
function onclickFor(_this) {
	//augurit:加入选中效果,先把原有选中效果取消再勾选
    $.each($(_this).parent("a").parent("p").parent('div').find('a'), function() {
        if($(this).hasClass("selected")) {
            $(this).removeClass('selected');
        }
    });
	$(_this).parent("a").addClass("selected");

    var parentId = $(_this).attr("data-parent_id");
    var parentName = $(_this).attr("data-parent_title");
    var id = $(_this).attr("data-id");
    var name = $(_this).attr("data-name");
    var paramArray = new Array();

    if(typeof(id) != "undefined") {
        //augurit:判断是否存在当前类型的选中项
        var yixuanNavObj = $(".yixuanNavList").find('a[data-parent_id="'+parentId+'"]');
        if(yixuanNavObj.length>0){
            yixuanNavObj.remove();
            resetData(parentId);
		}

        var $aa = $('<a data-parent_id="'+parentId+'">' + parentName + '：' + name + '<span class="tit-close">×</span></a>');
        $(".yixuanNavList").append($aa);
        $aa.bind("click", function() {
            //augurit:取消选中效果
            $(_this).parent("a").removeClass("selected");

            $(this).remove();
            $("#" + parentId).show();
            resetData(parentId);

            //在点击取消选择的时候，选中全部项
            $('#allA_'+parentId).addClass('selected');
        });
        //augurit:去掉隐藏
        //$("#" + parentId).hide();
        var param = {
            columnValue: id,
            columnValueName: name
        };
        paramArray.push(param);
        var requestData = {
            columnName: parentId,
            parentName: parentName,
            requestData: paramArray
        };
        $.fn.commonSearch.RequestPramData.push(requestData);
    }

    Get_AJAX();

    //显示清空按钮
    var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
    clearAllBtnObj.css('display','block');
}

//取消选择
function resetData(parentId) {
    $.each($.fn.commonSearch.RequestPramData, function(index, value) {
    	if(value){
            if(parentId == value.columnName) {
                $.fn.commonSearch.RequestPramData.remove(index);
            }
		}
    });
    Get_AJAX();
}

function Get_AJAX() {
    var rUrl = $.fn.commonSearch.RequestUrl;
    var result = null;
    //原来metronic表格的查询设置参数,执行查询
    // datatable.ajaxParams  = initMetronic5Params($.fn.commonSearch.RequestPramData);
    // datatable.search(datatable.ajaxParams);

    //2018-08-03 新的bootstrapTable 查询
    bootstrapTable.bootstrapTable('refresh');

    $.fn.commonSearch.callback($.fn.commonSearch.RequestPramData);

    if($.fn.commonSearch.RequestPramData.length==0){
        //隐藏清空按钮
        var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
        clearAllBtnObj.css('display','none');
    }
}

//按照metronic5 拼接参数
function initMetronic5Params(requestPramData){
    var ajaxParams  = [];
    if(requestPramData && requestPramData.length>0){
        $.each(requestPramData, function(index, value) {
            if(value){
                var queryName = value.columnName;
                var requestData = value.requestData;
                var columnValue = "";
                $.each(requestData, function(i, val) {
                    if(val){
                        columnValue = columnValue + val.columnValue + ",";
                    }
                });
                if(columnValue.length>0)
                    columnValue = columnValue.substring(0,columnValue.length-1);
                ajaxParams.push({'name':queryName,'value':columnValue}) ;
            }
        });
    }
    return ajaxParams;
}

Array.prototype.remove = function(dx) {
    if(isNaN(dx) || dx > this.length) {
        return false;
    }
    for(var i = 0, n = 0; i < this.length; i++) {
        if(this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

//全部
function searchAll(_this){
    $(_this).removeClass('selected');
    $(_this).addClass('selected');
    var id  = $(_this).parent("p").parent("div").parent("article").attr("id");

    var yixuanNavObj = $(".yixuanNavList").find('a[data-parent_id="'+id+'"]');
    if(yixuanNavObj.length>0){
        yixuanNavObj.remove();
        resetData(id);
    }
    var yixuanItems = $(_this).parent("p").find('a[data-parent="'+id+'"][class="selected"]');
    if(yixuanItems.length>0){
        $.each(yixuanItems, function() {
            $(this).removeClass("selected");
        });
    }
}

//收起/展开查询栏
function collapseExpansionSearch(formTableId, className) {

    var element = $('.' + className);
    var height = $("#" + mdatatableId).height() + 74;
    var h;
    if (element.hasClass('on')) {  //收起
        //that.find('span').html("展开选项<i class='fa fa-angle-up'></i>");
        //element.addClass("fadeOutUp");
        //element.addClass("animated");
        element.removeClass('on');
        $('#'+formTableId).css('padding-top:',0);
        h = window.innerHeight - 183;// >= 609 ? window.innerHeight - 183 : 609;
    } else {  //展开
        //that.find('span').html("收起选项<i class='fa fa-angle-up'></i>");
        element.addClass('on');
        //element.removeClass('fadeOutUp');
        //element.removeClass('animated');
        showOrHiddenMoreBtn();
        $('#'+formTableId).css('padding-top:',33);
        h = window.innerHeight - 217 - element.height(); //>= 609 ? window.innerHeight - 217 - element.height() : 609;
    }
    height = height > h ? height : h;
    //刷新表格高度
    bootstrapTable.bootstrapTable("resetView",{height:height});
}

//显示或者隐藏更多按钮
function showOrHiddenMoreBtn(){
    var selDiv = $('div .jzq');
    $.each(selDiv, function() {
        var pHeight = $(this).find('p').height();
        var parentId = $(this).parent('article').attr('id');
        $('#'+parentId+'_moreBtn').addClass('hidden');
        if(pHeight>48){
            $('#'+parentId+'_moreBtn').removeClass('hidden');
        }
    });
}

//清空查询条件
function clearAllCondition(){
    var yixuanNavListObj = $('.yixuanNavList');
    var yixuanAObjs = yixuanNavListObj.find('a');

    $.each(yixuanAObjs,function(){
        var keywordAId = $(this).attr('id');
        if(keywordAId){
            resetData('keyword');
            $("#searchInput_keyword").val(null);
        }else{
            var parentId = $(this).attr('data-parent_id');
            $('#'+parentId).find('div[class="jzq"]').find('p').find('a[class="selected"]').removeClass("selected");
            resetData(parentId);
            //在点击取消选择的时候，选中全部项
            $('#allA_'+parentId).addClass('selected');
            //如果是输入框则清空
            if($('#'+parentId).length > 0 && $('#'+parentId)[0].tagName == "INPUT"){
                $('#'+parentId).val("");
            }
        }
        $(this).remove();
    });

    Get_AJAX();
}

//输入框输入时触发
function keywordChange(){
    var keywordVal = $("#searchInput_keyword").val();
    var keywordSpanObj = $("#keyword_span");

    if(keywordVal&&keywordVal!=''){
        if(keywordSpanObj.length>0){
            resetData("keyword");
            keywordSpanObj.html(keywordVal+ '（关键字）');
        }else{
            var $aa = $('<a id="keywordForA"><span id="keyword_span">' + keywordVal + '（关键字）</span><span class="tit-close">×</span></a>');
            $(".yixuanNavList").append($aa);
            $aa.bind("click", function() {
                $(this).remove();
                resetData("keyword");
                $("#searchInput_keyword").val(null);
            });
        }

        var paramArray = new Array();
        var param = {
            columnValue: keywordVal,
            columnValueName: "keyword"
        };
        paramArray.push(param);
        var requestData = {
            columnName: "keyword",
            parentName: "关键词",
            requestData: paramArray
        };
        $.fn.commonSearch.RequestPramData.push(requestData);
    }else{
        resetData("keyword");
        $('#keywordForA').remove();
    }
    setTimeout(Get_AJAX(),10000);
}

//初始化日期类查询控件
function initDateQuery() {
    var item = [];
    $(".bootstrap-date-query").each(function () {
        var id = [$(this)[0].id];
        var type = $(this).attr("date-type");
        item.push({id:id,type:type});
    });
    for(var i=0; i<item.length; i++){
        if(item[i].type == "datetime"){
            agcloud.bpm.form.metronic.createDateInput(item[i].id,null,doDateQuery);
        }else{
            agcloud.bpm.form.metronic.createDateInput(item[i].id,"yyyy-mm-dd",doDateQuery);
        }
    }
}

//日期字段值提交处理
function doDateQuery(_this) {

    var node = _this.currentTarget;//日期控件所在的input框对象
    var date = _this.date;//当前选择的日期值
    var parentName = $(node).attr("parent_title");
    var dateType = $(node).attr("date-type");
    var id = $(node).attr("id");//注意：区间类型的查询条件不是使用 parentId作为key，而是其本身的name
    var value = getDateStr(dateType,date);
    var paramArray = new Array();
    if(!checkRangeQuery(id,value)){
        return;
    }
    if(typeof(date) != "undefined") {
        //augurit:判断是否存在当前类型的选中项
        var yixuanNavObj = $(".yixuanNavList").find('a[data-parent_id="'+ id +'"]');
        if(yixuanNavObj.length>0){
            yixuanNavObj.remove();
            resetData(id);
        }
        var $aa = $('<a data-parent_id="'+ id +'">' + parentName + '：' + value + '<span class="tit-close">×</span></a>');
        $(".yixuanNavList").append($aa);
        $aa.bind("click", function() {
            $(this).remove();
            $(node).val("");
            resetData(id);
        });
        var param = {
            columnValue: value,
            columnValueName: id,
        };
        paramArray.push(param);
        var requestData = {
            columnName: id,
            parentName: parentName,
            requestData: paramArray
        };
        $.fn.commonSearch.RequestPramData.push(requestData);
    }
    Get_AJAX();
    //显示清空按钮
    var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
    clearAllBtnObj.css('display','block');
}

//初始化数字类查询控件
function initNumberQuery() {
    $(".bootstrap-number-query").on("keyup",function () {
        var self = $(this);
        var id = self[0].id;
        var parentName = self.attr("parent_title");
        var value = self.val();
        var paramArray = new Array();
        if(!checkRangeQuery(id,value)){
            return;
        }
        if(typeof(value) != "undefined" && value != "") {
            //augurit:判断是否存在当前类型的选中项
            var yixuanNavObj = $(".yixuanNavList").find('a[data-parent_id="'+ id +'"]');
            if(yixuanNavObj.length>0){
                yixuanNavObj.remove();
                resetData(id);
            }
            var $aa = $('<a data-parent_id="'+ id +'">' + parentName + '：' + value + '<span class="tit-close">×</span></a>');
            $(".yixuanNavList").append($aa);
            $aa.bind("click", function() {
                $(this).remove();
                self.val("");
                resetData(id);
            });
            var param = {
                columnValue: value,
                columnValueName: id,
            };
            paramArray.push(param);
            var requestData = {
                columnName: id,
                parentName: parentName,
                requestData: paramArray
            };
            $.fn.commonSearch.RequestPramData.push(requestData);
        }
        Get_AJAX();
        //显示清空按钮
        var clearAllBtnObj = $('.yixuan').find('.clear-all-conditions');
        clearAllBtnObj.css('display','block');
    });
}

//校验区间查询的有效性
function checkRangeQuery(nodeId,value) {
    var flag = true;
    if(nodeId.indexOf("__start") != -1){
        var otherNodeId = "#" + nodeId.replace("__start","__end");
        var otherValue = $(otherNodeId).val();
        if(otherValue != "" && value > otherValue ){
            flag = false;
        }
    }else if(nodeId.indexOf("__end") != -1){
        var otherNodeId = "#" + nodeId.replace("__end","__start");
        var otherValue = $(otherNodeId).val();
        if(otherValue != "" && value < otherValue ){
            flag = false;
        }
    }
    if(!flag){
        var message = "非法查询值";
        if($("#" + nodeId).hasClass("bootstrap-number-query")){
            message = "最小值不能大于最大值";
        }else if($("#" + nodeId).hasClass("bootstrap-date-query")){
            message = "起始日期不能晚于结束日期";
        }
        agcloud.ui.metronic.showErrorTip(message,1000);
    }
    return flag;
}

//清空查询框内容
function clearBtnClick(node) {
    var id = node.id.replace("_clearBtn","");
    $("#" + id +" input").each(function () {
        var attr = $(this).attr("parent_id");
        if(attr == id){
            $(this).val('');
        }
    });
}
//根据日期格式 获取日期值
function getDateStr(type,date) {
    if("datetime" == type){
        return agcloud.utils.dateTimeFormat(date.getTime());
    }else if("date" == type){
        return agcloud.utils.dateFormat(date.getTime());
    }
}