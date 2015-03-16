'use strict';

require('mapbox.js');

var React = require('react');
var Router = require('react-router');

var actions = require('../actions/actions');
var config = require('../config');
var EditBar = require('./workspace/editbar.jsx');
var MapState = require('../stores/mapstate');
var BingLayer = require('../ext/bing.js');

L.mapbox.accessToken = config.accessToken;

module.exports = React.createClass({
  mixins: [Router.State],

  statics: {
    fetchData: function(params) {
      actions.source.load(params.task);
    }
  },

  componentDidMount: function() {
    // TODO Use mapstore to derrive options.
    this.map = L.mapbox.map(this.refs.map.getDOMNode(), {'mapbox_logo': true}, {
      maxZoom: 18,
      keyboard: false
    });

    // Transparent street layer to add context to Bing Satellite imagery
    var transparentStreets = L.mapbox.tileLayer('aaronlidman.87d3cc29', {
      detectRetina: false
    });

    var layers = {
      'Bing Satellite': new BingLayer(config.bing, function() {}),
      'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', { detectRetina: false }),
      'Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
      'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
      })
    };

    // Map controls
    this.map.zoomControl.setPosition('topright');
    L.control.layers(layers).addTo(this.map);

    // TODO pull the baselayer name from mapstore
    layers['Streets'].addTo(this.map);

    // Record state in map
    this.map.on('baseLayer', function(e) {
      // TODO store the name of the baselayer
      console.log(e.name);
    });
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
