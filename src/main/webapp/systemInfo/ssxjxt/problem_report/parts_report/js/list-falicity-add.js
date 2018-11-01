//var data = [{"stcd":"sss","rlstcd":"rlstcdtinanhequ"},{"stcd":"sss","rlstcd":"rlstcdtinanhequ"}];
	//app.title = '坐标轴刻度与标签对齐';
var $frame2=$(window.parent.document.getElementsByClassName("desktop-map")).contents();
var myChar, options = {
    color: ['#3398DB'],
    title: {
        text: '数据新增统计'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '1%',
        right: '8%',
        bottom: '13%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水公司','开发区'],
            axisLabel: {
            	interval: 0	
            	//rotate: -30 //30度
            },
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'数据新增统计',
            type:'bar',
            barWidth: '60%',
            data:[10, 20, 13, 15, 17, 19, 20, 11, 13,12,7,26,20]
        }
    ]
};
	$(function(){
		$.ajax({
			dataType: "json",
			data:{flag:1},
			url:'/psxj/ps-jk-data-his!reporDataAll.action',
			success:function(data){
				var result =  data.rows;
				resultData = result.sort(sortTime);
				
				var table = new Table(resultData);
				table.init();

			},
			error: function(){
				
			}	
		});
	});

// <div id="mapInfo_content"></div>
	
	function sortTime(a,b){  
	       return b.REPAIR_DAT-a.REPAIR_DAT;
	   }
	    //result.sort(sortId);
	// 表单
	var Table=function(resultData){
		var Table=new Object();
				Table.init=function(){					
					$("#table").bootstrapTable({
						toggle:"tableCell",
						//url:'/agsupport/ps-jk-data-his!reporDataAll.action',
						data: resultData,
						rowStyle:"rowStyle",
						cache:false,
						pagination:true,
						dataType:'json',
						striped:true,
						pageNumber:1,
						pageSize:10,
						pageList:[10,25,50,100],
						queryParams:Table.queryParams,
						sidePagination:"client",
						clickToSelect:true,
						columns:[
							// {checkbox:true},
							{field: 'tableName',title:'设施类型',visible:true,align:'center',width:'15%',formatter: forsttp},
							{field:'OBJECTID',title:'设施编号',visible:false,align:'center',width:'15%'},
							{field:'DISTRICT',title:'所属区域',visible:true,align:'center',width:'15%'},
							{field:'REPAIR_COM',title:'上报人',visible:true,align:'center',width:'15%'},
							{field:'REPAIR_DAT',title:'上报时间',visible:true,align:'center',width:'30%',
								formatter:function (data) {
									if(data){
		                                data=data+1000*60*60*8;
		                                return getFormatDate(new Date(data));
									}else{
										return "-";
									}
		
		                    }},
							{field:'ck',title:'操作',align:'center',width:'15%',formatter:function (val,rows,index) {
								return "<button type=\"button\" class=\"btn btn-primary\"" +
										"onclick=\"goLocation('"+rows.tableName+"','"+rows.OBJECTID+"')\">" +
										"定位</button>";
		                    }}
						],
		               /* responseHandler:function (res) {
		                    return res.content;
		                },*/
		                onDblClickRow:function(row,$element){
							row=formatRow(row);
							var a=tableRowfiledToHtml(row);
		                    $frame2.find("#myModalLabel_title").empty();
		                    $frame2.find("#myModalLabel_title").html("详情");
		                    $frame2.find("#mapInfo_list #mapInfo").html("");
		                    $frame2.find("#mapInfo_list #mapInfo").html(a);
		                    $frame2.find("#mapInfo_list").modal('show');
						}
					});
				}
				// 查询参数
				Table.queryParams=function(params){
					var temp={
						showSize: params.limit,
						pageNo: params.offset/params.limit+1,
		                // objectType: $('#objectType').val(),
		                // district: $('#district').val(),
		                objectType: "all",
		                district: "all",
						flag_: '2',
					};
					return temp;
				};
				return Table;
				Table.init();
			
	}

	//柱形图
	function columnView(){
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(options);
		window.onresize = myChar.resize;
		
		myChar.on('click',function(params){
			console.log(params.name);
		});
	}
	columnView();
    //柱形图点击是事件
	//定位方法
	function postin(){
		//父页面定位方法
		//window.parent.aa()
	}
	//查询
	function search(){
		console.log('refresh');
        // $("#table").bootstrapTable('load',data);
        $("#table").bootstrapTable('refresh');
	}

	//格式化日期
	function getFormatDate(date, pattern) {
		if (date == undefined) {
			date = new Date();
		}
		if (pattern == undefined) {
			pattern = "yyyy年MM月dd日hh时mm分";
		}
		return date.format(pattern);
	}

//扩展Date的format方法
	Date.prototype.format = function (format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}

	//格式化行数据
	function formatRow(row){
		if(row){
			var newRow=new Object();
			for(a in row){
				if(a=='DISTRICT') {
                    newRow['行政区划'] = row[a];
                }else if(a=='OWNERDEPT'){
                    newRow['权属单位'] = row[a];
				}else if(a=='MANAGEDEPT'){
                    newRow['管理单位'] = row[a];
                }else if(a=='STATE'){
                    newRow['设施状态'] = row[a];
                }else if(a=='NAME'){
                    newRow['阀门名称'] = row[a];
                }else if(a=='WORK_ID'){
                    newRow['作业编号 '] = row[a];
                }else if(a=='LANE_WAY'){
                    newRow['所在道路'] = row[a];
                }else if(a=='ADDR'){
                    newRow['地址'] = row[a];
                }else if(a=='SORT'){
                    newRow['类别'] = row[a];
                }else if(a=='MODE_'){
                    newRow['型号'] = row[a];
                }else if(a=='STYLE'){
                    newRow['类型'] = row[a];
                }else if(a=='ROTATE_NUM'){
                    newRow['转数 '] = row[a];
                }else if(a=='SUR_H'){
                    newRow['地面高程'] = row[a];
                }else if(a=='CEN_DEEP'){
                    newRow['埋深'] = row[a];
                }else if(a=='TOP_H'){
                    newRow['顶部高程 '] = row[a];
                }else if(a=='CEN_H'){
                    newRow['中心点高程'] = row[a];
                }else if(a=='D_S'){
                    newRow['管径'] = row[a];
                }else if(a=='X'){
                    newRow['坐标X'] = row[a];
                }else if(a=='Y'){
                    newRow['坐标Y'] = row[a];
                }else if(a=='REMARK'){
                    newRow['备注'] = row[a];
                }else if(a=='MAINTAINER'){
                    newRow['维护单位'] = row[a];
                }else if(a=='DATE_'){
                    newRow['日期'] = row[a];
                }else if(a=='DATA_VERSI'){
                    newRow['数据版本'] = row[a];
                }
                else if(a=='REPAIRDAT'){
                	if(row[a]){
                        row[a]=row[a]+1000*60*60*8;
                        newRow['调查日期'] = getFormatDate(new Date(parseInt(row[a])));;
					}else {
                        newRow['调查日期'] = "-";
                    }
                }
                else if(a=='REPAIR_DAT'){
                        if(row[a]){
                            row[a]=row[a]+1000*60*60*8;
                            newRow['调查日期'] = getFormatDate(new Date(parseInt(row[a])));;
                        }else {
                            newRow['调查日期'] = "-";
                        }
                }else if(a=='SEWAGESYST'){
                    newRow['所在污水系统'] = row[a];
                }else if(a=='RAINESYSTE'){
                    newRow['所在雨水系统'] = row[a];
                }else if(a=='table'){
                    // 数据表 要隐藏
                }else if(a=='USID'){
                    newRow['标识码'] = row[a];
                }else if(a=='FINISHDDAT'){
                    if(row[a]){
                        newRow['竣工日期'] = getFormatDate(new Date(parseInt(row[a])));;
                    }else {
                        newRow['竣工日期'] = "-";
                    }
                }else if(a=='REPAIRCOM'){
                    newRow['上报人'] = row[a];
                }else if(a=='REPAIR_COM'){
                    newRow['上报人'] = row[a];
                }else if(a=='LANEWAY'){
                    newRow['所在道路'] = row[a];
                }else if(a=='ROW_ID'){
                    // 无关字段 要隐藏
                }else if(a=='FLAG_'){
                    newRow['部件状态'] = row[a];
                }else if(a=='ORIENTATIO'){
                    // 无关字段 要隐藏
                }else if(a=='FCODE'){
                    newRow['要素代码'] = row[a];
                }else if(a=='OBJECTID'){
                    newRow['设备编号'] = row[a];
                }
                else{
                	newRow[a]=row[a];
				}
			}
			return newRow;
		}
	}
	function forsttp(val,rows,index){
		var tabName="";
		var layerId;
		if(val){
			switch(val){
			case "VALVE":
				tabName="阀门";
				layerId=2;
				break;
			case "PUMP":
				tabName="泵站";
				layerId=2;
				break;
			case "WELL":
				tabName="窖井";
				layerId=4;
				break;
			case "YLY":
				tabName="排放口";
				layerId=5;
				break;
			case "COMB":
				tabName="溢流堰";
				layerId=6;
				break;
			case "PM":
				tabName="拍门";
				layerId=7;
				break;
			case "COMB":
				tabName="雨水口";
				layerId=8;
				break;
			case "PIPE":
				tabName="排水管道";
				layerId=9;
				break;
			case "CANAL":
				tabName="排水沟渠";
				layerId=10;
				break;
			default:
				tabName="";
				break;
			}
			return tabName;
		}else{
			return "";
		}
	}
	//定位
	function goLocation(layerName,objId){
		if(layerName){
			switch(layerName){
			case "VALVE":
				layerId=2;
				break;
			case "PUMP":
				layerId=2;
				break;
			case "WELL":
				layerId=4;
				break;
			case "YLY":
				layerId=5;
				break;
			case "COMB":
				layerId=6;
				break;
			case "PM":
				layerId=7;
				break;
			case "COMB":
				layerId=8;
				break;
			case "PIPE":
				layerId=9;
				break;
			case "CANAL":
				layerId=10;
				break;
			default:
				break;
			}
		    var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
		    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
		    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
		    aContent.show().siblings(".J_iframe").hide();
			window.parent.openQuerys(objId,layerId);
		}
		//parent.document.getElementById('map-frame').contentWindow.openQuerys(objId,layerId);
	}
	