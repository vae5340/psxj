/**
 * 原生 ajax请求
 */
$(function () {
    //自定义 sendAsBinary方法，完成流的发送
    if (!XMLHttpRequest.prototype.sendAsBinary) {
        XMLHttpRequest.prototype.sendAsBinary = function (sData) {
            var nBytes = sData.byteLength;
            // var ui8Data = new Uint8Array(nBytes);
            // for (var nIdx = 0; nIdx < nBytes; nIdx++) {
            //     ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
            // }
            this.send(sData);
        };
    }

    //获取 xmlHttpRequest对象
    function getXmlHttpObj() {
        var xmlhttp;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    }

    //执行请求
    function doSend(url,type,params,monitor,callback) {
        var xmlHttpObj = getXmlHttpObj();
        //默认使用 post请求方式
        var type1 = type? type : "post";
        //打开链接
        xmlHttpObj.open(type1,url);
        var formData = new FormData();
        if(params){
            for(var i in params){
                formData.append(i, params[i]);
            }
        }
        if(monitor){
            xmlHttpObj.upload.onprogress = monitor;
            xmlHttpObj.upload.progressName = params.attSize + params.lastModified;
        }
        xmlHttpObj.send(formData);
        xmlHttpObj.onreadystatechange = function () {
            if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
                //执行回调函数
                if(callback){
                    callback(xmlHttpObj.responseText);
                }
            }
            else {
                console.log(xmlHttpObj.statusText);
            }
        }
    }
    //执行请求 发送流的方式 后台只能获取到 8M的数据，有限制
    function doSend_1(url,type,params,stream,callback) {
        var xmlHttpObj = getXmlHttpObj();
        // xmlHttpObj.timeout = 1000000;//由于是上传文件，这里尽量设置大一点，不设置默认不超时
        // xmlHttpObj.ontimeout = function (event) {
        //     alert("请求超时！");
        // }
        //默认使用 post请求方式
        var type1 = type? type : "post";
        //存在参数 则 带上
        //流 参数 例如 文件流
        if(stream){
            if(params){
                url += "?"
                var index = 0;
                for(var i in params){
                    url += i + "=" + params[i] + "&";
                }
                url = url.substring(0,url.length - 1);
            }
            //打开链接
            xmlHttpObj.open(type1, url);
            xmlHttpObj.overrideMimeType("application/octet-stream");
            xmlHttpObj.sendAsBinary(stream);//居然只能上传 8M以内的文件
        }else{
            //打开链接
            xmlHttpObj.open(type1,url);
            if(params){
                var formData = new FormData();
                for(var i in params){
                    formData.append(i, params[i]);
                }
            }
            //设置请求参数
            xmlHttpObj.send(formData);
        }
        xmlHttpObj.onreadystatechange = function () {
            if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
                console.log(xmlHttpObj.responseText);
                //执行回调函数
                if(callback){
                    callback(xmlHttpObj.responseText);
                }
            }
            else {
                console.log(xmlHttpObj.statusText);
            }
        }
    }
    window.myHttpRequest = {
        doSend: doSend
    };
})
