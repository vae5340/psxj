

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
    } else {
        dt = new Date(value);
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


//转换选择器-回调函数实现
function dicCodeTypeFormat(row, index, datatable,myi,col){
    if("1"==col['queryMulitSelect']){
        return formatMultiDicItemCodeToValue(row[myi],col['dicCodeItemMap']);
    }else{
        return formatDicItemCodeToValue(row[myi],col['dicCodeItemMap']);
    }
}
function dateFormatterCn(row, index, datatable,myi,col){
    return formatDatetimeCommon(row[myi],'yyyy年MM月dd日');
}
function dateFormatter(row, index, datatable,myi,col){
    return formatDatetimeCommon(row[myi],'yyyy-MM-dd');
}

function dateTimeFormatterCn(row, index, datatable,myi,col){
    return formatDatetimeCommon(row[myi],'yyyy年MM月dd日 hh时mm分ss秒');
}
function dateTimeFormatter(row, index, datatable,myi,col){
    return formatDatetimeCommon(row[myi],'yyyy-MM-dd hh:mm:ss');
}
function currencyFormatterRMB(row, index, datatable,myi,col){

}
function percentFormatter(row, index, datatable,myi,col){

}


