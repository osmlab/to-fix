import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { featureCollection } from '@turf/helpers';
import turfCentroid from '@turf/centroid';
import turfBbox from '@turf/bbox';
import turfBboxPolygon from '@turf/bbox-polygon';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import EditBar from './edit_bar';

import { MAPBOX_ACCESS_TOKEN, MAPBOX_GEOCODER_URL, JOSM_RC_URL, ID_URL } from '../../config';
import ItemsActionCreators from '../../stores/items_action_creators';
import ModalsActionCreators from '../../stores/modals_action_creators';
import ItemsSelectors from '../../stores/items_selectors';
import UserSelectors from '../../stores/user_selectors';
import SettingsSelectors from '../../stores/settings_selectors';
import TasksSelectors from '../../stores/tasks_selectors';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTaskType: TasksSelectors.getCurrentTaskType(state),
  user: UserSelectors.getUsername(state),
  editor: SettingsSelectors.getEditorSetting(state),
  sidebar: SettingsSelectors.getSidebarSetting(state),
  currentItem: ItemsSelectors.getCurrentItem(state),
  currentItemId: ItemsSelectors.getCurrentItemId(state),
});

const mapDispatchToProps = {
  fetchRandomItem: ItemsActionCreators.fetchRandomItem,
  openErrorModal: ModalsActionCreators.openErrorModal,
};

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
      const { currentItem } = this.props;
      const { _osmType, _osmId } = currentItem.properties;
      const objects = `${_osmType.substr(0, 1)}${_osmId}`;

      const query = {
        new_layer: true,
        objects,
        relation_members: true,
      };
      const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      fetch(`${JOSM_RC_URL}/load_object?${params}`)
        .catch(() => this.props.openErrorModal('Could not connect to JOSM remote control.'));
    }

    if (editor === 'id') {
      const {lng, lat} = map.getCenter();
      const zoom = map.getZoom();

      const iDEditPath = `${ID_URL}/#map=${zoom}/${lat}/${lng}`;

      this.setState({
        iDEdit: true,
        iDEditPath,
      });
    }
  }

  reset = () => {
    this.setState({
      iDEdit: false,
      iDEditPath: '',
      geolocation: '',
    });
  }

  fetchNextItem = () => {
    const { user, editor, currentTaskId, currentTaskType, fetchRandomItem } = this.props;
    const payload = {
      user: user || '',
      editor,
    };

    fetchRandomItem({ taskId: currentTaskId, taskType: currentTaskType, payload })
      .then(this.reset);
  }

  geolocate = (center) => {
    const [lng, lat] = center;
    const placeRegex = /place./;

    fetch(`${MAPBOX_GEOCODER_URL}/mapbox.places/${lng},${lat}.json?types=place&access_token=${MAPBOX_ACCESS_TOKEN}`)
      .then(data => data.json())
      .then(json => (json.features.length && json.features.find(f => placeRegex.test(f.id)).place_name) || '')
      .then(geolocation => this.setState({ geolocation }));
  }

  addSource(id) {
    const { map } = this.state;
    map.addSource(id, {
      type: 'geojson',
      data: featureCollection([]),
    });
    map.addSource(`${id}-bbox`, {
      type: 'geojson',
      data: featureCollection([]),
    });
  }

  updateSource(id, feature) {
    const { map } = this.state;
    const flattenedFeatures = this.flattenRelations(feature);
    const geojson = featureCollection(flattenedFeatures);
    const bbox = this.getBoundingBox(geojson);
    map.getSource(id).setData(geojson);
    map.getSource(`${id}-bbox`).setData(bbox);
  }

  removeSource(id) {
    const { map } = this.state;
    map.removeSource(id);
    map.removeSource(`${id}-bbox`);
  }

  flattenRelations(feature) {
    const relations = feature.properties.relations || [];
    return [feature].concat(relations);
  }

  getBoundingBox(geojson) {
    const [ minX, minY, maxX, maxY ] = turfBbox(geojson);
    const padX = Math.max((maxX - minX) / 5, 0.0001);
    const padY = Math.max((maxY - minY) / 5, 0.0001);
    const bboxWithPadding = [
      minX - padX,
      minY - padY,
      maxX + padX,
      maxY + padY,
    ];
    const bboxPolygon = turfBboxPolygon(bboxWithPadding);
    return featureCollection([bboxPolygon]);
  }

  addLayers(id) {
    const { map } = this.state;

    map.addLayer({
      id: `${id}-bbox`,
      type: 'line',
      source: `${id}-bbox`,
      paint: {
        'line-width': 3,
        'line-color': '#b58900',
      },
    });

    map.addLayer({
      id: `${id}-circle`,
      type: 'circle',
      source: id,
      paint: {
        'circle-radius': 5,
        'circle-color': '#dc322f',
      },
    });

    map.addLayer({
      id: `${id}-line`,
      type: 'line',
      source: id,
      paint: {
        'line-width': 5,
        'line-color': '#dc322f',
      },
    });

    map.addLayer({
      id: `${id}-fill`,
      type: 'fill',
      source: id,
      paint: {
        'fill-opacity': 0,
        'fill-outline-color': '#dc322f',
      },
    });
  }

  removeLayers(id) {
    const { map } = this.state;
    map.removeLayer(`${id}-circle`);
    map.removeLayer(`${id}-line`);
    map.removeLayer(`${id}-fill`);
    map.removeLayer(`${id}-bbox`);
  }

  fitBounds(bounds) {
    const { map } = this.state;
    map.fitBounds(bounds, { linear: true, padding: 200 });
  }

  resize() {
    const { map } = this.state;
    // Needs a slight delay because of the sidebar animation
    window.setTimeout(() => map.resize(), 120);
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 18,
      center: [-74.50, 40],
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.once('load', () => this.setState({ map }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.map !== this.state.map ||
      nextState.geolocation !== this.state.geolocation ||
      nextState.iDEdit !== this.state.iDEdit ||
      nextProps.currentTaskId !== this.props.currentTaskId ||
      nextProps.currentItemId !== this.props.currentItemId ||
      nextProps.sidebar !== this.props.sidebar
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

      const center = turfCentroid(currentItem).geometry.coordinates;
      this.geolocate(center);

      const bboxPolygon = this.state.map.getSource(`${currentTaskId}-bbox`)._data.features[0];
      const bboxCoordiantes = bboxPolygon.geometry.coordinates[0];
      this.fitBounds([bboxCoordiantes[0], bboxCoordiantes[2]]);
      return;
    }

    if (this.state.map && prevProps.sidebar !== this.props.sidebar) {
      this.resize();
    }
  }

  componentWillUnmount() {
    const { map } = this.state;
    if (map) map.remove();
  }

  render() {
    const { geolocation, iDEdit, iDEditPath } = this.state;
    const { currentItemId } = this.props;

    const editBar = (
      <EditBar
        onTaskEdit={this.editTask}
        onUpdate={this.fetchNextItem}
        geolocation={geolocation} />
    );

    const iDContainerClass = iDEdit ? '' : 'hidden';
    const iDEditor = (
      <div className={iDContainerClass}>
        <iframe src={iDEditPath} frameBorder='0' className='ideditor'></iframe>
      </div>
    );

    return (
      <div ref={node => this.mapContainer = node} className='mode active map fill-navy-dark contain'>
        { currentItemId && editBar }
        { iDEditor }
      </div>
    );
  }
}

Task.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  user: PropTypes.string,
  editor: PropTypes.string.isRequired,
  sidebar: PropTypes.bool.isRequired,
  currentItem: PropTypes.object,
  currentItemId: PropTypes.string,
  fetchRandomItem: PropTypes.func.isRequired,
  openErrorModal: PropTypes.func.isRequired,
};

Task = connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);

export default Task;
