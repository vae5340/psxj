//初始化巡查人员树 已经移动到tree.html统一调用
//var serverName="psxj";
//var name = GetQueryString("name");
//$(function(){
//    loadData(name,"ROOT","","","selectedUser_tree");	
//});

// 加载树
var list= new Array();

function loadSelectedTree(assigneeRangeKey,ele){
    $.ajax({
        type:'post',
        // url:'/psxj/front/task/getAssigneeRangeTree.do',
        url:'/'+serverName+'/asiWorkflow/getAssigneeRangeTree.do',
        data:{assigneeRangeKey:assigneeRangeKey,procdefKey:PROCDEF_KEY,taskCode:TASK_CODE,procInstId:PROC_INST_ID},
        dataType:'json',
        success:function(res){
            var result = res;
            var setting = {
                isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
                data: {
                    key: {
                        name: "text"
                    }
                },
                // treeNodeKey: "text",               //在isSimpleData格式下，当前节点id属性
                // nameCol: "text",            //在isSimpleData格式下，当前节点名称
                expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
                showLine: false,                  //是否显示节点间的连线
                /*
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                */
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        // 父结点非chk
                        if(treeNode.children==false){
                            $("#"+treeNode.id+"_a").removeClass("curSelectedNode");
                            parent.$("#assignee").val(treeNode.id);
                            parent.$("#assigneeName").val(treeNode.text);
                        }

                        else if(treeNode.children==false&&treeNode.level!=0){
                            var son=treeNode.id+"_son";
                            if($("#"+son+"").html()==''||$("#"+son+"").html()==undefined){
                                $("#"+treeNode.id+"").after("<ul id="+son+"></ul>");
                                loadData(taskId, ele,type);
                            }

                        }

                        // 选择节点数据
                        if(treeNode.children==true){
                            var obj={};
                            obj.id=treeNode.id;
                            list.push(obj);
                            var text="";
                            var id="";
                            for(var i=0;i<list.length;i++){
                                if(i==list.length-1){
                                    if(list.length>1){
                                        var len=list[list.length-1].id+"";
                                        var len2=list[list.length-2].id+"";
                                        if(len.indexOf("son")==-1&&len2.indexOf("son")!=-1){
                                            text=list[i-1].text;
                                            id=list[i-1].userId;
                                            $("#"+list[i-1].id+"_a").addClass("curSelectedNode");
                                            $("#"+list[i-1].id+"_a").attr("style","background-color: #FFEB3B;");
                                            $("#"+list[i].id+"_a").removeClass("curSelectedNode");
                                            $("#"+list[i].id+"_a").attr("style","background-color: white;");
                                        }
                                        if(len.indexOf("son")==-1&&len2.indexOf("son")==-1){
                                            text=list[i].text;
                                            id=list[i].userId;
                                            $("#"+list[i].id+"_a").addClass("curSelectedNode");
                                            $("#"+list[i].id+"_a").attr("style","background-color: #FFEB3B;");
                                        }
                                        if(len.indexOf("son")!=-1){
                                            text=list[i].text;
                                            id=list[i].userId;
                                            $("#"+list[i].id+"_a").addClass("curSelectedNode");
                                            $("#"+list[i].id+"_a").attr("style","background-color: #FFEB3B;");
                                        }
                                    }else{
                                        text=list[i].text;
                                        id=list[i].userId;
                                        $("#"+list[i].id+"_a").addClass("curSelectedNode");
                                        $("#"+list[i].id+"_a").attr("style","background-color: #FFEB3B;");
                                    }

                                    parent.$("#assignee").val("USER#"+id+"");
                                    parent.$("#assigneeName").val(text);
                                }else{
                                    $("#"+list[i].id+"_a").removeClass("curSelectedNode");
                                    $("#"+list[i].id+"_a").attr("style","background-color:white;");

                                }
                            }
                        }
                    }
                }
            };
            //隐藏根节点的checkbox
            result.nocheck = true;
            $.fn.zTree.init($("#"+ele+""), setting, result).expandAll(true);
        }
    });

}
