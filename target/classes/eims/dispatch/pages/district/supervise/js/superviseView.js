define(['jquery','layer'],function($,layer){
    var pIndex;
    function init(id,index){
        pIndex=index;
        $("#superviseCancelBtn").click(closeWindow);
        $.ajax({
            type: 'get',
            url : '/psemgy/yaSuperviseLog/listJson?id='+id,
            dataType : 'json',  
            success : function(data) {
                for (var key in data[0]){
                    if(key.toLowerCase().indexOf("time")!=-1&&data[0][key]!=null){
                        $("#superviseTime").val(data[0]["time"]);							
                    } else{
                        $("#"+key).val(data[0][key]);
                    }		
                }							  
            },
            error : function() {
                alert('error');
            }
        });
    }

    function closeWindow(){
        layer.close(pIndex);
    }

    return{
        init: init
    }
});
