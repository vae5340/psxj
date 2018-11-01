var id = getQueryStr("id");
var title = getQueryStr("title");
var type = getQueryStr("type");//修改还是查看
var currentOrg,currentState;

$(function(){
	//动态是否只读
	if(type=='view'){
		$('form').find('input,textarea,select').not('button').attr('readonly',true);
		$('form').find('input,textarea,select').not('button').attr('disabled',false);
	}
	//初始化时间
	loadTime();
	//填充数据
	reloadDate(id);
    var checkRecode = new CheckRecode();

    //审核禁止按钮再次点击
   /* $(document).keydown(function(e){
        if($('body').hasClass('modal-open')){
            if(!e) var e= window.event;
            if(e.keyCode == 13){
                check_submit();
            }
        }
	});*/
});
function loadTime(){
    $("#cmbRunTime").datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-right",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startDate :new Date(946656000000), //开始时间 2000-01-01
        startView: 3,//月视图
        minView: 3//日期时间选择器所能够提供的最精确的时间选择视图
    });
}
function reset(){
    $('input:radio').attr('checked',false);
	$('form')[0].reset();
	$('form')[1].reset();
	$("#img-view").empty();
	$("#yyzz-img-view").empty();
	$("#hzs-img-view").empty();
	$("#psxkz-img-view").empty();
	$("#pwxkz-img-view").empty();
	$("#afftype").empty();
}
//加载详情列表
function reloadDate(myId){
    reset();
	if(myId)
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/psh-discharger!seePsh.action?id='+myId,
			dataType:'json',
			success: function(data){
				if(data.code==500)
			        parent.layer.msg("没找到数据!",{icon:5});
				//接驳井
				if(data.code==200 && data.wells){
					if(data.wells.length>0){
						var htmls="", name='';
						for(var i in data.wells){
							var well = data.wells[i];
							var html='';
							/*for(var j in well){
								if(j=="pipeType" || j=="wellType" || j=="wellPro" || j=="wellDir" || j=="drainPro"){
									if(j=="pipeType"){
										name='管类型';
									}else if(j=="wellType"){
										name='接驳井类型';
									}
									else if(j=="wellPro"){
										name='井存在的问题';
									}
									else if(j=="wellDir"){
										name='管去向';
									}
									else if(j=="drainPro"){
										name='排水存在问题';
									}
									html+='<div class="form-group"><label class="col-sm-2 control-label">'+name+'</label>'+
									'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well[j]+'" readonly="readonly"/>'+
									'</div></div>';
								}
							}*/
							html+='<div class="form-group"><label class="col-sm-2 control-label">管类型</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.pipeType+'" readonly="readonly"/>'+
							'</div></div>';
							//接驳井类型
							if(well.wellId==null || well.wellId==''){
								html+='<div class="form-group"><label class="col-sm-2 control-label">接驳井类型</label>'+
								'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellType+'" readonly="readonly"/>'+
								'</div></div>';
							}else{
								html+='<div class="form-group"><label class="col-sm-2 control-label">接驳井类型</label>'+
								'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellType+'('+well.wellId+')'+'" readonly="readonly"/>'+
								'</div>'+
								//'<div class="col-sm-2" style="text-align: right;"><button type="button" class="btn btn-primary" onclick="position('+well.wellId+');">定位</button></div>'+
								'</div>';
							}
							html+='<div class="form-group"><label class="col-sm-2 control-label">井存在的问题</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellPro+'" readonly="readonly"/>'+
							'</div></div>';
							html+='<div class="form-group"><label class="col-sm-2 control-label">管去向</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellDir+'" readonly="readonly"/>'+
							'</div></div>';
							html+='<div class="form-group"><label class="col-sm-2 control-label">排水存在问题</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+(well.drainPro==null?'':well.drainPro.replace(/#/g, '').replace(/@/g, '').replace(/\$/g, ''))+'" readonly="readonly"/>'+
							'</div></div>';
							htmls+=html+'<hr style="height:1px;border:none;border-top:1px solid #555555;" />';
						}
						$("#jbqkForm").html(htmls);
					}else{
						$("#jbqkForm").html('<div class="form-group"><label style="text-align: center;" class="col-sm-12 control-label">暂无数据</label></div>');
					}
				}
				if(data.code==200 && data.form){
				    //console.log(data);
				    id=data.form.id;
					for(var i in data.form){
						if(i=='markTime' && data.form[i]){
							$("#markTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='checkTime' && data.form[i]){
							$("#checkTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='updateTime' && data.form[i]){
							$("#updateTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='state'){
							var checkStateView=""
							var state = data.form.state;
							currentState=state;
							if(state == '1'){
								checkStateView="新增";
							}else{
								$("#shDiv").show();
								if(state == "2")
									checkStateView="审核通过";
								if(state == "3")
									checkStateView="存在疑问";
							}
							$("#state").val(checkStateView);
						}else if(i=='hasCert1' || i=='hasCert2' ||i=='hasCert3' ||i=='hasCert4'
							|| i.indexOf("fac1") >= 0 || i.indexOf("fac2") >= 0 || i.indexOf("fac3") >= 0 || i.indexOf("fac4") >= 0){
							$(":radio[name='"+i+"'][value='" + data.form[i] + "']").prop("checked", "checked");
							//其他预处理设施有值且不为“无”
							if(i=="fac4" && data.form[i]!=null && data.form[i]!="" && data.form[i]!="无"){
								$(":radio[name='"+i+"'][value='有']").prop("checked", "checked");
								$("#qtyclss").show();
								if(data.form[i]!="有"){
									$("#ssmc").val(data.form[i]);
								}
							}else if(i=="fac1" && data.form[i]=="有"){//有隔油池
								$("#gyc").show();
							}else if(i=="fac2" && data.form[i]=="有"){//有格栅
								$("#gs").show();
							}else if(i=="fac3" && data.form[i]=="有"){//有沉淀池
								$("#cdc").show();
							}
							//运行情况为其他
							if(i=="fac1Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#gycYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac2Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#gsYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac3Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#cdcYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}else if(i=="fac4Cont" && data.form[i]!=null && data.form[i]!=""
								&& data.form[i]!="开启" && data.form[i]!="关闭" && data.form[i]!="故障"){
								$(":radio[name='"+i+"'][value='其他']").prop("checked", "checked");
								$("#qtyclssYxqk").show();
								if(data.form[i]!="其他"){
									$("#"+i).val(data.form[i]);
								}
							}
						}else{
							$("#"+i).val(data.form[i]);
						}
					}
					//工商营业执照
					if(data.form.hasCert1=="1"){
						$(".yyzz").show();
						formatImage(data.yyzz,"yyzz-img-view","yyzz-img-view-cj");
					}
					//接驳意见核准书
					if(data.form.hasCert2=="1"){
						$(".hzs").show();
						formatImage(data.hzs,"hzs-img-view","hzs-img-view-cj");
					}
					//排水许可证
					if(data.form.hasCert3=="1"){
						$(".psxkz").show();
						formatImage(data.psxkz,"psxkz-img-view","psxkz-img-view-cj");
					}
					//排污许可证
					if(data.form.hasCert4=="1"){
						$(".pwxkz").show();
						formatImage(data.pwxkz,"pwxkz-img-view","pwxkz-img-view-cj");
					}
				}
				var total=0,imgHtml='',img_view='';
				if(data.code==200 && data.rows && data.rows.length>0){
					for(var i in data.rows){
						var rowData=data.rows[i];
						var timeText,imgUrl,thumPath;
						if(rowData.attTime)
							timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
						if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
							imgUrl = rowData.attPath;
							thumPath=rowData.thumPath;
						}
						if(timeText && imgUrl && thumPath){
							img_view+='<li class="img-view-lack" style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
							' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
							
							total++;
						}
					}
					//$("#lack-img").append(imgHtml);
					
				}else{
					//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
					img_view+='暂无照片';
				}
				$("#img-view").append(img_view);
				
				//执行父页面图片预览初始化
				$(".img-view-lack").click(function(){
					if(parent.initViewer)
						parent.initViewer($("#img-view").parent().html(),"img-view");
					if(parent.parent.initViewer)
						parent.parent.initViewer($("#img-view").parent().html(),"img-view");
					if(parent.viewer){
						parent.viewer.show($(this).index());
					}else if(parent.parent.viewer){
						parent.parent.viewer.show($(this).index());
					}else{
						layer.msg("未检测到图片插件!",{icon: 2});
					}
				});
			},error:function(message){

            }
		});
	
}


// 审核记录
function checkRecord(){
    var id = $("#id").val();
	if(id){
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/psh-check-record!searchCheckRecord.action',
            data:{reportId:id,reportEntity:'psh_discharger'},
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.rows){
					var length = data.rows.length;
					if(length <1){
						layer.alert("没有历史审核意见！");
						return ;
					}
					$("#checkModalForm").html("");
					var HtmlText = [];
				   HtmlText.push('<table class="table"> <thead>');
				   HtmlText.push('<tr> <th width=10%>审核人</th><th width=10%>手机</th><th width=30%>审核时间</th><th width=10%>审核状态</th><th width=40%>审核意见</th></tr> ');
				   HtmlText.push('</thead><tbody>');
					for(var i in data.rows){
						var d=data.rows[i].checkTime;
						var t =d.time;
						var newDate = new Date();
						newDate.setTime(t);
						var formatDate = newDate.format('yyyy-MM-dd hh:mm:ss');
						var checkState = data.rows[i].checkState;
						var checkStateView = "";
						if(checkState == 2){
							checkStateView = "审核通过";
						}else if(checkState == 3){
							checkStateView = "存在疑问";
						}
						var phone="无";
						if(checkNumber(data.rows[i].checkPersonPhone)){
							phone=data.rows[i].checkPersonPhone;
						}
						HtmlText.push('<tr> <td>'+data.rows[i].checkPerson+'</td><td>'+phone+'</td><td class="form_datetime">'+formatDate +'</td><td>'+checkStateView+'</td><td>'+data.rows[i].checkDesription+'</td></tr>');
					}
					HtmlText.push('</tbody></table>');
					 $("#checkModalForm").html(HtmlText.join(""));
					$("#checkModal").modal();
				}else{
					layer.alert("没有历史审核意见！");
				}
				
			},error:function(){ }
		});
	}
}

var CheckRecode=function(){
    CheckRecode = new Object();
    /**
     * 通过方法
     * @param Json
     * @param type
     */
    CheckRecode.updatePass=function(row,index){
		if(row&&row.id){

		}
        var checkState="";
        for(i in data){
            if(data[i].name == "id"){
                thisId=data[i].value;
            }if(data[i].name == "checkState"){
                checkState=data[i].value;
            }
            if(!data[i] || !data[i].value) {
                delete data[i];
            }else{
                if(data[i].name=='markTime' ||
                    data[i].name=='updateTime' ||
                    data[i].name=='checkTime') {
                    //data[i].value = new Date(data[i].value);
                    delete data[i];
                }
            }
        }
        var url="/agsupport_swj/correct-mark!updateForm.action";
        if(url!=""){
            $.ajax({
                type : 'post',
                url : url,
                data : data,
                dataType: 'json',
                success: function(result){
                    if(result.success){
                        pass(thisId,checkState,thisType);
                    }else{
                        layer.msg("审核失败!",{icon: 2});
                    }
                    layer.close(index);
                },error: function(){
                    layer.msg("请求失败!",{icon: 7});
                    layer.close(index);
                }
            });
        }
	},
        /**
         * 疑问方法
         * @param Json
         * @param type
         */
	CheckRecode.updateDoubt=function(data,thisType,index){
        var thisId="";
        var checkState="";
        for(i in data){
            if(data[i].name == "id"){
                thisId=data[i].value;
            }if(data[i].name == "checkState"){
                checkState=data[i].value;
            }
            if(!data[i] || !data[i].value) {
                delete data[i];
            }else{
                if(data[i].name=='markTime' ||
                    data[i].name=='updateTime' ||
                    data[i].name=='checkTime') {
                    //data[i].value = new Date(data[i].value);
                    delete data[i];
                }
            }
        }
        var url="";
        if(thisType=='correct')
            url="/agsupport_swj/correct-mark!updateForm.action";
        if(thisType=='lack')
            url="/agsupport_swj/lack-mark!updateForm.action";
        if(url!=""){
            $.ajax({
                type : 'post',
                url : url,
                data : data,
                dataType: 'json',
                success: function(result){
                    if(result.success){
                        doubt(thisId,checkState,thisType);
                    }else{
                        layer.msg("审核失败!",{icon: 2});
                    }
                    layer.close(index);
                },error: function(){
                    layer.msg("请求失败!",{icon: 7});
                    layer.close(index);
                }
            });
        }
	}
	return CheckRecode;
}
function initImgView(att,divId,clickId){
	var total=0,imgHtml='',img_view='';
	for(var i in att){
		var rowData=att[i];
		var timeText,imgUrl,thumPath;
		if(rowData.attTime)
			timeText = new Date(rowData.attTime).pattern("yyyy-MM-dd HH:mm:ss");
		if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
			imgUrl = rowData.attPath;
			thumPath=rowData.thumPath;
		}
		if(imgUrl && imgUrl.indexOf("8080")==-1){
			imgUrl ="http://139.159.232.250:8080"+imgUrl;
			thumPath = thumPath?"http://139.159.232.250:8080"+thumPath:imgUrl;
		}
		if(timeText && imgUrl){
			img_view+='<li class="'+clickId+'" style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
			' src="'+(thumPath?thumPath:imgUrl)+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
			total++;
		}
	}
	$(divId).append(img_view);
	//执行父页面图片预览初始化
}
//点击确认修改（pc端不允许修改）
function updateForm(){
    	layer.confirm('是否修改信息?', {icon: 3, title:'提示'}, function(index){
        var checkForm = $("#checkForm").serializeArray();
        if(checkForm){
            $.ajax({
                type : 'post',
                url:'/agsupport_swj/psh-discharger!toUpdateForm.action',
                data:checkForm,
                contentType:'application/x-www-form-urlencoded',
                dataType:'json',
                success: function(data){
                    if(data.code=='200'){
                        reloadDate(data.id);
                        layer.msg("保存成功!",{icon: 1});
                    }else{
                        layer.msg("保存失败!",{icon: 2});
                    }
                },error:function(message){
                    console.log(message.statusText);
                }
            });
        }
        parent.layer.close(index);
    });
}

//保存并审核（通过或者存疑）
function saveAndPass(state,pageState){
	if('2' == currentState && pageState!='has'){
        parent.layer.msg("当前数据已经审核通过!",{ico:5});
        return false;
    }
	alertCheck(state,pageState);   
}

//弹出数据审核填写内容的框子，后台两个动作新增审核子表 和回填上报主表状态
function alertCheck(state,pageState){
   var markid = $("#checkForm #id").val();//这个是上报表psh_discharger的id
    if(state) {
        parent.layer.open({
            type: 1,
            area: ['420px', '220px'], //宽高
            content: '<form  role="form"><div class="form-group"><label class="col-sm-2 control-label" for="reasion">审核原因:</label>' +
            '<div class="col-sm-10"><textarea class="form-control" id="reasion" rows="3"></textarea></div></div></form>',
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                layero.find('.layui-layer-btn0')[0].style.cssText="pointer-events:none;";
                layero.find('.layui-layer-btn1')[0].style.cssText="pointer-events:none;";
                var reasion = $(layero).find("#reasion").val()
                var data = {checkState:state,checkDesription:reasion,reportId:markid};
                $.ajax({
                    type : 'post',
                    url:'/agsupport_swj/psh-check-record!saveCheckInf.action',
                    data: data,
                    dataType: 'json',
                    success: function (data) {
                        if(data.code=='200'){
                        	if(pageState=='has'){
                        		parent.layer.msg("操作成功!",{icon: 1});
                        	}else{
                        		parent.layer.msg("审核成功!自动进入下一条",{icon: 1});
                        	}
                        	layero.find('.layui-layer-btn0')[0].style.cssText="pointer-events:auto;";
                            layero.find('.layui-layer-btn1')[0].style.cssText="pointer-events:auto;";
                            //reloadDate(markid);//刷新当前表单
                            downPage(pageState,markid);
                            parent.layer.close(index);
                        }else{
                            parent.layer.msg("审核失败!"+data.message,{icon: 2});
                        }
                    },error:function (message) {
                        layero.find('.layui-layer-btn0')[0].style.cssText="pointer-events:auto;";
                        layero.find('.layui-layer-btn1')[0].style.cssText="pointer-events:auto;";
                        parent.layer.msg("审核失败!"+data.message,{icon: 2});
                        console.log(message.statusText);
                    }
                });
            },btn2: function(index, layero){
                reloadDate(markid);//刷新当前表单
                parent.layer.close(index);
            }
        });
    }
}

//修改上报表中的状态（无用）
function updateSb(state){
	var title="审核通过";
	if(state=='3'){
		title="存疑"
	}
	 var checkForm = $("#checkForm").serializeArray();
     if (checkForm) {
         $.ajax({
             type: 'post',
             url: '/agsupport_swj/psh-discharger!checkDate.action?shState='+state,
             data: checkForm,
             contentType: 'application/x-www-form-urlencoded',
             dataType: 'json',
             success: function (data) {
                 if (data.code == '200') {
                 	reloadDate(data.id);
                 	layer.msg(title+"成功!",{icon: 1});
                 }else{
                     layer.msg(title+"失败!原因是"+data.message,{icon: 2});
                 }
             }, error: function (message) {
                 console.log(message.statusText);
             }
         });
     }
}

//显示当前机构的审核状态
function showCurrentState(org){
    if(org){
        this.currentOrg = org;
        if('teamCheck'==org){
            var teamCheck = $("#teamCheck").val();
            if("2"==teamCheck){
                $("#currentCheckState").html("(当前已通过)");
                $("#currentCheckState").css("color","#40d44d");
            }else if("1"==teamCheck){
                $("#currentCheckState").html("(当前未审核)");
                $("#currentCheckState").css("color","red");
            }else if("3"==teamCheck){
                $("#currentCheckState").html("(当前存疑)");
                $("#currentCheckState").css("color","#c5c52c");
            }
        }else if('parentCheck'==org){
            var parentCheck = $("#parentCheck").val();
            if("2"==parentCheck){
                $("#currentCheckState").html("(当前已通过)");
                $("#currentCheckState").css("color","#40d44d");
            }else if("1"==parentCheck){
                $("#currentCheckState").html("(当前未审核)");
                $("#currentCheckState").css("color","red");
            }else if("3"==parentCheck){
                $("#currentCheckState").html("(当前存疑)");
                $("#currentCheckState").css("color","#c5c52c");
            }
        }
    }
}
//审核完成后自动跳转父页面的下一页（如果没有父页面就会刷新表单）
function downPage(pageState,markid){
    if('no'==pageState && window.parent.noTable){
        var currentData = window.parent.getData(window.parent.noTable.getData,'down',window.parent.noTable.current.id);
        if(currentData){
            window.parent.noTable.current=currentData;
            reloadDate(currentData.id);
        }else{
            parent.layer.msg("没有下一条了!",{icon: 5});
            reloadDate(markid);
        }
    }else if('pass'==pageState && window.parent.passTable){
        var currentData = window.parent.getData(window.parent.passTable.getData,'down',window.parent.passTable.current.id);
        if(currentData){
            window.parent.passTable.current=currentData;
            reloadDate(currentData.id);
        }else{
            parent.layer.msg("没有下一条了!",{icon: 5});
            reloadDate(markid);
        }
    }else{
    	reloadDate(markid);
    }
}
//格式化营业执照、接驳意见核准书、排水许可证、排污许可证图片
function formatImage(data,idd,classs){
	var total=0,imgHtml='',img_view='';
	for(var i in data){
		var rowData=data[i];
		var timeText,imgUrl,thumPath;
		if(rowData.attTime)
			timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
		if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
			imgUrl = rowData.attPath;
			thumPath=rowData.thumPath;
		}
		if(timeText && imgUrl && thumPath){
			img_view+='<li class="'+classs+'" style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
			' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
			
			total++;
		}
	}
		
	$("#"+idd).append(img_view);
	
	//执行父页面图片预览初始化
	$("."+classs).click(function(){
		if(parent.initViewer)
			parent.initViewer($("#"+idd).parent().html(),idd);
		if(parent.parent.initViewer)
			parent.parent.initViewer($("#"+idd).parent().html(),idd);
		if(parent.viewer){
			parent.viewer.show($(this).index());
		}else if(parent.parent.viewer){
			parent.parent.viewer.show($(this).index());
		}else{
			layer.msg("未检测到图片插件!",{icon: 2});
		}
	});
}
Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}
//判断是否为数字
function checkNumber(theObj) {
	  var reg = /^[0-9]+.?[0-9]*$/;
	  if (reg.test(theObj)) {
	    return true;
	  }
	  return false;
	}
