import osmAuth from 'osm-auth';
import {
  oauthKey,
  oauthSecret,
} from '../config';

const auth = osmAuth({
  osm_consumer_key: oauthKey,
  osm_secret: oauthSecret,
  auto: false,
  landing: 'oauth-complete.html',
});

export const login = () => {
  return new Promise((resolve, reject) => {
    auth.authenticate((error, oauth) => {
      if (error) reject(error);
      getUserDetails().then(resolve, reject);
    });
  });
};

export const logout = () => auth.logout();

const parseUserDetails = (xml) => {
  const user = xml.getElementsByTagName('user')[0];
  return {
    osmid: user.getAttribute('id'),
    username: user.getAttribute('display_name'),
    avatar: user.getElementsByTagName('img')[0].getAttribute('href'),
  };
};

const getUserDetails = () => {
  return new Promise((resolve, reject) => {
    auth.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }, (error, xml) => {
      if (error) reject(error);

      const details = parseUserDetails(xml);
      resolve(details);
    });
  });
};
