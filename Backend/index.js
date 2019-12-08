'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const googleApiService = require('./google.api.service');
const simEventService = require('./sim.event.service');
const databaseService = require('./databaseService');
const createDatabaseConnection = require('./createDatabaseConnection');
const cors = require('cors');
const client = createDatabaseConnection.connect();
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());

app.route('/TravelTime').post((req, res) => {
  return googleApiService
    .getTravelTime(req.body)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/SimDate').post((req, res) => {
  return simEventService
    .setCurrentTime(req.body, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.status(400).send(error));
});

app.route('/SimDate').get((req, res) => {
  return simEventService
    .getCurrentTime(client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/SimStep/:minutes').post((req, res) => {
  let minutesSim = parseInt(req.params.minutes, 10);
  if (isNaN(minutesSim) || minutesSim <= 0) {
    // any other format should be discarded
    return res.status(400).send({ error: 'Invalid amount of minutes!' });
  }

  return simEventService
    .simEvent(minutesSim, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

//#region POST Create
app.route('/Riders').post((req, res) => {
  return databaseService
    .addRider(req.body, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/Vehicles').post((req, res) => {
  return databaseService
    .addVehicle(req.body, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/Stops').post((req, res) => {
  // console.log(req.body);
  return databaseService
    .addStop(req.body, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/Routes').post((req, res) => {
  return databaseService
    .addRoute(req.body, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

app.route('/addMartaStopData').post((req, res) => {
  const fileName = './google_marta/bus/stops.txt';
  return databaseService
    .insertMartaStopsToDb(fileName, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});
//#endregion

//#region GET All
app.route('/Vehicles').get((req, res) => {
  return selectAll('vehicletable', res);
});

app.route('/Stops').get((req, res) => {
  return selectAll('stoptable', res);
});

app.route('/Routes').get((req, res) => {
  return selectAll('routetable', res);
});

app.route('/Riders').get((req, res) => {
  return selectAll('ridertable', res);
});
//#endregion

app.route('/Reset').post((req, res) => {
  return databaseService
    .deleteAll(client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
});

//#region GET Max
app.route('/Vehicles/Max').get((req, res) => {
  return getMax('vehicletable', res);
});

app.route('/Stops/Max').get((req, res) => {
  return getMax('stoptable', res);
});

app.route('/Routes/Max').get((req, res) => {
  return getMax('routetable', res);
});

app.route('/Riders/Max').get((req, res) => {
  return getMax('ridertable', res);
});
//#endregion

//#region Helpers
function selectAll(table, res) {
  return databaseService
    .selectAll(table, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
}

function getMax(table, res) {
  return databaseService
    .getMax(table, client)
    .then(response => res.send(response).status(200))
    .catch(error => res.send(error).status(400));
}
//#endregion

app.listen(config.get('port'), () =>
  console.log(`Server started on port ${config.get('port')}`)
);
