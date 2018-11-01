$(function(){
	var id = GetQueryString("id");
	//console.log(id)
	//如果地址中包含id，则是修改数据
	if(id != null){
		$.ajax({
			url: '/agsupport/sz-facilities!getListById.action?id=' + id,
			dataType: 'json',
			success: function(res){
				console.log(res);
				var r = res.rows;
				//id
				$("#id").val(r.id);
				//道路名称
				if(r.faclitiesName != "" && r.faclitiesName != null){
					$("#faclitiesName").val(r.faclitiesName);
				}
				//道路类型
				if(r.faclitiesType != "" && r.faclitiesType != null){
					$("#faclitiesType option[value='" + r.faclitiesType + "']").attr("selected",true);
				}
				//道路总长度
				if(r.totallength != null){
					$("#totallength").val(r.totallength);
				}
				//道路路幅红线宽度
				if(r.redlinewidth != null){
					$("#redlinewidth").val(r.redlinewidth);
				}
				//道路总面积
				if(r.totalarea != null){
					$("#totalarea").val(r.totalarea);
				}
				//车行道宽度
				if(r.roadwaywidth != null){
					$("#roadwaywidth").val(r.roadwaywidth);
				}
				//车行道面积
				if(r.roadwayarea != null){
					$("#roadwayarea").val(r.roadwayarea);
				}
				//车行道水泥砼面积
				if(r.roadwaysubarea1 != null){
					$("#roadwaysubarea1").val(r.roadwaysubarea1);
				}
				//车行道沥青砼面积
				if(r.roadwaysubarea2 != null){
					$("#roadwaysubarea2").val(r.roadwaysubarea2);
				}
				//车行道改性沥青砼面积
				if(r.roadwaysubarea3 != null){
					$("#roadwaysubarea3").val(r.roadwaysubarea3);
				}
				//分隔带宽度
				if(r.dividingstripwidth != null){
					$("#dividingstripwidth").val(r.dividingstripwidth);
				}
				//分隔带面积
				if(r.dividingstrip != null){
					$("#dividingstrip").val(r.dividingstrip);
				}
				//土路肩/人行道宽度
				if(r.footwalkwidth != null){
					$("#footwalkwidth").val(r.footwalkwidth);
				}
				//土路肩/人行道面积
				if(r.footwalkarea != null){
					$("#footwalkarea").val(r.footwalkarea);
				}
				//浆砌片石排水沟长度
				if(r.stormsewerlength != null){
					$("#stormsewerlength").val(r.stormsewerlength);
				}
				//浆砌片石排水沟检查井
				if(r.checkwell != null){
					$("#checkwell").val(r.checkwell);
				}
				//浆砌片石排水沟雨水井
				if(r.storminlet != null){
					$("#storminlet").val(r.storminlet);
				}
				//桥涵
				if(r.bridgeculvert != null){
					$("#bridgeculvert").val(r.bridgeculvert);
				}
			    //铁路立交桥
				if(r.railwayoverpass != null){
					$("#railwayoverpass").val(r.railwayoverpass);
				}
				//竣工日期
				if(r.completiondate != null){
					$("#completiondate").val(getLocalTime(r.completiondate.time));
				}
				//接受日期
				if(r.receiveddate != null){
					$("#receiveddate").val(getLocalTime(r.receiveddate.time));
				}
				//解除质保责任日期
				if(r.releaseliabilitydate != null){
					$("#releaseliabilitydate").val(getLocalTime(r.releaseliabilitydate.time));
				}
				//备注
				$("#remark").val(r.remark);
			},
			error: function(XHR, error, errorThrown){
				console.log("读取错误：" + error)
			}
		})
	}
	
	$(window).load(function () {
		$("#content").mCustomScrollbar();				
	});
})

//下拉列表从数据字典里获取
function getAllDic(){
	
}
//submit，先验证
function addFacilitiesFunction(){
	//验证
	if($("#faclitiesName").val() == ""){
		layer.msg("请输入道路名称",{icon:2});
		return;
	}
	if($("#faclitiesType").val() == -1){
		layer.msg("请选择道路类型",{icon:2});
		return;
	}
	
	//上传
	$("#facilitiesForm").ajaxSubmit({
		url: '/agsupport/sz-facilities!saveFac.action',
		type: 'post',
		success: function(res){
			parent.location.reload();
		},
		error: function(XHR, error, errorThrown){
			alert(error);
		}
	})
}
//关闭按钮
function closeWindow(){
   	parent.layer.close(parent.layer.getFrameIndex(window.name));
	parent.location.reload();
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}