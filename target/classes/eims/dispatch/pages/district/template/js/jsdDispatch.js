define(['jquery','layer','dateUtil','psemgy/eims/dispatch/pages/district/alarm/js/alarmInfoNew','customScrollbar','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapValidator','bootstrapValidatorCN'],function($,layer,dateUtil,alarmInfoNew){
    
    function init(_jsdId,_modelId,_type,_view,callback,index){
        jsdId = _jsdId;
        modelId = _modelId;
        type = _type;
        view = _view;
        pIndex = index;
        pCallback = callback;

        $("#recordJsdDispatch #save").click(save);
        $("#recordJsdDispatch #close").click(closeWindow);

        if(view!=""){
            $("#recordJsdDispatch #save").hide();	        
            $("#recordJsdDispatch #close").show();		           
        }			        	
        $.ajax({
            method : 'GET',
            url : '/psemgy/yaGoodDispatch/inputJsdJson?jsdId='+jsdId+"&modelId="+modelId+"&type="+type,
            async : true,
            dataType : 'json',
            success : function(data) {			
                //var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
                $("#recordJsdDispatch #table_good").bootstrapTable({
                    toggle:"table",
                    data:data.Goodmap["goodTable"],
                    rowStyle:"rowStyle",
                    height:320,
                    cache: false, 
                    checkboxHeader:false,
                    singleSelect:false,
                    clickToSelect:true,
                    sidePagination: "server",
                    columns: [
                        {field:'id',visible: false,title: '编号'},
                        {field:'name',visible: true,title: '物资名称',align:'center'},
                        {field:'code',visible: true,title: '物资代码',align:'center'},
                        {field:'model',visible: true,title: '型号',align:'center'},
                        {field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
                        {field:'amount',visible: true,title: '剩余数量',align:'center',formatter:operateFormatterNum}]
                });
                
                $.each(data.Goodmap["goodTable"],function(index,item){
                    if(item["goodChecked"]==1)
                    $("#recordJsdDispatch #table_good").bootstrapTable("check",index);
                });
                
                $("#recordJsdDispatch #table_team").bootstrapTable({
                    toggle:"table",
                    data:data.Teammap["teamTable"],
                    rowStyle:"rowStyle",
                    height:320,  
                    cache: false, 
                    checkboxHeader:false,
                    singleSelect:false,
                    clickToSelect:true,
                    sidePagination: "server",
                    columns: [
                        {field:'id',visible: false,title: '编号'},
                        {field:'name',visible: true,title: '名称',align:'center'},
                        {field:'contact',visible: true,title: '联系人',align:'center'},
                        {field:'phone',visible: true,title: '电话',align:'center'},
                        {field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumTeam,align:'center'},
                        {field:'amount',visible: true,title: '剩余人数',formatter:peopleFormat,align:'center'}]
                });
                
                $.each(data.Teammap["teamTable"],function(index,item){
                    if(item["teamChecked"]==1)
                    $("#recordJsdDispatch #table_team").bootstrapTable("check",index);
                });	   

                $("#recordJsdDispatch .resetValueInput").blur(resetValue);
            },
            error : function(error) {
                alert('error');
            }
        });

        $("#recordJsdDispatch #table_team").on('post-body.bs.table', function (row,obj) {
            $("#recordJsdDispatch .fixed-table-body").mCustomScrollbar();
            $('#recordJsdDispatch #form').bootstrapValidator();							
        });
                                                                            
        $("#recordJsdDispatch #table_good").on('post-body.bs.table', function (row,obj) {
            $("#recordJsdDispatch .fixed-table-body").mCustomScrollbar();
        });		
    }

    var jsdId,modelId,type,view,pCallback,pIndex;    	    
        
    function operateFormatterNum(value, row, index) {     
        return value+row.unit;
    };

    function operateFormatter(value, row, index){     
        if(value==undefined)
        return "";
        else
        return value;
    };

    function operateFormatterNum(value, row, index) {     
        return value+row.unit;
    };

    function getInputNumGood(value, row, index){
        if(value)
            return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control resetValueInput' max='"+row["amount"]+"' 'min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
        else
            return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value='0' style='text-align:center;width:80px;margin-left:30px'></input>";
    }

    function getInputNumTeam(value, row, index){
        if(value)
            return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control resetValueInput'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'>";
        else
            return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value='0'  style='text-align:center;width:80px;margin-left:30px'></input>";
    }	    
    
    function resetValue(o){
        if($("#recordJsdDispatch .help-block:visible")[0]){
        $("#recordJsdDispatch #save").prop("disabled",true);
        }  else {
        $("#recordJsdDispatch #save").prop("disabled",false);	          
        }  
    }
    
    function peopleFormat(value, row, index){
        return value+"人";		
    } 	


    function save(){
        var goods=$("#recordJsdDispatch #table_good").bootstrapTable("getData");
        var goodIds=[];
        var gDispAmounts=[];
        for(var index=0;index<goods.length;index++) {
            var amount=$("input[name='gnumbervalue"+goods[index]["id"]+"']").val();
            if(amount>0){
                goodIds.push(goods[index]["id"]);
                gDispAmounts.push(amount);
            }
        }
        var goodIdsStr=goodIds.join(",");
        var gDispAmountsStr=gDispAmounts.join(",");

        var teams=$("#recordJsdDispatch #table_team").bootstrapTable("getData");
        var teamIds=[];
        var tDispAmounts=[];
        for(var index=0;index<teams.length;index++) {
            var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
            if(amount>0){
                teamIds.push(teams[index]["id"]);
                tDispAmounts.push(amount);
            }					
        }

        /*if(teams[0]){
        var teamData=teams[0].contact+","+$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
        if(yaType==1){
                parent.refreshJsdTeam(teamData);		
        }
        }*/

        var teamIdsStr=teamIds.join(",");
        var tDispAmountsStr=tDispAmounts.join(",");

        var dataparam="jsdId="+jsdId+"&modelId="+modelId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&type="+type;

        $.ajax({
            type: 'post',
            url :'/psemgy/yaGoodDispatch/saveJsdDispatch',
            data: dataparam,
            dataType : 'json',  
            success : function(data) {
                if(pCallback)
                    pCallback(data);
                layer.msg(data.result);
                layer.close(pIndex);
            },
            error : function(e) {
                layer.msg('error');
            }
        });
    }
   
    function closeWindow() {
        layer.close(pIndex);
    }

    return {
		init: init
	}
}); 