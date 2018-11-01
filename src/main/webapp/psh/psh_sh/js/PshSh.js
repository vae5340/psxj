var widthPage=document.body.clientWidth;heightPage=document.body.clientHeight;
//行业大类
var pcodeData=[
	          {"code":"1","name":"生活排污类"},
	          {"code":"2","name":"餐饮排污类"},
	          {"code":"3","name":"沉淀物排污类"},
	          {"code":"4","name":"有毒有害排污类"}
          ];
//行业小类
var codeData=[
           	  {"pCode":"生活排污类","data":[
                  {"code":"11","name":"机关企事业单位"},
                  {"code":"12","name":"学校"},
                  {"code":"13","name":"商场"},
                  {"code":"14","name":"居民住宅"},
                  {"code":"15","name":"其他"}
              ]},
              {"pCode":"餐饮排污类","data":[
                   {"code":"21","name":"餐饮店"},
                   {"code":"22","name":"农家乐"},
                   {"code":"23","name":"酒店"},
                   {"code":"24","name":"大型食堂"},
                   {"code":"25","name":"其他"}
               ]},
               {"pCode":"沉淀物排污类","data":[
                    {"code":"31","name":"洗车、修车档"},
                    {"code":"32","name":"沙场"},
                    {"code":"33","name":"建筑工地"},
                    {"code":"34","name":"养殖场"},
                    {"code":"35","name":"其他"}
                ]},
                {"pCode":"有毒有害排污类","data":[
                     {"code":"41","name":"化工"},
                     {"code":"42","name":"印染"},
                     {"code":"43","name":"电镀"},
                     {"code":"44","name":"医疗"},
                     {"code":"45","name":"其他"}
                 ]}
          ];
var noTable,hasTable,passTable,allTable;
$(function(){
    $(document).keydown(function(e){
        if(!e) var e= window.event;
        if(e.keyCode == 13){
            search();
        }
    });
	initDatetimepicker();
	initHylbData();
	noTable = new NoTable();
	noTable.Init();
	hasTable = new HasTable();
	hasTable.Init();
	passTable = new PassTable();
	passTable.Init();
	allTable = new Alltable();
    allTable.Init();
	//地图定位
	initTableClick();
	
});
function initDatetimepicker(){
	$("#startTime").datetimepicker({
		 format: "yyyy-mm-dd",
		 autoclose: true,
		 todayBtn: true,
		 todayHighlight: true,
		 showMeridian: true,
		 pickerPosition: "bottom-left",
		 language: 'zh-CN',//中文，需要引用zh-CN.js包
		 startView: 2,//月视图
		 minView: 2,//日期时间选择器所能够提供的最精确的时间选择视图
		 endDate: new Date()
	}); 
	$("#endTime").datetimepicker({
		format: "yyyy-mm-dd",
		autoclose: true,
		todayBtn: true,
		todayHighlight: true,
		showMeridian: true,
		pickerPosition: "bottom-left",
		language: 'zh-CN',//中文，需要引用zh-CN.js包
		startView: 2,//月视图
		minView: 2,//日期时间选择器所能够提供的最精确的时间选择视图
		//endDate: new Date()
	});
    $("#startTime").val(getZeroDate("year").FormatNew("yyyy-MM-dd"));
    $("#endTime").val(new Date().FormatNew("yyyy-MM-dd"));
  //初始化行业类别数据字典
	$('#dischargerType1').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "清除",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个污水类别"
    });
	$('#dischargerType2').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "清除",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个单位类型"
	});
	//下拉框监听改变事件
	 $('#dischargerType1').on('change',function(elv){
		$('#childCode').html("");  //每次改变大类清空子类
		if($(this).val()){
		   var selectVal = $(this).val();
		   for(i in selectVal){
			   for(k in codeData){
				   if(selectVal[i] == codeData[k].pCode){
					   for(v in codeData[k].data){
						  var code_c  = codeData[k].data[v].code;
						  var name_c =  codeData[k].data[v].name;
						  if(code_c) $("#childCode").append("<option value='"+name_c+"'>"+name_c+"</option>");
					   }
				   }
			   }
		   }
		}
		$('#dischargerType2').selectpicker('refresh');
	});
}

function initHylbData(){
	for(i in pcodeData){
		if(pcodeData[i].code)
			$("#pcode").append("<option value='"+pcodeData[i].name+"'>"+pcodeData[i].name+"</option>");
	}
	$('#dischargerType1').selectpicker('refresh');
	$('#dischargerType2').selectpicker('refresh');
}
//加载待审核
var NoTable=function(){
	NoTable = new Object();
	NoTable.Init=function(){
		$("#no_table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/pshDischarger/getPshList',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 200,                      
		    //pageList: [10, 25, 50, 100],
			pageList: [10,200,3000],
            queryParams:NoTable.queryParms,
			clickToSelect:true,
			uniqueId:'index',
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
                {field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'parentOrgName',title:'所属区域',visible:true,align:'center'},
				{field:'town',title:'所属镇(街)',visible:true,align:'center'},
				{field:'name',title:'排水户名称',visible:true,align:'center'},
				{field:'dischargerType1',title:'污水类别',visible:true,align:'center'},
				{field:'dischargerType2',title:'单位类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'addr',title:'详细地址',visible:true,align:'center'},
				{field:'state',title:'状态',visible:true,align:'center',formatter: format_checkState}
                //{title:'操作',visible:true,align:'center',formatter: format_oper}
				],
			onLoadSuccess:function(data){
				var oneNum=data.code=='200'?data.total:0;
				$("#element_01").html('('+oneNum+')');
				NoTable.getData=data.rows;
			},onDblClickRow: function(row){
                NoTable.current = row;
				//iframe窗
				layer.open({
					type: 2,
					area: [widthPage/1.6+'px', heightPage/1.2+'px'],
                    //area: ['900px', '600px'],
					maxmin: true,
					zIndex:20000,
					title : "查看详情",
                    btn:['上一条','下一条','审核通过','存疑','返回'],
                    content: ['/psxj/psh/psh_sh/showSq/psh_checkInput.html?id='+NoTable.current.id, 'yes'],
					btn1: function(index,layero){
						var iframes = $(layero).find("iframe")[0].contentWindow;
						if(NoTable.getData){
							var upData = getData(NoTable.getData,'up',NoTable.current.id);
                            NoTable.current = upData?upData:NoTable.current;
							if(upData){
								iframes.reset();
								iframes.reloadDate(NoTable.current.id);
							}else{
                                layer.msg("当前没有上一条了!",{icon: 5});
							}
							return false;
						}else{
                            layer.msg("当前没有上一条了!",{icon: 5});
							return false;
						}
					},btn2: function(index,layero){
						var iframes = $(layero).find("iframe")[0].contentWindow;
						if(NoTable.getData){
							var downData = getData(NoTable.getData,'down',NoTable.current.id);
                            NoTable.current = downData?downData:NoTable.current;
							if(downData){
								iframes.reset();
								iframes.reloadDate(NoTable.current.id);
							}else{
                                layer.msg("当前没有下一条了!",{icon: 5});
							}
							return false;
						}else{
                            layer.msg("当前没有下一条了!",{icon: 5});
							return false;
						}
					},btn3: function(index,layero){
						var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("checkForm");
                        var iframes = $(layero).find("iframe")[0].contentWindow;
                        iframes.saveAndPass(2,'no');
                        return false;
					},btn4: function(index,layero){
                        var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("checkForm");
                        var iframes = $(layero).find("iframe")[0].contentWindow;
                        iframes.saveAndPass(3,'no');
                        return false;
                    },btn5:function(index,layero){
                        refreshTable();
					},success: function(layero){
                        /*layero.find('.layui-layer-btn0')[0].style.borderColor="#1ab394";
                        layero.find('.layui-layer-btn0')[0].style.backgroundColor="#1ab394";
                        layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#2e8ded";
                        layero.find('.layui-layer-btn1')[0].style.borderColor ="#2e8ded";
                        layero.find('.layui-layer-btn1')[0].style.color="#ffffff";
                        layero.find('.layui-layer-btn2')[0].style.backgroundColor ="#2e8ded";
                        layero.find('.layui-layer-btn2')[0].style.borderColor ="#2e8ded";
                        layero.find('.layui-layer-btn2')[0].style.color="#ffffff";*/
					},cancel: function(index, layero){
                        refreshTable();
						layer.close(index)
                    }
                });
			}
		});
	},
	NoTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        markPerson : $("#markPerson").val(),
	        parentOrgName:$("#parentOrgName").val(),
	        name : $("#name").val(),
	        addr : $("#addr").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
    		dischargerType2: $("#dischargerType2").val()?$("#dischargerType2").val():"",
    	    state:'1'		
		};
		return temp;
	}
	return NoTable;
}
//加载已审核数据
var HasTable=function(){
	HasTable = new Object();
	HasTable.Init=function(){
		$("#has_table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/pshDischarger/getPshList',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 200,                      
		    //pageList: [10, 25, 50, 100],
            pageList: [200,3000],
            queryParams:HasTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
                {field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'parentOrgName',title:'所属区域',visible:true,align:'center'},
				{field:'town',title:'所属镇(街)',visible:true,align:'center'},
				{field:'name',title:'排水户名称',visible:true,align:'center'},
				{field:'dischargerType1',title:'污水类别',visible:true,align:'center'},
				{field:'dischargerType2',title:'单位类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'addr',title:'详细地址',visible:true,align:'center'},
				{field:'state',title:'状态',visible:true,align:'center',formatter: format_checkState},
				{field:'checkPerson',title:'审批人',visible:true,align:'center'},
				{field:'checkTime',title:'审批时间',visible:true,align:'center',formatter: format_date},
//				{field:'checkDesription',title:'审批备注',visible:true,align:'center'}
//				{title:'操作',visible:true,align:'center',formatter: format_oper}
				],
				onLoadSuccess:function(data){
					var twoNum=data.code=='200'?data.total:0;
					$("#element_02").html('('+twoNum+')');
                    HasTable.getData=data.rows;
				},onDblClickRow: function(row){
					var current = row;
					//iframe窗
					layer.open({
						type: 2,
                        area: [widthPage/1.6+'px', heightPage/1.2+'px'],
                        //area: ['900px', '600px'],
						maxmin: true,
                        zIndex:20000,
                        title : "查看详情",
                        btn:['上一条','下一条','存疑','返回'],
						content: ['/psxj/psh/psh_sh/showSq/psh_checkInput.html?id='+row.id, 'yes'],
                        btn1: function(index,layero){
                            var iframes = $(layero).find("iframe")[0].contentWindow;
                            if(HasTable.getData){
                                var upData = getData(HasTable.getData,'up',current.id);
                                current = upData?upData:current;
                                if(upData){
                                    iframes.reset();
                                    iframes.reloadDate(current.id);
                                }else{
                                    layer.msg("当前没有上一条了!",{icon: 5});
                                }
                                return false;
                            }else{
                                layer.msg("当前没有上一条了!",{icon: 5});
                                return false;
                            }
                        },btn2: function(index,layero){
                            var iframes = $(layero).find("iframe")[0].contentWindow;
                            if(HasTable.getData){
                                var downData = getData(HasTable.getData,'down',current.id);
                                current = downData?downData:current;
                                if(downData){
                                    iframes.reset();
                                    iframes.reloadDate(current.id);
                                }else{
                                    layer.msg("当前没有下一条了!",{icon: 5});
                                }
                                return false;
                            }else{
                                layer.msg("当前没有下一条了!",{icon: 5});
                                return false;
                            }
                        },btn3: function(index,layero){
                            var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("checkForm");
                            var iframes = $(layero).find("iframe")[0].contentWindow;
                            iframes.saveAndPass(3,'has');
                            return false;
                        },btn4:function(index,layero){
                            refreshTable();
                        },success: function(layero){
                           /* layero.find('.layui-layer-btn0')[0].style.borderColor="#2e8ded";
                            layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#2e8ded";
                            layero.find('.layui-layer-btn1')[0].style.color="#ffffff";*/
                        },cancel: function(index, layero){
                            refreshTable();
    						layer.close(index)
                        }
					});
				}
		});
	},
	HasTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        markPerson : $("#markPerson").val(),
	        parentOrgName:$("#parentOrgName").val(),
	        name : $("#name").val(),
	        addr : $("#addr").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
    		dischargerType2: $("#dischargerType2").val()?$("#dischargerType2").val():"",
    	    state:'2'		
		};
		return temp;
	}
	return HasTable;
}//加载存在疑问
var PassTable=function(){
    PassTable = new Object();
	PassTable.Init=function(){
		$("#pass_table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/pshDischarger/getPshList',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 200,                      
		    //pageList: [10, 25, 50, 100],
            pageList: [200,3000],
            queryParams:PassTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
                {field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'parentOrgName',title:'所属区域',visible:true,align:'center'},
				{field:'town',title:'所属镇(街)',visible:true,align:'center'},
				{field:'name',title:'排水户名称',visible:true,align:'center'},
				{field:'dischargerType1',title:'污水类别',visible:true,align:'center'},
				{field:'dischargerType2',title:'单位类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'addr',title:'详细地址',visible:true,align:'center'},
				{field:'state',title:'状态',visible:true,align:'center',formatter: format_checkState},
				{field:'checkPerson',title:'审批人',visible:true,align:'center'},
				{field:'checkTime',title:'审批时间',visible:true,align:'center',formatter: format_date},
//				{field:'checkDesription',title:'审批备注',visible:true,align:'center'}
//				{title:'操作',visible:true,align:'center',formatter: format_oper}
				],
				onLoadSuccess:function(data){
					var threeNum=data.code=='200'?data.total:0;
					$("#element_03").html('('+threeNum+')');
                    PassTable.getData = data.rows;
				},onDblClickRow: function(row){
                	PassTable.current = row;
					//iframe窗
					layer.open({
						type: 2,
						area: [widthPage/1.6+'px', heightPage/1.2+'px'],
						//area: ['900px', '600px'],
						maxmin: true,
						zIndex:20000,
						title : "查看详情",
						btn:['上一条','下一条','审核通过','存疑','返回'],
						content: ['/psxj/psh/psh_sh/showSq/psh_checkInput.html?id='+row.id, 'yes'],
						btn1: function(index,layero){
							var iframes = $(layero).find("iframe")[0].contentWindow;
							if(PassTable.getData){
								var upData = getData(PassTable.getData,'up',PassTable.current.id);
                                PassTable.current = upData?upData:PassTable.current;
								if(upData){
									iframes.reset();
									iframes.reloadDate(PassTable.current.id);
								}else{
									layer.msg("当前没有上一条了!",{icon: 5});
								}
								return false;
							}else{
								layer.msg("当前没有上一条了!",{icon: 5});
								return false;
							}
						},btn2: function(index,layero){
							var iframes = $(layero).find("iframe")[0].contentWindow;
							if(PassTable.getData){
								var downData = getData(PassTable.getData,'down',PassTable.current.id);
                                PassTable.current = downData?downData:PassTable.current;
								if(downData){
									iframes.reset();
									iframes.reloadDate(PassTable.current.id);
								}else{
									layer.msg("当前没有下一条了!",{icon: 5});
								}
								return false;
							}else{
								layer.msg("当前没有下一条了!",{icon: 5});
								return false;
							}
						},btn3: function(index,layero){
                            var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("checkForm");
                            var iframes = $(layero).find("iframe")[0].contentWindow;
                            iframes.saveAndPass(2,'pass');
                            return false;
                        },btn4: function(index,layero){
                            var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("checkForm");
                            var iframes = $(layero).find("iframe")[0].contentWindow;
                            iframes.saveAndPass(3,'pass');
                            return false;
                        },btn5:function(index,layero){
                            refreshTable();
                        },success: function(layero){
							/*layero.find('.layui-layer-btn0')[0].style.borderColor="#2e8ded";
							layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#2e8ded";
							layero.find('.layui-layer-btn1')[0].style.color="#ffffff";*/
						},cancel: function(index, layero){
                            refreshTable();
                            layer.close(index)
                        }
					});
				}
			});
	},
	PassTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        markPerson : $("#markPerson").val(),
	        parentOrgName:$("#parentOrgName").val(),
	        name : $("#name").val(),
	        addr : $("#addr").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
    		dischargerType2: $("#dischargerType2").val()?$("#dischargerType2").val():"",
    		state:'3'
		};
		return temp;
	}
	return PassTable;
}
//加载全部数据
var Alltable=function(){
    Alltable = new Object();
    Alltable.Init=function(){
        $("#all_table").bootstrapTable({
            method: 'get',
            toggle:"tableCell",
            url:'/psxj/pshDischarger/getPshList',
            method: 'get',
            rowStyle:"rowStyle",
            cache:false,
            pagination:true,
            dataType:'json',
            striped:true,
            sidePagination:"server",
            pageNumber: 1,
            pageSize: 200,
            //pageList: [10, 25, 50, 100],
            pageList: [200,3000],
            queryParams:Alltable.queryParms,
            clickToSelect:true,
            columns:[
                {field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
                {field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'parentOrgName',title:'所属区域',visible:true,align:'center'},
				{field:'town',title:'所属镇(街)',visible:true,align:'center'},
				{field:'name',title:'排水户名称',visible:true,align:'center'},
				{field:'dischargerType1',title:'污水类别',visible:true,align:'center'},
				{field:'dischargerType2',title:'单位类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'addr',title:'详细地址',visible:true,align:'center'},
				{field:'state',title:'状态',visible:true,align:'center',formatter: format_checkState},
				{field:'checkPerson',title:'审批人',visible:true,align:'center'},
				{field:'checkTime',title:'审批时间',visible:true,align:'center',formatter: format_date},
//				{field:'checkDesription',title:'审批备注',visible:true,align:'center'}
                //{title:'操作',visible:true,align:'center',formatter: format_oper}
            ],
            onLoadSuccess:function(data){
                var threeNum=data.code=='200'?data.total:0;
                $("#element_04").html('('+threeNum+')');
                Alltable.getData = data.rows;
            },onDblClickRow: function(row){
                var current = row;
                //iframe窗
                layer.open({
                    type: 2,
                    //area: ['900px', '600px'],
                    area: [widthPage/1.6+'px', heightPage/1.2+'px'],
                    maxmin: true,
                    zIndex:20000,
                    title : "查看详情",
                    btn:['上一条','下一条','返回'],
                    content: ['/psxj/psh/psh_sh/showSq/psh_checkInput.html?id='+row.id, 'yes'],
					btn1: function(index,layero){
                        var iframes = $(layero).find("iframe")[0].contentWindow;
                        if(Alltable.getData){
                            var upData = getData(Alltable.getData,'up',current.id);
                            current = upData?upData:current;
                            if(upData){
                                iframes.reset();
                                iframes.reloadDate(current.id);
                            }else{
                                layer.msg("当前没有上一条了!",{icon: 5});
                            }
                            return false;
                        }else{
                            layer.msg("当前没有上一条了!",{icon: 5});
                            return false;
                        }
                    },btn2: function(index,layero){
                        var iframes = $(layero).find("iframe")[0].contentWindow;
                        if(Alltable.getData){
                            var downData = getData(Alltable.getData,'down',current.id);
                            current = downData?downData:current;
                            if(downData){
                                iframes.reset();
                                iframes.reloadDate(current.id);
                            }else{
                                layer.msg("当前没有下一条了!",{icon: 5});
                            }
                            return false;
                        }else{
                            layer.msg("当前没有下一条了!",{icon: 5});
                            return false;
                        }
                    },success: function(layero){
                        /*layero.find('.layui-layer-btn0')[0].style.borderColor="#2e8ded";
                        layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#2e8ded";
                        layero.find('.layui-layer-btn1')[0].style.color="#ffffff";*/
                    },cancel: function(index, layero){
                        refreshTable();
                        layer.close(index)
                    }
                });
            }
        });
    },
        Alltable.queryParms=function(params){
            var temp = {
                pageSize:params.limit,
                pageNo: params.offset/params.limit+1,
                startTime : $("#startTime").val(),
                endTime :  $("#endTime").val(),
                markPerson : $("#markPerson").val(),
                parentOrgName:$("#parentOrgName").val(),
                name : $("#name").val(),
    	        addr : $("#addr").val(),
    	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
        		dischargerType2: $("#dischargerType2").val()?$("#dischargerType2").val():""
        	 };
            return temp;
        }
    return Alltable;
}

//格式化审核状态状态/1新增；2；经审核；3存在疑问
function format_checkState(val,row,index){
	if(val){
		if("1"==val){
			return '<font color="#fb4a4a">新增</font>';
		}else if("2"==val){
			return '<font color="#55f955">审核通过</font>';
		}else if("3"==val){
			return '<font color="#828224">存在疑问</font>';
		}else{
			return "未同步";
		}
			
	}else{
		return "未同步";
	}
}

//数据确认
function format_oper(val,row,index){
	var b ;
    if('1'!=row.topCheck && '2'==row.parentCheck){
        b ='<button type="button" class="btn btn-primary btn-sm" onclick="toCheckRecall('+row.id +')">撤回</button>';
	}
	return b;
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
}
//刷新 
function refreshTable(){
	$("#no_table").bootstrapTable('refresh');
	$("#has_table").bootstrapTable('refresh');
	$("#pass_table").bootstrapTable('refresh');
	$("#all_table").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	$('#wentilx').selectpicker('refresh');
	refreshTable();
}
//数据撤回
function toCheckRecall(thisId){
    if(thisId){
        $.ajax({
            type:'post',
            url:'/psxj/nwCheckRecord/recallCheck',
            data:{id:thisId},
            dataType:'json',
            success:function(result){
                if(result.code==200){
                    refreshTable();
                    layer.msg("撤回成功!",{icon:1});
                }else{
                    layer.msg(result.message,{icon:2});
                }
            },error:function(message){
                layer.msg("撤回失败!",{icon:2});
            }
        });
    }
}
//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}

function initTableClick(){
	$("#no_table").on("click-row.bs.table",function(ele,row){
		//if(row.x && row.y)
//			toPoint(row.x,row.y);
		toPoint(row.doorplateAddressCode);
	});
	$("#has_table").on("click-row.bs.table",function(ele,row){
		//if(row.x && row.y)
//			toPoint(row.x,row.y);
			toPoint(row.doorplateAddressCode);
	});
	$("#pass_table").on("click-row.bs.table",function(ele,row){
		//if(row.x && row.y)
//			toPoint(row.x,row.y);
			toPoint(row.doorplateAddressCode);
	});
	$("#all_table").on("click-row.bs.table",function(ele,row){
		//if(row.x && row.y)
//			toPoint(row.x,row.y);
			toPoint(row.doorplateAddressCode);
	});

}
//定位
//function toPoint(x,y){
//	if(x && y){
//		positPoint(x,y);
//	}
//}
//接驳井定位
function toPoint(sGuid){
	positionSGuid(sGuid);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
//上一条和下一条的按钮功能
function getData(data,upDown,id){
	if(!id && !data && !upDown)
		 throw new Error("参数错误!");
	if(typeof upDown!='string')
		 throw new Error("Unknown type: " + upDown);
	if(typeof data!='object')
		throw new Error("Unknown type: " + data);
	if('down'==upDown){
		for(var i=0;i<data.length;i++){
			if(data[i].id==id){
				if(i==data.length-1){
					//refreshTable();
					return null;
				}else{
					return data[i+1];
				}
				
			}
		}
	}else if('up'==upDown){
		for(var i=0;i<data.length;i++){
			if(data[i].id==id){
				if(i==0){
					return null;
				}else{
					return data[i-1];
				}
				
			}
		}
	}else{
		throw new Error("Unknown type: " + upDown);
	}
	return null;
}