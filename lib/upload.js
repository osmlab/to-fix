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

        $('#upload-form').addClass('loading');

        core.upload(formData, function(err) {
            $('#upload-form').removeClass('loading');
            if (err) return console.log(err);
            window.location.href = '/?error=' + name.value.replace(/[^a-zA-Z]+/g, '').toLowerCase();
        });

    };
};

module.exports = upload;
