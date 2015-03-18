'use strict';

var osmAuth = require('osm-auth');
var config = require('../config');

// osmAuth handles authentication with OpenStreetMap
module.exports = osmAuth({
  oauth_consumer_key: config.oauthKey,
  oauth_secret: config.oauthSecret,
  auto: false,
  landing: 'oauth-complete.html'
});
