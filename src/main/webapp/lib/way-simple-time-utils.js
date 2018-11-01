define([], function(){
    var exports,
        zeros = '00000000000000000000000',
        formatTimeStrFromMill,
        areTheSameDay,
        leftPadZero;

    leftPadZero = function(value, length){
        if(value === null || isNaN(value)){
            return null;
        }else if((''+value).length >= length){
            return ''+value;
        }
        var str = ''+value;
        str = zeros.substr(0, (length - str.length))+value;
        return str;
    };

    areTheSameDay = function(date1, date2){
        if(date1 && date2){
            if(date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate()){
                return true;
            }
        }
        return false;
    };

    formatTimeStrFromMill = function(mill, template){
        if(mill === null || isNaN(mill) || !template){
            return null;
        }
        var date = new Date(), model;
        date.setTime(mill);
        model = {
            'yyyy': date.getFullYear(),
            'MM': date.getMonth() + 1,
            'dd': date.getDate(),
            'hh': date.getHours(),
            'mm': date.getMinutes(),
            'ss': date.getSeconds(),
            'mil': date.getMilliseconds()
        };

        for(var prop in model){
            if(model.hasOwnProperty(prop)){
                template = template.replace(prop, leftPadZero(model[prop], prop.length));
            }
        }
        return template;
    };

    exports = {
        'formatTimeStrFromMill': formatTimeStrFromMill,
        'areTheSameDay': areTheSameDay
    };

    return exports;
});
