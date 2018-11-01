var id = getQueryStr("id");
var name = getQueryStr("name");
var type = getQueryStr("type");//修改还是查看
var orgName = getQueryStr("orgName");//修改还是查看
$(function(){
	initComponentType(orgName);
	reloadData();
});
function reloadData(){
	if(id && id != 'null'){
		$("#id").val(id);
	}
	if(name && name != 'null'){
		$("#assignName").val(name);
	}
}

function initComponentType(orgName){
	$.ajax({
        type:'post',
        url:'/psxj/asi/municipalBuild/facilityLayout/metacodeitem!getItemList.action',
        data:{},
        dataType:'json',
        success:function(result){
        	if(result){
        		for(var i in result.yzdw){
        			item = result.yzdw[i];
        			if(item.orgName.indexOf(orgName) >= 0){
        				$("#parentOrgName").append("<option selected = \"selected\"  value='"+item.orgName+"'>"+item.orgName+"</option>");
        			}else{
        				$("#parentOrgName").append("<option value='"+item.orgName+"'>"+item.orgName+"</option>");
        			}
        		}
        	}
        }
    });
}

function save(array,index){
	debugger;
	var assignName =$("#assignName").val();
	var parentOrgName =$("#parentOrgName").val();
	if(assignName == ""){
		layer.alert("请先填写交办清单名称！");  
		return;
	}
	if(parentOrgName == ""){
		layer.alert("请先选择交办单位！");  
		return;
	}
//	var data = $("#myform").serializeArray();
	var data = {
			"assdataList" : JSON.stringify(array),
			"assignName":assignName,
            "parentOrgName":parentOrgName,
            "id":$("#id").val()
   };
	layer.load(2);
	$.ajax({
    	type: "post",
        data: data,
        dataType: "json",
        url: "/psxj/swj-assign!save.action",
        async: false,
        success: function (result) {
            if (result.sucess) {
			     parent.layer.close(index);
	             parent.refreshSave();
            }else{
            	parent.layer.msg('保存失败！', {
                    icon: 2,
                    time: 2000
                });
            }
        }   
    })
}

