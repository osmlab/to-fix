import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { featureCollection } from '@turf/helpers';
import centroid from '@turf/centroid';

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
      const bounds = map.getBounds();

      const bottom = bounds.getSouthWest().lat - 0.0005;
      const left = bounds.getSouthWest().lng - 0.0005;
      const top = bounds.getNorthEast().lat - 0.0005;
      const right = bounds.getNorthEast().lng - 0.0005;

      const query = { left, right, top, bottom };
      const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      fetch(`${JOSM_RC_URL}?${params}`)
        .catch(() => this.props.openErrorModal('Could not connect to JOSM remote control.'));
    }

    if (editor === 'id') {
      const {lng, lat} = map.getCenter();
      const zoom = map.getZoom();

      const iDEditPath = `${ID_URL}/#map=${zoom}/${lng}/${lat}`;

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
      user: user || '',
      editor,
    };

    fetchRandomItem({ idtask: currentTaskId, payload })
      .then(() => this.setState({ geolocation: null }));
  }

  geolocate = (center) => {
    const [lng, lat] = center;
    const addressRegex = /address./;

    fetch(`${MAPBOX_GEOCODER_URL}/mapbox.places/${lng},${lat}.json?types=address&access_token=${MAPBOX_ACCESS_TOKEN}`)
      .then(data => data.json())
      .then(json => (json.features.length && json.features.find(f => addressRegex.test(f.id)).place_name) || '')
      .then(geolocation => this.setState({ geolocation }));
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
        'fill-color': '#dc322f',
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
      const center = centroid(currentItem).geometry.coordinates;
      this.geolocate(center);
      this.jumpTo({ center });
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

    const iDEditor = (
      <div>
        <iframe src={iDEditPath} frameBorder='0' className='ideditor'></iframe>
        <button onClick={this.iDEditDone} className='ideditor-done z10000 button rcon next round animate pad1y pad2x strong'>Next task</button>
      </div>
    );

    return (
      <div ref={node => this.mapContainer = node} className='mode active map fill-navy-dark contain'>
        { currentItemId && editBar }
        { iDEdit && iDEditor }
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
