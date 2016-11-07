import { MAPBOX_ACCESS_TOKEN, MAPBOX_GEOCODER_API } from '../config';
import { fetchJSON } from './utils';

export const reverseGeocode = ({ lng, lat }) => (
  fetchJSON(`${MAPBOX_GEOCODER_API}/mapbox.places/${lng},${lat}.json?types=address&access_token=${MAPBOX_ACCESS_TOKEN}`)
    .then(data => (data.features[0] && data.features[0].place_name) || '')
);
