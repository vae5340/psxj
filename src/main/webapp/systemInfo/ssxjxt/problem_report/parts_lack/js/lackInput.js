var id = getQueryStr("id");
var title = getQueryStr("title");
var type = getQueryStr("type");//修改还是查看
var url=""; 
var yjwcsj=getQueryStr("yjwcsj");//预计完成时间
var isbyself=getQueryStr("isbyself");//是否自行处理
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
	reloadCorrectMark();
	
});
//设施上报转化为问题上报
function getSssbToProblemReportDate() {
	 var data = $("#corrack").serializeArray();
	 var templateCode="GX_XCYH";
	 var jsonString = "{";
	 $.each(data, function () {
         if(this.type != 'button') {
        	 if(this.name=='addr'){ 
        		 jsonString += '"SZWZ":';
        		 jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	 }else if(this.name=='road'){
        		 jsonString += '"JDMC":';
        		 jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	 }else if(this.name=='layerName'){
		    	 jsonString += '"SSLX":';
        		 jsonString += this.value == '' ? '"",' : '"' + convertLayerNameToSslx(this.value) + '",';
        		 jsonString += '"layer_name":';
        		 jsonString += this.value == '' ? '"",' : '"' + this.value+ '",';
        	 }else if(this.name=='childCodeCode'){
	    		jsonString += '"BHLX":';
	    		jsonString += this.value == '' ? '"",' : '"' + convertChildCodeToBhlx(this.value) + '",';
        	 }else if(this.name=='description'){
	    		jsonString += '"WTMS":';
	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
	    	}else if(this.name=='id'){
	    		jsonString += '"reportId":';
	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	}else if(this.name=='x'){
        		jsonString += '"X":';
	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	}else if(this.name=='y'){
        		jsonString += '"Y":';
	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	}else if(this.name=='objectId'){
//        		jsonString += '"object_id":';
//	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	}
         }
     });
	 jsonString = jsonString + '"id":""';
	 jsonString = jsonString + ',"sfjb":"1"';
	 jsonString = jsonString + ',"reportType":"add"';
	 jsonString = jsonString + ',"JJCD":"1"';
	 jsonString = jsonString + ',"usid":""';
	 jsonString = jsonString + ',"templateCode":"' + templateCode + '"';
	 jsonString = jsonString + ',"layerurl":"http://139.159.243.230:6080/arcgis/rest/services/GZPS/ssjb_fs/FeatureServer/0"';
	 jsonString = jsonString + ',"layer_id":"0"';
	 return jsonString;
}
function convertLayerNameToSslx(val){
	if(val=='窨井'){
		return 'A174001';
	}	
	else if(val=='雨水口'){
		return 'A174002';}
		
	else if(val=='排放口'){
		return 'A174003';}
		
	else if(val=='排水管道'){
		return 'A174005';}
		
	else if(val=='排水沟渠'){
		return 'A174006';}
		
	else if(val=='其他'){
		return 'A174007';}
}
function convertChildCodeToBhlx(val2){
	var val=""+val2;
	var bhlx="";
	if(val.indexOf("A178001")!=-1){//一井多牌
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+="A175037";//多个权属单位在同一井内都挂了牌
	}
	if(val.indexOf("A178002")!=-1){//挂牌缺失、损坏
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175048,A175010";//打开井盖后发现该井没按要求挂牌，或有挂牌，但挂牌残缺，牌号部分、全部脱落，导致信息不全
	}
	if(val.indexOf("A178003")!=-1){//挂网缺失或损坏
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175038,A175039";//打开井盖后发现该井没按要求挂防坠网、或有挂网，但挂网装置、网本身已损坏，起不到防坠功能
	}
	if(val.indexOf("A178004")!=-1){//井盖打不开
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175040";//管线仍在原位，但井盖被构筑物、绿化覆盖，或常年欠修复导致打不开
	}
	if(val.indexOf("A178005")!=-1){//井盖类别错误
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175041";//各类检查井井盖上标识混乱
	}
	if(val.indexOf("A178006")!=-1){//井盖破损
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175005";//井盖磨损，破烂、严重下沉、塌陷、井盖锁破烂
	}
	if(val.indexOf("A178007")!=-1){//异物侵入
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175042";//异物进入检查井，侵占检查井空间，影响使用功能，如电缆、及其他管线、硬物等
	}
	if(val.indexOf("A178008")!=-1){//井内破损
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175047";//井内出现破裂、裂缝、破损、渗漏，井筒与井盖之间存在较大位移
	}
	if(val.indexOf("A178009")!=-1){//浮渣和沉积物
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175044";//井内有淤泥；垃圾堆积、成块结渣、砖头或施工垃圾阻水，水面堆积浮渣等
	}
	if(val.indexOf("A178010")!=-1){//水位高
		if(bhlx.indexOf("A17")!=-1){
			bhlx+=",";
		}
		bhlx+= "A175045";//井内出现不正常的高水位
	}
	return bhlx;
}
function reloadCorrectMark(){
	if(id)
		$.ajax({
			method: 'get',
			url: '/psxj/lackMark/seeLackMark?id='+id,
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
							$("#childCodeCode").val(data.form.childCode);
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
							var reportType="";
							if(data.form.isBinding == '1'){
								reportType="数据确认";
							}
							if(data.form.isBinding == '0'){
								reportType="数据新增";
							}
							$("#reportType").val(reportType);
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
	if(id){
		$.ajax({
			method: 'get',
			url: '/psxj/checkRecord/searchCheckRecord?reportType=add&reportId='+id,
			dataType:'json',
			success: function(data){
				console.log(data);
				if(data.code==200 && data.rows){
					var length = data.rows.length;
					if(length <1){
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