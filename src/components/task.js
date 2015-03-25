'use strict';

require('mapbox.js');
require('leaflet-osm');

var omnivore = require('leaflet-omnivore');

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var store = require('store');
var actions = require('../actions/actions');
var config = require('../config');
var qs = require('querystring');
var xhr = require('xhr');
var EditBar = require('./workspace/editbar');
var MapStore = require('../stores/map_store');
var BingLayer = require('../ext/bing.js');

L.mapbox.accessToken = config.accessToken;
var geocoder = L.mapbox.geocoder('mapbox.places');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(MapStore, 'map'),
    Reflux.listenTo(actions.taskEdit, 'taskEdit'),
    Router.State
  ],

  statics: {
    fetchData: function(params) {
      actions.taskData(params.task);
    }
  },

  componentDidUpdate: function() {
    var taskLayer = this.taskLayer;
    var map = this.map;

    // Clear any previously set layers in taskLayer
    if (taskLayer && taskLayer.getLayers()) {
      taskLayer.getLayers().forEach(function(l) {
        taskLayer.removeLayer(l);
      });
    }

    if (this.state.map.mapData) {
      this.state.map.mapData.forEach(function(xml) {
        var layer = new L.OSM.DataLayer(xml)
          .setStyle({
            color: '#FF00B7',
            opacity: 1,
            weight: 4
          })
          .addTo(taskLayer);
        map.fitBounds(layer.getBounds(), { reset: true });
        this.geolocate(map.getCenter());
      }.bind(this));
    }
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

    this.taskLayer = L.featureGroup().addTo(map);
    this.map = map;
  },

  taskEdit: function() {
    var _this = this;
    var bounds = this.map.getBounds();
    var state = this.state.map;
    var center = this.map.getCenter();
    var zoom = this.map.getZoom();
    var bottom = bounds._southWest.lat - 0.0005;
    var left = bounds._southWest.lng - 0.0005;
    var top = bounds._northEast.lat + 0.0005;
    var right = bounds._northEast.lng + 0.0005;
    var iDEditPath = config.iD + 'map=' + zoom + '/' + center.lng + '/' + center.lat;

    if (store.get('editor') && store.get('editor') === 'josm') {
      // Try JOSM first
      xhr({
        uri: config.josm + qs.stringify({
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          select: state.value + state.key
        })
      }, function(err, res) {
        // Fallback to iD
        if (err) {
          _this.setState({
            iDEdit: true,
            iDSrcAttribute: iDEditPath
          });
        }
      });
    } else {
      // Default is the iD editor
      _this.setState({
        iDEdit: true,
        iDSrcAttribute: iDEditPath
      });
    }
  },

  iDEditDone: function() {
    // Set editor state as complete and trigger the done action
    this.setState({ iDEdit: false });
    actions.taskData(this.getParams().task);
  },

  geolocate: function(center) {
    geocoder.reverseQuery([center.lng, center.lat], function(err, res) {
      if (res && res.features && res.features[0] && res.features[0].context) {
        var place = res.features[0].context.reduce(function(memo, context) {
          var id = context.id.split('.')[0];
          if (id === 'place' || id === 'region' || id === 'country') memo.push(context.text);
          return memo;
        }, []);
        actions.geolocated(place.join(', '));
      }
    });
  },

  render: function() {
    var iDEditor = '';
    if (this.state.iDEdit) {
      iDEditor = (
      /* jshint ignore:start */
      <div>
        <iframe src={this.state.iDSrcAttribute} frameBorder='0' className='ideditor'></iframe>
        <button onClick={this.iDEditDone} className='ideditor-done z10000 fill-orange button rcon next round animate pad1y pad2x strong'>Next task</button>
      </div>
      /* jshint ignore:end */
      );
    }

    return (
      /* jshint ignore:start */
      <div ref='map' className='mode active map fill-navy-dark'>
        <EditBar />
        {iDEditor}
      </div>
      /* jshint ignore:end */
    );
  }
});
