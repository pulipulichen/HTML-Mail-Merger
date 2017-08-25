// <textarea id="inpu_html_file_textarea" load_file_init="template.html"></textarea>

$(function () {
    var _textareas = $("textarea[load_file_init]");
    
    var _loop = function (_i) {
        if (_i < _textareas.length) {
            var _textarea = _textareas.eq(_i);
            var _filepath = _textarea.attr("load_file_init");
            $.get(_filepath, function (_data) {
                _textarea.val(_data);
                _i++;
                _loop(_i);
            });
        }
    };
    
    _loop(0);
});