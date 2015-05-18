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
      if (err) return cb(err);
      cb(null, res.body);
    });
  },

  postForm: function(path, formData, cb) {
    xhr({
      uri: config.taskServer + path,
      body: formData,
      method: 'POST',
    }, function(err, res) {
      if (err || res.statusCode === 400) return cb(err || res);
      cb(null, res.body);
    });
  },

  get: function(path, cb) {
    xhr({
      uri: config.taskServer + path,
      method: 'GET',
    }, function(err, res) {
      if (err) return cb(err);
      cb(null, JSON.parse(res.body));
    });
  }
};
