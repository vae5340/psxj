var id="";
var herf;
$(function(){
	herf = window.location.href;
    if (herf.split("?")[1] != undefined && herf.split("?")[1].split("&")[0] != undefined && herf.split("?")[1].split("&")[0].split("=")[1] != undefined) {
    	id = herf.split("?")[1].split("&")[0].split("=")[1];
    }
    if(id!=""){
    	loadDate(id);
    }
})
function loadDate(id){
	$.ajax({
        type: 'post',
        url: "/psxj/sewerage-user!getById.action",
        data: {"id":id},
        dataType: 'json',
        success: function (result) {
        	$("#baseInfo").html("");
        	var htmlText = [];
        	if(result.data!= undefined){
        		var data=result.data;
        		htmlText.push('<table class="info_t" style="width: 100%">')
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'行政区'+":</td>");
                htmlText.push('<td width="33%">'+data.administrative+'</td>');
                htmlText.push('<td width="17%" align="right">'+'项目名称'+":</td>");
                htmlText.push('<td width="33%">'+data.entryName+'</td>');
                htmlText.push('</tr>');
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'许可证号'+":</td>");
                htmlText.push('<td width="33%">'+data.licenseKey+'</td>');
                htmlText.push('<td width="17%" align="right">'+'排水户类型'+":</td>");
                htmlText.push('<td width="33%">'+parent.format_type(data.type,null,null)+'</td>');
                htmlText.push('</tr>');
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'审核状态'+":</td>");
                htmlText.push('<td width="83%" colspan="3">'+parent.format_state(data.state,null,null)+'</td>');
                htmlText.push('</tr>');
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'排水许可证:'+'</td><td width="85%" align="left" colspan="3"><ul id="img-view1" class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px"></ul></td>');
                htmlText.push('</tr>');
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'准予行政许可决定书:'+'</td><td width="85%" align="left" colspan="3"><ul id="img-view2" class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px"></ul></td>');
                htmlText.push('</tr>');
                htmlText.push('<tr>');
                htmlText.push('<td width="17%" align="right">'+'排水平面图:'+'</td><td width="85%" align="left" colspan="3"><ul id="img-view3" class="img-view" style="list-style: none;-webkit-padding-start: 0px;padding-left:0px"></ul></td>');
                htmlText.push('</tr>');
                htmlText.push('</table>');
                $("#baseInfo").append(htmlText.join(""));
                showImage("1",result.licenceFileList);
                showImage("2",result.licenseDecisionFileList);
                showImage("3",result.imageFileList);
        	}
        }
	})
}
function showImage(index,data){
	if(data!=null && data.length>0){
		var total=0,imgHtml='',img_view='';
		for (var i = 0; i < data.length; i++) {
			var rowData=data[i];
			var timeText,imgUrl;
			imgUrl = rowData.filePath;
			img_view+='<li id="img-view-mx'+index+'"><img data-original="'+imgUrl+'"' +
			' src="'+imgUrl+'" alt="附件'+(total+1)+'" width=80 height=80></li>';
			
			total++;
		}
		$("#img-view"+index).append(img_view);
		//$("#img-view").viewer({ url: 'data-original',fullscreen:false});//加载图片完调用viewer图片插件
		//执行父页面图片预览初始化
		$("#img-view-mx"+index).click(function(){
			if(parent.initViewer)
				parent.initViewer($("#img-view"+index).parent().html(),"img-view"+index);
			if(parent.parent.initViewer)
				parent.parent.initViewer($("#img-view"+index).parent().html(),"img-view"+index);
			if(parent.viewer){
				parent.viewer.show($(this).index());
			}else if(parent.parent.viewer){
				parent.parent.viewer.show($(this).index());
			}else{
				layer.msg("未检测到图片插件!",{icon: 2});
			}
		});
	}else{
		var img_view = '暂无附件';
		$("#img-view"+index).append(img_view);
	}
}
