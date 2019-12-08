'use strict';

const pg = require('pg');
const _ = require('lodash');

module.exports.addRider = (req, client) => {
  const statement =
    'INSERT INTO ridertable(id, routeId, stopArrivalDateTime, onVehicleId, atStopId, beginningStopId, endStopId) VALUES($1, $2, $3, $4, $5, $6, $7)';
  const args = [
    req.id,
    req.routeId,
    req.stopArrivalDateTime,
    req.onVehicleId,
    req.atStopId,
    req.beginningStopId,
    req.endStopId
  ];
  const query = {
    text: statement,
    values: args
  };
  return queryDatabase(query, client);
};

module.exports.addVehicle = (req, client) => {
  const statement =
    'INSERT INTO vehicletable(id, routeId, nextStopId, currentStopId, atStop, capacity, minutesTillArrival, minutesTillDeparting, traverseStopsUp, riderIds, transportationType) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
  const args = [
    req.id,
    req.routeId,
    req.nextStopId,
    req.currentStopId,
    req.atStop,
    req.capacity,
    req.minutesTillArrival,
    5, // minutesTillDeparting: 5 min by default
    req.traverseStopsUp,
    _.filter(req.riderIds).join(','),
    req.type
  ];
  const query = {
    text: statement,
    values: args
  };
  return queryDatabase(query, client);
};

module.exports.addStop = (req, client) => {
  const statement =
    'INSERT INTO stoptable(id, stopName, xCoordinate, yCoordinate, riderCapacity, riderIds, transportationType) VALUES($1, $2, $3, $4, $5, $6, $7)';
  const args = [
    req.id,
    req.name,
    req.xCoordinate,
    req.yCoordinate,
    req.riderCapacity,
    _.filter(req.riderIds).join(','),
    req.type
  ];
  const query = {
    text: statement,
    values: args
  };
  return queryDatabase(query, client);
};

module.exports.addRoute = (req, client) => {
  const statement =
    'INSERT INTO routetable(id, routeName, isCircular, stops, transportationType) VALUES($1, $2, $3, $4, $5)';
  const args = [
    req.id,
    req.name,
    req.isCircular,
    _.filter(req.stopIds).join(','),
    req.type
  ];
  const query = {
    text: statement,
    values: args
  };
  return queryDatabase(query, client);
};

const tableName = {
  route: 'routetable',
  stop: 'stoptable',
  vehicle: 'vehicletable',
  rider: 'ridertable'
};

module.exports.selectAll = (tableToQuery, client) => {
  const query = {
    text: `SELECT * FROM ${tableToQuery} ORDER BY ID;`
  };

  if (tableToQuery === 'routetable') {
    return client
      .query(query)
      .then(res => {
        _.each(res.rows, function(item) {
          (item.type = item.transportationtype),
            (item.name = item.routename),
            (item.stopids = !item.stops
              ? []
              : item.stops.split(',').map(x => parseInt(x, 10)));
        });
        return Promise.resolve(res.rows);
      })
      .catch(error => Promise.reject(error));
  }

  if (tableToQuery === 'stoptable') {
    return client
      .query(query)
      .then(res => {
        _.each(res.rows, function(item) {
          (item.type = item.transportationtype),
            (item.name = item.stopname),
            (item.riderids = !item.riderids
              ? []
              : item.riderids.split(',').map(x => parseInt(x, 10)));
        });
        return Promise.resolve(res.rows);
      })
      .catch(error => Promise.reject(error));
  }

  if (tableToQuery === 'vehicletable') {
    return client
      .query(query)
      .then(res => {
        _.each(res.rows, function(item) {
          (item.type = item.transportationtype),
            (item.riderids = !item.riderids
              ? []
              : item.riderids.split(',').map(x => parseInt(x, 10)));
        });
        return Promise.resolve(res.rows);
      })
      .catch(error => Promise.reject(error));
  }

  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.deleteAll = client => {
  const query = {
    text:
      'delete from routetable; delete from vehicletable; delete from stoptable; delete from riderTable;'
  };
  return client
    .query(query)
    .then(res => Promise.resolve('deleted'))
    .catch(error => Promise.reject(error));
};

module.exports.selectAllRoutes = (routeId, client) => {
  const idRoute = routeId;
  const query = {
    text: 'SELECT * FROM routetable WHERE id = $1',
    values: [routeId]
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.updateVehicle = (
  client,
  time,
  id,
  currentStopId,
  updateGoingDown,
  nextStopId
) => {
  const query = {
    text: `UPDATE vehicletable SET minutesTillArrival=$1,currentStopId = $2, nextStopId = $3,traverseStopsUp = $4  WHERE id = $5;`,
    values: [time, id, currentStopId, updateGoingDown, nextStopId]
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.updateRidersOnVehicle = (newIds, id, client) => {
  const query = {
    text: `UPDATE vehicletable SET riderIds=$1  WHERE id = $2;`,
    values: [newIds, id]
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.selectBoardingRiders = (vehicleId, client) => {
  const query = {
    text:
      'select rt.id from riderTable rt inner join vehicletable vt on rt.routeId = vt.routeid where rt.atStopId = vt.currentStopId and rt.onvehicleId is null and vt.id = $1 order by rt.stoparrivaldatetime;',
    values: [vehicleId]
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.selectUnboardingRiders = (vehicleId, client) => {
  const query = {
    text:
      'select rt.id from riderTable rt inner join vehicletable vt on rt.onvehicleId = vt.id where rt.endstopId = vt.currentStopId and vt.id = $1;',
    values: [vehicleId]
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.updateRidersUnBoardingVehicle = (
  leavingRiders,
  client,
  vehicleId
) => {
  if (leavingRiders.length === 0) {
    return Promise.resolve();
  }
  let newString = '';
  let x = 0;
  for (x = x; x < leavingRiders.length; x++) {
    if (x == 0) {
      newString = `id = ${leavingRiders[x]}`;
    } else {
      newString += ` OR id = ${leavingRiders[x]}`;
    }
  }

  const query = {
    text: `update riderTable set onvehicleid= -1 where ${newString};`
  };

  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.updateRidersBoardingVehicle = (
  boardingRiders,
  client,
  vehicleId
) => {
  if (boardingRiders.length === 0) {
    return Promise.resolve();
  }

  //id= 7 OR id = 8
  let newString = '';
  let x = 0;
  for (x = x; x < boardingRiders.length; x++) {
    if (x == 0) {
      newString = `id = ${boardingRiders[x]}`;
    } else {
      newString += ` OR id = ${boardingRiders[x]}`;
    }
  }

  const query = {
    text: `update riderTable set onvehicleid= ${vehicleId} where ${newString};`
  };

  return client
    .query(query)
    .then(res => Promise.resolve(res.rows))
    .catch(error => Promise.reject(error));
};

module.exports.getMax = (tableToQuery, client) => {
  const query = {
    text: `SELECT coalesce(max(id),0) as ID FROM ${tableToQuery};`
  };
  return client
    .query(query)
    .then(res => Promise.resolve(res.rows[0]))
    .catch(error => Promise.reject(error));
};

let csvToJson = require('convert-csv-to-json');

function getRndInt(_min, _max) {
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

function getStopInformationAsArr(_fileName) {
  let json = csvToJson
    .fieldDelimiter(',')
    .formatValueByType()
    .getJsonFromCsv(_fileName);
  let jsonToPutInDb = [];

  for (let i = 0; i < json.length; i++) {
    let _jsonToPutInDb = {};

    _jsonToPutInDb.type = getRndInt(
      1,
      2
    ); /* Random whether stop is train or bus)*/
    _jsonToPutInDb.name = json[i].stop_name;
    _jsonToPutInDb.xCoordinate =
      json[i].stop_lat; /* These are in db as integers... */
    _jsonToPutInDb.yCoordinate =
      json[i].stop_lon; /* These are in db as integers... */
    _jsonToPutInDb.riderCapacity = getRndInt(
      50,
      100
    ); /* Range of people at station */
    _jsonToPutInDb.id = json[i].stop_id;

    jsonToPutInDb.push(_jsonToPutInDb);
  }

  return jsonToPutInDb;
}

function insertMartaStopsToDbGuts(_jsonToPutInDb, _client) {
  for (let i = 0; i < _jsonToPutInDb.length; i++) {
    module.exports.addStop(_jsonToPutInDb[i], _client);
  }
  return Promise.resolve(0);
}

module.exports.insertMartaStopsToDb = (_fileName, _client) => {
  const jsonToPutInDb = getStopInformationAsArr(_fileName);
  return insertMartaStopsToDbGuts(jsonToPutInDb, _client)
    .then(res => Promise.resolve('SUCCESS'))
    .catch(error => Promise.reject(error));
};

function queryDatabase(query, client) {
  return client
    .query(query)
    .then(res => Promise.resolve('SUCCESS'))
    .catch(error => {
      //console.log(error);
      return Promise.reject(error);
    });
}
