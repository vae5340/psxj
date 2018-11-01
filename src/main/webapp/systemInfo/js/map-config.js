var awater = (function(){
	var code= {//数据字典
			data:null,
			pcode:[], //所有的大类集合
			childCode:[] // 所有的子类集合
		};
	return {
		url : {
			//电子地图
			url_vec : ["http://139.159.243.230:6080/arcgis/rest/services/vec/vec1/MapServer","vec"],
			//底图
			url_ditu: ["http://139.159.243.230:6080/arcgis/rest/services/ditu/img/MapServer","img"],
			//管线
			url_h : "http://139.159.243.230:6080/arcgis/rest/services/GZPS/GZSWPSGXOwnDept/MapServer",
			//新增和修正的服务()
			url_nc :"http://139.159.243.185:6080/arcgis/rest/services/GZPS/GZSWGXFS/MapServer",
			//上报(审核)图层服务
			//url_report : ["http://139.159.243.185:6080/arcgis/rest/services/report/MapServer",'map_rep'],
			url_report : ["http://139.159.243.185:6080/arcgis/rest/services/report/MapServer",'map_rep'],
			//权属范围编辑服务
			url_qsfw_bj:"http://139.159.243.185:6080/arcgis/rest/services/GZPS/qsfw/FeatureServer/0",
			//权属范围地图服务
			url_qsfw_dt:"http://139.159.243.185:6080/arcgis/rest/services/GZPS/qsfw/MapServer/0",
			//数据融合图层
			url_sjrh:"http://139.159.243.230:6080/arcgis/rest/services/GZPS/20180306ronghe/MapServer/0",
			//示意连线图层
			url_sylx:"http://139.159.243.230:6080/arcgis/rest/services/reportLine/MapServer",
			//门牌图层
			url_mp:"http://139.159.243.185:6080/arcgis/rest/services/PAISHUIHU/menpaihao_ms/MapServer",
			//应开未开井
			url_ykwkj:"http://139.159.243.230:6080/arcgis/rest/services/GZPS/PSGX_YKWKJ/MapServer",
			//排水户上报
			url_pshsb:"http://139.159.243.230:6080/arcgis/rest/services/PAISHUIHU/menpai_swgk_ms/MapServer",
            //巡检达标图层
            url_xjdb:"http://139.159.243.185:6080/arcgis/rest/services/GZPS/dbzt/MapServer",
			//接驳井
			url_jbj:"http://139.159.243.185:6080/arcgis/rest/services/PAISHUIHU/jiebojing_MS/MapServer",
			//接驳井连线
			url_jbjlx:"http://139.159.243.230:6080/arcgis/rest/services/PAISHUIHU/GZPSGX_MS/MapServer",
			//交办反馈
			url_feedback:"http://139.159.243.185:6080/arcgis/rest/services/GZPS/ssjb_ms/MapServer"
			/*//排水单元图层
			url_psdy:"http://139.159.243.185:6080/arcgis/rest/services/PAISHUIHU/paishuidanyuan_ms/MapServer"*/
			/**
			//管线
			url_h : "http://139.159.243.230:6080/arcgis/rest/services/GZPS/GZSWPSGXOwnDept/MapServer",
			//新增和修正的服务()
			url_nc :"http://139.159.243.230:6080/arcgis/rest/services/GZPS/GZSWGXFS/MapServer",
			 * */
		},
		code: code
	}
	
})();
//var gwurl_1="http://139.159.247.149:6080/arcgis/rest/services/SW1028/SWFW28/MapServer";  之前的管网
//var gwurl_1="http://139.159.243.185:6080/arcgis/rest/services/GZPS/GZSWGD5000/MapServer";  //历史

function peoblem_shujzd() {
	// var url= "/psxj/rest/report/queryProblemTree";
	var url= "/psxj/rest/report/queryProblemTree";
	$.ajax({
		url: url,
		method: 'get',
		dataType: 'json',
		async: true,
		success: function(result){
			if(result.success && result.data){
				initCode(result.data);
				return awater.code.data=result.data;
			}else{
				return;
			}
		},error: function(){console.log("问题类型数据字典加载失败..."); return;}
	});
}
peoblem_shujzd();
function initCode(data){
	var childArr = {};
	for(i in data){
		var pcodeJson={};
		var pcode = data[i].code;
		var name = data[i].name;
		if(pcode){
			pcodeJson.code=pcode;
			pcodeJson.name=name;
			awater.code.pcode.push(pcodeJson);
		}
		var childData=data[i].data;
		for(k in childData){
			var childCodeJosn={};
			var childCode =  childData[k].code;
			var childPCode =  childData[k].pcode;
			var childName =  childData[k].name;
			if(childCode){
				childCodeJosn.code=childCode;
				childCodeJosn.name=childName;
				childCodeJosn.pcode=childPCode;
				awater.code.childCode.push(childCodeJosn);
			}
		}
	}
}