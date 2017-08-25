csv_string_parse = function (_csv_string) {
    var _csv = Papa.parse(_csv_string.trim());
    _csv = _csv.data;
    //console.log(_csv);
    var _data = [];
    
    var _field_names = _csv[0];
    
    for (var _i = 1; _i < _csv.length; _i++) {
        var _row = {};
        for (var _f = 0; _f < _field_names.length; _f++) {
            var _field_name = _field_names[_f];
            var _field_value = _csv[_i][_f];
            _row[_field_name] = _field_value;
        }
        _data.push(_row);
    }
    return _data;
};