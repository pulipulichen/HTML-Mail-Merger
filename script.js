
var _combine_input = function () {
	// 開頭設定
	var _result = "https://www.facebook.com/sharer/sharer.php?";
        var _panel = $(".file-process-framework");
	
        
	// ------------------------------------------
        // 資料處理設定
        var _data = [];
        _panel.find(".share-custom-parameters").each(function (_i, _ele) {
            var _val = _ele.value.trim();
            if (_val !== "") {
                var _key = _ele.id.replace("input_", "");
                _data.push(_key+"="+encodeURIComponent(_val));
            }
        });
        
        _result = _result + _data.join("&");
        
        var _option = 'toolbar=0,status=0';
        
        _result = 'javascript:window.open("' + _result + '", "_blank", "' + _option + '")';
        
        // ------------------------------------------
	// 結束設定
        
	var _input = _panel.find("#preview");
	_input.val(_result);

        var _result_html = $('<div><a>'
            //+ '分享到Facebook' 
            + '<img src="https://pulipulichen.github.io/blog-pulipuli-info-data-2017/04/facebook-share/facebook-logo-white.svg" width="13" height="13" /> '
            //+ "分享"
            + $("#input_button").val().trim()
            + '</a></div>');
        _result_html.css({
            "background-color": "#5D7DAE",
            //"height": "24px",
            //"width": "80px",
            "border-radius": "6px",
            "display": "inline-block"
        });
        
        _result_html.find("a img").css({
            "margin-top": '3px',
            "margin-bottom": '-2px',
        });
        
        _result_html.find("a").css({
            'font-size':'13px',
            'font-weight':'bold',
            'text-align':'center',
            'color':'#fff',
            'border':'1px solid #FFF',
            //'background-color':'#5D7DAE',
            'padding':'2px 10px',
            'cursor':'pointer',
            'text-decoration':'none',
            //'width':'80px',
            'display':'block'
        });
        
        _result_html.find("a").attr("href", _result);
	_panel.find("#preview_html").html(_result_html);
        var _div = $("<div></div>");
        _result_html.clone().appendTo(_div);
        _panel.find("#preview_html_source").val(_div.html());
        
};	// var _combine_input = function () {

// ------------------------------------------------------

tinyMCE.init({
	mode : "specific_textareas",
	editor_selector : "mceEditor",
	plugins: [
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
  ],
  toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image  tableprops',
  toolbar2: 'print preview media | forecolor backcolor emoticons | codesample code ',

	setup:function(ed) {
	   ed.on('change', function(e) {
		   //console.log('the content ', ed.getContent());
		   _combine_input();
	   });
    }
});

var _convert_spec_to_table = function (_spec) {
	
	var _lines = _spec.split("\n");
	
	var _table = $('<div><table border="0" cellpadding="3" cellspacing="3"><tbody></tbody></table></div>');
	var _tbody = _table.find("tbody");
	
	for (var _i = 0; _i < _lines.length; _i++) {
		var _line = _lines[_i];
		
		if (_line.substr(0,1) === " ") {
			// 表示是前一格的內容
			_tbody.find("td:last").append("<br />" + _line);
		}
		
		var _pos = _line.indexOf(":");
		var _pos2 = _line.indexOf("：");
		if (_pos2 !== -1 && _pos2 < _pos) {
			_pos = _pos2;
		}
		
		if (_pos === -1) {
			continue;
		}
		
		var _title = _line.substr(0, _pos).trim();
		var _value = _line.substring(_pos+1, _line.length).trim();
		
		var _value_bg = '#fde4d0';
		if (_tbody.find("tr").length % 2 === 0) {
			_value_bg = '#fbcaa2';
		}
		
		var _value_style = "";
		if (_title === "有緣價") {
			_value_style = "font-weight: bold; color: red;";
		}
		
		var _tr = $('<tr>' 
			+ '<td style="text-align:right;padding: 5px; color: white; background: #f79646; font-weight: bold;">' + _title + '</td>'
			+ '<td style="padding: 5px; background: ' + _value_bg + ';' + _value_style + '">' + _value + '</td>'
			+ '</tr>').appendTo(_tbody);
		
	}
	
	return _table.html();
};	// var _convert_spec_to_table = function (_spec) {

// --------------------------

var _process_file = function(_input, _callback) {
	_callback(_input);        
};

var _output_filename_surffix="_output";


// -------------------------------------

var _load_file = function(evt) {
    //console.log(1);
    if(!window.FileReader) return; // Browser is not compatible

    var _panel = $(".file-process-framework");
    
    _panel.find(".loading").removeClass("hide");

    var reader = new FileReader();
    var _result;

    var _file_name = evt.target.files[0].name;
    
    reader.onload = function(evt) {
        if(evt.target.readyState !== 2) return;
        if(evt.target.error) {
            alert('Error while reading file');
            return;
        }

        //filecontent = evt.target.result;

        //document.forms['myform'].elements['text'].value = evt.target.result;
        _result =  evt.target.result;

        _process_file(_result, function (_result) {
            _panel.find(".preview").val(_result);
            _panel.find(".filename").val(_file_name);
                        
            $(".file-process-framework .myfile").val("");
            $(".file-process-framework .loading").addClass("hide");
            _panel.find(".display-result").show();
            _panel.find(".display-result .encoding").show();

            var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
            if (_auto_download === true) {
                _panel.find(".download-file").click();
            }
            
            //_download_file(_result, _file_name, "txt");
        });
    };

    var _pos = _file_name.lastIndexOf(".");
    _file_name = _file_name.substr(0, _pos)
        + _output_filename_surffix
        + _file_name.substring(_pos, _file_name.length);

    //console.log(_file_name);

    reader.readAsText(evt.target.files[0]);
};

var _load_textarea = function(evt) {
    var _panel = $(".file-process-framework");
    
    // --------------------------

    var _result = _panel.find(".input-mode.textarea").val();
    if (_result.trim() === "") {
        return;
    }

    // ---------------------------
    
    _panel.find(".loading").removeClass("hide");

    // ---------------------------
    var d = new Date();
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
  
    var local = new Date(utc);
    var _file_name = local.toJSON().slice(0,19).replace(/:/g, "-");
    _file_name = "output_" + _file_name + ".txt";

    // ---------------------------

    _process_file(_result, function (_result) {
        _panel.find(".preview").val(_result);
        _panel.find(".filename").val(_file_name);

        _panel.find(".loading").addClass("hide");
        _panel.find(".display-result").show();
        _panel.find(".display-result .encoding").hide();

        var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
        if (_auto_download === true) {
            _panel.find(".download-file").click();
        }
    });
};

var _download_file_button = function () {
    var _panel = $(".file-process-framework");
    
    var _file_name = _panel.find(".filename").val();
    var _data = _panel.find(".preview").val();
    
    _download_file(_data, _file_name, "txt");
};


var _download_file = function (data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

};

$(function () {
  var _panel = $(".file-process-framework");
  _panel.find(".input-mode.textarea").click(_load_textarea).keyup(_load_textarea);
  _panel.find(".myfile").change(_load_file);
  _panel.find(".download-file").click(_download_file_button);
  _panel.find(".input-field").change(_combine_input);
  
  _panel.find(".focus_select").focus(function () {
      $(this).select();
  });
  
  //$('.menu .item').tab();
  
  
  $('#copy_source_code').click(function () {
      PULI_UTIL.clipboard.copy($("#preview").val());
  });
  
  $('#copy_source_code_html').click(function () {
      PULI_UTIL.clipboard.copy($("#preview_html_source").val());
  });
  
  _combine_input();
});