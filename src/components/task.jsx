'use strict';

require('mapbox.js');

var React = require('react');
var config = require('../config');
var EditBar = require('./workspace/editbar.jsx');
var MapState = require('../stores/mapstate');
var BingLayer = require('../ext/bing.js');

L.mapbox.accessToken = config.accessToken;

module.exports = React.createClass({
  componentDidMount: function() {

    var layers = {
      'Bing Satellite': new BingLayer(config.bing),
      'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', { detectRetina: false }),
      'Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
      'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
      })
    };

    // TODO Use mapstore to derrive options.
    this.map = L.mapbox.map(this.refs.map.getDOMNode(), {'mapbox_logo': true}, {
      maxZoom: 18,
      keyboard: false
    });

    this.map.zoomControl.setPosition('topright');
  },
  render: function() {
    return (
      /* jshint ignore:start */
      <div ref='map' className='mode active map fill-navy-dark'>
        <Editbar />
        <a href='#' id='iD_escape' className='hidden z10000 fill-orange button rcon next round animate pad1y pad2x strong'>Next task</a>
      </div>
      /* jshint ignore:end */
    );
  }
});
