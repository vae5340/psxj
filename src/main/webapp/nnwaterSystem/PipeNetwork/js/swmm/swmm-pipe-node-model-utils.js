define([], function(){
    'use strict';
    return function(){
        function getBotElev(feature){
            if(feature && feature.attributes){
                return feature.attributes.INVERTELEV;
            }
            return null;
        }

        function getDepth(feature){
            if(feature && feature.attributes){
                return feature.attributes.MaxDepth;
            }
            return null;
        }

        function getId(feature){
            if(feature && feature.attributes){
                return feature.attributes.INPCODE;
            }
            return null;
        }

        function getOBJECTID(feature){
            if(feature && feature.attributes){
                return feature.attributes.OBJECTID || feature.attributes.objectid;
            }
            return null;
        }
        
        return {
            'getBotElev': getBotElev,
            'getDepth': getDepth,
            'getId': getId,
            'getOBJECTID': getOBJECTID
        };
    };
});
