var tableComponetId='';//列表组件ID  mdatatableId
var search_btn_Id='';//查询按钮组件ID
var advance_search_form_id='';//高级查询form的ID
var colItemsNameInServer='tHeadItems';

var preQuestViewId=$('#preViewId').val();
var preQuestViewCode=$('#preViewCode').val();
var global_url=ctx + '/front/dynamic/view/getPageViewData.do?viewId='+preQuestViewId;//分页查询数据
var global_metacol_url=ctx + '/front/dynamic/view/getViewTableItems.do?viewId='+preQuestViewId;//查询初始化的字段信息
var global_dicCodeItems_url=ctx+'/front/dynamic/view/getDicCodeItems.do';//数据字典的初始化数据查询


var isAdvanceSearcPaneShow=true;//初始显示高级查询
var isDebugVar=false;  //辅助调试JS用函数,是否打印
var isShowCaller=false;  //辅助调试JS用函数,是否查看调用方法
var searchNumPerLine=4; //每行最大多少个 搜索输入框

var datatable;

$(function () {

    $.ajax(global_metacol_url)
        .done(function (colItemsdata) {
            //console.log(colItemsdata);
            // testDicCodeApi();
            //todo DatatableDataLocalDemo 控件的参数需要清楚 ,否则页面仍然会使用上一次请求的参数去请求页面

            //初始ajax 为table初始化提供table head 表头字段COLUMNS
            //初始化 mertronic5 的datatable控件
            DatatableDataLocalDemo.init(colItemsdata, $('#'+mdatatableId));

            //日期组件初始化
            //初始化 其他搜索输入框  ps：搜索按钮已经在datatables中初始化

        }).done(function () {
        //datatable初始化完成之后的操作
        // datatable.reload();
    });
});


/***
 * 定义table组件,类定义
 * @type {{init}} 此定义有return 返回init初始化函数,此结构为闭包
 */
var DatatableDataLocalDemo = function () {

    //initializer 初始化  接收ajax查询返回的数据 colItems
    var instance = function (colItems,jqueryInput) {

        //本体定义, jquery获取web 组件,调用 自身构造方法  mDatatable
        showDebugVarInfo(colItems);
        var dataSetMeta={};
        datatable = jqueryInput.mDatatable({

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
                input: $('#'+queryInput_name_mykey)          //查询的文本  ,绑定 query的 name
            },

            // layout definition        布局定义
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.

                //height: 'auto', // datatable's body's fixed height
                footer: false // display/hide footer
            },

            //工具条的默认设置
            toolbar: {
                placement: ['bottom'],
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [ 3, 5, 10,100] //-1为所有 display dropdown to select pagination size. -1 is used for "ALl" option
                    },
                }
            },

            // 表头字段定义
            columns: paraeElementColumn(colItems[colItemsNameInServer+''])//paraeElementColumn(colItems.metainfo)

        });

        //查询 事件绑定
        var query = datatable.getDataSourceQuery();
        //console.log(datatable);//dataSet可以看到数据
        //查询按钮
        $("#tableQueryBtn").click(function(){

            // datatable.setDataSourceQuery({'viewComment':$("#generalSearch").val()});

            //此处需为动态字段,遍历 查询初始化获得的 column,获取到 value以及 id 以及name
            //按照  name: $('#'+id).val() 方式获取 表单值  或者 直接jquery取表单 queryJson

            var queryName=$("#generalSearch").attr('name');

            //alert(queryName);
            if(!isAdvanceSearcPaneShow){//普通查询
                datatable.ajaxParams[0]=
                    {'name':queryName, 'value':$("#generalSearch").val()
                    };
            }else{//条件查询
                datatable.ajaxParams=$('#search_sum_view_form_advance').serializeArray();
                datatable.ajaxParams.push({'name':queryName,'value':$("#generalSearch").val()}) ;
            }

            datatable.search(datatable.ajaxParams);
            return;

        });


    };
    //事件捕获定义  根据样式class捕获
    var eventsCapture = function () {
    };

    //事件消息提示定义
    var eventsWriter = function (string) {
        console.log(string);
    };

    return {

        // public functions  外部调用的公共函数
        init: function (colItems,jqueryInput) {

            instance(colItems,jqueryInput);//实例化

            eventsCapture();//各种其他事件
        }
    };
}();



/***
 * 字符串的格式化渲染回调函数
 * @param row
 * @param index
 * @param datatable
 * @param myi
 * @returns {string}
 */
function formatStringLength(row, index, datatable,myi) {
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
function createRowButton(row, index, datatable,myi) {
    //获取主键字段
    //showDebugVarInfo(fetchFieldForPrimaryKey(datatable.options.columns));
    var priCol=fetchFieldForPrimaryKey(datatable.options.columns);

    var taskId = row.TASK_ID;
    var content='';

    var rowData = JSON.stringify(row);

    //循环遍历渲染按钮
    var btnWidgets = row.btnWidgetRenderers;
    if(btnWidgets&&btnWidgets.length>0){
        for(var i = 0; i <btnWidgets.length; i++){
            var btnStr = btnWidgets[i].widgetRenderer;
            btnStr = btnStr.replace("#[id]",taskId);
            content+= btnStr;
        }
    }
    if(preQuestViewCode=='view-code-00000021' ){
        content+= '<button class="btn btn-info" type="button" onclick=\'editProblem('+rowData+');\'>编辑</button>&nbsp;'
    }

    return content;
}

//创建 操作按钮
function newOparetionItem() {
    var item=new Object();
    item.field='op';
    item.title='操作';
    item.textAlign='center';
    item.width=80;
    item.overflow='visible';
    item.sortable=false;
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


//解析页面元素
// 生成list列
function paraeElementColumn(colArrays) {

    colArrays= $.map(colArrays, function(item, indexCol) {
        delete  item.template;   //在没有template的字段去除 tempalte回调函数

        item.resizable=true;

        if(item['listHidden']=='0' && item['IS_PRIMARY']!='1'){
            //判断隐藏的主键列信息,目前不做处理
            return;
        }
        if( typeof(item['field'])=='undefined' )
            item['field']=item.listName;//元素字段名

        if(typeof(item['title'])=='undefined')
            item['title']=item.listComment;//元素字段标题名称

        if(typeof(item['width'])=='undefined')
            item['width']= (item.listWidth==0)?110:item.listWidth;//元素在列表中占宽

        if(typeof(item['textAlign'])=='undefined')
            item['textAlign']=item.listAlign;//元素字段文本对齐方式

        if(typeof(item['sortable'])=='undefined')
            item['sortable'] = item.listOrder == "1" ? true : false;//元素字段是否可排序

        //判断格式化类型 并调用相应的格式化函数
        //转换选择器-回调函数
        if(valueIsValid(item['listFormatFun'])){
            item.template=eval(item['listFormatFun']);
        }else{
            delete  item.template;
        }

       /* if(typeof(item['sortable'])=='undefined' && item['dataType']!='CLOB'){// CLOB字段目前不支持排序,经测试在SQL中直接order by Clob字段会报错
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
        }*/

        //似乎高度设置了没用
        item.height=50;

        return item;
    });

    //最后一行,添加  操作div() 子项
    colArrays.push(newOparetionItem());

    //添加最后一项  操作
    //console.log(colArrays);
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
