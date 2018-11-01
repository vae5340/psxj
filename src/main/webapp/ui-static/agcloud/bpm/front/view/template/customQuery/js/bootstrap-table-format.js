//时间格式转换
function formatDatetime(value) {
    if (value == null || value == '') {
        return '';
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else {
        dt = new Date(value);
    }
    return dt.format("yyyy-MM-dd"); //扩展的Date的format方法
}
//时间格式转换
function formatDatetimeCommon(value,format) {
    if (value == null || value == '') {
        return '';
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else if(typeof value == "number"){
        dt = new Date(value);
    }else if(typeof value == "string"){
        try{
            dt = new Date(value);
        }catch (e){
            return value;
        }
    }
    return dt.format(format); //扩展的Date的format方法(agcloud.js里面有代码实现)
}
//数据字典格式化
function formatDicItemCodeToValue(value,dicItemMap) {
    if(valueIsValid(dicItemMap[value])) {
        return dicItemMap[value];
    }else{
        return '';
    }
}
//多选项数据字典格式化,分隔符默认为逗号
function formatMultiDicItemCodeToValue(value,dicItemMap) {
    var arr=value.split(',');
    var new_arr=[];
    var resultStr='';
    if(arr.length>1){
        $.each(arr,function (index,item) {
            new_arr.push(dicItemMap[item]);
        })
        return new_arr.join(',');
    }else if(arr.length==1 && valueIsValid(dicItemMap[value])){
        return dicItemMap[value];
    }else{
        return '';
    }
}
//无效字符的判断
function valueIsValid(obj) {
    //四个表达式判断空
    if(obj==null ) return false;
    if(typeof(obj)=='undefined') return false;
    if(obj=='') return false;
    if(obj.replace(/(^s*)|(s*$)/g,"").length ==0)return false;
    return true;
}

//转换选择器-回调函数实现，由于bootstrap-table的格式器没有 列参数，只能通过全局变量获取，所以初始化table时加载的列配置信息要全局化。
function dicCodeTypeFormat(value, row, index,field){
    var col = getColumsConfig(field);
    if(col){
        if("1" == col['queryMulitSelect']){
            return formatMultiDicItemCodeToValue(value,col['dicCodeItemMap']);
        }else{
            return formatDicItemCodeToValue(value,col['dicCodeItemMap']);
        }
    }
}
function dateFormatterCn(value, row, index){
    return formatDatetimeCommon(value,'yyyy年MM月dd日');
}
function dateFormatter(value, row, index){
    return formatDatetimeCommon(value,'yyyy-MM-dd');
}
function dateTimeFormatterCn(value, row, index){
    return formatDatetimeCommon(value,'yyyy年MM月dd日 hh时mm分ss秒');
}
function dateTimeFormatter(value, row, index){
    return formatDatetimeCommon(value,'yyyy-MM-dd hh:mm:ss');
}
function currencyFormatterRMB(value, row, index){
}
function percentFormatter(value, row, index){
}
function getColumsConfig(field) {
    var col = null;
    if(!originColumns){
        originColumns = bootstrapTableRender.parseElementColumn();
        if(!originColumns)
            return;
    }
    for(var i=0; i<originColumns.length; i++){
        if(originColumns[i].field == field){
            col = originColumns[i];
            break;
        }
    }
    return col;
}
function isIntNum(val){
    var regPos = /^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}
