var id = getQueryStr("id");
var url=""; 
$(function(){
	//填充数据
	reloadCorrectMark();
	//初始化时间
	//loadTime();
});
//加载数据
function reloadCorrectMark(){
	if(id){
		$.ajax({
			method: 'get',
			url: '/psxj/diary/seeDiary?id='+id,
			dataType:'json',
			success: function(data){
				if(data.code==200 && data.form){
					for(var k in data.form){
						if(k=='recordTime' && data.form[k]){
							$("#recordTime").val(new Date(data.form[k].time).pattern("yyyy-MM-dd HH:mm"));
						}else if(k=='updateTime' && data.form[k]){
							$("#updateTime").val(new Date(data.form[k].time).pattern("yyyy-MM-dd HH:mm"));
						}else{
							$("#"+k).val(data.form[k]);
						}
					}
				}
				var total=0,imgHtml='',img_view='';
				if(data.code==200 && data.rows && data.rows.length>0){
					for(var i in data.rows){
						var rowData=data.rows[i];
						var timeText,imgUrl;
						if(rowData.attTime)
							timeText = new Date(rowData.attTime.time).pattern("yyyy-MM-dd HH:mm:ss");
						if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
							imgUrl = rowData.attPath;
						}
						if(timeText && imgUrl){
							/*if(total == 0 && total%2 == 0){
								if(total!=0)
									imgHtml+='</div>';
								imgHtml+='<div class="form-group">'+
										'<label class="col-sm-3 control-label">'+timeText+'</label>'+
										'<div class="col-sm-3"><img alt="140x140" src="'+url+imgUrl+'" width=400 height=350></div>';
							}else{
								imgHtml+='<label class="col-sm-3 control-label">'+timeText+'</label>'+
								'<div class="col-sm-3"><img alt="140x140" src="'+url+imgUrl+'"></div>';
							}*/
							/*imgHtml+='<div class="form-group">'+
							'<label class="col-sm-3 control-label">'+timeText+'</label>'+
							'<div class="col-sm-9"><img alt="140x140" src="'+url+imgUrl+'" width=300 height=200></div></div>';
							*/
							img_view+='<li>'+timeText+'<img data-original="'+imgUrl+'"' +
							' src="'+imgUrl+'" alt="图片'+(total+1)+'" width=350 height=200></li>';
							total++;
						}
					}
				}else{
					//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
					img_view+='暂无照片';
				}
				//$("#lack-img").append(imgHtml);
				$("#img-view").append(img_view);
				$("#img-view").viewer({ url: 'data-original',});//加载图片完调用viewer图片插件
			},error:function(){ }
		});
	}
}
//初始化时间
function loadTime(){
	$("#markTime").datetimepicker({
		language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format:'yyyy-mm-dd'
		
  	});
}
