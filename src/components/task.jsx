'use strict';

require('mapbox.js');
require('leaflet-osm');

var omnivore = require('leaflet-omnivore');

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var actions = require('../actions/actions');
var config = require('../config');
var EditBar = require('./workspace/editbar.jsx');
var MapStore = require('../stores/map');
var BingLayer = require('../ext/bing.js');

L.mapbox.accessToken = config.accessToken;

module.exports = React.createClass({
  mixins: [
    Reflux.connect(MapStore, 'map'),
    Router.State
  ],

  statics: {
    fetchData: function(params) {
      // actions.taskData(params.task);
    }
  },

  componentDidUpdate: function() {
    console.log(this.state);
  },

  componentDidMount: function() {
    var layers = {
      'Bing Satellite': new BingLayer(config.bing, function() {}),
      'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g'),
      'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
      'OpenStreetMap': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
      })
    };

    var map = L.mapbox.map(this.refs.map.getDOMNode(), 'tristen.1b4be4af', {
      maxZoom: 18,
      keyboard: false
    });

    // Transparent street layer to add context to Bing Satellite imagery
    var transparentStreets = L.mapbox.tileLayer('aaronlidman.87d3cc29');

    // Map controls
    map.zoomControl.setPosition('topright');

    var initialLayer = (this.state.map.baseLayer) ?
      this.state.map.baseLayer : 'Mapbox Streets';

    layers[initialLayer].addTo(map);
    L.control.layers(layers).addTo(map);

    // Record state in map
    map.on('baselayerchange', function(e) {
      actions.baseLayerChange(e.name);

      if (e.name === 'Bing Satellite') {
        transparentStreets.addTo(map).bringToFront();
      } else if (map.hasLayer(transparentStreets)) {
        map.removeLayer(transparentStreets); 
      }
    });

    this.map = map;
  },
  render: function() {
    return (
      /* jshint ignore:start */
      <div ref='map' className='mode active map fill-navy-dark'>
        <EditBar />
        <a href='#' id='iD_escape' className='hidden z10000 fill-orange button rcon next round animate pad1y pad2x strong'>Next task</a>
      </div>
      /* jshint ignore:end */
    );
  }
});
