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
		$('form').find('input,textarea,select').not('button').attr('readonly',true);
		$('form').find('input,textarea,select').not('button').attr('disabled',false);
	}
	//初始化时间
	//loadTime();
	//填充数据
	reloadCorrectMark();
	
	$("#corrack input ").change(function(){
		var lableName=this.parentElement.parentElement.firstElementChild.innerText;
		lightBlurInput(lableName,this.id,this.value);
	});
	$("#corrack textarea").blur(function(){
		var lableName=this.parentElement.parentElement.firstElementChild.innerText;
		lightBlurInput(lableName,this.id,this.value);
	});
	
});

//修改高亮
function lightBlurInput(lableName,id,value){
	$("#oldForm .form-control").each(function(oldindex,item){
		var lsName = item.parentElement.parentElement.firstElementChild.innerText;
		if(lsName && lsName.indexOf(lableName)!=-1){
			if(value && value.trim() != item.value.trim()){
				$("#"+id).css('background-color', '#fdfd4f');
			}else{
				$("#"+id).css('background-color', '#FFFFFF');
			}
		}
	});
}
//加载高亮
function lightInput(){
	$("#corrack .form-control").each(function(newindex,newitem){
		var lableName = newitem.parentElement.parentElement.firstElementChild.innerText;
		$("#oldForm .form-control").each(function(oldindex,item){
			var lsName = item.parentElement.parentElement.firstElementChild.innerText;
			if(lsName && lsName.indexOf(lableName)!=-1 && newitem.value.trim() != item.value.trim()){
				newitem.style.backgroundColor="#fdfd4f";
			}else{
				//newitem.style.borderColor="#e0d9d9";
			}
		});
	});
}

var typeName="";
function getOldCorrectMark(type,usid,layerId){
	typeName = type;
	if(typeName && typeName.indexOf('窨井') != -1){
		layerId=5;
	}else if(typeName && typeName.indexOf('雨水口') != -1){
		layerId=4;
	}else if(typeName && typeName.indexOf('排放口') != -1){
		layerId=2;
	}
	parent.parent.openQueryslayerId(usid,layerId,queryResultLayer);
}
function queryResultLayer(result){
	console.log(result);
	if(result && result.features && result.features["0"].attributes){
		var data = result.features["0"].attributes;
		if(typeName && typeName.indexOf('窨井') != -1){
//			$("#old_attrOne").html("设施类型");
//			$("#oldOne").val(data.SUBTYPE);
			$("#old_attrTwo").html("设施位置");
			$("#oldTwo").val(data.ADDR);
			$("#old_attrThree").html("所在道路");
			$("#oldThree").val(data.LANE_WAY);
			$("#old_attrFive").html("雨污类别");
			$("#oldFive").val(data.SORT);
			$("#old_attrSix").html("井盖材质");
			$("#oldSix").val(data.COVER_MATE);
			$("#old_attrSeven").html("权属单位");
			$("#oldSeven").val(data.OWNERDEPT);
			//$("#old_attrEight").html("已挂牌编号");
			//$("#oldEight").val(data.License);
		}else if(typeName && typeName.indexOf('雨水口') != -1){
			$("#old_attrTwo").html("设施位置");
			$("#oldTwo").val(data.ADDR);
			$("#old_attrThree").html("所在道路");
			$("#oldThree").val(data.LANE_WAY);
			$("#old_attrFour").html("特征");
			$("#oldFour").val(data.FEATURE);
			$("#old_attrFive").html("形式");
			$("#oldFive").val(data.STYLE);
			$("#old_attrSeven").html("权属单位");
			$("#oldSeven").val(data.OWNERDEPT);
		}else if(typeName && typeName.indexOf('排放口') != -1){
			$("#old_attrTwo").html("设施位置");
			$("#oldTwo").val(data.ADDR);
			$("#old_attrThree").html("所在道路");
			$("#oldThree").val(data.LANE_WAY);
			$("#old_attrFour").html("排放去向");
			$("#oldFour").val(data.RIVER);
			$("#old_attrFive").html("雨污类别");
			$("#oldFive").val(data.STYLE);
			$("#old_attrSeven").html("权属单位");
			$("#oldSeven").val(data.OWNERDEPT);
/*			
			$("#old_attrOne").html("排水去向");
			$("#oldOne").val(data.RIVER);
			$("#old_attrTwo").html("雨污类别");
			$("#oldTwo").val(data.SORT);
			$("#old_attrThree").html("权属单位");
			$("#oldThree").val(data.OWNERDEPT);
			$("#old_attrFive").html("设施位置");
			$("#oldFive").val(data.LANE_WAY);*/
		}
		$(".form-group.old").each(function(index,item){
			if($(item).css("display") == 'none'){
				$(item).show();
			}
		});
		if(typeName && typeName.indexOf('窨井') != -1){
			$("#oldOne").parent().hide();
			$("#oldFour").parent().hide();
			$("#oldEight").parent().parent().hide();
		}else if(typeName && typeName.indexOf('雨水口') != -1){
			$("#oldOne").parent().hide();
			$("#oldSix").parent().parent().hide();
			$("#oldEight").parent().parent().hide();
		}else if(typeName && typeName.indexOf('排放口') != -1){
			$("#oldOne").parent().hide();
			$("#oldSix").parent().parent().hide();
			$("#oldEight").parent().parent().hide();
		}
	}
	lightInput();
}

function reloadCorrectMark(){
	if(id)
		$.ajax({
			method: 'get',
//			url: '/psxj/lack-mark!seeLackMark.action?id='+id,
			url: '/psxj/correctMark/seeCorrectMark?id='+id,
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.form){
					var typeName = data.form.layerName;
					$("#newlab").html("("+typeName+")");
					$("#oldlab").html("("+typeName+")");
					for(var i in data.form){
						if(i=='markTime' && data.form[i]){
							$("#markTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='updateTime' && data.form[i]){
							$("#updateTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='checkTime' && data.form[i]){
							$("#checkTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(i=='reportType'){
							var reportType=""
							if(data.form.reportType == 'confirm'){
								reportType="数据确认";
							}
							$("#checkState").val(data.form.checkState);
							$("#reportType").val(reportType);
						}else if(i=='checkState'){
							var checkStateView=""
								if(data.form.checkState == '1'){
									checkStateView="未审核";
								}else{
									$("#shDiv").show();
									checkStateView="已审核";
								}
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
//								$("#attr_attrTwo").html("雨水篦类型");
								$("#attr_attrThree").html("形式");
								$("#attr_attrFour").html("权属单位");
							}else if(typeName && typeName.indexOf('排放口') != -1){
								$("#attr_attrOne").html("排放去向");
								$("#attr_attrTwo").html("雨污类别");
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
					if(typeName && typeName.indexOf('雨水口') != -1){
						$("#attrTwo").parent().parent().hide();
					}else if(typeName && typeName.indexOf('排放口') != -1){
						$("#attrFour").parent().parent().hide();
					}
					getOldCorrectMark(typeName,data.form.usid,data.form.layerId);//加载原始数据
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
							img_view+='<li style="width:88px;">'+("")+'<img data-original="'+imgUrl +'"'+
							' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
							
							total++;
						}
					}
					//$("#lack-img").append(imgHtml);
					
				}else{
					//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
					img_view+='暂无照片';
				}
				//$("#lack-img").append(imgHtml);
				$("#img-view").append(img_view);
				$("#img-view").viewer({ url: 'data-original'});//加载图片完调用viewer图片插件
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
