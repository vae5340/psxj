(function($) {
$.insdep.plus.upload=function(target,args){
	$.insdep.loader({
        id:"plupload-3.1.2",
        path:$.insdep.config.path+"plugin/plupload-3.1.2/js/plupload.full.min.js"
    },function(){
		$.insdep.loader({
            id:"plus-upload-css",
            path:$.insdep.config.path+"plus/upload/style.css"
        },function(){



	            var d={
					url:"",
					style:"standard"
				};
				var n=$.extend(true,d,args);

				var classd;
				switch(n.style)
				{
				case "images":
					classd="batch-upload-images";
					break;
				case "simple":
				  	classd="batch-upload-simple";
					break;
				case "standard":
				default:
					classd="";
				}


                $(target).html(
			    '<div class="batch-upload '+classd+'">'+
			        '<div class="upload-operate">'+
			            '<div class="upload-dragged">'+
			                '<b>拖入图片上传</b>'+
			            '</div>'+
			            '<div class="button-bar"><div class="upload-button">上传</div></div>'+
			        '</div>'+
			        '<div class="upload-list">'+
			             '<p>图片列表</p>'+
			             '<div class="upload-scroll"></div>'+
			         '</div>'+
			    '</div>');
                //console.log($(target).find('.upload-button')[0]);
				var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
					runtimes : 'html5,flash,silverlight,html4',
					browse_button :$(target).find('.select-button')[0], // you can pass an id...
					container:$(target)[0],
					drop_element:$(target).find('.upload-dragged')[0],
					url :n.url,
					flash_swf_url : $.insdep.config.path+"plugin/plupload-3.1.2/js/Moxie.swf",
					silverlight_xap_url : $.insdep.config.path+"plugin/plupload-3.1.2/js/Moxie.xap",
					filters : {
						max_file_size : '10mb',
						mime_types: [
							{title : "Image files", extensions : "jpg,gif,png"},
							{title : "Zip files", extensions : "zip"}
						]
					}
				});
				uploader.init(); //初始化
				uploader.bind('FilesAdded',function(uploader,files){
					for(var i = 0, len = files.length; i<len; i++){
						!function(i){
							previewImage(files[i],function(src){
								//console.log(files[i].id,imgsrc);
								$(target).find('.upload-scroll').append('<dl id="'+files[i].id+'">'+
                     '<img src="'+ src +'">'+
                     '<dd><div id="progressbar-'+files[i].id+'" class="progressbar-animation progressbar-auto-color"></div></dd>'+
                     '<dt><p>'+files[i].name+'</p><span>'+plupload.formatSize(files[i].size)+'</span><b class="upload-cancel" data-val="'+files[i].id+'"></b></dt>'+
                 '</dl>');
							});


					    }(i);
						
					}

				});

				$(document).on('click',target.selector+' .upload-list .upload-scroll .upload-cancel', function () {
	                $(this).parent().parent().remove();
	                var toremove = '';
	                var id = $(this).attr("data-val");
	                for (var i in uploader.files) {
	                    if (uploader.files[i].id === id) {
	                        toremove = i;
	                    }
	                }
	                uploader.files.splice(toremove, 1);
	            });

				function previewImage(file,callback){

					if(!file || !/image\//.test(file.type)) return; //确保文件是图片
					
					if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
						var fr = new moxie.file.FileReader();
						fr.onload = function(){
							callback(fr.result);
							fr.destroy();
							fr = null;
						}
						fr.readAsDataURL(file.getSource());
					}else{
						/*
						var fr = new moxie.file.FileReader();
						console.log(file.getSource());
						console.log(fr);
						fr.onload = function(){
							callback(fr.result);
							fr.destroy();
							fr = null;
						}
						fr.readAsDataURL(file.getSource());
						*/
						var preloader = new moxie.image.Image();
						console.log(file.getSource());
						console.log(preloader);
						preloader.onload = function() {
							console.log("ok1");
							preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
							var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
							callback && callback(imgsrc); //callback传入的参数为预览图片的url
							preloader.destroy();
							preloader = null;
						};

						preloader.load(file.getSource());
						

					}

				}


        });
    });
};

})(jQuery);