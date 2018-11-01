(function($) {
$.insdep.plus.upload=function(target,args){
	$.insdep.batchLoader({},{
		"plupload-3.1.2":$.insdep.config.path+"plugin/plupload-3.1.2/js/plupload.full.min.js",
		"plus-upload-css":$.insdep.config.path+"plus/upload/style.css"
	},
	function(){
		//-----------------------
		var d={

			url:"",
			style:"standard",

			/*plupload属性*/
			plupload:{
				filters:{},
				headers:false,
				multipart:true,
				multipart_params:{},
				max_retries:0,
				chunk_size:0,
				resize:false,
				multi_selection:true,
				required_features:false,
				unique_names:false,
				runtimes:'html5,flash,silverlight,html4',
				file_data_name:"file",
			}
			/*plupload属性end*/
		};
		var n=$.extend(true,d,args);

		var template;
		switch(n.style)
		{
		case "images":
			template='<div class="batch-upload batch-upload-images"><div class="upload-operate"><div class="upload-dragged"><b>拖入图片上传</b><div class="select-button">选择图片</div></div><div class="button-bar"><div class="upload-button">上传</div></div></div><div class="upload-list"><p>图片列表</p><div class="upload-scroll"></div></div></div>';
			break;
		case "simple":
		  	template='<div class="batch-upload batch-upload-simple"><div class="upload-list"><p>图片列表</p><div class="upload-scroll"></div></div><div class="upload-operate"><div class="upload-dragged"><b>拖入图片上传</b><div class="select-button">选择图片</div></div><div class="button-bar"><div class="upload-button">上传</div></div></div></div>';
			break;
		case "standard":
		default:
			template='<div class="batch-upload"><div class="upload-operate"><div class="upload-dragged"><b>拖入文件上传</b><div class="select-button">选择文件</div></div><div class="button-bar"><div class="upload-button">上传</div></div></div><div class="upload-list"><p>文件列表</p><div class="upload-scroll"></div></div></div>';
		}


        $(target).html(template);

        var conf=$.extend(true,d.plupload,n.plupload,{
				browse_button:$(target).find('.select-button')[0],
				container:$(target)[0],
				drop_element:$(target).find('.upload-dragged')[0],
				url:n.url,
				flash_swf_url:$.insdep.config.path+"plugin/plupload-3.1.2/js/Moxie.swf",
				silverlight_xap_url:$.insdep.config.path+"plugin/plupload-3.1.2/js/Moxie.xap"
			});

		var uploader = new plupload.Uploader(conf);

		/*初始化*/
		uploader.init();

		/*监听文件添加*/
		uploader.bind('FilesAdded',function(uploader,files){
			/*for*/
			for(var i = 0, len = files.length; i<len; i++){
				!function(i){
					switch(n.style)
					{

					case "images":
					previewImage(files[i],function(src){

						$(target).find('.upload-scroll').append('<dl id="'+files[i].id+'">'+
				             '<img src="'+ src +'">'+
				             '<dd><div id="progressbar-'+files[i].id+'" class="progressbar-animation progressbar-auto-color" data-options="value:0,text:\'\'" data-percent="0"></div></dd>'+
				             '<dt><p>'+files[i].name+'</p><span>'+plupload.formatSize(files[i].size)+'</span><b class="upload-cancel" data-val="'+files[i].id+'"></b></dt>'+
				         '</dl>');
						
					});
					break;
					case "simple":
					case "standard":
					default:

						$(target).find('.upload-scroll').append('<dl class="'+filetype(files[i].name.replace(/.+\./, ""))+'">'+
		                     '<dt>'+files[i].name+'<span>'+plupload.formatSize(files[i].size)+'</span><b class="upload-cancel"></b></dt>'+
		                     '<dd><div id="progressbar-'+files[i].id+'" class="progressbar-animation progressbar-auto-color" data-options="value:0,text:\'\'" data-percent="0"></div></dd>'+
		                 '</dl>');

					}
					/*初始化进度条*/
					$('#progressbar-'+files[i].id).progressbar({}); 


			    }(i);
				
			}
			/*for end*/

		});

		/*当Plupload初始化完成后触发*/
		uploader.bind('Init',function(uploader){
			
		});

		/*当Init事件发生后触发*/
		uploader.bind('PostInit',function(uploader,files){
			$(target).on('click', '.upload-button', function(event) {

				$(target).find('.upload-button').attr('disabled',"true");

				uploader.start();
				return false;
			});
		});

		//监听上传进度
		uploader.bind('UploadProgress',function(uploader,files){
			//file.percent
			$('#progressbar-'+files.id).progressbar({value:files.percent}); 
			$('#progressbar-'+files.id).attr("data-percent",files.percent);
			if(files.percent==100){
				$('#'+files.id).addClass('upload-files-success');
			}


			

			console.log("UploadProgress,uploader:",uploader);
			console.log("UploadProgress,files:",files);
		});
		//监听上传错误
		uploader.bind('Error',function(uploader,error){
			console.log("Error:",uploader,error);
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

				var preloader = new moxie.image.Image();
				preloader.onload = function() {
					preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
					var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
					callback && callback(imgsrc); //callback传入的参数为预览图片的url
					preloader.destroy();
					preloader = null;
				};
				preloader.load(file.getSource());
				

			}

		}

		function filetype(t){
			var s;
			switch(t.toLowerCase())
			{
			case "ai":
				s="file-icon-ai";
				break;
			case "download":
				s="file-icon-download";
				break;
			case "xls":
			case "xlsx":
			case "csv":
				s="file-icon-excel";
				break;
			case "folder":
				s="file-icon-folder";
				break;
			case "gif":
				s="file-icon-gif";
				break;
			case "html":
				s="file-icon-html";
				break;
			case "jpeg":
			case "jpg":
			case "png":
				s="file-icon-jpg";
				break;
			case "mp3":
				s="file-icon-mp3";
				break;
			case "pdf":
				s="file-icon-pdf";
				break;
			case "ppt":
				s="file-icon-ppt";
				break;
			case "psd":
				s="file-icon-psd";
				break;
			case "txt":
				s="file-icon-txt";
				break;
			case "upload":
				s="file-icon-upload";
				break;
			case "mp4":
			case "rmvb":
			case "rm":
			case "asf":
			case "divx":
			case "mpg":
			case "mpeg":
			case "mpe":
			case "wmv":
			case "mkv":
			case "vob":
				s="file-icon-video";
				break;
			case "doc":
			case "docx":
				s="file-icon-word";
				break;
			case "zip":
			case "rar":
				s="file-icon-zip";
				break;
			case "white":
			default:
				s="file-icon-white";
			}
			return s;
		}


		//-----------------------
	});

};

})(jQuery);