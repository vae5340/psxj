/**
 * 数据配置项格式
 */
define([], function() {
    "use strict";
    var exports,
        //----
        //common models
        units,
        //domain models----
        pipeModel,
        combModel,
        manholeModel,
        conduitModel,
        outfallModel,
        /*
         interceptionModel,
         retentionModel,
         */
        pumpstationModel,
        weirModel,
        gateModel,
        valveModel,
        //----
        isNumber,
        makeNumberFormatter,
        milliDateFormatter;
    //---------

    isNumber = function(target) {
        return target !== null && !isNaN(target);
    };

    makeNumberFormatter = function(toFixed){
        toFixed = (isNumber(toFixed) && toFixed >= 0)? toFixed: 2;
        return function(value){
            var fValue;
            if(isNumber(value)){
                fValue = value.toFixed(toFixed);
            }
            return isNumber(fValue)?fValue: '';
        };
    };

    milliDateFormatter = function(milli){
        if(milli === null || milli === undefined){
            return '';
        }
        var match;
        if(!isNumber(milli)){
            if((match = milli.match(/ *([^ ]+) .*/))){
                return match[1];
            }
            return milli || '';
        }
        var date = new Date();
        date.setTime(milli);
        return date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();
    };

    //----------

    units = {
        'METER': {
            'en': 'meter',
            'cn': '米',
            'symbol': 'm'
        },
        'CUBICMETER_PER_SECOND': {
            'en': 'cubicmeter/second',
            'cn': '立方米/秒',
            'symbol': 'm³/s'
        },
        'CUBICMETER': {
            'en': 'cubicmeter',
            'cn': '立方米',
            'symbol': 'm³'
        }
    };
    //----------

    pipeModel = { //排水管数据模型
        'name': 'pipe', //排水管
        'displayName': '管线',
        'idField': 'PIPEID',
        'displayFields': [
            'OBJECTID', 'PIPEID', /* 'SYSTEMID',*/ 'LANE_WAY', 'PIPE_CATEGORY', 'PIPE_LEN', 'IN_JUNCID', 'OUT_JUNCID',
            'IN_ELEV', 'OUT_ELEV', 'SHAPETYPE', 'SHAPE_DATA1',
            /*'SHAPE_DATA2', 'SHAPE_DATA3',
             'SHAPE_DATA4', 'SHAPE_XYDATA',*/
            'MATERIAL', 'ROUGHNESS', 'DATASOURCE',/* 'RECORD_DATE' ,*/
            'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        /*'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'pipeID': {
                'type': 'C(17)',
                'external': 'pipeID', //标准字段名对应的外部字段名，若数据遵循《导则》，则该字段的值即标准字段名，默认遵循《导则》
                'name': '排水管标识码' //,
                    //'inputFormatter': function(externalValue, internalField, attributes){ return value; }//该字段特定的输入格式化函数，若无指定，使用model的defaultFieldInputFormatter
                    //'outputFormatter': function(internalValue, internalField, attributes){ return value; }//该字段特定的输出格式化函数, 若无指定，使用model的defaultFieldExternalFormatter
                    //'displayFormatter': function(internalValue, internalField, attributes){ return value; }//该字段特定的展示格式化函数, 若无指定，使用model的defaultFieldDisplayFormatter
            },
            'SystemID': {
                'type': 'C(20)',
                'external': 'SystemID',
                'name': '排水系统编码'
            },
            'Pipe_Category': {
                'type': 'I',
                'external': 'Pipe_Category',
                'name': '管道类别', 
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '河流',
                    '4': '其他'
                },
                'displayFormatter': function(internalValue) {
                    return pipeModel.fields.Pipe_Category.enum[internalValue] || internalValue || '';
                }
            },
            'Pipe_Len': {
                'type': 'D(7,3)',
                'external': 'Pipe_Len',
                'name': '管道长度',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'In_JuncID': {
                'type': 'C(17)',
                'external': 'In_JuncID',
                'name': '起点编号'
            },
            'Out_JuncID': {
                'type': 'C(17)',
                'external': 'Out_JuncID',
                'name': '终点编号'
            },
            'In_Elev': {
                'type': 'D(7,3)',
                'external': 'In_Elev',
                'name': '起点管底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'Out_Elev': {
                'type': 'D(7,3)',
                'external': 'Out_Elev',
                'name': '终点管底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'ShapeType': {
                'type': 'I',
                'external': 'ShapeType',
                'name': '断面形式',
                'enum': {
                    '1': '圆形',
                    '2': '梯形',
                    '3': '三角形',
                    '4': '椭圆形',
                    '5': '矩形',
                    '6': '不规则形状'
                },
                'displayFormatter': function(internalValue) {
                    return pipeModel.fields.ShapeType.enum[internalValue] || internalValue || '';
                }
            },
            'Shape_Data1': {
                'type': 'D(5,3)',
                'external': 'Shape_Data1',
                'name': '管径',
                'unit': units.METER
            },
            'Shape_Data2': {
                'type': 'D(5,3)',
                'external': 'Shape_Data2',
                'name': '断面数据2',
                'unit': units.METER
            },
            'Shape_Data3': {
                'type': 'D(5,3)',
                'external': 'Shape_Data3',
                'name': '断面数据3',
                'unit': units.METER
            },
            'Shape_Data4': {
                'type': 'D(5,3)',
                'external': 'Shape_Data4',
                'name': '断面数据4',
                'unit': units.METER
            },
            'Shape_XYData': {
                'type': 'I',
                'external': 'Shape_XYData',
                'name': '断面数据5'
            },
            'Material': {
                'type': 'C(20)',
                'external': 'Material',
                'name': '管道材质'
            },
            'ROUGHNESS': {
                'type': 'D(5,4)',
                'external': 'ROUGHNESS',
                'name': '管道糙率'
            },
            'DataSource': {
                'type': 'D(5,4)',
                'external': 'DataSource',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return pipeModel.fields.DataSource.enum[value] || value || '';
                }
            },
            'Record_Date': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'Record_Date',
                'name': '数据获取时间'
            },
            'ReportDept': {
                'type': 'C(30)',
                'external': 'ReportDept',
                'name': '填报单位'
            },
            'ReportDate': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'ReportDate',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'Lane_Way': {
                'type': 'C(20)',
                'external': 'Lane_Way',
                'name': '所在道路名称'
            }
        }*/
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'PIPEID': {
                'type': 'C(17)',
                'external': 'PIPEID', //标准字段名对应的外部字段名，若数据遵循《导则》，则该字段的值即标准字段名，默认遵循《导则》
                'name': '排水管标识码' //,
                    //'inputFormatter': function(externalValue, internalField, attributes){return value; }//该字段特定的输入格式化函数，若无指定，使用model的defaultFieldInputFormatter
                    //'outputFormatter': function(internalValue, internalField, attributes){return value; }//该字段特定的输出格式化函数, 若无指定，使用model的defaultFieldExternalFormatter
                    //'displayFormatter': function(internalValue, internalField, attributes){ return value; }//该字段特定的展示格式化函数, 若无指定，使用model的defaultFieldDisplayFormatter
            },
            'SYSTEMID': {
                'type': 'C(20)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'PIPE_CATEGORY': {
                'type': 'I',
                'external': 'PIPE_CATEGORY',
                'name': '管道类别', 
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '河流',
                    '4': '其他'
                },
                'displayFormatter': function(internalValue) {
                    return pipeModel.fields.PIPE_CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'PIPE_LEN': {
                'type': 'D(7,3)',
                'external': 'PIPE_LEN',
                'name': '管道长度',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'IN_JUNCID': {
                'type': 'C(17)',
                'external': 'IN_JUNCID',
                'name': '起点编号'
            },
            'OUT_JUNCID': {
                'type': 'C(17)',
                'external': 'OUT_JUNCID',
                'name': '终点编号'
            },
            'IN_ELEV': {
                'type': 'D(7,3)',
                'external': 'IN_ELEV',
                'name': '起点管底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'OUT_ELEV': {
                'type': 'D(7,3)',
                'external': 'OUT_ELEV',
                'name': '终点管底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'SHAPETYPE': {
                'type': 'I',
                'external': 'SHAPETYPE',
                'name': '断面形式',
                'enum': {
                    '1': '圆形',
                    '2': '梯形',
                    '3': '三角形',
                    '4': '椭圆形',
                    '5': '矩形',
                    '6': '不规则形状'
                },
                'displayFormatter': function(internalValue) {
                    return pipeModel.fields.SHAPETYPE.enum[internalValue] || internalValue || '';
                }
            },
            'SHAPE_DATA1': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA1',
                'name': '管径',
                'unit': units.METER
            },
            'SHAPE_DATA2': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA2',
                'name': '断面数据2',
                'unit': units.METER
            },
            'SHAPE_DATA3': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA3',
                'name': '断面数据3',
                'unit': units.METER
            },
            'SHAPE_DATA4': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA4',
                'name': '断面数据4',
                'unit': units.METER
            },
            'SHAPE_XYDATA': {
                'type': 'I',
                'external': 'SHAPE_XYDATA',
                'name': '断面数据5'
            },
            'MATERIAL': {
                'type': 'C(20)',
                'external': 'MATERIAL',
                'name': '管道材质'
            },
            'ROUGHNESS': {
                'type': 'D(5,4)',
                'external': 'ROUGHNESS',
                'name': '管道糙率'
            },
            'DATASOURCE': {
                'type': 'D(5,4)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return pipeModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'LANE_WAY': {
                'type': 'C(20)',
                'external': 'LANE_WAY',
                'name': '所在道路名称'
            }
        }
    };

    combModel = { //雨水口数据模型
        'name': 'comb', //雨水口
        'displayName': '雨水口',
        'idField': 'COMBID',
        'displayFields': [
            'OBJECTID', 'COMBID'/* 'SYSTEMID'*/ , 'LANE_WAY', 'X_COOR', 'Y_COOR', 'INLET_TYPE', 'MAXDEPTH',
            'SURFACE_ELE', 'DATASOURCE'/*'RECORD_DATE'*/, 'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'COMBID': {
                'type': 'C(17)',
                'external': 'COMBID',
                'name': '唯一编码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'INLET_TYPE': {
                'type': 'C(10)',
                'external': 'INLET_TYPE',
                'name': '雨水口形式',
                'enum': {
                    '1': '平篦式',
                    '2': '立篦式',
                    '3': '联合式',
                    '4': '偏沟式',
                    '5': '道牙',
                    '6': '其他'
                },
                'displayFormatter': function(value){
                    var fValue = combModel.fields.INLET_TYPE.enum[value];
                    if(!fValue && isNumber(value)){
                        fValue = value + '';
                    }
                    return (fValue || isNumber(fValue))?fValue: (value || '');
                }
            },
            'MAXDEPTH': {
                'type': 'D(6,3)',
                'external': 'MAXDEPTH',
                'name': '雨水口最大深度',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'SURFACE_ELE': {
                'type': 'D(7,3)',
                'external': 'SURFACE_ELEV',
                'name': '雨水口地表高程',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return combModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'LANE_WAY': {
                'type': 'C(20)',
                'external': 'LANE_WAY',
                'name': '所在道路名称'
            }
        }
    };

    manholeModel = {
        'name': 'manhole',
        'displayName': '检查井',
        'idField': 'NODEID',
        'displayFields': [
            'OBJECTID', 'NODEID', /* 'SYSTEMID',*/'LANE_WAY', 'X_COOR', 'Y_COOR', 'JUNC_CATEGORY',
            /*'JUNC_TYPE',*/ 'JUNC_STYLE', 'DEPTH', 'SURFACE_ELE',
            'DATASOURCE', /*'RECORD_DATE',*/ 'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'NODEID': {
                'type': 'C(17)',
                'external': 'NODEID',
                'name': '检查井标识码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标Y'
            },
            'JUNC_CATEGORY': {
                'type': 'I',
                'external': 'JUNC_CATEGORY',
                'name': '检查井类别',
                'enum': {
                    '1': '雨水井',
                    '2': '污水井',
                    '3': '合流井',
                    '4': '其他'
                },
                'displayFormatter': function(internalValue) {
                    return manholeModel.fields.JUNC_CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'JUNC_TYPE': {
                'type': 'I',
                'external': 'JUNC_TYPE',
                'name': '检查井类型',
                'enum': {
                    '1': '排水井',
                    '2': '接户井',
                    '3': '闸阀井',
                    '4': '溢流井',
                    '5': '倒虹井',
                    '6': '透气井',
                    '7': '压力井',
                    '8': '检测井',
                    '9': '拍门井',
                    '10': '截流井',
                    '11': '水封井',
                    '12': '跌水井',
                    '13': '其它'
                },
                'displayFormatter': function(value){
                    var fValue = manholeModel.fields.JUNC_TYPE.enum[value];
                    if(!fValue && isNumber(value)){
                        fValue = value + '';
                    }
                    return (fValue || isNumber(fValue))? fValue: (value || '');
                }
            },
            'JUNC_STYLE': {
                'type': 'C(10)',
                'external': 'JUNC_STYLE',
                'name': '检查井形式',
                'enum': {
                    '1': '一通',
                    '2': '二通直',
                    '3': '二通转',
                    '4': '三通',
                    '5': '四通',
                    '6': '五通',
                    '7': '五通以上',
                    '8': '暗井',
                    '9': '侧立型Ⅱ',
                    '10': '平面型I',
                    '11': '平面型Ⅲ',
                    '12': '其它'
                },
                'displayFormatter': function(value){
                    var fValue = manholeModel.fields.JUNC_STYLE.enum[value];
                    if(!fValue && isNumber(value)){
                        fValue = value + '';
                    }
                    return (fValue || isNumber(fValue))? fValue: (value || '');
                }                
            },
            'DEPTH': {
                'type': 'D(6,3)',
                'external': 'DEPTH',
                'name': '检查井井深',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'SURFACE_ELE': {
                'type': 'D(7,3)',
                'external': 'SURFACE_ELE',
                'name': '地面高程',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return manholeModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'LANE_WAY': {
                'type': 'C(20)',
                'external': 'LANE_WAY',
                'name': '所在道路名称'
            }
        }
    };

    conduitModel = {
        'name': 'conduit',
        'displayName': '沟渠',
        'idField': 'CONDUITID',
        'displayFields': [
            'OBJECTID', 'CONDUITID', /* 'SYSTEMID', */'LANE_WAY', 'CONDUIT_CATEGORY', /*'CONDUIT_STYLE',*/ 'CONDUIT_LEN',
            'IN_JUNCID', 'OUT_JUNCID', 'IN_ELE', 'OUT_ELE', 'SHAPETYPE', 'SHAPE_DATA1',
            'SHAPE_DATA2', /* 'SHAPE_DATA3', 'SHAPE_DATA4', 'SHAPE_XYDATA', */ 'MATERIAL',
            'ROUGHNESS', 'DATASOURCE', /*'RECORD_DATE',*/ 'REPORTDEPT', 'REPORTDATE',
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'CONDUITID': {
                'type': 'C(17)',
                'external': 'CONDUITID',
                'name': '排水渠标识码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'CONDUIT_CATEGORY': {
                'type': 'I',
                'external': 'CONDUIT_CATEGORY',
                'name': '渠道类别',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其它'
                },
                'displayFormatter': function(internalValue) {
                    return conduitModel.fields.CONDUIT_CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'CONDUIT_STYLE': {
                'type': 'I',
                'external': 'CONDUIT_STYLE',
                'name': '渠道类型',
                'enum': {
                    '1': '明渠',
                    '2': '暗渠'
                },
                'displayFormatter': function(internalValue) {
                    return conduitModel.fields.CONDUIT_STYLE.enum[internalValue] || internalValue || '';
                }
            },
            'CONDUIT_LEN': {
                'type': 'D(7,3)',
                'external': 'CONDUIT_LEN',
                'name': '渠道长度',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'IN_JUNCID': {
                'type': 'C(17)',
                'external': 'IN_JUNCID',
                'name': '起点编码'
            },
            'OUT_JUNCID': {
                'type': 'C(17)',
                'external': 'OUT_JUNCID',
                'name': '终点编码'
            },
            'IN_ELE': {
                'type': 'D(7,3)',
                'external': 'IN_ELE',
                'name': '起点渠底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'OUT_ELE': {
                'type': 'D(7,3)',
                'external': 'OUT_ELE',
                'name': '终点渠底标高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'SHAPETYPE': {
                'type': 'I',
                'external': 'SHAPETYPE',
                'name': '断面形式',
                'enum': {
                    '1': '圆形',
                    '2': '明渠',
                    '3': '暗涵',
                    '4': '梯形',
                    '5': '三角形',
                    '6': '椭圆形',
                    '7': '矩形',
                    '8': '不规则形状'
                },
                'displayFormatter': function(internalValue) {
                    return conduitModel.fields.SHAPETYPE.enum[internalValue] || internalValue || '';
                }
            },
            'SHAPE_DATA1': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA1',
                'name': '截面深度',
                'unit': units.METER
            },
            'SHAPE_DATA2': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA2',
                'name': '截面宽度',
                'unit': units.METER
            },
            'SHAPE_DATA3': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA3',
                'name': '断面数据3',
                'unit': units.METER
            },
            'SHAPE_DATA4': {
                'type': 'D(5,3)',
                'external': 'SHAPE_DATA4',
                'name': '断面数据4',
                'unit': units.METER
            },
            'SHAPE_XYDATA': {
                'type': 'Shape_XYData',
                'external': 'SHAPE_XYDATA',
                'name': '断面数据5',
                'unit': units.METER
            },
            'MATERIAL': {
                'type': 'C(20)',
                'external': 'MATERIAL',
                'name': '渠道材质'
            },
            'ROUGHNESS': {
                'type': 'D(5,4)',
                'external': 'ROUGHNESS',
                'name': '渠道粗糙'
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return conduitModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'LANE_WAY': {
                'type': 'C(20)',
                'external': 'LANE_WAY',
                'name': '所在道路名称'
            }
        }
    };

    outfallModel = {
        'name': 'outfall',
        'displayName': '排放口',
        'idField': 'OUTFALLID',
        'displayFields': [
            'OBJECTID', 'OUTFALLID', /* 'SYSTEMID',*/ 'NAME', 'ADDR', 'X_COOR', 'Y_COOR', 'RECEIVEWATER', 'CATEGORY',
            'FLAP', 'BOTELE', 'OUTFALLTYPE', 'DATASOURCE', /*'RECORD_DATE',*/ 'REPORTDEPT',
            'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'OUTFALLID': {
                'type': 'C(17)',
                'external': 'OUTFALLID',
                'name': '唯一编码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'C(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'C(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'RECEIVEWATER': {
                'type': 'C(17)',
                'external': 'RECEIVEWATER',
                'name': '受纳水体编号'
            },
            'CATEGORY': {
                'type': 'I',
                'external': 'CATEGORY',
                'name': '类别',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其他'
                },
                'displayFormatter': function(internalValue) {
                    return outfallModel.fields.CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'FLAP': {
                'type': 'I',
                'external': 'FLAP',
                'name': '是否有拍门',
                'enum': {
                    '0': '否',
                    '1': '是'
                },
                'displayFormatter': function(internalValue) {
                    return outfallModel.fields.FLAP.enum[internalValue] || internalValue || '';
                }

            },
            'BOTELE': {
                'type': 'D(7,3)',
                'external': 'BOTELE',
                'name': '底部高程',
                'unit': units.METER
            },
            'OUTFALLTYPE': {
                'type': 'I',
                'external': 'OUTFALLTYPE',
                'name': '出流形式',
                'enum': {
                    '1': '自由流出',
                    '2': '常水位淹没',
                    '3': '潮汐影响'
                },
                'displayFormatter': function(internalValue) {
                    return outfallModel.fields.OUTFALLTYPE.enum[internalValue] || internalValue || '';
                }
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return outfallModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            },
            'NAME': {
                'type': 'C(30)',
                'external': 'NAME',
                'name': '排放口名称'
            },
            'ADDR': {
                'type': 'C(100)',
                'external': 'ADDR',
                'name': '排放口地址'
            }
        }
    };

    valveModel = {
        'name': 'valve',
        'displayName': '阀门',
        'idField': 'VALVEID',
        'displayFields': [
            'OBJECTID', 'VALVEID' /*, 'SYSTEMID'*/ , 'X_COOR', 'Y_COOR', 'NAME', 'CATEGORY', 'TYPE', 'MANUFACTURER',
            'MODEL', 'DATASOURCE', 'DATALISTID', /*'RECORD_DATE',*/ 'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'VALVEID': {
                'type': 'C(17)',
                'external': 'VALVEID',
                'name': '阀门标识码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'NAME': {
                'type': 'C(20)',
                'external': 'NAME',
                'name': '阀门名称'
            },
            'CATEGORY': {
                'type': 'I',
                'external': 'CATEGORY',
                'name': '类别',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其它'
                },
                'displayFormatter': function(internalValue) {
                    return valveModel.fields.CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'TYPE': {
                'type': 'I',
                'external': 'TYPE',
                'name': '阀门类型',
                'enum': {
                    '1': '闸阀',
                    '2': '蝶阀',
                    '3': '排气阀',
                    '4': '其它'
                },
                'displayFormatter': function(internalValue) {
                    return valveModel.fields.TYPE.enum[internalValue] || internalValue || '';
                }
            },
            'MANUFACTURER': {
                'type': 'C(30)',
                'external': 'MANUFACTURER',
                'name': '生产厂家'
            },
            'MODEL': {
                'type': 'C(30)',
                'external': 'MODEL',
                'name': '阀门型号'
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return valveModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'DATALISTID': {
                'type': 'I',
                'external': 'DATALISTID',
                'name': '技术资料文件'
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            }
        }
    };

    pumpstationModel = {
        'name': 'pumpstation',
        'displayName': '排水泵站',
        'idField': 'PUMPSTATIONID',
        'displayFields': [
            'OBJECTID', 'PUMPSTATIONID', 'SYSTEMID', 'X_COOR', 'Y_COOR', 'NAME', 'ADDR', 'PS_CATEGORY1',
            'PS_CATEGORY2', 'PS_NUM', 'DESIGN_STORM', 'DESIGN_SEWER', 'MIN_LEVEL', 'CONTROL_LEVEL',
            'WARNNING_LEVEL', 'DATALISTID', 'DATASOURCE', /*'RECORD_DATE',*/ 'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'PUMPSTATIONID': {
                'type': 'C(17)',
                'external': 'PUMPSTATIONID',
                'name': '排水泵站标志码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'NAME': {
                'type': 'C(30)',
                'external': 'NAME',
                'name': '泵站名称'
            },
            'ADDR': {
                'type': 'C(100)',
                'external': 'ADDR',
                'name': '泵站地址'
            },
            'PS_CATEGORY1': {
                'type': 'I',
                'external': 'PS_CATEGORY1',
                'name': '泵站大类',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其它'
                },
                'displayFormatter': function(internalValue) {
                    return pumpstationModel.fields.PS_CATEGORY1.enum[internalValue] || internalValue || '';
                }
            },
            'PS_CATEGORY2': {
                'type': 'I',
                'external': 'PS_CATEGORY2',
                'name': '泵站小类',
                'enum': {
                    '1': '雨水泵站',
                    '2': '污水泵站',
                    '3': '合流泵站',
                    '4': '地道泵站',
                    '5': '泵闸',
                    '6': '干线输送泵站',
                    '7': '支线输送泵站',
                    '8': '合建泵站',
                    '9': '污水处理厂提升泵站',
                    '10': '其他（临时泵站）'
                },
                'displayFormatter': function(internalValue) {
                    return pumpstationModel.fields.PS_CATEGORY2.enum[internalValue] || internalValue || '';
                }
            },
            'PS_NUM': {
                'type': 'I',
                'external': 'PS_NUM',
                'name': '泵台数'
            },
            'DESIGN_STORM': {
                'type': 'D(6,4)',
                'external': 'DESIGN_STORM',
                'name': '设计雨水排水能力',
                'unit': units.CUBICMETER_PER_SECOND
            },
            'DESIGN_SEWER': {
                'type': 'D(6,4)',
                'external': 'DESIGN_SEWER',
                'name': '设计污水排水能力',
                'unit': units.CUBICMETER_PER_SECOND
            },
            'MIN_LEVEL': {
                'type': 'D(6,2)',
                'external': 'MIN_LEVEL',
                'name': '最低控制水位',
                'unit': units.METER
            },
            'CONTROL_LEVEL': {
                'type': 'D(6,2)',
                'external': 'CONTROL_LEVEL',
                'name': '控制水位',
                'unit': units.METER
            },
            'WARNNING_LEVEL': {
                'type': 'D(6,2)',
                'external': 'WARNNING_LEVEL',
                'name': '警戒水位',
                'unit': units.METER
            },
            'DATALISTID': {
                'type': 'I',
                'external': 'DATALISTID',
                'name': '技术资料文件'
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return pumpstationModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报日期',
                'displayFormatter': milliDateFormatter
            }
        }
    };

    weirModel = {
        'name': 'weir',
        'displayName': '溢流堰',
        'idField': 'WEIRID',
        'displayFields': [
            'OBJECTID', 'WEIRID', 'SYSTEMID', 'X_COOR', 'Y_COOR', 'CATEGORY', 'TOP_ELE', 'BOT_ELE',
            'HEIGHT', 'WIDTH', 'DATASOURCE', 'DATALISTID', /*'RECORD_DATE',*/ 'REPORTDEPT',
            'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'WEIRID': {
                'type': 'C(17)',
                'external': 'WEIRID',
                'name': '溢流堰识别码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'CATEGORY': {
                'type': 'I',
                'external': 'CATEGORY',
                'name': '类别',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其他'
                },
                'displayFormatter': function(internalValue) {
                    return weirModel.fields.CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'TOP_ELE': {
                'type': 'D(7,3)',
                'external': 'TOP_ELE',
                'name': '堰顶高程',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'BOT_ELE': {
                'type': 'D(7,3)',
                'external': 'BOT_ELE',
                'name': '堰底高程',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'HEIGHT': {
                'type': 'D(5,3)',
                'external': 'HEIGHT',
                'name': '堰高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'WIDTH': {
                'type': 'D(5,3)',
                'external': 'WIDTH',
                'name': '堰宽',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return weirModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'DATALISTID': {
                'type': 'I',
                'external': 'DATALISTID',
                'name': '技术资料文件'
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报时间',
                'displayFormatter': milliDateFormatter
            }
        }
    };

    gateModel = {
        'name': 'gate',
        'displayName': '闸门',
        'idField': 'GATEID',
        'displayFields': [
            'OBJECTID', 'GATEID', 'SYSTEMID', 'X_COOR', 'Y_COOR', 'NAME', 'CATEGORY', 'MANUFACTURER',
            'MODEL', 'TOP_ELE', 'HEIGHT', 'WIDTH', 'DATASOURCE', 'DATALISTID', /*'RECORD_DATE',*/
            'REPORTDEPT', 'REPORTDATE'
        ],
        'defaultObjectInputFormatter': function(attributes) {
            return attributes;
        },
        'defaultObjectOutputFormatter': function(attributes) {
            return attributes;
        },
        'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
            return externalValue;
        },
        'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
            return internalValue;
        },
        'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
            return internalValue || (isNumber(internalValue)? internalValue: '');
        },
        'fields': {
            'OBJECTID': {
                'type': 'I',
                'external': 'OBJECTID',
                'name': 'OBJECTID'
            },
            'GATEID': {
                'type': 'C(17)',
                'external': 'GATEID',
                'name': '闸门标识码'
            },
            'SYSTEMID': {
                'type': 'C(17)',
                'external': 'SYSTEMID',
                'name': '排水系统编码'
            },
            'X_COOR': {
                'type': 'D(11,3)',
                'external': 'X_COOR',
                'name': '坐标X'
            },
            'Y_COOR': {
                'type': 'D(11,3)',
                'external': 'Y_COOR',
                'name': '坐标Y'
            },
            'NAME': {
                'type': 'C(20)',
                'external': 'NAME',
                'name': '闸门名称'
            },
            'CATEGORY': {
                'type': 'I',
                'external': 'CATEGORY',
                'name': '类别',
                'enum': {
                    '1': '雨水',
                    '2': '污水',
                    '3': '合流',
                    '4': '其它'
                },
                'displayFormatter': function(internalValue) {
                    return gateModel.fields.CATEGORY.enum[internalValue] || internalValue || '';
                }
            },
            'MANUFACTURER': {
                'type': 'C(30)',
                'external': 'MANUFACTURER',
                'name': '生产厂家'
            },
            'MODEL': {
                'type': 'C(30)',
                'external': 'MODEL',
                'name': '闸门型号'
            },
            'TOP_ELE': {
                'type': 'D(7,3)',
                'external': 'TOP_ELE',
                'name': '闸门高程',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'HEIGHT': {
                'type': 'D(5,3)',
                'external': 'HEIGHT',
                'name': '闸门净高',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'WIDTH': {
                'type': 'D(5,3)',
                'external': 'WIDTH',
                'name': '闸门净宽',
                'unit': units.METER,
                'displayFormatter': makeNumberFormatter(3)
            },
            'DATASOURCE': {
                'type': 'C(50)',
                'external': 'DATASOURCE',
                'name': '数据来源',
                'enum': {
                    '1': '设计图',
                    '2': '竣工图',
                    '3': '现场测绘',
                    '4': '人工估计'
                },
                'displayFormatter': function(value){
                    return gateModel.fields.DATASOURCE.enum[value] || value || '';
                }
            },
            'DATALISTID': {
                'type': 'I',
                'external': 'DATALISTID',
                'name': '技术资料文件'
            },
            'RECORD_DATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'RECORD_DATE',
                'name': '数据获取时间'
            },
            'REPORTDEPT': {
                'type': 'C(30)',
                'external': 'REPORTDEPT',
                'name': '填报单位'
            },
            'REPORTDATE': {
                'type': 'T',
                'timeFormat': 'yyyy-m-d',
                'external': 'REPORTDATE',
                'name': '填报时间',
                'displayFormatter': milliDateFormatter
            }
        }
    };

    exports = {
        'models': { //数据模型，按照《导则》标准，必须有的是排水管，其他的都不是必须的，也可以在此基础上增加其他数据模型，视实际项目需求增减
            'Pipe': pipeModel, //排水管
            'Comb': combModel, //雨水口
            'Manhole': manholeModel, //检查井
            'Conduit': conduitModel, //排水渠
            'Outfall': outfallModel, //排放口
            'Pumpstation': pumpstationModel, //排水泵站
            //            'interception': interceptionModel, // 截流设施
            //            'retention': retentionModel, //调蓄设施
            'Weir': weirModel, //溢流堰
            'Gate': gateModel, //闸门
            'Valve': valveModel //阀门
        }
    };

    return exports;
});
/*
 interceptionModel = {
 'name': 'interceptionModel',
 'displayName': '排水管',
 'idField': 'DividerID',
 'displayFields': [
 'DividerID', 'SystemID', 'X_Coor', 'Y_Coor', 'DividerType', 'DivertedID',
 'DataListID', 'DataSource', 'Record_Date', 'ReportDept', 'ReportDate'
 ],
 'defaultObjectInputFormatter': function(attributes) {
 return attributes;
 },
 'defaultObjectOutputFormatter': function(attributes) {
 return attributes;
 },
 'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
 return externalValue;
 },
 'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
 return internalValue;
 },
 'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
 return internalValue;
 },
 'fields': {
 'DividerID': {
 'type': 'C(17)',
 'external': 'DividerID',
 'name': '截流设施标识码'
 },
 'SystemID': {
 'type': 'C(17)',
 'external': 'SystemID',
 'name': '排水系统编码'
 },
 'X_Coor': {
 'type': 'D(11,3)',
 'external': 'X_Coor',
 'name': '坐标X'
 },
 'Y_Coor': {
 'type': 'D(11,3)',
 'external': 'Y_Coor',
 'name': '坐标Y'
 },
 'DividerType': {
 'type': 'I',
 'external': 'DividerType',
 'name': '截流设施类型',
 'enum': {
 '1': '闸',
 '2': '泵',
 '3': '堰',
 '4': '阀',
 '5': '其它'
 },
 'displayFormatter': function(internalValue) {
 return interceptionModel.fields.DividerType.enum[internalValue];
 }
 },
 'DivertedID': {
 'type': 'C(17)',
 'external': 'DivertedID',
 'name': '截流连接管渠编码'
 },
 'DataListID': {
 'type': 'I',
 'external': 'DataListID',
 'name': '技术资料文件'
 },
 'DataSource': {
 'type': 'C(50)',
 'external': 'DataSource',
 'name': '数据来源'
 },
 'Record_Date': {
 'type': 'T',
 'timeFormat': 'yyyy-m-d',
 'external': 'Record_Date',
 'name': '数据获取时间'
 },
 'ReportDept': {
 'type': 'C(30)',
 'external': 'ReportDept',
 'name': '填报单位'
 },
 'ReportDate': {
 'type': 'T',
 'timeFormat': 'yyyy-m-d',
 'external': 'ReportDate',
 'name': '填报日期'
 }
 }
 };

 retentionModel = {
 'name': 'retention',
 'displayName': '调蓄设施',
 'idField': 'StorageID',
 'displayFields': [
 'StorageID', 'SystemID', 'X_Coor', 'Y_Coor', 'Name', 'Addr', 'Category',
 'Related_Facilities', 'Inflow_Type', 'Outflow_Type', 'Max_Level', 'Min_Level',
 'Normal_Level', 'Total_Vol', 'DataSource', 'DataListID', 'Record_Date', 'ReportDept',
 'ReportDate'
 ],
 'defaultObjectInputFormatter': function(attributes) {
 return attributes;
 },
 'defaultObjectOutputFormatter': function(attributes) {
 return attributes;
 },
 'defaultFieldInputFormatter': function(externalValue, internalField, attributes) {
 return externalValue;
 },
 'defaultFieldOutputFormatter': function(internalValue, internalField, attributes) {
 return internalValue;
 },
 'defaultFieldDisplayFormatter': function(internalValue, internalField, attributes) {
 return internalValue;
 },
 'fields': {
 'StorageID': {
 'type': 'C(17)',
 'external': 'StorageID',
 'name': '调蓄设施标识码'
 },
 'SystemID': {
 'type': 'C(17)',
 'external': 'SystemID',
 'name': '排水系统编码'
 },
 'X_Coor': {
 'type': 'D(11,3)',
 'external': 'X_Coor',
 'name': '坐标X'
 },
 'Y_Coor': {
 'type': 'D(11,3)',
 'external': 'Y_Coor',
 'name': '坐标Y'
 },
 'Name': {
 'type': 'C(30)',
 'external': 'Name',
 'name': '调蓄设施名称'
 },
 'Addr': {
 'type': 'C(100)',
 'external': 'Addr',
 'name': '调蓄池地址'
 },
 'Category': {
 'type': 'I',
 'external': 'Category',
 'name': '类别',
 'enum': {
 '1': '雨水',
 '2': '污水',
 '3': '合流',
 '4': '其他'
 },
 'displayFormatter': function(internalValue) {
 return retentionModel.fields.Category.enum[internalValue];
 }
 },
 'Related_Facilities': {
 'type': 'I',
 'external': 'Related_Facilities',
 'name': '与现有设施的关系',
 'enum': {
 '1': '合建',
 '2': '分建',
 '3': '利用现有设施容量',
 '4': '其他'
 },
 'displayFormatter': function(internalValue) {
 return retentionModel.fields.Related_Facilities.enum[internalValue];
 }
 },
 'Inflow_Type': {
 'type': 'I',
 'external': 'Inflow_Type',
 'name': '进水方式',
 'enum': {
 '1': '截流设施',
 '2': '管道直接',
 '3': '其他'
 },
 'displayFormatter': function(internalValue) {
 return retentionModel.fields.Inflow_Type.enum[internalValue];
 }
 },
 'Outflow_Type': {
 'type': 'I',
 'external': 'Outflow_Type',
 'name': '出水方式',
 'enum': {
 '1': '闸',
 '2': '泵',
 '3': '堰',
 '4': '阀',
 '5': '孔',
 '6': '管道直接',
 '7': '其它'
 },
 'displayFormatter': function(internalValue) {
 return retentionModel.fields.Outflow_Type.enum[internalValue];
 }
 },
 'Max_Level': {
 'type': 'D(6,2)',
 'external': 'Max_Level',
 'name': '最高水位',
 'unit': units.METER
 },
 'Min_Level': {
 'type': 'D(6,2)',
 'external': 'Min_Level',
 'name': '最低水位',
 'unit': units.METER
 },
 'Normal_Level': {
 'type': 'D(6,2)',
 'external': 'Normal_Level',
 'name': '常水位',
 'unit': units.METER
 },
 'Total_Vol': {
 'type': 'D(8,2)',
 'external': 'Total_Vol',
 'name': '调蓄设施容积',
 'unit': units.CUBICMETER
 },
 'DataSource': {
 'type': 'C(50)',
 'external': 'DataSource',
 'name': '数据来源'
 },
 'DataListID': {
 'type': 'I',
 'external': 'DataListID',
 'name': '技术资料文件'
 },
 'Record_Date': {
 'type': 'T',
 'timeFormat': 'yyyy-m-d',
 'external': 'Record_Date',
 'name': '数据获取时间'
 },
 'ReportDept': {
 'type': 'C(30)',
 'external': 'ReportDept',
 'name': '填报单位'
 },
 'ReportDate': {
 'type': 'T',
 'timeFormat': 'yyyy-m-d',
 'external': 'ReportDate',
 'name': '填报日期'
 }
 }
 };
 */
