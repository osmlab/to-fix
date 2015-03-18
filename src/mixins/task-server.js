'use strict';

var xhr = require('xhr');
var config = require('../config');

module.exports = {
  post: function(path, data, cb) {
    xhr({
      uri: config.taskServer + path,
      json: data,
      method: 'POST',
    }, function(err, res) {
      if (err) cb(err);
      cb(null, res.body);
    });
  }
};
