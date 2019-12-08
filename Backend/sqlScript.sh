# Create DB Tables

export PGPASSWORD=cs6310 

psql -h localhost -d postgres -U postgres -c 'CREATE TABLE VehicleTable(id integer, routeId integer, nextStopId integer, currentStopId integer, atStop boolean, capacity integer, minutesTillArrival integer, minutesTillDeparting integer, traverseStopsUp boolean, riderIds varchar, transportationType integer);'

psql -h localhost -d postgres -U postgres -c 'CREATE TABLE StopTable(id integer, stopName varchar, xCoordinate decimal, yCoordinate decimal, riderCapacity integer, riderIds varchar, transportationType integer)'

psql -h localhost -d postgres -U postgres -c 'CREATE TABLE RouteTable(id integer, routeName varchar, isCircular boolean,  stops varchar, transportationType integer)'

psql -h localhost -d postgres -U postgres -c 'CREATE TABLE RiderTable(id integer, routeId integer, stopArrivalDateTime timestamp, onVehicleId integer, atStopId integer, beginningStopId integer, endStopId integer)'

# Create and grant user permissions
psql -h localhost -d postgres -U postgres -c "CREATE USER student WITH PASSWORD 'cs6310';"
psql -h localhost -d postgres -U postgres -c "GRANT ALL PRIVILEGES ON VehicleTable to student;"
psql -h localhost -d postgres -U postgres -c "GRANT ALL PRIVILEGES ON StopTable to student;"
psql -h localhost -d postgres -U postgres -c "GRANT ALL PRIVILEGES ON RouteTable to student;"
psql -h localhost -d postgres -U postgres -c "GRANT ALL PRIVILEGES ON RiderTable to student;"


