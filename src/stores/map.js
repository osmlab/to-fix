'use strict';

var Reflux = require('reflux');
var actions = require('../actions/actions');
var store = require('store');
var xhr = require('xhr');
var taskObj = require('../mixins/task-item');
var config = require('../config');

module.exports = Reflux.createStore({
  data: {},

  init: function() {
    this.data = {
      key: '',
      value: {},
      mapData: [],
      baseLayer: store.get('baseLayer') ? store.get('baseLayer') : null
    };
    this.listenTo(actions.taskData, this.taskData);
    this.listenTo(actions.baseLayerChange, this.baseLayerChange);
  },

  getInitialState: function() {
    return this.data;
  },

  taskData: function(task) {
    task = taskObj(task);
    var _this = this;

    // Clear out what mapData there is
    this.data.mapData = [];

    this.postToTaskServer('error/' + task.id, function(err, res) {
      if (err) return console.error(err);
      _this.data.key = res.key;
      _this.data.value = res.value;

      switch (task.source) {
        case 'keepright':
          _this.fetchKeepRight(function(err, res) {
            if (err) return console.error(err);
            _this.trigger(_this.data);
          });
        break;
        case 'unconnected':
          _this.fetchUnconnected(function(err, res) {
            if (err) return console.error(err);
            _this.trigger(_this.data);
          });
        break;
      }
    });
  },

  fetchKeepRight: function(cb) {
    // Provider: http://keepright.ipax.at/
    var _this = this;
    var full = (this.data.value.object_type === 'way') ? '/full' : '';
    var uri = config.osmApi + this.data.value.object_type + '/' + this.data.value.object_id + full;
    xhr({uri: uri}, function(err, res) {
      if (err) cb(err);
      _this.data.mapData.push(res.body);
      cb(null);
    });
  },

  fetchUnconnected: function(cb) {
    var _this = this;
    var uri = config.osmApi + 'way/' + this.data.value.object_id + '/full';
    xhr({uri: uri}, function(err, res) {
      if (err) cb(err);
      _this.data.mapData.push(res.body);
      uri = config.osmApi + 'node/' + _this.data.value.object_id;
      xhr({uri: uri}, function(err, res) {
        if (err) cb(err);
        _this.data.mapData.push(res.body);
        cb(null);
      });
    });
  },

  postToTaskServer: function(path, cb) {
    xhr({
      uri: config.taskServer + path,
      method: 'POST',
      json: {user: store.get('username')}
    }, function(err, res) {
      if (err) cb(err);
      cb(null, res.body);
    });
  },

  baseLayerChange: function(name) {
    store.set('baseLayer', name);
  }

});
