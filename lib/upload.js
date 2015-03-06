var fs = require('fs');

var _ = require('underscore');

var templates = {
    upload: _(fs.readFileSync('./templates/upload.html', 'utf8')).template()
};

var upload = {};

upload.init = function() {
    $('#main').append(templates.upload());

    var file = document.getElementById('file');
    var form = document.getElementById('upload-form');

    file.onchange = function(e) {
        e.preventDefault();
        var selected = file.files[0];
        var formData = new FormData();
        formData.append('csvfile', selected, selected.name);
    };
};

module.exports = upload;
