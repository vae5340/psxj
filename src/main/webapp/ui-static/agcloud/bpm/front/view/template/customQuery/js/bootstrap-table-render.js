//全局参数 视图id和视图code
var preQuestViewId = $('#preViewId').val();
var preQuestViewCode = $('#preViewCode').val();
var global_url=ctx + '/front/dynamic/view/getBootstrapPageViewData.do?viewId='+ preQuestViewId;//分页查询数据
var global_metacol_url=ctx + '/front/dynamic/view/getViewTableItems.do?viewId='+ preQuestViewId;//查询初始化的字段信息
var colItemsNameInServer='tHeadItems';
var originColumns = null;


var bootstrapTableRender = {

    initTable : function (id,callbackOptions) {
        //源列配置信息
        originColumns = this.parseElementColumn();
        //渲染列配置信息
        var bootstrapTableColumn = this.parseToBootstrapTableColumn(originColumns,id);
        var table = this.renderByUrl(id,global_url,bootstrapTableColumn,callbackOptions);
        return table;
    },
    initTableByData : function (id,data,callbackOptions) {

    },
    renderByData : function(id,data,columns,callbackOptions){
        var self = this;
        $('#' + id).bootstrapTable({
            columns: columns,
            striped: true,
            sortOrder: "asc",
            pagination: true,
            pageSize: 10,
            pageList: [5,10,20,50,100],
            paginationHAlign: 'right',
            paginationDetailHAlign:"right",
            paginationVAlign: 'bottom',
            paginationShowPageGo: true,
            formatShowingRows: self.formatShowingRows,
            sidePagination: "client",
            data: data,
            queryParams: self.dealQueryParams,
            onClickRow : function (row, $element) {
                if(callbackOptions && callbackOptions.clickRowCallback){
                    callbackOptions.clickRowCallback(row, $element);
                }
            },
            onDblClickRow: function (row, $element) {
                if(callbackOptions && callbackOptions.dblClickRowCallback){
                    callbackOptions.dblClickRowCallback(row, $element);
                }
            },
            onClickCell : function (field, value, row, $element) {
                if(callbackOptions && callbackOptions.clickCellCallback){
                    callbackOptions.clickCellCallback(field, value, row, $element);
                }
            },
            onDblClickCell: function (field, value, row, $element) {
                if(callbackOptions && callbackOptions.dblClickCellCallback){
                    callbackOptions.dblClickCellCallback(field, value, row, $element);
                }
            },
            onLoadSuccess : function (data) {
                if(callbackOptions && callbackOptions.loadCallback){
                    callbackOptions.loadCallback(data);
                }
            }
        });
    },
    renderByUrl : function(id,url,columns,callbackOptions){
        var self = this;
        var bTable = $('#' + id ).bootstrapTable({
            columns: columns,
            sortable: true,
            sortOrder: "desc",
            sortName: self.parseDefaultOrderColumn(columns),
            pagination: true,
            pageSize: 10,
            // striped: true,
            paginationHAlign: 'right',
            paginationVAlign: 'bottom',
            paginationDetailHAlign:"right",
            paginationShowPageGo: true,
            formatShowingRows: self.formatShowingRows,
            pageList: [5,10,20,50,100],
            url: url,
            method: 'post',
            contentType: "application/x-www-form-urlencoded",
            queryParamsType: 'limit',
            sidePagination: "server",
            queryParams: self.dealQueryParams,
            onClickRow : function (row, $element) {
                if(callbackOptions && callbackOptions.clickRowCallback){
                    callbackOptions.clickRowCallback(row, $element);
                }
            },
            onDblClickRow: function (row, $element) {
                if(callbackOptions && callbackOptions.dblClickRowCallback){
                    callbackOptions.dblClickRowCallback(row, $element);
                }
            },
            onClickCell : function (field, value, row, $element) {
                if(callbackOptions && callbackOptions.clickCellCallback){
                    callbackOptions.clickCellCallback(field, value, row, $element);
                }
            },
            onDblClickCell: function (field, value, row, $element) {
                if(callbackOptions && callbackOptions.dblClickCellCallback){
                    callbackOptions.dblClickCellCallback(field, value, row, $element);
                }
            },
            onLoadSuccess : function (data) {
                if(callbackOptions && callbackOptions.loadCallback){
                    callbackOptions.loadCallback(data);
                }
            }
        });
        return bTable;
    },
    dealQueryParams : function (params) {
        //组装分页参数
        var pageNum = (params.offset / params.limit) + 1;
        var pagination = {
            page : pageNum,
            pages : pageNum,
            perpage : params.limit
        };
        var sort = {
            field : params.sort,
            sort : params.order
        };
        var queryParam = {
            pagination:pagination,
            sort:sort
        };
        //组装查询参数,commonQueryParams {name: "keyword", value: "1"}，globalSearchParams是视图查询的参数
        var searchParam = null
        if(typeof commonQueryParams != 'undefined' && commonQueryParams) {
            searchParam = commonQueryParams;
        }else if($.fn.commonSearch.RequestPramData){
            searchParam = initMetronic5Params($.fn.commonSearch.RequestPramData);
        }
        var buildParam = {};
        if(searchParam){
            for (var i = 0; i < searchParam.length; i++) {
                buildParam['query[mykey][' + i + '][name]'] = searchParam[i].name;
                buildParam['query[mykey][' + i + '][value]'] = searchParam[i].value.trim();
            }
        }
        queryParam = $.extend(queryParam, buildParam);
        return queryParam;
    },
    formatShowingRows : function (pageFrom, pageTo, totalRows) {
        return '共 ' + totalRows + ' 条';
    },
    getTableColumns : function () {
        var columns;
        $.ajax({
            url : global_metacol_url,
            type : "post",
            async : false,
            success : function (cols) {
                if(cols){
                    columns = cols[colItemsNameInServer];
                }else{
                    columns = null;
                }
            },
            error : function () {
                columns = null;
            }
        });
        return columns;
    },
    //解析页面元素,生成list列
    parseElementColumn : function () {
        var self = this;
        var colArrays = self.getTableColumns();
        if(colArrays == null){
            agcloud.ui.metronic.showErrorTip("无法加载当前视图显示数据的列信息！");
            return;
        }
        colArrays= $.map(colArrays, function(item, indexCol) {
            delete  item.template;   //在没有template的字段去除 tempalte回调函数

            if(item['listHidden'] == '0' && item['IS_PRIMARY'] != '1'){
                //判断隐藏的主键列信息,目前不做处理
                return;
            }
            if( typeof(item['field']) == 'undefined' )
                item['field'] = item.listName;//元素字段名

            if(typeof(item['title']) == 'undefined')
                item['title'] = item.listComment;//元素字段标题名称

            if(typeof(item['width']) == 'undefined')
                // item['width']= (item.listWidth==0)?110:item.listWidth;//元素在列表中占宽

            if(typeof(item['align']) == 'undefined')
                item['align'] = item.listAlign;//元素字段文本对齐方式

            if(typeof(item['defaultListOrder']) == 'undefined')
                item['defaultListOrder'] = item.defaultListOrder;//元素字段默认排序

            //判断格式化类型 并调用相应的格式化函数
            //转换选择器-回调函数
            if(self.valueIsValid(item['listFormatFun'])){
                item.formatter = eval(item['listFormatFun']);
            }else{
                delete  item.template;
            }
            return item;
        });

        //最后一行,添加  操作div() 子项
        colArrays.push(this.newOparetionItem());
        return colArrays;
    },
    //生成bootstrap-table对应的列格式，加上索引列
    parseToBootstrapTableColumn : function (cols,id) {
        var columns = [];
        //排序列
        var indexCol = {
            field: 'Number',
            title: '序号',
            align: 'center',
            width: 20,
            formatter: function (value, row, index) {
                //return index + 1;
                var pageSize = $('#' + id).bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                var pageNumber = $('#' + id).bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                return pageSize * (pageNumber - 1) + index + 1;//返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
            }
        };
        columns.push(indexCol);
        //遍历其他后台配置的列
        for(var i=0; i<cols.length; i++){
            var obj = {};
            if(cols[i].title){
                obj.title = cols[i].title;
            }
            if(cols[i].field){
                obj.field = cols[i].field;
            }
            if(cols[i].align){
                obj.align = cols[i].align;
            }
            if(cols[i].formatter){
                obj.formatter = cols[i].formatter;
            }
            if(cols[i].dicCodeItemMap){
                obj.dicCodeItemMap = cols[i].dicCodeItemMap;
            }
            if(cols[i].queryMulitSelect){
                obj.queryMulitSelect = cols[i].queryMulitSelect;
            }
            if(cols[i].listOrder == "1"){
                obj.sortable = true;
            }
            if(cols[i].defaultListOrder == "1"){
                obj.defaultListOrder = true;
            }
            if(cols[i].width){
                obj.width = cols[i].width;
            }
            columns.push(obj);
        }
        return columns;
    },
    //获取默认排序字段
    parseDefaultOrderColumn : function (columns) {
        for(var i=0; i<columns.length; i++){
            if(columns[i].defaultListOrder){
                return columns[i].field;
            }
        }
        return null;
    },
    //创建 操作按钮
    newOparetionItem : function () {
        var item = new Object();
        item.field = 'op';
        item.title = '操作';
        item.align = 'center';
        item.formatter = this.createRowButton;
        return item;
    },
    createRowButton : function (value, row, index, field) {
        var taskId = row.TASK_ID;
        var content = '';
        var rowData = JSON.stringify(row);
        //循环遍历渲染按钮
        var btnWidgets = row.btnWidgetRenderers;
        if(btnWidgets&&btnWidgets.length>0){
            for(var i = 0; i <btnWidgets.length; i++){
                var btnStr = btnWidgets[i].widgetRenderer;
                //默认的替换，taskId是查询出来的主键
                btnStr = btnStr.replace("#[id]",taskId);
                //自定义参数替换，注意参数名要和视图sql查询的字段一致
                var lastIndexOf = btnStr.lastIndexOf("]");
                var lastIndexOf2 = btnStr.lastIndexOf("#[");
                var valStr = btnStr.substring(lastIndexOf2 + 2,lastIndexOf);
                btnStr = btnStr.replace("#["+ valStr +"]",row[valStr.toUpperCase()]);
                content += btnStr;
            }
        }
        if(preQuestViewCode == 'view-code-00000021' ){
            content+= '<button class="btn btn-info" type="button" onclick=\'editProblem('+rowData+');\'>编辑</button>&nbsp;'
        }
        return content;
    },
    //无效字符的判断
    valueIsValid : function (obj) {
        //四个表达式判断空
        if(obj==null ) return false;
        if(typeof(obj)=='undefined') return false;
        if(obj=='') return false;
        if(obj.replace(/(^s*)|(s*$)/g,"").length ==0)return false;
        return true;
    }
};