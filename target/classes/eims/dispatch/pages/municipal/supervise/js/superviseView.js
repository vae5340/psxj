define(['jquery','layer'],function($,layer){
    var pIndex;
    function init(content,index){
        pIndex=index;
        $("#superviseCancelBtn").click(closeWindow);
        if(content){
            $("#superviseContent").val(content);		          		
        }
    }

    function closeWindow(){
        layer.close(pIndex);
    }
});
