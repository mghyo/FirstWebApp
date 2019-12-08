const config=require('config');
const { Client } = require('pg');


const client = new Client({
  user: config.get('database.user'),
  host: config.get('database.host'),
  database: config.get('database.name'),
  password: config.get('database.password'),
  port: config.get('database.port')
});

module.exports.connect = () => {
    client.connect();
    return client;
};



module.exports.disconnect = () => {
    client.end()
    return Promise.resolve("DISCONNECTED")
}
