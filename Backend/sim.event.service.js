'use strict';

const databaseService = require('./databaseService');
const googleService = require('./google.api.service');
const _ = require('lodash');

let simDate = new Date();
let simulatedTime = 0;
let client;
let minutesSim;

module.exports.simEvent = (minutes, currentClient) => {
  simulatedTime += minutes;
  simDate.setMinutes(simDate.getMinutes() + minutes);
  client = currentClient;
  minutesSim = minutes;
  return databaseService.selectAll('vehicletable', client).then(allVehicles => {
    const allVehiclesData = _.map(allVehicles, vehicle => ({
      id: vehicle.id,
      nextStopId: vehicle.nextstopid,
      currentStopId: vehicle.currentstopid,
      minutesTillArrival: vehicle.minutestillarrival,
      routeId: vehicle.routeid,
      goingDown: vehicle.traversestopsup,
      riderIds: vehicle.riderids,
      capacity: vehicle.capacity
    }));

    return _.each(allVehiclesData, vehicle => {
      if (vehicle.minutesTillArrival > minutes) {
        return databaseService.updateVehicle(
          client,
          vehicle.minutesTillArrival - minutesSim,
          vehicle.currentStopId,
          vehicle.nextStopId,
          vehicle.goingDown,
          vehicle.id
        );
      } else {
        return databaseService
          .selectAllRoutes(vehicle.routeId, client)
          .then(route => {
            return getNextStop(route, vehicle)
              .then(() =>
                databaseService.selectBoardingRiders(vehicle.id, client)
              )
              .then(boardingRiders => {
                return databaseService
                  .selectUnboardingRiders(vehicle.id, client)
                  .then(leavingRiders => {
                    return updateCapacity(
                      vehicle,
                      _.map(boardingRiders, 'id'),
                      _.map(leavingRiders, 'id')
                    );
                  });
              });
          });
      }
    });
  });
};

function updateCapacity(vehicle, boardingRiders, leavingRiders) {
  let currentRiderIds = [];
  if (
    vehicle.riderIds &&
    !isNaN(vehicle.riderIds[0]) &&
    vehicle.riderIds.length > 0
  ) {
    currentRiderIds = vehicle.riderIds;
  }

  const currentRidersSize = currentRiderIds.length;
  const boardingRidersSize = boardingRiders.length;
  const leavingRidersSize = leavingRiders.length;
  const updatedBusWithLeavingCustomers = _.pullAll(
    currentRiderIds,
    leavingRiders
  );
  const spotsAvaliable =
    vehicle.capacity - updatedBusWithLeavingCustomers.length;
  let newIds;
  if (spotsAvaliable > boardingRidersSize) {
    newIds = _.merge(updatedBusWithLeavingCustomers, boardingRiders);
  } else {
    const ridersOnboarding = boardingRiders.slice(0, spotsAvaliable);
    newIds = _.merge(updatedBusWithLeavingCustomers, ridersOnboarding);
  }

  return databaseService
    .updateRidersOnVehicle(newIds.join(','), vehicle.id, client)
    .then(() =>
      databaseService.updateRidersUnBoardingVehicle(
        leavingRiders,
        client,
        vehicle.id
      )
    )
    .then(() =>
      databaseService.updateRidersBoardingVehicle(
        boardingRiders,
        client,
        vehicle.id
      )
    );
}

function getNextStop(route, currentVehicle) {
  const stops = route[0].stops.split(',').map(x => parseInt(x, 10));
  const isCircular = route[0].iscircular;
  const lengthStops = stops.length;

  const indexOfStop = stops.indexOf(currentVehicle.nextStopId);
  let newCurrentStop;
  let newNextStop;
  let updateGoingDown = false;
  if (lengthStops === indexOfStop + 1 && isCircular) {
    newCurrentStop = currentVehicle.nextStopId;
    newNextStop = stops[0];
  } else if (
    !isCircular &&
    (lengthStops === indexOfStop + 1 && !currentVehicle.goingDown)
  ) {
    updateGoingDown = true;
    const temp = currentVehicle.currentStopId;
    newCurrentStop = currentVehicle.nextStopId;
    newNextStop = temp;
  } else if (!isCircular && (0 === indexOfStop && currentVehicle.goingDown)) {
    const temp = currentVehicle.currentStopId;
    newCurrentStop = currentVehicle.nextStopId;
    newNextStop = temp;
  } else {
    if (currentVehicle.goingDown) {
      newCurrentStop = currentVehicle.nextStopId;
      newNextStop = stops[indexOfStop - 1];
    } else {
      newCurrentStop = currentVehicle.nextStopId;
      newNextStop = stops[indexOfStop + 1];
    }
  }
  let minutesRemaining = minutesSim - currentVehicle.minutesTillArrival;
  return getTravelTimeToNextStop(
    currentVehicle,
    newCurrentStop,
    newNextStop
  ).then(timeString => {
    const time = parseInt(timeString.substring(0, 2));
    if (time > minutesRemaining) {
      return databaseService.updateVehicle(
        client,
        time - minutesRemaining,
        newCurrentStop,
        newNextStop,
        updateGoingDown,
        currentVehicle.id
      );
    } else {
      return databaseService.updateVehicle(
        client,
        0,
        newCurrentStop,
        newNextStop,
        updateGoingDown,
        currentVehicle.id
      );
    }
  });
}

module.exports.getCurrentTime = currentClient => {
  return Promise.resolve({ date: simDate.toJSON() });
};

module.exports.setCurrentTime = (newDate, currentClient) => {
  if (!newDate) {
    Promise.reject('Invalid Date');
  }

  let temp = new Date(newDate.value);
  if (!isNaN(temp.getTime())) {
    simDate = temp;
    return Promise.resolve(simDate.toJSON());
  }
  return Promise.reject('Invalid Date');
};

function getTravelTimeToNextStop(vehicleObject, currentStop, nextStop) {
  // console.log(vehicleObject);
  const id = vehicleObject.id;
  const nextStopId = currentStop;
  const upcomingStopId = nextStop;

  return databaseService.selectAll('stoptable', client).then(response => {
    const nextStop = _.filter(response, function(o) {
      return o.id === nextStopId;
    });
    const upcomingStop = _.filter(response, function(o) {
      return o.id === upcomingStopId;
    });
    const origin = `${upcomingStop[0].xcoordinate}, ${
      upcomingStop[0].ycoordinate
    }`;
    const destination = `${nextStop[0].xcoordinate}, ${
      nextStop[0].ycoordinate
    }`;
    const req = { origin: origin, destination: destination };
    return googleService.getTravelTime(req).then(time => Promise.resolve(time));
  });
}
