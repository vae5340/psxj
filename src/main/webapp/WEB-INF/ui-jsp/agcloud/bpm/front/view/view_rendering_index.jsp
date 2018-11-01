<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>
		${viewComment}
	</title>
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/jsp/lib-easyui.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>
</head>
<script>
	var viewId = '${viewId}';

    $(function(){
        //初始化流程应用模板下拉框
        $.ajax({
            url : ctx+'/front/dyn/rendering/view/renderingView.do?viewId='+viewId,
            type: "post",
            dataType : 'json',
            success : function (data){
                console.log(data.searchItems);
                if(data.searchItems==null||data.searchItems.length==0){
                    $('#northDiv').height(0);
                    $('#northDiv').css('display','none');
				}else{
                    searchItemRendering(data.searchItems);
				}

                viewTableRendering(data.tableColumns);
            }
        });

        $(window).resize(function(){
            var formHeight = $('#viewSearchForm').height();
			$('#northDiv').panel('resize',{height:formHeight+35});

            $('#viewTableCenter').css('margin-top',0);
            var bodyHeight = $('body').height();
            $('#viewTable').datagrid('resize',{
                height:bodyHeight-formHeight-50-35
            });
        });
    })

	function searchViewData(){
        var param = $('#viewSearchForm').serialize();
        console.log(param);
        $('#viewTable').datagrid({
            url:ctx+'/front/dynamic/view/getPageViewDateForEasyui.do?viewId='+viewId+'&'+param
        });
	}

	//渲染查询区域
	function searchItemRendering(searchItems){
		if(searchItems!=null&&searchItems!=undefined&&searchItems.length>0){
			var searchHtml = '';
            for(var index = 0;index < searchItems.length; index++) {
                var searchItem = searchItems[index];
			    if(index==0){
                    searchHtml +='<tr>';
				}
                if(index!=0&&/*index!=(searchItems.length-1)&&*/index%2==0){
                    searchHtml +='</tr>';
                    searchHtml +='<tr>';
				}
                switch(searchItem.fieldHtmlComp) {
                    case '1'://普通字符输入框（STRING） = 1
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td style="width: 35%"><input type="text" name="'+searchItem.listName+'" class="easyui-textbox"  style="width: 98%"/></td>';
                        break;
                    case '2'://整型数字输入框（INTEGER） = 2
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td style="width: 35%"><input type="text" name="'+searchItem.listName+'" class="easyui-numberbox" data-options="precision:0" style="width: 98%"/></td>';
                        break;
                    case '3'://浮点数字输入框（FLOAT） = 3
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td style="width: 35%"><input type="text" name="'+searchItem.listName+'" class="easyui-numberbox" data-options="precision:4" style="width: 98%"/></td>';
                        break;
                    case '4'://多行文本框（TEXTAREA） = 4
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td style="width: 35%"><input type="text" name="'+searchItem.listName+'" class="easyui-textbox" data-options="multiline:true" style="width: 98%"/></td>';
                        break;
                    case '5'://日期框（DATE） = 5
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td style="width: 35%"><input type="text" name="'+searchItem.listName+'" class="easyui-datebox" style="width: 98%"/></td>';
                        break;
                    case '6'://  下拉框
                        searchHtml +=  "<td style='width: 15%'>"+searchItem.listComment+"：</td><td style='width: 35%'><input type='text' name='"+searchItem.listName+"' class='easyui-combobox' data-options='valueField: \"itemCode\",textField: \"itemName\",data: "+ searchItem.dicSelectDatas +"' style='width: 98%'/></td>";
                        break;
                    case '7'://复选框（CHECKBOX） = 7
                        break;
                    case '8'://单选框（RADIO） = 8
                        break;
                    case '9'://附件（ATTACHMENT） = 9
                        break;
                    case '10'://图片（PICTRUE） = 10
                        break;
                    case '20'://日期时间框（DATETIME）=20
                        searchHtml +=  '<td style="width: 15%">'+searchItem.listComment+'：</td><td><input name="'+searchItem.listName+'" class="easyui-datetimebox" style="width: 98%"/></td>';
                        break;
                    default:
                }
                if(index==(searchItems.length-1)){
                    searchHtml +='</tr>';
                }
			}
			var viewObj = $('#viewSearchTable').append(searchHtml);
            $.parser.parse(viewObj);

            var formHeight = $('#viewSearchForm').height();
            $('#northDiv').height(formHeight+35);
            //$('#northDiv').panel('resize',{height:formHeight+35});

            var bodyHeight = $('body').height();
            $("#viewTableCenter").panel("resize",{
                height:bodyHeight-formHeight-50-40
			});
            $('#viewTableCenter').css('margin-top',formHeight+30);
		}
	}

	//渲染视图table
	function viewTableRendering(tableColumns){
        if(tableColumns!=null&&tableColumns!=undefined&&tableColumns.length>0){
			var thJsonStr = '[';
            for(var index = 0;index < tableColumns.length; index++) {
                var tableColumn = tableColumns[index];
                thJsonStr += '{field:\''+tableColumn.listName+'\',title:\''+tableColumn.listComment+'\',width:100},';
			}
            if(thJsonStr.length>0)
                thJsonStr = thJsonStr.substring(0,(thJsonStr.length-1))+']';

            var thJson = eval('('+thJsonStr+')');
            $('#viewTable').datagrid({
                fitColumns:true,
                striped:true,
                nowrap:false,
                pagination:true,
                rownumbers:true,
                singleSelect:true,
                fit:true,
                columns:[thJson],
                url:ctx+'/front/dynamic/view/getPageViewDateForEasyui.do?viewId='+viewId
            });
        }
	}

	function dateTimeFormater(val){
    	return dateFormatByExp('yyyy-MM-dd HH:mm:ss');
	}
</script>
<body class="easyui-layout">
<div data-options="region:'north',border:false" style="height:50px">
	<nav class="agcloud-navbar">
		<div class="agcloud-navbar-container">
			<a class="agcloud-navbar-brand agcloud-icon-data-dictionary" href="javascript:void(0);">
				${viewComment}
			</a>
			<div class="agcloud-navbar-collapse">
				<ul class="agcloud-navbar-tabs">
					<li class="agcloud-nav-item">
						<a href="javascript:void(0);" class="agcloud-nav-icon  agcloud-navbar-icon-question"> </a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</div>
<div data-options="region:'center',border:false">
	<div class="easyui-layout" style="width:100%;height:100%" data-options="fit:true">
		<div data-options="region:'north',border:false" id="northDiv" >
			<form id="viewSearchForm">
				<table style="width: 100%" class="inputPageTable" id="viewSearchTable">
					#{searchFormHtml}
				</table>
			</form>
			<div style="width: 98%" id="searchBtnDiv">
				<a href="javascript:void(0);" class="easyui-linkbutton" iconCls="icon-ok" onclick="searchViewData();" style="width:120px;float: right;">查询</a>&nbsp;&nbsp;
			</div>
		</div>
		<div data-options="region:'center',border:true" id="viewTableCenter" style="padding:5px;">
			<table id="viewTable">
				#{tableHtml}
			</table>
		</div>
	</div>
</div>
</body>
</html>