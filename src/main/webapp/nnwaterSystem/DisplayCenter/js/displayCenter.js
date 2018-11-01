
/*获取各监测点信息*/
	$.ajax({
		url:location.protocol+"//"+location.hostname+":"+location.port+"/agsupport/ps-comb!getPsCombSortList.action",
		type:"post",
		async:true,
		dataType:"json",
		success:function(data){
			var item = data[0];
			var arrData = [];
			for(var i=0;i<item.length;i++){
				var esttype = item[i].ESTTYPE;
				var devicename = item[i].DEVICENAME;
				if(esttype == 19 && devicename == "雨量计"){
					loadTable(1,item[i].row);
					arrData[0] = item[i].row.length;
				}else if(esttype == 21 && devicename == "液位仪"){
					loadTable(2,item[i].row);
					arrData[1] = item[i].row.length;
				}else if(esttype == 21 && devicename == "流量计"){
					loadTable(3,item[i].row);
					arrData[2] = item[i].row.length;
				}else if(esttype == 18 && devicename == "液位仪"){
					loadTable(4,item[i].row);
					arrData[3] = item[i].row.length;
				}else if(esttype == 18 && devicename == "流量计"){
					loadTable(5,item[i].row);
					arrData[4] = item[i].row.length;
				}else if(esttype == 6 && devicename == "液位仪"){
					loadTable(6,item[i].row);
					arrData[5] = item[i].row.length;
				}else if(esttype == 13 && devicename == "液位仪"){
					loadTable(7,item[i].row);
					arrData[6] = item[i].row.length;
				}else if(esttype == 17 && devicename == "视频"){
					loadTable(8,item[i].row);
					arrData[7] = item[i].row.length;
				}
			}
			//loadJCDData(arrData);
		},
		error:function(){alert("服务器加载出错");}
	});

/*加载显示监测点数据的table*/
function loadTable(i,data){
	if(i == 8){
		columnsData = [
				{visible: true,title: '设备名称',align:'center',field:'COMBNAME'},			
	    ]
	}else{
		columnsData = [
				{visible: true,title: '设备名称',align:'center',field:'COMBNAME',width:'70%'},
				{visible: true,title: '监测值',align:'center',field:'DVALUE',width:'30%'},				
	    ]
	}
	$("#table"+i).bootstrapTable({
			toggle:"table",
			data: data,
			height: 113,
			rowStyle:"rowStyle",
			cache: false, 
			striped: true,
			sidePagination: "server",
			columns: columnsData
	});
	$("#sum"+i).html(data.length+"条");
	$(window).resize(function() {
		for(var i = 1;i<=8;i++){
			$("#table"+i).bootstrapTable('refreshOptions', {data:data});
			$("#table"+i).on('post-body.bs.table', function (row,obj) {
					$(".fixed-table-body").mCustomScrollbar();
			}); 
		}
	});
}
$("#table1").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar();
}); 
/*获取气象报警数据*/
$.ajax({
	method : 'GET',
	url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/meteo-hydrolog-alarm!NewestAlarm.action',
	async : true,
	dataType : 'json',                                                  
	success : function(data) {
		if(data.form){
			var imgSrc=location.protocol+"//"+location.hostname+":"+location.port+'/agsupport'+data.form.IMGSRC;			                			
			$(".tips>img").attr("src",imgSrc);
			var time=getCNLocalTime(data.form.ALARM_TIME.time);
			$(".tips>p>span").html(time);
			var title = data.form.ALARM_TITLE;
			$(".tips>p>strong").html(title);
			if(title.indexOf("红") == 0){
				$(".tips>p>strong").css('color','#b72501');
			}else if(title.indexOf("橙") == 0){
				$(".tips>p>strong").css('color','#FA9700');
			}else if(title.indexOf("黄") == 0){
				$(".tips>p>strong").css('color','#FFFF01');
			}else if(title.indexOf("蓝") ==0){
				$(".tips>p>strong").css('color','#3265FF');
			}
		}
	},
	error : function() {
		parent.layer.msg('请求失败');
	}
});
var myChart1 = echarts.init(document.getElementById('chart1')); 
var option1 = {
	tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
		left:'left',
        data:['非满管','满管','积水','一般内涝','严重内涝']
		
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
			center: ['72%', '50%'],
            avoidLabelOverlap: false,
			grid:{
				x:40,
				y:20,
				y2:40,
				x2:8
			  },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'非满管'},
                {value:310, name:'满管'},
                {value:234, name:'积水'},
                {value:135, name:'一般内涝'},
                {value:600, name:'严重内涝'}
            ],
			color: ['#60C0DD','#F3A43B','#FAD860','#9BCA63','#FE8463']
        }
    ]
};      
// 使用刚指定的配置项和数据显示图表。
	myChart1.setOption(option1);
var myChart2 = echarts.init(document.getElementById('chart2'));        
var option2 = {
	tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
		left:'left',
        data:['一年一遇','两年一遇','五年一遇','十年一遇','三十年一遇','五十年一遇','一百年一遇']
		
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
			center: ['72%', '50%'],
            avoidLabelOverlap: false,
			grid:{
				x:40,
				y:20,
				y2:40,
				x2:8
			  },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'一年一遇'},
                {value:310, name:'两年一遇'},
                {value:234, name:'五年一遇'},
                {value:135, name:'十年一遇'},
                {value:1048, name:'三十年一遇'},
                {value:251, name:'五十年一遇'},
                {value:147, name:'一百年一遇'}
            ],
			color: ['rgb(254,67,101)','rgb(252,157,154)','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)','#8BCDAF','#75DEB2']
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
	myChart2.setOption(option2);
var myChart3 = echarts.init(document.getElementById('chart3'));        
var option3 = {
	tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['五年一遇','十年一遇','二十年一遇','五十年一遇','一百年一遇']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
			center: ['72%', '50%'],
            avoidLabelOverlap: false,
			grid:{
				x:30,
				y:10,
				y2:25,
				x2:8
			  },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'五年一遇'},
                {value:310, name:'十年一遇'},
                {value:234, name:'二十年一遇'},
                {value:135, name:'五十年一遇'},
                {value:200, name:'一百年一遇'} 
            ],
			color: ['#F0CC15','#15A68F','#527993','#70197E','#DA91B6','#BE4367']
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
	myChart3.setOption(option3);	
	