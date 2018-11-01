define(['jquery','dateUtil','awaterui','layer','zTree','mousewheel','customScrollbar','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,dateUtil,awaterui,layer){
    var id,template_id,yaCityId,districtUnitId,pIndex;
    
    function init(_id,_template_id,_yaCityId,_districtUnitId,index){
        id=_id;
        template_id=_template_id;
        yaCityId=_yaCityId;
        districtUnitId=_districtUnitId;
        pIndex=index;
        $("#startYABtn").click(save);
        $("#cancelYABtn").click(cancel);
        var url;
        if(template_id!=null){
            url='/psemgy/yaTemplateDistrict/inputJson?id='+template_id;
        }else{
            url='/psemgy/yaRecordDistrict/inputJson?id='+id;
            $("#startYABtn").hide();
            $("#cancelYABtn").removeClass("btn-white").addClass("btn-primary"); 
        }  
        
        $.ajax({
            method : 'GET',
            url :url,
            async : true,
            dataType : 'json',
            success : function(data) {
                var dictionary=data.Dict;
                for (itemname in dictionary){
                    for (num in dictionary[itemname]){
                        var selText="";
                        if(dictionary[itemname][num].itemCode==data.form[itemname])
                            selText="selected='true'";
                        $("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
                    }
                }
                
                var orgTree = data.Tbmap["orgTable"];
                $.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);					
                
                $("#templateId").val(template_id);
                for (var key in data.form){
                    if(key=="id")
                        continue;
                    //if(key=="templateCreateTime")
                    //	$("#templateCreateTime").val(getLocalTime(data.form[key].time));
                    else if(key=="templateSmsReceiver"){
                        var strArray=data.form[key].split(",");
                        var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
                        for(var i=0;i<strArray.length;i++){
                            var node = zTree.getNodeByParam("orgId",strArray[i]);
                            if(node!=null){
                                node.checked = true;
                                zTree.updateNode(node);
                            }
                        }
                    }
                    else if(key=="templateRemark")
                        $("#remark").val(data.form[key]);
                    else
                        $("#"+key).val(data.form[key]);
                }
                
                var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
                $("#tableGood").bootstrapTable({
                    toggle:"table",
                    data:goodTableRows,
                    rowStyle:"rowStyle",
                    height:320,
                    cache: false, 
                    checkboxHeader:false,
                    singleSelect:false,
                    clickToSelect:true,
                    sidePagination: "server",
                    columns: [
                        {visible:true,title: '',checkbox:true},
                        {field:'id',visible: false,title: '编号'},
                        {field:'name',visible: true,title: '物资名称',align:'center'},
                        {field:'code',visible: true,title: '物资代码',align:'center'},
                        {field:'model',visible: true,title: '型号',align:'center'},
                        {field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNum,align:'center'},
                        {field:'amount',visible: true,title: '数量',align:'center'},
                        {field:'unit',visible: true,title: '单位',align:'center'}
                    ]
                });
                
                $.each(goodTableRows,function(index,item){
                    if(item["goodChecked"]==1)
                        $("#tableGood").bootstrapTable("check",index);
                });
                
                var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
                $("#tableTeam").bootstrapTable({
                    toggle:"table",
                    data:teamTableRows,
                    rowStyle:"rowStyle",
                    height:200,
                    cache: false, 
                    checkboxHeader:false,
                    singleSelect:false,
                    clickToSelect:true,
                    sidePagination: "server",
                    columns: [
                        {visible:true,title: '',checkbox:true},
                        {field:'id',visible: false,title: '编号'},
                        {field:'name',visible: true,title: '名称',align:'center'},
                        {field:'contact',visible: true,title: '联系人',align:'center'},
                        {field:'phone',visible: true,title: '电话',align:'center'},
                        {field:'address',visible: true,title: '地址',align:'center'}
                    ]
                });
                
                $.each(teamTableRows,function(index,item){
                    if(item["teamChecked"]==1)
                        $("#tableTeam").bootstrapTable("check",index);
                });	   	  
            },
            error : function() {
                alert('error');
            }
        });

        /*$("#content").mCustomScrollbar({
            mouseWheelPixels:300
        });*/
       
        $("#templateCreateTime").datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose:true,
            pickerPosition:'top-right'
        });
        
        $("#tableGood").on('post-body.bs.table', function (row,obj) {
            $(".fixed-table-body").mCustomScrollbar({
                mouseWheelPixels:300
            });	
        });
        
        $("#tableTeam").on('post-body.bs.table', function (row,obj) {
            $(".fixed-table-body").mCustomScrollbar({
                mouseWheelPixels:300
            });	
        });
        
        $("#tableReport").on('post-body.bs.table', function (row,obj) {
            $(".fixed-table-body").mCustomScrollbar({
                mouseWheelPixels:300
            });	
        });
    }

    //加载短信
    function ajaxSms(value){
        var dataparms={
            alarmType : value,
        };
        $.ajax({
            type: 'post',
            url : '/psemgy/yaTemplateSms/listSmsMessageAjax',
            data : dataparms,
            dataType : 'json',
            success : function(data){
                $.each(eval(data.rows), function(){
                    //$("#templateSms").val(this.TEMPLATE_CONTET);
                    this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
                });
            },
            error : function(){
                layer.msg('获取短信失败');
            }
        });
    }

    var setting = {
        check: {
            enable: true,
            chkStyle : "checkbox",
            chkboxType: { "Y": "s", "N": "s" }
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

    function getInputNum(value, row, index){
        if(value!=null)
            return "<input type='text' name='numbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
        else
            return "<input type='text' name='numbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
    }

    function format_date(value, row, index){
        if(value)
            return dateUtil.getLocalTime(value);
        return '';
    }

    function save(){
        var goodSelections=$("#tableGood").bootstrapTable("getSelections");
        var goodIds=[];
        var dispAmounts=[];
        for(index in goodSelections)
        {
            goodIds.push(goodSelections[index]["id"]);
            dispAmounts.push($("input[name='numbervalue"+goodSelections[index]["id"]+"']").val());
        }
        var goodIdsStr=goodIds.join(",");
        var dispAmountsStr=dispAmounts.join(",");
        
        var teamSelections=$("#tableTeam").bootstrapTable("getSelections");
        var teamIds=[];
        for(index in teamSelections)
        {
            teamIds.push(teamSelections[index]["id"]);
        }
        var teamIdsStr=teamIds.join(",");
        
        var dataparam=getStrParamByArray($("#form").serializeArray())+"&goodIdsStr="+encodeURIComponent(goodIdsStr)+"&teamIdsStr="+encodeURIComponent(teamIdsStr)+"&dispAmountsStr="+encodeURIComponent(dispAmountsStr);
        $.ajax({
            type: 'post',
            url : '/psemgy/yaRecordDistrict/saveJson',
            data:dataparam,
            dataType : 'json',  
            success : function(data) {
                layer.msg(data.result);
                showTabWindow(districtUnitId,data.record_id);					
            },
            error : function(e) {
                alert('error');
            }
        });
    }

    function getStrParamByArray(array){
        //var param=$("#form").serialize();
        var param="";
        for (pitem in array){
            if(param!=""){
                if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
                    param+="&"+array[pitem].name+"="+encodeURIComponent(getTimeLong(array[pitem].value));
                } else
                    param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
            } else {
                if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
                    param=array[pitem].name+"="+encodeURIComponent(getTimeLong(array[pitem].value));
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
        param+="&districtUnitId="+encodeURIComponent(districtUnitId)+"&yaCityId="+encodeURIComponent(yaCityId)+"&status=1";      
        return param;
    }	

    function showTabWindow(districtUnitId,recordId){
        //"/psemgy/eims/dispatch/pages/district/main.html?districtUnitId="+districtUnitId+"&id="+data.record_id
        awaterui.createNewtab(url,"成员单位调度室");	
    }

    function cancel(){
      layer.close(pIndex);
    }

    return{
        init: init
    }
});