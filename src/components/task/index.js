import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { centroid, featureCollection } from 'turf';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAPBOX_ACCESS_TOKEN } from '../../config';
import { fetchRandomItem } from '../../actions';
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
  }

  fetchData() {
    const { user, editor, currentTaskId, fetchRandomItem } = this.props;
    const payload = {
      user,
      editor,
    };
    return fetchRandomItem({ idtask: currentTaskId, payload });
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

  setupLayers(id) {
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

  jumpTo(options) {
    const { map } = this.state;
    map.jumpTo(options);
  }

  componentDidMount() {
    const { currentTaskId } = this.props;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 14,
      center: [-74.50, 40],
    });

    map.once('load', () => {
      this.fetchData().then(() => this.setState({ map }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.map !== this.state.map
    );
  }

  componentDidUpdate(nextProps, nextState) {
    console.log("PROPS", this.props, nextProps);
    console.log("STATE", this.state, nextState);

    if (nextState.map !== this.state.map) {
      const { currentTaskId } = nextProps;
      this.addSource(currentTaskId);
      this.setupLayers(currentTaskId);

      const { currentItemId, currentItem } = nextProps;
      this.updateSource(currentTaskId, currentItem);
      this.jumpTo({
        center: centroid(currentItem).geometry.coordinates,
      });
    }

    if (nextProps.currentItemId !== this.props.currentItemId) {
      const { currentTaskId, currentItem } = nextProps;
      this.updateSource(currentTaskId, currentItem);
      this.jumpTo({
        center: centroid(currentItem).geometry.coordinates,
      });
    }
  }

  componentWillUnmount() {
    const { map } = this.state;
    if (map) map.remove();
  }

  render() {
    return (
      <div ref={node => this.mapContainer = node} className='mode active map fill-navy-dark'>
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
  { fetchRandomItem }
)(Task));

export default Task;
