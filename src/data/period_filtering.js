'use strict';

var d3 = require('d3');
var dateFormat = d3.time.format('%Y-%m-%d');
var today = dateFormat(new Date());

module.exports = {

  'day' : [
    dateFormat(new Date()),
    today
  ],

  'halfweek' : [
    dateFormat(d3.time.day.offset(new Date(), -3)),
    today
  ],

  'week' : [
    dateFormat(d3.time.day.offset(new Date(), -7)),
    today
  ],

  'month' : [
    dateFormat(d3.time.day.offset(new Date(), -30)),
    today
  ]

};
