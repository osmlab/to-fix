import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { featureCollection } from '@turf/helpers';
import centroid from '@turf/centroid';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import EditBar from './EditBar';

import { MAPBOX_ACCESS_TOKEN, JOSM, iD } from '../../config';
import { fetchRandomItem, reverseGeocode } from '../../actions';
import {
  getUsername,
  getEditorSetting,
  getCurrentItem,
  getCurrentItemId,
} from '../../reducers';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

class Task extends Component {
  state = {
    map: null,
    geolocation: '',
    iDEdit: false,
    iDEditPath: '',
  }

  editTask = () => {
    const { map } = this.state;
    const { editor } = this.props;

    if (editor === 'josm') {
      const bounds = map.getBounds();

      const bottom = bounds.getSouthWest().lat - 0.0005;
      const left = bounds.getSouthWest().lng - 0.0005;
      const top = bounds.getNorthEast().lat - 0.0005;
      const right = bounds.getNorthEast().lng - 0.0005;

      const query = { left, right, top, bottom };
      const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      fetch(`${JOSM}?${params}`);
    }

    if (editor === 'id') {
      const {lng, lat} = map.getCenter();
      const zoom = map.getZoom();

      const iDEditPath = `${iD}/#map=${zoom}/${lng}/${lat}`;

      this.setState({
        iDEdit: true,
        iDEditPath,
      });
    }
  }

  iDEditDone = () => {
    this.setState({
      iDEdit: false,
      iDEditPath: '',
    });
    this.fetchNextItem();
  }

  fetchNextItem = () => {
    const { user, editor, currentTaskId, fetchRandomItem } = this.props;
    const payload = {
      user: user || 'anonymous',
      editor,
    };
    this.setState({ geolocation: null });
    return fetchRandomItem({ idtask: currentTaskId, payload });
  }

  geolocate = (center) => {
    const [lng, lat] = center;
    const { reverseGeocode } = this.props;
    reverseGeocode({lng, lat})
      .then(({ response }) => this.setState({ geolocation: response }));
  }

  addSource(id) {
    const { map } = this.state;
    map.addSource(id, {
      type: 'geojson',
      data: featureCollection([]),
    });
  }

  updateSource(id, ...features) {
    const { map } = this.state;
    const geojson = featureCollection(features);
    map.getSource(id).setData(geojson);
  }

  removeSource(id) {
    const { map } = this.state;
    map.removeSource(id);
  }

  addLayers(id) {
    const { map } = this.state;

    map.addLayer({
      id: `${id}-circle`,
      type: 'circle',
      source: id,
      paint: {
        'circle-radius': 5,
        'circle-color': 'hsl(112, 100%, 50%)',
      },
    });

    map.addLayer({
      id: `${id}-line`,
      type: 'line',
      source: id,
      paint: {
        'line-width': 5,
        'line-color': 'hsl(112, 100%, 50%)',
      },
    });

    map.addLayer({
      id: `${id}-fill`,
      type: 'fill',
      source: id,
      paint: {
        'fill-color': 'hsl(112, 100%, 50%)',
      },
    });
  }

  removeLayers(id) {
    const { map } = this.state;
    map.removeLayer(`${id}-circle`);
    map.removeLayer(`${id}-line`);
    map.removeLayer(`${id}-fill`);
  }

  jumpTo(options) {
    const { map } = this.state;
    map.jumpTo(options);
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 14,
      center: [-74.50, 40],
    });

    map.once('load', () => this.setState({ map }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.map !== this.state.map ||
      nextState.geolocation !== this.state.geolocation ||
      nextProps.currentItemId !== this.state.currentItemId ||
      nextProps.currentTaskId !== this.state.currentTaskId
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.map !== this.state.map) {
      const { currentTaskId } = this.props;
      this.addSource(currentTaskId);
      this.addLayers(currentTaskId);
      this.fetchNextItem();
      return;
    }

    if (this.state.map && prevProps.currentTaskId !== this.props.currentTaskId) {
      this.removeSource(prevProps.currentTaskId);
      this.removeLayers(prevProps.currentTaskId);
      this.addSource(this.props.currentTaskId);
      this.addLayers(this.props.currentTaskId);
      this.fetchNextItem();
      return;
    }

    if (this.state.map && prevProps.currentItemId !== this.props.currentItemId) {
      const { currentTaskId, currentItem } = this.props;
      this.updateSource(currentTaskId, currentItem);
      const center = centroid(currentItem).geometry.coordinates;
      this.geolocate(center);
      this.jumpTo({ center });
      return;
    }
  }

  componentWillUnmount() {
    const { map } = this.state;
    if (map) map.remove();
  }

  render() {
    const { geolocation, iDEdit, iDEditPath } = this.state;

    const iDEditor = (
      <div>
        <iframe src={iDEditPath} frameBorder='0' className='ideditor'></iframe>
        <button onClick={this.iDEditDone} className='ideditor-done z10000 button rcon next round animate pad1y pad2x strong'>Next task</button>
      </div>
    );

    return (
      <div ref={node => this.mapContainer = node} className='mode active map fill-navy-dark'>
        <EditBar onEditTask={this.editTask} onUpdate={this.fetchNextItem} geolocation={geolocation} />
        { iDEdit && iDEditor }
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  user: getUsername(state),
  editor: getEditorSetting(state),
  currentItem: getCurrentItem(state),
  currentItemId: getCurrentItemId(state),
});

Task = withRouter(connect(
  mapStateToProps,
  { fetchRandomItem, reverseGeocode }
)(Task));

export default Task;
