define(["dojo/_base/declare"], function (declare) {
    var z_index = 999; //z-index默认的初始值
    return declare("NewPopup.NewPopupWin", null, {
        id: null,
        options: null,
        constructor: function (inputOptions) {
            var options = this.getDefaultOptions();
            dojo.mixin(options, inputOptions);
            this.id = options.id;
            this.options = options;
            var winId = options.id;
            if ($('#' + this.id).length == 0) {
                var offset = $(options.parentSelector).offset();
                var html = '<div id="'+this.id+'" title="' + options.title + '">'+ options.content + '</div>';
                var div = $(html);
                $(options.parentSelector).append(div);
                $('#' + this.id).dialog({
                	width:options.width,
                	height: options.height,
                	show: { effect: "blind", duration: 800 },
                	position: options.position,
                	close: function(ev, ui) { $('#' + this.id).dialog("close"); }
			    });
			    if(options.position.length==0){
			    	$("#" + this.id).css("opacity", options.opacity);
			    	$("#" + this.id).css("z-index", 2);
			    }
            } else {
            	$('#' + this.id).dialog("open");
            }
            if(options.position.length==0){
				$("#" + this.id).parent().css('top', Number(options.top)+115+"px");
				$("#" + this.id).parent().css('left',Number(options.left)+70+"px");
			}
        },
        getDefaultOptions: function () {
            return {
                content: '',
                parentSelector: 'body',
                opacity: 1,
                title: "",
                top: '0px',
                left: '0px',
                width: '0px',
                height: '0px',
                position: {}
            }
        },
        min: function () {
            var winId = this.id;
            $("#" + winId + " .ps-popupwin").animate({ "height": "0px" }, 700, function () {
                $("#" + winId + " .minBtn").hide();
                $("#" + winId + " .maxBtn").show();
            });
        },
        max: function () {
            var winId = this.id;
            $("#" + winId + " .ps-popupwin").animate({ "height": this.options.height }, 700, function () {
                $("#" + winId + " .maxBtn").hide();
                $("#" + winId + " .minBtn").show();
            });
        }
    });
})