//此文件保存整个系统、非业务 的通用函数

//**************************************
//object操作
//**************************************

Object.extend = function (dest, source, replace) {
    for (prop in source) {
        if (replace == false && dest[prop] != null)
            continue;
        dest[prop] = source[prop];
    }
    return dest;
};
/*复制对象*/
Object.clone = function (obj) {
    return Object.extend({}, obj);
};
Object.extend(Function.prototype, {
    bind: function (o) {
        if (!window.__objs) {
            window.__objs = [];
            window.__funcs = [];
        }
        var objId = o.__oid;
        if (!objId)
            __objs[objId = o.__oid = __objs.length] = o;
        var me = this;
        var funcId = me.__fid;
        if (!funcId)
            __funcs[funcId = me.__fid = __funcs.length] = me;
        if (!o.__closures)
            o.__closures = [];
        var closure = o.__closures[funcId];
        if (closure)
            return closure;
        o = null;
        me = null;
        return __objs[objId].__closures[funcId] = function () {
            return __funcs[funcId].apply(__objs[objId], arguments);
        };
    },
    bindAsEventListener: function (o) {
        if (!window.__objs) {
            window.__objs = [];
            window.__funcs = [];
        }
        var objId = o.__oid;
        if (!objId)
            __objs[objId = o.__oid = __objs.length] = o;
        var me = this;
        var funcId = me.__fid;
        if (!funcId)
            __funcs[funcId = me.__fid = __funcs.length] = me;
        if (!o.__closures)
            o.__closures = [];
        var closure = o.__closures[funcId];
        if (closure)
            return closure;
        o = null;
        me = null;
        return __objs[objId].__closures[funcId] = function (event) {
            return __funcs[funcId].apply(__objs[objId],
                [event || window.event]);
        };
    }
});

// **************************************
// 字符串操作
// **************************************
String.prototype.padLeft = function (padChar, width) {
    var ret = this;
    while (ret.length < width) {
        if (ret.length + padChar.length < width) {
            ret = padChar + ret;
        } else {
            ret = padChar.substring(0, width - ret.length) + ret;
        }
    }
    return ret;
};
String.prototype.padRight = function (padChar, width) {
    var ret = this;
    while (ret.length < width) {
        if (ret.length + padChar.length < width) {
            ret += padChar;
        } else {
            ret += padChar.substring(0, width - ret.length);
        }
    }
    return ret;
};
String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};
String.prototype.trimLeft = function () {
    return this.replace(/^\s+/, '');
};
String.prototype.trimRight = function () {
    return this.replace(/\s+$/, '');
};
String.prototype.caption = function () {
    if (this) {
        return this.charAt(0).toUpperCase() + this.substr(1);
    }
    return this;
};
String.prototype.reverse = function () {
    var ret = '';
    for (var i = this.length - 1; i >= 0; i--) {
        ret += this.charAt(i);
    }
    return ret;
};
String.prototype.startWith = function (compareValue, ignoreCase) {
    if (ignoreCase) {
        return this.toLowerCase().indexOf(compareValue.toLowerCase()) == 0;
    }
    return this.indexOf(compareValue) == 0
};
String.prototype.endWith = function (compareValue, ignoreCase) {
    if (ignoreCase) {
        return this.toLowerCase().lastIndexOf(compareValue.toLowerCase()) == this.length
            - compareValue.length;
    }
    return this.lastIndexOf(compareValue) == this.length - compareValue.length;
};
// 返回查询字符串在字符串中首次出现的位置（忽略大小写）
String.prototype.indexOfIgnoreCase = function (compareValue, searchIndex) {
    if (compareValue) {
        return this.toLowerCase().indexOf(compareValue.toLowerCase(),
            searchIndex);
    }

    return -1;
};

// 返回查询字符串在字符串中首次出现的位置（忽略大小写）
String.prototype.compareIgnoreCase = function (compareValue) {
    return this.toLowerCase() == compareValue.toLowerCase();
};

// 获取iframe的对象
function getIFrame(iframeName) {
    if (document.all) {// IE
        return document.frames[iframeName];
    } else {// Firefox or Chrome
        return document.getElementById(iframeName).contentWindow;
    }
}

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果

function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
}

// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果

function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
        / Math.pow(10, m)
}
// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果

function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
}

// 在你要用的地方包含这些函数，然后调用它来计算就可以了。
// 比如你要计算：7*0.8 ，则改成 (7).mul(8)
// 其它运算类似，就可以得到比较精确的结果。

// 减法函数
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    // last modify by deeka
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return accSub(this, arg);
}


//从指定的form里获取值
function getFormValue(formId) {
    var formValues = {};

    //获取input的值
    $("input", $("#" + formId)).each(function (i, element) {
        var jq = $(element);
        var elmentName = jq.attr("name");
        if (elmentName) {
            formValues[elmentName] = jq.val();
        }
    });

    //获取textarea的值
    $("textarea", $("#" + formId)).each(function (i, element) {
        var jq = $(element);
        var elmentName = jq.attr("name");
        if (elmentName) {
            formValues[elmentName] = jq.val();
        }
    });

    return formValues;
}

// 输出指定范围内的随机数的随机整数，under=下限，over=上限
function fRandomBy(under, over) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * under + 1);
        case 2:
            return parseInt(Math.random() * (over - under + 1) + under);
        default:
            return 0;
    }
}