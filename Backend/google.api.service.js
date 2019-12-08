'use strict';

const request = require('request-promise');
const googleMaps = require('@google/maps');
const config = require('config');

const googleMapsClient = googleMaps.createClient({
  key: config.get('googleApiToken'),
  Promise: Promise
});

module.exports.getTravelTime = req => {
  // console.log(req);
  const origin = req.origin;
  const destination = req.destination;
  // console.log(origin);
  // console.log(destination);
  return googleMapsClient
    .directions({ origin, destination })
    .asPromise()
    .then(response =>
      Promise.resolve(response.json.routes[0].legs[0].duration.text)
    )
    .catch(error => Promise.reject(error));
};
