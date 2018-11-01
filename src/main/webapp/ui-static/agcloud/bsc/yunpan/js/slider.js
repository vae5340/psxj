var ADMIN_ATT_URL = ctx + "/bsc/att/admin";
var sPanel;
var zTreeObj;
var zNodes = [
    {name:"test1", open:true,"iconSkin" : "department", children:[
            {name:"test1_1"}, {name:"test1_2"}]},
    {name:"test2", open:true, children:[
            {name:"test2_1"}, {name:"test2_2"}]}
];
$(document).ready(function(){
    zTreeObj = $.fn.zTree.init($("#dirTree"), setting);
    sPanel =  document.getElementById("contents").contentWindow;
    var $expand = $('.expand'),
        $collapse = $('.collapse');
    $expand.on('click',function () {
        expandAll();
    });
    $collapse.on('click',function () {
        collapseAll();
    });
});
var setting = {
    edit: {
        enable: true, //设置 zTree 是否处于编辑状态
        showRemoveBtn: false,//设置是否显示删除按钮
        showRenameBtn: false//设置是否显示编辑名称按钮
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId"
        }
    },
    view: {
        selectedMulti: false,//设置是否允许同时选中多个节点
        showTitle : false, //设置 zTree 是否显示节点的 title 提示信息(即节点 DOM 的 title 属性)。
        showLine: false //设置 zTree 是否显示节点之间的连线。
    },
    //使用异步加载，必须设置 setting.async 中的各个属性
    async: {
        //设置 zTree 是否开启异步加载模式
        enable: true,
        autoParam: ["id"],
        url:ADMIN_ATT_URL+"/getDirTree.do"
    },
    callback: {
        //单击事件
        onClick: onClickLeftTree,
        //右击事件
        onRightClick:onRightClickLeftTree,
        //用于捕获异步加载正常结束的事件回调函数
        onAsyncSuccess: onAsyncSuccessLeftTree
    }
};


/**
 * 组织树单击事件
 * @param event js event 对象 标准的 js event 对象
 * @param treeId String对应 zTree 的 treeId，便于用户操控
 * @param treeNode JSON 被点击的节点 JSON 数据对象
 * @param clickFlag 节点被点击后的选中操作类型
 */
function onClickLeftTree(event, treeId, treeNode, clickFlag) {
    sPanel.doEnterDir(treeNode.id);//加载文件夹下数据
}
function expandAll() {
    var treeObj = $.fn.zTree.getZTreeObj("dirTree");
    zTreeObj.expandAll(true);
}
function collapseAll() {
    var treeObj = $.fn.zTree.getZTreeObj("dirTree");
    treeObj.expandAll(false);
}


function onRightClickLeftTree(event, treeId, treeNode) {
    /*//禁止浏览器的菜单打开
    event.preventDefault();
    //$(this).tree('select',node.target);

    //设置右击按钮
    if(treeNode.orgProperty==ORG_UNIT || treeNode.orgProperty==ORG_DEPARTMENT){
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addOrgUBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addOrgDBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addOrgGBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addPosBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addUserBtn'));
    } else if(treeNode.orgProperty==ORG_GROUP ){
        $('#omOrgLeftAsyncTreeMM').menu('disableItem', $('#leftAsyncTree_addOrgUBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('disableItem', $('#leftAsyncTree_addOrgDBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addOrgGBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addPosBtn'));
        $('#omOrgLeftAsyncTreeMM').menu('enableItem', $('#leftAsyncTree_addUserBtn'));

    }

    $('#omOrgLeftAsyncTreeMM').menu('show', {
        left: event.pageX,
        top: event.pageY
    });

    orgLeftAsyncTree.selectNode(treeNode);
    nowSelectLeftNodeJSON = treeNode;*/
};


/**
 * 用于捕获异步加载正常结束的事件回调函数
 * event ： 标准的 js event 对象
 * treeId： 对应 zTree 的 treeId，便于用户操控
 * treeNode：进行异步加载的父节点 JSON 数据对象,针对根进行异步加载时，treeNode = null
 * msg：异步获取的节点数据字符串，主要便于用户调试使用。实际数据类型会受 setting.async.dataType 的设置影响，请参考 JQuery API 文档。
 */
function onAsyncSuccessLeftTree(event, treeId, treeNode, msg) {
    /*//对于根节点，展开下一级
    if(treeNode==null){
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var nodes = zTree.getNodes();
        for (var i=0, l=nodes.length; i<l; i++) {
            zTree.expandNode(nodes[i], true, false, false);
        }
        //对左树根节点组织编码进行赋值
        leftRootNodeOrgCode = nodes[0].orgCode;
    }*/
};

/*$(function() {

    var leftTreeSearch = $('#leftTreeSearchKey');

    //点击左边组织异步树清除按钮
    leftTreeSearch.textbox({
        onClickButton: function () {
            clearLeftSearchOrgForTree();
        }
    });


    //搜索左边组织异步树，展示下拉框
    leftTreeSearch.textbox('textbox').bind('keyup', function(e){

        $("#left_search_org_user_list").panel('open');
        $("#omOrgLeftTree").hide();

        var keyWord = $(this).val();

        //如果搜索框有内容
        if(keyWord.trim()!=''){

            $("#left_search_org_user_list").panel('open');

            //加载部门列表和人员列表
            $.ajax({
                type: "post",
                url: ctx + '/opus/om/org/getOMOrgsAndUsersByKeyWord.do',
                data: {'name': keyWord},
                success: function (data) {

                    var orgListHtml = "";
                    var userListHtml = "";

                    $.each(data,function(i,value){

                        var orgShowName="";
                        if(value.pName!=null){
                            orgShowName = value.pName+"-"+value.name
                        }else {
                            orgShowName = value.name
                        }

                        var type = value.type;
                        //加载部门
                        if(type==ORG){
                            var orgProperty = value.orgProperty;

                            if(orgProperty==ORG_UNIT){
                                orgListHtml = orgListHtml + "<li class='org_list_unit'>";
                            }else if(orgProperty==ORG_DEPARTMENT) {
                                orgListHtml = orgListHtml + "<li class='org_list_department'>";
                            }else if(orgProperty==ORG_GROUP){
                                orgListHtml = orgListHtml + "<li class='org_list_group'>";
                            }
                            orgListHtml = orgListHtml+"<a  href=javascript:void(0); onclick=showLeftOrgUserInfo('"+value.id+"','"+value.type+"','"+value.orgProperty+"')>"+orgShowName+"</a></li>";
                        }

                        //加载用户
                        if(type==USER){
                            var userSex = value.userSex;
                            if(userSex==USER_MAN){
                                userListHtml = userListHtml + "<li class='user_list_man'>";
                            }else if(userSex==USER_WOMAN){
                                userListHtml = userListHtml + "<li class='user_list_woman'>";
                            }
                            userListHtml = userListHtml + "<a  href=javascript:void(0); onclick=showLeftOrgUserInfo('"+value.id+"','"+value.type+"')>"+value.name+"</a></li>";
                        }

                    });

                    $("#left_search_org_list").html(orgListHtml);
                    if(orgListHtml==""){
                        $("#left_search_org_title").hide();
                    }else  {
                        $("#left_search_org_title").show();
                    }
                    $("#left_search_user_list").html(userListHtml);
                    if(userListHtml==""){
                        $("#left_search_user_title").hide();
                    }else  {
                        $("#left_search_user_title").show();
                    }

                }
            })

        }else {
            $("#left_search_org_user_list").panel('close');
            $("#omOrgLeftTree").show();
        }

    });


})*/

//清空搜索左树文字框
function clearLeftSearchOrgForTree() {
    /*$("#leftTreeSearchKey").textbox('clear');
    $("#left_search_org_user_list").panel('close');
    $("#omOrgLeftTree").show();*/
}


//左树搜索列表 点击列表展示组织、用户详情
function showLeftOrgUserInfo(id,type,orgProperty) {

    /*clearLeftSearchOrgForTree();

    //右侧树，去除上次节点选中颜色
    if(nowSelectRightNodeJSON !=null){
        $("#"+nowSelectRightNodeJSON.tId+"_a").removeClass('selectedNode');
    }

    //如果右侧树存在该节点，选中该节点
    if(orgPostUserRightTree!=null){
        var selectRightNode = orgPostUserRightTree.getNodeByParam("id", id, null);
        if(selectRightNode!=null){
            orgPostUserRightTree.selectNode(selectRightNode);
            //设置节点选中样式
            $("#"+selectRightNode.tId+"_a").addClass('selectedNode');

        }
    }

    if(type == ORG){

        //如果左侧树存在该节点，选中该节点
        var selectLeftNode = orgLeftAsyncTree.getNodeByParam("id", id, null);
        orgLeftAsyncTree.selectNode(selectLeftNode);

        //对当前选中节点变量nowSelectRightNodeJSON进行赋值 （如果右侧树没有此节点，也要赋值，nowSelectRightNodeJSON在操作组织的时候需要用到）
        $.ajax({
            type: "post",
            url: ctx+'/opus/om/org/getOpuOmOrg.do',
            data: {'orgId': id},
            success: function (data) {
                if (data!= null && data!= '' ) {
                    nowSelectRightNodeJSON = data;

                    //赋值上一次选中节点点类型 ，上一次选中节点Id
                    preSelectRightNodeType = data.type;
                    preSelectRightNodeId = data.id;

                }
            }
        })

        //设置相应的按钮状态
        setButtonStateForOpenOrgCard(orgProperty);

        //滑板控制
        closeOpuOmOtherQuickSidebar('opus-org-page-quick-sidebar-div');

        //打开组织卡表
        openOrgCard(id,orgProperty);


    }else if(type == USER){


        //设置相应的按钮状态
        setButtonStateForOpenUserCard();

        //滑板控制
        closeOpuOmOtherQuickSidebar('opus-user-page-quick-sidebar-div');

        //设置用户头像
        setUserAvatarViewImg(id);

        //设置卡片信息，包括用户拼音名字，头像上传业务id、用户组织岗位信息等
        setOpuOmUserCardInfo(id);

        //赋值上一次选中节点点类型 ，上一次选中节点Id
        preSelectRightNodeType = type;
        preSelectRightNodeId = id;

    }*/
}













/*
$(function () {
    var currentType = 'ALL';//当前文件类型，全部文件时为ALL，其他等于对应类型
    var fileType = {
        picture:['jpg','png','bmp','gif','jpeg','psd','svg','tga','JPG','PNG','BMP','GIF','JPEG','PSD','SVG','TGA'],
        document:['txt','doc','docx','pdf','xls','xlsx','ppt','pptx','conf','xml','html','css','js','jsp','java','bat','shp','dwg'],
        video:['avi','mpg','mov','swf','mp4'],
        music:['wav','aif','au','mp3','ram','wma','mmf','amr','aac','flac'],
        other:[]
    }
    var srcObj = {
        ALL: ctx + "/allFile.do?userId=" + userId + "&dirId=" + dirId ,//+ "&simplePage=" + true
        myShare: ctx + "/share/myShare.do?userId=" + userId,
        otherShare: ctx + "/share/otherShare.do?userId=" + userId
    };
    //设置iframe页面
    function setUrl(key) {
        $("#contents").attr("src", srcObj[key]);
    }
    //菜单点击事件
    $(".menuItem").click(function () {
        var key = $(this).attr("data-key");
        if(srcObj.hasOwnProperty(key)){
            setUrl(key);
        }
        if(fileType.hasOwnProperty(key)){
            currentType = fileType[key].join(",");
            if(!document.getElementById("contents").contentWindow.globalSearch)
                setUrl("allFile");
            var inter = setInterval(function () {
                //调用iframe注意中的搜索方法
                var globalSearch = document.getElementById("contents").contentWindow.globalSearch;
                if(globalSearch){
                    clearInterval(inter);
                    globalSearch(currentType);
                }
            },500);
        }else{
            currentType = "ALL";
        }
    });
    //iframe 自适应
    $("#contents").height(window.innerHeight - 15);
    $(window).resize(function () {
        $("#contents").height(window.innerHeight - 15);
    });
})*/
