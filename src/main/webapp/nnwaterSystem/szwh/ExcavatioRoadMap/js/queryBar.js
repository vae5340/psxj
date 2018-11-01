(function($){
	$("#startTime").datetimepicker({
		language: 'zh-CN',
	  	format: 'yyyy-mm-dd',
	  	autoclose:true,
	  	minView:2,
	  	pickerPosition:'bottom-right'
	});
	$("#endTime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:2,
		pickerPosition:'bottom-right'
	});
})(jQuery);