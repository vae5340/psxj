define(["dojo/_base/declare"], function (declare) {
    var z_index = 999; //z-index默认的初始值
    return declare("InfoPanel.InfoPanel", null, {
        id: null,
        options: null,
        constructor: function (inputOptions) {
            var options = this.getDefaultOptions();
            dojo.mixin(options, inputOptions);
            this.id = options.id;
            this.options = options;
            var winId = options.id;
            if (!this.id) alert("请输入弹出框的ID");
            if ($('#' + this.id).length == 0) {
                var offset = $(options.parentSelector).offset();
                var html = '<div class="slide-in-top-stuck poopupwinDiv">' +
                    '<div class="md-content" style="width: 100%; height: 100%;">' +
                    '<div class="easyui-layout ps-infowin" >' +
            		'<div data-options="region:\'center\',border:false"><div class="content">' + options.content + '</div></div>' +
            		'</div></div>';
                var div = $(html);
                div.attr('id', this.id).css({ "z-index": 31, "opacity": options.opacity, "top": options.top, "left": options.left, "width": options.width, "height": options.height });
                $(options.parentSelector).append(div);
                //$.parser.parse($("#" + this.id).parent());
                $('#' + this.id).nifty('show');
            } else {
                $("#" + winId).css("z-index", z_index++);
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
                width: '100px',
                height: '100px'
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