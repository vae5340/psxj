define([
    'module',
    'dojo/string',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/query',
    'dojo/on',
    'pipe-network/lib/resource-loader',
    'pipe-network/lib/basic-utils'
], function(
    module,
    string,
    lang,
    array,
    dom,
    domConstruct,
    domClass,
    domStyle,
    domAttr,
    query,
    on,
    resourceLoader,
    basicUtils
){
    'use strict';
    return function(options){
        var exports,
            resources = {
                'CSS': '../../css/analysis-table-panel.css'
            },
            templates = {
                'main': ""+
                    "<div class=\"analysis-table-panel\">"+
                     "<div class=\"table-panel-tabs\">"+
                     "</div>"+
                     "<div class=\"table-panel-tables\">"+
                     "</div>"+
                    "</div>",
                'tab': ""+
                    "<div class=\"table-panel-tab\" data-id=\"${id}\">"+
                     "${name}"+
                    "</div>",
                'tabLabel': ""+
                    "<div class=\"table-panel-tab-label\">"+
                     "${name}"+
                    "</div>",
                'table': ""+
                    "<table border=\"1\" cell-spacing=\"0\" class=\"table-panel-table\" data-id=\"${id}\">"+
                    "</table>",
                'tableHeader': ""+
                    "<thead></thead>",
                'tableBody': ""+
                    "<tbody></tbody>",
                'tableHeaderRow': ""+
                    "<tr></tr>",
                'tableBodyRow': ""+
                    "<tr data-tableId=\"${tableId}\" data-rowIndex=\"${rowIndex}\"></tr>",
                'tableHeaderCell': ""+
                    "<th data-field=\"${field}\">${value}</th>",
                'tableBodyCell': ""+
                    "<td>${value}</td>"
            },
            supportedEvents = {
                'mouseOverRow': true,
                'mouseOutRow': true,
                'clickRow': true
                //TODO
            },
            configMap = {},
            stateMap = {},
            queryMap,
            //----
            highlightRowByRowDom,
            highlightRow,
            unhighlightRow,
            //----
            mouseOverRowHandler,
            mouseOutRowHandler,
            clickRowHandler,
            //----
            eventHandlerMap = {},
            eventHandlers = {},
            //----
            isLabel,
            selectTab,
            //-----
            removeEventHandler,
            addEventHandler,
            emit,
            //----
            registerDomEvents,
            removeDomEvents,
            //----
            setTableScrollability,
            setTabsOutOfBox,
            genTabs,
            genTable,
            genTables,
            genTableHeader,
            genTableBody,
            //----
            initDom,
            destroyDom,
            cleanData,
            //----
            destroy,
            setData,
            //----
            getMainDom,
            loadResources,
            init;

        highlightRowByRowDom = function(rowDom){
            if(rowDom){
                domClass.add(rowDom, 'selected');
            }
        };

        highlightRow = function(tableId, idField, value){
            var i, features, feature, table, row;
            if(idField && value !== undefined && value !== null){
                table = query('table[data-id='+tableId+']', queryMap.tables)[0];
                if(table){
                    features = stateMap.tableData.tableData[tableId].features; 
                    for(i=0;i<features.length;i++){
                        feature = features[i];
                        if(feature.attributes[idField] == value){
                            unhighlightRow();
                            row = query('tbody tr[data-rowIndex='+i+']', table)[0];
                            if(row){
                                highlightRowByRowDom(row);
                            }
                            break;
                        }
                    }
                }
            }
        };

        unhighlightRow = function(){
            query('table tbody tr.selected', queryMap.tables).forEach(function(rowDom){
                domClass.remove(rowDom, 'selected');
            });
        };

        mouseOutRowHandler = function(event){
            var rowDom = event.target.parentNode,
                tableId = domAttr.get(rowDom, 'data-tableId'),
                rowIndex = parseInt(domAttr.get(rowDom, 'data-rowIndex')),
                dataSet = stateMap.tableData.tableData[tableId],
                rowData = dataSet.data[rowIndex];

            unhighlightRow();

            emit('mouseOutRow', {
                'modelId': tableId,
                'data': rowData,
                'rowIndex': rowIndex
            });
        };

        mouseOverRowHandler = function(event){
            var rowDom = event.target.parentNode,
                tableId = domAttr.get(rowDom, 'data-tableId'),
                rowIndex = parseInt(domAttr.get(rowDom, 'data-rowIndex')),
                dataSet = stateMap.tableData.tableData[tableId],
                rowData = dataSet.data[rowIndex];

            highlightRowByRowDom(rowDom);

            emit('mouseOverRow', {
                'modelId': tableId,
                'data': rowData,
                'rowIndex': rowIndex
            });
        };

        clickRowHandler = function(event){
            var rowDom = event.target.parentNode,
                tableId = domAttr.get(rowDom, 'data-tableId'),
                rowIndex = parseInt(domAttr.get(rowDom, 'data-rowIndex')),
                dataSet = stateMap.tableData.tableData[tableId],
                rowData = dataSet.data[rowIndex];

            emit('clickRow', {
                'modelId': tableId,
                'data': rowData,
                'rowIndex': rowIndex
            });
        };

        selectTab = function(tableId){
            var tabDom = query('.table-panel-tab[data-id='+tableId+']', queryMap.tabs)[0],
                tableDom = query('.table-panel-table[data-id='+tableId+']', queryMap.tables)[0];
            if(tabDom && tableDom){
                query('.table-panel-tab.selected', queryMap.tabs).forEach(function(curTabDom){
                    domClass.remove(curTabDom, 'selected');
                });
                query('.table-panel-table.selected', queryMap.tables).forEach(function(curTableDom){
                    domClass.remove(curTableDom, 'selected');
                });;
                domClass.add(tabDom, 'selected');
                domClass.add(tableDom, 'selected');
            }
        };

        setTableScrollability = function(){
            //TODO
        };

        setTabsOutOfBox = function(){
            if(configMap.tabsOutOfBox){
                domClass.add(queryMap.tabs, 'out-of-box');
                domStyle.set(queryMap.tabs, 'top', -(queryMap.tabs.offsetHeight) + 'px');
            }
        };

        genTabs = function(){
            array.forEach(stateMap.tableData.tableIds, function(tableId){
                var tableData, tab, isLabel, text;
                isLabel = tableId.match(/^label:(.*)/);
                if(isLabel){
                    text = isLabel[1];
                    if(text){
                        tab = domConstruct.toDom(string.substitute(templates.tabLabel, {
                            'name': text
                        }));
                        tableData = stateMap.tableData.tableData[tableId];
                        if(tableData && tableData.style){
                            domStyle.set(tab, tableData.style);
                        }
                    }
                }else{
                    tableData = stateMap.tableData.tableData[tableId];
                    text = tableData.name;
                    if(!tableData.hideCount){
                        text = tableData.name+"("+tableData.data.length+")";
                    }
                    tab = domConstruct.toDom(string.substitute(templates.tab, {
                        'id': tableId,
                        'name': text
                    }));
                    if(tableData && tableData.tabStyle){
                        domStyle.set(tab, tableData.tabStyle);
                    }
                }
                domConstruct.place(tab, queryMap.tabs);
            });
            domConstruct.place(domConstruct.toDom("<div style=\"clear: both;\"></div>"), queryMap.tabs);
        };

        genTables = function(){
            domStyle.set(queryMap.tables, {
                'width': '100%',
                'height': (queryMap.parent.offsetHeight - (configMap.tabsOutOfBox?0:queryMap.tabs.offsetHeight)) + 'px'
            });
            array.forEach(stateMap.tableData.tableIds, function(tableId){
                if(!isLabel(tableId)){
                    var tableData = stateMap.tableData.tableData[tableId];
                    genTable(tableId, tableData);
                }
            });
        };

        genTableHeader = function(model, tableId, tableDom){
            var headerDom = domConstruct.toDom(templates.tableHeader),
                row, cell, i, fieldName, field;

            row = domConstruct.place(domConstruct.toDom(templates.tableHeaderRow), headerDom);

            for(i=0;i<model.displayFields.length;i++){
                fieldName = model.displayFields[i];
                field = model.fields[fieldName];
                domConstruct.place(domConstruct.toDom(string.substitute(templates.tableHeaderCell, {
                    'field': fieldName,
                    'value': field.name
                })), row);
            }
            
            domConstruct.place(headerDom, tableDom);
        };

        genTableBody = function(data, model, tableId, tableDom){
            var bodyDom = domConstruct.toDom(templates.tableBody),
                rowStyles = stateMap.tableData.rowStyles || [],
                style, row, cell, i, j, k, fieldName, field, value;
            
            for(i=0;i<data.length;i++){
                row = domConstruct.place(domConstruct.toDom(string.substitute(templates.tableBodyRow, {
                    'tableId': tableId,
                    'rowIndex': i
                })), bodyDom);

                for(k=0;k<rowStyles.length;k++){
                    style = rowStyles[k];
                    if(style.match && style.match(data[i], model)){
                        domStyle.set(row, style.style || {});
                        break;
                    }
                }
                
                for(j=0;j<model.displayFields.length;j++){
                    fieldName = model.displayFields[j];
                    field = model.fields[fieldName];
                    value = data[i].attributes[fieldName];
                    value = !field.displayFormatter?model.defaultFieldDisplayFormatter(value):field.displayFormatter(value);
                    data[i].tableRow = row;
                    domConstruct.place(domConstruct.toDom(string.substitute(templates.tableBodyCell, {
                        'value': (basicUtils.isNumber(value)?value: (value || ''))
                    })), row);
                }
            }

            domConstruct.place(bodyDom, tableDom);
        };


        genTable = function(tableId, tableData){
            var model = tableData.model,
                data = tableData.data,
                tableDom;

            tableDom = domConstruct.toDom(string.substitute(templates.table, {
                'id': tableId
            }));

            genTableHeader(model, tableId, tableDom);
            genTableBody(data, model, tableId, tableDom);

            domConstruct.place(tableDom, queryMap.tables);
        };

        destroy = function(){
            destroyDom();
            cleanData();
            //TODO
        };

        setData = function(data, options){
            if(!data){
                return;
            }

            options = options || {};

            if(!options.parentNode){
                throw "'parentNode' is needed for options!";
            }

            stateMap = {};

            stateMap.tableData = data;

            //TODO
            initDom(options.parentNode);
            //TODO
        };

        getMainDom = function(){
            return queryMap? queryMap.main: null;
        };

        registerDomEvents = function(){
            eventHandlerMap.clickTab = on(queryMap.tabs, '.table-panel-tab:click', function(event){
                var tar = event.target,
                    tableId = tar?domAttr.get(tar, 'data-id'): null;

                if(tableId){
                    selectTab(tableId);
                }
            });

            eventHandlerMap.mouseOverRow = on(queryMap.tables, 'table tbody tr:mouseover', mouseOverRowHandler);

            eventHandlerMap.mouseOutRow = on(queryMap.tables, 'table tbody tr:mouseout', mouseOutRowHandler);

            eventHandlerMap.clickRow = on(queryMap.tables, 'table tbody tr:click', clickRowHandler);
            //TODO
        };

        removeDomEvents = function(){
            if(eventHandlerMap.clickTab){
                eventHandlerMap.clickTab.remove();
                delete eventHandlerMap.clickTab;
            }
            if(eventHandlerMap.mouseOverRow){
                eventHandlerMap.mouseOverRow.remove();
                delete eventHandlerMap.mouseOverRow;
            }
            if(eventHandlerMap.clickRow){
                eventHandlerMap.clickRow.remove();
                delete eventHandlerMap.clickRow;
            }
            //TODO
        };

        initDom = function(parentNode){
            if(queryMap){
                destroyDom();
            }

            queryMap = {};

            queryMap.parent = parentNode;
            queryMap.main = domConstruct.toDom(templates.main);
            domConstruct.place(queryMap.main, queryMap.parent);
            queryMap.tabs = query('.table-panel-tabs', queryMap.main)[0];
            queryMap.tables = query('.table-panel-tables', queryMap.main)[0];

            genTabs();
            genTables();
            setTabsOutOfBox();
            //TODO
            registerDomEvents();

            (function(){
                var tableId;
                if(stateMap.tableData.tableIds.length){
                    for(var i=0;i<stateMap.tableData.tableIds.length;i++){
                        tableId = stateMap.tableData.tableIds[i];
                        if(!isLabel(tableId)){
                            selectTab(tableId);
                            break;
                        }
                    }
                }
            })();
        };

        cleanData = function(){
            if(stateMap && stateMap.tableData){
                var tableIds = stateMap.tableData.tableIds,
                    tableData = stateMap.tableData.tableData;
                array.forEach(tableIds, function(tableId){
                    if(!isLabel(tableId)){
                        var data = tableData[tableId];
                        array.forEach(data.data, function(rec){
                            delete rec.tableRow;
                        });
                    }
                });
            }
            stateMap = null;
        };

        destroyDom = function(){
            removeDomEvents();
            if(queryMap && queryMap.main){
                domConstruct.destroy(queryMap.main);
            }
            queryMap = {};
        };

        removeEventHandler = function(eventName){
            delete eventHandlers[eventName];
        };
        
        addEventHandler = function(eventName, handler){
            if(eventName && supportedEvents[eventName] && handler && handler.apply){
                removeEventHandler(eventName);
                eventHandlers[eventName] = handler;
            }
        };

        emit = function(eventName, eventObject){
            if(eventName && supportedEvents[eventName] && eventHandlers[eventName]){
                return eventHandlers[eventName].apply(null, [eventObject || {}]);
            }
            return true;
        };

        loadResources = function(){
            var dir = resourceLoader.getDojoModuleLocation(module);
            resourceLoader.addCSSFile(resources.CSS, dir);
        };

        init = function(options){
            options = options || {};

            lang.mixin(configMap, options);
            lang.mixin(eventHandlers, options.eventHandlers || {});

            loadResources();
        };

        isLabel = function(tableId){
            return tableId.match(/^label:/);
        };

        init(options);

        exports = {
            'init': init,
            'emit': emit,
            'addEventHandler': addEventHandler,
            'removeEventHandler': removeEventHandler,
            'setData': setData,
            'destroy': destroy,
            'highlightRow': highlightRow,
            'unhighlightRow': unhighlightRow,
            'highlightRowByRowDom': highlightRowByRowDom,
            'getMainDom': getMainDom
        };

        return exports;
    };
});
