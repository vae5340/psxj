var id = getQueryStr("id");
var type = getQueryStr("type");//修改还是查看
var url="",viewer; 
var isQr = getQueryStr("title");//是否确认
var yjwcsj=getQueryStr("yjwcsj");//预计完成时间
var isbyself=getQueryStr("isbyself");//是否自行处理
$(function(){
	//初始化时间
	//loadTime();
	//动态是否只读
	if(type=='view'){
		$('form').find('input,textarea,select').not('button').attr('readonly',true);
		$('form').find('input,textarea,select').not('button').attr('disabled',false);
	}
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
        	}else if(this.name=='usid'){
        		jsonString += '"usid":';
	    		jsonString += this.value == '' ? '"",' : '"' + this.value + '",';
        	}
         }
     });
	 jsonString = jsonString + '"id":""';
	 jsonString = jsonString + ',"sfjb":"1"';
	 jsonString = jsonString + ',"reportType":"modify"';	 
	 jsonString = jsonString + ',"JJCD":"1"';
	 jsonString = jsonString + ',"templateCode":"' + templateCode + '"';
	 jsonString = jsonString + ',"layerurl":"http://139.159.243.230:6080/arcgis/rest/services/GZPS/ssjb_fs/FeatureServer/0"';
	 jsonString = jsonString + ',"layer_id":"0"';
	 return jsonString;
//	 var serverName="psxj";
//	 var tablename="GX_PROBLEM_REPORT";
//	 var templateId="3382";
//	 var id="";
//	 var activityName="";
//	 layer.open({
//	        type: 2,
//	        title: "问题上报",
//	        shadeClose: false,
//	        //closeBtn : [0 , true],
//	        shade: 0.5,
//	        maxmin: false, //开启最大化最小化按钮
//	        area: ['700px', '475px'],
//	        offset: ['30px', $(window).width()/2-400+'px'],
//	        content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/tabs.html?serverName="+serverName+"&templateId="+templateId+"&templateCode="+templateCode+"&tablename="+tablename+"&id="+id+"&userCode="+userCode+"&activityName="+activityName,
//	        success: function(layero, index){
//	         setTimeout(function(){//延迟一下，防止页面元素还没加载出来，就去找DOM
//	        	debugger;
//		        var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
//	       		 $.each(data, function () {
//		            if(this.type != 'button') {		               
////		                body.contents().find("#fjzd").val(this.value);
//		                if(this.name=='addr'){body.contents().find("#szwz").val(this.value);}
//		                else if(this.name=='fjzd'){body.contents().find("#fjzd").val(this.value);}
//		                else if(this.name=='addr'){body.contents().find("#szwz").val(this.value);}
//				    	else if(this.name=='x'){body.contents().find("#X").val(this.value);}
//				    	else if(this.name=='y'){body.contents().find("#Y").val(this.value);}
////				    	else if(this.name=='addr'){body.contents().find("#code").val(this.value);}
//				    	else if(this.name=='road'){body.contents().find("#jdmc").val(this.value);}
//				    	else if(this.name=='layerName'){
//				    		body.contents().find("#sslx").val(convertLayerNameToSslx(this.value));
//				    	}
//				    	else if(this.name=='childCode'){
//				    		body.contents().find("#bhlx").val(convertChildCodeToBhlx(this.value));
//				    	}
//				    	else if(this.name=='description'){body.contents().find("#wtms").val(this.value);}
////				    	else if(this.name=='addr'){body.contents().find("#yjgcl").val(this.value);}
//				    	else if(this.name=='checkDesription'){body.contents().find("#bz").val(this.value);}
//				    	else if(this.name=='layerName'){body.contents().find("#layerName").val(this.value);}
//				    	else if(this.name=='objectId'){body.contents().find("#objectId").val(this.value);}
//				    	else if(this.name=='teamOrgId'){body.contents().find("#teamOrgId").val(this.value);}
//				    	else if(this.name=='teamOrgName'){body.contents().find("#teamOrgName").val(this.value);}
//				    	else if(this.name=='directOrgId'){body.contents().find("#directOrgId").val(this.value);}
//				    	else if(this.name=='directOrgName'){body.contents().find("#directOrgName").val(this.value);}
//				    	else if(this.name=='superviseOrgId'){body.contents().find("#superviseOrgId").val(this.value);}
//				    	else if(this.name=='superviseOrgName'){body.contents().find("#superviseOrgName").val(this.value);}
//				    	else if(this.name=='parentOrgId'){body.contents().find("#parentOrgId").val(this.value);}
//				    	else if(this.name=='parentOrgName'){body.contents().find("#parentOrgName").val(this.value);}
//				    	else if(this.name=='usid'){body.contents().find("#usid").val(this.value);}
//				    	else if(this.name=='userx'){body.contents().find("#reportx").val(this.value);}
//				    	else if(this.name=='usery'){body.contents().find("#reporty").val(this.value);}
//				    	else if(this.name=='userAddr'){body.contents().find("#reportaddr").val(this.value);}
//				    	else if(this.name=='isbyself'){body.contents().find("#isbyself").val(this.value);}
//				    	else if(this.name=='addr'){body.contents().find("#sfjb").val(this.value);}
//		                body.contents().find("#layerId").val(0);
//		                body.contents().find("#jjcd").val(1);
//				    	body.contents().find("#sbsj").val(new Date());
//				    	body.contents().find("#sbr").val(userName);
//				    	body.contents().find("#layerurl").val("http://139.159.243.230:6080/arcgis/rest/services/GZPS/ssjb_fs/FeatureServer/0");
//				    	body.contents().find("#loginname").val(userCode);
//				    	body.contents().find("#yjwcsj").val(yjwcsj);
//				    	body.contents().find("#sfjb").val(1);
//				    	
//				    	window.attachEvent("onload", setfile);       
//				    	var WshShell=new ActiveXObject("WScript.Shell");       
//				    	function setfile(){        
//				    	    setTimeout('body.contents().find("#uploadfile").focus();WshShell.sendKeys("C:/Users/Administrator/Desktop/fw.png");',20);          
//				    	}     
//				    }
//		        });
//        		
//	       	 }, 3000);    
//              
//	        },
//	        end : function(){
//	            loadData(10,1);
//	            var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
//	            if(rowData.length>0){
//	                LoadDetailData(rowData[0]);
//	            }
//	        }
//	 });
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
function getOldCorrectMark(type,usid,layerUrl){
	typeName = type;
	if("qr" == isQr){
		if(typeName && typeName.indexOf('窨井') != -1){
			layerId=5;
		}else if(typeName && typeName.indexOf('雨水口') != -1){
			layerId=4;
		}else if(typeName && typeName.indexOf('排放口') != -1){
			layerId=2;
		}
		parent.parent.openQueryslayerId(usid,layerId,queryResultLayer);
	}else{
		parent.parent.openQuerysUsid(usid,layerUrl,queryResultLayer);
	}
}
//取图层信息
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
//取属性表信息
function updateLableName(typeName){
	if(typeName && typeName.indexOf('窨井') != -1){
		$("#old_attrTwo").html("设施位置");
		$("#old_attrThree").html("所在道路");
		$("#old_attrFour").html("窨井类型");
		$("#old_attrFive").html("雨污类别");
		$("#old_attrSix").html("井盖材质");
		$("#old_attrSeven").html("权属单位");
	}else if(typeName && typeName.indexOf('雨水口') != -1){
		$("#old_attrTwo").html("设施位置");
		$("#old_attrThree").html("所在道路");
		$("#old_attrFour").html("特征");
		$("#old_attrFive").html("形式");
		$("#old_attrSeven").html("权属单位");
	}else if(typeName && typeName.indexOf('排放口') != -1){
		$("#old_attrTwo").html("设施位置");
		$("#old_attrThree").html("所在道路");
		$("#old_attrFour").html("排放去向");
		$("#old_attrFive").html("雨污类别");
		$("#old_attrSeven").html("权属单位");
	}
	$(".form-group.old").each(function(index,item){
		if($(item).css("display") == 'none'){
			$(item).show();
		}
	});
	if(typeName && typeName.indexOf('窨井') != -1){
		$("#oldOne").parent().hide();
		$("#originAttrFive").parent().parent().hide();
	}else if(typeName && typeName.indexOf('雨水口') != -1){
		$("#oldOne").parent().hide();
		$("#originAttrThree").parent().parent().hide();
		$("#originAttrFive").parent().parent().hide();
	}else if(typeName && typeName.indexOf('排放口') != -1){
		$("#oldOne").parent().hide();
		$("#originAttrThree").parent().parent().hide();
		$("#originAttrFive").parent().parent().hide();
	}
	lightInput();
}


function reloadCorrectMark(){
	if(id){
		$.ajax({
			method: 'get',
			url: '/psxj/correctMark/seeCorrectMark?id='+id,
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.form){
					var typeName = data.form.layerName;
					$("#newlab").html("("+typeName+")");
					$("#oldlab").html("("+typeName+")");
					for(var i in data.form){
						if(i=='markTime' && data.form[i]){
							$("#markTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='updateTime' && data.form[i]){
							$("#updateTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='checkTime' && data.form[i]){
							$("#checkTime").val(new Date(data.form[i].time).pattern("yyyy-MM-dd HH:mm:ss"));
						}else if(i=='pcode'){
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
						}else if(i=='childCode'){
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
						}else if(i=='checkState'){
							var checkStateView="";
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
//									if(data.form.correctType && data.form.correctType.indexOf('信息错误')!=-1)
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
					//getOldCorrectMark(typeName,data.form.usid,data.form.layerUrl);//加载原始数据
					updateLableName(typeName);//加载原始数据
				}
				var total=0,imgHtml='',img_view='';
				if(data.code==200 && data.rows && data.rows.length){
					for(var i in data.rows){
						var rowData=data.rows[i];
						var timeText,imgUrl,thumPath;
						if(rowData.attTime)
							timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
						if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
							imgUrl = rowData.attPath;
							thumPath = rowData.thumPath;
						}
						var requestUrl="http://139.159.243.185:8080";
						if(timeText && imgUrl && thumPath){
							img_view+='<li class="img-view" style="width:88px;">'+""+'<img data-original='+imgUrl+'"' +
									' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
							total++;
						}
					}//style="width:88px;
					if(imgHtml != ''){
						//imgHtml+='</div>';
					}
				}else{
					//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
					img_view+='暂无照片';
				}
				$("#img-view").append(img_view);
			
				//执行父页面图片预览初始化
				$(".img-view").click(function(){
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
}
//初始化时间
function loadTime(){
	$("#markTime").datetimepicker({
		language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd hh:ii:ss'
  	});
	$("#updateTime").datetimepicker({
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd hh:ii:ss'
	});
	$("#checkTime").datetimepicker({
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd hh:ii:ss'
	});
	$(".form_datetime").datetimepicker({
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd hh:ii:ss'
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


// 审核记录
function checkRecord(){
	var reportType ="modify";
	if("qr" == isQr){
		reportType ="confirm";
	}
	if(id){
		$.ajax({
			method: 'get',
			url: '/psxj/checkRecord/searchCheckRecord?reportType='+reportType+'&reportId='+id,
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
