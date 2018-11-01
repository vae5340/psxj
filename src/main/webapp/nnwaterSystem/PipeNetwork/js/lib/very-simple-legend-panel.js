define([
    'dojo/string',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/query',
    'dojo/html'
], function(
    string,
    lang,
    domConstruct,
    domClass,
    domStyle,
    domAttr,
    query,
    html
){
    'use strict';
    var defaultConfig = {
        'title': '图例',
        'hide': true
    };

    return function(parentNode, options){
        var exports,
            configMap = {},
            stateMap,
            queryMap,
            templates = {
                'main': ""+
                    "<div class=\"very-simple-legend-panel\">"+
                     "<div class=\"very-simple-legend-panel-title\" style=\"text-align: center; padding: 10px 0 0 0;\"></div>"+
                     "<div class=\"very-simple-legend-panel-content\">"+
                      "<ul class=\"very-simple-legend-panel-list\" style=\"padding: 10px 10px 10px 10px; margin: 0; list-style: none;\">"+
                      "</ul>"+
                     "</div>"+
                    "</div>",
                'imgListItem': ""+
                    "<li style=\"height: 1.2em; margin-bottom: 3px; border-bottom: solid thin #EEEEEE; line-height: 1.2em; text-align: center;\"><img height=\"1em\" src=\"${img}\"/><span style=\"margin-left: 10px; height: 1em;\" data-role=\"name\">${name}</span></li>",
                'colorListItem': ""+
                    "<li style=\"height: 1.2em; margin-bottom: 3px; border-bottom: solid thin #EEEEEE; line-height: 1.2em text-align: center;;\"><div style=\"border: solid thin #AAAAAA; height: 1em; width: 1.2em; background: ${color}; float: left; margin-left: 1.2em;\"></div><span style=\"margin-left: 10px;\" data-role=\"name\">${name}</span></li>"
            },
            //----
            defaultDisplayFormatter,
            //----
            initDom,
            destroyDom,
            //----
            setTitle,
            setStops,
            show,
            hide,
            destroy,
            init;

        defaultDisplayFormatter = function(content){
            var str = "";
            if(content !== null && content !== undefined){
                str = content;
            }
            return str;
        };

        setTitle = function(title){
            stateMap.title = title || stateMap.title || defaultConfig.title;
            html.set(queryMap.title, stateMap.title);
        };

        setStops = function(stops){
            stateMap.stops = stops || stateMap.stops;
            if(!stateMap.stops || !queryMap || !queryMap.list){
                return;
            }
            var stop, listItem, domStr, i;

            domConstruct.empty(queryMap.list);
            
            for(i=0; i<stateMap.stops.length; i++){
                stop = stateMap.stops[i];
                listItem = null;
                if(stop.img){
                    domStr = string.substitute(templates.imgListItem, {
                        'img': stop.img,
                        'name': defaultDisplayFormatter(stop.name)
                    });
                    listItem = domConstruct.toDom(domStr);
                }else if(stop.color){
                    domStr = string.substitute(templates.colorListItem, {
                        'color': stop.color,
                        'name': defaultDisplayFormatter(stop.name)
                    });
                    listItem = domConstruct.toDom(domStr);
                }
                if(listItem){
                    domConstruct.place(listItem, queryMap.list);
                }
            }
        };

        show = function(){
            if(queryMap && queryMap.main){
                domStyle.set(queryMap.main, {
                    'display': ''
                });
            }
        };

        hide = function(){
            if(queryMap && queryMap.main){
                domStyle.set(queryMap.main, {
                    'display': 'none'
                });
            }
        };

        destroy = function(){
            destroyDom();
        };

        initDom = function(parentNode){
            if(!parentNode){
                return;
            }
            queryMap = {};

            queryMap.parent = parentNode;
            queryMap.main = domConstruct.toDom(templates.main);
            
            queryMap.title = query('.very-simple-legend-panel-title', queryMap.main)[0];
            queryMap.content = query('.very-simple-legend-panel-content', queryMap.main)[0];
            queryMap.list = query('.very-simple-legend-panel-list', queryMap.main)[0];

            hide();

            stateMap.hide || show();

            domConstruct.place(queryMap.main, queryMap.parent);

            setTitle();
            setStops();
        };

        destroyDom = function(){
            if(queryMap && queryMap.main){
                domConstruct.destroy(queryMap.main);
            }
            queryMap = null;
        };

        init = function(parentNode, options){
            if(!parentNode){
                throw "'parentNode' is needed for init!";
            }
            options = options || {};

            stateMap = {};

            lang.mixin(stateMap, options);

            initDom(parentNode);
        };

        init(parentNode, options);

        exports = {
            'init': init,
            'destroy': destroy
        };

        return exports;
    };
});
