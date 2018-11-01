var tableComponetId='';//列表组件ID
var search_btn_Id='';//查询按钮组件ID
var advance_search_form_id='';//高级查询form的ID
var preQuestViewId=$('#preViewId').val();
var preQuestViewCode=$('#preViewCode').val();
var global_url=ctx + '/front/dynamic/view/getPageViewData.do?viewId='+preQuestViewId;//分页查询数据
var global_metacol_url=ctx + '/front/dynamic/view/getViewTableItems.do?viewId='+preQuestViewId;//查询初始化的字段信息
var global_dicCodeItems_url=ctx+'/front/dynamic/view/getDicCodeItems.do';//数据字典的初始化数据查询
var isAdvanceSearcPaneShow=true;//初始显示高级查询
var isDebugVar=false;  //辅助调试JS用函数,是否打印
var isShowCaller=false;  //辅助调试JS用函数,是否查看调用方法
var searchNumPerLine=4; //每行最大多少个 搜索输入框
var dateInputNames=[];//日期控件数组
var dateTimeInputNames=[];//日期控件数组
var comboboxInputObjs=[];//下拉框控件数组
var comboboxtreeInputObjs=[];//树形下拉框数组

$(function () {

    $.ajax(global_metacol_url)
        .done(function (data) {
            initAdvanceSearchForm(data);

            testDicCodeApi();
            //todo DatatableDataLocalDemo 控件的参数需要清楚 ,否则页面仍然会使用上一次请求的参数去请求页面

            //初始ajax 为table初始化提供table head 表头字段COLUMNS
            //初始化 mertronic5 的datatable控件
            DatatableDataLocalDemo.init(data, $('#v5table'));

            //日期组件初始化
            BootstrapDatepicker.init();
            //初始化 其他搜索输入框  ps：搜索按钮已经在datatables中初始化

        }).done(function () {
            //datatable初始化完成之后的操作

        });
});


/***
 * 定义table组件,类定义
 * @type {{init}} 此定义有return 返回init初始化函数,此结构为闭包
 */
var DatatableDataLocalDemo = function () {

    //initializer 初始化  接收ajax查询返回的数据tmp
    var instance = function (tmp,jqueryInput) {

        //本体定义, jquery获取web 组件,调用 自身构造方法  mDatatable
        showDebugVarInfo(tmp);
        var dataSetMeta={};
        var datatable = jqueryInput.mDatatable({

           /* 数据属性,默认分页页面大小为10*/
            data: {
                type: 'remote',  //还有一种为local 但是无法控制
                source: {
                    read: {
                        url:global_url
                    },
                },
                //pageSize: 5, // display 20 records per page

                totol:100,

                serverPaging: true,

                serverFiltering: true,

                serverSorting: true

            },

            //是否开启控件排序
            sortable: true,

            //是否支持控件分页
            pagination: true,

            //条件查询控件绑定
            search: {
                onEnter: true, //开启回车查询

                input: $('#generalSearch')          //查询的文本
            },

            // layout definition        布局定义
            layout: {
                theme: 'default', // datatable theme

                class: '', // custom wrapper class

                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.

                //height: 'auto', // datatable's body's fixed height

                height: null,

                width: 'auto',

                footer: false // display/hide footer
            },
            // layout definition
            /* layout: {
                scroll: false,
                footer: false
            },*/

            //工具条的默认设置
            toolbar: {
                // toolbar placement can be at top or bottom or both top and bottom repeated
                placement: ['bottom'],
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [ 3, 5, 10,100,-1] // display dropdown to select pagination size. -1 is used for "ALl" option
                    },
                }
            },

            // 表头字段定义
          columns: paraeElementColumn(tmp.metainfo)//paraeElementColumn(tmp.metainfo)

        });

        //查询 事件绑定
        var query = datatable.getDataSourceQuery();
        console.log(datatable);//dataSet可以看到数据
        //查询按钮
        $("#tableQueryBtn").click(function(){

           // datatable.setDataSourceQuery({'viewComment':$("#generalSearch").val()});

            //此处需为动态字段,遍历 查询初始化获得的 column,获取到 value以及 id 以及name
            //按照  name: $('#'+id).val() 方式获取 表单值  或者 直接jquery取表单 queryJson

            var queryName=$("#generalSearch").attr('name');

            //alert(queryName);
            if(!isAdvanceSearcPaneShow){

                datatable.ajaxParams[0]=
                    {'name':queryName, 'value':$("#generalSearch").val()
                };

            }else{

                datatable.ajaxParams=$('#search_sum_view_form_advance').serializeArray();
                datatable.ajaxParams.push({'name':queryName,'value':$("#generalSearch").val()}) ;
            }

            datatable.search(datatable.ajaxParams);
            return;

        });


    };
    //事件捕获定义  根据样式class捕获
    var eventsCapture = function () {
        // $('#v5table')               //查询链式定义
        //$('.m_datatable')

        $('#v5table').on('m-datatable--on-init', function () {
                eventsWriter('Datatable init');
            })
            .on('m-datatable--on-update-perpage', function (e, args) {

                showDebugVarInfo(args);
                eventsWriter('Update page size: ' + args.perpage);

            })
            .on('m-datatable--on-layout-updated', function () {

                eventsWriter('Layout render updated');

            }).on('m-datatable--on-goto-page', function (e, args) {
            
            eventsWriter('Goto to pagination: ' + args.page);

            });
    };

    //事件消息提示定义
    var eventsWriter = function (string) {

        console.log(string);
        //var console = $('#m_datatable_console').append(string + "\t\n");
        //$(console).scrollTop(console[0].scrollHeight - $(console).height());

    };

    return {

        // public functions  外部调用的公共函数
        init: function (tmp,jqueryInput) {

            instance(tmp,jqueryInput);//实例化

            eventsCapture();//各种其他事件
        }
    };
}();


// 批量驳回
function batchFobbit(){
    $('#sum_view_tb').html('<tr><td colspan="9" style="text-align: center;color: lightgrey;"><h3>暂无数据！</h3></td></tr>');
}

// 批量审批
function batchApprove(){
    swal('提示信息', '功能开发中,敬请期待...', 'info');
}

/***
 * 字符串的格式化渲染回调函数
 * @param row
 * @param index
 * @param datatable
 * @param myi
 * @returns {string}
 */
function formatStringLength(row, index, datatable,myi) {
    console.log(row);
    var resultTxt=row[myi]+'';
    if(resultTxt==null||resultTxt=='null') resultTxt='';
    if(resultTxt.length>20) resultTxt=resultTxt.substr(0,20)+'...';//超出20个字符,截断处理
    return resultTxt;
}

/***
 * template 回调函数  此回调函数源码经过修改
 * @param row  当前行数据
 * @param index     当前行下标
 * @param datatable 整个table对象
 * @param myi       当前列名
 * @returns {string|*}
 */
function listFormatTransfermDate (row, index, datatable,myi) {
    console.log(row);
    return formatDatetime(row[''+myi]);
}

/***
 * template回调函数
 * 此函数可能需要获取本行ID
 * @param row  当前行数据
 * @param index     当前行index
 * @param datatable 当前页面的table对象
 * @param myi       当前列列名,修改源码之后的扩展属性 TODO
 * @returns {string}
 */
function createRowButton(row, index, datatable,myi) {debugger
    //获取主键字段
    //showDebugVarInfo(fetchFieldForPrimaryKey(datatable.options.columns));

    var priCol=fetchFieldForPrimaryKey(datatable.options.columns);
    /*var content ='<button class="btn btn-success" type="button" onclick="editSumViewById(\''+123+'\');">同意</button>&nbsp;'+
        '<button class="btn btn-warn" type="button" onclick="editSumViewById(\''+123+'\');">转发</button>&nbsp;'+
        '<button class="btn btn-danger" type="button" onclick="deleteSumViewById(\''+123+'\');">驳回</button>&nbsp;';*/
    var taskId=row['TASK_ID'];
    var content='';

    if(preQuestViewCode=='leave_request_over_view' ||preQuestViewCode=='leave_request_on_view'){

        content+= '<button class="btn btn-success" disabled="true" type="button" onclick="startTask(\''+taskId+'\');">办理</button>&nbsp;'
    }else{
        content+= '<button class="btn btn-success" type="button" onclick="startTask(\''+taskId+'\');">办理</button>&nbsp;'
    }

    return content;
}

//创建 操作按钮
function newOparetionItem() {
    var item=new Object();
    item.field='op';
    item.title='操作';
    item.textAlign='center';
    item.width=200;
    item.overflow='visible';
    item.template=createRowButton;
    return item;
}

//获取本行的视图主键字段
function fetchFieldForPrimaryKey(columns) {
   for(perCol in columns){
      // showDebugVarInfo(columns[perCol]);
        if(typeof (columns[perCol]['metainfo'])!='undefined' && columns[perCol]['metainfo']!=null){
            showDebugVarInfo(columns[perCol]['metainfo']);
            showDebugVarInfo(columns[perCol]['metainfo']['isPrimary']);
           if(typeof (columns[perCol]['metainfo']['isPrimary'])=='1'){
               return columns[perCol];
           }
        }
    }
    
}

//时间格式转换
function formatDatetime(value) {
    if (value == null || value == '') {
        return '';
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else {
        dt = new Date(value);
    }
    return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(上述插件实现)
}

/*//扩展的Date的format方法 JS变量 时间戳转日期
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
}*/

/***
 * 初始化 元数据信息(搜索框)
 * @param conditionColumns
 */
function initAdvanceSearchForm(conditionColumns){

    if(isAdvanceSearcPaneShow) $('#collapseOne').collapse('show');

    //一行searchNumPerLine个搜索input,多了换行
    for(var searchItem  in conditionColumns.conditionMetaInfo){
        showDebugVarInfo(searchItem);

        //如果 搜索条件的下标大于3,然后模为4 结果为0,则在末尾添加一个新的 form-inline
        if(searchItem>(searchNumPerLine-1) && searchItem%searchNumPerLine==0){
            $('#search_sum_view_form_advance').append("<div class='form-inline'></div>");
        }

        //获取 高级查询面板中最后一个form-inline
        //添加页面控件HTML
        $('#search_sum_view_form_advance .form-inline:last').append(renderSearchHTML(conditionColumns.conditionMetaInfo[searchItem]));

    }
    //页面控件初始化方法
    renderInitDateName(dateInputNames);
    renderInitDatetimeName(dateTimeInputNames);
    renderDicCodeForAll(comboboxInputObjs);

    //判断高级搜索面板是否展开
// alert($('#collapseOne').);
/*    $('#collapseOne').on('hidden.bs.collapse', function (){
            // do something…
        isAdvanceSearcPaneShow=false;
            alert( '面板已隐藏！');
        }
    );
    $('#collapseOne').on('show.bs.collapse', function (){
            // do something…
        isAdvanceSearcPaneShow=true;
            alert( '面板已展开！');
        }
    );*/
}

function renderSelector() {
    //如果数据字典 类型编码不为空,直接获取数据字典数据组成下拉框

    return '';
}

/***
 *  根据后端传递的搜索列参数 渲染搜索框
 * @param searchColItem
 * @returns {jQuery}
 */
function renderSearchHTML(searchColItem) {

        var mutiSelectValue='';
        var mutiSelectTag='';

       //字段说明label
       var itemBegin='<label class="control-label" style="width: 40%">'+searchColItem.listComment.substr(0,6)+'</label>';

       var searComponentHtml=itemBegin;

       //判断页面组件类型  fieldHtmlComp
        if(searchColItem.fieldHtmlComp==null || typeof (searchColItem.fieldHtmlComp)== 'undefined') {
           //强制为1
            searchColItem.fieldHtmlComp='1';
        }

        console.log('searchColItem.fieldHtmlComp:'+searchColItem.fieldHtmlComp);
        //判断页面组件类型
        // HTML控件类型，普通字符输入框（STRING） = 1;整型数字输入框（INTEGER） = 2;浮点数字输入框（FLOAT） = 3;
        // 多行文本框（TEXTAREA） = 4;日期框（DATE） = 5;下拉框（SELECT） = 6;复选框（CHECKBOX） = 7;单选框（RADIO） = 8;
        // 附件（ATTACHMENT） = 9;图片（PICTRUE） = 10;日期时间框（DATETIME）=20;

        switch(searchColItem.fieldHtmlComp)
        {
            case '1'://普通字符输入框（STRING） = 1
            case '2'://整型数字输入框（INTEGER） = 2
            case '3'://浮点数字输入框（FLOAT） = 3
                searComponentHtml+='<input class="form-control" style="width: 60%" name="'+searchColItem.listName+'" type="text" placeholder="请输入'+searchColItem.listComment+'" />';
                //执行代码块1
                break;
            case '4'://多行文本框（TEXTAREA） = 4
                searComponentHtml+='<input class="form-control" style="width: 60%" name="'+searchColItem.listName+'" type="text" placeholder="请输入'+searchColItem.listComment+'" />';
                break;
            case '5'://日期框（DATE） = 5

                //判断操作符
                if(valueIsValid(searchColItem.queryCondition) && searchColItem.queryCondition=='eq'){

                    searComponentHtml+=

                    '<div class="input-group date" style="width: 60%" id="'+searchColItem.listName+'"><input type="text" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>';

                    //加入日期控件渲染数组
                    dateInputNames.push(searchColItem.listName);
                }

                break;
            case '6'://  下拉框


                if(valueIsValid(searchColItem.fieldDicCodeType)){

                    mutiSelectValue=searchColItem.fieldMultiSelect;

                    //非多选框
                    if(valueIsValid(mutiSelectValue) && mutiSelectValue==0){

                        mutiSelectTag='';

                    //多选框
                    }else if(valueIsValid(mutiSelectValue) && mutiSelectValue==1){
                        mutiSelectTag='multiple';
                    }

                    //构造selector
                    searComponentHtml+='<select data-width="60%"  id="'+searchColItem.listName+'" class="selectpicker"  data-live-search="true" '+
                        'name="'+searchColItem.listName+'" type="text"  '+mutiSelectTag+'></select>';


                    comboboxInputObjs.push({'id':searchColItem.listName,'dicTypeCode':searchColItem.fieldDicCodeType});

                }

                // 执行代码块 2
                break;
            case '7'://复选框（CHECKBOX） = 7


                break;
            case '8'://单选框（RADIO） = 8


                break;
            case '9'://附件（ATTACHMENT） = 9
                break;
            case '10'://图片（PICTRUE） = 10
                break;
            case '20'://日期时间框（DATETIME）=20

                //判断操作符
                if(valueIsValid(searchColItem.queryCondition) && searchColItem.queryCondition=='eq'){

                    searComponentHtml+=

                        '<div class="input-group date" style="width: 60%" id="'+searchColItem.listName+'"><input type="text" name="'+searchColItem.listName+'" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>';

                    //加入日期控件渲染数组
                    dateTimeInputNames.push(searchColItem.listName);
                }

                break;
            default:
                // n 与 case 1 和 case 2 不同时执行的代码
        }

        var formgroupTag='<div class="form-group col-md-3"></div>';
        var itemHtml=$(formgroupTag).html(searComponentHtml);

        showDebugVarInfo(itemHtml);
        return itemHtml;
}

//解析页面元素
// 生成list列
function paraeElementColumn(colArrays) {

    console.log(colArrays);

    colArrays= $.map(colArrays, function(item, indexCol) {
        delete  item.template;   //在没有template的字段去除 tempalte回调函数

        item.resizable=true;

        if(item['listHidden']=='1' && item['IS_PRIMARY']!='1'){

            console.log(item.listName);
            //判断隐藏的主键列信息,目前不做处理
            return;
        }
        if( typeof(item['field'])=='undefined' )
            item['field']=item.listName;//元素字段名

        if(typeof(item['title'])=='undefined')
            item['title']=item.listComment;//元素字段标题名称

        if(typeof(item['width'])=='undefined')
            item['width']= (item.listWidth==0)?200:item.listWidth;//元素在列表中占宽

        if(typeof(item['sortable'])=='undefined' && item['dataType']!='CLOB'){// CLOB字段目前不支持排序,经测试在SQL中直接order by Clob字段会报错
            item['sortable']=true;//item.listOrder=="1"?true:false;  是否允许排序
        }else{
            item['sortable']=false;
        }

        if(typeof(item['dataType'])!='undefined' && item['dataType']!=null&& item['dataType'].indexOf('DATE')>-1){ //时间字段的格式化

            showDebugVarInfo("indexCol:"+indexCol);
            item.template=listFormatTransfermDate;

        }else if(typeof(item['dataType'])!='undefined' && item['dataType']!=null&&  item['dataType'].indexOf('CHAR')>-1){//字符串格式渲染
            item.template=formatStringLength;
        }else{
            delete  item.template;
        }

        //似乎高度设置了没用
        item.height=50;

        return item;
    });

    showDebugVarInfo(colArrays);
    //最后一行,添加  操作div() 子项
    colArrays.push(newOparetionItem());

    //添加最后一项  操作
    showDebugVarInfo(colArrays);
    return colArrays;
}

//无效字符的判断
function valueIsValid(obj) {
    //四个表达式判断空
    if(obj==null ) return false;
    if(typeof(obj)=='undefined') return false;
    if(obj=='') return false;
    if(obj.replace(/(^s*)|(s*$)/g,"").length ==0)return false;
    return true;
}

//是否在控制台打印
function showDebugVarInfo(arg){
    if(isShowCaller){console.log(showDebugVarInfo.caller);}
    if(isDebugVar)console.log(arg);
}




/**
 * 根据 数据字典typeCode以及 下拉框组件ID渲染下拉搜索框
 * @param dicTypeCode
 * @param inputId
 */
function renderDicCodeSelectors(dicTypeCode,inputId) {
    if(comboboxInputObjs.length==0)return;
    $.ajax({
        url:global_dicCodeItems_url,
        data:{'dicTypeCode':dicTypeCode},
        success:function (result) {
             console.log(result);
            if(inputId){
                var optionHtml='';
                for(index in result){
                    optionHtml+='<option value="'+result[index]['itemCode']+'">';
                    optionHtml+=result[index]['itemName'];
                    optionHtml+='</option>';
                }
                $('#'+inputId).html(optionHtml);
            }
        }
    });

}

//渲染所有非树形下拉框
function renderDicCodeForAll(args) {
    console.log(args);
    for(var comboboxIndex in args){
        //渲染下拉框选项
        renderDicCodeSelectors(args[comboboxIndex]['dicTypeCode'],args[comboboxIndex]['id']);
    }
}

function renderInitDateName(args ) {
    if(args.length==0)return;
    for(var arrayInex in args){
        $('#'+args[arrayInex]).datepicker({
            format: 'yyyy-mm-dd',
            language: 'zh',
            todayHighlight: true,
            autoclose: true,
            pickerPosition: 'bottom-left',
            todayBtn: true,
        });

    }
}
function renderInitDatetimeName(args ) {
    if(args.length==0)return;
    for(var arrayInex1 in args) {
        $('#' + args[arrayInex1]).datetimepicker({
            // format: 'yyyy-mm-dd hh:ii',
            language: 'zh',
            todayHighlight: true,
            autoclose: true,
            pickerPosition: 'bottom-left',
            todayBtn: true,
        });
    }

}

function testDicCodeApi() {
    $.ajax({
        url: ctx+'/bsc/dic/code/lgetItemsByTypeCode.do?typeCode=tmn_software_type&flag=false',
        success:function (data) {
            console.log(data);
            
        }
    });
}