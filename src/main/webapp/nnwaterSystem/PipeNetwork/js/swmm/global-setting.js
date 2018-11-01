/**
 * 排水模型功能全局设置模块
 */
define([
    'module',
    'dojo/string',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/query',
    'dojo/on',
    'dojo/request',
    'dojo/html',
    'drainage-model/lib/resource-loader',
    'drainage-model/lib/basic-utils'
], function(
    module,
    string,
    array,
    lang,
    domConstruct,
    domClass,
    domStyle,
    query,
    on,
    request,
    html,
    resourceLoader,
    basicUtils
){
    'use strict';
    var map,
        resources = {
            'CSS': '../../css/swmm-global-setting-panel.css'
        },
        templates = {
            'main': ""+
                "<div class=\"swmm-global-setting-panel\">"+
                 "<div class=\"title\">"+
                  "<div class=\"title-text\">排水模型分析设置</div>"+
                 "</div>"+
                 "<div class=\"content\">"+
                  "<div class=\"info-title\">当前工程:</div>"+
                 "</div>"+
                 "<div class=\"control-btns\">"+
                  "<button data-role=\"choose-project\">选择工程</button>&nbsp;&nbsp;"+
                  "<button data-role=\"hide\">隐藏</button>" +
                 "</div>"+
                "</div>",
            'infoList': ""+
                "<ul class=\"project-info-list\">"+
                 "<li>工程编号：${projectid}</li>"+
                 "<li>工程名称：${projectname}</li>"+
                 "<li>方案名称：${schemename}</li>"+
                 "<li>降雨强度：${timeseries.tsname}</li>"+
                 "<li>模拟开始时间：${simstarttime}</li>"+
                 "<li>报告数：${reportcount}</li>"+
                 "<li>报告步长：${reportstep}</li>"+
                "</ul>",
            'infoListEmpty': ""+
                "<div class=\"project-info-list empty\">未选择工程</div>",
            'projectChooser': ""+
                "<div class=\"swmm-project-chooser\">"+
                 "<div class=\"swmm-project-chooser-title\">"+
                  "<div class=\"swmm-project-chooser-title-text\">请选择工程</div>"+
                 "</div>"+
                 "<div class=\"swmm-project-chooser-table-wrapper\" data-role=\"scheme\"></div>"+
                 "<div class=\"swmm-project-chooser-table-wrapper\" data-role=\"project\">"+
                 "</div>"+
                 "<div class=\"swmm-project-chooser-control-btns\">"+
                  "<button data-role=\"refresh\">刷新</button>"+
                  "<button data-role=\"cancel\">取消</button>"+
                 "</div>"+
                "</div>",
            'projectChooserTable': ""+
                "<table>"+
                 "<thead></thead>"+
                 "<tbody></tbody>"+
                "</table>",
            'projectChooserTableHeaderRow': ""+
                "<tr></tr>",
            'projectChooserTableBodyRow': ""+
                "<tr></tr>",
            'projectChooserTableHeaderCell': ""+
                "<th data-field=\"${field}\">${value}</th>",
            'projectChooserTableBodyCell': ""+
                "<td data-field=\"${field}\">${value}</td>",
            'projectChooserTableOneTableRow': ""+
                "<tr>"+
                 "<td colspan=\"${colspan}\">${value}</td>"+
                "</tr>"
        },
        configMap = {
            'districtInfo': {
                '青秀': {
                    'code': '450103',
                    'name': 'H区',
                    'order': 450103
                },
                '兴宁': {
                    'code': '450102',
                    'name': 'B区',
                    'order': 450102
                },
                '江南': {
                    'code': '450105',
                    'name': 'A区',
                    'order': 450105
                },
                '西乡塘': {
                    'code': '450107',
                    'name': 'D区',
                    'order': 450107
                },
                '良庆': {
                    'code': '450108',
                    'name': 'C区',
                    'order': 450108
                },
                '邕宁': {
                    'code': '450109',
                    'name': 'E区',
                    'order': 450109
                },
                '武鸣': {
                    'code': '450110',
                    'name': 'J区',
                    'order': 450110
                }
            },
            'swmmSchemeModel': {
                'id': 'SwmmScheme',
                'displayName': '方案',
                'displayFields': [
                    'schemename'
                ],
                'defaultFieldDisplayFormatter': function(value, field){
                    if(basicUtils.isNumber(value)){
                        return value + '';
                    }
                    return value || '';
                },
                'fields': {
                    'id': {
                        'name': 'ID'
                    },
                    'schemename': {
                        'name': '方案名称'
                    }
                }
            },
            'swmmProjectModel': {
                'id': 'SwmmProject',
                'displayName': '工程',
                'displayFields': [
                    'projectid', 'projectname', 'timeseries', 'simstarttime', 'reportcount', 'reportstep'
                ],
                'defaultFieldDisplayFormatter': function(value, field){
                    if(basicUtils.isNumber(value)){
                        return value + '';
                    }
                    return value || '';
                },
                'fields': {
                    'id': {
                        'name': 'ID'
                    },
                    'projectid': {
                        'name': '工程编号'
                    },
                    'projectname': {
                        'name': '工程名称'
                    },
                    'schemename': {
                        'name': '方案名称'
                    },
                    'simstarttime': {
                        'name': '模拟开始时间'
                    },
                    'reportcount': {
                        'name': '报告数'
                    },
                    'reportstep': {
                        'name': '报告步长'
                    },
                    'timeseries': {
                        'name': '降雨强度',
                        'displayFormatter': function(value){
                            if(value){
                                return value.tsname || '';
                            }
                            return '';
                        }
                    }
                }
            }
        },
        stateMap = {},
        eventHandlers = {},
        eventHandlerMap = {},
        queryMap,
        emit,
        //----
        prepareDataForChooseProject,
        updateProjectChooserTable,
        loadProjectList,
        showProjectList,
        selectSchemeByIndex,
        selectScheme,
        //----
        projectChooserCancelHandler,
        projectChooserRefreshHandler,
        projectChooserClickProjectRowHandler,
        projectChooserClickSchemeRowHandler,
        hideHandler,
        chooseProjectHandler,
        //----
        updateProjectInfo,
        makeInfoListDom,
        //----
        initProjectChooser,
        destroyProjectChooser,
        initDom,
        destroyDom,
        registerDomEvents,
        removeDomEvents,
        loadResources,
        //----
        isRunning,
        getCurProject,
        init,
        hide,
        show,
        startIfNotRunning,
        cancel;

    selectScheme = function(item){
        if(item){
            stateMap.selectedScheme = item;
            stateMap.projectList = item.projectList;
            updateProjectChooserTable();
        }
    };

    selectSchemeByIndex = function(index){
        var selectedScheme;
        if(index >= 0 && stateMap.schemeList && stateMap.schemeList.length){
            selectedScheme = stateMap.schemeList[index];
            stateMap.selectedScheme = selectedScheme;
            stateMap.projectList = selectedScheme.projectList;
            updateProjectChooserTable();
        }
    };

    showProjectList = function(disableCache){
        loadProjectList(function(){
            if(stateMap.selectedScheme){
                selectScheme(stateMap.selectedScheme);
            }else{
                selectSchemeByIndex(0);
            }
        }, disableCache);
    };

    prepareDataForChooseProject = function(projectList){
        if(!projectList){
            return;
        }
        var schemeMap = {},
            schemeArray = [],
            schemeName,
            projectArr;

        array.forEach(projectList, function(project){
            if(!schemeMap[project.schemename]){
                schemeMap[project.schemename] = {
                    'schemename': project.schemename,
                    'projectList': []
                };
                schemeArray.push(schemeMap[project.schemename]);
            }
            schemeMap[project.schemename].projectList.push(project);
        });

        for(schemeName in schemeMap){
            if(!schemeMap[schemeName] || !schemeMap[schemeName].projectList){
                continue;
            }
            projectArr = schemeMap[schemeName].projectList.sort(function(a, b){
                var prj1 = a.projectname,
                    prj2 = b.projectname,
                    kw1, kw2;
                kw1 = prj1.match(/[^\d](\d+)年/);
                kw2 = prj2.match(/[^\d](\d+)年/);
                if(!kw1 || isNaN(parseInt(kw1[1])) || !kw2 || isNaN(parseInt(kw2[1]))){
                    return 0;
                }
                kw1 = parseInt(kw1[1]);
                kw2 = parseInt(kw2[1]);
                return kw1 - kw2;
            });
        }

        schemeArray.sort(function(a, b){
            var sc1 = a.schemename,
                sc2 = b.schemename,
                kw1, kw2, ac1, ac2;
            kw1 = sc1.match(/ *(.*)[区县]/);
            kw2 = sc2.match(/ *(.*)[区县]/);
            if(!kw1 || !kw2 || !kw1[1] || !kw2[1] || kw1[1] == kw2[2]){
                return 0;
            }
            ac1 = configMap.districtInfo[kw1[1]];
            ac2 = configMap.districtInfo[kw2[1]];
            if(!ac1 || !ac2){
                return 0;
            }
            return ac1.order - ac2.order;
        });

        stateMap.schemeList = schemeArray;
    };

    loadProjectList = function(callback, disabledCache){
        html.set(queryMap.projectChooser.titleText, '工程列表加载中...');
        if(!disabledCache && stateMap.projectList && stateMap.projectList.length){
            if(callback && callback.apply){
                callback.apply(null, []);
                html.set(queryMap.projectChooser.titleText, '工程列表加载完毕');
                window.setTimeout(function(){
                    if(queryMap && queryMap.projectChooser){
                        html.set(queryMap.projectChooser.titleText, '请选择工程');
                    }
                }, 1500);
            }
            return;
        }
        request(configMap.serviceApis.projectList, {
            'query': {
                'page.pageNo': 1,
                'page.pageSize': 99999999
            },
            'handleAs': 'json'
        }).then(function(response){
            if(!response){
                html.set(queryMap.projectChooser.titleText, '工程列表加载失败，请重试');
                return;
            }
            prepareDataForChooseProject(response.result);

            if(callback && callback.apply){
                callback.apply(null, []);
                html.set(queryMap.projectChooser.titleText, '工程列表加载完毕');
                window.setTimeout(function(){
                    if(queryMap && queryMap.projectChooser){
                        html.set(queryMap.projectChooser.titleText, '请选择工程');
                    }
                }, 1500);
            }
        }, function(){
            html.set(queryMap.projectChooser.titleText, '工程列表加载失败，请重试');
        });
    };

    updateProjectChooserTable = function(){
        if(queryMap.projectChooser && queryMap.projectChooser.schemeTableWrapper  && queryMap.projectChooser.projectTableWrapper){
            if(queryMap.projectChooser.projectTable){
                domConstruct.destroy(queryMap.projectChooser.projectTable);
                delete queryMap.projectChooser.projectTable;
            }
            if(queryMap.projectChooser.schemeTable){
                domConstruct.destroy(queryMap.projectChooser.schemeTable);
                delete queryMap.projectChooser.schemeTable;
            }
            delete queryMap.projectChooser.projectTable;
            delete queryMap.projectChooser.schemeTable;
        }

        buildTable('schemeTable', stateMap.schemeList || [], configMap.swmmSchemeModel, queryMap.projectChooser.schemeTableWrapper);
        buildTable('projectTable', stateMap.projectList || [], configMap.swmmProjectModel, queryMap.projectChooser.projectTableWrapper);

        function buildTable(tableName, dataList,  model, parentNode){
            queryMap.projectChooser[tableName] = domConstruct.toDom(templates.projectChooserTable);

            queryMap.projectChooser[tableName+'Header'] = query('thead', queryMap.projectChooser[tableName])[0];
            queryMap.projectChooser[tableName+'Body'] = query('tbody', queryMap.projectChooser[tableName])[0];

            (function(){//build table header
                var row, cell, fieldId, field;
                row = domConstruct.toDom(templates.projectChooserTableHeaderRow);
                for(var i=0;i<model.displayFields.length;i++){
                    fieldId = model.displayFields[i];
                    field = model.fields[fieldId];
                    cell = domConstruct.toDom(string.substitute(templates.projectChooserTableHeaderCell, {
                        'field': fieldId,
                        'value': field.name
                    }));
                    domConstruct.place(cell, row);
                }
                domConstruct.place(row, queryMap.projectChooser[tableName+'Header']);
            })();

            (function(){//build table body
                var row, item, cell, fieldId, field, value;
                if(!dataList.length){
                    row = domConstruct.toDom(string.substitute(templates.projectChooserTableOneTableRow, {
                        'colspan': model.displayFields.length,
                        'value': '暂无记录'
                    }));
                    domConstruct.place(row, queryMap.projectChooser[tableName+'Body']);                        
                    return;
                    
                }
                for(var k=0; k<dataList.length;k++){
                    item = dataList[k];
                    row = domConstruct.toDom(templates.projectChooserTableBodyRow);
                    row.modelItem = item;
                    item.rowDom = row;
                    for(var i=0;i<model.displayFields.length; i++){
                        fieldId = model.displayFields[i];
                        field = model.fields[fieldId];
                        value = item[fieldId];
                        value = field.displayFormatter? field.displayFormatter(value): model.defaultFieldDisplayFormatter(value);
                        cell = domConstruct.toDom(string.substitute(templates.projectChooserTableBodyCell, {
                            'field': fieldId,
                            'value': value
                        }));
                        domConstruct.place(cell, row);
                    }
                    domConstruct.place(row, queryMap.projectChooser[tableName+'Body']);
                }
            })();

            if(stateMap.selectedScheme && stateMap.selectedScheme.rowDom){
                query('tbody tr.selected', queryMap.projectChooser.schemeTable).forEach(function(node){
                    domClass.remove(node, 'selected');
                });
                domClass.add(stateMap.selectedScheme.rowDom, 'selected');
            }

            domConstruct.place(queryMap.projectChooser[tableName], parentNode);
        }
    };

    projectChooserCancelHandler = function(){
        destroyProjectChooser();
    };

    projectChooserRefreshHandler = function(){
        showProjectList(true);
    };

    projectChooserClickSchemeRowHandler = function(event){
        var scheme;
        if(event && event.target && event.target.parentNode && event.target.parentNode.modelItem){
            scheme = event.target.parentNode.modelItem;
            selectScheme(scheme);
        }
    };

    projectChooserClickProjectRowHandler = function(event){
        var project, oriProject;
        if(event && event.target && event.target.parentNode && event.target.parentNode.modelItem){
            oriProject = stateMap.curProject;
            project = event.target.parentNode.modelItem;
            stateMap.curProject = project;
            destroyProjectChooser();
            updateProjectInfo();
            emit('selectProject', {
                'oriProject': oriProject,
                'curProject': project
            });
        }
    };

    hideHandler = function(){
        hide();
    };

    chooseProjectHandler = function(){
        initProjectChooser();
    };

    updateProjectInfo = function(){
        if(queryMap.infoList){
            domConstruct.destroy(queryMap.infoList);
        }
        queryMap.infoList = makeInfoListDom();
        domConstruct.place(queryMap.infoList, queryMap.content);
    };

    makeInfoListDom = function(){
        var project = stateMap.curProject,
            dom;
        if(project){
            dom = domConstruct.toDom(string.substitute(templates.infoList, project));
        }else{
            dom = domConstruct.toDom(templates.infoListEmpty);
        }
        return dom;
    };

    initProjectChooser = function(){
        if(queryMap && queryMap.projectChooser){
            return;
        }
        queryMap.projectChooser = {};

        queryMap.projectChooser.parent = map.root.parentNode;
        queryMap.projectChooser.main = domConstruct.toDom(templates.projectChooser);

        queryMap.projectChooser.title = query('.swmm-project-chooser-title', queryMap.projectChooser.main)[0];
        queryMap.projectChooser.titleText = query('.swmm-project-chooser-title-text', queryMap.projectChooser.title)[0];

        queryMap.projectChooser.schemeTableWrapper = query('.swmm-project-chooser-table-wrapper[data-role=scheme]', queryMap.projectChooser.main)[0];
        queryMap.projectChooser.projectTableWrapper = query('.swmm-project-chooser-table-wrapper[data-role=project]', queryMap.projectChooser.main)[0];

        queryMap.projectChooser.controlBtns = query('.swmm-project-chooser-control-btns', queryMap.projectChooser.main)[0];

        queryMap.projectChooser.cancelBtn = query('button[data-role=cancel]', queryMap.projectChooser.controlBtns)[0];
        
        queryMap.projectChooser.refreshBtn = query('button[data-role=refresh]', queryMap.projectChooser.controlBtns)[0];

        domConstruct.place(queryMap.projectChooser.main, queryMap.projectChooser.parent);

        eventHandlerMap.projectChooser = {};
        
        eventHandlerMap.projectChooser.cancel = on(queryMap.projectChooser.cancelBtn, 'click', projectChooserCancelHandler);

        eventHandlerMap.projectChooser.refresh = on(queryMap.projectChooser.refreshBtn, 'click', projectChooserRefreshHandler);

        eventHandlerMap.projectChooser.clickSchemeRow = on(queryMap.projectChooser.schemeTableWrapper, 'tr:click', projectChooserClickSchemeRowHandler);
        
        eventHandlerMap.projectChooser.clickProjectRow = on(queryMap.projectChooser.projectTableWrapper, 'tr:click', projectChooserClickProjectRowHandler);

        showProjectList();
    };

    destroyProjectChooser = function(){
        if(eventHandlerMap && eventHandlerMap.projectChooser){
            if(eventHandlerMap.projectChooser.cancel){
                eventHandlerMap.projectChooser.cancel.remove();
                delete eventHandlerMap.projectChooser.cancel;
            }
            if(eventHandlerMap.projectChooser.refresh){
                eventHandlerMap.projectChooser.refresh.remove();
                delete eventHandlerMap.projectChooser.refresh;
            }
            if(eventHandlerMap.projectChooser.clickProjectRow){
                eventHandlerMap.projectChooser.clickProjectRow.remove();
                delete eventHandlerMap.projectChooser.clickProjectRow;
            }
            if(eventHandlerMap.projectChooser.clickSchemeRow){
                eventHandlerMap.projectChooser.clickSchemeRow.remove();
                delete eventHandlerMap.projectChooser.clickSchemeRow;
            }
            delete eventHandlerMap.projectChooser;
        }

        if(queryMap && queryMap.projectChooser && queryMap.projectChooser.main){
            domConstruct.destroy(queryMap.projectChooser.main);
            delete queryMap.projectChooser;
        }
    };

    initDom = function(){
        if(queryMap){
            destroyDom();
        }
        queryMap = {};

        queryMap.parent = map.root.parentNode;
        queryMap.main = domConstruct.toDom(templates.main);

        queryMap.title = query('.title', queryMap.main)[0];
        queryMap.titleText = query('.title-text', queryMap.title)[0];

        queryMap.content = query('.content', queryMap.main)[0];

        queryMap.controlBtns = query('.control-btns', queryMap.main)[0];

        queryMap.chooseProjectBtn = query('button[data-role=choose-project]', queryMap.controlBtns);
        queryMap.hideBtn = query('button[data-role=hide]', queryMap.controlBtns);

        domConstruct.place(queryMap.main, queryMap.parent);

        updateProjectInfo();

        registerDomEvents();

        if(configMap.position){
            domStyle.set(queryMap.main, configMap.position);
        }
    };

    destroyDom = function(){
        removeDomEvents();
        if(queryMap && queryMap.main){
            domConstruct.destroy(queryMap.main);
        }
        queryMap = null;
    };
    
    registerDomEvents = function(){
        eventHandlerMap.chooseProject = on(queryMap.chooseProjectBtn, 'click', chooseProjectHandler); 
        eventHandlerMap.hide = on(queryMap.hideBtn, 'click', hideHandler);
    };

    removeDomEvents = function(){
        if(eventHandlerMap.hide){
            eventHandlerMap.hide.remove();
            delete eventHandlerMap.hide;
        }
        if(eventHandlerMap.chooseProject){
            eventHandlerMap.chooseProject.remove();
            delete eventHandlerMap.chooseProject;
        }
    };

    loadResources = function(){
        var dir = resourceLoader.getDojoModuleLocation(module);
        resourceLoader.addCSSFile(resources.CSS, dir);
    };
    
    emit = function(eventName, eventObject){
        if(eventName && eventHandlers[eventName]){
            return eventHandlers[eventName].apply(null, [eventObject || {}]);
        }
        return true;
    };

    isRunning = function(){
        return queryMap? true:false;
    };

    startIfNotRunning = function(){
        if(!isRunning()){
            initDom();
        }
        //TODO
    };

    getCurProject = function(){
        return stateMap.curProject;
    };

    cancel = function(){
        destroyProjectChooser();
        destroyDom();
        //TODO
    };

    init = function(_map, options){
        options = options || {};
        if(!_map){
            throw "'map' is needed for init!";
        }
        map = _map;
        lang.mixin(configMap, options);
        lang.mixin(eventHandlers, options.eventHandlers || {});

        loadResources();
    };

    show = function(){
        if(queryMap && queryMap.main){
            domClass.remove(queryMap.main, 'swmm-global-setting-panel-hidden');
        }
    };

    hide = function(){
        if(queryMap && queryMap.projectChooser){
            destroyProjectChooser();
        }
        if(queryMap && queryMap.main){
            domClass.add(queryMap.main, 'swmm-global-setting-panel-hidden');
        }
    };

    return {
        'startIfNotRunning': startIfNotRunning,
        'getCurProject': getCurProject,
        'cancel': cancel,
        'init': init,
        'show': show,
        'hide': hide
    };
});
