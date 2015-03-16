'use strict';

var Reflux = require('reflux');

var _mapstate = {
  zoom: 0,
  bearing: 0,
  center: { lat: 0, lng: 0 },
  bounds: []
};

module.exports = Reflux.createStore({
  init: function() {
    this.mapstate = _mapstate;
  }
});
