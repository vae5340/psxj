define(['jquery','dateUtil','layer','bootstrap'],function($,dateUtil,layer){
        var pIndex;
        function init(id,content,index){
              pIndex=index;
              $("#superviseReplyBtn").click(sendSuperviseReply);
              $("#superviseCancelBtn").click(closeWindow);
              $("#id").val(id);
              if(content)
                 $("#superviseContent").val(content);
        }
            
        function sendSuperviseReply(){	
            var superviseReply;
            if($("#superviseReply").val().trim()!=""){
                superviseReply=$("#superviseReply").val();
            }else{
                superviseReply="已收到通知，处理中。";
            }
            $.ajax({
                method : 'GET',
                url : '/psemgy/yaSuperviseLog/saveJson',
                data:{id:$("#id").val(),superviseReply:superviseReply},
                async : true,
                dataType : 'json',
                success : function(data) {
                    layer.msg("发送成功");
                    layer.close(pIndex);
                },
                error : function() {
                    layer.msg("发送失败");
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
			
		   