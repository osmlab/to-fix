var fs = require('fs');

var _ = require('underscore');

var templates = {
    upload: _(fs.readFileSync('./templates/upload.html', 'utf8')).template()
};

var upload = {};

upload.init = function() {
};

module.exports = upload;
