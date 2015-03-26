'use strict';

var Reflux = require('reflux');
var actions = require('../actions/actions');
var store = require('store');
var xhr = require('xhr');

var taskObj = require('../mixins/taskobj');
var emitError = require('../mixins/error');
var postToTaskServer = require('../mixins/taskserver').post;

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
    this.listenTo(actions.taskDone, this.taskDone);
    this.listenTo(actions.baseLayerChange, this.baseLayerChange);
    this.listenTo(actions.taskSkip, this.taskSkip);
    this.listenTo(actions.taskEdit, this.taskEdit);
  },

  getInitialState: function() {
    return this.data;
  },

  taskDone: function(task) {
    postToTaskServer('fixed/' + task, {
      user: store.get('username'),
      key: this.data.key
    }, function(err, res) {
      if (err) return emitError(err);
        this.taskData(task);
    }.bind(this));
  },

  taskData: function(task) {
    task = taskObj(task);
    var _this = this;

    // Clear out what mapData there is
    this.data.mapData = [];

    postToTaskServer('task/' + task.id, {
      user: store.get('username')
    }, function(err, res) {
      if (err) return emitError(err);
      _this.data.key = res.key;
      _this.data.value = res.value;

      switch (task.source) {
        case 'keepright':
          _this.fetchKeepRight(function(err, res) {
            if (err) return emitError(err);
            _this.trigger(_this.data);
          });
        break;
        case 'unconnected':
          _this.fetchUnconnected(function(err, res) {
            if (err) {
              emitError(err);
              return _this.taskDone(task.id);
            }
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
    xhr({uri: uri, responseType: 'document'}, function(err, res) {
      if (err) return cb(err);
      _this.data.mapData.push(res.body);
      cb(null);
    });
  },

  fetchUnconnected: function(cb) {
    var _this = this;
    var uri = config.osmApi + 'way/' + _this.data.value.way_id + '/full';

    xhr({uri: uri, responseType: 'document'}, function(err, res) {
      if (err || res.statusCode != 200) return cb(err || { status: res.statusCode });
      _this.data.mapData.push(res.body);
      uri = config.osmApi + 'node/' + _this.data.value.node_id;

      xhr({uri: uri, responseType: 'document'}, function(err, res) {
        if (err || res.statusCode != 200) return cb(err || { status: res.statusCode });
        _this.data.mapData.push(res.body);
        cb(null);
      });

    });

  },

  baseLayerChange: function(name) {
    store.set('baseLayer', name);
  },

  taskSkip: function(task) {
    track(task, {
      user: store.get('username'),
      action: 'skip',
      key: this.data.key
    });
  },

  taskEdit: function(task) {
    track(task, {
      user: store.get('username'),
      action: 'edit',
      key: this.data.key,
      editor: store.get('editor')
    });
  }

});

function track(task, attributes) {
    postToTaskServer('track/' + task, {
      attributes: attributes
    }, function(err, res) {
      if (err) console.log(err);
    });
}
