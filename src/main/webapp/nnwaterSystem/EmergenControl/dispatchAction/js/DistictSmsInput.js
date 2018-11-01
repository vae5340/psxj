var global;
var messageContent;
var newTime=new Date(); //当前时间
//短信内容加载
		function searchArea(){
		
		$("#templatems").change(function(){
			$("#test").hide();
			//$("#templateAlarm").hide();
			$("#smsId").html("");
			$("#variabl").html("");
			$("#variabl_bt").html("");
			var dataparam = {alarmType:$("#templatems").val(),};
			$.ajax({
				type: 'post',
				url : '/agsupport/ya-temlate-sms!getAlarmTypeSms.action',
				data:dataparam,
				dataType : 'json',
				success : function(data){
					$.each(eval(data.rows), function(){
						$("#templateSmsId").val(this.ID);
						$("#smsId").html(this.TEMPLATE_CONTET);
						messageContent=this.TEMPLATE_CONTET;
					});
					var smsVal = $("#smsId").val();
					if(smsVal){
						var varia = $("#variabl");
						var r= /\{(.+?)\}/g;
						var res = smsVal.match(r);
						global=res;
							var stt='<label class="col-sm-2 control-label">输入值<font color="red">*</font></label><div class="col-sm-10">';
							for(key in res){
								var val=res[key].split('{')[1].split('}')[0];
								switch(val){
									case 'time' :
										stt+='<div class="col-sm-3"><b>启动时间</b>'
										+'<input readonly="readonly" class="form-control" type="text" id="sms_'+val+'" value="'+newTime.FormatNew("yyyy年MM月dd日hh时mm分")+'"/></div>';
										break;
									case 'alarmTime' :
										stt+='<div class="col-sm-3"><b>气象发布时间</b>'+'<input class="form-control" type="text" id="sms_'+val+'"/></div>'; 
										break;
									default :
										if(val.indexOf('grade')>-1)
											stt+='<div class="col-sm-2"><b>预警等级</b><select class="form-control" id="sms_'+val+key+'">'
											+'<option>Ⅳ</option>'
											+'<option>Ⅲ</option>'
											+'<option>Ⅱ</option>'
											+'<option>Ⅰ</option>'
											+'</select></div>';
										else if(val.indexOf('alarm')>-1)
											stt+='<div class="col-sm-2"><b>预警信号</b><input class="form-control" type="text" id="sms_'+val+key+'"/></div>';
										else
											stt+='<div class="col-sm-2"><b>'+res[key]+'</b><input class="form-control" type="text" id="sms_'+val+key+'"/></div>';
										break;
								}
							}
							varia.html(stt+'<div class="col-sm-2" style="height:40px;padding-top:20px;">'
								+'<button type="button" onclick="btn_sub();" class="btn btn-primary">生成内容</button></div>');
							$("#variabl_bt").html('<label class="col-sm-2 control-label ">发送内容<font color="red">*</font></label><div class="col-sm-9">'
							+'<textarea id="smsContent" class="form-control" rows="4" readonly="readonly"></textarea></div>');
					}
					alarmDate();	
				},error : {
				}
			});
		});
	}
	 	//数据填充
		function getQueryStr(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = decodeURI(window.location.search).substr(1).match(reg);
			if (r != null) 
				return unescape(r[2]);
			return "";
		}
	    var id=getQueryStr("id");
	   
	    var setting = {
			check: {
				enable: true,
				chkStyle : "checkbox",
				chkboxType: { "Y": "s", "N": "s" },
			},
			data: {
				key: {
					name: "orgName"
				},
				simpleData: {
					enable: true,
					idKey: "orgId",
					pIdKey: "parentOrgId",
					rootPId: 0
				}
			}
		};
	    $(function(){
	    	// 加载下拉框
	    	searchArea();
			//searchSms();
			ajaxJsonTemplate();
			$(window).load(function(){
				$("#content").mCustomScrollbar();
			});
			
	    });
	    
	    function ajaxJsonTemplate(){
	    	if(id==""){
		    	$.ajax({
					method : 'GET',
					url : '/agsupport/ya-template-city!inputJson.action',
					async : true,
					dataType : 'json',
					success : function(data) {
					    var dictionary=data.Dict;
						for (itemname in dictionary){
							for (num in dictionary[itemname]){
								$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
							}
						}
						var smsList = data.Tbmap["smsList"];
						$("<option id='test'/>").text("").appendTo("#templatems");
						for(sms in smsList){
							if(smsList[sms].itemCode > 10)
								$("<option/>").val(smsList[sms].itemCode).text(smsList[sms].itemName).appendTo("#templatems");
						}
						var orgTree = data.Tbmap["orgTable"];
						$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
					},
					error : function() {
						alert('error');
					}
				});
		    }
	    }
		function getStrParamByArray(array){
			var param="";
			for (pitem in array){
				if(param!=""){
					if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
						param+="&"+array[pitem].name+"="+getTimeLong(array[pitem].value);
					} else
						param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
				}
				else{
					if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
						param=array[pitem].name+"="+getTimeLong(array[pitem].value);
					} else
						param=array[pitem].name+"="+encodeURIComponent(array[pitem].value);
				}
			}
			
			//添加机构树状参数
			var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver"),
            nodes=treeObj.getCheckedNodes(true),
            checkIds="";
            for(var i=0;i<nodes.length;i++){
            	if(checkIds=="")
            		checkIds=nodes[i].orgId;
            	else
            		checkIds+= ","+nodes[i].orgId;
            }
            param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
            
			return param;
		}
		//关闭
		function cancel() {
			parent.layer.close(parent.layer.getFrameIndex(window.name));
		}
		
		function save(){
			var ids=getStrParamByArray($("#templateSmsReceiver").serializeArray());
			var chIds =  decodeURIComponent(ids.split('=')[1]);
			var smsContents=$("#smsContent").val();
			if(!smsContents){
				parent.layer.msg("发送内容不能为空！");
			}else if(!chIds){
				parent.layer.msg("发送人员不能为空！");
			}else
				var ttue = confirmAct();
				if(ttue){
					//var option = $("#grade option:selected"); //当前应急选择项的文本 option.text(),
					var dataparam={
						smsId : $("#templateSmsId").val(),
						receivePerson : chIds,
						remark : $("#smsContent").val(),
						alarmType : 5
					}
					$.ajax({
						type: 'post',
						url : '/agsupport/yj-sms-record!saveSmsJson.action',
						data:dataparam,
						dataType : 'json',  
						success : function(data) {
							parent.layer.msg(data.result);
							var index = parent.layer.getFrameIndex(window.name);
							parent.refreshTable();
							cancel();
						},
						error : function() {
							parent.layer.msg('error');
						}
					});
				}
		}
		//生成短信内容框
		function btn_sub(){
			var smsContent=messageContent;
			//发布时间
			var alTime=$("#sms_alarmTime").val();
			var alArr=alTime.replace(' ','-').split('-');
			var year=alArr[0];var month=alArr[1]; var dat=alArr[2]; var hours=alArr[3]; var mills=alArr[4];
			var alNowTime=year+'年'+month+'月'+dat+'日'+hours+'时'+mills+'分';
			for(key in global){
				var vvl=global[key].split('{')[1].split('}')[0];
				if(global[key].indexOf('{time}')>-1){
					smsContent=smsContent.replace('$'+global[key],newTime.FormatNew("yyyy年MM月dd日hh时mm分"));
				}else if(global[key].indexOf('{alarmTime}')>-1)
					smsContent=smsContent.replace('$'+global[key],alNowTime);
				else
					smsContent=smsContent.replace('$'+global[key],$("#sms_"+vvl+key).val());
			}
			$("#smsContent").html(smsContent);
		}
		//确认框
		function confirmAct() { 
		   if(confirm('确定要发送吗?')) { 
		       return true; 
		   } 
		   return false; 
		} 
		function alarmDate(){
			$("#sms_alarmTime").datetimepicker({
	        	language: 'zh-CN',
    			format: 'yyyy-mm-dd hh-ii',
    			autoclose:true,
    			pickerPosition:'bottom-right'
    		});
		}
		