/**
 * 播放指定声音文件
 * 调用方式 $.audioPlay();可选参数
 * {
 *    id: '', // 声音文件元素id标识
 *    urlMp3: '', // .mp3格式声音文件路径
 *    urlOgg: '' // .ogg格式声音文件路径
 * }
 * 注意事项：若声音资源使用相对路径，则是相对于调用者的url寻找资源，或者使用绝对路径
 */
(function($) {
    $.audioPlay = function(options) {
        var defaults = {
            id: 'audioPlay',
            urlMp3: '/src/core/audios/beep.mp3',
            urlOgg: '/src/core/audios/beep.ogg'
        };
        var params = $.extend(defaults, options || {});
        var targetId = 'j-audio-' + params.id;
        var targetIdSelector = '#' + targetId;

        if ($(targetIdSelector).length === 0) {
            var audioHtml = '<audio id="' + targetId + '" controls="controls" preload="auto" style="position:absolute; visibility:hidden;">' +
                '<source src="' + params.urlMp3 + '"></source>' +
                '<source src="' + params.urlOgg + '"></source>' +
                '</audio>';

            $("body").append(audioHtml);
        }

        $(targetIdSelector).get(0).play();
    }
})(jQuery);
