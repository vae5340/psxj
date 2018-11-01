//初始化页面配置
var stationTypes={};
stationTypes["UP"]={layerId:'station_UP',layerName:'窨井',iconUrl:''};
stationTypes["UP-2"]={layerId:'station_UP-2',layerName:'水位',iconUrl:'',view:'drainagenetwork/mobileDrainageWinZ'};
stationTypes["UP-1"]={layerId:'station_UP-1',layerName:'流量',iconUrl:'',view:'drainagenetwork/mobileDrainageWinQ'};
stationTypes["UP-7"]={layerId:'station_UP-7',layerName:'流速',iconUrl:'',view:'drainagenetwork/mobileDrainageWinV'};
stationTypes["UP-5"]={layerId:'station_UP-5',layerName:'视频',iconUrl:''};

stationTypes["WL"]={layerId:'station_WL',layerName:'易涝点',iconUrl:''};
stationTypes["WL-2"]={layerId:'station_WL-2',layerName:'水位',iconUrl:'',view:'floodPoint/mobileFloodPointWinZ'};
stationTypes["WL-3"]={layerId:'station_WL-3',layerName:'雨量',iconUrl:'',view:'rainFallStation/mobileRainWin'};
stationTypes["WL-5"]={layerId:'station_WL-5',layerName:'视频',iconUrl:'',view:'jiugongge/mobileHikvisionVideo'};

stationTypes["DP"]={layerId:'station_DP',layerName:'排水泵站',iconUrl:''};
stationTypes["DP-2"]={layerId:'station_DP-2',layerName:'水位',iconUrl:'',view:'pumpstation/mobilePumpWinZ'};
stationTypes["DP-1"]={layerId:'station_DP-1',layerName:'流量',iconUrl:'',view:'pumpstation/mobilePumpWinQ'};
stationTypes["DP-5"]={layerId:'station_DP-5',layerName:'视频',iconUrl:''};

stationTypes["DD"]={layerId:'station_DD',layerName:'排水水闸',iconUrl:''};
stationTypes["DD-2"]={layerId:'station_DD-2',layerName:'水位',iconUrl:'',view:'wasstation/mobileWasDetailZ'};
stationTypes["DD-3"]={layerId:'station_DD-3',layerName:'雨量',iconUrl:''};
stationTypes["DD-1"]={layerId:'station_DD-1',layerName:'流量',iconUrl:'',view:'wasstation/mobileWasDetailQ'};
stationTypes["DD-5"]={layerId:'station_DD-5',layerName:'视频',iconUrl:''};

stationTypes["RR"]={layerId:'station_RR',layerName:'水库',iconUrl:''};
stationTypes["RR-1"]={layerId:'station_RR-1',layerName:'流量',iconUrl:''};
stationTypes["RR-2"]={layerId:'station_RR-2',layerName:'水位',iconUrl:'',view:'reservoir/mobileReservoirWinZ'};
stationTypes["RR-3"]={layerId:'station_RR-3',layerName:'雨量',iconUrl:'',view:'rainFallStation/mobileRainWin'};

stationTypes["ZZ"]={layerId:'station_ZZ',layerName:'河道',iconUrl:''};
stationTypes["ZZ-1"]={layerId:'station_ZZ-1',layerName:'流量',iconUrl:''};
stationTypes["ZZ-2"]={layerId:'station_ZZ-2',layerName:'水位',iconUrl:'',view:'river/mobileRiverWinZ'};
stationTypes["ZZ-3"]={layerId:'station_ZZ-3',layerName:'雨量',iconUrl:'',view:'rainFallStation/mobileRainWin'};

stationTypes["FQ"]={layerId:'station_FQ',layerName:'污水处理厂',iconUrl:''};
stationTypes["FQ-4"]={layerId:'station_FQ-4',layerName:'水质', iconUrl:'',view:'wastewaterplant/mobileWastewaterplantWin'};
stationTypes["PP"]={layerId:'station_PP',layerName:'雨量站',iconUrl:''};
stationTypes["PP-3"]={layerId:'station_PP-3',layerName:'雨量',iconUrl:'',view:'rainFallStation/mobileRainWin'};

stationTypes["SC"]={layerId:'station_SC',layerName:'排水监测',iconUrl:''};
stationTypes["SC-1"]={layerId:'station_SC',layerName:'雨水花园',iconUrl:'',view:'spongeCity/mobileSpongeCityWin'};
stationTypes["SC-2"]={layerId:'station_SC-2',layerName:'CSO调蓄池',iconUrl:'',view:'spongeCity/mobileCsoPoolWin'};

$(function () {

    var x = request("x");
    var y = request("y");
    var radius = request("radius");
    var layerIds = request("layerIds");

    //获得点击部分的所有测站信息
    $.ajax({
        url: "/psxj/station/getStationByMap",
        data:{x:x, y:y, radius:radius, sttp:layerIds},
        dataType: 'json',
        cache:false,
        async:false,
        success: function (result){
            var data = result.content;

            if(data){
                openDetail(data[0]);
            }
        },
        error : function() {
            // layer.msg("获取设施设备失败");
            console.log("获取设施设备失败");
        }
    });
});

function openDetail(data){

    var view =  stationTypes[data.layertype].view;
    var staionType = stationTypes[data.sttp].layerName + stationTypes[data.layertype].layerName + " —— " + data.stnm;
    var stsys = data.stsys;
    var czlx = stationTypes[data.sttp].layerName;
    var stnm = data.stnm;

    if(view){
        // 跳转到相应页面并把参数传递过去
        window.open(view+".html" + "?stcd=" + data.stcd + "&sttp=" +data.sttp+ "&mnit=" + data.mnit + "&staionType=" + encodeURI(staionType)
            + "&stsys=" + encodeURI(stsys) + "&czlx=" + encodeURI(czlx) + "&stnm=" + encodeURI(stnm),'_self');
    }else {
        console.error("未配置详细页面station-config stationTypes中配置view属性页面");
    }
}

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