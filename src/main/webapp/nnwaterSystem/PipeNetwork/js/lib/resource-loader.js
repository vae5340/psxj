define([
    'dojo/string',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/query'
], function(
    string,
    dom,
    domConstruct,
    query
){
    'use strict';
    var exports,
        caches = {},
        templates = {
            'LINK_CSS': "<link rel=\"stylesheet\" type=\"text/css\" href=\"${location}\"/>"
        },
        //------
        normaliszeUrl,
        getPathFromDir,
        addCSSFile,
        getDojoModuleLocation;

    normaliszeUrl = function(url){
        var pos = url.indexOf('://'),
            prefix, suffix;
        if(pos > -1){
            prefix = url.substring(0, pos + 3);
            suffix = url.substring(pos + 3);
        }else{
            prefix = '';
            suffix = url;
        }
        suffix = suffix.replace(/\/+/g, '/');
        return prefix + suffix;
    };

    addCSSFile = function(location, dir){
        if(!location){
            return false;
        }

        location = getPathFromDir(location, dir);

        if(caches[location]){
            return true;
        }
        var domString = string.substitute(templates.LINK_CSS, {
            'location': location
        }), head = query('head', document)[0];
        
        domConstruct.place(domConstruct.toDom(domString), head);

        caches[location] = true;
        return true;
    };

    getDojoModuleLocation = function(mod){
        var uri = mod.uri,
            dir = null;
        if(uri){
            dir = uri.replace(/(.*\/)([^\/]*)$/, '$1');
        }
        return dir;
    };

    getPathFromDir = function(location, dir){
        location = (dir?dir:'')+location;
        location = normaliszeUrl(location);
        return location;
    };

    exports = {
        'addCSSFile': addCSSFile,
        'getDojoModuleLocation': getDojoModuleLocation,
        'getPathFromDir': getPathFromDir
    };

    return exports;
});
