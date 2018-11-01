/**
 * 设施监测全局变量
 */
//1-雨水口；2-检查井；3-排水管；4-排水渠；5-排放口；6-排水泵站；7-截流设施；8-调储设施；9-溢流堰;10-闸门；11-易涝区域；12-基站；13-积水点；14-井盖；15-湿度；16-树木；17-视频点；
//18-内河站点；19-雨量站；20-水文站；21-井下水位；22-仓库
//设施类型
var ssTypes=new Array();
ssTypes[1]={layerId:'ssjk_1',layerName:'雨水口',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[2]={layerId:'ssjk_2',layerName:'检查井',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[3]={layerId:'ssjk_3',layerName:'排水管',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[4]={layerId:'ssjk_4',layerName:'排水渠',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[5]={layerId:'ssjk_5',layerName:'排放口',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[6]={layerId:'ssjk_6',layerName:'排水泵站',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_bengz.png'};
ssTypes[7]={layerId:'ssjk_7',layerName:'截流设施',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[8]={layerId:'ssjk_8',layerName:'调储设施',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[9]={layerId:'ssjk_9',layerName:'溢流堰',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[10]={layerId:'ssjk_10',layerName:'闸门',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[11]={layerId:'ssjk_11',layerName:'易涝区域',iconUrl:'/awater/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'}; 
ssTypes[12]={layerId:'ssjk_12',layerName:'基站',iconUrl:'/awater/waterSystem/ssjk/img/access_point_24px_1121181_easyicon.net_red.png'};
ssTypes[13]={layerId:'ssjk_13',layerName:'易涝隐患点',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_jsd.png'};
ssTypes[14]={layerId:'ssjk_14',layerName:'井盖',iconUrl:'/awater/waterSystem/ssjk/img/point_24px_1121329_easyicon_red.png'};
ssTypes[15]={layerId:'ssjk_15',layerName:'湿度',iconUrl:'/awater/waterSystem/ssjk/img/sphere_24px_1121353_easyicon.net.png'};
ssTypes[16]={layerId:'ssjk_16',layerName:'树木',iconUrl:'/awater/waterSystem/ssjk/img/pyramid_24px_1121333_easyicon.net_green.png'};
ssTypes[17]={layerId:'ssjk_17',layerName:'视频点',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_shex.png'};
ssTypes[18]={layerId:'ssjk_18',layerName:'内河站点',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_nhzd.png'};
ssTypes[19]={layerId:'ssjk_19',layerName:'雨量站',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_yulz.png'};
ssTypes[20]={layerId:'ssjk_20',layerName:'水文站',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_swz.png'};
ssTypes[21]={layerId:'ssjk_21',layerName:'窨井',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_jxsw.png'};
ssTypes[22]={layerId:'ssjk_22',layerName:'仓库',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_cangk.png'};
ssTypes[23]={layerId:'ssjk_23',layerName:'安置点',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_azd.png'};
ssTypes[24]={layerId:'ssjk_24',layerName:'撤离点',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_cld.png'};
ssTypes[25]={layerId:'ssjk_25',layerName:'地面视频',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_lmsp.png'};
ssTypes[26]={layerId:'ssjk_26',layerName:'交警视频',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_jjsp.png'};
ssTypes[27]={layerId:'ssjk_27',layerName:'排水泵站视频',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_bzsp.png'};
ssTypes[28]={layerId:'ssjk_28',layerName:'内河泵站视频',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_nhbzsp.png'};
ssTypes[29]={layerId:'ssjk_29',layerName:'内河站降雨量',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_yulz.png'};
ssTypes[30]={layerId:'ssjk_30',layerName:'水文雨量站',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_yulz.png'};
ssTypes[31]={layerId:'ssjk_31',layerName:'自建雨量站',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_yulz.png'};
ssTypes[33]={layerId:'ssjk_33',layerName:'路面(管渠)水位',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_jxsw.png'};
ssTypes[34]={layerId:'ssjk_34',layerName:'河道水位',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_nhzd.png'};
ssTypes[35]={layerId:'ssjk_35',layerName:'管渠流量',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_gdll.png'};
ssTypes[36]={layerId:'ssjk_36',layerName:'河道流量',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_hdll.png'};
ssTypes[37]={layerId:'ssjk_37',layerName:'泵站水位',iconUrl:'/awater/waterSystem/ssjk/img/legend_15x15/png/point_15px_bengz.png'};
	
//ZZ_WL
//CSK_WL
//JSD_WL
//JX_WL
//DP_WL
//YL_WL
/**
 * 监测项类型配置
 * name：监测名称
 * userPage：使用的页面 1 使用page和hisPage页面/2 使用 videoUrl配置
 * page:实时页面，路径相对于ssjk-dim-main.html
 * hisPage:历史页面
 */
var dimTypes=new Array();
dimTypes['ZZ_WL']={name:'闸站水位',userPage:1,page:'ssjk-dim-jsd-bootstrap.html',hisPage:'ssjk-dim-jsd-his.html'};
dimTypes['CSK_WL']={name:'出水口水位',userPage:1,page:'ssjk-dim-jsd-bootstrap.html',hisPage:'ssjk-dim-jsd-his.html'};
dimTypes['JSD_WL']={name:'积水点水位',userPage:1,page:'ssjk-dim-jsd-bootstrap.html',hisPage:'ssjk-dim-jsd-his.html'};
dimTypes['JX_WL']={name:'井下水位',userPage:1,page:'ssjk-dim-jxss-bootstrap.html',hisPage:'ssjk-dim-jxss-his.html'};
dimTypes['ZQ_WL']={name:'河道水位',userPage:1,page:'ssjk-dim-sw-bootstrap.html',hisPage:'ssjk-dim-sw-his.html'};
dimTypes['DP_WL']={name:'泵站水位',userPage:1,page:'ssjk-dim-bz-bootstrap.html',hisPage:'ssjk-dim-bz-his.html'};
dimTypes['YL_WL']={name:'降水量',userPage:1,page:'ssjk-dim-jsl-bootstrap.html',hisPage:'ssjk-dim-jsl-his.html'};
dimTypes['Q']={name:'流量',userPage:1,page:'ssjk-dim-ll-bootstrap.html',hisPage:'ssjk-dim-ll-his.html'};
dimTypes['TPT']={name:'温度',userPage:1,page:'ssjk-dim-tpt-bootstrap.html',hisPage:'ssjk-dim-tpt-his.html'};
dimTypes['VD']={name:'视频',userPage:2,page:'',hisPage:''};
dimTypes['CK']={name:'仓库详细信息',userPage:3,page:'',hisPage:''};
dimTypes['CLD']={name:'撤离点详细信息',userPage:3,page:'',hisPage:''};
dimTypes['AZD']={name:'安置点详细信息',userPage:3,page:'',hisPage:''};
//dimTypes['GP']={name:'闸位',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['WL']={name:'水位',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['RF']={name:'雨量',page:'waterSystem/ssjk/ssjk-dim-jsd.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['WS']={name:'风速',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['WD']={name:'风向',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['SE']={name:'测站设备',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['AT']={name:'气温',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['FL']={name:'流量',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};
//dimTypes['WQ']={name:'水质',page:'waterSystem/ssjk/ssjk-dim-jxss.html',hisPage:'waterSystem/ssjk/ssjk-dim-jxss-his.html'};

$(function(){
	//  解析从设备异常信息列表传过来的名称
	var name = decodeURI(request("combName"));
	var num =  decodeURI(request("num"));
	if(name!=null && num==2000){
		$("#txt_search_comb_name").val(name);
	}
	
	
});

/**
 * js获取url参数值
 * var De = decodeURI(request("Due"));//De=‘未设置’  
 */
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = { };
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}    

/**
 * 修补出现超长精度的数值
 */
function repairNum(num){
	var size=1000000000000000000000000000;
	return size*num/size;
}

/**
 * 数据反向排序
 * @param data
 * @returns
 */
function dataDesc(data){
	var i=data.rows.length-1;
	var newData={};
	if(i<0){
		return null;
	}
	var newRows=[];
	for(i;i>=0;i--){
		var row=data.rows[i];
		newRows.push(row);
	}
	newData.rows=newRows;	
	return newData;
}

/**
 * 累计数值
 * @param data
 */
function addUpValue(dValueArr){
	var newDValueArr=[];
	var i=0;
	for(i;i<dValueArr.length;i++){
		var j=0;
		var total=0;
		for(j;j<=i;j++){
			total+=dValueArr[j];
		}		
		newDValueArr.push(total);	
	}
	return newDValueArr;
}

if(typeof(Highcharts)!='undefined'){
	Highcharts.setOptions({
		global: {
			useUTC: false//取消协调世界时
		}
	});
}
//强制保留两位小数
function toDecimal2(x) { 
      var f = parseFloat(x); 
      if (isNaN(f)) { 
        return false; 
      } 
      var f = Math.round(x*100)/100; 
      var s = f.toString(); 
      var rs = s.indexOf('.'); 
      if (rs < 0) { 
        rs = s.length; 
        s += '.'; 
      } 
      while (s.length <= rs + 2) { 
        s += '0'; 
      } 
      return s; 
}

var dimIcon=[{
   	"value": "13,0",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/point_15px_jsd.png",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "13,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/point_15px_jsd_y.png",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "22,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[22].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "23,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[23].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "24,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[24].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "25,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[25].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "26,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[26].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "27,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[27].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "28,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[28].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "29,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[29].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "30,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[30].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "31,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[31].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "33,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[33].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "34,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[34].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "35,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[35].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "36,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[36].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
   	"value": "37,0",
   	"symbol": {
		"type": "esriPMS",
		"url": ssTypes[37].iconUrl,
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
 	"value": "22,1",
   	"symbol": {
    	"type": "esriPMS",
        "url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
        "contentType": "image/png",
        "width": 12,
        "height": 12
	}
},{
   	"value": "23,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "24,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "25,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "26,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "27,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "28,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "29,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "30,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "31,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "33,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_jxsw_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "34,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "35,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "36,1",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
   	"value": "37,1",
   	"symbol": {
		"type": "esriPMS",
		"url":  "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_bengz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
 	"value": "22,2",
   	"symbol": {
    	"type": "esriPMS",
        "url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
        "contentType": "image/png",
        "width": 12,
        "height": 12
	}
},{
   	"value": "23,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "24,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "25,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "26,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "27,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "28,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "29,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "30,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "31,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "33,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_jxsw_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "34,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "35,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "36,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
   	"value": "37,2",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_bengz_y.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
 	"value": "22,3",
   	"symbol": {
    	"type": "esriPMS",
        "url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
        "contentType": "image/png",
        "width": 12,
        "height": 12
	}
},{
   	"value": "23,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "24,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "25,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "26,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "27,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "28,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "29,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "30,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "31,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "33,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_jxsw_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "34,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "35,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "36,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
   	"value": "37,3",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_bengz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
 	"value": "22,4",
   	"symbol": {
    	"type": "esriPMS",
	    "url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
	    "contentType": "image/png",
	    "width": 12,
	    "height": 12
	}
},{
   	"value": "23,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "24,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_cangk_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "25,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "26,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "27,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "28,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_shex_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "29,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "30,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "31,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_yulz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "33,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_jxsw_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "34,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "35,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
 	}
},{
   	"value": "36,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_nhzd_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
},{
   	"value": "37,4",
   	"symbol": {
		"type": "esriPMS",
		"url": "/awater/waterSystem/ssjk/img/legend_15x15/gif/point_15px_bengz_r.gif",
		"contentType": "image/png",
		"width": 12,
		"height": 12
	}
}]
