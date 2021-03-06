var _main = function () {
    var _csv_string = $("#inpu_csv_file_textarea").val();
    //console.log(_csv_string);
    var _csv = csv_string_parse(_csv_string);
    var _template = $("#inpu_html_file_textarea").val();
    
    // ------------------------
    
    var _file_data = [];
    
    for (var _i in _csv) {
        var _row = _csv[_i];
        var _file_content = _template;
        var _file_name = _i + ".html";
        
        for (var _field_name in _row) {
            var _field_value = _row[_field_name];
            
            if (_field_name === "filename") {
                _file_name = _field_value;
                if (_file_name.endsWith(".html") === false 
                        && _file_name.endsWith(".htm") === false) {
                    _file_name = _file_name + ".html";
                }
            }
            
            var _field_name = "{" + _field_name + "}";
            
            _file_content = _file_content.split(_field_name).join(_field_value);
        }
        
        _file_data.push({
            filename: _file_name,
            content: _file_content
        });
    }
    
    //console.log(_file_data);
    //return;
    // ------------------------
    
    var zip = new JSZip();
    //zip.file("Hello.txt", "Hello World\n");
    //zip.file("Hello2.txt", "Hello World\n");
    for (var _i in _file_data) {
        zip.file(_file_data[_i].filename, _file_data[_i].content);
    }
    
    var _zip_name = "template-" + generate_time_string() + ".zip";
    
    zip.generateAsync({type: "blob"})
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, _zip_name);
            });
};

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
    //setTimeout(function () {
    //    _main();
    //}, 3000);
});