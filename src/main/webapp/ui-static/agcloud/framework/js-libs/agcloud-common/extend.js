/**
 * Created by BranGao on 2016-12-26.
 * jquery的深复制
 * 用于继承与改写开源js的利器！
 */

/*
 * @param {Object} target 目标对象。
 * @param {Object} source 源对象。
 * @param {boolean} deep 是否复制(继承)对象中的对象。
 * @returns {Object} 返回继承了source对象属性的新对象。
 */
Object.extend = function(target, /*optional*/source, /*optional*/deep) {
    target = target || {};
    var sType = typeof source, i = 1, options;
    if( sType === 'undefined' || sType === 'boolean' ) {
        deep = sType === 'boolean' ? source : false;
        source = target;
        target = this;
    }
    if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' )
        source = {};
    while(i <= 2) {
        options = i === 1 ? target : source;
        if( options != null ) {
            for( var name in options ) {
                var src = target[name], copy = options[name];
                if(target === copy)
                    continue;
                if(deep && copy && typeof copy === 'object' && !copy.nodeType)
                    target[name] = this.extend(src ||
                        (copy.length != null ? [] : {}), copy, deep);
                else if(copy !== undefined)
                    target[name] = copy;
            }
        }
        i++;
    }
    return target;
};

