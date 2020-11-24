# Public transit simulator

## Backend
The backend service is used to make a request to the google api

### Gaining access to Google API
1. Go to [link](https://developers.google.com/maps/documentation/directions/start)
2. On top right corner, there is a button **Get a key**
3. Update the config/default.js file with the api key

### Running the service
1. cd to the Backend directory
2. Run the command `npm install`
3. Run `npm start`

* Running `sudo build.sh` in project root will also install packages for backend.
* You can also start backend by running `runBackend.sh` in project root.

#### Sample Postman request:
```
curl -X POST \
  http://localhost:8000/getTravelTime \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e8416cdf-1733-4700-9f49-8382b42dcfd7' \
  -d '{
	"origin": "1020 N Quincy ST, Arlington, VA 22201",
	"destination": "9720 57 Avenue, Corona NY 11368"
}'
```
## Frontend
The frontend is an angular5 project

### Building Project

run `sudo build.sh` from project root

### Running Project

1. run `runFrontend.sh` from project root
2. Navigate to 'https://localhost:4200' in your browser
