define(['jquery','layer','dateUtil','bootstrapTable','bootstrapValidator','mousewheel','customScrollbar'],function($,layer,dateUtil){
    var id,pIndex;
   function init(_id,index){
        id=_id;                                                                         
        pIndex=index;
        $("#floodRecordSmsInputSaveBtn").click(save);
	    $("#floodRecordSmsInputCancelBtn").click(cancel);
         if(id!=""){	    
            $.ajax({
                method : 'GET',
                url : '/psemgy/floodRecord/inputJson?id='+id,
                async : true,
                dataType : 'json',
                success : function(data) {
                    //填充表单内容 
                    for (var key in data){
                        $("#"+key).val(data[key]);
                    }
                },
                error : function(error) {
                    console.log(error);
                }
            });			
        }

         $("#tableTeam").on('post-body.bs.table', function (row,obj) {
            $(".fixed-table-body").mCustomScrollbar({
                mouseWheelPixels:300
            });	
            $('#form').bootstrapValidator();										
        });
    }

   
    function save(){
        $.ajax({
            type: 'post',
            url : '/psemgy/floodRecord/saveOneJson',
            data: {id:$("#id").val(),recordTitle:$("#recordTitle").val(),recordContent:$("#recordContent").val()},
            dataType : 'json',
            success : function(data) {
                layer.msg(data.result);
                var index = layer.getFrameIndex(window.name);
                window.parent.closeLayer(index);
            },
            error : function() {
                layer.msg("操作失败");
            }
        });
    }
    function cancel() {
        layer.close(pIndex);
    }

    return{ 
		init: init
	}
});