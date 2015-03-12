'use strict';

var fs = require('fs');
var $ = require('jquery');
var _ = require('underscore');

var core = require('./core');

var templates = {
    upload: _(fs.readFileSync('./templates/upload.html', 'utf8')).template()
};

var upload = {};

upload.init = function() {
    $('#main').append(templates.upload());

    var file = document.getElementById('file');
    var submit = document.getElementById('submit');
    var name = document.getElementById('name');
    var password = document.getElementById('password');

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
        });

    };
};

module.exports = upload;
