'use strict';

var $ = require('jquery');
var _ = require('underscore');
var fs = require('fs');
var template = _(fs.readFileSync('./templates/activity.html', 'utf8')).template();

module.exports = {
    init: function() {
        // map is already initialized
        if ($('#activity').length) return;
        $('#main').append(template());
    }
};
