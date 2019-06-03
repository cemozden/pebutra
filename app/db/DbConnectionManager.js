'use strict'
const mysql = require('mysql');
const configParser = require('../configparser/YAMLConfigParser');
const pebutraSettings = configParser.getPebutraSettings();

const pool = mysql.createPool({
    connectionLimit : 10,
    host : pebutraSettings.host,
    user : pebutraSettings.username,
    password: pebutraSettings.password,
    database : pebutraSettings.database
});

module.exports = {
    getConnectionInstance() {
      return pool.getConnection((err, connection) => {
          if (err) {
              connection.release();
              console.log('Error to connect to the database server.');
              return;
          }
        
          console.log(`Connected to the database server "${pebutraSettings.host}"`);
          return connection;
      });
    }
};