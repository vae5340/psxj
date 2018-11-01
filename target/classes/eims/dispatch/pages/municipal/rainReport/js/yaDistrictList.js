define(['jquery','layer','dateUtil','boostrapTable','boostrapTableCN'],function($,layer,dateUtil){

    var yaCityId;
    
    function init(_yaCityId,index){
           yaCityId=_yaCityId;
           pIndex=index;
           $("#addYyybBtn").click(addDistrictRainNews);
           $("#cancelYyybBtn").click(cancel);
            $.ajax({
                method : 'GET',
                url : location.protocol+"//"+location.hostname+":"+location.port+'/psemgy/yaTemplateCity/getAllDict',
                async : false,
                dataType : 'json',
                success : function(data) {
                    orgName=data.orgName;						
                    DictList=data;
                    $('#yaDistrictList_table').bootstrapTable({
                        toggle:"table",
                        url:"/psemgy/yaRecordDistrict/listDistrictByCityIdJson?yaCityId="+yaCityId,
                        rowStyle:"rowStyle",
                        cache: false,
                        striped: true,
                        singleSelect:true,
                        clickToSelect:true,
                        sidePagination: "server",	
                        columns: [
                            {visible:true,checkbox:true}, 
                            {field: 'templateNo',title: '方案编号'},
                            {field: 'templateType',title: '方案分类',formatter:format_type}, 
                            {field: 'templateName',title: '方案名称'},
                            {field: 'templateGrade',title: '方案级别',formatter:format_grade}, 
                            {field: 'recordCreateTime',title: '发布时间',formatter:format_time}, 
                            {field: 'status',title: '状态',formatter:format_status}
                        ]
                });
            },
            error : function() {
                alert('error');
            }
        });      
    }
    
    function format_type(value, row, index){
        for (var item in DictList["templateType"]){
            if(value==DictList["templateType"][item].itemCode)
                return DictList["templateType"][item].itemName;
        }
        return '';
    }
    
    function format_time(value, row, index){
        if(value)
            return dateUtil.getLocalTime(value);
        return '';
    }
    
    function format_grade(value, row, index){
        for (var item in DictList["templateGrade"]){
            if(value==DictList["templateGrade"][item].itemCode)
                return DictList["templateGrade"][item].itemName;
        }
        return '';
    }
    
    function format_status(value,row,index){
        if(value==1)
            return "启动中";
        return "已结束";
    }
    
    function addDistrictRainNews(){
        var selectRows=$('#yaDistrictList_table').bootstrapTable('getSelections');
        if(selectRows.length>0){
            $.get("/psemgy/eims/dispatch/pages/district/rainReport/planInput.html",function(h){
                 layer.open({
                    type: 1,
                    title: '新增成员单位一雨一报',
                    shadeClose: false,
                    shade: 0.1,
                    area: ['800px', '400px'],
                    content: h,		
                    success: function(layero,index){
                        require(["psemgy/eims/dispatch/pages/district/rainReport/js/planInput"],function(planInput){
                            planInput.init(selectRows[0].id,index);
                        })
                    }
                });	
			});	          
        } else {
            layer.msg("请选择新增项");
        }
    }
    function cancel() {
        layer.close(pIndex);
    }
});    