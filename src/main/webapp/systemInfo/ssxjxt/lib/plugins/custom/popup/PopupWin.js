define(["dojo/_base/declare"], function (declare) {
    var z_index = 999; //z-index默认的初始值
    return declare("popup.PopupWin", null, {
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
                                 '<div class="easyui-layout easyui-draggable easyui-resizable ps-popupwin"  data-options="handle:\'.dragableTitle\'">' +
                                    '<div class="dragableTitle outerTopLayerout" data-options="region:\'north\',border:false">' +
                    '<div class="title">' + options.title + '</div>' +
                    '<div class="imgButton"><img class="maxBtn" style="display: none" src="img/popupwin/max.png" /><img class="minBtn"  src="img/popupwin/min.png" /><img class="closeBtn" src="img/popupwin/close.png" /></div>' +
               '</div>' +
            '<div data-options="region:\'center\',border:false"><div class="content">' + options.content + '</div></div>' +
            //'<div class="dragableTitle outerBottomLayerout"  data-options="region:\'south\',border:false"></div>' +
            '</div>' +
        '</div>' +
    '</div>';
                var div = $(html);
                div.find('.closeBtn')[0].onclick = function () {
//                    $("#" + winId).on("hidden.nifty.modal", function () {
//                        $("#" + winId).remove();
//                    });//IE9无效
                    $('#' + winId).nifty('hide');
                    setTimeout(function () { $("#" + winId).remove(); },500);
                }
                div.find('.minBtn')[0].onclick = function () {
                    $("#" + winId + " .ps-popupwin").animate({ "height": "0px" }, 700, function () {
                        $("#" + winId + " .minBtn").hide();
                        $("#" + winId + " .maxBtn").show();
                    });
                }
                div.find('.maxBtn')[0].onclick = function () {
                    $("#" + winId + " .ps-popupwin").animate({ "height": options.height }, 700, function () {
                        $("#" + winId + " .maxBtn").hide();
                        $("#" + winId + " .minBtn").show();
                    });
                }
                div.attr('id', this.id).css({ "z-index": z_index, "opacity": options.opacity, "top": options.top, "left": options.left, "width": options.width, "height": options.height });
                $(options.parentSelector).append(div);
                $.parser.parse($("#" + this.id));
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