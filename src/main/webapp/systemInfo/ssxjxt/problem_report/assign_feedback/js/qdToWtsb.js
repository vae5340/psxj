var objectId = getQueryStr("objectId");
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
		$('form').find('input,textarea,select').not('button').attr('readonly',true);
		$('form').find('input,textarea,select').not('button').attr('disabled',false);
	}
	//初始化时间
	//loadTime();
	//填充数据
	reloadSb();
	
});
function reloadSb(){
	if(objectId)
		$.ajax({
			method: 'get',
			url: '/psxj/swj-assignlist!getByObjectId.action?objectId='+objectId,
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.form){
					var typeName = data.form.layerName;
					$("#newlab").html("("+typeName+")");
					for(var i in data.form){
						if(i=='markTime' && data.form[i]){
							$("#markTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='updateTime' && data.form[i]){
							$("#updateTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='checkTime' && data.form[i]){
							$("#checkTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='pcode'){  //问题类型大类
							var initPcode=function(codeData,form){
								var pcode = "";
								for(i in codeData){
									var code = codeData[i].code;
									var name = codeData[i].name;
									var pcodeString=form;
									if(code!=undefined && pcodeString.indexOf(code)!=-1){
										pcode+= pcode==""?name:","+name;
									}
								}
								$("#pcode").val(pcode);
							}
							if(parent.awater) initPcode(parent.awater.code.pcode,data.form[i]);
							else if(parent.parent.awater) initPcode(parent.parent.awater.code.pcode,data.form[i]);
						}else if(i=='childCode'){// 问题类型子类
							var initChildCode=function(childData,form){
								var childCode = "";
								for(i in childData){
									var code = childData[i].code;
									var name = childData[i].name;
									var childCodeString = form;
									if(code!=undefined && childCodeString.indexOf(code)!=-1){
										childCode+=childCode==""?name:","+name;
									}
								}
								$("#childCode").val(childCode);
							}
							if(parent.awater) initChildCode(parent.awater.code.childCode,data.form[i]);
							else if(parent.parent.awater) initChildCode(parent.parent.awater.code.childCode,data.form[i]);
						}else if(i=='isBinding'){
//							var reportType="";
//							if(data.form.isBinding == '1'){
//								reportType="数据确认";
//							}
//							if(data.form.isBinding == '0'){
//								reportType="数据新增";
//							}
//							$("#reportType").val(reportType);
						}else if(i=='checkState'){
							var checkStateView=""
							var state = data.form.checkState;
							if(state == '1'){
								checkStateView="未审核";
							}else if(!state){
								checkStateView="未同步";
							}else{
								$("#shDiv").show();
								if(state == "2")
									checkStateView="已审核";
								if(state == "3")
									checkStateView="存在疑问";
							}
							$("#checkState").val(state);
								$("#checkStateView").val(checkStateView);
							}else{
							$("#"+i).val(data.form[i]);
							if(typeName && typeName.indexOf('窨井') != -1){
								$("#attr_attrOne").html("窨井类型");
								$("#attr_attrTwo").html("雨污类别");
								$("#attr_attrThree").html("井盖材质");
								$("#attr_attrFour").html("权属单位");
								$("#attrFive").parent().parent().show();
							}else if(typeName && typeName.indexOf('雨水口') != -1){
								$("#attr_attrOne").html("特征");
								$("#attr_attrTwo").html("雨水篦类型");
								$("#attr_attrThree").html("形式");
								$("#attr_attrFour").html("权属单位");
							}else if(typeName && typeName.indexOf('排放口') != -1){
								$("#attr_attrOne").html("排放去向");
								$("#attr_attrTwo").html("类别");
								$("#attr_attrThree").html("权属单位");
								$("#attr_attrFour").hide();
								$("#attrFour_div").hide();
							}
							$(".form-group.attr").each(function(index,item){
								if($(item).css("display") == 'none'){
									$(item).show();
								}
							});
						}
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
	var id= $("#markId").val();
	if(id){
		var reportType= $("#reportType").val();
		$.ajax({
			method: 'get',
			url: '/psxj/check-record!searchCheckRecord.action?reportType='+reportType+'&reportId='+id,
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