define([
    'dojo/_base/lang',
    './swmm-pipe-node-model-utils'
], function(
    lang,
    PipeNodeUtils
){
    'use strict';

    return function(){
        var stateMap = {},
            pipeNodeUtils = new PipeNodeUtils();

        function getOBJECTID(feature){
            if(feature && feature.attributes){
                return feature.attributes.OBJECTID || feature.attributes.objectid;
            }
            return null;
        }

        function getId(feature){
            if(feature && feature.attributes){
                return feature.attributes.INPCODE;
            }
            return null;
        }

        function getLength(feature){
            if(feature && feature.attributes){
                return feature.attributes.LENGTH;
            }
            return null;
        }

        function getInJuncID(feature){
            if(feature && feature.attributes){
                return feature.attributes.inletNode;
            }
            return null;
        }
        
        function getOutJuncID(feature){
            if(feature && feature.attributes){
                return feature.attributes.outletNode;
            }
            return null;
        }

        function getInletHeight(feature){
            if(feature && feature.attributes){
                if(feature.attributes.InletHeight!=undefined)
                   return feature.attributes.InletHeight;
                else   
                   return feature.attributes.InletHeigh;
            }
            return null;
        }

        function getOutletHeight(feature){
            if(feature && feature.attributes){
                if(feature.attributes.OutletHeight!=undefined)
                   return feature.attributes.OutletHeight;
                else   
                   return feature.attributes.OutletHeig;
            }
            return null;
        }

        function getInNode(feature){
            var node;
            if(feature && feature.attributes && stateMap.pipeNodeInfo && stateMap.pipeNodeInfo.idMap){
                node = stateMap.pipeNodeInfo.idMap[getInJuncID(feature)];
            }
            return node || null;
        }

        function getOutNode(feature){
            var node;
            if(feature && feature.attributes && stateMap.pipeNodeInfo && stateMap.pipeNodeInfo.idMap){
                node = stateMap.pipeNodeInfo.idMap[getOutJuncID(feature)];
            }
            return node || null;
        }

        function getInElev(feature){
            var node;
            if(feature && feature.attributes && stateMap.pipeNodeInfo && stateMap.pipeNodeInfo.idMap && stateMap.pipeNodeInfo.idMap[getInJuncID(feature)]){
                node = stateMap.pipeNodeInfo.idMap[getInJuncID(feature)];
                if(feature.attributes.InletHeight!=undefined)
                    return pipeNodeUtils.getBotElev(node) + feature.attributes.InletHeight;
                else
                    return pipeNodeUtils.getBotElev(node) + feature.attributes.InletHeigh;    
            }
            return null;
        }

        function getOutElev(feature){
            var node;
            if(feature && feature.attributes && stateMap.pipeNodeInfo && stateMap.pipeNodeInfo.idMap && stateMap.pipeNodeInfo.idMap[getOutJuncID(feature)]){
                node = stateMap.pipeNodeInfo.idMap[getOutJuncID(feature)];
                if(feature.attributes.OutletHeight!=undefined)
                    return pipeNodeUtils.getBotElev(node) + feature.attributes.OutletHeight;
                else
                    return pipeNodeUtils.getBotElev(node) + feature.attributes.OutletHeig;    
            }
            return null;
        }

        function getShapeType(feature){
            if(feature && feature.attributes && feature.layerInfo){
                if(feature._layerInfo.id === 7){
                    return 0;
                }else if(feature._layerInfo.id === 6){
                    return 1;
                }
            }
            return null;
        }

        function getShapeDepth(feature){
            if(feature && feature.attributes){
                return feature.attributes.Geom1;
            }
            return null;
        }

        function getHorizontalProjection(feature){
            var elevDelta, projection;
            if(feature){
                elevDelta = getInElev(feature) - getOutElev(feature);
                projection = Math.sqrt(Math.pow(getLength(feature), 2) - Math.pow(elevDelta, 2));
            }
            return projection;
        }

        function config(options){
            options = options || {};
            if(!options.pipeNodeInfo || !options.pipeNodeInfo.idMap){
                throw "'options.pipeNodeInfo.idMap' is needed for config";
            }
            
            lang.mixin(stateMap, options);
        }

        return {
            'getOBJECTID': getOBJECTID,
            'getId': getId,
            'getLength': getLength,
            'getInletHeight': getInletHeight,
            'getOutletHeight': getOutletHeight,
            'getInJuncID': getInJuncID,
            'getOutJuncID': getOutJuncID,
            'getInElev': getInElev,
            'getOutElev': getOutElev,
            'getInNode': getInNode,
            'getOutNode': getOutNode,
            'getShapeType': getShapeType,
            'getShapeDepth': getShapeDepth,
            'getHorizontalProjection': getHorizontalProjection,
            'config': config
        };
    };
});
