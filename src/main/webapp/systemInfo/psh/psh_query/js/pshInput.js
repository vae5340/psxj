var id = getQueryStr("id");
var title = getQueryStr("title");
var type = getQueryStr("type");//修改还是查看
var url=""; 
$(function(){
	//动态标题
	if(title=='qr'){
		$("#thisTitle").html("确认信息");
	}
	//动态是否只读
	if(type=='view'){
		$('form').find('input,textarea,select,radio').not('button').attr('readonly',true);
		//$('form').find('input,textarea,select,radio').not('button').attr('disabled',false);
	}
	//初始化时间
	//loadTime();
	//填充数据
	reloadData();
	
});
//格式化排水存在的问题
function formatDrainPro(drainPro){
	if(drainPro==null) return '';
	drainPro=drainPro.replace(/##/g, '#').replace(/##/g, '#');
	if(drainPro.length>1){
		if(drainPro.charAt(drainPro.length-1)=='#'){
			drainPro=drainPro.substring(0,drainPro.length-1);
		}
	}
	if(drainPro.length>0){
		if(drainPro.charAt(0)=='#'){
			drainPro=drainPro.replace(/#/, '');
		}
	}
	drainPro=drainPro.replace(/#/g, '、');
	return drainPro;
}
function reloadData(){
	if(id)
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/psh-discharger!seePsh.action?id='+id,
			dataType:'json',
			success: function(data){
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
							html+='<div class="form-group"><label class="col-sm-2 control-label">管类别</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.pipeType+'" readonly="readonly"/>'+
							'</div></div>';
							//所连接驳井
							if(well.wellId==null || well.wellId==''){
								html+='<div class="form-group"><label class="col-sm-2 control-label">所连接驳井</label>'+
								'<div class="col-sm-10"><input type="text" class="form-control"  value="窨井()" readonly="readonly"/>'+
								'</div></div>';
							}else{
								html+='<div class="form-group"><label class="col-sm-2 control-label">所连接驳井</label>'+
								'<div class="col-sm-8"><input type="text" class="form-control"  value="'+'窨井('+well.wellId+')'+'" readonly="readonly"/>'+
								'</div>'+
								'<div class="col-sm-2" style="text-align: right;"><button type="button" class="btn btn-primary" onclick="position('+well.wellId+');">定位</button></div>'+
								'</div>';
							}
							html+='<div class="form-group"><label class="col-sm-2 control-label">井类别</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellType+'" readonly="readonly"/>'+
							'</div></div>';
							html+='<div class="form-group"><label class="col-sm-2 control-label">井存在的问题</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellPro+'" readonly="readonly"/>'+
							'</div></div>';
							html+='<div class="form-group"><label class="col-sm-2 control-label">排水去向</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+well.wellDir+'" readonly="readonly"/>'+
							'</div></div>';
							html+='<div class="form-group"><label class="col-sm-2 control-label">排水存在的问题</label>'+
							'<div class="col-sm-10"><input type="text" class="form-control"  value="'+formatDrainPro(well.drainPro)+'" readonly="readonly"/>'+
							'</div></div>';
							htmls+=html+'<hr style="height:1px;border:none;border-top:1px solid #555555;" />';
						}
						$("#jbqkForm").html(htmls);
					}else{
						$("#jbqkForm").html('<div class="form-group"><label style="text-align: center;" class="col-sm-12 control-label">暂无数据</label></div>');
					}
				}
				//排水户
				if(data.code==200 && data.form){
					//var typeName = data.form.layerName;
					//$("#newlab").html("("+typeName+")");
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
							if(state == '1'){
								checkStateView="未审核";
							}else{
								$("#shDiv").show();
								if(state == "2")
									checkStateView="审核通过";
								if(state == "3")
									checkStateView="存在疑问";
							}
							//$("#checkState").val(state);
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
			},error:function(){ }
		});
	
}

//初始化时间
function loadTime(){
	/*$("#markTime").datetimepicker({
		language:  'zh-CN',
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
  	});*/
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


// 审核记录
function checkRecord(){
	if(id){
		$.ajax({
			method: 'get',
			url: '/agsupport_swj/check-record!searchCheckRecord.action?reportType=add&reportId='+id,
			dataType:'json',
			success: function(data){
				console.log(data);
				if(data.code==200 && data.rows){
					var length = data.rows.length;
					if(length <2){
						parent.layer.alert("没有历史审核意见！");
						return ;
					}
					$("#sendForm").html("");
					var HtmlText = [];
				   HtmlText.push('<table class="table"> <thead>');
				   HtmlText.push('<tr> <th width=15%>审核人</th><th width=15%>审核时间</th><th width=14%>审核状态</th><th width=56%>审核意见</th></tr> ');
				   HtmlText.push('</thead><tbody>');
					for(var i in data.rows){
						var d=data.rows[i].checkTime;
						var t =d.time;
						var newDate = new Date();
						newDate.setTime(t);
						var formatDate = newDate.format('yyyy-MM-dd h:m:s');
						var checkState = data.rows[i].checkState;
						var checkStateView = "";
						if(checkState == 2){
							checkStateView = "审核通过";
						}else if(checkState == 3){
							checkStateView = "存在疑问";
						}
						HtmlText.push('<tr> <td>'+data.rows[i].checkPerson+'</td><td class="form_datetime">'+formatDate +'</td><td>'+checkStateView+'</td><td>'+data.rows[i].checkDesription+'</td></tr>');
					}
					HtmlText.push('</tbody></table>');
					 $("#sendForm").html(HtmlText.join(""));
					$("#sendModal").modal();
				}else{
					parent.layer.alert("没有历史审核意见！");
				}
				
			},error:function(){ }
		});
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
//接驳井定位
function position(objectId){
	toMap();
	window.parent.parent.positionObjId(objectId);
}
//跳回到map地图
function toMap(){
	var aTab = parent.parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}