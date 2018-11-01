var myChar1,myChar2,myChar0,option,openFlag,areaName='',townName='';
$(function(){
	//初始化第一层图表
	loadZeroEcharts();	
});
//第零层加载区统计的图表
function loadZeroEcharts(){
	/*openFlag=flag;
	setStyle(flag);*/
	if(optionsKj0){
		optionsKj0.title.text="广州市排水户摸查情况统计表";
		option = optionsKj0;
		myChar0 = echarts.init(document.getElementById('oneChartContainer0'));
		myChar0.setOption(optionsKj0);
		myChar0.on('click',loadEcharts);
		//加载统计图表数据
		loadDataEachaKj0();
		window.onresize = myChar0.resize; //自适应窗口大小
		
	}
}
//第一层加载区统计的图表,通过点击第零层图表触发
function loadEcharts(param){
	changeTab('qu');
	areaName = param.name;//区
	if(optionsKj1){
		optionsKj1.title.text=areaName+"排水户摸查情况统计表";
		option = optionsKj1;
		myChar1 = echarts.init(document.getElementById('oneChartContainer'));
		myChar1.setOption(optionsKj1);
		myChar1.on('click',loadSecondEcharts);
		//加载统计图表数据
		loadDataEachaKj1(areaName);
		window.onresize = myChar1.resize; //自适应窗口大小
		
	}
}
//第二层镇街统计报表,通过点击第一层图表触发
function loadSecondEcharts(param){
	changeTab('zj');
	var name = param.name;//镇街
	townName=name;
	if(optionsKj2){
		optionsKj2.title.text=areaName+name+"排水户摸查情况统计表";
		myChar2 = echarts.init(document.getElementById('oneChartContainer1'));
		myChar2.setOption(optionsKj2);
		//加载统计图表数据
		loadDataEachaKj2(areaName,name);
		window.onresize = myChar2.resize; //自适应窗口大小
	}
}
//切换tab页
function changeTab(clickType){
	if(clickType=='qu'){//点击区
		//隐藏区
		$("#qu_Tab").attr("class", "tab-pane");
		$("#qu_li").removeClass("active");
		//显示镇街
		$("#zj_Tab").attr("class", "tab-pane fade in active");
		$("#zj_li").attr("class", "active");
	}else if(clickType=='zj'){//点击镇街
		//隐藏镇街
		$("#zj_Tab").attr("class", "tab-pane");
		$("#zj_li").removeClass("active");
		//显示社区
		$("#sq_Tab").attr("class", "tab-pane fade in active");
		$("#sq_li").attr("class", "active");
	}
}
//空间统计第零层
function loadDataEachaKj0(){
	var temp = {};
	var data = loadEachr.loadData("/agsupport_swj/statistics!getKjTjByAll.action",temp? temp:null);
	var option_x= [];
	var option_data1= [];
	var option_data2= [];
	var option_data3= [];
	var option_data4= [];
	var option_data5= [];
	var option_data6= [];
	if(data){
		for(var i in data){
			var item = data[i];
			option_x[i]=item.name;
			option_data1[i]=item.mp;
			option_data2[i]=item.count;
			option_data3[i]=item.shpw;
			option_data4[i]=item.cypw;
			option_data5[i]=item.cdpw;
			option_data6[i]=item.ydyhpw;
		}
		optionsKj0.xAxis[0].data=option_x;//给X轴赋值
		optionsKj0.series[0].data=option_data1;//给Y轴第1柱子赋值
		optionsKj0.series[1].data=option_data2;//给Y轴第2柱子赋值
		optionsKj0.series[2].data=option_data3;//给Y轴第3柱子赋值
		optionsKj0.series[3].data=option_data4;//给Y轴第4柱子赋值
		optionsKj0.series[4].data=option_data5;//给Y轴第5柱子赋值
		optionsKj0.series[5].data=option_data6;//给Y轴第6柱子赋值
		myChar0.setOption(optionsKj0);
		var text=appendTab(data,'qu','tab0');
		$('#tab0').html(text);
	}
}
//空间统计第一层
function loadDataEachaKj1(area){
	var temp = {
			area: area
		};
	var data = loadEachr.loadData("/agsupport_swj/statistics!getKjTjByUnit.action",temp? temp:null);
	var option_x= [];
	var option_data1= [];
	var option_data2= [];
	var option_data3= [];
	var option_data4= [];
	var option_data5= [];
	var option_data6= [];
	if(data){
		for(var i in data){
			var item = data[i];
			option_x[i]=item.name;
			option_data1[i]=item.mp;
			option_data2[i]=item.count;
			option_data3[i]=item.shpw;
			option_data4[i]=item.cypw;
			option_data5[i]=item.cdpw;
			option_data6[i]=item.ydyhpw;
		}
		optionsKj1.xAxis[0].data=option_x;//给X轴赋值
		optionsKj1.series[0].data=option_data1;//给Y轴第1柱子赋值
		optionsKj1.series[1].data=option_data2;//给Y轴第2柱子赋值
		optionsKj1.series[2].data=option_data3;//给Y轴第3柱子赋值
		optionsKj1.series[3].data=option_data4;//给Y轴第4柱子赋值
		optionsKj1.series[4].data=option_data5;//给Y轴第5柱子赋值
		optionsKj1.series[5].data=option_data6;//给Y轴第6柱子赋值
		myChar1.setOption(optionsKj1);
		var type='';
		if(data.length<=10){
			type='qu';
		}else{
			type='sq';
			$('#tab1').width((data.length+1)*200);
		}
		var text=appendTab(data,type,'tab1');
		$('#tab1').html(text);
	}
}
//空间统计第二层
function loadDataEachaKj2(area,town){
	var temp = {
			area : area,
			town : town
		};
	var data = loadEachr.loadData("/agsupport_swj/statistics!getKjTjByTown.action",temp? temp:null);
	var option_x= [];
	var option_data1= [];
	var option_data2= [];
	var option_data3= [];
	var option_data4= [];
	var option_data5= [];
	var option_data6= [];
	if(data){
		for(var i in data){
			var item = data[i];
			option_x[i]=item.name;
			option_data1[i]=item.mp;
			option_data2[i]=item.count;
			option_data3[i]=item.shpw;
			option_data4[i]=item.cypw;
			option_data5[i]=item.cdpw;
			option_data6[i]=item.ydyhpw;
		}
		optionsKj2.xAxis[0].data=option_x;//给X轴赋值
		optionsKj2.series[0].data=option_data1;//给Y轴第1柱子赋值
		optionsKj2.series[1].data=option_data2;//给Y轴第2柱子赋值
		optionsKj2.series[2].data=option_data3;//给Y轴第3柱子赋值
		optionsKj2.series[3].data=option_data4;//给Y轴第4柱子赋值
		optionsKj2.series[4].data=option_data5;//给Y轴第5柱子赋值
		optionsKj2.series[5].data=option_data6;//给Y轴第6柱子赋值
		myChar2.setOption(optionsKj2);
		var type='';
		if(data.length<=10){
			type='qu';
		}else{
			type='sq';
			$('#tab2').width((data.length+1)*200);
		}
		var text=appendTab(data,type,'tab2');
		$('#tab2').html(text);
	}
}
//拼接表格
function appendTab(data,type,tabType){
	if(data){
		var text='';
		if(type=='qu'){
			var text='<thead><tr><th style="width:10%"><button type="button" class="btn btn-primary btn-sm" onclick="exportExcelForKjtj('+tabType+')">导出excel</button></th>';
			for(var i in data){
				text+='<th style="width:8%">'+data[i].name+'</th>';
			}
		}else{
			var text='<thead><tr><th style="width:200px"><button type="button" class="btn btn-primary btn-sm" onclick="exportExcelForKjtj('+tabType+')">导出excel</button></th>';
			for(var i in data){
				text+='<th style="width:200px">'+data[i].name+'</th>';
			}
		}
		text+='</tr></thead>';
		var mp,count,shpw,cypw,cdpw,ydyhpw;
		for(var i in data){
			mp+='<td>'+data[i].mp+'</td>';
			count+='<td>'+data[i].count+'</td>';
			shpw+='<td>'+data[i].shpw+'</td>';
			cypw+='<td>'+data[i].cypw+'</td>';
			cdpw+='<td>'+data[i].cdpw+'</td>';
			ydyhpw+='<td>'+data[i].ydyhpw+'</td>';
		}
		text+='<tbody><tr><td>四标四实门牌数</td>';
		text+=mp;
		text+='</tr><tr><td>排水户摸查户数</td>';
		text+=count;
		text+='</tr><tr><td>生活排污</td>';
		text+=shpw;
		text+='</tr><tr><td>餐饮排污</td>';
		text+=cypw;
		text+='</tr><tr><td>沉淀物排污</td>';
		text+=cdpw;
		text+='</tr><tr><td>有毒有害排污</td>';
		text+=ydyhpw;
		text+='</tr></tbody>';
		return text;
	}
	return "";
}

//问题上报导出word
function exportExcelForKjtj(tabType){
	var area=areaName;
	var town=townName;
	var index = layer.msg('导出中，请稍等...数据量较大时，导出需要等待几分钟',{time:10000}, {icon: 16});
	debugger;
	if(tabType.id=="tab0"){
		area="全市";
		town="";
	}else if(tabType.id=="tab1"){
		town="";
	}
	window.location.href="/agsupport_swj/psh-discharger!exportExcelForKjtj.action?kjArea="+area+"&kjTown="+town;
}