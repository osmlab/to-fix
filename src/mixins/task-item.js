'use strict';

var tasks = require('../data/tasks.json').tasks;

module.exports = function(task) {
  return tasks.filter(function(t) {
    return t.id === task;
  })[0];
};
