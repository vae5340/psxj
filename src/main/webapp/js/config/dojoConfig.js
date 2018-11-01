dojoConfig = {
	has: {
	    "dojo-firebug": false,//加载Dojo版的Firebug调试环境，如果浏览器没有自带调试工具，可以用这个
	    "dojo-debug-messages": false//显示调试信息，针对于一些废弃的或测试中的功能特性在运行时的信息
	},
    async: true,
    parseOnLoad:true,
    packages: [
             {
                 name: "custom",
                 location: "../../custom"
             },
             {
               name: "analyse-tools",
               location: "../../analyse-tools"
             }
        ]
};

//找到arcgis_js_api/init.js的路径
function getScriptLocation() {
    var scripts = document.getElementsByTagName("script");
    var match;
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        var match = src.match(/(file|http):\/+(.*\/arcgis_js_api\/)init.js$/);
        if (match) {
            break;
        }
    }
    if (match) {
        return match[2];
    } else {
        alert("找不到arcgis_js_api/init.js的位置");
    }
}
 