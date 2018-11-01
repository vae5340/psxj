define([
    'module',
    'dojo/string',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/query',
    'dojo/html',
    'dojo/on',
    './resource-loader'
], function(
    module,
    string,
    array,
    lang,
    domConstruct,
    domStyle,
    domClass,
    query,
    html,
    on,
    resourceLoader
){
    'use strict';
    var constants = {},
        resources = {
            'CSS': '../../css/very-simple-time-slider.css'
        },
        staticInitDone = false,
        defaultConfig = {
            'showMarkerLabel': true,
            'playInterval': 100,
            'autoReplay': false
        },
        staticInit,
        loadResources;

    loadResources = function(){
        var dir = resourceLoader.getDojoModuleLocation(module);
        resourceLoader.addCSSFile(resources.CSS, dir);
    };

    staticInit = function(){
        if(!staticInitDone){
            loadResources();
            staticInitDone = true;
        }
    };

    staticInit();

    return function(options){
        var exports,
            stateMap = {},
            configMap = (function(){
                var conf = {};
                lang.mixin(conf, defaultConfig);
                return conf;
            })(),
            eventHandlerMap = {},
            eventHandlers = {},
            queryMap = {},
            templates = {
                'main': ""+
                    "<div class=\"very-simple-time-slider very-simple-time-slider-theme-default\">"+
                     "<div class=\"time-slider-line-wrapper\">"+
                      "<div class=\"time-slider-slider-wrapper\">"+
                       "<div class=\"time-slider-slider\"></div>"+
                      "</div>"+
                      "<div class=\"time-slider-tooltip\">"+
                      "</div>"+
                      "<div class=\"time-slider-line\"></div>"+
                      "<div class=\"time-slider-buffered\"></div>"+
                      "<div class=\"time-slider-markers\"></div>"+
                     "</div>"+
                    "</div>",
                'marker': ""+
                    "<div class=\"time-slider-marker\" data-index=\"${index}\">"+
                     "<div class=\"time-slider-marker-symbol\">"+
                     "</div>"+
                     "<div class=\"time-slider-marker-text\">"+
                      "${value}"+
                     "</div>"+
                    "</div>"
            },
            emit,
            init,
            initDom,
            mousedownOnSliderHandler,
            mouseupHandler,
            mousemoveHandler,
            mousemoveOnSliderHandler,
            mouseoutSliderHandler,
            mousemoveOnTimelineHandler,
            mousedownOnTimelineHandler,
            resizeContainerHandler,
            pullSliderToNearestStop,
            toStop,
            play,
            stop,
            reset,
            destroy,
            config,
            setTimeData,
            destroyTimeline,
            showMarkerLabel,
            hideMarkerLabel,
            genTimeLine,
            getPlayInterval,
            setPlayInterval,
            setAutoReplay;

        mousedownOnSliderHandler = function(event){
            stateMap.dragging = true;
            stateMap.lastPosition = {
                'x': event.clientX,
                'y': event.clientY
            };
        };
        mouseupHandler = function(event){
            if(stateMap.dragging || stateMap.mousedownOnTimeline){
                pullSliderToNearestStop();
            }
            stateMap.dragging = false;
            stateMap.mousedownOnTimeline = false;
            delete stateMap.dragPoint;
        };
        mousemoveHandler = function(event){
            var x, y, halfSliderWidth;
            x = event.clientX,  
            y = event.clientY;
            //                    y = queryMap.slider.offsetTop + y - stateMap.lastPosition.y;
            if(stateMap.dragging){         
                x = queryMap.slider.offsetLeft + x - stateMap.lastPosition.x;
                halfSliderWidth = queryMap.slider.offsetWidth / 2;
                if(x >= -halfSliderWidth && x <= queryMap.markers.offsetWidth - halfSliderWidth){
                    domStyle.set(queryMap.slider,'left',x+'px');
                    //                    domStyle.set(queryMap.slider,'top',y+'px');
                    stateMap.lastPosition.x = event.clientX;
                    //                    stateMap.lastPosition.y = event.clientY;
                    domStyle.set(queryMap.buffered, 'width', Math.max(queryMap.slider.offsetLeft, 0) + 'px');
                }
            }
        };
        mousemoveOnSliderHandler = function(event){
            stateMap.tooltipText = 'test';
            domStyle.set(queryMap.sliderTooltip, {
                'left': (domStyle.get(queryMap.slider, 'left') + 15)+'px',
                'top': (domStyle.get(queryMap.slider, 'top') + 15)+'px'
            });
            html.set(queryMap.sliderTooltip, stateMap.tooltipText);
            //                domStyle.set(queryMap.sliderTooltip, 'display', '');
        };
        resizeContainerHandler = function(event){
            toStop(stateMap.curIndex || 0, true);
        };

        mouseoutSliderHandler = function(){

        };

        mousedownOnTimelineHandler = function(event){
            stateMap.mousedownOnTimeline = true;;
            var timeline, x, halfSliderWidth;
            timeline = event.target.parentNode;
            if(stateMap.mousedownOnTimeline){         
                x = event.target.offsetLeft + event.offsetX;
                halfSliderWidth = queryMap.slider.offsetWidth / 2;
                if(x >= -halfSliderWidth && x <= queryMap.markers.offsetWidth - halfSliderWidth){
                    domStyle.set(queryMap.slider,'left',x+'px');
                    domStyle.set(queryMap.buffered, 'width', Math.max(queryMap.slider.offsetLeft, 0) + 'px');
                }
            }
        };

        reset = function(){
            toStop(0);
        };

        stop = function(){
            stateMap.playing = false;
        };

        play = function(options){
            if(stateMap.curIndex + 1 >= stateMap.timeData.stops.length){
                stateMap.curIndex = (stateMap.curIndex+1)%stateMap.timeData.stops.length;
            }
            stateMap.playing = true;
            stateMap.curIndex = stateMap.curIndex || 0;
            stateMap.curStop = stateMap.timeData.stops[stateMap.curIndex];
            toStop(stateMap.curIndex);
            window.setTimeout(function tick(){
                if(stateMap.playing){
                    var stop, i;
                    stateMap.curIndex = (stateMap.curIndex+1)%stateMap.timeData.stops.length;
                    stateMap.curStop = stateMap.timeData.stops[stateMap.curIndex];
                    toStop(stateMap.curIndex);
                    if(stateMap.curIndex + 1 >= stateMap.timeData.stops.length && !configMap.autoReplay){
                        stateMap.playing = false;
                        return;
                    }
                    window.setTimeout(tick, configMap.playInterval);
                }
            }, configMap.playInterval);
        };

        toStop = function(stopIndex, silent){
            var stop;
            if(isNaN(parseInt(stopIndex))){
                return;
            }
            if(stateMap && stateMap.timeData && stateMap.timeData.stops){
                stop = stateMap.timeData.stops[stopIndex];
                if(stop){
                    domStyle.set(queryMap.slider, 'left', (stop.markerDom.offsetLeft - queryMap.slider.offsetWidth / 2)+'px');
                    stateMap.curStop = stop;
                    stateMap.curIndex = stopIndex;
                }
                domStyle.set(queryMap.buffered, 'width', Math.max(queryMap.slider.offsetLeft, 0) + 'px');
                if(!silent){
                    emit('toStop', {
                        'curIndex': stateMap.curIndex,
                        'curStop': stateMap.curStop,
                        'timeData': stateMap.timeData
                    });
                }
            }
        };

        pullSliderToNearestStop = function(initial){
            var min, curVal, nearestIndex;
            if(stateMap && stateMap.timeData && stateMap.timeData.stops){
                min = 100000;
                array.forEach(stateMap.timeData.stops, function(stop, index){
                    if(stop && stop.markerDom){
                        curVal = Math.abs(stop.markerDom.offsetLeft - (queryMap.slider.offsetLeft+queryMap.slider.offsetWidth / 2));
                        if(curVal < min){
                            min = curVal;
                            nearestIndex = index;
                        }
                    }
                });
                toStop(nearestIndex);
            }
        };

        genTimeLine = function(){
            if(!stateMap.timeData || !stateMap.timeData.stops){
                return;
            }
            var stop, markerDom, width;
            for(var i=0;i<stateMap.timeData.stops.length;i++){
                stop = stateMap.timeData.stops[i];
                markerDom = domConstruct.toDom(string.substitute(templates.marker, {
                    'index': i,
                    'value': stop.value
                }));
                configMap.showMarkerLabel || domClass.add(markerDom, 'hide-marker-label');
                domStyle.set(markerDom, {
                    'width': (i+1<stateMap.timeData.stops.length)?(100 / (stateMap.timeData.stops.length - 1)) + '%': '0',
                    'height': '100%'
                });
                stop.markerDom = markerDom;
                domConstruct.place(markerDom, queryMap.markers);
            }
        };

        setTimeData = function(timeData){
            if(!timeData){
                return;
            }
            if(timeData.type != 'category'){
                console.error("timeData type '"+timeData.type+"' currently not supported!");
                return;
            }
            stateMap.timeData = timeData;
            
            genTimeLine();
            window.setTimeout(function(){
                toStop(0, true);
            }, 0);
        };

        initDom = function(){
            queryMap.parent = configMap.container;

            queryMap.main = domConstruct.toDom(templates.main);

            queryMap.markers = query('.time-slider-markers', queryMap.main)[0];

            queryMap.slider = query('.time-slider-slider-wrapper', queryMap.main)[0];

            queryMap.sliderTooltip = query('.time-slider-tooltip', queryMap.main)[0];

            queryMap.buffered = query('.time-slider-buffered', queryMap.main)[0];

            domConstruct.place(queryMap.main, queryMap.parent);

            eventHandlerMap.mousedownOnSlider = on(queryMap.slider, 'mousedown', mousedownOnSliderHandler);
            eventHandlerMap.mouseup = on(document, 'mouseup', mouseupHandler);
            eventHandlerMap.mousemove = on(document, 'mousemove', mousemoveHandler);
            eventHandlerMap.mousemoveOnSlider = on(queryMap.slider, 'mousemove', mousemoveOnSliderHandler);
            eventHandlerMap.mouseoutSlider = on(queryMap.slider, 'mouseout', mouseoutSliderHandler);
            eventHandlerMap.mousemoveOnTimeline = on(document, 'mousemove', mousemoveOnTimelineHandler);
            eventHandlerMap.resizeContainer = on(window, 'resize', resizeContainerHandler);
            eventHandlerMap.mousedownOnTimeline = on(queryMap.markers, '.time-slider-marker:mousedown', mousedownOnTimelineHandler);
            eventHandlerMap.mousedownOnBuffer = on(queryMap.buffered, 'mousedown', mousedownOnTimelineHandler);
            
        };

        destroy = function(){
            if(eventHandlerMap.mousedownOnTimeline){
                eventHandlerMap.mousedownOnTimeline.remove();
                delete eventHandlerMap.mousedownOnTimeline;
            }
            if(eventHandlerMap.resizeContainer){
                eventHandlerMap.resizeContainer.remove();
                delete eventHandlerMap.resizeContainer;
            }
            if(eventHandlerMap.mousemoveOnTimeline){
                eventHandlerMap.mousemoveOnTimeline.remove();
                delete eventHandlerMap.mousemoveOnTimeline;
            }
            if(eventHandlerMap.mouseoutSlider){
                eventHandlerMap.mouseoutSlider.remove();
                delete eventHandlerMap.mouseoutSlider;
            }
            if(eventHandlerMap.mouseoverOnSider){
                eventHandlerMap.mouseoverOnSider.remove();
                delete eventHandlerMap.mouseoverOnSider;
            }
            if(eventHandlerMap.mousemove){
                eventHandlerMap.mousemove.remove();
                delete eventHandlerMap.mousemove;
            }
            if(eventHandlerMap.mouseup){
                eventHandlerMap.mouseup.remove();
                delete eventHandlerMap.mouseup;
            }
            if(eventHandlerMap.mousedownOnSliderHandler){
                eventHandlerMap.mousedownOnSliderHandler.remove();
                delete eventHandlerMap.mousedownOnSliderHandler;
            }
            if(queryMap && queryMap.main){
                domConstruct.destroy(queryMap.main);
            }
            stateMap = null;
        };

        emit = function(eventName, eventObject){
            if(eventName && eventHandlers[eventName]){
                return eventHandlers[eventName].apply(null, [eventObject || {}]);
            }
            return true;
        };

        init = function(options){
            options = options || {};

            if(!options.container){
                throw "need 'container' for init!";
            }

            stateMap = {};

            lang.mixin(configMap, options);
            lang.mixin(eventHandlers, options.eventHandlers);

            initDom();
        };

        setPlayInterval = function(interval){
            if(interval !== null && !isNaN(interval)){
                configMap.playInterval = interval;
            }
        };

        getPlayInterval = function(){
            return configMap.playInterval;
        };

        setAutoReplay = function(autoReplay){
            configMap.autoReplay = autoReplay;
        };

        config = function(confMap){
            confMap = confMap || {};
            lang.mixin(configMap, confMap);
        };

        init(options);

        exports = {
            'setTimeData': setTimeData,
            'toStop': toStop,
            'play': play,
            'stop': stop,
            'reset': reset,
            'destroy': destroy,
            'config': config,
            'setPlayInterval': setPlayInterval,
            'getPlayInterval': getPlayInterval,
            'setAutoReplay': setAutoReplay
        };

        lang.mixin(exports, constants);

        return exports;
    };
});
