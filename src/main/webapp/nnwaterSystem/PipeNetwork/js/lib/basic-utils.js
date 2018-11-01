define([
    'dojo/string',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/html',
], function(
    string,
    dom,
    domConstruct,
    domStyle,
    html
){
    'use strict';
    var exports,
        //----
        isNumber,
        getTextNetWidth;

    /**
     * 判断参数是不是一个数字，因为 isNaN 函数对于 null 的判断结果是 false，所以不能很好地用于判断是否数字，需要加多对 null 的判断；判断式稍显冗长，故抽取成该函数方便使用。
     * @param tar {Object} 要判断的对象
     * @return {Boolean} 参数是否为数字。
     */
    isNumber= function(tar){
        return tar !== null && !isNaN(tar);
    };

    getTextNetWidth = (function(){
        var span = domConstruct.toDom("<span style=\"position: absolute; visibility: hidden; left: -1000000px; top: -1000000px;padding: 0; margin: 0;\"></span>");

        domConstruct.place(span, document.body);

        return function(text, fontSize){
            if(text === undefined || text === null || !fontSize){
                return 0;
            }
            var width;
            text = text + '';
            html.set(span, text);
            domStyle.set(span, 'font-size', fontSize + 'px');
            width = span.offsetWidth;
            domConstruct.empty(span);
            return width;
        };
    })();

    exports = {
        'isNumber': isNumber,
        'getTextNetWidth': getTextNetWidth
    };

    return exports;
});
