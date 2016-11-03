import React, { Component } from 'react';

class Task extends Component {
  render() {
    return <p>Task</p>;
  }
}

export default Task;

// 'use strict';
//
// import React from 'react';
// import Reflux from 'reflux';
// import { withRouter } from 'react-router';
// import qs from 'querystring';
// import xhr from 'xhr';
// import store from 'store';
// import omnivore from 'leaflet-omnivore/leaflet-omnivore';
// import wellknown from 'wellknown';
//
// import actions from '../actions/actions';
// import * as config from '../config';
// import EditBar from './workspace/editbar';
// import MapStore from '../stores/map_store';
// import BingLayer from '../ext/bing.js';
//
// import 'mapbox.js';
// import 'leaflet-osm';
// const L = window.L;
//
// L.mapbox.accessToken = config.accessToken;
// var geocoder = L.mapbox.geocoder('mapbox.places');
//
// const Task = React.createClass({
//   mixins: [
//     Reflux.connect(MapStore, 'map'),
//     Reflux.listenTo(actions.taskEdit, 'taskEdit')
//   ],
//
//   statics: {
//     fetchData: function(params) {
//       actions.taskData(params.task);
//     }
//   },
//
//   componentDidUpdate: function() {
//     var taskLayer = this.taskLayer;
//     var map = this.map;
//
//     // Clear any previously set layers in taskLayer
//     if (taskLayer && taskLayer.getLayers()) {
//       taskLayer.getLayers().forEach(function(l) {
//         taskLayer.removeLayer(l);
//       });
//     }
//
//     var task = this.props.params.task;
//
//     //Get task objetc
//     var tasks = store.get('tasks');
//     var objtask = tasks.filter(function(val) {
//       return val.id === task;
//     })[0];
//
//     if (this.state.map.mapData.length) {
//
//       this.state.map.mapData.forEach(function(xml) {
//         var layer = new L.OSM.DataLayer(xml).addTo(taskLayer);
//         map.fitBounds(layer.getBounds(), { reset: true });
//         this.geolocate(map.getCenter());
//       }.bind(this));
//
//     } else if (task == 'smallcomponents') {
//
//       L.tileLayer('http://tools.geofabrik.de/osmi/tiles/routing_i/{z}/{x}/{y}.png').addTo(map).bringToFront();
//
//       var layer = omnivore.wkt.parse(this.state.map.value.geom).addTo(taskLayer);
//       map.fitBounds(layer.getBounds(), { reset: true });
//       this.geolocate(map.getCenter());
//
//     } else if (task == 'rk') {
//
//       var rkTraces = L.mapbox.tileLayer('matt.8fafe5ff');
//       rkTraces.addTo(map).bringToFront();
//
//       var geom = wellknown.parse(this.state.map.value.geom);
//
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 5
//       };
//
//       if (geom.type == 'MultiPoint') {
//         geom.coordinates.forEach(function(coords) {
//           L.circleMarker([coords[1], coords[0]], circleOptions).addTo(taskLayer);
//         });
//       }
//
//       if (geom.type == 'Point') {
//         L.circleMarker([geom.coordinates[1], geom.coordinates[0]], circleOptions).addTo(taskLayer);
//       }
//
//       var layer = omnivore.wkt.parse(this.state.map.value.geom);
//         // create the layer but don't actually use it, only for getBounds
//       map.fitBounds(layer.getBounds(), { reset: true });
//       this.geolocate(map.getCenter());
//
//     } else if (task == 'overlaphighwaysus' || task == 'highwayhighway') {
//
//       var geom = wellknown.parse(this.state.map.value.geom);
//
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 5
//       };
//
//       if (geom.type == 'MultiPoint') {
//         geom.coordinates.forEach(function(coords) {
//           L.circleMarker([coords[1], coords[0]], circleOptions).addTo(taskLayer);
//         });
//       }
//
//       if (geom.type == 'Point') {
//         L.circleMarker([geom.coordinates[1], geom.coordinates[0]], circleOptions).addTo(taskLayer);
//       }
//
//       var layer = omnivore.wkt.parse(this.state.map.value.geom);
//         // create the layer but don't actually use it, only for getBounds
//       map.fitBounds(layer.getBounds(), { reset: true });
//       this.geolocate(map.getCenter());
//
//     } else if (task == 'strava') {
//
//       var stravaCycling = L.tileLayer('http://globalheat.strava.com/tiles/cycling/color3/{z}/{x}/{y}.png', {
//         maxNativeZoom: 17
//       });
//       var stravaWalking = L.tileLayer('http://globalheat.strava.com/tiles/walking/color5/{z}/{x}/{y}.png', {
//         maxNativeZoom: 17
//       });
//       stravaCycling.addTo(map).bringToFront();
//       stravaWalking.addTo(map).bringToFront();
//
//       var geom = wellknown.parse(this.state.map.value.geom);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 5
//       };
//
//       // make a point from the geom.
//       var point = L.latLng(geom.coordinates[1], geom.coordinates[0]);
//       L.circleMarker(point, circleOptions).addTo(taskLayer);
//       map.setView(point, 17);
//       this.geolocate(map.getCenter());
//
//     } else if (task == 'unconnectedtownsindia') {
//       var geom = wellknown.parse(this.state.map.value.geom);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 8
//       };
//
//       var point = L.latLng(geom.coordinates[1], geom.coordinates[0]);
//       L.circleMarker(point, circleOptions).addTo(taskLayer);
//       map.setView(point, 15);
//       this.geolocate(map.getCenter());
//
//     } else if (task == 'roundaboutusa') {
//       var geom = wellknown.parse(this.state.map.value.geom);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 10
//       };
//
//       var point = L.latLng(geom.coordinates[1], geom.coordinates[0]);
//       L.circleMarker(point, circleOptions).addTo(taskLayer);
//       map.setView(point, 18);
//       this.geolocate(map.getCenter());
//     } else if(task == 'unconnectedminor' || task == 'unconnectedmajor' || task == 'unconnectedpaths') {
//       var geom = wellknown.parse(this.state.map.value.st_astext);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 10
//       };
//       if (geom.type == 'Point') {
//         L.circleMarker([geom.coordinates[1], geom.coordinates[0]], circleOptions).addTo(taskLayer);
//       }
//       var layer = omnivore.wkt.parse(this.state.map.value.st_astext);
//       map.fitBounds(layer.getBounds(), {
//         reset: true
//       });
//       this.geolocate(map.getCenter());
//     }
//     //Work using the source of task
//     else if (objtask.source === 'osmlint-point') {
//       var geom = wellknown.parse(this.state.map.value.geom);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 10
//       };
//       if (geom.type == 'Point') {
//         L.circleMarker([geom.coordinates[1], geom.coordinates[0]], circleOptions).addTo(taskLayer);
//       }
//       var layer = omnivore.wkt.parse(this.state.map.value.geom);
//       map.fitBounds(layer.getBounds(), {
//         reset: true
//       });
//       this.geolocate(map.getCenter());
//     }
//
//     else if (objtask.source === 'osmlint-multipoint') {
//       var geom = wellknown.parse(this.state.map.value.geom);
//       var circleOptions = {
//         stroke: false,
//         color: '#fff',
//         opacity: 0.1,
//         fillColor: '#03f',
//         fillOpacity: 0.5,
//         fill: true,
//         weight: 0,
//         radius: 5
//       };
//       if (geom.type == 'Point') {
//         L.circleMarker([geom.coordinates[1], geom.coordinates[0]], circleOptions).addTo(taskLayer);
//       }
//
//       if (geom.type == 'MultiPoint') {
//         geom.coordinates.forEach(function(coords) {
//           L.circleMarker([coords[1], coords[0]], circleOptions).addTo(taskLayer);
//         });
//       }
//
//       var layer = omnivore.wkt.parse(this.state.map.value.geom);
//       map.fitBounds(layer.getBounds(), {
//         reset: true
//       });
//       this.geolocate(map.getCenter());
//     }
//
//     else if (objtask.source === 'osmlint-linestring') {
//       L.tileLayer('http://tools.geofabrik.de/osmi/tiles/routing_i/{z}/{x}/{y}.png').addTo(map).bringToFront();
//       var layer = omnivore.wkt.parse(this.state.map.value.geom).addTo(taskLayer);
//       map.fitBounds(layer.getBounds(), {
//         reset: true
//       });
//       this.geolocate(map.getCenter());
//     }
//   },
//
//   componentDidMount: function() {
//     var layers = {
//       'Bing Satellite': new BingLayer(config.bing, function() {}),
//       'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g'),
//       'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
//       'OpenStreetMap': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
//       })
//     };
//
//     var map = L.mapbox.map(this.mapContainer, 'tristen.1b4be4af', {
//       maxZoom: 18,
//       keyboard: false
//     });
//
//     // Transparent street layer to add context to Bing Satellite imagery
//     var transparentStreets = L.mapbox.tileLayer('aaronlidman.87d3cc29');
//
//     // Map controls
//     map.zoomControl.setPosition('topright');
//
//     var initialLayer = (this.state.map.baseLayer) ?
//       this.state.map.baseLayer : 'Mapbox Streets';
//
//     layers[initialLayer].addTo(map);
//     L.control.layers(layers).addTo(map);
//
//     // Record state in map
//     map.on('baselayerchange', function(e) {
//       actions.baseLayerChange(e.name);
//
//       if (e.name === 'Bing Satellite') {
//         transparentStreets.addTo(map).bringToFront();
//       } else if (map.hasLayer(transparentStreets)) {
//         map.removeLayer(transparentStreets);
//       }
//     });
//
//     this.taskLayer = L.featureGroup().addTo(map);
//     this.map = map;
//   },
//
//   taskEdit: function() {
//     var _this = this;
//     var bounds = this.map.getBounds();
//     var state = this.state.map;
//     var center = this.map.getCenter();
//     var zoom = this.map.getZoom();
//     var iDEditPath = config.iD + 'map=' + zoom + '/' + center.lng + '/' + center.lat;
//
//     if (store.get('editor') && store.get('editor') === 'josm') {
//       // JOSM query string settings. Documentation:
//       // http://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl
//       var bottom = bounds._southWest.lat - 0.0005;
//       var left = bounds._southWest.lng - 0.0005;
//       var top = bounds._northEast.lat + 0.0005;
//       var right = bounds._northEast.lng + 0.0005;
//
//       // Select an item in JOSM
//       var select;
//       if (state.value.node_id) {
//         select = 'node' + state.value.node_id;
//       } else if (state.value.node_id) {
//         select = 'way' + state.value.way_id;
//       }
//
//       // Try JOSM first
//       xhr({
//         uri: config.josm + qs.stringify({
//           left: left,
//           right: right,
//           top: top,
//           bottom: bottom,
//           select: select
//         })
//       }, function(err, res) {
//         // Fallback to iD
//         if (err) {
//           _this.setState({
//             iDEdit: true,
//             iDSrcAttribute: iDEditPath
//           });
//         }
//       });
//     } else {
//       // Default is the iD editor
//       _this.setState({
//         iDEdit: true,
//         iDSrcAttribute: iDEditPath
//       });
//     }
//   },
//
//   iDEditDone: function() {
//     // Set editor state as complete and trigger the done action
//     this.setState({ iDEdit: false });
//     actions.taskData(this.props.params.task);
//   },
//
//   geolocate: function(center) {
//     geocoder.reverseQuery([center.lng, center.lat], function(err, res) {
//       if (res && res.features && res.features[0] && res.features[0].context) {
//         var place = res.features[0].context.reduce(function(memo, context) {
//           var id = context.id.split('.')[0];
//           if (id === 'place' || id === 'region' || id === 'country') memo.push(context.text);
//           return memo;
//         }, []);
//         actions.geolocated(place.join(', '));
//       }
//     });
//   },
//
//   render: function() {
//     var iDEditor = '';
//     if (this.state.iDEdit) {
//       iDEditor = (
//         <div>
//           <iframe src={this.state.iDSrcAttribute} frameBorder='0' className='ideditor'></iframe>
//           <button onClick={this.iDEditDone} className='ideditor-done z10000 button rcon next round animate pad1y pad2x strong'>Next task</button>
//         </div>
//       );
//     }
//
//     return (
//       <div ref={node => this.mapContainer = node} className='mode active map fill-navy-dark'>
//         <EditBar />
//         {iDEditor}
//       </div>
//     );
//   }
// });
//
// export default withRouter(Task);