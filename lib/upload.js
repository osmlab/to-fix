var fs = require('fs');

var core = require('./core'),
    _ = require('underscore');

var templates = {
    upload: _(fs.readFileSync('./templates/upload.html', 'utf8')).template()
};

var upload = {};

upload.init = function() {
    $('#main').append(templates.upload());

    var form = document.getElementById('upload-form'),
        file = document.getElementById('file'),
        submit = document.getElementById('submit'),
        name = document.getElementById('name'),
        password = document.getElementById('password');

    file.onchange = function() {
        name.focus();
    };

    submit.onclick = function(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', file.files[0]);
        formData.append('name', name.value);
        // I know
        formData.append('password', password.value);

        core.upload(formData, function(err) {
            if (err) return console.log(err);
            console.log('fuck you, it worked');
        });

    };
};

module.exports = upload;
