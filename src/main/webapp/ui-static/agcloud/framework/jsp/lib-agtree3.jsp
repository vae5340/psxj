<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- ztree -->
<script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/agtree3/js/jquery.agtree.core.js?<%=isDebugMode%>" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/ztree3/js/jquery.ztree.excheck.js?<%=isDebugMode%>" type="text/javascript"></script> <!--扩展实现复选框-->
<script src="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/ztree3/js/jquery.ztree.exedit.js" type="text/javascript"></script>

<link href="${pageContext.request.contextPath}/ui-static/agcloud/framework/js-libs/agtree3/css/zTreeStyle/zTreeStyle.css?<%=isDebugMode%>" type="text/css" rel="stylesheet"/>

<style>
    /**ztree平铺树 扩展的样式（样式属性通过js追加）**/

    /**ztree平铺树  平铺样式**/
    .ztreeHorizontal li.horizontal {
        display: inline;
        margin-right: 2px;
        float:left;
    }
    /**ztree平铺树 如果不平铺需要清除浮动**/
    .ztreeHorizontal li.noFloat {
        clear:both;
    }
    /**ztree平铺树  平铺样式需要设置a元素boxNode样式（边框背景等）**/
    .ztreeHorizontal li a.boxNode {
        width:170px;
        padding-top:0px;
        background-color: #f2f2f2;
        color:black;
        height:25px;
        border:1px #d3d3d3 solid;
        opacity:0.8;
        border-radius: 3px !important;
    }
    /**平铺的样式，a元素宽度重新设置**/
    .ztreeHorizontal li.horizontal a.boxNode{
        width:110px;
    }

    .ztreeHorizontal li a.selectedNode {
        border: 1px solid #495049;
        background-color: #b1b3ad;
    }

    /**ztree拖拽到目标节点里面，目标节点的样式**/
    .ztreeHorizontal li a.innerNode {
        border: 1px solid #495049;
        background-color: #5d89c7;
    }

    /**拖拽提示样式**/
    .inserMsg{
        margin-top:-22px;
        background-color:#4B77BE;
        font-size:12px;
        white-space:nowrap;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        color:white;
    }

</style>